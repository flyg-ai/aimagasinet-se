import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';
import { COMPANIES, companyBySlug } from '@/lib/companies';

export const revalidate = 3600;

type Props = { params: { slug: string } };

const STATUS_LABEL: Record<string, string> = {
  startup: 'Startup',
  etablerad: 'Etablerat bolag',
  uppkopt: 'Uppköpt',
};

const STATUS_BADGE: Record<string, string> = {
  startup: 'bg-indigo-600 text-white',
  etablerad: 'bg-slate-700 text-white',
  uppkopt: 'bg-amber-500 text-white',
};

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = companyBySlug(params.slug);
  if (!c) return {};
  const canonical = `/foretag/${c.slug}/`;
  const title = `${c.name} — allt vi skrivit`;
  return {
    title,
    description: c.oneLiner,
    alternates: { canonical, languages: { 'sv-SE': canonical } },
    openGraph: { title, url: canonical, type: 'website', images: [{ url: '/apple-icon.png' }] },
    twitter: { card: 'summary', images: ['/apple-icon.png'] },
  };
}

export default async function CompanyPage({ params }: Props) {
  const c = companyBySlug(params.slug);
  if (!c) notFound();

  const { data: articles } = await supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path')
    .contains('companies', [params.slug])
    .eq('type', 'post')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  const list = (articles ?? []) as ArticleCardData[];

  const initial = c.name.trim().charAt(0).toUpperCase();

  return (
    <div className="bg-page text-fg">
      {/* Hero — indigo gradient, samma familj som /ai-verktyg/foretag */}
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted dark:from-indigo-500/10">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
            ▍ Företag
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-2xl font-black text-white shadow-sm"
            >
              {initial}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight text-fg sm:text-5xl">{c.name}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_BADGE[c.status] ?? 'bg-fg-subtle text-white'}`}>
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
            {c.description ?? c.oneLiner}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={c.website}
              rel="nofollow noopener"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {c.website.replace(/^https?:\/\//, '')} ↗
            </Link>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              {list.length} {list.length === 1 ? 'artikel' : 'artiklar'} om {c.name}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {(c.founded || c.founders || c.headquarters || c.size) && (
          <dl className="mb-10 grid gap-x-8 gap-y-5 rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-500/20 dark:bg-indigo-500/5 sm:grid-cols-2">
            {c.founded && (
              <div>
                <dt className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Grundat</dt>
                <dd className="mt-1 text-fg">{c.founded}</dd>
              </div>
            )}
            {c.founders && c.founders.length > 0 && (
              <div>
                <dt className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Grundare</dt>
                <dd className="mt-1 text-fg">{c.founders.join(', ')}</dd>
              </div>
            )}
            {c.headquarters && (
              <div>
                <dt className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Huvudkontor</dt>
                <dd className="mt-1 text-fg">{c.headquarters}</dd>
              </div>
            )}
            {c.size && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">Storlek</dt>
                <dd className="mt-1 text-fg">{c.size}</dd>
              </div>
            )}
          </dl>
        )}

        {c.about && (
          <div className="mb-10 max-w-3xl">
            <h2 className="mb-3 text-xl font-semibold text-fg">Om {c.name}</h2>
            <p className="leading-relaxed text-fg-muted">{c.about}</p>
          </div>
        )}

        {c.reviewPath && (
          <Link
            href={c.reviewPath}
            className="mb-10 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-sm font-medium text-accent hover:bg-accent-soft/70"
          >
            Läs vår recension av {c.name} →
          </Link>
        )}

        <h2 className="mb-5 text-xl font-semibold text-fg">Artiklar om {c.name}</h2>
        {list.length === 0 ? (
          <p className="text-fg-subtle">Inga artiklar om {c.name} än.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
