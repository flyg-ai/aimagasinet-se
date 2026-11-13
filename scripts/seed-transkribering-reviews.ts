/**
 * 7 recensionssidor för AI-transkriberingsverktyg (Sonix, Trint, Rev.com,
 * HappyScribe, Notta, AssemblyAI, Deepgram), för /ai-verktyg/transkribering.
 * parent_slug='transkribering' (syntetisk) — används av classify() för att
 * klassificera sidan som 'review' och styr syskonlistan; hubbens egen
 * topplista är kuraterad (lib/route-kind.ts CURATED_HUB_TOOL_SLUGS) så den
 * här parent_slug:en påverkar INTE vilka verktyg som visas i hubben.
 * Fakta verifierade mot leverantörernas egna pricing-sidor 2026-11-13.
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-transkribering-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PARENT_SLUG = 'transkribering';

type ReviewRow = { slug: string; title: string; content_mdx: string };

const reviews: ReviewRow[] = [
  {
    slug: 'sonix',
    title: 'Sonix',
    content_mdx: `<p><strong>Betyg: 8.3/10</strong></p>
<h2>Sonix recension 2026 — transkribering du redigerar genom att redigera text</h2>

<p>Sonix har funnits sedan 2017 och har byggt en stabil position bland journalister, forskare och podcastare genom en enkel idé: redigera ljudet genom att redigera transkriptionstexten. Verktyget kombinerar det med brett språkstöd och inbyggd AI-analys.</p>

<h2>Vad är Sonix?</h2>
<p>Sonix är en molnbaserad transkriptionstjänst som automatiskt omvandlar ljud och video till text på 54+ språk, med en inbyggd editor där du kan klippa och redigera själva inspelningen genom att redigera texten. Utöver ren transkribering erbjuder Sonix översättning, undertexter och AI-genererade sammanfattningar, kapitelindelning och sentimentanalys.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Textbaserad ljudredigering:</strong> Klipp i inspelningen genom att redigera transkriptionen.</li>
<li><strong>54+ språk:</strong> Både transkribering och översättning.</li>
<li><strong>AI-analys:</strong> Sammanfattningar, kapitel och sentimentanalys.</li>
<li><strong>Undertexter:</strong> Inklusive inbrända (burn-in) undertexter för video.</li>
<li><strong>Integrationer:</strong> API, Zapier, Zoom och Adobe Premiere.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Den stora fördelen är hur naturligt redigeringsflödet känns — att klippa bort en mening i texten klipper bort samma stycke i ljudet, vilket sparar mycket tid för den som klipper intervjuer eller poddavsnitt. Språktäckningen och AI-sammanfattningarna håller god klass för en tjänst i den här prisklassen. Begränsningen är att Sonix inte har någon permanent gratisplan — bara 30 minuter som en engångsprövning — och att extra timmar utöver abonnemanget alltid kostar 10 USD/timme, oavsett vilken nivå du redan betalar för.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Redigera ljud/video genom att redigera texten direkt.</li>
<li><strong>Fördel:</strong> Brett språk- och översättningsstöd (54+ språk).</li>
<li><strong>Fördel:</strong> Gott om integrationer (API, Zapier, Zoom, Premiere).</li>
<li><strong>Nackdel:</strong> Ingen permanent gratisplan, bara 30 gratisminuter en gång.</li>
<li><strong>Nackdel:</strong> Extra timmar kostar alltid 10 USD/timme oavsett nivå.</li>
</ul>

<h2>Pris och planer</h2>
<p>Sonix kan användas utan abonnemang för 10 USD/timme, eller via abonnemang från 25 USD/månad (5 timmar/månad) upp till 80 USD/månad (40 timmar/månad). Enterprise-prissättning ges på förfrågan och inkluderar bland annat SSO och DPA/BAA.</p>

<h2>För vem passar Sonix?</h2>
<p>Sonix passar bäst för journalister, forskare, podcastare och videoproducenter som regelbundet transkriberar intervjuer eller inspelningar och vill kunna redigera direkt i texten, snarare än att skrolla i en ljudvågform.</p>

<h2>Vårt omdöme</h2>
<p>Sonix är ett av de mest genomarbetade transkriptionsverktygen för innehållsskapare, med en redigeringsupplevelse som få konkurrenter matchar. Avsaknaden av en löpande gratisnivå drar ner helhetsintrycket något. Med ett betyg på 8,3 av 10 är Sonix ett starkt val för frilansare och mindre team med återkommande transkriptionsbehov.</p>`,
  },
  {
    slug: 'trint',
    title: 'Trint',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>Trint recension 2026 — obegränsad transkribering byggd för nyhetsredaktioner</h2>

<p>Trint grundades 2014 i London av en tidigare krigskorrespondent och har sedan dess blivit ett etablerat val bland nyhetsredaktioner och mediaproduktionsbolag — framför allt tack vare obegränsad transkribering och starkt fokus på datasäkerhet.</p>

<h2>Vad är Trint?</h2>
<p>Trint är en transkriptions- och undertextningsplattform riktad mot medieproduktion, med stöd för 50+ språk vid transkribering och 70+ språk vid översättning. Verktyget erbjuder också ett live-läge för realtidstranskribering och en funktion som kallas Story Builder, som hjälper till att bygga artiklar direkt utifrån verifierade citat ur transkriptionen.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Obegränsad transkribering:</strong> Fair-use-baserad, ingen minutgräns på betalplanerna.</li>
<li><strong>Live-transkribering:</strong> Realtidsläge från mobil och dator.</li>
<li><strong>Story Builder:</strong> Bygg artiklar eller klipp direkt från verifierade citat.</li>
<li><strong>Caption Editor:</strong> Skapa undertexter på video med några klick.</li>
<li><strong>Datasäkerhet:</strong> ISO 27001-certifiering och valbar EU-serverplacering.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Trints styrka är att du aldrig behöver räkna minuter — på Pro- och Team-planerna är transkriberingen obegränsad inom ramen för rimligt bruk, vilket passar redaktioner med ojämn arbetsbelastning. Story Builder är ett genuint ovanligt tillskott som sparar tid för journalister som skriver direkt utifrån inspelat material. Nackdelen är priset: 69 EUR per användare och månad för en ensam Pro-licens är bland det dyraste i den här jämförelsen, och det finns ingen öppen prissida — siffrorna visas först efter inloggning i köpflödet.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Obegränsad (fair-use) transkribering och översättning.</li>
<li><strong>Fördel:</strong> Story Builder för att gå direkt från citat till artikel.</li>
<li><strong>Fördel:</strong> ISO 27001-certifiering och EU-serverval.</li>
<li><strong>Nackdel:</strong> Dyrast i jämförelsen för en ensam användare (69 EUR/mån).</li>
<li><strong>Nackdel:</strong> Ingen öppen prissida — kräver inloggning för att se priser.</li>
</ul>

<h2>Pris och planer</h2>
<p>Trint Pro kostar 69 EUR per användare och månad (828 EUR/år vid årsbetalning) för en ensam användare. Team-planen (2-5 medlemmar) kostar 59 EUR per säte och månad vid årsbetalning. Business är anpassad prissättning på förfrågan.</p>

<h2>För vem passar Trint?</h2>
<p>Trint passar bäst för nyhetsredaktioner, mediaproduktionsbolag och utbildningsverksamheter med höga, ojämna transkriptionsvolymer där obegränsad användning väger tyngre än lägsta möjliga pris.</p>

<h2>Vårt omdöme</h2>
<p>Trint är ett moget, välbyggt verktyg med funktioner (Story Builder, live-transkribering) som är direkt riktade mot journalistiskt arbete. Priset gör det svårt att rekommendera för enskilda frilansare med låg volym. Med ett betyg på 7,8 av 10 är Trint ett tydligt val för redaktioner och produktionsbolag, mindre självklart för soloanvändare.</p>`,
  },
  {
    slug: 'rev-com',
    title: 'Rev',
    content_mdx: `<p><strong>Betyg: 8.1/10</strong></p>
<h2>Rev recension 2026 — AI-transkribering med mänsklig kvalitetskontroll som tillval</h2>

<p>Rev.com grundades 2010 i Austin, Texas och har sedan starten byggt sin tjänst kring en hybrid: snabb AI-transkribering som bas, med mänsklig, verifierad transkription som tillval när noggrannheten måste vara garanterad — till exempel inom juridik och utredning.</p>

<h2>Vad är Rev?</h2>
<p>Rev erbjuder både AI-driven transkribering med en genuin gratisplan och mänsklig transkription som betalas per minut. Plattformen har utvecklats mot vad företaget kallar en "Investigative Intelligence Platform", med stöd för analys av flera filer samtidigt, en dokumenteditor och specialiserade format för juridiska sammanhang som rättegångsutskrifter.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Genuin gratisplan:</strong> 45 AI-transkriberingsminuter per månad utan kreditkort.</li>
<li><strong>Mänsklig transkription:</strong> Verifierad kvalitet som tillval, från 1,99 USD/minut.</li>
<li><strong>Juridiska format:</strong> Rough draft och premium transcript för rättsliga sammanhang.</li>
<li><strong>Multi-filanalys:</strong> Analysera 5 till 500 filer samtidigt beroende på plan.</li>
<li><strong>Integrationer:</strong> Bland annat Clio Manage för juridikbranschen (Pro-nivå).</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Revs styrka är flexibiliteten mellan ren AI-transkribering och mänsklig kvalitetskontroll — få konkurrenter erbjuder båda i samma plattform. Gratisplanens 45 minuter per månad är ovanligt generösa och kräver inget kreditkort. Svagheten är att det inte finns något öppet pris per minut för ren AI-transkribering på webbplatsen; det kräver en priskalkylator. De juridiska formatmallarna är också à la carte-tillval utanför abonnemangen, vilket gör totalkostnaden svårare att överblicka för den som inte redan vet vad man behöver.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Genuin gratisplan (45 min/mån) utan kreditkort.</li>
<li><strong>Fördel:</strong> Mänsklig transkription tillgänglig när noggrannhet är kritiskt.</li>
<li><strong>Fördel:</strong> Specialiserade juridiska format och integrationer.</li>
<li><strong>Nackdel:</strong> Inget öppet pris per minut för AI-transkribering.</li>
<li><strong>Nackdel:</strong> Juridiska formatmallar är à la carte, utanför abonnemangen.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisplanen ger 45 AI-minuter/månad. Essentials kostar 25,49 USD/månad och Pro 47,99 USD/månad vid årsbetalning (3 respektive 5 säten). Mänsklig transkription kostar från 1,99 USD/minut, med rabatt för abonnenter. Unlimited-nivån har anpassad prissättning.</p>

<h2>För vem passar Rev?</h2>
<p>Rev passar bäst för juridik- och utredningsteam som behöver kunna växla upp till verifierad mänsklig kvalitet, samt för mindre team och frilansare som vill testa AI-transkribering gratis innan de binder sig till ett abonnemang.</p>

<h2>Vårt omdöme</h2>
<p>Rev särskiljer sig genom att inte vara enbart ett AI-verktyg — möjligheten att växla till mänsklig transkription är ett konkret skyddsnät när noggrannheten är avgörande. Den otydliga AI-prissättningen drar ner helhetsintrycket. Med ett betyg på 8,1 av 10 är Rev ett tryggt val för juridik och utredning, och en bra gratisstart för alla andra.</p>`,
  },
  {
    slug: 'happy-scribe',
    title: 'HappyScribe',
    content_mdx: `<p><strong>Betyg: 8.2/10</strong></p>
<h2>HappyScribe recension 2026 — billigast i jämförelsen, med 150+ språk</h2>

<p>HappyScribe grundades 2017 i Barcelona och har byggt en bred transkriptions- och mötesnoteringstjänst med ett ovanligt stort språkstöd (150+ språk) och en av de mest generösa gratisnivåerna i den här jämförelsen.</p>

<h2>Vad är HappyScribe?</h2>
<p>HappyScribe kombinerar en AI Notetaker för möten (Zoom, Google Meet, Teams) med transkribering, undertextning och översättning av uppladdade filer. Mötesinspelning via Notetaker, mobilapp och webbläsarinspelning är obegränsad och gratis på alla nivåer — det är själva filtranskriberingen som är begränsad per plan. Tjänsten erbjuder även mänsklig korrekturläsning som tillägg.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Obegränsad mötesinspelning:</strong> Gratis på alla nivåer via Notetaker, mobil och webb.</li>
<li><strong>150+ språk:</strong> Bland de bredaste språkstöden i kategorin.</li>
<li><strong>AI Chat:</strong> Analysera och ställ frågor om transkriberat innehåll.</li>
<li><strong>Mänsklig korrekturläsning:</strong> Tillval från 2,00 USD/minut.</li>
<li><strong>Säkerhet:</strong> SOC 2 Type 2 och GDPR-efterlevnad.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>HappyScribes kombination av gratis obegränsad mötesinspelning och ett billigt Basic-abonnemang (8,50 USD/månad vid årsbetalning) gör det till det mest prisvärda alternativet i den här jämförelsen för den som inte har enorma volymer. Språktäckningen på 150+ språk är bland de bredaste som finns. Begränsningen syns tydligast på gratisplanen: videoexport är vattenstämplad, och bara 10 minuter uppladdat material ingår innan det kostar extra (0,20 USD/minut i tilläggskrediter).</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Obegränsad gratis mötesinspelning på alla nivåer.</li>
<li><strong>Fördel:</strong> Billigast i jämförelsen — Basic från 8,50 USD/mån.</li>
<li><strong>Fördel:</strong> Mycket brett språkstöd (150+ språk).</li>
<li><strong>Nackdel:</strong> Gratisplanens videoexport är vattenstämplad.</li>
<li><strong>Nackdel:</strong> Bara 10 gratisminuter för uppladdade filer, sen kostar det extra.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisplan med 10 minuter uppladdat material. Basic kostar 8,50 USD/månad, Pro 19 USD/månad och Business 59 USD/månad, samtliga priser vid årsbetalning (högre vid månadsbetalning). Enterprise är anpassad prissättning på förfrågan.</p>

<h2>För vem passar HappyScribe?</h2>
<p>HappyScribe passar bäst för budgetmedvetna frilansare, mindre team och byråer som vill ha brett språkstöd och gratis mötesnotering, utan att betala premiumpris för grundfunktionerna.</p>

<h2>Vårt omdöme</h2>
<p>HappyScribe levererar överraskande mycket värde för priset, särskilt tack vare den obegränsade gratis mötesinspelningen och det breda språkstödet. Vattenstämpeln på gratisplanens videoexport och de små gratisminuterna för filer är de tydligaste begränsningarna. Med ett betyg på 8,2 av 10 är HappyScribe vårt förslag för den som vill ha mest nytta per spenderad krona.</p>`,
  },
  {
    slug: 'notta',
    title: 'Notta',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Notta recension 2026 — japansk mötestranskribering med flerspråkig översättning</h2>

<p>Notta är en Tokyo-baserad transkriberings- och mötesapp (exakt grundningsår varierar mellan källor, flera anger omkring 2020) med starkt fokus på realtidsinspelning av möten och flerspråkig översättning — en naturlig styrka för team som jobbar över språkgränser i Asien.</p>

<h2>Vad är Notta?</h2>
<p>Notta spelar in och transkriberar möten i realtid från Zoom, Google Meet, Microsoft Teams, Webex och Slack, med automatisk talaridentifiering och AI-sammanfattningar. Tjänsten finns som webb, mobil, desktop och Chrome-tillägg, och integrerar med verktyg som Notion och Slack.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Realtidstranskribering av möten:</strong> Zoom, Google Meet, Teams, Webex, Slack.</li>
<li><strong>Flerspråkig översättning:</strong> Text- och tvåspråkig transkription/översättning som tillägg.</li>
<li><strong>Talaridentifiering:</strong> Automatisk uppdelning per talare.</li>
<li><strong>AI-sammanfattningar:</strong> Automatiska mötesanteckningar.</li>
<li><strong>Integrationer:</strong> Notion, Slack, CRM och Zapier (Business).</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Nottas styrka är hur smidigt det går in i befintliga mötesverktyg och hur generös gratisplanen är för vanligt bruk — 120 minuter per månad utan kreditkort. Översättningsfunktionerna gör tjänsten extra användbar för team som möts över språkgränser. Begränsningen på gratisplanen är att varje enskild inspelning max får vara 3 minuter, vilket gör den opraktisk för längre möten utan uppgradering. Den 3-dagars gratis provperioden övergår också automatiskt till en helårsbetalning om den inte avbryts i tid, vilket är värt att hålla koll på.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Generös gratisplan: 120 minuter/månad utan kreditkort.</li>
<li><strong>Fördel:</strong> Stark realtidstranskribering över flera mötesplattformar.</li>
<li><strong>Fördel:</strong> Billig Premium-nivå för privatpersoner.</li>
<li><strong>Nackdel:</strong> Gratisplanen begränsar varje inspelning till 3 minuter.</li>
<li><strong>Nackdel:</strong> Provperioden övergår automatiskt till årsbetalning om den inte avbryts.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisplan med 120 transkriberingsminuter/månad. Premium kostar cirka 1 185 JPY/månad och Business cirka 2 508 JPY/månad, båda vid årsbetalning (ca 40 % rabatt jämfört med månadspris). Tillägg för översättning och "Notta Brain"-krediter finns separat.</p>

<h2>För vem passar Notta?</h2>
<p>Notta passar bäst för team och privatpersoner som regelbundet har möten över språkgränser, särskilt i eller mot Asien, samt studenter och privatpersoner som vill ha en billig men kapabel transkriberingstjänst.</p>

<h2>Vårt omdöme</h2>
<p>Notta är ett kompetent, prisvärt alternativ för mötestranskribering med ett tydligt försprång inom flerspråkig översättning. Begränsningen till 3 minuter per inspelning på gratisplanen och den automatiska uppgraderingen efter provperioden är värda att känna till i förväg. Med ett betyg på 7,6 av 10 är Notta ett solitt men inte branschledande val.</p>`,
  },
  {
    slug: 'assemblyai',
    title: 'AssemblyAI',
    content_mdx: `<p><strong>Betyg: 8.5/10</strong></p>
<h2>AssemblyAI recension 2026 — taligenkänning via API, inte en färdig app</h2>

<p>AssemblyAI grundades 2017 i San Francisco och är inte ett transkriptionsverktyg i vanlig mening — det är ett API som utvecklare använder för att bygga taligenkänning in i egna produkter. Viktigt att veta direkt: det finns inget färdigt användargränssnitt att logga in i.</p>

<h2>Vad är AssemblyAI?</h2>
<p>AssemblyAI är en API-först plattform för taligenkänning, byggd kring företagets egna "Universal"-modeller. Den erbjuder transkribering av förinspelat ljud, realtidsströmning, diktering med LLM-baserad textstädning, samt en "LLM Gateway" för att sammanfatta, extrahera data ur eller ställa frågor om transkriberingar. Produkten riktar sig uteslutande till team med egna utvecklare.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>API för tal-till-text:</strong> Förinspelat ljud, realtidsströmning och diktering.</li>
<li><strong>LLM Gateway:</strong> Sammanfattning, extraktion och Q&A ovanpå transkript.</li>
<li><strong>Tilläggsfunktioner:</strong> Talaridentifiering, PII-maskering, översättning, Medical Mode.</li>
<li><strong>SDK:er:</strong> Python och JavaScript/TypeScript, plus MCP-server.</li>
<li><strong>Compliance:</strong> SOC 2 Type 2, ISO 27001, HIPAA BAA, EU-datalagring till samma pris.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>För team med egna utvecklare är AssemblyAI ett av de billigaste alternativen per timme i hela den här jämförelsen — från 0,15 USD/timme för förinspelat ljud. 50 USD i gratiskredit vid registrering räcker långt för att testa innan man betalar något alls. Begränsningen är uppenbar men viktig: det finns ingen färdig app att öppna och börja transkribera i. Allt kräver integration via API eller SDK, vilket gör tjänsten helt ointressant för den som inte har utvecklarresurser.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket lågt pris per timme (från 0,15 USD/timme).</li>
<li><strong>Fördel:</strong> 50 USD gratiskredit vid registrering, inget kreditkort krävs.</li>
<li><strong>Fördel:</strong> Rikt utbud av tilläggsfunktioner i samma API (diarisering, PII-maskering, översättning).</li>
<li><strong>Nackdel:</strong> Ingen färdig app — kräver utvecklare för att komma igång.</li>
<li><strong>Nackdel:</strong> Gratisnivåns realtidsströmning är begränsad till 5 nya strömmar/minut.</li>
</ul>

<h2>Pris och planer</h2>
<p>Betala per användning: från 0,15 USD/timme för förinspelat ljud (Universal-2), 0,21 USD/timme för den nyare Universal-3.5 Pro-modellen, och 0,45 USD/timme för realtidsströmning. 50 USD gratiskredit ingår vid registrering. Tilläggsfunktioner (t.ex. Medical Mode) läggs på grundpriset per timme.</p>

<h2>För vem passar AssemblyAI?</h2>
<p>AssemblyAI passar team med egna utvecklare som bygger diktering, röstagenter, livetextning eller transkribering som en funktion i en egen produkt — aldrig för en icke-teknisk användare som bara vill transkribera en fil.</p>

<h2>Vårt omdöme</h2>
<p>AssemblyAI är ett av de mest kostnadseffektiva och funktionsrika taligenkännings-API:erna på marknaden, med ett tydligt utvecklarfokus som gör det olämpligt för alla andra. Med ett betyg på 8,5 av 10 är det ett av de bästa valen i kategorin, specifikt för team som bygger egna produkter ovanpå taligenkänning.</p>`,
  },
  {
    slug: 'deepgram',
    title: 'Deepgram',
    content_mdx: `<p><strong>Betyg: 8.6/10</strong></p>
<h2>Deepgram recension 2026 — taligenkänning för realtid och röstagenter, via API</h2>

<p>Deepgram grundades 2015 i San Francisco av tre tidigare fysiker och har byggt ett av de snabbaste och billigaste taligenkännings-API:erna på marknaden, med särskilt starkt fokus på realtidsanvändning och röstagenter. Precis som AssemblyAI är detta ett API, inte en app du loggar in i.</p>

<h2>Vad är Deepgram?</h2>
<p>Deepgram erbjuder tal-till-text via sina Nova-modeller, både för förinspelat ljud och realtidsströmning, samt text-till-tal och en kombinerad "Voice Agent"-produkt för röststyrda applikationer. Plattformen stöder över 60 språk på sina Nova-modeller och erbjuder self-hosted deployment för kunder med höga krav på datakontroll.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Nova-modeller:</strong> Tal-till-text för förinspelat ljud och realtidsströmning.</li>
<li><strong>Voice Agent:</strong> Kombinerad lösning för röststyrda applikationer.</li>
<li><strong>Text-till-tal:</strong> Aura-modellerna, prissatta per tecken.</li>
<li><strong>Audio Intelligence:</strong> Sammanfattning, ämnesdetektering, sentiment och avsikt.</li>
<li><strong>Self-hosted:</strong> Egen driftsättning tillgänglig på Enterprise-nivå.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Deepgram har det största gratiskreditbeloppet i den här jämförelsen — 200 USD utan utgångsdatum — vilket gör det enkelt att testa ordentligt innan man betalar något. Priset per minut för förinspelat ljud (omkring 0,0043 USD/min) är extremt lågt för höga volymer. Röstagentprodukten prissätts dock helt annorlunda, per anslutningstid snarare än ljudminuter, vilket gör den betydligt dyrare än ren transkribering — viktigt att inte missförstå när man jämför priser. Precis som AssemblyAI kräver allt utvecklarresurser.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Störst gratiskredit i kategorin (200 USD, inget utgångsdatum).</li>
<li><strong>Fördel:</strong> Mycket lågt pris per minut för förinspelad transkribering.</li>
<li><strong>Fördel:</strong> Self-hosted deployment för team med höga datakrav.</li>
<li><strong>Nackdel:</strong> Ingen färdig app — kräver utvecklare för att komma igång.</li>
<li><strong>Nackdel:</strong> Voice Agent-priset (per anslutningstid) är betydligt dyrare än ren transkribering.</li>
</ul>

<h2>Pris och planer</h2>
<p>200 USD gratiskredit vid registrering, inget kreditkort krävs. Förinspelat ljud från ca 0,26 USD/timme (Pay as you go), realtidsströmning från ca 0,46 USD/timme (0,39 USD/timme på Growth-nivå). Voice Agent kostar 4,50-9,78 USD per timme anslutningstid. Enterprise ger self-hosted drift och anpassad prissättning.</p>

<h2>För vem passar Deepgram?</h2>
<p>Deepgram passar team med egna utvecklare som bygger röstagenter, livetextning eller transkribering i hög volym, särskilt de som behöver realtidsprestanda eller self-hosted driftsättning av compliance-skäl.</p>

<h2>Vårt omdöme</h2>
<p>Deepgram är ett av de snabbaste och mest kostnadseffektiva taligenkännings-API:erna för realtidsanvändning, med ett tydligt försprång inom röstagentteknik. Det stora gratiskreditbeloppet gör det lätt att testa ordentligt. Med ett betyg på 8,6 av 10 är Deepgram vårt förstahandsval för utvecklarteam som bygger röststyrda produkter.</p>`,
  },
];

async function main() {
  for (const r of reviews) {
    const row = {
      slug: r.slug,
      title: r.title,
      excerpt: null,
      content_mdx: r.content_mdx,
      category: null,
      tags: ['AI-transkribering'],
      featured_image: null,
      type: 'page',
      path: `/ai-verktyg/${r.slug}`,
      parent_slug: PARENT_SLUG,
      affiliate_url: null,
      published_at: null,
      seo_title: `${r.title} recension 2026 — pris, funktioner och betyg`,
      seo_description: null,
      author_slug: 'nicklas-hallberg',
    };
    const { data: existing } = await db.from('articles').select('slug').eq('path', row.path).maybeSingle();
    const { error } = existing
      ? await db.from('articles').update(row).eq('path', row.path)
      : await db.from('articles').insert(row);
    if (error) { console.error(r.slug, error); process.exit(1); }
    console.log(`OK: ${r.slug} ${existing ? 'uppdaterad' : 'skapad'}`);
  }
}
main();
