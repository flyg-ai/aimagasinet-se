'use client';

import Link from 'next/link';
import { to } from '@/lib/links';
import { useMemo, useState } from 'react';

export type YrkeLink = {
  label: string;
  href: string;
  /** Space-separated keywords used for filtering (not shown). */
  kw: string;
};

/** Searchable grid of professions. Client-side filter so the input is
 *  reactive without a route change. Each card links to that profession's
 *  guide / yrkesroll page. */
export function ForetagYrkeSearch({ yrken }: { yrken: YrkeLink[] }) {
  const [q, setQ] = useState('');

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return yrken;
    return yrken.filter(
      (y) => y.label.toLowerCase().includes(needle) || y.kw.toLowerCase().includes(needle)
    );
  }, [q, yrken]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-700">
        Hitta AI för ditt yrke
      </div>
      <h2 className="mb-6 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        Verktyg för ditt yrke
      </h2>

      <div className="mb-8 max-w-xl">
        <label className="block">
          <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            Sök efter yrke
          </span>
          <div className="relative">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-faint"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex. säljare, jurist, lärare, utvecklare…"
              className="w-full rounded-lg border border-line bg-white px-10 py-3 text-base text-fg placeholder:text-fg-faint focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                aria-label="Rensa sökning"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-faint hover:text-fg"
              >
                ✕
              </button>
            )}
          </div>
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="text-fg-subtle">Inga yrken matchar ”{q}”. Prova ett bredare sökord.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((y) => (
            <li key={y.href}>
              <Link
                href={to(y.href)}
                className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-card px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
              >
                <span className="font-bold tracking-tight text-fg group-hover:text-sky-700">
                  {y.label}
                </span>
                <span
                  aria-hidden
                  className="font-mono text-sky-600 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
