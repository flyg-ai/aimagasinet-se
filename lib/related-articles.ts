/**
 * Artiklar som länkar TILL en given recension — den omvända frågan mot
 * lib/review-refs.ts (som svarar "vilka recensioner länkar den här artikeln
 * till"). Driver "Nyheter om X" / "Guider med X"-karusellerna längst ner på
 * recensionssidorna (components/templates/ReviewTemplate.tsx).
 *
 * Nyhet/guide avgörs av taggen 'nyhet' eller 'guide' i articles.tags, satt
 * vid publicering — cron-rutten (app/api/cron/generate-articles/route.ts)
 * sätter 'nyhet' automatiskt, guider taggas manuellt i /admin eller vid
 * skript-publicering. En artikel utan någon av taggarna (äldre poster som
 * inte fångades av bakåtfyllnaden) visas inte i någon av karusellerna —
 * hellre tomt än fel.
 */
import { supabase } from '@/lib/supabase';

export type RelatedArticle = {
  slug: string;
  path: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string | null;
  published_at: string;
};

export type RelatedArticles = { news: RelatedArticle[]; guides: RelatedArticle[] };

export const EMPTY_RELATED: RelatedArticles = { news: [], guides: [] };

type Row = RelatedArticle & { tags: string[] | null };

/** Recensionens egna path och slug, båda normaliserade utan snedstreck. */
export async function loadRelatedArticles(reviewPath: string, reviewSlug: string, limit = 8): Promise<RelatedArticles> {
  const path = reviewPath.replace(/\/+$/, '');
  const { data, error } = await supabase
    .from('articles')
    .select('slug,path,title,excerpt,featured_image,category,published_at,tags')
    .eq('type', 'post')
    .is('parent_slug', null)
    .not('published_at', 'is', null)
    .or(`content_mdx.ilike.%${path}/%,content_mdx.ilike.%${path}"%,content_mdx.ilike.%"${reviewSlug}"%`)
    .order('published_at', { ascending: false })
    .limit(200);
  if (error) {
    console.error('[loadRelatedArticles] supabase error:', error.message);
    return EMPTY_RELATED;
  }

  const news: RelatedArticle[] = [];
  const guides: RelatedArticle[] = [];
  for (const r of (data ?? []) as Row[]) {
    const tags = r.tags ?? [];
    const ref: RelatedArticle = { slug: r.slug, path: r.path, title: r.title, excerpt: r.excerpt, featured_image: r.featured_image, category: r.category, published_at: r.published_at };
    if (tags.includes('nyhet') && news.length < limit) news.push(ref);
    else if (tags.includes('guide') && guides.length < limit) guides.push(ref);
  }
  return { news, guides };
}
