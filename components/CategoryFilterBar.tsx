'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type FilterCategory = { slug: string; name: string };

export function CategoryFilterBar({ categories }: { categories: FilterCategory[] }) {
  const pathname = usePathname();

  const items: { href: string; label: string; active: boolean }[] = [
    { href: '/', label: 'Alla', active: pathname === '/' },
    ...categories.map((c) => ({
      href: `/kategori/${c.slug}`,
      label: c.name,
      active: pathname === `/kategori/${c.slug}`,
    })),
  ];

  return (
    <div className="border-b border-line bg-page">
      <nav className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={
              'shrink-0 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ' +
              (it.active
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-line bg-card text-fg-subtle hover:border-line-strong hover:bg-soft hover:text-accent')
            }
          >
            {it.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
