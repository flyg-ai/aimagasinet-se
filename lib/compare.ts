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

export type ToolCategory =
  | 'AI-text'
  | 'AI-video'
  | 'AI-bilder'
  | 'AI-kod'
  | 'AI-ljud'
  | 'AI-automation';

/** Category display order — drives dropdown groups + filter chips. */
export const TOOL_CATEGORIES: ToolCategory[] = [
  'AI-text', 'AI-video', 'AI-bilder', 'AI-kod', 'AI-ljud', 'AI-automation',
];

/** A tool as referenced from a comparison URL. `token` is the URL segment,
 *  `key` is the REVIEW_KNOWN lookup key (they differ for a few tools). */
export type CompareToolRef = { token: string; key: string; name: string; category: ToolCategory };

/** Every tool that may appear in a comparison URL / dropdown. One canonical
 *  entry per tool. Keep `key` in sync with REVIEW_KNOWN in
 *  components/templates/ReviewTemplate.tsx. */
export const COMPARE_TOOLS: CompareToolRef[] = [
  // AI-text
  { token: 'chatgpt',        key: 'chatgpt',        name: 'ChatGPT',        category: 'AI-text' },
  { token: 'claude',         key: 'claude',         name: 'Claude',         category: 'AI-text' },
  { token: 'gemini',         key: 'gemini',         name: 'Gemini',         category: 'AI-text' },
  { token: 'jasper-ai',      key: 'jasper-ai',      name: 'Jasper AI',      category: 'AI-text' },
  { token: 'writesonic',     key: 'writesonic',     name: 'Writesonic',     category: 'AI-text' },
  { token: 'copy-ai',        key: 'copy-ai',        name: 'Copy.ai',        category: 'AI-text' },
  { token: 'perplexity',     key: 'perplexity',     name: 'Perplexity',     category: 'AI-text' },
  { token: 'microsoft-copilot', key: 'microsoft-copilot', name: 'Microsoft Copilot', category: 'AI-text' },
  { token: 'deepseek',       key: 'deepseek',       name: 'DeepSeek',       category: 'AI-text' },
  { token: 'grok',           key: 'grok',           name: 'Grok',           category: 'AI-text' },
  { token: 'mistral',        key: 'mistral-le-chat', name: 'Mistral Le Chat', category: 'AI-text' },
  // AI-video
  { token: 'kling',          key: 'kling-ai',       name: 'Kling AI',       category: 'AI-video' },
  { token: 'runway-gen-3',   key: 'runway-gen-3',   name: 'Runway Gen-3',   category: 'AI-video' },
  { token: 'pika-labs',      key: 'pika-labs',      name: 'Pika Labs',      category: 'AI-video' },
  { token: 'sora-2',         key: 'sora-2',         name: 'Sora 2',         category: 'AI-video' },
  { token: 'heygen',         key: 'heygen',         name: 'HeyGen',         category: 'AI-video' },
  { token: 'synthesia',      key: 'synthesia',      name: 'Synthesia',      category: 'AI-video' },
  { token: 'luma',           key: 'luma-dream-machine', name: 'Luma Dream Machine', category: 'AI-video' },
  { token: 'invideo',        key: 'invideo',        name: 'InVideo',        category: 'AI-video' },
  { token: 'capcut',         key: 'capcut-ai-vklipp', name: 'CapCut AI',    category: 'AI-video' },
  // AI-bilder
  { token: 'midjourney',      key: 'midjourney',      name: 'Midjourney',      category: 'AI-bilder' },
  { token: 'dall-e-3',        key: 'dalle-3',         name: 'DALL·E 3',        category: 'AI-bilder' },
  { token: 'adobe-firefly',   key: 'adobe-firefly',   name: 'Adobe Firefly',   category: 'AI-bilder' },
  { token: 'leonardo-ai',     key: 'leonardo-ai',     name: 'Leonardo AI',     category: 'AI-bilder' },
  { token: 'ideogram',        key: 'ideogram',        name: 'Ideogram',        category: 'AI-bilder' },
  { token: 'flux',            key: 'flux',            name: 'Flux',            category: 'AI-bilder' },
  { token: 'stable-diffusion', key: 'stable-diffusion', name: 'Stable Diffusion', category: 'AI-bilder' },
  { token: 'canva-ai',        key: 'canva-ai',        name: 'Canva AI',        category: 'AI-bilder' },
  // AI-kod
  { token: 'cursor',         key: 'cursor-ai',      name: 'Cursor AI',      category: 'AI-kod' },
  { token: 'claude-code',    key: 'claude-code',    name: 'Claude Code',    category: 'AI-kod' },
  { token: 'github-copilot', key: 'github-copilot', name: 'GitHub Copilot', category: 'AI-kod' },
  { token: 'windsurf',       key: 'windsurf',       name: 'Windsurf',       category: 'AI-kod' },
  { token: 'tabnine',        key: 'tabnine',        name: 'Tabnine',        category: 'AI-kod' },
  { token: 'codeium',        key: 'codeium',        name: 'Codeium',        category: 'AI-kod' },
  { token: 'jetbrains-ai',   key: 'jetbrains-ai',   name: 'JetBrains AI',   category: 'AI-kod' },
  { token: 'replit',         key: 'replit-ai',      name: 'Replit AI',      category: 'AI-kod' },
  { token: 'cody',           key: 'sourcegraph-cody', name: 'Sourcegraph Cody', category: 'AI-kod' },
  // AI-ljud
  { token: 'suno',           key: 'suno-ai',        name: 'Suno AI',        category: 'AI-ljud' },
  { token: 'udio',           key: 'udio',           name: 'Udio',           category: 'AI-ljud' },
  { token: 'elevenlabs',     key: 'elevenlabs',     name: 'ElevenLabs',     category: 'AI-ljud' },
  { token: 'descript',       key: 'descript',       name: 'Descript',       category: 'AI-ljud' },
  { token: 'murf',           key: 'murf-ai',        name: 'Murf AI',        category: 'AI-ljud' },
  { token: 'play-ht',        key: 'play-ht',        name: 'Play.ht',        category: 'AI-ljud' },
  { token: 'speechify',      key: 'speechify',      name: 'Speechify',      category: 'AI-ljud' },
  { token: 'riverside',      key: 'riverside-fm',   name: 'Riverside',      category: 'AI-ljud' },
  { token: 'podcastle',      key: 'podcastle',      name: 'Podcastle',      category: 'AI-ljud' },
  { token: 'resemble',       key: 'resemble-ai',    name: 'Resemble AI',    category: 'AI-ljud' },
  // AI-automation
  { token: 'make',           key: 'make',           name: 'Make',           category: 'AI-automation' },
  { token: 'zapier-ai',      key: 'zapier-ai',      name: 'Zapier',         category: 'AI-automation' },
  { token: 'n8n',            key: 'n8n',            name: 'n8n',            category: 'AI-automation' },
  { token: 'power-automate', key: 'power-automate', name: 'Power Automate', category: 'AI-automation' },
  { token: 'relay',          key: 'relay-app',      name: 'Relay',          category: 'AI-automation' },
];

const TOKEN_INDEX: Record<string, CompareToolRef> = Object.fromEntries(
  COMPARE_TOOLS.map((t) => [t.token, t]),
);

/** Extra URL tokens that resolve to a canonical tool (e.g. the featured slug
 *  uses `suno-ai` while the canonical dropdown token is `suno`). */
const TOKEN_ALIASES: Record<string, string> = {
  'suno-ai': 'suno',
};

/** Resolve a URL token (canonical or alias) to its tool ref, or null. */
export function resolveToken(token: string): CompareToolRef | null {
  return TOKEN_INDEX[token] ?? TOKEN_INDEX[TOKEN_ALIASES[token]] ?? null;
}

/** Tools grouped by category in display order — for the dropdowns. */
export function toolsByCategory(): { category: ToolCategory; tools: CompareToolRef[] }[] {
  return TOOL_CATEGORIES.map((category) => ({
    category,
    tools: COMPARE_TOOLS.filter((t) => t.category === category),
  }));
}

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
  ['chatgpt', 'cursor'],
  ['midjourney', 'adobe-firefly'],
  ['elevenlabs', 'suno-ai'],
  ['make', 'zapier-ai'],
  ['cursor', 'windsurf'],

  // Andra omgangen. Urvalet ar dueller folk faktiskt soker pa — inte alla
  // par som gar att bilda. Bada sidor maste ha pros/cons och ratingCriteria
  // i REVIEW_KNOWN, annars renderas halva jamforelsen tom.
  ['chatgpt', 'perplexity'],
  ['chatgpt', 'deepseek'],
  ['chatgpt', 'microsoft-copilot'],
  ['chatgpt', 'grok'],
  ['claude', 'perplexity'],
  ['claude-code', 'cursor'],
  ['claude-code', 'github-copilot'],
  ['github-copilot', 'windsurf'],
  ['codeium', 'github-copilot'],
  ['heygen', 'synthesia'],
  ['sora-2', 'kling'],
  ['runway-gen-3', 'luma'],
  ['descript', 'riverside'],
  ['elevenlabs', 'murf'],
  ['elevenlabs', 'play-ht'],
  ['make', 'n8n'],
  ['zapier-ai', 'n8n'],
  ['midjourney', 'leonardo-ai'],
  ['midjourney', 'flux'],
  ['dall-e-3', 'ideogram'],
  ['midjourney', 'stable-diffusion'],
  ['canva-ai', 'adobe-firefly'],
];

export const SEPARATOR = '-eller-';

export function comparisonSlug(aToken: string, bToken: string): string {
  return `${aToken}${SEPARATOR}${bToken}`;
}

export function featuredSlugs(): string[] {
  return FEATURED_COMPARISONS.map(([a, b]) => comparisonSlug(a, b));
}

/** Category a comparison is filed under for the hub filter — tool A's
 *  category (cross-category duels like ChatGPT vs Cursor file under A). */
export function comparisonCategory(aToken: string, bToken: string): ToolCategory | null {
  void bToken;
  return resolveToken(aToken)?.category ?? null;
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
  const a = resolveToken(decoded.slice(0, idx));
  const b = resolveToken(decoded.slice(idx + SEPARATOR.length));
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
