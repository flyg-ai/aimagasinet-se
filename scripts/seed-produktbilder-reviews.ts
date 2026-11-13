/**
 * 9 nya recensionssidor för AI-produktbildsverktyg, för att göra
 * /ai-verktyg/produktbilder till en riktig topplista. parent_slug=
 * 'produktbilder' (syntetisk) — samma mönster som ai-kodgranskning-batchen,
 * undviker att dessa verktyg automatiskt dyker upp i ai-bild-verktyg-hubbens
 * egen topplista. Fakta verifierade mot leverantörernas egna hemsidor/
 * pricing-sidor 2026-11-13 (se lib/category-hub-tools-produktbilder.ts för
 * detaljerade källnoteringar om vad som INTE gick att verifiera).
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-produktbilder-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PARENT_SLUG = 'produktbilder';

type ReviewRow = { slug: string; title: string; content_mdx: string };

const reviews: ReviewRow[] = [
  {
    slug: 'photoroom',
    title: 'Photoroom',
    content_mdx: `<p><strong>Betyg: 8.3/10</strong></p>
<h2>Photoroom recension 2026 — allt-i-ett för produktbilder och videoannonser</h2>

<p>Photoroom har vuxit från ett renodlat bakgrundsborttagningsverktyg till en bred plattform för produktvisuals: bildredigering, videoannonser, batch-bearbetning och ett API, tillgängligt via webb, mobil och en dedikerad Shopify-app.</p>

<h2>Vad är Photoroom?</h2>
<p>Photoroom är ett AI-verktyg för e-handelssäljare som vill ta fram listningsklara produktbilder utan fotostudio. Utöver bakgrundsborttagning och AI-genererade bakgrunder erbjuder verktyget AI-modeller och virtuell provning för modeprodukter, samt videogenerering för annonser på Meta och TikTok. Ett API gör det möjligt att bygga in funktionerna i egna system.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bakgrundsborttagning och AI-bakgrunder:</strong> Byt bakgrund eller låt AI placera produkten i en genererad scen.</li>
<li><strong>AI-modeller och virtuell provning:</strong> Visa kläder på AI-genererade modeller utan fotografering.</li>
<li><strong>Batch-redigering:</strong> Redigera hela produktkataloger och exportera i bulk.</li>
<li><strong>Videoannonser:</strong> Generera korta produktvideor för sociala kanaler direkt från stillbilder.</li>
<li><strong>Shopify-app och API:</strong> Koppla in direkt i butiken eller bygga egna flöden.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Bredden är Photorooms största styrka — få konkurrenter erbjuder bild, video och batch-bearbetning i samma verktyg. Shopify-integrationen och API:et gör det attraktivt även för team med egna tekniska flöden. Baksidan är att prissidan anger allt i krediter och exportantal per plan snarare än tydliga dollarbelopp, vilket gör det svårare att jämföra kostnad rakt av mot enklare, billigare konkurrenter som bara gör en sak.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket brett funktionsutbud — bild, video och batch i samma verktyg.</li>
<li><strong>Fördel:</strong> Inbyggd Shopify-integration och API för utvecklare.</li>
<li><strong>Fördel:</strong> AI-modeller och virtuell provning för modebranschen.</li>
<li><strong>Nackdel:</strong> Priserna anges i krediter/export per plan, inte tydliga dollarbelopp.</li>
<li><strong>Nackdel:</strong> De mest avancerade funktionerna (video, 4K) kräver de dyrare planerna.</li>
</ul>

<h2>Pris och planer</h2>
<p>Photoroom prissätts i fyra nivåer — Pro, Max, Ultra och Enterprise — där varje nivå ger ett visst antal AI-krediter och exporter per månad (från 8 000 krediter/1 000 exporter på Pro till 75 000 krediter/10 000 exporter på Ultra). Enterprise har anpassad prissättning med en delad årsbalans över appar och API. Exakta dollarbelopp per nivå anges inte öppet på prissidan.</p>

<h2>För vem passar Photoroom?</h2>
<p>Photoroom passar säljare och team som vill ha ett enda verktyg för hela produktvisual-flödet — från bakgrundsbyte till färdig videoannons — snarare än att kombinera flera smalare verktyg. Shopify-butiker och modevarumärken har extra nytta av de inbyggda integrationerna och AI-modellerna.</p>

<h2>Vårt omdöme</h2>
<p>Photoroom är det mest kompletta verktyget i jämförelsen rent funktionsmässigt, men den otydliga prissättningen gör det svårare att veta vad man landar på innan man testar. Med ett betyg på 8,3 av 10 är det ett starkt val för den som vill konsolidera flera bildbehov i ett verktyg, men den som bara vill byta bakgrund snabbt och billigt kan hitta enklare och billigare alternativ.</p>`,
  },
  {
    slug: 'pebblely',
    title: 'Pebblely',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Pebblely recension 2026 — enklast och billigast för bakgrundsbyten</h2>

<p>Pebblely är ett av de enklaste AI-verktygen för produktbilder: ladda upp en bild, välj bakgrundstema, och få en färdig produktbild inom sekunder. Inget avancerat gränssnitt, inga AI-modeller att lära sig — bara en snabb väg från rå bild till säljbar bild.</p>

<h2>Vad är Pebblely?</h2>
<p>Pebblely genererar nya bakgrunder till produktfoton utifrån mer än 40 färdiga teman, eller en egen textbeskrivning. Verktyget riktar sig till småföretag och nya e-handlare som vill ha snygga produktbilder utan att anlita en fotograf, och som inte behöver avancerade funktioner som AI-modeller eller video.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>40+ färdiga bakgrundsteman:</strong> Välj en stil direkt i stället för att skriva en prompt.</li>
<li><strong>Egna textprompter:</strong> Beskriv en bakgrund själv om inget tema passar.</li>
<li><strong>Bulk-generering:</strong> Kör flera produkter i samma flöde (Basic-planen och uppåt).</li>
<li><strong>Snabbt resultat:</strong> Från uppladdning till färdig bild på sekunder, inget väntetid på handpåläggning.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Pebblelys styrka är hur lite det krävs för att komma igång — det finns ingen inlärningskurva och ingen anledning att formulera en perfekt prompt när 40 färdiga teman redan täcker de vanligaste stilarna. Begränsningen är lika tydlig: det är ett renodlat bakgrundsverktyg utan AI-modeller, video eller mer avancerad redigering, så den som vill visa kläder på en modell eller generera produktannonser behöver ett annat verktyg vid sidan av.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket enkelt att komma igång med — en bild in, färdig produktbild ut.</li>
<li><strong>Fördel:</strong> Tydlig, låg prissättning jämfört med de flesta konkurrenter.</li>
<li><strong>Fördel:</strong> Över 40 färdiga bakgrundsteman att välja mellan direkt.</li>
<li><strong>Nackdel:</strong> Bulk-generering kräver Basic-planen eller högre, inte den billigaste Lite-planen.</li>
<li><strong>Nackdel:</strong> Saknar AI-modeller, video och mer avancerad redigering som konkurrenterna erbjuder.</li>
</ul>

<h2>Pris och planer</h2>
<p>Pebblely har tre nivåer: Lite för 9 USD/mån (30 bilder), Basic för 19 USD/mån (200 bilder) och Pro för 39 USD/mån (500 bilder, markerad som bästa värde). En årsplan på varje nivå ger mer än två månaders rabatt.</p>

<h2>För vem passar Pebblely?</h2>
<p>Pebblely passar småföretag och enskilda säljare som bara behöver snygga bakgrunder till produktfoton, till lägsta möjliga pris och utan inlärningskurva. Den som behöver AI-modeller, video eller mer kontroll över scenen bör titta på bredare verktyg som Photoroom eller Flair AI istället.</p>

<h2>Vårt omdöme</h2>
<p>Pebblely gör precis en sak, och gör den enkelt och billigt. Det är inte verktyget för den som vill bygga en hel varumärkesvisuell identitet, men för den som bara vill ersätta ett vitt köksbord med en proffsig bakgrund är det svårt att hitta ett enklare eller billigare alternativ. Med ett betyg på 7,6 av 10 är Pebblely ett tryggt förstahandsval för nybörjare och budgetmedvetna säljare.</p>`,
  },
  {
    slug: 'bria',
    title: 'Bria',
    content_mdx: `<p><strong>Betyg: 8.0/10</strong></p>
<h2>Bria recension 2026 — API-plattform för produktbilder med licensierad träningsdata</h2>

<p>Bria (bria.ai) skiljer sig från de flesta konkurrenterna genom att vara byggt för utvecklare och företag snarare än för drag-och-släpp-redigering, med transparent per-bild-prissättning och ett uttalat fokus på fullt licensierad träningsdata.</p>

<h2>Vad är Bria?</h2>
<p>Bria är en bild- och videoplattform med API, SDK och en visuell agent-yta (Bria Create), byggd för att integreras i andra system snarare än att användas som ett fristående redigeringsprogram i första hand. Produktutbudet inkluderar specialiserade verktyg för produktbilder — cutout, skugga, packshot, lifestyle-scener och virtuell provning — samt en separat uppsättning verktyg för fordonsbilder.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Produktbildsverktyg via API:</strong> Cutout, skugga, packshot, lifestyle by text/image, virtuell provning.</li>
<li><strong>Per-bild-prissättning:</strong> Betala per generering (från 0,018 USD/bild) istället för ett fast abonnemang.</li>
<li><strong>Licensierad träningsdata:</strong> Bria betonar att modellerna bara tränats på fullt licensierad data, med indemnifiering på Enterprise-nivå.</li>
<li><strong>Fordonsverktyg:</strong> Separata funktioner för bilbilder — reflexer, segmentering, effekter.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Den tydliga per-bild-prissättningen är ovanlig i kategorin och gör Bria lätt att räkna på för volymanvändning — ingen gissningslek om vad ett abonnemang faktiskt täcker. Fokuset på licensierad data och indemnifiering är relevant för företag som är oroliga för legala risker med AI-genererat bildmaterial. Baksidan är tillgängligheten: det här är inget verktyg man bara loggar in i och klickar runt i — det kräver API- eller SDK-integration, vilket gör tröskeln högre för den som inte har utvecklarresurser.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Transparent per-bild-prissättning utan abonnemangstvång.</li>
<li><strong>Fördel:</strong> Betonar fullt licensierad träningsdata och indemnifiering.</li>
<li><strong>Fördel:</strong> Breda API-verktyg för både produkt- och fordonsbilder.</li>
<li><strong>Nackdel:</strong> Kräver teknisk integration — inget enkelt gränssnitt för icke-utvecklare.</li>
<li><strong>Nackdel:</strong> Gratisnivån ger bara 100 genereringar totalt, inte löpande per månad.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisnivån ger 100 genereringar utan krav på kreditkort. Pay-as-you-go-planen börjar på 0,018 USD per generering utan tak, med snabbare kö och support. Enterprise har anpassad prissättning med fullständig indemnifiering och on-prem-alternativ.</p>

<h2>För vem passar Bria?</h2>
<p>Bria passar utvecklare och företag som vill bygga in produktbildsgenerering i egna system eller processa stora volymer, snarare än att redigera bild för bild i ett webbgränssnitt. Företag med legala krav på spårbar, licensierad träningsdata har extra nytta av plattformens inriktning.</p>

<h2>Vårt omdöme</h2>
<p>Bria är inte verktyget för den som vill ha ett enkelt drag-och-släpp-flöde, men för utvecklarteam som vill skala produktbilder via API är kombinationen av transparent pris och licensierad data ett starkt argument. Med ett betyg på 8,0 av 10 landar Bria som ett av de mer tekniska men mest förutsägbara alternativen i kategorin.</p>`,
  },
  {
    slug: 'pixelcut',
    title: 'Pixelcut',
    content_mdx: `<p><strong>Betyg: 7.9/10</strong></p>
<h2>Pixelcut recension 2026 — bäst pris för obegränsad bakgrundsborttagning</h2>

<p>Pixelcut positionerar sig som det prisvärda alternativet i kategorin: obegränsad bakgrundsborttagning och uppskalning redan på den billigaste betalplanen, plus mobilappar för den som redigerar på språng.</p>

<h2>Vad är Pixelcut?</h2>
<p>Pixelcut är en AI-bildredigerare för produktfoton med verktyg för bakgrundsborttagning, bakgrundsbyte, uppskalning, objektborttagning och generativ fyllning/utökning av bilder. Verktyget finns som webbapp, iOS- och Android-app, samt ett bulk-redigeringsläge för hela produktkataloger.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bakgrundsborttagning och AI-bakgrunder:</strong> Obegränsat på betalplanerna.</li>
<li><strong>Fast Upscaler:</strong> Uppskalning av bildupplösning, obegränsad på Pro och Business.</li>
<li><strong>Magic Eraser / Pro Eraser:</strong> Ta bort oönskade objekt från bilder.</li>
<li><strong>Bulk Image Editor:</strong> Redigera hela produktkataloger i batch.</li>
<li><strong>Mobilappar:</strong> Finns för både iOS och Android, inte bara webb.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Pixelcuts tydligaste fördel är priset i förhållande till vad man får: obegränsad bakgrundsborttagning och uppskalning redan från runt 8-10 USD/mån är lägre än flera konkurrenter som tar samma eller högre pris för mer begränsad användning. Det som saknas är de mer avancerade AI-modell- och lifestyle-funktionerna som Photoroom och Botika erbjuder — Pixelcut är starkast på de grundläggande, repetitiva redigeringsuppgifterna snarare än kreativ scenbyggnad.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Tydliga, låga priser jämfört med de flesta konkurrenter.</li>
<li><strong>Fördel:</strong> Obegränsad bakgrundsborttagning och uppskalning redan på Pro.</li>
<li><strong>Fördel:</strong> Mobilapp för både iOS och Android.</li>
<li><strong>Nackdel:</strong> Gratisplanen är begränsad till enklare bakgrundsborttagning/uppskalning.</li>
<li><strong>Nackdel:</strong> Mindre avancerade AI-modell-/lifestyle-funktioner än dyrare konkurrenter.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisplanen ger begränsad bakgrundsborttagning och uppskalning. Pro kostar 10 USD/mån (8 USD/mån vid årsbetalning) med 600 AI-krediter, obegränsad bakgrundsborttagning/uppskalning och ett 3-personers team. Business kostar 30 USD/mån (24 USD/mån årsvis) med 3 600 krediter och ett 10-personers team. Årsplaner sparar 20 procent.</p>

<h2>För vem passar Pixelcut?</h2>
<p>Pixelcut passar säljare och mindre team som gör mycket bakgrundsborttagning och uppskalning löpande, och som prioriterar lågt pris framför avancerade AI-modellfunktioner. Mobilapparna gör det också till ett bra val för den som redigerar bilder direkt från telefonen.</p>

<h2>Vårt omdöme</h2>
<p>Pixelcut vinner inte på funktionsbredd, utan på att göra de vanligaste redigeringsuppgifterna obegränsade till ett lågt pris. Med ett betyg på 7,9 av 10 är det ett av de mest prisvärda alternativen för den som inte behöver AI-modeller eller video, bara pålitlig bakgrundsborttagning och uppskalning i stor volym.</p>`,
  },
  {
    slug: 'flair-ai',
    title: 'Flair AI',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Flair AI recension 2026 — canvas-editor för produkt- och modebilder</h2>

<p>Flair AI skiljer sig från de flesta en-klicks-verktygen i kategorin genom att ge användaren en drag-och-släpp-canvas att bygga scener på, innan AI appliceras — mer kreativ kontroll, men också en något brantare inlärningskurva.</p>

<h2>Vad är Flair AI?</h2>
<p>Flair AI är en plattform för att skapa AI-genererat produktinnehåll: produktbilder, on-model-modebilder, video och annonser. Istället för att bara ladda upp en bild och få ett resultat, bygger man scenen på en canvas med rekvisita och bakgrunder, och kan generera egna, återanvändbara AI-modeller med justerbara egenskaper som hårfärg och kroppstyp.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Drag-och-släpp-canvas:</strong> Bygg en scen med rekvisita innan AI appliceras på den.</li>
<li><strong>Egna AI-modeller:</strong> Skapa anpassningsbara modeller för on-model-bilder och mönster-/logobevarande.</li>
<li><strong>Mallar:</strong> Spara återanvändbara designer för att testa koncept i skala.</li>
<li><strong>Videogenerering och annonser:</strong> Skapa produktvideor och annonser med mallbibliotek.</li>
<li><strong>Teamsamarbete:</strong> Jobba i realtid tillsammans, med delat varumärkesbibliotek.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Canvas-upplägget ger mer kontroll än de flesta konkurrenterna — man bestämmer kompositionen innan AI appliceras, istället för att bara få ett förslag man måste acceptera eller förkasta. Det gör Flair AI starkare för varumärken som vill ha en konsekvent visuell identitel över en hel kollektion. Nackdelen är transparensen kring pris: startsidan visar ingen prisinformation alls, utan hänvisar till en separat prissida eller ett demo-samtal, vilket gör det svårare att snabbt bedöma om verktyget passar budgeten.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Drag-och-släpp-canvas ger mer kreativ kontroll än rena en-klicks-verktyg.</li>
<li><strong>Fördel:</strong> Egna, anpassningsbara AI-modeller med justerbara egenskaper.</li>
<li><strong>Fördel:</strong> Teamsamarbete i realtid och delat varumärkesbibliotek.</li>
<li><strong>Nackdel:</strong> Priser listas inte öppet — kräver separat prissida eller bokad demo.</li>
<li><strong>Nackdel:</strong> Mer tidskrävande att lära sig än enklare en-klicks-konkurrenter som Pebblely.</li>
</ul>

<h2>Pris och planer</h2>
<p>Flair AI går att börja med gratis. Betalda planer och Enterprise-pris anges inte öppet på hemsidan — man hänvisas till en separat prissida eller att boka en demo för exakta siffror.</p>

<h2>För vem passar Flair AI?</h2>
<p>Flair AI passar modevarumärken och byråer som vill ha kreativ kontroll över scenuppbyggnad och egna AI-modeller, snarare än ett snabbt en-klicks-resultat. Team som redan arbetar kollaborativt i realtid har extra nytta av delningsfunktionerna.</p>

<h2>Vårt omdöme</h2>
<p>Flair AI belönar den som är villig att lägga tid på att bygga scener själv, med mer kontroll som resultat. Den otydliga prissättningen gör det svårare att jämföra rakt av mot konkurrenter med öppna priser. Med ett betyg på 7,6 av 10 är det ett bra val för kreativa team, men mindre lämpligt för den som bara vill ha ett snabbt, billigt resultat.</p>`,
  },
  {
    slug: 'claid-ai',
    title: 'Claid',
    content_mdx: `<p><strong>Betyg: 7.7/10</strong></p>
<h2>Claid recension 2026 — kreditbaserad fotostudio och API i skala</h2>

<p>Claid (claid.ai) erbjuder både ett webbgränssnitt och ett separat API-spår för produktbilder, med ett kreditsystem som gör det möjligt att testa gratis innan man binder sig till en betald plan.</p>

<h2>Vad är Claid?</h2>
<p>Claid är en AI-fotostudio för produktbilder som går att använda både som fristående webbverktyg och som en bakomliggande motor via API/SDK. Plattformen riktar sig både till den som bara vill generera bilder via webbgränssnittet och till utvecklare som vill bygga in bildautomatisering i egna system i skala.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Kreditbaserat system:</strong> Olika operationer kostar olika mycket, 1-10+ krediter beroende på komplexitet.</li>
<li><strong>Separata web- och API-spår:</strong> API-krediter köps fristående och kräver ingen betald webbplan.</li>
<li><strong>Gratis startnivå:</strong> 50 krediter för webb och 50 för API att testa med.</li>
<li><strong>AI-fotoshoots i skala:</strong> Byggt för att producera stora mängder produktbilder, inte bara enstaka bilder.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Att kunna testa API:et gratis utan att först behöva en betald webbplan är ovanligt och sänker tröskeln för utvecklare som vill utvärdera innan de bygger in Claid i ett flöde. Att webb och API är separata spår gör det också möjligt att bara betala för det man faktiskt använder. Den tydligaste svagheten i vår granskning var prissidans transparens: olika källor anger sinsemellan olika siffror för webbplanerna, så exakta priser bör alltid dubbelkollas direkt hos Claid innan man bestämmer sig.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Gratis startnivå med krediter för både webb och API, utan betalplan för att testa API:et.</li>
<li><strong>Fördel:</strong> Separata web- och API-spår gör det möjligt att bara betala för det man använder.</li>
<li><strong>Fördel:</strong> Byggt för skala — fungerar både som fristående verktyg och bakomliggande motor.</li>
<li><strong>Nackdel:</strong> Prissidan gav inte fullständig information vid vår granskning — tredjepartskällor anger olika siffror sinsemellan.</li>
<li><strong>Nackdel:</strong> Kreditsystemet gör det svårare att snabbt jämföra totalkostnad mot konkurrenter med fasta abonnemang.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisnivån ger 50 krediter för webb och 50 för API. Självbetjänad API-access börjar enligt Claids egen företagssida på 59 USD för 1 000 krediter. Högre volymer och fullt hanterad bearbetning hänvisas till anpassad Enterprise-prissättning. Exakta webbplanspriser varierade mellan källor vid vår granskning och bör bekräftas direkt på claid.ai/pricing.</p>

<h2>För vem passar Claid?</h2>
<p>Claid passar företag som vill automatisera produktbilder i skala via API, eller som vill ha en gratis väg in innan de bestämmer sig för en betald nivå. Team som redan har andra API-integrationer har extra nytta av att kunna koppla in Claid på samma sätt.</p>

<h2>Vårt omdöme</h2>
<p>Claid är ett kapabelt verktyg med en ovanligt tillgänglig gratis ingång för både webb och API, men den otydliga prisinformationen gör det svårare att lita helt på vad en betald plan faktiskt kostar utan att kolla direkt på hemsidan. Med ett betyg på 7,7 av 10 är Claid värt att testa gratis innan man jämför totalkostnaden mot konkurrenterna.</p>`,
  },
  {
    slug: 'botika',
    title: 'Botika',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>Botika recension 2026 — on-model-bilder för modebutiker med 150+ AI-modeller</h2>

<p>Botika är fokuserat på en specifik men värdefull nisch: att göra om platta produktfoton (flat lays, ghost mannequin) till bilder där kläderna visas på en AI-genererad modell, utan fotografering.</p>

<h2>Vad är Botika?</h2>
<p>Botika är en AI-plattform för modeinnehåll som tar befintliga produktbilder och genererar on-model-bilder och video utifrån ett bibliotek med över 150 AI-modeller, poser och bakgrunder. En inbyggd "Studio Director"-agent hjälper till att planera och genomföra fotosessionen åt användaren.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>On-model-generering:</strong> Gör om flat lays och ghost mannequin-bilder till bilder på en modell.</li>
<li><strong>150+ AI-modeller, poser och bakgrunder:</strong> Ingår på alla planer, inget extra tillval.</li>
<li><strong>Studio Director-agent:</strong> Planerar och kör fotosessionen automatiserat.</li>
<li><strong>Video:</strong> Genererar korta produktvideor (5 sekunder) från samma underlag som stillbilderna.</li>
<li><strong>Automatisk retuschering:</strong> Finjustering av bilder ingår som en separat kreditbaserad funktion.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Botikas styrka är tydlig för modeprodukter: att slippa fotografera varje plagg på en modell sparar betydande tid och kostnad, och biblioteket med 150+ modeller ger variation utan extra avgift. Kreditsystemet är transparent och krediterna rullar över mellan månader på de högre planerna, vilket gör kostnaden mer förutsägbar än många konkurrenters modeller. Begränsningen är tydlig: det är ett verktyg byggt för kläder och mode — för produkter som inte "bärs", som elektronik eller hemprodukter, är det mindre relevant.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Tydlig, transparent prissättning med krediter som rullar över flera månader.</li>
<li><strong>Fördel:</strong> Stort bibliotek av AI-modeller, poser och bakgrunder ingår på alla planer.</li>
<li><strong>Fördel:</strong> Genererar både stillbilder och korta produktvideor från samma underlag.</li>
<li><strong>Nackdel:</strong> Fokuserat på mode/on-model — mindre relevant för produkter som inte bärs.</li>
<li><strong>Nackdel:</strong> Högre instegspris än renodlade bakgrundsverktyg som Pebblely eller Pixelcut.</li>
</ul>

<h2>Pris och planer</h2>
<p>Personal kostar 20 USD/mån (240 USD/år) med 10 080 krediter. Pro kostar 48 USD/mån (576 USD/år) med 26 400 krediter som rullar över 3 månader. Max kostar 80 USD/mån (960 USD/år) med 48 000 krediter som rullar över 6 månader. Enterprise har anpassad prissättning med obegränsad parallell generering och API-access.</p>

<h2>För vem passar Botika?</h2>
<p>Botika passar modebutiker och varumärken som vill ersätta eller komplettera fotografering med on-model-bilder i skala, särskilt de som säljer kläder, skor eller accessoarer. Butiker utanför modebranschen hittar sannolikt mer relevanta verktyg i andra delar av den här listan.</p>

<h2>Vårt omdöme</h2>
<p>Botika levererar precis det löftet handlar om — on-model-bilder utan fotografering, med ett stort och varierat modellbibliotek. Med ett betyg på 7,8 av 10 är det ett av de starkaste alternativen specifikt för modeprodukter, men mindre relevant utanför den nischen.</p>`,
  },
  {
    slug: 'pixc',
    title: 'Pixc',
    content_mdx: `<p><strong>Betyg: 7.3/10</strong></p>
<h2>Pixc recension 2026 — done-for-you-redigering där du bara betalar för godkända bilder</h2>

<p>Pixc skiljer sig från de flesta andra verktygen i den här listan genom att inte vara ett självbetjänings-AI-verktyg i realtid — det är en redigeringstjänst (med AI-stöd) där ett team gör jobbet åt dig, och du betalar bara för de bilder du faktiskt godkänner.</p>

<h2>Vad är Pixc?</h2>
<p>Pixc är en produktbildsredigeringstjänst för e-handelsbutiker på plattformar som Shopify, Amazon, Etsy och eBay. Du laddar upp bilder, väljer en mall för hur de ska redigeras, och får tillbaka färdiga bilder för godkännande — du betalar bara för de bilder du faktiskt accepterar.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bakgrundsborttagning:</strong> Byt till vit, transparent eller valfri färgbakgrund.</li>
<li><strong>Beskärning och storleksändring:</strong> Bulk-anpassning till plattformsspecifika mått.</li>
<li><strong>Skuggor och reflektioner:</strong> Lägg till djup i produktbilderna.</li>
<li><strong>Färgkorrigering och bildförbättring.</strong></li>
<li><strong>Gratis omgörning:</strong> Är du inte nöjd kan du begära en ny version utan extra kostnad.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Modellen "betala bara för det du godkänner" är ovanlig och sänker risken — man binder sig inte till ett abonnemang för osäkert resultat. Att det finns ett team (inte bara en AI-modell) bakom varje bild gör kvaliteten mer konsekvent för mer komplexa redigeringar, men det gör också att det tar längre tid per bild än de helautomatiserade AI-verktygen i den här listan, och kostar mer per bild vid högre volymer jämfört med en ren AI-prenumeration.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Du betalar bara för bilder du faktiskt godkänner, inte för försök.</li>
<li><strong>Fördel:</strong> Gratis omgörning om du inte är nöjd med resultatet.</li>
<li><strong>Fördel:</strong> Ingen inlärningskurva — du skickar bara in bilderna, inget eget redigeringsarbete.</li>
<li><strong>Nackdel:</strong> Inte en realtids-AI-tjänst — tar längre tid per bild än de automatiserade alternativen.</li>
<li><strong>Nackdel:</strong> Dyrare per bild i mindre paket än rena AI-prenumerationer vid högre volym.</li>
</ul>

<h2>Pris och planer</h2>
<p>Pixc säljer kreditpaket som gäller i 365 dagar: Small (10 bilder för 20 USD), Medium (50 bilder för 100 USD), Large (200 bilder för 400 USD) och Extra large (1 000 bilder för 2 000 USD). Nya konton får 5 gratis bonuskrediter. Det finns inget löpande abonnemang.</p>

<h2>För vem passar Pixc?</h2>
<p>Pixc passar butiker som helst vill lämna bort bildredigeringen helt, snarare än att lära sig ett eget verktyg, och som prioriterar förutsägbar kvalitet över snabbhet. Den som behöver stora volymer löpande, eller vill ha resultat inom sekunder, hittar troligen bättre värde i ett av de helautomatiserade AI-verktygen ovan.</p>

<h2>Vårt omdöme</h2>
<p>Pixc är inte det snabbaste eller billigaste alternativet i den här listan, men "betala bara för godkänt resultat"-modellen gör det till ett lågriskval för den som vill slippa redigera själv. Med ett betyg på 7,3 av 10 är det ett bra alternativ för butiker som värdesätter bekvämlighet och förutsägbar kvalitet högre än pris per bild.</p>`,
  },
  {
    slug: 'autoretouch',
    title: 'AutoRetouch',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>AutoRetouch recension 2026 — B2B-standardisering av produktbilder i stor skala</h2>

<p>AutoRetouch riktar sig till ett annat segment än de flesta verktygen i den här listan: större mode- och detaljhandelsvarumärken som behöver standardisera produktbilder från många olika leverantörer till en enhetlig visuell profil, snarare än en enskild säljare som redigerar sina egna foton.</p>

<h2>Vad är AutoRetouch?</h2>
<p>AutoRetouch är en B2B-plattform som automatiserar produktbildsredigering i skala genom tre huvuddelar: AI Shoot för on-model-bilder, AI Packshot för ghost mannequin- och flatlay-bilder, och AI Editing för batch-redigering och kanalanpassning. Plattformen är byggd för att ta emot bilder från flera olika leverantörer och standardisera dem till varumärkets egna krav.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Batch-bildanpassning:</strong> Automatiserade redigeringar, som bakgrundsbyten, över stora kataloger.</li>
<li><strong>Standardisering av leverantörsbilder:</strong> Bringar bilder från olika källor upp till varumärkets och marknadsplatsens krav.</li>
<li><strong>Fler produktvyer utan ny fotografering:</strong> Genererar extra on-model- och packshot-vyer från befintliga bilder.</li>
<li><strong>Kanalanpassning:</strong> Förbereder bilder för olika e-butikers och marknadsplatsers specifikationer.</li>
<li><strong>API-integration:</strong> Batch-bearbetning, statusspårning och hämtning av tillgångar in i befintliga flöden.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>AutoRetouchs tydligaste värde ligger i problemet det löser: när en kedja eller ett varumärke tar emot bilder från dussintals olika leverantörer i olika kvalitet och format, är manuell standardisering orimligt tidskrävande. Möjligheten att generera extra vyer från befintliga bilder, istället för att boka om fotografering, är också ett konkret tidsargument. Nackdelen är att plattformen är tydligt riktad mot större volymer — en liten enskild butik med några dussin produkter får sannolikt varken den funktionalitet eller det pris den behöver här.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Byggt specifikt för att standardisera bilder från många olika leverantörer i samma format.</li>
<li><strong>Fördel:</strong> Kan generera extra produktvyer från befintliga bilder utan ny fotografering.</li>
<li><strong>Fördel:</strong> Valbar hanterad tjänst med expert-kvalitetskontroll för den som inte vill sköta allt själv.</li>
<li><strong>Nackdel:</strong> Inga priser publicerade öppet — kräver kontakt med säljteamet för offert.</li>
<li><strong>Nackdel:</strong> Riktar sig mot större katalogvolymer, sannolikt överdimensionerat för en enskild liten butik.</li>
</ul>

<h2>Pris och planer</h2>
<p>AutoRetouch publicerar inga priser öppet på sin hemsida. AI Shoot erbjuds som självbetjäning eller hanterad tjänst, AI Editing i nivåerna Starter, Pro och Enterprise, och det finns ett valbart Expert QC-tillägg för hanterad kvalitetskontroll. Pris ges på förfrågan i samtliga fall.</p>

<h2>För vem passar AutoRetouch?</h2>
<p>AutoRetouch passar varumärken och detaljhandelskedjor med stora, leverantörsblandade produktkataloger som levererar till flera marknadsplatser med olika bildkrav. Det är i första hand ett B2B-verktyg, inte ett alternativ för enskilda säljare med små volymer.</p>

<h2>Vårt omdöme</h2>
<p>AutoRetouch löser ett verkligt och specifikt problem för större aktörer — bildstandardisering över många leverantörer — men den otydliga prissättningen och enterprise-inriktningen gör det mindre relevant för de flesta mindre butiker. Med ett betyg på 7,6 av 10 är det ett nischat men välriktat val för rätt målgrupp.</p>`,
  },
];

async function upsertReview(r: ReviewRow) {
  const path = `/ai-verktyg/${r.slug}`;
  const { data: existing } = await db.from('articles').select('id').eq('path', path).maybeSingle();
  const row = {
    slug: r.slug,
    path,
    title: `${r.title} recension 2026`,
    type: 'page',
    category: null,
    parent_slug: PARENT_SLUG,
    affiliate_url: null,
    published_at: null,
    author_slug: 'nicklas-hallberg',
    seo_title: `${r.title} recension 2026 — pris, funktioner och betyg`,
    content_mdx: r.content_mdx,
  };
  if (existing) {
    const { error } = await db.from('articles').update(row).eq('id', existing.id);
    if (error) { console.error(r.slug, error); process.exit(1); }
    console.log(`OK (update): ${r.slug}`);
  } else {
    const { error } = await db.from('articles').insert(row);
    if (error) { console.error(r.slug, error); process.exit(1); }
    console.log(`OK (insert): ${r.slug}`);
  }
}

async function main() {
  for (const r of reviews) await upsertReview(r);
}
main();
