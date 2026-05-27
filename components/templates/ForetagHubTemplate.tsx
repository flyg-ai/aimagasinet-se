import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';

/** B2B-styled hub for /ai-verktyg/foretag.
 *  Header has a more professional/muted tone than the consumer hubs;
 *  the body is a "yrke grid" of professions, each card listing its
 *  subtopics as deep links straight into the depth-5 articles. */
export function ForetagHubTemplate({
  article: a,
  yrkes,
  subtopicsByYrke,
}: {
  article: Article;
  yrkes: ArticleCardData[];
  subtopicsByYrke: Record<string, ArticleCardData[]>;
}) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} yrkeCount={yrkes.length} />

      <YrkeGrid yrkes={yrkes} subtopicsByYrke={subtopicsByYrke} />

      <EditorialBody html={a.content_mdx} />
    </article>
  );
}

function Hero({ article: a, yrkeCount }: { article: Article; yrkeCount: number }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-slate-100 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-sky-700">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <Link href="/ai-verktyg" className="hover:text-sky-700">AI-verktyg</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">För företag</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800">
          <span aria-hidden>◧</span> B2B · {yrkeCount} yrken testade
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {a.title}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-fg-subtle">
            {a.excerpt}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-sky-700">◧</span>
            För nordiska företag
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-fg-faint">⊙</span>
            Oberoende test
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-fg-faint">⚙</span>
            GDPR-fokus
          </span>
        </div>
      </div>
    </header>
  );
}

function YrkeGrid({
  yrkes,
  subtopicsByYrke,
}: {
  yrkes: ArticleCardData[];
  subtopicsByYrke: Record<string, ArticleCardData[]>;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-700">
        Hitta AI för ditt yrke
      </div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Per yrkesroll
        </h2>
      </div>

      {yrkes.length === 0 ? (
        <p className="text-fg-subtle">Inga yrken publicerade ännu.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {yrkes.map((y) => {
            const subs = subtopicsByYrke[y.slug] ?? [];
            return (
              <article
                key={y.slug}
                className="group flex flex-col rounded-xl border border-line bg-card p-6 transition-colors hover:border-sky-300"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-sky-100 text-sky-700"
                  >
                    ◧
                  </span>
                  <Link
                    href={y.path}
                    className="text-xl font-black uppercase tracking-tight text-fg group-hover:text-sky-700"
                  >
                    {cleanYrkeTitle(y.title)}
                  </Link>
                </div>

                {y.excerpt && (
                  <p className="mt-4 text-sm leading-relaxed text-fg-subtle">
                    {y.excerpt}
                  </p>
                )}

                {subs.length > 0 && (
                  <div className="mt-5 border-t border-line-subtle pt-4">
                    <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                      Specialområden
                    </div>
                    <ul className="flex flex-col">
                      {subs.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={s.path}
                            className="flex items-center justify-between gap-2 py-2 text-sm text-fg hover:text-sky-700"
                          >
                            <span>{cleanYrkeTitle(s.title)}</span>
                            <span aria-hidden className="text-fg-faint group-hover:text-sky-700">›</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={y.path}
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-700"
                >
                  Hela yrkesguiden <span aria-hidden>›</span>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/** Strip WP "AI För X — long marketing string" down to a clean role label. */
function cleanYrkeTitle(title: string): string {
  return title.split(/\s+[–—-]\s+|:\s+/)[0].trim();
}

function EditorialBody({ html }: { html: string | null }) {
  if (!html) return null;
  const clean = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return (
    <section
      aria-labelledby="editorial"
      className="mx-auto max-w-3xl px-4 pb-20 sm:px-6"
    >
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-sky-700">
        Redaktionell analys
      </div>
      <h2
        id="editorial"
        className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl"
      >
        AI i svenska B2B-flöden
      </h2>
      <div className="magazine-prose">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-sky-500 prose-h2:pl-4
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-xl prose-h3:font-bold
            prose-p:text-fg-muted prose-p:leading-[1.85] prose-p:text-[17px]
            prose-a:text-sky-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-sky-500
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-sky-300 prose-blockquote:bg-sky-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-hr:my-12 prose-hr:border-line
            prose-img:rounded-xl prose-img:border prose-img:border-line
          "
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
