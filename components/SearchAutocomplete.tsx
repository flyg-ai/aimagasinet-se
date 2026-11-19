'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { to } from '@/lib/links';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { SearchSuggestion } from '@/app/api/search-suggest/route';

/** Hero-sökrutan på /ai-verktyg: visar live-förslag medan man skriver —
 *  matchande kategorier först, matchande verktyg (recensioner) under.
 *  Enter eller klick på "Visa alla resultat" går till /sok/?q=... som
 *  tidigare; ingen annan sida (SiteNav:s sökikon länkar fortfarande
 *  direkt till /sok/) berörs. */
export function SearchAutocomplete() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<SearchSuggestion[]>([]);
  const [tools, setTools] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const needle = q.trim();
    if (needle.length < 2) {
      setCategories([]);
      setTools([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search-suggest?q=${encodeURIComponent(needle)}`)
        .then((r) => r.json())
        .then((data: { categories: SearchSuggestion[]; tools: SearchSuggestion[] }) => {
          setCategories(data.categories ?? []);
          setTools(data.tools ?? []);
        })
        .catch(() => {
          setCategories([]);
          setTools([]);
        })
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const hasResults = categories.length > 0 || tools.length > 0;
  const showDropdown = open && q.trim().length >= 2;

  function goTo(href: string) {
    setOpen(false);
    router.push(to(href));
  }

  return (
    <div ref={rootRef} className="relative mt-8 max-w-xl">
      <form
        action="/sok/"
        method="GET"
        onSubmit={(e) => {
          if (showDropdown) e.preventDefault();
          setOpen(false);
        }}
      >
        <label className="relative block">
          <span className="sr-only">Sök bland AI-verktyg</span>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
          />
          <input
            type="search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            autoComplete="off"
            placeholder="Vad letar du efter för verktyg?"
            className="w-full rounded-xl border border-white/15 bg-white/10 py-4 pl-12 pr-14 text-base text-white placeholder:text-white/50 shadow-sm backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            type="submit"
            aria-label="Sök"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white text-indigo-700 transition-colors hover:bg-white/90"
          >
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </label>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-line bg-card text-left shadow-xl">
          {loading && !hasResults && (
            <p className="px-4 py-3 text-sm text-fg-subtle">Söker…</p>
          )}

          {!loading && !hasResults && (
            <p className="px-4 py-3 text-sm text-fg-subtle">Inga träffar — prova ett annat sökord</p>
          )}

          {categories.length > 0 && (
            <div className="border-b border-line py-1.5">
              <p className="px-4 pb-1 pt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-faint">
                Kategorier
              </p>
              {categories.map((c) => (
                <button
                  key={c.href}
                  type="button"
                  onClick={() => goTo(c.href)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold text-fg hover:bg-indigo-50"
                >
                  {c.title}
                  <span aria-hidden className="text-fg-faint">→</span>
                </button>
              ))}
            </div>
          )}

          {tools.length > 0 && (
            <div className="py-1.5">
              <p className="px-4 pb-1 pt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-faint">
                Verktyg
              </p>
              {tools.map((t) => (
                <button
                  key={t.href}
                  type="button"
                  onClick={() => goTo(t.href)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-fg hover:bg-indigo-50"
                >
                  {t.title}
                  <span aria-hidden className="text-fg-faint">→</span>
                </button>
              ))}
            </div>
          )}

          {hasResults && (
            <Link
              href={to(`/sok/?q=${encodeURIComponent(q.trim())}`)}
              onClick={() => setOpen(false)}
              className="block border-t border-line px-4 py-2.5 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Visa alla resultat för &quot;{q.trim()}&quot;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
