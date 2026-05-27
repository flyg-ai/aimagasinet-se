/**
 * Generate ~2000-word guide-text for 11 hub pages via Claude API and persist
 * to articles.content_mdx via Supabase service role. Idempotent — overwrites
 * content_mdx on each run.
 *
 * Run: npx tsx scripts/generate-hub-guides.ts
 *
 * Caching: shared system prompt is cache_control: "ephemeral". First call
 * writes the cache; subsequent 10 calls read from it. Verify via the
 * cache_read_input_tokens log output below.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic(); // reads ANTHROPIC_API_KEY

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 8000;

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Din uppgift är att skriva guide-text för hubbsidor på sajten.

# Tonalitet och röst

AI-Magasinets röst är **expert, rak och praktisk** — inte "AI-ig". Du skriver för svenska företagare, marknadsförare, utvecklare och professionella som vill förstå AI på riktigt, inte bli sålda på hype.

Skriv som en kunnig kollega som har testat verktygen själv:
- **Konkret framför generiskt** — "Cursor läser hela kodbasen och föreslår multi-file edits" inte "AI revolutionerar utveckling"
- **Specifika namn, siffror, exempel** — nämn verkliga verktyg, prismodeller, use cases
- **Erkänn nyanser** — om något funkar bra för vissa men illa för andra, säg det
- **Inga svulstiga formuleringar** — undvik "i en värld där...", "framtiden är här", "revolutionerande", "game changer"
- **Inga emojis i brödtexten**
- **Skriv på svenska — naturlig affärssvenska**, inte direktöversatt engelska

# Struktur

Varje guide ska ha tydlig röd tråd från intro → användningsområden → praktiska tips → slutsats. ~2000 ord totalt. Använd:

- En kort intro (1-2 stycken) som etablerar varför AI inom området är värt att förstå just nu
- 3-5 H2-rubriker som markerar huvudsektioner
- H3-underrubriker när det hjälper läsaren skanna
- Bullet-listor när du listar verktyg, kriterier, eller steg
- Konkreta exempel i prosa — visa hur AI används i praktiken
- En avslutande sektion med "Så väljer du" eller "Slutsats" som ger läsaren en handlingsplan

# Länkning till relaterade sidor

Du får en lista över relaterade sidor på sajten. Länka till dem **naturligt i prosan** med Markdown-syntax: \`[Länktext](URL)\`. Länkar ska kännas som hänvisningar inom samma resonemang, inte som "Läs mer här"-uppmaningar. Inkludera 3-6 interna länkar per guide.

# Formatering

Output ska vara **HTML** (inte Markdown) eftersom det renderas via dangerouslySetInnerHTML i magazine-prose. Använd:
- \`<h2>\`, \`<h3>\` för rubriker
- \`<p>\` för stycken
- \`<ul>\`/\`<ol>\` + \`<li>\` för listor
- \`<a href="...">text</a>\` för länkar
- \`<strong>\` för betoning (sparsamt)

# Vad som INTE ska finnas

- Inledningsmeningar som "I dagens snabbt föränderliga AI-landskap..."
- Floskler: "revolutionerar", "game-changer", "unleash the power"
- Generiska listor utan substans ("AI kan hjälpa dig att: spara tid, öka produktiviteten, förbättra kvalitet")
- Korrekturmarkering, slut-summeringar i fetstil, CTA-knappar i texten
- Skriv inte ut H1-rubriken — den finns redan i page-templaten
- Ingen kod-block, ingen \`\`\`html\`\`\`-wrapping — bara ren HTML direkt

Skriv ren HTML direkt — börja med en \`<p>\`-tagg, sluta med en \`<p>\` eller \`<ul>\`-tagg. Inget annat före eller efter.`;

type HubSpec = {
  path: string;
  topic: string;
  audience: string;
  relatedLinks: { url: string; label: string }[];
};

const HUBS: HubSpec[] = [
  {
    path: '/ai-verktyg/ai-text-verktyg',
    topic: 'AI-skrivverktyg för content, marknadsföring och kod',
    audience: 'Marknadsförare, content-skapare, frilansare och småföretagare som vill använda AI för att skriva texter.',
    relatedLinks: [
      { url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT' },
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude' },
      { url: '/ai-verktyg/ai-text-verktyg/gemini', label: 'Gemini' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting', label: 'AI för content & copywriting' },
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
    ],
  },
  {
    path: '/ai-video',
    topic: 'AI-videoverktyg för kreatörer och företag',
    audience: 'Creators, marknadsförare och företag som vill skapa video med AI — från text-till-video, image-to-video och avatarer.',
    relatedLinks: [
      { url: '/ai-video/kling-ai', label: 'Kling AI' },
      { url: '/ai-video/runway-gen-3', label: 'Runway Gen-3' },
      { url: '/ai-video/pika-labs', label: 'Pika Labs' },
      { url: '/ai-video/sora-2', label: 'Sora 2' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier', label: 'AI för sociala medier' },
    ],
  },
  {
    path: '/ai-verktyg/ai-ljud-och-musik',
    topic: 'AI för musik, röst och ljud',
    audience: 'Musiker, podcasters, content-creators och företag som vill generera musik, röster och ljudeffekter med AI.',
    relatedLinks: [
      { url: '/ai-verktyg/ai-ljud-och-musik/suno-ai', label: 'Suno AI' },
      { url: '/ai-verktyg/ai-ljud-och-musik/elevenlabs', label: 'ElevenLabs' },
      { url: '/ai-video', label: 'AI-videoverktyg' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/rost-ai', label: 'AI-röst för kundservice' },
    ],
  },
  {
    path: '/ai-verktyg/ai-kod-verktyg',
    topic: 'AI-kodverktyg för utvecklare',
    audience: 'Utvecklare, tech leads och DevOps som vill öka produktiviteten med AI-assisterad kodning.',
    relatedLinks: [
      { url: '/ai-verktyg/ai-kod-verktyg/cursor-ai', label: 'Cursor' },
      { url: '/ai-verktyg/ai-kod-verktyg/github-copilot', label: 'GitHub Copilot' },
      { url: '/ai-verktyg/ai-kod-verktyg/windsurf', label: 'Windsurf' },
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude' },
      { url: '/ai-verktyg/ai-automation', label: 'AI-automation' },
    ],
  },
  {
    path: '/ai-verktyg/ai-automation',
    topic: 'AI-automation och workflows',
    audience: 'Operations-team, marknadsförare, säljare och utvecklare som vill automatisera repetitiva uppgifter med AI-driva flöden.',
    relatedLinks: [
      { url: '/ai-verktyg/ai-automation/make', label: 'Make' },
      { url: '/ai-verktyg/ai-automation/zapier-ai', label: 'Zapier AI' },
      { url: '/ai-verktyg/ai-automation/n8n', label: 'n8n' },
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
      { url: '/ai-verktyg/foretag', label: 'AI för företag' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/marknadsforing/seo',
    topic: 'AI för SEO — keyword-research, content-briefs, on-page-optimering och länkbyggande',
    audience: 'SEO-specialister, content-strateger och in-house-SEO på svenska bolag.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/seo/chatgpt-seo', label: 'ChatGPT för SEO' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/seo/semrush-ai', label: 'Semrush AI' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/seo/surfer-seo', label: 'Surfer SEO' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting', label: 'AI för content & copywriting' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing', label: 'AI för marknadsföring' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting',
    topic: 'AI för content och copywriting — bloggar, landningssidor, e-post och brand voice',
    audience: 'Content-skribenter, copywriters, marknadsförare och redaktionella team.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting/chatgpt-content', label: 'ChatGPT för content' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting/claude-content', label: 'Claude för content' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting/jasper-content', label: 'Jasper' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/seo', label: 'AI för SEO' },
      { url: '/ai-verktyg/ai-text-verktyg', label: 'AI-skrivverktyg' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/marknadsforing/annonser',
    topic: 'AI för annonser — Meta, Google, TikTok, kreativ AI och performance-optimering',
    audience: 'Performance-marketers, media-byråer, in-house annonsörer och e-handlare.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/annonser/adcreative-ai', label: 'AdCreative.ai' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/annonser/pencil-ai', label: 'Pencil' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/annonser/madgicx', label: 'Madgicx' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier', label: 'AI för sociala medier' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing', label: 'AI för marknadsföring' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier',
    topic: 'AI för sociala medier — schemaläggning, captions, visuell content och analys',
    audience: 'Social media managers, creators, småföretagare och varumärken som lever på sociala medier.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier/hootsuite-ai', label: 'Hootsuite' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier/buffer-ai', label: 'Buffer' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier/predis-ai', label: 'Predis.ai' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/annonser', label: 'AI för annonser' },
      { url: '/ai-video', label: 'AI-videoverktyg' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing',
    topic: 'AI för bokföring — kvittohantering, fakturor, avstämning och småföretagsbokföring',
    audience: 'Småföretagare, ekonomer på SME, frilansare och redovisningskonsulter.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing/fortnox-ai', label: 'Fortnox' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing/visma-ai', label: 'Visma eEkonomi' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing/bokio-ai', label: 'Bokio' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning', label: 'AI för redovisning' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning', label: 'AI för ekonomi & redovisning' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning',
    topic: 'AI för redovisning — månadsbokslut, årsredovisning, revision och byråarbete',
    audience: 'Redovisningskonsulter, revisorer, controllers och byråägare.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning/fortnox-redovisning', label: 'Fortnox Redovisning' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning/xero-ai', label: 'Xero' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning/kpmg-ai', label: 'KPMG' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing', label: 'AI för bokföring' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning', label: 'AI för ekonomi & redovisning' },
    ],
  },
];

async function generate(hub: HubSpec): Promise<{ html: string; usage: Anthropic.Usage }> {
  const userPrompt = [
    `Hubsida: ${hub.path}`,
    `Ämne: ${hub.topic}`,
    `Målgrupp: ${hub.audience}`,
    '',
    'Relaterade sidor att länka till naturligt i prosan (Markdown-länksyntax i HTML):',
    ...hub.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    'Skriv guide-texten nu. ~2000 ord, ren HTML, börja med första <p>-taggen.',
  ].join('\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const html = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  return { html, usage: response.usage };
}

async function persist(path: string, html: string): Promise<number> {
  const { data, error } = await supabase
    .from('articles')
    .update({ content_mdx: html })
    .eq('path', path)
    .select('id');
  if (error) throw new Error(`supabase update ${path}: ${error.message}`);
  return data?.length ?? 0;
}

async function main() {
  console.log(`Generating ${HUBS.length} guide articles with ${MODEL}…\n`);
  let totalInput = 0, totalCacheRead = 0, totalCacheWrite = 0, totalOutput = 0;

  for (let i = 0; i < HUBS.length; i++) {
    const hub = HUBS[i];
    const t0 = Date.now();
    try {
      const { html, usage } = await generate(hub);
      const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const rowsUpdated = await persist(hub.path, html);
      const dt = Date.now() - t0;
      console.log(
        `[${i + 1}/${HUBS.length}] ${hub.path}` +
        `  ${wordCount} words  ${(dt / 1000).toFixed(1)}s  ` +
        `cache_read=${usage.cache_read_input_tokens ?? 0}  ` +
        `cache_write=${usage.cache_creation_input_tokens ?? 0}  ` +
        `output=${usage.output_tokens}  ` +
        `rows=${rowsUpdated}`
      );
      totalInput += usage.input_tokens;
      totalCacheRead += usage.cache_read_input_tokens ?? 0;
      totalCacheWrite += usage.cache_creation_input_tokens ?? 0;
      totalOutput += usage.output_tokens;
    } catch (e) {
      console.error(`[${i + 1}/${HUBS.length}] ${hub.path} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(
    `\nTotal: input=${totalInput}  cache_read=${totalCacheRead}  ` +
    `cache_write=${totalCacheWrite}  output=${totalOutput}`
  );
}

main();
