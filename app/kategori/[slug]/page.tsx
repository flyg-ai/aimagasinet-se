import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';

export const revalidate = 300;

type Props = { params: { slug: string } };

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
