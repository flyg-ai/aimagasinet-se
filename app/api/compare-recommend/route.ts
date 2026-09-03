import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import {
  resolveToken,
  toolPricing,
  SYFTE_OPTIONS,
  SYFTE_CATEGORY_HINTS,
  type CompareToolRef,
  type ToolCategory,
} from '@/lib/compare';
import { resolveToolProfile, toolOverallScore, type ReviewProfile } from '@/components/templates/ReviewTemplate';

/** POST { tools: string[], syfte: string[], budget: string }
 *    → 200 { winner: token, recommendation: string }
 *    → 400 { error }
 *
 *  Picks the best of the selected tools for the user's purpose + budget and
 *  writes a short Swedish recommendation. Fully deterministic — no model
 *  call. `syfte` is a list of SYFTE_OPTIONS slugs (the wizard's step-2
 *  choices); category fit narrows the field first, a free tier narrows it
 *  further when budget is "gratis", and overall score breaks the remaining
 *  tie. This used to be a Haiku call: the wizard lets a reader pick any 2-4
 *  of 52 tools (hundreds of millions of combinations with syfte/budget
 *  folded in), which can't be pre-written, but Haiku's own prompt was fed
 *  nothing the deterministic version doesn't already have — the same
 *  scores, prices and use-case text — so the model wasn't adding judgment,
 *  just prose. Removing the call also closes the one place on the site
 *  where ordinary page traffic could run up an API bill. */

const BUDGET_LABELS: Record<string, string> = {
  gratis: 'Gratis',
  budget: 'Budget (under 20 USD/mån)',
  professionell: 'Professionell (20+ USD/mån)',
  egal: 'Spelar ingen roll',
};

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

function budgetLabel(slug: string): string {
  return BUDGET_LABELS[slug] ?? 'ej angiven';
}

function syfteLabel(slug: string): string {
  return SYFTE_OPTIONS.find((o) => o.slug === slug)?.label ?? slug;
}

type Tool = {
  token: string;
  key: string;
  name: string;
  category: ToolCategory;
  profile: ReviewProfile;
  score: number;
};

/** Purpose first, budget next, quality as the tiebreaker. Narrows the
 *  candidate set at each step and only proceeds when narrowing actually
 *  leaves a choice — a syfte with no category hint, or a budget that isn't
 *  "gratis", is a no-op and score decides alone, same as before this
 *  function existed. */
function pickWinner(tools: Tool[], syfteSlugs: string[], budget: string): Tool {
  const matchCounts = tools.map((t) =>
    syfteSlugs.filter((s) => (SYFTE_CATEGORY_HINTS[s] ?? []).includes(t.category)).length,
  );
  const maxMatches = Math.max(...matchCounts, 0);
  let candidates = maxMatches > 0 ? tools.filter((_, i) => matchCounts[i] === maxMatches) : tools;

  if (budget === 'gratis' && candidates.length > 1) {
    const free = candidates.filter((t) => toolPricing(t.key, t.profile.offer).free !== null);
    if (free.length > 0) candidates = free;
  }

  return [...candidates].sort((a, b) => b.score - a.score)[0];
}

function buildRecommendation(
  tools: Tool[],
  syfteSlugs: string[],
  budget: string,
): { winner: string; recommendation: string } {
  const w = pickWinner(tools, syfteSlugs, budget);
  const purposeLabels = syfteSlugs.map(syfteLabel);
  const purpose = purposeLabels.length ? purposeLabels.join(', ').toLowerCase() : 'allmän användning';
  const budgetClause = budget && budget !== 'egal' ? ` med budgeten "${budgetLabel(budget)}"` : '';
  const matchesPurpose = syfteSlugs.some((s) => (SYFTE_CATEGORY_HINTS[s] ?? []).includes(w.category));

  const leadIn = matchesPurpose
    ? `${w.name} är vårt förstaval bland de valda verktygen för ${purpose}${budgetClause} — det ligger i rätt kategori för uppgiften och har högst betyg (${w.score.toFixed(1)}/10) bland alternativen som passar.`
    : `För ${purpose}${budgetClause} är ${w.name} vårt förstaval bland de verktyg du valt — det har högst sammanvägt betyg (${w.score.toFixed(1)}/10) och passar särskilt bra för ${w.profile.offer.bestFor.toLowerCase()}.`;

  let budgetSentence = '';
  if (budget === 'gratis') {
    const wFree = toolPricing(w.key, w.profile.offer).free;
    // Nar frifaltet bara ar det generiska ordet "Gratis" (inget verktyg med
    // en riktig kvot att namna) blir "borja helt gratis: gratis" en
    // dubblering — skriv den meningen annorlunda i det fallet.
    const isGenericFree = wFree !== null && /^gratis$/i.test(wFree.trim());
    if (wFree && isGenericFree) {
      budgetSentence = ` ${w.name} går att börja med helt gratis.`;
    } else if (wFree) {
      budgetSentence = ` Du kan börja helt gratis: ${wFree.toLowerCase()}.`;
    } else {
      const freeAlt = tools.find((t) => t.token !== w.token && toolPricing(t.key, t.profile.offer).free !== null);
      if (freeAlt) {
        budgetSentence = ` ${w.name} har ingen gratisnivå — vill du testa utan kostnad först är ${freeAlt.name} ett gratisalternativ bland dina val.`;
      }
    }
  }

  const prosSentence =
    ` ${w.profile.pros[0] ?? 'Det levererar jämn kvalitet'} och ${(w.profile.pros[1] ?? 'är lätt att komma igång med').toLowerCase()}.`;

  const anyFree = tools.some((t) => toolPricing(t.key, t.profile.offer).free !== null);
  const closer = anyFree
    ? ' De övriga är fullgoda alternativ — jämför betygen ovan och testa gärna gratisnivåerna innan du bestämmer dig.'
    : ' De övriga är fullgoda alternativ — jämför betygen och kriterierna ovan innan du bestämmer dig.';

  return { winner: w.token, recommendation: leadIn + budgetSentence + prosSentence + closer };
}

/** Basic request-flood hygiene. The route no longer calls Claude, so this
 *  isn't guarding an API bill any more — but a synchronous route with no
 *  cap at all is still a route anyone can hammer, and there's no reason to
 *  remove working protection just because the original reason for adding
 *  it went away. */
const LIMITS = [
  { limit: 10, windowMs: 60_000, tag: 'min' },
  { limit: 60, windowMs: 3_600_000, tag: 'h' },
];

export async function POST(req: Request) {
  const ip = clientIp(req);
  for (const l of LIMITS) {
    const r = rateLimit(`compare-recommend:${l.tag}:${ip}`, l);
    if (!r.ok) {
      return NextResponse.json(
        { error: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': String(r.retryAfter) } },
      );
    }
  }

  let body: { tools?: unknown; syfte?: unknown; budget?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  // Resolve + dedupe tokens (2-4).
  const seen = new Set<string>();
  const refs: CompareToolRef[] = [];
  for (const tok of asStringArray(body.tools)) {
    const r = resolveToken(tok);
    if (r && !seen.has(r.token)) { seen.add(r.token); refs.push(r); }
    if (refs.length >= 4) break;
  }
  if (refs.length < 2) {
    return NextResponse.json({ error: 'need_2_4_tools' }, { status: 400 });
  }

  const syfteSlugs = asStringArray(body.syfte).slice(0, 8);
  const budget = typeof body.budget === 'string' ? body.budget : '';

  const tools: Tool[] = refs.map((r) => {
    const profile = resolveToolProfile(r.key, r.name);
    return { token: r.token, key: r.key, name: r.name, category: r.category, profile, score: toolOverallScore(profile) };
  });

  return NextResponse.json(buildRecommendation(tools, syfteSlugs, budget));
}
