import Link from 'next/link';
import type { ArticleCardData } from '@/components/ArticleCard';
import { toolNameFromTitle, type Rating } from '@/lib/rating';
import type { Article } from '@/lib/supabase';

export type HubChild = ArticleCardData & {
  rating: Rating | null;
  /** Set on virtual children (no DB article yet) — replaces "Läs recension"
   *  link with a "Recension snart" badge in RankRow. */
  isUpcoming?: boolean;
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

/** Curated profiles for well-known tools. Falls back to deterministic mock. */
const KNOWN: Record<string, Partial<ToolProfile>> = {
  chatgpt: {
    logo: 'bg-emerald-500',
    tags: ['GPT-5', 'Custom GPTs', 'Canvas', 'Röst & syn'],
    pros: ['Snabb och korrekt', 'Stort ekosystem av GPTs', 'Bäst röstläge'],
    cons: ['Knapphändig källhantering', 'Begränsningar i gratisläget'],
    offer: { title: 'Plus-läge gratis i 7 dagar', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Allt-i-ett textproduktion' },
    label: 'Redaktionens val',
  },
  claude: {
    logo: 'bg-orange-500',
    tags: ['Claude 4 Opus', 'Projects', 'Artifacts', '200k context'],
    pros: ['Bäst på långform', 'Säker källhantering', 'Skarp på nyans'],
    cons: ['Långsammare än GPT', 'Dyrare per token'],
    offer: { title: '200k token kontext gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Långa dokument och nyans' },
    label: 'Bäst för långform',
  },
  gemini: {
    logo: 'bg-sky-500',
    tags: ['Gemini 2.5 Pro', '1M context', 'Workspace', 'Multimodal'],
    pros: ['Enorm kontext', 'Integrerat med Google', 'Stark på multimodal'],
    cons: ['Ojämn svenska', 'Beroende av Google-konto'],
    offer: { title: 'Gemini Advanced 2 mån gratis', price: 'Gratis · Advanced 22 USD/mån', bestFor: 'Workspace-användare' },
    label: 'Bäst för stora dokument',
  },
  mistral: {
    logo: 'bg-violet-500',
    tags: ['Le Chat', 'EU-data', 'Open source', 'Mixtral'],
    pros: ['Helt EU-baserat', 'Snabbt och billigt', 'Bra svenska'],
    cons: ['Mindre ekosystem', 'Färre integrationer'],
    offer: { title: 'Le Chat Pro 30 dagar gratis', price: 'Gratis · Pro 15 EUR/mån', bestFor: 'EU-företag och dataskydd' },
    label: 'Bäst i EU',
  },
  perplexity: {
    logo: 'bg-teal-500',
    tags: ['Källor inbyggt', 'Pages', 'Research', 'Live web'],
    pros: ['Källor på allt', 'Snabb research-flöde', 'Citerar korrekt'],
    cons: ['Smalare användning', 'Pro krävs för långt'],
    offer: { title: 'Perplexity Pro 1 mån gratis', price: 'Gratis · Pro 20 USD/mån', bestFor: 'Research och journalistik' },
    label: 'Bäst för research',
  },
  copilot: {
    logo: 'bg-indigo-500',
    tags: ['GPT-5', 'Microsoft 365', 'Word & Excel', 'Enterprise'],
    pros: ['Integrerat i Office', 'Bra för team', 'Säkerhet i fokus'],
    cons: ['Kräver M365-licens', 'Sämre i webb-UI'],
    offer: { title: 'Copilot Pro 30 dagar gratis', price: 'Gratis · Pro 22 USD/mån', bestFor: 'Microsoft-företag' },
    label: 'Bäst för företag',
  },
  rytr: {
    logo: 'bg-rose-500',
    tags: ['40+ mallar', '30+ språk', 'Enkelt UI', 'Billigast pro'],
    pros: ['Lågt pris', 'Många mallar', 'Lätt att lära sig'],
    cons: ['Modellen är inte topp', 'Begränsad kontext'],
    offer: { title: '10K ord gratis varje månad', price: 'Gratis · Unlimited 9 USD/mån', bestFor: 'Frilansare med tight budget' },
    label: 'Bästa nybörjarvalet',
  },
  deepseek: {
    logo: 'bg-fuchsia-500',
    tags: ['V3', 'Open source', 'Lågt pris', 'API'],
    pros: ['Extremt billigt', 'Open source-vikter', 'Bra på kod'],
    cons: ['Svensk dialog svagare', 'Mindre community'],
    offer: { title: 'API-credits 5 USD gratis', price: 'Gratis · API 0.2 USD/M tokens', bestFor: 'Utvecklare som vill skala' },
    label: 'Bästa pris',
  },

  /* ── Video ────────────────────────────────────────────── */
  'kling-ai': {
    logo: 'bg-red-500',
    ctaName: 'Kling',
    score: 9.4,
    fallbackUrl: 'https://klingai.com',
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
  };
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
  'ai-video': [
    {
      slug: 'heygen-virtual', title: 'HeyGen', path: '#',
      excerpt: 'Företagsledande AI-avatarer för utbildningar, säljvideor och kundkommunikation.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'synthesia-virtual', title: 'Synthesia', path: '#',
      excerpt: 'AI-avatarer på 140+ språk — branschstandard för intern utbildning och L&D.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'luma-virtual', title: 'Luma Dream Machine', path: '#',
      excerpt: 'Realistisk text-till-video med imponerande fysik och naturlig kamerarörelse.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'invideo-virtual', title: 'InVideo', path: '#',
      excerpt: 'Social media-video direkt från text-prompt — färdiga mallar för TikTok, Reels, Shorts.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'firefly-video-virtual', title: 'Adobe Firefly Video', path: '#',
      excerpt: 'Adobes AI-video integrerad i Premiere Pro och Creative Cloud — kommersiellt säker.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
    {
      slug: 'kaiber-virtual', title: 'Kaiber', path: '#',
      excerpt: 'Musikvideor och artistinnehåll — synkad rörelse till takten, optimerat för konstnärer.',
      featured_image: null, category: null, published_at: null,
      affiliate_url: null, rating: null, isUpcoming: true,
    },
  ],
};

// Extend KNOWN profiles with scores/labels/CTA-names for the virtual children
// so they sort and render consistently with curated real tools.
const VIRTUAL_KNOWN: Record<string, Partial<ToolProfile>> = {
  'heygen-virtual': {
    logo: 'bg-purple-600', ctaName: 'HeyGen', score: 8.7,
    fallbackUrl: 'https://www.heygen.com',
    tags: ['Avatarer', 'Företag', '40+ språk', 'Talking heads'],
    pros: ['Realistiska avatarer', 'Bred språkstöd', 'Stark för säljvideo'],
    cons: ['Smalt användningsområde', 'Pris hoppar snabbt'],
    offer: { title: 'Gratis 3 min/månad', price: 'Gratis · Creator 29 USD/mån', bestFor: 'AI-avatarer för företag' },
    label: 'Bäst för avatarer',
  },
  'synthesia-virtual': {
    logo: 'bg-blue-600', ctaName: 'Synthesia', score: 8.5,
    fallbackUrl: 'https://www.synthesia.io',
    tags: ['230+ avatarer', '140 språk', 'L&D', 'Enterprise'],
    pros: ['Branschstandard för utbildning', 'Säker för enterprise', 'Massiv språkbredd'],
    cons: ['Dyrt för småteam', 'Mindre rörlig än konkurrenter'],
    offer: { title: '36 min gratis', price: 'Gratis · Starter 22 USD/mån', bestFor: 'AI-avatarer för utbildning' },
    label: 'Bäst för L&D',
  },
  'luma-virtual': {
    logo: 'bg-cyan-600', ctaName: 'Luma', score: 8.4,
    fallbackUrl: 'https://lumalabs.ai',
    tags: ['Dream Machine', 'Realism', 'Image-to-video', 'Genesis'],
    pros: ['Naturlig fysik och rörelse', 'Stark image-to-video', 'Bra pris'],
    cons: ['Kortare clips', 'Mindre stilkontroll'],
    offer: { title: '30 generationer gratis', price: 'Gratis · Standard 30 USD/mån', bestFor: 'Realistisk text-till-video' },
    label: 'Bäst för naturlig rörelse',
  },
  'invideo-virtual': {
    logo: 'bg-orange-600', ctaName: 'InVideo', score: 8.0,
    fallbackUrl: 'https://invideo.io',
    tags: ['Sociala medier', 'TikTok/Reels', 'Mallar', 'AI-röster'],
    pros: ['Snabbt social media-flöde', '5000+ mallar', 'Inbyggda röster'],
    cons: ['Lägre kvalitet per generering', 'Vattenstämpel i gratis'],
    offer: { title: '4h video/månad gratis', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Social media-video i volym' },
    label: 'Bäst för social media',
  },
  'firefly-video-virtual': {
    logo: 'bg-rose-600', ctaName: 'Firefly Video', score: 7.8,
    fallbackUrl: 'https://firefly.adobe.com',
    tags: ['Adobe', 'Premiere Pro', 'Generative Extend', 'Kommersiellt säker'],
    pros: ['Inbyggt i Premiere Pro', 'Tränad på licensierat material', 'Bäst för pro-workflows'],
    cons: ['Kräver Creative Cloud', 'Mindre kraftfull stand-alone'],
    offer: { title: 'Ingår i Creative Cloud', price: 'CC 60 USD/mån', bestFor: 'Adobe-användare och pro-team' },
    label: 'Bäst för Creative Cloud',
  },
  'kaiber-virtual': {
    logo: 'bg-amber-600', ctaName: 'Kaiber', score: 7.5,
    fallbackUrl: 'https://kaiber.ai',
    tags: ['Musikvideo', 'Beat sync', 'Animation', 'Artister'],
    pros: ['Synkar till musik', 'Konstnärlig estetik', 'Spotify-integration'],
    cons: ['Smalt användningsområde', 'Mindre realistisk'],
    offer: { title: '7 dagar Pro gratis', price: 'Gratis · Pro 15 USD/mån', bestFor: 'Musiker och artister' },
    label: 'Bäst för musikvideor',
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

  return (
    <article className="bg-muted text-fg">
      <Hero
        article={a}
        crumbs={crumbs}
        toolsCount={ranked.length}
        monthLabel={monthLabel}
        updatedYear={updatedYear}
        facts={facts}
      />

      {ranked.length > 0 && (
        <RankingSection ranked={ranked} year={updatedYear} />
      )}

      {top && <BestInTest child={top} />}

      {ranked.length > 0 && <ComparisonTable ranked={ranked} />}

      <EditorialSection article={a} ranked={ranked} />
    </article>
  );
}

/* ─── Sections ─────────────────────────────────────────────────── */

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
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              <span aria-hidden>✦</span>
              Uppdaterad {monthLabel} · {toolsCount} verktyg testade
            </span>

            <h1 className="mt-6 text-balance text-5xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-7xl">
              {highlightTitle(a.title)}
            </h1>

            {a.excerpt && (
              <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle">
                {a.excerpt}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 self-end lg:grid-cols-3 lg:gap-4">
            <StatBox value={String(toolsCount)} label="Verktyg" />
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
        <h2 id="topplistan" className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
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
              className="text-xl font-black uppercase tracking-tight text-fg hover:text-indigo-600"
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
          {child.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-fg-subtle">
              {child.excerpt}
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
            <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
              {name}
            </h3>
            {child.excerpt && (
              <p className="mt-2 max-w-2xl text-fg-subtle">{child.excerpt}</p>
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
          className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl"
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
 *  globals and arbitrary scripts out of the page. */
function sanitizeWpHtml(html: string): string {
  return html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function EditorialSection({
  article: a,
  ranked,
}: {
  article: Article;
  ranked: HubChild[];
}) {
  const html = a.content_mdx ? sanitizeWpHtml(a.content_mdx) : '';
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
          className="text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl"
        >
          Recensioner
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-faint sm:inline">
          Verktyg för verktyg
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:gap-14">
        {/* Editorial body — hub's own content_mdx in magazine typography */}
        <div className="min-w-0">
          <div className="magazine-prose">
            <div
              className="
                prose prose-lg max-w-none
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
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

        {/* Sidebar — Snabbval + Newsletter */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
          <Snabbval ranked={ranked} />
          <NewsletterBox />
        </aside>
      </div>
    </section>
  );
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
      <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-fg">
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
      <h3 className="text-xl font-black uppercase tracking-tight text-fg">
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
