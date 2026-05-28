'use client';

import { useState } from 'react';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';

type Props = {
  /** Offset in the post-list to start fetching from (e.g. 24 means skip
   *  hero + sidebar + initial grid). */
  startOffset: number;
  /** How many to pull per "Ladda fler" click. */
  pageSize: number;
};

type ApiResponse = {
  articles: ArticleCardData[];
  offset: number;
  limit: number;
  error?: string;
};

/** Renders a "Ladda fler" button below the homepage grid. Each click
 *  fetches the next page from /api/articles and appends them to its own
 *  state so the SSR-rendered grid above is left untouched. */
export function LoadMoreArticles({ startOffset, pageSize }: Props) {
  const [items, setItems] = useState<ArticleCardData[]>([]);
  const [offset, setOffset] = useState(startOffset);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadMore() {
    if (loading || done) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/articles?offset=${offset}&limit=${pageSize}`);
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || json.error) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      setItems((prev) => [...prev, ...json.articles]);
      setOffset((o) => o + json.articles.length);
      if (json.articles.length < pageSize) setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {items.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
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
        {err && (
          <p className="text-sm text-rose-600">
            Kunde inte hämta fler: {err}
          </p>
        )}
      </div>
    </>
  );
}
