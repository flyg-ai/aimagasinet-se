import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  SidebarArticleCard,
  type ArticleCardData,
} from '@/components/ArticleCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { FilterableGrid } from '@/components/FilterableGrid';
import { TrendingSection } from '@/components/TrendingSection';
import { PopularToolsSidebar } from '@/components/PopularToolsSidebar';
import { CategoryRowsSection } from '@/components/CategoryRowsSection';
import { ShortNewsCarousel } from '@/components/ShortNewsCarousel';
import { MoreToReadSection } from '@/components/MoreToReadSection';
import { readingTimeMinutes } from '@/lib/reading-time';

export const revalidate = 300;

// Layout split: 1 hero + 3 sidebar + 20 initial grid = 24 articles loaded
// server-side WITH content_mdx (so we can compute reading_time). A
// separate cheap fetch grabs 60 article rows without content_mdx as a
// pool for the per-category rows + short-news carousel.
const INITIAL_TOTAL = 24;
const POOL_SIZE = 60;
const GRID_SIZE = 20;
const LOAD_MORE_PAGE = 20;

type RawArticle = ArticleCardData & { content_mdx: string | null };

export default async function HomePage() {
  const [primaryRes, poolRes] = await Promise.all([
    supabase
      .from('articles')
      .select('slug,title,excerpt,featured_image,category,published_at,path,content_mdx')
      .eq('type', 'post')
      .order('published_at', { ascending: false })
      .limit(INITIAL_TOTAL),
    supabase
      .from('articles')
      .select('slug,title,excerpt,featured_image,category,published_at,path')
      .eq('type', 'post')
      .order('published_at', { ascending: false })
      .limit(POOL_SIZE),
  ]);

  // Strip content_mdx after computing reading_time — keeps client payload small.
  const list: ArticleCardData[] = ((primaryRes.data ?? []) as RawArticle[]).map((a) => {
    const { content_mdx, ...rest } = a;
    return { ...rest, reading_time: readingTimeMinutes(content_mdx) };
  });

  // Pool is used in CategoryRowsSection + ShortNewsCarousel — no
  // reading_time on those cards, so content_mdx isn't needed.
  const pool: ArticleCardData[] = (poolRes.data ?? []) as ArticleCardData[];

  const hero = list[0];
  const sidebar = list.slice(1, 4);
  const grid = list.slice(4, 4 + GRID_SIZE);
  const trending = list.slice(1, 4);
  // Short news = items 6..18 from the pool, skipping the ones we already
  // show in the hero + top-of-grid so the carousel feels fresh.
  const shortNews = pool.slice(6, 18);

  if (!hero) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-fg-subtle">
          Inga artiklar än. Kör{' '}
          <code className="font-mono text-accent">npm run import</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Band 1: Hero + sidebar — bg-white default ───────── */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.85fr_1fr]">
          {/* Big hero */}
          <Link
            href={hero.path}
            className="card group relative block overflow-hidden rounded-xl border border-line bg-card hover:border-line-strong"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-soft">
              {hero.featured_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero.featured_image}
                  alt=""
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-fg-faint">
                  <span className="font-mono text-xs uppercase tracking-wider">
                    Ingen bild
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 sm:p-8">
                <div className="mb-3 inline-flex flex-wrap items-center gap-3 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/95">
                    ★ Utvalt
                  </span>
                  <CategoryBadge slug={hero.category} size="sm" />
                  {hero.published_at && (
                    <time className="font-mono text-[10px] uppercase tracking-wider text-white/80">
                      {new Date(hero.published_at).toLocaleDateString('sv-SE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                  {hero.reading_time != null && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/80">
                      · {hero.reading_time} min läsning
                    </span>
                  )}
                </div>
                <h1 className="text-balance text-2xl font-black leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {hero.title}
                </h1>
                {hero.excerpt && (
                  <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                    {hero.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>

          <aside className="flex flex-col gap-3">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
              ▍ Mer just nu
            </h2>
            {sidebar.map((a) => (
              <SidebarArticleCard key={a.slug} a={a} />
            ))}
          </aside>
        </section>
      </div>

      {/* ── Band 2: Trending — bg-slate-50 tint ─────────────── */}
      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <TrendingSection items={trending} />
        </div>
      </div>

      {/* ── Band 3: Senaste inom varje kategori — bg-indigo-50/40 ── */}
      <div className="bg-indigo-50/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <CategoryRowsSection pool={pool} />
        </div>
      </div>

      {/* ── Band 4: Dark short-news carousel — bg-zinc-900 ─── */}
      <ShortNewsCarousel items={shortNews} />

      {/* ── Band 5: Main filter grid + popular-tools — bg-white ── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
          <div>
            <FilterableGrid
              initial={grid}
              startOffset={INITIAL_TOTAL}
              pageSize={LOAD_MORE_PAGE}
            />
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PopularToolsSidebar />
          </div>
        </div>
      </div>

      {/* ── Band 6: Mer att läsa — bg-slate-50 tint ─────────── */}
      <div className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <MoreToReadSection trending={trending} />
        </div>
      </div>
    </>
  );
}
