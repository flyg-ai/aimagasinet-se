import { CategoryBadge } from '@/components/CategoryBadge';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';
import type { Article } from '@/lib/supabase';
import { Breadcrumb, buildCrumbs } from './Breadcrumb';
import { ArticleProse } from './ArticleProse';

/** Default template for posts and standalone pages (depth 1 or unknown). */
export function ArticleTemplate({
  article: a,
  items,
}: {
  article: Article;
  items: ArticleCardData[];
}) {
  const crumbs = buildCrumbs(a.path);
  const children = items;

  return (
    <article>
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
          <Breadcrumb crumbs={crumbs} />
          <div className="mb-5 flex items-center gap-3">
            <CategoryBadge slug={a.category} />
            {a.published_at && (
              <time className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                {new Date(a.published_at).toLocaleDateString('sv-SE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>
          <h1 className="text-balance text-3xl font-black leading-[1.1] tracking-tight text-fg sm:text-4xl lg:text-5xl">
            {a.title}
          </h1>
          {a.excerpt && (
            <p className="mt-5 text-balance text-lg leading-relaxed text-fg-muted">
              {a.excerpt}
            </p>
          )}
        </div>
        {a.featured_image && (
          <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.featured_image}
              alt=""
              className="aspect-[16/9] w-full rounded-xl border border-line object-cover"
            />
          </div>
        )}
      </header>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <ArticleProse html={a.content_mdx} />

        {a.tags?.length > 0 && (
          <div className="mt-16 flex flex-wrap gap-2 border-t border-line pt-8">
            <span className="mr-2 font-mono text-xs uppercase tracking-wider text-fg-subtle">
              Taggar:
            </span>
            {a.tags.map((t) => (
              <span
                key={t}
                className="rounded-sm border border-line bg-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {children.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent">
              ▍ Underliggande sidor
            </h2>
            <span className="text-xs text-fg-faint">{children.length} st</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((c) => (
              <ArticleCard key={c.slug} a={c} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
