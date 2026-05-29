import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { resolveToken, type CompareToolRef } from '@/lib/compare';
import { resolveToolProfile, toolOverallScore, type ReviewProfile } from '@/components/templates/ReviewTemplate';

/** POST { tools: string[], syfte: string[], budget: string }
 *    → 200 { winner: token, recommendation: string }
 *    → 400 { error }
 *
 *  Picks the best of the selected tools for the user's purpose + budget and
 *  writes a short Swedish recommendation via Claude Haiku. Best-effort — falls
 *  back to a deterministic, score-based recommendation when the model is
 *  unavailable, so the result step always renders something useful. */

const MODEL = 'claude-haiku-4-5';

const BUDGET_LABELS: Record<string, string> = {
  gratis: 'Gratis',
  budget: 'Budget (under 20 USD/mån)',
  professionell: 'Professionell (20+ USD/mån)',
  egal: 'Spelar ingen roll',
};

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

type Tool = { token: string; name: string; profile: ReviewProfile; score: number };

function budgetLabel(slug: string): string {
  return BUDGET_LABELS[slug] ?? 'ej angiven';
}

function buildFallback(tools: Tool[], syfte: string[], budget: string, winner: string) {
  const w = tools.find((t) => t.token === winner) ?? tools[0];
  const purpose = syfte.length ? syfte.join(', ').toLowerCase() : 'allmän användning';
  const budgetClause = budget && budget !== 'egal' ? ` med budgeten "${budgetLabel(budget)}"` : '';
  const recommendation =
    `För ${purpose}${budgetClause} är ${w.name} vårt förstaval bland de verktyg du valt — ` +
    `det har högst sammanvägt betyg (${w.score.toFixed(1)}/10) och passar särskilt bra för ${w.profile.offer.bestFor.toLowerCase()}. ` +
    `${w.profile.pros[0] ?? 'Det levererar jämn kvalitet'} och ${(w.profile.pros[1] ?? 'är lätt att komma igång med').toLowerCase()}. ` +
    `De övriga är fullgoda alternativ — jämför betygen ovan och testa gärna gratisnivåerna innan du bestämmer dig.`;
  return { winner: w.token, recommendation };
}

const SYSTEM = `Du är senior redaktör på AI-Magasinet. Användaren har valt 2-4 AI-verktyg och berättat vad de ska användas till samt sin budget. Välj DET BÄSTA verktyget för just detta syfte + budget bland de valda, och motivera kort.

# Krav
- Skriv på svenska (naturlig affärssvenska, inte direktöversatt engelska).
- "recommendation": 3-4 meningar. Motivera valet utifrån användarens syfte OCH budget. Konkret, ingen hype. Nämn gärna när ett annat av de valda verktygen passar bättre i vissa fall.
- "winner" MÅSTE vara exakt en av de angivna verktygs-tokens (fältet "token").
- Inga floskler ("revolutionerande", "game changer"). Inga emojis. Inga affiliate-CTA.

# Output
Returnera EXAKT JSON, inget annat:
{ "winner": "<token>", "recommendation": "…" }
INGEN \`\`\`json\`\`\`-wrapping, ingen prosa före eller efter.`;

export async function POST(req: Request) {
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

  const syfte = asStringArray(body.syfte).slice(0, 8);
  const budget = typeof body.budget === 'string' ? body.budget : '';

  const tools: Tool[] = refs.map((r) => {
    const profile = resolveToolProfile(r.key, r.name);
    return { token: r.token, name: r.name, profile, score: toolOverallScore(profile) };
  });
  const topByScore = [...tools].sort((a, b) => b.score - a.score)[0].token;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(buildFallback(tools, syfte, budget, topByScore));
  }

  try {
    const claude = new Anthropic();
    const userPrompt = [
      `Användarens syfte: ${syfte.length ? syfte.join(', ') : 'ej angivet'}`,
      `Budget: ${budgetLabel(budget)}`,
      '',
      'Valda verktyg:',
      ...tools.map((t) =>
        `- token: ${t.token} | ${t.name} (${t.profile.company}) · betyg ${t.score.toFixed(1)}/10 · pris: ${t.profile.offer.price} · bäst för: ${t.profile.offer.bestFor} · styrkor: ${t.profile.pros.join(', ')}`,
      ),
      '',
      'Välj det bästa verktyget för syftet + budgeten och returnera JSON enligt schemat.',
    ].join('\n');

    const msg = await claude.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(text) as { winner?: unknown; recommendation?: unknown };
    const winner =
      typeof parsed.winner === 'string' && tools.some((t) => t.token === parsed.winner)
        ? parsed.winner
        : topByScore;
    const recommendation =
      typeof parsed.recommendation === 'string' && parsed.recommendation.length > 20
        ? parsed.recommendation
        : buildFallback(tools, syfte, budget, winner).recommendation;

    return NextResponse.json({ winner, recommendation });
  } catch (e) {
    console.error('[compare-recommend] haiku error:', e instanceof Error ? e.message : e);
    return NextResponse.json(buildFallback(tools, syfte, budget, topByScore));
  }
}
