import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';
import { to } from '@/lib/links';

export const revalidate = 3600;

/** Maps a news category to the AI-verktyg hub(s) most relevant to it, shown
 *  as a callout between the header and the article grid. Only categories
 *  with a clean match get an entry — the site's category taxonomy is broad
 *  (7 categories total), so most don't map cleanly to a single tool hub. */
const CATEGORY_HUB_LINKS: Record<string, { href: string; label: string; desc: string }[]> = {
  'ai-sakerhet-etik': [
    {
      href: '/ai-verktyg/ai-sakerhet',
      label: 'AI-säkerhetsverktyg',
      desc: 'Jämför EDR, NDR, molnsäkerhet och andra AI-drivna försvarsverktyg.',
    },
  ],
};

type Props = { params: { slug: string } };

/** Utan den här exporten renderas rutten dynamiskt vid varje anrop trots
 *  revalidate = 3600 — samma misstag som fixades för app/[...slug]/page.tsx
 *  (se kommentaren där). Kategorilänkar finns i headern, mobilmenyn och på
 *  varje artikelsida, så varje saknad prerendering kostade en full
 *  funktionskörning + obegränsad artikelfråga per request. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase.from('categories').select('slug');
  if (error) {
    console.error('[kategori generateStaticParams] supabase error:', error.message);
    return [];
  }
  return (data ?? []).map((c: { slug: string }) => ({ slug: c.slug }));
}

async function getCategory(slug: string) {
  const { data } = await supabase
    .from('categories')
    .select('slug,name,description')
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory(params.slug);
  if (!c) return {};
  const canonical = `/kategori/${c.slug}/`;
  return {
    title: c.name,
    description: c.description || `Alla artiklar i kategorin ${c.name}.`,
    alternates: {
      canonical,
      languages: { 'sv-SE': canonical },
    },
    openGraph: {
      title: c.name,
      url: canonical,
      type: 'website',
      images: [{ url: '/apple-icon.png' }],
    },
    twitter: { card: 'summary', images: ['/apple-icon.png'] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const c = await getCategory(params.slug);
  if (!c) notFound();

  const { data: articles } = await supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path')
    .eq('category', params.slug)
    .eq('type', 'post')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  const list = (articles ?? []) as ArticleCardData[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-12 border-b border-line pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
          ▍ Kategori
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-fg sm:text-5xl">
          {c.name}
        </h1>
        {c.description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {c.description}
          </p>
        )}
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-fg-subtle">
          {list.length} {list.length === 1 ? 'artikel' : 'artiklar'}
        </p>
      </header>

      {CATEGORY_HUB_LINKS[c.slug] && (
        <div className="mb-12 grid gap-4 sm:grid-cols-2">
          {CATEGORY_HUB_LINKS[c.slug].map((h) => (
            <Link
              key={h.href}
              href={to(h.href)}
              className="group flex items-center justify-between gap-4 rounded-md border border-indigo-200 bg-indigo-50 px-5 py-4 transition-colors hover:bg-indigo-100"
            >
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  Relaterade verktyg
                </p>
                <p className="mt-1 text-sm font-semibold text-fg">{h.label}</p>
                <p className="mt-0.5 text-xs text-fg-subtle">{h.desc}</p>
              </div>
              <span aria-hidden className="shrink-0 text-indigo-700 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-fg-subtle">Inga artiklar i den här kategorin än.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
