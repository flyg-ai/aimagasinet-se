/**
 * Generate polished ~1500-word guide text for the 3 depth-1 standalone
 * pages via Claude Sonnet 4.6 and persist to articles.content_mdx.
 *
 *   npx tsx scripts/generate-standalone-guides.ts
 *
 * Shared system prompt cached so calls 2 and 3 read from prompt cache.
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

const SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Din uppgift är att skriva en lång polerad guide för en standalone-sida på sajten.

# Tonalitet
Expert, rak, praktisk svenska. Skriv som en kunnig kollega som har testat verktygen själv. Inga floskler ("revolutionerande", "i en värld där..."). Inga emojis i brödtexten. Naturlig affärssvenska, inte direktöversatt engelska.

# Struktur (~1500 ord)
- En kort intro (1-2 stycken) som etablerar varför ämnet är värt att förstå just nu och vem som har nytta av det
- 5-7 H2-rubriker som tar läsaren från grund till hands-on
- Använd H3 sparsamt för underrubriker som hjälper skannbarheten
- Bullet-listor när du jämför verktyg eller listar steg
- Konkreta exempel — verktygsnamn, ungefärliga priser, faktiska use cases
- Avsluta med en pragmatisk "Så kommer du igång" eller "Slutsats"-sektion

# Länkning
Du får en lista över relaterade sidor på sajten. Länka 3-6 av dem naturligt i prosan med HTML \`<a href="URL">Länktext</a>\`. Länkar ska kännas som hänvisningar inom samma resonemang.

# Output
Ren HTML — börja med första <p>-taggen, sluta med en </p> eller </ul>. Ingen H1 (templaten har redan). Inga kodblock, ingen \`\`\`html-wrapping.

Använd:
- <h2>, <h3> för rubriker
- <p> för stycken
- <ul>/<ol> + <li> för listor
- <a href="..."> för länkar
- <strong> sparsamt`;

type GuideSpec = {
  slug: string;
  path: string;
  title: string;
  topic: string;
  audience: string;
  brief: string;
  relatedLinks: { url: string; label: string }[];
};

const GUIDES: GuideSpec[] = [
  {
    slug: 'bygga-mobilapp-med-ai',
    path: '/bygga-mobilapp-med-ai',
    title: 'Bygga mobilapp med AI',
    topic: 'Att bygga en native eller cross-platform mobilapp med hjälp av AI-verktyg 2026',
    audience: 'Indie-utvecklare, småföretagare och produkt-grundare som vill bygga en mobilapp (iOS/Android) utan stort utvecklingsteam, eller existerande utvecklare som vill öka tempot med AI-assistans.',
    brief: `Skriv en praktisk guide som tar läsaren från idé till launched mobilapp med AI-stöd 2026.

Strukturera ungefär så här:
- Intro: Vad har förändrats? AI-kodverktyg har gjort mobilappar betydligt billigare att bygga 2026 — Cursor + Expo + en specifikation kan ta dig till TestFlight på dagar, inte månader. Men det finns fortfarande hinder: native-features, app-store-policy, prestanda.
- "Vad du kan bygga med AI 2026" — utility-appar, content-konsumtions-appar, enkla SaaS-frontends fungerar bra. Allt med tunga native-features (kamera-AR, bakgrunds-sync, low-level Bluetooth) kräver fortfarande mänsklig expertis.
- "Verktygsstacken" — kombinera Cursor / Windsurf / GitHub Copilot för kod, Expo + React Native eller Flutter för cross-platform, Vercel / Supabase för backend, App Store Connect + Google Play Console för distribution. Nämn också Lovable, Bolt och v0 för no-code-första iterationen.
- "Så ser flödet ut steg-för-steg" — från idé till TestFlight på en vecka
- "Vanliga fallgropar" — Apple-review, App-store-policys, prestandafrågor, vad AI inte klarar
- "När du behöver mer än bara AI" — när det är dags att anlita en utvecklare
- Avsluta med "Så kommer du igång idag"`,
    relatedLinks: [
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
      { url: '/ai-verktyg/ai-kod-verktyg/cursor-ai', label: 'Cursor AI' },
      { url: '/ai-verktyg/ai-kod-verktyg/github-copilot', label: 'GitHub Copilot' },
      { url: '/ai-verktyg/ai-kod-verktyg/windsurf', label: 'Windsurf' },
      { url: '/bygga-app-med-ai', label: 'Bygga app & hemsida med AI' },
      { url: '/ai-verktyg/foretag', label: 'AI för företag' },
    ],
  },
  {
    slug: 'bygga-app-med-ai',
    path: '/bygga-app-med-ai',
    title: 'Bygga app & hemsida med AI',
    topic: 'Att bygga en webbapp eller hemsida med AI-verktyg 2026 — från enkel landningssida till full SaaS',
    audience: 'Solopreneurer, marknadsförare, designers utan kodbakgrund och utvecklare som vill prototypa snabbt med AI-assistans.',
    brief: `Skriv en praktisk guide om att bygga webbappar och hemsidor med AI 2026.

Strukturera ungefär så här:
- Intro: 2026 är året då det blev "rimligt" att en icke-utvecklare bygger en fungerande SaaS-app från grunden. Lovable, v0, Bolt och Cursor flyttade gränsen.
- "Tre nivåer av att bygga med AI" — (1) no-code-builders (Lovable, v0, Bolt) som genererar fullständiga appar från prompt, (2) AI-IDE:er (Cursor, Windsurf) där du skriver kod assistant-style, (3) traditionell utveckling med AI-copilot (GitHub Copilot)
- "Verktyg för varje nivå" — konkreta jämförelser med ungefärliga priser. Lovable från $20/mån, Cursor från $20/mån, v0 gratis nivå
- "Så väljer du backend" — Supabase eller Firebase för auth + DB, Vercel för hosting, Stripe för betalningar. Allt har solid AI-stöd nu.
- "Vanliga fallgropar" — när AI hallucinerar (genererar kod som inte funkar), prestandafrågor, säkerhetshål i AI-genererad kod
- "Hur du kommer från MVP till produkt" — när AI räcker och när du behöver mänsklig review
- Avsluta med "En 7-dagars handlingsplan"`,
    relatedLinks: [
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
      { url: '/ai-verktyg/ai-kod-verktyg/cursor-ai', label: 'Cursor AI' },
      { url: '/ai-verktyg/ai-kod-verktyg/windsurf', label: 'Windsurf' },
      { url: '/bygga-mobilapp-med-ai', label: 'Bygga mobilapp med AI' },
      { url: '/ai-verktyg/ai-automation', label: 'AI-automation' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing', label: 'AI för marknadsföring' },
    ],
  },
  {
    slug: 'skapa-faceless-content-med-ai',
    path: '/skapa-faceless-content-med-ai',
    title: 'Skapa faceless content med AI',
    topic: 'Faceless YouTube / TikTok / Shorts-content-skapande med AI — från idé till miljontals visningar utan att synas i kamera',
    audience: 'Content-skapare, marknadsförare och solopreneurer som vill bygga en faceless-kanal på YouTube, TikTok, Instagram Reels eller Shorts.',
    brief: `Skriv en praktisk guide om att skapa faceless content med AI 2026.

Strukturera ungefär så här:
- Intro: Faceless content (kanaler utan ansikte på kamera — voiceover + bilder/AI-video) har exploderat 2024-2026. Hela genrer som "AI-historik", "fakta-shorts" och "Reddit-stories" är dominerade av AI-genererade workflows.
- "Vad faceless content är 2026" — definition, varför det funkar (algoritm gillar konsistens, ingen casting), exempel på framgångsrika nischer
- "Verktygsstacken" — manus med ChatGPT/Claude, röst med ElevenLabs/Suno, bilder med Midjourney/DALL-E, video med Runway/Kling, redigering med CapCut/Descript. Konkreta priser.
- "Tre genrer som funkar bäst" — fakta-shorts, story-tellings (Reddit/historia), "did you know"-format
- "Workflow steg-för-steg" — från idé till publicerad video på 30 minuter
- "Algoritm-strategi" — hur YouTube/TikTok belönar konsistens, hook-formula, optimal video-length per plattform
- "Vanliga fallgropar" — copyright-strikes på AI-bilder, monetisering på AI-genererat content (YouTubes nya policy), kvalitet vs kvantitet
- Avsluta med "Så bygger du en konsistent pipeline"`,
    relatedLinks: [
      { url: '/ai-video', label: 'AI-videoverktyg' },
      { url: '/ai-video/kling-ai', label: 'Kling AI' },
      { url: '/ai-video/runway-gen-3', label: 'Runway Gen-3' },
      { url: '/ai-verktyg/ai-ljud-och-musik', label: 'AI-ljud & musik' },
      { url: '/ai-verktyg/ai-ljud-och-musik/elevenlabs', label: 'ElevenLabs' },
      { url: '/ai-verktyg/ai-text-verktyg', label: 'AI-skrivverktyg' },
    ],
  },
];

async function generate(g: GuideSpec): Promise<{ html: string; usage: Anthropic.Usage }> {
  const userPrompt = [
    `Sida: ${g.path}`,
    `Titel: ${g.title}`,
    `Ämne: ${g.topic}`,
    `Målgrupp: ${g.audience}`,
    '',
    'Brief:',
    g.brief,
    '',
    'Relaterade sidor att länka till naturligt i prosan:',
    ...g.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    'Skriv guiden nu. ~1500 ord, ren HTML, börja med första <p>-taggen.',
  ].join('\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
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
  console.log(`Generating ${GUIDES.length} standalone guides with ${MODEL}…\n`);
  let totalIn = 0, totalRead = 0, totalWrite = 0, totalOut = 0;

  for (let i = 0; i < GUIDES.length; i++) {
    const g = GUIDES[i];
    const t0 = Date.now();
    try {
      const { html, usage } = await generate(g);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const { error } = await db
        .from('articles')
        .update({ content_mdx: html })
        .eq('path', g.path);
      if (error) throw new Error(error.message);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(
        `[${i + 1}/${GUIDES.length}] ${g.path}  ${words}w  ${dt}s  ` +
        `cache_read=${usage.cache_read_input_tokens ?? 0}  ` +
        `cache_write=${usage.cache_creation_input_tokens ?? 0}  ` +
        `out=${usage.output_tokens}`
      );
      totalIn += usage.input_tokens;
      totalRead += usage.cache_read_input_tokens ?? 0;
      totalWrite += usage.cache_creation_input_tokens ?? 0;
      totalOut += usage.output_tokens;
    } catch (e) {
      console.error(`[${i + 1}/${GUIDES.length}] ${g.path} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\nTotal: in=${totalIn}  cache_read=${totalRead}  cache_write=${totalWrite}  out=${totalOut}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
