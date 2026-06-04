/**
 * Nattlig artikel-generering. Anropas av Vercel Cron (se vercel.json,
 * "0 3 * * *"). Plockar de 3 äldsta oanvända ämnena ur article_topics,
 * genererar en artikel per ämne via Claude Sonnet 4.6, hämtar en
 * omslagsbild från Unsplash och publicerar till Supabase (published_at=now).
 *
 * Kräver env: ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY,
 * NEXT_PUBLIC_SUPABASE_URL, UNSPLASH_ACCESS_KEY, CRON_SECRET (rekommenderas).
 *
 * Auth: Vercel Cron skickar `Authorization: Bearer <CRON_SECRET>` när
 * CRON_SECRET är satt. Är den satt kräver vi matchning; annars körs den öppet
 * (men loggar en varning) så att den fungerar innan secret konfigurerats.
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// 3 Sonnet-genereringar tar flera minuter — kräver Vercel Pro/Fluid Compute.
export const maxDuration = 300;

const COUNT = 3;
const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Du skriver långa, gedigna nyhets- och bakgrundsartiklar.

# Ton
Expert, rak och praktisk affärssvenska — inte "AI-ig". Skriv som en kunnig kollega. Konkret framför generiskt (namn, siffror, exempel). Inga floskler ("revolutionerande", "i en värld där", "game changer"), inga emojis.

# Format
Ren HTML: <h2>, <h3>, <p>, <ul>/<li>, <strong> (sparsamt), <table> vid behov. Ingen markdown, inga \`\`\`-block, ingen <h1> (titeln finns i mallen). Börja med en <p>-tagg, sluta med </p> eller </ul>.

# Struktur
Kort intro (1-2 stycken) som etablerar relevansen, H2-sektioner med tydlig röd tråd, och en avslutande slutsats. ~1500 ord.`;

function textOf(msg: Anthropic.Message): string {
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
}

function firstParagraph(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 220);
}

/** Hämta en liggande omslagsbild från Unsplash. Returnerar URL eller null. */
async function unsplashImage(query: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` }, cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: { urls?: { regular?: string }; links?: { download_location?: string } }[];
    };
    const photo = data.results?.[0];
    if (!photo?.urls?.regular) return null;
    // Unsplash API-villkor: trigga en download-event (best-effort).
    if (photo.links?.download_location) {
      fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => {});
    }
    return photo.urls.regular;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (req.headers.get('authorization') !== `Bearer ${secret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  } else {
    console.warn('[cron] CRON_SECRET ej satt — endpointen körs oskyddad.');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || !process.env.ANTHROPIC_API_KEY) {
    return Response.json({ ok: false, error: 'Saknar env (Supabase/Anthropic).' }, { status: 500 });
  }
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  const claude = new Anthropic();

  // Hämta de äldsta oanvända ämnena.
  const { data: topics, error: tErr } = await db
    .from('article_topics')
    .select('id,topic,category')
    .eq('used', false)
    .order('created_at', { ascending: true })
    .limit(COUNT);
  if (tErr) {
    const hint = /article_topics/.test(tErr.message)
      ? ' (kör migrationen supabase/migrations/0012_article_topics.sql först)'
      : '';
    return Response.json({ ok: false, error: tErr.message + hint }, { status: 500 });
  }
  if (!topics?.length) return Response.json({ ok: true, generated: 0, note: 'Inga oanvända ämnen.' });

  // Säkerställ unika slugs mot befintliga paths.
  const used = new Set<string>();
  {
    const { data: existing } = await db.from('articles').select('slug');
    (existing ?? []).forEach((r: { slug: string }) => used.add(r.slug));
  }
  const uniqueSlug = (base: string) => {
    let s = base || 'artikel';
    let i = 2;
    while (used.has(s)) s = `${base}-${i++}`;
    used.add(s);
    return s;
  };

  const results: { topic: string; ok: boolean; slug?: string; error?: string }[] = [];
  for (const t of topics) {
    try {
      const msg = await claude.messages.create({
        model: MODEL,
        max_tokens: 8000,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: `Skriv en artikel med titeln "${t.topic}". ~1500 ord, ren HTML, börja med första <p>-taggen.` }],
      });
      const html = textOf(msg);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      if (words < 400) throw new Error(`för kort (${words} ord)`);

      const excerpt = firstParagraph(html);
      const slug = uniqueSlug(slugify(t.topic));
      const image = await unsplashImage(t.topic);

      const { error: uErr } = await db.from('articles').upsert(
        {
          slug,
          title: t.topic,
          excerpt,
          content_mdx: html,
          category: t.category,
          tags: [],
          featured_image: image,
          type: 'post',
          path: `/${slug}`,
          parent_slug: null,
          affiliate_url: null,
          published_at: new Date().toISOString(),
          seo_title: `${t.topic} | AI-Magasinet`,
          seo_description: excerpt,
        },
        { onConflict: 'path' }
      );
      if (uErr) throw new Error(uErr.message);

      await db.from('article_topics').update({ used: true, used_at: new Date().toISOString() }).eq('id', t.id);
      results.push({ topic: t.topic, ok: true, slug });
    } catch (e) {
      results.push({ topic: t.topic, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return Response.json({ ok: true, generated: results.filter((r) => r.ok).length, results });
}
