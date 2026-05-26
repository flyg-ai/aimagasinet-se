import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';
import { ArticleTemplate } from '@/components/templates/ArticleTemplate';
import {
  HubTemplate,
  hasVirtualHubChildren,
  type HubChild,
} from '@/components/templates/HubTemplate';
import { ReviewTemplate } from '@/components/templates/ReviewTemplate';
import { YrkesHubTemplate } from '@/components/templates/YrkesHubTemplate';
import { parseRating } from '@/lib/rating';

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
  // Fetches content_mdx solely to parse the rating — the body is then dropped.
  // HubTemplate's editorial section uses the hub article's own content_mdx,
  // not the children's, so we don't need to ship per-child bodies to the page.
  const rows = await selectCards({ parentSlug, withContent: true });
  return rows.map(({ content_mdx, ...rest }) => ({
    ...rest,
    rating: parseRating(content_mdx ?? null),
  }));
}

async function getSiblings(parentSlug: string | null, excludeSlug: string) {
  if (!parentSlug) return [];
  return await selectCards({ parentSlug, excludeSlug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArticle(pathFromParams(params.slug));
  if (!a) return {};
  return {
    title: a.seo_title || a.title,
    description: a.seo_description || a.excerpt || undefined,
    alternates: { canonical: a.path },
    openGraph: {
      title: a.seo_title || a.title,
      description: a.seo_description || a.excerpt || undefined,
      type: 'article',
      publishedTime: a.published_at || undefined,
      images: a.featured_image ? [{ url: a.featured_image }] : undefined,
    },
  };
}

/* ── Route classification ──────────────────────────────────────
   Pages are mapped to templates by URL section + depth + children.
   Specific-path handlers run first, then section rules, then a depth
   fallback. Each branch eagerly returns to keep the flow flat. */

function classify(path: string, depth: number, articleType: 'post' | 'page'): {
  kind: 'yrkesHub' | 'hub' | 'review' | 'article';
  reason: string;
} {
  // Posts always go to ArticleTemplate
  if (articleType === 'post') return { kind: 'article', reason: 'type=post' };

  // Specific path: yrkes-hub
  if (path === '/ai-verktyg/foretag/yrke') return { kind: 'yrkesHub', reason: 'yrkes-hub path' };

  // /ai-verktyg/foretag/* — företag-trädet renderas som artikel tills vidare
  if (path === '/ai-verktyg/foretag' || path.startsWith('/ai-verktyg/foretag/')) {
    return { kind: 'article', reason: '/ai-verktyg/foretag tree → ArticleTemplate' };
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

  // Default — posts, standalone depth-1 guides, master indexes
  return { kind: 'article', reason: 'default → ArticleTemplate' };
}

export default async function CatchAllPage({ params }: Props) {
  const path = pathFromParams(params.slug);
  const a = await getArticle(path);
  if (!a) notFound();

  const depth = path.split('/').filter(Boolean).length;
  const decision = classify(path, depth, a.type);

  console.log('[CatchAllPage]', { path, depth, type: a.type, kind: decision.kind, reason: decision.reason });

  if (decision.kind === 'yrkesHub') {
    return <YrkesHubTemplate article={a} />;
  }

  if (decision.kind === 'hub') {
    const items = await getHubChildren(a.slug);
    // Hub renders if it has either DB children OR virtual children defined
    // in HubTemplate. Lets early-stage hubs (e.g. ai-automation) show the
    // topplistan from virtuals alone instead of falling back to article.
    if (items.length > 0 || hasVirtualHubChildren(a.slug)) {
      return <HubTemplate article={a} items={items} />;
    }
    console.warn('[CatchAllPage] hub had no children → falling back to ArticleTemplate', { slug: a.slug });
  }

  if (decision.kind === 'review') {
    const siblings = await getSiblings(a.parent_slug, a.slug);
    return <ReviewTemplate article={a} siblings={siblings} />;
  }

  const children = await getChildren(a.slug);
  return <ArticleTemplate article={a} items={children} />;
}
