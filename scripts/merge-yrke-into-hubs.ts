/**
 * STEG 2: merga in unik yrkesguide-prosa i destinationshubbarnas content_mdx.
 * Flyttar BEFINTLIG text (inga påhittade verktyg/fakta), strippar self-links,
 * byter kolliderande H2-rubriker. Infogar före hubbens avslutande sektion.
 *   npx tsx scripts/merge-yrke-into-hubs.ts            (dry)
 *   npx tsx scripts/merge-yrke-into-hubs.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const DELETED = ['/ai-verktyg/kundservice/kundtjanst-yrke', '/ai-verktyg/rekrytering/rekryterare', '/ai-verktyg/marknadsforing/marknadsforing-yrke', '/ai-verktyg/juridik/advokat', '/ai-verktyg/ekonomi/bokforare', '/ai-verktyg/ekonomi/revisor'];

const MERGES: { path: string; anchor: string; block: string }[] = [
  {
    path: '/ai-verktyg/kundservice',
    anchor: '<h2>Så väljer du rätt AI-verktyg för kundservice</h2>',
    block: `<h2>Ärendesammanfattning och routing</h2>
<p>Långa mejltrådar och chatthistorik tar tid att sätta sig in i, särskilt om ärendet eskaleras eller byter handläggare. AI kan sammanfatta ett helt ärende på några rader och lyfta fram vad kunden vill ha, vad som har gjorts hittills och vad nästa steg bör vara.</p>
<p>I Salesforce Service Cloud och HubSpot Service Hub finns denna funktion inbyggd. I andra system kan du koppla ett externt AI-verktyg via API som genererar sammanfattningen automatiskt när ett ärende öppnas eller eskaleras.</p>
<p>Routing, alltså att skicka rätt ärende till rätt person eller team, är ett annat område där AI gör stor skillnad. Genom att analysera ärendets innehåll, kundkategori och historik kan systemet avgöra om ärendet hör till teknisk support, fakturaavdelningen eller försäljning. Det minskar fel-routing och kortar hanteringstiden påtagligt.</p>
<h2>Tonläge och flerspråkig kundtjänst</h2>
<p>AI kan anpassa tonläget i ett svar beroende på situation. Ett klagomål kräver ett annat språk än en enkel informationsfråga. Ge verktyget tydliga instruktioner, till exempel: "Svara empatiskt och bekräfta kundens frustration innan du förklarar lösningen." Många plattformar låter dig ange en tonprofil på systemnivå så att alla AI-genererade svar håller ett konsekvent språk.</p>
<p>För flerspråkig kundtjänst är DeepL och Google Translate API numera tillräckligt bra för de flesta europeiska språk. Integrera översättningen direkt i ärendesystemet så att medarbetaren ser kundens originaltext och en svensk version sida vid sida. Kontrollera alltid känsliga svar manuellt – maskinöversättning gör fortfarande misstag på idiom och branschtermer.</p>
<h2>När en människa ska ta över</h2>
<p>AI klarar rutinen men inte det komplexa. Bygg in tydliga eskaleringsregler i era flöden. En bot ska alltid lämna över till en människa när kunden uttrycker stark frustration, ärendet rör juridik eller reklamation, svaret kräver undantag från policy, eller kunden explicit ber att få prata med en person.</p>
<p>Utbilda teamet i att se AI som ett stöd, inte ett filter som kunden måste ta sig igenom. En dålig botupplevelse skadar förtroendet mer än att inte ha en bot alls.</p>
`,
  },
  {
    path: '/ai-verktyg/rekrytering',
    anchor: '<h2>Så väljer du rätt AI-verktyg för rekrytering</h2>',
    block: `<h2>Intervjuförberedelse</h2>
<p>AI kan hjälpa dig att ta fram skräddarsydda intervjufrågor baserade på kandidatens CV och rollens kravprofil. Promptexempel: "Här är CV:t och kravprofilen. Generera tio beteendebaserade intervjufrågor, varav tre som specifikt utforskar kandidatens erfarenhet av projektledning i agila team."</p>
<p>Du kan också använda AI för att förbereda dig på svåra samtal – be verktyget simulera en intervju där kandidaten ger vaga svar, och öva på följdfrågor. Anteckningsverktyg som Otter.ai eller Fireflies.ai transkriberar och sammanfattar intervjuer i realtid, så att du kan fokusera på samtalet i stället för att anteckna.</p>
<h2>Partiskhet, transparens och kandidatupplevelse</h2>
<p>AI i rekrytering är inte neutral per automatik – modeller tränade på historisk data riskerar att förstärka befintliga snedvridningar kring kön, ålder eller etnisk bakgrund. Tre konkreta åtgärder du bör vidta:</p>
<ul>
<li>Anonymisera CV:n innan AI-screening så att namn, foto och kön inte påverkar rankingen.</li>
<li>Granska regelbundet vilka kandidater som sållas bort och leta efter mönster kopplade till demografi.</li>
<li>Kommunicera till kandidater om och hur AI används i processen – det är god praxis och i många fall ett krav.</li>
</ul>
<p>Verktyg som Textio analyserar annonstext i realtid och flaggar formuleringar som tenderar att avskräcka vissa grupper av kandidater, vilket minskar oavsiktlig partiskhet redan när jobbannonsen skrivs. För proaktiv sourcing crawlar verktyg som HireEZ och Findem offentliga källor för att hitta kandidater som inte aktivt söker.</p>
`,
  },
  {
    path: '/ai-verktyg/marknadsforing',
    anchor: '<h2>Så väljer du rätt AI-verktyg för marknadsföring</h2>',
    block: `<h2>Så bygger du ett sammanhållet AI-stött marknadsflöde</h2>
<p>Ett sammanhållet AI-stött marknadsflöde bygger på tre saker: standardiserade promptmallar för varje innehållstyp, ett tydligt kvalitetssteg med mänsklig granskning och ett sätt att mäta om AI-genererat innehåll faktiskt presterar.</p>
<ul>
<li>Dokumentera dina bästa promptar i ett delat bibliotek, exempelvis i Notion eller Confluence.</li>
<li>Sätt ett obligatoriskt granskningssteg innan publicering – minst en person läser igenom och justerar.</li>
<li>Mät performance separat för AI-assisterat och helt manuellt innehåll för att förstå var AI faktiskt tillför värde.</li>
<li>Bygg in feedback-loopar: när ett inlägg presterar ovanligt bra, analysera varför och uppdatera promptmallarna.</li>
</ul>
`,
  },
  {
    path: '/ai-verktyg/juridik',
    anchor: '<h2>Så väljer du rätt AI-verktyg för juridik</h2>',
    block: `<h2>Utkast till juridiska dokument och praxissökning</h2>
<p>Att producera ett första utkast till ett standardavtal, en bolagsordning eller ett yttrande är ett område där AI tillför tydligt värde. Generella AI-textverktyg som ChatGPT eller Claude kan generera utkast utifrån en specifikation, men för juridiskt arbete är det ofta bättre att använda ett verktyg som är anpassat för yrket och tränat på relevant praxis. Beskriv uppdraget tydligt – parter, typ av avtal, jurisdiktion, specialvillkor – och granska alltid utkastet noggrant. AI tenderar att producera välformulerad text som ändå kan innehålla juridiska fel eller sakna jurisdiktionsspecifika krav.</p>
<p>Vid rättsutredning och praxissökning kan verktyg som Harvey AI och Lexis+ AI söka i rättsdatabaser och sammanfatta avgöranden med källhänvisningar. Verifiera alltid att domar och förarbeten som AI:n hänvisar till faktiskt existerar och att citat är korrekt återgivna – hallucinerade rättskällor är ett känt problem. Gör den manuella kontrollen i Karnov, JUNO eller direkt i Domstolsverkets databas.</p>
<h2>Sekretess, tystnadsplikt och ansvar</h2>
<p>Det här är den del som många jurister underskattar när de börjar experimentera med AI. Advokaters tystnadsplikt och reglerna om klientkonfidentialitet ställer hårda krav på vilken data som får lämna kontoret – och i vilken form.</p>
<ul>
<li><strong>Välj rätt plattform.</strong> Använd verktyg som erbjuder databehandlingsavtal (DPA) i linje med GDPR och som garanterar att din data inte används för att träna modellen.</li>
<li><strong>Anonymisera när det är möjligt.</strong> Om du testar ett arbetsflöde i ett generellt AI-verktyg, ersätt klientnamn och känsliga identifierare med fiktiva uppgifter.</li>
<li><strong>Mänsklig kontroll är inte valfritt.</strong> AI-genererade utkast, sammanfattningar och rättsutredningar måste granskas av en kvalificerad jurist innan de används. Ansvaret för det slutliga arbetet ligger alltid hos advokaten.</li>
<li><strong>Interna riktlinjer behövs.</strong> Byråer och juridiska avdelningar bör ha en tydlig AI-policy för vilka verktyg som är godkända, hur klientdata hanteras och hur utdatan kvalitetssäkras.</li>
<li><strong>Håll dig uppdaterad.</strong> Advokatsamfundets vägledning och EU AI Act är utgångspunkter att följa löpande.</li>
</ul>
`,
  },
  {
    path: '/ai-verktyg/ekonomi/bokforing',
    anchor: '<h2>Hur du väljer rätt verktyg: en handlingsplan</h2>',
    block: `<h2>Byråperspektiv: kvittotolkning, rådgivning och skalning</h2>
<p>För redovisningsbyråer och enskilda bokförare ligger den största AI-vinsten i att flytta arbetstid från manuell datainmatning till analys och rådgivning. Utöver de svenska plattformarna ovan lägger många byråer ett separat lager för kvitto- och fakturatolkning: verktyg som Dext (tidigare Receipt Bank), Klippa och AutoEntry låter klienten fotografera ett underlag varpå AI extraherar leverantör, belopp, moms och datum och föreslår kontering. För utläggshantering kategoriserar Yokoy och Spendesk direkt vid köptillfället.</p>
<p>Ett område byråer ofta underskattar är kundkommunikation och rådgivning. AI-verktyg som ChatGPT med anpassade instruktioner eller Microsoft Copilot kan snabbt skriva kundanpassade sammanfattningar av bokslutet, förklara avvikelser i resultatet eller ta fram underlag inför ett rådgivningsmöte. Mata in nyckeltalen efter månadsbokslutet och be om en sammanfattning på klarspråk – klienten får en personlig kommentar i stället för en siffertabell utan kontext. Det är den typen av rådgivning som motiverar ett högre arvode.</p>
<p>För byråer som vill skala är strukturen avgörande. En enmansredovisare kan med rätt verktyg hantera ett avsevärt större klientantal utan att arbetstiden ökar proportionellt. Kartlägg de mest repetitiva och volymmässigt största momenten – vanligtvis kvittotolkning, lönehantering och fakturamatchning – och implementera ett verktyg i taget med uppmätt tidsbesparing. Verktyg som Accountancy Manager eller TaxDome kombinerar klienthantering med AI-stödda arbetsflöden och ger en samlad bild av status per klient.</p>
`,
  },
  {
    path: '/ai-verktyg/ekonomi/redovisning',
    anchor: '<h2>Hur du väljer rätt verktyg — en praktisk handlingsplan</h2>',
    block: `<h2>AI i revisionen: dataanalys, avvikelser och oberoende</h2>
<p>För revisorer ligger AI-värdet i att granska hela datamängder i stället för manuella stickprov. Verktyg som IDEA (CaseWare) och ACL Analytics (Galvanize) är branschstandard för dataanalys och har AI-drivna moduler för mönsterigenkänning. Ett praktiskt flöde: exportera transaktionsdata från klientens affärssystem, kör en Benford-analys kombinerad med duplikat- och lucksökning på faktura- och leverantörsnummer, och låt verktyget ranka transaktioner efter riskpoäng innan du väljer stickprov.</p>
<p>För avvikelse- och riskidentifiering är MindBridge Ai Auditor byggt specifikt för revision och analyserar hela huvudboken för att flagga ovanliga mönster – transaktioner utanför ordinarie arbetstid, runda belopp eller ovanliga kontokombinationer. Varje post får ett riskindex med förklaring. Vid analytisk granskning av månads- och årsbokslut låter Alteryx eller Power BI med AI-tillägg dig automatisera trendanalyser och jämförelser mot budget och föregående period.</p>
<p>För dokumentation och rapportering kan generativa modeller som ChatGPT (företagsversion), Microsoft Copilot eller Claude strukturera arbetspapper och skapa utkast till revisionsberättelser eller management letters enligt ISA-standard – men verifiera alltid att slutdokumentet överensstämmer med faktisk granskning. Revisorn är alltid ansvarig för slutsatserna oavsett verktyg: använd aldrig gratis konsumentversioner för revisorspliktig information, och välj verktyg med EU-datalagring och databehandlingsavtal. Oberoende och professionell skepticism kvarstår som kärnkompetenser som ingen modell kan ersätta.</p>
`,
  },
];

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY ===');
  for (const m of MERGES) {
    const { data } = await db.from('articles').select('content_mdx').eq('path', m.path).maybeSingle();
    const html: string = data?.content_mdx ?? '';
    if (!html) { console.error(`✗ ${m.path}: ingen content_mdx`); process.exit(1); }
    const count = html.split(m.anchor).length - 1;
    if (count !== 1) { console.error(`✗ ${m.path}: ankaret matchade ${count} ggr (ska vara 1) — AVBRYTER`); process.exit(1); }
    for (const d of DELETED) if (m.block.includes(d)) { console.error(`✗ ${m.path}: blocket länkar till raderad sida ${d} — AVBRYTER`); process.exit(1); }
    const next = html.replace(m.anchor, `${m.block}\n${m.anchor}`);
    console.log(`  ✓ ${m.path}: +${next.length - html.length} tecken (anchor 1x, inga döda länkar i block)`);
    if (APPLY) {
      const { error } = await db.from('articles').update({ content_mdx: next }).eq('path', m.path);
      if (error) { console.error(`update failed ${m.path}:`, error.message); process.exit(1); }
    }
  }
  console.log(APPLY ? 'Klart — hubbar uppdaterade.' : '(dry — kör med --apply)');
}
main();
