/**
 * Fördjupar HR-hubbens content_mdx (slug='hr') till samma djup/struktur som
 * de bäst rankande kategori-hubbarna (ai-kod-verktyg, ai-text-verktyg,
 * ai-trading, ai-sakerhet) — tidigare version var bara 2 432 tecken / 3 <h2>,
 * markant tunnare än systerhubbarna. Lägger till tre nya, researchade och
 * verifierade verktyg (Rippling, Culture Amp, Workday/Sana) utan egna
 * recensioner ännu, utöver de två befintliga barnen (Lattice, Deel).
 *
 * Fakta om de nya verktygen kontrollerade mot leverantörernas egna sidor
 * 9 november 2026 (WebFetch mot rippling.com/pricing, cultureamp.com/pricing,
 * workday.com/en-us/artificial-intelligence.html). HiBob och Eightfold
 * undersöktes men uteslöts: HiBobs prissida saknade verifierbara
 * AI-detaljer, och Eightfold är renodlat rekryterings-fokuserat (hör hemma
 * i /ai-verktyg/rekrytering, inte HR-hubben — se kannibaliseringsnotis i
 * kommentaren nedan).
 *
 *   npx tsx scripts/rewrite-hr-hub.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const contentMdx = `
<p>AI för HR skiljer sig från AI för rekrytering genom vad det faktiskt löser. Rekrytering handlar om att hitta och bedöma kandidater innan de är anställda — se vår <a href="/ai-verktyg/rekrytering/">guide till AI för rekrytering</a> för det. HR-rollen börjar där rekryteringen slutar: medarbetarsamtal, mål och prestationsuppföljning, engagemang och kultur, samt lön, anställningsvillkor och compliance för folk som redan är anställda. Det är fyra ganska olika problem, lösta av fyra ganska olika typer av verktyg — och det är därför den här guiden är indelad efter delområde snarare än en enda topplista.</p>

<p>Priserna nedan är kontrollerade mot respektive leverantörs egen prissida i november 2026. Flera av de större HR-plattformarna (Culture Amp, Workday, delar av Rippling) publicerar inga konkreta siffror alls utan säljer offertbaserat — det är i sig en del av vad du behöver väga in när du jämför, och vi är tydliga med var det är fallet nedan.</p>

<h2>De fyra delområdena inom AI för HR</h2>

<p>De flesta "AI för HR"-listor blandar ihop allt i en enda hög. I praktiken spänner fältet över fyra tydligt separata problem, och ett verktyg som är starkt i ett av dem är sällan starkt i de andra tre.</p>

<h3>Performance management — samtal, mål och feedback</h3>

<p>Det här är kärnan i vad de flesta menar med "HR-mjukvara": medarbetarsamtal, OKR/målspårning, kontinuerlig feedback och engagemangsundersökningar. AI:n i den här kategorin är som starkast när den agerar på er egen organisationsdata — era faktiska mål, er faktiska feedback — snarare än att vara en generisk chatbot ovanpå ett formulär. <a href="/ai-verktyg/lattice/">Lattice</a> är vårt tydligaste exempel här.</p>

<h3>Global lön och anställning</h3>

<p>Att anställa och betala folk i flera länder samtidigt är ett juridiskt och administrativt problem snarare än ett AI-problem i grunden — men AI-lagret används allt mer för att automatisera de delar som går att automatisera: kandidatscreening inför internationell rekrytering, generering av anställningserbjudanden enligt lokal lag, och sammanfattning av intervjuer. <a href="/ai-verktyg/deel/">Deel</a> är det tydligaste exemplet i den här kategorin.</p>

<h3>Medarbetarengagemang och kultur</h3>

<p>En tredje kategori fokuserar specifikt på att mäta och förbättra hur medarbetare mår och presterar i grupp — pulsmätningar, engagemangsundersökningar, och AI som läser kvalitativa kommentarer i stor skala för att hitta mönster en människa skulle missa i tusentals fritextsvar. Culture Amp (se nedan) är den mest etablerade aktören här.</p>

<h3>Enterprise HR-automation</h3>

<p>Den fjärde kategorin är stora, enhetliga plattformar som försöker täcka hela HR-, IT- och ekonomifunktionen i ett system, med AI-agenter som automatiserar arbetsflöden över flera avdelningar samtidigt — inte bara inom HR. Rippling och Workday (med sitt Sana-AI-lager) hör hemma här. De är överdimensionerade för ett litet företag men kan ersätta flera separata system för en större organisation.</p>

<h2>Verktyg att känna till</h2>

<h3>Lattice — performance management</h3>

<p><a href="/ai-verktyg/lattice/">Lattice</a> är rätt val om er flaskhals är medarbetarsamtal, mål och engagemang. AI Agent ingår i alla baspaket och agerar på organisationens egen feedback- och måldata snarare än att vara ett allmänt chattverktyg. Sedan partnerskapet med Workday har Lattice fasat ut sina HRIS- och lönemoduler för att renodla sig mot performance management — plattformen är inte längre ett komplett HR-system på egen hand. Per säte och månad, fakturerat årligen, minsta årsavtal 4 000 USD: Performance 10 USD, Goals &amp; OKRs 8 USD, Engagement 4 USD. Läs vår <a href="/ai-verktyg/lattice/">fullständiga recension</a>.</p>

<h3>Deel — global lön och anställning</h3>

<p><a href="/ai-verktyg/deel/">Deel</a> löser anställning och lön i 130+ länder utan att ni behöver sätta upp ett eget bolag i varje land. AI-lagret sitter framför allt i rekryteringsflödet — kandidatscreening, generering av anställningserbjudanden och AI-sammanfattningar av intervjuer — snarare än i den löpande HR-administrationen. Utgångspriser per anställd/contractor och månad: EOR från 599 USD, US PEO från 125 USD, Contractors från 49 USD. Läs vår <a href="/ai-verktyg/deel/">fullständiga recension</a>.</p>

<h3>Rippling — enhetlig HR, IT och ekonomi med AI-agent</h3>

<p>Rippling skiljer sig från de flesta HR-system genom att det explicit spänner över HR, IT och ekonomi i samma plattform, med en inbyggd AI ("Rippling AI") som svarar på frågor tvärs över all er anslutna företagsdata, bygger anpassade rapporter och dashboards, och automatiserar arbetsflöden som sträcker sig över flera system samtidigt. Modulär prissättning från 8 USD per anställd och månad plus en månatlig baskostnad — slutpriset beror på vilka moduler ni väljer och antal anställda, med offert för den exakta siffran. Inget eget "gratis"-läge, men amerikanska VC-finansierade startups kan få sex månader gratis via ett separat startup-program. Ingen egen recension på sajten ännu.</p>

<h3>Culture Amp — engagemang och kultur</h3>

<p>Culture Amp är den mest etablerade specialistplattformen för medarbetarengagemang. AI Coach ingår i alla planer och omvandlar organisationens egen arbetsplatsdata till konkreta insikter och handlingsplaner, bland annat hjälp åt chefer att skriva bättre utvärderingar och hantera svåra samtal. I Engage-produkten läser AI:n igenom fritextkommentarer från medarbetarundersökningar och sammanfattar teman, trender och förslag på nästa steg automatiskt. Ingen prissättning publiceras öppet — ren offert baserad på antal anställda, vilken produkt (Engage eller Perform) och vilken supportnivå (tre nivåer beroende på organisationsstorlek: under 200, 200–999, respektive 1 000+ anställda). Ingen egen recension på sajten ännu.</p>

<h3>Workday — enterprise HR-agenter (Sana)</h3>

<p>Workday har byggt om sitt AI-erbjudande kring en uppsättning namngivna AI-agenter under paraplyet Sana: en Talent Acquisition Agent, Org Development Agent, Workforce Management Agent, Payroll Agent och ett Decision Intelligence-lager, plus Sana Concierge och Sana Coach riktade mot alla anställda snarare än bara HR-avdelningen. Workday publicerar ingen HR-specifik prislista — bolaget beskriver det som "usage-based pricing that aligns to value, not tokens" utan konkreta siffror. Det här är ett verktyg för stora, redan Workday-anknutna organisationer snarare än ett fristående köp. Ingen egen recension på sajten ännu.</p>

<h2>Vad vi kollar på när vi testar HR-verktyg</h2>

<p>Tre saker väger tyngst i vår bedömning. För det första: agerar AI-funktionerna faktiskt på er egen organisationsdata (feedback, mål, personalstatistik) snarare än att vara en generisk assistent ovanpå ett formulär? Det är skillnaden mellan Lattice AI Agent och en vanlig chatbot med HR-tema. För det andra: hur transparent är prissättningen? Som synes ovan är majoriteten av de större HR-plattformarna rent offertbaserade, vilket gör dem svåra att jämföra på förhand utan att faktiskt begära en offert. För det tredje: kräver leverantören mänsklig granskning innan AI-genererat innehåll — lönebeslut, utvärderingar, kompensationsförslag — används skarpt? Det gör både Lattice och flera konkurrenter, och vi ser det som ett sundhetstecken snarare än en begränsning.</p>

<h2>Fallgropar och begränsningar att känna till</h2>

<h3>Personuppgifter och GDPR</h3>

<p>HR-data är bland de mest känsliga personuppgifter ett företag hanterar — lön, hälsa, prestationsbedömningar, i vissa fall uppsägningsskäl. Innan ni rullar ut ett AI-HR-verktyg brett: kontrollera var data faktiskt lagras (EU/EES eller inte), om leverantören erbjuder ett Data Processing Agreement, och om AI-modellen tränas på er data eller bara används för inferens på den. Det är sällan tydligt redovisat på prissidan, utan kräver att ni frågar direkt.</p>

<h3>AI-bias i beslut som påverkar människor</h3>

<p>AI-genererade prestationsutvärderingar, lönerekommendationer eller riskflaggor kan reproducera eller till och med förstärka befintliga bias i underliggande data, om ingen aktivt kontrollerar för det. Det är en starkare anledning än de flesta andra AI-användningsområden att kräva mänsklig granskning innan något går till beslut — inte för att teknik i sig är opålitlig, utan för att konsekvenserna av ett systematiskt fel drabbar riktiga anställda, inte bara en felaktig rapport.</p>

<h3>Överdrivet förtroende för automatiserade people-beslut</h3>
<p>Ett verktyg som ger en snygg, självsäker sammanfattning av en medarbetares prestation är inte samma sak som en korrekt sammanfattning. Behandla AI-genererat HR-innehåll som ett utkast en chef eller HR-ansvarig faktiskt läser och tar ställning till — inte som ett färdigt beslut att klistra in i ett lönesamtal.</p>

<h2>Så väljer du rätt verktyg</h2>

<ul>
  <li><strong>Flaskhalsen är medarbetarsamtal, mål eller engagemang?</strong> Lattice, eller Culture Amp om engagemangsmätning specifikt är kärnan.</li>
  <li><strong>Ni anställer eller betalar folk i flera länder?</strong> Deel löser det juridiska/administrativa problemet, med AI koncentrerat till rekryteringsdelen av flödet.</li>
  <li><strong>Ni vill ersätta flera separata HR/IT/ekonomi-system med ett enda?</strong> Rippling eller Workday — båda kräver en betydligt större investering och onboarding-insats än ett smalt specialistverktyg.</li>
  <li><strong>Flaskhalsen är egentligen att hitta och bedöma kandidater, inte att administrera redan anställda?</strong> Det är ett annat problem — gå till vår <a href="/ai-verktyg/rekrytering/">guide för AI inom rekrytering</a> istället.</li>
  <li><strong>Letar ni efter AI-stöd i löneprocessen specifikt, snarare än HR brett?</strong> Se vår <a href="/ai-verktyg/ekonomi/">ekonomi- och bokföringskategori</a>.</li>
</ul>

<p>Det här är fortfarande en ung lista jämfört med våra större kategorier — vi bygger ut den löpande efterhand som fler HR-specifika AI-verktyg testas på djupet och får egna recensioner. Prioriteringen hittills har varit verktyg med en verifierbar, faktabaserad bild snarare än att fylla listan med namn vi inte kunnat kontrollera ordentligt.</p>
`.trim();

const faq = [
  {
    question: 'Är AI för HR samma sak som AI för rekrytering?',
    answer: 'Nej. Rekrytering handlar om att hitta och bedöma kandidater innan de är anställda. HR är bredare: medarbetarsamtal, prestationsuppföljning, engagemang, lön och compliance för redan anställda. Verktygen skiljer sig åt — se vår separata guide till AI för rekrytering om det är er faktiska flaskhals.',
  },
  {
    question: 'Vad kostar AI-verktyg för HR?',
    answer: 'Varierar kraftigt. Lattice är per säte/månad: Performance 10 USD, Goals & OKRs 8 USD, Engagement 4 USD, minsta årsavtal 4 000 USD. Deel är utgångspriser per anställd: EOR från 599 USD, US PEO från 125 USD. Rippling börjar från 8 USD per anställd och månad plus en baskostnad. Culture Amp och Workday är rent offertbaserade utan publicerat listpris. Kontrollerat november 2026.',
  },
  {
    question: 'Kräver AI-genererade lönebeslut eller utvärderingar mänsklig granskning?',
    answer: 'Hos Lattice, ja — AI-genererade utvärderingar, kompensationsändringar och medarbetaråtgärder måste granskas och godkännas av chef eller HR innan de används. Vi ser det som ett sundhetstecken, inte en begränsning, och rekommenderar att behandla AI-genererat HR-innehåll som ett utkast snarare än ett färdigt beslut generellt.',
  },
  {
    question: 'Kan ett enda verktyg ersätta hela HR-stacken?',
    answer: 'I teorin, med en stor enterprise-plattform som Rippling eller Workday som spänner över HR, IT och ekonomi. I praktiken väljer de flesta mindre och medelstora företag specialistverktyg per delområde — till exempel Lattice för performance management och ett separat lönesystem — eftersom det ger djupare funktionalitet inom varje område utan den onboarding-kostnad en enhetlig enterprise-plattform kräver.',
  },
  {
    question: 'Är HR-AI säkert för känslig medarbetardata?',
    answer: 'Det beror helt på leverantören och hur ni konfigurerar det. Kontrollera var data lagras (EU/EES eller inte), om leverantören erbjuder ett Data Processing Agreement enligt GDPR, och om AI-modellen tränas på er egen data eller bara används för inferens. Detta är sällan tydligt redovisat på en publik prissida — fråga leverantören direkt innan ni rullar ut ett verktyg brett.',
  },
];

async function main() {
  const { error } = await db.from('articles').update({ content_mdx: contentMdx, faq }).eq('slug', 'hr');
  if (error) { console.error('update failed:', error.message); process.exit(1); }

  const { data, error: readErr } = await db.from('articles').select('content_mdx, faq').eq('slug', 'hr').maybeSingle();
  if (readErr) { console.error(readErr.message); process.exit(1); }
  const len = (data?.content_mdx ?? '').length;
  const h2 = ((data?.content_mdx ?? '').match(/<h2/g) ?? []).length;
  const h3 = ((data?.content_mdx ?? '').match(/<h3/g) ?? []).length;
  const faqLen = Array.isArray(data?.faq) ? data.faq.length : 0;
  console.log(`✓ hr uppdaterad: content_mdx ${len} tecken, ${h2} <h2>, ${h3} <h3>, ${faqLen} FAQ-poster.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
