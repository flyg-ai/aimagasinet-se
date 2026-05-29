import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import {
  resolveToolProfile,
  toolOverallScore,
} from '@/components/templates/ReviewTemplate';
import {
  COMPARE_TOOLS,
  FEATURED_COMPARISONS,
  comparisonSlug,
  resolveToken,
} from '@/lib/compare';
import { breadcrumbSchema } from '@/lib/schemas';
import { ComparisonWizard, type CatalogTool } from '@/components/ComparisonWizard';

export const revalidate = 300;

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Jämför AI-verktyg — välj och jämför steg för steg (${YEAR})`,
  description:
    'Välj upp till 4 AI-verktyg, berätta vad du ska göra och din budget — så ger vi dig en skräddarsydd rekommendation med tydlig vinnare.',
  alternates: {
    canonical: '/ai-verktyg/jamfor/',
    languages: { 'sv-SE': '/ai-verktyg/jamfor/' },
  },
};

/** featured_image per tool, keyed by REVIEW_KNOWN key (= article slug for
 *  most tools). Best-effort — missing images fall back to a category
 *  gradient in the wizard. */
async function fetchImages(keys: string[]): Promise<Record<string, string | null>> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug,featured_image')
    .in('slug', keys);
  if (error || !data) {
    if (error) console.error('[jamfor] fetchImages error:', error.message);
    return {};
  }
  const map: Record<string, string | null> = {};
  for (const row of data as { slug: string; featured_image: string | null }[]) {
    map[row.slug] = row.featured_image;
  }
  return map;
}

function display(token: string) {
  const ref = resolveToken(token);
  if (!ref) throw new Error(`Unknown compare token: ${token}`);
  const profile = resolveToolProfile(ref.key, ref.name);
  return { name: ref.name, logo: profile.logo, score: toolOverallScore(profile) };
}

export default async function JamforHub() {
  const images = await fetchImages(COMPARE_TOOLS.map((t) => t.key));

  const catalog: CatalogTool[] = COMPARE_TOOLS.map((t) => {
    const profile = resolveToolProfile(t.key, t.name);
    return {
      token: t.token,
      name: t.name,
      category: t.category,
      score: toolOverallScore(profile),
      image: images[t.key] ?? null,
      logo: profile.logo,
      price: profile.offer.price,
      bestFor: profile.offer.bestFor,
      criteria: profile.ratingCriteria,
      useCases: profile.useCases,
      ctaUrl: profile.fallbackUrl ?? null,
      ctaName: profile.ctaName ?? t.name,
    };
  });

  const popular = FEATURED_COMPARISONS.map(([x, y]) => ({
    slug: comparisonSlug(x, y),
    a: display(x),
    b: display(y),
  }));

  const breadcrumbLd = breadcrumbSchema([
    { label: 'Hem', href: '/' },
    { label: 'AI-verktyg', href: '/ai-verktyg' },
    { label: 'Jämför', href: '/ai-verktyg/jamfor' },
  ]);

  return (
    <article className="bg-page text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-cyan-50">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
          <nav aria-label="Brödsmulor" className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Link href="/" className="hover:text-indigo-600">Hem</Link>
            <span className="mx-2 text-line-strong">›</span>
            <Link href="/ai-verktyg" className="hover:text-indigo-600">AI-verktyg</Link>
            <span className="mx-2 text-line-strong">›</span>
            <span className="text-fg-muted">Jämför</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>⚔</span> Jämför steg för steg · {YEAR}
          </span>

          <h1 className="mt-6 max-w-3xl text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
            Hitta rätt AI-verktyg
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            Välj upp till fyra verktyg, berätta vad du ska göra och din budget —
            så ger vi dig en skräddarsydd rekommendation med en tydlig vinnare.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Suspense fallback={<div className="py-20 text-center text-fg-subtle">Laddar…</div>}>
          <ComparisonWizard catalog={catalog} />
        </Suspense>
      </section>

      {/* Curated pairwise comparisons — kept for SEO + internal linking */}
      <section className="border-t border-line bg-card">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
            Populära jämförelser
          </div>
          <h2 className="mb-8 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
            Färdiga dueller
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((c) => (
              <Link
                key={c.slug}
                href={`/ai-verktyg/jamfor/${c.slug}`}
                className="group flex items-center justify-center gap-2 rounded-xl border border-line bg-page px-4 py-4 text-center text-sm font-bold tracking-tight text-fg transition-colors hover:border-indigo-300 hover:bg-indigo-50"
              >
                <span className="text-indigo-600">{c.a.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">vs</span>
                <span className="text-cyan-600">{c.b.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
