'use client';

import { useState } from 'react';
import Link from 'next/link';

export type YrkeNavItem = {
  slug: string;
  title: string;
  href: string;
  icon: string;
  description: string;
  /** sökord utöver titel/beskrivning */
  keywords?: string;
};

/** Navigerings-grid med klientsides-sökfilter för /ai-verktyg/foretag/yrke. */
export function YrkesNavSearch({ items }: { items: YrkeNavItem[] }) {
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const filtered = needle
    ? items.filter((y) =>
        `${y.title} ${y.description} ${y.keywords ?? ''}`.toLowerCase().includes(needle)
      )
    : items;

  return (
    <div>
      {/* Sökfält */}
      <div className="mx-auto mb-10 max-w-2xl">
        <label className="relative block">
          <span className="sr-only">Sök efter yrke</span>
          <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sök efter ditt yrke eller område..."
            className="w-full rounded-full border border-line bg-card py-3.5 pl-12 pr-4 text-base text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <p className="mt-2 px-4 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          {needle ? `${filtered.length} träff${filtered.length === 1 ? '' : 'ar'}` : `${items.length} yrken · fler tillkommer löpande`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-fg-subtle">
          Inga yrken matchar ”{q}”. Prova ett annat sökord eller bläddra bland alla ovan.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((y) => (
            <Link
              key={y.slug}
              href={y.href}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-card p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <span aria-hidden className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl text-indigo-700">
                {y.icon}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
                {y.title}
              </h3>
              <p className="text-sm leading-relaxed text-fg-subtle">{y.description}</p>
              <span className="mt-auto pt-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
                Utforska →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
