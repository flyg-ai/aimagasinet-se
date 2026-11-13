/**
 * Hub-sidan /ai-verktyg/produktbilder ("Bästa AI för produktbilder 2026").
 * Topplistan är kuraterad via CURATED_HUB_TOOL_SLUGS i lib/route-kind.ts
 * (10 verktyg: removebg-bredig + 9 nya). published_at=null — väntar på
 * granskning + bild.
 *
 *   npx tsx scripts/seed-produktbilder-hub.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const content_mdx = `<p>E-handel lever och dör med produktbilderna. En otydlig eller inkonsekvent bild kan kosta en försäljning innan köparen ens läst produktbeskrivningen — och en riktig fotostudio med fotograf, visagist och efterbearbetning är sällan en rimlig kostnad för en enskild produkt eller ett litet sortiment. AI-verktyg för produktbilder löser det genom att låta dig byta bakgrund, lägga till skuggor, generera lifestyle-scener eller till och med visa kläder på en AI-modell — utifrån en enda råbild, ofta tagen med mobilkameran.</p>

<p>Den här guiden går igenom vad AI-produktbildsverktyg faktiskt gör, vilka olika typer som finns, och hur du väljer rätt verktyg beroende på om du säljer enstaka produkter, driver en hel e-handelsbutik, eller hanterar bilder från flera leverantörer åt ett större varumärke.</p>

<h2>Vad AI-produktbildsverktyg faktiskt gör</h2>
<p>Kategorin spänner över flera olika typer av verktyg, och det är lätt att blanda ihop dem eftersom de alla levererar "en bättre produktbild" i slutändan — men vägen dit, och vad du faktiskt betalar för, skiljer sig mycket.</p>

<h3>Bakgrundsbyte och grundläggande redigering</h3>
<p>Den enklaste och billigaste kategorin är ren bakgrundsborttagning och bakgrundsbyte: du laddar upp en bild, AI:n separerar produkten från bakgrunden, och ersätter den med vitt, en färg eller en genererad scen. <a href="/ai-verktyg/pebblely">Pebblely</a> och <a href="/ai-verktyg/pixelcut">Pixelcut</a> är tydliga exempel — båda gör den här uppgiften snabbt och billigt, utan att försöka vara något mer. <a href="/ai-verktyg/removebg-bredig">remove.bg</a> är den mest etablerade, renodlade bakgrundsborttagaren i kategorin.</p>

<h3>Allt-i-ett-plattformar</h3>
<p><a href="/ai-verktyg/photoroom">Photoroom</a> representerar en bredare kategori: bakgrundsbyte, AI-modeller, batch-redigering och videoannonser i samma verktyg, med Shopify-integration och API för den som vill bygga in funktionerna i egna flöden. Det kostar oftast mer än de renodlade bakgrundsverktygen, men sparar tid att slippa kombinera flera separata tjänster.</p>

<h3>On-model och mode-specifika verktyg</h3>
<p>För kläder, skor och accessoarer finns en egen underkategori: verktyg som gör om flat lays eller ghost mannequin-bilder till bilder där plagget visas på en modell. <a href="/ai-verktyg/botika">Botika</a> och <a href="/ai-verktyg/flair-ai">Flair AI</a> är de tydligaste exemplen — Botika med ett stort färdigt bibliotek av AI-modeller, Flair AI med en canvas-editor som ger mer kreativ kontroll över scenen.</p>

<h3>API-drivna plattformar för skala</h3>
<p>För utvecklare och företag som vill bygga in bildgenerering i egna system, snarare än att logga in i ett webbgränssnitt varje gång, finns API-fokuserade alternativ som <a href="/ai-verktyg/bria">Bria</a> och <a href="/ai-verktyg/claid-ai">Claid</a>. Båda prissätter per generering eller per krediter snarare än ett fast abonnemang, vilket gör dem lättare att räkna kostnad på vid stora volymer.</p>

<h3>Done-for-you-tjänster</h3>
<p>Inte alla lösningar är helautomatiserade. <a href="/ai-verktyg/pixc">Pixc</a> är en redigeringstjänst där ett team (med AI-stöd) gör jobbet åt dig och du bara betalar för bilder du godkänner — ett lågriskalternativ för den som hellre lämnar bort uppgiften helt. <a href="/ai-verktyg/autoretouch">AutoRetouch</a> löser ett liknande men mer storskaligt problem: att standardisera bilder från många olika leverantörer till en enhetlig varumärkesprofil, riktat mot större kedjor snarare än enskilda säljare.</p>

<h2>Så väljer du rätt verktyg</h2>
<p>Börja med volymen, inte funktionslistan. Säljer du några enstaka produkter räcker ett enkelt, billigt bakgrundsverktyg som Pebblely eller Pixelcut gott och väl. Driver du en hel butik med löpande behov av nya produktbilder är det värt att betala mer för ett bredare verktyg som Photoroom, som täcker både bild, video och batch-bearbetning i samma prenumeration.</p>

<p>Säljer du kläder specifikt, är on-model-bilder sannolikt den enskilt mest värdefulla investeringen — att slippa boka fotograf och modell för varje kollektion sparar både tid och pengar, och Botika eller Flair AI är då mer relevanta än de generella bakgrundsverktygen.</p>

<p>Har du en utvecklingsavdelning och vill bygga bildgenerering in i ett eget system eller PIM, är de API-drivna alternativen som Bria och Claid mer relevanta än något webbgränssnitt — du betalar per bild istället för ett abonnemang du kanske inte fyller.</p>

<h2>Vanliga misstag att undvika</h2>
<p>Ett vanligt misstag är att välja verktyg efter pris utan att räkna på faktisk volym — en billig plan med lågt bildtak kan bli dyrare i praktiken om du snabbt springer ur krediterna och måste köpa på mer. Ett annat är att anta att alla verktyg gör samma sak: ett renodlat bakgrundsverktyg löser inte behovet av on-model-bilder, och ett API-verktyg hjälper inte den som bara vill klicka sig fram i ett enkelt gränssnitt.</p>

<p>Kontrollera också alltid vad som faktiskt ingår i en gratis provperiod eller gratisnivå innan du bygger ett arbetsflöde runt ett verktyg — flera av verktygen i den här listan har antingen ingen gratisnivå alls, eller en mycket begränsad sådan som bara räcker för att testa funktionen, inte för löpande produktion.</p>`;

const faq = [
  {
    question: 'Vilket AI-verktyg är bäst för produktbilder om jag bara säljer några få produkter?',
    answer: 'Pebblely eller Pixelcut är bra startpunkter — båda är billiga, enkla att komma igång med och gör bakgrundsbyte/bakgrundsborttagning snabbt utan att kräva att du lär dig ett avancerat gränssnitt.',
  },
  {
    question: 'Kan AI ersätta en riktig produktfotografering helt?',
    answer: 'För många produkter, ja — särskilt för kataloger med många liknande artiklar. För varumärkeskritiska kampanjbilder väljer många fortfarande en blandning: riktig fotografering för hero-bilder, AI för löpande kataloguppdateringar och variationer.',
  },
  {
    question: 'Vilket verktyg passar bäst för att visa kläder på en modell utan fotografering?',
    answer: 'Botika och Flair AI är mest specialiserade på det här — Botika med ett stort färdigt bibliotek av AI-modeller, Flair AI med mer kontroll via en canvas-editor om du vill bygga scenen själv.',
  },
  {
    question: 'Är det juridiskt säkert att använda AI-genererade produktbilder kommersiellt?',
    answer: 'De flesta leverantörer i den här listan ger kommersiell licens på betalplanerna, men villkoren skiljer sig åt. Bria är tydligast med att betona fullt licensierad träningsdata och indemnifiering — relevant om du är orolig för legala risker kring bildrättigheter.',
  },
  {
    question: 'Behöver jag kunna koda för att använda dessa verktyg?',
    answer: 'Nej, de flesta (Photoroom, Pebblely, Pixelcut, Botika, Flair AI, Pixc) är webbgränssnitt utan kodkrav. Bria, Claid och AutoRetouch är mer riktade mot API-integration och utvecklare, även om Claid också har ett webbgränssnitt.',
  },
  {
    question: 'Vad kostar AI-produktbilder jämfört med en fotograf?',
    answer: 'De flesta AI-verktygen kostar mellan 10 och 80 USD per månad för löpande användning, vilket oftast är betydligt billigare än att boka en fotograf per produkt — men jämförelsen beror helt på volym och hur många bilder du faktiskt behöver per månad.',
  },
];

async function main() {
  const path = '/ai-verktyg/produktbilder';
  const row = {
    slug: 'produktbilder',
    path,
    title: 'Bästa AI för produktbilder 2026',
    type: 'page',
    category: null,
    parent_slug: 'ai-verktyg',
    published_at: null,
    author_slug: 'nicklas-hallberg',
    seo_title: 'Bästa AI för produktbilder 2026 — 10 verktyg jämförda',
    content_mdx,
    faq,
  };
  const { data: existing } = await db.from('articles').select('id').eq('path', path).maybeSingle();
  if (existing) {
    const { error } = await db.from('articles').update(row).eq('id', existing.id);
    if (error) { console.error(error); process.exit(1); }
    console.log('OK (update): produktbilder hub');
  } else {
    const { error } = await db.from('articles').insert(row);
    if (error) { console.error(error); process.exit(1); }
    console.log('OK (insert): produktbilder hub');
  }
}
main();
