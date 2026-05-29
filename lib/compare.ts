/**
 * Registry + helpers for the AI-verktyg jämförelse-feature
 * (/ai-verktyg/jamfor/[verktyg-a]-eller-[verktyg-b]).
 *
 * Pure module — only a *type* import from ReviewTemplate (erased at runtime),
 * so it stays importable from plain node/tsx scripts without dragging in
 * next/link or client components. Tool *data* lives in REVIEW_KNOWN; this
 * module just maps URL tokens → REVIEW_KNOWN keys and builds the templated
 * fallback copy used when no Haiku-generated row exists in Supabase.
 */
import type { ReviewProfile } from '@/components/templates/ReviewTemplate';
import type { FaqItem } from '@/lib/schemas';

/** A tool as referenced from a comparison URL. `token` is the URL segment,
 *  `key` is the REVIEW_KNOWN lookup key (they differ for a few tools). */
export type CompareToolRef = { token: string; key: string; name: string };

/** Every tool that may appear in a comparison URL. Keep `key` in sync with
 *  REVIEW_KNOWN in components/templates/ReviewTemplate.tsx. */
export const COMPARE_TOOLS: CompareToolRef[] = [
  { token: 'chatgpt',        key: 'chatgpt',        name: 'ChatGPT' },
  { token: 'claude',         key: 'claude',         name: 'Claude' },
  { token: 'gemini',         key: 'gemini',         name: 'Gemini' },
  { token: 'cursor',         key: 'cursor-ai',      name: 'Cursor AI' },
  { token: 'github-copilot', key: 'github-copilot', name: 'GitHub Copilot' },
  { token: 'midjourney',     key: 'midjourney',     name: 'Midjourney' },
  { token: 'dall-e-3',       key: 'dalle-3',        name: 'DALL·E 3' },
  { token: 'suno',           key: 'suno-ai',        name: 'Suno AI' },
  { token: 'udio',           key: 'udio',           name: 'Udio' },
  { token: 'kling',          key: 'kling-ai',       name: 'Kling AI' },
  { token: 'pika-labs',      key: 'pika-labs',      name: 'Pika Labs' },
];

const TOKEN_INDEX: Record<string, CompareToolRef> = Object.fromEntries(
  COMPARE_TOOLS.map((t) => [t.token, t]),
);

/** The curated set of comparisons that get static pages + hub cards.
 *  Each entry is [tokenA, tokenB]; the slug is `${a}-eller-${b}`. */
export const FEATURED_COMPARISONS: [string, string][] = [
  ['chatgpt', 'claude'],
  ['cursor', 'github-copilot'],
  ['midjourney', 'dall-e-3'],
  ['suno', 'udio'],
  ['kling', 'pika-labs'],
  ['chatgpt', 'gemini'],
  ['claude', 'gemini'],
];

export const SEPARATOR = '-eller-';

export function comparisonSlug(aToken: string, bToken: string): string {
  return `${aToken}${SEPARATOR}${bToken}`;
}

export function featuredSlugs(): string[] {
  return FEATURED_COMPARISONS.map(([a, b]) => comparisonSlug(a, b));
}

/** Parse a comparison slug into its two tool refs. Returns null for malformed
 *  slugs or unknown tokens (→ the route should 404), so we never render junk
 *  pages for arbitrary token soup. */
export function parseComparisonSlug(
  slug: string,
): { a: CompareToolRef; b: CompareToolRef } | null {
  const decoded = decodeURIComponent(slug);
  const idx = decoded.indexOf(SEPARATOR);
  if (idx < 0) return null;
  const aToken = decoded.slice(0, idx);
  const bToken = decoded.slice(idx + SEPARATOR.length);
  const a = TOKEN_INDEX[aToken];
  const b = TOKEN_INDEX[bToken];
  if (!a || !b || a.token === b.token) return null;
  return { a, b };
}

/* ─── Comparison content (Haiku-generated, cached in Supabase) ──────── */

export type ComparisonContent = {
  /** 2-3 sentence editorial lead comparing the two tools. */
  intro: string;
  /** Motivation for the editorial pick (the winner is computed, not chosen
   *  by the model — this prose just justifies the higher score). */
  verdict: string;
  /** Exactly 5 FAQ pairs about the head-to-head. */
  faqs: FaqItem[];
};

/** A fully resolved side of a comparison — profile + derived display bits. */
export type ComparedTool = {
  ref: CompareToolRef;
  profile: ReviewProfile;
  score: number;
  ctaUrl: string | null;
  ctaLabel: string;
};

/* ─── Templated fallbacks ───────────────────────────────────────────
   Deterministic copy used when the comparisons table has no Haiku row yet
   (table not applied, or seeder not run). Keeps every page fully functional
   and SEO-complete regardless of generation state. */

export function fallbackIntro(a: ComparedTool, b: ComparedTool): string {
  const lead = a.score >= b.score ? a : b;
  return (
    `${a.ref.name} och ${b.ref.name} är två av de mest använda AI-verktygen i sin kategori, ` +
    `och valet mellan dem avgörs oftast av vad du faktiskt ska göra. ` +
    `${a.ref.name} kommer från ${a.profile.company} och utmärker sig på ${a.profile.useCases[0]?.toLowerCase() ?? 'sitt område'}, ` +
    `medan ${b.ref.name} (${b.profile.company}) är starkast på ${b.profile.useCases[0]?.toLowerCase() ?? 'sitt område'}. ` +
    `I vår sammanvägda bedömning landar ${lead.ref.name} något högre, men skillnaden är liten — här går vi igenom betyg, för- och nackdelar och pris så att du kan välja rätt.`
  );
}

export function fallbackVerdict(winner: ComparedTool, loser: ComparedTool): string {
  return (
    `Vår sammanvägda bedömning ger ${winner.ref.name} ${winner.score.toFixed(1)} mot ${loser.ref.name}s ${loser.score.toFixed(1)}. ` +
    `${winner.ref.name} tar hem det tack vare ${winner.profile.pros[0]?.toLowerCase() ?? 'sin helhet'} och ${winner.profile.pros[1]?.toLowerCase() ?? 'sin bredd'}. ` +
    `${loser.ref.name} är dock ett mycket starkt alternativ — särskilt om du värdesätter ${loser.profile.pros[0]?.toLowerCase() ?? 'dess styrkor'}. ` +
    `Båda har gratisnivåer, så det enklaste är att testa själv innan du betalar.`
  );
}

export function fallbackFaqs(a: ComparedTool, b: ComparedTool): FaqItem[] {
  const winner = a.score >= b.score ? a : b;
  const loser = a.score >= b.score ? b : a;
  return [
    {
      question: `Vad är skillnaden mellan ${a.ref.name} och ${b.ref.name}?`,
      answer:
        `${a.ref.name} från ${a.profile.company} är gjort för ${a.profile.useCases.slice(0, 2).join(' och ').toLowerCase()}, ` +
        `medan ${b.ref.name} från ${b.profile.company} lutar mer åt ${b.profile.useCases.slice(0, 2).join(' och ').toLowerCase()}. ` +
        `De överlappar mycket, men styrkorna skiljer sig i detaljerna.`,
    },
    {
      question: `Vilket är bäst av ${a.ref.name} och ${b.ref.name}?`,
      answer:
        `I vår sammanvägda bedömning får ${winner.ref.name} ${winner.score.toFixed(1)} av 10 och ${loser.ref.name} ${loser.score.toFixed(1)}. ` +
        `${winner.ref.name} är alltså vårt förstaval totalt sett, men "bäst" beror på din uppgift — läs betygsmatrisen ovan för att se var respektive verktyg drar ifrån.`,
    },
    {
      question: `Vad kostar ${a.ref.name} jämfört med ${b.ref.name}?`,
      answer:
        `${a.ref.name}: ${a.profile.offer.price}. ${b.ref.name}: ${b.profile.offer.price}. ` +
        `Båda går att börja med gratis, och premium ligger i samma härad — priset är sällan det som avgör valet.`,
    },
    {
      question: `Är ${a.ref.name} eller ${b.ref.name} bäst för nybörjare?`,
      answer:
        `För den som är ny rekommenderar vi att börja med ${winner.ref.name}, som passar bra för ${winner.profile.offer.bestFor.toLowerCase()}. ` +
        `${loser.ref.name} är minst lika kapabelt men lönar sig mest när du vet exakt vad du vill ha ut av verktyget.`,
    },
    {
      question: `Kan man använda både ${a.ref.name} och ${b.ref.name}?`,
      answer:
        `Ja, många kombinerar dem och låter varje verktyg göra det det är bäst på. ` +
        `Eftersom båda har gratisnivåer kostar det inget att köra dem parallellt en period och se vilket som passar ditt arbetsflöde.`,
    },
  ];
}
