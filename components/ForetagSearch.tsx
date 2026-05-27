'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { ArticleCardData } from '@/components/ArticleCard';

type Props = {
  yrkes: ArticleCardData[];
  subtopicsByYrke: Record<string, ArticleCardData[]>;
};

/** Search field + filterable grid. Client-side so the input is reactive
 *  without a route change. The whole grid is rendered here (replacing the
 *  prior server-side YrkeGrid) so filtering covers both yrkesroller and
 *  their subtopic specializations. */
export function ForetagSearch({ yrkes, subtopicsByYrke }: Props) {
  const [q, setQ] = useState('');

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return yrkes.map((y) => ({ y, subs: subtopicsByYrke[y.slug] ?? [] }));

    return yrkes
      .map((y) => {
        const subs = subtopicsByYrke[y.slug] ?? [];
        const ySelf =
          y.title.toLowerCase().includes(needle) ||
          (y.excerpt ?? '').toLowerCase().includes(needle);
        const matchedSubs = subs.filter((s) =>
          s.title.toLowerCase().includes(needle) ||
          (s.excerpt ?? '').toLowerCase().includes(needle)
        );
        if (ySelf) return { y, subs };
        if (matchedSubs.length) return { y, subs: matchedSubs };
        return null;
      })
      .filter((x): x is { y: ArticleCardData; subs: ArticleCardData[] } => x !== null);
  }, [q, yrkes, subtopicsByYrke]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-700">
        Hitta AI för ditt yrke
      </div>
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Per yrkesroll
        </h2>
      </div>

      <div className="mb-8">
        <label className="block">
          <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            Sök efter yrke, verktyg eller område
          </span>
          <div className="relative">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-faint"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex. juridik, chatbot, rekrytering, bokföring…"
              className="w-full rounded-lg border border-line bg-white px-10 py-3 text-base text-fg placeholder:text-fg-faint focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                aria-label="Rensa sökning"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-subtle hover:bg-soft hover:text-fg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-line bg-card px-4 py-8 text-center text-fg-subtle">
          Inga träffar på <strong className="text-fg">{q}</strong>. Prova ett annat sökord.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map(({ y, subs }) => (
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
                <p className="mt-4 text-sm leading-relaxed text-fg-subtle">{y.excerpt}</p>
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
          ))}
        </div>
      )}
    </section>
  );
}

function cleanYrkeTitle(title: string): string {
  return title.split(/\s+[–—-]\s+|:\s+/)[0].trim();
}
