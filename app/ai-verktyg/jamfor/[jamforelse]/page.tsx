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
  fallbackUseCases,
  SYFTE_OPTIONS,
  type CompareToolRef,
  type ComparedTool,
  type ComparisonContent,
  type UseCaseVerdict,
} from '@/lib/compare';

export const revalidate = 300;

type Props = { params: { jamforelse: string } };

/** Build the fully-resolved comparison side from a tool ref. */
function buildTool(ref: CompareToolRef, image: string | null): ComparedTool {
  const profile = resolveToolProfile(ref.key, ref.name);
  return {
    ref,
    profile,
    score: toolOverallScore(profile),
    ctaUrl: profile.fallbackUrl ?? null,
    ctaLabel: `Prova ${profile.ctaName ?? ref.name}`,
    image,
  };
}

/** featured_image for the two tools, keyed by REVIEW_KNOWN key (= article
 *  slug). Best-effort: a miss leaves the logo as the coloured initial, which
 *  is what every comparison rendered before the tool tiles existed. */
async function fetchImages(keys: string[]): Promise<Record<string, string | null>> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug,featured_image')
    .in('slug', keys);
  if (error || !data) {
    if (error) console.error('[jamforelse] fetchImages error:', error.message);
    return {};
  }
  const out: Record<string, string | null> = {};
  for (const row of data as { slug: string; featured_image: string | null }[]) {
    out[row.slug] = row.featured_image;
  }
  return out;
}

/** Vad getStoredContent hamtar fran DB — likt ComparisonContent, men
 *  useCases kan sakna en giltig rad (aldre content, eller trasig JSON) utan
 *  att intro/verdict/faqs for den skull ska kasseras. */
type StoredContent = { intro: string; verdict: string; faqs: ComparisonContent['faqs']; useCases: UseCaseVerdict[] | null };

/** Pull Haiku-generated content from the comparisons table. Returns null on
 *  any miss (table not applied, no row, malformed JSON) so the page falls
 *  back to deterministic templated copy. */
async function getStoredContent(slug: string): Promise<StoredContent | null> {
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

    const rawUseCases: unknown[] = Array.isArray(parsed?.useCases) ? parsed.useCases : [];
    const useCasesValid =
      rawUseCases.length === SYFTE_OPTIONS.length &&
      SYFTE_OPTIONS.every((o) =>
        rawUseCases.some((u) => {
          const x = u as { syfte?: unknown; winner?: unknown; reason?: unknown };
          return x?.syfte === o.slug && (x?.winner === 'a' || x?.winner === 'b') && typeof x?.reason === 'string';
        }),
      );
    const useCases = useCasesValid
      ? SYFTE_OPTIONS.map((o) => (rawUseCases as UseCaseVerdict[]).find((u) => u.syfte === o.slug)!)
      : null;

    return { intro: parsed.intro, verdict: parsed.verdict, faqs: faqs.slice(0, 5), useCases };
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

  const [images, stored] = await Promise.all([
    fetchImages([parsed.a.key, parsed.b.key]),
    getStoredContent(params.jamforelse),
  ]);
  const a = buildTool(parsed.a, images[parsed.a.key] ?? null);
  const b = buildTool(parsed.b, images[parsed.b.key] ?? null);

  // useCases far sin egen fallback oavsett om resten kom fran Haiku eller
  // ar helt deterministiskt — en aldre rad utan falt ska anda visa nagot.
  const content: ComparisonContent = stored
    ? { intro: stored.intro, verdict: stored.verdict, faqs: stored.faqs, useCases: stored.useCases ?? fallbackUseCases(a, b) }
    : {
        intro: fallbackIntro(a, b),
        verdict: a.score >= b.score ? fallbackVerdict(a, b) : fallbackVerdict(b, a),
        faqs: fallbackFaqs(a, b),
        useCases: fallbackUseCases(a, b),
      };

  return <ComparisonTemplate a={a} b={b} content={content} slug={params.jamforelse} />;
}
