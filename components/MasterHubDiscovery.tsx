'use client';

import Link from 'next/link';
import { to } from '@/lib/links';
import { useState } from 'react';
import type { MasterHubCategory } from '@/components/MasterHubCategorySearch';
import type { YrkeLink } from '@/components/ForetagYrkeSearch';

/** Single search surface for /ai-verktyg/: one input filters both the
 *  kategori-grid and yrke-grid at once, so the page reads as one product
 *  rather than two stacked sub-features. Group-chips refine kategorier only.
 *  "Bläddra bland yrken" jumps straight to the yrke-grid without scrolling
 *  past the full kategori-grid first. */
export function MasterHubDiscovery({
  categories,
  groups,
  yrken,
}: {
  categories: MasterHubCategory[];
  groups: string[];
  yrken: YrkeLink[];
}) {
  const [q, setQ] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();

  const matchesCategory = (c: MasterHubCategory) =>
    (!needle || c.title.toLowerCase().includes(needle)) &&
    (!activeGroup || c.group === activeGroup);
  const matchesYrke = (y: YrkeLink) =>
    !needle || y.label.toLowerCase().includes(needle) || y.kw.toLowerCase().includes(needle);

  const anyCategoryMatch = categories.some(matchesCategory);
  const anyYrkeMatch = yrken.some(matchesYrke);

  const scrollToYrken = () => {
    document.getElementById('yrken-sektion')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="mb-8 max-w-xl">
        <label className="relative block">
          <span className="sr-only">Sök bland AI-verktyg eller yrken</span>
          <svg
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-faint"
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
            placeholder="Sök verktyg, kategori eller yrke..."
            className="w-full rounded-xl border border-line bg-card py-3.5 pl-11 pr-10 text-base text-fg shadow-sm placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
        </label>
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveGroup(null)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            activeGroup === null
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-line bg-card text-fg-muted hover:border-indigo-300 hover:text-fg'
          }`}
        >
          Alla
        </button>
        {groups.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setActiveGroup(g === activeGroup ? null : g)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              g === activeGroup
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-line bg-card text-fg-muted hover:border-indigo-300 hover:text-fg'
            }`}
          >
            {g}
          </button>
        ))}
        <button
          type="button"
          onClick={scrollToYrken}
          className="ml-auto rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1.5 text-sm font-semibold text-sky-700 transition-colors hover:border-sky-500 hover:bg-sky-100"
        >
          ↓ Bläddra bland yrken
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.href}
            href={to(c.href)}
            className={`group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-xl p-6 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ${
              c.bg ? '' : c.fallbackGradient
            } ${matchesCategory(c) ? '' : 'hidden'}`}
          >
            {c.bg && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.bg}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/40" />
              </>
            )}

            <div className="relative flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/15 text-2xl backdrop-blur-sm"
              >
                {c.icon}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-white break-words">
                {c.title}
              </h3>
            </div>

            <div className="relative">
              <p className="line-clamp-2 text-sm leading-relaxed text-white/90">{c.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-white">
                Utforska <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!anyCategoryMatch && (
        <p className="mt-8 text-fg-subtle">Inga kategorier matchade — prova ett annat sökord</p>
      )}

      <div id="yrken-sektion" className="mt-16 scroll-mt-24 border-t border-line pt-14">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-700">
          Hitta AI för ditt yrke
        </div>
        <h2 className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Verktyg för ditt yrke
        </h2>

        {!anyYrkeMatch ? (
          <p className="text-fg-subtle">Inga yrken matchar ”{q}”. Prova ett bredare sökord.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {yrken.map((y) => (
              <li key={y.href} className={matchesYrke(y) ? '' : 'hidden'}>
                <Link
                  href={to(y.href)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-card px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                >
                  <span className="min-w-0 break-words font-bold tracking-tight text-fg group-hover:text-sky-700">
                    {y.label}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-sky-600 transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
