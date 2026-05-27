/**
 * Seed 6 /ai-guiden/[slug] DB rows AND generate guide-text for each via
 * Claude API in the same pass. Idempotent — upserts on path.
 *
 * Run: npx tsx scripts/seed-ai-guiden.ts
 *
 * Rows have parent_slug='ai-guiden' and type='page' so classify() routes
 * depth-2 /ai-guiden/* paths to StandalonePageTemplate (siblings fill the
 * sidebar via the fall-through path in [...slug]/page.tsx).
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

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Din uppgift är att skriva pedagogiska guide-artiklar för AI-Magasinets nybörjar-guide (/ai-guiden).

# Tonalitet och röst

AI-Magasinets röst är **expert, rak och praktisk** — inte "AI-ig". Du skriver för svenska läsare som vill förstå AI utan att bli sålda på hype. Skriv som en kunnig kollega som förklarar tydligt, inte som en marknadsavdelning som vill sälja in framtiden.

Konkret framför generiskt:
- "Stora språkmodeller tränas på text via gradient descent och autoregressiv prediktion" — inte "AI lär sig som en hjärna"
- **Specifika namn, siffror, exempel** — nämn verkliga modeller (GPT-5, Claude Opus 4.7, Gemini 2.5), prisnivåer, use cases
- **Erkänn nyanser och begränsningar** — om något bara funkar bra för vissa, säg det
- **Inga svulstiga formuleringar** — undvik "i en värld där...", "framtiden är här", "revolutionerande", "game changer"
- **Inga emojis i brödtexten**
- **Skriv på svenska — naturlig affärssvenska**, inte direktöversatt engelska

# Pedagogisk approach

Den här guiden är för läsare som **inte** är AI-experter. Det betyder:
- Förklara begrepp första gången de används (inte i fotnot — i meningen)
- Använd analogier sparsamt och bara när de faktiskt klargör (ingen "AI är som en hjärna"-floskel)
- Visa hellre genom exempel än genom abstrakt teori
- En tydlig progression från enkelt till komplext

# Struktur

Varje guide ska ha tydlig röd tråd från intro → grundbegrepp → praktiska exempel → avslutning. ~1500 ord (vissa kan vara längre om ämnet kräver det). Använd:

- En kort intro (1-2 stycken) som etablerar varför just det här ämnet är relevant för svenska läsare just nu
- 4-6 H2-rubriker som markerar huvudsektioner med pedagogisk progression
- H3-underrubriker när det hjälper läsaren skanna
- Bullet-listor när du listar typer, exempel, eller steg
- Konkreta exempel i prosa — visa hur saker fungerar i praktiken
- En avslutande sektion ("Så går du vidare", "Nästa steg" eller "Slutsats") med konkreta handlingsalternativ

# Länkning till relaterade sidor

Du får en lista över relaterade sidor på sajten. Länka till dem **naturligt i prosan** med Markdown-syntax: \`[Länktext](URL)\`. Länkar ska kännas som hänvisningar inom samma resonemang, inte som "Läs mer här"-uppmaningar. Inkludera 3-6 interna länkar per guide.

# Formatering

Output ska vara **HTML** (inte Markdown). Använd:
- \`<h2>\`, \`<h3>\` för rubriker
- \`<p>\` för stycken
- \`<ul>\`/\`<ol>\` + \`<li>\` för listor
- \`<a href="...">text</a>\` för länkar
- \`<strong>\` för betoning (sparsamt)

# Vad som INTE ska finnas

- Inledningsmeningar som "I dagens snabbt föränderliga AI-landskap..."
- Floskler: "revolutionerar", "game-changer", "unleash the power"
- Skriv inte ut H1-rubriken — den finns redan i page-templaten
- Ingen kod-block-wrapping (\`\`\`html\`\`\`), bara ren HTML direkt
- Inga callouts som "TL;DR:" eller "Pro tip:" — skriv ut det rakt i prosan

Skriv ren HTML direkt — börja med en \`<p>\`-tagg, sluta med en \`<p>\` eller \`<ul>\`-tagg. Inget annat före eller efter.`;

type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  audience: string;
  wordTarget: number;
  relatedLinks: { url: string; label: string }[];
};

const GUIDES: Guide[] = [
  {
    slug: 'vad-ar-ai',
    title: 'Vad är AI? — Komplett guide för svenska läsare 2026',
    excerpt: 'En tydlig förklaring av vad artificiell intelligens faktiskt är, hur det fungerar och varför 2026 är året då AI går från experiment till verktyg.',
    topic: 'Vad är AI? Grundläggande genomgång av vad artificiell intelligens är, vilka olika typer av AI som finns (narrow vs general, ML vs LLM), hur LLM:er som ChatGPT/Claude/Gemini fungerar i grova drag, och konkreta exempel för svenska användare. Förklara skillnaden mellan AI som vi pratar om idag (generativ AI, LLM) och äldre former (rule-based, expertsystem).',
    audience: 'Svenska läsare som vill förstå AI på riktigt — företagare, anställda, studenter, intresserade.',
    wordTarget: 2000,
    relatedLinks: [
      { url: '/ai-guiden/hur-fungerar-ai', label: 'Hur fungerar AI?' },
      { url: '/ai-guiden/komma-igang-med-ai', label: 'Komma igång med AI' },
      { url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT' },
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude' },
      { url: '/ai-verktyg', label: 'AI-verktyg' },
    ],
  },
  {
    slug: 'hur-fungerar-ai',
    title: 'Hur fungerar AI? — Tekniken bakom moderna AI-modeller',
    excerpt: 'Neurala nätverk, transformers, träning och inferens — så fungerar AI-modellerna som driver ChatGPT, Claude och Gemini under huven.',
    topic: 'Hur fungerar AI? Teknisk men begriplig genomgång: neurala nätverk på en nivå som icke-ingenjörer förstår, transformer-arkitekturen och varför den var ett genombrott, träning vs inferens, vad tokens är, vad embeddings är, hur RLHF (reinforcement learning from human feedback) formar modellerna, och varför modeller hallucinerar. Inkludera kort om varför GPU/TPU spelar roll och varför träning kostar miljoner.',
    audience: 'Utvecklare, tekniskt nyfikna, studenter och alla som vill förstå AI bortom marknadsföringen.',
    wordTarget: 1500,
    relatedLinks: [
      { url: '/ai-guiden/vad-ar-ai', label: 'Vad är AI?' },
      { url: '/ai-guiden/prompta-battre', label: 'Prompta bättre' },
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
      { url: '/ai-guiden/framtidens-ai', label: 'Framtidens AI' },
    ],
  },
  {
    slug: 'komma-igang-med-ai',
    title: 'Komma igång med AI — Nybörjarguide steg för steg',
    excerpt: 'En praktisk steg-för-steg-guide för dig som vill börja använda AI-verktyg. Vilket verktyg, hur du skapar konto, och dina första prompter.',
    topic: 'Komma igång med AI för absoluta nybörjare. Vilket verktyg att börja med (ChatGPT, Claude, Gemini — för- och nackdelar), hur du skapar konto, gratis vs betalt (när är det värt att uppgradera), grunderna i att skriva en första prompt, vanliga misstag nybörjare gör (för vaga prompter, ber om för mycket på en gång), och 5-7 konkreta use cases att testa direkt (sammanfatta en text, översätt, hjälp med mejl, brainstorming, översätt teknisk text).',
    audience: 'Absoluta nybörjare som aldrig använt AI-verktyg innan men vill lära sig.',
    wordTarget: 1500,
    relatedLinks: [
      { url: '/ai-guiden/vad-ar-ai', label: 'Vad är AI?' },
      { url: '/ai-guiden/prompta-battre', label: 'Prompta bättre' },
      { url: '/ai-verktyg/ai-text-verktyg', label: 'AI-skrivverktyg' },
      { url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT' },
      { url: '/ai-guiden/ai-pa-jobbet', label: 'AI på jobbet' },
    ],
  },
  {
    slug: 'prompta-battre',
    title: 'Prompta bättre — Prompt engineering för svenska användare',
    excerpt: 'Så får du AI-verktygen att leverera det du faktiskt vill ha. Tekniker, mallar och konkreta exempel för bättre prompter på svenska.',
    topic: 'Prompt engineering på praktisk nivå. Vad gör en bra prompt: specificitet, kontext, format, exempel. Tekniker: role-prompting ("Du är en SEO-expert..."), few-shot (visa exempel på vad du vill), chain-of-thought (be modellen tänka steg för steg), output format-specifikation. Vanliga fallgropar på svenska (be aldrig "skriv kort" utan ord-limit, var konkret om ton). Inkludera 4-6 färdiga mall-prompter för vanliga use cases.',
    audience: 'Användare som redan testat AI-verktyg men vill få bättre resultat.',
    wordTarget: 1500,
    relatedLinks: [
      { url: '/ai-guiden/komma-igang-med-ai', label: 'Komma igång med AI' },
      { url: '/ai-guiden/vad-ar-ai', label: 'Vad är AI?' },
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude' },
      { url: '/ai-guiden/ai-pa-jobbet', label: 'AI på jobbet' },
    ],
  },
  {
    slug: 'ai-pa-jobbet',
    title: 'AI på jobbet — Produktivitet och konkret användning 2026',
    excerpt: 'Hur svenska medarbetare faktiskt använder AI för att spara tid på mejl, möten, rapporter och beslutsstöd. Konkreta exempel per yrkesroll.',
    topic: 'AI på jobbet — konkreta produktivitetsanvändningar. Hur svenska anställda använder AI i vardagen: skriva mejl och svar, sammanfatta långa rapporter, transkribera och summera möten, brainstorming, generera utkast, översätta, läsa kontrakt, dataanalys i Excel/Sheets, koda snabbare. Per-yrke kort: marknadsförare, säljare, ekonomer, HR, utvecklare, jurister. GDPR och datasäkerhet — vad inte ska klistras in i ChatGPT.',
    audience: 'Anställda och chefer som vill veta hur de använder AI på riktigt i jobbet.',
    wordTarget: 1500,
    relatedLinks: [
      { url: '/ai-guiden/prompta-battre', label: 'Prompta bättre' },
      { url: '/ai-verktyg/foretag', label: 'AI för företag' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing', label: 'AI för marknadsföring' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning', label: 'AI för ekonomi & redovisning' },
      { url: '/ai-verktyg/ai-automation', label: 'AI-automation' },
    ],
  },
  {
    slug: 'framtidens-ai',
    title: 'Framtidens AI — Trender och vad som händer 2026-2028',
    excerpt: 'AI-agenter, multimodal AI, reglering och de förändringar som faktiskt kommer påverka svenska företag och anställda under de närmaste åren.',
    topic: 'Framtidens AI på 12-36 månaders sikt. AI-agenter (Claude Code, Devin, Cursor agents) — vad de kan idag och vart de är på väg. Multimodal AI (text+bild+video+ljud i samma modell). AI-reglering: EU AI Act och vad det betyder för svenska företag, GDPR-konflikter, kommande svenska riktlinjer. Edge AI och on-device-modeller. AI-säkerhet och alignment-frågor (utan att bli science fiction). Vad detta betyder konkret för olika yrken på 3 års sikt. Vad du borde lära dig nu för att hänga med.',
    audience: 'Beslutsfattare, chefer, strateger och kunniga läsare som vill förstå trenderna.',
    wordTarget: 1500,
    relatedLinks: [
      { url: '/ai-guiden/vad-ar-ai', label: 'Vad är AI?' },
      { url: '/ai-guiden/hur-fungerar-ai', label: 'Hur fungerar AI?' },
      { url: '/ai-verktyg/ai-automation', label: 'AI-automation' },
      { url: '/kategori/ai-sakerhet', label: 'AI-säkerhet' },
      { url: '/ai-verktyg', label: 'AI-verktyg' },
    ],
  },
];

async function generate(g: Guide): Promise<{ html: string; usage: Anthropic.Usage }> {
  const userPrompt = [
    `Guide-sida: /ai-guiden/${g.slug}`,
    `Titel: ${g.title}`,
    `Ämne: ${g.topic}`,
    `Målgrupp: ${g.audience}`,
    `Mål-längd: ~${g.wordTarget} ord`,
    '',
    'Relaterade sidor att länka till naturligt i prosan:',
    ...g.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    `Skriv guiden nu. ~${g.wordTarget} ord, ren HTML, börja med första <p>-taggen.`,
  ].join('\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: g.wordTarget >= 1800 ? 10000 : 7000,
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
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

async function main() {
  console.log(`Generating + seeding ${GUIDES.length} /ai-guiden/* articles…\n`);
  let totalIn = 0, totalCacheR = 0, totalCacheW = 0, totalOut = 0;

  for (let i = 0; i < GUIDES.length; i++) {
    const g = GUIDES[i];
    const t0 = Date.now();
    try {
      const { html, usage } = await generate(g);
      const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

      const row = {
        slug: g.slug,
        title: g.title,
        excerpt: g.excerpt,
        content_mdx: html,
        category: null,
        tags: [] as string[],
        featured_image: null,
        type: 'page',
        path: `/ai-guiden/${g.slug}`,
        parent_slug: 'ai-guiden',
        affiliate_url: null,
        published_at: new Date().toISOString(),
        seo_title: null,
        seo_description: null,
      };

      const { error } = await db.from('articles').upsert([row], { onConflict: 'path' });
      if (error) throw new Error(`upsert: ${error.message}`);

      const dt = Date.now() - t0;
      console.log(
        `[${i + 1}/${GUIDES.length}] /ai-guiden/${g.slug}` +
        `  ${wordCount} words  ${(dt / 1000).toFixed(1)}s  ` +
        `cache_read=${usage.cache_read_input_tokens ?? 0}  ` +
        `output=${usage.output_tokens}`
      );
      totalIn += usage.input_tokens;
      totalCacheR += usage.cache_read_input_tokens ?? 0;
      totalCacheW += usage.cache_creation_input_tokens ?? 0;
      totalOut += usage.output_tokens;
    } catch (e) {
      console.error(`[${i + 1}/${GUIDES.length}] /ai-guiden/${g.slug} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(
    `\nTotal: input=${totalIn}  cache_read=${totalCacheR}  ` +
    `cache_write=${totalCacheW}  output=${totalOut}`
  );
}

main();
