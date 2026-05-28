import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  ArticleCard,
  SidebarArticleCard,
  type ArticleCardData,
} from '@/components/ArticleCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { LoadMoreArticles } from '@/components/LoadMoreArticles';

export const revalidate = 300;

// Layout: 1 hero + 3 sidebar + 20 grid = 24 articles loaded server-side.
// "Ladda fler" then pulls another 20 at a time client-side.
const INITIAL_TOTAL = 24;
const GRID_SIZE = 20;
const LOAD_MORE_PAGE = 20;

export default async function HomePage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path')
    .eq('type', 'post')
    .order('published_at', { ascending: false })
    .limit(INITIAL_TOTAL);

  const list = (articles ?? []) as ArticleCardData[];
  const hero = list[0];
  const sidebar = list.slice(1, 4); // 3 in sidebar
  const grid = list.slice(4, 4 + GRID_SIZE); // up to 20 in grid

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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* ── Hero + sidebar (65 / 35) ──────────────────────── */}
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
                  no image
                </span>
              </div>
            )}
            {/* Bottom gradient + overlay text */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 sm:p-8">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
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

        {/* Sidebar stack */}
        <aside className="flex flex-col gap-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
            ▍ Mer just nu
          </h2>
          {sidebar.map((a) => (
            <SidebarArticleCard key={a.slug} a={a} />
          ))}
        </aside>
      </section>

      {/* ── Section heading ─────────────────────────────── */}
      <div className="mt-14 mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Senaste artiklarna
        </h2>
        <span className="text-xs text-fg-faint">{grid.length} st</span>
      </div>

      {/* ── 3-col grid + Ladda fler ─────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {grid.map((a) => (
          <ArticleCard key={a.slug} a={a} />
        ))}
      </div>

      {grid.length === GRID_SIZE && (
        <LoadMoreArticles startOffset={INITIAL_TOTAL} pageSize={LOAD_MORE_PAGE} />
      )}
    </div>
  );
}
