import Link from 'next/link';
import { to } from '@/lib/links';
import { supabase } from '@/lib/supabase';

/** 5 quick-link tiles to top-reviewed AI tools. Slugs match the review
 *  pages already in the DB so each link lands on the full review. */
type Tool = {
  /** Slug of the review article in the DB — used to fetch featured_image. */
  slug: string;
  name: string;
  path: string;
  blurb: string;
  /** Tailwind bg-* class for the avatar tile when no logo is available. */
  swatch: string;
};

const TOOLS: Tool[] = [
  { slug: 'claude',    name: 'Claude',   path: '/ai-verktyg/ai-text-verktyg/claude',    blurb: 'Bästa skrivande AI 2026',   swatch: 'bg-amber-600' },
  { slug: 'chatgpt',   name: 'ChatGPT',  path: '/ai-verktyg/ai-text-verktyg/chatgpt',   blurb: 'Branschstandard, GPT-5',    swatch: 'bg-emerald-600' },
  { slug: 'cursor-ai', name: 'Cursor',   path: '/ai-verktyg/ai-kod-verktyg/cursor-ai',  blurb: 'Bästa AI för kod',          swatch: 'bg-indigo-700' },
  { slug: 'kling-ai',  name: 'Kling AI', path: '/ai-video/kling-ai',                    blurb: 'Bästa AI-videoverktyget',   swatch: 'bg-fuchsia-700' },
  { slug: 'suno-ai',   name: 'Suno AI',  path: '/ai-verktyg/ai-ljud-och-musik/suno-ai', blurb: 'AI-musik på sekunder',      swatch: 'bg-rose-600' },
];

/** Server-rendered. Fetches featured_image for the 5 tool slugs and
 *  renders each as a logo image inside a white tile when available,
 *  falling back to the colored initial-letter swatch otherwise. */
export async function PopularToolsSidebar() {
  const { data } = await supabase
    .from('articles')
    .select('slug,featured_image')
    .in('slug', TOOLS.map((t) => t.slug));
  const logoBySlug = new Map<string, string>();
  for (const r of data ?? []) {
    if (r.featured_image) logoBySlug.set(r.slug, r.featured_image);
  }

  return (
    <aside className="rounded-xl border border-line bg-card p-5">
      <h2 className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-700">
        <span aria-hidden>★</span>
        Populära AI-verktyg
      </h2>
      <ul className="flex flex-col">
        {TOOLS.map((t, i) => {
          const logo = logoBySlug.get(t.slug);
          return (
            <li key={t.path} className={i > 0 ? 'border-t border-line-subtle' : ''}>
              <Link
                href={to(t.path)}
                className="group flex items-center gap-3 py-3 transition-colors"
              >
                {logo ? (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      alt={`${t.name}-logotyp`}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-mono text-xs font-black text-white ${t.swatch}`}
                  >
                    {t.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold tracking-tight text-fg group-hover:text-accent">
                    {t.name}
                  </div>
                  <div className="line-clamp-1 text-xs text-fg-subtle">{t.blurb}</div>
                </div>
                <span aria-hidden className="text-fg-faint group-hover:text-accent">›</span>
              </Link>
            </li>
          );
        })}
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
