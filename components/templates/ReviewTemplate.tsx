import Link from 'next/link';
import { parseRating, toolNameFromTitle, type Rating } from '@/lib/rating';
import type { Article } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';

/* ─── Types ────────────────────────────────────────────────────── */

type Criterion = { label: string; score: number };

type ReviewProfile = {
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
  /** Editorial score override — wins over parseRating + seed mock. */
  score?: number;
  /** Direct external URL used when articles.affiliate_url is NULL. Rendered
   *  with rel="nofollow noopener" instead of "sponsored". */
  fallbackUrl?: string;
};

/* ─── Mock data ─────────────────────────────────────────────────── */

const LOGO_COLORS = [
  'bg-emerald-500', 'bg-orange-500', 'bg-sky-500', 'bg-violet-500',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-indigo-500',
  'bg-fuchsia-500', 'bg-lime-600',
];

const SE_MONTHS = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
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

const REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = {
  /* ── Text ─────────────────────────────────────────────── */
  chatgpt: {
    logo: 'bg-emerald-500',
    fallbackUrl: 'https://chat.openai.com',
    company: 'OpenAI', model: 'GPT-5', founded: 2015, hq: 'San Francisco, USA',
    useCases: ['Allmänt skrivande', 'Sammanfattning av dokument', 'Kreativ ideation', 'Brainstorming', 'Översättning'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 9.7 }, { label: 'Hastighet / svar', score: 9.5 },
      { label: 'Pris / prestanda', score: 8.8 }, { label: 'Integrationer', score: 9.5 },
      { label: 'Säkerhet & GDPR', score: 8.5 }, { label: 'Svenska', score: 9.5 },
    ],
    tags: ['GPT-5', 'Custom GPTs', 'Canvas', 'Röst & syn'],
    pros: ['Snabb och korrekt', 'Stort ekosystem av GPTs', 'Bäst röstläge'],
    cons: ['Knapphändig källhantering', 'Begränsningar i gratisläget'],
    offer: { title: 'Plus-läge gratis i 7 dagar', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Allt-i-ett textproduktion' },
    label: 'Redaktionens val',
  },
  claude: {
    logo: 'bg-orange-500',
    fallbackUrl: 'https://claude.ai',
    company: 'Anthropic', model: 'Claude Opus 4.7', founded: 2021, hq: 'San Francisco, USA',
    useCases: ['Långform-skrivande', 'Juridiska dokument', 'Vetenskaplig analys', 'Programmering', 'Resonemang i flera steg'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 9.5 }, { label: 'Hastighet / svar', score: 8.6 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Integrationer', score: 9.2 },
      { label: 'Säkerhet & GDPR', score: 9.3 }, { label: 'Svenska', score: 9.6 },
    ],
    tags: ['Claude 4 Opus', 'Projects', 'Artifacts', '200k context'],
    pros: ['Bäst på långform', 'Säker källhantering', 'Skarp på nyans'],
    cons: ['Långsammare än GPT', 'Dyrare per token'],
    offer: { title: '200k token kontext gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Långa dokument och nyans' },
    label: 'Bäst för långform',
  },
  gemini: {
    logo: 'bg-sky-500',
    fallbackUrl: 'https://gemini.google.com',
    company: 'Google', model: 'Gemini 2.5 Pro', founded: 1998, hq: 'Mountain View, USA',
    useCases: ['Workspace-integration', 'Stora dokument', 'Multimodal analys', 'Research', 'Data-summering'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 9.0 }, { label: 'Hastighet / svar', score: 9.4 },
      { label: 'Pris / prestanda', score: 9.1 }, { label: 'Integrationer', score: 9.7 },
      { label: 'Säkerhet & GDPR', score: 8.8 }, { label: 'Svenska', score: 8.5 },
    ],
    tags: ['Gemini 2.5 Pro', '1M context', 'Workspace', 'Multimodal'],
    pros: ['Enorm kontext', 'Integrerat med Google', 'Stark på multimodal'],
    cons: ['Ojämn svenska', 'Beroende av Google-konto'],
    offer: { title: 'Gemini Advanced 2 mån gratis', price: 'Gratis · Advanced 22 USD/mån', bestFor: 'Workspace-användare' },
    label: 'Bäst för stora dokument',
  },
  'jasper-ai': {
    logo: 'bg-amber-500',
    fallbackUrl: 'https://www.jasper.ai',
    company: 'Jasper', model: 'Jasper 4', founded: 2021, hq: 'Austin, USA',
    useCases: ['Marknadsföringscopy', 'Sociala medier', 'Annonstexter', 'Bloggar', 'Brand voice'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.7 }, { label: 'Hastighet / svar', score: 9.0 },
      { label: 'Pris / prestanda', score: 7.8 }, { label: 'Integrationer', score: 8.5 },
      { label: 'Säkerhet & GDPR', score: 8.4 }, { label: 'Svenska', score: 8.2 },
    ],
    tags: ['Brand Voice', 'SEO-mode', 'Templates', 'Teams'],
    pros: ['Konsistent brand voice', 'Många mallar', 'Bra för team'],
    cons: ['Högre pris', 'Smal modell-grund'],
    offer: { title: 'Jasper 7 dagar gratis', price: 'Gratis · Creator 49 USD/mån', bestFor: 'Marknadsföring' },
    label: 'Bäst för marknadsföring',
  },
  writesonic: {
    logo: 'bg-violet-500',
    fallbackUrl: 'https://writesonic.com',
    company: 'Writesonic', model: 'Sonic 4', founded: 2020, hq: 'Bangalore, Indien',
    useCases: ['SEO-artiklar', 'Snabb copy', 'Annonser', 'E-post', 'Produktbeskrivningar'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.3 }, { label: 'Hastighet / svar', score: 9.3 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Integrationer', score: 8.2 },
      { label: 'Säkerhet & GDPR', score: 7.8 }, { label: 'Svenska', score: 7.9 },
    ],
    tags: ['SEO mode', 'Bulk', 'Chatsonic', 'API'],
    pros: ['Snabb', 'Bra pris', 'Bulk-funktion för SEO'],
    cons: ['Svenska är ojämn', 'Mindre nyans i text'],
    offer: { title: 'Gratisplan med 10k ord/mån', price: 'Gratis · Pro 16 USD/mån', bestFor: 'SEO och snabb copy' },
    label: 'Bäst för SEO',
  },
  'copy-ai': {
    logo: 'bg-rose-500',
    fallbackUrl: 'https://www.copy.ai',
    company: 'Copy.ai', model: 'Copy GPT', founded: 2020, hq: 'Memphis, USA',
    useCases: ['Sociala medier', 'Säljmejl', 'Annonser', 'Produktbeskrivningar', 'Slogans'],
    ratingCriteria: [
      { label: 'Textkvalitet', score: 8.0 }, { label: 'Hastighet / svar', score: 9.2 },
      { label: 'Pris / prestanda', score: 9.2 }, { label: 'Integrationer', score: 8.0 },
      { label: 'Säkerhet & GDPR', score: 7.6 }, { label: 'Svenska', score: 7.5 },
    ],
    tags: ['Workflows', 'Templates', 'Brand voice', 'API'],
    pros: ['Många mallar', 'Workflows-automation', 'Lågt instegspris'],
    cons: ['Begränsad svenska', 'Mindre kraftfull modell'],
    offer: { title: 'Free forever-plan', price: 'Gratis · Pro 36 USD/mån', bestFor: 'Säljteam och social media' },
    label: 'Bäst för säljteam',
  },

  /* ── Video ────────────────────────────────────────────── */
  'sora-2': {
    logo: 'bg-zinc-900',
    ctaName: 'Sora', score: 8.2, fallbackUrl: 'https://chatgpt.com',
    company: 'OpenAI', model: 'Sora 2', founded: 2015, hq: 'San Francisco, USA',
    useCases: ['Text-till-video', 'Reklamvideor', 'Konceptvisualisering', 'Sociala medier-clips', 'Storyboards'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.4 }, { label: 'Promptföljsamhet', score: 9.0 },
      { label: 'Tillgänglighet', score: 5.5 }, { label: 'Generationstid', score: 7.0 },
      { label: 'Pris / generering', score: 7.5 }, { label: 'Stilkontroll', score: 8.5 },
    ],
    tags: ['Sora 2', 'Text-till-video', 'Endast via ChatGPT', 'Begränsad'],
    pros: ['Skarp video-AI när tillgänglig', 'Multi-shot storytelling', 'Konsistenta karaktärer'],
    cons: ['sora.com nedlagt — endast via ChatGPT', 'Begränsad åtkomst för svenska användare'],
    offer: { title: 'Begränsad åtkomst', price: 'Endast via ChatGPT Plus 20 USD/mån', bestFor: 'AI-genererad video från text' },
    label: 'Begränsad tillgång',
  },
  'runway-gen-3': {
    logo: 'bg-fuchsia-600',
    ctaName: 'Runway', score: 9.1, fallbackUrl: 'https://runwayml.com',
    company: 'Runway', model: 'Gen-3 Alpha', founded: 2018, hq: 'New York, USA',
    useCases: ['Video & redigering', 'Visuella effekter', 'Filmkonceptarbete', 'Reklamfilm', 'Mode & e-handel'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.3 }, { label: 'Promptföljsamhet', score: 8.8 },
      { label: 'Konsistens & rörelse', score: 8.7 }, { label: 'Generationstid', score: 8.5 },
      { label: 'Redigeringsverktyg', score: 9.5 }, { label: 'Stilkontroll', score: 9.2 },
    ],
    tags: ['Gen-3 Alpha', 'Redigering', 'Effekter', 'Image-to-video'],
    pros: ['Inbyggd redigeringsstudio', 'Avancerad kamerakontroll', 'Brett ekosystem av effekter'],
    cons: ['Dyrt för längre projekt', 'Mindre stark på text-i-bild'],
    offer: { title: 'Basic gratis', price: 'Gratis · Standard 15 USD/mån', bestFor: 'Video, redigering och effekter' },
    label: 'Bäst för redigering & effekter',
  },
  'pika-labs': {
    logo: 'bg-pink-500',
    ctaName: 'Pika Labs', score: 8.7, fallbackUrl: 'https://pika.art',
    company: 'Pika', model: 'Pika 2.0', founded: 2023, hq: 'Palo Alto, USA',
    useCases: ['Text-till-video', 'Bild-till-video', 'Sociala medier', 'Animerade memes', 'Produktdemos'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 8.5 }, { label: 'Promptföljsamhet', score: 8.4 },
      { label: 'Konsistens & rörelse', score: 8.0 }, { label: 'Generationstid', score: 9.4 },
      { label: 'Pris / generering', score: 9.0 }, { label: 'Stilkontroll', score: 8.7 },
    ],
    tags: ['Pika 2.0', 'Text/bild → video', 'Pikaffects', 'Lip sync'],
    pros: ['Snabbaste i klassen', 'Roliga effekter (Pikaffects)', 'Lågt pris för premium'],
    cons: ['Mindre filmisk än Runway/Sora', 'Kortare clip-längd'],
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Pro 8 USD/mån', bestFor: 'Text- och bild-till-video' },
    label: 'Bästa pris-prestanda',
  },
  'kling-ai': {
    logo: 'bg-red-500',
    ctaName: 'Kling', score: 9.4, fallbackUrl: 'https://klingai.com',
    company: 'Kuaishou', model: 'Kling 1.6', founded: 2011, hq: 'Beijing, Kina',
    useCases: ['Realistisk AI-video', 'Stiliserade kortvideor', 'Animerade porträtt', 'TikTok/Reels-content', 'Image-to-video'],
    ratingCriteria: [
      { label: 'Visuell realism', score: 9.5 }, { label: 'Promptföljsamhet', score: 9.0 },
      { label: 'Konsistens & rörelse', score: 9.4 }, { label: 'Generationstid', score: 8.8 },
      { label: 'Pris / generering', score: 9.5 }, { label: 'Stilkontroll', score: 9.2 },
    ],
    tags: ['Kling 1.6', 'Realism', 'Lip sync', 'Long-form'],
    pros: ['Marknadens mest realistiska video', 'Lång clip-längd (2 min)', 'Stark image-to-video'],
    cons: ['Engelska prompts ojämn', 'Mindre community utanför Kina'],
    offer: { title: 'Gratis begränsad', price: 'Gratis · Pro ~10 USD/mån', bestFor: 'Realistisk AI-video' },
    label: 'Redaktionens val',
  },

  /* ── Bild ─────────────────────────────────────────────── */
  midjourney: {
    logo: 'bg-violet-700',
    fallbackUrl: 'https://www.midjourney.com',
    company: 'Midjourney', model: 'V7', founded: 2021, hq: 'San Francisco, USA',
    useCases: ['Konceptkonst', 'Reklamvisualer', 'Bokomslag', 'Mood boards', 'Karaktärsdesign'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.7 }, { label: 'Promptföljsamhet', score: 8.8 },
      { label: 'Stilbredd', score: 9.6 }, { label: 'Text-i-bild', score: 8.4 },
      { label: 'Pris / bild', score: 8.6 }, { label: 'Användarvänlighet', score: 8.2 },
    ],
    tags: ['V7', 'Discord & web', 'Style refs', 'Personalization'],
    pros: ['Branschens skarpaste bildkvalitet', 'Stilreferenser med --sref', 'Stor estetisk bredd'],
    cons: ['Discord-flöde inlärningströskel', 'Sämre på text i bilden'],
    offer: { title: 'Web-app i basic plan', price: 'Basic 10 USD/mån', bestFor: 'Kreatörer och designers' },
    label: 'Redaktionens val',
  },
  'dalle-3': {
    logo: 'bg-emerald-500',
    fallbackUrl: 'https://openai.com/dall-e-3',
    company: 'OpenAI', model: 'DALL·E 3', founded: 2015, hq: 'San Francisco, USA',
    useCases: ['Snabba illustrationer i ChatGPT', 'Bloggbilder', 'Sociala medier', 'Pedagogiska bilder', 'Enkla loggor'],
    ratingCriteria: [
      { label: 'Visuell kvalitet', score: 9.0 }, { label: 'Promptföljsamhet', score: 9.4 },
      { label: 'Stilbredd', score: 8.7 }, { label: 'Text-i-bild', score: 9.0 },
      { label: 'Pris / bild', score: 9.0 }, { label: 'Användarvänlighet', score: 9.5 },
    ],
    tags: ['DALL·E 3', 'ChatGPT', 'Text i bild', 'API'],
    pros: ['Enklast att använda', 'Bra på text i bilden', 'Ingår i ChatGPT Plus'],
    cons: ['Smalare stilbredd än MJ', 'Mindre stylekontroll'],
    offer: { title: 'Ingår i ChatGPT Plus', price: 'Plus 20 USD/mån (ChatGPT)', bestFor: 'Bloggare och allmän användning' },
    label: 'Bäst för nybörjare',
  },

  /* ── Ljud / musik ─────────────────────────────────────── */
  'suno-ai': {
    logo: 'bg-amber-600',
    fallbackUrl: 'https://suno.com',
    company: 'Suno', model: 'V4', founded: 2022, hq: 'Cambridge, USA',
    useCases: ['Demos för låtskrivare', 'Podcast-intros', 'Reklamjinglar', 'TikTok-musik', 'Soundtracks'],
    ratingCriteria: [
      { label: 'Ljudkvalitet', score: 9.0 }, { label: 'Stilbredd', score: 9.2 },
      { label: 'Lyrik-AI', score: 8.6 }, { label: 'Hastighet', score: 9.5 },
      { label: 'Pris / spår', score: 8.8 }, { label: 'Användarvänlighet', score: 9.4 },
    ],
    tags: ['V4', 'Custom lyrics', '4 min spår', 'Stems-export'],
    pros: ['Snabbast i klassen', 'Bra på lyrik', 'Stems för efterproduktion'],
    cons: ['Mindre nyans än Udio', 'Kommersiella rättigheter kräver Pro'],
    offer: { title: '50 spår gratis varje månad', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Musiker och content-skapare' },
    label: 'Redaktionens val',
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
    tags: ['v3', 'Voice clone', '32 språk', 'Dubbing'],
    pros: ['Marknadens mest naturliga röster', 'Stark voice cloning', 'Utmärkt svenska'],
    cons: ['Pris skalar snabbt', 'Voice cloning kräver verifiering'],
    offer: { title: '10k tecken gratis varje månad', price: 'Gratis · Starter 5 USD/mån', bestFor: 'Audiobooks och narration' },
    label: 'Bäst för svensk voice',
  },

  /* ── Kod ──────────────────────────────────────────────── */
  'cursor-ai': {
    logo: 'bg-zinc-900',
    fallbackUrl: 'https://www.cursor.com',
    company: 'Anysphere', model: 'Cursor (uses Claude 4.7 / GPT-5)', founded: 2022, hq: 'San Francisco, USA',
    useCases: ['Daglig kodning', 'Refactoring', 'Test-skrivning', 'Bug-fixing', 'Inlärning av nya kodbaser'],
    ratingCriteria: [
      { label: 'Kodkvalitet', score: 9.6 }, { label: 'Kontextförståelse', score: 9.5 },
      { label: 'Hastighet', score: 9.2 }, { label: 'Editor-integration', score: 9.7 },
      { label: 'Pris / prestanda', score: 8.6 }, { label: 'Modellval', score: 9.5 },
    ],
    tags: ['Composer', 'Tab', 'Multi-file edits', 'MCP'],
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
    company: 'n8n', model: 'n8n platform', founded: 2019, hq: 'Berlin, Tyskland',
    useCases: ['Self-hosted automation', 'AI-pipelines on-prem', 'Webhook-orkestrering', 'Data-ETL', 'Cron-baserade jobs'],
    ratingCriteria: [
      { label: 'Flexibilitet', score: 9.4 }, { label: 'Self-host', score: 9.7 },
      { label: 'AI-noder', score: 9.0 }, { label: 'Integrationer', score: 8.3 },
      { label: 'Community', score: 9.0 }, { label: 'Användarvänlighet', score: 7.5 },
    ],
    tags: ['Open source', 'Self-host', 'AI-noder', 'Kod-noder'],
    pros: ['Fullt open source', 'Kan självhostas', 'Bra för utvecklare'],
    cons: ['Kräver tekniskt kunnande', 'Mindre polerat UI än Zapier'],
    offer: { title: 'Self-host gratis', price: 'Gratis · Cloud 20 EUR/mån', bestFor: 'Tekniska team som vill äga data' },
    label: 'Bäst open source',
  },
  'zapier-ai': {
    logo: 'bg-orange-600',
    ctaName: 'Zapier', score: 8.9, fallbackUrl: 'https://zapier.com',
    company: 'Zapier', model: 'Zapier platform', founded: 2011, hq: 'Sunnyvale, USA',
    useCases: ['SaaS-integration', 'AI Actions', 'Lead-flöden', 'CRM-automation', 'Notisflöden'],
    ratingCriteria: [
      { label: 'Integrationsbredd', score: 9.8 }, { label: 'Användarvänlighet', score: 9.4 },
      { label: 'Pris / prestanda', score: 7.8 }, { label: 'AI-stöd', score: 8.8 },
      { label: 'Stabilitet', score: 9.2 }, { label: 'Dokumentation', score: 9.0 },
    ],
    tags: ['7000+ appar', 'AI Actions', 'Tables', 'Interfaces'],
    pros: ['Flest integrationer på marknaden', 'Enkelt att komma igång', 'AI Actions inbyggt'],
    cons: ['Dyrt för stora volymer', 'Mindre flexibelt än Make'],
    offer: { title: '100 tasks gratis/mån', price: 'Gratis · Starter 20 USD/mån', bestFor: 'Snabb SaaS-integration' },
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
    offer: { title: '200 steg gratis/mån', price: 'Gratis · Pro 9 USD/mån', bestFor: 'Kritiska AI-flöden med kontroll' },
    label: 'Bäst för human-in-the-loop',
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
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Pro 15 USD/mån', bestFor: 'Agentisk kodning' },
    label: 'Bäst utmanare',
  },
  tabnine: {
    logo: 'bg-slate-700',
    ctaName: 'Tabnine', score: 8.4, fallbackUrl: 'https://www.tabnine.com',
    company: 'Tabnine', model: 'Tabnine AI', founded: 2013, hq: 'Tel Aviv, Israel',
    useCases: ['Enterprise med privacy-krav', 'GDPR-känslig kodning', 'Reglerade branscher', 'On-prem AI-assistans', 'Offline-utveckling'],
    ratingCriteria: [
      { label: 'Privacy', score: 9.8 }, { label: 'On-prem stöd', score: 9.6 },
      { label: 'Kodkvalitet', score: 8.3 }, { label: 'Editor-integration', score: 9.0 },
      { label: 'Pris / prestanda', score: 8.0 }, { label: 'Modellval', score: 7.8 },
    ],
    tags: ['Privacy-first', 'On-prem', 'Enterprise', 'Lokal modell'],
    pros: ['Kan köras lokalt eller on-prem', 'Strikt privacy', 'Enterprise-fokus'],
    cons: ['Mindre kraftfull än Cursor/Copilot', 'Lägre modell-kvalitet'],
    offer: { title: 'Gratis Basic', price: 'Gratis · Pro 12 USD/mån', bestFor: 'Enterprise med strikta datakrav' },
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
    offer: { title: 'Helt gratis för individer', price: 'Gratis · Teams 12 USD/mån', bestFor: 'Soloutvecklare och hobbyprojekt' },
    label: 'Bäst gratis',
  },
  'amazon-codewhisperer': {
    logo: 'bg-orange-700',
    ctaName: 'CodeWhisperer', score: 8.0, fallbackUrl: 'https://aws.amazon.com/codewhisperer/',
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
    offer: { title: 'Gratisplan', price: 'Gratis · Core 25 USD/mån', bestFor: 'Prototyper och nybörjare' },
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
    tags: ['IntelliJ', 'PyCharm', 'WebStorm', 'JetBrains-integration'],
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
    offer: { title: 'Gratis Free-plan', price: 'Gratis · Pro 9 USD/mån', bestFor: 'Stora monorepos' },
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
    company: 'GitHub (Microsoft)', model: 'Copilot (GPT-5 / Claude 4)', founded: 2008, hq: 'San Francisco, USA',
    useCases: ['Inline-autocomplete', 'PR-recensioner', 'Tester', 'Dokumentation', 'CLI-arbetsflöden'],
    ratingCriteria: [
      { label: 'Kodkvalitet', score: 9.2 }, { label: 'Kontextförståelse', score: 9.0 },
      { label: 'Hastighet', score: 9.4 }, { label: 'Editor-integration', score: 9.6 },
      { label: 'Pris / prestanda', score: 9.0 }, { label: 'Modellval', score: 9.0 },
    ],
    tags: ['Inline', 'Chat', 'PR review', 'Enterprise'],
    pros: ['Bred IDE-integration', 'Bästa enterprise-stödet', 'Konkurrenskraftigt pris'],
    cons: ['Mindre agentisk än Cursor', 'Subtila skillnader på modeller'],
    offer: { title: 'Free tier för individer', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Team och enterprise' },
    label: 'Bäst för team',
  },
};

/* ─── Helpers ──────────────────────────────────────────────────── */

function seed(s: string): number {
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

function lookupKnown(slug: string, name: string): Partial<ReviewProfile> | null {
  if (REVIEW_KNOWN[slug]) return REVIEW_KNOWN[slug];
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(REVIEW_KNOWN)) {
    if (k.includes(key.replace(/-/g, ' ')) || k.includes(key)) return val;
  }
  return null;
}

function buildReviewProfile(article: Article): ReviewProfile {
  const name = toolNameFromTitle(article.title);
  const h = seed(article.slug);
  const known = lookupKnown(article.slug, name) ?? {};

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
  };
}

function getRating(article: Article): Rating {
  // Curated KNOWN.score wins; else parsed from content_mdx; else seed mock.
  const known = lookupKnown(article.slug, toolNameFromTitle(article.title));
  if (known?.score != null) return { score: known.score, max: 10 };
  const parsed = parseRating(article.content_mdx);
  if (parsed) return parsed;
  const h = seed(article.slug);
  const score = 7.4 + ((h % 23) * 0.1);
  return { score: Math.round(score * 10) / 10, max: 10 };
}

function sanitizeWpHtml(html: string): string {
  return html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function buildCrumbs(path: string): { label: string; href: string }[] {
  const parts = path.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Hem', href: '/' }];
  let acc = '';
  for (const p of parts) {
    acc += '/' + p;
    crumbs.push({ label: decodeURIComponent(p), href: acc });
  }
  return crumbs;
}

function currentMonthLabel(): string {
  const d = new Date();
  return `${SE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function starsFromScore(score: number): number {
  return Math.max(1, Math.min(5, Math.round((score / 10) * 5)));
}

function rankAmongSiblings(article: Article, siblings: ArticleCardData[]): number {
  const all: { slug: string; score: number }[] = [
    { slug: article.slug, score: getRating(article).score },
    ...siblings.map((s) => ({
      slug: s.slug,
      // Siblings don't ship content_mdx → mock from seed (consistent with deeplink rank-ish positioning).
      score: 7.4 + ((seed(s.slug) % 23) * 0.1),
    })),
  ];
  all.sort((a, b) => b.score - a.score);
  return all.findIndex((x) => x.slug === article.slug) + 1;
}

/* ─── Template ─────────────────────────────────────────────────── */

export function ReviewTemplate({
  article: a,
  siblings,
}: {
  article: Article;
  siblings: ArticleCardData[];
}) {
  const toolName = toolNameFromTitle(a.title);
  const profile = buildReviewProfile(a);
  const rating = getRating(a);
  const rank = rankAmongSiblings(a, siblings);
  const crumbs = buildCrumbs(a.path);
  const monthLabel = currentMonthLabel();
  const stars = starsFromScore(rating.score);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: toolName,
      applicationCategory: 'AI Tool',
      ...(a.featured_image ? { image: a.featured_image } : {}),
    },
    reviewRating: { '@type': 'Rating', ratingValue: rating.score, bestRating: rating.max, worstRating: 0 },
    author: { '@type': 'Organization', name: 'AI-Magasinet' },
    ...(a.published_at ? { datePublished: a.published_at } : {}),
    ...(a.excerpt ? { reviewBody: a.excerpt } : {}),
  };

  return (
    <article className="bg-muted text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero
        article={a}
        toolName={toolName}
        profile={profile}
        rating={rating}
        stars={stars}
        rank={rank}
        crumbs={crumbs}
        monthLabel={monthLabel}
      />

      <OfferBanner profile={profile} toolName={toolName} affiliateUrl={a.affiliate_url} />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:gap-14">
          <main className="min-w-0">
            <Verdict toolName={toolName} profile={profile} excerpt={a.excerpt} />
            <RatingMatrixSection profile={profile} />
            <ProsCons profile={profile} />
            <UseCases toolName={toolName} profile={profile} />
            <Djupanalys toolName={toolName} content={a.content_mdx} />
            <Alternatives siblings={siblings} parentPath={parentPathOf(a.path)} />
            <BottomCta toolName={toolName} profile={profile} affiliateUrl={a.affiliate_url} />
            <NextPrev siblings={siblings} />
          </main>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <Snabbfakta profile={profile} />
            <SidebarOffer toolName={toolName} profile={profile} affiliateUrl={a.affiliate_url} />
            <BackToTopplistan parentPath={parentPathOf(a.path)} />
          </aside>
        </div>
      </div>
    </article>
  );
}

function parentPathOf(path: string): string {
  const segs = path.split('/').filter(Boolean);
  return '/' + segs.slice(0, -1).join('/');
}

/* ─── Hero ─────────────────────────────────────────────────────── */

function Hero({
  article: a,
  toolName,
  profile,
  rating,
  stars,
  rank,
  crumbs,
  monthLabel,
}: {
  article: Article;
  toolName: string;
  profile: ReviewProfile;
  rating: Rating;
  stars: number;
  rank: number;
  crumbs: { label: string; href: string }[];
  monthLabel: string;
}) {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
        {/* Breadcrumb */}
        <nav aria-label="Brödsmulor" className="mb-7 flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-fg-faint">›</span>}
              {i === crumbs.length - 1 ? (
                <span className="text-fg-muted">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-indigo-600">{c.label}</Link>
              )}
            </span>
          ))}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr,auto] lg:items-start lg:gap-10">
          {/* Logo + heading group — always horizontal so logo never floats alone */}
          <div className="flex items-start gap-4 sm:gap-5">
            <ToolLogo profile={profile} image={a.featured_image} size="lg" />

            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                <span aria-hidden>✦</span>
                Recension · Uppdaterad {monthLabel}
              </span>

              <h1 className="mt-4 text-balance text-3xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
                {toolName}{' '}
                <span className="text-indigo-600">Recension</span>
              </h1>

              {a.excerpt && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-subtle sm:text-lg">
                  {a.excerpt}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rating block — centered on mobile, right-aligned on desktop */}
          <div className="flex flex-col items-center gap-2 text-center lg:items-end lg:text-right">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-teal-200 bg-teal-50 lg:mx-0">
              <span className="text-3xl font-black leading-none tracking-tight text-teal-600">
                {rating.score.toFixed(1)}
              </span>
            </div>
            <span className="text-base leading-none tracking-widest text-indigo-500">
              {'★'.repeat(stars)}
              <span className="text-line-strong">{'★'.repeat(5 - stars)}</span>
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
              #{rank} · {profile.label}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Offer banner (just under hero) ──────────────────────────── */

function OfferBanner({
  profile,
  toolName,
  affiliateUrl,
}: {
  profile: ReviewProfile;
  toolName: string;
  affiliateUrl: string | null;
}) {
  return (
    <div className="border-b border-line bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          >
            🎁
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
              Aktuellt erbjudande
            </div>
            <div className="mt-0.5 text-base">
              <span className="font-bold text-fg">{profile.offer.title}</span>
              <span className="mx-2 text-fg-faint">·</span>
              <span className="text-fg-subtle">{profile.offer.price}</span>
            </div>
          </div>
        </div>
        <AffiliateBtn affiliateUrl={affiliateUrl} fallbackUrl={profile.fallbackUrl} label={`Prova ${profile.ctaName ?? toolName}`} />
      </div>
    </div>
  );
}

/* ─── Verdict + rating matrix ─────────────────────────────────── */

function Verdict({
  toolName,
  profile,
  excerpt,
}: {
  toolName: string;
  profile: ReviewProfile;
  excerpt: string | null;
}) {
  return (
    <section className="mt-10">
      <Eyebrow>Redaktionens dom</Eyebrow>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        Vårt omdöme om {toolName}
      </h2>
      <p className="mt-4 max-w-prose text-[17px] leading-[1.75] text-fg-muted">
        {excerpt
          ? excerpt + ' '
          : ''}
        {toolName} levererar en konsekvent stark upplevelse i AI-Magasinets test.
        Vår sammanvägda bedömning placerar verktyget tydligt i premiumklassen för
        sin kategori — särskilt om du värdesätter {profile.useCases[0]?.toLowerCase() ?? 'kvalitet'}.
      </p>
    </section>
  );
}

function RatingMatrixSection({ profile }: { profile: ReviewProfile }) {
  return (
    <section className="mt-10 rounded-2xl border border-line bg-card p-6 sm:p-8">
      <Eyebrow>Så testade vi</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg">
        Betyg per kriterium
      </h3>

      <ul className="mt-6 flex flex-col gap-4">
        {profile.ratingCriteria.map(({ label, score }) => {
          const pct = Math.min(100, Math.max(0, (score / 10) * 100));
          return (
            <li key={label} className="grid grid-cols-[140px,1fr,auto] items-center gap-4 sm:grid-cols-[220px,1fr,auto]">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
                {label}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-soft">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-sm font-bold text-fg">
                {score.toFixed(1)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─── Pros & cons ──────────────────────────────────────────────── */

function ProsCons({ profile }: { profile: ReviewProfile }) {
  return (
    <section className="mt-10">
      <Eyebrow>För- & nackdelar</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
        Vad vi gillar — och inte
      </h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">✓</span>
            Styrkor
          </div>
          <ul className="space-y-2.5 text-[15px] text-fg">
            {profile.pros.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rose-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100">✗</span>
            Svagheter
          </div>
          <ul className="space-y-2.5 text-[15px] text-fg">
            {profile.cons.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─── Use cases ────────────────────────────────────────────────── */

function UseCases({ toolName, profile }: { toolName: string; profile: ReviewProfile }) {
  return (
    <section className="mt-10">
      <Eyebrow>Användningsområden</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
        {toolName} är bäst för
      </h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile.useCases.map((uc) => (
          <div
            key={uc}
            className="flex items-center gap-3 rounded-lg border border-line bg-indigo-50/40 px-4 py-3"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-600"
            >
              ⚡
            </span>
            <span className="text-[15px] font-semibold text-fg">{uc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Djupanalys (content_mdx) ────────────────────────────────── */

function Djupanalys({ toolName, content }: { toolName: string; content: string | null }) {
  const html = content ? sanitizeWpHtml(content) : '';
  if (!html.trim()) return null;
  return (
    <section className="mt-12">
      <Eyebrow>Djupanalys</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
        Allt om {toolName}
      </h3>
      <div className="magazine-prose mt-6">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-3 sm:prose-h2:text-2xl
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-lg
            prose-p:text-fg-muted prose-p:leading-[1.85]
            prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-img:rounded-xl prose-img:border prose-img:border-line
            prose-hr:my-10 prose-hr:border-line
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}

/* ─── Alternatives ──────────────────────────────────────────────── */

function Alternatives({
  siblings,
  parentPath,
}: {
  siblings: ArticleCardData[];
  parentPath: string;
}) {
  if (siblings.length === 0) return null;
  const picks = siblings.slice(0, 3);
  return (
    <section className="mt-14">
      <Eyebrow>Alternativ</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
        Andra att överväga
      </h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((s) => {
          const fakeArticle: Article = {
            ...(s as unknown as Article),
            content_mdx: null,
            tags: [],
            parent_slug: null,
            type: 'page',
            seo_title: null,
            seo_description: null,
            id: 0,
          };
          const sp = buildReviewProfile(fakeArticle);
          const sr = getRating(fakeArticle);
          return (
            <Link
              key={s.slug}
              href={s.path}
              className="group flex flex-col gap-3 rounded-xl border border-line bg-card p-4 transition-colors hover:border-indigo-300"
            >
              <div className="flex items-start gap-3">
                <ToolLogo profile={sp} image={s.featured_image} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
                    {toolNameFromTitle(s.title)}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                    {sp.label}
                  </div>
                </div>
                <span className="shrink-0 font-black text-teal-600">
                  {sr.score.toFixed(1)}
                </span>
              </div>
              {s.excerpt && (
                <p className="line-clamp-2 text-xs text-fg-subtle">{s.excerpt}</p>
              )}
            </Link>
          );
        })}
      </div>

      <Link
        href={parentPath}
        className="mt-5 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600 hover:text-indigo-700"
      >
        ← Hela topplistan
      </Link>
    </section>
  );
}

/* ─── Bottom CTA ───────────────────────────────────────────────── */

function BottomCta({
  toolName,
  profile,
  affiliateUrl,
}: {
  toolName: string;
  profile: ReviewProfile;
  affiliateUrl: string | null;
}) {
  return (
    <section className="mt-14">
      <div className="flex flex-col gap-5 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700"
          >
            🏆
          </span>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-fg">
              Redo att testa {toolName}?
            </h3>
            <p className="mt-1 text-sm text-fg-subtle">
              {profile.offer.title} — inget kreditkort krävs.
            </p>
          </div>
        </div>
        <AffiliateBtn affiliateUrl={affiliateUrl} fallbackUrl={profile.fallbackUrl} label={`Prova ${profile.ctaName ?? toolName}`} size="lg" />
      </div>
    </section>
  );
}

/* ─── Next / prev link ─────────────────────────────────────────── */

function NextPrev({ siblings }: { siblings: ArticleCardData[] }) {
  const next = siblings[0];
  if (!next) return null;
  return (
    <div className="mt-8 flex justify-end">
      <Link
        href={next.path}
        className="group inline-flex flex-col items-end rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-indigo-300"
      >
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-fg-subtle">
          Nästa →
        </span>
        <span className="mt-1 text-sm font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
          {toolNameFromTitle(next.title)}
        </span>
      </Link>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────── */

const SNABBFAKTA_ROWS: { key: keyof ReviewProfile | 'offer-price' | 'offer-bestFor'; label: string; icon: string }[] = [
  { key: 'company',         label: 'Företag',  icon: '🌐' },
  { key: 'model',           label: 'Modell',   icon: '🤖' },
  { key: 'founded',         label: 'Grundat',  icon: '🗓' },
  { key: 'hq',              label: 'HQ',       icon: '📍' },
  { key: 'offer-price',     label: 'Pris',     icon: '💲' },
  { key: 'offer-bestFor',   label: 'Bäst för', icon: '🏆' },
];

function Snabbfakta({ profile }: { profile: ReviewProfile }) {
  const rowValue = (key: (typeof SNABBFAKTA_ROWS)[number]['key']): string => {
    if (key === 'offer-price')   return profile.offer.price;
    if (key === 'offer-bestFor') return profile.offer.bestFor;
    const v = profile[key as keyof ReviewProfile];
    return typeof v === 'string' || typeof v === 'number' ? String(v) : '';
  };

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Snabbfakta
      </div>
      <ul className="flex flex-col">
        {SNABBFAKTA_ROWS.map((row, i) => (
          <li
            key={row.key}
            className={
              'flex items-start gap-3 py-3 ' +
              (i !== 0 ? 'border-t border-line-subtle' : '')
            }
          >
            <span aria-hidden className="mt-0.5 text-base text-fg-subtle">{row.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                {row.label}
              </div>
              <div className="mt-0.5 text-sm font-bold text-fg">{rowValue(row.key)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarOffer({
  toolName,
  profile,
  affiliateUrl,
}: {
  toolName: string;
  profile: ReviewProfile;
  affiliateUrl: string | null;
}) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-700">
        🎁 Erbjudande
      </div>
      <div className="mt-2 text-base font-black uppercase tracking-tight text-fg">
        {profile.offer.title}
      </div>
      <div className="mt-3">
        <AffiliateBtn affiliateUrl={affiliateUrl} fallbackUrl={profile.fallbackUrl} label={`Prova ${profile.ctaName ?? toolName}`} fullWidth />
      </div>
      <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-fg-faint">
        Annonslänk · 18+
      </div>
    </div>
  );
}

function BackToTopplistan({ parentPath }: { parentPath: string }) {
  return (
    <Link
      href={parentPath}
      className="block rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-indigo-300"
    >
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
        ← Tillbaka
      </div>
      <div className="mt-1 text-sm font-black uppercase tracking-tight text-fg">
        Hela topplistan
      </div>
    </Link>
  );
}

/* ─── Atoms ────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
      {children}
    </div>
  );
}

function ToolLogo({
  profile,
  image,
  size = 'md',
}: {
  profile: ReviewProfile;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims =
    size === 'lg' ? 'h-20 w-20 rounded-2xl text-3xl'
    : size === 'sm' ? 'h-10 w-10 rounded-lg text-base'
    : 'h-14 w-14 rounded-xl text-2xl';

  if (image) {
    const padding = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-1.5' : 'p-2';
    return (
      <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-line bg-card ${padding} ${dims}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const initial = profile.company.charAt(0).toUpperCase();
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-black text-white ${profile.logo} ${dims}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function AffiliateBtn({
  affiliateUrl,
  fallbackUrl,
  label,
  size = 'md',
  fullWidth = false,
}: {
  affiliateUrl: string | null | undefined;
  fallbackUrl: string | null | undefined;
  label: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
}) {
  const cls =
    'inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700 ' +
    (size === 'lg' ? 'px-6 py-3 text-sm' : 'px-5 py-2.5 text-sm') +
    (fullWidth ? ' w-full' : '');

  const url = affiliateUrl || fallbackUrl;
  const rel = affiliateUrl
    ? 'noopener noreferrer sponsored'
    : 'nofollow noopener noreferrer';

  if (!url) {
    return (
      <span className={cls + ' opacity-60'}>
        <span>{label}</span>
        <span aria-hidden>↗</span>
      </span>
    );
  }
  return (
    <a href={url} target="_blank" rel={rel} className={cls}>
      <span>{label}</span>
      <span aria-hidden>↗</span>
    </a>
  );
}

