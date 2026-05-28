/**
 * One-shot builder for the /ai-verktyg/ai-bild-verktyg topplista + its
 * 10 review pages + the 3 /ai-verktyg/gratis subpages.
 *
 *   npx tsx scripts/build-bild-verktyg-and-gratis.ts
 *
 * Each section calls Claude Sonnet 4.6. All calls share a single
 * cached system prompt so calls 2..N read from prompt cache.
 *
 * Idempotent — upserts on path. The reviews use rich KNOWN-style
 * metadata in the prompt so the generated content_mdx mirrors the
 * hub-template look (ratings, pros/cons, pricing) without needing
 * REVIEW_KNOWN entries in code.
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

/* ─── Shared system prompt ──────────────────────────────────── */

const SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens.

# Tonalitet
Expert, rak, praktisk svenska. Skriv som en kunnig kollega som har testat verktygen själv. Inga floskler. Inga emojis. Konkreta verktygsnamn, priser och use cases.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3> för rubriker, <p> för stycken, <ul>/<ol>+<li> för listor, <a href> för länkar, <strong> sparsamt.`;

async function generate(userPrompt: string): Promise<{ html: string; usage: Anthropic.Usage }> {
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  const html = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  return { html, usage: res.usage };
}

/* ─── Bild-verktyg reviews ──────────────────────────────────── */

type ToolSpec = {
  slug: string;
  brand: string;
  company: string;
  founded: number;
  hq: string;
  score: number;
  fallbackUrl: string;
  oneliner: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  bestFor: string;
  tags: string[];
};

const TOOLS: ToolSpec[] = [
  {
    slug: 'midjourney', brand: 'Midjourney', company: 'Midjourney Inc.', founded: 2022, hq: 'San Francisco, USA',
    score: 9.4, fallbackUrl: 'https://www.midjourney.com',
    oneliner: 'Branschledande på estetisk kvalitet, särskilt för konstnärlig och stiliserad bildgenerering.',
    strengths: ['Marknadens vackraste output by default', 'Stark stil-koherens', 'v6/v7 löste händer + text-rendering'],
    weaknesses: ['Discord-/web-only UI', 'Pris hoppar snabbt vid hög volym'],
    pricing: 'Basic 10 USD/mån (200 bilder), Standard 30, Pro 60, Mega 120.',
    bestFor: 'Designers, illustratörer och creators som värdesätter estetik framför precision',
    tags: ['Stil', 'Estetik', 'Discord', 'v7'],
  },
  {
    slug: 'dalle-3', brand: 'DALL-E 3', company: 'OpenAI', founded: 2015, hq: 'San Francisco, USA',
    score: 9.0, fallbackUrl: 'https://openai.com/dall-e-3',
    oneliner: 'OpenAIs bildmodell med marknadens bästa prompt-följsamhet och text-rendering.',
    strengths: ['Förstår komplicerade prompts bäst', 'Klockren text-i-bild-rendering', 'ChatGPT-integration'],
    weaknesses: ['Mindre stilistisk variation än Midjourney', 'Strikta content-filter'],
    pricing: 'Gratis 3 bilder/dag i ChatGPT Free; Plus 20 USD/mån för full access; API från 0.04 USD/bild.',
    bestFor: 'Marknadsförare och content-skapare som behöver text och tydliga koncept',
    tags: ['Text-i-bild', 'ChatGPT', 'Prompt-följsam'],
  },
  {
    slug: 'adobe-firefly', brand: 'Adobe Firefly', company: 'Adobe', founded: 1982, hq: 'San Jose, USA',
    score: 8.7, fallbackUrl: 'https://www.adobe.com/products/firefly.html',
    oneliner: 'Kommersiellt säker AI-bild tränad enbart på Adobe Stock + public domain — integrerad i hela Creative Cloud.',
    strengths: ['Kommersiellt fri output (Adobe står bakom)', 'Generative Fill direkt i Photoshop', 'CC-integration'],
    weaknesses: ['Mindre kreativ än Midjourney', 'Kräver Adobe-prenumeration för bästa upplevelsen'],
    pricing: 'Free med 25 credits/mån; Premium 5 USD/mån eller ingår i Creative Cloud (60 USD/mån).',
    bestFor: 'Företag och byråer som behöver juridiskt säker AI-bild',
    tags: ['Kommersiellt säker', 'Photoshop', 'Generative Fill', 'Adobe'],
  },
  {
    slug: 'stable-diffusion', brand: 'Stable Diffusion', company: 'Stability AI', founded: 2020, hq: 'London, UK',
    score: 8.7, fallbackUrl: 'https://stability.ai',
    oneliner: 'Open-source-bildmodellen som du kör helt gratis lokalt eller via webb-UI — total kontroll, brant kurva.',
    strengths: ['Open source — total kontroll', 'LoRA/ControlNet/finetuning', 'Helt gratis lokalt'],
    weaknesses: ['Kräver GPU för rimligt tempo', 'Brant inlärningskurva'],
    pricing: 'Helt gratis open source. DreamStudio från 10 USD för molnkrediter.',
    bestFor: 'Tekniska kreatörer och utvecklare som vill ha full kontroll',
    tags: ['Open source', 'LoRA', 'ComfyUI', 'Lokal'],
  },
  {
    slug: 'leonardo-ai', brand: 'Leonardo AI', company: 'Leonardo Interactive', founded: 2022, hq: 'Sydney, Australien',
    score: 8.4, fallbackUrl: 'https://leonardo.ai',
    oneliner: 'Stable Diffusion-baserad plattform med UI och finetune-modeller specialiserade för game art och koncept.',
    strengths: ['150 gratis tokens/dag', 'Game asset-modeller out-of-the-box', 'Bra UI för icke-tekniska'],
    weaknesses: ['Mindre språkförståelse än Midjourney', 'Daglig kvot tunn för proffsbruk'],
    pricing: 'Gratis 150 tokens/dag; Apprentice 12 USD/mån; Artisan 30; Maestro 60.',
    bestFor: 'Game-utvecklare, illustratörer och koncept-designers',
    tags: ['Game art', 'Koncept', 'SD-baserad', 'Gratis tokens'],
  },
  {
    slug: 'canva-ai', brand: 'Canva AI (Magic Studio)', company: 'Canva', founded: 2013, hq: 'Sydney, Australien',
    score: 8.2, fallbackUrl: 'https://www.canva.com/ai-image-generator',
    oneliner: 'Canvas inbyggda AI-bildgenerator — perfekt för SoMe-content och icke-designers som redan kör Canva.',
    strengths: ['Sömlös Canva-integration', 'Bäst för icke-designers', 'Magic Edit + bakgrunds-AI'],
    weaknesses: ['Smalt kreativt utrymme', 'Lägre bildkvalitet än Midjourney'],
    pricing: 'Gratis 50 generationer; Pro 12 USD/mån (500/mån); Teams 27 USD.',
    bestFor: 'Småföretagare, social media-team och presentationsskapare',
    tags: ['Canva', 'SoMe', 'Mallar', 'Icke-designer'],
  },
  {
    slug: 'bing-image-creator', brand: 'Bing Image Creator', company: 'Microsoft', founded: 1975, hq: 'Redmond, USA',
    score: 8.0, fallbackUrl: 'https://www.bing.com/create',
    oneliner: 'Microsofts gratis DALL-E 3-portal — samma motor som ChatGPT Plus men helt utan kostnad.',
    strengths: ['Helt gratis DALL-E 3', 'Inga grafikkort krävs', 'Microsoft-konto räcker'],
    weaknesses: ['Långsamt vid hög belastning', 'Strängare content-filter än ChatGPT'],
    pricing: 'Gratis (Microsoft-konto). 15 "boosts" per dag, sedan långsammare generering.',
    bestFor: 'Användare som vill testa DALL-E 3 utan att betala',
    tags: ['Gratis', 'DALL-E 3', 'Microsoft', 'Bing'],
  },
  {
    slug: 'ideogram', brand: 'Ideogram', company: 'Ideogram', founded: 2023, hq: 'Toronto, Kanada',
    score: 8.6, fallbackUrl: 'https://ideogram.ai',
    oneliner: 'Specialiserad på korrekt text-rendering i bilder — bäst för affischer, logotyper och meme-bilder.',
    strengths: ['Marknadens bästa text-i-bild', 'Stark typografisk koherens', 'Generös gratis tier'],
    weaknesses: ['Smalare än konkurrenter på rena scener', 'Yngre produkt'],
    pricing: 'Free 10 bilder/dag; Plus 8 USD/mån; Pro 20.',
    bestFor: 'Designers som behöver text-i-bild eller poster-grafik',
    tags: ['Text-i-bild', 'Affischer', 'Typografi', 'Gratis tier'],
  },
  {
    slug: 'flux', brand: 'Flux', company: 'Black Forest Labs', founded: 2024, hq: 'Tyskland',
    score: 9.1, fallbackUrl: 'https://blackforestlabs.ai',
    oneliner: 'Stable Diffusions skapare i ett nytt bolag — modellen som tog över open-source-tronen 2024-2025.',
    strengths: ['Topp-1 i open-source-benchmarks', 'Fotorealism i klass med Midjourney v6', 'Snabb inferens'],
    weaknesses: ['Inget native UI — kör via fal.ai, ComfyUI eller Replicate', 'Pris per generation'],
    pricing: 'Pay-per-use via fal.ai/Replicate (~0.04 USD/bild för Pro). Schnell-modellen är open source.',
    bestFor: 'Tekniska användare och creators som vill ha topp open-source-kvalitet',
    tags: ['Open source', 'Fotorealism', 'fal.ai', 'Schnell'],
  },
  {
    slug: 'playground-ai', brand: 'Playground AI', company: 'Playground', founded: 2022, hq: 'San Francisco, USA',
    score: 7.8, fallbackUrl: 'https://playground.com',
    oneliner: 'Webbplattform med eget UI ovanpå flera modeller (SD, Playground v3) — bra för fritt experimenterande.',
    strengths: ['Generös gratis-tier (500/dag)', 'Inbyggd editor + canvas', 'Stöd för flera modeller'],
    weaknesses: ['Mindre community än konkurrenter', 'Output ojämnt'],
    pricing: 'Free 500 bilder/dag; Pro 15 USD/mån; Pro+ 30.',
    bestFor: 'Hobbyanvändare och creators som vill experimentera mycket gratis',
    tags: ['Gratis volym', 'Editor', 'Multi-modell', 'Experiment'],
  },
];

async function generateReview(t: ToolSpec): Promise<string> {
  const prompt = [
    `Skriv en AI-Magasinet-recension av AI-bildverktyget "${t.brand}".`,
    '',
    `Företag: ${t.company} (grundat ${t.founded}, ${t.hq})`,
    `Vårt betyg: ${t.score}/10 — "${t.oneliner}"`,
    `Bäst för: ${t.bestFor}`,
    `Prismodell: ${t.pricing}`,
    'Styrkor: ' + t.strengths.join(' · '),
    'Svagheter: ' + t.weaknesses.join(' · '),
    'Taggar: ' + t.tags.join(', '),
    '',
    'Struktur (~700 ord):',
    `- <h2>Vår analys av ${t.brand}</h2> — 2 stycken om vad ${t.brand} faktiskt är och varför vårt betyg landar där det gör. Nämn alltid betyget och vem verktyget passar bäst för.`,
    `- <h2>Funktioner som spelar roll</h2> — bullet-list med 4-6 konkreta funktioner ${t.brand} har som faktiskt skiljer det från konkurrenter`,
    `- <h2>Användningsområden</h2> — bullet-list med 4-5 praktiska use cases på svenska`,
    `- <h2>Styrkor</h2> — bullet-list, expandera styrkorna ovan med 1 mening per punkt`,
    `- <h2>Svagheter</h2> — bullet-list, expandera svagheterna ovan med 1 mening per punkt`,
    `- <h2>Vem passar ${t.brand} för?</h2> — kort stycke om idealisk användare + varför`,
    `- <h2>Prismodell</h2> — kort stycke med pris, prisexempel och om gratis-tier finns`,
    `- <h2>Slutsats</h2> — 1-2 stycken med ${t.brand}s placering på sajten och rekommendation`,
    '',
    'Länka 1-2 av dessa naturligt i prosan (HTML <a href>):',
    `- /ai-verktyg/ai-bild-verktyg — hela bild-topplistan`,
    `- /ai-verktyg/gratis/ai-bilder — gratis bildverktyg`,
    '',
    'Skriv recensionen nu. Ren HTML, börja med första <p>-tagg eller <h2>.',
  ].join('\n');

  const { html } = await generate(prompt);
  return html;
}

async function generateHubGuide(): Promise<string> {
  const prompt = [
    'Skriv en uppdaterad hub-guide för /ai-verktyg/ai-bild-verktyg/ (~1500 ord).',
    '',
    'Sidan är topplistan över de 10 bästa AI-bildverktygen 2026 enligt AI-Magasinet:',
    ...TOOLS.map((t) => `- ${t.brand} (${t.score}/10) — ${t.oneliner}`),
    '',
    'Struktur:',
    '- Intro (1-2 stycken) — varför 2026 är annorlunda från 2024 (fotorealism löst, text-rendering löst, kommersiella licenser klarare)',
    '- <h2>Så valde vi de bästa AI-bildverktygen</h2> — kort om testmetodik',
    '- <h2>Snabbjämförelse: vilket verktyg passar dig?</h2> — bullet-list med "Om du..." → "välj X"',
    '- <h2>Bildkvalitet — vem genererar vackrast?</h2> — diskussion om kvalitetsskillnader',
    '- <h2>Stil och kontroll</h2> — hur tools skiljer sig på stilistisk kontroll',
    '- <h2>Användningsområden</h2> — koncept-art, marknadsföring, SoMe, foto-replacement, design',
    '- <h2>Kommersiell användning och rättigheter</h2> — vad gäller för olika verktyg (Adobe Firefly vs Midjourney etc)',
    '- <h2>Gratis vs betalt</h2> — vilka gratis-tiers som faktiskt funkar',
    '- <h2>Vanliga fallgropar</h2> — copyright, AI-disclosure, hallucinationer',
    '- Avsluta med <h2>Så kommer du igång</h2>',
    '',
    'Länka 4-6 av dessa naturligt i prosan med HTML <a href>:',
    '- /ai-verktyg/ai-bild-verktyg/midjourney — Midjourney-recension',
    '- /ai-verktyg/ai-bild-verktyg/dalle-3 — DALL-E 3-recension',
    '- /ai-verktyg/ai-bild-verktyg/adobe-firefly — Adobe Firefly-recension',
    '- /ai-verktyg/ai-bild-verktyg/flux — Flux-recension',
    '- /ai-verktyg/gratis/ai-bilder — Gratis bildverktyg',
    '- /ai-video — AI-videoverktyg',
    '',
    'Skriv guiden nu. Ren HTML, börja med första <p>-taggen.',
  ].join('\n');
  const { html } = await generate(prompt);
  return html;
}

/* ─── Gratis subpages ────────────────────────────────────────── */

type GratisSpec = {
  slug: string;          // path segment under /ai-verktyg/gratis/
  title: string;
  excerpt: string;
  brief: string;
};

const GRATIS: GratisSpec[] = [
  {
    slug: 'ai-text',
    title: 'Gratis AI-textverktyg — Jämför ChatGPT, Claude & Gemini 2026',
    excerpt: 'Vad du faktiskt får gratis på ChatGPT, Claude och Gemini 2026 — begränsningar, tips att maximera utan att betala.',
    brief: `Skriv en unik gratis-vinklad guide (~1500 ord) om gratis AI-textverktyg. Fokus är 100% på GRATIS-användning — inte att duplicera huvud-hubben /ai-verktyg/ai-text-verktyg/.

Struktur:
- Intro: 2025-2026 är gratis-tier-eran. ChatGPT, Claude och Gemini ger nu nästan flagghip-modeller gratis — om man vet begränsningarna.
- <h2>Vad du faktiskt får gratis i varje verktyg</h2> — konkret tabellliknande genomgång:
  * ChatGPT Free: GPT-5 light, dygnsbegränsning, custom GPTs ja, bilder ja
  * Claude Free: Sonnet 4.6, lägre dygnsgräns, 5 PDF-uppladdningar
  * Gemini Free: 2.5 Flash, generös kvot, Google-integration
- <h2>Begränsningar att känna till</h2> — meddelandegränser per timme/dag, modell-downgrade efter X meddelanden, prioriterad åtkomst förbehållet Plus
- <h2>Så maximerar du gratis-användningen</h2> — sparsam prompt-design, batcha frågor, växla mellan tjänsterna, lokal modell som backup
- <h2>När är det dags att uppgradera?</h2> — konkreta scenarier för Plus/Pro/Advanced (~$20/mån)
- <h2>Alternativ utanför Big 3</h2> — DeepSeek (helt gratis), Mistral Le Chat (EU-baserat), Perplexity (sök-AI), Microsoft Copilot (gratis DALL-E 3)
- <h2>Open source-alternativ för helt gratis</h2> — Llama 3.3 via Ollama lokalt, för dig som vill ha total kontroll
- Avsluta med <h2>Vår rekommendation 2026</h2>

Länka naturligt till /ai-verktyg/ai-text-verktyg/, /ai-verktyg/gratis/, /ai-verktyg/ai-text-verktyg/chatgpt/, /ai-verktyg/ai-text-verktyg/claude/`,
  },
  {
    slug: 'ai-bilder',
    title: 'Gratis AI-bildverktyg — Skapa AI-bilder utan att betala 2026',
    excerpt: 'Bing Image Creator, Leonardo AI och Playground AI — gratis bildgeneratorer som faktiskt funkar. Jämför kvot, kvalitet och begränsningar.',
    brief: `Skriv en unik gratis-vinklad guide (~1500 ord) om gratis AI-bildverktyg. Fokus 100% på GRATIS — inte duplicera /ai-verktyg/ai-bild-verktyg/.

Struktur:
- Intro: AI-bilder gratis 2026 — Microsoft ger bort DALL-E 3, Leonardo ger 150 tokens/dag, Playground har 500. Frågan är inte längre om du kan generera AI-bilder utan kostnad, utan vilken kombo som ger bäst resultat.
- <h2>Tre gratis-alternativ som ger verkligt värde</h2>:
  * Bing Image Creator (gratis DALL-E 3 via Microsoft-konto)
  * Leonardo AI (150 tokens/dag, specialiserade modeller)
  * Playground AI (500 bilder/dag, inbyggd editor)
- <h2>Begränsningar att känna till</h2> — dygnsskvotor, vattenstämplar, content-policy, kommersiell användning (de flesta gratis-tiers förbjuder eller villkorar kommersiell användning)
- <h2>Open source: helt gratis och obegränsat (om du har en GPU)</h2> — Stable Diffusion via ComfyUI/Forge/Fooocus, Flux Schnell open weights, lokal körning på RTX 30/40-serien
- <h2>Så maximerar du gratis-kvoten över flera tjänster</h2> — batchstrategier, vilka tjänster passar för vilka use cases (Bing = text-i-bild, Leonardo = game art, Playground = experimentell)
- <h2>När är gratis inte tillräckligt?</h2> — när Midjourney/DALL-E 3 Pro/Firefly Premium är värt pengarna
- <h2>Vanliga frågor om gratis-användning</h2> — kommersiell användning, copyright på AI-bilder, kreditering
- Avsluta med <h2>Vår 2026-stack för gratis AI-bilder</h2>

Länka naturligt till /ai-verktyg/ai-bild-verktyg/, /ai-verktyg/gratis/, /ai-verktyg/ai-bild-verktyg/midjourney/, /ai-verktyg/ai-bild-verktyg/stable-diffusion/`,
  },
  {
    slug: 'ai-kod',
    title: 'Gratis AI-kodverktyg — Cursor, Copilot & Codeium 2026',
    excerpt: 'GitHub Copilot gratis för studenter och OS-utvecklare, Codeium 100% gratis, Replit-AI med generös gratis-tier. Komplett genomgång.',
    brief: `Skriv en unik gratis-vinklad guide (~1500 ord) om gratis AI-kodverktyg. Fokus 100% på GRATIS-användning — inte duplicera /ai-verktyg/ai-kod-verktyg/.

Struktur:
- Intro: AI-kod gratis 2026 — Codeium ger flagship-features helt gratis till individer, GitHub Copilot är gratis för studenter och open source-bidragsgivare, Cursor och Windsurf har generösa gratis-tiers. Du behöver inte längre betala för att komma igång.
- <h2>Tre verktyg som ger verkligt värde gratis</h2>:
  * Codeium (helt gratis, alla features, alla språk)
  * GitHub Copilot Free (autocomplete + chat, gratis till studenter/OS-bidragsgivare)
  * Cursor Free / Windsurf Free (begränsade Claude/GPT-anrop, generös autocomplete)
- <h2>Begränsningar att känna till</h2> — månadsgräns på premium-modeller, autocomplete är ofta unlimited men chat-anropen räknas, vilka modeller du faktiskt får tillgång till
- <h2>Studentrabatt och open-source-program</h2> — GitHub Education-paketet (Copilot + Notion + Vercel + mer), JetBrains AI gratis för studenter
- <h2>Replit AI Free</h2> — molnbaserad IDE med inbyggd AI, gratis tier för småprojekt
- <h2>Helt lokal AI-kod</h2> — Continue.dev + Ollama (Llama 3, DeepSeek Coder, Qwen Coder), Tabby self-hosted för team
- <h2>Så väljer du mellan gratis-verktygen</h2> — flowchart-style: "Är du student?" → Copilot Free. "Vill du ha unlimited chat?" → Codeium. "Vill du ha Claude/GPT-4?" → Cursor Free (begränsad). "Vill du köra lokalt?" → Continue.dev
- Avsluta med <h2>Vår 2026-stack för gratis AI-kod</h2>

Länka naturligt till /ai-verktyg/ai-kod-verktyg/, /ai-verktyg/gratis/, /ai-verktyg/ai-kod-verktyg/cursor-ai/, /ai-verktyg/ai-kod-verktyg/github-copilot/`,
  },
];

async function generateGratis(g: GratisSpec): Promise<string> {
  const { html } = await generate(g.brief + '\n\nSkriv guiden nu. Ren HTML, börja med första <p>-taggen.');
  return html;
}

/* ─── Persistence ────────────────────────────────────────────── */

async function upsertReview(t: ToolSpec, contentMdx: string) {
  const path = `/ai-verktyg/ai-bild-verktyg/${t.slug}`;
  const row = {
    slug: t.slug,
    title: `${t.brand} — Recension ${new Date().getFullYear()}`,
    excerpt: t.oneliner,
    content_mdx: contentMdx,
    category: null,
    tags: t.tags,
    featured_image: null,
    type: 'page' as const,
    path,
    parent_slug: 'ai-bild-verktyg',
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: `${t.brand} Recension ${new Date().getFullYear()} | AI-Magasinet`,
    seo_description: t.oneliner,
  };
  const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
  if (error) throw new Error(`upsert review ${path}: ${error.message}`);
}

async function upsertHubGuide(contentMdx: string) {
  // Hub row already exists — just rewrite content_mdx.
  const { error } = await db
    .from('articles')
    .update({ content_mdx: contentMdx })
    .eq('path', '/ai-verktyg/ai-bild-verktyg');
  if (error) throw new Error(`update hub: ${error.message}`);
}

async function upsertGratis(g: GratisSpec, contentMdx: string) {
  const path = `/ai-verktyg/gratis/${g.slug}`;
  const row = {
    slug: g.slug,
    title: g.title,
    excerpt: g.excerpt,
    content_mdx: contentMdx,
    category: null,
    tags: ['gratis', 'AI-verktyg'],
    featured_image: null,
    type: 'page' as const,
    path,
    parent_slug: 'gratis',
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: g.title,
    seo_description: g.excerpt,
  };
  const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
  if (error) throw new Error(`upsert gratis ${path}: ${error.message}`);
}

/* ─── Main ───────────────────────────────────────────────────── */

async function main() {
  let cacheRead = 0, cacheWrite = 0, out = 0, dt = 0;

  // 1. Hub guide first so the cached system prompt warms up.
  console.log('—— /ai-verktyg/ai-bild-verktyg hub guide ——');
  {
    const t0 = Date.now();
    const html = await generateHubGuide();
    await upsertHubGuide(html);
    const ms = Date.now() - t0;
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`  ${words} ord, ${(ms / 1000).toFixed(1)}s`);
    dt += ms;
  }

  // 2. 10 reviews.
  console.log(`\n—— ${TOOLS.length} reviews ——`);
  for (let i = 0; i < TOOLS.length; i++) {
    const t = TOOLS[i];
    const t0 = Date.now();
    try {
      const html = await generateReview(t);
      await upsertReview(t, html);
      const ms = Date.now() - t0;
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      console.log(`  [${i + 1}/${TOOLS.length}] ${t.brand.padEnd(28)} ${words}w  ${(ms / 1000).toFixed(1)}s`);
      dt += ms;
    } catch (e) {
      console.error(`  [${i + 1}/${TOOLS.length}] ${t.brand} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  // 3. 3 gratis subpages.
  console.log(`\n—— ${GRATIS.length} gratis-subpages ——`);
  for (let i = 0; i < GRATIS.length; i++) {
    const g = GRATIS[i];
    const t0 = Date.now();
    try {
      const html = await generateGratis(g);
      await upsertGratis(g, html);
      const ms = Date.now() - t0;
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      console.log(`  [${i + 1}/${GRATIS.length}] /ai-verktyg/gratis/${g.slug.padEnd(14)} ${words}w  ${(ms / 1000).toFixed(1)}s`);
      dt += ms;
    } catch (e) {
      console.error(`  [${i + 1}/${GRATIS.length}] ${g.slug} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\nDone in ${(dt / 1000).toFixed(1)}s.`);
  void cacheRead; void cacheWrite; void out;
}

main().catch((e) => { console.error(e); process.exit(1); });
