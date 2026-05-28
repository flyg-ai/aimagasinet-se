/**
 * Two-pass content update:
 *
 *   1. /ai-verktyg/tiktok — replace the legacy WP-imported content_mdx
 *      (28KB of <style> blocks + old custom markup) with a fresh
 *      ~1500-word Swedish guide generated via Claude Sonnet 4.6.
 *
 *   2. Internal-link strengthening — append a "Läs vidare"-block to
 *      four high-traffic content_mdx rows so they ship contextual
 *      links into specific deeper pages we want crawl equity to flow
 *      toward.
 *
 *   npx tsx scripts/internal-link-pass.ts
 *
 * Idempotent — the link block is wrapped in a <div data-internal-link-pass>
 * marker so re-runs replace it instead of stacking.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const SONNET = 'claude-sonnet-4-6';

/* ─── Pass 1: regenerate tiktok ──────────────────────────────── */

const TIKTOK_SYSTEM = `Du är senior redaktör på AI-Magasinet. Skriv en polerad hub-guide om AI-verktyg för TikTok.

# Tonalitet
Expert, rak, praktisk svenska. Inga floskler. Inga emojis. Konkreta verktygsnamn, priser och use cases.

# Struktur (~1500 ord)
- Intro (1-2 stycken) — varför AI är centralt för TikTok-content 2026
- 5-7 H2-rubriker:
  * Workflow: så använder TikTokers AI 2026
  * Verktyg för manus och hooks
  * Verktyg för video och visuals
  * Verktyg för voiceover och musik
  * Verktyg för redigering och optimering
  * Vad TikToks algoritm belönar 2026
  * Vanliga fallgropar (copyright, monetisering, AI-disclosure)
- Konkreta exempel — verktygsnamn, ungefärliga priser
- Avsluta med "Så bygger du en konsistent pipeline"

# Länkning
Länka 4-6 av dessa naturligt i prosan med HTML <a href>:
- /ai-verktyg/ai-text-verktyg — AI-skrivverktyg (manus + hooks)
- /ai-video — AI-videoverktyg
- /ai-video/kling-ai — Kling AI
- /ai-video/runway-gen-3 — Runway Gen-3
- /ai-verktyg/ai-ljud-och-musik — AI-ljud & musik
- /ai-verktyg/ai-ljud-och-musik/elevenlabs — ElevenLabs (voiceover)
- /ai-verktyg/ai-bild-verktyg — AI-bildverktyg
- /skapa-faceless-content-med-ai — Skapa faceless content med AI

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan). Ingen \`\`\`html-wrapping, inga inline styles.`;

async function regenerateTiktok() {
  console.log('Pass 1 — regenerating /ai-verktyg/tiktok via', SONNET);
  const res = await claude.messages.create({
    model: SONNET,
    max_tokens: 8000,
    system: [{ type: 'text', text: TIKTOK_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: 'Skriv guiden nu. ~1500 ord, ren HTML, börja med första <p>-taggen.',
    }],
  });
  const html = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  ${words} ord, ${html.length} bytes`);
  const { error } = await db
    .from('articles')
    .update({ content_mdx: html })
    .eq('path', '/ai-verktyg/tiktok');
  if (error) throw new Error(`update tiktok: ${error.message}`);
  console.log('  ✓ /ai-verktyg/tiktok updated\n');
}

/* ─── Pass 2: appended internal-link blocks ──────────────────── */

const MARKER_OPEN = '<div data-internal-link-pass="v1" class="related-links">';
const MARKER_CLOSE = '</div>';

type LinkBlock = {
  path: string;
  heading: string;
  intro: string;
  links: { url: string; label: string; description: string }[];
};

const BLOCKS: LinkBlock[] = [
  {
    path: '/ai-verktyg/gratis',
    heading: 'Läs vidare',
    intro: 'När du har provat de gratis AI-verktygen ovan — här är de naturliga nästa stegen om du börjar bygga något skarpt med dem:',
    links: [
      {
        url: '/ai-verktyg/ai-kod-verktyg/cursor-ai/',
        label: 'Cursor AI',
        description: 'Steget upp från gratis-Copilot — agentisk AI-editor som faktiskt kan utveckla hela features åt dig.',
      },
      {
        url: '/ai-verktyg/foretag/yrke/marknadsforing/seo/',
        label: 'AI för SEO',
        description: 'Topplistan över AI-verktyg som faktiskt flyttar svenska SERPs — många har generösa gratis-tiers.',
      },
    ],
  },
  {
    path: '/ai-verktyg/ai-text-verktyg',
    heading: 'Läs vidare',
    intro: 'För dig som vill djupare in på hur AI-skrivverktygen fungerar och var de faktiskt skapar värde:',
    links: [
      {
        url: '/ai-guiden/vad-ar-ai/',
        label: 'Vad är AI? — Komplett guide',
        description: 'Grunderna i hur LLM:er som GPT, Claude och Gemini faktiskt fungerar — på svenska, utan jargong.',
      },
      {
        url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting/',
        label: 'AI för content & copywriting',
        description: 'Topplistan över AI-skrivverktyg för marknadsförare och redaktioner — testade i svenska arbetsflöden.',
      },
    ],
  },
  {
    path: '/topp-50-ai-latar-pa-spotify-2026',
    heading: 'Läs vidare',
    intro: 'Vill du skapa egen AI-musik eller förstå tekniken bakom listan? Börja här:',
    links: [
      {
        url: '/ai-verktyg/ai-ljud-och-musik/',
        label: 'AI-ljud & musik — alla verktyg',
        description: 'Hela topplistan över AI-musikverktyg testade av AI-Magasinets redaktion: Suno, ElevenLabs, Udio och fler.',
      },
      {
        url: '/ai-verktyg/ai-ljud-och-musik/suno-ai/',
        label: 'Suno AI-recension',
        description: 'Djupdykning i verktyget bakom många av låtarna på listan — gratis tier, prismodell och vad det faktiskt kan.',
      },
    ],
  },
  {
    path: '/bygga-mobilapp-med-ai',
    heading: 'Läs vidare',
    intro: 'För dig som vill djupdyka i kodverktygen som driver AI-driven mobilutveckling:',
    links: [
      {
        url: '/ai-verktyg/ai-kod-verktyg/cursor-ai/',
        label: 'Cursor AI-recension',
        description: 'Den agentiska kodeditor de flesta mobilapps-team kombinerar med Expo eller Flutter 2026.',
      },
      {
        url: '/ai-verktyg/ai-kod-verktyg/',
        label: 'AI-kodverktyg — hela topplistan',
        description: 'Cursor, GitHub Copilot, Windsurf, Tabnine och Codeium — rankade på svenska arbetsflöden.',
      },
    ],
  },
];

function renderBlock(b: LinkBlock): string {
  const items = b.links
    .map(
      (l) =>
        `    <li><a href="${l.url}"><strong>${l.label}</strong></a> — ${l.description}</li>`
    )
    .join('\n');
  return [
    MARKER_OPEN,
    `  <h2>${b.heading}</h2>`,
    `  <p>${b.intro}</p>`,
    `  <ul>`,
    items,
    `  </ul>`,
    MARKER_CLOSE,
  ].join('\n');
}

/** Strip any previous link-pass block so re-runs replace cleanly. */
function stripPrevious(html: string): string {
  const re = /<div\b[^>]*data-internal-link-pass[^>]*>[\s\S]*?<\/div>\s*/gi;
  return html.replace(re, '').trim();
}

async function appendLinkBlocks() {
  console.log('Pass 2 — appending internal-link blocks');
  for (const b of BLOCKS) {
    const { data, error } = await db
      .from('articles')
      .select('id,content_mdx')
      .eq('path', b.path)
      .maybeSingle();
    if (error || !data) {
      console.error(`  ✗ ${b.path}: ${error?.message ?? 'not found'}`);
      continue;
    }
    const original: string = data.content_mdx ?? '';
    const cleaned = stripPrevious(original);
    const block = renderBlock(b);
    const updated = cleaned + '\n\n' + block + '\n';
    const { error: uErr } = await db
      .from('articles')
      .update({ content_mdx: updated })
      .eq('id', data.id);
    if (uErr) { console.error(`  ✗ ${b.path}: ${uErr.message}`); continue; }
    console.log(`  ✓ ${b.path}  ${original.length} → ${updated.length} bytes`);
  }
}

async function main() {
  await regenerateTiktok();
  await appendLinkBlocks();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
