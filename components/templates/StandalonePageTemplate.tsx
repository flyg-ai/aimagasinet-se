import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';
import { SidebarArticleCard } from '@/components/ArticleCard';

/** Template for depth-1 standalone guides without a parent (no hub above them).
 *  Layout: wide hero with H1 + ingress, magazine-typography content_mdx, and
 *  a sidebar with related tools from a curated category + newsletter signup.
 *
 *  Related tools come from a `relatedCategorySlug` resolved per slug — guides
 *  about apps get kod-verktyg, faceless-content gets video, etc. */
export function StandalonePageTemplate({
  article: a,
  related,
}: {
  article: Article;
  related: ArticleCardData[];
}) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:gap-14">
          <main className="min-w-0">
            <div className="magazine-prose">
              <div
                className="
                  prose prose-lg max-w-none
                  prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
                  prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-4 sm:prose-h2:text-3xl
                  prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold prose-h3:text-fg
                  prose-p:text-fg-muted prose-p:leading-[1.85] prose-p:text-[17px]
                  prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                  prose-strong:font-bold prose-strong:text-fg
                  prose-em:italic prose-em:text-fg
                  prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
                  prose-ul:my-6 prose-ol:my-6
                  prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
                  prose-hr:my-12 prose-hr:border-line
                  prose-img:rounded-xl prose-img:border prose-img:border-line
                "
                dangerouslySetInnerHTML={{ __html: sanitizeWpHtml(a.content_mdx ?? '') }}
              />
            </div>

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
          </main>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            {related.length > 0 && <RelatedTools related={related} />}
            <NewsletterBox />
          </aside>
        </div>
      </div>
    </article>
  );
}

function Hero({ article: a }: { article: Article }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-indigo-600">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">Guide</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✦</span> Guide · Longread
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {a.title}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            {a.excerpt}
          </p>
        )}

        {a.published_at && (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
            Publicerad{' '}
            {new Date(a.published_at).toLocaleDateString('sv-SE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
      </div>
    </header>
  );
}

function RelatedTools({ related }: { related: ArticleCardData[] }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-1 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
        <span aria-hidden>↗</span> Relaterade verktyg
      </div>
      <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-fg">
        Testa själv
      </h3>
      <div className="flex flex-col gap-3">
        {related.slice(0, 4).map((r) => (
          <SidebarArticleCard key={r.slug} a={r} />
        ))}
      </div>
    </div>
  );
}

function NewsletterBox() {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="mb-3 inline-flex items-center gap-2 text-indigo-600">
        <span aria-hidden className="text-lg">✦</span>
      </div>
      <h3 className="text-xl font-black uppercase tracking-tight text-fg">
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

function sanitizeWpHtml(html: string): string {
  return html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

/** Map standalone-page slugs to a parent_slug whose siblings are the
 *  "related tools" to show in the sidebar. Add new mappings as more
 *  standalone guides ship. */
export const STANDALONE_RELATED_PARENT: Record<string, string> = {
  'bygga-mobilapp-med-ai': 'ai-kod-verktyg',
  'bygga-app-med-ai': 'ai-kod-verktyg',
  'skapa-faceless-content-med-ai': 'ai-video',
};

/** True if the slug should render via StandalonePageTemplate. */
export function isStandaloneSlug(slug: string): boolean {
  return slug in STANDALONE_RELATED_PARENT;
}
