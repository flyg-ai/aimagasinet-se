/**
 * Create 16 review-page DB rows for automation + kod-verktyg tools that
 * previously only existed as VIRTUAL_HUB_CHILDREN entries.
 *
 * Run: npx tsx scripts/create-reviews.ts
 *
 * Idempotent — upserts on path. Inserts type=page so classify() routes
 * them to ReviewTemplate (depth 3 under /ai-verktyg/[kategori]/[slug]).
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

type ReviewSeed = {
  slug: string;
  brand: string;
  parent: 'ai-automation' | 'ai-kod-verktyg';
  title: string;
  excerpt: string;
  /** Body — short rich-text guide. Three H2 sections kept short so the
   *  template's structured sections (Verdict/Pros/Cons/UseCases/RatingMatrix)
   *  carry the heavy lift. */
  intro: string;
  features: string[];
  bestFor: string;
  pricing: string;
};

const REVIEWS: ReviewSeed[] = [
  // ── Automation ───────────────────────────────────────────────
  {
    slug: 'make',
    brand: 'Make',
    parent: 'ai-automation',
    title: 'Make – AI-driven workflow-automation för komplexa flöden',
    excerpt: 'Make (tidigare Integromat) är den mest kraftfulla visuella builder:n för automationer — bäst för komplex logik och förgreningar.',
    intro: 'Make är en visuell automationsplattform som låter dig koppla ihop tusentals appar med en drag-and-drop-editor. Det som skiljer Make från Zapier är hur enkelt du bygger förgreningar, loopar och villkor — perfekt när dina flöden växer förbi en enkel "om-detta-då-detta"-logik. AI-modulerna är inbyggda direkt i scenariobyggaren.',
    features: ['Visuell scenariobyggare med förgreningar', 'AI-moduler för text, bild och datatolkning', 'Inbyggda Iteratorer och Aggregatorer för loopar', 'Granulär felhantering per modul', 'Webhooks och egen kod via Custom Apps'],
    bestFor: 'Make passar dig som behöver komplexa flöden över många SaaS-verktyg och som vill ha kontroll på varje steg.',
    pricing: 'Make har en generös gratisplan med 1 000 operationer/månad. Core-planen kostar 9 USD/mån för 10 000 operationer, Pro 16 USD/mån. Större volymer prissätts efter operationer, inte zaps.',
  },
  {
    slug: 'n8n',
    brand: 'n8n',
    parent: 'ai-automation',
    title: 'n8n – Open source-automation du kan självhosta',
    excerpt: 'n8n är ett fullständigt open source-alternativ till Zapier som kan självhostas — perfekt för team som vill äga sin egen data.',
    intro: 'n8n (uttalas "nodemation") är en open source-automationsplattform som kombinerar visuell flödesbyggande med möjligheten att skriva egen kod i varje nod. Kan självhostas i Docker eller köras som SaaS via n8n Cloud, och kommer med inbyggda AI-noder för OpenAI, Anthropic och vector stores.',
    features: ['Open source — gratis att självhosta', '400+ integrationer inklusive AI-noder', 'JavaScript-noder för anpassad logik', 'Workflow-versioning via Git', 'Sub-workflows och error workflows'],
    bestFor: 'n8n är förstavalet för tekniska team som vill ha kontroll över sin data, undviker vendor lock-in eller behöver köra automation on-prem.',
    pricing: 'Self-host är helt gratis. n8n Cloud Starter kostar 20 EUR/mån för 2 500 workflow-executions. Pro 50 EUR/mån. Enterprise-prissättning vid förfrågan.',
  },
  {
    slug: 'zapier-ai',
    brand: 'Zapier',
    parent: 'ai-automation',
    title: 'Zapier AI – Marknadens mest använda automationsplattform',
    excerpt: 'Zapier kopplar ihop 7000+ appar och har nu AI Actions inbyggt — fortfarande standardvalet för att automatisera SaaS-flöden snabbt.',
    intro: 'Zapier är världens mest använda no-code-automationsplattform med 7 000+ appintegrationer. Med AI Actions kan du nu lägga in OpenAI, Anthropic och andra AI-modeller som steg i dina Zaps utan att bygga API-kopplingar själv. Tables och Interfaces gör att du också kan bygga lättviktiga appar direkt i Zapier.',
    features: ['7 000+ app-integrationer', 'AI Actions för OpenAI och Anthropic', 'Zapier Tables för databaser', 'Zapier Interfaces för formulär och dashboards', 'Multi-step Zaps med villkorslogik'],
    bestFor: 'Zapier är bäst för icke-tekniska team som vill koppla ihop SaaS-verktyg snabbt utan att fundera över infrastruktur eller kod.',
    pricing: 'Free-plan ger 100 tasks/månad. Starter 19.99 USD/mån, Professional 49 USD/mån, Team 69 USD/användare. Tasks är dyra i volym — kolla operationsantalet noga.',
  },
  {
    slug: 'power-automate',
    brand: 'Microsoft Power Automate',
    parent: 'ai-automation',
    title: 'Microsoft Power Automate – Automation i Microsoft 365',
    excerpt: 'Microsofts automationsplattform med Copilot-integration och djup förankring i Microsoft 365 och Azure — bäst för MS-tunga företag.',
    intro: 'Power Automate är Microsofts automationssvit och en del av Power Platform. Det djupa stödet för Microsoft 365 (Outlook, SharePoint, Teams, Dynamics) gör det till självklart val för organisationer som redan kör på Microsoft-stacken. Copilot-integrationen gör att du kan beskriva flöden i naturligt språk.',
    features: ['Djup Microsoft 365-integration', 'Copilot för naturligspråk-flöden', 'RPA (Robotic Process Automation) för desktop', 'AI Builder för dokumentprocessning', 'Dataverse och Power Platform-integration'],
    bestFor: 'Power Automate är ett enkelt val om din organisation redan kör Microsoft 365 och du vill automatisera mellan SharePoint, Outlook, Teams och Excel.',
    pricing: 'Vissa flöden ingår i Microsoft 365-licensen. Premium Per User-licens 15 USD/mån för premiumkonnektorer. Per Flow-licens 100 USD/mån. Process-licenser tillkommer för RPA.',
  },
  {
    slug: 'bardeen',
    brand: 'Bardeen',
    parent: 'ai-automation',
    title: 'Bardeen – AI-agenter direkt i din webbläsare',
    excerpt: 'Bardeen är en AI-agent som lever i Chrome och kan skrapa, klicka och fylla i formulär åt dig på vilken webbplats som helst.',
    intro: 'Bardeen kör som en Chrome-extension och låter AI-agenter agera direkt i din webbläsare — utan att appen behöver ett officiellt API. Det här gör det till ett bra val för data-skrapning, prospect-research och tråkiga repetitiva uppgifter över olika SaaS-verktyg.',
    features: ['Chrome-extension med AI-agent', 'Web scraping utan API:er', 'Magic Box: beskriv vad du vill ha gjort i text', 'Förinställda playbooks för LinkedIn, Sheets m.fl.', 'Integration med Notion, Airtable, Slack'],
    bestFor: 'Bardeen är perfekt för säljteam, recruiters och researchers som lever i webbläsaren och behöver automatisera webbaserade flöden.',
    pricing: 'Free-plan med 100 credits/månad. Pro 20 USD/mån för 500 credits, Business 60 USD/mån. Credits konsumeras per agentkörning.',
  },
  {
    slug: 'relay-app',
    brand: 'Relay.app',
    parent: 'ai-automation',
    title: 'Relay.app – AI-automation med human-in-the-loop',
    excerpt: 'Relay.app är en ny automationsplattform som pausar för mänsklig granskning vid kritiska steg — perfekt för AI-flöden där fel kostar pengar.',
    intro: 'Relay.app är en modern automationsplattform med en explicit "human-in-the-loop"-design: vid kritiska steg pausar flödet och väntar på godkännande innan det fortsätter. Det gör Relay till ett bra val för AI-flöden där en feldraft inte får gå live, eller där du vill ha en människa i loopen för känsliga beslut.',
    features: ['Human approval-steg inbyggda', 'AI-moduler för OpenAI och Anthropic', 'Modern, snabb UI', 'Slack- och e-postnotiser för godkännanden', '100+ integrationer'],
    bestFor: 'Relay.app passar team som vill kombinera AI-automation med kontroll — t.ex. content-workflows där en redaktör ska godkänna AI-utkast.',
    pricing: 'Free-plan med 200 steg/månad. Pro 9 USD/mån för 5 000 steg, Team 59 USD/mån. Prissatt per steg, inte per integration.',
  },
  {
    slug: 'activepieces',
    brand: 'ActivePieces',
    parent: 'ai-automation',
    title: 'ActivePieces – Open source-alternativ till Zapier',
    excerpt: 'ActivePieces är ett open source-automationsverktyg med generös gratisversion och inbyggda AI-pieces — bra för team med tight budget.',
    intro: 'ActivePieces är en open source-automationsplattform som hostas både som SaaS och self-host. Den har en betydligt mer generös gratisversion än Zapier (5 000 tasks/mån) och kommer med inbyggda AI-pieces för OpenAI, Anthropic och andra modeller. Bra startpunkt för team som vill testa automation utan att betala.',
    features: ['Open source — kan självhostas', '5 000 tasks/månad gratis', 'AI-pieces för OpenAI och Anthropic', '200+ integrationer', 'Egna Pieces via TypeScript SDK'],
    bestFor: 'ActivePieces är bäst för team som vill ha Zapier-stil-flöden gratis och eventuellt självhosta längre fram.',
    pricing: 'Free-plan med 5 000 tasks/mån. Pro 10 USD/användare/mån, Enterprise-prissättning vid förfrågan. Self-host är helt gratis.',
  },
  {
    slug: 'pipedream',
    brand: 'Pipedream',
    parent: 'ai-automation',
    title: 'Pipedream – Kodbara workflows för utvecklare',
    excerpt: 'Pipedream kombinerar 2 500+ integrationer med JavaScript- och Python-steg — bäst när no-code möter kod.',
    intro: 'Pipedream är en utvecklarvänlig automationsplattform där varje steg i ett workflow kan vara antingen en färdig integration eller egen JavaScript/Python-kod. Det är som GitHub Actions för SaaS-flöden — bra när du behöver mer flexibilitet än Zapier men inte vill bygga allt från noll.',
    features: ['2 500+ integrationer', 'Kodbara steg i Node.js och Python', 'Inbyggd HTTP-trigger och cron', 'Versionshantering och delning av workflows', 'AI-steg via OpenAI och Anthropic'],
    bestFor: 'Pipedream passar utvecklare som vill kombinera färdiga integrationer med egen kod utan att deploya infrastruktur.',
    pricing: 'Free-plan med 10 000 credits/månad. Basic 29 USD/mån, Advanced 79 USD/mån. Prissatt på credits per körning, inte tasks.',
  },

  // ── Kod-verktyg ─────────────────────────────────────────────
  {
    slug: 'windsurf',
    brand: 'Windsurf',
    parent: 'ai-kod-verktyg',
    title: 'Windsurf – Agentisk AI-kodeditor från Codeium',
    excerpt: 'Windsurf är Codeiums agentiska kodeditor som utmanar Cursor — fokus på flow och autonoma multi-file edits.',
    intro: 'Windsurf är Codeiums fork av VS Code med en stark agent-mode kallad Cascade. Den läser hela din kodbas, planerar förändringar över flera filer, och kan exekvera kommandon för dig. Designfilosofin är "flow" — minimera avbrott och låta dig stanna kvar i koden.',
    features: ['Cascade-agent som agerar över flera filer', 'Tab-completion av Codeium-modellen', 'Inbyggd terminal med AI-stöd', 'MCP-stöd för anpassade verktyg', 'Privacy-läge för känsliga kodbaser'],
    bestFor: 'Windsurf är ett starkt val för utvecklare som tröttnat på att copy-paste mellan ChatGPT och editorn och vill ha en riktig agentisk upplevelse.',
    pricing: 'Gratis Free-plan med 50 prompts/månad. Pro 15 USD/mån för obegränsad användning. Team 35 USD/användare/mån. Enterprise-prissättning vid förfrågan.',
  },
  {
    slug: 'tabnine',
    brand: 'Tabnine',
    parent: 'ai-kod-verktyg',
    title: 'Tabnine – Privacy-first AI-kodassistent',
    excerpt: 'Tabnine är AI-kodassistenten för enterprise med strikta privacy-krav — kan köras lokalt eller on-prem.',
    intro: 'Tabnine var en av de första AI-kodassistenterna och har sedan dess specialiserat sig på privacy: du kan köra Tabnine helt lokalt på din egen maskin eller on-prem i din egen infrastruktur. Det här gör det till förstaval för enterprise med strikta datakrav eller GDPR-känsliga kodbaser.',
    features: ['Kan köras 100% lokalt på din maskin', 'On-prem deployment för enterprise', 'Stöd för 30+ programmeringsspråk', 'Tränad på licens-kompatibel kod', 'Integration med alla större IDE:er'],
    bestFor: 'Tabnine är bäst för enterprise och team i reglerade branscher (finans, sjukvård, offentlig sektor) där koden inte får lämna ditt nätverk.',
    pricing: 'Basic-plan gratis med begränsad funktionalitet. Pro 12 USD/användare/mån. Enterprise från 39 USD/användare/mån inkl. self-host.',
  },
  {
    slug: 'codeium',
    brand: 'Codeium',
    parent: 'ai-kod-verktyg',
    title: 'Codeium – Gratis AI-kodassistent för 70+ språk',
    excerpt: 'Codeium är en av de mest generösa gratisversionerna på marknaden — bra autocomplete för soloutvecklare och studenter.',
    intro: 'Codeium är AI-kodassistenten som riktar sig till individuella utvecklare med en obegränsad gratisversion. Den stödjer 70+ programmeringsspråk och fungerar i 40+ IDE:er inklusive VS Code, JetBrains, Vim och Neovim. För hobbyprojekt och soloutvecklare räcker gratisplanen långt.',
    features: ['Helt gratis för individuella utvecklare', '70+ språkstöd', '40+ IDE-integrationer', 'Codeium Chat för förklaringar', 'Egna kontextregler via @-mentions'],
    bestFor: 'Codeium är förstaval för soloutvecklare, hobbyprojekt, studenter och alla som vill ha solid AI-autocomplete utan att betala.',
    pricing: 'Individual är gratis utan begränsningar. Teams 12 USD/användare/mån. Enterprise med self-host vid förfrågan.',
  },
  {
    slug: 'amazon-codewhisperer',
    brand: 'Amazon CodeWhisperer',
    parent: 'ai-kod-verktyg',
    title: 'Amazon CodeWhisperer – AI-kodassistent för AWS-utvecklare',
    excerpt: 'CodeWhisperer (nu del av Amazon Q Developer) är optimerat för AWS-stacken och har inbyggd security scanning.',
    intro: 'Amazon CodeWhisperer är AWS:s svar på Copilot, optimerat för utvecklare som bygger på AWS-stacken. Den kommer med inbyggd security scan som varnar för OWASP-vulnerabilities och hardcoded credentials. Nu marknadsförd som del av Amazon Q Developer-paketet.',
    features: ['Optimerad för AWS-tjänster (Lambda, S3, EC2)', 'Inbyggd security scan med OWASP-täckning', 'Stöd för 15+ språk', 'Reference tracker för open source-licenser', 'Integration med VS Code och JetBrains'],
    bestFor: 'CodeWhisperer är bäst för utvecklare som primärt jobbar med AWS-tjänster och uppskattar inbyggd security tooling.',
    pricing: 'Free tier för individer (Amazon Q Developer Individual). Professional 19 USD/användare/mån via AWS Marketplace. Inga creditbegränsningar i Pro.',
  },
  {
    slug: 'replit-ai',
    brand: 'Replit AI',
    parent: 'ai-kod-verktyg',
    title: 'Replit AI – Bygg och deploya appar med AI i webbläsaren',
    excerpt: 'Replit kombinerar en browser-baserad IDE med AI-agenten Agent som bygger hela appar från en prompt.',
    intro: 'Replit AI är AI-funktionaliteten i Replit-browser-IDE:n. Replit Agent kan bygga hela appar från en textprompt — installerar dependencies, skriver kod, sätter upp databas och deployer publikt. Bra för prototyper och no-code-användare som vill gå ett steg längre.',
    features: ['Replit Agent — bygg appar från en prompt', 'Browser-baserad IDE med 50+ språk', 'Direktdeploy till repl.co-subdomän', 'Inbyggd database (ReplDB)', 'Multiplayer-redigering i realtid'],
    bestFor: 'Replit AI passar nybörjare, snabba prototyper och alla som vill bygga appar utan att installera något lokalt.',
    pricing: 'Free-plan med begränsade resurser. Core 25 USD/mån för dedikerade resurser och Agent. Teams 40 USD/användare/mån för delade projekt.',
  },
  {
    slug: 'jetbrains-ai',
    brand: 'JetBrains AI',
    parent: 'ai-kod-verktyg',
    title: 'JetBrains AI – AI-assistent i IntelliJ, PyCharm och WebStorm',
    excerpt: 'JetBrains AI Assistant är inbyggd i alla JetBrains-editorer och drar nytta av JetBrains djupa IDE-integration.',
    intro: 'JetBrains AI Assistant är den officiella AI-funktionaliteten i hela JetBrains-familjen (IntelliJ IDEA, PyCharm, WebStorm, GoLand, Rider m.fl.). Den drar nytta av JetBrains starka refactoring-stöd och djupa kodförståelse — bra om du redan lever i JetBrains-ekosystemet.',
    features: ['Inbyggd i alla JetBrains IDE:er', 'AI-driven refactoring och commit-meddelanden', 'Chat-flik i editorn', 'Code completion med multi-line förslag', 'Stöd för JVM-språk, Python, JavaScript, Go m.fl.'],
    bestFor: 'JetBrains AI är ett enkelt val för utvecklare som redan har JetBrains-licens och vill ha AI utan att byta editor.',
    pricing: '7 dagars gratis trial. AI Pro 10 USD/användare/mån. Ingår i All Products Pack för team. Free tier finns med begränsad funktion.',
  },
  {
    slug: 'sourcegraph-cody',
    brand: 'Sourcegraph Cody',
    parent: 'ai-kod-verktyg',
    title: 'Sourcegraph Cody – AI som förstår hela din kodbas',
    excerpt: 'Cody är Sourcegraphs AI som indexerar hela kodbasen — bäst för stora monorepos och cross-file refactoring.',
    intro: 'Sourcegraph Cody bygger på Sourcegraphs starka code-search-tradition: hela din kodbas indexeras och AI:n kan resonera om relationer över filer, repos och tjänster. Det här gör Cody till starkaste valet för stora kodbaser där en AI som bara ser den öppna filen blir otillräcklig.',
    features: ['Hela kodbasen som kontext (även monorepos)', 'Cross-repo-sökning och refactoring', 'Egna kontextprovider via API', 'Enterprise-säkerhet och self-host', 'Stöd för OpenAI, Anthropic, egna modeller'],
    bestFor: 'Cody är bäst för team med stora monorepos eller komplexa mikroservice-arkitekturer där cross-file-kontext är kritisk.',
    pricing: 'Free-plan med begränsad användning. Pro 9 USD/användare/mån. Enterprise från 19 USD/användare/mån med self-host och egna modeller.',
  },
  {
    slug: 'pieces',
    brand: 'Pieces',
    parent: 'ai-kod-verktyg',
    title: 'Pieces – Lokalt AI-snippet- och kontextminne',
    excerpt: 'Pieces är en lokal AI som kommer ihåg din kodhistorik och dina snippets — bra för utvecklare som jobbar offline eller med känslig kod.',
    intro: 'Pieces är ett annorlunda AI-verktyg: den kör helt lokalt på din maskin och bygger ett persistent minne av din kodhistorik, dina snippets och din kontext över olika appar (browser, terminal, editor). Tanken är att din AI-assistent ska veta vad du har gjort, inte bara vad du jobbar med just nu.',
    features: ['100% lokal AI — ingen data lämnar maskinen', 'Snippet-bibliotek med AI-sökning', 'Kontext-minne över appar (browser → editor)', 'Integrationer i VS Code, JetBrains, Obsidian', 'Stöd för anpassade lokala modeller via Ollama'],
    bestFor: 'Pieces är bäst för utvecklare som hanterar känslig kod, jobbar offline eller vill ha en AI-assistent som kommer ihåg deras egen historik.',
    pricing: 'Helt gratis i nuvarande version. Pro-tier kommer enligt roadmap för team-funktioner.',
  },
];

function buildContent(r: ReviewSeed): string {
  return `
<h2>Vad är ${r.brand}?</h2>
<p>${r.intro}</p>

<h2>Funktioner som spelar roll</h2>
<ul>
${r.features.map((f) => `  <li>${f}</li>`).join('\n')}
</ul>

<h2>Vem passar ${r.brand} för?</h2>
<p>${r.bestFor}</p>

<h2>Prismodell</h2>
<p>${r.pricing}</p>
`.trim();
}

async function main() {
  const rows = REVIEWS.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content_mdx: buildContent(r),
    category: null,
    tags: [] as string[],
    featured_image: null,
    type: 'page',
    path: `/ai-verktyg/${r.parent}/${r.slug}`,
    parent_slug: r.parent,
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: null,
    seo_description: null,
  }));

  console.log(`Upserting ${rows.length} review pages…`);
  const { data, error } = await db
    .from('articles')
    .upsert(rows, { onConflict: 'path' })
    .select('slug,path');

  if (error) {
    console.error('upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`OK — wrote ${data?.length ?? 0} rows:`);
  data?.forEach((d) => console.log(`  ${d.path}`));
}

main();
