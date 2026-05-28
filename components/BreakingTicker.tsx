import Link from 'next/link';

export type TickerItem = { slug: string; title: string; path: string };

export function BreakingTicker({ items }: { items: TickerItem[] }) {
  if (!items.length) return null;
  // Duplicate the list so the CSS animation loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div className="border-b border-line bg-soft">
      <div className="mx-auto flex max-w-[120rem] items-stretch">
        {/* LIVE label */}
        <div className="flex shrink-0 items-center gap-2 bg-accent px-4 py-2">
          <span className="live-dot h-2 w-2 rounded-full bg-accent-fg" />
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-accent-fg">
            Direkt
          </span>
        </div>
        {/* Scrolling track */}
        <div className="ticker flex-1">
          <div className="ticker-track py-2 text-sm">
            {loop.map((it, i) => (
              <Link
                key={`${it.slug}-${i}`}
                href={it.path}
                className="group inline-flex items-center gap-3 text-fg-muted hover:text-accent"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
                  ▸ Nytt
                </span>
                <span className="group-hover:underline">{it.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
