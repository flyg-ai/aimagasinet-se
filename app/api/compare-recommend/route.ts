import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { toolPricing } from '@/lib/compare';
import { resolveToolProfile, toolOverallScore, REVIEW_KNOWN, type ReviewProfile } from '@/components/templates/ReviewTemplate';
import { toolNameFromTitle } from '@/lib/rating';
import { supabase } from '@/lib/supabase';
import { toolMatchesPurpose, purposeLabel } from '@/lib/compare-purposes';

/** POST { tools: string[], syfte: string[], budget: string }
 *    → 200 { winner: token, recommendation: string }
 *    → 400 { error }
 *
 *  Picks the best of the selected tools for the user's purpose + budget and
 *  writes a short Swedish recommendation. Fully deterministic — no model
 *  call. `tools` is now any slug from the full ~370-tool bank (not just the
 *  old 52), so this route resolves names/profiles itself instead of going
 *  through lib/compare.ts's resolveToken (which only knows the old list).
 *  `syfte` is no longer a fixed slug from a global taxonomy — the wizard's
 *  step 2 derives it straight from the selected tools' own real useCases
 *  text, so a syfte "matches" a tool when that exact string is literally one
 *  of its useCases (no category-hint table to keep in sync across ~37 real
 *  categories). Budget narrows further when "gratis", overall score breaks
 *  the remaining tie. This used to be a Haiku call: the wizard lets a reader
 *  pick any 2-4 of hundreds of tools, which can't be pre-written, but
 *  Haiku's own prompt was fed nothing the deterministic version doesn't
 *  already have — the same scores, prices and use-case text — so the model
 *  wasn't adding judgment, just prose. Removing the call also closes the one
 *  place on the site where ordinary page traffic could run up an API bill. */

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

type Tool = {
  token: string;
  name: string;
  profile: ReviewProfile;
  score: number;
};

/** Purpose first, budget next, quality as the tiebreaker. Narrows the
 *  candidate set at each step and only proceeds when narrowing actually
 *  leaves a choice — a syfte that matches none of the tools' own useCases,
 *  or a budget that isn't "gratis", is a no-op and score decides alone. */
function pickWinner(tools: Tool[], syftes: string[], budget: string): Tool {
  const matchCounts = tools.map((t) =>
    syftes.filter((s) => toolMatchesPurpose(t.token, s, t.profile.useCases)).length,
  );
  const maxMatches = Math.max(...matchCounts, 0);
  let candidates = maxMatches > 0 ? tools.filter((_, i) => matchCounts[i] === maxMatches) : tools;

  if (budget === 'gratis' && candidates.length > 1) {
    const free = candidates.filter((t) => toolPricing(t.token, t.profile.offer).free !== null);
    if (free.length > 0) candidates = free;
  }

  return [...candidates].sort((a, b) => b.score - a.score)[0];
}

function buildRecommendation(
  tools: Tool[],
  syftes: string[],
  budget: string,
): { winner: string; recommendation: string } {
  const w = pickWinner(tools, syftes, budget);
  const purpose = syftes.length ? syftes.map(purposeLabel).join(', ').toLowerCase() : 'allmän användning';
  const budgetClause = budget && budget !== 'egal' ? ` med budgeten "${budgetLabel(budget)}"` : '';
  const matchesPurpose = syftes.some((s) => toolMatchesPurpose(w.token, s, w.profile.useCases));

  const leadIn = matchesPurpose
    ? `${w.name} är vårt förstaval bland de valda verktygen för ${purpose}${budgetClause} — det är byggt för just det användningsområdet och har högst betyg (${w.score.toFixed(1)}/10) bland alternativen som passar.`
    : `För ${purpose}${budgetClause} är ${w.name} vårt förstaval bland de verktyg du valt — det har högst sammanvägt betyg (${w.score.toFixed(1)}/10) och passar särskilt bra för ${w.profile.offer.bestFor.toLowerCase()}.`;

  let budgetSentence = '';
  if (budget === 'gratis') {
    const wFree = toolPricing(w.token, w.profile.offer).free;
    // Nar frifaltet bara ar det generiska ordet "Gratis" (inget verktyg med
    // en riktig kvot att namna) blir "borja helt gratis: gratis" en
    // dubblering — skriv den meningen annorlunda i det fallet.
    const isGenericFree = wFree !== null && /^gratis$/i.test(wFree.trim());
    if (wFree && isGenericFree) {
      budgetSentence = ` ${w.name} går att börja med helt gratis.`;
    } else if (wFree) {
      budgetSentence = ` Du kan börja helt gratis: ${wFree.toLowerCase()}.`;
    } else {
      const freeAlt = tools.find((t) => t.token !== w.token && toolPricing(t.token, t.profile.offer).free !== null);
      if (freeAlt) {
        budgetSentence = ` ${w.name} har ingen gratisnivå — vill du testa utan kostnad först är ${freeAlt.name} ett gratisalternativ bland dina val.`;
      }
    }
  }

  const prosSentence =
    ` ${w.profile.pros[0] ?? 'Det levererar jämn kvalitet'} och ${(w.profile.pros[1] ?? 'är lätt att komma igång med').toLowerCase()}.`;

  const anyFree = tools.some((t) => toolPricing(t.token, t.profile.offer).free !== null);
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

  // Resolve + dedupe tokens (2-4). Must have a REAL REVIEW_KNOWN row — an
  // unknown slug would otherwise fall back to resolveToolProfile's mock
  // data (fabricated price/criteria), which must never be recommended.
  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const tok of asStringArray(body.tools)) {
    if (typeof tok === 'string' && tok in REVIEW_KNOWN && !seen.has(tok)) {
      seen.add(tok); tokens.push(tok);
    }
    if (tokens.length >= 4) break;
  }
  if (tokens.length < 2) {
    return NextResponse.json({ error: 'need_2_4_tools' }, { status: 400 });
  }

  const syftes = asStringArray(body.syfte).slice(0, 8);
  const budget = typeof body.budget === 'string' ? body.budget : '';

  const { data: titleRows } = await supabase.from('articles').select('slug,title').in('slug', tokens);
  const titleBySlug = new Map((titleRows ?? []).map((r) => [r.slug as string, r.title as string]));

  const tools: Tool[] = tokens.map((token) => {
    const name = toolNameFromTitle(titleBySlug.get(token) ?? token);
    const profile = resolveToolProfile(token, name);
    return { token, name, profile, score: toolOverallScore(profile) };
  }).filter((t) => t.profile.label !== 'Nedlagd');

  if (tools.length < 2) {
    return NextResponse.json({ error: 'need_2_4_tools' }, { status: 400 });
  }

  return NextResponse.json(buildRecommendation(tools, syftes, budget));
}
