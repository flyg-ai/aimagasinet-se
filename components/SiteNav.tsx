'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubscribeForm } from '@/components/SubscribeForm';

type NavLink = { href: string; label: string };

type NavGroup = {
  /** Group header — clickable, lands on the category index. */
  label: string;
  href: string;
  links: NavLink[];
};

type NavItem = {
  href: string;
  label: string;
  /** Simple flat dropdown (no grouping). Mutually exclusive with `groups`. */
  children?: NavLink[];
  /** Mega-menu with columns. Mutually exclusive with `children`. */
  groups?: NavGroup[];
  /** When `children` is set, this label gets rendered as a "Visa alla →"
   *  footer link pointing back at `href`. */
  showAllLabel?: string;
  /** Optional highlighted footer link rendered full-width below a mega-menu
   *  (used for "Jämför verktyg →" under AI-Verktyg). */
  footer?: NavLink;
};

const NAV: NavItem[] = [
  { href: '/', label: 'AI-Nyheter' },
  {
    href: '/ai-verktyg',
    label: 'AI-Verktyg',
    groups: [
      {
        label: 'AI-text',
        href: '/ai-verktyg/ai-text-verktyg',
        links: [
          { href: '/ai-verktyg/ai-text-verktyg/chatgpt',    label: 'ChatGPT' },
          { href: '/ai-verktyg/ai-text-verktyg/claude',     label: 'Claude' },
          { href: '/ai-verktyg/ai-text-verktyg/gemini',     label: 'Gemini' },
          { href: '/ai-verktyg/ai-text-verktyg/jasper-ai',  label: 'Jasper AI' },
          { href: '/ai-verktyg/ai-text-verktyg/writesonic', label: 'Writesonic' },
        ],
      },
      {
        label: 'AI-bilder',
        href: '/ai-verktyg/ai-bild-verktyg',
        links: [
          { href: '/ai-verktyg/ai-bild-verktyg/midjourney',        label: 'Midjourney' },
          { href: '/ai-verktyg/ai-bild-verktyg/dalle-3',           label: 'DALL-E 3' },
          { href: '/ai-verktyg/ai-bild-verktyg/adobe-firefly',     label: 'Adobe Firefly' },
          { href: '/ai-verktyg/ai-bild-verktyg/stable-diffusion',  label: 'Stable Diffusion' },
          { href: '/ai-verktyg/ai-bild-verktyg/leonardo-ai',       label: 'Leonardo AI' },
        ],
      },
      {
        label: 'AI-kod',
        href: '/ai-verktyg/ai-kod-verktyg',
        links: [
          { href: '/ai-verktyg/ai-kod-verktyg/cursor-ai',      label: 'Cursor AI' },
          { href: '/ai-verktyg/ai-kod-verktyg/github-copilot', label: 'GitHub Copilot' },
          { href: '/ai-verktyg/ai-kod-verktyg/windsurf',       label: 'Windsurf' },
          { href: '/ai-verktyg/ai-kod-verktyg/tabnine',        label: 'Tabnine' },
          { href: '/ai-verktyg/ai-kod-verktyg/codeium',        label: 'Codeium' },
        ],
      },
      {
        label: 'AI-ljud',
        href: '/ai-verktyg/ai-ljud-och-musik',
        links: [
          { href: '/ai-verktyg/ai-ljud-och-musik/suno-ai',    label: 'Suno AI' },
          { href: '/ai-verktyg/ai-ljud-och-musik/elevenlabs', label: 'ElevenLabs' },
          { href: '/ai-verktyg/ai-ljud-och-musik/udio',       label: 'Udio' },
          { href: '/ai-verktyg/ai-ljud-och-musik/mubert',     label: 'Mubert' },
          { href: '/ai-verktyg/ai-ljud-och-musik/aiva',       label: 'AIVA' },
        ],
      },
    ],
    footer: { href: '/ai-verktyg/jamfor', label: 'Jämför verktyg' },
  },
  {
    href: '/ai-video',
    label: 'AI Video',
    children: [
      { href: '/ai-video/kling-ai',     label: 'Kling AI' },
      { href: '/ai-video/runway-gen-3', label: 'Runway Gen-3' },
      { href: '/ai-video/pika-labs',    label: 'Pika Labs' },
      { href: '/ai-video/sora-2',       label: 'Sora 2' },
      { href: '/ai-video/heygen',       label: 'HeyGen' },
    ],
    showAllLabel: 'Visa alla',
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
      { href: '/ai-guiden/vad-ar-ai',             label: 'Vad är AI?' },
      { href: '/bygga-mobilapp-med-ai',           label: 'Bygga mobilapp med AI' },
      { href: '/bygga-app-med-ai',                label: 'Bygga app med AI' },
      { href: '/skapa-faceless-content-med-ai',   label: 'Skapa faceless content med AI' },
    ],
    showAllLabel: 'Hela AI-Guiden',
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
        {NAV.map((item) => {
          const hasDropdown = !!(item.children || item.groups);
          return (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-2 text-sm font-medium text-fg-subtle transition-colors hover:text-accent group-hover:text-accent"
              >
                {item.label}
                {hasDropdown && (
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
              {/* Bridge gap between trigger and dropdown so hover doesn't drop. */}
              {hasDropdown && (
                <div
                  className={
                    'invisible absolute z-50 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 ' +
                    (item.groups
                      ? 'left-1/2 top-full -translate-x-1/2'
                      : 'left-1/2 top-full -translate-x-1/2')
                  }
                >
                  {item.groups ? (
                    <MegaPanel groups={item.groups} mainHref={item.href} footer={item.footer} />
                  ) : (
                    <SimpleDropdown
                      links={item.children ?? []}
                      showAll={item.showAllLabel ? { label: item.showAllLabel, href: item.href } : null}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
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
        <SubscribeForm variant="compact" />
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
          className="absolute inset-x-0 top-full max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-line bg-page shadow-xl shadow-black/10 md:hidden"
        >
          <nav className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {NAV.map((item) => {
              const isOpen = expanded === item.href;
              const hasDropdown = !!(item.children || item.groups);
              return (
                <div
                  key={item.href}
                  className="border-b border-line-subtle last:border-b-0"
                >
                  {hasDropdown ? (
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
                          onClick={() => setExpanded(isOpen ? null : item.href)}
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
                          {item.groups
                            ? item.groups.map((g) => (
                                <div key={g.href} className="mt-3 first:mt-1">
                                  <Link
                                    href={g.href}
                                    onClick={closeMobile}
                                    className="block py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-700 hover:underline"
                                  >
                                    {g.label}
                                  </Link>
                                  {g.links.map((child) => (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      onClick={closeMobile}
                                      className="block py-2 text-sm text-fg-subtle transition-colors hover:text-accent"
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                  <Link
                                    href={g.href}
                                    onClick={closeMobile}
                                    className="block py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent hover:underline"
                                  >
                                    Visa alla <span aria-hidden>→</span>
                                  </Link>
                                </div>
                              ))
                            : (item.children ?? []).map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={closeMobile}
                                  className="block py-2 text-sm text-fg-subtle transition-colors hover:text-accent"
                                >
                                  {child.label}
                                </Link>
                              ))}
                          {item.footer && item.groups && (
                            <Link
                              href={item.footer.href}
                              onClick={closeMobile}
                              className="mt-2 flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700"
                            >
                              <span aria-hidden>⚔</span> {item.footer.label} <span aria-hidden>→</span>
                            </Link>
                          )}
                          {item.showAllLabel && !item.groups && (
                            <Link
                              href={item.href}
                              onClick={closeMobile}
                              className="block py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent hover:underline"
                            >
                              {item.showAllLabel} <span aria-hidden>→</span>
                            </Link>
                          )}
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

function SimpleDropdown({
  links,
  showAll,
}: {
  links: NavLink[];
  showAll: { label: string; href: string } | null;
}) {
  return (
    <div className="min-w-[220px] overflow-hidden rounded-md border border-line bg-card py-2 shadow-xl shadow-black/10 backdrop-blur">
      {links.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          className="block px-4 py-2 text-sm text-fg-muted transition-colors hover:bg-soft hover:text-accent"
        >
          {child.label}
        </Link>
      ))}
      {showAll && (
        <Link
          href={showAll.href}
          className="block border-t border-line-subtle px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-soft hover:underline"
        >
          {showAll.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

function MegaPanel({ groups, mainHref, footer }: { groups: NavGroup[]; mainHref: string; footer?: NavLink }) {
  void mainHref;
  return (
    <div className="overflow-hidden rounded-md border border-line bg-card p-6 shadow-xl shadow-black/10 backdrop-blur">
      <div className="grid grid-cols-4 gap-6" style={{ minWidth: '52rem' }}>
        {groups.map((g) => (
          <div key={g.href} className="flex flex-col">
            <Link
              href={g.href}
              className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-700 hover:underline"
            >
              {g.label}
            </Link>
            <ul className="flex flex-col gap-0.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded-sm px-2 py-1.5 text-sm text-fg-muted transition-colors hover:bg-soft hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={g.href}
              className="mt-3 inline-flex items-center gap-1 px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent hover:underline"
            >
              Visa alla <span aria-hidden>→</span>
            </Link>
          </div>
        ))}
      </div>
      {footer && (
        <Link
          href={footer.href}
          className="mt-5 flex items-center justify-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors hover:bg-indigo-100"
        >
          <span aria-hidden>⚔</span> {footer.label} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
