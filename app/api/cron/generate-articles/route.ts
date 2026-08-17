/**
 * Nattlig artikel-generering. Anropas av Vercel Cron (se vercel.json).
 *
 * Två lägen, valda med ?mode=:
 *
 *   (default)     Plockar de äldsta oanvända ämnena ur article_topics och
 *                 skriver en artikel per ämne.
 *   ?mode=news    Söker på webben efter dygnets viktigaste AI-nyheter med
 *                 relevans för svensk marknad och skriver en artikel per
 *                 nyhet, med källhänvisningar och interna länkar.
 *
 * COUNT styr hur många artiklar ett anrop producerar. Schemat i vercel.json kör
 * ett anrop i taget (06/08/10 svensk tid), så COUNT=1 ger tre artiklar per dag.
 *
 * Båda lägen delar publiceringsväg (Unsplash-omslag + upsert på path,
 * published_at=now()) och fyller på ämneskön automatiskt när den sinar.
 *
 * Kräver env: ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY,
 * NEXT_PUBLIC_SUPABASE_URL, UNSPLASH_ACCESS_KEY, CRON_SECRET (rekommenderas).
 *
 * Auth: Vercel Cron skickar `Authorization: Bearer <CRON_SECRET>` när
 * CRON_SECRET är satt. Är den satt kräver vi matchning; annars körs den öppet
 * (men loggar en varning) så att den fungerar innan secret konfigurerats.
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Nyhetsläget gör en websökning + generering på Opus 5, som kan ta flera
// minuter. Kräver Vercel Pro/Fluid Compute (taket där är 800 s).
export const maxDuration = 800;

/** Artiklar per anrop. Schemat kör tre anrop per dag. */
const COUNT = 1;
const MODEL = 'claude-opus-5';
/** Thinking är på som standard på Opus 5 och ryms inom max_tokens
 *  tillsammans med svarstexten — därav marginalen. */
const MAX_TOKENS = 16000;
/** Fyll på ämneskön när färre än så här många oanvända ämnen återstår.
 *  Schemat drar två ämnesartiklar per dag, så det är ~4 dygns marginal. */
const REFILL_THRESHOLD = 9;
const REFILL_COUNT = 20;
/** Antal publicerade artiklar som erbjuds som interna länkmål. */
const LINK_CANDIDATES = 80;
/** Antal senaste rubriker som skickas in för att undvika dubbelbevakning. */
const RECENT_TITLES = 30;

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Du skriver långa, gedigna nyhets- och bakgrundsartiklar.

# Ton
Expert, rak och praktisk affärssvenska — inte "AI-ig". Skriv som en kunnig kollega. Konkret framför generiskt (namn, siffror, exempel). Inga floskler ("revolutionerande", "i en värld där", "game changer"), inga emojis.

# Format
Ren HTML: <h2>, <h3>, <p>, <ul>/<li>, <strong> (sparsamt), <table> vid behov. Ingen markdown, inga \`\`\`-block, ingen <h1> (titeln finns i mallen). Börja med en <p>-tagg, sluta med </p> eller </ul>.

# Struktur
Kort intro (1-2 stycken) som etablerar relevansen, H2-sektioner med tydlig röd tråd, och en avslutande slutsats.

# Längd
Mellan 1300 och 1700 ord. Håll dig inom spannet — skriv inte längre för att det finns utrymme.`;

const NEWS_ADDENDUM = `

# Nyhetsartiklar
Detta är en nyhetsartikel om en händelse det senaste dygnet. Utöver riktlinjerna ovan:

- Slå fast nyheten i första stycket: vad som hänt, vem, när. Inga uppvärmningsstycken.
- Sätt in händelsen i svensk kontext — vad den betyder för svenska företag, myndigheter eller utvecklare.
- Skriv bara det källorna faktiskt stödjer. Är något oklart eller obekräftat, skriv ut det istället för att gissa. Hitta inte på siffror, citat eller namn.
- Referera källorna i brödtexten med <a href="URL" rel="nofollow noopener" target="_blank">källans namn</a>. Använd endast URL:er ur källistan du fått.
- Väv in 3-5 interna länkar till relaterade artiklar på AI-Magasinet, med <a href="/sokvag/">ankartext</a>. Använd endast sökvägar ur listan du fått, exakt som de står (med avslutande snedstreck). Länka bara där det är naturligt i texten — tvinga inte in dem.`;

const NEWS_RESEARCH_PROMPT = `Du är nyhetsredaktör på AI-Magasinet, ett svenskt magasin om artificiell intelligens. Din uppgift är att researcha dagens viktigaste AI-nyheter.

Sök på webben och identifiera de nyheter om artificiell intelligens som publicerats det senaste dygnet och som är mest relevanta för en svensk läsekrets: beslutsfattare, utvecklare och företagare.

Prioritera i denna ordning:
1. Nyheter som direkt rör Sverige eller svenska aktörer.
2. EU-beslut, regleringar och rättsfall som får genomslag i Sverige.
3. Internationella nyheter (modellsläpp, större affärer, forskningsgenombrott) med konkret betydelse för svenska verksamheter.

Undvik ren produktmarknadsföring, spekulativa rykten och nyheter utan verifierbar primärkälla.

Redovisa varje kandidat med: en föreslagen svensk rubrik, två-tre meningar om vad som hänt och varför det angår svenska läsare, samt de fullständiga URL:erna till de källor du faktiskt läst. Skriv ut URL:erna i klartext.`;

/** SDK 0.99 saknar typer för `fallbacks` (beta server-side-fallback-2026-07-01).
 *  Parametern serialiseras oförändrad i request-body:n, så den läggs på efter
 *  typkontrollen. Ta bort helpern när @anthropic-ai/sdk uppgraderas. */
function withFallbacks<T extends object>(params: T): T {
  return { ...params, fallbacks: 'default' } as T;
}

const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

type BetaParams = Anthropic.Beta.MessageCreateParamsNonStreaming;

/** Server-tools kör en serverloop med 10 iterationer som tak. Slår den i taket
 *  returneras stop_reason='pause_turn' och turen måste återupptas genom att
 *  assistant-svaret skickas tillbaka. Utan detta får man ett halvfärdigt svar
 *  utan felmeddelande. */
async function createWithResume(
  claude: Anthropic,
  params: BetaParams,
  maxResumes = 3,
): Promise<Anthropic.Beta.BetaMessage> {
  const messages = [...params.messages];
  let msg = await claude.beta.messages.create(withFallbacks({ ...params, messages }));
  for (let i = 0; i < maxResumes && msg.stop_reason === 'pause_turn'; i++) {
    messages.push({
      role: 'assistant',
      content: msg.content as unknown as Anthropic.Beta.BetaContentBlockParam[],
    });
    msg = await claude.beta.messages.create(withFallbacks({ ...params, messages }));
  }
  return msg;
}

function textOf(msg: Anthropic.Beta.BetaMessage): string {
  if (msg.stop_reason === 'refusal') {
    throw new Error('modellen nekade förfrågan (stop_reason=refusal)');
  }
  return msg.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:html|json)?\s*/i, '')
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

function wordCount(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
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

/* ── Länkhygien ────────────────────────────────────────────────────
   Modellen får en lista giltiga interna sökvägar, men vi litar inte på
   att den håller sig till den. Interna länkar som inte finns i listan
   plattas till ren text; externa länkar får rel/target om de saknas. */

function sanitizeLinks(
  html: string,
  allowedPaths: Set<string>,
): { html: string; internal: number; external: number } {
  let internal = 0;
  let external = 0;
  const out = html.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, attrs: string, inner: string) => {
      const href = attrs.match(/href\s*=\s*"([^"]*)"/i)?.[1];
      if (!href) return inner;

      if (href.startsWith('/')) {
        if (!allowedPaths.has(href)) return inner; // uppdiktad sökväg → ren text
        internal++;
        return match;
      }
      if (/^https?:\/\//i.test(href)) {
        external++;
        let a = attrs;
        if (!/\brel\s*=/i.test(a)) a += ' rel="nofollow noopener"';
        if (!/\btarget\s*=/i.test(a)) a += ' target="_blank"';
        return `<a${a}>${inner}</a>`;
      }
      return inner; // mailto:, ankare, relativa sökvägar → ren text
    },
  );
  return { html: out, internal, external };
}

/* ── Kontext som båda lägen delar ─────────────────────────────────── */

type Ctx = {
  categorySlugs: string[];
  usedSlugs: Set<string>;
  /** path → titel, för interna länkar. Paths har avslutande snedstreck
   *  eftersom sajten kör trailingSlash: true (se lib/links.ts). */
  linkTargets: { path: string; title: string }[];
  allowedPaths: Set<string>;
  recentTitles: string[];
};

/** DB lagrar path utan avslutande snedstreck, sajten kanoniserar med.
 *  Samma normalisering som lib/links.ts to(). */
function withSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/** PostgREST returnerar max 1000 rader per anrop. Ett ofullständigt slug-set
 *  gör att reserveSlug() kan dela ut en slug som redan finns, och då skriver
 *  upsert på path över en publicerad artikel istället för att skapa en ny.
 *  Därför sidindelat. */
const PAGE = 1000;

async function allSlugs(db: SupabaseClient): Promise<string[]> {
  const out: string[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('articles')
      .select('slug')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`kunde inte läsa slugs: ${error.message}`);
    const page = data ?? [];
    out.push(...page.map((r: { slug: string }) => r.slug));
    if (page.length < PAGE) return out;
  }
}

async function loadContext(db: SupabaseClient): Promise<Ctx> {
  // Fel här sväljs inte: tomma listor skulle ge enum: [] i JSON-schemat
  // (ogiltigt schema → API 400) och dölja ett DB-fel bakom ett modellfel.
  const [cats, recent, usedSlugs] = await Promise.all([
    db.from('categories').select('slug'),
    db
      .from('articles')
      .select('title,path')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(LINK_CANDIDATES),
    allSlugs(db),
  ]);

  if (cats.error) throw new Error(`kunde inte läsa kategorier: ${cats.error.message}`);
  if (recent.error) throw new Error(`kunde inte läsa artiklar: ${recent.error.message}`);

  const categorySlugs = (cats.data ?? []).map((c: { slug: string }) => c.slug);
  if (!categorySlugs.length) {
    throw new Error('categories-tabellen är tom — kan inte bygga kategorischemat');
  }

  const linkTargets = (recent.data ?? [])
    .filter((r: { path: string | null }) => !!r.path)
    .map((r: { title: string; path: string }) => ({
      path: withSlash(r.path),
      title: r.title,
    }));

  return {
    categorySlugs,
    usedSlugs: new Set(usedSlugs),
    linkTargets,
    allowedPaths: new Set(linkTargets.map((t) => t.path)),
    recentTitles: linkTargets.slice(0, RECENT_TITLES).map((t) => t.title),
  };
}

function reserveSlug(ctx: Ctx, title: string): string {
  const base = slugify(title) || 'artikel';
  let s = base;
  let i = 2;
  while (ctx.usedSlugs.has(s)) s = `${base}-${i++}`;
  ctx.usedSlugs.add(s);
  return s;
}

/* ── Jobb ─────────────────────────────────────────────────────────── */

type Source = { url: string; title: string };

type Job = {
  title: string;
  category: string | null;
  slug: string;
  /** Sätts i topics-läget — markeras used efter lyckad publicering. */
  topicId?: number;
  /** Sätts i nyhetsläget. */
  angle?: string;
  sources?: Source[];
};

async function takeTopics(db: SupabaseClient, ctx: Ctx): Promise<Job[]> {
  const { data, error } = await db
    .from('article_topics')
    .select('id,topic,category')
    .eq('used', false)
    .order('created_at', { ascending: true })
    .limit(COUNT);
  if (error) {
    const hint = /article_topics/.test(error.message)
      ? ' (kör migrationen supabase/migrations/0012_article_topics.sql först)'
      : '';
    throw new Error(error.message + hint);
  }
  return (data ?? []).map((t: { id: number; topic: string; category: string | null }) => ({
    title: t.topic,
    category: t.category,
    slug: reserveSlug(ctx, t.topic),
    topicId: t.id,
  }));
}

/* ── Nyhetsläge ───────────────────────────────────────────────────── */

type Story = { title: string; angle: string; category: string; sources: Source[] };

async function findNewsStories(claude: Anthropic, ctx: Ctx): Promise<Job[]> {
  const today = new Date().toISOString().slice(0, 10);

  // Steg 1 — research med websökning. Fri text; strukturen plockas ut i steg 2.
  // (Delat i två anrop så att den strukturerade extraktionen inte behöver samsas
  //  med server-tool-loopen.)
  const research = await createWithResume(claude, {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    betas: [FALLBACK_BETA],
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 8 }],
    system: [{ type: 'text', text: NEWS_RESEARCH_PROMPT }],
    messages: [
      {
        role: 'user',
        content:
          `Dagens datum är ${today}. Sök reda på de viktigaste AI-nyheterna publicerade sedan ${today} minus ett dygn.\n\n` +
          `Vi har redan publicerat följande artiklar — föreslå inget som överlappar dem:\n` +
          ctx.recentTitles.map((t) => `- ${t}`).join('\n'),
      },
    ],
  });
  const briefing = textOf(research);

  // Steg 2 — strukturera de tre bästa. Inga verktyg, bara schemat.
  const extracted = await claude.beta.messages.create(
    withFallbacks({
      model: MODEL,
      max_tokens: 4000,
      betas: [FALLBACK_BETA],
      output_config: {
        format: {
          type: 'json_schema' as const,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['stories'],
            properties: {
              stories: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['title', 'angle', 'category', 'sources'],
                  properties: {
                    title: { type: 'string' },
                    angle: { type: 'string' },
                    category: { type: 'string', enum: ctx.categorySlugs },
                    sources: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['url', 'title'],
                        properties: { url: { type: 'string' }, title: { type: 'string' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      messages: [
        {
          role: 'user',
          content:
            `Nedan är en researchsammanställning. Välj ${
              COUNT === 1
                ? 'den enskilt starkaste nyheten'
                : `de ${COUNT} starkaste nyheterna`
            } för en svensk AI-läsekrets ` +
            `och returnera den strukturerat. Rubriken ska vara färdig att publicera på svenska. ` +
            `Ta bara med källor vars fullständiga URL står i sammanställningen — hitta inte på URL:er.\n\n` +
            briefing,
        },
      ],
    }),
  );

  const raw = textOf(extracted);
  let parsed: { stories?: Story[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('kunde inte tolka researchsvaret som JSON');
  }

  const valid = new Set(ctx.categorySlugs);
  return (parsed.stories ?? []).slice(0, COUNT).map((s) => ({
    title: s.title,
    category: valid.has(s.category) ? s.category : null,
    slug: reserveSlug(ctx, s.title),
    angle: s.angle,
    sources: (s.sources ?? []).filter((src) => /^https?:\/\//i.test(src.url)),
  }));
}

/* ── Generering + publicering ─────────────────────────────────────── */

type Result = {
  title: string;
  ok: boolean;
  slug?: string;
  words?: number;
  internalLinks?: number;
  sources?: number;
  error?: string;
};

async function generateAndPublish(
  claude: Anthropic,
  db: SupabaseClient,
  job: Job,
  ctx: Ctx,
): Promise<Result> {
  const isNews = !!job.sources;

  const linkList = ctx.linkTargets
    .map((t) => `- ${t.title} — ${t.path}`)
    .join('\n');

  const userPrompt = isNews
    ? [
        `Skriv en nyhetsartikel med rubriken "${job.title}".`,
        ``,
        `Vinkel: ${job.angle}`,
        ``,
        `Källor (använd endast dessa URL:er):`,
        ...(job.sources ?? []).map((s) => `- ${s.title} — ${s.url}`),
        ``,
        `Interna länkmål (använd sökvägarna exakt som de står):`,
        linkList,
        ``,
        `Ren HTML, börja med första <p>-taggen.`,
      ].join('\n')
    : `Skriv en artikel med titeln "${job.title}". Ren HTML, börja med första <p>-taggen.`;

  const msg = await claude.beta.messages.create(
    withFallbacks({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      betas: [FALLBACK_BETA],
      system: [{ type: 'text', text: isNews ? SYSTEM_PROMPT + NEWS_ADDENDUM : SYSTEM_PROMPT }],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  );

  // En artikel som kapats mitt i HTML-koden passerar 400-ordsgränsen och skulle
  // publiceras trasig. Ordräkningen fångar inte det — stop_reason gör det.
  if (msg.stop_reason === 'max_tokens') {
    throw new Error(`svaret kapades av max_tokens (${MAX_TOKENS}) — publiceras inte`);
  }

  const generated = textOf(msg);
  const { html, internal } = sanitizeLinks(generated, ctx.allowedPaths);
  const words = wordCount(html);
  if (words < 400) throw new Error(`för kort (${words} ord)`);

  const excerpt = firstParagraph(html);
  const image = await unsplashImage(job.title);

  const { error } = await db.from('articles').upsert(
    {
      slug: job.slug,
      title: job.title,
      excerpt,
      content_mdx: html,
      category: job.category,
      tags: [],
      featured_image: image,
      type: 'post',
      path: `/${job.slug}`,
      parent_slug: null,
      affiliate_url: null,
      published_at: new Date().toISOString(),
      seo_title: `${job.title} | AI-Magasinet`,
      seo_description: excerpt,
    },
    { onConflict: 'path' }
  );
  if (error) throw new Error(error.message);

  if (job.topicId != null) {
    await db
      .from('article_topics')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', job.topicId);
  }

  return {
    title: job.title,
    ok: true,
    slug: job.slug,
    words,
    internalLinks: internal,
    sources: job.sources?.length ?? 0,
  };
}

/* ── Påfyllning av ämneskön ───────────────────────────────────────── */

async function refillTopicsIfLow(
  claude: Anthropic,
  db: SupabaseClient,
  ctx: Ctx,
): Promise<{ unused: number; refilled: number; error?: string }> {
  // Inte head:true — en HEAD-request har ingen body att läsa felet ur, så en
  // saknad tabell ger count=null *utan* error och påfyllningen körs i onödan.
  const { count, error: cErr } = await db
    .from('article_topics')
    .select('id', { count: 'exact' })
    .eq('used', false)
    .limit(1);
  if (cErr) return { unused: -1, refilled: 0, error: cErr.message };
  if (count == null) {
    return { unused: -1, refilled: 0, error: 'kunde inte räkna oanvända ämnen' };
  }

  const unused = count;
  if (unused >= REFILL_THRESHOLD) return { unused, refilled: 0 };

  // Alla befintliga ämnen (även använda) skickas in som dublettspärr.
  const { data: existing, error: eErr } = await db.from('article_topics').select('topic');
  if (eErr) return { unused, refilled: 0, error: eErr.message };
  const existingTopics = (existing ?? []).map((r: { topic: string }) => r.topic);

  const msg = await claude.beta.messages.create(
    withFallbacks({
      model: MODEL,
      max_tokens: 4000,
      betas: [FALLBACK_BETA],
      output_config: {
        format: {
          type: 'json_schema' as const,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['topics'],
            properties: {
              topics: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['topic', 'category'],
                  properties: {
                    topic: { type: 'string' },
                    category: { type: 'string', enum: ctx.categorySlugs },
                  },
                },
              },
            },
          },
        },
      },
      messages: [
        {
          role: 'user',
          content:
            `Föreslå ${REFILL_COUNT} nya artikelämnen för AI-Magasinet, ett svenskt magasin om artificiell intelligens ` +
            `för beslutsfattare, utvecklare och företagare.\n\n` +
            `Varje ämne ska vara en färdig, konkret artikelrubrik på svenska som håller minst ett år — ` +
            `guider, förklaringar, jämförelser och branschanalyser snarare än dagsaktuella nyheter. ` +
            `Sprid dem över kategorierna.\n\n` +
            `Dessa ämnen finns redan. Föreslå inget som överlappar dem:\n` +
            existingTopics.map((t) => `- ${t}`).join('\n'),
        },
      ],
    }),
  );

  let parsed: { topics?: { topic: string; category: string }[] };
  try {
    parsed = JSON.parse(textOf(msg));
  } catch {
    return { unused, refilled: 0, error: 'kunde inte tolka ämnesförslagen som JSON' };
  }

  const valid = new Set(ctx.categorySlugs);
  const rows = (parsed.topics ?? [])
    .filter((t) => t.topic?.trim())
    .slice(0, REFILL_COUNT)
    .map((t) => ({
      topic: t.topic.trim(),
      category: valid.has(t.category) ? t.category : null,
    }));
  if (!rows.length) return { unused, refilled: 0, error: 'inga giltiga ämnen returnerades' };

  // topic har unique-constraint (0012) — dubbletter ignoreras tyst.
  const { error: iErr } = await db
    .from('article_topics')
    .upsert(rows, { onConflict: 'topic', ignoreDuplicates: true });
  if (iErr) return { unused, refilled: 0, error: iErr.message };

  return { unused, refilled: rows.length };
}

/* ── Handler ──────────────────────────────────────────────────────── */

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

  const mode = new URL(req.url).searchParams.get('mode') === 'news' ? 'news' : 'topics';

  let ctx: Ctx;
  let jobs: Job[];
  try {
    ctx = await loadContext(db);
    jobs = mode === 'news' ? await findNewsStories(claude, ctx) : await takeTopics(db, ctx);
  } catch (e) {
    return Response.json(
      { ok: false, mode, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  // Genereringarna är oberoende av varandra och alla slugs är redan
  // reserverade, så de kan köras parallellt.
  const settled = await Promise.allSettled(
    jobs.map((job) => generateAndPublish(claude, db, job, ctx)),
  );
  const results: Result[] = settled.map((s, i) =>
    s.status === 'fulfilled'
      ? s.value
      : {
          title: jobs[i].title,
          ok: false,
          error: s.reason instanceof Error ? s.reason.message : String(s.reason),
        },
  );

  // Får aldrig fälla genereringen.
  let topics: Awaited<ReturnType<typeof refillTopicsIfLow>>;
  try {
    topics = await refillTopicsIfLow(claude, db, ctx);
  } catch (e) {
    topics = { unused: -1, refilled: 0, error: e instanceof Error ? e.message : String(e) };
  }

  return Response.json({
    ok: true,
    mode,
    generated: results.filter((r) => r.ok).length,
    results,
    topics,
  });
}
