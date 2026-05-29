import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  resolveToolProfile,
  toolOverallScore,
} from '@/components/templates/ReviewTemplate';
import { ComparisonTemplate } from '@/components/templates/ComparisonTemplate';
import {
  parseComparisonSlug,
  featuredSlugs,
  fallbackIntro,
  fallbackVerdict,
  fallbackFaqs,
  type CompareToolRef,
  type ComparedTool,
  type ComparisonContent,
} from '@/lib/compare';

export const revalidate = 300;

type Props = { params: { jamforelse: string } };

/** Build the fully-resolved comparison side from a tool ref. */
function buildTool(ref: CompareToolRef): ComparedTool {
  const profile = resolveToolProfile(ref.key, ref.name);
  return {
    ref,
    profile,
    score: toolOverallScore(profile),
    ctaUrl: profile.fallbackUrl ?? null,
    ctaLabel: `Prova ${profile.ctaName ?? ref.name}`,
  };
}

/** Pull Haiku-generated content from the comparisons table. Returns null on
 *  any miss (table not applied, no row, malformed JSON) so the page falls
 *  back to deterministic templated copy. */
async function getStoredContent(slug: string): Promise<ComparisonContent | null> {
  const { data, error } = await supabase
    .from('comparisons')
    .select('content')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data?.content) {
    if (error && !/relation .*comparisons.* does not exist|could not find the table/i.test(error.message)) {
      console.error('[comparisons] supabase error:', error.message);
    }
    return null;
  }
  try {
    const parsed = JSON.parse(data.content as string);
    const faqs = Array.isArray(parsed?.faqs) ? parsed.faqs : [];
    const valid =
      typeof parsed?.intro === 'string' &&
      typeof parsed?.verdict === 'string' &&
      faqs.length >= 3 &&
      faqs.every((f: unknown) => {
        const x = f as { question?: unknown; answer?: unknown };
        return typeof x?.question === 'string' && typeof x?.answer === 'string';
      });
    if (!valid) return null;
    return { intro: parsed.intro, verdict: parsed.verdict, faqs: faqs.slice(0, 5) };
  } catch {
    return null;
  }
}

export function generateStaticParams(): { jamforelse: string }[] {
  return featuredSlugs().map((jamforelse) => ({ jamforelse }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseComparisonSlug(params.jamforelse);
  if (!parsed) return {};
  const { a, b } = parsed;
  const year = new Date().getFullYear();
  const title = `${a.name} eller ${b.name}? Jämförelse & test ${year}`;
  const description = `${a.name} vs ${b.name} — vi jämför betyg, för- och nackdelar, pris och kör en head-to-head så att du vet vilket AI-verktyg du ska välja.`;
  const canonicalPath = `/ai-verktyg/jamfor/${params.jamforelse}/`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath, languages: { 'sv-SE': canonicalPath } },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalPath,
      images: [{ url: '/apple-icon.png' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/apple-icon.png'] },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const parsed = parseComparisonSlug(params.jamforelse);
  if (!parsed) notFound();

  const a = buildTool(parsed.a);
  const b = buildTool(parsed.b);

  const stored = await getStoredContent(params.jamforelse);
  const content: ComparisonContent = stored ?? {
    intro: fallbackIntro(a, b),
    verdict:
      a.score >= b.score ? fallbackVerdict(a, b) : fallbackVerdict(b, a),
    faqs: fallbackFaqs(a, b),
  };

  return <ComparisonTemplate a={a} b={b} content={content} slug={params.jamforelse} />;
}
