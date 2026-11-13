/**
 * Hub-sidan /ai-verktyg/vibe-coding ("Bästa AI-verktyg för vibe coding 2026").
 * Topplistan är kuraterad via CURATED_HUB_TOOL_SLUGS i lib/route-kind.ts —
 * blandar 5 befintliga ai-kod-verktyg-recensioner med 6 nya (se
 * scripts/seed-vibe-coding-reviews.ts). published_at=null — väntar på
 * granskning + bild.
 *
 *   npx tsx scripts/seed-vibe-coding-hub.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const SLUG = 'vibe-coding';
const PATH = '/ai-verktyg/vibe-coding';
const TITLE = 'Bästa AI-verktyg för vibe coding 2026';

const CONTENT_MDX = `<p>"Vibe coding" har på kort tid blivit namnet på ett eget sätt att bygga mjukvara: du beskriver vad du vill ha i vanligt språk, och AI:n skriver, kör och ofta driftsätter koden åt dig. Skillnaden mot klassiska AI-kodassistenter som <a href="/ai-verktyg/github-copilot">GitHub Copilot</a> är att vibe coding-verktygen inte bara kompletterar rader i en editor — de bygger hela appar, från första idé till en körbar, driftsatt version, ofta utan att du behöver öppna en terminal.</p>

<p>Den här guiden går igenom de ledande verktygen i kategorin: vad de faktiskt gör, var gränsen går mellan "bygger hela appen åt dig" och "hjälper en utvecklare skriva kod snabbare", och hur du väljer rätt verktyg beroende på om du är utvecklare, produktchef eller grundare utan teknisk bakgrund.</p>

<h2>Vad är vibe coding egentligen?</h2>
<p>Begreppet syftar på att låta AI:n ta hela det tekniska ansvaret medan du styr genom att beskriva resultatet du vill ha — "vibe:en" snarare än exakt kod. I praktiken finns det en glidande skala:</p>

<h3>Fullstack-byggare för icke-utvecklare</h3>
<p>Verktyg som <a href="/ai-verktyg/lovable">Lovable</a>, <a href="/ai-verktyg/bolt-new">Bolt</a> och <a href="/ai-verktyg/base44">Base44</a> är byggda för att du ska kunna gå från textbeskrivning till en fungerande, driftsatt app utan att skriva en rad kod själv. Backend, databas och i vissa fall autentisering ingår redan i grundutförandet. De här verktygen passar bäst för MVP:er, interna verktyg och att validera en idé snabbt.</p>

<h3>AI-byggare integrerade i ett utvecklarekosystem</h3>
<p><a href="/ai-verktyg/v0">v0</a> från Vercel är det tydligaste exemplet: byggt för team som redan driftsätter på Vercel, med transparent prissättning och direkt synk till GitHub. Det ger mer kontroll än de renodlade icke-kod-verktygen, men förutsätter att du redan är bekväm i ett utvecklarflöde.</p>

<h3>Agentiska kodassistenter</h3>
<p>Verktyg som <a href="/ai-verktyg/cursor-ai">Cursor</a>, <a href="/ai-verktyg/windsurf">Windsurf</a>, <a href="/ai-verktyg/claude-code">Claude Code</a> och det nya <a href="/ai-verktyg/google-antigravity">Google Antigravity</a> ligger närmare klassisk kodning — de kräver att du förstår koden de skriver, men låter en AI-agent genomföra ändringar över hela kodbasen, köra kommandon och i Antigravitys fall jobba parallellt i flera arbetsytor samtidigt.</p>

<h3>Produktprototyper mot ett design-system</h3>
<p><a href="/ai-verktyg/magic-patterns">Magic Patterns</a> riktar sig mer mot produktteam och designers: AI bygger UI-prototyper som följer ert befintliga designspråk, snarare än en generisk fullstack-app.</p>

<h2>Hur verktygen skiljer sig åt i praktiken</h2>
<p>Tre saker avgör vilket verktyg som passar er bäst:</p>

<h3>Vem som ska använda det</h3>
<p>Om ingen i teamet kodar är Lovable, Bolt eller Base44 rimligare startpunkter än Cursor eller Claude Code, som förutsätter att du kan läsa och granska genererad kod. Google Antigravity ligger mitt emellan — gratis och kraftfullt, men mest värdefullt för den som redan är van vid IDE:er och terminaler.</p>

<h3>Vem som äger koden och var den körs</h3>
<p>De flesta vibe coding-verktyg driftsätter appen i sin egen molninfrastruktur som standard. Lovable och v0 är tydliga med att du äger och kan exportera koden; kolla alltid villkoren innan ni bygger något affärskritiskt i ett verktyg ni inte helt kontrollerar infrastrukturen för.</p>

<h3>Hur förutsägbar kostnaden är</h3>
<p>Prissättningen i kategorin är ovanligt spretig. v0 och Base44 redovisar sina priser öppet och i detalj. Lovable, Bolt och Magic Patterns är kreditbaserade på sätt som gör det svårare att uppskatta totalkostnaden i förväg, särskilt vid tyngre eller mer oregelbunden användning. Google Antigravity sticker ut genom att vara helt kostnadsfritt för utvecklare, åtminstone i sin nuvarande form.</p>

<h2>Vanliga fallgropar</h2>
<p>AI-byggd kod är inte automatiskt produktionsklar. Databasscheman, säkerhet och skalbarhet behöver fortfarande granskas av någon som förstår konsekvenserna — särskilt om appen ska hantera riktiga användare eller betalningar. Ett annat vanligt misstag är att underskatta inlåsningen: ju mer specifik infrastruktur (databas, hosting, autentisering) som ett verktyg bygger åt er, desto dyrare och svårare blir det att flytta appen till en annan plattform senare.</p>

<h2>Så väljer du</h2>
<p>Vill ni validera en idé snabbt utan att koda själva: börja med Lovable eller Bolt. Är ni redan på Vercel: v0 är det mest naturliga valet. Behöver ni en app med riktig databas och inloggning utan backend-kompetens: Base44. Är ni utvecklare som vill ha en agent som arbetar i er befintliga kodbas: Cursor, Windsurf, Claude Code eller det kostnadsfria Google Antigravity. Är det specifikt produktprototyper mot ett design-system: Magic Patterns.</p>`;

const FAQ = [
  {
    question: 'Vad betyder "vibe coding"?',
    answer:
      'Vibe coding innebär att du beskriver vad du vill bygga i vanligt språk och låter AI:n skriva, köra och ofta driftsätta koden åt dig, istället för att du själv skriver den rad för rad. Namnet syftar på att du styr genom känslan av vad resultatet ska bli, snarare än exakt implementation.',
  },
  {
    question: 'Måste jag kunna koda för att använda vibe coding-verktyg?',
    answer:
      'Nej, inte för verktyg som Lovable, Bolt eller Base44, som är byggda för att du ska kunna gå från textbeskrivning till färdig app utan att skriva kod. Verktyg som Cursor, Windsurf eller Claude Code förutsätter däremot att du kan läsa och granska koden som genereras.',
  },
  {
    question: 'Är appar byggda med vibe coding-verktyg säkra att använda i produktion?',
    answer:
      'Inte automatiskt. AI-genererad kod behöver fortfarande granskas för säkerhetshål, skalbarhet och projektspecifika krav innan den hanterar riktiga användare eller betalningar — precis som kod skriven av en människa. Betrakta den första versionen som en stark utgångspunkt, inte ett färdigt produktionssystem.',
  },
  {
    question: 'Vilket vibe coding-verktyg är billigast?',
    answer:
      'Google Antigravity är kostnadsfritt för utvecklare i sin nuvarande form. Bland de icke-kod-orienterade verktygen har v0 och Base44 öppet redovisade, förutsägbara priser, medan Lovable, Bolt och Magic Patterns använder kreditmodeller som gör totalkostnaden svårare att uppskatta i förväg.',
  },
  {
    question: 'Äger jag koden som ett vibe coding-verktyg bygger åt mig?',
    answer:
      'Det varierar. Lovable och v0 är tydliga med att ni äger och kan exportera koden. Kontrollera alltid villkoren för det specifika verktyget innan ni bygger något affärskritiskt, särskilt om appen är beroende av verktygets egen molninfrastruktur för drift.',
  },
];

async function main() {
  const { data: existing } = await db.from('articles').select('id').eq('path', PATH).maybeSingle();

  const payload = {
    slug: SLUG,
    path: PATH,
    title: TITLE,
    excerpt:
      'Jämförelse av de bästa AI-verktygen för vibe coding 2026 — Lovable, Bolt, v0, Base44, Google Antigravity och fler, rankade efter betyg, pris och funktioner.',
    content_mdx: CONTENT_MDX,
    faq: FAQ,
    seo_title: 'Bästa AI för vibe coding 2026 — jämförelse & test',
    seo_description:
      'Jämför de bästa AI-verktygen för vibe coding 2026 — Lovable, Bolt, v0, Base44 med flera. Betyg, priser och funktioner sida vid sida.',
    type: 'page' as const,
    category: null,
    parent_slug: 'ai-verktyg',
    affiliate_url: null,
    published_at: null,
    author_slug: 'nicklas-hallberg',
  };

  if (existing) {
    const { error } = await db.from('articles').update(payload).eq('id', existing.id);
    if (error) { console.error(error); process.exit(1); }
    console.log('OK (update): vibe-coding hub');
  } else {
    const { error } = await db.from('articles').insert(payload);
    if (error) { console.error(error); process.exit(1); }
    console.log('OK (insert): vibe-coding hub');
  }
}
main();
