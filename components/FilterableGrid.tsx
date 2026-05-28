'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';
import { NewsletterBanner } from '@/components/NewsletterBanner';

type FilterKey = 'all' | 'ai-nyheter' | 'teknik-modeller' | 'foretag-aktorer' | 'ai-sakerhet-etik';

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: 'all',              label: 'Alla' },
  { key: 'ai-nyheter',       label: 'AI-Nyheter' },
  { key: 'teknik-modeller',  label: 'Teknik & Modeller' },
  { key: 'foretag-aktorer',  label: 'Företag & Aktörer' },
  { key: 'ai-sakerhet-etik', label: 'AI-Säkerhet' },
];

type Props = {
  /** SSR-rendered first page of articles. */
  initial: ArticleCardData[];
  /** Offset to start the next API page from (= initial.length + offset of
   *  any earlier server-rendered items like hero+sidebar). */
  startOffset: number;
  /** How many to pull per "Ladda fler" click. */
  pageSize: number;
};

/** Filter pills + grid + Ladda fler bound together as one client island.
 *  When a filter is active the grid only shows matching articles, and
 *  Ladda fler re-fetches with ?category=X starting at offset 0 (because
 *  the SSR offset is irrelevant for the filtered list). */
export function FilterableGrid({ initial, startOffset, pageSize }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');

  // Items loaded via Ladda fler — kept separately per filter so switching
  // filters preserves the SSR-rendered initial page as the always-visible
  // base. For non-"all" filters, when the user has fetched extras we
  // accumulate them here.
  const [extra, setExtra] = useState<ArticleCardData[]>([]);
  const [offset, setOffset] = useState(startOffset);
  // Once we switch filter we reset the extra-load offset because the
  // /api/articles call is filtered server-side from offset 0.
  const [filterOffset, setFilterOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // The full visible list = initial + extras, optionally filtered by category.
  const visible = useMemo(() => {
    const all = [...initial, ...extra];
    if (filter === 'all') return all;
    return all.filter((a) => a.category === filter);
  }, [initial, extra, filter]);

  function switchFilter(next: FilterKey) {
    if (next === filter) return;
    setFilter(next);
    setExtra([]);
    setFilterOffset(0);
    setOffset(startOffset);
    setDone(false);
    setErr(null);
  }

  // When the user switches to a category filter, the SSR-rendered grid
  // often won't contain matches (hero + sidebar consume the most recent
  // articles from those categories before they reach the grid). So we
  // auto-fetch the category from the server right after the state reset.
  useEffect(() => {
    if (filter === 'all') return;
    // Only fire when we've genuinely reset (extras emptied, filterOffset=0).
    if (extra.length === 0 && filterOffset === 0 && !loading && !done) {
      void loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function loadMore() {
    if (loading || done) return;
    setLoading(true);
    setErr(null);
    try {
      const isFiltered = filter !== 'all';
      const fetchOffset = isFiltered ? filterOffset : offset;
      const url = isFiltered
        ? `/api/articles?offset=${fetchOffset}&limit=${pageSize}&category=${filter}`
        : `/api/articles?offset=${fetchOffset}&limit=${pageSize}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? `HTTP ${res.status}`);
      const items = json.articles as ArticleCardData[];

      // For filtered loads, every server article is new (we started from 0).
      // For "all" loads, dedupe just-in-case against initial.
      const seen = new Set(visible.map((a) => a.slug));
      const fresh = items.filter((a) => !seen.has(a.slug));
      setExtra((prev) => [...prev, ...fresh]);
      if (isFiltered) {
        setFilterOffset((o) => o + items.length);
      } else {
        setOffset((o) => o + items.length);
      }
      if (items.length < pageSize) setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  // Insert the newsletter banner after the 6th visible card.
  const beforeBanner = visible.slice(0, 6);
  const afterBanner  = visible.slice(6);

  return (
    <section className="mt-14">
      {/* Header row: title + filter pills */}
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Senaste artiklarna
        </h2>
        <span className="text-xs text-fg-faint">
          {visible.length} {filter !== 'all' && `i ${filterLabel(filter)}`}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => switchFilter(f.key)}
              className={
                'rounded-full border px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ' +
                (active
                  ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'border-line bg-card text-fg-muted hover:border-line-strong hover:text-fg')
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-line bg-card px-4 py-12 text-center text-fg-subtle">
          Inga artiklar i den här kategorin ännu.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {beforeBanner.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
          {visible.length >= 6 && <NewsletterBanner />}
          {afterBanner.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3">
        {!done ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent-fg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Laddar…
              </>
            ) : (
              <>
                Ladda fler <span aria-hidden>↓</span>
              </>
            )}
          </button>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-wider text-fg-faint">
            Inga fler artiklar
          </p>
        )}
        {err && <p className="text-sm text-rose-600">Kunde inte hämta fler: {err}</p>}
      </div>
    </section>
  );
}

function filterLabel(k: FilterKey): string {
  const hit = FILTERS.find((f) => f.key === k);
  return hit?.label ?? k;
}
