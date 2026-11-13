/**
 * 6 nya recensionssidor för vibe coding-hubben (/ai-verktyg/vibe-coding):
 * Lovable, Bolt, v0, Base44, Google Antigravity, Magic Patterns.
 * parent_slug='vibe-coding' (syntetisk — matchar ingen riktig hub via
 * auto-parent_slug-query; hubben listar dessa + 5 befintliga ai-kod-verktyg-
 * recensioner via CURATED_HUB_TOOL_SLUGS i lib/route-kind.ts). Fakta
 * verifierade mot leverantörernas egna sajter/officiella blogginlägg
 * 2026-11-13. published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-vibe-coding-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PARENT_SLUG = 'vibe-coding';

type ReviewRow = { slug: string; title: string; content_mdx: string };

const reviews: ReviewRow[] = [
  {
    slug: 'lovable',
    title: 'Lovable',
    content_mdx: `<p><strong>Betyg: 8.6/10</strong></p>
<h2>Lovable recension 2026 — bygg fullstack-appar genom att chatta</h2>

<p>Lovable är ett av de mest omtalade namnen inom "vibe coding" — AI bygger hela appen åt dig från en beskrivning i vanligt språk. Det svenska bolaget växte ur det öppna källkodsprojektet GPT Engineer och har sedan lanseringen 2023 blivit ett av de snabbast växande verktygen i kategorin.</p>

<h2>Vad är Lovable?</h2>
<p>Lovable beskriver sig själv som en AI-mjukvaruingenjör: du skriver vad du vill bygga, och verktyget genererar en fungerande fullstack-webbapp — frontend, backend och databas inkluderat. Appen driftsätts direkt i Lovables molnhosting, och du kan fortsätta iterera genom att chatta fram ändringar eller växla till "Plan Mode" för att tänka igenom större förändringar innan de byggs.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Chatt-till-app:</strong> Beskriv vad appen ska göra, få en körbar version på minuter.</li>
<li><strong>Plan Mode:</strong> Separat läge för att planera större ändringar innan AI:n bygger dem.</li>
<li><strong>Molnhosting ingår:</strong> Appen driftsätts direkt, inget eget hostingval krävs för att komma igång.</li>
<li><strong>MCP-server och integrationer:</strong> Kopplas mot externa tjänster via Lovables Connections.</li>
<li><strong>Delade workspaces:</strong> Flera medlemmar delar samma kreditpool, ingen per-användare-avgift.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Lovable är genuint snabbt för det som fungerar bäst: avgränsade webbappar och MVP:er där du kan beskriva funktionalitet i vanligt språk. Att koden och projektet ägs av dig gör det tryggare att faktiskt satsa på en idé i verktyget, snarare än att fastna i ett låst ekosystem. Begränsningen är kreditmodellen — betalda nivåer prissätts inte med fasta, öppna siffror på hemsidan, vilket gör det svårt att i förväg veta vad tyngre användning landar på. Gratisnivåns 5 byggkrediter per dag (max 30 i månaden) räcker för att testa men tar snabbt slut vid regelbunden användning.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket snabb väg från idé till en faktiskt körbar, driftsatt app.</li>
<li><strong>Fördel:</strong> Ingen per-användare-avgift — delade kreditpooler fungerar bra för team.</li>
<li><strong>Fördel:</strong> Du äger koden och kan exportera eller fortsätta bygga på egen hand.</li>
<li><strong>Nackdel:</strong> Kreditbaserad prissättning utan öppet redovisade siffror gör kostnaden svår att förutse.</li>
<li><strong>Nackdel:</strong> Gratisnivån är snäv för den som vill testa mer än en liten app.</li>
</ul>

<h2>Pris och planer</h2>
<p>Lovable har en gratisnivå med 5 byggkrediter per dag (max 30/månad) och 20 molnkrediter per månad. Betalda planer (Pro, Business, Enterprise) är kreditbaserade utan fasta, öppet listade priser — Business har samma kostnad per körning som Pro men högre kreditpris, så kostnaden skalar olika beroende på användningsmönster. Studenter med giltig universitetsmejl kan få rabatt.</p>

<h2>För vem passar Lovable?</h2>
<p>Lovable passar bäst för den som vill gå från idé till en fungerande, driftsatt webbapp utan att själv skriva kod — grundare som ska validera en idé, produktteam som vill bygga interna verktyg snabbt, eller utvecklare som vill snabba upp den första versionen av ett projekt.</p>

<h2>Vårt omdöme</h2>
<p>Lovable är ett av de mest kompletta verktygen i vibe coding-kategorin: snabbt, ägandet av koden är tydligt reglerat till din fördel, och molnhosting ingår från start. Den otydliga prissättningen på betalda nivåer är den tydligaste nackdelen. Med ett betyg på 8,6 av 10 hör Lovable till toppskiktet för den som vill bygga fullstack-appar genom att beskriva dem i text.</p>`,
  },
  {
    slug: 'bolt-new',
    title: 'Bolt',
    content_mdx: `<p><strong>Betyg: 8.3/10</strong></p>
<h2>Bolt recension 2026 — AI-byggare direkt i webbläsaren</h2>

<p>Bolt (bolt.new) kommer från StackBlitz, bolaget bakom webbläsarbaserade utvecklingsmiljöer sedan 2017. Bolt lanserades i oktober 2024 och har sedan dess blivit ett av de mest använda verktygen för att bygga appar, sajter och prototyper helt i webbläsaren — utan lokal installation.</p>

<h2>Vad är Bolt?</h2>
<p>Bolt är en AI-driven appbyggare som körs direkt i webbläsaren. Du kan starta ett projekt från en textbeskrivning, importera från Figma eller GitHub, eller utgå från en teammall. AI:n väljer automatiskt lämplig modell för varje uppgift, och "Bolt Cloud" ger backend-infrastruktur med databaser, användarhantering och hosting inbyggt.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Körs helt i webbläsaren:</strong> Ingen lokal miljö eller installation krävs.</li>
<li><strong>Import från Figma eller GitHub:</strong> Starta från ett befintligt projekt istället för tomt blad.</li>
<li><strong>Automatisk modellrouting:</strong> Bolt väljer modell per uppgift; Max-läget ger starkare modell för Pro-användare.</li>
<li><strong>Bolt Cloud:</strong> Inbyggd backend med databaser, autentisering och integrationer.</li>
<li><strong>Eget design-system:</strong> Projekt kan byggas mot er egen visuella profil.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Att allt körs i webbläsaren gör Bolt till ett av de smidigaste sätten att komma igång — ingen installation, ingen konfiguration. Möjligheten att importera från Figma eller GitHub gör det också till ett rimligt val för team som redan har en design eller ett projekt att bygga vidare på, inte bara för helt nya idéer. Den tydligaste svagheten är transparensen: Bolt listar varken priser eller konkreta kreditgränser öppet på sin hemsida, vilket gör det svårt att jämföra kostnad mot konkurrenter innan man skapar konto.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Allt körs i webbläsaren — inget att installera lokalt.</li>
<li><strong>Fördel:</strong> Kan utgå från ett befintligt Figma- eller GitHub-projekt istället för att börja om.</li>
<li><strong>Fördel:</strong> Inbyggd backend (Bolt Cloud) med databaser och autentisering.</li>
<li><strong>Nackdel:</strong> Priser och kreditgränser anges inte öppet på hemsidan.</li>
<li><strong>Nackdel:</strong> Starkare modell (Max-läge) är låst till betalande Pro-användare.</li>
</ul>

<h2>Pris och planer</h2>
<p>Bolt går att börja använda gratis direkt på hemsidan, men exakta kreditgränser för gratisnivån anges inte. Betalda planer (Pro, med tillgång till Max-läget) prissätts inte heller öppet på startsidan — du behöver skapa konto eller besöka en separat prissida för detaljer.</p>

<h2>För vem passar Bolt?</h2>
<p>Bolt passar bäst för produktchefer, grundare och designers som vill gå från en Figma-design eller idé till en körbar prototyp snabbt, samt team som redan har ett GitHub-projekt de vill vidareutveckla med AI-hjälp direkt i webbläsaren.</p>

<h2>Vårt omdöme</h2>
<p>Bolt levererar på löftet om friktionsfri, webbläsarbaserad appbyggning, med genuint användbara import- och backend-funktioner. Den otydliga, svåråtkomliga prissättningen drar ner helhetsintrycket något. Med ett betyg på 8,3 av 10 är Bolt ett starkt val för den som vill prototypa snabbt utan att lämna webbläsaren.</p>`,
  },
  {
    slug: 'v0',
    title: 'v0',
    content_mdx: `<p><strong>Betyg: 8.5/10</strong></p>
<h2>v0 recension 2026 — Vercels AI-byggare med öppen prissättning</h2>

<p>v0 är Vercels egna AI-verktyg för att bygga webbgränssnitt och appar, med driftsättning direkt på Vercels plattform. Till skillnad från flera konkurrenter redovisar v0 sin prissättning öppet, ner till pris per miljon tokens för varje modellnivå — ovanligt transparent i en kategori där de flesta andra verktyg gömmer priserna bakom konto-skapande.</p>

<h2>Vad är v0?</h2>
<p>v0 låter dig bygga webb-UI och appar genom att beskriva dem i text, med stöd för visuell efterredigering ("Design Mode") och synk direkt till GitHub. Du väljer mellan flera AI-modellnivåer (Mini, Pro, Max, Max Fast) beroende på hur komplext och snabbt jobbet behöver vara, och fakturering sker centralt via ditt Vercel-konto.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Design Mode:</strong> Visuell redigering av AI-genererat gränssnitt utan att skriva kod.</li>
<li><strong>GitHub-synk:</strong> Generated kod synkas direkt till ett repo.</li>
<li><strong>Flera modellnivåer:</strong> Mini, Pro, Max och Max Fast — olika pris och prestanda för olika uppgifter.</li>
<li><strong>Direkt driftsättning på Vercel:</strong> Ingen separat hosting-konfiguration behövs.</li>
<li><strong>Enterprise-stöd:</strong> SAML SSO, rollbaserad åtkomst och garanterade support-SLA:er.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>v0:s största styrka är transparensen: alla priser, inklusive exakta tokenkostnader per modell, står på hemsidan — ovanligt i den här kategorin. För team som redan hostar på Vercel blir det också den mest naturliga vibe coding-lösningen, eftersom driftsättning och fakturering redan är samma system. Svagheten är gratisnivåns gräns på 7 meddelanden per dag, vilket är snävt om man vill använda v0 löpande snarare än för enstaka experiment.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Fullt öppen, transparent prissättning per plan och per token.</li>
<li><strong>Fördel:</strong> Sömlös driftsättning och fakturering för den som redan är på Vercel.</li>
<li><strong>Fördel:</strong> Gratisnivå finns att testa innan köp.</li>
<li><strong>Nackdel:</strong> 7 meddelanden/dag på gratisnivån räcker bara för korta tester.</li>
<li><strong>Nackdel:</strong> De starkaste modellerna (Max, Max Fast) kostar betydligt mer per token.</li>
</ul>

<h2>Pris och planer</h2>
<p>v0 har en gratisnivå (7 meddelanden/dag), Plus för 30 USD/användare/månad och Business för 100 USD/användare/månad, plus Enterprise på förfrågan. Plus och Business inkluderar 30 USD i kredit per användare och månad samt 2 USD i gratiskredit dagligen. Modellerna prissätts separat per miljon tokens, från 0,20 USD (v0 Mini, indata) upp till 50 USD (v0 Max Fast, utdata).</p>

<h2>För vem passar v0?</h2>
<p>v0 passar bäst för team och utvecklare som redan driftsätter på Vercel och vill bygga UI med AI i samma ekosystem, samt för den som värdesätter att veta exakt vad varje modellnivå kostar innan de börjar bygga.</p>

<h2>Vårt omdöme</h2>
<p>v0 sticker ut genom att vara det mest transparent prissatta verktyget i kategorin, samtidigt som det levererar solid byggkvalitet och smidig integration mot Vercel. Den snäva gratisnivån är den tydligaste begränsningen för löpande, icke-betalande bruk. Med ett betyg på 8,5 av 10 är v0 ett av de starkaste alternativen, särskilt för befintliga Vercel-användare.</p>`,
  },
  {
    slug: 'base44',
    title: 'Base44',
    content_mdx: `<p><strong>Betyg: 7.9/10</strong></p>
<h2>Base44 recension 2026 — AI-appbyggare med Wix i ryggen</h2>

<p>Base44 är en israelisk AI-plattform som bygger kompletta appar — backend, databas och autentisering inkluderat — från en beskrivning i vanligt språk. Wix köpte bolaget 2025 för initialt cirka 80 miljoner dollar, med ytterligare resultatbaserade betalningar möjliga fram till 2029, vilket ger Base44 ett stabilt moderbolag i ryggen.</p>

<h2>Vad är Base44?</h2>
<p>Base44 beskrivs av leverantören som en AI-plattform för att bygga appar och sajter från vanligt språk. Till skillnad från rena frontend-byggare inkluderar Base44 backend, databas, autentisering och användarhantering redan i grundutförandet — du behöver inte koppla ihop separata tjänster för att få en fungerande app med inloggning och datalagring.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Inbyggd databas och autentisering:</strong> Ingår redan i gratisnivån, inte bara i betalda planer.</li>
<li><strong>Visuell redigerare:</strong> Responsiv editor för att justera utseende utan kod.</li>
<li><strong>Analysdashboard:</strong> Inbyggd uppföljning av appens användning.</li>
<li><strong>Kodredigering i appen:</strong> Starter-nivå och uppåt tillåter manuella kodändringar direkt i plattformen.</li>
<li><strong>GitHub-integration:</strong> Tillgänglig från Builder-nivån och uppåt.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Base44:s styrka är att det inte bara bygger ett gränssnitt — databas, inloggning och analys finns med från start, vilket gör gratisnivån ovanligt användbar för att faktiskt testa en riktig app-idé, inte bara en statisk prototyp. Wix-ägandet ger också en trygghet kring drift och långsiktighet som nyare, fristående startups inte alltid kan erbjuda. Baksidan är att Base44 är betydligt mindre känt bland utvecklare än Lovable, Bolt eller v0, vilket märks i tunnare community-dokumentation och färre tredjepartsguider.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Databas, autentisering och analys ingår redan i gratisnivån.</li>
<li><strong>Fördel:</strong> Öppet redovisad, förutsägbar prisstege från gratis till Elite.</li>
<li><strong>Fördel:</strong> Wix i ryggen ger ekonomisk stabilitet och långsiktig drift.</li>
<li><strong>Nackdel:</strong> Gratisnivån begränsas till 5 appar.</li>
<li><strong>Nackdel:</strong> Mindre etablerat namn och tunnare dokumentation än de ledande konkurrenterna.</li>
</ul>

<h2>Pris och planer</h2>
<p>Base44 har en gratisnivå (upp till 5 appar, 25 meddelandekrediter och 100 integrationskrediter/månad). Betalda planer vid årsbetalning: Starter 16 USD/mån, Builder 40 USD/mån, Pro 80 USD/mån, Elite 160 USD/mån — med stigande antal krediter och funktioner som GitHub-integration (Builder+) och förtur till betafunktioner (Pro/Elite). Enterprise-prissättning ges på förfrågan.</p>

<h2>För vem passar Base44?</h2>
<p>Base44 passar bäst för småföretagare och team utan egen backend-kompetens som vill bygga en app med riktig databas och inloggning snabbt, samt för den som värdesätter en tydlig, öppet redovisad prisstege framför kreditbaserade modeller utan fasta priser.</p>

<h2>Vårt omdöme</h2>
<p>Base44 levererar ett ovanligt komplett paket redan i gratisnivån och sticker ut med öppen, förutsägbar prissättning. Att det är mindre känt och har tunnare dokumentation än de ledande konkurrenterna drar ner helhetsbetyget något. Med 7,9 av 10 är Base44 ett solitt, om än mindre uppmärksammat, alternativ i vibe coding-kategorin.</p>`,
  },
  {
    slug: 'google-antigravity',
    title: 'Google Antigravity',
    content_mdx: `<p><strong>Betyg: 7.8/10</strong></p>
<h2>Google Antigravity recension 2026 — gratis, agentisk utveckling från Google</h2>

<p>Google Antigravity är Googles satsning på "agent-first"-utveckling: en plattform byggd kring att köra flera AI-agenter parallellt, snarare än en enda chatt-till-app-upplevelse. Plattformen är helt kostnadsfri för utvecklare, vilket gör den till ett ovanligt lågtröskel-alternativ i en kategori där de flesta konkurrenter har kreditbaserade eller per-användare-avgifter.</p>

<h2>Vad är Google Antigravity?</h2>
<p>Antigravity är inte ett enskilt verktyg utan en svit: en app som fungerar som kommandocentral för flera parallella lokala agenter, en terminalbaserad CLI för autonoma kodningsagenter, en fullfjädrad agentisk IDE med djup kodbas-förståelse, samt ett Python-SDK för att bygga egna agenter. Plattformen är riktad både mot utvecklare och roller som produkt, design och analys.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Parallella agenter:</strong> Kör flera lokala AI-agenter samtidigt över olika arbetsytor.</li>
<li><strong>Antigravity CLI:</strong> Terminalbaserat verktyg för autonoma kodningsagenter och bakgrundsprocesser.</li>
<li><strong>Antigravity IDE:</strong> Agentisk IDE med djup förståelse för hela kodbasen.</li>
<li><strong>Browser-in-the-loop-agenter:</strong> Automatiserar repetitiva UX-uppgifter i frontend-arbete.</li>
<li><strong>Python-SDK:</strong> Bygg och utvärdera egna agenter på Antigravitys agentramverk.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Att plattformen är helt gratis för utvecklare är den enskilt mest slående egenskapen — i en kategori där alla andra verktyg på den här listan har krediter, per-användare-avgifter eller otydlig prissättning, tar Google bort hela kostnadsfrågan. Möjligheten att köra flera agenter parallellt passar också bättre för erfarna utvecklare som vill delegera flera uppgifter samtidigt, snarare än icke-tekniska användare som bara vill beskriva en app och få den färdig. Som mycket ny plattform (lanserad 2026) saknar Antigravity ännu det beprövade track record som Lovable, Bolt och v0 har byggt upp.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Helt kostnadsfritt för utvecklare, utan synlig kreditbegränsning.</li>
<li><strong>Fördel:</strong> Kan köra flera agenter parallellt över olika projekt och arbetsytor.</li>
<li><strong>Fördel:</strong> Täcker hela kedjan — app, CLI, IDE och SDK — i en och samma plattform.</li>
<li><strong>Nackdel:</strong> Mycket ny (2026), med mindre beprövad stabilitet än etablerade konkurrenter.</li>
<li><strong>Nackdel:</strong> Riktar sig mer mot utvecklare än mot icke-tekniska "vibe coders" som bara vill beskriva en app i text.</li>
</ul>

<h2>Pris och planer</h2>
<p>Antigravity är kostnadsfritt för utvecklare, utan angivna användningstak på hemsidan. Det finns en separat Enterprise-väg för organisationer, men prissättningen för den anges inte öppet.</p>

<h2>För vem passar Google Antigravity?</h2>
<p>Antigravity passar bäst för utvecklare som vill testa agentiska, parallella arbetsflöden utan kostnad, särskilt den som redan är van vid att jobba i en IDE eller terminal snarare än att bara beskriva en app i en chattruta.</p>

<h2>Vårt omdöme</h2>
<p>Google Antigravity är det mest utvecklarorienterade och billigaste alternativet på listan, med en ambitiös vision om parallella agenter över hela utvecklingskedjan. Nyheten gör att det ännu saknar den beprövade stabiliteten hos de mer etablerade verktygen. Med 7,8 av 10 är det ett starkt gratisalternativ för tekniska användare, men mindre självklart för den som bara vill beskriva en app och få den färdig.</p>`,
  },
  {
    slug: 'magic-patterns',
    title: 'Magic Patterns',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Magic Patterns recension 2026 — AI-prototyper för produktteam</h2>

<p>Magic Patterns, byggt av North Park Labs, riktar sig mer mot produktteam och designers än mot enskilda utvecklare. Verktyget går från idé till klickbar UI-prototyp med stöd för ett eget design-system, och fick en ny, användningsbaserad kreditmodell i mars 2026.</p>

<h2>Vad är Magic Patterns?</h2>
<p>Magic Patterns beskrivs av leverantören som ett AI-nativt produktutvecklingsverktyg som hjälper team att gå "från idé till produktion". Centrala funktioner är Agent-läge för att bygga flöden automatiskt, stöd för ett eget design-system så genererade gränssnitt följer varumärkets visuella profil, samt visuell redigering av det AI:n bygger.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Agent-läge:</strong> Låter AI:n bygga mer komplexa flöden autonomt.</li>
<li><strong>Design-system-stöd:</strong> Genererade gränssnitt kan byggas mot ert eget designspråk.</li>
<li><strong>Visuell redigering:</strong> Justera AI-genererat UI direkt, utan att skriva kod.</li>
<li><strong>Connectors:</strong> Koppla in externa datakällor och tjänster.</li>
<li><strong>Delade arbetsytor:</strong> Centraliserad fakturering och team-workspaces från Business-nivån.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Design-system-stödet är Magic Patterns tydligaste fördel jämfört med mer generella vibe coding-verktyg — resultatet blir mer varumärkeskonsekvent snarare än generiskt AI-utseende. Det gör verktyget särskilt användbart för produktteam som redan har en visuell profil att utgå från. Priset är samtidigt högre än flera konkurrenter i den här jämförelsen, och verktyget är mindre känt i den bredare "vibe coding"-diskussionen än Lovable eller Bolt, vilket gör det svårare att hitta oberoende erfarenheter och guider.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Tydligt fokus på produktteam och varumärkeskonsekvent design, inte bara enskilda utvecklare.</li>
<li><strong>Fördel:</strong> Design-system-stöd ger mer konsekvent resultat än generiska byggare.</li>
<li><strong>Fördel:</strong> Business-nivån ger SSO, roller och användningsrapportering för större team.</li>
<li><strong>Nackdel:</strong> Högre pris än flera konkurrenter — 75 USD/mån för Business, stiger till 100 USD från sommaren 2026.</li>
<li><strong>Nackdel:</strong> Mindre känt namn i vibe coding-kategorin, med färre oberoende recensioner och guider.</li>
</ul>

<h2>Pris och planer</h2>
<p>Magic Patterns kostar, enligt bolagets officiella prisuppdatering från mars 2026: Starter 19 USD/mån (stiger till 20 USD/mån efter 2026-06-30) och Business 75 USD/mån (stiger till 100 USD/mån efter samma datum). Enterprise-prissättning ges på förfrågan och inkluderar bland annat teknisk kontaktperson och delad kreditpool.</p>

<h2>För vem passar Magic Patterns?</h2>
<p>Magic Patterns passar bäst för produktteam och designers som vill bygga klickbara prototyper mot ett befintligt design-system, snarare än enskilda utvecklare som vill ha en komplett, driftsatt fullstack-app direkt.</p>

<h2>Vårt omdöme</h2>
<p>Magic Patterns är ett genomtänkt verktyg för produktteam som värdesätter design-konsekvens, men det högre priset och den smalare positioneringen gör det till ett mer nischat val än de bredare konkurrenterna på listan. Med 7,6 av 10 är det värt att överväga specifikt för produkt- och designdrivna team — mindre självklart för den som bara vill ha en snabb, billig prototyp.</p>`,
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
