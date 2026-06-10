'use client';

import Link from 'next/link';
import { to } from '@/lib/links';
import { useState } from 'react';

export type MasterHubCategory = {
  href: string;
  title: string;
  description: string;
  icon: string;
  bg: string | null;
  fallbackGradient: string;
};

/** Live, client-side filter over the master-hub category cards. Every card
 *  stays in the DOM at all times (SEO: server-rendered links are always
 *  crawlable) — non-matching cards are only hidden via the `hidden` CSS class,
 *  never unmounted. Filters on category name. */
export function MasterHubCategorySearch({ categories }: { categories: MasterHubCategory[] }) {
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const matches = (c: MasterHubCategory) => !needle || c.title.toLowerCase().includes(needle);
  const anyMatch = categories.some(matches);

  return (
    <>
      <div className="mb-8 max-w-xl">
        <label className="relative block">
          <span className="sr-only">Sök bland AI-verktyg</span>
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
            placeholder="Sök bland AI-verktyg..."
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.href}
            href={to(c.href)}
            className={`group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-xl p-6 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ${
              c.bg ? '' : c.fallbackGradient
            } ${matches(c) ? '' : 'hidden'}`}
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

      {!anyMatch && (
        <p className="mt-8 text-fg-subtle">
          Inga kategorier matchade — prova ett annat sökord
        </p>
      )}
    </>
  );
}
