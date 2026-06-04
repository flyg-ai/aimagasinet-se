'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Type, Video, Code2, Briefcase, Image as ImageIcon, Music, Workflow, Sparkles,
  Globe, Presentation, Mic, Share2, ListChecks, ShoppingCart, Languages, FileText,
  MessageSquare, Speech, Headphones, Zap, Mail, Handshake, BarChart3, GraduationCap,
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
  // Nya kategori-hubbar (gradient-fallback — saknar foto ännu).
  { href: '/ai-verktyg/hemsidebyggare', title: 'AI-hemsidebyggare', icon: Globe, bg: `${STORAGE}/ai-hemsidebyggare-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-sky-500 to-blue-800' },
  { href: '/ai-verktyg/presentationer', title: 'AI-presentationer', icon: Presentation, bg: `${STORAGE}/ai-presentationer-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-orange-500 to-amber-700' },
  { href: '/ai-verktyg/motesverktyg', title: 'AI-mötesverktyg', icon: Mic, bg: `${STORAGE}/ai-motesverktyg-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-teal-500 to-emerald-800' },
  { href: '/ai-verktyg/sociala-medier', title: 'AI sociala medier', icon: Share2, bg: `${STORAGE}/ai-sociala-medier-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-pink-500 to-rose-800' },
  { href: '/ai-verktyg/projektledning', title: 'AI-projektledning', icon: ListChecks, bg: `${STORAGE}/ai-projektledning-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-indigo-500 to-violet-800' },
  { href: '/ai-verktyg/e-handel', title: 'AI för e-handel', icon: ShoppingCart, bg: `${STORAGE}/ai-ehandel-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-amber-500 to-orange-800' },
  { href: '/ai-verktyg/oversattning', title: 'AI-översättning', icon: Languages, bg: `${STORAGE}/ai-oversattning-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-cyan-500 to-sky-800' },
  { href: '/ai-verktyg/dokumenthantering', title: 'AI-dokument', icon: FileText, bg: `${STORAGE}/ai-dokumenthantering-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-zinc-600 to-zinc-900' },
  { href: '/ai-verktyg/ai-assistenter', title: 'AI-assistenter', icon: MessageSquare, bg: `${STORAGE}/ai-assistenter-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-indigo-500 to-blue-800' },
  { href: '/ai-verktyg/rost-och-tal', title: 'AI-röst & tal', icon: Speech, bg: `${STORAGE}/ai-rost-tal-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-rose-500 to-pink-800' },
  { href: '/ai-verktyg/podcast-ljudredigering', title: 'Podcast & ljud', icon: Headphones, bg: `${STORAGE}/podcast-ljudredigering-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-violet-600 to-purple-800' },
  { href: '/ai-verktyg/produktivitet', title: 'AI-produktivitet', icon: Zap, bg: `${STORAGE}/ai-produktivitet-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-amber-500 to-orange-800' },
  { href: '/ai-verktyg/e-postmarknadsforing', title: 'AI e-post', icon: Mail, bg: `${STORAGE}/ai-epostmarknadsforing-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-teal-500 to-emerald-800' },
  { href: '/ai-verktyg/crm', title: 'AI-CRM', icon: Handshake, bg: `${STORAGE}/ai-crm-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-sky-500 to-blue-800' },
  { href: '/ai-verktyg/dataanalys', title: 'AI-dataanalys', icon: BarChart3, bg: `${STORAGE}/ai-dataanalys-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-fuchsia-600 to-rose-800' },
  { href: '/ai-verktyg/utbildning', title: 'AI för utbildning', icon: GraduationCap, bg: `${STORAGE}/ai-utbildning-kategori.webp`, fallbackGradient: 'bg-gradient-to-br from-emerald-500 to-green-800' },
];

/** Quick-jump category cards under the hero. Desktop (lg+) shows the first
 *  8 in a 4×2 grid; mobile shows the first 4 in a 2×2 grid. The rest are
 *  revealed by the "Visa fler kategorier" button.
 *
 *  SEO: every card is always rendered in the DOM (server-rendered) — the
 *  collapsed ones are hidden with the `hidden` CSS class, never unmounted —
 *  so Google can crawl and index all category links regardless of the toggle
 *  state. The button only flips a CSS class (no conditional render). */
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
          // Visibility buckets — cards always stay in the DOM (good for SEO);
          // only the display class changes:
          //   0-3 → always visible (mobile 2×2, part of desktop 4×2)
          //   4-7 → hidden on mobile until expanded, always visible on lg+
          //   8+  → hidden on both mobile and desktop until expanded
          const collapsed =
            i < 4 ? '' : i < 8 ? (showAll ? '' : 'hidden lg:flex') : showAll ? '' : 'hidden';
          return (
            <Link
              key={c.href}
              href={c.href}
              className={
                `group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-xl p-5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-6 ${
                  c.bg ? '' : c.fallbackGradient
                } ${collapsed}`
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

      {/* Expand toggle — collapses to 8 cards on desktop / 4 on mobile. */}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          aria-expanded={showAll}
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
