import Link from 'next/link';
import { to } from '@/lib/links';

const SIZE = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
} as const;

/** Per-category color palette so AI-nyheter, Teknik & modeller, Företag
 *  & aktörer and AI-säkerhet are immediately distinguishable in a scan.
 *  Fallback to the generic accent palette for less-used categories. */
const PALETTE: Record<string, { bg: string; border: string; text: string; hover: string }> = {
  'ai-nyheter': {
    bg: 'bg-indigo-100',     border: 'border-indigo-200',     text: 'text-indigo-700',     hover: 'hover:text-indigo-900',
  },
  'teknik-modeller': {
    bg: 'bg-cyan-100',       border: 'border-cyan-200',       text: 'text-cyan-700',       hover: 'hover:text-cyan-900',
  },
  'foretag-aktorer': {
    bg: 'bg-amber-100',      border: 'border-amber-200',      text: 'text-amber-800',      hover: 'hover:text-amber-900',
  },
  'ai-sakerhet-etik': {
    bg: 'bg-rose-100',       border: 'border-rose-200',       text: 'text-rose-700',       hover: 'hover:text-rose-900',
  },
};

const FALLBACK = {
  bg: 'bg-accent-soft',      border: 'border-accent-soft-border',   text: 'text-accent',         hover: 'hover:text-accent-hover',
};

const LABELS: Record<string, string> = {
  'ai-nyheter': 'AI-Nyheter',
  'teknik-modeller': 'Teknik & Modeller',
  'foretag-aktorer': 'Företag & Aktörer',
  'ai-sakerhet-etik': 'AI-Säkerhet',
  'forskning-utveckling': 'Forskning',
  'lagstiftning-policy': 'Lagar & Policy',
  'samhalle-paverkan': 'Samhälle',
};

export function categoryLabel(slug: string): string {
  return LABELS[slug] ?? slug;
}

export function CategoryBadge({
  slug,
  size = 'md',
}: {
  slug: string | null | undefined;
  size?: keyof typeof SIZE;
}) {
  if (!slug) return null;
  const p = PALETTE[slug] ?? FALLBACK;
  return (
    <Link
      href={to(`/kategori/${slug}`)}
      className={`inline-block rounded-sm border ${p.border} ${p.bg} ${p.text} ${p.hover} font-mono font-semibold uppercase tracking-wider transition-colors ${SIZE[size]}`}
    >
      {categoryLabel(slug)}
    </Link>
  );
}
