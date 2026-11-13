/**
 * 10 nya recensionssidor för foto/bildredigering-hubben
 * (/ai-verktyg/foto-bildredigering): Topaz Photo AI, Remini, Let's Enhance,
 * VanceAI, Fotor, Picsart, Luminar Neo, Magnific, Pixlr, Cutout.pro.
 * parent_slug='foto-bildredigering' (syntetisk — matchar ingen riktig hub
 * via auto-parent_slug-query; hubben listar dessa via CURATED_HUB_TOOL_SLUGS
 * i lib/route-kind.ts). Fakta verifierade mot leverantörernas egna
 * sajter/pricing-sidor 2026-11-13. published_at=null — väntar på
 * granskning + bild.
 *
 *   npx tsx scripts/seed-foto-bildredigering-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PARENT_SLUG = 'foto-bildredigering';

type ReviewRow = { slug: string; title: string; content_mdx: string };

const reviews: ReviewRow[] = [
  {
    slug: 'topaz-photo-ai',
    title: 'Topaz Photo AI',
    content_mdx: `<p><strong>Betyg: 8.7/10</strong></p>
<h2>Topaz Photo AI recension 2026 — branschens starkaste skärpning och uppskalning</h2>

<p>Topaz Photo AI från Topaz Labs är en skrivbordsapp som ofta nämns som referenspunkt när fotografer diskuterar AI-skärpning och uppskalning. Till skillnad från de flesta konkurrenter i den här guiden körs den lokalt på din dator, antingen som fristående app eller som plugin i Lightroom, Photoshop, Capture One och flera andra redigeringsprogram.</p>

<h2>Vad är Topaz Photo AI?</h2>
<p>Topaz Photo AI samlar flera AI-drivna förbättringsverktyg i en app: brusreducering, skärpning (inklusive korrigering av missat fokus), uppskalning med flera olika modeller, ansiktsåterställning, ljus- och färgjustering samt objekt-/damm-/repborttagning. Bearbetningen sker lokalt, så bilderna behöver inte lämna datorn.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Denoise, Sharpen, Upscale:</strong> Tre kärnverktyg för brus, skärpa och förstoring, med flera uppskalningsmodeller (Wonder, Standard Max med flera).</li>
<li><strong>Recover Faces:</strong> Återställer detaljer i ansikten på suddiga eller lågupplösta foton.</li>
<li><strong>Remove, Healing Brush, Dust and Scratch:</strong> Tar bort objekt, repor och dammfläckar.</li>
<li><strong>Plugin-stöd:</strong> Fungerar direkt i Lightroom Classic, Photoshop, Capture One, Apple Photos och Affinity.</li>
<li><strong>Lokal och molnbaserad rendering:</strong> Välj om bearbetningen ska ske på din egen dator eller i molnet.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Topaz Photo AI levererar genuint branschledande resultat på skärpning, brusreducering och uppskalning — det är själva anledningen till att verktyget ofta nämns först i jämförelser. Att kunna använda det som plugin direkt i Lightroom eller Photoshop gör det till ett naturligt tillägg för den som redan har ett etablerat redigeringsflöde, snarare än ett helt nytt verktyg att lära sig. Svagheten är att det enbart finns som skrivbordsapp för Mac och Windows — ingen webb- eller mobilversion — och att det är ett rent abonnemang, inte ett engångsköp.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket hög kvalitet på skärpning, brusreducering och uppskalning — ofta branschens referens.</li>
<li><strong>Fördel:</strong> Fungerar som plugin i flera etablerade redigeringsprogram.</li>
<li><strong>Fördel:</strong> Lokal bearbetning möjlig — bilderna behöver inte lämna datorn.</li>
<li><strong>Nackdel:</strong> Enbart skrivbordsapp — ingen webb- eller mobilversion.</li>
<li><strong>Nackdel:</strong> Rent abonnemang; sidans prissektion och strukturerade prisdata skiljer sig åt, så kolla aktuellt pris innan köp.</li>
</ul>

<h2>Pris och planer</h2>
<p>Topaz Photo Personal kostar från 199 USD/år (eller 39 USD/mån utan årsbindning). Topaz Photo Pro kostar från 599 USD/år. Topaz Studio, som buntar ihop flera Topaz-appar, kostar från 499 USD/år. Observera att sidans synliga priser och dess strukturerade FAQ-data visade olika belopp vid vår genomgång — kontrollera aktuellt pris direkt på topazlabs.com innan köp.</p>

<h2>För vem passar Topaz Photo AI?</h2>
<p>Topaz Photo AI passar bäst för fotografer och bildredigerare som redan arbetar i Lightroom eller Photoshop och vill ha det starkaste tillgängliga resultatet på skärpning och uppskalning, samt för den som föredrar lokal bearbetning framför molnbaserade webbtjänster.</p>

<h2>Vårt omdöme</h2>
<p>Topaz Photo AI är ett av de mest kompetenta verktygen i kategorin rent tekniskt, med ett resultat som håller måttet för professionellt bruk. Avsaknaden av webb-/mobilstöd och den ogenomskinliga prissättningen drar ner helhetsintrycket något. Med 8,7 av 10 är det ett av toppvalen för fotografer som vill ha branschens starkaste skärpning och uppskalning lokalt.</p>`,
  },
  {
    slug: 'remini',
    title: 'Remini',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>Remini recension 2026 — mobilappen som gör gamla foton skarpa igen</h2>

<p>Remini är en mobilapp och webbtjänst som blivit viral flera år i rad för sin förmåga att skärpa upp gamla, suddiga eller lågupplösta foton med några få klick. Till skillnad från skrivbordsverktyg som Topaz Photo AI är Remini byggt för att vara så enkelt som möjligt — öppna appen, välj ett foto, få ett skarpare resultat.</p>

<h2>Vad är Remini?</h2>
<p>Remini är en AI-driven foto- och videoförbättrare som specialiserar sig på att skärpa suddiga bilder, reducera brus, restaurera gamla eller skadade foton och förbättra ansiktsdetaljer. Appen har också blivit känd för att generera stiliserade AI-porträtt från selfies, en funktion som bidragit starkt till dess virala spridning på sociala medier.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Foto- och videoförbättring:</strong> Skärper, reducerar brus och återställer detaljer i stillbilder och video.</li>
<li><strong>Fotorestaurering:</strong> Specialiserat på gamla, skadade eller skannade foton.</li>
<li><strong>AI-porträtt:</strong> Genererar stiliserade porträttbilder utifrån selfies.</li>
<li><strong>Mobil-först:</strong> Byggt primärt för iOS och Android, med webbversion som komplement.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Reminis styrka är tillgänglighet snarare än teknisk toppklass — det är ett av de enklaste sätten att rädda ett gammalt familjefoto direkt i mobilen, utan att behöva lära sig ett redigeringsprogram. Resultatet håller god kvalitet för det ändamålet, även om det inte riktigt når samma nivå som dedikerade skrivbordsverktyg på mycket krävande bilder. Prissättningen är den tydligaste svagheten: oberoende källor beskriver en dynamisk, personanpassad modell utan fast prislista, och de konkreta beloppen skiljer sig åt mellan olika granskningar.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Extremt enkel att använda direkt i mobilen, inget redigeringsprogram krävs.</li>
<li><strong>Fördel:</strong> Bra på att rädda gamla, suddiga eller lågupplösta familjefoton.</li>
<li><strong>Fördel:</strong> Gratisnivå finns att testa innan eventuellt köp.</li>
<li><strong>Nackdel:</strong> Dynamisk, personanpassad prissättning utan fast, offentlig prislista enligt oberoende källor.</li>
<li><strong>Nackdel:</strong> Gratisnivån visar annonser och lägger på en vattenstämpel.</li>
</ul>

<h2>Pris och planer</h2>
<p>Remini har en gratisnivå med ett begränsat antal förbättringar per dag, annonser och vattenstämpel på resultatet. Betalda nivåer (Personal, Business) prissätts enligt flera oberoende källor dynamiskt och personanpassat snarare än med en fast lista — rapporterade belopp ligger ungefär mellan 6,99 och 9,99 USD/vecka, men siffrorna varierar mellan källor och bör kontrolleras i appen innan köp.</p>

<h2>För vem passar Remini?</h2>
<p>Remini passar bäst för privatpersoner som snabbt vill skärpa upp ett gammalt eller suddigt mobilfoto, eller skapa ett stiliserat AI-porträtt, utan att investera i en skrivbordsapp eller lära sig ett redigeringsprogram.</p>

<h2>Vårt omdöme</h2>
<p>Remini är ett av de mest lättillgängliga verktygen i kategorin och gör precis det det lovar för vardagsbruk: rädda ett gammalt eller suddigt foto på några sekunder. Den otydliga prissättningen och reklamen på gratisnivån drar ner helhetsbetyget. Med 7,8 av 10 är Remini ett bra förstahandsval för den som bara vill ha en snabb mobillösning, mindre självklart för den som behöver konsekvent, förutsägbar kostnad.</p>`,
  },
  {
    slug: 'lets-enhance',
    title: "Let's Enhance",
    content_mdx: `<p><strong>Betyg: 8.2/10</strong></p>
<h2>Let's Enhance recension 2026 — webbaserad uppskalning med öppen prissättning</h2>

<p>Let's Enhance är ett webbaserat AI-verktyg som fokuserar på att skärpa, skala upp och restaurera foton — utan att kräva en skrivbordsinstallation. Verktyget sticker ut genom att redovisa sin kreditprissättning betydligt tydligare än många konkurrenter i kategorin, och erbjuder dessutom ett eget API för utvecklare.</p>

<h2>Vad är Let's Enhance?</h2>
<p>Let's Enhance samlar fyra kärnverktyg: Enhancer (allmän kvalitetsförbättring och färgfix), Upscaler (uppskalning upp till 512 megapixel), Restorer (reparerar skadade eller skannade foton) samt Sharpener/Denoiser för fokus och brus. Två redigeringslägen finns: Prime (standard) och Gentle, som bevarar fin text och detaljer bättre. Upp till 20 bilder kan batch-redigeras samtidigt.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Upscaler upp till 512 MP:</strong> En av de kraftigaste uppskalningsgränserna i kategorin.</li>
<li><strong>Restorer:</strong> Riktat specifikt mot skadade eller gamla skannade foton.</li>
<li><strong>Batch-redigering:</strong> Upp till 20 bilder samtidigt.</li>
<li><strong>Enhancer- och Upscaler-API:</strong> För utvecklare som vill bygga in funktionen i egna produkter.</li>
<li><strong>Gentle-läge:</strong> Bevarar fin text och smådetaljer bättre än standardläget.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Let's Enhance håller en hög kvalitetsnivå på uppskalning specifikt, och den öppet redovisade kreditprissättningen gör det ovanligt enkelt att räkna ut vad en given mängd bilder faktiskt kommer att kosta — ett tydligt plus jämfört med flera konkurrenter som gömmer priserna bakom kontoskapande. Gratisnivån är dock snäv: 10 krediter vid registrering, utan löpande gratiskvot, vilket gör det svårt att testa verktyget över tid utan att betala.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Skalar upp till hela 512 megapixel på de högsta nivåerna.</li>
<li><strong>Fördel:</strong> Tydlig, öppet redovisad kreditprissättning.</li>
<li><strong>Fördel:</strong> API tillgängligt för utvecklare.</li>
<li><strong>Nackdel:</strong> Gratisnivån ger bara 10 krediter vid registrering, ingen löpande gratiskvot.</li>
<li><strong>Nackdel:</strong> Vattenstämpel på resultat från gratisnivån.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratis: 10 krediter vid registrering (upp till 24 MP indata, uppskalning upp till 8 MP, vattenstämpel). Starter 9 USD/mån vid årsbetalning (100 krediter/mån, uppskalning upp till 256 MP). Pro 24 USD/mån vid årsbetalning (300 krediter, upp till 350 MP). Max 34 USD/mån vid årsbetalning (500 krediter, upp till 512 MP). Business-nivåer med 1 000–5 000 krediter finns men prissätts inte öppet på sidan.</p>

<h2>För vem passar Let's Enhance?</h2>
<p>Let's Enhance passar bäst för den som behöver kraftig, tillförlitlig uppskalning för print eller storformat och värdesätter att veta exakt vad kostnaden blir i förväg, samt utvecklare som vill bygga in bildförbättring via API.</p>

<h2>Vårt omdöme</h2>
<p>Let's Enhance är ett av de mest transparent prissatta och tekniskt kompetenta verktygen för uppskalning i kategorin. Den snäva gratisnivån är den tydligaste begränsningen för löpande, icke-betalande bruk. Med 8,2 av 10 är det ett av de säkraste korten för den som specifikt behöver kraftig, pålitlig uppskalning.</p>`,
  },
  {
    slug: 'vanceai',
    title: 'VanceAI',
    content_mdx: `<p><strong>Betyg: 7.9/10</strong></p>
<h2>VanceAI recension 2026 — bred svit för foto- och videoförbättring</h2>

<p>VanceAI samlar ett ovanligt brett utbud av foto- och videoförbättringsverktyg i en och samma plattform: uppskalning, brusreducering, kolorisering, bakgrundsborttagning och mer därtill. Verktyget finns både som webbtjänst och skrivbordsapp, med en livstidslicens som alternativ till det löpande abonnemanget.</p>

<h2>Vad är VanceAI?</h2>
<p>VanceAI erbjuder separata "studios" för bild och video. På bildsidan ingår uppskalning (upp till 40x enligt leverantören), skärpning, brusreducering, allmän förbättring, restaurering, kolorisering, bakgrundsborttagning, cartoonisering, foto-till-skiss och passfotoförberedelse. På videosidan finns uppskalning, SDR-till-HDR-konvertering, kolorisering och AI-undertextning.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bred verktygslåda:</strong> Uppskalning, brus, kolorisering och bakgrundsborttagning i samma plattform.</li>
<li><strong>Webb- och skrivbordsapp:</strong> Välj mellan molnbaserad bearbetning eller lokal körning utan kreditförbrukning.</li>
<li><strong>Video-funktioner:</strong> Uppskalning, HDR-konvertering och AI-undertextning utöver stillbilder.</li>
<li><strong>API och ComfyUI-nod:</strong> För utvecklare och avancerade arbetsflöden.</li>
<li><strong>Livstidslicens för skrivbordsappen:</strong> Engångsbetalning som alternativ till löpande abonnemang.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>VanceAI:s största styrka är bredden — få konkurrenter täcker lika många förbättringstyper för både bild och video i samma verktyg. Skrivbordsappens livstidsplan är också ovanlig i kategorin, där de flesta konkurrenter enbart erbjuder abonnemang. Nackdelen är att webbplanerna är kreditbaserade och kan bli dyra vid tung, regelbunden användning, och att det saknas en riktig gratisnivå utöver en engångstestomgång på 10 krediter.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket bred funktionslista — bild och video i samma plattform.</li>
<li><strong>Fördel:</strong> Skrivbordsplan med obegränsad lokal bearbetning, ingen kreditförbrukning.</li>
<li><strong>Fördel:</strong> Livstidslicens för skrivbordsappen (engångskostnad) utöver abonnemang.</li>
<li><strong>Nackdel:</strong> Webbplanerna är kreditbaserade och kan bli dyra vid tung användning.</li>
<li><strong>Nackdel:</strong> Ingen löpande gratisnivå, bara en engångstestomgång på 10 krediter.</li>
</ul>

<h2>Pris och planer</h2>
<p>Webbplaner: Starter 15 USD/mån (260 krediter inkl. bonus), Popular 30 USD/mån (650 krediter), Creator 45 USD/mån (1 300 krediter), Studio 75 USD/mån (2 600 krediter) — samtliga vid årsbetalning. Skrivbordsapp: 39,90 USD/mån, 99,90 USD/år, eller 129,90 USD som engångsköp (livstid, rabatterat från 199,90 USD vid vår genomgång). Enterprise-priser ges på förfrågan.</p>

<h2>För vem passar VanceAI?</h2>
<p>VanceAI passar bäst för den som vill ha bild- och videoförbättring samlat i ett verktyg, och särskilt för den som föredrar att äga en skrivbordslicens permanent istället för att betala ett löpande abonnemang.</p>

<h2>Vårt omdöme</h2>
<p>VanceAI levererar genuin bredd och flexibilitet mellan moln och lokal bearbetning, med en ovanlig livstidsoption för skrivbordsappen. Den kreditbaserade webbprissättningen gör kostnaden svårare att förutse vid tung användning. Med 7,9 av 10 är VanceAI ett solitt val för den som vill ha många förbättringstyper i samma verktyg snarare än ett smalt specialistverktyg.</p>`,
  },
  {
    slug: 'fotor',
    title: 'Fotor',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>Fotor recension 2026 — allt-i-ett foto och design med AI</h2>

<p>Fotor är ett brett foto- och designverktyg som kombinerar klassisk fotoredigering med AI-funktioner för uppskalning, retuschering, bakgrundsbyte och stilöverföring, samt enklare grafisk design. Jämfört med de mer nischade verktygen i den här guiden är Fotor mer av en allt-i-ett-plattform.</p>

<h2>Vad är Fotor?</h2>
<p>Fotor erbjuder AI-driven bildförbättring (uppskalning upp till 4x, avsuddning, skärpning, restaurering, kolorisering och färgkorrigering), borttagning/ersättning av bakgrund, objekt, vattenstämplar och text, stilöverföring (anime, tecknat, akvarell, med flera), samt AI-bildgenerering och enklare designverktyg som mallar, kollage och logotypskapare.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bred förbättringslåda:</strong> Uppskalning, avsuddning, restaurering och kolorisering i samma verktyg.</li>
<li><strong>Bakgrunds- och objektborttagning:</strong> Inklusive batch-redigering på de högre nivåerna.</li>
<li><strong>Stilfilter:</strong> Konvertering till anime, tecknat, akvarell och fler stilar.</li>
<li><strong>AI-bildgenerering:</strong> Text-till-bild utöver ren fotoredigering.</li>
<li><strong>Designverktyg:</strong> Mallar, kollage, logotyp- och affischskapare.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Fotors styrka är bredden — det är ett av få verktyg i den här guiden som kombinerar fotoförbättring med enklare grafisk design, vilket gör det praktiskt för den som vill slippa växla mellan flera appar. Just för ren fotoförbättring är kvaliteten god men inte branschledande på samma nivå som specialister som Topaz Photo AI. Prissidan visade inte konkreta belopp för de betalda nivåerna vid vår genomgång (platshållartext istället för siffror), vilket gör det svårare att jämföra kostnaden mot konkurrenter utan att själv öppna sidan och välja faktureringsperiod.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Gratisnivå finns att testa utan kostnad.</li>
<li><strong>Fördel:</strong> Kombinerar fotoförbättring med stilfilter, kollage och enklare designmallar.</li>
<li><strong>Fördel:</strong> Brett utbud av AI-genereringsmodeller utöver ren fotoredigering.</li>
<li><strong>Nackdel:</strong> Exakta priser för betalda nivåer visades inte i sidans statiska innehåll vid vår genomgång.</li>
<li><strong>Nackdel:</strong> Så bred funktionslista att ren fotoförbättring kan kännas undanskymd bland design- och genereringsverktygen.</li>
</ul>

<h2>Pris och planer</h2>
<p>Fotor har en gratisnivå ("Basic") med begränsade krediter. Betalda nivåer (Pro, Pro+, Max) faktureras årsvis med stigande antal samtidiga genereringar, AI-chattar och molnlagring (upp till 500 GB på Max) — men sidans synliga priser visade inga konkreta belopp vid vår genomgång. Kontrollera aktuellt pris direkt på fotor.com.</p>

<h2>För vem passar Fotor?</h2>
<p>Fotor passar bäst för den som vill ha fotoförbättring och enklare grafisk design samlat på ett ställe, snarare än den som enbart söker det mest specialiserade fotoförbättringsverktyget.</p>

<h2>Vårt omdöme</h2>
<p>Fotor är ett brett och tillgängligt verktyg som täcker mer än bara fotoförbättring, med en gratisnivå som sänker tröskeln. Den otydliga prissättningen och den breda, lite spretiga positioneringen drar ner helhetsbetyget något. Med 7,8 av 10 är Fotor ett rimligt val för den som vill ha flera verktyg i ett, mindre självklart för den som bara vill ha den starkaste rena fotoförbättringen.</p>`,
  },
  {
    slug: 'picsart',
    title: 'Picsart',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Picsart recension 2026 — den etablerade mobilappen för fotoredigering</h2>

<p>Picsart är en av de mest spridda foto- och designapparna, med lång historik och ett stort community-bibliotek av mallar och tillgångar. AI-funktionerna för bakgrunds- och objektborttagning samt bildgenerering har byggts på ovanpå den etablerade redigeraren.</p>

<h2>Vad är Picsart?</h2>
<p>Picsart är primärt en mobilapp (med webbversion) för fotoredigering, kollage och enklare grafisk design. AI-funktionerna omfattar bakgrunds- och objektborttagning, ett "one-tap"-bildförbättringsverktyg, samt tillgång till flera AI-bildgenereringsmodeller (bland annat Nano Banana Pro, Flux 3 Image, Ideogram 4.5 och GPT Image 2.5) för den som vill gå bortom ren redigering.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bakgrunds- och objektborttagning:</strong> Kärnfunktioner med god kvalitet även på gratisnivån.</li>
<li><strong>One-tap-förbättring:</strong> Automatisk bildförbättring med ett klick.</li>
<li><strong>Precisionsredigering:</strong> Ideogram 4.5 Precise Edit ändrar en del av bilden medan resten lämnas orörd.</li>
<li><strong>Batch-redigering:</strong> Upp till 100 bilder samtidigt på de högre nivåerna.</li>
<li><strong>Stockbibliotek och mallar:</strong> Stora samlingar av bilder, typsnitt och klistermärken.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Picsarts styrka är mognad och tillgänglighet — det är en inarbetad app med ett stort community-ekosystem av mallar och tillgångar, och bakgrunds-/objektborttagningen håller god kvalitet för att vara en gratisfunktion. Svagheten enligt flera oberoende recensioner är att gratisnivån är reklamtung och begränsad (olika källor anger olika exakta kreditantal, vilket gör det svårt att veta exakt vad man får utan att testa själv), och att de officiella priserna anges i euro snarare än i kronor eller dollar, vilket gör internationella jämförelser otydligare.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket använd och inarbetad app med stort community-utbud av mallar och tillgångar.</li>
<li><strong>Fördel:</strong> God kvalitet på bakgrunds- och objektborttagning redan på gratisnivån.</li>
<li><strong>Fördel:</strong> Bulk-redigering av upp till 100 bilder på de högre nivåerna.</li>
<li><strong>Nackdel:</strong> Enligt oberoende källor visar gratisnivån annonser och vattenstämplar resultatet; exakta kreditgränser skiljer sig mellan källor.</li>
<li><strong>Nackdel:</strong> Officiella priser anges i EUR, inte USD eller SEK.</li>
</ul>

<h2>Pris och planer</h2>
<p>Enligt Picsarts officiella prissida: Pro från ca 9,16 EUR/mån vid årsbetalning (100 GB lagring, bulk-redigering upp till 50 bilder), Ultra från ca 52,5 EUR/mån vid årsbetalning (300 GB lagring/säte, bulk-redigering upp till 100 bilder, team-säten). Flera oberoende recensioner beskriver även en gratisnivå med annonser och begränsade AI-krediter, men exakta gränser skiljer sig mellan källorna — kontrollera i appen för aktuella villkor.</p>

<h2>För vem passar Picsart?</h2>
<p>Picsart passar bäst för den som redigerar foton mest i mobilen och vill ha ett brett, väletablerat verktyg med stort community-utbud, snarare än den som behöver den mest specialiserade bildkvaliteten.</p>

<h2>Vårt omdöme</h2>
<p>Picsart är en mogen, väletablerad app som levererar solid bakgrunds- och objektborttagning samt ett brett designbibliotek. Den reklamtunga gratisnivån och den otydliga, euro-baserade prissättningen drar ner helhetsbetyget. Med 7,6 av 10 är Picsart ett rimligt val för mobilanvändare, mindre självklart för den som vill ha den mest förutsägbara prissättningen.</p>`,
  },
  {
    slug: 'luminar-neo',
    title: 'Luminar Neo',
    content_mdx: `<p><strong>Betyg: 8.0/10</strong></p>
<h2>Luminar Neo recension 2026 — skrivbordsapp med engångsköp och kreativa AI-verktyg</h2>

<p>Luminar Neo från Skylum sticker ut i kategorin genom sin affärsmodell: ett engångsköp följt av en betydligt billigare årlig förnyelse, snarare än ett rent löpande abonnemang. Verktyget kombinerar klassisk fotoförbättring med mer kreativa AI-funktioner som himmelbyte och objektborttagning.</p>

<h2>Vad är Luminar Neo?</h2>
<p>Luminar Neo är en skrivbordsapp (Mac/Windows) för fotoredigering med AI-drivna verktyg för restaurering av gamla foton, objektborttagning och -ersättning (GenErase, GenSwap), utvidgning av bildkanter (GenExpand), himmelbyte (Sky AI), dimensionell ljussättning baserat på avstånd (Light Depth), bakgrundsborttagning samt klassisk skärpning, brusreducering och uppskalning.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>GenErase / GenSwap:</strong> Tar bort eller ersätter objekt och distraktioner i en bild.</li>
<li><strong>GenExpand:</strong> Utvidgar en bilds kanter bortom originalets ramar.</li>
<li><strong>Sky AI:</strong> Byter eller förbättrar himlen i landskapsbilder.</li>
<li><strong>Light Depth:</strong> Lägger till dimensionell ljussättning baserat på avstånd från kameran.</li>
<li><strong>Porträttverktyg:</strong> Hudutjämning och bakgrundsoskärpa för porträttfoton.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Luminar Neos tydligaste fördel är ägandemodellen: ett engångsköp med betydligt lägre årlig förnyelsekostnad därefter, snarare än ett löpande abonnemang som aldrig tar slut. De kreativa AI-verktygen (himmelbyte, GenErase, GenExpand) ger också mer kreativ frihet än rena förbättringsverktyg. Den stora begränsningen är att AI-verktygen och bildbiblioteket efter det första året kräver en separat Luminar Prime-prenumeration för fortsatt tillgång — "engångsköpet" täcker alltså inte AI-funktionerna på obestämd tid.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Engångsköp med betydligt billigare årlig förnyelse, inte ett rent löpande abonnemang.</li>
<li><strong>Fördel:</strong> Kreativa AI-verktyg (himmelbyte, GenErase, GenExpand) utöver ren förbättring.</li>
<li><strong>Fördel:</strong> 30 dagars pengarna-tillbaka-garanti.</li>
<li><strong>Nackdel:</strong> Efter år ett krävs en Luminar Prime-prenumeration för fortsatt AI-tillgång.</li>
<li><strong>Nackdel:</strong> Endast skrivbordsapp — ingen fullständig webb- eller mobilversion.</li>
</ul>

<h2>Pris och planer</h2>
<p>Luminar Neo säljs som engångsköp i tre nivåer (Desktop Only, All Platforms, Max), med priser som varierar kraftigt med kampanjer — vid vår genomgång, under en Black Friday-kampanj, låg priserna från cirka 1 099 SEK (ord. ca 4 197 SEK), med årlig förnyelse därefter från cirka 499 SEK/år. Kampanjpriser av den här typen är vanliga hos Skylum, så kontrollera aktuellt pris på skylum.com innan köp.</p>

<h2>För vem passar Luminar Neo?</h2>
<p>Luminar Neo passar bäst för fotografer som ogillar löpande abonnemang och hellre äger sin programvara, samt för landskaps- och porträttfotografer som vill ha kreativa AI-verktyg som himmelbyte utöver ren bildförbättring.</p>

<h2>Vårt omdöme</h2>
<p>Luminar Neo erbjuder en välkommen variation på prismodellen i en kategori dominerad av abonnemang, kombinerat med genuint kreativa AI-funktioner. Att AI-tillgången efter år ett kräver en ny prenumeration nyanserar löftet om ett "engångsköp". Med 8,0 av 10 är Luminar Neo ett starkt alternativ för den som vill äga sin programvara och få kreativa verktyg utöver ren förbättring.</p>`,
  },
  {
    slug: 'magnific-ai',
    title: 'Magnific',
    content_mdx: `<p><strong>Betyg: 8.1/10</strong></p>
<h2>Magnific recension 2026 — kreativ AI-uppskalning, numera del av Freepik</h2>

<p>Magnific (tidigare marknadsfört separat som "Magnific AI") är känt för en särskild typ av uppskalning: istället för att bara göra en bild skarpare lägger verktyget aktivt till nya, trovärdiga detaljer vid förstoring. I april 2026 bytte moderbolaget Freepik namn till Magnific och slog ihop sin bredare plattform (bildgenerering, stockbibliotek, redigering) under samma varumärke.</p>

<h2>Vad är Magnific?</h2>
<p>Magnific är en AI-uppskalare som vid förstoring inte bara skärper upp befintliga pixlar utan genererar ny, visuellt trovärdig detalj — hår, textur, mönster — baserat på vad modellen bedömer borde finnas där. Efter namnbytet från Freepik till Magnific i april 2026 ingår uppskalningen i en bredare plattform som även omfattar bildgenerering och stockbibliotek.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Kreativ uppskalning:</strong> Lägger till ny, realistisk detalj snarare än att bara skärpa befintliga pixlar.</li>
<li><strong>Flera uppskalningslägen:</strong> Olika kombinationer av detaljnivå och upplösning, med kreditkostnad som ökar kraftigt vid högre upplösningar.</li>
<li><strong>Integrerad plattform:</strong> Del av Freepiks (nu Magnifics) bredare verktyg för generering, stock och redigering.</li>
<li><strong>API:</strong> Tillgång till uppskalning programmatiskt, enligt tredjepartskällor till cirka 0,08 USD per 2K-uppskalning.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Magnifics uppskalning är genuint distinkt från konkurrenternas — resultatet blir ofta mer detaljrikt och "levande" snarare än bara skarpare, vilket passar bra för konstnärliga eller kreativa bilder. Det är samtidigt en svaghet om målet är en neutral, trogen förstoring av originalet: de tillagda detaljerna är delvis AI-genererade, inte bevarade från källbilden. Namnbytet från Freepik till Magnific i april 2026 har också skapat viss förvirring kring priser och produktstruktur, och oberoende källor ger sinsemellan olika belopp.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Känt för att lägga till övertygande, realistisk detalj vid kraftig uppskalning.</li>
<li><strong>Fördel:</strong> Numera integrerat i en bredare plattform för generering och redigering.</li>
<li><strong>Nackdel:</strong> Ingen permanent gratisnivå.</li>
<li><strong>Nackdel:</strong> Priser i rörelse efter namnbytet från Freepik till Magnific; oberoende källor anger sinsemellan olika belopp.</li>
<li><strong>Nackdel:</strong> Kreditkostnaden per bild stiger kraftigt vid de högsta upplösningarna.</li>
</ul>

<h2>Pris och planer</h2>
<p>Ingen permanent gratisnivå. Enligt oberoende källor (siffrorna skiljer sig åt mellan dem) ligger lägsta betalda nivån på ungefär 14,50–20 USD/mån vid årsbetalning, en mellannivå (Premium+) på ungefär 33,75 USD/mån, och en Pro-nivå betydligt högre därutöver. Kreditkostnaden per uppskalning varierar kraftigt beroende på vald upplösning och detaljnivå. Kontrollera aktuellt pris direkt på magnific.com.</p>

<h2>För vem passar Magnific?</h2>
<p>Magnific passar bäst för kreatörer och designers som vill ha en distinkt, detaljrik uppskalning för konstnärliga eller marknadsföringsbilder, snarare än den som behöver en strikt neutral, trogen förstoring av ett originalfoto.</p>

<h2>Vårt omdöme</h2>
<p>Magnific levererar en tydligt differentierad, kreativ typ av uppskalning som skiljer sig från de flesta konkurrenter i kategorin. Avsaknaden av gratisnivå och den rörliga prissättningen efter namnbytet från Freepik drar ner helhetsbetyget något. Med 8,1 av 10 är Magnific ett starkt val specifikt för kreativ, detaljrik uppskalning.</p>`,
  },
  {
    slug: 'pixlr',
    title: 'Pixlr',
    content_mdx: `<p><strong>Betyg: 7.9/10</strong></p>
<h2>Pixlr recension 2026 — gratis webbredigerare med AI som tillval</h2>

<p>Pixlr är en av de äldre, mest etablerade gratis webbfotoredigerarna, och sticker ut i den här guiden genom att kärnredigeraren fortfarande är helt gratis och kräver inget konto. AI-funktioner som uppskalning, bakgrunds- och objektborttagning ligger bakom en kreditbaserad premiumnivå.</p>

<h2>Vad är Pixlr?</h2>
<p>Pixlr erbjuder två redigerarlägen direkt i webbläsaren: Pixlr X, ett enklare gränssnitt för snabba redigeringar, och Pixlr E, ett mer avancerat läge byggt för att likna Photoshop. AI-funktionerna omfattar en bildgenerator, textbaserad "Instruct Editor", generativ ifyllnad, uppskalning, "super sharp", brusreducering, hudförbättring, bakgrunds- och objektborttagning, bildförlängning samt kolorisering och ansiktsbyte.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Två editorlägen:</strong> Pixlr X (enkelt) och Pixlr E (Photoshop-liknande, avancerat).</li>
<li><strong>Ingen registrering krävs:</strong> Grundredigeraren går att använda direkt, utan konto.</li>
<li><strong>AI-uppskalning och skärpning:</strong> "Super sharp" och bilduppskalning som betalda tillval.</li>
<li><strong>Bakgrunds- och objektborttagning:</strong> AI-drivna verktyg för att ta bort eller ersätta delar av en bild.</li>
<li><strong>Instruct Editor:</strong> Textbaserade redigeringsinstruktioner istället för manuella verktyg.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Pixlrs stora fördel är tillgängligheten: grundredigeraren är genuint gratis och går att öppna direkt utan konto, vilket gör den till ett snabbt förstahandsval för en enstaka redigering. AI-funktionerna håller god, om än inte branschledande, kvalitet och är prissatta med en låg instegströskel (Plus-nivån kostar under 3 EUR/mån). Begränsningen är att gratisnivån enligt flera källor har annonser och ett begränsat antal sparningar per dag, och att AI-krediterna kan ta slut snabbt vid regelbunden användning.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Grundredigeraren är helt gratis och kräver inget konto.</li>
<li><strong>Fördel:</strong> Två editorlägen täcker både enkla och mer avancerade behov.</li>
<li><strong>Fördel:</strong> Låg instegströskel för AI-funktioner jämfört med flera konkurrenter.</li>
<li><strong>Nackdel:</strong> Gratisnivån har annonser och ett begränsat antal sparningar per dag enligt oberoende källor.</li>
<li><strong>Nackdel:</strong> AI-funktionerna är kreditbaserade och kan ta slut snabbt vid regelbunden användning.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratis grundredigerare (Pixlr X/E) utan konto. AI-funktioner kräver ett konto och krediter: Plus från 1,99 EUR/mån vid årsbetalning (80 AI-krediter/mån), Premium från 7,99 EUR/mån (1 000 krediter), Ultra från 19,99 EUR/mån (upp till 10 000 krediter), samt en "Ultra MAX"-nivå med dubbla Ultra-krediterna.</p>

<h2>För vem passar Pixlr?</h2>
<p>Pixlr passar bäst för den som vill redigera ett foto snabbt direkt i webbläsaren utan att skapa konto, och för den som bara behöver enstaka AI-förbättringar utan att binda sig till ett dyrare abonnemang.</p>

<h2>Vårt omdöme</h2>
<p>Pixlr är ett av de mest tillgängliga verktygen i kategorin tack vare en genuint gratis, kontofri grundredigerare, med AI-funktioner som ett billigt, valfritt tillägg. Reklamen och de begränsade dagliga sparningarna på gratisnivån är den tydligaste nackdelen. Med 7,9 av 10 är Pixlr ett utmärkt förstahandsval för snabba, enstaka redigeringar.</p>`,
  },
  {
    slug: 'cutout-pro',
    title: 'Cutout.pro',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>Cutout.pro recension 2026 — tydligt prissatt bakgrundsborttagning och kolorisering</h2>

<p>Cutout.pro är en AI-plattform fokuserad specifikt på bakgrundsborttagning, bildförbättring och kolorisering, med en ovanligt tydlig kreditkostnad per bildtyp jämfört med flera konkurrenter i kategorin.</p>

<h2>Vad är Cutout.pro?</h2>
<p>Cutout.pro erbjuder en bildbakgrundsborttagare, ansiktsutklipp och bakgrundsdiffusion, fotoförbättring/-uppskalning ("Photo Enhance Pro") och kolorisering, retuschering för objektborttagning, bakgrundsoskärpa, foto-till-skiss-konvertering och bildvektorisering. Plattformen erbjuder också AI-bildgenerering och enklare designverktyg utöver ren fotoredigering.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bildbakgrundsborttagare:</strong> Kärnfunktion, markerad som gratis att testa.</li>
<li><strong>Photo Enhance Pro:</strong> Förbättring och uppskalning av foton.</li>
<li><strong>Photo Colorizer:</strong> Koloriserar gamla svartvita foton.</li>
<li><strong>Retouch:</strong> Tar bort oönskade objekt ur en bild.</li>
<li><strong>Tydlig kreditkostnad:</strong> 1 kredit för bakgrundsborttagning/retusch, 2 krediter för kolorisering/förbättring/passfoto.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Cutout.pros tydligaste styrka är transparensen i prissättningen: till skillnad från många konkurrenter anges exakt hur många krediter varje bildtyp kostar, vilket gör det enkelt att räkna ut totalkostnaden i förväg. Priset per bild blir också lågt vid större volymer tack vare stafflade kreditpaket. Gratisnivån är dock snäv — bara 5 krediter — vilket räcker för ett fåtal bilder innan man behöver betala.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket tydlig kreditkostnad per bildtyp.</li>
<li><strong>Fördel:</strong> Lågt pris per bild vid högre volymer.</li>
<li><strong>Fördel:</strong> Krediter i pay-as-you-go-paketen går inte ut.</li>
<li><strong>Nackdel:</strong> Gratisnivån ger bara 5 krediter — räcker för ett fåtal bilder.</li>
<li><strong>Nackdel:</strong> Mindre känt namn utanför bakgrundsborttagning och kolorisering specifikt.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratis: 5 krediter (fler kan tjänas via inbjudningskod). Abonnemang: 80 krediter/5 USD, 170/9,90 USD, 300/16,90 USD, 550/29 USD, 1 000/49 USD, 1 450/69 USD per månad. Pay-as-you-go-paket utan abonnemang finns också, med krediter som inte går ut: från 30 krediter/4,99 USD upp till 30 000 krediter/1 399 USD.</p>

<h2>För vem passar Cutout.pro?</h2>
<p>Cutout.pro passar bäst för den som behöver många bakgrundsborttagningar eller koloriseringar till ett lågt, förutsägbart styckpris, snarare än den som vill ha det mest avancerade förbättringsresultatet.</p>

<h2>Vårt omdöme</h2>
<p>Cutout.pro är ett av de mest prismässigt transparenta verktygen i kategorin, med en tydlig kreditmodell och bra värde vid volym. Den snäva gratisnivån gör det svårare att testa ordentligt innan köp. Med 7,8 av 10 är Cutout.pro ett bra val specifikt för bakgrundsborttagning och kolorisering i större mängder.</p>`,
  },
];

async function upsertRow(row: {
  slug: string;
  path: string;
  title: string;
  content_mdx: string;
  seo_title: string;
}) {
  const { data: existing } = await db
    .from('articles')
    .select('id')
    .eq('path', row.path)
    .maybeSingle();

  const payload = {
    slug: row.slug,
    path: row.path,
    title: row.title,
    content_mdx: row.content_mdx,
    seo_title: row.seo_title,
    type: 'page' as const,
    category: null,
    parent_slug: PARENT_SLUG,
    affiliate_url: null,
    published_at: null,
    author_slug: 'nicklas-hallberg',
  };

  if (existing) {
    const { error } = await db.from('articles').update(payload).eq('id', existing.id);
    if (error) { console.error(row.slug, error); process.exit(1); }
    console.log(`OK (update): ${row.slug}`);
  } else {
    const { error } = await db.from('articles').insert(payload);
    if (error) { console.error(row.slug, error); process.exit(1); }
    console.log(`OK (insert): ${row.slug}`);
  }
}

async function main() {
  for (const r of reviews) {
    await upsertRow({
      slug: r.slug,
      path: `/ai-verktyg/${r.slug}`,
      title: r.title,
      content_mdx: r.content_mdx,
      seo_title: `${r.title} recension 2026 — pris, funktioner och betyg`,
    });
  }
}
main();
