import type { Metadata } from 'next';
import Link from 'next/link';
import {
  resolveToolProfile,
  toolOverallScore,
} from '@/components/templates/ReviewTemplate';
import {
  COMPARE_TOOLS,
  FEATURED_COMPARISONS,
  TOOL_CATEGORIES,
  comparisonSlug,
  comparisonCategory,
  resolveToken,
} from '@/lib/compare';
import { breadcrumbSchema } from '@/lib/schemas';
import { ComparisonExplorer, type ToolOpt, type CompCard } from '@/components/ComparisonExplorer';

export const revalidate = 300;

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Jämför AI-verktyg sida vid sida (${YEAR})`,
  description:
    'Välj två AI-verktyg och jämför dem sida vid sida — betyg, för- och nackdelar, pris och en tydlig vinnare. ChatGPT vs Claude, Cursor vs Copilot, Midjourney vs DALL·E och fler.',
  alternates: {
    canonical: '/ai-verktyg/jamfor/',
    languages: { 'sv-SE': '/ai-verktyg/jamfor/' },
  },
};

/** Resolve a token to display bits (name + logo + score) for cards. */
function display(token: string) {
  const ref = resolveToken(token);
  if (!ref) throw new Error(`Unknown compare token: ${token}`);
  const profile = resolveToolProfile(ref.key, ref.name);
  return { name: ref.name, logo: profile.logo, score: toolOverallScore(profile) };
}

export default function JamforHub() {
  // Tool options for the dropdowns (one per canonical tool, with logo).
  const tools: ToolOpt[] = COMPARE_TOOLS.map((t) => ({
    token: t.token,
    name: t.name,
    category: t.category,
    logo: resolveToolProfile(t.key, t.name).logo,
  }));

  // Curated comparison cards.
  const comparisons: CompCard[] = FEATURED_COMPARISONS.map(([x, y]) => {
    const a = display(x);
    const b = display(y);
    return {
      slug: comparisonSlug(x, y),
      aName: a.name, bName: b.name,
      aLogo: a.logo, bLogo: b.logo,
      aScore: a.score, bScore: b.score,
      category: comparisonCategory(x, y) ?? 'AI-text',
    };
  });

  // Only show filter chips for categories that actually have comparisons.
  const usedCategories = TOOL_CATEGORIES.filter((c) =>
    comparisons.some((cmp) => cmp.category === c),
  );

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
            <span aria-hidden>⚔</span> {comparisons.length} jämförelser · {YEAR}
          </span>

          <h1 className="mt-6 max-w-3xl text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
            Jämför AI-verktyg sida vid sida
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            Välj två verktyg nedan så ställer vi dem mot varandra — betyg per
            kriterium, för- och nackdelar, pris och en tydlig vinnare.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <ComparisonExplorer tools={tools} comparisons={comparisons} categories={usedCategories} />
      </section>
    </article>
  );
}
