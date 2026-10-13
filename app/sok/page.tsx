import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Sök på AI-Magasinet',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { q?: string } };

type Hit = { slug: string; path: string | null; title: string; excerpt: string | null; type: 'post' | 'page' };

type Group = 'tools' | 'news' | 'other';

/** Verktyg och recensioner ligger under /ai-verktyg/ eller /ai-video/. Nyheter är artikeltypen "post". */
function groupOf(h: Hit): Group {
  if (h.path && /^\/(ai-verktyg|ai-video)\//.test(h.path)) return 'tools';
  if (h.type === 'post') return 'news';
  return 'other';
}

const GROUP_LABEL: Record<Group, string> = {
  tools: 'Verktyg och recensioner',
  news: 'Nyheter',
  other: 'Guider och övrigt',
};

/** Tar bort tecken som har betydelse i PostgREST-filter och LIKE-mönster. */
function cleanQuery(raw: string | undefined): string {
  return (raw ?? '').replace(/[,()%_*\\]/g, ' ').trim().slice(0, 100);
}

export default async function SokPage({ searchParams }: Props) {
  const q = cleanQuery(searchParams.q);
  let hits: Hit[] = [];

  if (q.length >= 2) {
    const { data, error } = await supabase
      .from('articles')
      .select('slug,path,title,excerpt,type')
      .not('published_at', 'is', null)
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order('published_at', { ascending: false })
      .limit(30);
    if (error) console.error('[sok] supabase error:', error.message);
    hits = (data ?? []) as Hit[];
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Sök</h1>

      <form action="/sok/" method="get" className="mt-6 flex gap-2" role="search">
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ''}
          placeholder="Sök på verktyg, ämne eller företag"
          aria-label="Sökord"
          className="flex-1 rounded-lg border border-black/15 bg-white px-4 py-3 text-fg dark:border-white/15 dark:bg-white/5"
        />
        <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">
          Sök
        </button>
      </form>

      {q.length >= 2 && (
        <p className="mt-6 text-sm text-fg/60">
          {hits.length === 0 ? `Inga träffar på "${q}".` : `${hits.length} träffar på "${q}".`}
        </p>
      )}
      {q.length > 0 && q.length < 2 && (
        <p className="mt-6 text-sm text-fg/60">Skriv minst två tecken.</p>
      )}

      {(['tools', 'news', 'other'] as Group[]).map((g) => {
        const rows = hits.filter((h) => groupOf(h) === g);
        if (rows.length === 0) return null;
        return (
          <section key={g} className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-fg/60">
              {GROUP_LABEL[g]} ({rows.length})
            </h2>
            <ul className="mt-3 space-y-3">
              {rows.map((h) => (
                <li key={h.slug} className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                  <Link href={h.path ?? `/${h.slug}/`} className="text-lg font-semibold text-fg hover:underline">
                    {h.title}
                  </Link>
                  {h.excerpt && <p className="mt-1 line-clamp-2 text-sm text-fg/70">{h.excerpt}</p>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
