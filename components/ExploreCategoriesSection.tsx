import Link from 'next/link';
import { Type, Video, Code2, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Card = {
  href: string;
  title: string;
  icon: LucideIcon;
  /** Tailwind gradient classes applied to the card. */
  gradient: string;
};

const CARDS: Card[] = [
  {
    href: '/ai-verktyg/ai-text-verktyg',
    title: 'AI-text',
    icon: Type,
    gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-800',
  },
  {
    href: '/ai-video',
    title: 'AI-video',
    icon: Video,
    gradient: 'bg-gradient-to-br from-cyan-500 to-sky-800',
  },
  {
    href: '/ai-verktyg/ai-kod-verktyg',
    title: 'AI-kod',
    icon: Code2,
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-800',
  },
  {
    href: '/ai-verktyg/foretag',
    title: 'AI för företag',
    icon: Briefcase,
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
  },
];

/** 4 quick-jump cards under the hero — fast escape hatches to the
 *  most common destinations. 2×2 on mobile, 4-col on desktop. */
export function ExploreCategoriesSection() {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Utforska AI-verktyg
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl p-5 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl sm:p-6 ${c.gradient}`}
            >
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm sm:h-11 sm:w-11"
              >
                <Icon className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight sm:text-xl">
                {c.title}
              </h3>
              <span className="mt-auto inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white/95">
                Utforska <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
