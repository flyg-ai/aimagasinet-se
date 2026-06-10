import Link from 'next/link';
import { to } from '@/lib/links';
import type { ArticleCardData } from '@/components/ArticleCard';
import { CategoryBadge } from '@/components/CategoryBadge';

/** Top-3 rank list. Numbers 01/02/03 set in a heavy display font to the
 *  left of each title — magazine-style "trending nu" widget. */
export function TrendingSection({ items }: { items: ArticleCardData[] }) {
  if (!items.length) return null;
  const top = items.slice(0, 3);
  return (
    <section className="mt-14">
      <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          <span aria-hidden className="text-indigo-600">▲</span>
          Mest lästa nu
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          Senaste 7 dagarna
        </span>
      </div>
      <ol className="grid gap-4 sm:grid-cols-3 sm:items-stretch">
        {top.map((a, i) => (
          <li key={a.slug} className="h-full">
            <Link
              href={to(a.path)}
              className="group flex h-full items-start gap-4 rounded-lg border border-line bg-card p-4 transition-colors hover:border-line-strong"
            >
              <span
                aria-hidden
                className="shrink-0 font-mono text-3xl font-black leading-none text-indigo-600 sm:text-4xl"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <CategoryBadge slug={a.category} size="sm" />
                <h3 className="mt-2 line-clamp-3 text-sm font-bold leading-snug tracking-tight text-fg group-hover:text-accent">
                  {a.title}
                </h3>
                {a.reading_time != null && (
                  <p className="mt-auto pt-2 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                    {a.reading_time} min läsning
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
