import Link from 'next/link';
import { to } from '@/lib/links';
import type { ArticleCardData } from '@/components/ArticleCard';
import { categoryLabel } from '@/components/CategoryBadge';

/** Per-category badge color on the dark carousel. Brighter shades than
 *  the CategoryBadge palette so they pop against the zinc-900 background. */
const BADGE_BG: Record<string, string> = {
  'ai-nyheter':         'bg-indigo-500',
  'teknik-modeller':    'bg-cyan-500',
  'foretag-aktorer':    'bg-amber-500',
  'ai-sakerhet-etik':   'bg-rose-500',
  'forskning-utveckling': 'bg-emerald-500',
  'lagstiftning-policy': 'bg-fuchsia-500',
};
const BADGE_FALLBACK = 'bg-zinc-500';

/** Dense horizontally-scrollable strip of compact news cards on a dark
 *  background — the homepage's "Korta nyheter" ticker. Pure CSS scroll
 *  with snap points; no JS needed. */
export function ShortNewsCarousel({ items }: { items: ArticleCardData[] }) {
  if (items.length === 0) return null;
  return (
    <section className="bg-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-5 flex items-baseline justify-between border-b border-zinc-800 pb-3">
          <h2 className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-zinc-200">
            <span aria-hidden className="text-indigo-400">▣</span>
            Korta nyheter
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Scrolla horisontellt
          </span>
        </div>

        {/* Negative-margin trick: the scrollable strip extends a bit past
            the max-w-6xl container so cards can disappear off the right
            edge instead of getting hard-clipped by a border. */}
        <div className="-mx-4 sm:-mx-6">
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-color:#52525b_#18181b]">
            {items.map((a) => {
              const badge = BADGE_BG[a.category ?? ''] ?? BADGE_FALLBACK;
              return (
                <li
                  key={a.slug}
                  className="w-64 shrink-0 snap-start"
                >
                  <Link
                    href={to(a.path)}
                    className="group block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-indigo-500"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                      {a.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.featured_image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                          Ingen bild
                        </div>
                      )}
                      <div className="absolute left-2 top-2">
                        <span
                          className={`inline-block rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-white ${badge}`}
                        >
                          {a.category ? categoryLabel(a.category) : 'AI'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-3 text-sm font-bold leading-snug tracking-tight text-zinc-100 group-hover:text-indigo-300">
                        {a.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                        {a.published_at && (
                          <time>
                            {new Date(a.published_at).toLocaleDateString('sv-SE', {
                              day: 'numeric', month: 'short',
                            })}
                          </time>
                        )}
                        {a.reading_time != null && (
                          <span>· {a.reading_time} min</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
