import Link from 'next/link';
import { CategoryBadge, categoryLabel } from '@/components/CategoryBadge';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { JsonLd } from '@/components/JsonLd';
import { Toc } from '@/components/Toc';
import type { Article } from '@/lib/supabase';
import type { Author } from '@/lib/authors';
import { articleSchema, newsArticleSchema, breadcrumbSchema } from '@/lib/schemas';
import { buildToc } from '@/lib/toc';
import { toolLinkCards } from '@/lib/article-html';
import { readingTimeMinutes } from '@/lib/reading-time';
import { Breadcrumb, buildCrumbs } from './Breadcrumb';
import { ArticleProse } from './ArticleProse';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
}
/** True when two ISO timestamps fall on the same calendar day — used to hide a
 *  redundant "Senast uppdaterad" when it equals the publish date. */
function sameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

/** Default template for posts and standalone pages (depth 1 or unknown).
 *  Tech-news layout: full-width hero image, lead + byline, prose body with a
 *  sticky ToC + related-articles sidebar on desktop. */
export function ArticleTemplate({
  article: a,
  items,
  author,
  related,
}: {
  article: Article;
  items: ArticleCardData[];
  /** Joined from articles.author_slug → authors. */
  author?: Author | null;
  /** Same-category posts for the sidebar "Relaterade artiklar". */
  related?: ArticleCardData[];
}) {
  const crumbs = buildCrumbs(a.path);
  const children = items;
  const minutes = readingTimeMinutes(a.content_mdx);

  // Inject heading ids (→ ToC anchors) and turn standalone internal tool links
  // into cards, in that order so the card transform sees the id-rewritten HTML.
  const toc = buildToc(a.content_mdx ?? '');
  const bodyHtml = toolLinkCards(toc.html);

  // schema.org — Article + NewsArticle (Speakable) + breadcrumb. keywords =
  // category + tags so they flow into the schema keywords / news_keywords.
  const schemaInput = {
    title: a.title,
    excerpt: a.excerpt,
    path: a.path,
    featured_image: a.featured_image,
    published_at: a.published_at,
    updated_at: a.updated_at ?? null,
    category: a.category,
    keywords: [a.category ? categoryLabel(a.category) : null, ...(a.tags ?? [])].filter(
      (x): x is string => !!x,
    ),
  };
  const schemas: unknown[] = [
    articleSchema(schemaInput, author ?? null),
    newsArticleSchema(schemaInput, author ?? null),
  ];
  if (crumbs.length > 0) {
    schemas.push(breadcrumbSchema([...crumbs, { label: a.title, href: a.path }]));
  }

  return (
    <article>
      <JsonLd data={schemas} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header>
        {a.featured_image && (
          <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
            <div className="relative overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.featured_image}
                alt=""
                className="aspect-[16/9] max-h-[500px] w-full object-cover"
              />
              {/* Kategori-badge + lästid överst på bilden */}
              <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-2 bg-gradient-to-b from-black/55 to-transparent p-4 sm:p-5">
                <CategoryBadge slug={a.category} size="sm" />
                <span className="rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {minutes} min läsning
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-4 pb-10 pt-7 sm:px-6 sm:pt-9">
          <Breadcrumb crumbs={crumbs} />

          {/* När bild saknas: badge + lästid på rad ovanför H1 */}
          {!a.featured_image && (
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <CategoryBadge slug={a.category} />
              <span className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
                {minutes} min läsning
              </span>
            </div>
          )}

          <h1 className="text-balance break-words text-[32px] font-medium leading-[1.12] tracking-tight text-fg sm:text-[42px]">
            {a.title}
          </h1>

          {a.excerpt && (
            <p className="article-lead mt-5 text-balance text-lg leading-relaxed text-fg-subtle">
              {a.excerpt}
            </p>
          )}

          {/* Byline: avatar + namn + datum + senast uppdaterad */}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5">
            {author && (
              <Link href={`/skribenter/${author.slug}/`} className="flex items-center gap-3">
                <AuthorAvatar slug={author.slug} name={author.name} avatarUrl={author.avatar_url} size="md" />
                <span className="text-sm font-bold text-fg hover:text-accent">{author.name}</span>
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle">
              {a.published_at && (
                <time dateTime={a.published_at} className="font-mono uppercase tracking-wider">
                  {fmtDate(a.published_at)}
                </time>
              )}
              {a.updated_at && a.published_at && !sameDay(a.updated_at, a.published_at) && (
                <time dateTime={a.updated_at} className="font-mono font-semibold uppercase tracking-wider text-accent">
                  Senast uppdaterad: {fmtDate(a.updated_at)}
                </time>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body + sidebar ───────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <div className="min-w-0">
            <Toc items={toc.items} variant="mobile" />
            <ArticleProse html={bodyHtml} />

            {a.tags?.length > 0 && (
              <div className="mt-14 flex flex-wrap gap-2 border-t border-line pt-8">
                <span className="mr-2 font-mono text-xs uppercase tracking-wider text-fg-subtle">Taggar:</span>
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

          {/* Sticky sidebar — ToC + relaterade */}
          <aside className="mt-10 lg:mt-0">
            <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
              <Toc items={toc.items} variant="sidebar" />
              {related && related.length > 0 && <RelatedList items={related} />}
            </div>
          </aside>
        </div>
      </div>

      {/* Underliggande sidor (standalone-sidor med barn) */}
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

/** Sidebar list of related (same-category) articles. */
function RelatedList({ items }: { items: ArticleCardData[] }) {
  return (
    <nav aria-label="Relaterade artiklar" className="rounded-xl border border-line bg-card p-5">
      <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
        Relaterade artiklar
      </p>
      <ul className="flex flex-col divide-y divide-line">
        {items.map((r) => (
          <li key={r.slug} className="py-3 first:pt-0 last:pb-0">
            <Link href={r.path} className="group block">
              <span className="block text-sm font-bold leading-snug text-fg group-hover:text-indigo-700">
                {r.title}
              </span>
              {r.published_at && (
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                  {fmtDate(r.published_at)}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
