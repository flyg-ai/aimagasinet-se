/**
 * Skapar den saknade gratis-subsidan /ai-verktyg/gratis/ai-video/
 * (~1000 ord, unik gratis-vinkel) via Claude Sonnet. Samma schema/stil som
 * de befintliga gratis-subsidorna i scripts/build-bild-verktyg-and-gratis.ts.
 *
 *   npx tsx scripts/seed-gratis-ai-video.ts
 *
 * ai-text/ai-bilder/ai-kod finns redan — bara ai-video saknades.
 * Idempotent: upsert på path.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens.

# Tonalitet
Expert, rak, praktisk svenska. Skriv som en kunnig kollega som har testat verktygen själv. Inga floskler. Inga emojis. Konkreta verktygsnamn, priser och use cases.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3> för rubriker, <p> för stycken, <ul>/<ol>+<li> för listor, <a href> för länkar, <strong> sparsamt.`;

const SPEC = {
  // URL-segmentet är ai-video (path nedan), men sluggen måste vara unik —
  // 'ai-video' är redan upptaget av /ai-video-hubben.
  slug: 'gratis-ai-video',
  urlSegment: 'ai-video',
  title: 'Gratis AI-video — Pika, Kling & Runway utan att betala 2026',
  excerpt: 'Pika Labs, Kling AI och Runway gratis-tiers 2026 — krediter, klipplängd, vattenstämplar och hur du får ut mest AI-video utan att betala.',
  brief: `Skriv en unik gratis-vinklad guide (~1000 ord) om gratis AI-video-verktyg. Fokus är 100% på GRATIS-användning — inte att duplicera huvud-hubben /ai-video/.

Struktur:
- Intro: AI-video gratis 2026 — Pika Labs, Kling AI och Runway ger generösa gratis-krediter. Du kan komma långt utan att betala om du vet exakt vad varje gratis-tier ger och var gränserna går.
- <h2>Tre gratis-alternativ som ger verkligt värde</h2>:
  * Pika Labs (generösa gratis-krediter/månad, text- och bild-till-video, snabb generering)
  * Kling AI (dagliga gratis-krediter, marknadens mest realistiska video, längre klipp)
  * Runway (gratis 125 credits engångs, Gen-3 + redigeringsstudio och Magic Tools)
- <h2>Vad du faktiskt får gratis i varje verktyg</h2> — konkret genomgång: antal krediter, klipplängd, upplösning, vattenstämpel ja/nej, hur snabbt krediterna tar slut
- <h2>Begränsningar att känna till</h2> — vattenstämplar på gratis-tiers, kötider vid hög belastning, lägre upplösning/kort klipplängd, och att kommersiell användning ofta kräver betald plan
- <h2>Så maximerar du gratis-krediterna över flera tjänster</h2> — växla mellan tjänsterna, använd bild-till-video för bättre kontroll, planera prompts innan du bränner krediter, vilket verktyg passar vilket use case
- <h2>När är gratis inte tillräckligt?</h2> — konkreta scenarier för Runway Pro, Kling Pro och Sora via ChatGPT Plus (~$20/mån och uppåt)
- Avsluta med <h2>Vår 2026-stack för gratis AI-video</h2>

Länka naturligt till /ai-video/, /ai-verktyg/gratis/, /ai-video/pika-labs/, /ai-video/kling-ai/, /ai-video/runway-gen-3/.

Skriv guiden nu. Ren HTML, börja med första <p>-taggen.`,
};

async function main() {
  console.log('Genererar /ai-verktyg/gratis/ai-video via', MODEL, '…');
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: SPEC.brief }],
  });
  const html = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim();
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  ${words} ord, ${html.length} tecken`);
  if (words < 600) { console.error('För kort output — avbryter.'); process.exit(1); }

  const path = `/ai-verktyg/gratis/${SPEC.urlSegment}`;
  const row = {
    slug: SPEC.slug, title: SPEC.title, excerpt: SPEC.excerpt, content_mdx: html,
    category: null, tags: ['gratis', 'AI-verktyg'], featured_image: null,
    type: 'page' as const, path, parent_slug: 'gratis', affiliate_url: null,
    published_at: new Date().toISOString(), seo_title: SPEC.title, seo_description: SPEC.excerpt,
  };
  const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  console.log(`✓ Upserted ${path}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
