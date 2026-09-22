/**
 * Recensionernas verktygsprofiler (REVIEW_KNOWN) och hjälpfunktionerna som
 * slår upp dem. Flyttad ur components/templates/ReviewTemplate.tsx så att
 * betyget kan räknas fram utanför mallen (lib/review-score.ts) utan en
 * cirkulär import. ReviewTemplate exporterar fortfarande samma namn vidare.
 *
 * Ren TypeScript utan JSX; körs även från tsx-skript.
 */
import { toolNameFromTitle } from '@/lib/rating';
import type { Article } from '@/lib/supabase';
import { YRKE_REVIEW_KNOWN } from '@/lib/yrke-tools';
import { CATEGORY_HUB_REVIEW_KNOWN } from '@/lib/category-hub-tools';
import { YRKES_HUB_REVIEW_KNOWN } from '@/lib/yrkes-hub-tools';
import { YRKES_HUB_REVIEW_KNOWN_EXTRA } from '@/lib/yrkes-hub-tools-extra';
import { VIDEO_AUDIO_REVIEW_KNOWN } from '@/lib/video-audio-tools';
import { CRM_REVIEW_KNOWN } from '@/lib/crm-tools';
import { CATEGORY_HUB_REVIEW_KNOWN_3 } from '@/lib/category-hub-tools-3';


/* ─── Types ────────────────────────────────────────────────────── */

export type Criterion = { label: string; score: number };

export type ReviewProfile = {
  logo: string;
  company: string;
  model: string;
  founded: number;
  hq: string;
  useCases: string[];
  /** Per-category criteria. Text tools use textkvalitet/svenska, video uses
   *  visuell kvalitet/promptföljsamhet, etc. Always 6 items for layout. */
  ratingCriteria: Criterion[];
  tags: string[];
  pros: string[];
  cons: string[];
  offer: { title: string; price: string; bestFor: string };
  label: string;
  /** Brand name for CTA buttons (e.g. "Prova Kling" not "Prova Kling AI"). */
  ctaName?: string;
  /** Editorial score override — wins over parseRating + seed mock.
   *  `null` = explicit "ännu ej betygsatt": dölj betygssiffra/stjärnor/rank. */
  score?: number | null;
  /** Direct external URL used when articles.affiliate_url is NULL. Rendered
   *  with rel="nofollow noopener" instead of "sponsored". */
  fallbackUrl?: string;
  /** One-line positioning statement, shown under the H1 in the hero. */
  tagline?: string;
};

/* ─── Mock data ─────────────────────────────────────────────────── */

const LOGO_COLORS = [
  'bg-emerald-500', 'bg-orange-500', 'bg-sky-500', 'bg-violet-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-indigo-500',
  'bg-fuchsia-500', 'bg-lime-600',
];

/** Default criteria labels for unknown tools — generic enough for any AI tool. */
const DEFAULT_CRITERIA: string[] = [
  'Kvalitet', 'Hastighet / svar', 'Pris / prestanda',
  'Integrationer', 'Säkerhet & GDPR', 'Användarvänlighet',
];

const GENERIC_USE_CASES = [
  'Allmänt skrivande', 'Översättning', 'Sammanfattning', 'Brainstorming',
  'Kodförklaring', 'Kreativ ideation', 'Research', 'E-postsvar',
];

export const REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = {
  /* Yrke-topic tools (SEO/copy/ads/social/bokföring/redovisning) — merged
   * in from lib/yrke-tools.ts so the data lives in a single source. */
  ...YRKE_REVIEW_KNOWN,

  /* 8 kategori-hubbar (hemsidebyggare, presentationer, mötesverktyg, sociala
   * medier, projektledning, e-handel, översättning, dokumenthantering) —
   * 80 verktygsprofiler genererade i lib/category-hub-tools.ts. */
  ...CATEGORY_HUB_REVIEW_KNOWN,

  /* Kanoniska yrkes-hub-recensioner (juridik/kundservice/rekrytering/ekonomi/
   * marknadsföring) — mergade dubbletter, genererade i lib/yrkes-hub-tools.ts. */
  ...YRKES_HUB_REVIEW_KNOWN,
  ...YRKES_HUB_REVIEW_KNOWN_EXTRA,

  /* AI-video + AI-ljud/musik recensioner (HeyGen, Synthesia, InVideo, Luma,
   * Firefly Video, Kaiber, Mubert, AIVA, Soundraw, Boomy, Splice, Lalal.ai,
   * Adobe Podcast) — genererade i lib/video-audio-tools.ts. Udio har en egen
   * handskriven profil längre ned som vinner över spreaden. */
  ...VIDEO_AUDIO_REVIEW_KNOWN,

  /* CRM-hubbens 10 verktyg (Salesforce Einstein, HubSpot, Pipedrive, …) —
   * genererade i lib/crm-tools.ts av scripts/seed-crm-hub.ts. */
  ...CRM_REVIEW_KNOWN,

  /* Kategori-hubbar batch 3 (assistenter, röst & tal, podcast, produktivitet,
   * e-post, dataanalys, utbildning) — genererade i lib/category-hub-tools-3.ts. */
  ...CATEGORY_HUB_REVIEW_KNOWN_3,

  /* ── Text ─────────────────────────────────────────────── */
  chatgpt: {
    logo: 'bg-emerald-500',
    fallbackUrl: 'https://chat.openai.com',
    company: 'OpenAI', model: 'GPT-6 Astra (Pro/Business)', founded: 2015, hq: 'San Francisco, USA',
    useCases: ['Allmänt skrivande', 'Sammanfattning av dokument', 'Kreativ ideation', 'Brainstorming', 'Översättning'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 9.7 }, { label: 'Hastighet / svar', score: 9.5 },
      { label: 'Pris / prestanda', score: 8.8 }, { label: 'Integrationer', score: 9.5 },
      { label: 'Säkerhet & GDPR', score: 8.5 }, { label: 'Svenska', score: 9.5 },
    ],
    tags: ['GPT-6 Astra', 'GPT-Live röst', 'Custom GPTs', 'Canvas'],
    pros: ['Snabb och mångsidig', 'Stort ekosystem av GPTs', 'GPT-Live – röstläge för samtal i realtid'],
    cons: ['Knapphändig källhantering', 'GPT-6 Astra i chatten kräver Pro eller Business', 'Ingen video sedan Sora stängdes'],
    offer: { title: 'Gratisplan finns', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Allt-i-ett textproduktion' },
    label: 'Redaktionens val',
  },
  claude: {
    logo: 'bg-orange-500',
    fallbackUrl: 'https://claude.ai',
    company: 'Anthropic', model: 'Claude Opus 5', founded: 2021, hq: 'San Francisco, USA',
    useCases: ['Långform-skrivande', 'Juridiska dokument', 'Vetenskaplig analys', 'Programmering', 'Resonemang i flera steg'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 9.5 }, { label: 'Hastighet / svar', score: 8.6 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Integrationer', score: 9.2 },
      { label: 'Säkerhet & GDPR', score: 9.3 }, { label: 'Svenska', score: 9.6 },
    ],
    tags: ['Claude Opus 5', 'Projects', 'Artifacts', '1M context'],
    pros: ['Bäst på långform', 'Starkast på agentisk kodning — samma modeller som Claude Code', 'Säker källhantering', 'Skarp på nyans'],
    cons: ['Långsammare än GPT', 'Dyrare per token'],
    offer: { title: '1M token kontext', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Långa dokument och nyans' },
    label: 'Bäst för långform',
  },
  gemini: {
    logo: 'bg-sky-500',
    fallbackUrl: 'https://gemini.google.com',
    company: 'Google', model: 'Gemini 3.1 Pro', founded: 1998, hq: 'Mountain View, USA',
    useCases: ['Workspace-integration', 'Stora dokument', 'Multimodal analys', 'Research', 'Data-summering'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 9.0 }, { label: 'Hastighet / svar', score: 9.4 },
      { label: 'Pris / prestanda', score: 9.1 }, { label: 'Integrationer', score: 9.7 },
      { label: 'Säkerhet & GDPR', score: 8.8 }, { label: 'Svenska', score: 8.5 },
    ],
    tags: ['Gemini 3.1 Pro', '1M context', 'Workspace', 'Multimodal'],
    pros: ['Enorm kontext', 'Integrerat med Google', 'Stark på multimodal'],
    cons: ['Ojämn svenska', 'Beroende av Google-konto'],
    offer: { title: 'Google AI Pro', price: 'Gratis · AI Pro 19,99 USD/mån', bestFor: 'Workspace-användare' },
    label: 'Bäst för stora dokument',
  },
  'jasper-ai': {
    logo: 'bg-amber-500',
    fallbackUrl: 'https://www.jasper.ai',
    company: 'Jasper', model: 'Jasper Canvas', founded: 2021, hq: 'Austin, USA',
    useCases: ['Marknadsföringscopy', 'Sociala medier', 'Annonstexter', 'Bloggar', 'Brand voice'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.7 }, { label: 'Hastighet / svar', score: 9.0 },
      { label: 'Pris / prestanda', score: 7.8 }, { label: 'Integrationer', score: 8.5 },
      { label: 'Säkerhet & GDPR', score: 8.4 }, { label: 'Svenska', score: 8.2 },
    ],
    tags: ['Brand Voice', 'Canvas', 'Marketing-agenter', 'Teams'],
    pros: ['Konsistent brand voice', 'Många mallar', 'Bra för team'],
    cons: ['Högre pris', 'Smal modell-grund'],
    offer: { title: 'Jasper 7 dagar gratis', price: '7 dagars testperiod · Pro 69 USD/mån', bestFor: 'Marknadsföring' },
    label: 'Bäst för marknadsföring',
  },
  writesonic: {
    logo: 'bg-violet-500',
    fallbackUrl: 'https://writesonic.com',
    company: 'Writesonic', model: 'Writesonic (GEO-plattform)', founded: 2020, hq: 'Bangalore, Indien',
    useCases: ['SEO-artiklar', 'Snabb copy', 'Annonser', 'E-post', 'Produktbeskrivningar'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.3 }, { label: 'Hastighet / svar', score: 9.3 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Integrationer', score: 8.2 },
      { label: 'Säkerhet & GDPR', score: 7.8 }, { label: 'Svenska', score: 7.9 },
    ],
    tags: ['GEO-spårning', 'AI-synlighet', 'AI Article Writer', 'Agenter'],
    pros: ['Snabb', 'Bra pris', 'Bulk-funktion för SEO'],
    cons: ['Svenska är ojämn', 'Mindre nyans i text'],
    offer: { title: 'Gratisplan med 10k ord/mån', price: 'Gratis att börja · Starter 79 USD/mån (årsbetalning)', bestFor: 'SEO och snabb copy' },
    label: 'Bäst för SEO',
  },
  'copy-ai': {
    logo: 'bg-rose-500',
    fallbackUrl: 'https://www.copy.ai',
    company: 'Copy.ai', model: 'Bygger på modeller från OpenAI, Anthropic och Google', founded: 2020, hq: 'Memphis, USA',
    useCases: ['Sociala medier', 'Säljmejl', 'Annonser', 'Produktbeskrivningar', 'Slogans'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.0 }, { label: 'Hastighet / svar', score: 9.2 },
      { label: 'Pris / prestanda', score: 9.2 }, { label: 'Integrationer', score: 8.0 },
      { label: 'Säkerhet & GDPR', score: 7.6 }, { label: 'Svenska', score: 7.5 },
    ],
    tags: ['Workflows', 'GTM-plattform', 'Brand voice', 'API'],
    pros: ['Många mallar', 'Workflows-automation', 'Lågt instegspris'],
    cons: ['Begränsad svenska', 'Mindre kraftfull modell'],
    offer: { title: 'Chat-plan 29 USD/mån', price: 'Chat 29 USD/mån · Growth från 1 000 USD/mån', bestFor: 'Säljteam och social media' },
    label: 'Bäst för säljteam',
  },

  /* ── Video ────────────────────────────────────────────── */
  'sora-2': {
    logo: 'bg-zinc-900',
    ctaName: 'Sora', score: null, fallbackUrl: 'https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation',
    company: 'OpenAI', model: 'Sora 2', founded: 2015, hq: 'San Francisco, USA',
    useCases: ['Export av gamla Sora-klipp', 'Byte till Runway, Kling eller Pika'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.4 }, { label: 'Promptföljsamhet', score: 9.0 },
      { label: 'Tillgänglighet', score: 5.5 }, { label: 'Generationstid', score: 7.0 },
      { label: 'Pris / generering', score: 7.5 }, { label: 'Stilkontroll', score: 8.5 },
    ],
    tags: ['Sora 2', 'Nedlagd', 'Appen stängd 26 april 2026', 'API stängs 24 sep 2026'],
    pros: ['Skapade bild och ljud i samma generering', 'Hjälpartikel från OpenAI om export och återbetalning'],
    cons: ['Appen och sora.com stängde 26 april 2026', 'API:t stängs 24 september 2026', 'OpenAI har inte angett något skäl'],
    offer: { title: 'Appen stängde 26 april 2026', price: 'Nedlagd', bestFor: 'Ingen – se alternativen Runway, Kling och Pika' },
    label: 'Nedlagd',
  },
  'runway-gen-3': {
    logo: 'bg-fuchsia-600',
    ctaName: 'Runway', score: 9.1, fallbackUrl: 'https://runwayml.com',
    company: 'Runway', model: 'Gen-4.5', founded: 2018, hq: 'New York, USA',
    useCases: ['Video & redigering', 'Visuella effekter', 'Filmkonceptarbete', 'Reklamfilm', 'Mode & e-handel'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.3 }, { label: 'Promptföljsamhet', score: 8.8 },
      { label: 'Konsistens & rörelse', score: 8.7 }, { label: 'Generationstid', score: 8.5 },
      { label: 'Redigeringsverktyg', score: 9.5 }, { label: 'Stilkontroll', score: 9.2 },
    ],
    tags: ['Gen-4.5', 'Aleph 2.0', 'Characters API', 'Tredjepartsmodeller'],
    pros: ['Generering och redigering (Aleph 2.0) i samma verktyg', 'Kling 3.0 och Seedance på samma krediter', 'API för video och realtidsavatarer (Characters)'],
    cons: ['Krediterna tar slut fort vid längre projekt', 'Gen-4.5 kan få orsak och verkan i fel ordning – enligt Runway själva', 'Gratisplanen ger bara 125 krediter en gång'],
    offer: { title: '125 gratiskrediter att börja med', price: 'Gratis · Standard 15 USD/mån', bestFor: 'Video, redigering och realtidsavatarer' },
    label: 'Bäst för redigering & effekter',
  },
  'pika-labs': {
    logo: 'bg-pink-500',
    ctaName: 'Pika Labs', score: 8.7, fallbackUrl: 'https://pika.art',
    company: 'Pika', model: 'Pika 2.5', founded: 2023, hq: 'Palo Alto, USA',
    useCases: ['Text-till-video', 'Bild-till-video', 'Sociala medier', 'Animerade memes', 'Produktdemos'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 8.5 }, { label: 'Promptföljsamhet', score: 8.4 },
      { label: 'Konsistens & rörelse', score: 8.0 }, { label: 'Generationstid', score: 9.4 },
      { label: 'Pris / generering', score: 9.0 }, { label: 'Stilkontroll', score: 8.7 },
    ],
    tags: ['Pika 2.5', 'Text/bild → video', 'Pikaffects', 'Lip sync'],
    pros: ['Snabbaste i klassen', 'Roliga effekter (Pikaffects)', 'Lågt pris för premium'],
    cons: ['Mindre filmisk än Runway/Sora', 'Kortare clip-längd'],
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Basic 8 USD/mån (årsbetalning)', bestFor: 'Text- och bild-till-video' },
    label: 'Bästa pris-prestanda',
  },
  'kling-ai': {
    logo: 'bg-red-500',
    ctaName: 'Kling', score: 9.4, fallbackUrl: 'https://klingai.com',
    company: 'Kuaishou', model: 'Kling 3.0', founded: 2011, hq: 'Beijing, Kina',
    useCases: ['Realistisk AI-video', 'Stiliserade kortvideor', 'Animerade porträtt', 'TikTok/Reels-content', 'Image-to-video'],
    ratingCriteria: [
      { label: 'Visuell realism', score: 9.5 }, { label: 'Promptföljsamhet', score: 9.0 },
      { label: 'Konsistens & rörelse', score: 9.4 }, { label: 'Generationstid', score: 8.8 },
      { label: 'Pris / generering', score: 9.5 }, { label: 'Stilkontroll', score: 9.2 },
    ],
    tags: ['Kling 3.0', 'Realism', 'Lip sync', 'Long-form'],
    pros: ['Marknadens mest realistiska video', 'Lång clip-längd (2 min)', 'Stark image-to-video'],
    cons: ['Engelska prompts ojämn', 'Mindre community utanför Kina'],
    offer: { title: 'Gratis begränsad', price: 'Gratis · Standard 10 USD/mån', bestFor: 'Realistisk AI-video' },
    label: 'Redaktionens val',
  },

  /* ── Bild ─────────────────────────────────────────────── */
  midjourney: {
    logo: 'bg-violet-700',
    fallbackUrl: 'https://www.midjourney.com',
    company: 'Midjourney', model: 'V8', founded: 2021, hq: 'San Francisco, USA',
    useCases: ['Konceptkonst', 'Reklamvisualer', 'Bokomslag', 'Mood boards', 'Karaktärsdesign'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.7 }, { label: 'Promptföljsamhet', score: 8.8 },
      { label: 'Stilbredd', score: 9.6 }, { label: 'Text-i-bild', score: 8.4 },
      { label: 'Pris / bild', score: 8.6 }, { label: 'Användarvänlighet', score: 8.2 },
    ],
    tags: ['V8', 'Discord & web', 'Style refs', 'Personalization'],
    pros: ['Branschens skarpaste bildkvalitet', 'Stilreferenser med --sref', 'Stor estetisk bredd'],
    cons: ['Discord-flöde inlärningströskel', 'Sämre på text i bilden'],
    offer: { title: 'Web-app i basic plan', price: 'Basic 10 USD/mån', bestFor: 'Kreatörer och designers' },
    label: 'Redaktionens val',
  },
  'dalle-3': {
    logo: 'bg-emerald-500',
    fallbackUrl: 'https://openai.com/dall-e-3',
    company: 'OpenAI', model: 'GPT Image 2.5 (ersätter DALL·E 3)', founded: 2015, hq: 'San Francisco, USA',
    useCases: ['Snabba illustrationer i ChatGPT', 'Bloggbilder', 'Sociala medier', 'Pedagogiska bilder', 'Enkla loggor'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.0 }, { label: 'Promptföljsamhet', score: 9.4 },
      { label: 'Stilbredd', score: 8.7 }, { label: 'Text-i-bild', score: 9.0 },
      { label: 'Pris / bild', score: 9.0 }, { label: 'Användarvänlighet', score: 9.5 },
    ],
    tags: ['GPT Image 2.5', 'ChatGPT', 'Text i bild', 'API'],
    pros: ['Enklast att använda', 'Bra på text i bilden', 'Ingår i ChatGPT Plus'],
    cons: ['Smalare stilbredd än MJ', 'Mindre stylekontroll'],
    offer: { title: 'Ingår i ChatGPT Plus', price: 'Plus 20 USD/mån (ChatGPT)', bestFor: 'Bloggare och allmän användning' },
    label: 'Bäst för nybörjare',
  },
  'adobe-firefly': {
    logo: 'bg-rose-600',
    ctaName: 'Firefly', fallbackUrl: 'https://www.adobe.com/products/firefly.html',
    company: 'Adobe', model: 'Firefly Image 5', founded: 1982, hq: 'San José, USA',
    useCases: ['Kommersiellt säker bildgenerering', 'Photoshop-integration', 'Generative Fill', 'Marknadsföringsmaterial', 'Texteffekter'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 8.7 }, { label: 'Promptföljsamhet', score: 8.6 },
      { label: 'Stilbredd', score: 8.3 }, { label: 'Text-i-bild', score: 8.8 },
      { label: 'Pris / bild', score: 8.7 }, { label: 'Användarvänlighet', score: 9.0 },
    ],
    tags: ['Firefly Image 5', 'Photoshop', 'Generative Fill', 'Kommersiellt säker'],
    pros: ['Kommersiellt trygg (tränad på licensierat material)', 'Djup Adobe-integration', 'Bra på text i bilden'],
    cons: ['Smalare estetik än Midjourney', 'Kräver Adobe-konto för full nytta'],
    offer: { title: 'Firefly Standard', price: 'Gratis · Standard 10,98 EUR/mån', bestFor: 'Designers i Adobe-ekosystemet' },
    label: 'Bäst för kommersiell trygghet',
  },
  // Domän-fix: explicit slugnyckel så exakt-matchning vinner före fuzzy-loopen
  // (slug 'canva-ai' fuzz-matchade tidigare 'udio' via "magic stUDIO"). canva.com
  // webb-verifierad (doman-mismatch.md).
  'canva-ai': {
    logo: 'bg-cyan-500',
    ctaName: 'Canva', fallbackUrl: 'https://www.canva.com',
    company: 'Canva', model: 'Magic Media', founded: 2013, hq: 'Sydney, Australien',
    useCases: ['Sociala medier-bilder', 'Presentationer', 'Enkla annonser', 'Bild direkt in i en layout', 'Ta bort bakgrund'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 7.8 }, { label: 'Promptföljsamhet', score: 7.9 },
      { label: 'Stilbredd', score: 7.6 }, { label: 'Text-i-bild', score: 8.2 },
      { label: 'Pris / bild', score: 8.9 }, { label: 'Användarvänlighet', score: 9.6 },
    ],
    tags: ['Magic Studio', 'Mallar', 'Bakgrundsborttagning', 'Priser i kronor'],
    pros: ['Bilden hamnar direkt i en färdig layout', 'Lägst tröskel av alla — ingen promptvana krävs', 'Gratisnivån räcker för sociala medier'],
    cons: ['Sämre bildkvalitet än verktyg som bara gör bilder', 'Business kostar 2 100 kr/år per person', 'Liten kontroll över stil och komposition'],
    offer: { title: 'Gratis att börja', price: 'Gratis · Pro 1 200 kr/år (årsbetalning)', bestFor: 'Den som vill ha bild och layout på samma ställe' },
    label: 'Bäst för icke-designers',
  },
  // Saknade fallbackUrl → döda CTA-knappar. Domäner webb-verifierade,
  // produkter bekräftat aktiva (doman-verifiering.md).
  'leonardo-ai': {
    logo: 'bg-amber-500',
    ctaName: 'Leonardo AI', fallbackUrl: 'https://leonardo.ai',
    company: 'Leonardo.Ai', model: 'Lucid Origin', founded: 2022, hq: 'Sydney, Australien',
    useCases: ['Spelgrafik och koncept', 'Karaktärsdesign', 'Konsekvent stil över en bildserie', 'Produktbilder', 'Texturer och tillgångar'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 8.8 }, { label: 'Promptföljsamhet', score: 8.7 },
      { label: 'Stilbredd', score: 9.1 }, { label: 'Text-i-bild', score: 7.9 },
      { label: 'Pris / bild', score: 8.9 }, { label: 'Användarvänlighet', score: 8.4 },
    ],
    tags: ['Lucid Origin', 'FLUX', 'Canvas-editor', 'Daglig gratiskvot'],
    pros: ['Egna modeller och FLUX på samma konto', 'Daglig gratiskvot att arbeta i på riktigt', 'Canvas-editorn tar bilden vidare utan att byta verktyg'],
    cons: ['Fler rattar än en nybörjare behöver', 'Gratisbilderna är publika', 'Priser i USD exklusive moms'],
    offer: { title: 'Gratis dagliga krediter', price: 'Gratis · Essential 12 USD/mån', bestFor: 'Spel- och konceptkonstnärer' },
    label: 'Bäst för konsekvent stil',
  },
  ideogram: {
    logo: 'bg-violet-600',
    ctaName: 'Ideogram', fallbackUrl: 'https://ideogram.ai',
    company: 'Ideogram', model: 'Ideogram 4.0', founded: 2022, hq: 'Toronto, Kanada',
    useCases: ['Affischer och omslag', 'Logotyputkast', 'Bilder där texten måste bli rätt', 'Tryck på kläder', 'Annonser med rubrik i bilden'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 8.6 }, { label: 'Promptföljsamhet', score: 9.0 },
      { label: 'Stilbredd', score: 8.4 }, { label: 'Text-i-bild', score: 9.6 },
      { label: 'Pris / bild', score: 8.8 }, { label: 'Användarvänlighet', score: 9.0 },
    ],
    tags: ['Ideogram 4.0', 'Typografi', 'Magic Prompt', 'Gratisnivå'],
    pros: ['Bäst i klassen på att stava rätt inuti bilden', 'Magic Prompt fyller i det du glömde skriva', 'Gratisnivå utan kortuppgift'],
    cons: ['Smalare fotorealism än Midjourney', 'Färre verktyg för efterredigering', 'Mindre community och färre färdiga stilar'],
    offer: { title: 'Gratis att testa', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Allt där text ska in i bilden' },
    label: 'Bäst på text i bild',
  },
  'playground-ai': {
    logo: 'bg-emerald-600',
    ctaName: 'Playground AI', fallbackUrl: 'https://playground.com',
  },
  'bing-image-creator': {
    logo: 'bg-sky-600',
    ctaName: 'Bing Image Creator', fallbackUrl: 'https://www.bing.com/images/create',
  },
  flux: {
    logo: 'bg-zinc-800',
    ctaName: 'Flux', fallbackUrl: 'https://bfl.ai',
    company: 'Black Forest Labs', model: 'FLUX 3', founded: 2024, hq: 'Freiburg, Tyskland',
    useCases: ['Fotorealistiska porträtt', 'Bildgenerering via API', 'Egen hosting', 'Produktvisualisering', 'Finetuning på eget material'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.3 }, { label: 'Promptföljsamhet', score: 9.2 },
      { label: 'Stilbredd', score: 8.8 }, { label: 'Text-i-bild', score: 8.9 },
      { label: 'Pris / bild', score: 9.0 }, { label: 'Användarvänlighet', score: 7.4 },
    ],
    tags: ['FLUX 3', 'API', 'Öppna vikter', 'Finetuning'],
    pros: ['Bland det starkaste som finns på fotorealism och hud', 'Öppna vikter i schnell och dev — kör lokalt om du vill', 'Betalas per bild via API i stället för abonnemang'],
    cons: ['Knappt något eget gränssnitt — går via andra tjänster', 'Kräver teknisk vana', 'Pro-modellen är stängd trots ryktet om öppenhet'],
    offer: { title: 'Betala per bild', price: 'Betala per bild · FLUX.2 [pro] från 0,03 USD/megapixel', bestFor: 'Utvecklare och fotorealism' },
    label: 'Bäst fotorealism',
  },
  'stable-diffusion': {
    logo: 'bg-purple-700',
    ctaName: 'Stable Diffusion', fallbackUrl: 'https://stability.ai',
    company: 'Stability AI', model: 'Stable Diffusion 3.5', founded: 2019, hq: 'London, Storbritannien',
    useCases: ['Köra bildgenerering lokalt', 'Träna på eget material med LoRA', 'Obegränsad generering utan kvot', 'ControlNet och exakt komposition', 'Bygga in i egen produkt'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 8.4 }, { label: 'Promptföljsamhet', score: 8.3 },
      { label: 'Stilbredd', score: 9.5 }, { label: 'Text-i-bild', score: 8.0 },
      { label: 'Pris / bild', score: 9.7 }, { label: 'Användarvänlighet', score: 6.5 },
    ],
    tags: ['SD 3.5', 'Öppna vikter', 'LoRA', 'ControlNet'],
    pros: ['Gratis och obegränsat när det körs på egen hårdvara', 'Störst ekosystem av modeller, LoRA och tillägg', 'Full kontroll — ControlNet styr kompositionen på pixelnivå'],
    cons: ['Kräver eget grafikkort och en del handpåläggning', 'Basmodellen är svagare än Midjourney direkt ur lådan', 'Licensen för kommersiellt bruk skiljer sig mellan versionerna'],
    offer: { title: 'Brand Studio', price: 'Gratis · Brand Studio 19 USD/mån', bestFor: 'Den som vill äga hela kedjan' },
    label: 'Bäst för egen kontroll',
  },

  /* ── Ljud / musik ─────────────────────────────────────── */
  'suno-ai': {
    logo: 'bg-amber-600',
    fallbackUrl: 'https://suno.com',
    company: 'Suno', model: 'v6', founded: 2022, hq: 'Cambridge, USA',
    useCases: ['Demos för låtskrivare', 'Podcast-intros', 'Reklamjinglar', 'TikTok-musik', 'Soundtracks'],
    ratingCriteria: [
      { label: 'Ljudkvalitet', score: 9.0 }, { label: 'Stilbredd', score: 9.2 },
      { label: 'Lyrik-AI', score: 8.6 }, { label: 'Hastighet', score: 9.5 },
      { label: 'Pris / spår', score: 8.8 }, { label: 'Användarvänlighet', score: 9.4 },
    ],
    tags: ['v6', 'Custom lyrics', '4 min spår', 'Stems-export'],
    pros: ['Snabbast i klassen', 'Bra på lyrik', 'Stems för efterproduktion'],
    cons: ['Mindre nyans än Udio', 'Kommersiella rättigheter kräver Pro'],
    offer: { title: '50 spår gratis varje månad', price: 'Gratis · Pro 8 USD/mån', bestFor: 'Musiker och content-skapare' },
    label: 'Redaktionens val',
  },
  udio: {
    logo: 'bg-cyan-600',
    ctaName: 'Udio', fallbackUrl: 'https://www.udio.com',
    company: 'Udio', model: 'Udio', founded: 2023, hq: 'New York, USA',
    useCases: ['Studiokvalitativa låtar', 'Detaljerad genrekontroll', 'Vokala covers', 'Soundtracks', 'Remixer'],
    ratingCriteria: [
      { label: 'Ljudkvalitet', score: 9.4 }, { label: 'Stilbredd', score: 8.9 },
      { label: 'Lyrik-AI', score: 8.8 }, { label: 'Hastighet', score: 8.7 },
      { label: 'Pris / spår', score: 8.5 }, { label: 'Användarvänlighet', score: 9.0 },
    ],
    tags: ['Voice Control', 'Hög ljudkvalitet', 'Stems', 'Inpainting'],
    pros: ['Marknadens skarpaste ljudkvalitet', 'Fin genrekontroll', 'Stark på vokaler'],
    cons: ['Långsammare än Suno', 'Snålare gratisnivå'],
    offer: { title: '10 låtar gratis per dag', price: 'Gratis · Standard 10 USD/mån', bestFor: 'Musiker som prioriterar ljudkvalitet' },
    label: 'Bäst ljudkvalitet',
  },
  elevenlabs: {
    logo: 'bg-zinc-900',
    fallbackUrl: 'https://elevenlabs.io',
    company: 'ElevenLabs', model: 'v3', founded: 2022, hq: 'New York / London',
    useCases: ['Audiobooks', 'Podcast-narration', 'Reklamröster', 'Spelröster', 'Dubbing'],
    ratingCriteria: [
      { label: 'Röstrealism', score: 9.8 }, { label: 'Språkstöd (incl. svenska)', score: 9.5 },
      { label: 'Voice cloning', score: 9.6 }, { label: 'Hastighet', score: 9.0 },
      { label: 'Pris / minut', score: 8.0 }, { label: 'API & integrationer', score: 9.3 },
    ],
    tags: ['v3', 'Voice clone', '74 språk', 'Dubbing'],
    pros: ['Marknadens mest naturliga röster', 'Stark voice cloning', 'Utmärkt svenska'],
    cons: ['Pris skalar snabbt', 'Voice cloning kräver verifiering'],
    offer: { title: '10k tecken gratis varje månad', price: 'Gratis · Starter 6 USD/mån', bestFor: 'Audiobooks och narration' },
    label: 'Bäst för svensk voice',
  },

  /* ── Kod ──────────────────────────────────────────────── */
  'cursor-ai': {
    logo: 'bg-zinc-900',
    fallbackUrl: 'https://www.cursor.com',
    company: 'Anysphere', model: 'Cursor Composer', founded: 2022, hq: 'San Francisco, USA',
    useCases: ['Daglig kodning', 'Refactoring', 'Test-skrivning', 'Bug-fixing', 'Inlärning av nya kodbaser'],
    ratingCriteria: [
      { label: 'Kodkvalitet', score: 9.6 }, { label: 'Kontextförståelse', score: 9.5 },
      { label: 'Hastighet', score: 9.2 }, { label: 'Editor-integration', score: 9.7 },
      { label: 'Pris / prestanda', score: 8.6 }, { label: 'Modellval', score: 9.5 },
    ],
    tags: ['Composer', 'Tab', 'Cloud agents', 'MCP'],
    pros: ['Branschens skarpaste AI-editor', 'Bra context-hantering', 'Stöd för flera modeller'],
    cons: ['Pris högt för soloutvecklare', 'Bara desktop'],
    offer: { title: '14 dagar Pro gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Daglig professionell kodning' },
    label: 'Redaktionens val',
  },
  /* ── Automation ───────────────────────────────────────── */
  make: {
    logo: 'bg-violet-600',
    ctaName: 'Make', score: 9.0, fallbackUrl: 'https://www.make.com',
    company: 'Make (Celonis)', model: 'Make platform', founded: 2012, hq: 'Prag, Tjeckien',
    useCases: ['Komplexa flerstegsflöden', 'API-orkestrering', 'AI-pipelines', 'Datatransformering', 'Webhook-driven automation'],
    ratingCriteria: [
      { label: 'Kraft & flexibilitet', score: 9.5 }, { label: 'Användarvänlighet', score: 8.0 },
      { label: 'Pris / prestanda', score: 9.2 }, { label: 'Integrationer', score: 8.8 },
      { label: 'AI-stöd', score: 8.7 }, { label: 'Dokumentation', score: 8.5 },
    ],
    tags: ['Visuell builder', 'Komplexa flöden', 'AI-moduler', 'Webhooks'],
    pros: ['Mest kraftfulla visuella builder', 'Stöd för komplex logik', 'Bra prismodell på operationer'],
    cons: ['Brantare inlärningskurva', 'Färre integrationer än Zapier'],
    offer: { title: '1000 operationer gratis', price: 'Gratis · Core 9 USD/mån', bestFor: 'Komplexa automationsflöden' },
    label: 'Redaktionens val',
  },
  n8n: {
    logo: 'bg-rose-600',
    ctaName: 'n8n', score: 8.7, fallbackUrl: 'https://n8n.io',
    company: 'n8n', model: 'n8n (fair-code, kör dina egna modeller)', founded: 2019, hq: 'Berlin, Tyskland',
    useCases: ['Self-hosted automation', 'AI-pipelines on-prem', 'Webhook-orkestrering', 'Data-ETL', 'Cron-baserade jobs'],
    ratingCriteria: [
      { label: 'Flexibilitet', score: 9.4 }, { label: 'Self-host', score: 9.7 },
      { label: 'AI-noder', score: 9.0 }, { label: 'Integrationer', score: 8.3 },
      { label: 'Community', score: 9.0 }, { label: 'Användarvänlighet', score: 7.5 },
    ],
    tags: ['Fair-code', 'Self-host', 'AI-noder', 'Kod-noder'],
    pros: ['Fullt open source', 'Kan självhostas', 'Bra för utvecklare'],
    cons: ['Kräver tekniskt kunnande', 'Mindre polerat UI än Zapier'],
    offer: { title: 'Self-host gratis', price: 'Gratis självhostad · Starter 20 EUR/mån (årsbetalning)', bestFor: 'Tekniska team som vill äga data' },
    label: 'Bäst open source',
  },
  'zapier-ai': {
    logo: 'bg-orange-600',
    ctaName: 'Zapier', score: 8.9, fallbackUrl: 'https://zapier.com',
    company: 'Zapier', model: 'Zapier Agents / AI by Zapier (ingen modell anges)', founded: 2011, hq: 'Sunnyvale, USA',
    useCases: ['SaaS-integration', 'AI Actions', 'Lead-flöden', 'CRM-automation', 'Notisflöden'],
    ratingCriteria: [
      { label: 'Integrationsbredd', score: 9.8 }, { label: 'Användarvänlighet', score: 9.4 },
      { label: 'Pris / prestanda', score: 7.8 }, { label: 'AI-stöd', score: 8.8 },
      { label: 'Stabilitet', score: 9.2 }, { label: 'Dokumentation', score: 9.0 },
    ],
    tags: ['9000+ appar', 'Agents', 'Tables', 'Forms'],
    pros: ['Flest integrationer på marknaden', 'Enkelt att komma igång', 'AI Actions inbyggt'],
    cons: ['Dyrt för stora volymer', 'Mindre flexibelt än Make'],
    offer: { title: '100 tasks gratis/mån', price: 'Gratis · Professional 29,99 USD/mån (19,99 USD/mån vid årsbetalning)', bestFor: 'Snabb SaaS-integration' },
    label: 'Mest använda',
  },
  'power-automate': {
    logo: 'bg-sky-700',
    ctaName: 'Power Automate', score: 8.4, fallbackUrl: 'https://powerautomate.microsoft.com',
    company: 'Microsoft', model: 'Power Platform', founded: 1975, hq: 'Redmond, USA',
    useCases: ['Microsoft 365-automation', 'SharePoint-flöden', 'Approval workflows', 'RPA på desktop', 'Dataverse-integration'],
    ratingCriteria: [
      { label: 'M365-integration', score: 9.8 }, { label: 'RPA-stöd', score: 9.0 },
      { label: 'Användarvänlighet', score: 7.8 }, { label: 'AI Builder', score: 8.5 },
      { label: 'Enterprise-säkerhet', score: 9.5 }, { label: 'Licensmodell', score: 6.5 },
    ],
    tags: ['Microsoft 365', 'Copilot', 'RPA', 'Enterprise'],
    pros: ['Djup Microsoft 365-integration', 'Copilot-stöd inbyggt', 'Enterprise-säkerhet'],
    cons: ['Komplext utanför MS-stacken', 'Licensmodellen är förvirrande'],
    offer: { title: 'Ingår i M365 (vissa licenser)', price: 'Från 15 USD/användare/mån', bestFor: 'Microsoft 365-företag' },
    label: 'Bäst för Microsoft-stack',
  },
  bardeen: {
    logo: 'bg-emerald-600',
    ctaName: 'Bardeen', score: 8.2, fallbackUrl: 'https://www.bardeen.ai',
    company: 'Bardeen', model: 'Bardeen Agent', founded: 2020, hq: 'San Francisco, USA',
    useCases: ['Web scraping', 'Sales prospecting', 'LinkedIn-automation', 'Form-fyllning', 'Research-flöden'],
    ratingCriteria: [
      { label: 'Browser-agent', score: 9.0 }, { label: 'Användarvänlighet', score: 8.5 },
      { label: 'AI-kvalitet', score: 8.2 }, { label: 'Stabilitet', score: 7.5 },
      { label: 'Pris', score: 8.0 }, { label: 'Integrationer', score: 8.0 },
    ],
    tags: ['Chrome-extension', 'Web scraping', 'Agent', 'No-code'],
    pros: ['Direkt i Chrome', 'AI-agent som klickar och skrapar', 'Inga API:er krävs'],
    cons: ['Begränsat till webben', 'Stabilitet vid sajt-ändringar'],
    offer: { title: '100 credits gratis/mån', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Web-skrapning och agenter' },
    label: 'Bäst för webb-agenter',
  },
  'relay-app': {
    logo: 'bg-indigo-700',
    ctaName: 'Relay.app', score: 8.0, fallbackUrl: 'https://www.relay.app',
    company: 'Relay', model: 'Relay platform', founded: 2023, hq: 'San Francisco, USA',
    useCases: ['AI content-pipelines med review', 'Approval-flöden', 'Customer support-eskalering', 'Recruiting-flöden', 'Modern team-automation'],
    ratingCriteria: [
      { label: 'Human-in-the-loop', score: 9.5 }, { label: 'Modern UI', score: 9.2 },
      { label: 'AI-stöd', score: 8.5 }, { label: 'Integrationer', score: 7.5 },
      { label: 'Pris', score: 8.5 }, { label: 'Stabilitet', score: 8.0 },
    ],
    tags: ['Human-in-the-loop', 'AI-flöden', 'Approval', 'Modern UI'],
    pros: ['Pausar för mänsklig granskning', 'Modernt UI', 'Bra för kritiska flöden'],
    cons: ['Färre integrationer än Zapier', 'Tidig produkt'],
    offer: { title: 'Tjänsten är nedlagd', price: 'Nedlagd', bestFor: 'Kritiska AI-flöden med kontroll' },
    label: 'Nedlagd',
  },
  activepieces: {
    logo: 'bg-fuchsia-600',
    ctaName: 'ActivePieces', score: 7.9, fallbackUrl: 'https://www.activepieces.com',
    company: 'ActivePieces', model: 'ActivePieces platform', founded: 2022, hq: 'San Francisco, USA',
    useCases: ['Open source-automation', 'Hobby-projekt', 'SaaS-integration på budget', 'AI-flöden', 'Self-hosted automation'],
    ratingCriteria: [
      { label: 'Gratis-värde', score: 9.5 }, { label: 'Open source', score: 9.7 },
      { label: 'AI-pieces', score: 8.0 }, { label: 'Integrationsbredd', score: 7.5 },
      { label: 'Användarvänlighet', score: 8.0 }, { label: 'Community', score: 7.5 },
    ],
    tags: ['Open source', 'AI-pieces', 'Self-host', 'Generös gratis'],
    pros: ['Open source-alternativ till Zapier', 'Generös gratisversion', 'AI-pieces inbyggt'],
    cons: ['Färre integrationer', 'Mindre community'],
    offer: { title: '5000 tasks gratis/mån', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Open source-team med tight budget' },
    label: 'Bäst gratis open source',
  },
  pipedream: {
    logo: 'bg-lime-700',
    ctaName: 'Pipedream', score: 8.3, fallbackUrl: 'https://pipedream.com',
    company: 'Pipedream', model: 'Pipedream platform', founded: 2018, hq: 'San Francisco, USA',
    useCases: ['Utvecklarvänliga workflows', 'API-orkestrering', 'Egen kod i flöden', 'Webhook-handling', 'AI-pipelines med Python'],
    ratingCriteria: [
      { label: 'Kodflexibilitet', score: 9.7 }, { label: 'Integrationsbredd', score: 9.0 },
      { label: 'Dokumentation', score: 9.2 }, { label: 'Användarvänlighet', score: 7.0 },
      { label: 'Pris / prestanda', score: 8.5 }, { label: 'AI-stöd', score: 8.8 },
    ],
    tags: ['Kod-steg', 'JS/Python', '2500+ appar', 'Utvecklare'],
    pros: ['Kodbara workflows', 'Kombinera kod med integrationer', 'Bra dokumentation'],
    cons: ['Mindre nybörjarvänligt', 'Kräver kodkunskap'],
    offer: { title: 'Gratis 10k credits/mån', price: 'Gratis · Basic 29 USD/mån', bestFor: 'Utvecklare som vill koda i flöden' },
    label: 'Bäst för utvecklare',
  },

  /* ── Kod-verktyg (utöver cursor-ai + github-copilot ovan) ── */
  windsurf: {
    logo: 'bg-cyan-700',
    ctaName: 'Windsurf', score: 8.9, fallbackUrl: 'https://codeium.com/windsurf',
    company: 'Codeium', model: 'Windsurf editor', founded: 2021, hq: 'Mountain View, USA',
    useCases: ['Agentisk multi-file kodning', 'Refactoring', 'Daglig utveckling', 'Test-skrivning', 'Snabb prototyping'],
    ratingCriteria: [
      { label: 'Agent-mode (Cascade)', score: 9.3 }, { label: 'Tab-completion', score: 9.0 },
      { label: 'Editor-integration', score: 9.0 }, { label: 'Pris / prestanda', score: 9.2 },
      { label: 'Stabilitet', score: 8.5 }, { label: 'Community', score: 8.0 },
    ],
    tags: ['Agent', 'Multi-file', 'Cascade', 'Flow-mode'],
    pros: ['Cursor-rival med flow-fokus', 'Stark agent-mode', 'Snabb autonom redigering'],
    cons: ['Nyare än Cursor', 'Mindre community ännu'],
    offer: { title: 'Uppgått i Devin (Cognition)', price: 'Nedlagd', bestFor: 'Agentisk kodning' },
    label: 'Nedlagd',
  },
  tabnine: {
    logo: 'bg-slate-700',
    ctaName: 'Tabnine', score: 8.4, fallbackUrl: 'https://www.tabnine.com',
    company: 'Tabnine', model: 'Bygger på ledande modeller från Anthropic, OpenAI, Google, Meta och Mistral', founded: 2013, hq: 'Tel Aviv, Israel',
    useCases: ['Enterprise med privacy-krav', 'GDPR-känslig kodning', 'Reglerade branscher', 'On-prem AI-assistans', 'Offline-utveckling'],
    ratingCriteria: [
      { label: 'Privacy', score: 9.8 }, { label: 'On-prem stöd', score: 9.6 },
      { label: 'Kodkvalitet', score: 8.3 }, { label: 'Editor-integration', score: 9.0 },
      { label: 'Pris / prestanda', score: 8.0 }, { label: 'Modellval', score: 7.8 },
    ],
    tags: ['Privacy-first', 'On-prem', 'Air-gapped', 'MCP'],
    pros: ['Kan köras lokalt eller on-prem', 'Strikt privacy', 'Enterprise-fokus'],
    cons: ['Mindre kraftfull än Cursor/Copilot', 'Lägre modell-kvalitet'],
    offer: { title: 'Endast företagsplaner', price: 'Code Assistant 39 USD/användare/mån · Agentic 59 USD/användare/mån (årsbetalning)', bestFor: 'Enterprise med strikta datakrav' },
    label: 'Bäst för privacy',
  },
  codeium: {
    logo: 'bg-emerald-700',
    ctaName: 'Codeium', score: 8.6, fallbackUrl: 'https://codeium.com',
    company: 'Codeium', model: 'Codeium AI', founded: 2021, hq: 'Mountain View, USA',
    useCases: ['Soloutvecklare', 'Hobbyprojekt', 'Studenter', 'Stort språkstöd', 'Multi-IDE arbete'],
    ratingCriteria: [
      { label: 'Gratis-värde', score: 9.8 }, { label: 'Språkstöd', score: 9.6 },
      { label: 'IDE-stöd', score: 9.5 }, { label: 'Kodkvalitet', score: 8.5 },
      { label: 'Hastighet', score: 9.3 }, { label: 'Pris / prestanda', score: 9.5 },
    ],
    tags: ['Gratis', '70+ språk', '40+ IDE:er', 'Autocomplete'],
    pros: ['Generös gratisversion', 'Brett språkstöd', 'Snabb autocomplete'],
    cons: ['Mindre agentisk än Cursor/Windsurf', 'Pro-features är begränsade'],
    offer: { title: 'Uppgått i Devin (Cognition)', price: 'Nedlagd', bestFor: 'Soloutvecklare och hobbyprojekt' },
    label: 'Nedlagd',
  },
  'claude-code': {
    logo: 'bg-orange-600',
    ctaName: 'Claude Code', score: 9.5, fallbackUrl: 'https://claude.com/product/claude-code',
    company: 'Anthropic', model: 'Claude Opus 5 / Sonnet 5', founded: 2021, hq: 'San Francisco, USA',
    tagline: 'Kodagent som tar hela uppgiften, inte nästa rad',
    useCases: ['Refaktorering över många filer', 'Migreringar', 'Buggsökning med reproduktion', 'Ärende till pull request', 'Sätta sig in i okänd kodbas'],
    ratingCriteria: [
      { label: 'Kontextförståelse', score: 9.7 }, { label: 'Agentiskt arbete', score: 9.6 },
      { label: 'Kodkvalitet', score: 9.5 }, { label: 'Editor-integration', score: 8.8 },
      { label: 'Pris / prestanda', score: 8.8 }, { label: 'Modellval', score: 7.5 },
    ],
    tags: ['Terminal', 'Underagenter', 'GitHub-PR', 'MCP'],
    pros: ['Läser hela kodbasen utan att du pekar ut filer', 'Utför avgränsade uppgifter självständigt', 'Finns i terminal, editor, webb och mobil'],
    cons: ['Bara Anthropics egna modeller — inget modellval', 'Terminalvant arbetssätt höjer tröskeln', 'Användningstaket på Pro tar snabbt slut i stora kodbaser'],
    offer: { title: 'Ingår i Claude Pro', price: 'Pro 20 USD/mån · Max från 100 USD/mån', bestFor: 'Avgränsade uppgifter i stora kodbaser' },
    label: 'Starkast agent',
  },
  'amazon-codewhisperer': {
    logo: 'bg-orange-700',
    // AWS bytte namn pa CodeWhisperer till Q Developer den 30 april 2024 och
    // den gamla produktsidan 301:ar dit. Slug och URL far sta kvar tills vidare
    // — att byta dem kraver en redirect — men namn och lank pekar ratt.
    ctaName: 'Q Developer', score: 8.0, fallbackUrl: 'https://aws.amazon.com/q/developer/',
    company: 'Amazon Web Services', model: 'Amazon Q Developer', founded: 2006, hq: 'Seattle, USA',
    useCases: ['AWS-utveckling', 'Lambda och serverless', 'Security-fokuserad kod', 'Infrastructure as Code', 'Enterprise AWS-team'],
    ratingCriteria: [
      { label: 'AWS-integration', score: 9.7 }, { label: 'Security scan', score: 9.3 },
      { label: 'Kodkvalitet', score: 8.0 }, { label: 'Editor-integration', score: 8.7 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Språkbredd', score: 8.2 },
    ],
    tags: ['AWS', 'Security scan', 'Gratis individuell', 'Q Developer'],
    pros: ['AWS-optimerad', 'Inbyggd security scan', 'Gratis för enskilda'],
    cons: ['AWS-bias i förslag', 'Mindre stark utanför AWS'],
    offer: { title: 'Gratis för individer', price: 'Gratis · Pro 19 USD/mån', bestFor: 'AWS-utvecklare' },
    label: 'Bäst för AWS-stack',
  },
  'replit-ai': {
    logo: 'bg-orange-500',
    ctaName: 'Replit AI', score: 8.3, fallbackUrl: 'https://replit.com',
    company: 'Replit', model: 'Replit Agent', founded: 2016, hq: 'San Francisco, USA',
    useCases: ['Snabba prototyper', 'Nybörjarvänlig kodning', 'Inlärning av nya språk', 'Snabb deploy', 'Multiplayer-projekt'],
    ratingCriteria: [
      { label: 'Agent-funktion', score: 8.8 }, { label: 'Användarvänlighet', score: 9.4 },
      { label: 'Browser-IDE', score: 9.3 }, { label: 'Deploy-flöde', score: 9.0 },
      { label: 'Pris / prestanda', score: 7.8 }, { label: 'Multiplayer', score: 9.2 },
    ],
    tags: ['Browser-IDE', 'Agent', 'Deploy', 'Nybörjarvänligt'],
    pros: ['Bygg och deploya i webbläsaren', 'Agent-funktion', 'Lätt att komma igång'],
    cons: ['Begränsat för stora projekt', 'Pris skalar snabbt'],
    offer: { title: 'Gratisplan', price: 'Free Mode · Core 20 USD/mån', bestFor: 'Prototyper och nybörjare' },
    label: 'Bäst för prototyper',
  },
  'jetbrains-ai': {
    logo: 'bg-violet-700',
    ctaName: 'JetBrains AI', score: 8.7, fallbackUrl: 'https://www.jetbrains.com/ai/',
    company: 'JetBrains', model: 'AI Assistant', founded: 2000, hq: 'Prag, Tjeckien',
    useCases: ['Daglig kodning i JetBrains-IDE:er', 'JVM-utveckling', 'Refactoring', 'Commit-meddelanden', 'Stora projekt'],
    ratingCriteria: [
      { label: 'IDE-integration', score: 9.6 }, { label: 'Refactoring', score: 9.4 },
      { label: 'JVM-stöd', score: 9.5 }, { label: 'Kodkvalitet', score: 8.7 },
      { label: 'Pris / prestanda', score: 8.5 }, { label: 'Modellval', score: 8.0 },
    ],
    tags: ['IntelliJ', 'Junie-agent', 'AI-krediter', 'JetBrains-integration'],
    pros: ['Djup IDE-integration', 'Bra refactoring', 'Skarp för JVM-språk'],
    cons: ['Kräver JetBrains-licens', 'Bara i JetBrains-editorer'],
    offer: { title: '7 dagar gratis', price: 'AI Pro 10 USD/mån', bestFor: 'JetBrains-användare' },
    label: 'Bäst för JetBrains',
  },
  'sourcegraph-cody': {
    logo: 'bg-fuchsia-700',
    ctaName: 'Cody', score: 8.5, fallbackUrl: 'https://sourcegraph.com/cody',
    company: 'Sourcegraph', model: 'Cody', founded: 2013, hq: 'San Francisco, USA',
    useCases: ['Stora monorepos', 'Cross-repo refactoring', 'Mikroservicearkitekturer', 'Enterprise-kodbaser', 'Code search + chat'],
    ratingCriteria: [
      { label: 'Cross-file kontext', score: 9.7 }, { label: 'Code search', score: 9.8 },
      { label: 'Enterprise-säkerhet', score: 9.4 }, { label: 'Self-host', score: 9.2 },
      { label: 'Modellval', score: 9.0 }, { label: 'Pris / prestanda', score: 8.5 },
    ],
    tags: ['Hela kodbasen', 'Cross-file', 'Enterprise', 'Code search'],
    pros: ['Bäst på stora kodbaser', 'Cross-file kontext', 'Enterprise-säkerhet'],
    cons: ['Setup-tid för enterprise', 'Mindre snabbt än Copilot'],
    offer: { title: 'Endast Enterprise', price: 'Endast Enterprise – från 16 000 USD/år', bestFor: 'Stora monorepos' },
    label: 'Bäst för stora repos',
  },
  pieces: {
    logo: 'bg-teal-700',
    ctaName: 'Pieces', score: 7.8, fallbackUrl: 'https://pieces.app',
    company: 'Pieces', model: 'Pieces OS', founded: 2020, hq: 'Cincinnati, USA',
    useCases: ['Snippet-hantering', 'Lokal AI', 'Privacy-känslig kodning', 'Cross-app minne', 'Offline-utveckling'],
    ratingCriteria: [
      { label: 'Privacy (lokal AI)', score: 9.7 }, { label: 'Snippet-bibliotek', score: 9.0 },
      { label: 'Kontext-minne', score: 8.5 }, { label: 'IDE-integration', score: 8.0 },
      { label: 'Pris', score: 9.5 }, { label: 'Mognad', score: 7.0 },
    ],
    tags: ['Snippet-minne', 'Lokal AI', 'Kontext', 'Cross-app'],
    pros: ['Lokal AI för privacy', 'Minne över sessioner', 'Cross-app-snippet-hantering'],
    cons: ['Smalt användningsområde', 'Tidig produkt'],
    offer: { title: 'Helt gratis', price: 'Gratis · Pro kommer', bestFor: 'Snippets och AI-kontext' },
    label: 'Bäst för snippets',
  },

  workflows: {
    logo: 'bg-violet-600',
    ctaName: 'Zapier',
    fallbackUrl: 'https://zapier.com',
    company: 'AI-Magasinet', model: 'Översikt', founded: 2024, hq: 'Sverige',
    useCases: ['Lead-flöden mellan SaaS', 'AI-triggers från e-post', 'Automatisk rapportering', 'CRM-uppdateringar', 'Slack-notiser'],
    ratingCriteria: [
      { label: 'Bredd', score: 9.0 }, { label: 'Användarvänlighet', score: 8.5 },
      { label: 'Pris', score: 8.0 }, { label: 'Integrationer', score: 9.5 },
      { label: 'Pålitlighet', score: 8.8 }, { label: 'Dokumentation', score: 8.7 },
    ],
    tags: ['Översikt', 'Workflows', 'Integration', 'No-code'],
    pros: ['Bred jämförelse', 'Konkreta exempel', 'Praktisk guide'],
    cons: ['Inte en enskild produkt', 'Generell översikt'],
    offer: { title: 'Zapier 14 dagar Pro gratis', price: 'Gratis · Starter 20 USD/mån', bestFor: 'Workflows mellan SaaS-verktyg' },
    label: 'Översikt',
  },

  'github-copilot': {
    logo: 'bg-indigo-700',
    fallbackUrl: 'https://github.com/features/copilot',
    company: 'GitHub (Microsoft)', model: 'GPT-5.6 / Claude Opus / Gemini 3.8 (modellval)', founded: 2008, hq: 'San Francisco, USA',
    useCases: ['Inline-autocomplete', 'PR-recensioner', 'Tester', 'Dokumentation', 'CLI-arbetsflöden'],
    ratingCriteria: [
      { label: 'Kodkvalitet', score: 9.2 }, { label: 'Kontextförståelse', score: 9.0 },
      { label: 'Hastighet', score: 9.4 }, { label: 'Editor-integration', score: 9.6 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Modellval', score: 9.0 },
    ],
    tags: ['Inline', 'Coding agent', 'PR review', 'MCP'],
    pros: ['Bred IDE-integration', 'Bästa enterprise-stödet', 'Konkurrenskraftigt pris'],
    cons: ['Mindre agentisk än Cursor', 'Subtila skillnader på modeller'],
    offer: { title: 'Free tier för individer', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Team och enterprise' },
    label: 'Bäst för team',
  },
};

/* ─── Helpers ──────────────────────────────────────────────────── */

export function seed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31 + s.charCodeAt(i)) >>> 0);
  return h;
}

function pickN<T>(arr: T[], n: number, h: number): T[] {
  const out: T[] = [];
  const used = new Set<number>();
  for (let i = 0; out.length < n && i < n * 4; i++) {
    const idx = ((h >> i) ^ (h * (i + 1))) % arr.length;
    if (!used.has(idx)) { used.add(idx); out.push(arr[idx]); }
  }
  return out;
}

export function lookupKnown(slug: string, name: string): Partial<ReviewProfile> | null {
  if (REVIEW_KNOWN[slug]) return REVIEW_KNOWN[slug];
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(REVIEW_KNOWN)) {
    if (k.includes(key.replace(/-/g, ' ')) || k.includes(key)) return val;
  }
  return null;
}

/** Resolve a full ReviewProfile from a slug (+ optional display name),
 *  filling defaults for anything not in REVIEW_KNOWN. Shared by the review
 *  page (via buildReviewProfile) and the jämför-feature (lib/compare.ts). */
export function resolveToolProfile(slug: string, displayName?: string): ReviewProfile {
  const name = displayName ?? slug;
  const h = seed(slug);
  const known = lookupKnown(slug, name) ?? {};

  const mockCriteria: Criterion[] = DEFAULT_CRITERIA.map((label, i) => ({
    label,
    score: Math.round((8 + (((h >> (i * 3)) % 18) / 10)) * 10) / 10,
  }));

  return {
    logo: known.logo ?? LOGO_COLORS[h % LOGO_COLORS.length],
    company: known.company ?? name,
    model: known.model ?? 'Senaste modellen',
    founded: known.founded ?? 2020 + (h % 6),
    hq: known.hq ?? 'San Francisco, USA',
    useCases: known.useCases ?? pickN(GENERIC_USE_CASES, 5, h),
    ratingCriteria: known.ratingCriteria ?? mockCriteria,
    tags: known.tags ?? ['AI', 'Text', 'Produktivitet'],
    pros: known.pros ?? ['Snabb', 'Lätt att använda', 'Bra svenska'],
    cons: known.cons ?? ['Begränsad i gratisläget', 'Mindre community'],
    offer: known.offer ?? { title: '7 dagars premium gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Allmän textproduktion' },
    label: known.label ?? 'Redaktionens val',
    ctaName: known.ctaName,
    score: known.score,
    fallbackUrl: known.fallbackUrl,
    tagline: known.tagline,
  };
}

export function buildReviewProfile(article: Article): ReviewProfile {
  return resolveToolProfile(article.slug, toolNameFromTitle(article.title));
}

/** Overall 0-10 score for a profile: a curated `score` wins, otherwise the
 *  mean of its six rating criteria. Deterministic — used to pick the winner
 *  in head-to-head comparisons. */
export function toolOverallScore(p: ReviewProfile): number {
  if (p.score != null) return p.score;
  const xs = p.ratingCriteria;
  if (!xs.length) return 0;
  const mean = xs.reduce((sum, c) => sum + c.score, 0) / xs.length;
  return Math.round(mean * 10) / 10;
}
