import Link from 'next/link';

/** 5 quick-link tiles to top-reviewed AI tools. Slugs match the review
 *  pages already in the DB so each link lands on the full review. */
type Tool = {
  name: string;
  path: string;
  blurb: string;
  /** Tailwind bg-* class for the avatar tile. */
  swatch: string;
};

const TOOLS: Tool[] = [
  { name: 'Claude',     path: '/ai-verktyg/ai-text-verktyg/claude',     blurb: 'Bästa skrivande AI 2026',     swatch: 'bg-amber-600' },
  { name: 'ChatGPT',    path: '/ai-verktyg/ai-text-verktyg/chatgpt',    blurb: 'Branschstandard, GPT-5',       swatch: 'bg-emerald-600' },
  { name: 'Cursor',     path: '/ai-verktyg/ai-kod-verktyg/cursor-ai',   blurb: 'Bästa AI för kod',            swatch: 'bg-indigo-700' },
  { name: 'Kling AI',   path: '/ai-video/kling-ai',                     blurb: 'Bästa AI-videoverktyget',     swatch: 'bg-fuchsia-700' },
  { name: 'Suno AI',    path: '/ai-verktyg/ai-ljud-och-musik/suno-ai',  blurb: 'AI-musik på sekunder',         swatch: 'bg-rose-600' },
];

export function PopularToolsSidebar() {
  return (
    <aside className="rounded-xl border border-line bg-card p-5">
      <h2 className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-700">
        <span aria-hidden>★</span>
        Populära AI-verktyg
      </h2>
      <ul className="flex flex-col">
        {TOOLS.map((t, i) => (
          <li key={t.path} className={i > 0 ? 'border-t border-line-subtle' : ''}>
            <Link
              href={t.path}
              className="group flex items-center gap-3 py-3 transition-colors"
            >
              <span
                aria-hidden
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-xs font-black text-white ${t.swatch}`}
              >
                {t.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold tracking-tight text-fg group-hover:text-accent">
                  {t.name}
                </div>
                <div className="line-clamp-1 text-xs text-fg-subtle">{t.blurb}</div>
              </div>
              <span aria-hidden className="text-fg-faint group-hover:text-accent">›</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/ai-verktyg"
        className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-accent hover:underline"
      >
        Se alla verktyg <span aria-hidden>›</span>
      </Link>
    </aside>
  );
}
