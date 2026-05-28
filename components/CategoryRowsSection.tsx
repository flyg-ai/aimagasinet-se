import Link from 'next/link';
import type { ArticleCardData } from '@/components/ArticleCard';

type Column = {
  /** Article category slug — matches the DB. */
  category: string;
  /** Display name in the column header. */
  label: string;
  /** Tailwind bg-* for the header bar. */
  headerBg: string;
  /** Path the header links to (usually /kategori/<slug>). */
  href: string;
};

const COLUMNS: Column[] = [
  { category: 'ai-nyheter',       label: 'AI-Nyheter',          headerBg: 'bg-indigo-600', href: '/kategori/ai-nyheter' },
  { category: 'teknik-modeller',  label: 'Teknik & Modeller',   headerBg: 'bg-cyan-700',   href: '/kategori/teknik-modeller' },
  { category: 'ai-sakerhet-etik', label: 'AI-Säkerhet & Etik',  headerBg: 'bg-rose-600',   href: '/kategori/ai-sakerhet-etik' },
];

/** 3-column "Senaste inom varje kategori" strip. Each column is a small
 *  ranked list of 4 articles in its category. Designed to break up the
 *  homepage's main grid with a dense magazine-style sub-index. */
export function CategoryRowsSection({ pool }: { pool: ArticleCardData[] }) {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Senaste inom varje kategori
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = pool.filter((a) => a.category === col.category).slice(0, 4);
          return (
            <article
              key={col.category}
              className="flex flex-col overflow-hidden rounded-lg border border-line bg-card"
            >
              <Link
                href={col.href}
                className={`flex items-center justify-between px-4 py-3 ${col.headerBg} text-white transition-colors hover:brightness-110`}
              >
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.2em]">
                  {col.label}
                </span>
                <span aria-hidden className="text-xs font-bold">›</span>
              </Link>
              <ul className="flex flex-col divide-y divide-line-subtle">
                {items.length === 0 && (
                  <li className="px-4 py-6 text-sm text-fg-subtle">Inga artiklar ännu.</li>
                )}
                {items.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={a.path}
                      className="group flex items-start gap-3 p-3 transition-colors hover:bg-soft"
                    >
                      <div className="relative aspect-[16/9] w-24 shrink-0 overflow-hidden rounded-md bg-soft">
                        {a.featured_image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={a.featured_image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover object-center"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-3 text-sm font-bold leading-snug tracking-tight text-fg group-hover:text-accent">
                          {a.title}
                        </h3>
                        {a.published_at && (
                          <time className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                            {new Date(a.published_at).toLocaleDateString('sv-SE', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </time>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
