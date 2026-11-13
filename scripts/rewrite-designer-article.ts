/**
 * Fördjupar basta-ai-verktyg-for-designers-2026 till samma djup/struktur som
 * basta-ai-seo-verktyg-2026 (43 500 tecken, 15 h2) — ursprungsversionen var
 * bara 8 875 tecken/7 h2, för tunn enligt uttrycklig användarfeedback.
 *
 * Alla nya verktyg (Leonardo AI, Ideogram, Stable Diffusion, Flux, DALL-E 3,
 * Playground AI, Bing Image Creator, Remove.bg, Topaz Photo AI, Luminar Neo,
 * Framer AI, Webflow AI, Khroma) hämtas från redan publicerade, verifierade
 * recensioner på sajten — inga nya fakta påstås, bara sammanfattade och
 * länkade till källan (recensionen).
 *
 *   npx tsx scripts/rewrite-designer-article.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const content = `
<p>"AI-verktyg för designers" är egentligen fyra olika jobb med olika verktyg: grafisk design och varumärke, UI/UX för digitala produkter, bildgenerering för koncept och moodboards, och foto-efterbehandling. De flesta listor blandar ihop allt och ger dig tjugo namn utan ordning. Den här är sorterad efter vad du faktiskt ska producera, så du kan gå direkt till rätt avsnitt.</p>

<p>Priserna är kontrollerade mot leverantörernas egna prissidor i november 2026, eller hämtade från sajtens egna, separat verifierade recensioner av respektive verktyg (länkade löpande) och anges i den valuta leverantören själv använder. Där källorna gick isär eller inte kunde verifieras står det utskrivet.</p>

<div data-block="toplist">{"title":"Sju att börja med","sort":"editorial","items":[{"review":"canva-ai","badge":"Grafisk design","text":"Snabbast från idé till färdig grafik, med Magic Studios AI-verktyg i botten av gratisplanen."},{"review":"figma-ai-ux","badge":"UI/UX","text":"Om ditt team redan jobbar i Figma är Figma AI vägen med minst friktion."},{"review":"google-stitch","badge":"Snabba mockups","text":"Helt gratis text-till-UI via Google Labs — bra startpunkt innan Figma."},{"review":"adobe-firefly","badge":"Bildgenerering","text":"Kommersiellt säker bildgenerering, byggd för att användas i betalt arbete."},{"review":"midjourney","badge":"Koncept & stil","text":"Fortfarande starkast på ren bildkvalitet för moodboards och koncept-art."},{"review":"ideogram","badge":"Text i bild","text":"Enda verktyget som konsekvent stavar rätt i logotyper och affischer."},{"review":"removebg-bredig","badge":"Foto-efterbehandling","text":"Snabbaste vägen från rå produktbild till ren bakgrund, med API för skala."}],"note":"Ordningen är redaktionell, inte ett betyg mot varandra. Betygen kommer från respektive recension."}</div>

<h2>Välj efter vad du designar</h2>

<p><strong>Grafisk design och varumärke.</strong> Logotyper, sociala medier-grafik, pitch-deckar och marknadsföringsmaterial. Börja med <a href="/ai-verktyg/canva-ai/">Canva AI</a> om du redan har Canva, annars <a href="/ai-verktyg/adobe-firefly/">Adobe Firefly</a> om du sitter i Adobes ekosystem.</p>

<p><strong>UI/UX för digitala produkter.</strong> Wireframes, skärmdesign, komponentbibliotek och dev-handoff. <a href="/ai-verktyg/figma-ai-ux/">Figma AI</a> om teamet redan jobbar i Figma, <a href="/ai-verktyg/google-stitch/">Google Stitch</a> för blixtsnabba första utkast, <a href="/ai-verktyg/framer-ai/">Framer AI</a> eller <a href="/ai-verktyg/webflow-ai/">Webflow AI</a> när designen ska bli en publicerad sajt utan separat utvecklingssteg.</p>

<p><strong>Bildgenerering, koncept och moodboards.</strong> <a href="/ai-verktyg/midjourney/">Midjourney</a> för ren bildkvalitet, <a href="/ai-verktyg/ideogram/">Ideogram</a> när texten i bilden måste stava rätt, <a href="/ai-verktyg/khroma-design/">Khroma</a> för färgpaletter när du står och stirrar på en tom palett.</p>

<p><strong>Foto-efterbehandling.</strong> <a href="/ai-verktyg/removebg-bredig/">Remove.bg</a> för bakgrunder, <a href="/ai-verktyg/topaz-photo-bredig/">Topaz Photo AI</a> för uppskalning och skärpning av redan tagna bilder.</p>

<p><strong>Rörlig bild för pitchen.</strong> Du behöver sällan en fullständig videoredigerare för en pitch — <a href="/ai-video/runway-gen-3/">Runway</a> räcker långt för korta klipp och animerade mockups.</p>

<h2>1. Grafisk design och varumärke</h2>

<p><a href="/ai-verktyg/canva-ai/">Canva AI</a> (Magic Studio) är rimligast för de flesta: gratisplanen ger dig bakgrundsborttagning och grundläggande AI-funktioner, och Canva Pro kostar omkring 18 USD/mån vid månadsbetalning eller cirka 12 USD/mån vid årsbetalning. Det är inte det mest kraftfulla verktyget på marknaden, men det är det som flest redan kan använda utan inlärningströskel — rätt val när flaskhalsen är volym av enkel grafik, inte precision.</p>

<p><a href="/ai-verktyg/adobe-firefly/">Adobe Firefly</a> är rätt val när du behöver kommersiellt säker bildgenerering som går att licensiera utan oro — Adobe tränar modellen på licensierat material, vilket spelar roll för byråer som levererar till kunder med egna juridiska krav. Firefly Standard kostar 11,99 USD/mån med 2 000 genereringskrediter, Pro 23,99 USD/mån med 4 000 krediter, och Pro Plus 59,99 USD/mån med 10 000 krediter. En gratisnivå finns med ett begränsat antal dagliga genereringar.</p>

<p>För logotyper specifikt är <a href="/ai-verktyg/looka-design/">Looka</a> ett eget spår: du designar och förhandsgranskar gratis, men betalar vid nedladdning — 20 USD för en PNG i lågupplöst format, 65 USD för vektorfiler (SVG, EPS, PDF) som faktiskt går att använda kommersiellt. Ett Brand Kit med mallar och riktlinjer kostar 96 USD/år ovanpå det. Rätt verktyg om du bara behöver en logotyp och inte en löpande designprenumeration.</p>

<div data-block="compare">{"title":"Grafisk design — tre olika prismodeller","cards":[{"title":"Canva AI","text":"Prenumeration, bred verktygslåda.","rows":[{"label":"Gratisnivå","value":"Ja, med AI-grunder"},{"label":"Pro","value":"~18 USD/mån, ~12 USD/mån årsvis"}],"link":{"href":"/ai-verktyg/canva-ai/","text":"Läs recensionen"},"source":[{"text":"Canvas prissida","url":"https://www.canva.com/pricing/"}]},{"title":"Adobe Firefly","text":"Prenumeration, kommersiellt säker.","rows":[{"label":"Gratisnivå","value":"Ja, begränsat antal/dag"},{"label":"Standard","value":"11,99 USD/mån · 2 000 krediter"}],"link":{"href":"/ai-verktyg/adobe-firefly/","text":"Läs recensionen"},"source":[{"text":"Adobe Fireflys produktsida","url":"https://www.adobe.com/products/firefly.html"}]},{"title":"Looka","text":"Engångsköp per logotyp.","rows":[{"label":"Gratisnivå","value":"Ja, design & förhandsvisning"},{"label":"Nedladdning","value":"20 USD (PNG) / 65 USD (vektor)"}],"link":{"href":"/ai-verktyg/looka-design/","text":"Läs recensionen"}}]}</div>

<h2>2. UI/UX-design</h2>

<p><a href="/ai-verktyg/figma-ai-ux/">Figma AI</a> är rätt val om teamet redan lever i Figma — AI-funktionerna delar ett gemensamt kreditsystem med planen. Professional kostar 16 USD/mån per fullt säte (dev-säten och collab-säten billigare), med 3 000 AI-krediter per månad på ett fullt säte. En gratis Starter-plan finns för enstaka projekt. Det här är verktyget för team som redan har en etablerad designprocess och vill snabba upp den, inte för att starta från noll.</p>

<p><a href="/ai-verktyg/google-stitch/">Google Stitch</a> — tidigare Galileo AI, som Google köpte och relanserade gratis 2025 — är snabbast från textprompt till färdig skärm, och exporterar till Figma för finputs. Helt gratis via Google Labs, vilket också är den enda risken: ingen garanti för fortsatt drift eller prissättning på sikt eftersom det är ett Labs-experiment och inte en ordinarie produkt.</p>

<p><a href="/ai-verktyg/uizard-ux/">Uizard</a> ligger mellan de två: gratisplanen ger 3 AI-genereringar per månad med Autodesigner, Pro kostar 12 USD/mån vid årsbetalning med 500 krediter/dag, och Business 39 USD/mån med 5 000 AI-genereringar per månad och snabbare generering.</p>

<p>Ett växande spår är verktyg som hoppar över handoff-steget helt och publicerar direkt. <a href="/ai-verktyg/framer-ai/">Framer AI</a> rankas i sin egen recension till 9,8/10 i designfrihet och 9,2/10 i AI-generering — rätt val om du vill gå från design till publicerad, responsiv sajt utan att lämna över till en utvecklare. <a href="/ai-verktyg/webflow-ai/">Webflow AI</a> siktar åt samma håll men med tyngre fokus på SEO-verktyg (9,1/10 i egen recension) och e-handel, till en högre prisnivå som gör det svårtillgängligt för privatpersoner och mest motiverat för professionella team.</p>

<div data-block="compare">{"title":"UI/UX — fyra nivåer av pris och mognad","cards":[{"title":"Figma AI","text":"Bäst om teamet redan är i Figma.","rows":[{"label":"Gratisnivå","value":"Ja, Starter"},{"label":"Professional","value":"16 USD/mån, fullt säte"}],"link":{"href":"/ai-verktyg/figma-ai-ux/","text":"Läs recensionen"},"source":[{"text":"Figmas prissida","url":"https://www.figma.com/pricing/"}]},{"title":"Google Stitch","text":"Gratis, snabbast från prompt till skärm.","rows":[{"label":"Gratisnivå","value":"Ja, helt gratis"},{"label":"Betalplan","value":"Finns ej — Google Labs-produkt"}],"link":{"href":"/ai-verktyg/google-stitch/","text":"Läs recensionen"}},{"title":"Uizard","text":"Mellanläge, egen produkt med tydlig prisstege.","rows":[{"label":"Gratisnivå","value":"Ja, 3 AI-genereringar/mån"},{"label":"Pro","value":"12 USD/mån årsvis"}],"link":{"href":"/ai-verktyg/uizard-ux/","text":"Läs recensionen"},"source":[{"text":"Uizards prissida","url":"https://uizard.io/pricing/"}]},{"title":"Framer AI / Webflow AI","text":"Design som publiceras direkt, inget handoff.","rows":[{"label":"Bäst på","value":"Framer: designfrihet · Webflow: SEO/e-handel"},{"label":"Prisnivå","value":"Högre — riktar sig till professionella team"}],"link":{"href":"/ai-verktyg/framer-ai/","text":"Läs Framer-recensionen"}}]}</div>

<h2>3. Bildgenerering, koncept och moodboards</h2>

<p>Det här är kategorin med flest verktyg och störst spridning i vad de faktiskt är bra på. Ingen modell vinner på allt samtidigt — frågan är vilken svaghet du kan leva med.</p>

<p><a href="/ai-verktyg/midjourney/">Midjourney</a> är fortfarande vårt redaktionella förstahandsval för ren bildkvalitet — koncept-art, moodboards och stilutforskning innan du går vidare till en kommersiellt säkrare modell som Firefly för det slutgiltiga materialet. Se vår fullständiga recension för aktuella priser och versionsjämförelser.</p>

<p><a href="/ai-verktyg/ideogram/">Ideogram</a> löser ett problem de flesta bildmodeller fortfarande har: text i bilder. Ideogram renderar specifik text — flerordsfraser, specialtecken, varumärkesnamn — med en träffsäkerhet som enligt vår recension konsekvent slår Midjourney, Stable Diffusion och Adobe Firefly i direkta jämförelser. Rätt verktyg för affischer, logotypkoncept och social grafik där texten faktiskt måste gå att läsa. Gratisnivån ger tio genereringar om dagen, mer frikostigt än de flesta konkurrenter.</p>

<p>För den som vill ha full kontroll och inga löpande kostnader finns <a href="/ai-verktyg/stable-diffusion/">Stable Diffusion</a>: helt gratis att ladda ner och köra lokalt, men kräver i praktiken ett Nvidia-kort med minst 8 GB VRAM för rimligt tempo. Vill du slippa egen hårdvara finns Stability AIs molntjänst DreamStudio från omkring 10 USD för ett kreditpaket som räcker till flera hundra bilder. <a href="/ai-verktyg/flux/">Flux</a> — byggt av Stable Diffusions ursprungliga team i ett nytt bolag — har tagit över som ledande open source-modell: Flux.1 Schnell är helt gratis under Apache 2.0-licens för lokal körning, medan Flux.1 Pro via API kostar ungefär 0,04 USD per bild, vilket gör den till ett produktionsverktyg snarare än ett för fri experimentlust.</p>

<p>På betalsidan finns <a href="/ai-verktyg/dalle-3/">DALL-E 3</a> (numera GPT Image i OpenAIs egen namngivning) med stark prompt-följsamhet — gratisanvändare i ChatGPT Free får 3 bilder/dag, ChatGPT Plus (20 USD/mån) ger full tillgång. Samma motor ligger bakom <a href="/ai-verktyg/bing-image-creator/">Bing Image Creator</a>, som Microsoft erbjuder helt gratis med ett vanligt Microsoft-konto — 15 prioriterade genereringar per dag utan kostnad, vilket gör det till det enda sättet att få DALL-E 3-kvalitet utan att betala. <a href="/ai-verktyg/leonardo-ai/">Leonardo AI</a> (Stable Diffusion-baserat, specialiserat mot koncept- och spelgrafik) ger 150 snabba tokens per dag gratis, men bilderna är publika på gratisplanen — Essential-nivån för 12 USD/mån med 8 500 tokens ger privata bilder. <a href="/ai-verktyg/playground-ai/">Playground AI</a> sticker ut med 500 bilder om dagen gratis utan vattenmärke, en av marknadens generösaste gratisnivåer, men med mer ojämn kvalitet mellan körningar än betalalternativen.</p>

<p><a href="/ai-verktyg/khroma-design/">Khroma</a> är ett smalare, helt gratis verktyg för färgpaletter — det lär sig vilka färger du gillar genom att du väljer bland förslag, och genererar sedan paletter som matchar din smak. Ingen inloggning krävs för grundfunktionen.</p>

<div data-block="compare">{"title":"Bildgenerering — gratis kontra betalt","cards":[{"title":"Helt gratis","text":"Ingen betalplan krävs för grundfunktionen.","rows":[{"label":"Bing Image Creator","value":"15 boosts/dag, DALL-E 3-kvalitet"},{"label":"Stable Diffusion","value":"Gratis lokalt, kräver egen GPU"},{"label":"Flux.1 Schnell","value":"Gratis, Apache 2.0, lokal körning"}]},{"title":"Generösa gratisnivåer","text":"Fungerande gratisplan, betala för mer.","rows":[{"label":"Playground AI","value":"500 bilder/dag, vattenmärkesfritt"},{"label":"Ideogram","value":"10 genereringar/dag"},{"label":"Leonardo AI","value":"150 tokens/dag, publika bilder"}]},{"title":"Betalt från start","text":"Begränsad eller ingen gratisnivå.","rows":[{"label":"Midjourney","value":"Se recension för aktuella priser"},{"label":"Adobe Firefly","value":"11,99 USD/mån (Standard)"},{"label":"Flux.1 Pro (API)","value":"~0,04 USD/bild"}]}]}</div>

<h2>4. Foto-efterbehandling</h2>

<p>Det här är steget de flesta listor hoppar över: vad gör du med en bild du redan har, inte en du genererar från grunden? Tre verktyg täcker nästan hela behovet.</p>

<p><a href="/ai-verktyg/removebg-bredig/">Remove.bg</a> är marknadsledande för automatisk bakgrundsborttagning — webb, desktop-app och API för den som behöver skala upp. Gratisnivån ger förhandsgranskning i låg kvalitet, HD-bilder kostar 0,20 USD styck eller via prenumeration från 9 USD/mån. Rätt verktyg för produktbilder och e-handel där bakgrunden ska bort snabbt och konsekvent.</p>

<p><a href="/ai-verktyg/topaz-photo-bredig/">Topaz Photo AI</a> är branschstandard för AI-driven uppskalning, brusreducering och skärpning — rätt verktyg när en bild är suddig, lågupplöst eller brusig och behöver räddas snarare än genereras om. Engångsköp på 199 USD inklusive ett års uppdateringar, därefter 99 USD/år.</p>

<p><a href="/ai-verktyg/luminar-neo-bredig/">Luminar Neo</a> går bredare: scendetektering, himmelbyte och AI-driven struktur-redigering för den som gör mer omfattande foto-efterbehandling än en enskild korrigering. Engångsköp 99 USD, Pro-nivå 119 USD/år, tillägg (Extensions) 299 USD.</p>

<h2>5. Rörlig bild för pitchen</h2>

<p>De flesta designers behöver inte en fullständig videoredigerare — bara något som gör en statisk mockup levande inför ett kundmöte. <a href="/ai-video/runway-gen-3/">Runway</a> täcker det: bild-till-video och korta AI-genererade klipp utan att du behöver lära dig ett eget videoredigeringsprogram. Se recensionen för aktuella priser.</p>

<h2>Vad du ska titta efter när du väljer</h2>

<h3>Kommersiell licensiering och upphovsrätt</h3>

<p>Det här är den enskilt viktigaste skillnaden mellan bildgenereringsverktygen och sällan den första frågan någon ställer. Adobe Firefly tränas på licensierat material och Adobes egen stockbild, och marknadsförs uttryckligen som kommersiellt säkert — avgörande om du levererar till en kund som frågar var bilden kommer ifrån. Modeller som Midjourney, Stable Diffusion och Flux har mer omdiskuterade träningsdata-ursprung. Läs leverantörens egna användarvillkor innan du använder genererat material i betalt kundarbete, inte bara prislistan.</p>

<h3>Teamfunktioner och delning</h3>

<p>Ett verktyg du använder ensam har andra krav än ett ett helt team ska dela. Figma AI och Webflow AI är byggda för kollaboration från grunden — delade bibliotek, kommentarer, versionshistorik. Verktyg som Midjourney och Stable Diffusion är i grunden enanvändarverktyg där delning sker manuellt, utanför själva produkten.</p>

<h3>Export och handoff till utveckling</h3>

<p>Om slutmålet är en byggd produkt, inte bara en bild, spelar exportformat roll. Figma AI och Google Stitch exporterar till Figma för vidare utveckling. Framer AI och Webflow AI hoppar över det steget helt — designen publiceras direkt som en fungerande sajt, vilket är en fördel om du är ensam men en black om ett separat utvecklingsteam ska bygga vidare på en specifik kodbas.</p>

<h3>Språkstöd för svensk text</h3>

<p>Textrendering i bilder (Ideogram, DALL-E 3) är tränad huvudsakligen på engelska. Svenska bokstäver — å, ä, ö — är fortfarande en vanlig felkälla även i de bästa verktygen. Kontrollera alltid specialtecken manuellt innan leverans, oavsett vad verktyget påstår sig klara.</p>

<h2>Gratis kontra betalt — vad räcker faktiskt?</h2>

<p>Åtta av verktygen ovan har en fungerande gratisnivå: Canva AI, Adobe Firefly (begränsat), Figma AI (Starter), Google Stitch (helt gratis), Uizard, Ideogram, Playground AI, Stable Diffusion/Flux.1 Schnell (lokalt) och Bing Image Creator. För de flesta enskilda designers och frilansare räcker kombinationen av dessa gratisnivåer i flera månader innan en betalplan blir nödvändig.</p>

<p>Det som faktiskt tvingar fram en uppgradering är sällan kvalitet — det är volym, kommersiell licensiering eller teamfunktioner. Testa alltid gratisnivån mot ett verkligt projekt i minst en vecka innan du tecknar ett abonnemang.</p>

<h2>Vanliga misstag</h2>

<h3>Att välja verktyg efter LinkedIn-trender, inte flaskhalsen</h3>

<p>Det vanligaste misstaget är att välja verktyg efter vad som trendar snarare än efter vilket steg i processen som faktiskt är flaskhalsen. Om du redan är snabb på att ta fram grafik men långsam på att gå från idé till godkänd UI, löser ett nytt bildgenereringsverktyg ingenting — då är det Figma AI eller Google Stitch som är rätt investering.</p>

<h3>Att betala innan gratisnivån testats</h3>

<p>Canva, Firefly, Figma, Stitch, Uizard, Ideogram, Playground AI och Bing Image Creator har alla en fungerande gratisplan. Testa den mot ett verkligt projekt i minst en vecka innan du tecknar ett abonnemang.</p>

<h3>Att ignorera licensvillkoren tills en kund frågar</h3>

<p>Kommersiell användning av AI-genererade bilder är inte juridiskt identisk mellan verktygen. Ta reda på licensvillkoren innan materialet går till en betalande kund, inte efter.</p>

<h3>Att köpa ett foto-efterbehandlingsverktyg för generering</h3>

<p>Remove.bg, Topaz Photo AI och Luminar Neo förbättrar bilder du redan har — de genererar inga nya. Blandar du ihop kategorierna köper du fel verktyg för jobbet.</p>

<h3>Att lita blint på text i genererade bilder</h3>

<p>Även Ideogram, som är bäst i klassen på text-rendering, gör fel ibland — särskilt på svenska specialtecken. Kontrollera alltid stavning manuellt före leverans.</p>

<h2>Så vet du om verktyget gör nytta</h2>

<p>Mät mot vad du faktiskt sparade, inte mot hur imponerande en enskild bild blev. Ta tiden på ett verkligt projekt — från brief till godkänt resultat — både med och utan verktyget, och jämför. Ett AI-verktyg som sparar en timme per vecka är värt sitt pris. Ett som ger dig fler varianter att välja mellan utan att korta ner själva arbetet är en kostnad förklädd till produktivitet.</p>

<p>Håll också koll på hur mycket efterarbete varje genererad bild eller skärm faktiskt kräver innan den är leveransklar. Ett verktyg som är snabbt att generera med men kräver mycket manuell efterredigering är inte nödvändigtvis snabbare totalt sett än ett långsammare verktyg med träffsäkrare förstaresultat.</p>

<h2>Vad du gör härnäst</h2>

<p>Bestäm vilket av de fem spåren ovan — grafisk design, UI/UX, bildgenerering, foto-efterbehandling eller rörlig bild — som är din faktiska flaskhals just nu, och börja i den gratisnivån. Behöver du bredare AI-verktyg utanför design specifikt, se vår <a href="/ai-verktyg/">kompletta översikt över AI-verktyg 2026</a>.</p>
`.trim();

const faq = [
  {
    question: 'Vilket AI-verktyg ska en designer börja med?',
    answer: 'Beror på vad flaskhalsen är. Behöver du snabb grafik, börja med Canva AIs gratisnivå. Är det UI-skärmar som tar tid, testa Google Stitch gratis innan du går vidare till Figma AI. Behöver du bildgenerering, testa Bing Image Creator eller Ideogram innan du betalar för något. Lägg inga pengar förrän du vet var du faktiskt fastnar.',
  },
  {
    question: 'Vad kostar AI-verktyg för designers?',
    answer: 'De flesta har en fungerande gratisnivå. Betalt börjar runt 9–12 USD/mån (Remove.bg-prenumeration, Canva Pro årsvis, Uizard Pro årsvis, Leonardo Essential) och går upp mot 24–60 USD/mån för Adobe Fireflys högre nivåer. Figma Professional ligger på 16 USD/mån per fullt säte. Google Stitch, Bing Image Creator och Flux.1 Schnell (lokalt) är helt gratis. Engångsköp (Topaz Photo AI, Luminar Neo, Looka) är ett alternativ till löpande prenumeration för den som bara behöver verktyget vid enstaka tillfällen. Priserna i artikeln kontrollerades i november 2026.',
  },
  {
    question: 'Är AI-genererade bilder okej att använda kommersiellt?',
    answer: 'Det beror på verktyget och licensen. Adobe Firefly är tränat på licensierat material och marknadsförs specifikt som kommersiellt säkert. Midjourney, Stable Diffusion, Flux och andra generella bildmodeller har mer omdiskuterade licensvillkor — läs leverantörens egna användarvillkor innan du använder genererat material i betalt kundarbete.',
  },
  {
    question: 'Vad hände med Galileo AI?',
    answer: 'Google köpte Galileo AI i maj 2025 och relanserade samma dag som Google Stitch, nu gratis via Google Labs istället för en betald fristående produkt. Funktionerna är i grunden desamma: text- eller skiss-till-UI med export till Figma.',
  },
  {
    question: 'Vilket verktyg är bäst på text i bilder, till exempel logotyper och affischer?',
    answer: 'Ideogram är enligt vår recension det verktyg som konsekvent renderar text mest korrekt — flerordsfraser, specialtecken och varumärkesnamn — och slår Midjourney, Stable Diffusion och Adobe Firefly i direkta jämförelser. Kontrollera alltid svenska specialtecken (å, ä, ö) manuellt innan leverans, oavsett verktyg.',
  },
  {
    question: 'Finns det helt gratis alternativ till Midjourney och DALL-E 3?',
    answer: 'Ja. Bing Image Creator ger samma modell som DALL-E 3 helt gratis med ett Microsoft-konto (15 prioriterade genereringar/dag). Stable Diffusion och Flux.1 Schnell är gratis att köra lokalt om du har en kraftfull GPU, och Playground AI ger 500 bilder/dag gratis utan vattenmärke, om än med mer ojämn kvalitet än betalalternativen.',
  },
];

async function main() {
  const { error } = await db
    .from('articles')
    .update({ content_mdx: content, faq, content_updated_at: new Date().toISOString() })
    .eq('slug', 'basta-ai-verktyg-for-designers-2026');
  if (error) { console.error('update failed:', error.message); process.exit(1); }

  const { data, error: readErr } = await db
    .from('articles')
    .select('content_mdx, faq')
    .eq('slug', 'basta-ai-verktyg-for-designers-2026')
    .maybeSingle();
  if (readErr) { console.error(readErr.message); process.exit(1); }
  const len = (data?.content_mdx ?? '').length;
  const h2 = ((data?.content_mdx ?? '').match(/<h2/g) ?? []).length;
  const faqCount = Array.isArray(data?.faq) ? data.faq.length : 0;
  console.log(`✓ Uppdaterad. content_mdx: ${len} tecken, ${h2} st <h2>, ${faqCount} FAQ-poster.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
