/**
 * 6 recensionssidor för AI-kodgranskningsverktyg (PR-review), för att göra
 * basta-ai-for-kodgranskning-2026 till en riktig listicle med fungerande
 * toplist-block (kräver publicerade recensionssidor, lib/review-refs.ts).
 * parent_slug='ai-kodgranskning' (inte 'ai-kod-verktyg') — undviker att dessa
 * nischade granskningsverktyg automatiskt dyker upp i den stora ai-kod-verktyg
 * hubbens egen topplista. Fakta verifierade mot leverantörernas pricing-sidor
 * 2026-11-11. published_at=null — väntar på granskning + bild.
 *
 *   npx tsx scripts/seed-ai-kodgranskning-reviews.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PARENT_SLUG = 'ai-kodgranskning';

type ReviewRow = {
  slug: string;
  title: string;
  content_mdx: string;
};

const reviews: ReviewRow[] = [
  {
    slug: 'coderabbit',
    title: 'CodeRabbit',
    content_mdx: `<p><strong>Betyg: 8.4/10</strong></p>
<h2>CodeRabbit recension 2026 — säkerhetsfokuserad kodgranskning med CLI-stöd</h2>

<p>CodeRabbit är ett av de mest etablerade namnen inom AI-kodgranskning och har byggt sitt rykte på att kombinera vanlig PR-granskning med en dedikerad säkerhetssökning. Det som skiljer verktyget från flera konkurrenter är stödet för CLI och agentbaserade arbetsflöden — granskningen kan triggas innan koden ens blivit en pull request.</p>

<h2>Vad är CodeRabbit?</h2>
<p>CodeRabbit är en AI-driven kodgranskare som kopplas in på GitHub eller GitLab och automatiskt går igenom varje pull request: sammanfattar förändringarna, flaggar buggar och letar aktivt efter säkerhetsproblem. Utöver integrationen i PR-flödet erbjuder CodeRabbit en CLI och IDE-integration, vilket gör det möjligt att få samma granskning direkt i editorn eller terminalen innan koden skickas vidare.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>PR-sammanfattningar:</strong> Varje pull request får en automatisk sammanfattning av vad ändringen gör och varför.</li>
<li><strong>Radvis granskning:</strong> Kommentarer lämnas direkt på de rader där problem hittas.</li>
<li><strong>Dedikerad säkerhetssökning:</strong> Söker aktivt efter säkerhetshål, inte bara allmänna buggar.</li>
<li><strong>CLI och IDE-integration:</strong> Granskning utanför själva PR-flödet, för den som vill fånga problem tidigare.</li>
<li><strong>Agentbaserade arbetsflöden:</strong> Stöd för att kopplas in i mer autonoma kodningsflöden.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Säkerhetssökningen är CodeRabbits tydligaste styrka jämfört med generella granskningsverktyg — den flaggar aktivt mönster som SQL-injektion och osäker hantering av användarinput, inte bara stilfel. CLI-stödet gör det möjligt att få feedback innan en pull request ens öppnas, vilket kortar loopen för utvecklare som vill fånga problem tidigt. Begränsningen är plattformsstödet: CodeRabbit fungerar bara med GitHub och GitLab, så team på Bitbucket eller Azure DevOps behöver titta på andra alternativ.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Dedikerad säkerhetssökning utöver vanlig buggranskning.</li>
<li><strong>Fördel:</strong> CLI gör det möjligt att granska kod innan den är en pull request.</li>
<li><strong>Fördel:</strong> Stöd för agentbaserade arbetsflöden, inte bara klassiska PR:er.</li>
<li><strong>Nackdel:</strong> Inget stöd för Bitbucket eller Azure DevOps.</li>
<li><strong>Nackdel:</strong> Ingen gratisnivå — man måste betala för att testa.</li>
</ul>

<h2>Pris och planer</h2>
<p>CodeRabbit kostar mellan cirka 24 och 90 USD per utvecklare och månad beroende på nivå, vid årsbetalning. Enterprise-prissättning ges på förfrågan. Det finns ingen gratisnivå att prova verktyget på innan köp.</p>

<h2>För vem passar CodeRabbit?</h2>
<p>CodeRabbit passar bäst för team som redan är på GitHub eller GitLab och vill prioritera säkerhetsgranskning som en integrerad del av PR-flödet, snarare än ett separat steg. Team som redan arbetar med agentbaserade kodverktyg eller vill granska kod via CLI innan den blir en pull request har extra nytta av verktyget.</p>

<h2>Vårt omdöme</h2>
<p>CodeRabbit är ett genomarbetat verktyg med en tydlig profil: säkerhet och flexibilitet i var granskningen sker, snarare än bredast möjliga plattformsstöd. Avsaknaden av Bitbucket- och Azure DevOps-stöd samt avsaknaden av en gratisnivå är verktygets tydligaste begränsningar. Med ett betyg på 8,4 av 10 är CodeRabbit ett starkt förstahandsval för GitHub/GitLab-team som prioriterar säkerhet.</p>`,
  },
  {
    slug: 'qodo',
    title: 'Qodo',
    content_mdx: `<p><strong>Betyg: 8.5/10</strong></p>
<h2>Qodo recension 2026 — bredast plattformsstöd för AI-kodgranskning</h2>

<p>Qodo, tidigare känt som Codium AI, sticker ut i kategorin genom att stödja fler Git-plattformar än någon annan konkurrent: GitHub, GitLab, Bitbucket, Azure DevOps och, för Enterprise-kunder, även Gerrit. Det gör det till förstahandsvalet för organisationer som inte är renodlat på GitHub.</p>

<h2>Vad är Qodo?</h2>
<p>Qodo är en AI-driven kodgranskare som bygger sin analys på kontext från hela kodbasen snarare än bara den aktuella diffen. Verktyget stöder granskning över flera repon samtidigt, vilket gör det särskilt användbart för organisationer med många mindre tjänster snarare än en enda monolit. Qodo kopplas också in i IDE:er och agentverktyg som Claude Code.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Bredast plattformsstöd i kategorin:</strong> GitHub, GitLab, Bitbucket, Azure DevOps och Gerrit (Enterprise).</li>
<li><strong>Granskning över flera repon:</strong> Kontext hämtas inte bara från den aktuella diffen.</li>
<li><strong>Integration mot agentverktyg:</strong> Kopplas in i arbetsflöden byggda kring Claude Code och liknande verktyg.</li>
<li><strong>Gratis för open source:</strong> Kvalificerade OSS-projekt kan använda Qodo utan kostnad.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Det breda plattformsstödet är Qodos tydligaste konkurrensfördel — det är i princip det enda verktyget i kategorin som fungerar lika bra oavsett om organisationen kör GitHub, GitLab, Bitbucket, Azure DevOps eller till och med Gerrit. Kontext över flera repon gör granskningen mer träffsäker i mikroservicearkitekturer. Baksidan är prismodellen: grundavgiften kombineras med en kreditbaserad kostnad, vilket gör den totala månadskostnaden svårare att förutse än konkurrenternas platta per-användare-pris, särskilt för team som genererar många granskningar.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Stöder fler Git-plattformar än någon konkurrent, inklusive Gerrit.</li>
<li><strong>Fördel:</strong> Granskar kontext över flera repon samtidigt.</li>
<li><strong>Fördel:</strong> Gratis för kvalificerade open source-projekt.</li>
<li><strong>Nackdel:</strong> Delvis kreditbaserad prissättning gör totalkostnaden svårare att förutse.</li>
<li><strong>Nackdel:</strong> Högaktiva team kan hamna dyrare totalt än med en platt plan.</li>
</ul>

<h2>Pris och planer</h2>
<p>Qodo Pro Team kostar från 30 USD per månad plus cirka 0,015 USD per credit. Enterprise-prissättning (inklusive Gerrit-stöd) ges på förfrågan. Kvalificerade open source-projekt kan använda tjänsten gratis.</p>

<h2>För vem passar Qodo?</h2>
<p>Qodo passar bäst för organisationer med blandad eller icke-GitHub-infrastruktur, eller för team som arbetar med många repon samtidigt och vill ha konsekvent granskning över alla. Enterprise-kunder som kör Gerrit har inget bättre alternativ i den här jämförelsen.</p>

<h2>Vårt omdöme</h2>
<p>Qodo är det mest flexibla verktyget i jämförelsen när det kommer till var det kan driftsättas, utan att ge avkall på granskningsdjup. Den kreditbaserade prismodellen är verktygets tydligaste svaghet för team som vill ha förutsägbar kostnad. Med ett betyg på 8,5 av 10 är Qodo förstahandsvalet för alla som inte är renodlat på GitHub.</p>`,
  },
  {
    slug: 'greptile',
    title: 'Greptile',
    content_mdx: `<p><strong>Betyg: 8.2/10</strong></p>
<h2>Greptile recension 2026 — kodgranskning för self-hosted infrastruktur</h2>

<p>Greptile är ett kreditbaserat AI-kodgranskningsverktyg som sticker ut genom sitt Enterprise-stöd för självhostade Git-plattformar — ett av få alternativ i kategorin för team som av säkerhets- eller regulatoriska skäl inte kan skicka kod till en extern molntjänst.</p>

<h2>Vad är Greptile?</h2>
<p>Greptile granskar pull requests med tre valbara granskningsdjup: Base, Plus och Apex, där varje nivå kostar olika mycket i credits. Verktyget är byggt för att kunna driftsättas även mot självhostad infrastruktur — GitHub Enterprise, GitLab Self-Managed, Bitbucket Data Center, Gitea och till och med Perforce stöds på Enterprise-nivån.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Tre granskningsnivåer:</strong> Base, Plus och Apex, valbara efter behov av djup kontra kostnad.</li>
<li><strong>Brett stöd för självhostad infrastruktur:</strong> GitHub Enterprise, GitLab Self-Managed, Bitbucket Data Center, Gitea, Perforce.</li>
<li><strong>Generös gratisnivå:</strong> 50 credits per månad utan kostnad.</li>
<li><strong>Kreditbaserad skalbarhet:</strong> Betala för den granskningsvolym teamet faktiskt använder.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Greptiles starkaste kort är stödet för självhostad och air-gapped infrastruktur — ingen annan i den här jämförelsen täcker lika många självhostade plattformar, inklusive det ovanliga Perforce-stödet. Gratisnivån på 50 credits i månaden räcker gott för mindre team eller sidoprojekt att utvärdera verktyget utan att betala. Kreditmodellen är samtidigt en risk: kostnaden skalar direkt med hur mycket teamet granskar, vilket kan göra ett högaktivt team dyrare totalt sett än med en platt per-användare-plan.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Mest generösa gratisnivån i kategorin, 50 credits per månad.</li>
<li><strong>Fördel:</strong> Bredast stöd för självhostad infrastruktur, inklusive Perforce.</li>
<li><strong>Fördel:</strong> Tre granskningsnivåer ger kontroll över kostnad kontra djup.</li>
<li><strong>Nackdel:</strong> Kreditmodellen gör kostnaden svår att förutse vid hög granskningsvolym.</li>
<li><strong>Nackdel:</strong> Ett högaktivt team kan hamna dyrare totalt än med en platt plan.</li>
</ul>

<h2>Pris och planer</h2>
<p>Greptiles Starter-nivå är gratis upp till 50 credits per månad. Pro kostar 1 USD per credit. Enterprise-prissättning, inklusive stöd för självhostad infrastruktur, ges på förfrågan.</p>

<h2>För vem passar Greptile?</h2>
<p>Greptile passar bäst för team med krav på self-hosted eller air-gapped drift av säkerhets- eller regulatoriska skäl, samt för mindre team eller sidoprojekt som vill testa AI-kodgranskning gratis innan de binder sig.</p>

<h2>Vårt omdöme</h2>
<p>Greptile löser ett problem de flesta konkurrenter ignorerar: kodgranskning för organisationer som inte kan eller vill skicka kod till en extern molntjänst. Den kreditbaserade prissättningen kräver att man håller koll på volymen för att undvika överraskningar. Med ett betyg på 8,2 av 10 är Greptile ett tydligt förstahandsval för self-hosted-team och ett bra gratisalternativ för alla andra.</p>`,
  },
  {
    slug: 'github-copilot-code-review',
    title: 'GitHub Copilot Code Review',
    content_mdx: `<p><strong>Betyg: 7.9/10</strong></p>
<h2>GitHub Copilot Code Review recension 2026 — kodgranskning utan extra verktyg</h2>

<p>GitHub Copilot Code Review är kodgranskningsfunktionen inbyggd direkt i GitHub Copilot. För team som redan betalar för Copilot är det här det enklaste sättet att få AI-kodgranskning — ingen ny installation, inget nytt konto, inget ytterligare verktyg att administrera.</p>

<h2>Vad är GitHub Copilot Code Review?</h2>
<p>Funktionen granskar pull requests över flera filer direkt i GitHub-gränssnittet, flaggar buggar, säkerhetsproblem och stilavvikelser, och föreslår fixar som går att applicera med ett klick. Den stöder även MCP-anpassning för team som vill styra granskningen efter egna regler.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Granskning direkt i GitHub:</strong> Ingen separat plattform eller inloggning behövs.</li>
<li><strong>En-klicks-fixar:</strong> Föreslagna ändringar går att applicera direkt i gränssnittet.</li>
<li><strong>Granskning över flera filer:</strong> Inte begränsat till en enskild fil i taget.</li>
<li><strong>MCP-anpassning:</strong> Möjlighet att styra granskningen efter egna regler och kontext.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Den stora fördelen är friktionsfriheten: har ni redan Copilot finns funktionen där, utan extra kostnad eller konfiguration. Det gör den till det minsta motståndets väg för team som bara vill komma igång. Begränsningen är tydlig och viktig: funktionen fungerar bara inom GitHub. Team med kod på GitLab, Bitbucket eller Azure DevOps får inget stöd alls. Granskningsdjupet är också mer begränsat än dedikerade verktyg som CodeRabbit eller Qodo, som byggt hela sin produkt kring just kodgranskning.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Ingen separat kostnad om ni redan har en Copilot-licens.</li>
<li><strong>Fördel:</strong> Noll extra installation eller konto att administrera.</li>
<li><strong>Fördel:</strong> En-klicks-fixar direkt i GitHub-gränssnittet.</li>
<li><strong>Nackdel:</strong> Fungerar bara inom GitHub — inget stöd för GitLab, Bitbucket eller Azure DevOps.</li>
<li><strong>Nackdel:</strong> Mindre djup granskning än dedikerade verktyg.</li>
</ul>

<h2>Pris och planer</h2>
<p>Det finns ingen separat kostnad för Code Review-funktionen — den ingår i befintliga Copilot-planer.</p>

<h2>För vem passar GitHub Copilot Code Review?</h2>
<p>Funktionen passar bäst för team som redan är helt på GitHub och redan betalar för Copilot, och som vill ha kodgranskning utan att lägga till ytterligare ett verktyg i stacken. För team med blandad infrastruktur är det inte ett alternativ.</p>

<h2>Vårt omdöme</h2>
<p>GitHub Copilot Code Review är inte det djupaste granskningsverktyget i jämförelsen, men det är det mest friktionsfria för rätt målgrupp. Att det är begränsat till GitHub är en medveten avvägning snarare än en brist — funktionen är byggd för att vara en självklar utökning av Copilot, inte ett fristående produktval. Med ett betyg på 7,9 av 10 är det ett enkelt förstahandsval om ni redan är i GitHub-ekosystemet.</p>`,
  },
  {
    slug: 'graphite',
    title: 'Graphite',
    content_mdx: `<p><strong>Betyg: 7.7/10</strong></p>
<h2>Graphite recension 2026 — AI-granskning i flödet för stackade pull requests</h2>

<p>Graphite är mest känt som verktyg för att hantera stackade, mindre pull requests i stället för stora monolitiska diffar, och har byggt in AI-kodgranskning direkt i det flödet. Nyttan är störst för team som redan standardiserat på Graphites sätt att arbeta.</p>

<h2>Vad är Graphite?</h2>
<p>Graphite är i grunden en plattform för stacked pull requests — att dela upp en stor ändring i flera mindre, sammanlänkade PR:er som granskas och mergas i tur och ordning. AI-granskningen är integrerad i det flödet och kompletteras med Slack- och VSCode-integration samt stöd för MCP-anpassade arbetsflöden.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>AI-granskning i PR-flödet:</strong> Integrerad direkt i Graphites hantering av stackade pull requests.</li>
<li><strong>Slack-integration:</strong> Notiser och granskningsresultat direkt i teamets kommunikationskanal.</li>
<li><strong>VSCode-integration:</strong> Granskning synlig direkt i editorn.</li>
<li><strong>MCP-stöd:</strong> Möjlighet att anpassa arbetsflödet efter egna behov.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>För team som redan kör Graphites stacked-PR-arbetssätt är AI-granskningen ett naturligt tillägg snarare än ett nytt verktyg att lära sig — den ligger där PR-hanteringen redan sker. För alla andra är kalkylen en annan: att byta till Graphite enbart för granskningsdelen innebär att lära sig en ny PR-struktur samtidigt, vilket är en högre tröskel än att lägga till ett fristående granskningsverktyg ovanpå befintligt GitHub- eller GitLab-flöde.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Granskningen ligger i samma flöde som PR-hanteringen för team som redan kör Graphite.</li>
<li><strong>Fördel:</strong> Slack- och VSCode-integration.</li>
<li><strong>Fördel:</strong> Gratis Hobby-nivå att testa på.</li>
<li><strong>Nackdel:</strong> Mest värdefullt bara om teamet redan anammat Graphites stacked-PR-arbetssätt.</li>
<li><strong>Nackdel:</strong> Hobby-nivån är för begränsad för löpande, dagligt bruk.</li>
</ul>

<h2>Pris och planer</h2>
<p>Graphite Hobby är gratis men begränsad. Starter kostar 20 USD och Team-nivån 40 USD per användare och månad vid årsbetalning. Enterprise-prissättning ges på förfrågan.</p>

<h2>För vem passar Graphite?</h2>
<p>Graphite passar bäst för team som redan använder eller överväger stacked pull requests som arbetssätt och vill ha AI-granskningen i samma verktyg. Team som bara letar efter ett fristående granskningsverktyg ovanpå sitt befintliga PR-flöde har sannolikt bättre alternativ i den här jämförelsen.</p>

<h2>Vårt omdöme</h2>
<p>Graphite är inte i första hand ett kodgranskningsverktyg som råkar finnas till salu separat — det är en PR-arbetsflödesplattform där granskningen är en av flera delar. Det gör det till ett utmärkt val för rätt team och ett onödigt omvägsval för alla andra. Med ett betyg på 7,7 av 10 rekommenderar vi det specifikt till team som redan är, eller planerar att bli, Graphite-användare.</p>`,
  },
  {
    slug: 'korbit-ai',
    title: 'Korbit AI',
    content_mdx: `<p><strong>Betyg: 8.1/10</strong></p>
<h2>Korbit AI recension 2026 — certifierad kodgranskning till lägst pris per användare</h2>

<p>Korbit AI är det billigaste seriösa alternativet per användare bland de AI-kodgranskningsverktyg vi jämfört, och det enda i jämförelsen som är SOC 2 Type 2-certifierat — relevant för team med formella krav på hur data hanteras.</p>

<h2>Vad är Korbit AI?</h2>
<p>Korbit granskar pull requests, hittar buggar och genererar automatiska PR-beskrivningar och granskningsrapporter. Verktyget integrerar med GitHub, GitLab och Bitbucket, och erbjuder en gratis Max-nivå för open source-projekt.</p>

<h2>Viktigaste funktioner</h2>
<ul>
<li><strong>Buggdetektering:</strong> Hittar fel i pull requests innan de mergas.</li>
<li><strong>Automatiska PR-beskrivningar:</strong> Sparar tid på manuell dokumentation av ändringar.</li>
<li><strong>Granskningsrapporter:</strong> Sammanställd översikt per pull request.</li>
<li><strong>SOC 2 Type 2-certifiering:</strong> Formell certifiering av datahantering.</li>
<li><strong>Brett plattformsstöd:</strong> GitHub, GitLab och Bitbucket.</li>
</ul>

<h2>Så bra är det i praktiken</h2>
<p>Korbits tydligaste försäljningsargument är priset: till 12 USD per användare och månad på Pro-nivån är det klart billigare än de flesta konkurrenter i kategorin, samtidigt som det täcker tre stora Git-plattformar. SOC 2 Type 2-certifieringen är ett konkret plus för team i branscher med formella säkerhetskrav. Nackdelen är att Korbit är ett yngre och mindre etablerat namn än CodeRabbit och Qodo, vilket märks i tunnare dokumentation och färre tredjepartsintegrationer att falla tillbaka på om något behöver felsökas.</p>

<h2>För- och nackdelar</h2>
<ul>
<li><strong>Fördel:</strong> Lägst pris per användare bland de jämförda verktygen.</li>
<li><strong>Fördel:</strong> SOC 2 Type 2-certifiering relevant för formella datakrav.</li>
<li><strong>Fördel:</strong> Gratis Max-nivå för open source-projekt.</li>
<li><strong>Nackdel:</strong> Mindre etablerat namn, tunnare dokumentation.</li>
<li><strong>Nackdel:</strong> Färre tredjepartsintegrationer än de större konkurrenterna.</li>
</ul>

<h2>Pris och planer</h2>
<p>Korbit Pro kostar från 12 USD och Max från 18 USD per användare och månad vid årsbetalning. Max-nivån är gratis för open source-projekt.</p>

<h2>För vem passar Korbit AI?</h2>
<p>Korbit passar bäst för team som vill minimera kostnaden per användare utan att ge avkall på certifierad datahantering, samt för open source-projekt som vill ha tillgång till den mer avancerade Max-nivån gratis.</p>

<h2>Vårt omdöme</h2>
<p>Korbit AI bevisar att man inte behöver betala premiumpris för certifierad, plattformsbred kodgranskning. Det är inte lika djupt dokumenterat eller lika känt som CodeRabbit eller Qodo, men kärnfunktionaliteten och certifieringen håller måttet för de flesta team. Med ett betyg på 8,1 av 10 är Korbit ett självklart alternativ att jämföra mot innan ni väljer ett dyrare verktyg.</p>`,
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
      tags: ['AI-kodgranskning'],
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
