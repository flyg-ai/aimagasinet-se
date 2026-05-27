/**
 * Generate 3 long-form articles via Claude Sonnet 4.6 and persist them to
 * the articles table. Each article goes into a top-level category and is
 * published as type='post' with featured_image=null (the user uploads cover
 * art manually via publish-article.ts or the Supabase dashboard).
 *
 * Run: npx tsx scripts/generate-three-articles.ts
 *
 * Shared system prompt is cache_control:"ephemeral" so call 2-3 reuse the
 * cached prefix. Idempotent — upserts on path.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 16000;

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Din uppgift är att skriva långa, gediga artiklar för sajten.

# Tonalitet och röst

AI-Magasinets röst är **expert, rak och praktisk** — inte "AI-ig". Du skriver för svenska företagare, marknadsförare, utvecklare och professionella som vill förstå AI på riktigt, inte bli sålda på hype.

Skriv som en kunnig kollega som har testat verktygen själv:
- **Konkret framför generiskt** — namn, siffror, exempel
- **Erkänn nyanser** — om något funkar bra för vissa men illa för andra, säg det
- **Inga svulstiga formuleringar** — undvik "i en värld där...", "framtiden är här", "revolutionerande", "game changer"
- **Inga emojis i brödtexten**
- **Skriv på svenska — naturlig affärssvenska**, inte direktöversatt engelska

# Struktur

Varje artikel ska ha tydlig röd tråd från intro → fördjupning → slutsats. Använd:
- En kort intro (1-2 stycken) som etablerar relevansen
- H2-rubriker som markerar huvudsektioner
- H3-underrubriker när det hjälper läsaren skanna
- Bullet-listor när du listar verktyg, kriterier, eller steg
- Konkreta exempel i prosa — visa hur AI används i praktiken
- En avslutande sektion med slutsats eller handlingsplan

# Länkning till relaterade sidor

Du får en lista över relaterade sidor på sajten. Länka till dem **naturligt i prosan** med HTML-syntax: \`<a href="URL">Länktext</a>\`. Länkar ska kännas som hänvisningar inom samma resonemang, inte som "Läs mer här"-uppmaningar. Inkludera 3-6 interna länkar.

# Formatering

Output ska vara **HTML** (inte Markdown). Använd:
- \`<h2>\`, \`<h3>\` för rubriker
- \`<p>\` för stycken
- \`<ul>\`/\`<ol>\` + \`<li>\` för listor
- \`<a href="...">text</a>\` för länkar
- \`<strong>\` för betoning (sparsamt)
- \`<table>\` med \`<thead>\`/\`<tbody>\` om data är tabellär

# Vad som INTE ska finnas

- Inledningsmeningar som "I dagens snabbt föränderliga AI-landskap..."
- Floskler: "revolutionerar", "game-changer", "unleash the power"
- Generiska listor utan substans
- Skriv inte ut H1-rubriken — den finns redan i page-templaten
- Ingen kod-block, ingen \`\`\`html\`\`\`-wrapping — bara ren HTML direkt

Skriv ren HTML direkt — börja med en \`<p>\`-tagg, sluta med en \`<p>\` eller \`<ul>\`-tagg. Inget annat före eller efter.`;

type ArticleSpec = {
  slug: string;
  title: string;
  category: 'ai-nyheter' | 'foretag-aktorer' | 'teknik-modeller';
  excerpt: string;
  wordTarget: number;
  brief: string;
  relatedLinks: { url: string; label: string }[];
  tags: string[];
};

const ARTICLES: ArticleSpec[] = [
  {
    slug: 'basta-ai-prompter-chatgpt-2026',
    title: '100+ Bästa AI-prompter för ChatGPT 2026',
    category: 'ai-nyheter',
    excerpt: '100+ konkreta ChatGPT-prompter testade på svenska, för skrivande, kod, marknadsföring, research, kreativitet och produktivitet — med förklaring av varför varje prompt fungerar.',
    wordTarget: 3000,
    tags: ['ChatGPT', 'prompts', 'AI-prompter', 'produktivitet'],
    brief: `Skriv en uttömmande guide med 100+ konkreta ChatGPT-prompter, kategoriserade efter användningsområde. Varje prompt ska vara redo att kopiera in i ChatGPT — alltså inte abstrakta beskrivningar.

Sektioner (H2) — minst dessa:
1. Skrivande & content (15+ prompts)
2. Kod & utveckling (15+ prompts)
3. Marknadsföring & SEO (15+ prompts)
4. Analys & research (15+ prompts)
5. Kreativt & brainstorming (15+ prompts)
6. Produktivitet & jobb (15+ prompts)
7. Svenska prompts (10+ — utnyttja svensk grammatik, branschtermer, lokala kontexter)
8. Pro-tips: så skriver du egna prompts som funkar

Format för varje prompt:
- Visa själva prompten i ett kodblock-liknande element (använd <pre><code>...</code></pre>)
- Lägg till 1-2 meningar förklaring av VAD den gör och VARFÖR den fungerar (vilka delar av prompten är det som gör skillnaden — rolltilldelning, exempel, format-instruktion, constraints, etc.)

Variera tonen — vissa prompts är korta one-liners, andra är längre med rolltilldelning och format-spec. Visa både enkla "förbättra denna text"-prompts och avancerade "agera som senior SEO-strateg och analysera…"-prompts.

Lägg in 1-2 stycken i intron som etablerar varför prompt-skrivande är en lärbar färdighet, inte gissningsarbete. Avsluta med en H2-sektion om prompt-mönster (chain-of-thought, few-shot, role-prompting, output constraints) som läsaren kan applicera på egna problem.

Totalt: ~3000 ord, minst 100 faktiska prompts som kan kopieras direkt.`,
    relatedLinks: [
      { url: '/ai-verktyg/ai-text-verktyg', label: 'AI-skrivverktyg' },
      { url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT-recension' },
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude-recension' },
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting', label: 'AI för content & copywriting' },
    ],
  },
  {
    slug: 'svenska-ai-foretag-2026',
    title: 'Alla svenska AI-företag 2026 — Komplett lista',
    category: 'foretag-aktorer',
    excerpt: 'En komplett genomgång av svenska AI-bolag 2026 — startups, scale-ups, etablerade jättar och kategoriserat per bransch: fintech, healthtech, edtech, martech, mobilitet och mer.',
    wordTarget: 2500,
    tags: ['svenska AI-företag', 'AI-bolag', 'fintech', 'startups'],
    brief: `Skriv en omfattande karta över svenska AI-bolag i maj 2026. Strukturera artikeln så här:

Intro (1-2 stycken): Sverige är ett av Europas mest AI-täta länder per capita — Spotify, Klarna, Skype/Epic var pionjärerna och en hel generation byggde nya bolag i deras spår. Etablera storyn: vilka är de tunga jättarna, vilka är de heta scale-upsen, och vad gör de nya startup-vågorna 2026.

Sektioner (H2):

1. **De etablerade AI-jättarna** — Spotify (AI DJ, music recommendation), Klarna (AI customer service och AI Marketing Manager), H&M (AI för supply chain och design), iZettle/PayPal, Bambora. Hur de använder AI internt och vilka som har offentliga AI-features.

2. **Fintech & ekonomi** — Klarna AI Manager, Tink, Trustly, Lendify och nya AI-first fintech-bolag 2024-2026.

3. **Healthtech & life science** — Kry/Livi, Doktor.se, Min Doktor, Coala Life, Mendi, Aignostics-relaterade svenska forskningsbolag.

4. **Mobilitet & deeptech** — Einride (autonoma lastbilar), Univrses (vision-AI för fordon), Volvo Cars AI, Northvolt med AI i battery operations, Polestar.

5. **Edtech** — Sana Labs (företagsutbildning), Embibe-relaterade aktörer i Norden, Hejmo.

6. **Martech & creator economy** — Epidemic Sound (AI för musik-licensiering och rekommendationer), Soundboks, Storykit.

7. **AI infrastructure & forskning** — Peltarion (uppköpt av King → senare nedlagt, sammanhang), Edgeir, Sana Labs på enterprise-sidan, RISE AI Center, KTH AI-forskning.

8. **AI-startups att ha koll på 2026** — Konkret lista med 8-15 nyare bolag som tagit kapital senaste 18 månaderna inom AI. Var ärlig — om ett bolag står i marketing-mode utan produkt, säg det.

För varje bolag som nämns: kort beskrivning (1-2 meningar), HQ-stad, grundat år ungefär, vad AI:n faktiskt gör (inte marketing-prat).

Avsluta med en H2 "Så ser svensk AI-scen ut 2026" — kort reflektion: vilka är styrkorna (deeptech, fintech-arv, statligt forskningsstöd via RISE), vilka är svagheterna (talangbrist på senior ML-engineering, mindre risk-kapital än US).

Totalt: ~2500 ord, konkreta bolag och fakta, inga floskler.`,
    relatedLinks: [
      { url: '/ai-verktyg/foretag', label: 'AI för företag' },
      { url: '/ai-verktyg/foretag/yrke', label: 'AI-verktyg efter yrke' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing', label: 'AI för marknadsföring' },
      { url: '/ai-verktyg/foretag/yrke/kundservice', label: 'AI för kundservice' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering', label: 'AI för rekrytering' },
    ],
  },
  {
    slug: 'basta-ai-bilder-galleri-2026',
    title: 'Bästa AI-bilder någonsin skapade — Galleri 2026',
    category: 'teknik-modeller',
    excerpt: 'En kurerad genomgång av de mest banbrytande AI-genererade bilderna 2014-2026 — från tidiga GAN:er till dagens Midjourney, DALL-E och Stable Diffusion-realism.',
    wordTarget: 2000,
    tags: ['Midjourney', 'DALL-E', 'Stable Diffusion', 'AI-bilder', 'GAN'],
    brief: `Skriv en kurerad historik över de mest ikoniska och banbrytande AI-genererade bilderna någonsin. Tänk dig artikeln som en utställning där varje bild har en plakett som förklarar verktyg, år, och varför den var ett vattendelarögonblick.

Eftersom vi inte kan bädda in bilder här ska du istället beskriva varje bild i prosa — verktyg, vad bilden föreställer, varför den är historiskt viktig, och vad den triggade i AI-bildvärlden. Tänk museum-text.

Strukturera kronologiskt med tematiska kluster:

Intro (1-2 stycken): AI-bildgenerering gick från abstrakta GAN-experiment 2014 till foto-realistisk konkurrens med proffsfotografer 2026 — det här är resan i 50 ikoniska bilder.

Sektioner (H2):

1. **Pionjäråren 2014-2018: GAN-eran** (8-10 bilder)
   - 2014: Goodfellow's första GAN-genererade ansikten (suddiga, banbrytande)
   - 2015-2017: DCGAN sovrum, anime-ansikten, churches-dataset
   - 2018: NVIDIA StyleGAN — "Den här personen finns inte"
   - Edmond de Belamy (2018) — första AI-konstverk som auktioneras på Christie's för $432,500

2. **Diffusion-explosionen 2020-2022** (10-12 bilder)
   - DALL-E 1 (2021): Avocado-fåtöljen som blev kult
   - GLIDE och Imagen-demos (Google)
   - DALL-E 2 lansering 2022: astronaut-på-häst, Vermeer-pastiche
   - Midjourney v1-v3 sommaren 2022: när Reddit och Discord exploderade
   - Stable Diffusion open-source augusti 2022 — den första öppna modellen

3. **När AI-konst vann pris (kontroversen)** — Jason M. Allen "Théâtre D'opéra Spatial" som vann Colorado State Fair 2022.

4. **Realism-tröskeln 2023** (8-10 bilder)
   - Midjourney v5: "Påvefoto i Balenciaga-jacka" som lurade halva internet
   - "Trump arresteras"-bilderna som triggade debatt om AI-säkerhet
   - "Pentagon-explosionen" (mars 2023) som påverkade börsen

5. **Photoshop-eran integreras 2024-2025** (5-8 bilder)
   - Adobe Firefly: kommersiellt godkänd, tränad på Adobe Stock
   - Midjourney v6: realistisk fotografering, hands fixed
   - DALL-E 3 via ChatGPT: prompts på naturlig svenska som funkar
   - SDXL och Flux: open-source som matchar proprietary kvalité

6. **2026: AI-bildens nuvarande tillstånd** (5-8 bilder)
   - Midjourney v7-v8: 4K-resolution direkt från prompt
   - OpenAI Sora-stills med fotoreal kvalité
   - Reve, Google Imagen 4, Flux.1.1 Pro Ultra
   - Branschpåverkan: stockfoto-marknaden har kollapsat, illustratör-yrket transformeras

Avsluta med H2 "Var vi står 2026" — vad är fortfarande svårt (interaktion mellan flera personer, exakt typografi, konsistens över bilder) och vart fältet är på väg (3D-export, video-from-image, controllable generation).

Format-not: Eftersom artikeln INTE kan visa bilder, beskriv varje verk noggrant med ord — vad föreställer den, vilken stil, varför är den ikonisk. Det här ÄR värdet i artikeln.

Totalt: ~2000 ord, ~50 bilder nämnda och beskrivna.`,
    relatedLinks: [
      { url: '/ai-verktyg/ai-bild-verktyg', label: 'AI-bildverktyg' },
      { url: '/ai-verktyg/ai-bild-verktyg/midjourney', label: 'Midjourney-recension' },
      { url: '/ai-verktyg/ai-bild-verktyg/dalle', label: 'DALL-E-recension' },
      { url: '/ai-video', label: 'AI-videoverktyg' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier', label: 'AI för sociala medier' },
    ],
  },
];

async function generate(a: ArticleSpec): Promise<{ html: string; usage: Anthropic.Usage }> {
  const userPrompt = [
    `Artikel: ${a.title}`,
    `Slug: ${a.slug}`,
    `Kategori: ${a.category}`,
    `Mållängd: ~${a.wordTarget} ord`,
    '',
    'Brief:',
    a.brief,
    '',
    'Relaterade sidor att länka till naturligt i prosan:',
    ...a.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    `Skriv artikeln nu. ~${a.wordTarget} ord, ren HTML, börja med första <p>-taggen.`,
  ].join('\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
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

async function persist(a: ArticleSpec, html: string): Promise<string> {
  const row = {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content_mdx: html,
    category: a.category,
    tags: a.tags,
    featured_image: null as string | null,
    type: 'post' as const,
    path: `/${a.slug}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: new Date().toISOString(),
    seo_title: `${a.title} | AI-Magasinet`,
    seo_description: a.excerpt,
  };

  const { data, error } = await supabase
    .from('articles')
    .upsert(row, { onConflict: 'path' })
    .select('id,path');
  if (error) throw new Error(`upsert ${a.slug}: ${error.message}`);
  return `id=${data?.[0]?.id} path=${data?.[0]?.path}`;
}

async function main() {
  console.log(`Generating ${ARTICLES.length} articles with ${MODEL}…\n`);
  let totalInput = 0, totalCacheRead = 0, totalCacheWrite = 0, totalOutput = 0;

  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const t0 = Date.now();
    try {
      const { html, usage } = await generate(a);
      const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const persistInfo = await persist(a, html);
      const dt = Date.now() - t0;
      console.log(
        `[${i + 1}/${ARTICLES.length}] ${a.slug}` +
        `  ${wordCount} words  ${(dt / 1000).toFixed(1)}s  ` +
        `cache_read=${usage.cache_read_input_tokens ?? 0}  ` +
        `cache_write=${usage.cache_creation_input_tokens ?? 0}  ` +
        `output=${usage.output_tokens}  ${persistInfo}`
      );
      totalInput += usage.input_tokens;
      totalCacheRead += usage.cache_read_input_tokens ?? 0;
      totalCacheWrite += usage.cache_creation_input_tokens ?? 0;
      totalOutput += usage.output_tokens;
    } catch (e) {
      console.error(`[${i + 1}/${ARTICLES.length}] ${a.slug} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(
    `\nTotal: input=${totalInput}  cache_read=${totalCacheRead}  ` +
    `cache_write=${totalCacheWrite}  output=${totalOutput}`
  );
}

main();
