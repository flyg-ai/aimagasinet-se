/**
 * Hub-sidan /ai-verktyg/foto-bildredigering ("Bästa AI för foto &
 * bildredigering 2026"). Topplistan är kuraterad via CURATED_HUB_TOOL_SLUGS
 * i lib/route-kind.ts — 10 helt nya recensioner (se
 * scripts/seed-foto-bildredigering-reviews.ts), ingen återanvänd från
 * ai-bild-verktyg (textgenerering) eller produktbilder (e-handel).
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-foto-bildredigering-hub.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const SLUG = 'foto-bildredigering';
const PATH = '/ai-verktyg/foto-bildredigering';
const TITLE = 'Bästa AI för foto & bildredigering 2026';

const CONTENT_MDX = `<p>AI för foto och bildredigering handlar om att förbättra ett foto du redan har — inte om att skapa en helt ny bild från en textbeskrivning. Hit hör uppskalning av lågupplösta bilder, skärpning av suddiga foton, restaurering av gamla eller skadade bilder, kolorisering, och retuschering av ansikten och detaljer.</p>

<p>Den här guiden går igenom de ledande verktygen i kategorin: vad de faktiskt löser, hur de skiljer sig från varandra i kvalitet och pris, och hur du väljer rätt verktyg beroende på om du är fotograf, privatperson som vill rädda gamla familjebilder, eller någon som bara behöver en snabb fix i mobilen.</p>

<h2>Foto/bildredigering vs. bildgenerering — vad är skillnaden?</h2>
<p>Det är lätt att blanda ihop den här kategorin med <a href="/ai-verktyg/ai-bild-verktyg">AI-bildverktyg</a> som Midjourney eller DALL-E, men de löser helt olika problem. Bildgenerering skapar en ny bild från text — du har ingen originalbild, bara en idé. Foto- och bildredigeringsverktygen i den här guiden utgår istället alltid från ett foto du redan har: en suddig semesterbild, ett gammalt skannat familjefoto, eller ett porträtt som behöver skärpas upp. Om du säljer produkter och behöver bakgrunder och produktfoton specifikt, kolla istället vår guide till <a href="/ai-verktyg/produktbilder">AI för produktbilder</a>, som är inriktad på e-handel snarare än privata foton.</p>

<h2>De olika typerna av verktyg</h2>

<h3>Skrivbordsappar för fotografer</h3>
<p><a href="/ai-verktyg/topaz-photo-ai">Topaz Photo AI</a> och <a href="/ai-verktyg/luminar-neo">Luminar Neo</a> riktar sig mot fotografer som redan jobbar i Lightroom eller Photoshop och vill ha branschledande skärpning, brusreducering och kreativa AI-verktyg lokalt på datorn. Båda är skrivbordsappar, inte webbtjänster.</p>

<h3>Mobilappar för snabba fixar</h3>
<p><a href="/ai-verktyg/remini">Remini</a> och <a href="/ai-verktyg/picsart">Picsart</a> är byggda för mobilen: några klick för att skärpa upp ett gammalt foto eller ta bort en bakgrund, utan att behöva öppna en dator.</p>

<h3>Webbaserade allt-i-ett-verktyg</h3>
<p><a href="/ai-verktyg/lets-enhance">Let's Enhance</a>, <a href="/ai-verktyg/vanceai">VanceAI</a>, <a href="/ai-verktyg/fotor">Fotor</a> och <a href="/ai-verktyg/pixlr">Pixlr</a> körs i webbläsaren och täcker flera behov samtidigt — uppskalning, bakgrundsborttagning, kolorisering och i vissa fall enklare design, utan installation.</p>

<h3>Specialister på uppskalning och bakgrund</h3>
<p><a href="/ai-verktyg/magnific-ai">Magnific</a> (tidigare Freepik, som bytte namn i april 2026) är känt för kreativ uppskalning som lägger till realistiska detaljer snarare än bara skarpare pixlar. <a href="/ai-verktyg/cutout-pro">Cutout.pro</a> är smalare fokuserat på bakgrundsborttagning och kolorisering till lågt pris per bild.</p>

<h2>Hur verktygen skiljer sig åt i praktiken</h2>

<h3>Lokal app eller webbtjänst</h3>
<p>Topaz Photo AI, Luminar Neo och delar av VanceAI körs lokalt på din dator — bra om du vill ha full kontroll och inte skicka bilder till molnet. Övriga verktyg i guiden är webb- eller mobilbaserade, vilket är smidigare men innebär att bilderna laddas upp till leverantörens servrar.</p>

<h3>Abonnemang eller engångsköp</h3>
<p>De flesta verktygen i kategorin är kreditbaserade abonnemang. Luminar Neo sticker ut med ett engångsköp följt av en betydligt billigare årlig förnyelse, och VanceAI erbjuder en livstidslicens för sin skrivbordsapp som alternativ till det löpande abonnemanget.</p>

<h3>Hur förutsägbar kostnaden är</h3>
<p>Let's Enhance och Cutout.pro redovisar sina kreditpriser tydligast. Flera andra — Fotor, Picsart, Remini, Magnific — har priser som kräver att man öppnar en separat prissida, väljer faktureringsperiod eller region, och i några fall skiljer sig uppgifterna åt mellan oberoende källor. Räkna med att behöva testa gratisnivån själv för att se vad just er användning hamnar på.</p>

<h2>Vanliga fallgropar</h2>
<p>AI-uppskalning "hittar inte på" detaljer som aldrig fanns i originalbilden på ett neutralt sätt — särskilt kreativa uppskalare som Magnific lägger aktivt till nya, trovärdiga detaljer, vilket kan vara önskvärt för konstnärliga bilder men missvisande om bilden ska vara ett bevis eller dokumentation. Ett annat vanligt misstag är att förvänta sig att ett verktyg byggt för skärpning (som Topaz) också ska vara bäst på bakgrundsborttagning eller kolorisering — de flesta verktyg har en tydlig styrka och är svagare på resten.</p>

<h2>Så väljer du</h2>
<p>Är du fotograf som redan jobbar i Lightroom: Topaz Photo AI eller Luminar Neo. Vill du bara skärpa upp ett gammalt mobilfoto snabbt: Remini eller Picsart. Behöver du kraftig uppskalning till print: Let's Enhance eller Magnific. Vill du ha ett gratis, snabbt alternativ utan konto: Pixlr. Är bakgrundsborttagning och kolorisering i stora volymer huvudbehovet: Cutout.pro.</p>`;

const FAQ = [
  {
    question: 'Vad är skillnaden mellan AI för bildredigering och AI för bildgenerering?',
    answer:
      'Bildredigering utgår alltid från ett foto du redan har och förbättrar, skalar upp eller restaurerar det. Bildgenerering (som Midjourney eller DALL-E) skapar en helt ny bild från en textbeskrivning, utan något originalfoto. Det är två olika verktygskategorier även om de ofta blandas ihop.',
  },
  {
    question: 'Vilket AI-verktyg är bäst för att rädda gamla, suddiga foton?',
    answer:
      'Remini och Topaz Photo AI är båda starka på det, men för olika användare: Remini är en mobilapp med extremt låg tröskel, medan Topaz Photo AI är en skrivbordsapp med högre kvalitetstak för den som vill ha branschens starkaste resultat.',
  },
  {
    question: 'Finns det gratis AI-verktyg för fotoredigering?',
    answer:
      'Ja. Pixlr har en helt gratis grundredigerare utan krav på konto. Let\'s Enhance, Fotor, Picsart och Cutout.pro har alla gratisnivåer med begränsat antal krediter, oftast med vattenstämpel eller annonser.',
  },
  {
    question: 'Är AI-uppskalning samma sak som att bara göra en bild större?',
    answer:
      'Nej. Vanlig uppskalning gör bilden större men suddigare. AI-uppskalning (Topaz Photo AI, Let\'s Enhance, Magnific) lägger till ny, trovärdig detalj baserat på vad AI:n "tror" borde finnas där — resultatet blir skarpare, men innehållet är delvis AI-genererat snarare än bevarat från originalet.',
  },
  {
    question: 'Behöver jag en skrivbordsapp eller räcker webben/mobilen?',
    answer:
      'För sporadiskt bruk räcker webb- eller mobilverktyg som Pixlr, Remini eller Picsart gott. Om du är fotograf som bearbetar bilder regelbundet, vill ha lokal bearbetning utan att ladda upp bilder, eller använder Lightroom/Photoshop redan, är en skrivbordsapp som Topaz Photo AI eller Luminar Neo oftast värt investeringen.',
  },
];

async function main() {
  const { data: existing } = await db.from('articles').select('id').eq('path', PATH).maybeSingle();

  const payload = {
    slug: SLUG,
    path: PATH,
    title: TITLE,
    excerpt:
      'Jämförelse av de bästa AI-verktygen för foto & bildredigering 2026 — Topaz Photo AI, Remini, Let\'s Enhance, VanceAI, Magnific och fler, rankade efter betyg, pris och funktioner.',
    content_mdx: CONTENT_MDX,
    faq: FAQ,
    seo_title: 'Bästa AI för foto & bildredigering 2026 — jämförelse & test',
    seo_description:
      'Jämför de bästa AI-verktygen för foto och bildredigering 2026 — Topaz Photo AI, Remini, Let\'s Enhance, VanceAI, Magnific med flera. Betyg, priser och funktioner sida vid sida.',
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
    console.log('OK (update): foto-bildredigering hub');
  } else {
    const { error } = await db.from('articles').insert(payload);
    if (error) { console.error(error); process.exit(1); }
    console.log('OK (insert): foto-bildredigering hub');
  }
}
main();
