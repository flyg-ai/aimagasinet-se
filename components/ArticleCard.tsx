import Link from 'next/link';
import { CategoryBadge } from './CategoryBadge';

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string | null;
  published_at: string | null;
  path: string;
  affiliate_url?: string | null;
  /** Pre-computed in the server fetch from content_mdx via readingTimeMinutes(). */
  reading_time?: number | null;
};

export function ArticleCard({ a }: { a: ArticleCardData }) {
  return (
    <Link
      href={a.path}
      className="card group block overflow-hidden rounded-lg border border-line bg-card hover:border-line-strong"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-soft">
        {a.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.featured_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Styled cover for articles without featured_image: indigo gradient
          // + title's first letter as a watermark. Reads as "intentional" instead
          // of "missing image".
          <CardCover title={a.title} />
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <CategoryBadge slug={a.category} size="sm" />
          {a.published_at && (
            <time className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              {new Date(a.published_at).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </time>
          )}
          {a.reading_time != null && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
              · {a.reading_time} min läsning
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold leading-snug tracking-tight text-fg group-hover:text-accent">
          {a.title}
        </h3>
        {a.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-subtle">
            {a.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

/** Cover shown when an article has no featured_image. Picks a stable accent
 *  color from the title hash so adjacent cards don't look identical, and
 *  paints the title's first letter as a watermark. */
function CardCover({ title, small = false }: { title: string; small?: boolean }) {
  const palettes = [
    'from-indigo-500 to-violet-700',
    'from-sky-500 to-indigo-700',
    'from-emerald-500 to-teal-700',
    'from-amber-500 to-rose-600',
    'from-fuchsia-500 to-rose-700',
    'from-cyan-500 to-blue-700',
  ];
  let h = 0;
  for (let i = 0; i < title.length; i++) h = ((h * 31 + title.charCodeAt(i)) >>> 0);
  const palette = palettes[h % palettes.length];
  const initial = (title.trim().charAt(0) || '★').toUpperCase();

  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${palette}`}>
      <span
        aria-hidden
        className={
          'font-black text-white/30 ' +
          (small ? 'text-4xl' : 'text-7xl sm:text-8xl')
        }
      >
        {initial}
      </span>
    </div>
  );
}

/* Compact horizontal card for the hero sidebar (image left, text right). */
export function SidebarArticleCard({ a }: { a: ArticleCardData }) {
  return (
    <Link
      href={a.path}
      className="card group flex gap-4 rounded-lg border border-line-subtle bg-card p-3 hover:border-line-strong"
    >
      <div className="relative aspect-[16/9] w-32 shrink-0 self-start overflow-hidden rounded-md bg-soft">
        {a.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.featured_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CardCover title={a.title} small />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <CategoryBadge slug={a.category} size="sm" />
        <h4 className="mt-2 line-clamp-3 text-sm font-bold leading-snug tracking-tight text-fg group-hover:text-accent">
          {a.title}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          {a.published_at && (
            <time>
              {new Date(a.published_at).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'short',
              })}
            </time>
          )}
          {a.reading_time != null && (
            <span className="text-fg-faint">· {a.reading_time} min</span>
          )}
        </div>
      </div>
    </Link>
  );
}
