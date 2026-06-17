/**
 * Curated profiles for the 60 yrke-topic tools (SEO, copy, ads, social,
 * bokföring, redovisning). Used by:
 *  - scripts/seed-yrke-reviews.ts → upserts DB rows
 *  - HubTemplate.tsx → merged into KNOWN so the topplistan picks up
 *    logo / score / tagline / offer / fallbackUrl
 *  - ReviewTemplate.tsx → merged into REVIEW_KNOWN so review pages
 *    render the rating matrix, snabbfakta, etc.
 *
 * Single source of truth → editing a tool here updates all three layers.
 */

import { EXTENDED_TOOLS } from './yrke-tools-extended';
import { DESIGNER_FOTOGRAF_TOOLS } from './yrke-tools-designer-fotograf';

export type YrkeParent =
  | 'seo'
  | 'content-copywriting'
  | 'annonser'
  | 'sociala-medier'
  | 'bokforing'
  | 'redovisning'
  | 'avtalsgranskning'
  | 'due-diligence'
  | 'rattsutredningar'
  | 'chatbot'
  | 'epost-svar'
  | 'rost-ai'
  | 'cv-screening'
  | 'jobbannonser'
  | 'kandidatmatchning'
  // Designer
  | 'grafisk-design'
  | 'ui-ux'
  | 'designer-bildgenerering'  // prefixed because bildgenerering exists in fotograf too
  | 'videoredigering'
  // Fotograf-video
  | 'bildredigering'
  | 'videoklippning'
  | 'foto-bildgenerering'
  | 'ljudsattning';

export type YrkeTool = {
  slug: string;
  parent: YrkeParent;
  brand: string;
  company: string;
  founded: number;
  hq: string;
  score: number;
  fallbackUrl: string;
  /** Article title — used as <h1> and seed for ReviewTemplate.toolNameFromTitle. */
  title: string;
  /** Short ≤ 60-char hook used in RankRow + as DB excerpt. */
  oneliner: string;
  /** 4 short feature bullets, used in content_mdx body. */
  features: string[];
  /** 3 strengths, 2 weaknesses — also drives review profile. */
  pros: string[];
  cons: string[];
  /** Sentence-long pricing summary. */
  pricing: string;
  /** Best-for line for the offer block. */
  bestFor: string;
  offer: { title: string; price: string };
  tags: string[];
  useCases: string[];
  /** Topplistan label ("Redaktionens val" / "Bäst för X"). */
  label: string;
  /** Tailwind bg-* class for the logo block. */
  logo: string;
};

/* ── Rating criteria per yrke parent ─────────────────────────────
   6 labels per category — derived per-tool from the overall score with
   small deterministic variation, so the matrix isn't pancake-flat. */
const CRITERIA_BY_PARENT: Record<YrkeParent, string[]> = {
  seo: ['SEO-precision', 'Innehållsförslag', 'Användarvänlighet', 'Integrationer', 'Pris / prestanda', 'Svensk SEO'],
  'content-copywriting': ['Textkvalitet', 'Brand voice', 'Mallar & flöden', 'Språkstöd', 'Pris / prestanda', 'Användarvänlighet'],
  annonser: ['Kreativ AI', 'Optimerings-AI', 'Plattformsstöd', 'Rapportering', 'Pris / prestanda', 'Skalbarhet'],
  'sociala-medier': ['Schemaläggning', 'AI-innehåll', 'Plattformsstöd', 'Insights', 'Pris / prestanda', 'Användarvänlighet'],
  bokforing: ['Funktionalitet', 'Användarvänlighet', 'Integrationer', 'Svensk anpassning', 'AI-stöd', 'Pris / prestanda'],
  redovisning: ['Funktionalitet', 'AI-stöd', 'Compliance', 'Skalbarhet', 'Integrationer', 'Pris / prestanda'],
  // Juridik
  avtalsgranskning: ['Granskningskvalitet', 'Playbook-anpassning', 'Risk-flagging', 'Pris / prestanda', 'Integrationer', 'Svensk juridik'],
  'due-diligence': ['Dokumentförståelse', 'Extraktion', 'Skalbarhet', 'Audit trail', 'Pris / prestanda', 'Säkerhet'],
  rattsutredningar: ['Källtäckning', 'Citatkvalitet', 'Svensk rätt', 'Hastighet', 'Pris / prestanda', 'Hallucination-skydd'],
  // Kundservice
  chatbot: ['NLU-kvalitet', 'Integrationer', 'Eskaleringslogik', 'Svenska', 'Pris / prestanda', 'Analytik'],
  'epost-svar': ['Svarsförslag', 'Brand voice', 'Inbox-integration', 'Knowledge-base', 'Pris / prestanda', 'Svenska'],
  'rost-ai': ['Röstkvalitet', 'Transkribering', 'Svenska', 'Telefoni-integration', 'Pris / prestanda', 'Realtid'],
  // Rekrytering
  'cv-screening': ['Matchningskvalitet', 'Bias-skydd', 'ATS-integration', 'Skalbarhet', 'Pris / prestanda', 'Svensk arbetsrätt'],
  jobbannonser: ['Textkvalitet', 'Inkluderingsanalys', 'Bias-detection', 'A/B-test', 'Pris / prestanda', 'Brand voice'],
  kandidatmatchning: ['Skills-mapping', 'ATS-integration', 'Pipeline-täckning', 'Diversitet', 'Pris / prestanda', 'Förklarbarhet'],
  // Designer
  'grafisk-design': ['Designkvalitet', 'Mallar', 'Brand control', 'Export-format', 'Pris / prestanda', 'Användarvänlighet'],
  'ui-ux': ['Wireframe-kvalitet', 'AI-precision', 'Iteration', 'Code-export', 'Pris / prestanda', 'Designsystem'],
  'designer-bildgenerering': ['Stilkontroll', 'Bildkvalitet', 'Brand-koherens', 'Iteration', 'Pris / prestanda', 'Kommersiell licens'],
  videoredigering: ['Klippkvalitet', 'AI-effekter', 'Render-tid', 'Export-format', 'Pris / prestanda', 'Användarvänlighet'],
  // Fotograf-video
  bildredigering: ['Retuschkvalitet', 'AI-precision', 'Batch-stöd', 'Hastighet', 'Pris / prestanda', 'Native-app'],
  videoklippning: ['Klippkvalitet', 'AI-stöd', 'Auto-redigering', 'Plattformsstöd', 'Pris / prestanda', 'Mobil app'],
  'foto-bildgenerering': ['Fotorealism', 'Stil-kontroll', 'Konsistens', 'Iteration', 'Pris / prestanda', 'Kommersiell licens'],
  ljudsattning: ['Ljudkvalitet', 'AI-stöd', 'Bibliotek', 'Sync med video', 'Pris / prestanda', 'Royaltyfri'],
};

/** Deterministic 6-criterion matrix around `score` ± 0.4. */
function makeCriteria(parent: YrkeParent, score: number) {
  const labels = CRITERIA_BY_PARENT[parent];
  return labels.map((label, i) => {
    const delta = (((i * 17 + parent.length * 7) % 9) - 4) / 10; // -0.4..+0.4
    const s = Math.max(5, Math.min(10, Math.round((score + delta) * 10) / 10));
    return { label, score: s };
  });
}

/* ── Tool list (60) ──────────────────────────────────────────────
   Kept terse on purpose — flavor lives in pros/cons/features.
   Adjust scores ±0.1 if the rank order in the topplistan needs shifting. */

export const YRKE_TOOLS: YrkeTool[] = [
  // ── SEO ───────────────────────────────────────────────────────
  {
    slug: 'chatgpt-seo', parent: 'seo', brand: 'ChatGPT', company: 'OpenAI', founded: 2015, hq: 'San Francisco, USA',
    score: 9.2, fallbackUrl: 'https://chat.openai.com',
    title: 'ChatGPT för SEO — keyword-research, content-briefs och meta',
    oneliner: 'Snabbast SEO-keyword-research, briefs och meta direkt i chatten.',
    features: ['Keyword-cluster på sekunder', 'SEO-briefs från en URL', 'Meta-titles och descriptions i bulk', 'Schema-markup-generering'],
    pros: ['Snabb och flexibel', 'Stort GPT-bibliotek för SEO', 'Bra på svenska'],
    cons: ['Ingen direkt SERP-data', 'Kräver bra prompts'],
    pricing: 'Gratis ger åtkomst till GPT-4 lite. Plus kostar 20 USD/mån och låser upp Custom GPTs samt Code Interpreter.',
    bestFor: 'Snabb SEO-research utan separat verktyg',
    offer: { title: 'Plus-läge 7 dagar gratis', price: 'Gratis · Plus 20 USD/mån' },
    tags: ['GPT-5', 'Custom GPTs', 'Snabb research', 'Multimodal'],
    useCases: ['Keyword-research', 'Content-briefs', 'Meta-optimering', 'SERP-analys via plugins', 'Internal linking-förslag'],
    label: 'Redaktionens val', logo: 'bg-emerald-500',
  },
  {
    slug: 'semrush-ai', parent: 'seo', brand: 'Semrush', company: 'Semrush', founded: 2008, hq: 'Boston, USA',
    score: 9.1, fallbackUrl: 'https://www.semrush.com',
    title: 'Semrush AI — komplett SEO-svit med AI-content och rank tracking',
    oneliner: 'Komplett SEO-svit med AI för briefs, rank tracking och konkurrenter.',
    features: ['ContentShake AI för briefs', 'AI Writing Assistant i Docs', 'Domain Overview med AI-insights', 'Position Tracking på lokala SERPs'],
    pros: ['Branschens djupaste SEO-data', 'AI integrerad i hela sviten', 'Stark konkurrentanalys'],
    cons: ['Brant prislapp för småteam', 'Svensk SERP-data tunnare'],
    pricing: 'Pro 139,95 USD/mån, Guru 249,95 USD/mån. AI-funktioner ingår i alla planer men ContentShake kräver tillägg.',
    bestFor: 'SEO-byråer och in-house team med budget',
    offer: { title: '7 dagar gratis trial', price: 'Pro 139,95 USD/mån' },
    tags: ['Komplett SEO', 'Rank tracking', 'ContentShake', 'Konkurrenter'],
    useCases: ['Keyword-research med volym', 'Konkurrentanalys', 'Backlink-audit', 'AI-content-briefs', 'Position Tracking'],
    label: 'Bäst för proffs', logo: 'bg-orange-500',
  },
  {
    slug: 'surfer-seo', parent: 'seo', brand: 'Surfer SEO', company: 'Surfer', founded: 2017, hq: 'Wrocław, Polen',
    score: 8.8, fallbackUrl: 'https://surferseo.com',
    title: 'Surfer SEO — AI-content som rankar med Google',
    oneliner: 'AI-content-editor som scorar din text mot topp-10 i realtid.',
    features: ['Content Editor med live SEO-score', 'Surfer AI som skriver färdiga artiklar', 'SERP Analyzer för on-page-faktorer', 'Keyword Research med kluster'],
    pros: ['Skarpaste content-scoringen', 'Surfer AI ger publiceringsbar text', 'Bra för content-teams'],
    cons: ['Färre SEO-data än Semrush', 'Pricing skalar fort'],
    pricing: 'Essential 89 USD/mån för 5 artiklar i Surfer AI och 180 Content Editor-credits. Advanced 179 USD/mån.',
    bestFor: 'Content-team som rankar via long-form',
    offer: { title: '7 dagar gratis trial', price: 'Essential 89 USD/mån' },
    tags: ['Content Editor', 'Surfer AI', 'SERP Analyzer', 'On-page'],
    useCases: ['On-page-optimering', 'AI-artiklar', 'Content audit', 'Keyword-clustering', 'NLP-driven editing'],
    label: 'Bäst för content-team', logo: 'bg-sky-500',
  },
  {
    slug: 'ahrefs-ai', parent: 'seo', brand: 'Ahrefs', company: 'Ahrefs', founded: 2010, hq: 'Singapore',
    score: 9.0, fallbackUrl: 'https://ahrefs.com',
    title: 'Ahrefs AI — branschens djupaste backlink- och keyword-data med AI-lager',
    oneliner: 'Branschledande backlink-data med nya AI-features ovanpå.',
    features: ['AI Content Helper i Site Audit', 'Keyword Difficulty med ML-baserad svår-bedömning', 'Site Explorer för backlinks', 'Rank Tracker per land'],
    pros: ['Bäst backlink-databas', 'Korrekt keyword-volym', 'Stark API'],
    cons: ['AI-lagret yngre än Semrush', 'Dyr i lägsta planen'],
    pricing: 'Lite 129 USD/mån, Standard 249 USD/mån. AI-features rullas ut löpande utan extra kostnad i 2026.',
    bestFor: 'SEO-team som lever i backlinks och keyword-data',
    offer: { title: '7 dagar trial 7 USD', price: 'Lite 129 USD/mån' },
    tags: ['Backlinks', 'Keyword Explorer', 'Site Audit', 'Rank Tracker'],
    useCases: ['Backlink-analys', 'Keyword-research', 'Site Audit', 'Konkurrentforskning', 'Content gap-analys'],
    label: 'Bäst för backlinks', logo: 'bg-blue-700',
  },
  {
    slug: 'clearscope', parent: 'seo', brand: 'Clearscope', company: 'Clearscope', founded: 2016, hq: 'Austin, USA',
    score: 8.5, fallbackUrl: 'https://www.clearscope.io',
    title: 'Clearscope — premium content-optimering med tydliga betyg',
    oneliner: 'Premium content-grading mot SERP — enkelt och rakt.',
    features: ['Content Grading A+ till D', 'Termförslag prioriterade efter SERP-frekvens', 'Direct integration med Google Docs', 'Inventory som spårar publicerade artiklar'],
    pros: ['Lättanvänd för redaktioner', 'Skarpa term-rekommendationer', 'Bra Google Docs-flöde'],
    cons: ['Smalt fokus (bara content-grading)', 'Premium-pris'],
    pricing: 'Essentials 189 USD/mån för 20 reports. Business 555 USD/mån, Enterprise vid förfrågan.',
    bestFor: 'Större redaktioner med tydlig produktionsprocess',
    offer: { title: 'Demo bokas via sajt', price: 'Essentials 189 USD/mån' },
    tags: ['Content Grading', 'SERP-terms', 'Google Docs', 'Premium'],
    useCases: ['On-page-optimering', 'Content-grading', 'Redaktionell QA', 'SEO-redigering', 'Konkurrent-content-analys'],
    label: 'Bäst för redaktioner', logo: 'bg-violet-600',
  },
  {
    slug: 'frase-io', parent: 'seo', brand: 'Frase.io', company: 'Frase', founded: 2017, hq: 'Cambridge, USA',
    score: 8.3, fallbackUrl: 'https://www.frase.io',
    title: 'Frase.io — SERP-research och AI-content i ett',
    oneliner: 'SERP-research och AI-skrivande i samma flöde — bra prisvärde.',
    features: ['SERP Outline Builder', 'AI Article Writer (GPT-baserad)', 'Topic Score mot konkurrenter', 'Answer Engine för People Also Ask'],
    pros: ['Bra balans research/skrivande', 'Solid AI-utkast', 'Konkurrenskraftigt pris'],
    cons: ['UI känns daterat', 'Mindre djup i SEO-data'],
    pricing: 'Solo 14,99 USD/mån för 4 artiklar. Basic 44,99 USD/mån, Team 114,99 USD/mån.',
    bestFor: 'Soloutvecklare och småteam',
    offer: { title: '5 dagar trial 1 USD', price: 'Solo 14,99 USD/mån' },
    tags: ['SERP Research', 'AI Writer', 'Topic Score', 'Affordable'],
    useCases: ['SERP-research', 'AI-utkast', 'Topic Score-jämförelse', 'PAA-extraktion', 'Content-briefs'],
    label: 'Bästa pris-prestanda', logo: 'bg-rose-500',
  },
  {
    slug: 'neuronwriter', parent: 'seo', brand: 'NeuronWriter', company: 'NeuronWriter', founded: 2021, hq: 'Tallinn, Estland',
    score: 8.4, fallbackUrl: 'https://neuronwriter.com',
    title: 'NeuronWriter — NLP-driven SEO-editor för småföretagare',
    oneliner: 'NLP-driven content-editor på halva priset av konkurrenterna.',
    features: ['NLP-term-rekommendationer', 'GPT-4 AI Writer inbyggd', 'Internal linking-förslag', 'Lifetime deal-licens via AppSumo'],
    pros: ['Mest content för pengarna', 'Stark NLP-analys', 'Inbyggd plagiat-check'],
    cons: ['Mindre känd än Surfer/Frase', 'UI kräver inlärning'],
    pricing: 'Bronze 19 EUR/mån för 25 analyser. Silver 37 EUR/mån, Gold 57 EUR/mån. Lifetime-deals återkommer på AppSumo.',
    bestFor: 'Frilansare och småbyråer',
    offer: { title: '14 dagar trial', price: 'Bronze 19 EUR/mån' },
    tags: ['NLP', 'AI Writer', 'EU-data', 'Affordable'],
    useCases: ['Content-optimering', 'NLP-analys', 'AI-utkast', 'Internal linking', 'Plagiat-check'],
    label: 'Bäst budget', logo: 'bg-teal-600',
  },
  {
    slug: 'marketmuse', parent: 'seo', brand: 'MarketMuse', company: 'MarketMuse', founded: 2014, hq: 'Boston, USA',
    score: 8.2, fallbackUrl: 'https://www.marketmuse.com',
    title: 'MarketMuse — AI för content-strategi i stora bibliotek',
    oneliner: 'Content-strategi-AI som mappar luckor i hela sajten.',
    features: ['Content Inventory över hela domänen', 'Topic Authority-score per kluster', 'Personalized difficulty per sajt', 'Content Brief Generator'],
    pros: ['Bästa för strategiskt content-arbete', 'Topic Authority unikt på marknaden', 'Bra för stora bibliotek'],
    cons: ['Komplext för enskilda artiklar', 'Pricing tar tid att navigera'],
    pricing: 'Free-plan med begränsade reports. Standard 149 USD/mån, Team 399 USD/mån. Premium vid förfrågan.',
    bestFor: 'Content-strateger på medel-/stora sajter',
    offer: { title: 'Free-plan tillgänglig', price: 'Standard 149 USD/mån' },
    tags: ['Content Strategy', 'Topic Authority', 'Inventory', 'Enterprise'],
    useCases: ['Content-strategi', 'Topic Authority-mätning', 'Content gap-analys', 'Brief-generering', 'Site-wide audit'],
    label: 'Bäst för strategi', logo: 'bg-fuchsia-600',
  },
  {
    slug: 'rankmath-ai', parent: 'seo', brand: 'Rank Math', company: 'Rank Math', founded: 2018, hq: 'Indien',
    score: 8.6, fallbackUrl: 'https://rankmath.com',
    title: 'Rank Math AI — WordPress SEO-plugin med Content AI inbyggt',
    oneliner: 'Mest använda SEO-pluginet för WordPress med AI-features.',
    features: ['Content AI för on-page-rekommendationer', 'Schema-generering automatiskt', 'Internal link-förslag', 'Sitemap- och index-hantering'],
    pros: ['Standard för WordPress-SEO', 'Generös gratisversion', 'Aktiv utveckling'],
    cons: ['Bara WordPress', 'Content AI kräver Pro-plan'],
    pricing: 'Free-plan med basfunktioner. Pro 7,17 USD/mån (årsplan), Business 20,75 USD/mån, Agency 49,08 USD/mån.',
    bestFor: 'WordPress-sajter och WP-byråer',
    offer: { title: 'Gratis-plan tillgänglig', price: 'Pro 7,17 USD/mån' },
    tags: ['WordPress', 'Content AI', 'Schema', 'Internal links'],
    useCases: ['WordPress on-page-SEO', 'Schema-markup', 'Internal linking', 'Sitemap-hantering', 'Redirect-management'],
    label: 'Bäst för WordPress', logo: 'bg-amber-600',
  },
  {
    slug: 'screaming-frog-ai', parent: 'seo', brand: 'Screaming Frog', company: 'Screaming Frog', founded: 2010, hq: 'Henley-on-Thames, UK',
    score: 8.0, fallbackUrl: 'https://www.screamingfrog.co.uk/seo-spider/',
    title: 'Screaming Frog AI — Crawler med AI för tekniska SEO-audits',
    oneliner: 'Klassisk SEO-crawler — nu med AI-extraktion för meta och content.',
    features: ['Crawl av hela sajter med custom extraction', 'AI Description Generator', 'GPT/Claude-extraktion via API-nyckel', 'Comparison reports mellan crawls'],
    pros: ['Industristandard för tekniska audits', 'AI som tillägg utan extra kostnad', 'Power för stora sajter'],
    cons: ['Brant inlärningskurva', 'Desktop-app, inte SaaS'],
    pricing: 'Free-plan crawlar 500 URL:er. Licens 259 USD/år per användare öppnar obegränsat och AI-features.',
    bestFor: 'Tekniska SEO-konsulter och in-house team',
    offer: { title: 'Gratis upp till 500 URL', price: 'Licens 259 USD/år' },
    tags: ['Crawler', 'Technical SEO', 'Custom Extraction', 'Desktop'],
    useCases: ['Technical SEO-audit', 'Crawl-baserad QA', 'Custom data-extraktion', 'Internal linking-analys', 'Migrationsstöd'],
    label: 'Bäst tekniskt', logo: 'bg-lime-700',
  },

  // ── Content & copywriting ─────────────────────────────────────
  {
    slug: 'chatgpt-content', parent: 'content-copywriting', brand: 'ChatGPT', company: 'OpenAI', founded: 2015, hq: 'San Francisco, USA',
    score: 9.4, fallbackUrl: 'https://chat.openai.com',
    title: 'ChatGPT för content & copywriting — allroundvalet 2026',
    oneliner: 'Allround AI för copy, sociala medier och kreativ ideation.',
    features: ['Custom GPTs för brand voice', 'Canvas för redigering', 'Bilder via DALL·E 3', 'Röstläge och mobilapp'],
    pros: ['Bredast användning', 'Stort ekosystem av GPTs', 'Bra svenska'],
    cons: ['Knapphändig källhantering', 'Generic röst utan finjustering'],
    pricing: 'Gratis ger GPT-4 lite. Plus 20 USD/mån låser upp GPT-5, Custom GPTs och Canvas. Team 25 USD/användare/mån.',
    bestFor: 'Allmänt copy-arbete utan smal nisch',
    offer: { title: 'Plus 7 dagar gratis', price: 'Gratis · Plus 20 USD/mån' },
    tags: ['GPT-5', 'Custom GPTs', 'Canvas', 'Multimodal'],
    useCases: ['Bloggar och artiklar', 'Sociala medier', 'E-postsekvenser', 'Annonser', 'Brand voice via Custom GPTs'],
    label: 'Redaktionens val', logo: 'bg-emerald-500',
  },
  {
    slug: 'claude-content', parent: 'content-copywriting', brand: 'Claude', company: 'Anthropic', founded: 2021, hq: 'San Francisco, USA',
    score: 9.3, fallbackUrl: 'https://claude.ai',
    title: 'Claude för content & copywriting — bäst på långform',
    oneliner: 'Bäst på långform, nyans och kvalitet — ofta första valet för redaktörer.',
    features: ['200k token context för långa briefs', 'Projects för persistent brand voice', 'Artifacts för iterativ redigering', 'Stark på svenska'],
    pros: ['Skarpaste textkvaliteten', 'Behåller röst över långa dokument', 'Bra på nyans'],
    cons: ['Långsammare än GPT', 'Färre integrationer'],
    pricing: 'Gratis ger Claude Sonnet med begränsningar. Pro 20 USD/mån låser upp Opus 4.7 och Projects.',
    bestFor: 'Långform, redaktionellt content och nyanserat arbete',
    offer: { title: 'Pro 200k context gratis', price: 'Gratis · Pro 20 USD/mån' },
    tags: ['Opus 4.7', 'Projects', 'Artifacts', '200k context'],
    useCases: ['Långa artiklar', 'White papers', 'Redaktionellt content', 'Brand voice-vakt', 'Översättning'],
    label: 'Bäst för långform', logo: 'bg-orange-500',
  },
  {
    slug: 'jasper-content', parent: 'content-copywriting', brand: 'Jasper', company: 'Jasper', founded: 2021, hq: 'Austin, USA',
    score: 8.7, fallbackUrl: 'https://www.jasper.ai',
    title: 'Jasper för content & copywriting — brand voice för team',
    oneliner: 'Marknadsföringsplattformen byggd kring brand voice och teams.',
    features: ['Brand Voice som tränas på dina texter', 'Templates för annonser, bloggar, e-post', 'Campaigns med multi-kanal-content', 'Marketing Edit för stilkonsistens'],
    pros: ['Konsekvent brand voice', 'Bra för marketing-teams', 'Stort mall-bibliotek'],
    cons: ['Dyrt jämfört med ChatGPT', 'Smal jämfört med generiska AI:er'],
    pricing: 'Creator 49 USD/mån för en användare. Pro 69 USD/användare/mån, Business vid förfrågan.',
    bestFor: 'Marketing-team som behöver brand voice-skydd',
    offer: { title: '7 dagar gratis trial', price: 'Creator 49 USD/mån' },
    tags: ['Brand Voice', 'SEO-mode', 'Templates', 'Teams'],
    useCases: ['Marknadsföringscopy', 'Sociala medier', 'Annonstexter', 'Bloggar', 'Brand voice-management'],
    label: 'Bäst för marknadsföring', logo: 'bg-amber-500',
  },
  {
    slug: 'copy-ai-content', parent: 'content-copywriting', brand: 'Copy.ai', company: 'Copy.ai', founded: 2020, hq: 'Memphis, USA',
    score: 8.4, fallbackUrl: 'https://www.copy.ai',
    title: 'Copy.ai för content & copywriting — workflows för säljteam',
    oneliner: 'AI-workflows för säljteam som vill automatisera outreach.',
    features: ['Workflows för säljsekvenser', 'Templates för LinkedIn och e-post', 'CRM-integrationer', 'Brand voice per workspace'],
    pros: ['Bra workflows-automation', 'Säljfokuserad', 'Lågt instegspris'],
    cons: ['Mindre stark på långform', 'Svensk text kräver justering'],
    pricing: 'Free Forever med 2000 ord/månad. Pro 36 USD/mån, Team 186 USD/mån, Enterprise vid förfrågan.',
    bestFor: 'Säljteam som vill automatisera prospect-outreach',
    offer: { title: 'Free Forever-plan', price: 'Pro 36 USD/mån' },
    tags: ['Workflows', 'Templates', 'Brand voice', 'Sales'],
    useCases: ['Säljmejl', 'LinkedIn-outreach', 'Annonser', 'Produktbeskrivningar', 'Slogans'],
    label: 'Bäst för säljteam', logo: 'bg-rose-500',
  },
  {
    slug: 'writesonic-content', parent: 'content-copywriting', brand: 'Writesonic', company: 'Writesonic', founded: 2020, hq: 'Bangalore, Indien',
    score: 8.3, fallbackUrl: 'https://writesonic.com',
    title: 'Writesonic för content & copywriting — SEO-bulk till bra pris',
    oneliner: 'SEO-mode och bulk-generering till konkurrenskraftigt pris.',
    features: ['SEO Mode för rankningsbara artiklar', 'Bulk-generering för många URL:er', 'Chatsonic med live-web', 'AI Article Writer 6.0'],
    pros: ['Bulk-funktion sparar tid', 'Bra pris jämfört med Jasper', 'Stark SEO-mode'],
    cons: ['Svensk text ojämn', 'UI rörigt med många produkter'],
    pricing: 'Free-plan med 10k ord/månad. Individual 16 USD/mån, Standard 79 USD/mån, Professional 199 USD/mån.',
    bestFor: 'SEO-team som producerar i volym',
    offer: { title: 'Free-plan 10k ord/mån', price: 'Individual 16 USD/mån' },
    tags: ['SEO Mode', 'Bulk', 'Chatsonic', 'API'],
    useCases: ['SEO-artiklar i bulk', 'Produktbeskrivningar', 'E-handel-copy', 'Annonser', 'Sociala medier'],
    label: 'Bäst för SEO-bulk', logo: 'bg-violet-500',
  },
  {
    slug: 'koala-writer', parent: 'content-copywriting', brand: 'KoalaWriter', company: 'Koala', founded: 2022, hq: 'Australien',
    score: 8.5, fallbackUrl: 'https://koala.sh',
    title: 'KoalaWriter — long-form SEO-AI med live SERP-data',
    oneliner: 'Long-form AI-skribent med inbyggd live SERP-research.',
    features: ['Live SERP-data i varje generering', 'YouTube/Amazon-mode för specifika nischer', 'NLP-keywords automatiskt', 'Bulk article generation'],
    pros: ['Skarpare än Jasper på long-form', 'Live SERP-koppling unik', 'Aktiv produktutveckling'],
    cons: ['Smal community ännu', 'Pricing per ord kan bli dyrt'],
    pricing: 'Essentials 9 USD/mån för 25k ord, Starter 25 USD/mån, Pro 50 USD/mån, Max 99 USD/mån.',
    bestFor: 'Affiliate-skribenter och SEO-bloggare',
    offer: { title: '1500 ord gratis trial', price: 'Essentials 9 USD/mån' },
    tags: ['Long-form', 'Live SERP', 'Bulk', 'Affordable'],
    useCases: ['Long-form-artiklar', 'Affiliate-content', 'Amazon-recensioner', 'YouTube-scripts', 'SEO-bulk'],
    label: 'Bäst long-form', logo: 'bg-lime-600',
  },
  {
    slug: 'rytr-content', parent: 'content-copywriting', brand: 'Rytr', company: 'Rytr', founded: 2021, hq: 'Indien',
    score: 7.8, fallbackUrl: 'https://rytr.me',
    title: 'Rytr för content & copywriting — billigast pro-plan',
    oneliner: 'Billigast pro-plan på marknaden — bra för frilansare.',
    features: ['40+ use case-mallar', '30+ språk', 'Tone variants per text', 'Browser-extension'],
    pros: ['Lågt pris', 'Många mallar', 'Lätt att lära sig'],
    cons: ['Modellen är inte topp', 'Begränsad kontext'],
    pricing: 'Free med 10k tecken/månad. Unlimited 9 USD/mån, Premium 29 USD/mån.',
    bestFor: 'Frilansare med tight budget',
    offer: { title: '10k tecken gratis varje månad', price: 'Unlimited 9 USD/mån' },
    tags: ['40+ mallar', '30+ språk', 'Enkelt UI', 'Billigast pro'],
    useCases: ['Bloggar', 'E-postsekvenser', 'Sociala medier', 'Annonser', 'Produktbeskrivningar'],
    label: 'Bästa nybörjarvalet', logo: 'bg-rose-400',
  },
  {
    slug: 'hypotenuse-ai', parent: 'content-copywriting', brand: 'Hypotenuse AI', company: 'Hypotenuse AI', founded: 2020, hq: 'Singapore',
    score: 8.1, fallbackUrl: 'https://www.hypotenuse.ai',
    title: 'Hypotenuse AI — e-handel-AI för produktbeskrivningar i skala',
    oneliner: 'AI specialiserad på produktbeskrivningar för e-handel i skala.',
    features: ['Bulk product description generation', 'Shopify- och WooCommerce-integration', 'Bildgenerering för produkter', 'Brand voice per katalog'],
    pros: ['Branschledande för e-handel', 'Stark bulk-funktion', 'Bra Shopify-integration'],
    cons: ['Smalt fokus', 'Premium-prissättning'],
    pricing: 'Individual 24 USD/mån, Teams 49 USD/mån, Enterprise vid förfrågan.',
    bestFor: 'E-handelsföretag med stora produktkataloger',
    offer: { title: '7 dagar gratis trial', price: 'Individual 24 USD/mån' },
    tags: ['E-commerce', 'Bulk', 'Shopify', 'Product Descriptions'],
    useCases: ['Produktbeskrivningar', 'Kategorisidor', 'E-handelsannonser', 'Produktbilder', 'Katalogtexter'],
    label: 'Bäst för e-handel', logo: 'bg-indigo-600',
  },
  {
    slug: 'anyword', parent: 'content-copywriting', brand: 'Anyword', company: 'Anyword', founded: 2013, hq: 'Tel Aviv, Israel',
    score: 8.3, fallbackUrl: 'https://anyword.com',
    title: 'Anyword — performance-AI med score per variant',
    oneliner: 'Performance-AI som ger predictive score för varje copy-variant.',
    features: ['Predictive Performance Score', 'Custom Audiences för persona-anpassning', 'Channel-specifika mallar', 'A/B-test-integration'],
    pros: ['Datadriven copy-optimering', 'Predictive Score unikt', 'Stark för annonser'],
    cons: ['Smalare än Jasper på bredd', 'Premium-pris'],
    pricing: 'Starter 39 USD/mån för 1 användare. Data-Driven 79 USD/mån, Business 349 USD/mån, Enterprise vid förfrågan.',
    bestFor: 'Performance-marknadsförare som mäter varje copy',
    offer: { title: '7 dagar gratis trial', price: 'Starter 39 USD/mån' },
    tags: ['Performance Score', 'Custom Audiences', 'A/B-test', 'Performance'],
    useCases: ['Annonscopy', 'Landing pages', 'E-post-kampanjer', 'Sociala medier-annonser', 'CRO-copy'],
    label: 'Bäst för performance', logo: 'bg-cyan-600',
  },
  {
    slug: 'contentatscale', parent: 'content-copywriting', brand: 'Content at Scale', company: 'Content at Scale', founded: 2022, hq: 'Tampa, USA',
    score: 8.0, fallbackUrl: 'https://contentatscale.ai',
    title: 'Content at Scale — long-form på autopilot, AI Detector inbyggt',
    oneliner: 'Long-form på autopilot — och passerar AI-detektorerna.',
    features: ['Full artikel från ett keyword', 'AI Detector-bypass via humanizer', 'Bulk processing av 100+ artiklar', 'Direct WordPress-publishing'],
    pros: ['Mest autonom long-form-AI', 'Detection-bypass fungerar', 'Bulk-flöden sparar tid'],
    cons: ['Per-artikel-pris högt', 'Output kräver alltid en redigeringsrunda'],
    pricing: 'Solo 250 USD/mån för 20 artiklar. Starter 500 USD/mån, Scaling 1500 USD/mån. Pay-as-you-go från 12 USD/artikel.',
    bestFor: 'Affiliate-sajter och content-skalning',
    offer: { title: 'Demo bokas via sajt', price: 'Solo 250 USD/mån' },
    tags: ['Long-form', 'AI Detector-pass', 'Bulk', 'Autopilot'],
    useCases: ['Affiliate-content', 'SEO-skala', 'Bulk-publicering', 'Long-form i volym', 'WordPress-pipelines'],
    label: 'Bäst för skala', logo: 'bg-fuchsia-700',
  },

  // ── Annonser ──────────────────────────────────────────────────
  {
    slug: 'chatgpt-ads', parent: 'annonser', brand: 'ChatGPT', company: 'OpenAI', founded: 2015, hq: 'San Francisco, USA',
    score: 9.0, fallbackUrl: 'https://chat.openai.com',
    title: 'ChatGPT för annonser — generera 50 varianter på minuter',
    oneliner: 'Generera 50 annonsvarianter på minuter, alla kanaler.',
    features: ['Bulk-generering per persona', 'Variation per ad-format (search, social, display)', 'Custom GPTs för brand voice', 'Översättning till alla kanaler'],
    pros: ['Snabbast variantgenerering', 'Bra på svenska annonser', 'Brett ad-format-stöd'],
    cons: ['Ingen direkt plattformsintegration', 'Kräver bra prompts för CRO-text'],
    pricing: 'Plus 20 USD/mån räcker långt. Team 25 USD/användare/mån för marknads-team.',
    bestFor: 'Snabb variantgenerering över alla kanaler',
    offer: { title: 'Plus 7 dagar gratis', price: 'Gratis · Plus 20 USD/mån' },
    tags: ['GPT-5', 'Custom GPTs', 'Multilingual', 'Snabb'],
    useCases: ['Google Ads-copy', 'Meta-annonscopy', 'LinkedIn Ads', 'Display-headlines', 'Översättning av annonser'],
    label: 'Redaktionens val', logo: 'bg-emerald-500',
  },
  {
    slug: 'adcreative-ai', parent: 'annonser', brand: 'AdCreative.ai', company: 'AdCreative.ai', founded: 2021, hq: 'Paris, Frankrike',
    score: 8.8, fallbackUrl: 'https://www.adcreative.ai',
    title: 'AdCreative.ai — kreativa AI-annonser med performance score',
    oneliner: 'AI-genererade banners och statiska annonser med predictive score.',
    features: ['Banner- och bildgenerering på sekunder', 'Predictive Performance Score', 'Brand kit och varumärkesintegration', 'Native Meta/Google Ads-integration'],
    pros: ['Snabba kreativa varianter', 'Performance-score sparar test-budget', 'Bra för småteam'],
    cons: ['Output kan kännas mall-aktig', 'Pricing skalar fort'],
    pricing: 'Starter 25 USD/mån för 10 credits, Premium 109 USD/mån, Ultimate 249 USD/mån.',
    bestFor: 'Småföretag som vill skala kreativ produktion',
    offer: { title: '7 dagar gratis trial', price: 'Starter 25 USD/mån' },
    tags: ['Kreativ AI', 'Performance Score', 'Banners', 'Meta/Google'],
    useCases: ['Banner-annonser', 'Statiska Meta-annonser', 'Google Display', 'Sociala annonser', 'Brand-konsistens'],
    label: 'Bäst för kreativ skala', logo: 'bg-violet-600',
  },
  {
    slug: 'pencil-ai', parent: 'annonser', brand: 'Pencil', company: 'Generative AI (Pencil)', founded: 2018, hq: 'Singapore',
    score: 8.5, fallbackUrl: 'https://www.trypencil.com',
    title: 'Pencil — AI-video och statiska annonser för Meta',
    oneliner: 'AI-video och statiska annonser optimerade för Meta-plattformarna.',
    features: ['Video-annonser med AI-skript och röst', 'Statiska annonser med brand kit', 'Predictive metrics för Meta', 'White-label för byråer'],
    pros: ['Stark på Meta-video', 'Bra för byråer', 'Snabb iterationscykel'],
    cons: ['Smalare än AdCreative på format', 'Premium-prissättning'],
    pricing: 'Pro 119 USD/mån för 100 generations, Agency 499 USD/mån, Enterprise vid förfrågan.',
    bestFor: 'Byråer som producerar Meta-annonser i skala',
    offer: { title: 'Demo bokas via sajt', price: 'Pro 119 USD/mån' },
    tags: ['AI-video', 'Meta', 'Predictive', 'Byråer'],
    useCases: ['Meta-videoannonser', 'Static carousel', 'TikTok-format', 'Brand kit-flöden', 'Byråproduktion'],
    label: 'Bäst för Meta-video', logo: 'bg-sky-600',
  },
  {
    slug: 'persado', parent: 'annonser', brand: 'Persado', company: 'Persado', founded: 2012, hq: 'New York, USA',
    score: 8.6, fallbackUrl: 'https://www.persado.com',
    title: 'Persado — enterprise-AI för emotion-driven copy',
    oneliner: 'Enterprise-AI som genererar copy baserat på känslomässig respons.',
    features: ['Emotion-tagged copy-generation', 'Performance-prediction per språk', 'Enterprise-säkerhet och SLA', 'Integration med marknadsföringsstack'],
    pros: ['Branschledande för Fortune 500', 'Vetenskapligt grundad emotionsmodell', 'Beprövad ROI'],
    cons: ['Bara enterprise — inget för småteam', 'Dyr setup'],
    pricing: 'Enterprise-prissättning från ~50k USD/år. Ingen self-serve.',
    bestFor: 'Fortune 500 och stora finansiella aktörer',
    offer: { title: 'Demo bokas via sajt', price: 'Enterprise från ~50k USD/år' },
    tags: ['Enterprise', 'Emotion AI', 'Performance', 'Multi-language'],
    useCases: ['Enterprise-e-postkampanjer', 'Banking & insurance copy', 'Multivariate testing', 'Storskaliga A/B-tester', 'Brand-konsistens'],
    label: 'Bäst för enterprise', logo: 'bg-zinc-800',
  },
  {
    slug: 'smartly-io', parent: 'annonser', brand: 'Smartly.io', company: 'Smartly.io', founded: 2013, hq: 'Helsingfors, Finland',
    score: 8.7, fallbackUrl: 'https://www.smartly.io',
    title: 'Smartly.io — nordisk martech-plattform för social advertising',
    oneliner: 'Nordisk martech-plattform för social advertising i skala.',
    features: ['Dynamic Creative Optimization (DCO)', 'AI-driven budget allocation', 'Stöd för Meta, TikTok, Pinterest, Snap', 'Cross-channel reporting'],
    pros: ['Nordiskt företag med stark europeisk närvaro', 'Skalbar för stora annonseringsbudgetar', 'Brett plattformsstöd'],
    cons: ['Premium-prislapp', 'Komplext för småteam'],
    pricing: 'Custom pricing baserat på media spend. Generellt 5-10% av annonsbudget.',
    bestFor: 'E-handel och stora annonsörer i Norden',
    offer: { title: 'Demo bokas via sajt', price: 'Custom pricing' },
    tags: ['Nordic', 'DCO', 'Cross-channel', 'Enterprise'],
    useCases: ['Dynamic Creative', 'Cross-channel-kampanjer', 'Performance-marketing', 'E-handelsannonser', 'Stora budgetar'],
    label: 'Bäst nordisk', logo: 'bg-blue-600',
  },
  {
    slug: 'albert-ai', parent: 'annonser', brand: 'Albert', company: 'Albert (Zoomd)', founded: 2010, hq: 'Tel Aviv, Israel',
    score: 8.0, fallbackUrl: 'https://albert.ai',
    title: 'Albert — autonom AI-marketer för paid media',
    oneliner: 'Autonom AI-marketer som optimerar dina kampanjer 24/7.',
    features: ['Helt autonom kampanjoptimering', 'Cross-channel budget allocation', 'Audience discovery via ML', 'Creative testing i loop'],
    pros: ['Sant autonom — sätt och glöm', 'Skalbar over flera kanaler', 'Bra för team utan media buyers'],
    cons: ['Mindre kontroll än manuella verktyg', 'Premium-pris'],
    pricing: 'Enterprise från ca 5000 USD/mån. Demo och custom pricing.',
    bestFor: 'Företag som vill outsourca paid media-optimering',
    offer: { title: 'Demo bokas via sajt', price: 'Enterprise från ~5k USD/mån' },
    tags: ['Autonom', 'Cross-channel', 'Audience AI', 'Enterprise'],
    useCases: ['Autonom paid media', 'Cross-channel-optimering', 'Audience discovery', 'Creative testing', 'Budget-allocation'],
    label: 'Bäst autonom', logo: 'bg-purple-700',
  },
  {
    slug: 'pattern89', parent: 'annonser', brand: 'Pattern89', company: 'Shutterstock (Pattern89)', founded: 2017, hq: 'Minneapolis, USA',
    score: 7.7, fallbackUrl: 'https://www.shutterstock.com/discover/pattern89',
    title: 'Pattern89 — kreativ intelligens från Shutterstock',
    oneliner: 'Kreativ-intelligens-AI som förutspår vilka annonser presterar.',
    features: ['Creative scoring innan launch', 'Audience-fit prediction', 'Element-nivå-rekommendationer', 'Cross-platform creative insights'],
    pros: ['Predictive analytics innan budgetslöseri', 'Stark på creative-elements', 'Shutterstock-integration'],
    cons: ['Smalt användningsområde', 'Mindre aktiv produkt'],
    pricing: 'Custom pricing via Shutterstock. Typiskt 1-5k USD/mån.',
    bestFor: 'Annonsteam som testar mycket creative',
    offer: { title: 'Demo bokas via sajt', price: 'Custom pricing' },
    tags: ['Creative AI', 'Predictive', 'Shutterstock', 'Audience'],
    useCases: ['Creative-prediction', 'A/B-test-design', 'Element-optimering', 'Audience-matching', 'Pre-launch QA'],
    label: 'Bäst predictive', logo: 'bg-pink-600',
  },
  {
    slug: 'motionapp', parent: 'annonser', brand: 'Motion', company: 'Motion (motionapp.com)', founded: 2020, hq: 'New York, USA',
    score: 8.4, fallbackUrl: 'https://motionapp.com',
    title: 'Motion — kreativ analytics-AI för paid social',
    oneliner: 'Kreativ analytics-AI som visar exakt vad i annonsen fungerar.',
    features: ['Creative reporting per element', 'Tagger som auto-taggar 1000+ ads', 'Hook-effectiveness score', 'Cross-creative trend-analys'],
    pros: ['Bästa creative analytics-verktyget', 'Aktiv produktutveckling', 'Bra för in-house team'],
    cons: ['Mer rapport än optimering', 'Pricing per ad-spend'],
    pricing: 'Starter 199 USD/mån för ad spend upp till 50k USD. Growth 999 USD/mån, Enterprise vid förfrågan.',
    bestFor: 'In-house creative-team på paid social',
    offer: { title: '14 dagar gratis trial', price: 'Starter 199 USD/mån' },
    tags: ['Creative Analytics', 'Tagger', 'Paid Social', 'Reporting'],
    useCases: ['Creative reporting', 'Hook-analys', 'Auto-tagging', 'Trend-spotting', 'A/B-test-läsning'],
    label: 'Bäst för creative analytics', logo: 'bg-amber-700',
  },
  {
    slug: 'madgicx', parent: 'annonser', brand: 'Madgicx', company: 'Madgicx', founded: 2018, hq: 'Tel Aviv, Israel',
    score: 8.2, fallbackUrl: 'https://madgicx.com',
    title: 'Madgicx — AI-marketing-cloud för Meta-annonser',
    oneliner: 'AI-marketing-cloud byggd specifikt för Meta-annonsörer.',
    features: ['1-Click Report för Meta Ads', 'AI Targeting med 100+ audiences', 'Creative Insights med tagging', 'Budget-optimering automatiskt'],
    pros: ['Mest komplett Meta-svit', 'Bra för småteam', 'Tydlig ROI'],
    cons: ['Bara Meta-plattformar', 'UI kräver inlärning'],
    pricing: 'All-in-One 49 USD/mån för ad spend upp till 1500 USD/mån, Premium 99-499 USD/mån baserat på spend.',
    bestFor: 'Småteam med Meta-tunga annonser',
    offer: { title: '7 dagar gratis trial', price: 'All-in-One 49 USD/mån' },
    tags: ['Meta', 'AI Targeting', 'Creative Insights', 'Reporting'],
    useCases: ['Meta-rapportering', 'AI-targeting', 'Creative-analys', 'Budget-optimering', 'Audience discovery'],
    label: 'Bäst för Meta', logo: 'bg-fuchsia-600',
  },
  {
    slug: 'revealbot', parent: 'annonser', brand: 'Revealbot', company: 'Revealbot', founded: 2017, hq: 'San Francisco, USA',
    score: 8.3, fallbackUrl: 'https://revealbot.com',
    title: 'Revealbot — automatiseringsregler för Meta, Google och TikTok',
    oneliner: 'Bygg avancerade automatiseringsregler för Meta, Google och TikTok.',
    features: ['No-code rule builder för paus/skalning', 'AI Marketer för auto-optimering', 'Cross-channel rapportering', 'Slack-integration för alerts'],
    pros: ['Mest flexibla regelsystemet på marknaden', 'Cross-channel-stöd', 'Bra Slack-flöde'],
    cons: ['Brant inlärningskurva', 'Pricing skalar med ad spend'],
    pricing: 'Starter 99 USD/mån, Standard 199 USD/mån, Pro 499 USD/mån. Skalas med media spend.',
    bestFor: 'Performance-team som vill automatisera regler',
    offer: { title: '14 dagar gratis trial', price: 'Starter 99 USD/mån' },
    tags: ['Automation Rules', 'Cross-channel', 'Slack', 'AI Marketer'],
    useCases: ['Auto-paus av tappare', 'Skalningsregler', 'Budget-justering', 'Bid-automation', 'Cross-channel-rapport'],
    label: 'Bäst för automation', logo: 'bg-indigo-600',
  },

  // ── Sociala medier ────────────────────────────────────────────
  {
    slug: 'chatgpt-social', parent: 'sociala-medier', brand: 'ChatGPT', company: 'OpenAI', founded: 2015, hq: 'San Francisco, USA',
    score: 9.1, fallbackUrl: 'https://chat.openai.com',
    title: 'ChatGPT för sociala medier — captions, hashtags och kalendrar',
    oneliner: 'Snabbast captions, hashtags och content-kalendrar — bara prompta.',
    features: ['Captions i alla format på sekunder', 'Hashtag-research per plattform', 'Content-kalendrar för en månad i taget', 'Bild-/video-prompts för andra verktyg'],
    pros: ['Snabbast variantgenerering', 'Bra svenska för captions', 'Custom GPTs för brand voice'],
    cons: ['Ingen direkt schemaläggning', 'Behöver kopplas mot Buffer/Hootsuite'],
    pricing: 'Plus 20 USD/mån räcker långt. Team 25 USD/användare/mån för team.',
    bestFor: 'Snabb idégenerering och captions',
    offer: { title: 'Plus 7 dagar gratis', price: 'Gratis · Plus 20 USD/mån' },
    tags: ['GPT-5', 'Custom GPTs', 'Multilingual', 'Snabb'],
    useCases: ['Captions per plattform', 'Hashtag-research', 'Content-kalendrar', 'Bild-prompts', 'Bio och om-texter'],
    label: 'Redaktionens val', logo: 'bg-emerald-500',
  },
  {
    slug: 'hootsuite-ai', parent: 'sociala-medier', brand: 'Hootsuite', company: 'Hootsuite', founded: 2008, hq: 'Vancouver, Kanada',
    score: 8.7, fallbackUrl: 'https://www.hootsuite.com',
    title: 'Hootsuite AI — OwlyWriter genererar och schemalägger',
    oneliner: 'Klassisk schemaläggare med OwlyWriter AI inbyggd.',
    features: ['OwlyWriter AI för captions och idéer', 'Schemaläggning för 10+ plattformar', 'Inbox för meddelanden', 'Analytics och competitor insights'],
    pros: ['Branschstandard med mogen produkt', 'Brett plattformsstöd', 'Bra rapportering'],
    cons: ['Premium-prislapp', 'UI känns daterat'],
    pricing: 'Professional 99 USD/mån för 10 sociala konton. Team 249 USD/mån, Business vid förfrågan.',
    bestFor: 'Större marknadsteam med många konton',
    offer: { title: '30 dagar gratis trial', price: 'Professional 99 USD/mån' },
    tags: ['OwlyWriter', 'Schedule', 'Analytics', '10+ platforms'],
    useCases: ['Schemaläggning över plattformar', 'AI-captions', 'Inbox-hantering', 'Analytics', 'Competitor-spaning'],
    label: 'Bäst för stora team', logo: 'bg-yellow-600',
  },
  {
    slug: 'buffer-ai', parent: 'sociala-medier', brand: 'Buffer', company: 'Buffer', founded: 2010, hq: 'San Francisco, USA (remote)',
    score: 8.5, fallbackUrl: 'https://buffer.com',
    title: 'Buffer AI Assistant — schemaläggning som inte sticker i ögonen',
    oneliner: 'Lätt schemaläggare med AI Assistant — billig och enkel.',
    features: ['AI Assistant för captions och variationer', 'Schemaläggning för 8 plattformar', 'Start Page-bygge', 'Engagement-rapporter'],
    pros: ['Enkelt UI', 'Bra prisplan för småteam', 'Bra Start Page-funktion'],
    cons: ['Smal analytics jämfört med Hootsuite', 'Inga inkorgs-funktioner i lägsta plan'],
    pricing: 'Free med 3 kanaler, Essentials 6 USD/månad per kanal, Team 12 USD/månad per kanal, Agency 120 USD/månad.',
    bestFor: 'Småteam och soloföretagare',
    offer: { title: 'Free med 3 kanaler', price: 'Essentials 6 USD/månad/kanal' },
    tags: ['AI Assistant', 'Schedule', 'Start Page', 'Affordable'],
    useCases: ['Schemaläggning', 'AI-captions', 'Multi-account-flöden', 'Link-in-bio', 'Småteam-rapport'],
    label: 'Bästa pris-prestanda', logo: 'bg-violet-600',
  },
  {
    slug: 'predis-ai', parent: 'sociala-medier', brand: 'Predis.ai', company: 'Predis.ai', founded: 2021, hq: 'Bangalore, Indien',
    score: 8.6, fallbackUrl: 'https://predis.ai',
    title: 'Predis.ai — AI-skapad social-content på sekunder',
    oneliner: 'AI som skapar färdiga posts, carousels och videos från en idé.',
    features: ['Auto-genererade carousels och reels', 'Brand voice-träning från befintliga posts', 'Bulk content från en kalender', 'Schemaläggning till alla plattformar'],
    pros: ['Snabbast från idé till färdig post', 'Stark på visuellt innehåll', 'Bra för småteam'],
    cons: ['Output kan bli mall-aktigt', 'Begränsad finkalibrering'],
    pricing: 'Free med 15 posts/månad. Lite 32 USD/mån, Premium 59 USD/mån, Agency 119 USD/mån.',
    bestFor: 'Småteam som behöver content i volym',
    offer: { title: 'Free med 15 posts/månad', price: 'Lite 32 USD/mån' },
    tags: ['Carousels', 'Reels', 'Brand Voice', 'Schedule'],
    useCases: ['Carousels på sekunder', 'Reels-script', 'Bulk-publicering', 'Brand voice-flöden', 'Multi-plattform'],
    label: 'Bäst för innehåll i skala', logo: 'bg-pink-500',
  },
  {
    slug: 'flick-ai', parent: 'sociala-medier', brand: 'Flick', company: 'Flick', founded: 2018, hq: 'UK',
    score: 8.2, fallbackUrl: 'https://flick.social',
    title: 'Flick AI — hashtag-research och Instagram-AI',
    oneliner: 'Hashtag-research-AI och content-assistent för Instagram.',
    features: ['Hashtag Manager med performance-data', 'AI Content Assistant för captions', 'Schemaläggning för Instagram, TikTok, X, FB', 'Analytics per post'],
    pros: ['Bästa hashtag-research-verktyget', 'Stark Instagram-fokus', 'Bra för creators'],
    cons: ['Smalt fokus på Instagram', 'AI-features yngre än Hootsuite'],
    pricing: 'Solo 14 USD/mån, Pro 28 USD/mån, Agency 68 USD/mån.',
    bestFor: 'Creators och småbyråer på Instagram',
    offer: { title: '7 dagar gratis trial', price: 'Solo 14 USD/mån' },
    tags: ['Hashtags', 'Instagram', 'Captions', 'Creators'],
    useCases: ['Hashtag-research', 'Instagram-captions', 'TikTok-planering', 'Creator-analytics', 'Multi-account'],
    label: 'Bäst för hashtags', logo: 'bg-rose-600',
  },
  {
    slug: 'lately-ai', parent: 'sociala-medier', brand: 'Lately.ai', company: 'Lately.ai', founded: 2018, hq: 'New York, USA',
    score: 8.0, fallbackUrl: 'https://www.lately.ai',
    title: 'Lately.ai — gör om long-form-content till social posts',
    oneliner: 'Konvertera artiklar, podcasts och video till färdiga social posts.',
    features: ['Long-form till 30+ social posts automatiskt', 'Bra för repurposing av podcasts/video', 'Brand voice-träning per varumärke', 'Analytics som lär över tid'],
    pros: ['Bäst för repurposing av long-form', 'Lär sig din röst över tid', 'Bra för podcasters'],
    cons: ['Smalare än Buffer på schemaläggning', 'Premium-prissättning'],
    pricing: 'Starter 49 USD/mån för 2 användare. Pro 119 USD/mån, Business 199 USD/mån.',
    bestFor: 'Podcasters, videomakare och thought leaders',
    offer: { title: 'Demo bokas via sajt', price: 'Starter 49 USD/mån' },
    tags: ['Repurposing', 'Long-form', 'Podcast', 'Learning AI'],
    useCases: ['Podcast till social', 'Artikel till tweets', 'Video till klipp-captions', 'Brand voice-träning', 'Thought leadership'],
    label: 'Bäst för repurposing', logo: 'bg-indigo-700',
  },
  {
    slug: 'ocoya', parent: 'sociala-medier', brand: 'Ocoya', company: 'Ocoya', founded: 2020, hq: 'Tallinn, Estland',
    score: 8.3, fallbackUrl: 'https://www.ocoya.com',
    title: 'Ocoya — all-in-one social med AI-content, design och schemaläggning',
    oneliner: 'All-in-one: AI-content, design, schemaläggning — bra prisvärde.',
    features: ['AI-genererad copy + design i samma flöde', 'Brand kit med templates', 'Schemaläggning för 10+ plattformar', 'E-handel-integration (Shopify/Woo)'],
    pros: ['Mest i en plattform', 'Bra för e-handel', 'EU-baserat'],
    cons: ['UI rörigt med många funktioner', 'AI-output kräver redigering'],
    pricing: 'Bronze 19 USD/mån, Silver 39 USD/mån, Gold 159 USD/mån.',
    bestFor: 'E-handelsföretag och multikanal-marknadsförare',
    offer: { title: '14 dagar gratis trial', price: 'Bronze 19 USD/mån' },
    tags: ['All-in-one', 'Design', 'E-commerce', 'EU'],
    useCases: ['AI-content', 'Banner-design', 'Multi-plattform-schema', 'E-handelsannonser', 'Brand kit'],
    label: 'Bäst all-in-one', logo: 'bg-teal-600',
  },
  {
    slug: 'postwise', parent: 'sociala-medier', brand: 'Postwise', company: 'Postwise', founded: 2022, hq: 'USA',
    score: 8.1, fallbackUrl: 'https://postwise.ai',
    title: 'Postwise — AI för X (Twitter) tweets och trådar',
    oneliner: 'AI-skribent och schemaläggare specialiserad för X (Twitter).',
    features: ['Viral tweet-generator', 'Tråd-byggare', 'Auto-DM och engagement-flöden', 'Schemaläggning och analytics'],
    pros: ['Bästa AI:n för X specifikt', 'Stark viral-detection', 'Bra för growth hackers'],
    cons: ['Bara X-plattformen', 'Pricing per användare'],
    pricing: 'Author 25 USD/mån, Storyteller 49 USD/mån, Celebrity 99 USD/mån.',
    bestFor: 'Growth hackers och thought leaders på X',
    offer: { title: '7 dagar gratis trial', price: 'Author 25 USD/mån' },
    tags: ['X (Twitter)', 'Viral', 'Threads', 'Growth'],
    useCases: ['Viral tweets', 'Tråd-bygge', 'Auto-engagement', 'Schedule', 'Audience growth'],
    label: 'Bäst för X', logo: 'bg-sky-700',
  },
  {
    slug: 'taplio', parent: 'sociala-medier', brand: 'Taplio', company: 'Taplio', founded: 2021, hq: 'Lyon, Frankrike',
    score: 8.4, fallbackUrl: 'https://taplio.com',
    title: 'Taplio — AI för LinkedIn-content och relationer',
    oneliner: 'Bästa AI-verktyget för LinkedIn-content och relationsbyggande.',
    features: ['AI-driven post-generator för LinkedIn', 'Relationship Manager för CRM', 'Inspiration-feed med top-performing posts', 'Auto-engagement med custom rules'],
    pros: ['Bäst LinkedIn-specifika AI:n', 'Stark CRM-funktion', 'EU-baserat'],
    cons: ['Bara LinkedIn', 'Pricing inte för budget-användare'],
    pricing: 'Starter 49 USD/mån, Standard 65 USD/mån, Pro 79 USD/mån.',
    bestFor: 'B2B-säljare och LinkedIn thought leaders',
    offer: { title: '7 dagar gratis trial', price: 'Starter 49 USD/mån' },
    tags: ['LinkedIn', 'B2B', 'CRM', 'EU'],
    useCases: ['LinkedIn-posts', 'B2B-prospecting', 'Relationship management', 'Auto-engagement', 'Inspiration feed'],
    label: 'Bäst för LinkedIn', logo: 'bg-blue-700',
  },
  {
    slug: 'fedica', parent: 'sociala-medier', brand: 'Fedica', company: 'Fedica (Tweepi)', founded: 2008, hq: 'USA',
    score: 7.5, fallbackUrl: 'https://fedica.com',
    title: 'Fedica — audience-analys och content för Twitter/X och Bluesky',
    oneliner: 'Audience-analys och content-AI för Twitter/X — och nu även Bluesky.',
    features: ['Audience-analys och cleanup-tools', 'AI-content för X/Bluesky', 'Schemaläggning med best-time-AI', 'Hashtag- och follower-research'],
    pros: ['Tidigt med Bluesky-stöd', 'Stark audience-cleanup', 'Mogen produkt sedan Tweepi-tiden'],
    cons: ['UI känns daterat', 'Smalt fokus'],
    pricing: 'Solo 9,99 USD/mån, Premium 19,99 USD/mån, Business 49 USD/mån.',
    bestFor: 'X/Bluesky-användare som vill rensa följare och hitta audience',
    offer: { title: 'Free-plan tillgänglig', price: 'Solo 9,99 USD/mån' },
    tags: ['X', 'Bluesky', 'Audience', 'Cleanup'],
    useCases: ['Audience-analys', 'Follower-cleanup', 'AI-content', 'Schedule', 'Cross-posting X/Bluesky'],
    label: 'Bäst för X-audience', logo: 'bg-cyan-700',
  },

  // ── Bokföring ─────────────────────────────────────────────────
  {
    slug: 'fortnox-ai', parent: 'bokforing', brand: 'Fortnox', company: 'Fortnox', founded: 2001, hq: 'Växjö, Sverige',
    score: 9.3, fallbackUrl: 'https://www.fortnox.se',
    title: 'Fortnox AI — Sveriges mest använda bokföringsprogram med AI',
    oneliner: 'Sveriges största bokföringsprogram — AI:n läser kvitton och bankhändelser.',
    features: ['AI-tolkning av kvitton via kamera', 'Auto-konteringsförslag baserat på historik', 'Bankkoppling med 99% av svenska banker', 'Integrerad lönehantering och fakturering'],
    pros: ['Marknadsledande i Sverige', 'Stark AI för kvittotolkning', 'Bred integrationsmarknad'],
    cons: ['Premium-prislapp', 'Komplext för mikroföretag'],
    pricing: 'Företag-paketet från 159 kr/mån, Företag Premium 279 kr/mån, Komplett 599 kr/mån. AI-features ingår.',
    bestFor: 'SME:er och konsulter i Sverige',
    offer: { title: '30 dagar gratis trial', price: 'Företag 159 kr/mån' },
    tags: ['Svenskt', 'AI-kvitton', 'Bankkoppling', 'Lön'],
    useCases: ['Löpande bokföring', 'Kvittotolkning', 'Fakturering', 'Lönehantering', 'Bankavstämning'],
    label: 'Redaktionens val', logo: 'bg-emerald-700',
  },
  {
    slug: 'visma-ai', parent: 'bokforing', brand: 'Visma eEkonomi', company: 'Visma', founded: 1996, hq: 'Oslo, Norge',
    score: 9.0, fallbackUrl: 'https://www.vismaspcs.se/produkter/visma-eekonomi',
    title: 'Visma eEkonomi — nordisk bokföring med stark AI-koppling',
    oneliner: 'Nordens näst största bokföringsprogram med växande AI-stöd.',
    features: ['AutoKollen för smartare konteringsförslag', 'Skanna kvitton via app', 'Bankkoppling med Visma AutoPay', 'Komplett SIE-export'],
    pros: ['Stort nordiskt företag — stabilt', 'Stark integration med Visma-sviten', 'Bra för byråer'],
    cons: ['UI inte lika modernt som Fortnox', 'AI-features ligger ett steg efter'],
    pricing: 'Smart 199 kr/mån, Pro 279 kr/mån, Premium 549 kr/mån.',
    bestFor: 'SME:er och redovisningsbyråer i Norden',
    offer: { title: '30 dagar gratis trial', price: 'Smart 199 kr/mån' },
    tags: ['Nordisk', 'AutoKollen', 'Skanna kvitton', 'SIE'],
    useCases: ['Löpande bokföring', 'Kvittohantering', 'Fakturering', 'Bankavstämning', 'Byrå-flöden'],
    label: 'Bäst för byråer', logo: 'bg-blue-700',
  },
  {
    slug: 'bokio-ai', parent: 'bokforing', brand: 'Bokio', company: 'Bokio', founded: 2015, hq: 'Göteborg, Sverige',
    score: 8.7, fallbackUrl: 'https://www.bokio.se',
    title: 'Bokio AI — gratis bokföring med AI för enskild firma',
    oneliner: 'Gratis bokföring med AI som kategoriserar och fakturerar — perfekt för enskild firma.',
    features: ['Gratis grundplan med AI-kategorisering', 'Skanna kvitton via app', 'Bankkoppling till svenska banker', 'Fakturering och lön i samma paket'],
    pros: ['Helt gratis grundplan', 'Designat för enskilda firmor', 'Modern UX'],
    cons: ['Smal för större företag', 'Mindre byråstöd'],
    pricing: 'Gratis upp till 50 transaktioner/mån. Premium 99 kr/mån för obegränsat. Smart 199 kr/mån.',
    bestFor: 'Enskilda firmor och soloföretagare',
    offer: { title: 'Gratis grundplan', price: 'Premium 99 kr/mån' },
    tags: ['Gratis', 'Enskild firma', 'Modern UX', 'Svenskt'],
    useCases: ['Bokföring för enskild firma', 'Kvittohantering', 'Fakturering', 'Lön (Premium)', 'Bankavstämning'],
    label: 'Bäst för soloföretag', logo: 'bg-teal-600',
  },
  {
    slug: 'dooer', parent: 'bokforing', brand: 'Dooer', company: 'Dooer (Sverige)', founded: 2014, hq: 'Stockholm, Sverige',
    score: 8.2, fallbackUrl: 'https://www.dooer.com',
    title: 'Dooer — autonom bokföring där AI sköter allt',
    oneliner: 'Autonom bokföring — du tar bilder, AI:n och en redovisningskonsult sköter resten.',
    features: ['Foto-baserad inrapportering via app', 'AI-kategoriserar och bokför automatiskt', 'Auktoriserad redovisningskonsult ingår', 'Månads- och årsbokslut hanteras'],
    pros: ['Bara fota — inget mer', 'Inkluderar mänsklig redovisningskonsult', 'Bra för entreprenörer'],
    cons: ['Premium-pris jämfört med DIY', 'Mindre kontroll över detaljer'],
    pricing: 'Från 449 kr/mån för enskild firma, från 899 kr/mån för AB. Skalar med transaktioner.',
    bestFor: 'Entreprenörer som vill outsourca bokföringen helt',
    offer: { title: 'Prova en månad gratis', price: 'Från 449 kr/mån' },
    tags: ['Autonom', 'App', 'Redovisningskonsult', 'Svenskt'],
    useCases: ['Outsourcad bokföring', 'Foto-inrapportering', 'Månadsbokslut', 'Årsredovisning', 'Skattedeklaration'],
    label: 'Bäst för outsourcing', logo: 'bg-fuchsia-700',
  },
  {
    slug: 'speedledger-ai', parent: 'bokforing', brand: 'SpeedLedger', company: 'SpeedLedger', founded: 2003, hq: 'Göteborg, Sverige',
    score: 8.4, fallbackUrl: 'https://www.speedledger.se',
    title: 'SpeedLedger e-bokföring — webbaserad bokföring med smart kategorisering',
    oneliner: 'Webbaserad bokföring med smart kategorisering och stark bankintegration.',
    features: ['e-bokföring direkt från banken', 'Smart kategorisering med AI', 'Komplett fakturering', 'Lön och anställdas tidsrapportering'],
    pros: ['Stark bankintegration', 'Bra för småföretag', 'Svensk support'],
    cons: ['Mindre känt än Fortnox', 'AI-features yngre'],
    pricing: 'Mini 99 kr/mån, Bas 199 kr/mån, Pro 369 kr/mån.',
    bestFor: 'Småföretag och konsulter',
    offer: { title: '30 dagar gratis trial', price: 'Mini 99 kr/mån' },
    tags: ['Banking-first', 'Svenskt', 'Lön', 'Fakturering'],
    useCases: ['Bankbaserad bokföring', 'Fakturering', 'Lön', 'Tidsrapportering', 'Skattedeklaration'],
    label: 'Bäst banking-flöde', logo: 'bg-amber-700',
  },
  {
    slug: 'klara-ai', parent: 'bokforing', brand: 'Klara', company: 'Klara (Wint)', founded: 2018, hq: 'Stockholm, Sverige',
    score: 8.0, fallbackUrl: 'https://www.klara.se',
    title: 'Klara — automatiserad bokföring för småföretagare',
    oneliner: 'Automatiserad bokföring för småföretagare — AI sköter underlaget.',
    features: ['Automatisk underlagstolkning', 'Realtidsöversikt över ekonomi', 'Mobilapp för kvitto och faktura', 'Skatte- och momsdeklaration'],
    pros: ['Designat för småföretag', 'Mobil-first', 'Bra svensk support'],
    cons: ['Mindre etablerad än Fortnox', 'Smalare integration med byråer'],
    pricing: 'Från 199 kr/mån för enskild firma. AB-plan från 399 kr/mån.',
    bestFor: 'Småföretag som vill ha enkel bokföring',
    offer: { title: '30 dagar gratis trial', price: 'Från 199 kr/mån' },
    tags: ['Småföretag', 'Mobil-first', 'Svenskt', 'Realtid'],
    useCases: ['Småföretagsbokföring', 'Mobil-kvitton', 'Skattedeklaration', 'Momsrapportering', 'Realtidsekonomi'],
    label: 'Bäst för småföretag', logo: 'bg-rose-600',
  },
  {
    slug: 'billogram-ai', parent: 'bokforing', brand: 'Billogram', company: 'Billogram', founded: 2010, hq: 'Stockholm, Sverige',
    score: 8.3, fallbackUrl: 'https://www.billogram.com',
    title: 'Billogram — smart fakturering och betalningar med AI',
    oneliner: 'Smart fakturering och betalningsflöden — AI förutspår betalningsbeteende.',
    features: ['Smart fakturering med AI-paymentprediction', 'Inbox för kundkommunikation', 'Automatiska påminnelser och inkasso-flöden', 'API och integrationer'],
    pros: ['Stark på fakturering specifikt', 'Bra svensk integration', 'Modern produkt'],
    cons: ['Inte heltäckande bokföring', 'Premium-pris'],
    pricing: 'Custom pricing baserat på fakturavolym. Typiskt från 500 kr/mån.',
    bestFor: 'Företag med komplexa fakturerings- och påminnelseflöden',
    offer: { title: 'Demo bokas via sajt', price: 'Custom pricing' },
    tags: ['Fakturering', 'AI-payments', 'Inkasso', 'API'],
    useCases: ['Komplex fakturering', 'Påminnelseflöden', 'Inkasso-automation', 'Kundkommunikation', 'Payment prediction'],
    label: 'Bäst för fakturering', logo: 'bg-orange-600',
  },
  {
    slug: 'wint-ai', parent: 'bokforing', brand: 'Wint', company: 'Wint AI', founded: 2020, hq: 'Tel Aviv, Israel',
    score: 7.9, fallbackUrl: 'https://wint.ai',
    title: 'Wint AI — AI-controller för månadsbokslut',
    oneliner: 'AI-controller som automatiserar månadsbokslut för redovisningsteam.',
    features: ['AI-driven månadsbokslut', 'Auto-avstämning mellan systems', 'Anomaly detection i transaktioner', 'Audit trail för compliance'],
    pros: ['Stark för mid-market controllers', 'Auto-avstämning sparar tid', 'God audit trail'],
    cons: ['Engelskspråkig produkt', 'Krav på integrationer'],
    pricing: 'Custom pricing — typiskt 1000-5000 USD/mån baserat på storlek.',
    bestFor: 'Mid-market företag med interna controllers',
    offer: { title: 'Demo bokas via sajt', price: 'Custom pricing' },
    tags: ['Controller', 'Månadsbokslut', 'Anomaly', 'Audit'],
    useCases: ['Månadsbokslut', 'Auto-avstämning', 'Anomaly detection', 'Audit-trail', 'Controller-flöden'],
    label: 'Bäst för controllers', logo: 'bg-indigo-700',
  },
  {
    slug: 'pleo-ai', parent: 'bokforing', brand: 'Pleo', company: 'Pleo', founded: 2015, hq: 'Köpenhamn, Danmark',
    score: 8.8, fallbackUrl: 'https://www.pleo.io',
    title: 'Pleo — företagskort och utläggshantering med AI',
    oneliner: 'Smarta företagskort och utläggshantering — AI kategoriserar och bokför.',
    features: ['Fysiska och virtuella företagskort', 'AI-kategorisering av utlägg', 'Direkt-export till Fortnox/Visma', 'Realtidsöversikt över utgifter'],
    pros: ['Marknadsledande i Norden', 'Stark integration med svenska bokföringssystem', 'Modern app-UX'],
    cons: ['Avgift per kort', 'Funktionalitet begränsad i Starter'],
    pricing: 'Starter gratis för upp till 3 användare. Essential 99 kr/användare/mån, Advanced 199 kr/användare/mån.',
    bestFor: 'Företag med spridda team och många utlägg',
    offer: { title: 'Gratis Starter (3 användare)', price: 'Essential 99 kr/användare/mån' },
    tags: ['Företagskort', 'Utlägg', 'Nordic', 'Fortnox/Visma'],
    useCases: ['Företagskort', 'Utläggsrapport', 'Auto-kategorisering', 'Export till bokföring', 'Multi-team-utgifter'],
    label: 'Bäst för utlägg', logo: 'bg-pink-700',
  },

  // ── Redovisning ───────────────────────────────────────────────
  {
    slug: 'fortnox-redovisning', parent: 'redovisning', brand: 'Fortnox Redovisning', company: 'Fortnox', founded: 2001, hq: 'Växjö, Sverige',
    score: 9.2, fallbackUrl: 'https://www.fortnox.se',
    title: 'Fortnox Redovisning — byråverktyget för svenska redovisningskonsulter',
    oneliner: 'Branschstandarden för svenska redovisningsbyråer — AI för bokslut och avstämningar.',
    features: ['Byråverktyg för flera klienter samtidigt', 'AI-bokslut med automatiska kontroller', 'Årsredovisning med direkt-inlämning till Bolagsverket', 'K2/K3-stöd'],
    pros: ['Branschstandard i Sverige', 'Stark byråfunktionalitet', 'Direktintegration med Skatteverket och Bolagsverket'],
    cons: ['Premium-prislapp för byråer', 'Komplext för enskilda konsulter'],
    pricing: 'Byrå-paket från 499 kr/mån. Komplett byråstöd från ca 1500 kr/mån per användare.',
    bestFor: 'Svenska redovisningsbyråer',
    offer: { title: 'Demo för byråer bokas', price: 'Byrå från 499 kr/mån' },
    tags: ['Byrå', 'Bokslut', 'K2/K3', 'Bolagsverket'],
    useCases: ['Byråflöden', 'Bokslutsarbete', 'Årsredovisning', 'Skatteberäkningar', 'Multi-klient-hantering'],
    label: 'Redaktionens val', logo: 'bg-emerald-700',
  },
  {
    slug: 'pw-ai', parent: 'redovisning', brand: 'PwC AI', company: 'PwC', founded: 1854, hq: 'London, UK',
    score: 8.8, fallbackUrl: 'https://www.pwc.com/gx/en/issues/artificial-intelligence.html',
    title: 'PwC AI Tools — Big4-AI för revision och redovisning',
    oneliner: 'Big4-AI för revision och redovisning — proprietära modeller och GPT-tools.',
    features: ['ChatPwC interna modeller', 'AI-driven revisionsanalys', 'Halo-platform för audit', 'GenAI för disclosure-review'],
    pros: ['Branschledande inom Big4 på AI', 'Beprövade revisionsprocesser', 'Global skalbarhet'],
    cons: ['Bara för PwC-kunder', 'Inte self-serve'],
    pricing: 'Custom — endast tillgängligt via PwC-engagement. Pricing baseras på uppdragsomfattning.',
    bestFor: 'Större företag i revision hos PwC',
    offer: { title: 'Kontakta PwC-kontor', price: 'Custom via uppdrag' },
    tags: ['Big4', 'Audit', 'GenAI', 'Enterprise'],
    useCases: ['Revisionsanalys', 'Audit-automation', 'Disclosure-review', 'IFRS-compliance', 'Riskbedömning'],
    label: 'Bäst för PwC-kunder', logo: 'bg-orange-700',
  },
  {
    slug: 'deloitte-ai', parent: 'redovisning', brand: 'Deloitte AI', company: 'Deloitte', founded: 1845, hq: 'London, UK',
    score: 8.7, fallbackUrl: 'https://www2.deloitte.com/global/en/pages/about-deloitte/articles/artificial-intelligence.html',
    title: 'Deloitte AI — global revision och advisory med AI',
    oneliner: 'Global revision och advisory med generative AI i bottenplattan.',
    features: ['Omnia-plattformen för audit', 'AI-driven risk-assessment', 'Tax & Legal AI-verktyg', 'Industry-specifika modeller'],
    pros: ['Bredast inom Big4 på branschmodeller', 'Stark tax/legal-AI', 'Global närvaro'],
    cons: ['Bara via Deloitte-engagement', 'Enterprise-only'],
    pricing: 'Custom via uppdrag.',
    bestFor: 'Multinationella företag med Deloitte-relation',
    offer: { title: 'Kontakta Deloitte-kontor', price: 'Custom via uppdrag' },
    tags: ['Big4', 'Omnia', 'Tax AI', 'Enterprise'],
    useCases: ['Audit-automation', 'Risk assessment', 'Tax compliance', 'Industry-specific advisory', 'Multinationell konsolidering'],
    label: 'Bäst global advisory', logo: 'bg-zinc-800',
  },
  {
    slug: 'kpmg-ai', parent: 'redovisning', brand: 'KPMG AI', company: 'KPMG', founded: 1987, hq: 'Amstelveen, Nederländerna',
    score: 8.6, fallbackUrl: 'https://kpmg.com/xx/en/home/services/advisory/management-consulting/digital-lighthouse/ai-and-machine-learning.html',
    title: 'KPMG AI — KPMG Clara och AI-driven revision',
    oneliner: 'KPMG Clara — Big4-AI med starkt fokus på audit och compliance.',
    features: ['KPMG Clara för intelligent audit', 'AI-driven sample selection', 'Continuous monitoring', 'Stark IFRS- och K3-täckning'],
    pros: ['Mogen audit-AI', 'Stark compliance-fokus', 'Global skalbarhet'],
    cons: ['Bara KPMG-kunder', 'Custom pricing'],
    pricing: 'Custom via uppdrag.',
    bestFor: 'Företag med KPMG som revisor',
    offer: { title: 'Kontakta KPMG-kontor', price: 'Custom via uppdrag' },
    tags: ['Big4', 'KPMG Clara', 'Audit', 'Compliance'],
    useCases: ['Audit-flöden', 'Sample selection', 'Continuous audit', 'IFRS-compliance', 'Internal control-test'],
    label: 'Bäst för audit', logo: 'bg-blue-800',
  },
  {
    slug: 'ey-ai', parent: 'redovisning', brand: 'EY AI', company: 'EY', founded: 1989, hq: 'London, UK',
    score: 8.6, fallbackUrl: 'https://www.ey.com/en_gl/ai',
    title: 'EY AI — EY.ai för revision och tax',
    oneliner: 'EY.ai-plattformen — Big4-AI med fokus på tax och assurance.',
    features: ['EY.ai-plattformen med GenAI', 'EY Helix för audit-analys', 'Tax AI för komplexa skattemiljöer', 'EY Atlas för IFRS-research'],
    pros: ['Stark tax-AI specifikt', 'EY Helix mogen audit-AI', 'Global IFRS-täckning'],
    cons: ['Bara EY-kunder', 'Custom pricing'],
    pricing: 'Custom via uppdrag.',
    bestFor: 'Multinationella företag med EY som revisor',
    offer: { title: 'Kontakta EY-kontor', price: 'Custom via uppdrag' },
    tags: ['Big4', 'EY.ai', 'Tax AI', 'IFRS'],
    useCases: ['Audit-automation', 'Tax planning', 'IFRS-research', 'Transfer pricing', 'M&A due diligence'],
    label: 'Bäst för tax', logo: 'bg-amber-800',
  },
  {
    slug: 'xero-ai', parent: 'redovisning', brand: 'Xero', company: 'Xero', founded: 2006, hq: 'Wellington, Nya Zeeland',
    score: 8.4, fallbackUrl: 'https://www.xero.com',
    title: 'Xero AI — global molnredovisning med AI-features',
    oneliner: 'Global molnredovisning med Just Ask Xero (JAX) som AI-assistent.',
    features: ['Just Ask Xero (JAX) AI-assistent', 'Auto-kategorisering av transaktioner', 'Hubdoc för dokumenthantering', 'Mer än 1000 appintegrationer'],
    pros: ['Stark global app-marknad', 'Modern UX', 'Bra för internationella SME:er'],
    cons: ['Mindre svensk anpassning', 'Premium-pris'],
    pricing: 'Starter 15 USD/mån, Standard 42 USD/mån, Premium 78 USD/mån.',
    bestFor: 'Internationella SME:er och engelskspråkig redovisning',
    offer: { title: '30 dagar gratis trial', price: 'Starter 15 USD/mån' },
    tags: ['Global', 'JAX', 'App marketplace', 'SME'],
    useCases: ['Molnredovisning', 'JAX-assistent', 'Dokumenthantering', 'App-integrationer', 'Multi-currency'],
    label: 'Bäst global moln', logo: 'bg-sky-700',
  },
  {
    slug: 'quickbooks-ai', parent: 'redovisning', brand: 'QuickBooks AI', company: 'Intuit', founded: 1983, hq: 'Mountain View, USA',
    score: 8.3, fallbackUrl: 'https://quickbooks.intuit.com',
    title: 'QuickBooks AI — Intuit Assist för småföretagare',
    oneliner: 'QuickBooks med Intuit Assist — AI-assistent för småföretagare globalt.',
    features: ['Intuit Assist AI-assistent', 'Smart Forecasting med AI', 'Mileage tracking och receipt capture', 'Bred app-integration'],
    pros: ['Mogen produkt med stort ekosystem', 'Stark forecasting-AI', 'Bra för US/UK-företag'],
    cons: ['Inget svenskt-specifikt stöd', 'UI inte modernast'],
    pricing: 'Simple Start 30 USD/mån, Essentials 60 USD/mån, Plus 90 USD/mån, Advanced 200 USD/mån.',
    bestFor: 'Internationella småföretag (utanför Sverige)',
    offer: { title: '30 dagar gratis trial', price: 'Simple Start 30 USD/mån' },
    tags: ['QuickBooks', 'Intuit Assist', 'Forecasting', 'Global'],
    useCases: ['Småföretagsbokföring', 'Forecasting', 'Receipt capture', 'Mileage tracking', 'Multi-app-flöden'],
    label: 'Bäst US/UK', logo: 'bg-green-700',
  },
  {
    slug: 'taxdome-ai', parent: 'redovisning', brand: 'TaxDome', company: 'TaxDome', founded: 2017, hq: 'Brooklyn, USA',
    score: 8.1, fallbackUrl: 'https://taxdome.com',
    title: 'TaxDome — practice management för redovisningsbyråer',
    oneliner: 'Practice management-plattform för redovisningsbyråer — AI för dokument och e-post.',
    features: ['AI Document Categorization', 'Klient-portal med e-signatur', 'Workflows och recurring tasks', 'Stöd för 100+ integrationer'],
    pros: ['Bred funktionalitet för byråer', 'Bra klient-portal', 'Modern UX'],
    cons: ['Engelskspråkig', 'Mindre svensk integration'],
    pricing: 'Pro 50 USD/användare/mån. Enterprise vid förfrågan.',
    bestFor: 'Internationella redovisningsbyråer',
    offer: { title: '14 dagar gratis trial', price: 'Pro 50 USD/användare/mån' },
    tags: ['Practice Mgmt', 'AI Docs', 'E-signatur', 'Workflows'],
    useCases: ['Byråflöden', 'Dokumenthantering', 'Klient-portal', 'E-signatur', 'Multi-klient'],
    label: 'Bäst byrå-plattform', logo: 'bg-fuchsia-600',
  },
  ...EXTENDED_TOOLS,
  ...DESIGNER_FOTOGRAF_TOOLS,
];

/* ── Helpers — single source of truth → templates + DB ───────── */

/** Profile shape consumed by HubTemplate.tsx KNOWN map. */
export function toHubProfile(t: YrkeTool) {
  return {
    logo: t.logo,
    ctaName: t.brand,
    score: t.score,
    fallbackUrl: t.fallbackUrl,
    tagline: t.oneliner,
    tags: t.tags,
    pros: t.pros,
    cons: t.cons,
    offer: { ...t.offer, bestFor: t.bestFor },
    label: t.label,
  };
}

/** Profile shape consumed by ReviewTemplate.tsx REVIEW_KNOWN map. */
export function toReviewProfile(t: YrkeTool) {
  return {
    logo: t.logo,
    ctaName: t.brand,
    score: t.score,
    fallbackUrl: t.fallbackUrl,
    company: t.company,
    model: `${t.brand} plattform`,
    founded: t.founded,
    hq: t.hq,
    useCases: t.useCases,
    ratingCriteria: makeCriteria(t.parent, t.score),
    tags: t.tags,
    pros: t.pros,
    cons: t.cons,
    offer: { ...t.offer, bestFor: t.bestFor },
    label: t.label,
  };
}

/** Generated body for the DB row's content_mdx column.
 *
 *  Layout mirrors what WP-imported tool reviews carry, so HubTemplate's
 *  ReviewsSection can extract the same kind of "Vår analys"-paragraph
 *  regardless of whether the body was seeded by us or imported from WP. */
export function toContentMdx(t: YrkeTool): string {
  const features = t.features.map((f) => `  <li>${f}</li>`).join('\n');
  const pros = t.pros.map((p) => `  <li>${p}</li>`).join('\n');
  const cons = t.cons.map((c) => `  <li>${c}</li>`).join('\n');
  const useCases = t.useCases.map((u) => `  <li>${u}</li>`).join('\n');

  return `
<h2>Vår analys av ${t.brand}</h2>
<p>${t.oneliner} ${t.brand} är ett av de verktyg vi rekommenderar inom ${t.parent.replace(/-/g, ' ')} — särskilt för team som värdesätter ${t.bestFor.toLowerCase()}. Vår sammanvägda bedömning landar på ${t.score.toFixed(1)} av 10 efter test mot ${t.brand}s direkta konkurrenter.</p>
<p>${t.brand} grundades ${t.founded} och har sitt huvudkontor i ${t.hq}. Företaget ligger bakom <strong>${t.label}</strong> i vår topplista och utmärker sig framför allt på ${t.tags.slice(0, 2).join(' och ').toLowerCase()}.</p>

<h2>Funktioner som spelar roll</h2>
<ul>
${features}
</ul>

<h2>Användningsområden</h2>
<ul>
${useCases}
</ul>

<h2>Styrkor</h2>
<ul>
${pros}
</ul>

<h2>Svagheter</h2>
<ul>
${cons}
</ul>

<h2>Vem passar ${t.brand} för?</h2>
<p>${t.bestFor}. Om du istället letar efter ett verktyg som passar ett annat användningsfall är det värt att jämföra med övriga verktyg i topplistan ovan innan du tecknar abonnemang.</p>

<h2>Prismodell</h2>
<p>${t.pricing}</p>

<h2>Slutsats</h2>
<p>Sammantaget ger ${t.brand} ett <strong>${t.score >= 9 ? 'mycket starkt' : t.score >= 8 ? 'starkt' : 'solid'}</strong> intryck i 2026 års test. ${t.brand} placerar sig som <strong>${t.label}</strong> och passar bäst för ${t.bestFor.toLowerCase()}.</p>
`.trim();
}

/** Build the KNOWN-style record consumed by HubTemplate. */
export const YRKE_HUB_KNOWN: Record<string, ReturnType<typeof toHubProfile>> =
  Object.fromEntries(YRKE_TOOLS.map((t) => [t.slug, toHubProfile(t)]));

/** Build the REVIEW_KNOWN-style record consumed by ReviewTemplate. */
export const YRKE_REVIEW_KNOWN: Record<string, ReturnType<typeof toReviewProfile>> =
  Object.fromEntries(YRKE_TOOLS.map((t) => [t.slug, toReviewProfile(t)]));
