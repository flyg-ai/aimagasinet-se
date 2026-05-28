import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';
import { ArticleTemplate } from '@/components/templates/ArticleTemplate';
import {
  HubTemplate,
  type HubChild,
} from '@/components/templates/HubTemplate';
import { ReviewTemplate } from '@/components/templates/ReviewTemplate';
import { YrkesHubTemplate } from '@/components/templates/YrkesHubTemplate';
import {
  StandalonePageTemplate,
  STANDALONE_RELATED_PARENT,
  isStandaloneSlug,
} from '@/components/templates/StandalonePageTemplate';
import { MasterHubTemplate } from '@/components/templates/MasterHubTemplate';
import { ForetagHubTemplate } from '@/components/templates/ForetagHubTemplate';
import {
  YrkesRollTemplate,
  getYrkesRollSpec,
  isYrkesRollSlug,
} from '@/components/templates/YrkesRollTemplate';
import { AboutTemplate } from '@/components/templates/AboutTemplate';
import { ContactTemplate } from '@/components/templates/ContactTemplate';
import { GuideHubTemplate } from '@/components/templates/GuideHubTemplate';
import { parseRating, toolNameFromTitle } from '@/lib/rating';
import { fetchAuthor } from '@/lib/authors';

export const revalidate = 300;

type Props = { params: { slug: string[] } };

// Base columns guaranteed to exist on `articles`. `affiliate_url` is only
// available after migration 0003_affiliate.sql is applied — we tack it on
// optionally via `selectCards()` and fall back gracefully if the column is
// missing, so the page never breaks just because the DDL hasn't been run.
const CARD_COLS =
  'slug,title,excerpt,featured_image,category,published_at,path';

function pathFromParams(segs: string[]): string {
  return '/' + segs.map(decodeURIComponent).join('/');
}

async function getArticle(path: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('path', path)
    .maybeSingle();
  if (error) console.error('[getArticle] supabase error:', error.message);
  return data;
}

/** Select cards, optionally with affiliate_url + content_mdx. Retries without
 *  affiliate_url on "column does not exist" errors. */
async function selectCards(opts: {
  parentSlug: string;
  excludeSlug?: string;
  withContent?: boolean;
}) {
  const extra = (opts.withContent ? ',content_mdx' : '');
  const tryQuery = async (withAffiliate: boolean) => {
    const cols = CARD_COLS + (withAffiliate ? ',affiliate_url' : '') + extra;
    let q = supabase
      .from('articles')
      .select(cols)
      .eq('parent_slug', opts.parentSlug)
      .order('title', { ascending: true });
    if (opts.excludeSlug) q = q.neq('slug', opts.excludeSlug);
    return q;
  };

  let { data, error } = await tryQuery(true);
  if (error && /affiliate_url/.test(error.message)) {
    console.warn(
      '[selectCards] affiliate_url column missing — apply supabase/migrations/0003_affiliate.sql via Supabase Dashboard → SQL Editor to enable affiliate CTAs. Falling back without it.'
    );
    ({ data, error } = await tryQuery(false));
  }
  if (error) {
    console.error('[selectCards] supabase error:', error.message);
    return [];
  }
  return (data ?? []) as unknown as (ArticleCardData & {
    content_mdx?: string | null;
  })[];
}

async function getChildren(parentSlug: string): Promise<ArticleCardData[]> {
  return await selectCards({ parentSlug });
}

async function getHubChildren(parentSlug: string): Promise<HubChild[]> {
  // Fetches content_mdx for two reasons:
  //   1. rating parser scans the body for "X/10" markers
  //   2. ReviewsSection (HubTemplate, bottom of page) extracts an analysis
  //      snippet per child for the review-card grid
  const rows = await selectCards({ parentSlug, withContent: true });
  return rows.map(({ content_mdx, ...rest }) => ({
    ...rest,
    content_mdx: content_mdx ?? null,
    rating: parseRating(content_mdx ?? null),
  }));
}

async function getSiblings(parentSlug: string | null, excludeSlug: string) {
  if (!parentSlug) return [];
  return await selectCards({ parentSlug, excludeSlug });
}

/* ── Route classification ──────────────────────────────────────
   Pages are mapped to templates by URL section + depth + children.
   Specific-path handlers run first, then section rules, then a depth
   fallback. Each branch eagerly returns to keep the flow flat. */

type Kind =
  | 'masterHub'
  | 'foretagHub'
  | 'yrkesHub'
  | 'yrkesRoll'
  | 'hub'
  | 'review'
  | 'standalone'
  | 'about'
  | 'contact'
  | 'guideHub'
  | 'article';

function classify(path: string, depth: number, articleType: 'post' | 'page', slug: string): {
  kind: Kind;
  reason: string;
} {
  // Posts always go to ArticleTemplate
  if (articleType === 'post') return { kind: 'article', reason: 'type=post' };

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

  // /ai-verktyg/gratis/* — gratis-trädet renderas som artikel tills vidare
  if (path === '/ai-verktyg/gratis' || path.startsWith('/ai-verktyg/gratis/')) {
    return { kind: 'article', reason: '/ai-verktyg/gratis tree → ArticleTemplate' };
  }

  // /ai-video som depth-1 hub (specialfall — andra hubbar är depth 2)
  if (path === '/ai-video') return { kind: 'hub', reason: '/ai-video depth-1 hub' };

  // /ai-video/* depth 2 → review
  if (path.startsWith('/ai-video/') && depth === 2) {
    return { kind: 'review', reason: '/ai-video/[tool] depth-2 review' };
  }

  // /ai-verktyg/[kategori] depth 2 → hub
  if (path.startsWith('/ai-verktyg/') && depth === 2) {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = pathFromParams(params.slug);
  const a = await getArticle(path);
  if (!a) return {};
  const depth = path.split('/').filter(Boolean).length;
  const kind = classify(path, depth, a.type, a.slug).kind;

  // Per-template title formatting. Description defaults to excerpt across the
  // board — seo_description wins if explicitly set in the DB.
  const description = a.seo_description || a.excerpt || undefined;
  const year = new Date().getFullYear();

  // Review pages always use the canonical "[Tool] Recension [Year]" format —
  // overrides seo_title because the format is editorial spec. Other templates
  // prefer seo_title when set, fall back to article title. The site-name
  // suffix " | AI-Magasinet" is appended automatically by metadata.title.template
  // in layout.tsx — don't include it here.
  let title: string;
  if (kind === 'review') {
    title = `${toolNameFromTitle(a.title)} Recension ${year}`;
  } else if (a.seo_title) {
    title = a.seo_title;
  } else {
    title = a.title;
  }

  // Canonical / hreflang carry the trailing-slash form (next.config.mjs
  // has trailingSlash: true) so both the canonical link and the
  // hreflang alternate point to the served URL, never the 308-source.
  const canonicalPath = a.path === '/' || a.path.endsWith('/') ? a.path : `${a.path}/`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: { 'sv-SE': canonicalPath },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalPath,
      publishedTime: a.published_at || undefined,
      images: a.featured_image ? [{ url: a.featured_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: a.featured_image ? [a.featured_image] : undefined,
    },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const path = pathFromParams(params.slug);
  const a = await getArticle(path);
  if (!a) notFound();

  const depth = path.split('/').filter(Boolean).length;
  const decision = classify(path, depth, a.type, a.slug);

  console.log('[CatchAllPage]', { path, depth, type: a.type, kind: decision.kind, reason: decision.reason });

  if (decision.kind === 'about') {
    return <AboutTemplate article={a} />;
  }

  if (decision.kind === 'contact') {
    return <ContactTemplate article={a} />;
  }

  if (decision.kind === 'guideHub') {
    // Children of /ai-guiden fill the featured + grid; latest posts in
    // the ai-guiden category fill the bottom row.
    const [guides, latestRes] = await Promise.all([
      getChildren('ai-guiden'),
      supabase
        .from('articles')
        .select(CARD_COLS)
        .eq('category', 'ai-guiden')
        .eq('type', 'post')
        .order('published_at', { ascending: false })
        .limit(6),
    ]);
    const latest = (latestRes.data ?? []) as unknown as ArticleCardData[];
    return <GuideHubTemplate article={a} guides={guides} latest={latest} />;
  }

  if (decision.kind === 'masterHub') {
    return <MasterHubTemplate article={a} />;
  }

  if (decision.kind === 'foretagHub') {
    // Pull yrken (children of /foretag/yrke) + their subtopic children
    // in parallel for the yrke-grid.
    const yrkes = await getChildren('yrke');
    const subtopicsByYrke: Record<string, ArticleCardData[]> = {};
    await Promise.all(
      yrkes.map(async (y) => {
        subtopicsByYrke[y.slug] = await getChildren(y.slug);
      })
    );
    return (
      <ForetagHubTemplate
        article={a}
        yrkes={yrkes}
        subtopicsByYrke={subtopicsByYrke}
      />
    );
  }

  if (decision.kind === 'yrkesHub') {
    return <YrkesHubTemplate article={a} />;
  }

  if (decision.kind === 'yrkesRoll') {
    const spec = getYrkesRollSpec(a.slug)!;
    return <YrkesRollTemplate article={a} spec={spec} />;
  }


  if (decision.kind === 'hub') {
    // Always render HubTemplate for hub-classified paths — the template
    // gracefully skips the Ranking/BestInTest/Comparison sections when
    // items + virtuals is empty (e.g. depth-5 yrke pages whose topplista
    // is baked into content_mdx and rendered via the editorial body).
    const items = await getHubChildren(a.slug);
    return <HubTemplate article={a} items={items} />;
  }

  if (decision.kind === 'review') {
    const siblings = await getSiblings(a.parent_slug, a.slug);
    return <ReviewTemplate article={a} siblings={siblings} />;
  }

  if (decision.kind === 'standalone') {
    // Two ways to populate the sidebar's "Relaterade verktyg":
    //  1. STANDALONE_RELATED_PARENT maps the slug to a parent_slug whose
    //     children fill the list (used by depth-1 longreads).
    //  2. Otherwise, fall back to the article's own siblings. Lets us add
    //     new standalone trees (/ai-guiden/*) without expanding the map.
    const relatedParent = STANDALONE_RELATED_PARENT[a.slug];
    const related = relatedParent
      ? await getChildren(relatedParent)
      : await getSiblings(a.parent_slug, a.slug);
    return <StandalonePageTemplate article={a} related={related} />;
  }

  const [children, author] = await Promise.all([
    getChildren(a.slug),
    a.author_slug ? fetchAuthor(a.author_slug) : Promise.resolve(null),
  ]);
  return <ArticleTemplate article={a} items={children} author={author} />;
}
