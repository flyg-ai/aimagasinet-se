import Link from 'next/link';

const SIZE = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
} as const;

export function CategoryBadge({
  slug,
  size = 'md',
}: {
  slug: string | null | undefined;
  size?: keyof typeof SIZE;
}) {
  if (!slug) return null;
  return (
    <Link
      href={`/kategori/${slug}`}
      className={`inline-block rounded-sm border border-accent-soft-border bg-accent-soft font-mono font-semibold uppercase tracking-wider text-accent transition-colors hover:text-accent-hover ${SIZE[size]}`}
    >
      {slug}
    </Link>
  );
}
