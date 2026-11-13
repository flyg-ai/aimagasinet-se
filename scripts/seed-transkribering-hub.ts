/**
 * Hub-sidan /ai-verktyg/transkribering ("Bästa AI för transkribering 2026").
 * Topplistan är kuraterad (lib/route-kind.ts CURATED_HUB_TOOL_SLUGS) och
 * blandar 3 befintliga recensioner (otter-ai, fireflies-ai, descript) med
 * 7 nya (sonix, trint, rev-com, happy-scribe, notta, assemblyai, deepgram).
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-transkribering-hub.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const content_mdx = `<p>Transkribering var länge ett rent kostnadsproblem — timmar av manuellt lyssnande och skrivande, eller dyr mänsklig transkription köpt per minut. AI har vänt upp och ner på den ekvationen. Moderna taligenkänningsmodeller klarar idag flera europeiska språk, flera talare och bakgrundsljud med en träffsäkerhet som för de flesta vardagsbehov är fullt användbar direkt, utan mänsklig efterredigering.</p>

<p>Men "AI-transkribering" är inte en enda produktkategori. Den spänner över allt från enkla mötesassistenter som sammanfattar ett Zoom-samtal, till renodlade transkriptionsverktyg för journalister och forskare, till rena API:er som utvecklare bygger egna röstprodukter ovanpå. Den här guiden går igenom de viktigaste alternativen i varje del av spektrumet och vad som faktiskt skiljer dem åt.</p>

<h2>Tre typer av transkriberingsverktyg</h2>

<h3>Mötesassistenter</h3>
<p>Den första kategorin är mötesassistenter som <a href="/ai-verktyg/otter-ai">Otter.ai</a> och <a href="/ai-verktyg/fireflies-ai">Fireflies.ai</a> — verktyg som kopplas in på Zoom, Google Meet eller Teams, spelar in mötet och levererar en transkription tillsammans med en AI-sammanfattning och ofta en lista på beslutade actionpunkter. De är inte i första hand byggda för fristående ljudfiler, utan för själva mötesflödet.</p>

<h3>Fristående transkriptionsverktyg</h3>
<p>Den andra kategorin är verktyg byggda för att transkribera inspelat material — intervjuer, poddavsnitt, föreläsningar, rättegångar — snarare än ett specifikt möte. Hit hör <a href="/ai-verktyg/sonix">Sonix</a>, <a href="/ai-verktyg/trint">Trint</a>, <a href="/ai-verktyg/rev-com">Rev</a>, <a href="/ai-verktyg/happy-scribe">HappyScribe</a> och <a href="/ai-verktyg/notta">Notta</a>. De flesta av dem kan visserligen också transkribera möten, men deras styrka ligger i redigeringsverktyg, undertextning, översättning och i vissa fall mänsklig kvalitetskontroll som tillval.</p>

<h3>Transkribering via API</h3>
<p>Den tredje kategorin är renodlade API:er som <a href="/ai-verktyg/assemblyai">AssemblyAI</a> och <a href="/ai-verktyg/deepgram">Deepgram</a>. De har inget användargränssnitt att logga in i — de är byggstenar som utvecklare integrerar i egna produkter: röstagenter, livetextning, diktering i en app. Om du letar efter något att öppna och klistra in en ljudfil i är de fel val. Om du bygger en produkt som behöver taligenkänning under huven är de ofta billigast och snabbast.</p>

<h2>Vad som faktiskt skiljer verktygen åt</h2>

<h3>Gratisnivå och pris</h3>
<p>Gratisnivåerna varierar kraftigt. <a href="/ai-verktyg/rev-com">Rev</a> ger 45 AI-minuter per månad utan kreditkort, <a href="/ai-verktyg/notta">Notta</a> ger 120 minuter men max 3 minuter per inspelning, och <a href="/ai-verktyg/happy-scribe">HappyScribe</a> ger obegränsad gratis mötesinspelning men bara 10 minuter för uppladdade filer. <a href="/ai-verktyg/sonix">Sonix</a> och <a href="/ai-verktyg/trint">Trint</a> saknar en löpande gratisnivå helt. På API-sidan ger både <a href="/ai-verktyg/assemblyai">AssemblyAI</a> (50 USD) och <a href="/ai-verktyg/deepgram">Deepgram</a> (200 USD) generösa engångskrediter som räcker långt för att testa.</p>

<h3>Språkstöd</h3>
<p>Om ni jobbar på flera språk är skillnaderna stora: HappyScribe (150+ språk) och Deepgram/AssemblyAI (60+ respektive brett stöd) ligger i topp, medan verktyg som Trint (50+ transkribering, 70+ översättning) och Sonix (54+) också täcker de flesta europeiska och stora världsspråk väl. Kontrollera alltid att just svenska stöds med god kvalitet innan ni binder er — stödet för mindre språk varierar mer mellan leverantörer än för engelska.</p>

<h3>Mänsklig kvalitetskontroll</h3>
<p>Ren AI-transkribering räcker för de flesta vardagsbehov, men för juridiska sammanhang, rättegångsutskrifter eller publicerat material där varje ord måste stämma är mänsklig verifiering fortfarande relevant. <a href="/ai-verktyg/rev-com">Rev</a> är det tydligaste exemplet i den här jämförelsen — AI som bas, mänsklig transkription som tillval från 1,99 USD/minut. <a href="/ai-verktyg/happy-scribe">HappyScribe</a> erbjuder motsvarande som tillägg.</p>

<h3>Utvecklarintegration</h3>
<p>Ska transkriberingen byggas in i en egen produkt — en röstagent, en app med livetextning, en diktafunktion — är <a href="/ai-verktyg/assemblyai">AssemblyAI</a> och <a href="/ai-verktyg/deepgram">Deepgram</a> rätt kategori. Båda prissätts per minut/timme ljud snarare än per användare, vilket blir betydligt billigare än en per-säte-licens vid höga volymer, men kräver att ni har utvecklarresurser för integrationen.</p>

<h2>Så väljer du rätt verktyg</h2>
<p>Börja med vad ni faktiskt ska transkribera. Handlar det om interna möten räcker en mötesassistent som Otter eller Fireflies. Handlar det om publicerat material — poddar, intervjuer, videor — är ett fristående verktyg med redigeringsstöd och undertextning mer värt. Handlar det om att bygga taligenkänning in i en egen produkt är API:erna rätt väg, inte en app.</p>
<p>Testa sedan på riktigt material, inte en ren studiointervju. Bakgrundsljud, flera talare som pratar i munnen på varandra och branschspecifik terminologi är där skillnaderna mellan verktygen syns tydligast — inte i en jämförelse av enstaka funktionslistor.</p>

<h2>Vanliga missuppfattningar</h2>
<p>En vanlig missuppfattning är att "AI-transkribering" är en mogen, utbytbar råvara där alla verktyg presterar likadant. I praktiken varierar träffsäkerheten påtagligt med ljudkvalitet, dialekt, facktermer och antal talare — ett verktyg som presterar utmärkt på en tydlig studioinspelning kan prestera klart sämre på ett sorligt konferenssamtal. En annan missuppfattning är att gratisnivåer är jämförbara rakt av: 45 minuter utan kreditkort (Rev) är ett annat erbjudande än 10 minuter för uppladdade filer (HappyScribe) eller 200 USD i API-krediter (Deepgram) — jämför alltid vad gratisnivån faktiskt täcker för er egen användning, inte bara siffran.</p>`;

const faq = [
  {
    question: 'Vilket AI-verktyg för transkribering är bäst för svenska?',
    answer: 'De flesta av verktygen i den här jämförelsen stödjer svenska, men kvaliteten varierar mer för mindre språk än för engelska. HappyScribe (150+ språk), Deepgram och AssemblyAI har bredast generellt språkstöd. Testa alltid med ert eget material — dialekt, bakgrundsljud och facktermer påverkar träffsäkerheten mer än vilket verktyg som helst egentligen förklarar i sin marknadsföring.',
  },
  {
    question: 'Är gratis AI-transkribering tillräckligt bra, eller behöver jag ett betalt verktyg?',
    answer: 'För korta, tydliga inspelningar räcker gratisnivåerna hos till exempel Rev (45 min/mån) eller HappyScribe (10 min för filer, obegränsad mötesinspelning) ofta bra. Vid regelbunden eller professionell användning — längre inspelningar, flera talare, krav på redigering eller undertexter — blir ett betalt abonnemang snabbt värt det i tid sparad.',
  },
  {
    question: 'Vad är skillnaden mellan en mötesassistent och ett transkriptionsverktyg?',
    answer: 'En mötesassistent som Otter.ai eller Fireflies.ai är byggd för att koppla in sig på ett videosamtal, spela in och sammanfatta det automatiskt. Ett fristående transkriptionsverktyg som Sonix eller Trint är byggt för att transkribera redan inspelat material — intervjuer, poddar, videor — med fokus på redigering, undertextning och export snarare än mötesintegration.',
  },
  {
    question: 'När ska jag välja ett API som AssemblyAI eller Deepgram istället för en app?',
    answer: 'Om ni bygger en egen produkt som behöver taligenkänning — en röstagent, livetextning i en app, en diktafunktion — är ett API rätt val, inte en färdig app. Det kräver utvecklarresurser för integrationen men blir betydligt billigare per minut ljud vid höga volymer än en abonnemangsbaserad app.',
  },
  {
    question: 'Behöver jag mänsklig transkription, eller räcker AI?',
    answer: 'För vardagligt bruk — mötesanteckningar, grovutkast till artiklar, undertexter för sociala medier — räcker ren AI-transkribering nästan alltid. För juridiska sammanhang, rättegångsutskrifter eller material som ska publiceras ordagrant utan felmarginal är mänsklig verifiering fortfarande relevant. Rev och HappyScribe erbjuder det som ett tillval ovanpå AI-transkriberingen.',
  },
  {
    question: 'Kan AI-transkribering hantera flera talare i samma inspelning?',
    answer: 'Ja, de flesta moderna verktyg i den här jämförelsen har talaridentifiering (diarisering) inbyggd, som delar upp transkriptionen per talare. Träffsäkerheten sjunker dock när flera personer pratar samtidigt eller avbryter varandra — ett problem som gäller alla leverantörer, inte bara vissa.',
  },
];

async function main() {
  const row = {
    slug: 'transkribering',
    title: 'Bästa AI för transkribering 2026 — 10 verktyg jämförda',
    excerpt: 'Jämförelse av de bästa AI-verktygen för transkribering 2026 — mötesassistenter, fristående transkriptionsverktyg och API:er som Sonix, Trint, Rev, HappyScribe, Notta, AssemblyAI och Deepgram.',
    content_mdx,
    category: null,
    tags: ['AI-transkribering'],
    featured_image: null,
    type: 'page',
    path: '/ai-verktyg/transkribering',
    parent_slug: 'ai-verktyg',
    affiliate_url: null,
    published_at: null,
    seo_title: 'Bästa AI för transkribering 2026 — 10 verktyg jämförda',
    seo_description: 'Jämför de bästa AI-verktygen för transkribering 2026: mötesassistenter, fristående verktyg och API:er. Betyg, priser och funktioner sida vid sida.',
    author_slug: 'nicklas-hallberg',
    faq,
  };
  const { data: existing } = await db.from('articles').select('slug').eq('path', row.path).maybeSingle();
  const { error } = existing
    ? await db.from('articles').update(row).eq('path', row.path)
    : await db.from('articles').insert(row);
  if (error) { console.error(error); process.exit(1); }
  console.log(`OK: transkribering-hub ${existing ? 'uppdaterad' : 'skapad'}`);
}
main();
