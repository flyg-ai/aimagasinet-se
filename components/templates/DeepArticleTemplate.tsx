import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';
import { ArticleCard } from '@/components/ArticleCard';
import { Breadcrumb, buildCrumbs } from './Breadcrumb';
import { ArticleProse } from './ArticleProse';

/** ArticleTemplate variant for deep (depth 4-5) pages under
 *  /ai-verktyg/foretag/yrke/. Adds a sidebar with siblings + newsletter,
 *  so the reader has clear next-clicks instead of dead-ending the page. */
export function DeepArticleTemplate({
  article: a,
  items: childItems,
  siblings,
}: {
  article: Article;
  items: ArticleCardData[];
  siblings: ArticleCardData[];
}) {
  const crumbs = buildCrumbs(a.path);

  return (
    <article>
      <header className="border-b border-line bg-card">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
          <Breadcrumb crumbs={crumbs} />

          {a.published_at && (
            <time className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
              {new Date(a.published_at).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          )}
          <h1 className="mt-2 text-balance text-3xl font-black leading-[1.1] tracking-tight text-fg sm:text-4xl lg:text-5xl">
            {a.title}
          </h1>
          {a.excerpt && (
            <p className="mt-5 max-w-3xl text-balance text-lg leading-relaxed text-fg-muted">
              {a.excerpt}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr,280px] lg:gap-14">
          <main className="min-w-0">
            <ArticleProse html={a.content_mdx} />

            {a.tags?.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-line pt-8">
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

            {childItems.length > 0 && (
              <section className="mt-16">
                <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-sky-700">
                    ▍ Specialområden
                  </h2>
                  <span className="text-xs text-fg-faint">{childItems.length} st</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {childItems.map((c) => (
                    <ArticleCard key={c.slug} a={c} />
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            {siblings.length > 0 && <Siblings siblings={siblings} />}
            <NewsletterBox />
          </aside>
        </div>
      </div>
    </article>
  );
}

function Siblings({ siblings }: { siblings: ArticleCardData[] }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">
        <span aria-hidden>↗</span> Mer i samma kategori
      </div>
      <h3 className="mb-4 text-base font-black uppercase tracking-tight text-fg">
        Liknande guider
      </h3>
      <ul className="flex flex-col">
        {siblings.slice(0, 6).map((s, i) => (
          <li
            key={s.slug}
            className={'py-2 ' + (i !== 0 ? 'border-t border-line-subtle' : '')}
          >
            <Link
              href={s.path}
              className="flex items-start gap-2 text-sm text-fg hover:text-sky-700"
            >
              <span aria-hidden className="mt-1 shrink-0 text-fg-faint">›</span>
              <span className="flex-1 leading-snug">{cleanTitle(s.title)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function cleanTitle(title: string): string {
  return title.split(/\s+[–—-]\s+|:\s+/)[0].trim();
}

function NewsletterBox() {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="mb-3 inline-flex items-center gap-2 text-indigo-600">
        <span aria-hidden className="text-lg">✦</span>
      </div>
      <h3 className="text-base font-black uppercase tracking-tight text-fg">
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
