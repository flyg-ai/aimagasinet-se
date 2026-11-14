/**
 * 6 nya recensioner för /ai-verktyg/ai-bild-verktyg (utökning 14 -> 20 verktyg).
 * Recraft, Krea AI, Grok Imagine, Reve, NightCafe Studio, Qwen-Image.
 * parent_slug='ai-bild-verktyg' (plain parent_slug-matchning, ingen curated-lista).
 * published_at: null — väntar på granskning.
 *
 *   npx tsx scripts/seed-ai-bild-verktyg-ext-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

type Row = { slug: string; title: string; content_mdx: string };

const ROWS: Row[] = [
  {
    slug: 'recraft',
    title: 'Recraft',
    content_mdx: `<p><strong>Betyg: 8.2/10</strong></p>
<h2>Recraft recension 2026 — bildgenerator byggd för designers och varumärken</h2>
<p>Recraft skiljer sig från de flesta bildgeneratorer genom att vara byggt med grafisk design i åtanke snarare än ren konst: verktyget kan hålla samma visuella stil över flera bilder, generera vektorgrafik direkt (inte bara rastergrafik) och exportera SVG-filer som går att redigera vidare i andra designverktyg.</p>
<h2>Vad är Recraft?</h2>
<p>Recraft är en AI-bildgenerator som riktar sig mot designers, varumärken och marknadsföringsteam som behöver konsekvent visuell stil över många bilder — t.ex. en hel uppsättning ikoner eller illustrationer i samma look. Det är ett av få verktyg i kategorin som genererar riktig vektorgrafik, inte bara png/jpg.</p>
<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Vektorgenerering:</strong> Skapar SVG-filer direkt, redigerbara i Illustrator/Figma, inte bara rastergrafik.</li>
<li><strong>Stilkonsistens:</strong> Håller samma visuella stil över en hel serie bilder, bra för varumärkesmaterial.</li>
<li><strong>Flera modeller:</strong> Egna V4/V4.1-modeller plus en snabbare "Flash"-variant för lägre kostnad per bild.</li>
<li><strong>API:</strong> Prissatt per bild (API Units), separat från abonnemangen.</li>
</ul>
<h2>Så bra är det i praktiken</h2>
<p>Recrafts styrka är tydlig så fort man behöver mer än en enstaka snygg bild — vektorexporten och stilkonsistensen gör det till ett av få AI-bildverktyg som faktiskt passar in i en designers vanliga arbetsflöde, inte bara som en fristående leksak. Svagheten är att priserna skiljer sig påtagligt mellan olika källor och har ändrats flera gånger under 2026 (bl.a. bytt till enhetsbaserad API-fakturering i augusti), så räkna med att behöva dubbelkolla aktuellt pris direkt på recraft.ai innan ni binder er.</p>
<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Enda stora verktyget i kategorin med riktig vektorexport (SVG).</li>
<li><strong>Fördel:</strong> Stark stilkonsistens över flera bilder — bra för varumärkesarbete.</li>
<li><strong>Nackdel:</strong> Gratisnivån är starkt begränsad (3 genereringar per stil/dag) och bilderna blir offentliga.</li>
<li><strong>Nackdel:</strong> Prissättningen har ändrats flera gånger under 2026 och skiljer sig mellan källor — svårt att veta exakt vad man betalar innan man loggar in.</li>
</ul>
<h2>Pris och planer</h2>
<p>Gratisnivå med starka begränsningar och ingen kommersiell licens. Betalda planer (Basic/Pro/Teams) har funnits i spannet 10–22 USD/mån beroende på källa och faktureringsperiod, men siffrorna skiljer sig åt mellan oberoende jämförelser och prissättningen har ändrats under året. API:et fakturerar separat per bild i "API Units". Kontrollera aktuellt pris på recraft.ai/pricing.</p>
<h2>För vem passar Recraft?</h2>
<p>Recraft passar bäst för designteam och varumärken som behöver många bilder i samma visuella stil, eller som vill ha redigerbar vektorgrafik snarare än färdiga rasterbilder.</p>
<h2>Vårt omdöme</h2>
<p>Recraft fyller en tydlig nisch som Midjourney och DALL-E inte täcker — vektorgrafik och stilkonsistens för designarbete. Den rörliga, källspretiga prissättningen drar ner betyget något. Med 8,2 av 10 är det ett starkt val specifikt för design- och varumärkesarbete, mindre självklart för fri konstnärlig bildgenerering.</p>`,
  },
  {
    slug: 'krea-ai',
    title: 'Krea AI',
    content_mdx: `<p><strong>Betyg: 8.4/10</strong></p>
<h2>Krea AI recension 2026 — allt-i-ett-plattform för bild, video och 3D</h2>
<p>Krea är inte bara en bildgenerator — det är en bred kreativ plattform som samlar bildgenerering, realtidsmodeller, uppskalning, videomodeller, 3D och lipsync under samma tak, med ett gemensamt kreditsystem som gäller för allt.</p>
<h2>Vad är Krea AI?</h2>
<p>Krea AI ger tillgång till flera olika bildmodeller samtidigt (inte en egen proprietär modell) plus verktyg för uppskalning, realtidsgenerering och på högre nivåer även video, 3D och LoRA-träning. Det gör det till ett av de mest allsidiga verktygen i kategorin, snarare än en renodlad bildgenerator.</p>
<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Realtidsgenerering:</strong> Se bilden uppdateras live medan du justerar prompten, ingår redan i gratisnivån.</li>
<li><strong>Flera modeller under samma tak:</strong> Tillgång till olika bildmodeller utan att behöva växla verktyg.</li>
<li><strong>Uppskalning upp till 22K:</strong> Kraftig uppskalning ingår från Basic-nivån.</li>
<li><strong>LoRA-träning:</strong> Träna egna stilmodeller på upp till 50 (Basic) eller 2000 (Max) bilder.</li>
</ul>
<h2>Så bra är det i praktiken</h2>
<p>Krea AI sticker ut genom att vara genuint brett snarare än djupt i en enda sak — fördelen är att man slipper flera olika prenumerationer för bild, uppskalning och video. Nackdelen är att breddan gör det svårare att jämföra rakt av mot en renodlad bildgenerator: man betalar för hela plattformen även om man bara använder bilddelen. Krediterna rullar inte över mellan månader på de flesta planer, vilket gör det lätt att betala för kapacitet man inte hinner använda.</p>
<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Bild, video, 3D, uppskalning och LoRA-träning i en enda plattform och ett kreditsystem.</li>
<li><strong>Fördel:</strong> Gratisnivå med riktiga 100 enheter/dag, ingen kortuppgift krävs.</li>
<li><strong>Nackdel:</strong> Krediter rullar inte över på de flesta planer — ouppnyttjad kapacitet försvinner varje månad.</li>
<li><strong>Nackdel:</strong> Priser för samma plan (särskilt Max) har rapporterats olika på olika delar av Kreas egen sajt.</li>
</ul>
<h2>Pris och planer</h2>
<p>Gratis: 100 enheter/dag. Basic ca 9 USD/mån (5 000 enheter/mån). Pro ca 35 USD/mån (20 000 enheter/mån). Max ca 105 USD/mån (60 000 enheter/mån) — observera att Kreas egen sajt visat avvikande siffror för Max-nivån på olika ställen, så dubbelkolla innan köp. Business från 200 USD/mån för team. Årsbetalning sänker priset med ca 30–40%.</p>
<h2>För vem passar Krea AI?</h2>
<p>Krea passar bäst för den som vill ha bild, video och uppskalning samlat på ett ställe och slippa flera separata abonnemang, snarare än den som bara vill ha den bästa renodlade bildmodellen.</p>
<h2>Vårt omdöme</h2>
<p>Krea AI är ett av de mest kompletta kreativa verktygen i kategorin tack vare bredden. Otydligheten kring Max-prissättningen och att krediter inte rullar över drar ner helhetsbetyget något. Med 8,4 av 10 är det ett starkt val för den som vill ha allt i en plattform.</p>`,
  },
  {
    slug: 'grok-imagine',
    title: 'Grok Imagine',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Grok Imagine recension 2026 — bild och video direkt i X</h2>
<p>Grok Imagine är xAI:s bild- och videogenerator, byggd in direkt i X-appen (f.d. Twitter) och i Grok-appen. Den är tätt sammanflätad med X:s prenumerationsnivåer snarare än att ha en egen fristående prissättning, vilket gör den ovanlig att jämföra rakt av mot renodlade bildgeneratorer.</p>
<h2>Vad är Grok Imagine?</h2>
<p>Grok Imagine genererar bilder och video direkt från textprompter, med funktioner som referensläge för att hålla samma karaktär konsekvent över flera bilder/klipp och möjlighet att förlänga video från en bildruta. Tillgång och gränser styrs av vilken X/Grok-prenumeration man har snarare än en egen Grok Imagine-specifik plan.</p>
<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Integrerat i X:</strong> Generera och dela bilder/video direkt i flödet utan att lämna appen.</li>
<li><strong>Referensläge:</strong> Håll samma karaktär eller stil konsekvent över flera genereringar.</li>
<li><strong>Bild-till-video:</strong> Animera en genererad eller uppladdad bild till kort video.</li>
<li><strong>API:</strong> Tillgängligt separat via xAI:s API med egen, per-bild/per-sekund-prissättning.</li>
</ul>
<h2>Så bra är det i praktiken</h2>
<p>Grok Imagines styrka är integrationen — för den som redan är aktiv på X är det det enklaste sättet att generera och direkt publicera AI-bilder och -video utan att växla verktyg. Svagheten är otydligheten kring vad som faktiskt ingår var: källor är oense om huruvida en gratisnivå med dagliga bilder finns kvar, och videogenerering kräver under alla omständigheter en betald X/Grok-prenumeration (Premium eller högre, från ca 8 USD/mån).</p>
<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Sömlös integration med X — generera och publicera på samma plats.</li>
<li><strong>Fördel:</strong> Referensläge för konsekvent karaktär över flera bilder/klipp.</li>
<li><strong>Nackdel:</strong> Ingen egen, tydlig prissättning — styrs av vilken X/Grok-nivå man redan har.</li>
<li><strong>Nackdel:</strong> Gratisnivåns omfattning för bildgenerering har ändrats flera gånger under 2026 och är oklar.</li>
</ul>
<h2>Pris och planer</h2>
<p>Ingår i X:s och Groks egna prenumerationsnivåer snarare än en fristående plan: X Premium från ca 8 USD/mån, SuperGrok/Premium+ betydligt högre (rapporterat 30–40 USD/mån, med ytterligare nivåer upp mot 300 USD/mån för tyngre användning). Video kräver betald nivå. API:et faktureras separat per bild/sekund. Exakta gränser för gratisnivån är omtvistade mellan källor — kontrollera aktuellt läge på x.ai.</p>
<h2>För vem passar Grok Imagine?</h2>
<p>Passar bäst för den som redan är aktiv på X och vill generera/publicera bilder och video utan att lämna plattformen — mindre självklart val för den som bara vill ha bästa möjliga bildkvalitet till lägsta pris.</p>
<h2>Vårt omdöme</h2>
<p>Grok Imagine är ett bekvämt tillägg för X-användare men svårbedömt som fristående bildverktyg eftersom pris och gränser är kopplade till andra prenumerationer och har ändrats upprepade gånger under året. Med 7,6 av 10 är det ett hyfsat men inte självklart val utanför X-ekosystemet.</p>`,
  },
  {
    slug: 'reve',
    title: 'Reve',
    content_mdx: `<p><strong>Betyg: 8.0/10</strong></p>
<h2>Reve recension 2026 — precision och layout framför allt</h2>
<p>Reve har byggt sig ett rykte kring en specifik styrka: följsamhet mot prompten. Medan många generatorer "tolkar" fritt vad du skriver, siktar Reve på att faktiskt placera objekt, text och layout exakt där du ber om det — vilket gör det populärt bland den som behöver kontroll snarare än slumpmässig inspiration.</p>
<h2>Vad är Reve?</h2>
<p>Reve är en AI-bildgenerator fokuserad på hög prompt-följsamhet och layoutkontroll, med stöd för upp till 4K-upplösning. Det marknadsförs specifikt mot användare som är frustrerade över att andra verktyg "gissar" fel på komposition, textplacering eller antal objekt i bilden.</p>
<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Hög prompt-följsamhet:</strong> Placerar objekt och text mer exakt enligt instruktion än många konkurrenter.</li>
<li><strong>4K-upplösning:</strong> Stöd för högupplösta bilder direkt vid generering.</li>
<li><strong>Layoutfokus:</strong> Särskilt starkt när kompositionen (var saker hamnar i bilden) är viktigare än fri konstnärlig tolkning.</li>
<li><strong>Enkel struktur:</strong> Gratis, Lite och Pro — enklare att förstå än många konkurrenters kreditdjungel.</li>
</ul>
<h2>Så bra är det i praktiken</h2>
<p>Reve levererar precis det det lovar när uppgiften kräver exakthet — text på rätt ställe, rätt antal objekt, en specifik layout. Det är en reell skillnad mot verktyg som Midjourney, som är starkare på fri konstnärlig känsla men svagare på att följa exakta instruktioner. Priset för den exaktheten är att Reve känns mindre "kreativt överraskande" — den som vill bli inspirerad av oväntade tolkningar hittar det hellre någon annanstans.</p>
<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Bäst i klassen på att faktiskt följa instruktioner om layout, text och antal objekt.</li>
<li><strong>Fördel:</strong> Enkel, begriplig prisstruktur jämfört med många konkurrenters kreditsystem.</li>
<li><strong>Nackdel:</strong> Gratisinnehåll kan användas för modellträning — bara betalda planer kan välja bort det, enligt tredjepartskällor.</li>
<li><strong>Nackdel:</strong> Mindre fri konstnärlig variation än verktyg som prioriterar kreativ tolkning framför exakthet.</li>
</ul>
<h2>Pris och planer</h2>
<p>Gratis: daglig tilldelning av "creative energy". Lite: ca 7,99 USD/mån, ungefär 5x Free-nivåns kapacitet. Pro: ca 19,99 USD/mån, ungefär 100x Free-nivåns kapacitet plus en videoenergi-kvot. API faktureras separat per bild. Siffrorna är senast verifierade i slutet av augusti 2026 av tredjepartskällor — kontrollera reve.com/pricing för aktuellt läge.</p>
<h2>För vem passar Reve?</h2>
<p>Passar bäst för den som behöver exakt kontroll över layout, textplacering och komposition — t.ex. marknadsföringsmaterial med specifik text, snarare än fri konstnärlig bildgenerering.</p>
<h2>Vårt omdöme</h2>
<p>Reve löser ett problem många andra generatorer har — att faktiskt göra vad du ber om, inte bara något som liknar det. Enklare prisstruktur än de flesta konkurrenter är också ett plus. Med 8,0 av 10 är det ett utmärkt val när precision är viktigare än konstnärlig överraskning.</p>`,
  },
  {
    slug: 'nightcafe-studio',
    title: 'NightCafe Studio',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>NightCafe Studio recension 2026 — den tillgängliga veteranen</h2>
<p>NightCafe Studio har funnits längre än de flesta AI-bildgeneratorer och har byggt en stor community kring gratis, community-driven bildgenerering — man kan tjäna krediter genom att vara aktiv på sajten istället för att alltid betala för dem.</p>
<h2>Vad är NightCafe Studio?</h2>
<p>NightCafe Studio är en AI-bildgenerator med ett dubbelt kreditsystem: "Fast Credits" som ingår i betald prenumeration och "Relax Credits" som tjänas gratis genom daglig aktivitet på sajten (och körs i lägre prioritet, med några sekunders till en minuts väntetid). Det gör det till ett av de mest tillgängliga verktygen för den som inte vill betala alls.</p>
<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Relax Credits:</strong> Tjäna gratis genereringskapacitet genom aktivitet på plattformen, utan att betala.</li>
<li><strong>Community:</strong> Stor, aktiv community kring tävlingar, delning och feedback på bilder.</li>
<li><strong>Flera modeller:</strong> Tillgång till olika bildmodeller, med vissa PRO-nivåer som inkluderar obegränsad generering på utvalda modeller.</li>
<li><strong>Krediter som rullar över:</strong> Fast Credits förfaller inte, till skillnad från många konkurrenters månadskrediter.</li>
</ul>
<h2>Så bra är det i praktiken</h2>
<p>NightCafes styrka är tillgängligheten — ingen annan stor aktör i kategorin låter dig generera bilder gratis i den här omfattningen utan att betala, så länge du accepterar att vänta lite längre på Relax-köade genereringar. Svagheten är att exakta priser är ovanligt svåra att hitta: sajten visar inga konkreta belopp utan inloggning, vilket gör det svårt att jämföra mot konkurrenter innan man skapar konto.</p>
<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Genuint gratis väg till AI-bildgenerering via Relax Credits, ingen annan stor konkurrent erbjuder motsvarande.</li>
<li><strong>Fördel:</strong> Fast Credits förfaller inte — ingen risk att förlora obetald kapacitet.</li>
<li><strong>Nackdel:</strong> Inga priser synliga utan inloggning, svårt att jämföra i förväg.</li>
<li><strong>Nackdel:</strong> Relax-köade genereringar är långsammare — inget för den som vill ha omedelbart resultat.</li>
</ul>
<h2>Pris och planer</h2>
<p>Gratis väg via Relax Credits (tjänas genom aktivitet, köad körning). PRO-prenumeration med Fast Credits anges inte öppet i belopp utan inloggning — priset varierar per nivå, med rabatt vid kvartals- (15%) eller årsbetalning (40%). Extra Fast Credits kan köpas separat. Kontrollera creator.nightcafe.studio/pricing inloggad för exakta belopp.</p>
<h2>För vem passar NightCafe Studio?</h2>
<p>Passar bäst för den som vill testa AI-bildgenerering utan att betala alls, eller som gillar community-aspekten med tävlingar och delning — mindre självklart för den som behöver snabba resultat eller tydlig prissättning i förväg.</p>
<h2>Vårt omdöme</h2>
<p>NightCafe Studio fyller en unik nisch som den mest tillgängliga vägen in i AI-bildgenerering utan kostnad. Den otydliga prissättningen för PRO drar ner betyget något. Med 7,8 av 10 är det ett solitt förstahandsval för nybörjare och den som inte vill betala.</p>`,
  },
  {
    slug: 'qwen-image',
    title: 'Qwen-Image',
    content_mdx: `<p><strong>Betyg: 7.9/10</strong></p>
<h2>Qwen-Image recension 2026 — gratis, öppen och stark på text i bild</h2>
<p>Qwen-Image är Alibabas bildmodell, tillgänglig gratis genom Qwen Chat-appen och som öppna modellvikter för den som vill köra den själv. Den har fått särskilt gott rykte för att rendera text korrekt inuti genererade bilder — något många konkurrenter fortfarande har svårt med.</p>
<h2>Vad är Qwen-Image?</h2>
<p>Qwen-Image är Alibabas AI-bildmodell, tillgänglig både som en öppen modell (nedladdningsbar och körbar lokalt) och via den gratis Qwen Chat-appen på webb, iOS, Android, macOS och Windows. Den är känd för stark textrendering i bilder — t.ex. skyltar, etiketter och grafiska element med korrekt stavad text, vilket historiskt varit en svaghet hos många bildmodeller.</p>
<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Gratis via Qwen Chat:</strong> Bildgenerering ingår i den kostnadsfria assistent-appen, med viss hastighetsbegränsning.</li>
<li><strong>Öppna modellvikter:</strong> Går att ladda ner och köra lokalt för den tekniskt kunniga, utanför Qwen Chat.</li>
<li><strong>Stark textrendering:</strong> Bland de bättre bildmodellerna på att faktiskt rendera läsbar, korrekt stavad text i bilden.</li>
<li><strong>API-tillgång:</strong> Betaltillgång via Alibaba Cloud Model Studio för den som bygger egna produkter.</li>
</ul>
<h2>Så bra är det i praktiken</h2>
<p>Qwen-Images stora fördel är att det är genuint gratis att använda via Qwen Chat och samtidigt håller riktigt hög kvalitet, särskilt på textrendering. Nackdelen är otydlighet: olika källor är oense om exakt vilken modellversion Qwen Chat faktiskt kör (2.1 öppet, eller en nyare 3.0 som bara finns hostad), och licensen för den öppna modellen tillåter bara icke-kommersiellt bruk — att köra den gratis själv betyder alltså inte automatiskt att man får sälja resultaten.</p>
<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Helt gratis via Qwen Chat, ingen kortuppgift krävs.</li>
<li><strong>Fördel:</strong> Ovanligt stark på att rendera korrekt, läsbar text i bilder.</li>
<li><strong>Nackdel:</strong> Den öppna modellens licens tillåter bara icke-kommersiellt bruk — kolla villkoren innan kommersiell användning.</li>
<li><strong>Nackdel:</strong> Oklart och omtvistat exakt vilken modellversion den gratis chattappen faktiskt kör.</li>
</ul>
<h2>Pris och planer</h2>
<p>Gratis via Qwen Chat-appen (med icke-publicerade hastighetsbegränsningar). Öppna modellvikter går att ladda ner och köra själv, licensierat för icke-kommersiellt bruk. API via Alibaba Cloud Model Studio faktureras per bild, med rapporterade priser runt 0,03–0,075 USD per bild beroende på nivå — oberoende källor ger dock inbördes motstridiga siffror. Kontrollera qwen.ai och Alibaba Clouds egen prissida för aktuellt läge.</p>
<h2>För vem passar Qwen-Image?</h2>
<p>Passar bäst för den som vill ha gratis bildgenerering med stark textrendering, eller den tekniskt kunniga som vill köra en öppen modell själv för icke-kommersiella projekt.</p>
<h2>Vårt omdöme</h2>
<p>Qwen-Image är ett imponerande gratisalternativ med en genuin styrka (textrendering) som sticker ut i kategorin. Den oklara licensbilden för kommersiellt bruk och motstridiga uppgifter om modellversion drar ner betyget något. Med 7,9 av 10 är det ett starkt gratisval, men dubbelkolla licensvillkoren innan kommersiell användning.</p>`,
  },
];

async function main() {
  for (const row of ROWS) {
    const path = `/ai-verktyg/${row.slug}`;
    const { data: existing } = await db.from('articles').select('id').eq('path', path).maybeSingle();
    const payload = {
      slug: row.slug,
      path,
      title: row.title,
      type: 'page',
      parent_slug: 'ai-bild-verktyg',
      category: null,
      content_mdx: row.content_mdx,
      published_at: null,
      faq: [],
    };
    if (existing) {
      const { error } = await db.from('articles').update(payload).eq('id', existing.id);
      if (error) { console.error(`Update-fel ${row.slug}:`, error); continue; }
      console.log(`Uppdaterad: ${row.slug}`);
    } else {
      const { error } = await db.from('articles').insert(payload);
      if (error) { console.error(`Insert-fel ${row.slug}:`, error); continue; }
      console.log(`Insatt: ${row.slug}`);
    }
  }
}
main();
