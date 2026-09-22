/**
 * Vilken mall en sida får: URL-sektion + djup + typ + förälder. Flyttad ur
 * app/[...slug]/page.tsx (en page-fil får inte exportera annat än Nexts egna
 * namn) så att artikelmallen kan avgöra vilka länkar som går till en
 * recension — 'Verktyg i guiden' och topplistblocket (lib/review-refs.ts)
 * använder exakt samma regel som routingen.
 */
import { isYrkesRollSlug } from '@/components/templates/YrkesRollTemplate';
import { isStandaloneSlug } from '@/components/templates/StandalonePageTemplate';

/* ── Curated hub topplistor ─────────────────────────────────────
   Hub paths whose topplista is a hand-picked subset of the real tool
   reviews (fetched by slug) instead of every parent_slug child. Two uses:

   1. Depth-3 subcategory hubs (e.g. /ai-verktyg/marknadsforing/seo) — the
      dedicated landing pages for subtopics that carried Google traffic under
      the old /foretag/yrke/* taxonomy. classify() would otherwise treat a
      depth-3 path as a tool review, so they're also listed in SUBHUB_PATHS
      below to force the 'hub' kind. The old /foretag/yrke/* 301s point here.

   2. The two parent nav-hubs (/ai-verktyg/marknadsforing, /ai-verktyg/ekonomi)
      — already 'hub' via the depth-2 rule, but curated to a BROAD, cross-
      functional selection so they point down to the subcategories rather than
      competing with them (the marknadsföring list deliberately omits the
      SEO-specific crawler/keyword tools, which live on the SEO subpage).

   In every case the tools keep their own URLs and parent_slug — no
   reparenting. HubTemplate re-sorts each list by score. */
export const CURATED_HUB_TOOL_SLUGS: Record<string, string[]> = {
  // ── Depth-3 subcategory hubs ──
  '/ai-verktyg/marknadsforing/seo': [
    'semrush-ai', 'surfer-seo', 'ahrefs-ai', 'clearscope', 'frase-io',
    'neuronwriter', 'marketmuse', 'rankmath-ai', 'screaming-frog-ai',
  ],
  '/ai-verktyg/marknadsforing/content-copywriting': [
    'claude', 'jasper-content', 'copy-ai', 'writesonic',
    'koala-writer', 'rytr-content', 'hypotenuse-ai', 'anyword', 'contentatscale',
  ],
  '/ai-verktyg/marknadsforing/annonser': [
    'adcreative-ai', 'pencil-ai', 'persado', 'smartly-io', 'albert-ai',
    'motionapp', 'madgicx', 'revealbot',
  ],
  '/ai-verktyg/marknadsforing/sociala-medier': [
    'hootsuite-ai', 'buffer-ai', 'predis-ai', 'flick-ai', 'lately-ai',
    'ocoya', 'postwise', 'taplio', 'fedica',
  ],
  '/ai-verktyg/ekonomi/bokforing': [
    'fortnox-ai', 'visma-ai', 'bokio-ai', 'dooer', 'speedledger-ai',
    'billogram-ai', 'wint-ai', 'pleo-ai',
  ],
  '/ai-verktyg/ekonomi/redovisning': [
    'fortnox-redovisning', 'pw-ai', 'deloitte-ai', 'kpmg-ai', 'ey-ai',
    'xero-ai', 'quickbooks-ai', 'taxdome-ai',
  ],

  // ── Parent nav-hubs: broad cross-section, not subcategory-specific ──
  '/ai-verktyg/marknadsforing': [
    'chatgpt', 'claude', 'jasper-content',
    'copy-ai', 'anyword', 'adcreative-ai', 'madgicx',
    'hootsuite-ai', 'buffer-ai', 'ocoya',
  ],
  '/ai-verktyg/ekonomi': [
    'fortnox-ai', 'visma-ai', 'bokio-ai', 'dooer', 'pleo-ai',
    'billogram-ai', 'wint-ai', 'fortnox-redovisning', 'xero-ai', 'quickbooks-ai',
  ],

  // ── Kategori-hubbar (batch 3): blandar nya recensioner med befintliga
  //    flata reviews (ChatGPT, Claude … skapas inte om). Se seed-category-hubs-3.ts.
  '/ai-verktyg/ai-assistenter': [
    'chatgpt', 'claude', 'gemini', 'perplexity', 'microsoft-copilot',
    'meta-ai', 'mistral-le-chat', 'deepseek', 'grok', 'pi-ai',
  ],
  '/ai-verktyg/rost-och-tal': [
    'elevenlabs', 'murf-ai', 'speechify', 'resemble-ai',
    'wellsaid-labs', 'lovo-ai', 'voicemaker', 'amazon-polly',
  ],
  '/ai-verktyg/podcast-ljudredigering': [
    'descript', 'adobe-podcast', 'riverside-fm', 'cleanvoice-ai', 'auphonic',
    'podcastle', 'alitu', 'headliner', 'buzzsprout-ai', 'otter-ai',
  ],
  '/ai-verktyg/produktivitet': [
    'notion-ai', 'obsidian-ai', 'mem-ai', 'reclaim-ai', 'todoist-ai',
    'sunsama', 'motion', 'akiflow', 'cron', 'reflect',
  ],
  '/ai-verktyg/e-postmarknadsforing': [
    'mailchimp-ai', 'klaviyo-ai', 'activecampaign-ai', 'brevo-ai', 'hubspot-email',
    'instantly-ai', 'lemlist', 'smartlead', 'lavender', 'warmer-ai',
  ],
  '/ai-verktyg/dataanalys': [
    'tableau-ai', 'power-bi-copilot', 'looker-ai', 'julius-ai', 'obviously-ai',
    'datarobot', 'h2o-ai', 'akkio', 'polymer', 'rows-ai',
  ],
  '/ai-verktyg/utbildning': [
    'khan-academy-ai', 'duolingo-ai', 'coursera-ai', 'synthesis-ai', 'khanmigo',
    'quizlet-ai', 'socratic', 'photomath-ai', 'grammarly', 'turnitin-ai',
  ],
};

/* Depth-3 subcategory hubs that classify() must treat as 'hub' rather than
   the depth-3 'review' fallback. Parent hubs (depth 2) are already 'hub'. */
export const SUBHUB_PATHS = new Set(
  Object.keys(CURATED_HUB_TOOL_SLUGS).filter(
    (p) => p.split('/').filter(Boolean).length === 3
  )
);


/* ── Route classification ──────────────────────────────────────
   Pages are mapped to templates by URL section + depth + children.
   Specific-path handlers run first, then section rules, then a depth
   fallback. Each branch eagerly returns to keep the flow flat. */

export type Kind =
  | 'masterHub'
  | 'foretagHub'
  | 'yrkesHub'
  | 'yrkesRoll'
  | 'gratisHub'
  | 'hub'
  | 'review'
  | 'standalone'
  | 'about'
  | 'contact'
  | 'guideHub'
  | 'article';

export function classify(path: string, depth: number, articleType: 'post' | 'page', slug: string, parentSlug: string | null): {
  kind: Kind;
  reason: string;
} {
  // Posts always go to ArticleTemplate
  if (articleType === 'post') return { kind: 'article', reason: 'type=post' };

  // Curated subcategory hubs (depth-3 under marknadsforing/ekonomi) — listed
  // explicitly so they win over the depth-3 "review" fallback below.
  if (SUBHUB_PATHS.has(path)) {
    return { kind: 'hub', reason: 'curated subcategory hub' };
  }

  // Static section landings — about, contact, and AI-Guiden hub
  if (path === '/om-oss') return { kind: 'about', reason: '/om-oss about page' };
  if (path === '/kontakt') return { kind: 'contact', reason: '/kontakt contact page' };
  if (path === '/ai-guiden') return { kind: 'guideHub', reason: '/ai-guiden guide hub' };

  // /ai-guiden/[slug] → StandalonePageTemplate with siblings as related
  if (path.startsWith('/ai-guiden/') && depth === 2) {
    return { kind: 'standalone', reason: '/ai-guiden/[slug] longread' };
  }

  // /ai-verktyg — master index page with curated category grid
  if (path === '/ai-verktyg') return { kind: 'masterHub', reason: '/ai-verktyg master hub' };

  // /ai-verktyg/foretag — B2B hub with yrke grid
  if (path === '/ai-verktyg/foretag') return { kind: 'foretagHub', reason: '/foretag B2B hub' };

  // /ai-verktyg/foretag/yrke — yrkes-hub (existing template)
  if (path === '/ai-verktyg/foretag/yrke') return { kind: 'yrkesHub', reason: 'yrkes-hub path' };

  // /ai-verktyg/foretag/yrke/[yrke] tree:
  //   depth 4 — yrkesroll landing (marknadsforing, ekonomi-redovisning).
  //             If a YrkesRollSpec is registered for the slug, render the
  //             discovery template (subcategory grid + top-picks); else
  //             fall back to the topic hub layout.
  //   depth 5 — topic hub (seo, content-copywriting, bokforing, …).
  //   depth 6+ — individual tool review.
  if (path.startsWith('/ai-verktyg/foretag/yrke/')) {
    if (depth === 4 && isYrkesRollSlug(slug)) {
      return { kind: 'yrkesRoll', reason: '/foretag/yrke/[yrke] yrkesroll landing' };
    }
    if (depth >= 4 && depth <= 5) {
      return { kind: 'hub', reason: '/foretag/yrke/* hub (depth 4-5)' };
    }
    if (depth >= 6) {
      return { kind: 'review', reason: '/foretag/yrke/*/* review (depth 6+)' };
    }
  }

  // Remaining /ai-verktyg/foretag/* (depth 2 already handled above) → article
  if (path.startsWith('/ai-verktyg/foretag/')) {
    return { kind: 'article', reason: '/ai-verktyg/foretag fallback' };
  }

  // /ai-verktyg/gratis — navigeringshub (subkategori-grid + top-5 + guide),
  // egen template GratisHubTemplate.
  if (path === '/ai-verktyg/gratis') {
    return { kind: 'gratisHub', reason: '/ai-verktyg/gratis nav-hub' };
  }
  // Eventuella sub-paths under /ai-verktyg/gratis/ behåller artikelmallen.
  if (path.startsWith('/ai-verktyg/gratis/')) {
    return { kind: 'article', reason: '/ai-verktyg/gratis/* sub-page → ArticleTemplate' };
  }

  // /ai-video som depth-1 hub (specialfall — andra hubbar är depth 2)
  if (path === '/ai-video') return { kind: 'hub', reason: '/ai-video depth-1 hub' };

  // /ai-video/* depth 2 → review
  if (path.startsWith('/ai-video/') && depth === 2) {
    return { kind: 'review', reason: '/ai-video/[tool] depth-2 review' };
  }

  // /ai-verktyg/[kategori] depth 2 → hub
  if (path.startsWith('/ai-verktyg/') && depth === 2) {
    // After review-flattening, depth-2 under /ai-verktyg holds BOTH the category
    // hubs (parent_slug='ai-verktyg') and the flattened tool reviews (which keep
    // their category hub as parent_slug). Discriminate on parent_slug — no DB
    // children-count needed.
    if (parentSlug && parentSlug !== 'ai-verktyg') {
      return { kind: 'review', reason: '/ai-verktyg/[slug] flattened review (parent_slug≠ai-verktyg)' };
    }
    return { kind: 'hub', reason: '/ai-verktyg/[kategori] depth-2 hub' };
  }

  // /ai-verktyg/[kategori]/[tool] depth 3+ → review
  if (path.startsWith('/ai-verktyg/') && depth >= 3) {
    return { kind: 'review', reason: '/ai-verktyg/[kategori]/[tool] depth-3+ review' };
  }

  // Depth-1 standalone guides (no parent, longread/guide format)
  if (depth === 1 && isStandaloneSlug(slug)) {
    return { kind: 'standalone', reason: 'depth-1 standalone guide' };
  }

  // Default — posts, standalone depth-1 guides not in the registry, master indexes
  return { kind: 'article', reason: 'default → ArticleTemplate' };
}

/** Är raden en verktygsrecension (renderas av ReviewTemplate)? */
export function isReviewRow(r: { path: string; type: string; slug: string; parent_slug: string | null }): boolean {
  if (r.type !== 'post' && r.type !== 'page') return false;
  const depth = r.path.split('/').filter(Boolean).length;
  return classify(r.path, depth, r.type, r.slug, r.parent_slug).kind === 'review';
}
