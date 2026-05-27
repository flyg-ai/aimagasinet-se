'use client';

import Link from 'next/link';
import { useState } from 'react';

type NavChild = { href: string; label: string };
type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  { href: '/', label: 'AI-Nyheter' },
  {
    href: '/ai-verktyg',
    label: 'AI-Verktyg',
    children: [
      // Kategorier överst, i kanonisk ordning
      { href: '/ai-video',                       label: 'AI-Video' },
      { href: '/ai-verktyg/ai-bild-verktyg',     label: 'AI-Bild' },
      { href: '/ai-verktyg/ai-text-verktyg',     label: 'AI-Text' },
      { href: '/ai-verktyg/ai-ljud-och-musik',   label: 'AI-Ljud & Musik' },
      { href: '/ai-verktyg/ai-kod-verktyg',      label: 'AI för kod' },
      { href: '/ai-verktyg/ai-automation',       label: 'AI-Automation' },
      { href: '/ai-verktyg/gratis',              label: 'Gratis AI-verktyg' },
      // Singel-guider längst ner
      { href: '/bygga-mobilapp-med-ai',          label: 'Bygga Mobilapp med AI' },
      { href: '/bygga-app-med-ai',               label: 'Bygga Appar & Hemsidor med AI' },
      { href: '/skapa-faceless-content-med-ai',  label: 'Faceless Content med AI' },
    ],
  },
  {
    href: '/ai-verktyg/foretag',
    label: 'AI för företag',
    children: [
      { href: '/ai-verktyg/foretag/yrke', label: 'AI-Verktyg Efter Yrke' },
    ],
  },
  {
    href: '/ai-guiden',
    label: 'AI-Guiden',
    children: [
      { href: '/ai-guiden/vad-ar-ai', label: 'Vad är AI?' },
    ],
  },
];

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const closeMobile = () => {
    setMobileOpen(false);
    setExpanded(null);
  };

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
        {NAV.map((item) => (
          <div key={item.href} className="group relative">
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium text-fg-subtle transition-colors hover:text-accent group-hover:text-accent"
            >
              {item.label}
              {item.children && (
                <svg
                  className="h-3 w-3 transition-transform group-hover:rotate-180"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 4.5 3 3 3-3" />
                </svg>
              )}
            </Link>
            {item.children && (
              <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="min-w-[200px] overflow-hidden rounded-md border border-line bg-card py-2 shadow-xl shadow-black/10 backdrop-blur">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-fg-muted transition-colors hover:bg-soft hover:text-accent"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Sök"
          className="rounded-md border border-line p-2 text-fg-subtle transition-colors hover:border-line-strong hover:bg-soft hover:text-accent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
        <Link
          href="#prenumerera"
          className="hidden rounded-md bg-accent px-3.5 py-2 text-sm font-bold uppercase tracking-wider text-accent-fg transition-colors hover:bg-accent-hover sm:inline-block"
        >
          Prenumerera
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-md border border-line p-2 text-fg-subtle transition-colors hover:border-line-strong hover:bg-soft hover:text-accent md:hidden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay (absolute → removed from flex flow) */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-t border-line bg-page shadow-xl shadow-black/10 md:hidden"
        >
          <nav className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {NAV.map((item) => {
              const isOpen = expanded === item.href;
              return (
                <div
                  key={item.href}
                  className="border-b border-line-subtle last:border-b-0"
                >
                  {item.children ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className="flex-1 py-3 text-sm font-semibold text-fg transition-colors hover:text-accent"
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(isOpen ? null : item.href)
                          }
                          aria-expanded={isOpen}
                          aria-label={`Visa undermeny för ${item.label}`}
                          className="p-3 text-fg-subtle transition-colors hover:text-accent"
                        >
                          <svg
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m3 4.5 3 3 3-3" />
                          </svg>
                        </button>
                      </div>
                      {isOpen && (
                        <div className="ml-3 border-l border-line pb-3 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeMobile}
                              className="block py-2 text-sm text-fg-subtle transition-colors hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobile}
                      className="block py-3 text-sm font-semibold text-fg transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
