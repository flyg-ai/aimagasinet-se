/**
 * 9 nya recensionssidor för ai-text-verktyg-hubben (/ai-verktyg/ai-text-verktyg),
 * som utökar den från 11 till 20 verktyg. parent_slug='ai-text-verktyg' —
 * hubben listar via vanlig parent_slug-matchning (ingen curated-lista).
 * Fakta verifierade mot tredjepartskällor 2026-11-14 (leverantörernas egna
 * sajter blockerade WebFetch) — motstridiga prisuppgifter flaggas explicit
 * i texten istället för att gissa. published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-ai-text-verktyg-ext-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PARENT_SLUG = 'ai-text-verktyg';

type ReviewRow = { slug: string; title: string; content_mdx: string };

const reviews: ReviewRow[] = [
  {
    slug: 'quillbot',
    title: 'QuillBot',
    content_mdx: `<p><strong>Betyg: 8.0/10</strong></p>
<h2>QuillBot recension 2026 — omskrivning och grammatik i ett</h2>

<p>QuillBot är en av de mest etablerade omskrivningstjänsterna på marknaden, med fokus på att formulera om text i olika toner och stilar snarare än att skriva helt nytt innehåll från grunden.</p>

<h2>Vad är QuillBot?</h2>
<p>QuillBot är en AI-driven omskrivare (paraphraser) med tillhörande grammatikkontroll, plagiatkontroll och sammanfattningsverktyg. Grundfunktionen är att mata in en text och få flera alternativa formuleringar i olika lägen (t.ex. "Standard", "Fluency", "Formal", "Kreativ").</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>9 omskrivningslägen:</strong> Från ren grammatikstädning till kreativ omformulering.</li>
<li><strong>Grammatikkontroll:</strong> Separat korrekturläsningsfunktion utöver omskrivningen.</li>
<li><strong>Plagiatkontroll:</strong> Upp till 25 000 ord/månad på betalplanen.</li>
<li><strong>Sammanfattare och Co-Writer:</strong> Extra verktyg för att korta ner och strukturera text.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>QuillBot gör precis det det utger sig för att göra — snabb, pålitlig omskrivning av text man redan har, snarare än generering av nytt innehåll från en prompt som ChatGPT eller Claude. Gratisversionen är hårt begränsad (125 ord per omskrivning), vilket gör att de flesta som vill använda verktyget regelbundet hamnar på en betalplan relativt snabbt. Den är starkast som ett komplement till en skrivprocess, inte som ett fristående skrivverktyg.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mycket bra och snabb omskrivning i flera toner.</li>
<li><strong>Fördel:</strong> Grammatik-, plagiat- och sammanfattningsverktyg i samma prenumeration.</li>
<li><strong>Nackdel:</strong> Gratisversionen är kraftigt begränsad till 125 ord per omskrivning.</li>
<li><strong>Nackdel:</strong> Gör inte nytt innehåll från grunden — kompletterar snarare än ersätter ett skrivverktyg som ChatGPT.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisnivå med 125 ord per omskrivning. Premium kostar enligt de flesta källor 19,95 USD/mån, cirka 8,33 USD/mån vid årsbetalning (99,95 USD/år) — en kvartalsnivå nämns också men källorna skiljer sig åt om exakt pris och period. Kontrollera aktuellt pris på quillbot.com innan köp.</p>

<h2>För vem passar QuillBot?</h2>
<p>QuillBot passar bäst för studenter, forskare och skribenter som redan har en text och vill formulera om den — snarare än för den som vill generera helt nytt innehåll från en kort instruktion.</p>

<h2>Vårt omdöme</h2>
<p>QuillBot är ett av de mest pålitliga omskrivningsverktygen i kategorin och gör sin smala uppgift bra. Den hårt begränsade gratisnivån och det faktum att det inte ersätter ett generativt skrivverktyg drar ner helhetsbetyget något. Med 8,0 av 10 är det ett solitt komplement snarare än ett förstahandsval för den som vill skriva från grunden.</p>`,
  },
  {
    slug: 'sudowrite',
    title: 'Sudowrite',
    content_mdx: `<p><strong>Betyg: 8.2/10</strong></p>
<h2>Sudowrite recension 2026 — AI byggt specifikt för skönlitteratur</h2>

<p>Sudowrite skiljer sig från de flesta AI-skrivverktyg genom att vara byggt uteslutet för skönlitterärt berättande — noveller, romaner och längre fiktion — snarare än marknadsföringstext eller affärsskrivande.</p>

<h2>Vad är Sudowrite?</h2>
<p>Sudowrite är en AI-skrivpartner för författare, med funktioner anpassade efter hur en roman eller novell faktiskt skrivs: att fortsätta en scen, beskriva en känsla mer levande, variera en mening, eller få förslag på vad som kan hända härnäst i handlingen.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Write/Describe/Feedback:</strong> Fortsätter texten, förstärker sinnesintryck, eller ger skrivfeedback på ett utkast.</li>
<li><strong>Story Bible:</strong> Håller reda på karaktärer, världsbygge och handling genom ett helt bokprojekt.</li>
<li><strong>Canvas:</strong> Visuellt arbetsytegränssnitt för att planera och skriva längre verk.</li>
<li><strong>Utvecklingsredigering (högre nivåer):</strong> Djupare redaktionell feedback på struktur och berättarteknik.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Sudowrite är ett av få verktyg som faktiskt känns byggt av och för skönlitterära författare snarare än generisk marknadsföringstext anpassad för skönlitteratur i efterhand. Krediterna förbrukas olika snabbt beroende på funktion och modell, vilket gör det svårare att förutse exakt hur långt en prenumeration räcker än med en enkel ord- eller meddelandegräns. Källor är oense om exakt kreditmängd per nivå, så räkna med att behöva testa gratisnivån för att få en känsla för er egen förbrukning.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Byggt specifikt för skönlitterärt berättande, inte generisk marknadsföringstext.</li>
<li><strong>Fördel:</strong> Story Bible håller ihop karaktärer och handling genom ett helt bokprojekt.</li>
<li><strong>Nackdel:</strong> Kreditbaserat system gör kostnaden svårförutsägbar; källor ger olika kreditsiffror per nivå.</li>
<li><strong>Nackdel:</strong> Mindre relevant om ni behöver marknadsförings- eller affärstext — det är inte verktygets fokus.</li>
</ul>

<h2>Pris och planer</h2>
<p>Enligt de flesta källor: Hobby & Student cirka 10 USD/mån (årsbetalning) eller 19 USD/mån löpande, Professional cirka 22 USD/mån (39 USD löpande), Max cirka 44 USD/mån (59 USD löpande), samt en Enterprise-nivå på offert. Kreditmängd och om krediter rullar över skiljer sig åt mellan källor — kontrollera aktuellt pris och kreditvillkor på sudowrite.com.</p>

<h2>För vem passar Sudowrite?</h2>
<p>Sudowrite passar bäst för författare som skriver noveller eller romaner och vill ha en AI-partner anpassad efter skönlitterärt hantverk, snarare än ett generellt skrivverktyg.</p>

<h2>Vårt omdöme</h2>
<p>Sudowrite är ett av de mest nischade och samtidigt mest genomtänkta verktygen i kategorin för den specifika målgruppen skönlitterära författare. Den kreditbaserade, svårförutsägbara prissättningen drar ner betyget något. Med 8,2 av 10 är det ett starkt förstahandsval om skönlitteratur är ert fokus — mindre relevant annars.</p>`,
  },
  {
    slug: 'rytr',
    title: 'Rytr',
    content_mdx: `<p><strong>Betyg: 7.4/10</strong></p>
<h2>Rytr recension 2026 — budgetvänligt AI-skrivverktyg för korta texter</h2>

<p>Rytr positionerar sig som ett av de billigaste AI-skrivverktygen på marknaden, med fokus på korta marknadsföringstexter snarare än långa artiklar eller skönlitteratur.</p>

<h2>Vad är Rytr?</h2>
<p>Rytr är ett AI-skrivverktyg med över 40 fördefinierade användningsfall — annonstexter, produktbeskrivningar, inlägg till sociala medier, mejl och liknande kortformatstext — samt stöd för flera tonlägen och över 30 språk.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>40+ användningsfall:</strong> Färdiga mallar för vanliga marknadsförings- och copywriting-behov.</li>
<li><strong>Tonmatchning:</strong> Flera tonlägen att välja mellan för genererad text.</li>
<li><strong>Plagiatkontroll:</strong> Ingår på högre nivåer, begränsat antal kontroller per månad.</li>
<li><strong>35+ språk:</strong> Bredare språkstöd än flera konkurrenter i samma prisklass.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Rytr levererar godkänd kvalitet för just det den är gjord för — korta, repetitiva marknadsföringstexter — till ett pris som ligger klart under Jasper och Copy.ai. Det är inte ett verktyg för långa, sammanhängande artiklar eller djupgående innehåll. Prisstrukturen har förändrats flera gånger de senaste åren enligt olika källor, och namnen på nivåerna skiljer sig åt mellan granskningar — ett tecken på att det är värt att dubbelkolla aktuell prissättning direkt hos leverantören innan köp.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Ett av de billigaste AI-skrivverktygen i kategorin.</li>
<li><strong>Fördel:</strong> Brett språkstöd (35+ språk) och många färdiga användningsfall.</li>
<li><strong>Nackdel:</strong> Svagare på långa, sammanhängande texter än på korta marknadsföringssnuttar.</li>
<li><strong>Nackdel:</strong> Prisnivåer och namn på planer har ändrats upprepade gånger — källor är oense om aktuell struktur.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisnivå med 10 000 tecken/mån. Betalda nivåer anges olika i olika källor — vanligast förekommande är en nivå kring 9 USD/mån och en högre nivå kring 29 USD/mån med fler plagiatkontroller och bredare tonmatchning, men en nyare källa beskriver en annan uppsättning namn och priser (Lite/Personal/Pro). Kontrollera aktuell prisstruktur på rytr.me innan köp.</p>

<h2>För vem passar Rytr?</h2>
<p>Rytr passar bäst för småföretagare och marknadsförare som behöver mycket kort marknadsföringstext till lågt pris, och som inte behöver stöd för långa artiklar.</p>

<h2>Vårt omdöme</h2>
<p>Rytr är ett prisvärt, om än begränsat, verktyg för kort marknadsföringstext. Den otydliga, flera gånger omstrukturerade prissättningen och den svagare förmågan på längre innehåll drar ner helhetsbetyget. Med 7,4 av 10 är det ett rimligt budgetval för rätt användningsfall, men inte ett förstahandsval för längre innehåll.</p>`,
  },
  {
    slug: 'mistral-vibe',
    title: 'Mistral Vibe',
    content_mdx: `<p><strong>Betyg: 8.1/10</strong></p>
<h2>Mistral Vibe recension 2026 — tidigare Le Chat, nu med AI-kodning inbyggt</h2>

<p>Mistral Vibe hette fram till den 28 maj 2026 "Le Chat" — konversationer, inställningar och planer flyttades över automatiskt vid namnbytet. Det är den franska AI-utvecklaren Mistrals egen chattassistent, med starkt fokus på dataskydd och europeisk drift.</p>

<h2>Vad är Mistral Vibe?</h2>
<p>Mistral Vibe är en AI-assistent som liknar ChatGPT, Claude och Gemini i grundfunktion — textgenerering, research och konversation — men med Mistrals egna språkmodeller under huven och, efter namnbytet, inbyggt stöd för kodningssessioner via CLI, IDE och webb.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Textgenerering och research:</strong> Samma grundfunktion som andra stora AI-assistenter.</li>
<li><strong>Bildgenerering och webbsök:</strong> Ingår redan i gratisnivån enligt Mistrals egen prissida.</li>
<li><strong>Kodningssessioner:</strong> Stöd för CLI, IDE och webb, en del av namnbytet till Vibe.</li>
<li><strong>100+ kopplingar:</strong> Integrationer mot andra verktyg och tjänster.</li>
<li><strong>Europeisk drift:</strong> Attraktivt för organisationer som prioriterar EU-baserad datahantering.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Mistral Vibe är ett solitt, om än mindre känt, alternativ till de amerikanska storbolagens assistenter — särskilt relevant för europeiska användare och företag som vill ha ett AI-alternativ med tydligare EU-förankring. Namnbytet från Le Chat till Vibe i maj 2026 gör att äldre recensioner och jämförelser online kan vara inaktuella eller svåra att hitta under rätt namn. Funktionsmässigt ligger den nära konkurrenterna, men saknar ännu samma tredjepartsekosystem och allmänna kändisskap som ChatGPT och Claude.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Europeisk AI-utvecklare med fokus på dataskydd och EU-drift.</li>
<li><strong>Fördel:</strong> Generös gratisnivå med bild, webbsök och API-krediter inkluderat.</li>
<li><strong>Nackdel:</strong> Namnbytet (Le Chat → Vibe, maj 2026) gör att mycket äldre innehåll om verktyget är inaktuellt.</li>
<li><strong>Nackdel:</strong> Mindre tredjepartsekosystem och allmän kännedom än ChatGPT, Claude och Gemini.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratis: begränsat antal meddelanden, webbsök och kodningssessioner, bildgenerering, 100+ kopplingar och cirka 10 USD/mån i API-krediter. Pro: 14,99 USD/mån (studentrabatt 5,99 USD/mån), med fler meddelanden, kodningsstöd hela dagen och cirka 30 USD/mån i API-krediter. Team: 24,99 USD/användare/mån. Enterprise: offert. Priser verifierade mot Mistrals egen prissida per oktober 2026 — dubbelkolla på mistral.ai då AI-prisnivåer ändras ofta.</p>

<h2>För vem passar Mistral Vibe?</h2>
<p>Mistral Vibe passar bäst för europeiska användare och organisationer som vill ha ett kraftfullt AI-alternativ med tydlig EU-förankring, eller som redan följer Mistrals modeller inom utveckling.</p>

<h2>Vårt omdöme</h2>
<p>Mistral Vibe är ett kompetent, EU-förankrat alternativ till de stora amerikanska AI-assistenterna, med en ovanligt generös gratisnivå. Det mindre ekosystemet och förvirringen kring namnbytet drar ner betyget något. Med 8,1 av 10 är det särskilt värt att överväga för europeiska användare som prioriterar dataskydd.</p>`,
  },
  {
    slug: 'sapling-ai',
    title: 'Sapling AI',
    content_mdx: `<p><strong>Betyg: 7.6/10</strong></p>
<h2>Sapling AI recension 2026 — skrivassistent byggd för kundsupport och sälj</h2>

<p>Sapling AI skiljer sig från de flesta verktyg i den här guiden genom att rikta sig mot team snarare än enskilda skribenter — främst kundsupport- och säljteam som skriver många liknande svar varje dag.</p>

<h2>Vad är Sapling AI?</h2>
<p>Sapling är en skrivassistent med grammatik- och stavningskontroll på över 20 språk, ett delat bibliotek av textsnuttar (snippets) för återanvändbara svar, samt en egen AI-textdetektor som separat produkt.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Flerspråkig grammatikkontroll:</strong> Stöd för över 20 språk.</li>
<li><strong>Delat snippet-bibliotek:</strong> Textmakron för återkommande svar i support och sälj.</li>
<li><strong>PII-redigering, SSO och MFA:</strong> Säkerhetsfunktioner riktade mot företag.</li>
<li><strong>Egen AI-detektor:</strong> Separat verktyg för att bedöma om text är AI-skriven.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Sapling är tydligast i sin nisch: ett team som skriver många snarlika supportsvar eller säljmejl får verkligt värde av det delade snippet-biblioteket och grammatikkontrollen i realtid. Det är mindre relevant för en enskild skribent som vill generera artiklar eller marknadsföringstext från grunden — det är inte verktygets syfte. Gratisnivåns exakta gränser beskrivs olika i olika källor, vilket tyder på att de ändrats över tid.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Starkt för team med återkommande support- eller säljsvar.</li>
<li><strong>Fördel:</strong> Flerspråkig grammatikkontroll och säkerhetsfunktioner (SSO, MFA, PII-redigering) för företag.</li>
<li><strong>Nackdel:</strong> Inte byggt för att generera längre, fristående innehåll.</li>
<li><strong>Nackdel:</strong> Gratisnivåns gränser beskrivs inkonsekvent mellan källor.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratisnivå med grundläggande grammatik- och stavningskontroll samt en begränsad AI-detektor (2 000 tecken per kontroll enligt de flesta källor). Betalplaner anges från cirka 25 USD/mån enligt flera källor, med anpassad prissättning för större team. Kontrollera aktuellt pris på sapling.ai.</p>

<h2>För vem passar Sapling AI?</h2>
<p>Sapling AI passar bäst för kundsupport- och säljteam som vill standardisera och kvalitetssäkra många liknande svar, snarare än för enskilda innehållsskapare.</p>

<h2>Vårt omdöme</h2>
<p>Sapling AI löser ett tydligt, specifikt problem för supportorienterade team bra. Att det är mindre relevant för innehållsskapande utanför den nischen, och att gratisnivåns villkor är otydliga, drar ner betyget. Med 7,6 av 10 är det ett bra val för rätt team, men inte ett allmänt skrivverktyg.</p>`,
  },
  {
    slug: 'wordtune',
    title: 'Wordtune',
    content_mdx: `<p><strong>Betyg: 7.5/10</strong></p>
<h2>Wordtune recension 2026 — snabb omformulering direkt i webbläsaren</h2>

<p>Wordtune är ett omskrivnings- och sammanfattningsverktyg som är tänkt att användas löpande medan du skriver, via webbläsartillägg i Gmail, Google Docs och liknande, snarare än som ett fristående skrivfönster.</p>

<h2>Vad är Wordtune?</h2>
<p>Wordtune föreslår alternativa formuleringar av en mening i realtid, sammanfattar längre texter, och kan svara på frågor mot egna uppladdade dokument via en "Ask AI"-funktion. Verktyget integreras med Google Docs, Gmail, Microsoft Word, Slack och Chrome.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Omformulering i realtid:</strong> Föreslår alternativa meningar direkt där du skriver.</li>
<li><strong>Sammanfattning:</strong> Kortar ner längre texter till ett begränsat antal per månad beroende på nivå.</li>
<li><strong>Ask AI:</strong> Svarar på frågor baserat på egna uppladdade dokument.</li>
<li><strong>Brett integrationsstöd:</strong> Google Docs, Gmail, Word, Slack och Chrome.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Wordtunes styrka är att det sitter där du redan skriver, vilket gör tröskeln låg för att faktiskt använda det löpande — till skillnad från verktyg som kräver att man kopierar text fram och tillbaka. Det saknar däremot SEO-optimeringsfunktioner och förmåga att lära sig en varumärkesröst, vilket gör det mindre relevant för innehållsmarknadsföring i större skala. Flera användarrecensioner nämner återkommande problem med att avsluta prenumerationen och oväntade förnyelser — värt att ha koll på innan ni registrerar kort.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Låg tröskel — integreras direkt i Gmail, Docs, Word och Slack.</li>
<li><strong>Fördel:</strong> Bra, snabb omformulering i realtid.</li>
<li><strong>Nackdel:</strong> Saknar SEO-funktioner och varumärkesröst för innehållsmarknadsföring.</li>
<li><strong>Nackdel:</strong> Flera användarrapporter om svårigheter att avsluta prenumerationen.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratis (Basic): cirka 10 omformuleringar/dag, 3 sammanfattningar/mån, obegränsad stavnings- och grammatikkontroll. Betalda nivåer anges olika mellan källor — en mellannivå kring 6,99 USD/mån nämns av en källa, medan toppnivån ("Unlimited") beskrivs som allt från 9,99 till 19,99 USD/mån beroende på källa och om den höjts under året. Kontrollera aktuellt pris på wordtune.com.</p>

<h2>För vem passar Wordtune?</h2>
<p>Wordtune passar bäst för den som vill ha löpande skrivhjälp direkt i Gmail, Google Docs eller Word, snarare än ett fristående innehållsverktyg för marknadsföring eller SEO.</p>

<h2>Vårt omdöme</h2>
<p>Wordtune gör sin kärnuppgift — realtidsomformulering där du redan skriver — bra. Avsaknaden av SEO-/varumärkesfunktioner och rapporterade avslutningsproblem drar ner helhetsbetyget. Med 7,5 av 10 är det ett smidigt vardagsverktyg snarare än en plattform för innehållsproduktion i större skala.</p>`,
  },
  {
    slug: 'brandwell',
    title: 'BrandWell',
    content_mdx: `<p><strong>Betyg: 7.3/10</strong></p>
<h2>BrandWell recension 2026 — tidigare Content at Scale, SEO-innehåll i stor volym</h2>

<p>BrandWell hette fram till augusti 2024 "Content at Scale" — domänen contentatscale.ai är fortfarande aktiv och säljer samma RankWell AI-SEO-skrivverktyg under det nya varumärket. Det riktar sig mot byråer och företag som vill producera SEO-innehåll i stor volym, inte mot enskilda skribenter.</p>

<h2>Vad är BrandWell?</h2>
<p>BrandWell (RankWell) kör realtids-SERP-analys och bygger en egen research-databas per artikel genom att genomsöka redan topprankande innehåll för sökordet, innan det genererar en artikel med flera språkmodeller tränade för att låta mindre uppenbart AI-skriven.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Realtids-SERP-analys:</strong> Bygger innehåll utifrån vad som redan rankar för sökordet.</li>
<li><strong>Egen AI-röstträning:</strong> Anpassar tonen efter ert varumärke.</li>
<li><strong>Inbyggd AI-detektor:</strong> Med gräns på 2 500 ord i gratisläget.</li>
<li><strong>Promptbibliotek:</strong> Färdiga mallar för olika innehållstyper.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>BrandWell/RankWell är tydligt positionerat mot byråer och bolag som behöver producera SEO-artiklar i volym, inte mot en enskild bloggare. Prissättningen är osedvanligt osäker i källmaterialet — vissa källor anger plantak kring 250–1 500 USD/mån för innehållsplaner, medan andra nämner betydligt lägre nivåer kring 24–249 USD/mån, vilket kan bero på att olika produkter (ren SEO-innehållsplattform kontra fristående detektor/humaniserare) blandas ihop i granskningarna. Namnbytet från Content at Scale till BrandWell gör det också svårare att hitta aktuell, pålitlig information online.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Bygger innehåll utifrån verklig SERP-analys, inte bara en generisk prompt.</li>
<li><strong>Fördel:</strong> Riktad mot byråer som behöver volym, med egen AI-röstträning.</li>
<li><strong>Nackdel:</strong> Mycket motstridiga prisuppgifter mellan källor — osäkert vad verktyget faktiskt kostar.</li>
<li><strong>Nackdel:</strong> Namnbytet till BrandWell gör färsk, pålitlig information svårare att hitta.</li>
</ul>

<h2>Pris och planer</h2>
<p>Prissättningen går inte att fastställa med säkerhet från tillgängliga källor — uppgifterna spänner från cirka 24 USD/mån till 1 500 USD/mån beroende på källa och vilken produkt (innehållsplattform kontra detektor) som avses. Kontrollera aktuellt pris direkt på brandwell.ai eller contentatscale.ai innan ni utvärderar verktyget.</p>

<h2>För vem passar BrandWell?</h2>
<p>BrandWell passar bäst för byråer och företag som behöver producera SEO-optimerat innehåll i stor volym och är beredda att utreda aktuell prissättning direkt med leverantören.</p>

<h2>Vårt omdöme</h2>
<p>BrandWells SERP-baserade angreppssätt är genuint annorlunda än rena promptbaserade skrivverktyg, vilket är en reell styrka för SEO-fokuserad volymproduktion. Den ovanligt rörliga och motstridiga prissättningen, samt namnbytet som gör information svår att verifiera, drar ner betyget tydligt. Med 7,3 av 10 rekommenderar vi att ni begär en offert direkt innan ni utvärderar vidare.</p>`,
  },
  {
    slug: 'prowritingaid',
    title: 'ProWritingAid',
    content_mdx: `<p><strong>Betyg: 8.3/10</strong></p>
<h2>ProWritingAid recension 2026 — djupgående stilanalys för längre texter</h2>

<p>ProWritingAid går längre än en vanlig grammatikkontroll — det analyserar stil, flyt, meningsvariation och vanliga skrivsvagheter över ett helt manuskript, och är särskilt populärt bland författare av längre skönlitterära verk.</p>

<h2>Vad är ProWritingAid?</h2>
<p>ProWritingAid är en skriv- och redigeringsassistent med över 20 olika rapporter (stil, flyt, klyschor, meningslängdsvariation, dialogtaggar med mera), AI-drivna skrivförslag ("Sparks") och integrationer mot Word, Google Docs, Scrivener och webbläsare.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>20+ skrivrapporter:</strong> Djupgående analys av stil, flyt och vanliga skrivsvagheter.</li>
<li><strong>AI Sparks:</strong> AI-drivna omskrivnings- och förbättringsförslag.</li>
<li><strong>Kapitelgranskning (Premium Pro):</strong> AI-driven kritik inspirerad av publicerade författares metoder.</li>
<li><strong>Brett integrationsstöd:</strong> Word, Google Docs, Scrivener och fristående webbredigerare.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>ProWritingAid är ett av de mest grundliga stilanalysverktygen i kategorin — rapporterna går betydligt djupare än en vanlig grammatikkontroll och är särskilt värdefulla för den som redigerar ett längre manuskript snarare än en kort text. Gratisnivån är begränsad till 500 ord åt gången, vilket gör den opraktisk för längre dokument utan uppgradering. Betalning är icke-återbetalningsbar på månadsplanen, så en årsplan eller livstidslicens är nästan alltid det bättre valet ekonomiskt om ni vet att ni kommer använda det regelbundet.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Ovanligt djupgående stil- och flytanalys, inte bara grammatik.</li>
<li><strong>Fördel:</strong> Livstidslicens finns som alternativ till löpande abonnemang.</li>
<li><strong>Nackdel:</strong> Gratisnivån begränsad till 500 ord åt gången.</li>
<li><strong>Nackdel:</strong> Månadsplaner är icke-återbetalningsbara.</li>
</ul>

<h2>Pris och planer</h2>
<p>Premium: 30 USD/mån, 120 USD/år (10 USD/mån), eller 399 USD som livstidslicens. Premium Pro: 36 USD/mån, 144 USD/år (12 USD/mån), eller 699 USD som livstidslicens. Premium Pro lägger till fler dagliga AI Sparks (50 mot 3–5) och kapitelgranskning. Priser enligt flertalet samstämmiga källor november 2026 — kontrollera ändå aktuellt pris på prowritingaid.com.</p>

<h2>För vem passar ProWritingAid?</h2>
<p>ProWritingAid passar bäst för författare och skribenter som redigerar längre manuskript och vill ha djupgående stilanalys, snarare än bara en snabb grammatikkoll av en kort text.</p>

<h2>Vårt omdöme</h2>
<p>ProWritingAid är ett av de mest grundliga redigeringsverktygen i kategorin, med rapporter som går långt bortom vanlig grammatikkontroll. Den begränsade gratisnivån och den icke-återbetalningsbara månadsplanen drar ner betyget marginellt. Med 8,3 av 10 är det ett starkt val för den som redigerar längre texter regelbundet.</p>`,
  },
  {
    slug: 'jenni-ai',
    title: 'Jenni AI',
    content_mdx: `<p><strong>Betyg: 7.7/10</strong></p>
<h2>Jenni AI recension 2026 — skrivverktyg byggt för akademiska texter</h2>

<p>Jenni AI riktar sig till studenter och forskare som skriver akademiska texter med krav på korrekta källhänvisningar, snarare än mot marknadsföringstext eller skönlitteratur.</p>

<h2>Vad är Jenni AI?</h2>
<p>Jenni AI är ett AI-skrivverktyg specialiserat på akademiskt skrivande: autokomplettering av akademisk text, AI-chatt mot uppladdade PDF:er och forskningsunderlag, samt stöd för över 10 000 citeringsstilar.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Akademisk autokomplettering:</strong> Föreslår fortsättning anpassad efter akademisk ton.</li>
<li><strong>PDF-chatt:</strong> Ställ frågor direkt mot uppladdade forskningsunderlag.</li>
<li><strong>10 000+ citeringsstilar:</strong> Brett stöd för akademiska referensformat.</li>
<li><strong>AI-redigering:</strong> Omformulerar och förbättrar akademisk text.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Jenni AI gör ett genuint försök att lösa ett specifikt problem — akademiskt skrivande med korrekta referenser — bättre än generella skrivverktyg. Citeringsstödet är brett, men som med alla AI-skrivverktyg som genererar referenser: varje källhänvisning måste kontrolleras manuellt, eftersom AI-modeller kan hitta på eller felciterar källor. Det är inte ett substitut för egen källkritik, bara ett hjälpmedel för att formatera och strukturera dem.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Byggt specifikt för akademiskt skrivande med brett citeringsstöd.</li>
<li><strong>Fördel:</strong> PDF-chatt mot egna forskningsunderlag.</li>
<li><strong>Nackdel:</strong> AI-genererade citeringar måste alltid verifieras manuellt — risk för felaktiga källor.</li>
<li><strong>Nackdel:</strong> Källor är oense om exakt pris vid löpande månadsbetalning kontra årsbetalning.</li>
</ul>

<h2>Pris och planer</h2>
<p>Gratis: cirka 10 autokompletteringar och 10 PDF-uppladdningar/dag, obegränsade citeringar. Plus och Pro är de betalda nivåerna — källor angerårsbetalda priser kring 12 USD/mån (Plus) och 29 USD/mån (Pro), medan löpande månadsbetalning enligt en källa ligger betydligt högre (cirka 30 respektive 73 USD/mån). Kontrollera aktuellt pris på jenni.ai innan köp.</p>

<h2>För vem passar Jenni AI?</h2>
<p>Jenni AI passar bäst för studenter och forskare som skriver uppsatser, artiklar eller avhandlingar med krav på formell källhänvisning.</p>

<h2>Vårt omdöme</h2>
<p>Jenni AI löser ett tydligt behov för akademiska skribenter bättre än generella verktyg, men kräver fortsatt manuell kontroll av alla citeringar. Den otydliga skillnaden mellan månads- och årspris drar ner betyget något. Med 7,7 av 10 är det ett bra specialverktyg för rätt målgrupp.</p>`,
  },
];

async function main() {
  for (const r of reviews) {
    const path = `/ai-verktyg/${r.slug}`;
    const { data: existing } = await db.from('articles').select('id').eq('path', path).maybeSingle();
    const payload = {
      slug: r.slug,
      path,
      title: r.title,
      content_mdx: r.content_mdx,
      type: 'page' as const,
      category: null,
      parent_slug: PARENT_SLUG,
      published_at: null,
      author_slug: 'nicklas-hallberg',
    };
    if (existing) {
      const { error } = await db.from('articles').update(payload).eq('id', existing.id);
      if (error) { console.error(`FEL (update) ${r.slug}:`, error); continue; }
      console.log(`OK (update): ${r.slug}`);
    } else {
      const { error } = await db.from('articles').insert(payload);
      if (error) { console.error(`FEL (insert) ${r.slug}:`, error); continue; }
      console.log(`OK (insert): ${r.slug}`);
    }
  }
}
main();
