'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Newspaper, Wrench, Search, X } from 'lucide-react';

type Item = { href: string; label: string; icon: typeof Home };

const ITEMS: Item[] = [
  { href: '/',                      label: 'Hem',      icon: Home },
  { href: '/kategori/ai-nyheter',   label: 'Nyheter',  icon: Newspaper },
  { href: '/ai-verktyg',            label: 'Verktyg',  icon: Wrench },
];

/** Sticky bottom navigation for mobile. Hidden on md+ where the
 *  desktop header SiteNav owns navigation. The Search action toggles
 *  an inline search overlay since the rest of the site doesn't have
 *  a dedicated /sok page yet. */
export function MobileBottomNav() {
  const pathname = usePathname() || '/';
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Active rule: exact match for '/', prefix-match otherwise. Strip
  // trailing slash so '/ai-verktyg/' and '/ai-verktyg' both count as
  // active for the Verktyg tab (next.config.mjs adds trailing slash).
  function isActive(href: string): boolean {
    const norm = pathname.replace(/\/$/, '');
    if (href === '/') return norm === '';
    const target = href.replace(/\/$/, '');
    return norm === target || norm.startsWith(`${target}/`);
  }

  return (
    <>
      <nav
        aria-label="Mobilnavigation"
        className="fixed inset-x-0 bottom-0 z-50 h-[60px] border-t border-line bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:hidden"
      >
        <ul className="grid h-full grid-cols-4">
          {ITEMS.map((it) => {
            const active = isActive(it.href);
            const Icon = it.icon;
            return (
              <li key={it.href} className="flex">
                <Link
                  href={it.href}
                  className={
                    'flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ' +
                    (active
                      ? 'text-indigo-600'
                      : 'text-fg-subtle hover:text-fg')
                  }
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex">
            <button
              type="button"
              aria-label="Öppna sök"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className={
                'flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors ' +
                (searchOpen ? 'text-indigo-600' : 'text-fg-subtle hover:text-fg')
              }
            >
              <Search className="h-5 w-5" strokeWidth={searchOpen ? 2.5 : 2} />
              <span>Sök</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Inline search overlay — opens above the bottom nav. */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-white/90 backdrop-blur-sm md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Sök på AI-Magasinet"
        >
          <div className="flex items-center gap-2 border-b border-line bg-white p-3">
            <Search className="h-5 w-5 shrink-0 text-fg-subtle" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök artiklar, verktyg, guider…"
              className="flex-1 bg-transparent text-base text-fg placeholder:text-fg-faint focus:outline-none"
            />
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setQuery(''); }}
              aria-label="Stäng sök"
              className="rounded-md p-1.5 text-fg-subtle hover:bg-soft hover:text-fg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {query.length < 2 ? (
              <p className="text-sm text-fg-subtle">
                Skriv minst 2 tecken för att söka.
              </p>
            ) : (
              <p className="text-sm text-fg-subtle">
                Söker efter <strong className="text-fg">{query}</strong>… Sökfunktionen är på väg.
                Prova istället att besöka{' '}
                <Link href="/ai-verktyg/" className="text-indigo-700 underline" onClick={() => setSearchOpen(false)}>
                  AI-verktyg
                </Link>{' '}eller{' '}
                <Link href="/ai-guiden/" className="text-indigo-700 underline" onClick={() => setSearchOpen(false)}>
                  AI-Guiden
                </Link>.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
