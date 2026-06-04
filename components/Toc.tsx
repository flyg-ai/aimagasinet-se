import type { TocItem } from '@/lib/toc';

/** Table of contents. Server-rendered — the mobile collapsible uses native
 *  <details> so no client JS is needed; anchor links scroll natively.
 *
 *  variant 'sidebar' → sticky desktop nav (hidden on mobile)
 *  variant 'mobile'  → collapsible <details> shown on mobile only
 */
export function Toc({ items, variant }: { items: TocItem[]; variant: 'sidebar' | 'mobile' }) {
  if (items.length < 2) return null;

  const list = (
    <ul className="flex flex-col gap-1.5">
      {items.map((it) => (
        <li key={it.id} className={it.level === 3 ? 'pl-3' : ''}>
          <a
            href={`#${it.id}`}
            className="block border-l-2 border-transparent py-0.5 pl-3 text-sm leading-snug text-fg-subtle transition-colors hover:border-indigo-500 hover:text-indigo-700"
          >
            {it.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'mobile') {
    return (
      <details className="group mb-8 rounded-xl border border-line bg-card p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
          Innehåll
          <span aria-hidden className="text-lg text-fg-subtle transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <nav aria-label="Innehållsförteckning" className="mt-4">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav
      aria-label="Innehållsförteckning"
      className="hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-line bg-card p-5 lg:block"
    >
      <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
        Innehåll
      </p>
      {list}
    </nav>
  );
}
