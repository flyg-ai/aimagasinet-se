/**
 * Generera 3 nyhetsartiklar (research gjord utanför detta script, källor:
 * TechCrunch 13-15 nov 2026 + claude.com/blog/category/announcements som
 * primärkälla för Claude Meetings-fakta):
 *
 *   1. chatgpt-wallet-ai-agenter-handlar-at-dig       (teknik-modeller)
 *   2. anthropic-claude-meetings-videomote            (teknik-modeller)
 *   3. apple-ai-halsostudie-openevidence               (samhalle-paverkan)
 *
 * VIKTIGT (lärdom från förra publiceringen): lämnar published_at = null.
 * Användaren granskar innan vi sätter datum och går live — se
 * memory/feedback_review_before_publish.md. Covers: branded gradient-kort
 * (sharp+SVG) som placeholder tills riktiga bilder är beslutade.
 *
 *   npx tsx scripts/publish-ai-news-nov16.ts
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
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta (källa: TechCrunch, 13-15 november 2026, samt claude.com/blog för Claude Meetings — primärkällor, inte aggregatorer). Allt som markerats OBEKRÄFTAT/UNDER GRANSKNING måste tydligt ramas in som just det. Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

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
    slug: 'chatgpt-wallet-ai-agenter-handlar-at-dig',
    title: 'ChatGPT Wallet låter AI-agenten handla och betala åt dig',
    category: 'teknik-modeller',
    authorSlug: 'erik-lindgren',
    wordTarget: 1000,
    excerpt: 'OpenAI lanserar ChatGPT Wallet — en funktion som låter ChatGPTs AI-agenter välja produkter, lägga i varukorg och genomföra köp efter att du godkänt med Face ID eller fingeravtryck.',
    tags: ['OpenAI', 'ChatGPT', 'AI-agenter', 'agentic commerce', 'nyhet'],
    brandFrom: '#064e3b', brandTo: '#10b981',
    kicker: 'Ny funktion',
    relatedLinks: [{ url: '/ai-verktyg/chatgpt', label: 'ChatGPT-recension' }],
    brief: `Skriv en nyhetsartikel (~1000 ord) om: "ChatGPT Wallet låter AI-agenten handla och betala åt dig".

# VERIFIERAT (TechCrunch, 13 november 2026)
- OpenAI har annonserat ChatGPT Wallet, en funktion som låter ChatGPTs AI-agenter (kallade "dots") hjälpa användare välja produkter och genomföra köp åt dem.
- Så fungerar det: användaren lägger till ett betalkort i ChatGPT Wallet en gång. Därefter kan man be sin "dot" hjälpa till med ett köp. Innan köpet genomförs får användaren se varorna, totalsumman och vilket kort som belastas.
- Varje köp måste godkännas med en biometrisk kontroll (Face ID eller fingeravtryck), vilket skapar en transaktionslogg.
- Säkerhet: Wallet betalar med en betaltoken i stället för det riktiga kortnumret, så varken AI-agenten eller handlaren ser de faktiska kortuppgifterna. Agenten ger handlaren bara det som behövs för att slutföra ordern, t.ex. leveransadress och kontaktuppgifter.
- Köpen ger fortfarande vanliga kreditkorts-bonusar och skydd, inklusive möjligheten att bestrida en transaktion i efterhand.
- Tillgänglighet vid lansering: begränsad till en mindre grupp amerikanska ChatGPT Pro-prenumeranter. Användaren måste vara 18 år eller äldre och ha ett amerikanskt-utfärdat Visa-, Mastercard- eller American Express-kort. Inget pris nämns för själva funktionen.
- Planerade framtida förändringar enligt OpenAI: användare ska kunna sätta utgiftsgränser och regler per kategori eller tidsperiod, och på så sätt förhandsgodkänna vissa typer av köp så att agenten kan sköta dem med mindre direkt tillsyn.
- OpenAI vill få fler handlare att stödja funktionen och har publicerat en "Commerce Partner Playbook" som vägledning för handlare som vill stötta agent-baserade köp.
- Viktigt motstånd: vissa handlare blockerar AI-agenter helt. Amazon har förbjudit externa AI-agenter på sin plattform och satsar i stället på sin egen Alexa-agent.
- Artikeln namnger inga specifika handlare eller betalningspartners som deltar redan vid lansering — bara korten nätverken (Visa, Mastercard, Amex) som stöds.

# STRUKTUR
- Intro: AI-agenter går från att ge förslag till att faktiskt handla och betala åt oss — ChatGPT Wallet är OpenAIs första stora steg mot det, med tydliga säkerhetsspärrar inbyggda från start.
- <h2>Så fungerar ChatGPT Wallet</h2> — lägg till kort, be agenten handla, granska innan köp, biometrisk bekräftelse.
- <h2>Vad skyddar dig som kund?</h2> — betaltoken i stället för kortnummer, transaktionslogg, kvarvarande kortskydd/bonusar.
- <h2>Vem får använda den — och vem säger nej</h2> — begränsat till amerikanska Pro-kunder vid lansering, Amazons nej till externa agenter, Commerce Partner Playbook.
- <h2>Vad är på gång</h2> — utgiftsgränser, förhandsgodkända köpkategorier, fler handlare.
- <h2>Vår bedömning</h2> — kort, nykter reflektion: agentic commerce är fortfarande i sin linda, säkerhetsmodellen (biometri + token + granskningssteg) är rimlig på pappret, men avgörande blir hur få handlare faktiskt ansluter sig och hur mycket tillsyn användare i praktiken släpper när "förhandsgodkända köp" rullas ut.
- Kort avslutning.`,
  },
  {
    slug: 'anthropic-claude-meetings-videomote',
    title: 'Anthropic lanserar Claude Meetings — AI:n jobbar medan du pratar i videomötet',
    category: 'teknik-modeller',
    authorSlug: 'sara-nilsson',
    wordTarget: 950,
    excerpt: 'Anthropic har lanserat Claude Meetings, som bjuder in Claude till ditt videosamtal för att börja sammanfatta, planera och skapa uppgifter medan mötet fortfarande pågår. Samtidigt rullas Claude Whiteboards, Sheets och Data ut.',
    tags: ['Anthropic', 'Claude', 'videomöte', 'produktivitet', 'nyhet'],
    brandFrom: '#3730a3', brandTo: '#8b5cf6',
    kicker: 'Produktlansering',
    relatedLinks: [{ url: '/ai-verktyg/claude', label: 'Claude-recension' }],
    brief: `Skriv en nyhetsartikel (~950 ord) om: "Anthropic lanserar Claude Meetings — AI:n jobbar medan du pratar i videomötet".

# VERIFIERAT (claude.com/blog, primärkälla, samt TechCrunch, 10-13 november 2026)
- Anthropic annonserade den 10 november 2026 tre nya arbetsverktyg för Claude: Claude Whiteboards, Claude Sheets och Claude Data (tidigare kallat Claude Dashboards, nu allmänt tillgängligt). Claude Meetings annonserades som en egen nyhet strax efter, den 12 november 2026.
- Claude Meetings: lägger till Claude i ett videosamtal så att det kan börja arbeta med uppgiften medan deltagarna fortfarande pratar — enligt Anthropics egen formulering "få arbetet igång medan du pratar". Enligt TechCrunchs rapportering kan man under samtalet ställa frågor till Claude i realtid och få planer, tidslinjer och uppföljningsmaterial skapade innan mötet är slut.
- Plattform vid lansering: Claude Meetings fungerar vid lansering bara med Google Meet. Stöd för fler videotjänster väntas komma senare.
- Tillgänglighet: Claude Meetings är i betaversion och begränsad till betalande Team- och Enterprise-abonnemang — alltså inte tillgängligt för vanliga Pro- eller gratiskonton vid lansering.
- Claude Whiteboards och Claude Sheets är däremot i betaversion tillgängliga för ALLA betalande abonnemang (web, desktop och mobil), inte bara Team/Enterprise.
- Claude Data (tidigare Claude Dashboards) är nu allmänt tillgänglig (GA), inte bara beta.
- Enligt viss rapportering är på Team-abonnemang alla tre verktygen påslagna som standard. På Enterprise-abonnemang är Whiteboards och Sheets avstängda som standard, medan Claude Data slås på som standard från och med 19 november 2026. (Ramas in som enligt uppgift/rapporterat, inte Anthropics egna ord ordagrant bekräftade i blogginlägget.)
- Sammanhang: lanseringen kommer bara några veckor efter att OpenAI visat upp egna arbetsplatsverktyg, och Meta konkurrerar med sin Muse AI-agent. Flera bedömare kopplar även lanseringen till Anthropics planerade börsnotering, men det är analys/spekulation från omvärlden — inte något Anthropic själva uttalat sig om.

# STRUKTUR
- Intro: AI-assistenter har länge kunnat sammanfatta möten i efterhand. Claude Meetings flyttar det arbetet till att ske LIVE, medan mötet pågår — och lanseras tillsammans med tre andra nya Claude-verktyg som tillsammans formar något som liknar en AI-driven kontorssvit.
- <h2>Vad gör Claude Meetings?</h2> — live i mötet, frågor i realtid, planer/tidslinjer/uppföljning skapas innan mötet slutar, bara Google Meet vid start.
- <h2>Vilka får testa det?</h2> — beta, Team/Enterprise, inte Pro/gratis.
- <h2>Resten av sviten: Whiteboards, Sheets och Data</h2> — vad respektive verktyg är (whiteboard-brainstorming, kalkylblad, Data/Dashboards GA), vem som får dem och när, standardinställningar per abonnemang (ramat som rapporterat, inte 100% officiellt bekräftat av Anthropic).
- <h2>Varför just nu?</h2> — konkurrens från OpenAI och Metas Muse, spekulationen om börsnotering (tydligt markerad som omvärldens tolkning).
- Kort, nykter avslutning: ett tydligt tecken på att AI-labben nu tävlar om att äga hela arbetsflödet, inte bara chattfönstret.`,
  },
  {
    slug: 'apple-ai-halsostudie-openevidence',
    title: 'Apple startar AI-hälsostudie med 200 000 deltagare — så funkar den',
    category: 'samhalle-paverkan',
    authorSlug: 'erik-lindgren',
    wordTarget: 900,
    excerpt: 'Apple har lanserat en forskningsapp byggd tillsammans med OpenEvidence för att studera hur människor faktiskt använder AI för hälsofrågor — med upp till 200 000 amerikanska deltagare under minst ett år.',
    tags: ['Apple', 'AI och hälsa', 'integritet', 'forskning', 'nyhet'],
    brandFrom: '#0c4a6e', brandTo: '#0ea5e9',
    kicker: 'Hälsa & AI',
    relatedLinks: [],
    brief: `Skriv en nyhetsartikel (~900 ord) om: "Apple startar AI-hälsostudie med 200 000 deltagare — så funkar den".

# VERIFIERAT (TechCrunch, 15 november 2026)
- Apple har, tillsammans med det hälsofokuserade AI-bolaget OpenEvidence, lanserat en studie-app för att undersöka hur människor faktiskt använder AI för att ställa hälsofrågor.
- Appen blev tillgänglig för nedladdning i USA den 15 november 2026. Den är öppen att ladda ner, men deltagande kräver att man är berättigad.
- Krav för att delta: bosatt i USA, 21 år eller äldre, iPhone 15 eller senare, iOS 26 eller senare, samt Apple Intelligence aktiverat.
- Apple siktar på upp till 200 000 deltagare under en studieperiod på minst 12 månader. Artikeln beskriver inte i detalj hur samtycke eller anmälan går till.
- Funktion: användare kan ställa hälsofrågor och få förenklade svar förankrade i kliniska källor — artikeln namnger specifikt NEJM (New England Journal of Medicine), JAMA och Nature. Användare betygsätter svaren, ger feedback och fyller i månatliga enkäter.
- Valfri extra data: deltagare kan välja att dela HealthKit-data — t.ex. vilopuls, aktivitet, sömn och labbresultat — för mer skräddarsydda svar. Appen kan även hjälpa till att förbereda läkarbesök och, vid oroande symptom, peka användaren mot vårdgivare.
- Integritet: Apple uppger att data anonymiseras innan den går till en säker tredjeparts molntjänst, och att den INTE kommer att användas för att träna AI-modeller. OpenEvidence uppges radera fråge- och svarsdata efter 24 timmar.
- Koppling till Apple Health/Siri: artikeln specificerar inte om AI-svaren når själva Health-appen eller Siri — appen beskrivs som en separat forskningsstudie, inte en produktlansering.
- Sammanhang: artikeln noterar att både OpenAI och Anthropic redan lanserat hälsofokuserade chattbot-funktioner, och att OpenAI rapporterat över 300 miljoner hälsorelaterade frågor per vecka i sina produkter.

# STRUKTUR
- Intro: medan OpenAI och Anthropic redan byggt in hälsofunktioner i sina chattbotar, tar Apple ett annat spår — en renodlad forskningsstudie för att först FÖRSTÅ hur folk faktiskt använder AI för hälsofrågor, innan man bygger en produkt av det.
- <h2>Vem får vara med?</h2> — krav på ålder, bosättning, enhet, Apple Intelligence.
- <h2>Vad gör appen?</h2> — frågor, kliniskt förankrade svar (NEJM/JAMA/Nature), betygsättning, enkäter.
- <h2>Valfri HealthKit-data</h2> — vad man kan dela och vad det ger.
- <h2>Vad händer med din data?</h2> — anonymisering, ingen modellträning, 24-timmarsradering hos OpenEvidence — men var ärlig om att artikeln INTE beskriver hela samtyckesprocessen i detalj.
- <h2>Det större sammanhanget</h2> — OpenAI/Anthropics hälsofunktioner, 300 miljoner frågor/vecka, varför AI-hälsa är ett område alla stora aktörer nu rör sig in i.
- Kort avslutning: en studie, inte en lansering — men ett tydligt tecken på vart Apple är på väg.`,
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
