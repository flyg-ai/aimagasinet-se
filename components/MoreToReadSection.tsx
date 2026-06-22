import Link from 'next/link';
import { to } from '@/lib/links';
import { supabase } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';

type ToolLink = { slug: string; name: string; path: string };

/** Hand-picked from the 5 already in PopularToolsSidebar. Kept duplicated
 *  here rather than imported so this section stays self-contained — the
 *  homepage already renders PopularToolsSidebar in the main grid sidebar
 *  and that one's the source of truth. */
const POPULAR_TOOLS: ToolLink[] = [
  { slug: 'claude',    name: 'Claude',     path: '/ai-verktyg/claude' },
  { slug: 'chatgpt',   name: 'ChatGPT',    path: '/ai-verktyg/chatgpt' },
  { slug: 'cursor-ai', name: 'Cursor AI',  path: '/ai-verktyg/cursor-ai' },
  { slug: 'kling-ai',  name: 'Kling AI',   path: '/ai-video/kling-ai' },
  { slug: 'suno-ai',   name: 'Suno AI',    path: '/ai-verktyg/suno-ai' },
];

type GuideRow = { slug: string; title: string; path: string };

/** Three-column footer block: tool reviews / latest guide pages /
 *  trending posts. Each column has a colored left border so the trio
 *  reads as related-but-distinct lists. */
export async function MoreToReadSection({
  trending,
}: {
  trending: ArticleCardData[];
}) {
  const { data: guides } = await supabase
    .from('articles')
    .select('slug,title,path')
    .like('path', '/ai-guiden%')
    .eq('type', 'page')
    .order('path')
    .limit(6);

  const guideList = (guides ?? []).filter((g) => g.path !== '/ai-guiden') as GuideRow[];

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Mer att läsa
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Column
          title="Populära AI-verktyg"
          subtitle="Våra mest klickade recensioner"
          accent="border-l-4 border-indigo-600"
          headerAccent="text-indigo-700"
          href="/ai-verktyg"
          ctaLabel="Se alla verktyg"
        >
          {POPULAR_TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={to(t.path)}
              className="group flex items-center justify-between border-t border-line-subtle px-1 py-2.5 first:border-t-0"
            >
              <span className="text-sm font-bold text-fg group-hover:text-indigo-700">
                {t.name}
              </span>
              <span aria-hidden className="text-fg-faint group-hover:text-indigo-700">›</span>
            </Link>
          ))}
        </Column>

        <Column
          title="Senaste guider"
          subtitle="Från AI-Guiden"
          accent="border-l-4 border-cyan-600"
          headerAccent="text-cyan-700"
          href="/ai-guiden"
          ctaLabel="Hela AI-Guiden"
        >
          {guideList.length === 0 ? (
            <p className="px-1 py-2 text-sm text-fg-subtle">Inga guider ännu.</p>
          ) : (
            guideList.slice(0, 5).map((g) => (
              <Link
                key={g.slug}
                href={to(g.path)}
                className="group flex items-center justify-between border-t border-line-subtle px-1 py-2.5 first:border-t-0"
              >
                <span className="line-clamp-2 text-sm font-bold text-fg group-hover:text-cyan-700">
                  {g.title}
                </span>
                <span aria-hidden className="ml-2 shrink-0 text-fg-faint group-hover:text-cyan-700">›</span>
              </Link>
            ))
          )}
        </Column>

        <Column
          title="Mest lästa"
          subtitle="Trending just nu"
          accent="border-l-4 border-rose-600"
          headerAccent="text-rose-700"
          href="/"
          ctaLabel="Se startsidan"
        >
          {trending.slice(0, 5).map((a, i) => (
            <Link
              key={a.slug}
              href={to(a.path)}
              className="group flex items-start gap-3 border-t border-line-subtle px-1 py-2.5 first:border-t-0"
            >
              <span
                aria-hidden
                className="shrink-0 font-mono text-base font-black leading-snug text-rose-600"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="line-clamp-2 text-sm font-bold text-fg group-hover:text-rose-700">
                {a.title}
              </span>
            </Link>
          ))}
        </Column>
      </div>
    </section>
  );
}

function Column({
  title,
  subtitle,
  accent,
  headerAccent,
  href,
  ctaLabel,
  children,
}: {
  title: string;
  subtitle: string;
  accent: string;
  headerAccent: string;
  href: string;
  ctaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col rounded-r-lg bg-card p-5 ${accent}`}>
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className={`font-black uppercase tracking-tight text-fg`}>{title}</h3>
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${headerAccent}`}>
          ★
        </span>
      </div>
      <p className="mb-4 text-xs text-fg-subtle">{subtitle}</p>
      <div className="flex flex-col">{children}</div>
      <Link
        href={to(href)}
        className={`mt-4 inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider ${headerAccent} hover:underline`}
      >
        {ctaLabel} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
