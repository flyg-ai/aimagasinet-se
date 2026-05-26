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
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-fg-faint">
            <span className="font-mono text-xs uppercase tracking-wider">no image</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
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

/* Compact horizontal card for the hero sidebar (image left, text right). */
export function SidebarArticleCard({ a }: { a: ArticleCardData }) {
  return (
    <Link
      href={a.path}
      className="card group flex gap-4 rounded-lg border border-line-subtle bg-card p-3 hover:border-line-strong"
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-md bg-soft">
        {a.featured_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.featured_image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <CategoryBadge slug={a.category} size="sm" />
        <h4 className="mt-2 line-clamp-3 text-sm font-bold leading-snug tracking-tight text-fg group-hover:text-accent">
          {a.title}
        </h4>
        {a.published_at && (
          <time className="mt-2 block font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
            {new Date(a.published_at).toLocaleDateString('sv-SE', {
              day: 'numeric',
              month: 'short',
            })}
          </time>
        )}
      </div>
    </Link>
  );
}
