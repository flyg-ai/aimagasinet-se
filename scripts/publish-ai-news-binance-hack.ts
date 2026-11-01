/**
 * Nyhetsartikel om Binance-hacket (29 okt 2026, 6,3+ mdr USD) + AI-trenden
 * inom nordkoreansk cyberbrottslighet. Länkad till AI-säkerhet-hubben.
 *
 * Källor (korskollade, inte bara den Google AI Overview användaren klistrade
 * in): TRM Labs tekniska blogg (primärkälla för själva hacket — nämner INTE
 * AI), Wikipedia "2026 Binance hack" (tertiärkälla, cross-source, nämner inte
 * heller AI för detta specifika hack). NYT:s AI-vinkel på just detta hack
 * kunde INTE verifieras direkt (nytimes.com blockerad för fetch) — attribueras
 * därför tydligt till NYT i texten, inte framställd som AI-Magasinets egen
 * bekräftade fakta. Den bredare trenden (Nordkorea + AI i cyberbrott generellt)
 * ÄR oberoende verifierad via flera källor (CertiK, TRM Labs H1 2026, Expels
 * HexagonalRodent-kampanj, Genians om Kimsuky) och används i framtidsavsnittet.
 *
 *   npx tsx scripts/publish-ai-news-binance-hack.ts
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
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta. Allt som markerats "enligt NYT" eller OBEKRÄFTAT måste tydligt attribueras till källan, aldrig framställas som AI-Magasinets egen bekräftade fakta. Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

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
    slug: 'binance-hack-6-3-miljarder-nordkorea',
    title: 'Historiens största kryptokupp: 6,3 miljarder dollar stulna från Binance på 20 minuter',
    category: 'ai-sakerhet-etik',
    authorSlug: 'sara-nilsson',
    wordTarget: 1300,
    excerpt: 'Nordkoreanska statshackare stal motsvarande över 60 miljarder kronor från kryptobörsen Binance på mindre än 20 minuter — världens hittills största cyberkupp. Händelsen sätter nytt fokus på hur AI redan används, och riskerar att användas alltmer, i avancerad cyberbrottslighet.',
    tags: ['Binance', 'cybersäkerhet', 'kryptovaluta', 'Nordkorea', 'AI-säkerhet', 'nyhet'],
    brandFrom: '#78350f', brandTo: '#d97706',
    kicker: 'Cyberattack',
    relatedLinks: [{ url: '/ai-verktyg/ai-sakerhet/', label: 'Bästa AI-verktygen för cybersäkerhet' }],
    brief: `Skriv en nyhetsartikel (~1300 ord, längre och mer djupgående än en kort notis) om: "Historiens största kryptokupp: 6,3 miljarder dollar stulna från Binance på 20 minuter".

# VERIFIERAT — själva hacket (TRM Labs tekniska analys + Wikipedia, korskollat)
- Attacken ägde rum 29 oktober 2026. Huvuddelen av stölden skedde på cirka 20 minuter, med start runt kl 20:05 UTC (16:05 amerikansk östkust-tid).
- Totalt stals motsvarande ungefär 6,3–6,36 miljarder dollar (cirka 61–62 miljarder kronor), spritt över tio olika blockkedjor. TRM Labs kallar det den största kryptostölden någonsin — ungefär fyra gånger så stor som Bybit-hacket i februari 2025 (1,5 miljarder dollar), som tidigare var rekordet.
- Fördelning: Ethereum cirka 3,8 miljarder dollar (bland annat 200 630 ETH och stora mängder USDT/USDC), Bitcoin cirka 1,5 miljarder dollar (18 270 BTC), Tron cirka 628 miljoner dollar, XRP Ledger cirka 296 miljoner dollar, Solana cirka 96 miljoner dollar, samt mindre summor på Arbitrum, Optimism, Base, Avalanche och Polygon.
- Tekniskt tillvägagångssätt: angriparna utnyttjade EIP-7702, en funktion införd i Ethereums Pectra-uppgradering i maj 2025 som låter vanliga plånboksadresser tillfälligt bete sig som smarta kontrakt. Genom att samla in 50 förhandssignerade auktoriseringar kunde angriparna få Binances heta plånbok att delegera kontroll till en egen "sweeper"-kontrakt, som sedan tömde plånboken på tre minuter och 24 sekunder.
- Minst 36 timmar i förväg hade angriparna förberett sig: små uttag via mixertjänsten Tornado Cash finansierade en operatörsplånbok, varpå attackkoden testades och repeterades på flera plånböcker innan den slutliga versionen installerades på Binances riktiga heta plånbok.
- Binances vd Richard Teng har sagt att hackarna utnyttjade EIP-7702-mekanismen mot Binances heta plånbok. Binance har inledningsvis också pekat på en komprometterad bärbar dator tillhörig en mjukvaruingenjör som en del av intrångsvägen, och uppgav senare att ytterligare sårbarheter upptäckts. Binance har ännu inte publicerat en fullständig grundorsaksanalys.
- Attribuering: analysföretagen TRM Labs och Chainalysis pekar båda ut TraderTraitor — en grupp kopplad till Nordkorea och enligt uppgift en del av det bredare Lazarus Group-nätverket — som ansvariga, med hög konfidensgrad baserat på on-chain- och off-chain-mönster som liknar tidigare nordkoreanska kryptostölder (bland annat KelpDAO-hacket i april 2026).
- Frysningar: stabila mynt-utgivarna Tether och Circle frös tillsammans omkring 3 miljarder dollar i stulna stablecoins inom loppet av någon timme (Tether cirka 21:01 UTC, Circle cirka 21:04 UTC). Ripple frös cirka 40,5 miljoner dollar i RLUSD. Totalt var omkring 2,7–3 miljarder dollar frysta eller under kontroll redan natten mot 30 oktober.
- Binance stoppade all handel och alla uttag som en försiktighetsåtgärd, och drog tillbaka hackarnas behörigheter i den komprometterade plånboken.
- Binance meddelade att användarnas pengar är säkra och att börsen själv täcker samtliga förluster: "Binance will absorb the financial impact of these stolen funds, not our users." Enligt uppgift hade Binance redan den 31 oktober återställt 90 procent av förlusterna, med plan att återuppta uttag 1 november och publicera "proof of reserves" 2 november.
- Den amerikanska hemliga polisen (US Secret Service) uppgavs arbeta med att spåra, frysa och återfå de stulna tillgångarna.
- Marknadsreaktion: Bitcoin föll med omkring 5 procent, ner under 80 000 dollar. Börsnoterade kryptobolag som Coinbase och Robinhood föll också tydligt.
- Status: angriparna höll som av 30 oktober fortfarande kvar över 420 000 ETH och 18 270 BTC — tillgångar värda omkring 2,4 miljarder dollar som utgivarna inte kan frysa eftersom de ligger i okontrollerade plånböcker. Pengarna hade ännu inte växlats till vanlig valuta; TRM Labs bedömer att nästa steg i penningtvätten sannolikt blir cross-chain-broar, växlingstjänster och OTC-mäklare.

# ATTRIBUERAT TILL NYT — var tydlig med att detta är NYT:s egen vinkel, INTE oberoende bekräftat av AI-Magasinet
- Enligt uppgifter i New York Times ska händelsen beskrivas som startskottet på en era där AI spelar en central roll i nordkoreansk cyberbrottslighet, och rapporteringen ska koppla penningtvätten efter hacket till automatiserade, AI-assisterade processer.
- Skriv EXPLICIT att detta är New York Times egen framställning och att AI-Magasinet inte kunnat verifiera detaljerna självständigt (vi har inte haft tillgång till NYT-artikeln i sin helhet). Ställ det uttryckligen mot att TRM Labs tekniska genomgång av just detta hack INTE nämner AI alls — den beskriver angreppet som en mycket noggrant förberedd men "klassisk" blockkedje-exploit (EIP-7702-missbruk, förhandssignerade auktoriseringar, peel chains).

# VERIFIERAT — den bredare, oberoende bekräftade AI-trenden hos nordkoreanska hackare (flera oberoende källor, används i framtidsavsnittet — gäller INTE specifikt Binance-hacket)
- Säkerhetsföretaget CertiK uppger att nordkoreakopplade aktörer stod för cirka 2,06 miljarder dollar av alla kryptostölder 2025 — 60 procent av det totala beloppet det året.
- TRM Labs rapporterar ytterligare 643 miljoner dollar i nordkoreakopplade kryptostölder under första halvåret 2026, vilket enligt företaget motsvarar 66 procent av alla kända hackingförluster globalt den perioden.
- Säkerhetsföretaget Expel har dokumenterat en kampanj kallad "HexagonalRodent" där nordkoreanska hackare använt AI-verktyg för att skriva skadlig kod, bygga falska företagswebbplatser och utforma phishing-lockbeten — främst falska jobberbjudanden riktade mot utvecklare. Kampanjen kopplas till en stöld på omkring 12 miljoner dollar över tre månader.
- Säkerhetsforskare (Genians) har rapporterat att den nordkoreakopplade gruppen Kimsuky kör egna, offline-körda språkmodeller och använder generativ AI för att skapa phishing-dokument riktade mot kryptovaluta- och fintech-bolag.
- Oberoende säkerhetsanalytiker har samtidigt betonat att social manipulation ("social engineering") — falska jobbintervjuer, infiltrerade utvecklare, komprometterade anställda — fortfarande är det dominerande angreppssättet i de flesta stora kryptostölder, med eller utan AI som verktyg.

# STRUKTUR
- Intro: slå an skalan — störst kryptostöld någonsin, 20 minuter, 6,3+ miljarder dollar, och varför det spelar roll även för läsare som inte äger krypto (bevis för hur sårbar kritisk finansiell infrastruktur kan vara).
- <h2>Vad hände?</h2> — tidslinje: förberedelse 36+ timmar innan, själva attacken (EIP-7702-exploiten, de olika blockkedjorna), hur snabbt det gick.
- <h2>Vilka ligger bakom?</h2> — TraderTraitor/Lazarus Group, Nordkorea, hur attributeringen gjorts.
- <h2>Hur reagerade Binance och branschen?</h2> — frysningar (Tether/Circle/Ripple), Binances egna åtgärder och löfte att täcka förlusterna, marknadsreaktionen (Bitcoin-fallet).
- <h2>Var AI inblandat?</h2> — var här EXTRA tydlig: presentera NYT:s påstående som just NYT:s påstående ("enligt New York Times ..."), kontrastera mot att TRM Labs tekniska analys av själva hacket inte nämner AI. Förklara ärligt att AI-Magasinet inte kunnat verifiera NYT:s specifika AI-koppling till just detta hack.
- <h2>Den större bilden: Nordkorea och AI i cyberbrottslighet</h2> — använd den oberoende verifierade statistiken och exemplen (CertiK, TRM H1 2026, HexagonalRodent, Kimsuky) för att visa att AI-användning hos dessa aktörer är ett verkligt och växande mönster, oavsett om det gäller just Binance-hacket eller ej. Nämn också att social manipulation fortsatt dominerar.
- <h2>Vad betyder det framåt?</h2> — kort spaning: i takt med att AI-drivna verktyg blir billigare och mer kapabla både för attack och försvar, väntas fler aktörer (statliga och kriminella) använda dem i finansiella attacker; koppla naturligt till att företag och plattformar själva investerar i AI-driven hotdetektering som motvikt.
- Väv in länken till /ai-verktyg/ai-sakerhet/ naturligt i det sista avsnittet, t.ex. "I vår genomgång av <a href="/ai-verktyg/ai-sakerhet/">AI-verktyg för cybersäkerhet</a> ...".
- Kort, nykter avslutning.`,
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
  console.log(`Drafting ${ARTICLES.length} news article(s) (published_at = null)...\n`);
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
  console.log('\nDone. Draft saved with published_at = null — review locally before publishing.');
}

main();
