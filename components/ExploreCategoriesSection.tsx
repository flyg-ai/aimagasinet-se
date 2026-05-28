'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Type, Video, Code2, Briefcase, Image as ImageIcon, Music, Workflow, Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const STORAGE = 'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/kategorier';

type Card = {
  href: string;
  title: string;
  icon: LucideIcon;
  /** Public URL of the kategori-image. Null → gradient fallback. */
  bg: string | null;
  /** Tailwind gradient applied when bg is null (fallback). */
  fallbackGradient: string;
};

const CARDS: Card[] = [
  // Row 1 — always visible on mobile.
  {
    href: '/ai-verktyg/ai-text-verktyg',
    title: 'AI-text',
    icon: Type,
    bg: `${STORAGE}/ai-text-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-indigo-500 to-indigo-800',
  },
  {
    href: '/ai-video',
    title: 'AI-video',
    icon: Video,
    bg: `${STORAGE}/ai-video-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-cyan-500 to-sky-800',
  },
  {
    href: '/ai-verktyg/ai-kod-verktyg',
    title: 'AI-kod',
    icon: Code2,
    bg: `${STORAGE}/ai-kod-programmering-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-emerald-500 to-teal-800',
  },
  {
    href: '/ai-verktyg/foretag',
    title: 'AI för företag',
    icon: Briefcase,
    bg: `${STORAGE}/ai-for-foretag-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
  },
  // Row 2 — hidden on mobile until "Visa fler kategorier" toggled.
  {
    href: '/ai-verktyg/ai-bild-verktyg',
    title: 'AI-bilder',
    icon: ImageIcon,
    bg: `${STORAGE}/ai-bild-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-violet-600 to-fuchsia-800',
  },
  {
    href: '/ai-verktyg/ai-ljud-och-musik',
    title: 'AI-ljud & musik',
    icon: Music,
    bg: `${STORAGE}/ai-ljud-musik-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-rose-500 to-pink-800',
  },
  {
    href: '/ai-verktyg/ai-automation',
    title: 'AI-automation',
    icon: Workflow,
    bg: `${STORAGE}/ai-automation-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-blue-600 to-indigo-800',
  },
  {
    href: '/ai-verktyg/gratis',
    title: 'Gratis AI-verktyg',
    icon: Sparkles,
    bg: `${STORAGE}/gratis-ai-verktyg-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-emerald-600 to-teal-800',
  },
];

/** 8 quick-jump cards under the hero. Mobile shows the first 4 with
 *  a "Visa fler kategorier" button that reveals the rest; desktop
 *  (lg+) always shows all 8 in a 4×2 grid. */
export function ExploreCategoriesSection() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Utforska AI-verktyg
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c, i) => {
          const Icon = c.icon;
          const inHiddenRow = i >= 4;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={
                `group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-xl p-5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-6 ${
                  c.bg ? '' : c.fallbackGradient
                } ` +
                // Hide rows 5-8 on mobile until expanded; always visible on lg+.
                (inHiddenRow && !showAll ? 'hidden lg:flex' : 'flex')
              }
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
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/40"
                  />
                </>
              )}

              <div className="relative">
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm sm:h-11 sm:w-11"
                >
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                </span>
              </div>

              <div className="relative">
                <h3 className="text-lg font-black uppercase tracking-tight sm:text-xl">
                  {c.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white/95">
                  Utforska <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Mobile-only expand toggle — lg+ never sees this. */}
      <div className="mt-5 flex justify-center lg:hidden">
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-fg-muted shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-700"
        >
          {showAll ? 'Visa färre' : 'Visa fler kategorier'}
          <span aria-hidden className={`transition-transform ${showAll ? 'rotate-180' : ''}`}>↓</span>
        </button>
      </div>
    </section>
  );
}
