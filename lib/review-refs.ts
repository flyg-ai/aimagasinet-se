/**
 * Recensionerna som en artikel pekar på: topplistblockens verktyg och alla
 * interna länkar till en recensionssida. Hämtas i EN fråga per rendering
 * (artikelsidan cachas i 3600 s), och betyget räknas med samma funktion som
 * recensionssidan (lib/review-score.ts).
 *
 * Används av ArticleTemplate: topplistblocket (components/ContentBlocks.tsx)
 * slår upp sina rader här, och "Verktyg i guiden" längst ner listar varje
 * recenserat verktyg som artikeln länkar till.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toolNameFromTitle } from '@/lib/rating';
import { resolveToolProfile } from '@/lib/review-profiles';
import { reviewScore, type ReviewScore } from '@/lib/review-score';
import { CURATED_HUB_TOOL_SLUGS, isReviewRow, SUBHUB_PATHS } from '@/lib/route-kind';
import { expandBlocks, normalizeReviewRef, toplistRefs } from '@/lib/content-blocks';

export type ReviewRef = {
  slug: string;
  /** Adressen utan avslutande snedstreck, som i articles.path. */
  path: string;
  name: string;
  /** Kort kategorietikett ("SEO", "AI-video" …) eller null. */
  category: string | null;
  /** Recensionens featured_image (verktygets logga), annars null. */
  image: string | null;
  /** Tailwind-bakgrund för initialen när bild saknas (profilens logo). */
  logoColor: string;
  initial: string;
  score: ReviewScore;
  /** Affiliatelänk (articles.affiliate_url) eller null. */
  affiliateUrl: string | null;
};

export type ReviewIndex = {
  /** Slår upp en normaliserad referens (slug eller adress). */
  get(ref: string): ReviewRef | undefined;
  /** Varje recenserat verktyg artikeln länkar till eller listar, en gång
   *  per verktyg, sorterat på betyg. */
  linked: ReviewRef[];
};

export const EMPTY_REVIEW_INDEX: ReviewIndex = { get: () => undefined, linked: [] };

/** Kategorihubbarna (articles.parent_slug för recensionerna) → etikett. */
const HUB_LABELS: Record<string, string> = {
  'ai-video': 'AI-video',
  'ai-ljud-och-musik': 'Ljud & musik',
  'ai-automation': 'Automation',
  'ai-bild-verktyg': 'AI-bild',
  'ai-kod-verktyg': 'AI-kod',
  'ai-text-verktyg': 'AI-text',
  'ai-assistenter': 'AI-assistenter',
  'ai-verktyg-marknadsforing': 'Marknadsföring',
  'ai-verktyg-ekonomi': 'Ekonomi & redovisning',
  'ai-verktyg-juridik': 'Juridik',
  'ai-verktyg-kundservice': 'Kundservice',
  'ai-verktyg-rekrytering': 'Rekrytering & HR',
  hemsidebyggare: 'Hemsidebyggare',
  presentationer: 'Presentationer',
  motesverktyg: 'Mötesverktyg',
  projektledning: 'Projektledning',
  'e-handel': 'E-handel',
  oversattning: 'Översättning',
  dokumenthantering: 'Dokumenthantering',
  'rost-och-tal': 'Röst & tal',
  crm: 'CRM',
  'podcast-ljudredigering': 'Podcast & ljud',
  dataanalys: 'Dataanalys',
  produktivitet: 'Produktivitet',
  'e-postmarknadsforing': 'E-postmarknadsföring',
  utbildning: 'Utbildning',
  'sociala-medier-hub': 'Sociala medier',
  'ui-ux': 'UI/UX-design',
  gratis: 'Gratis AI-verktyg',
};

/** De kurerade underhubbarna (/ai-verktyg/marknadsforing/seo …) är mer
 *  precisa än föräldern: Semrush är "SEO", inte "Marknadsföring". Gäller bara
 *  verktyg vars förälder är underhubbens förälder — Claude står också i
 *  content-listan men hör hemma under AI-text. */
const SUBHUB_LABELS: Record<string, string> = {
  '/ai-verktyg/marknadsforing/seo': 'SEO',
  '/ai-verktyg/marknadsforing/content-copywriting': 'Content & copy',
  '/ai-verktyg/marknadsforing/annonser': 'Annonser',
  '/ai-verktyg/marknadsforing/sociala-medier': 'Sociala medier',
  '/ai-verktyg/ekonomi/bokforing': 'Bokföring',
  '/ai-verktyg/ekonomi/redovisning': 'Redovisning',
};

const SUBHUB_PARENT: Record<string, string> = {
  '/ai-verktyg/marknadsforing': 'ai-verktyg-marknadsforing',
  '/ai-verktyg/ekonomi': 'ai-verktyg-ekonomi',
};

const SUBHUB_BY_SLUG: Record<string, { label: string; parent: string }> = {};
for (const hub of Array.from(SUBHUB_PATHS)) {
  const label = SUBHUB_LABELS[hub];
  const parent = SUBHUB_PARENT[hub.replace(/\/[^/]+$/, '')];
  if (!label || !parent) continue;
  for (const slug of CURATED_HUB_TOOL_SLUGS[hub] ?? []) SUBHUB_BY_SLUG[slug] ??= { label, parent };
}

export function reviewCategoryLabel(slug: string, parentSlug: string | null): string | null {
  const sub = SUBHUB_BY_SLUG[slug];
  if (sub && sub.parent === parentSlug) return sub.label;
  return parentSlug ? HUB_LABELS[parentSlug] ?? null : null;
}

/** Interna länkar till en möjlig recensionsadress i brödtexten, inklusive
 *  länkarna i blocken. Normaliserade, i ordning, utan dubbletter. */
export function reviewLinkPaths(html: string | null | undefined): string[] {
  if (!html) return [];
  const out: string[] = [];
  for (const m of Array.from(expandBlocks(html).matchAll(/<a\s[^>]*?href="([^"]+)"/gi))) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!/^(?:https?:\/\/(?:www\.)?aimagasinet\.se)?\/ai-(?:verktyg|video)\//i.test(href)) continue;
    const p = normalizeReviewRef(href);
    if (p && p.startsWith('/') && !out.includes(p)) out.push(p);
  }
  return out;
}

type Row = {
  slug: string;
  path: string;
  title: string;
  type: string;
  parent_slug: string | null;
  featured_image: string | null;
  content_mdx: string | null;
  affiliate_url: string | null;
};

function toRef(r: Row): ReviewRef {
  const name = toolNameFromTitle(r.title);
  const profile = resolveToolProfile(r.slug, name);
  return {
    slug: r.slug,
    path: r.path,
    name,
    category: reviewCategoryLabel(r.slug, r.parent_slug),
    image: r.featured_image,
    logoColor: profile.logo,
    initial: (profile.company || name).charAt(0).toUpperCase() || '?',
    score: reviewScore(r),
    affiliateUrl: r.affiliate_url ?? null,
  };
}

/** Högst betyg först; nedlagda och obetygsatta sist; sedan namn. */
export function byScore(a: ReviewRef, b: ReviewRef): number {
  const sa = a.score.discontinued || a.score.score == null ? -1 : a.score.score;
  const sb = b.score.discontinued || b.score.score == null ? -1 : b.score.score;
  return sb - sa || a.name.localeCompare(b.name, 'sv');
}

/** Hämtar recensionerna som brödtexten pekar på, i en fråga. */
export async function loadReviewIndex(html: string | null | undefined): Promise<ReviewIndex> {
  const refs = toplistRefs(html);
  const links = reviewLinkPaths(html);
  const paths = Array.from(new Set([...links, ...refs.filter((r) => r.startsWith('/'))]));
  const slugs = refs.filter((r) => !r.startsWith('/'));
  if (paths.length === 0 && slugs.length === 0) return EMPTY_REVIEW_INDEX;

  // Referenserna är redan normaliserade till [a-z0-9/-], så de går att lägga
  // i PostgREST-filtret; adresserna citeras för snedstrecken.
  const filters: string[] = [];
  if (paths.length) filters.push(`path.in.(${paths.map((p) => `"${p}"`).join(',')})`);
  if (slugs.length) filters.push(`slug.in.(${slugs.join(',')})`);
  const { data, error } = await supabase
    .from('articles')
    .select('slug,path,title,type,parent_slug,featured_image,content_mdx,affiliate_url')
    .or(filters.join(','))
    .not('published_at', 'is', null);
  if (error) {
    console.error('[loadReviewIndex] supabase error:', error.message);
    return EMPTY_REVIEW_INDEX;
  }

  const bySlug = new Map<string, ReviewRef>();
  const byPath = new Map<string, ReviewRef>();
  for (const r of (data ?? []) as Row[]) {
    if (!isReviewRow(r)) continue;
    const ref = toRef(r);
    bySlug.set(ref.slug, ref);
    byPath.set(ref.path, ref);
  }
  const get = (ref: string) => (ref.startsWith('/') ? byPath.get(ref) : bySlug.get(ref));

  const linked: ReviewRef[] = [];
  for (const ref of [...refs, ...links]) {
    const hit = get(ref);
    if (hit && !linked.includes(hit)) linked.push(hit);
  }
  linked.sort(byScore);
  return { get, linked };
}

/** För admin: vilka topplistreferenser saknar en publicerad recension? */
export async function unknownToplistRefs(
  html: string | null | undefined,
  client: SupabaseClient = supabase,
): Promise<string[]> {
  const refs = toplistRefs(html);
  if (refs.length === 0) return [];
  const paths = refs.filter((r) => r.startsWith('/'));
  const slugs = refs.filter((r) => !r.startsWith('/'));
  const filters: string[] = [];
  if (paths.length) filters.push(`path.in.(${paths.map((p) => `"${p}"`).join(',')})`);
  if (slugs.length) filters.push(`slug.in.(${slugs.join(',')})`);
  const { data, error } = await client
    .from('articles')
    .select('slug,path,type,parent_slug')
    .or(filters.join(','))
    .not('published_at', 'is', null);
  if (error) throw new Error(error.message);
  const ok = new Set<string>();
  for (const r of (data ?? []) as Row[]) {
    if (!isReviewRow(r)) continue;
    ok.add(r.slug);
    ok.add(r.path);
  }
  return refs.filter((r) => !ok.has(r));
}
