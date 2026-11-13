/**
 * Fristående artikel: Bästa AI för kodgranskning 2026.
 * Byggd separat från /ai-verktyg/ai-kod-verktyg (som redan rankar bra på
 * bredare "AI för kod"-sökningar) för att undvika kannibalisering — samma
 * mönster som fungerade för designer-artikeln (bröts ut, rankar nu #2).
 * Fakta om verktygen verifierade mot leverantörernas egna pricing-sidor,
 * 2026-11-11. published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-ai-kodgranskning-artikel.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const title = 'Bästa AI för kodgranskning 2026 — 6 verktyg jämförda';
const excerpt =
  'AI-kodgranskning är en egen verktygskategori, skild från Copilot och Cursor: AI som läser dina pull requests, flaggar buggar och säkerhetshål, och skriver sammanfattningar automatiskt. Vi jämför CodeRabbit, Qodo, Greptile, GitHub Copilot Code Review, Graphite och Korbit — pris, plattformsstöd och svagheter för varje.';

const content_mdx = `<p>Att skriva kod med AI och att granska kod med AI är två olika saker, och de flesta jämförelser blandar ihop dem.</p>

<p>Copilot, Cursor och Windsurf hjälper dig skriva. En annan kategori av verktyg tar vid när koden ska in i huvudgrenen: AI som läser hela pull requesten i kontext av resten av projektet, flaggar buggar, säkerhetshål och saknad felhantering, och lämnar kommentarerna direkt i GitHub, GitLab eller Bitbucket — ofta med ett klick för att applicera fixen. Det är den kategorin den här artikeln handlar om.</p>

<p>Vi har jämfört sex verktyg som faktiskt gör det här på riktigt, med priser kontrollerade mot leverantörernas egna sidor 2026-11-11.</p>

<div data-block="toplist">{"title":"Kortlistan i korthet","sort":"score","items":[{"review":"qodo","badge":"Störst plattformsstöd","text":"GitHub, GitLab, Bitbucket, Azure DevOps och Gerrit."},{"review":"coderabbit","badge":"Säkerhetsfokus","text":"Dedikerad säkerhetssökning, CLI och agentflöden."},{"review":"greptile","badge":"Self-hosted / gratisnivå","text":"Bäst stöd för self-hosted drift, mest generösa gratisnivån."},{"review":"github-copilot-code-review","badge":"Redan på GitHub?","text":"Ingen extra integration krävs om ni redan har Copilot."},{"review":"korbit-ai","badge":"Billigast per användare","text":"SOC 2 Type 2-certifierat, från 12 USD/användare/mån."},{"review":"graphite","badge":"Stacked PRs","text":"Bäst för team som redan kör Graphites PR-flöde."}],"note":"Priser och betyg kontrollerade mot leverantörernas pricing-sidor 2026-11-11."}</div>

<h2>Vad gör ett AI-kodgranskningsverktyg som en linter inte gör?</h2>

<p>En linter eller statisk analys hittar syntaxfel och stilavvikelser mot regler ni redan definierat. AI-kodgranskning gör något annat: den läser diffen i kontext av resten av kodbasen, förstår vad pull requesten försöker åstadkomma och resonerar om logikfel, saknad felhantering, säkerhetshål och prestandaproblem — samma typ av saker en erfaren kollega flaggar, men på sekunder i stället för timmar.</p>

<p>Ingen av dem ersätter en mänsklig granskare för arkitekturbeslut eller affärslogik. De är bra på det som är mekaniskt att hitta men tidskrävande att läsa igenom manuellt — och svaga på att avgöra om lösningen faktiskt är rätt för ert specifika problem.</p>

<h2>Snabb jämförelse</h2>

<table>
<thead>
<tr><th>Verktyg</th><th>Bäst för</th><th>Gratisnivå</th><th>Från</th></tr>
</thead>
<tbody>
<tr><td>CodeRabbit</td><td>Säkerhetsfokuserad granskning + CLI/agent</td><td><span class="cov cov-no">Nej</span></td><td>$24/mån</td></tr>
<tr><td>Qodo</td><td>Flest plattformar, flera repon</td><td><span class="cov cov-partial">Gratis för öppen källkod</span></td><td>$30/mån + credits</td></tr>
<tr><td>Greptile</td><td>Self-hosted / air-gapped infrastruktur</td><td><span class="cov cov-yes">Ja, 50 credits/mån</span></td><td>$1/credit</td></tr>
<tr><td>GitHub Copilot Code Review</td><td>Redan på GitHub och Copilot</td><td><span class="cov cov-no">Ingår i Copilot</span></td><td>Ingen separat kostnad</td></tr>
<tr><td>Graphite</td><td>Team som redan kör stacked PRs i Graphite</td><td><span class="cov cov-partial">Begränsad (Hobby)</span></td><td>$20/användare/mån</td></tr>
<tr><td>Korbit AI</td><td>Billigast per användare, SOC 2-certifierat</td><td><span class="cov cov-partial">Gratis Max-nivå för öppen källkod</span></td><td>$12/användare/mån</td></tr>
</tbody>
</table>

<div data-block="callout">{"variant":"info","title":"Om priserna","text":"Alla sex verktygen prissätts i USD, ingen erbjuder svensk prissättning. Priser gäller vid årsbetalning där inget annat anges och kan ha ändrats — kontrollera alltid leverantörens egen sida innan ni bestämmer er."}</div>

<h2>Verktygen</h2>

<h3>1. CodeRabbit</h3>

<p><strong>Bäst för:</strong> team som vill ha säkerhetsfokuserad granskning och redan arbetar en del i terminalen.</p>

<p>CodeRabbit sammanfattar varje pull request, går igenom ändringarna rad för rad och söker aktivt efter säkerhetsproblem. Det som skiljer CodeRabbit från flera konkurrenter är stödet för CLI och agentbaserade arbetsflöden utöver själva GitHub/GitLab-integrationen — granskningen kan triggas innan koden ens är en pull request.</p>

<p><strong>Nyckelfunktioner:</strong> PR-sammanfattningar, radvis granskning, dedikerad säkerhetssökning, CLI, IDE-integration.</p>

<p><strong>Svagheten:</strong> inget stöd för Bitbucket eller Azure DevOps — fungerar bara om teamet är på GitHub eller GitLab. Ingen gratisnivå att testa på innan köp.</p>

<p><strong>Pris:</strong> cirka 24–90 USD per utvecklare och månad beroende på nivå (årsbetalning). Enterprise-prissättning på förfrågan.</p>

<p><a href="/ai-verktyg/coderabbit">Läs vår fullständiga recension av CodeRabbit →</a></p>

<h3>2. Qodo</h3>

<p><strong>Bäst för:</strong> team med blandad eller icke-GitHub-infrastruktur som vill ha ett verktyg som täcker allt.</p>

<p>Qodo (tidigare Codium AI) är det verktyg i jämförelsen med bredast plattformsstöd — GitHub, GitLab, Bitbucket, Azure DevOps och, för Enterprise-kunder, Gerrit. Granskningen bygger på kontext från hela kodbasen snarare än bara diffen, och stöder flera repon samtidigt, vilket gör det användbart för organisationer med många mindre tjänster snarare än en enda monolit.</p>

<p><strong>Nyckelfunktioner:</strong> brett plattformsstöd inklusive Gerrit, granskning över flera repon, integration mot agentverktyg som Claude Code, gratis för kvalificerade open source-projekt.</p>

<p><strong>Svagheten:</strong> prismodellen är delvis kreditbaserad ovanpå grundavgiften, vilket gör totalkostnaden svårare att förutse än konkurrenternas platta per-användare-pris om teamet genererar många granskningar.</p>

<p><strong>Pris:</strong> Pro Team från 30 USD per månad plus cirka 0,015 USD per credit. Enterprise på förfrågan.</p>

<p><a href="/ai-verktyg/qodo">Läs vår fullständiga recension av Qodo →</a></p>

<h3>3. Greptile</h3>

<p><strong>Bäst för:</strong> team med krav på self-hosted eller air-gapped infrastruktur av säkerhetsskäl.</p>

<p>Greptile är kreditbaserat med tre granskningsdjup (Base, Plus, Apex) och sticker ut genom sitt Enterprise-stöd för självhostade plattformar: GitHub Enterprise, GitLab Self-Managed, Bitbucket Data Center, Gitea och till och med Perforce. Det gör det till ett av få alternativ för team som av regulatoriska skäl inte kan skicka kod till en extern molntjänst.</p>

<p><strong>Nyckelfunktioner:</strong> tre granskningsnivåer efter djup/kostnad, brett stöd för självhostad Git-infrastruktur, mest generös gratisnivå i jämförelsen.</p>

<p><strong>Svagheten:</strong> kreditmodellen gör att kostnaden skalar direkt med hur mycket teamet granskar — ett högaktivt team kan hamna högre i totalkostnad än en platt per-användare-plan.</p>

<p><strong>Pris:</strong> gratis upp till 50 credits per månad. Pro kostar 1 USD per credit. Enterprise på förfrågan.</p>

<p><a href="/ai-verktyg/greptile">Läs vår fullständiga recension av Greptile →</a></p>

<h3>4. GitHub Copilot Code Review</h3>

<p><strong>Bäst för:</strong> team som redan betalar för Copilot och vill ha kodgranskning utan ytterligare verktyg eller integration.</p>

<p>Funktionen granskar pull requests över flera filer, flaggar buggar, säkerhetsproblem och stilavvikelser, och föreslår fixar som går att applicera med ett klick direkt i GitHub-gränssnittet. Eftersom det är inbyggt i Copilot finns ingen separat installation, inget nytt konto och inget ytterligare verktyg att administrera.</p>

<p><strong>Nyckelfunktioner:</strong> granskning direkt i GitHub-flödet, en-klicks-fixar, MCP-anpassning för egna regler.</p>

<p><strong>Svagheten:</strong> fungerar bara inom GitHub. Inget stöd för GitLab, Bitbucket eller Azure DevOps — en av de vanligaste anledningarna till att team med blandad infrastruktur väljer Qodo eller Korbit i stället.</p>

<p><strong>Pris:</strong> ingen separat kostnad, ingår i Copilot-planerna.</p>

<p><a href="/ai-verktyg/github-copilot-code-review">Läs vår fullständiga recension av GitHub Copilot Code Review →</a></p>

<h3>5. Graphite</h3>

<p><strong>Bäst för:</strong> team som redan använder Graphite för stacked pull requests och vill ha granskningen i samma flöde.</p>

<p>Graphite är i grunden känt för att hantera stackade, mindre pull requests snarare än stora monolitiska diffar, och har byggt in AI-granskning direkt i det flödet. Nyttan är tydligast för team som redan standardiserat på Graphites PR-arbetssätt — för alla andra är det en extra plattform att lära sig bara för granskningsdelen.</p>

<p><strong>Nyckelfunktioner:</strong> AI-granskning integrerad i stacked-PR-flödet, Slack- och VSCode-integration, MCP-stöd.</p>

<p><strong>Svagheten:</strong> gratisnivån (Hobby) är begränsad, och verktyget ger mest värde om teamet redan anammat Graphites sätt att strukturera pull requests — annars konkurrerar det med enklare, billigare alternativ som gör samma granskningsjobb.</p>

<p><strong>Pris:</strong> Starter 20 USD, Team 40 USD per användare och månad (årsvis). Enterprise på förfrågan.</p>

<p><a href="/ai-verktyg/graphite">Läs vår fullständiga recension av Graphite →</a></p>

<h3>6. Korbit AI</h3>

<p><strong>Bäst för:</strong> team som vill ha certifierad datahantering till lägst pris per användare i jämförelsen.</p>

<p>Korbit fokuserar på att hitta buggar och generera PR-beskrivningar och granskningsrapporter automatiskt, och är SOC 2 Type 2-certifierat — relevant för team med formella krav på hur data hanteras. Det är också billigast per användare av de sex verktygen med en platt, förutsägbar prismodell.</p>

<p><strong>Nyckelfunktioner:</strong> buggdetektering, automatiska PR-beskrivningar och rapporter, SOC 2 Type 2-certifiering, gratis Max-nivå för open source.</p>

<p><strong>Svagheten:</strong> mindre etablerat namn än CodeRabbit och Qodo, vilket betyder tunnare dokumentation och färre tredjepartsintegrationer att luta sig mot om något krånglar.</p>

<p><strong>Pris:</strong> Pro från 12 USD, Max från 18 USD per användare och månad (årsvis). Gratis Max-nivå för open source-projekt.</p>

<p><a href="/ai-verktyg/korbit-ai">Läs vår fullständiga recension av Korbit AI →</a></p>

<h2>Så väljer du</h2>

<p><strong>Redan helt på GitHub, vill ha minsta möjliga friktion:</strong> GitHub Copilot Code Review, om ni redan betalar för Copilot. Ingen extra integration.</p>

<p><strong>Blandad eller icke-GitHub-infrastruktur (GitLab, Bitbucket, Azure DevOps):</strong> Qodo har bredast stöd. Korbit är billigare om ni inte behöver Gerrit-stöd.</p>

<p><strong>Self-hosted eller air-gapped av säkerhets- eller regulatoriska skäl:</strong> Greptile Enterprise eller Qodos Gerrit-stöd är de två alternativen byggda för det.</p>

<p><strong>Vill bara testa utan att betala:</strong> Greptiles gratisnivå (50 credits/månad) är mest generös av de sex.</p>

<p><strong>Redan på Graphite för stacked PRs:</strong> Graphite, eftersom granskningen då ligger i samma flöde ni redan använder.</p>

<p>Behöver du istället en bredare genomgång av AI-verktyg för själva kodskrivandet — autocomplete, kontextmedvetna editorer och agentbaserade verktyg som Cursor, Copilot och Windsurf — har vi en separat guide: <a href="/ai-verktyg/ai-kod-verktyg">Bästa AI-kodverktygen 2026</a>.</p>`;

const faq = [
  {
    question: 'Vilket AI-verktyg för kodgranskning är bäst 2026?',
    answer: 'Det beror på infrastruktur. Är ni helt på GitHub och redan har Copilot räcker GitHub Copilot Code Review. Har ni blandad infrastruktur (GitLab, Bitbucket, Azure DevOps) har Qodo bredast stöd. Kräver ni self-hosted eller air-gapped drift är Greptile Enterprise eller Qodos Gerrit-stöd de enda alternativen.',
  },
  {
    question: 'Vad är skillnaden mellan AI-kodgranskning och verktyg som Copilot eller Cursor?',
    answer: 'Copilot och Cursor hjälper dig skriva kod. AI-kodgranskning är en separat kategori som läser hela pull requesten i kontext av projektet och flaggar buggar, säkerhetshål och saknad felhantering innan koden går in i huvudgrenen — ett komplement till mänsklig granskning, inte till kodskrivandet.',
  },
  {
    question: 'Finns det gratis AI-verktyg för kodgranskning?',
    answer: 'Greptile har den mest generösa gratisnivån, 50 credits i månaden, vilket räcker för mindre team eller sidoprojekt. Qodo och Korbit erbjuder gratis nivåer för kvalificerade open source-projekt. GitHub Copilot Code Review kostar ingenting extra om ni redan har en Copilot-licens.',
  },
  {
    question: 'Fungerar AI-kodgranskning med GitLab eller Bitbucket, inte bara GitHub?',
    answer: 'Ja, men inte alla verktyg. Qodo, Korbit och Greptile (Enterprise) stöder GitLab och Bitbucket. CodeRabbit stöder GitHub och GitLab men inte Bitbucket. GitHub Copilot Code Review fungerar uteslutande inom GitHub.',
  },
  {
    question: 'Ersätter AI-kodgranskning mänsklig kodgranskning helt?',
    answer: 'Nej. Verktygen är bra på att hitta mekaniska problem — buggar, saknad felhantering, säkerhetshål — men svaga på att bedöma arkitekturbeslut och om lösningen faktiskt är rätt för projektets specifika behov. De fungerar som ett snabbt första filter innan en människa tittar på det som faktiskt kräver omdöme.',
  },
];

async function main() {
  const row = {
    slug: 'basta-ai-for-kodgranskning-2026',
    title,
    excerpt,
    content_mdx,
    faq,
    category: 'teknik-modeller',
    tags: ['AI-kodgranskning', 'CodeRabbit', 'Qodo', 'Greptile', 'Kodgranskning'],
    featured_image: null,
    type: 'post',
    path: '/basta-ai-for-kodgranskning-2026',
    parent_slug: null,
    affiliate_url: null,
    published_at: null,
    seo_title: 'Bästa AI för kodgranskning 2026 — 6 verktyg jämförda',
    seo_description: excerpt,
    author_slug: 'nicklas-hallberg',
  };
  const { data: existing } = await db.from('articles').select('slug').eq('path', row.path).maybeSingle();
  const { error } = existing
    ? await db.from('articles').update(row).eq('path', row.path)
    : await db.from('articles').insert(row);
  if (error) { console.error(error); process.exit(1); }
  console.log(`OK: artikel ${existing ? 'uppdaterad' : 'skapad'}, published_at=null — väntar på granskning + bild.`);
}
main();
