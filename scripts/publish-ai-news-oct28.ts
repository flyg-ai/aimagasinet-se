/**
 * Generera 3 nyhetsartiklar (research gjord utanför detta script, källa:
 * TechCrunch, 27 okt 2026 — primärkälla, inte aggregator):
 *
 *   1. google-genie-4-varldsmodell-ljud       (teknik-modeller)
 *   2. bank-of-america-varnar-ai-assistenter  (ai-sakerhet-etik)
 *   3. openai-anthropic-exponential-time-hypothesis (forskning-utveckling)
 *
 * VIKTIGT (lärdom från förra publiceringen): lämnar published_at = null.
 * Användaren granskar innan vi sätter datum och går live — se
 * memory/feedback_review_before_publish.md. Covers: branded gradient-kort
 * (sharp+SVG) som placeholder tills riktiga bilder är beslutade.
 *
 *   npx tsx scripts/publish-ai-news-oct28.ts
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
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta (källa: TechCrunch, 27 oktober 2026 — en primär nyhetskälla, inte en aggregator). Allt som markerats OBEKRÄFTAT/UNDER GRANSKNING måste tydligt ramas in som just det. Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

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
    slug: 'google-genie-4-varldsmodell-ljud',
    title: 'Google visar Genie 4 — världsmodell som nu genererar ljud i realtid',
    category: 'teknik-modeller',
    authorSlug: 'erik-lindgren',
    wordTarget: 1100,
    excerpt: 'Google DeepMind har visat Genie 4, nästa generation av sin interaktiva "världsmodell" — nu med realtidsljud, mer fotorealistiska scener och dubbelt så lång scenkonsistens som föregångaren.',
    tags: ['Google DeepMind', 'Genie', 'världsmodell', 'Gemini', 'AI-forskning', 'nyhet'],
    brandFrom: '#1e3a8a', brandTo: '#06b6d4',
    kicker: 'Ny modell',
    relatedLinks: [{ url: '/ai-verktyg/ai-video', label: 'AI-videoverktyg' }],
    brief: `Skriv en nyhetsartikel (~1100 ord) om: "Google visar Genie 4 — världsmodell som nu genererar ljud i realtid".

# VERIFIERAT (TechCrunch, 27 okt 2026)
- Google DeepMind har släppt Genie 4 i research preview (tillgänglig för betrodda testare), tisdagen den 27 oktober 2026.
- Genie är en "världsmodell": en AI som genererar interaktiva, simulerade världar som användaren kan navigera i och förändra genom textprompts mitt i simuleringen.
- Nytt i Genie 4 jämfört med föregångaren Genie 3 (som kom som research preview drygt ett år tidigare):
  - Fri redigering i realtid — användaren kan t.ex. ändra väder, kameravinkel, eller lägga till personer/objekt medan simuleringen pågår.
  - Scenkonsistens i upp till två minuter — dubbelt så länge som Genie 3 klarade.
  - Bättre fysik och mer människolika karaktärer.
  - Mer fotorealistiska scener generellt.
- Ljud: Genie 4 genererar realtidsljud som matchar den simulerade världen — musik, bakgrundsljud och interaktiv dialog. Detta är den stora nyheten jämfört med tidigare versioner.
- Gemini fungerar som "regissör": Gemini planerar steg och kontrollerar bildrutor medan Genie genererar själva visuella innehållet.
- Robotik-experiment: i ett forskningsexperiment kopplat till Gemini Robotics bröt en Gemini-modell (kallad "Gemini 4 Argon" i källan) ner uppgifter i steg som Genie 4 simulerade i realtid — ett sätt att testa robotscenarier i simulering innan verklig användning.
- Avsedda användningsområden enligt Google: spel, interaktivt lärande och robotik. Betrodda testare lyfter även fram prototyparbete för film — en DeepMind-ingenjör (Diego Rivas) nämner storyboarding och snabb idégenerering som användningsfall.
- Kända begränsningar (Google själva nämner detta): detaljer och objekt kan "driva" (bli inkonsekventa) under längre simuleringar. Teamet har ännu inte löst hur man säkerställer korrekt ljud eller läsbar text inuti de genererade världarna. Det är tidigt, och den färdiga produktupplevelsen är enligt Google själva fortfarande oklar.
- Tillgänglighet framöver: utrullning till Google AI Ultra-prenumeranter inom Project Genie, samt till early access-partners för Gemini API och Google AI Studio, väntas inom de kommande veckorna.
- Branschsammanhang: Runway släppte sin andra världsmodell (GWM Worlds 2) ett par månader tidigare. AMD håller på att förvärva World Labs, Amazon rapporteras vara i förhandlingar om att köpa Decart, och Rivian har förvärvat Third Dimension — "världsmodeller" är alltså ett område där flera stora aktörer investerar samtidigt.

# STRUKTUR
- Intro: slå an nyheten — Google visar nästa generation av sin "AI-genererade virtuella värld"-teknik, och den stora nyheten är ljud i realtid.
- <h2>Vad är en världsmodell?</h2> — kort, pedagogiskt för läsare som inte känner till konceptet (jämför gärna med ett spel som genereras av AI medan du spelar det, snarare än förprogrammerat).
- <h2>Vad är nytt i Genie 4?</h2> — ljud, fri redigering, längre scenkonsistens, bättre fysik.
- <h2>Gemini som regissör och robotik-experimentet</h2>.
- <h2>Var kan den användas — och vad är fortfarande oklart?</h2> — användningsområden + Googles egna reservationer om begränsningar.
- <h2>Tillgänglighet</h2> — research preview nu, bredare utrullning inom veckor.
- <h2>Ett växande fält</h2> — kort om Runway, AMD/World Labs, Amazon/Decart som kontext.
- Kort, nykter avslutning.`,
  },
  {
    slug: 'bank-of-america-varnar-ai-assistenter',
    title: 'Bank of America varnar kunder: dela inte ditt lösenord med AI-assistenten',
    category: 'ai-sakerhet-etik',
    authorSlug: 'sara-nilsson',
    wordTarget: 950,
    excerpt: 'Bank of America har skickat ut en varning till sina kunder om att dela inloggningsuppgifter med AI-assistenter och -agenter — en påminnelse om att "agentic AI" redan skapar verkliga säkerhetsproblem för banker.',
    tags: ['AI-säkerhet', 'bank', 'AI-agenter', 'lösenord', 'nyhet'],
    brandFrom: '#7f1d1d', brandTo: '#dc2626',
    kicker: 'Säkerhet',
    relatedLinks: [{ url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT-recension' }],
    brief: `Skriv en nyhetsartikel (~950 ord) om: "Bank of America varnar kunder: dela inte ditt lösenord med AI-assistenten".

# VERIFIERAT (TechCrunch, 27 okt 2026)
- Bank of America har skickat ett mejl till sina kunder med rubriken "Protecting your finances in the AI World" (på svenska ungefär "Skydda din ekonomi i AI-världen").
- Mejlet varnar uttryckligen för att dela sitt användarnamn och lösenord med en annan person ELLER med "ett AI-drivet verktyg eller en agent som erbjuder sig att agera å dina vägnar" — alltså specifikt riktat mot AI-assistenter/AI-agenter, inte bara mänskliga bedragare.
- En talesperson för banken bekräftade att mejlet är äkta, efter att det delats på sociala medier.
- Bakgrunden enligt artikeln: allt fler kunder ger sina inloggningsuppgifter till personliga AI-assistenter för att låta dem sköta ärenden.
- Bankens tre huvudargument i mejlet/enligt artikeln:
  1. En AI-assistent skulle kunna utföra transaktioner med dina pengar utan att du vet om det.
  2. Banken kan misstolka AI-assistentens aktivitet som ett kapat konto och låsa dig ute.
  3. En säkerhetsbrist i en AI-assistent skulle kunna läcka dina bankuppgifter och ge ekonomiskt motiverade hackare tillgång till kontot.
- Enligt de flesta bankers kontovillkor är kunden själv ansvarig för vad som helst som görs av den man delat sina inloggningsuppgifter med. Mejlet ska enligt uppgift innehålla formuleringen att kunden "är ansvarig för aktivitet som uppstår från den åtkomsten".
- Bredare sammanhang från artikeln: banker uppges brottas med obehöriga AI-agenter som får tillgång till kunders konton, och är fortfarande i färd med att reda ut hur kunder ska kunna använda AI-verktyg tillsammans med sina konton på ett säkert sätt. Ett exempel som nämns är "agentic payments" — AI-agenter som autonomt handlar/köper saker åt användaren till bästa pris eller vid rätt tidpunkt.

# STRUKTUR
- Intro: en stor amerikansk bank säger rakt ut till sina kunder: lita inte på din AI-assistent med ditt lösenord. Etablera varför det är en logisk men ändå talande nyhet — AI-agenter går från chatt till att faktiskt agera åt oss, och det skapar nya säkerhetshål.
- <h2>Vad säger Bank of America?</h2> — mejlets innehåll, bekräftelsen.
- <h2>Varför är det här ett problem just nu?</h2> — de tre riskerna banken lyfter.
- <h2>Vem bär ansvaret om något går fel?</h2> — kontovillkor, kundens eget ansvar.
- <h2>Det större mönstret: agentic AI möter bankvärlden</h2> — obehöriga agenter, agentic payments, bankernas pågående anpassning.
- <h2>Vår rekommendation</h2> — praktiskt råd till läsare: dela aldrig lösenord rakt av med en AI-tjänst; skilj på "agentic"-funktioner som byggs in av banken själv (t.ex. framtida säkra API-kopplingar) och att manuellt klistra in sitt lösenord i en chattbot eller tredjepartsverktyg; var extra vaksam på AI-tjänster som ber om inloggningsuppgifter direkt.
- Kort avslutning.`,
  },
  {
    slug: 'openai-anthropic-exponential-time-hypothesis',
    title: 'OpenAI och Anthropic säger sig ha motbevisat en 25 år gammal matematisk gåta',
    category: 'forskning-utveckling',
    authorSlug: 'erik-lindgren',
    wordTarget: 1000,
    excerpt: 'OpenAI och Anthropic uppger att deras AI-modeller hittat lösningar som motbevisar "Exponential Time Hypothesis" — ett 25 år gammalt antagande inom komplexitetsteori. Oberoende forskare granskar fortfarande resultaten.',
    tags: ['OpenAI', 'Anthropic', 'AI-forskning', 'matematik', 'komplexitetsteori', 'nyhet'],
    brandFrom: '#064e3b', brandTo: '#10b981',
    kicker: 'AI-forskning',
    relatedLinks: [{ url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT-recension' }, { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude-recension' }],
    brief: `Skriv en nyhetsartikel (~1000 ord) om: "OpenAI och Anthropic säger sig ha motbevisat en 25 år gammal matematisk gåta". Vinkel: nyfiken, pedagogisk, men tydligt ärlig om att det INTE är bekräftat än.

# VERIFIERAT (TechCrunch, 27 okt 2026)
- OpenAI släppte lösningar på tre svåra matematiska problem. En av lösningarna påstods motbevisa "Exponential Time Hypothesis" (ETH).
- Några timmar senare publicerade Anthropic en egen motbevisning av ETH på GitHub.
- Anthropics matematiker Levent Alpöge ska ha antytt att OpenAIs lösningar byggde på redan existerande (tidigare känt) arbete.
- Vad ETH är: ett långvarigt antagande inom datalogi/komplexitetsteori, introducerat 1999 av Russell Impagliazzo och Ramamohan Paturi vid UC San Diego. Det är kopplat till det berömda "P mot NP"-problemet — frågan om problem vars lösningar är lätta att KONTROLLERA också är lätta att LÖSA. De flesta forskare tror att P ≠ NP, och ETH stödjer den synen genom att hävda att även de snabbaste algoritmerna behöver exponentiellt mer tid när antalet variabler växer, för vissa svåra logiska pussel.
- Vad som påstås: labben säger att deras modeller hittat algoritmer som löser dessa pussel i "sub-exponentiell" tid — snabbare än man tidigare trott var möjligt. Om det stämmer skulle det motbevisa ETH och potentiellt öppna en väg mot algoritmer närmare P = NP.
- VERIFIERINGSSTATUS — detta är kärnan i artikeln, var mycket tydlig: Artikeln bekräftar INTE att bevisen är korrekta. Det datalogiska forskarsamfundet granskar fortfarande. Ryan Williams, MIT-professor som organiserar fältets granskning, säger att OpenAIs algoritm sannolikt inte är den bästa möjliga, och att resultatet INTE avgör frågan slutgiltigt.
- Process: OpenAI publicerade olika discipliners resultat på olika sätt — matematikerna fick det på GitHub; datalogerna bildade en arbetsgrupp, bad om offentliga bevis och bad OpenAI finansiera en konferens om resultaten; fysikerna bildade en egen grupp för att besluta hur deras resultat ska publiceras.
- Ryan Williams hade tidigare kritiserat OpenAIs oktober-publicering av bevis som en "DDOS-attack mot matematiker" — men gick ändå med på att hjälpa tolka det nya resultatet. Williams, Impagliazzo och Paturi publicerade ett öppet brev där de efterlyser återkoppling och diskuterar normer för AI-bidrag till forskning.
- Williams säger att vissa delar av beviset är rutinmässiga, men att "två eller tre delar ser utomjordiska ut" (hans ord, återges som citat i källan).
- Implikationer om det stämmer: många publicerade forskningsartiklar bygger på ETH och kan behöva omprövas. Williams frågade OpenAI om resultatet försvagar några kryptografiska system — OpenAI svarade att de kontrollerat och är rimligt säkra på att det inte innebär några "brott" mot kryptografi. Williams menar att datalogerna bör ge något större tyngd åt att P = NP är rimligt, och att resultatet utmanar fältets intuition om svåra problem.

# STRUKTUR
- Intro: en AI-labb-kapplöpning om matematik — OpenAI och Anthropic säger båda att de motbevisat ett 25 år gammalt antagande inom komplexitetsteori, inom loppet av samma dag. Slå an att detta är stort OM det stämmer — men att "om" gör tung hävstång här.
- <h2>Vad är Exponential Time Hypothesis?</h2> — pedagogisk förklaring, koppling till P vs NP, varför det spelar roll för datalogi.
- <h2>Vad påstår labben?</h2> — OpenAIs och Anthropics resultat, tidslinjen samma dag.
- <h2>Är det bekräftat?</h2> — Nej. Var tydlig: MIT-professorn Ryan Williams granskar, säger resultatet inte avgör frågan, att OpenAIs lösning sannolikt inte är optimal.
- <h2>En bråkig process</h2> — "DDOS-attack mot matematiker"-kritiken, arbetsgruppen, det öppna brevet om normer för AI i forskning.
- <h2>Om det stämmer — vad betyder det?</h2> — konsekvenser för publicerad forskning, kryptografi-frågan och OpenAIs svar, P=NP-perspektivet.
- Kort avslutning: ett bra exempel på att AI-modeller nu bidrar till kant-av-fältet-forskning inom matematik, men att det bråkiga och snabba publiceringstempot skapar friktion med hur vetenskaplig granskning normalt fungerar.`,
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
