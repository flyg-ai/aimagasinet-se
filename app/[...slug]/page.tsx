import { cache } from 'react';
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
} from '@/components/templates/StandalonePageTemplate';
import { MasterHubTemplate } from '@/components/templates/MasterHubTemplate';
import { ForetagHubTemplate } from '@/components/templates/ForetagHubTemplate';
import {
  YrkesRollTemplate,
  getYrkesRollSpec,
} from '@/components/templates/YrkesRollTemplate';
import { GratisHubTemplate } from '@/components/templates/GratisHubTemplate';
import { AboutTemplate } from '@/components/templates/AboutTemplate';
import { ContactTemplate } from '@/components/templates/ContactTemplate';
import { GuideHubTemplate } from '@/components/templates/GuideHubTemplate';
import { parseRating, toolNameFromTitle } from '@/lib/rating';
import { categoryLabel } from '@/components/CategoryBadge';
import { fetchAuthor, fetchAuthorsMap } from '@/lib/authors';
import { classify, CURATED_HUB_TOOL_SLUGS } from '@/lib/route-kind';
import { contentModifiedIso } from '@/lib/format-date';

export const revalidate = 3600;

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

/** cache() dedupliceras per rendering. Utan den korde bade generateMetadata
 *  och sidkomponenten var sin identiska fraga som hamtar hela raden, inklusive
 *  content_mdx pa upp mot 10 kB — tva gangers arbete for varje sidvisning.
 *  Next dedupliceras bara fetch(), inte Supabase-anrop. */
const getArticle = cache(async (path: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('path', path)
    .maybeSingle();
  if (error) console.error('[getArticle] supabase error:', error.message);
  return data;
});

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

/** Fetch a hand-picked set of tool reviews by slug for a curated subcategory
 *  hub (SUBHUB_TOOL_SLUGS). Same shape as getHubChildren — content_mdx drives
 *  rating + ReviewsSection snippet. Order is irrelevant: HubTemplate re-sorts
 *  the topplistan by score. */
async function getCuratedChildren(slugs: string[]): Promise<HubChild[]> {
  const tryQuery = async (withAffiliate: boolean) => {
    const cols = CARD_COLS + (withAffiliate ? ',affiliate_url' : '') + ',content_mdx';
    return supabase.from('articles').select(cols).in('slug', slugs);
  };
  let { data, error } = await tryQuery(true);
  if (error && /affiliate_url/.test(error.message)) {
    ({ data, error } = await tryQuery(false));
  }
  if (error) {
    console.error('[getCuratedChildren] supabase error:', error.message);
    return [];
  }
  const rows = (data ?? []) as unknown as (ArticleCardData & {
    content_mdx?: string | null;
  })[];
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

/** Same-category published posts for the ArticleTemplate sidebar
 *  ("Relaterade artiklar"). Excludes the current article. */
async function getRelated(category: string | null, excludeSlug: string): Promise<ArticleCardData[]> {
  if (!category) return [];
  const { data, error } = await supabase
    .from('articles')
    .select(CARD_COLS)
    .eq('category', category)
    .eq('type', 'post')
    .neq('slug', excludeSlug)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(6);
  if (error) { console.error('[getRelated] supabase error:', error.message); return []; }
  return (data ?? []) as unknown as ArticleCardData[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = pathFromParams(params.slug);
  const a = await getArticle(path);
  if (!a) return {};
  const depth = path.split('/').filter(Boolean).length;
  const kind = classify(path, depth, a.type, a.slug, a.parent_slug).kind;

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

  // Next.js *replaces* parent openGraph entirely (no deep merge), so we
  // always emit an image.
  //
  // og_image ar den genererade delningsbilden (scripts/generate-og-images.ts).
  // featured_image gar inte att aterbruka for det: ReviewTemplate renderar den
  // som kvadratisk logotyp pa verktygssidor, inte som banner. Utan nagondera
  // faller vi tillbaka pa sajtikonen, vilket gjorde att 293 verktygssidor
  // visade AI-Magasinets logga nar de delades.
  //
  // Kolumnen finns forst efter migration 0020; dessforinnan ar den undefined
  // och kedjan faller igenom till ikonen som tidigare.
  const ogImage = a.featured_image ?? a.og_image ?? '/apple-icon.png';

  // Google News: news_keywords = kategori + taggar (endast för nyhetsinlägg).
  const newsKeywords =
    a.type === 'post'
      ? [a.category ? categoryLabel(a.category) : null, ...(a.tags ?? [])]
          .filter(Boolean)
          .join(', ')
      : '';

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
      siteName: 'AI-Magasinet',
      locale: 'sv_SE',
      publishedTime: a.published_at || undefined,
      modifiedTime: contentModifiedIso(a) || a.published_at || undefined,
      section: a.category ? categoryLabel(a.category) : undefined,
      tags: a.tags ?? undefined,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(newsKeywords ? { other: { news_keywords: newsKeywords } } : {}),
  };
}

/** Utan den har exporten ar rutten dynamiskt renderad — `ƒ /[...slug]` i
 *  bygglistan — och da har `revalidate = 300` ingen verkan alls. Varje
 *  sidvisning kordes mot Supabase och renderades om, vilket syntes rakt av i
 *  Vercels Fluid CPU: taket for gratisplanen slogs i pa en sajt med ett par
 *  hundra besok om dagen.
 *
 *  Med listan pa plats forrenderas sidorna vid bygget och revalideras var
 *  femte minut. `dynamicParams` ar sant som standard, sa artiklar som cronen
 *  publicerar mellan tva bygganden renderas pa forsta traffen och cachas
 *  darefter — de behover inte finnas i listan. */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const rows: { path: string }[] = [];
  // PostgREST tar max 1000 rader per svar.
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('articles')
      .select('path')
      .not('published_at', 'is', null)
      .order('path')
      .range(from, from + 999);
    if (error) {
      // Bygget ska inte falla om databasen strular — utan lista blir rutten
      // dynamisk igen, vilket ar samma lage som innan.
      console.error('[generateStaticParams] supabase error:', error.message);
      break;
    }
    rows.push(...((data ?? []) as { path: string }[]));
    if (!data || data.length < 1000) break;
  }
  return rows
    .map((r) => r.path.split('/').filter(Boolean))
    .filter((segs) => segs.length > 0)
    .map((slug) => ({ slug }));
}

export default async function CatchAllPage({ params }: Props) {
  const path = pathFromParams(params.slug);
  const a = await getArticle(path);
  if (!a) notFound();
  // Opublicerat ska inte na lasare. Ingen nyckelkontroll har: att lasa
  // searchParams gor hela rutten dynamiskt renderad och slar ut revalidate=300
  // for samtliga artiklar. Utkast lases pa /utkast/[slug] i stallet.
  if (!a.published_at) notFound();

  const depth = path.split('/').filter(Boolean).length;
  const decision = classify(path, depth, a.type, a.slug, a.parent_slug);


  if (decision.kind === 'about') {
    const authorsMap = await fetchAuthorsMap();
    // Render the editorial team in the order they appear in the
    // authors table — chefredaktör first by virtue of seed order.
    const orderedSlugs = ['nicklas-hallberg', 'erik-lindgren', 'sara-nilsson'];
    const authors = orderedSlugs
      .map((s) => authorsMap.get(s))
      .filter((x): x is NonNullable<typeof x> => x !== undefined);
    return <AboutTemplate article={a} authors={authors} />;
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
    // Static category + yrke grids live in the template now; no DB fetch.
    return <ForetagHubTemplate article={a} />;
  }

  if (decision.kind === 'yrkesHub') {
    return <YrkesHubTemplate article={a} />;
  }

  if (decision.kind === 'yrkesRoll') {
    const spec = getYrkesRollSpec(a.slug)!;
    return <YrkesRollTemplate article={a} spec={spec} />;
  }

  if (decision.kind === 'gratisHub') {
    return <GratisHubTemplate article={a} />;
  }


  if (decision.kind === 'hub') {
    // Always render HubTemplate for hub-classified paths — the template
    // gracefully skips the Ranking/BestInTest/Comparison sections when
    // items + virtuals is empty (e.g. depth-5 yrke pages whose topplista
    // is baked into content_mdx and rendered via the editorial body).
    // Curated hubs (subcategory hubs + the two parent nav-hubs) pull a
    // hand-picked tool subset by slug; every other hub pulls its DB children
    // by parent_slug.
    const curated = CURATED_HUB_TOOL_SLUGS[a.path];
    const items = curated
      ? await getCuratedChildren(curated)
      : await getHubChildren(a.slug);
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

  const [children, author, related] = await Promise.all([
    getChildren(a.slug),
    a.author_slug ? fetchAuthor(a.author_slug) : Promise.resolve(null),
    getRelated(a.category, a.slug),
  ]);
  return <ArticleTemplate article={a} items={children} author={author} related={related} />;
}
