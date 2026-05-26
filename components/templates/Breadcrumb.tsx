import Link from 'next/link';

export type Crumb = { label: string; href: string };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;
  return (
    <nav
      aria-label="Brödsmulor"
      className="mb-5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-fg-subtle"
    >
      <Link href="/" className="hover:text-accent">
        Start
      </Link>
      {crumbs.map((c) => (
        <span key={c.href} className="flex items-center gap-1.5">
          <span className="text-fg-faint">/</span>
          <Link href={c.href} className="hover:text-accent">
            {c.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

/** Build crumbs from a "/a/b/c"-style path, dropping the final segment (current page). */
export function buildCrumbs(path: string): Crumb[] {
  const segs = path.split('/').filter(Boolean);
  return segs.slice(0, -1).map((label, i) => ({
    label,
    href: '/' + segs.slice(0, i + 1).join('/'),
  }));
}
