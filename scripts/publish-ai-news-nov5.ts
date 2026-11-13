/**
 * 2 nyhetsartiklar, research via WebSearch (flera sekundärkällor eftersom
 * ingen primärkälla var nåbar för artikel 1; artikel 2 har SEC EDGAR S-1 som
 * primärkälla):
 *
 *   1. gemini-computer-use-generellt-tillgangligt  (snabb, kort nyhet)
 *   2. anthropic-ipo-vad-kostar-ai-racet            (stor analys, dyrare omfång)
 *
 * VIKTIGT: lämnar published_at = null. Användaren granskar innan vi sätter
 * datum och går live — se memory/feedback_review_before_publish.md. Covers:
 * branded gradient-kort (sharp+SVG) som placeholder tills riktiga bilder är
 * beslutade.
 *
 *   npx tsx scripts/publish-ai-news-nov5.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';
const BUCKET = 'featured-images';

const SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens.

# Tonalitet
Expert, rak, praktisk svenska. Inga floskler ("i en värld där...", "revolutionerande", "game changer"). Inga emojis. Konkreta namn, siffror och exempel. Skriv som en kunnig teknikjournalist — nyhetsmässigt, lätt kritiskt, aldrig reklamigt.

# Faktadisciplin (KRITISKT)
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta. Siffror/uppgifter som enligt briefen kommer från sekundärkällor (inte en primärkälla) ska attribueras generiskt ("enligt flera branschkällor"/"enligt uppgift") snarare än påstås som obestridda fakta. Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan rubriken). Inga \`\`\`html-wrappers, inga inline styles, inga <style>/<script>-taggar.

Använd: <h2>, <h3>, <p>, <ul>/<ol>+<li>, <strong>. Tabell för jämförelsedata: <table> med <thead>/<tbody>. Länka naturligt till relaterade interna sidor med <a href="..."> där det anges i briefen.`;

type ArticleSpec = {
  slug: string;
  title: string;
  category: string;
  authorSlug: string;
  wordTarget: number;
  excerpt: string;
  tags: string[];
  brandFrom: string;
  brandTo: string;
  kicker: string;
  relatedLinks: { url: string; label: string }[];
  brief: string;
};

const ARTICLES: ArticleSpec[] = [
  {
    slug: 'gemini-computer-use-generellt-tillgangligt',
    title: 'Googles Gemini Computer Use är nu generellt tillgängligt — AI som styr din dator',
    category: 'teknik-modeller',
    authorSlug: 'erik-lindgren',
    wordTarget: 750,
    excerpt: 'Google har tagit sin "Computer Use"-modell från förhandsvisning till generell tillgänglighet i Gemini API. Modellen kan klicka, skriva och scrolla i webbläsare och appar på egen hand.',
    tags: ['Google', 'Gemini', 'Computer Use', 'AI-agenter', 'nyhet'],
    brandFrom: '#1d4ed8', brandTo: '#0ea5e9',
    kicker: 'Produktnyhet',
    relatedLinks: [{ url: '/ai-verktyg/ai-agenter', label: 'Bästa AI-agenterna' }],
    brief: `Skriv en kort, rak nyhetsartikel (~750 ord) om: "Googles Gemini Computer Use är nu generellt tillgängligt — AI som styr din dator".

# VERIFIERAT / RAPPORTERAT (enligt flera branschkällor och teknikbloggar — ingen primär Google-dokumentation var nåbar vid researchtillfället, var tydlig med attributionen i texten, t.ex. "enligt Googles API-ändringslogg, rapporterat av flera teknikbloggar")
- Gemini "Computer Use"-verktyget gick från allmän förhandsvisning (lanserad som "Gemini 2.5 Computer Use" i oktober 2025) till generell tillgänglighet (GA) i Gemini API den 30 oktober 2026.
- Computer Use är en modell/verktyg som låter en AI-agent interagera direkt med ett användargränssnitt i en webbläsare eller app — klicka, skriva, scrolla, navigera mellan sidor — snarare än att bara anropa fördefinierade API:er.
- Tillgängligt via Gemini API, Google AI Studio och Vertex AI.
- Enligt rapporteringen ska verktyget ha presterat starkt på flera branschbenchmarks för "agentisk webbläsning/datoranvändning" jämfört med konkurrerande modeller, utan att någon exakt benchmarksiffra kan bekräftas härifrån — nämn det försiktigt ("har enligt uppgift presterat starkt på jämförande tester", utan att hitta på specifika poäng).
- Resan från första förhandsvisning till GA tog ungefär 13 månader.
- VIKTIGT att vara tydlig med: exakt vilka modellversioner som stödjer verktyget vid GA-lanseringen går inte att bekräfta säkert från tillgängliga källor — skriv generellt ("enligt Googles dokumentation stöds flera av Gemini-familjens modeller") snarare än att namnge specifika modellbeteckningar som inte kan verifieras.
- Branschkontext: detta är en del av ett bredare mönster där stora AI-labb (OpenAI med Operator/Computer-Using Agent, Anthropic med Claude's "computer use"-förmåga) tävlar om att låta AI-agenter styra vanliga datorgränssnitt direkt, istället för att förlita sig på specialbyggda integrationer.

# STRUKTUR
- Intro: slå an nyheten kort och konkret — Google tar sitt verktyg för "AI som styr datorn" från test till skarpt läge.
- <h2>Vad är Computer Use?</h2> — pedagogisk, kort: agent som ser skärmen och interagerar som en människa (klick, skrift, scroll) istället för fasta API-anrop.
- <h2>Vad betyder GA-lanseringen?</h2> — tillgänglighet via API/AI Studio/Vertex AI, resan från preview.
- <h2>Hur ligger Google till mot OpenAI och Anthropic?</h2> — kort jämförelse med Operator och Claudes datoranvändning, utan att hitta på siffror.
- <h2>Vad betyder det för dig som bygger eller använder AI-agenter?</h2> — praktisk vinkel, länk till AI-agenter-hubben.
- Kort, nykter avslutning.`,
  },
  {
    slug: 'anthropic-ipo-vad-kostar-ai-racet',
    title: 'Anthropics börsnotering: vad S-1-filen avslöjar om vad AI-racet faktiskt kostar',
    category: 'foretag-aktorer',
    authorSlug: 'sara-nilsson',
    wordTarget: 1600,
    excerpt: 'Anthropic har lämnat in sin S-1-ansökan till SEC inför en börsnotering i november. Siffrorna i filen — 16,3 miljarder dollar i halvårsintäkter, en värdering upp mot 2 biljoner dollar och en bokföringsmässig förlust på 80 miljarder — ger en sällsynt inblick i vad det faktiskt kostar att ligga i framkant av AI-racet.',
    tags: ['Anthropic', 'Claude', 'börsnotering', 'IPO', 'AI-ekonomi', 'analys'],
    brandFrom: '#581c87', brandTo: '#be185d',
    kicker: 'Analys',
    relatedLinks: [
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude-recension' },
      { url: '/ai-verktyg/ai-agenter', label: 'Bästa AI-agenterna' },
    ],
    brief: `Skriv en längre analysartikel (~1600 ord) om: "Anthropics börsnotering: vad S-1-filen avslöjar om vad AI-racet faktiskt kostar". Detta är INTE en vanlig nyhetsnotis — det ska vara en köttig, analytisk genomgång i samma anda som magasinets tyngre läsartiklar: gärna med en jämförelsetabell, tydlig struktur, och egna analytiska poänger (inte bara referat).

# VERIFIERAT (primärkälla: Anthropic PBC Form S-1, inlämnad till SEC/EDGAR 26 oktober 2026 — bekräftat via flera oberoende finansbevakare som citerar filen direkt)
- Anthropic (bolaget bakom Claude) lämnade in sin S-1-registrering (börsnoteringsansökan) till amerikanska finansinspektionen SEC den 26 oktober 2026, för notering på Nasdaq Global Select Market under tickern "ANT".
- Intäkter: 16,3 miljarder dollar under första halvåret 2026 (januari–juni). Det är upp från 1,2 miljarder dollar under samma period 2025 — en ökning på över 1 200 procent år över år. Hela 2025 omsatte bolaget 4,6 miljarder dollar, vilket betyder att H1 2026 ensamt redan var mer än tre gånger hela föregående helårsintäkt.
- Rörelseförlust (operating loss): 693 miljoner dollar för H1 2026, en kraftig förbättring från cirka 2,1 miljarder dollar i rörelseförlust under H1 2025.
- Nettoförlust: cirka 80,7 miljarder dollar för perioden — men var TYDLIG och förklara nyansen: enligt flera finansanalytiker som gått igenom filen beror merparten av denna siffra på en icke-kassaflödespåverkande bokföringspost — värdeförändringar i konvertibla finansieringsinstrument (något i stil med teckningsoptioner/konvertibla skuldebrev som omvärderas i takt med att bolagets värdering stiger). Förklara pedagogiskt att detta INTE betyder att bolaget faktiskt förbrukat 80 miljarder dollar i kontanter — det är en redovisningsteknisk konsekvens av att bolagets värdering rusat, inte ett mått på operativ "bränning" av pengar.
- Justerad rörelsemarginal (adjusted operating margin) ska enligt uppgift ha gått från cirka -159 procent till cirka +10 procent år över år — nämn som en indikation på att den underliggande verksamheten närmar sig lönsamhet, men flagga att siffran är bolagets egen "adjusted"-definition och inte en standardiserad redovisningsmetrik.
- Tidigare privat värdering: en Serie H-runda på 65 miljarder dollar som stängde till en post-money-värdering på 965 miljarder dollar, ledd av bland andra Altimeter Capital, Dragoneer, Greenoaks och Sequoia Capital.
- Förväntad IPO-värdering: flera finansmedier (bland annat med hänvisning till Wall Street Journal) uppger en målvärdering i spannet 1,5–2 biljoner dollar, med ett möjligt kapitalanskaffningsbelopp på 100 miljarder dollar eller mer. VIKTIGT: dessa siffror är ryktesmässiga/branschuppskattningar inför noteringen, inte bekräftade slutgiltiga tal — skriv "enligt uppgift"/"ryktas".
- Börsdebut väntas enligt flera källor äga rum veckan som inleds den 16 november 2026 — men var tydlig med att exakt datum kan ändras.
- VIKTIG NYANS att inkludera: detta sker samtidigt som OpenAI också förbereder en egen jättelik kapitalanskaffningsrunda (enligt uppgift runt 20 miljarder dollar vid en värdering på omkring 1,25 biljoner dollar, siffror som också ryktas skilja sig mellan källor) — Anthropic och OpenAI tävlar alltså inte bara om modellkvalitet utan om vem som kan resa mest kapital snabbast.

# STRUKTUR — gör det analytiskt, inte bara refererande
- Intro: slå an att en börsansökan sällan ger så mycket detaljerad insyn i vad AI-utveckling i absolut framkant faktiskt kostar — och att Anthropics S-1 gör precis det.
- <h2>Siffrorna i korthet</h2> — bygg en <table> med rader: Intäkter H1 2026, Intäkter H1 2025, Helår 2025, Rörelseförlust H1 2026, Rörelseförlust H1 2025, Nettoförlust H1 2026, Senaste privata värdering, Ryktad IPO-värdering.
- <h2>Tillväxten är verklig — och ovanligt snabb</h2> — sätt 1200%-tillväxten i perspektiv, vad den säger om efterfrågan på Claude (API, Claude Code, företagsavtal).
- <h2>De 80 miljarderna som inte är vad de ser ut som</h2> — den viktigaste pedagogiska delen: förklara skillnaden mellan bokföringsmässig nettoförlust (konvertibla instrument omvärderas uppåt när bolaget blir mer värt) och faktisk operativ förlust (693 miljoner, krympande). Varför detta ändå är intressant: det visar hur AI-bolags värderingar skapar egna bokföringseffekter.
- <h2>Vad kostar det egentligen att ligga i framkant?</h2> — analytisk poäng: även med 16+ miljarder i halvårsintäkter och krympande rörelseförlust krävs enorma kapitalrundor (965 miljarder → ryktad 1,5-2 biljoner värdering) — resonera kring varför: beräkningskraft/datacenter, forskning, konkurrensen mot OpenAI och Google.
- <h2>Kapplöpningen om kapital, inte bara modeller</h2> — koppla till att OpenAI samtidigt reser en egen runda; poängen att 2026 handlar lika mycket om vem som kan finansiera sin egen tillväxt som om vem som har bäst modell.
- <h2>Vad betyder det för Claude-användare?</h2> — praktisk/läsarvinkel: en börsnotering ger bolaget mer kapital och transparenskrav, men ändrar normalt inte produkten i det korta loppet; länka naturligt till Claude-recensionen.
- Avslutning: nykter sammanfattning — tillväxten är imponerande och äkta, men AI-racets kostnader är fortsatt enorma, och noteringen är lika mycket ett kapplöpningsdrag som ett mognadstecken.`,
  },
];

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapText(text: string, max: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if (line && (line + ' ' + w).length > max) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out.slice(0, 4);
}

async function makeCover(a: ArticleSpec): Promise<Buffer> {
  const W = 1200, H = 675;
  const lines = wrapText(a.title, 26);
  const lineHeight = 60;
  const totalH = lines.length * lineHeight;
  const startY = H / 2 - totalH / 2 + 10;

  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a.brandFrom}"/>
      <stop offset="100%" stop-color="${a.brandTo}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W - 90}" cy="90" r="220" fill="rgba(255,255,255,0.06)"/>
  <circle cx="60" cy="${H - 40}" r="160" fill="rgba(255,255,255,0.05)"/>
  <rect x="70" y="60" width="${26 + a.kicker.length * 15}" height="44" rx="22" fill="rgba(255,255,255,0.15)"/>
  <text x="${70 + 13 + a.kicker.length * 7.5}" y="89" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5" fill="#ffffff" text-anchor="middle">${escXml(a.kicker.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="70" y="${startY + i * lineHeight}" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">${escXml(l)}</text>`).join('\n  ')}
  <text x="70" y="${H - 48}" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.75)">AI-MAGASINET</text>
</svg>`.trim();

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function uploadCover(a: ArticleSpec): Promise<string> {
  const png = await makeCover(a);
  const webp = await sharp(png).webp({ quality: 88 }).toBuffer();
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${a.slug}.webp`;
  const { error } = await db.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp', upsert: true, cacheControl: '31536000',
  });
  if (error) throw new Error(`cover upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  return pub.publicUrl;
}

async function generate(a: ArticleSpec): Promise<string> {
  const userPrompt = [
    `Artikel: ${a.title}`,
    `Slug: ${a.slug}`,
    `Kategori: ${a.category}`,
    `Mållängd: ~${a.wordTarget} ord`,
    '',
    a.brief,
    '',
    'Relaterade sidor att länka naturligt till i prosan (max 1-2 ggr, där det passar):',
    ...a.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    `Skriv artikeln nu. ~${a.wordTarget} ord, ren HTML, börja med första <p>-taggen.`,
  ].join('\n');

  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function saveDraft(a: ArticleSpec, html: string, featuredImage: string) {
  const row = {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content_mdx: html,
    category: a.category,
    tags: a.tags,
    featured_image: featuredImage,
    og_image: featuredImage,
    author_slug: a.authorSlug,
    type: 'post' as const,
    path: `/${a.slug}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: null as string | null, // INTE publicerad — väntar på granskning
    seo_title: `${a.title} | AI-Magasinet`,
    seo_description: a.excerpt,
  };
  const { data, error } = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,path');
  if (error) throw new Error(`upsert ${a.slug}: ${error.message}`);
  return data?.[0];
}

async function main() {
  console.log(`Drafting ${ARTICLES.length} news articles (published_at = null)...\n`);
  for (const a of ARTICLES) {
    const t0 = Date.now();
    try {
      const cover = await uploadCover(a);
      const html = await generate(a);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const r = await saveDraft(a, html, cover);
      console.log(`✓ ${a.slug}  ${words}w  ${((Date.now() - t0) / 1000).toFixed(1)}s  id=${r?.id}`);
    } catch (e) {
      console.error(`✗ ${a.slug} FAILED:`, e instanceof Error ? e.message : e);
    }
  }
  console.log('\nDone. All drafts saved with published_at = null — review locally before publishing.');
}

main();
