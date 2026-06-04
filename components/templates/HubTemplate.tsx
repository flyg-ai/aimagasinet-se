import Link from 'next/link';
import type { ArticleCardData } from '@/components/ArticleCard';
import { JsonLd } from '@/components/JsonLd';
import { FaqAccordion } from '@/components/FaqAccordion';
import { toolNameFromTitle, type Rating } from '@/lib/rating';
import type { Article } from '@/lib/supabase';
import { YRKE_HUB_KNOWN } from '@/lib/yrke-tools';
import { YRKES_HUB_KNOWN } from '@/lib/yrkes-hub-tools';
import { YRKES_HUB_KNOWN_EXTRA } from '@/lib/yrkes-hub-tools-extra';
import { CATEGORY_HUB_REVIEW_KNOWN } from '@/lib/category-hub-tools';
import { CRM_REVIEW_KNOWN } from '@/lib/crm-tools';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schemas';

export type HubChild = ArticleCardData & {
  rating: Rating | null;
  /** Set on virtual children (no DB article yet) — replaces "Läs recension"
   *  link with a "Recension snart" badge in RankRow. */
  isUpcoming?: boolean;
  /** Full article body — used by ReviewsSection to extract an analysis
   *  snippet. Always present for DB-backed children; null for virtuals. */
  content_mdx?: string | null;
};

const SE_MONTHS = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
];

/* ─── Mock data palette ─────────────────────────────────────────── */

const LOGO_COLORS = [
  'bg-emerald-500',
  'bg-orange-500',
  'bg-sky-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-fuchsia-500',
  'bg-lime-600',
];

const GENERIC_TAGS = [
  '40+ mallar', '30+ språk', 'Enkelt UI', 'API', 'Multimodal',
  'Workspace', 'Browser-app', 'Mobil', 'Snabb', 'Billigast pro',
  'EU-data', 'Open source', 'Live web',
];

const GENERIC_PROS = [
  'Snabb och korrekt', 'Bra svenska', 'Stort ekosystem', 'Enkelt UI',
  'Långt kontextfönster', 'Konkurrenskraftigt pris', 'Stabilt API',
  'Aktiv utveckling', 'Bra dokumentation',
];

const GENERIC_CONS = [
  'Begränsningar i gratisläget', 'Knapphändig källhantering',
  'Inget API i bas-planen', 'Kan halucinera ibland',
  'Lite för dyrt för småteam', 'Färre integrationer',
  'Saknar svensk support',
];

const GENERIC_OFFERS: { title: string; price: string; bestFor: string }[] = [
  { title: '7 dagars premium gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Allt-i-ett textproduktion' },
  { title: '200k token kontext gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Långa dokument' },
  { title: '10K ord gratis varje månad', price: 'Gratis · Unlimited 9 USD/mån', bestFor: 'Frilansare med tight budget' },
  { title: '14 dagars premium', price: 'Gratis · Pro 25 USD/mån', bestFor: 'Marknadsföring' },
  { title: 'Studentrabatt 50%', price: 'Gratis · Premium 10 USD/mån', bestFor: 'Studenter' },
];

const SNABBVAL_LABELS = [
  'Bäst totalt',
  'Bäst för långform',
  'Bäst i EU',
  'Bäst för research',
  'Bäst för företag',
  'Bästa pris',
];

const RANK_LABELS = [
  'Redaktionens val',
  'Bäst för långform',
  'Bästa nybörjarvalet',
  'Bäst för team',
  'Mest värde för pengarna',
  'Snabbast i test',
  'Bäst för svenska',
  'Bästa gratisversionen',
];

/** Curated profiles for well-known tools. Falls back to deterministic mock.
 *  Yrke-topic tools are merged in from lib/yrke-tools.ts at module load. */
const KNOWN: Record<string, Partial<ToolProfile>> = {
  // Category-hub tools (hemsidebyggare, presentationer, mötesverktyg, …) only
  // have a *review* profile — without this, their hub topplista cards fall
  // through to the generic mock and, crucially, get no fallbackUrl, so the
  // "Prova X"-CTA renders as a dead <span> (see CtaButton). ReviewProfile and
  // ToolProfile share the fields buildProfile reads (logo/tags/pros/cons/offer/
  // label/ctaName/score/fallbackUrl/tagline); the rest is ignored. Listed
  // first so any hub-specific profile below wins on a slug collision.
  ...(CATEGORY_HUB_REVIEW_KNOWN as Record<string, Partial<ToolProfile>>),
  ...(CRM_REVIEW_KNOWN as Record<string, Partial<ToolProfile>>),
  ...YRKE_HUB_KNOWN,
  ...YRKES_HUB_KNOWN,
  ...YRKES_HUB_KNOWN_EXTRA,
  chatgpt: {
    logo: 'bg-emerald-500',
    ctaName: 'ChatGPT',
    fallbackUrl: 'https://chat.openai.com',
    tagline: 'Allround AI för text, kod och analys',
    tags: ['GPT-5', 'Custom GPTs', 'Canvas', 'Röst & syn'],
    pros: ['Snabb och korrekt', 'Stort ekosystem av GPTs', 'Bäst röstläge'],
    cons: ['Knapphändig källhantering', 'Begränsningar i gratisläget'],
    offer: { title: 'Plus-läge gratis i 7 dagar', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Allt-i-ett textproduktion' },
    label: 'Redaktionens val',
  },
  claude: {
    logo: 'bg-orange-500',
    ctaName: 'Claude',
    fallbackUrl: 'https://claude.ai',
    tagline: 'Bäst på långform, kod och nyanserat resonemang',
    tags: ['Claude 4 Opus', 'Projects', 'Artifacts', '200k context'],
    pros: ['Bäst på långform', 'Säker källhantering', 'Skarp på nyans'],
    cons: ['Långsammare än GPT', 'Dyrare per token'],
    offer: { title: '200k token kontext gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Långa dokument och nyans' },
    label: 'Bäst för långform',
  },
  gemini: {
    logo: 'bg-sky-500',
    ctaName: 'Gemini',
    fallbackUrl: 'https://gemini.google.com',
    tagline: 'Googles multimodala AI med enorm kontext',
    tags: ['Gemini 2.5 Pro', '1M context', 'Workspace', 'Multimodal'],
    pros: ['Enorm kontext', 'Integrerat med Google', 'Stark på multimodal'],
    cons: ['Ojämn svenska', 'Beroende av Google-konto'],
    offer: { title: 'Gemini Advanced 2 mån gratis', price: 'Gratis · Advanced 22 USD/mån', bestFor: 'Workspace-användare' },
    label: 'Bäst för stora dokument',
  },
  mistral: {
    logo: 'bg-violet-500',
    ctaName: 'Mistral',
    fallbackUrl: 'https://chat.mistral.ai',
    tags: ['Le Chat', 'EU-data', 'Open source', 'Mixtral'],
    pros: ['Helt EU-baserat', 'Snabbt och billigt', 'Bra svenska'],
    cons: ['Mindre ekosystem', 'Färre integrationer'],
    offer: { title: 'Le Chat Pro 30 dagar gratis', price: 'Gratis · Pro 15 EUR/mån', bestFor: 'EU-företag och dataskydd' },
    label: 'Bäst i EU',
  },
  perplexity: {
    logo: 'bg-teal-500',
    ctaName: 'Perplexity',
    fallbackUrl: 'https://www.perplexity.ai',
    tags: ['Källor inbyggt', 'Pages', 'Research', 'Live web'],
    pros: ['Källor på allt', 'Snabb research-flöde', 'Citerar korrekt'],
    cons: ['Smalare användning', 'Pro krävs för långt'],
    offer: { title: 'Perplexity Pro 1 mån gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Research och journalistik' },
    label: 'Bäst för research',
  },
  copilot: {
    logo: 'bg-indigo-500',
    ctaName: 'Copilot',
    fallbackUrl: 'https://copilot.microsoft.com',
    tags: ['GPT-5', 'Microsoft 365', 'Word & Excel', 'Enterprise'],
    pros: ['Integrerat i Office', 'Bra för team', 'Säkerhet i fokus'],
    cons: ['Kräver M365-licens', 'Sämre i webb-UI'],
    offer: { title: 'Copilot Pro 30 dagar gratis', price: 'Gratis · Pro 22 USD/mån', bestFor: 'Microsoft-företag' },
    label: 'Bäst för företag',
  },
  rytr: {
    logo: 'bg-rose-500',
    ctaName: 'Rytr',
    fallbackUrl: 'https://rytr.me',
    tags: ['40+ mallar', '30+ språk', 'Enkelt UI', 'Billigast pro'],
    pros: ['Lågt pris', 'Många mallar', 'Lätt att lära sig'],
    cons: ['Modellen är inte topp', 'Begränsad kontext'],
    offer: { title: '10K ord gratis varje månad', price: 'Gratis · Unlimited 9 USD/mån', bestFor: 'Frilansare med tight budget' },
    label: 'Bästa nybörjarvalet',
  },
  deepseek: {
    logo: 'bg-fuchsia-500',
    ctaName: 'DeepSeek',
    fallbackUrl: 'https://www.deepseek.com',
    tags: ['V3', 'Open source', 'Lågt pris', 'API'],
    pros: ['Extremt billigt', 'Open source-vikter', 'Bra på kod'],
    cons: ['Svensk dialog svagare', 'Mindre community'],
    offer: { title: 'API-credits 5 USD gratis', price: 'Gratis · API 0.2 USD/M tokens', bestFor: 'Utvecklare som vill skala' },
    label: 'Bästa pris',
  },
  'jasper-ai': {
    logo: 'bg-amber-500',
    ctaName: 'Jasper AI',
    fallbackUrl: 'https://www.jasper.ai',
    tagline: 'AI-copy med konsistent brand voice',
    tags: ['Brand Voice', 'SEO-mode', 'Templates', 'Teams'],
    pros: ['Konsistent brand voice', 'Många mallar', 'Bra för team'],
    cons: ['Högre pris', 'Smal modell-grund'],
    offer: { title: 'Jasper 7 dagar gratis', price: 'Gratis · Creator 49 USD/mån', bestFor: 'Marknadsföring' },
    label: 'Bäst för marknadsföring',
  },
  writesonic: {
    logo: 'bg-violet-500',
    ctaName: 'Writesonic',
    fallbackUrl: 'https://writesonic.com',
    tagline: 'Snabb AI-copy med SEO-läge',
    tags: ['SEO mode', 'Bulk', 'Chatsonic', 'API'],
    pros: ['Snabb', 'Bra pris', 'Bulk-funktion för SEO'],
    cons: ['Svenska är ojämn', 'Mindre nyans i text'],
    offer: { title: 'Gratisplan med 10k ord/mån', price: 'Gratis · Pro 16 USD/mån', bestFor: 'SEO och snabb copy' },
    label: 'Bäst för SEO',
  },
  'copy-ai': {
    logo: 'bg-rose-500',
    ctaName: 'Copy.ai',
    fallbackUrl: 'https://www.copy.ai',
    tagline: 'AI-workflows för säljteam och sociala medier',
    tags: ['Workflows', 'Templates', 'Brand voice', 'API'],
    pros: ['Många mallar', 'Workflows-automation', 'Lågt instegspris'],
    cons: ['Begränsad svenska', 'Mindre kraftfull modell'],
    offer: { title: 'Free forever-plan', price: 'Gratis · Pro 36 USD/mån', bestFor: 'Säljteam och social media' },
    label: 'Bäst för säljteam',
  },

  /* ── Automation (editorial article, not a single tool) ── */
  workflows: {
    logo: 'bg-violet-600',
    ctaName: 'Zapier',
    fallbackUrl: 'https://zapier.com',
    tagline: 'AI-workflows: jämför Zapier, Make och n8n',
    tags: ['Översikt', 'Workflows', 'Integration', 'No-code'],
    pros: ['Bred jämförelse', 'Konkreta exempel', 'Pratisk guide'],
    cons: ['Inte en enskild produkt', 'Generell översikt'],
    offer: { title: 'Zapier 14 dagar Pro gratis', price: 'Gratis · Starter 20 USD/mån', bestFor: 'Workflows mellan SaaS-verktyg' },
    label: 'Översikt',
  },

  /* ── Video ────────────────────────────────────────────── */
  'kling-ai': {
    logo: 'bg-red-500',
    ctaName: 'Kling',
    score: 9.4,
    fallbackUrl: 'https://klingai.com',
    tagline: 'Realistisk AI-video från text eller bild',
    tags: ['Kling 1.6', 'Realism', 'Lip sync', 'Image-to-video'],
    pros: ['Marknadens mest realistiska video', 'Lång clip-längd', 'Stark image-to-video'],
    cons: ['Engelska prompts ojämn', 'Mindre community utanför Kina'],
    offer: { title: 'Gratis begränsad', price: 'Gratis · Pro ~10 USD/mån', bestFor: 'Realistisk AI-video' },
    label: 'Redaktionens val',
  },
  'runway-gen-3': {
    logo: 'bg-fuchsia-600',
    ctaName: 'Runway',
    score: 9.1,
    fallbackUrl: 'https://runwayml.com',
    tagline: 'Video, redigering och effekter i ett',
    tags: ['Gen-3 Alpha', 'Redigering', 'Effekter', 'Image-to-video'],
    pros: ['Inbyggd redigeringsstudio', 'Avancerad kamerakontroll', 'Brett ekosystem av effekter'],
    cons: ['Dyrt för längre projekt', 'Mindre stark på text-i-bild'],
    offer: { title: 'Basic gratis', price: 'Gratis · Standard 15 USD/mån', bestFor: 'Video, redigering och effekter' },
    label: 'Bäst för redigering & effekter',
  },
  'pika-labs': {
    logo: 'bg-pink-500',
    ctaName: 'Pika Labs',
    score: 8.7,
    fallbackUrl: 'https://pika.art',
    tagline: 'Snabb text- och bild-till-video',
    tags: ['Pika 2.0', 'Text/bild → video', 'Pikaffects', 'Lip sync'],
    pros: ['Snabbaste i klassen', 'Roliga effekter (Pikaffects)', 'Lågt pris för premium'],
    cons: ['Mindre filmisk än Runway/Sora', 'Kortare clip-längd'],
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Pro 8 USD/mån', bestFor: 'Text- och bild-till-video' },
    label: 'Bästa pris-prestanda',
  },
  'sora-2': {
    logo: 'bg-zinc-900',
    ctaName: 'Sora',
    score: 8.2,
    fallbackUrl: 'https://chatgpt.com',
    tags: ['Sora 2', 'Text-till-video', '20s clips', 'Multi-shot'],
    pros: ['Branschens skarpaste video-AI när tillgänglig', 'Multi-shot storytelling', 'Konsistenta karaktärer'],
    cons: ['sora.com nedlagt — endast via ChatGPT', 'Begränsad åtkomst för svenska användare'],
    offer: { title: 'Begränsad åtkomst', price: 'Endast via ChatGPT Plus 20 USD/mån', bestFor: 'AI-genererad video från text' },
    label: 'Begränsad tillgång',
  },

  /* ── Ljud / musik ─────────────────────────────────────── */
  'suno-ai': {
    logo: 'bg-amber-600',
    ctaName: 'Suno',
    score: 9.2,
    fallbackUrl: 'https://suno.com',
    tagline: 'Skapa komplett musik från en textprompt',
    tags: ['V4', 'Custom lyrics', '4 min spår', 'Stems-export'],
    pros: ['Snabbast i klassen', 'Bra på lyrik', 'Stems för efterproduktion'],
    cons: ['Mindre nyans än Udio', 'Kommersiella rättigheter kräver Pro'],
    offer: { title: '50 spår gratis varje månad', price: 'Gratis · Pro 8 USD/mån', bestFor: 'Musik från text' },
    label: 'Redaktionens val',
  },
  elevenlabs: {
    logo: 'bg-zinc-900',
    ctaName: 'ElevenLabs',
    score: 9.5,
    fallbackUrl: 'https://elevenlabs.io',
    tagline: 'Världsledande röstsyntes på 30+ språk',
    tags: ['v3', 'Voice clone', '32 språk', 'Dubbing'],
    pros: ['Marknadens mest naturliga röster', 'Stark voice cloning', 'Utmärkt svenska'],
    cons: ['Pris skalar snabbt', 'Voice cloning kräver verifiering'],
    offer: { title: '10k tecken gratis varje månad', price: 'Gratis · Starter 5 USD/mån', bestFor: 'Röstsyntes & text-till-tal' },
    label: 'Bäst för röst',
  },

  /* ── Kod ──────────────────────────────────────────────── */
  'cursor-ai': {
    logo: 'bg-zinc-900',
    ctaName: 'Cursor',
    score: 9.5,
    fallbackUrl: 'https://cursor.com',
    tagline: 'AI-first kodeditor som förstår hela din kodbas',
    tags: ['Composer', 'Tab', 'Multi-file edits', 'MCP'],
    pros: ['Branschens skarpaste AI-editor', 'Bra context-hantering', 'Stöd för flera modeller'],
    cons: ['Pris högt för soloutvecklare', 'Bara desktop'],
    offer: { title: '14 dagar Pro gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Daglig professionell kodning' },
    label: 'Redaktionens val',
  },
  'github-copilot': {
    logo: 'bg-indigo-700',
    ctaName: 'Copilot',
    score: 9.1,
    fallbackUrl: 'https://github.com/features/copilot',
    tagline: 'AI-assistent direkt i din editor',
    tags: ['Inline', 'Chat', 'PR review', 'Enterprise'],
    pros: ['Bred IDE-integration', 'Bästa enterprise-stödet', 'Konkurrenskraftigt pris'],
    cons: ['Mindre agentisk än Cursor', 'Subtila skillnader på modeller'],
    offer: { title: 'Free tier för individer', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Team och enterprise' },
    label: 'Bäst för team',
  },
};

type ToolProfile = {
  logo: string;
  imageUrl: string | null;
  initial: string;
  tags: string[];
  pros: string[];
  cons: string[];
  offer: { title: string; price: string; bestFor: string };
  label: string;
  /** Brand name for CTA buttons (e.g. "Prova Kling"). Falls back to
   *  toolNameFromTitle(child.title) when not set. */
  ctaName?: string;
  /** Curated score override for topplistan. Wins over parseRating + seed mock. */
  score?: number;
  /** Direct external URL used when articles.affiliate_url is NULL. Rendered
   *  with rel="nofollow noopener" (not "sponsored") since it's an editorial
   *  reference, not an affiliate placement. */
  fallbackUrl?: string;
  /** Short editorial one-liner (≤ 60 chars) used in RankRow as the verktyg's
   *  description. Wins over article.excerpt, which often starts with
   *  WP-injected metadata like "RECENSION • AI-VERKTYG FÖR KOD …". */
  tagline?: string;
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
    if (!used.has(idx)) {
      used.add(idx);
      out.push(arr[idx]);
    }
  }
  return out;
}

function lookupKnown(name: string): Partial<ToolProfile> | null {
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(KNOWN)) {
    if (k.includes(key)) return val;
  }
  return null;
}

function lookupKnownBySlug(slug: string): Partial<ToolProfile> | null {
  return KNOWN[slug] ?? VIRTUAL_KNOWN[slug] ?? null;
}

function buildProfile(child: HubChild): ToolProfile {
  const name = toolNameFromTitle(child.title);
  const h = seed(child.slug);
  // Prefer slug-keyed exact match (more reliable than fuzzy name match for
  // tools like 'kling-ai' where name="Kling" but key="kling-ai").
  const known = lookupKnownBySlug(child.slug) ?? lookupKnown(name) ?? {};
  return {
    logo: known.logo ?? LOGO_COLORS[h % LOGO_COLORS.length],
    imageUrl: child.featured_image ?? null,
    initial: name.charAt(0).toUpperCase() || '?',
    tags: known.tags ?? pickN(GENERIC_TAGS, 3, h),
    pros: known.pros ?? pickN(GENERIC_PROS, 3, h),
    cons: known.cons ?? pickN(GENERIC_CONS, 2, h ^ 0x55),
    offer: known.offer ?? GENERIC_OFFERS[h % GENERIC_OFFERS.length],
    label: known.label ?? RANK_LABELS[h % RANK_LABELS.length],
    ctaName: known.ctaName,
    score: known.score,
    fallbackUrl: known.fallbackUrl,
    tagline: known.tagline,
  };
}

/** Strip WP-injected eyebrow/nav prefixes from an excerpt and cap at 60 chars.
 *  WP imports often start with patterns like "RECENSION • AI-VERKTYG FÖR KOD
 *  Hoppa till kort summering …" — strip the full eyebrow + jump-link, then
 *  truncate. The "Hoppa till X" anchor is treated as a few lowercase Swedish
 *  words so we don't accidentally swallow the real sentence that follows. */
function cleanExcerpt(excerpt: string | null | undefined): string | null {
  if (!excerpt) return null;
  let s = excerpt.trim();
  // 1. Strip "[eyebrow…] Hoppa till [lowercase anchor words]" — anything from
  //    string-start through the jump-link. No /i flag: with it, [a-zåäö]
  //    becomes case-insensitive and swallows the real sentence after the anchor.
  s = s.replace(/^.*?Hoppa till(?:\s+[a-zåäö]+)+\.?\s*/, '');
  // 2. Strip leading WP category eyebrow ("RECENSION • CATEGORY [★ rating]")
  //    up to the first sentence-cased Swedish word. Allows any noise chars
  //    (stars, parens, numbers) between the keyword and the real sentence.
  //    Capped at 100 chars so it can't swallow a real paragraph.
  s = s.replace(
    /^(?:RECENSION|GUIDE|ANALYS|TEST|JÄMFÖRELSE)\b.{0,100}?(?=[A-ZÅÄÖ][a-zåäö])/,
    ''
  );
  // 3. Strip any remaining leading all-caps eyebrow ("AI ÄR FRAMTIDEN — ").
  s = s.replace(/^[A-ZÅÄÖ0-9\s•·:|–—-]+?(?=[A-ZÅÄÖ][a-zåäö])/, '');
  s = s.trim();
  if (s.length > 60) s = s.slice(0, 57).trimEnd() + '…';
  return s || null;
}

function getRating(child: HubChild): Rating {
  // Curated KNOWN.score wins (editorial control); else parsed; else seed mock.
  const known = lookupKnownBySlug(child.slug) ?? lookupKnown(toolNameFromTitle(child.title));
  if (known?.score != null) return { score: known.score, max: 10 };
  if (child.rating) return child.rating;
  const h = seed(child.slug);
  const score = 7.4 + ((h % 23) * 0.1);
  return { score: Math.round(score * 10) / 10, max: 10 };
}

function highlightTitle(title: string) {
  // Color the last word containing "verktyg" (case-insensitive) in indigo.
  const tokens = title.split(/(\s+)/);
  let idxToColor = -1;
  for (let i = tokens.length - 1; i >= 0; i--) {
    if (/verktyg/i.test(tokens[i])) { idxToColor = i; break; }
  }
  return tokens.map((t, i) =>
    i === idxToColor
      ? <span key={i} className="text-indigo-600">{t}</span>
      : <span key={i}>{t}</span>
  );
}

function currentMonthLabel(): string {
  const d = new Date();
  return `${SE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─── Virtual children (tools without their own DB article yet) ─
   Rendered in the topplistan with mock data and a "Recension snart" badge
   replacing the "Läs recension" link. Add real DB articles to remove a
   tool from here and let it flow through getHubChildren() normally. */

const VIRTUAL_HUB_CHILDREN: Record<string, HubChild[]> = {
  // ai-video + ai-ljud-och-musik virtuals promoted to real DB articles —
  // see scripts/seed-video-audio-reviews.ts. Their curated topplista profiles
  // live in VIRTUAL_KNOWN under the non-suffixed slugs (heygen, synthesia,
  // luma-dream-machine, invideo, adobe-firefly-video, kaiber, udio, mubert,
  // aiva, soundraw, boomy, splice, lalal-ai, adobe-podcast) so the ranking
  // keeps editorial scores when fetching from the DB.

  // ai-kod-verktyg + ai-automation virtuals promoted to real DB articles —
  // see scripts/create-reviews.ts. VIRTUAL_KNOWN entries kept under their
  // new (non-suffixed) slugs so the hub topplistan still gets curated
  // profiles when fetching from the DB.

  // /ai-verktyg/gratis/ — gratis-tier AI tools, ranked. Tools with an
  // existing review elsewhere link to it (path=full URL, isUpcoming=
  // false); tools without a dedicated page are shown as "Recension
  // snart" placeholders so visitors at least see what exists in the
  // free-tier landscape.
  'gratis': [
    {
      slug: 'chatgpt-gratis', title: 'ChatGPT',
      path: '/ai-verktyg/ai-text-verktyg/chatgpt',
      excerpt: 'OpenAIs flaggskepp — gratisversionen ger GPT-5 light, custom GPTs och bilduppladdning. Full access kräver Plus.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null,
    },
    {
      slug: 'claude-gratis', title: 'Claude',
      path: '/ai-verktyg/ai-text-verktyg/claude',
      excerpt: 'Anthropics Claude med gratis tier — bästa skrivkvaliteten av de fria modellerna, generös kontext.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null,
    },
    {
      slug: 'gemini-gratis', title: 'Gemini',
      path: '/ai-verktyg/ai-text-verktyg/gemini',
      excerpt: 'Googles Gemini med gratis access till 2.5 Flash + integration med Gmail, Docs och Drive.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null,
    },
    {
      slug: 'deepseek-gratis', title: 'DeepSeek',
      path: '#',
      excerpt: 'Kinesisk open-weight-modell som matchar GPT-4 på många benchmarks — helt gratis i webbchatten.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'perplexity-gratis', title: 'Perplexity',
      path: '#',
      excerpt: 'Sök-assistent som citerar källor — gratisversionen täcker de flesta vardagsfrågorna.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'mistral-gratis', title: 'Mistral Le Chat',
      path: '#',
      excerpt: 'Europeisk modell med snabb svensk-kunskap — gratis chat med Mistral Large i webbinterfacet.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'copilot-gratis', title: 'Microsoft Copilot',
      path: '#',
      excerpt: 'Microsofts Bing-integrerade Copilot — gratis access till GPT-4-class + DALL-E 3 i webben.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'stable-diffusion-gratis', title: 'Stable Diffusion',
      path: '/ai-verktyg/ai-bild-verktyg/stable-diffusion',
      excerpt: 'Open-source-bildmodellen som du kör helt gratis lokalt — eller via gratis webb-UI som ComfyUI.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null,
    },
    {
      slug: 'suno-gratis', title: 'Suno AI',
      path: '/ai-verktyg/ai-ljud-och-musik/suno-ai',
      excerpt: 'AI-musikgenerator med 10 gratis krediter per dag — fungerar för testning och experimentell musik.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null,
    },
    {
      slug: 'leonardo-gratis', title: 'Leonardo AI',
      path: '#',
      excerpt: 'Stable Diffusion-baserad bildgenerator med 150 gratis tokens per dag — bra för småprojekt.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
  ],
};

// Extend KNOWN profiles with scores/labels/CTA-names for the virtual children
// so they sort and render consistently with curated real tools.
const VIRTUAL_KNOWN: Record<string, Partial<ToolProfile>> = {
  heygen: {
    logo: 'bg-purple-600', ctaName: 'HeyGen', score: 8.7,
    fallbackUrl: 'https://www.heygen.com',
    tags: ['Avatarer', 'Företag', '40+ språk', 'Talking heads'],
    pros: ['Realistiska avatarer', 'Bred språkstöd', 'Stark för säljvideo'],
    cons: ['Smalt användningsområde', 'Pris hoppar snabbt'],
    offer: { title: 'Gratis 3 min/månad', price: 'Gratis · Creator 29 USD/mån', bestFor: 'AI-avatarer för företag' },
    label: 'Bäst för avatarer',
  },
  synthesia: {
    logo: 'bg-blue-600', ctaName: 'Synthesia', score: 8.5,
    fallbackUrl: 'https://www.synthesia.io',
    tags: ['230+ avatarer', '140 språk', 'L&D', 'Enterprise'],
    pros: ['Branschstandard för utbildning', 'Säker för enterprise', 'Massiv språkbredd'],
    cons: ['Dyrt för småteam', 'Mindre rörlig än konkurrenter'],
    offer: { title: '36 min gratis', price: 'Gratis · Starter 22 USD/mån', bestFor: 'AI-avatarer för utbildning' },
    label: 'Bäst för L&D',
  },
  'luma-dream-machine': {
    logo: 'bg-cyan-600', ctaName: 'Luma', score: 8.4,
    fallbackUrl: 'https://lumalabs.ai',
    tags: ['Dream Machine', 'Realism', 'Image-to-video', 'Genesis'],
    pros: ['Naturlig fysik och rörelse', 'Stark image-to-video', 'Bra pris'],
    cons: ['Kortare clips', 'Mindre stilkontroll'],
    offer: { title: '30 generationer gratis', price: 'Gratis · Standard 30 USD/mån', bestFor: 'Realistisk text-till-video' },
    label: 'Bäst för naturlig rörelse',
  },
  invideo: {
    logo: 'bg-orange-600', ctaName: 'InVideo', score: 8.0,
    fallbackUrl: 'https://invideo.io',
    tags: ['Sociala medier', 'TikTok/Reels', 'Mallar', 'AI-röster'],
    pros: ['Snabbt social media-flöde', '5000+ mallar', 'Inbyggda röster'],
    cons: ['Lägre kvalitet per generering', 'Vattenstämpel i gratis'],
    offer: { title: '4h video/månad gratis', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Social media-video i volym' },
    label: 'Bäst för social media',
  },
  'adobe-firefly-video': {
    logo: 'bg-rose-600', ctaName: 'Firefly Video', score: 7.8,
    fallbackUrl: 'https://firefly.adobe.com',
    tags: ['Adobe', 'Premiere Pro', 'Generative Extend', 'Kommersiellt säker'],
    pros: ['Inbyggt i Premiere Pro', 'Tränad på licensierat material', 'Bäst för pro-workflows'],
    cons: ['Kräver Creative Cloud', 'Mindre kraftfull stand-alone'],
    offer: { title: 'Ingår i Creative Cloud', price: 'CC 60 USD/mån', bestFor: 'Adobe-användare och pro-team' },
    label: 'Bäst för Creative Cloud',
  },
  kaiber: {
    logo: 'bg-amber-600', ctaName: 'Kaiber', score: 7.5,
    fallbackUrl: 'https://kaiber.ai',
    tags: ['Musikvideo', 'Beat sync', 'Animation', 'Artister'],
    pros: ['Synkar till musik', 'Konstnärlig estetik', 'Spotify-integration'],
    cons: ['Smalt användningsområde', 'Mindre realistisk'],
    offer: { title: '7 dagar Pro gratis', price: 'Gratis · Pro 15 USD/mån', bestFor: 'Musiker och artister' },
    label: 'Bäst för musikvideor',
  },

  /* ── Ljud & musik ─────────────────────────────────────── */
  udio: {
    logo: 'bg-rose-600', ctaName: 'Udio', score: 9.0,
    fallbackUrl: 'https://www.udio.com',
    tags: ['Musikalisk nyans', 'Lyrik-AI', 'Stems', 'Remix'],
    pros: ['Mer musikalisk realism än Suno', 'Stark på instrumental', 'Bra svensk text-stöd'],
    cons: ['Långsammare', 'Färre exportformat'],
    offer: { title: '10 spår gratis/dag', price: 'Gratis · Standard 10 USD/mån', bestFor: 'Musikproduktion med AI' },
    label: 'Bäst för musikalisk nyans',
  },
  mubert: {
    logo: 'bg-teal-600', ctaName: 'Mubert', score: 8.2,
    fallbackUrl: 'https://mubert.com',
    tags: ['Streaming', 'Royaltyfri', 'Realtid', 'API'],
    pros: ['Oändlig bakgrundsmusik', 'Royaltyfri för creators', 'API för utvecklare'],
    cons: ['Mindre konstnärlig kontroll', 'Smal nyttighet'],
    offer: { title: 'Gratis för personligt bruk', price: 'Gratis · Creator 14 USD/mån', bestFor: 'Streamers och content-creators' },
    label: 'Bäst för bakgrundsmusik',
  },
  aiva: {
    logo: 'bg-indigo-600', ctaName: 'AIVA', score: 8.5,
    fallbackUrl: 'https://www.aiva.ai',
    tags: ['Filmmusik', 'MIDI-export', 'Klassiskt', 'Spel'],
    pros: ['Exporterar noter och MIDI', 'Klassisk musikteori', 'Bra för film & spel'],
    cons: ['Lägre kvalitet på populärmusik', 'Mindre intuitivt UI'],
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Standard 15 EUR/mån', bestFor: 'Film-, spel- och klassisk musik' },
    label: 'Bäst för kompositörer',
  },
  soundraw: {
    logo: 'bg-emerald-600', ctaName: 'Soundraw', score: 8.0,
    fallbackUrl: 'https://soundraw.io',
    tags: ['Royaltyfri', 'Anpassningsbar', 'Stems', 'Mood-baserad'],
    pros: ['Granulär anpassning per spår', 'Stems-export', 'Royaltyfri kommersiellt'],
    cons: ['Begränsad stilbredd', 'Vattenstämpel i gratis'],
    offer: { title: 'Gratis preview', price: 'Creator 17 USD/mån', bestFor: 'YouTube-creators och reklam' },
    label: 'Bäst för YouTubers',
  },
  boomy: {
    logo: 'bg-fuchsia-600', ctaName: 'Boomy', score: 7.4,
    fallbackUrl: 'https://boomy.com',
    tags: ['1-klick', 'Spotify-release', 'Royaltyandel', 'Enkelt'],
    pros: ['Snabbast att komma igång', 'Publicera till streaming-tjänster', 'Tjäna royalty'],
    cons: ['Begränsad kontroll', 'Lägre produktionskvalitet'],
    offer: { title: '25 låtar gratis', price: 'Gratis · Creator 10 USD/mån', bestFor: 'Snabb publicering till streaming' },
    label: 'Bäst för nybörjare',
  },
  splice: {
    logo: 'bg-orange-600', ctaName: 'Splice', score: 8.3,
    fallbackUrl: 'https://splice.com',
    tags: ['Samples', 'AI-sökning', 'Stems-separation', 'Producenter'],
    pros: ['Miljontals samples', 'AI hittar matchande loops', 'Producent-favorit'],
    cons: ['Kräver DAW-kunskap', 'Inte gen-AI för hela låtar'],
    offer: { title: 'Sample-bibliotek från 8 USD/mån', price: 'Creator 8 USD/mån', bestFor: 'Musikproducenter' },
    label: 'Bäst för producenter',
  },
  'lalal-ai': {
    logo: 'bg-sky-600', ctaName: 'Lalal.ai', score: 8.7,
    fallbackUrl: 'https://www.lalal.ai',
    tags: ['Stems-separation', 'Vocal isolation', 'Karaoke', 'API'],
    pros: ['Marknadsledande separation', 'Snabb', 'Stöd för 10+ stems'],
    cons: ['Smalt användningsområde', 'Begränsade minuter i gratis'],
    offer: { title: '10 min gratis/månad', price: 'Gratis · Lite 9 USD/mån', bestFor: 'Karaoke, remix och stems' },
    label: 'Bäst för stems-separation',
  },
  'adobe-podcast': {
    logo: 'bg-rose-700', ctaName: 'Adobe Podcast', score: 8.6,
    fallbackUrl: 'https://podcast.adobe.com',
    tags: ['AI Enhance', 'Brusreducering', 'Gratis', 'Webb'],
    pros: ['Studio-kvalitet i webbläsaren', 'Helt gratis', 'Adobe-kvalitet'],
    cons: ['Endast röstförbättring', 'Köbaserat vid hög belastning'],
    offer: { title: 'Helt gratis', price: 'Gratis · ingår i Creative Cloud', bestFor: 'Podcasters och röstinspelning' },
    label: 'Bäst gratis-verktyget',
  },

  /* ── Kod ──────────────────────────────────────────────── */
  tabnine: {
    logo: 'bg-slate-700', ctaName: 'Tabnine', score: 8.4,
    fallbackUrl: 'https://www.tabnine.com',
    tags: ['Privacy-first', 'On-prem', 'Enterprise', 'Lokal modell'],
    pros: ['Kan köras lokalt eller on-prem', 'Strikt privacy', 'Enterprise-fokus'],
    cons: ['Mindre kraftfull än Cursor/Copilot', 'Lägre modell-kvalitet'],
    offer: { title: 'Gratis Basic', price: 'Gratis · Pro 12 USD/mån', bestFor: 'Enterprise med strikta datakrav' },
    label: 'Bäst för privacy',
  },
  codeium: {
    logo: 'bg-emerald-700', ctaName: 'Codeium', score: 8.6,
    fallbackUrl: 'https://codeium.com',
    tags: ['Gratis', '70+ språk', '40+ IDE:er', 'Autocomplete'],
    pros: ['Generös gratisversion', 'Brett språkstöd', 'Snabb autocomplete'],
    cons: ['Mindre agentisk', 'Pro-features är begränsade'],
    offer: { title: 'Helt gratis för individer', price: 'Gratis · Teams 12 USD/mån', bestFor: 'Soloutvecklare och hobbyprojekt' },
    label: 'Bäst gratis',
  },
  'amazon-codewhisperer': {
    logo: 'bg-orange-700', ctaName: 'CodeWhisperer', score: 8.0,
    fallbackUrl: 'https://aws.amazon.com/codewhisperer/',
    tags: ['AWS', 'Security scan', 'Gratis individuell', 'Q Developer'],
    pros: ['AWS-optimerad', 'Inbyggd security scan', 'Gratis för enskilda'],
    cons: ['AWS-bias i förslag', 'Mindre stark utanför AWS'],
    offer: { title: 'Gratis för individer', price: 'Gratis · Pro 19 USD/mån', bestFor: 'AWS-utvecklare' },
    label: 'Bäst för AWS-stack',
  },
  'replit-ai': {
    logo: 'bg-orange-500', ctaName: 'Replit AI', score: 8.3,
    fallbackUrl: 'https://replit.com',
    tags: ['Browser-IDE', 'Agent', 'Deploy', 'Nybörjarvänligt'],
    pros: ['Bygg och deploya i webbläsaren', 'Agent-funktion', 'Lätt att komma igång'],
    cons: ['Begränsat för stora projekt', 'Pris skalar snabbt'],
    offer: { title: 'Gratisplan', price: 'Gratis · Core 25 USD/mån', bestFor: 'Prototyper och nybörjare' },
    label: 'Bäst för prototyper',
  },
  'jetbrains-ai': {
    logo: 'bg-violet-700', ctaName: 'JetBrains AI', score: 8.7,
    fallbackUrl: 'https://www.jetbrains.com/ai/',
    tags: ['IntelliJ', 'PyCharm', 'WebStorm', 'JetBrains-integration'],
    pros: ['Djup IDE-integration', 'Bra refactoring', 'Skarp för JVM-språk'],
    cons: ['Kräver JetBrains-licens', 'Bara i JetBrains-editorer'],
    offer: { title: '7 dagar gratis', price: 'AI Pro 10 USD/mån', bestFor: 'JetBrains-användare' },
    label: 'Bäst för JetBrains',
  },
  'sourcegraph-cody': {
    logo: 'bg-fuchsia-700', ctaName: 'Cody', score: 8.5,
    fallbackUrl: 'https://sourcegraph.com/cody',
    tags: ['Hela kodbasen', 'Cross-file', 'Enterprise', 'Code search'],
    pros: ['Bäst på stora kodbaser', 'Cross-file kontext', 'Enterprise-säkerhet'],
    cons: ['Setup-tid för enterprise', 'Mindre snabbt än Copilot'],
    offer: { title: 'Gratis Free-plan', price: 'Gratis · Pro 9 USD/mån', bestFor: 'Stora monorepos' },
    label: 'Bäst för stora repos',
  },
  pieces: {
    logo: 'bg-teal-700', ctaName: 'Pieces', score: 7.8,
    fallbackUrl: 'https://pieces.app',
    tags: ['Snippet-minne', 'Lokal AI', 'Kontext', 'Cross-app'],
    pros: ['Lokal AI för privacy', 'Minne över sessioner', 'Cross-app-snippet-hantering'],
    cons: ['Smalt användningsområde', 'Tidig produkt'],
    offer: { title: 'Helt gratis', price: 'Gratis · Pro kommer', bestFor: 'Snippets och AI-kontext' },
    label: 'Bäst för snippets',
  },
  windsurf: {
    logo: 'bg-cyan-700', ctaName: 'Windsurf', score: 8.9,
    fallbackUrl: 'https://codeium.com/windsurf',
    tagline: 'Agentisk kodeditor för komplexa flows',
    tags: ['Agent', 'Multi-file', 'Cascade', 'Flow-mode'],
    pros: ['Cursor-rival med flow-fokus', 'Stark agent-mode', 'Snabb autonom redigering'],
    cons: ['Nyare än Cursor', 'Mindre community ännu'],
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Pro 15 USD/mån', bestFor: 'Agentisk kodning' },
    label: 'Bäst utmanare',
  },

  /* ── Automation ───────────────────────────────────────── */
  make: {
    logo: 'bg-violet-600', ctaName: 'Make', score: 9.0,
    fallbackUrl: 'https://www.make.com',
    tags: ['Visuell builder', 'Komplexa flöden', 'AI-moduler', 'Webhooks'],
    pros: ['Mest kraftfulla visuella builder', 'Stöd för komplex logik', 'Bra prismodell'],
    cons: ['Brantare inlärningskurva', 'Färre integrationer än Zapier'],
    offer: { title: '1000 operationer gratis', price: 'Gratis · Core 9 USD/mån', bestFor: 'Komplexa automationsflöden' },
    label: 'Redaktionens val',
  },
  'zapier-ai': {
    logo: 'bg-orange-600', ctaName: 'Zapier', score: 8.9,
    fallbackUrl: 'https://zapier.com',
    tags: ['7000+ appar', 'AI Actions', 'Tables', 'Interfaces'],
    pros: ['Flest integrationer på marknaden', 'Enkelt att komma igång', 'AI Actions inbyggt'],
    cons: ['Dyrt för stora volymer', 'Mindre flexibelt än Make'],
    offer: { title: '100 tasks gratis/mån', price: 'Gratis · Starter 20 USD/mån', bestFor: 'Snabb SaaS-integration' },
    label: 'Mest använda',
  },
  n8n: {
    logo: 'bg-rose-600', ctaName: 'n8n', score: 8.7,
    fallbackUrl: 'https://n8n.io',
    tags: ['Open source', 'Self-host', 'AI-noder', 'Kod-noder'],
    pros: ['Fullt open source', 'Kan självhostas', 'Bra för utvecklare'],
    cons: ['Kräver tekniskt kunnande', 'Mindre polerat UI'],
    offer: { title: 'Self-host gratis', price: 'Gratis · Cloud 20 EUR/mån', bestFor: 'Tekniska team som vill äga data' },
    label: 'Bäst open source',
  },
  'power-automate': {
    logo: 'bg-sky-700', ctaName: 'Power Automate', score: 8.4,
    fallbackUrl: 'https://powerautomate.microsoft.com',
    tags: ['Microsoft 365', 'Copilot', 'RPA', 'Enterprise'],
    pros: ['Djup Microsoft 365-integration', 'Copilot-stöd inbyggt', 'Enterprise-säkerhet'],
    cons: ['Komplext utanför MS-stacken', 'Licensmodellen är förvirrande'],
    offer: { title: 'Ingår i M365 (vissa licenser)', price: 'Från 15 USD/användare/mån', bestFor: 'Microsoft 365-företag' },
    label: 'Bäst för Microsoft-stack',
  },
  bardeen: {
    logo: 'bg-emerald-600', ctaName: 'Bardeen', score: 8.2,
    fallbackUrl: 'https://www.bardeen.ai',
    tags: ['Chrome-extension', 'Web scraping', 'Agent', 'No-code'],
    pros: ['Direkt i Chrome', 'AI-agent som klickar och skrapar', 'Inga API:er krävs'],
    cons: ['Begränsat till webben', 'Stabilitet vid sajt-ändringar'],
    offer: { title: '100 credits gratis/mån', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Web-skrapning och agenter' },
    label: 'Bäst för webb-agenter',
  },
  'relay-app': {
    logo: 'bg-indigo-700', ctaName: 'Relay.app', score: 8.0,
    fallbackUrl: 'https://www.relay.app',
    tags: ['Human-in-the-loop', 'AI-flöden', 'Approval', 'Modern UI'],
    pros: ['Pausar för mänsklig granskning', 'Modernt UI', 'Bra för kritiska flöden'],
    cons: ['Mindre integrationer än Zapier', 'Tidig produkt'],
    offer: { title: '200 steg gratis/mån', price: 'Gratis · Pro 9 USD/mån', bestFor: 'Kritiska AI-flöden med kontroll' },
    label: 'Bäst för human-in-the-loop',
  },
  activepieces: {
    logo: 'bg-fuchsia-600', ctaName: 'ActivePieces', score: 7.9,
    fallbackUrl: 'https://www.activepieces.com',
    tags: ['Open source', 'AI-pieces', 'Self-host', 'Generös gratis'],
    pros: ['Open source-alternativ till Zapier', 'Generös gratisversion', 'AI-pieces inbyggt'],
    cons: ['Färre integrationer', 'Mindre community'],
    offer: { title: '5000 tasks gratis/mån', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Open source-team med tight budget' },
    label: 'Bäst gratis open source',
  },
  pipedream: {
    logo: 'bg-lime-700', ctaName: 'Pipedream', score: 8.3,
    fallbackUrl: 'https://pipedream.com',
    tags: ['Kod-steg', 'JS/Python', '2500+ appar', 'Utvecklare'],
    pros: ['Kodbara workflows', 'Kombinera kod med integrationer', 'Bra dokumentation'],
    cons: ['Mindre nybörjarvänligt', 'Kräver kodkunskap'],
    offer: { title: 'Gratis 10k credits/mån', price: 'Gratis · Basic 29 USD/mån', bestFor: 'Utvecklare som vill koda i flöden' },
    label: 'Bäst för utvecklare',
  },

  /* ── Gratis tier ─────────────────────────────────────── */
  'chatgpt-gratis': {
    logo: 'bg-emerald-700', ctaName: 'ChatGPT', score: 9.0,
    fallbackUrl: 'https://chatgpt.com',
    tags: ['Gratis tier', 'GPT-5 light', 'Multimodal', 'Mest använd'],
    pros: ['Bredast gratis-AI-modell', 'Multimodal i gratisversionen', 'Custom GPTs'],
    cons: ['Begränsade meddelanden per dag', 'Plus krävs för full GPT-5'],
    offer: { title: 'Gratis utan kort', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Generella AI-uppgifter' },
    label: 'Redaktionens val',
  },
  'claude-gratis': {
    logo: 'bg-amber-600', ctaName: 'Claude', score: 9.4,
    fallbackUrl: 'https://claude.ai',
    tags: ['Gratis tier', 'Sonnet 4.6', 'Lång kontext', 'Skrivande'],
    pros: ['Bäst skrivkvalitet i gratis-segmentet', 'Stor kontextfönster', 'Stark svensk grammatik'],
    cons: ['Lägre dygnsgräns än ChatGPT', 'Ingen bildgenerering'],
    offer: { title: 'Gratis utan kort', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Långa textuppgifter' },
    label: 'Bäst för skrivande',
  },
  'gemini-gratis': {
    logo: 'bg-blue-600', ctaName: 'Gemini', score: 8.7,
    fallbackUrl: 'https://gemini.google.com',
    tags: ['Gratis tier', 'Google-integration', '2.5 Flash', 'Multimodal'],
    pros: ['Gratis Gmail/Docs/Drive-integration', 'Stor gratis-kvot', 'Snabb 2.5 Flash'],
    cons: ['Ojämn kvalitet jämfört med Claude', 'Google-konto krävs'],
    offer: { title: 'Gratis med Google-konto', price: 'Gratis · Advanced 22 USD/mån', bestFor: 'Google-användare' },
    label: 'Bäst Google-integration',
  },
  'deepseek-gratis': {
    logo: 'bg-indigo-600', ctaName: 'DeepSeek', score: 8.5,
    fallbackUrl: 'https://chat.deepseek.com',
    tags: ['Open weight', 'Matematik', 'Helt gratis', 'Kinesisk modell'],
    pros: ['Konkurrerar med GPT-4 på benchmarks', 'Ingen meddelandegräns', 'Open weights tillgängliga'],
    cons: ['Kinesisk hosting — datasekretess-frågor', 'Svenska sämre än engelska'],
    offer: { title: 'Helt gratis', price: 'Gratis · API från 0.27 USD/M tokens', bestFor: 'Tekniska och matematiska frågor' },
    label: 'Mest gratis-generös',
  },
  'perplexity-gratis': {
    logo: 'bg-cyan-700', ctaName: 'Perplexity', score: 8.6,
    fallbackUrl: 'https://www.perplexity.ai',
    tags: ['Sök-AI', 'Citerar källor', 'Gratis tier', 'Realtidsdata'],
    pros: ['Verifierbara källor på varje svar', 'Realtidssök inbakad', 'Solid gratis tier'],
    cons: ['Pro krävs för avancerade modeller', 'Sökresultat ibland för tunna'],
    offer: { title: '5 Pro-sökningar/dag gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Research med källor' },
    label: 'Bäst för faktasök',
  },
  'mistral-gratis': {
    logo: 'bg-orange-600', ctaName: 'Mistral', score: 8.3,
    fallbackUrl: 'https://chat.mistral.ai',
    tags: ['EU-hosted', 'Snabb', 'Open weight', 'GDPR-vänlig'],
    pros: ['Europeisk hosting', 'Helt gratis chat', 'Open weights för flera modeller'],
    cons: ['Svagare än de stora amerikanska för komplexa uppgifter', 'Mindre community'],
    offer: { title: 'Le Chat helt gratis', price: 'Gratis · API från 0.40 EUR/M tokens', bestFor: 'EU-företag som vill ha GDPR-vänligt' },
    label: 'Bäst EU-alternativ',
  },
  'copilot-gratis': {
    logo: 'bg-sky-700', ctaName: 'Microsoft Copilot', score: 8.4,
    fallbackUrl: 'https://copilot.microsoft.com',
    tags: ['Bing-integration', 'DALL-E 3', 'Microsoft 365', 'Gratis tier'],
    pros: ['Gratis DALL-E 3 bildgenerering', 'Bing-sök inbakat', 'Office-integration'],
    cons: ['Mer låst till Microsoft-stacken', 'Mindre customizable än ChatGPT'],
    offer: { title: 'Gratis med Microsoft-konto', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Office 365-användare' },
    label: 'Bäst för Office-stack',
  },
  'stable-diffusion-gratis': {
    logo: 'bg-violet-700', ctaName: 'Stable Diffusion', score: 8.7,
    fallbackUrl: 'https://stability.ai',
    tags: ['Open source', 'Lokal körning', 'ComfyUI', 'Helt gratis'],
    pros: ['Helt gratis lokalt', 'Total kontroll över output', 'Stark community + LoRA'],
    cons: ['Kräver GPU-hårdvara för rimligt tempo', 'Brant inlärningskurva'],
    offer: { title: 'Open source — helt gratis', price: 'Gratis · DreamStudio från 10 USD', bestFor: 'Bildgenerering på egen dator' },
    label: 'Bäst open source-bild',
  },
  'suno-gratis': {
    logo: 'bg-rose-600', ctaName: 'Suno AI', score: 8.5,
    fallbackUrl: 'https://www.suno.com',
    tags: ['AI-musik', 'Gratis tier', 'Sångröst', 'Daglig kvot'],
    pros: ['10 gratis krediter/dag', 'Genererar både röst och musik', 'Snabb output'],
    cons: ['Pro krävs för kommersiell användning', 'Begränsade format på gratis'],
    offer: { title: '10 låtar gratis/dag', price: 'Gratis · Pro 10 USD/mån', bestFor: 'Experimentera med AI-musik' },
    label: 'Bäst AI-musik',
  },
  'leonardo-gratis': {
    logo: 'bg-fuchsia-700', ctaName: 'Leonardo AI', score: 8.1,
    fallbackUrl: 'https://leonardo.ai',
    tags: ['Bildgenerering', '150 tokens/dag', 'Game art', 'SD-baserad'],
    pros: ['150 gratis tokens varje dag', 'Game asset-fokuserade modeller', 'Bra UI'],
    cons: ['Mindre språkförståelse än Midjourney', 'Daglig kvot kan kännas tunn'],
    offer: { title: '150 tokens gratis/dag', price: 'Gratis · Apprentice 12 USD/mån', bestFor: 'Game art och konceptdesign' },
    label: 'Bäst för game art',
  },
};

/* ─── Hub-level overrides (per category) ───────────────────────── */

type HubFacts = { hoursLabel: string; criteriaCount: number };
const HUB_DEFAULTS: HubFacts = { hoursLabel: '200+', criteriaCount: 10 };

const HUB_KNOWN: Record<string, HubFacts> = {
  'ai-text-verktyg':   { hoursLabel: '200+', criteriaCount: 10 },
  'ai-video-verktyg':  { hoursLabel: '150+', criteriaCount: 8  },
  'ai-bild-verktyg':   { hoursLabel: '120+', criteriaCount: 9  },
  'ai-ljud-och-musik': { hoursLabel: '90+',  criteriaCount: 7  },
  'ai-kod-verktyg':    { hoursLabel: '180+', criteriaCount: 12 },
  'ai-automation':     { hoursLabel: '140+', criteriaCount: 8  },
  'ai-video':          { hoursLabel: '160+', criteriaCount: 9  },
};

function getHubFacts(slug: string): HubFacts {
  return HUB_KNOWN[slug] ?? HUB_DEFAULTS;
}

/* ─── Subcategory navigation grid ──────────────────────────────────
   For the two parent nav-hubs: a grid of cards linking down to the
   dedicated subcategory hubs, rendered high on the page so the parent
   points downward instead of competing with the subcategories. Keyed by
   the hub's own path. */
type SubcategoryCard = { title: string; href: string; desc: string; icon: string };

const HUB_SUBCATEGORIES: Record<string, SubcategoryCard[]> = {
  '/ai-verktyg/marknadsforing': [
    { title: 'AI för SEO', href: '/ai-verktyg/marknadsforing/seo', icon: '🔍', desc: 'Keyword-research, SERP-analys och content-optimering.' },
    { title: 'AI för content & copywriting', href: '/ai-verktyg/marknadsforing/content-copywriting', icon: '✍️', desc: 'Long-form, annonstext och konsekvent brand voice.' },
    { title: 'AI för annonser', href: '/ai-verktyg/marknadsforing/annonser', icon: '🎯', desc: 'Kreativ-generering och performance för paid media.' },
    { title: 'AI för sociala medier', href: '/ai-verktyg/marknadsforing/sociala-medier', icon: '📱', desc: 'Content, schemaläggning och plattformsspecifik AI.' },
  ],
  '/ai-verktyg/ekonomi': [
    { title: 'AI för bokföring', href: '/ai-verktyg/ekonomi/bokforing', icon: '📒', desc: 'Automatisk kontering, kvittotolkning och avstämning.' },
    { title: 'AI för redovisning', href: '/ai-verktyg/ekonomi/redovisning', icon: '📊', desc: 'Månadsbokslut, revision och practice management.' },
  ],
};

/* ─── Main template ────────────────────────────────────────────── */

export function HubTemplate({
  article: a,
  items,
}: {
  article: Article;
  items: HubChild[];
}) {
  const virtuals = VIRTUAL_HUB_CHILDREN[a.slug] ?? [];
  const ranked = [...items, ...virtuals].sort((x, y) => {
    const rx = getRating(x).score;
    const ry = getRating(y).score;
    if (ry !== rx) return ry - rx;
    return x.title.localeCompare(y.title, 'sv');
  });
  const top = ranked[0];

  const crumbs = buildCrumbs(a.path);
  const monthLabel = currentMonthLabel();
  const updatedYear = new Date().getFullYear();
  const facts = getHubFacts(a.slug);

  const breadcrumbLd = crumbs.length > 0
    ? breadcrumbSchema([...crumbs, { label: a.title, href: a.path }])
    : null;

  return (
    <article className="bg-muted text-fg">
      {breadcrumbLd && <JsonLd data={breadcrumbLd} />}
      <Hero
        article={a}
        crumbs={crumbs}
        toolsCount={ranked.length}
        monthLabel={monthLabel}
        updatedYear={updatedYear}
        facts={facts}
      />

      {HUB_SUBCATEGORIES[a.path] && (
        <SubcategoryGrid subs={HUB_SUBCATEGORIES[a.path]} />
      )}

      {ranked.length > 0 && (
        <RankingSection ranked={ranked} year={updatedYear} />
      )}

      {top && <BestInTest child={top} />}

      {ranked.length > 0 && <ComparisonTable ranked={ranked} />}

      {/* Long-form review cards — one per real child, mirrors the layout of
          ai-text-verktyg's bottom section but rendered programmatically so
          every hub (yrke included) gets the same treatment. Comes before
          the editorial body so the recension-cards sit close to the
          topplistan / comparison and the editorial guide closes the page. */}
      {ranked.some((c) => !c.isUpcoming) && (
        <ReviewsSection ranked={ranked} />
      )}

      <EditorialSection article={a} ranked={ranked} />

      {Array.isArray(a.faq) && a.faq.length > 0 && (
        <>
          <FaqAccordion items={a.faq} />
          <JsonLd data={faqPageSchema(a.faq)} />
        </>
      )}
    </article>
  );
}

/* ─── Sections ─────────────────────────────────────────────────── */

function SubcategoryGrid({ subs }: { subs: SubcategoryCard[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Utforska kategorier
      </div>
      <h2 className="mb-8 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
        Hitta rätt verktyg för din uppgift
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {subs.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-start gap-4 rounded-xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl"
          >
            <span
              aria-hidden
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-2xl"
            >
              {c.icon}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-black uppercase tracking-tight text-fg break-words group-hover:text-indigo-700">
                {c.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-fg-subtle">{c.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Utforska
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Hero({
  article: a,
  crumbs,
  toolsCount,
  monthLabel,
  updatedYear,
  facts,
}: {
  article: Article;
  crumbs: { label: string; href: string }[];
  toolsCount: number;
  monthLabel: string;
  updatedYear: number;
  facts: HubFacts;
}) {
  // ── Designexperiment: bakgrundsbild-hjälte ENDAST för ai-kod-verktyg
  //    (kräver featured_image). Alla andra hubbar = oförändrad hero nedan. ──
  if (a.slug === 'ai-kod-verktyg' && a.featured_image) {
    return (
      <header className="relative overflow-hidden border-b border-line bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={a.featured_image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-[0.35]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.95) 40%, rgba(15,23,42,0.3) 100%)' }}
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          {/* Breadcrumb */}
          <nav aria-label="Brödsmulor" className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/55">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                {i > 0 && <span className="mx-2 text-white/30">›</span>}
                {i === crumbs.length - 1 ? (
                  <span className="text-white/80">{c.label}</span>
                ) : (
                  <Link href={c.href} className="hover:text-white">{c.label}</Link>
                )}
              </span>
            ))}
          </nav>

          {/* Indigo badge med kategorinamn ovan H1 */}
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white">
            <span aria-hidden>✦</span> AI-kod
          </span>

          <h1 className="mt-6 max-w-3xl text-balance break-words text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
            {a.title}
          </h1>

          {a.excerpt && (
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/85">
              {a.excerpt}
            </p>
          )}

          {toolsCount > 0 && (
            <div className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/55">
              {toolsCount} verktyg testade
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        {/* Breadcrumb */}
        <nav aria-label="Brödsmulor" className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 && <span className="mx-2 text-line-strong">›</span>}
              {i === crumbs.length - 1 ? (
                <span className="text-fg-muted">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-indigo-600">
                  {c.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr,auto] lg:items-end">
          <div>
            {/* Badge — hide "X verktyg testade" when the topplistan is empty */}
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              <span aria-hidden>✦</span>
              Uppdaterad {monthLabel}
              {toolsCount > 0 && <> · {toolsCount} verktyg testade</>}
            </span>

            <h1 className="mt-6 text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
              {highlightTitle(a.title)}
            </h1>

            {a.excerpt && (
              <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle">
                {a.excerpt}
              </p>
            )}
          </div>

          {/* Stats grid — drop "Verktyg" box when topplistan is empty so the
              card doesn't display "0 Verktyg" on yrke depth-5 pages */}
          <div className={`grid gap-3 self-end lg:gap-4 ${toolsCount > 0 ? 'grid-cols-3 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-2'}`}>
            {toolsCount > 0 && <StatBox value={String(toolsCount)} label="Verktyg" />}
            <StatBox value={facts.hoursLabel} label="Timmar test" />
            <StatBox value={String(updatedYear)} label="Uppdaterad" />
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-indigo-600">🏆</span>
            Oberoende test
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-fg-faint">⊙</span>
            Vissa länkar är annonslänkar
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-fg-faint">⚙</span>
            {facts.criteriaCount} testkriterier
          </span>
        </div>
      </div>
    </header>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-card px-4 py-3 text-center">
      <div className="text-2xl font-black tracking-tight text-fg sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
    </div>
  );
}

function RankingSection({ ranked, year }: { ranked: HubChild[]; year: number }) {
  return (
    <section aria-labelledby="topplistan" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-2 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden />
        Live-rankning
      </div>
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 id="topplistan" className="min-w-0 max-w-full text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
          Topplistan {year}
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          ⓘ Sorterad efter helhetsbetyg
        </span>
      </div>

      <ol className="overflow-hidden rounded-xl border border-line bg-card">
        {/* Table header */}
        <li className="hidden grid-cols-[80px,1fr,220px,180px,200px] items-center border-b border-line bg-muted px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle lg:grid">
          <span>Rank</span>
          <span>Verktyg &amp; funktioner</span>
          <span>Erbjudande</span>
          <span>Betyg</span>
          <span>Besök</span>
        </li>

        {ranked.map((child, i) => (
          <RankRow key={child.slug} child={child} rank={i + 1} />
        ))}
      </ol>

      <p className="mt-5 text-xs text-fg-subtle">
        ⓘ AI-Magasinet kan få provision när du klickar på vissa länkar på denna sida.
        Det påverkar inte vår rankning — placeringen bygger på oberoende test och redaktionellt omdöme.
      </p>
    </section>
  );
}

function RankRow({ child, rank }: { child: HubChild; rank: number }) {
  const name = toolNameFromTitle(child.title);
  const p = buildProfile(child);
  const r = getRating(child);
  const isTop = rank === 1;
  // Curated tagline wins; otherwise fall back to a WP-cleaned excerpt.
  const description = p.tagline ?? cleanExcerpt(child.excerpt);

  return (
    <li
      className={
        'grid grid-cols-1 gap-4 border-b border-line px-4 py-5 last:border-b-0 lg:grid-cols-[80px,1fr,220px,180px,200px] lg:items-center lg:gap-5 lg:px-4 ' +
        (isTop ? 'bg-indigo-50/60' : 'bg-card')
      }
    >
      {/* Rank */}
      <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:gap-1">
        <div
          className={
            'flex h-14 w-14 items-center justify-center rounded-lg font-mono text-2xl font-black ' +
            (isTop
              ? 'bg-indigo-100 text-indigo-700'
              : 'border border-line bg-card text-fg-subtle')
          }
        >
          {String(rank).padStart(2, '0')}
        </div>
        {isTop && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            🏆 Top
          </span>
        )}
      </div>

      {/* Verktyg + funktioner */}
      <div className="flex gap-4">
        <Logo color={p.logo} initial={p.initial} image={p.imageUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={child.path}
              className="text-xl font-black uppercase tracking-tight text-fg break-words hover:text-indigo-600"
            >
              {name}
            </Link>
            {isTop ? (
              <span className="rounded bg-indigo-100 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                #1 Bäst i test
              </span>
            ) : (
              <span className="rounded bg-soft px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                {p.label}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-fg-subtle">
              {description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-soft px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Erbjudande */}
      <div className="rounded-lg border border-line bg-soft p-3">
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
          🎁 Erbjudande
        </div>
        <div className="mt-1 text-sm font-bold leading-snug text-fg">
          {p.offer.title}
        </div>
        <div className="mt-1 text-xs text-fg-subtle">{p.offer.price}</div>
      </div>

      {/* Betyg */}
      <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:gap-1">
        <RatingCircle score={r.score} />
        <div className="flex flex-col gap-0.5 lg:items-center">
          <span className="text-sm leading-none tracking-widest text-indigo-600">
            {'★'.repeat(starsFromScore(r.score))}
            <span className="text-line-strong">
              {'★'.repeat(5 - starsFromScore(r.score))}
            </span>
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
            {isTop ? 'Redaktionens val' : p.label}
          </span>
        </div>
      </div>

      {/* Besök */}
      <div className="flex flex-col items-stretch gap-2 lg:items-end">
        <AffiliateButton
          affiliateUrl={child.affiliate_url}
          fallbackUrl={p.fallbackUrl}
          label={`Prova ${p.ctaName ?? name}`}
        />
        {child.isUpcoming ? (
          <span className="inline-flex items-center justify-center gap-1.5 rounded-md border border-dashed border-line bg-soft px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            <span aria-hidden>⏳</span> Recension snart
          </span>
        ) : (
          <Link
            href={child.path}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-fg-muted transition-colors hover:border-indigo-300 hover:text-indigo-700"
          >
            Läs recension <span aria-hidden>›</span>
          </Link>
        )}
        <span className="text-center font-mono text-[10px] uppercase tracking-wider text-fg-faint lg:text-right">
          ⊙ 18+ · Annonslänk
        </span>
      </div>
    </li>
  );
}

function BestInTest({ child }: { child: HubChild }) {
  const name = toolNameFromTitle(child.title);
  const p = buildProfile(child);
  const year = new Date().getFullYear();
  const description = p.tagline ?? cleanExcerpt(child.excerpt);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Logo
            color={p.logo}
            initial={p.initial}
            image={p.imageUrl}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
              🏆 Bäst i test {year}
            </div>
            <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
              {name}
            </h3>
            {description && (
              <p className="mt-2 max-w-2xl text-fg-subtle">{description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-card px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-fg-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <AffiliateButton
              affiliateUrl={child.affiliate_url}
              fallbackUrl={p.fallbackUrl}
              label={`Prova ${p.ctaName ?? name}`}
              size="lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonTable({ ranked }: { ranked: HubChild[] }) {
  return (
    <section
      aria-labelledby="comparison"
      className="mx-auto max-w-6xl px-4 pb-12 sm:px-6"
    >
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Snabb jämförelse
      </div>
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2
          id="comparison"
          className="min-w-0 max-w-full text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl"
        >
          Verktyg sida vid sida
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          ⓘ Pris och betyg per verktyg
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-soft">
            <tr>
              <th scope="col" className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                Verktyg
              </th>
              <th scope="col" className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                Bäst för
              </th>
              <th scope="col" className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                Pris
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle"
              >
                Betyg
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((child) => {
              const name = toolNameFromTitle(child.title);
              const p = buildProfile(child);
              const r = getRating(child);
              return (
                <tr
                  key={child.slug}
                  className="border-t border-line transition-colors hover:bg-soft/60"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-3 text-left font-bold text-fg"
                  >
                    <Link href={child.path} className="hover:text-indigo-600">
                      {name}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-fg-muted">{p.offer.bestFor}</td>
                  <td className="px-4 py-3 text-fg-muted">{p.offer.price}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold text-teal-600">
                    {r.score.toFixed(1)}
                    <span className="text-fg-faint">/10</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Strip WP-injected <style>/<script> blocks before rendering hub HTML.
 *  CSS (.magazine-prose, scoped in globals.css) handles the visual
 *  neutralisation of WP container backgrounds; this just keeps stray
 *  globals and arbitrary scripts out of the page.
 *
 *  With { stripAiToolBox: true } also removes WP-injected "ai-tool-box"
 *  cards — these are the legacy review-cards with plain text links that
 *  RankingSection already replaces with proper CTA buttons. Used on
 *  yrke-tree hubs to avoid showing the same recension twice. */
function sanitizeWpHtml(html: string, opts?: { stripAiToolBox?: boolean }): string {
  let out = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  if (opts?.stripAiToolBox) out = stripAiToolBoxes(out);
  return out;
}

/** Remove every <div class="… ai-tool-box …">…</div> (with nested-div
 *  awareness — regex alone can't balance, so we walk forward counting
 *  div opens/closes from each match). */
function stripAiToolBoxes(html: string): string {
  const openRe = /<div\b[^>]*\bclass\s*=\s*["'][^"']*\bai-tool-box\b[^"']*["'][^>]*>/i;
  while (true) {
    const m = openRe.exec(html);
    if (!m) break;
    const start = m.index;
    let depth = 1;
    let pos = start + m[0].length;
    const tagRe = /<(\/?)div\b[^>]*>/gi;
    tagRe.lastIndex = pos;
    while (depth > 0) {
      const t = tagRe.exec(html);
      if (!t) break;
      depth += t[1] === '/' ? -1 : 1;
      pos = t.index + t[0].length;
    }
    if (depth !== 0) break; // unbalanced — bail so we don't loop forever
    html = html.slice(0, start) + html.slice(pos);
  }
  return html;
}

function EditorialSection({
  article: a,
  ranked,
}: {
  article: Article;
  ranked: HubChild[];
}) {
  // Strip legacy WP "ai-tool-box" review-cards from content_mdx on every hub:
  // the new ReviewsSection at the bottom renders them programmatically with
  // proper CTAs, curated pros/cons and consistent typography, so the WP cards
  // would just be a worse-looking duplicate.
  const html = a.content_mdx
    ? sanitizeWpHtml(a.content_mdx, { stripAiToolBox: true })
    : '';
  if (process.env.NODE_ENV !== 'production') {
    const orphanAiCompare =
      (html.match(/<div[^>]*class="[^"]*ai-compare[^"]*"/g) ?? []).length;
    console.log('[EditorialSection] render', {
      slug: a.slug,
      contentMdxLength: a.content_mdx?.length ?? 0,
      sanitizedLength: html.length,
      h2Count: (html.match(/<h2\b/gi) ?? []).length,
      orphanAiCompareOpens: orphanAiCompare,
    });
  }

  return (
    <section
      aria-labelledby="editorial"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mb-3 flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-600" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Redaktionell analys · Edition {new Date().getFullYear()}
        </span>
      </div>
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-4">
        <h2
          id="editorial"
          className="min-w-0 max-w-full text-balance break-words text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl"
        >
          {ranked.length > 0 ? 'Recensioner' : 'Översikt'}
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-faint sm:inline">
          {ranked.length > 0 ? 'Verktyg för verktyg' : 'Djupgående guide'}
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:gap-14">
        {/* Editorial body — hub's own content_mdx in magazine typography */}
        <div className="min-w-0">
          <div className="magazine-prose">
            <div
              className="
                prose prose-lg max-w-none
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg prose-headings:break-words prose-headings:[overflow-wrap:anywhere]
                prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-4 sm:prose-h2:text-3xl
                prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold prose-h3:text-fg
                prose-p:text-fg-muted prose-p:leading-[1.85] prose-p:text-[17px]
                prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:font-bold prose-strong:text-fg
                prose-em:italic prose-em:text-fg
                prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
                prose-ul:my-6 prose-ol:my-6
                prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
                prose-hr:my-12 prose-hr:border-line
                prose-img:rounded-xl prose-img:border prose-img:border-line
              "
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>

        {/* Sidebar — Snabbval (only with a populated topplistan) + Newsletter */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          {ranked.length > 0 && <Snabbval ranked={ranked} />}
          <NewsletterBox />
        </aside>
      </div>
    </section>
  );
}

/* ─── ReviewsSection — long-form cards, one per real child ─────
   Renders below EditorialSection. Each card surfaces the curated
   profile data (logo, rating, label, pros/cons) plus an analysis
   paragraph pulled from child.content_mdx, and links out to the
   full review page. Skips virtual (isUpcoming) children. */

function ReviewsSection({ ranked }: { ranked: HubChild[] }) {
  const reviews = ranked.filter((c) => !c.isUpcoming);
  if (reviews.length === 0) return null;
  const year = new Date().getFullYear();

  return (
    <section
      aria-labelledby="reviews"
      className="border-t border-line bg-muted"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-4">
          <h2
            id="reviews"
            className="min-w-0 max-w-full text-balance break-words text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl"
          >
            Verktyg för verktyg
          </h2>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-faint sm:inline">
            {reviews.length} testade · {year}
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {reviews.map((c, i) => (
            <ReviewCard key={c.slug} child={c} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ child, rank }: { child: HubChild; rank: number }) {
  const name = toolNameFromTitle(child.title);
  const p = buildProfile(child);
  const r = getRating(child);
  const stars = starsFromScore(r.score);
  const analysis = extractAnalysis(child);
  const isTop = rank === 1;

  return (
    <article
      className={
        'rounded-2xl border bg-card p-6 sm:p-8 ' +
        (isTop ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-line')
      }
    >
      <div className="flex flex-wrap items-start gap-5 border-b border-line-subtle pb-5">
        <Logo color={p.logo} initial={p.initial} image={p.imageUrl} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
              #{String(rank).padStart(2, '0')}
            </span>
            <span
              className={
                'rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ' +
                (isTop
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-soft text-fg-subtle')
              }
            >
              {isTop ? '🏆 Redaktionens val' : p.label}
            </span>
          </div>
          <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
            {name}
          </h3>
          {p.tagline && (
            <p className="mt-2 max-w-2xl text-fg-subtle">{p.tagline}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 sm:items-end">
          <RatingCircle score={r.score} />
          <span className="text-sm leading-none tracking-widest text-indigo-600">
            {'★'.repeat(stars)}
            <span className="text-line-strong">{'★'.repeat(5 - stars)}</span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">✓</span>
            Styrkor
          </div>
          <ul className="space-y-2 text-sm leading-snug text-fg">
            {p.pros.map((pro) => (
              <li key={pro} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
          <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rose-700">
            <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100">✗</span>
            Svagheter
          </div>
          <ul className="space-y-2 text-sm leading-snug text-fg">
            {p.cons.map((con) => (
              <li key={con} className="flex gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {analysis && (
        <div className="mt-6">
          <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
            Vår analys
          </div>
          <p className="max-w-3xl text-[15px] leading-[1.75] text-fg-muted">
            {analysis}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle pt-5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-faint">
          ⓘ Sammanvägt betyg · {r.score.toFixed(1)} / 10
        </span>
        <Link
          href={child.path}
          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700"
        >
          Läs full recension <span aria-hidden>›</span>
        </Link>
      </div>
    </article>
  );
}

/** Pick the first meaningful prose paragraph from content_mdx; fall back
 *  to excerpt. Strips tags, collapses whitespace, caps at ~280 chars. */
function extractAnalysis(child: HubChild): string | null {
  const raw = child.content_mdx ?? '';
  // Find paragraphs; take the first one that's long enough to be substantive.
  const paragraphs = raw
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) ?? [];
  for (const block of paragraphs) {
    const text = block
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text.length >= 80) {
      return text.length > 280 ? text.slice(0, 277).trimEnd() + '…' : text;
    }
  }
  // No suitable paragraph — fall back to the excerpt.
  const ex = (child.excerpt ?? '').trim();
  if (!ex) return null;
  return ex.length > 280 ? ex.slice(0, 277).trimEnd() + '…' : ex;
}

function Snabbval({ ranked }: { ranked: HubChild[] }) {
  const picks = ranked.slice(0, SNABBVAL_LABELS.length).map((c, i) => ({
    label: SNABBVAL_LABELS[i],
    name: toolNameFromTitle(c.title),
    path: c.path,
  }));

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
        <span aria-hidden>↗</span>
        Snabbval
      </div>
      <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-fg break-words">
        Hitta rätt direkt
      </h3>
      <ul className="divide-y divide-line">
        {picks.map((p) => (
          <li key={p.label} className="flex items-center justify-between py-2.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
              {p.label}
            </span>
            <Link
              href={p.path}
              className="text-sm font-bold text-fg hover:text-indigo-600"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterBox() {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="mb-3 inline-flex items-center gap-2 text-indigo-600">
        <span aria-hidden className="text-lg">✦</span>
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight text-fg break-words">
        Få vårt AI-nyhetsbrev
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
        Veckans viktigaste AI-nyheter och nya verktygstest, direkt i din inkorg.
      </p>
      <input
        type="email"
        placeholder="din@email.se"
        className="mt-4 w-full rounded-md border border-line-strong bg-card px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="button"
        className="mt-3 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
      >
        Prenumerera gratis
      </button>
    </div>
  );
}

/* ─── Atoms ────────────────────────────────────────────────────── */

function Logo({
  color,
  initial,
  image,
  size = 'md',
}: {
  color: string;
  initial: string;
  image?: string | null;
  size?: 'md' | 'lg';
}) {
  const box = size === 'lg' ? 'h-24 w-24 rounded-2xl' : 'h-20 w-20 rounded-xl';
  const text = size === 'lg' ? 'text-4xl' : 'text-3xl';

  if (image) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-line bg-card p-2 ${box}`}
      >
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

  return (
    <div
      className={`flex shrink-0 items-center justify-center font-black text-white ${color} ${box} ${text}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function RatingCircle({ score }: { score: number }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-50">
      <span className="font-black tracking-tight text-teal-600">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function AffiliateButton({
  affiliateUrl,
  fallbackUrl,
  label,
  size = 'md',
}: {
  affiliateUrl: string | null | undefined;
  fallbackUrl: string | null | undefined;
  label: string;
  size?: 'md' | 'lg';
}) {
  const cls =
    'inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700 ' +
    (size === 'lg' ? 'px-6 py-3 text-sm' : 'px-4 py-2.5 text-xs');

  // Affiliate URL → sponsored rel; fallback URL → nofollow noopener.
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

function starsFromScore(score: number): number {
  return Math.max(1, Math.min(5, Math.round((score / 10) * 5)));
}

/* ─── Breadcrumb utility (kept local to avoid coupling) ──────── */

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
