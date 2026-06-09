/**
 * Positionera om /ai-verktyg/ai-kod-verktyg/utvecklare som en WORKFLOW-/
 * användningsguide (inte en verktygs-topplista). Den topplistan bor på hubben
 * /ai-verktyg/ai-kod-verktyg/ — dit pekar vi som kanonisk källa för
 * "verktygs-delen" via ett fristående block-länk-kort (renderas av
 * lib/article-html.ts → toolLinkCards som ett "Läs mer →"-kort).
 *
 * Uppdaterar title, seo_title, content_mdx och updated_at. Idempotent.
 *
 *   npx tsx scripts/update-utvecklare-guide.ts
 *   DRY=1 npx tsx scripts/update-utvecklare-guide.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const DRY = !!process.env.DRY;
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PATH = '/ai-verktyg/ai-kod-verktyg/utvecklare';
const HUB = '/ai-verktyg/ai-kod-verktyg/';

const TITLE = 'Så använder du AI som utvecklare 2026';
const SEO_TITLE = 'AI för utvecklare 2026 – Workflow och tips';

const CONTENT = `<p>AI har på kort tid blivit ett standardverktyg i många utvecklares vardag. Inte för att det ersätter programmeringskunskap, utan för att det tar bort friktion i de moment som annars stjäl tid: att skriva boilerplate, leta efter en bugg i en lång stack trace eller formulera dokumentation för en funktion man skrev för tre månader sedan. Den här guiden handlar om <strong>hur du faktiskt arbetar med AI</strong> i utvecklingsprocessen — inte om vilket verktyg som är "bäst".</p>

<p>Letar du efter en jämförelse av själva verktygen? Vår topplista rankar och recenserar de bästa alternativen — använd den som utgångspunkt och kom sedan tillbaka hit för arbetsflödet.</p>

<p><a href="${HUB}">Topplista: bästa AI-kodverktygen 2026</a></p>

<h2>Kodkomplettering och agentisk kodning</h2>

<p>Det enklaste sättet att komma igång är via en AI-assistent direkt i editorn. Den ger förslag i realtid medan du skriver och kan slutföra hela funktioner baserat på din kommentar eller funktionssignatur. Poängen är inte vilket verktyg du väljer, utan att du lär dig styra det: skriv tydliga signaturer och kommentarer, och acceptera förslag selektivt i stället för att svälja allt.</p>

<p>Agentisk kodning tar det ett steg längre. En agent kan ta emot ett mål i naturligt språk, skriva kod, köra tester och iterera på resultaten utan att du är involverad i varje steg. Det passar bra för väldefinierade deluppgifter — skapa en REST-endpoint med tillhörande validering, skriva migrationer eller sätta upp en ny komponent utifrån ett designsystem. Ett praktiskt arbetsflöde: skriv en kort specifikation i en kommentar direkt i filen, låt agenten generera ett första utkast och granska sedan koden innan du kör den. Behandla det som en junior kollega som skriver snabbt men ibland missar kantfall.</p>

<h2>Refaktorering</h2>

<p>AI är särskilt användbar för refaktorering av kod som fungerar men är svår att underhålla. Klistra in en funktion i din assistent och be om specifika förbättringar: bryt ut logik i separata funktioner, ersätt imperativ kod med en mer deklarativ stil, eller anpassa koden till ett visst designmönster.</p>

<p>Var tydlig med kontexten. Berätta vilket språk och version du använder, vilket ramverk koden lever i och vad du vill uppnå. En prompt som "refaktorera den här Python-funktionen så att den följer single responsibility principle och är enklare att testa" ger ett mer användbart svar än en öppen fråga om hur koden kan förbättras.</p>

<h2>Felsökning</h2>

<p>Att klistra in ett felmeddelande och sin kod i en AI-assistent är numera ett standardsteg i felsökning. Verktyget kan snabbt identifiera vanliga orsaker, föreslå var felet troligen uppstår och ge ett korrigerat kodexempel. Det fungerar bra för klassiska fel som typinkonsekvenser, felaktig asynkronhantering eller saknade null-checks.</p>

<p>För mer komplex felsökning, till exempel race conditions eller prestandaproblem, är det bättre att ge AI en detaljerad beskrivning av systemets beteende snarare än att bara skicka över kod. Beskriv vad som händer, under vilka omständigheter och vad du redan har provat. Det hjälper modellen att resonera mer strukturerat kring problemet.</p>

<h2>Tester</h2>

<p>Att skriva tester är ett av de områden där AI sparar mest tid. Be assistenten generera enhetstester för en funktion, inklusive edge cases. Ange vilket testramverk du använder, till exempel Jest, Pytest eller JUnit, så anpassas koden direkt.</p>

<p>Var medveten om att AI-genererade tester ibland testar implementationen snarare än beteendet, eller missar viktiga scenarion. Granska alltid testerna kritiskt och komplettera med egna fall där du vet att systemet är känsligt.</p>

<h2>Dokumentation och code review</h2>

<p>AI kan generera JSDoc, docstrings och README-avsnitt snabbt och konsekvent. Det är ett bra sätt att hålla dokumentationen aktuell i en kodbas där den annars tenderar att eftersläpa. Ge koden som input och be om dokumentation i det format du använder.</p>

<p>Vid code review kan du använda AI för en första genomläsning innan du skickar en pull request. Be modellen identifiera potentiella buggar, säkerhetsproblem eller avvikelser från era konventioner. Det är inte en ersättning för mänsklig granskning, men det fångar upp uppenbara missar tidigt. Skriver du teknisk text kring din kod kan <a href="/ai-verktyg/ai-text-verktyg/">AI-textverktyg</a> underlätta arbetet med specifikationer och teknisk kommunikation.</p>

<h2>Kvalitet, säkerhet och mänsklig kontroll</h2>

<p>Några saker är viktiga att ha med sig när du integrerar AI i ditt arbetsflöde:</p>

<ul>
  <li><strong>Granska alltid genererad kod.</strong> AI kan introducera buggar, använda inaktuella API:er eller missa säkerhetsaspekter. Kör statisk analys och tester som du hade gjort med all annan kod.</li>
  <li><strong>Var försiktig med vad du delar.</strong> Skicka inte känslig affärslogik, personuppgifter eller hemliga nycklar till externa AI-tjänster. Kontrollera vilka datahanteringsvillkor din leverantör har, särskilt i förhållande till GDPR och eventuella avtal med kunder.</li>
  <li><strong>Behåll ägarskapet över arkitekturbeslut.</strong> AI är bra på att lösa väldefinierade problem, men långsiktiga designval kräver mänskligt omdöme och förståelse för ert specifika system.</li>
  <li><strong>Dokumentera vad som är AI-genererat</strong> om din organisation kräver det, och håll koll på licenser för kod som genereras av verktyg som tränats på öppen källkod.</li>
</ul>

<p>AI gör dig inte till en bättre programmerare automatiskt, men det frigör tid från repetitiva uppgifter och sänker tröskeln för att hålla hög kvalitet på dokumentation och tester. Det ger dig mer utrymme att fokusera på de delar av arbetet där ditt omdöme faktiskt gör skillnad. När du väl har hittat ditt arbetssätt är nästa steg att välja rätt verktyg för jobbet:</p>

<p><a href="${HUB}">Jämför alla AI-kodverktyg i vår topplista</a></p>`;

async function main() {
  const updated_at = new Date().toISOString();
  const patch = { title: TITLE, seo_title: SEO_TITLE, content_mdx: CONTENT, updated_at };

  console.log(`PATH:      ${PATH}`);
  console.log(`title:     ${TITLE}`);
  console.log(`seo_title: ${SEO_TITLE} (${SEO_TITLE.length} tecken)`);
  console.log(`content:   ${CONTENT.length} tecken`);
  console.log(`kanonisk länk → ${HUB} (block-länk-kort, 2 st)`);

  if (DRY) { console.log('\n[DRY] inget skrivet.'); return; }

  const { data, error } = await db.from('articles').update(patch).eq('path', PATH).select('id,path');
  if (error) { console.error(`FAIL: ${error.message}`); process.exit(1); }
  if (!data?.length) { console.error(`Ingen rad för ${PATH}`); process.exit(1); }
  console.log(`\nOK — uppdaterade id ${data[0].id}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
