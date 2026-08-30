/**
 * Mät vad en artikel faktiskt kostar. Skriver ingenting till databasen.
 *
 *   npx tsx scripts/measure-cost.ts                 # ämnesläget
 *   npx tsx scripts/measure-cost.ts --news          # nyhetsläget
 *   npx tsx scripts/measure-cost.ts --haiku         # billiga steg på Haiku
 *
 * Kör samma anropskedja som cronen och läser usage från varje svar. Priserna
 * nedan är listpris per miljon tokens och måste hållas aktuella för hand —
 * API:t returnerar tokens, inte kronor.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const OPUS = 'claude-opus-5';
const HAIKU = 'claude-haiku-4-5';
const SONNET = 'claude-sonnet-5';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/** USD per miljon tokens. Cache-skrivning kostar 1,25x input, läsning 0,1x. */
const PRICE: Record<string, { in: number; out: number }> = {
  [OPUS]: { in: 5, out: 25 },
  [SONNET]: { in: 2, out: 10 },
  [HAIKU]: { in: 1, out: 5 },
};
/** USD per websökning. */
const SEARCH_COST = 0.01;
const USD_SEK = 10.5;

const claude = new Anthropic();
const has = (n: string) => process.argv.includes(`--${n}`);
/** fallbacks stods bara av Opus/Fable — Haiku avvisar parametern med 400. */
const wf = <T extends { model?: string }>(p: T): T =>
  (p.model === OPUS ? { ...p, fallbacks: 'default' } : p) as T;

const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
/** Skrivmodell och effort for artikeltexten. */
const WRITER = arg('writer') === 'sonnet' ? SONNET : OPUS;
/** effort styr tankedjup och darmed utdata-tokens. Standard ar high. */
const EFFORT_WRITE = (arg('effort') ?? 'high') as 'low' | 'medium' | 'high' | 'xhigh' | 'max';
/** Mekaniska steg — korrektur, faq, bildfras. */
const EFFORT_CHEAP = (arg('cheap-effort') ?? 'low') as 'low' | 'medium' | 'high' | 'xhigh' | 'max';

type Step = { name: string; model: string; usd: number; inTok: number; outTok: number; searches: number };
const steps: Step[] = [];

function record(name: string, model: string, msg: Anthropic.Beta.BetaMessage): string {
  const u = msg.usage as unknown as {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
    server_tool_use?: { web_search_requests?: number };
  };
  const p = PRICE[model];
  const cacheWrite = u.cache_creation_input_tokens ?? 0;
  const cacheRead = u.cache_read_input_tokens ?? 0;
  const searches = u.server_tool_use?.web_search_requests ?? 0;

  const usd =
    (u.input_tokens / 1e6) * p.in +
    (cacheWrite / 1e6) * p.in * 1.25 +
    (cacheRead / 1e6) * p.in * 0.1 +
    (u.output_tokens / 1e6) * p.out +
    searches * SEARCH_COST;

  steps.push({ name, model, usd, inTok: u.input_tokens + cacheWrite + cacheRead, outTok: u.output_tokens, searches });
  return msg.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:html|json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function main() {
  const news = has('news');
  const cheap = has('haiku') ? HAIKU : OPUS;
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

  const topic = { topic: 'Bästa AI-apparna för mobilen — topp 15', target_words: null as number | null };

  const links = ((await db.from('articles').select('title,path').not('published_at', 'is', null).limit(80)).data ?? [])
    .map((a: { title: string; path: string }) => `- ${a.title} — ${a.path}/`)
    .join('\n');

  console.log(`Läge: ${news ? 'nyheter' : 'ämnen'} · skrivmodell ${WRITER} effort=${EFFORT_WRITE} · mekaniskt ${cheap} effort=${EFFORT_CHEAP}`);
  console.log(`Ämne: ${topic.topic}\n`);

  if (news) {
    const r = await claude.beta.messages.create(
      wf({
        model: OPUS,
        max_tokens: 5000,
        betas: [FALLBACK_BETA],
        tools: [{ type: 'web_search_20260209' as const, name: 'web_search' as const, max_uses: 4 }],
        messages: [{ role: 'user' as const, content: 'Sök upp dygnets viktigaste AI-nyheter för en svensk läsekrets. Redovisa med källor.' }],
      }),
    );
    const briefing = record('research (websökning)', OPUS, r);
    const e = await claude.beta.messages.create(
      wf({
        model: OPUS,
        max_tokens: 4000,
        betas: [FALLBACK_BETA],
        messages: [{ role: 'user' as const, content: 'Välj den starkaste nyheten och sammanfatta den i tre meningar.\n\n' + briefing }],
      }),
    );
    record('urval', OPUS, e);
  }

  const art = await claude.beta.messages.create(
    wf({
      model: WRITER,
      max_tokens: Math.min(16000, Math.max(8000, Math.round((topic.target_words ?? 0) * 4.5))),
      output_config: { effort: EFFORT_WRITE },
      ...(WRITER === OPUS ? { betas: [FALLBACK_BETA] } : {}),
      system: [{ type: 'text' as const, text: 'Du är redaktör på AI-Magasinet. Rak, konkret svenska. Ren HTML, ingen markdown, ingen h1. Korta stycken. Inte mer än 800 ord om ämnet inte motiverar det.' }],
      messages: [
        {
          role: 'user' as const,
          content: `Skriv en artikel med titeln "${topic.topic}".${topic.target_words ? ` Cirka ${topic.target_words} ord.` : ''}\n\nInterna länkmål:\n${links}\n\nRen HTML, börja med första <p>-taggen.`,
        },
      ],
    }),
  );
  const html = record('artikeltext', WRITER, art);

  const pr = await claude.beta.messages.create(
    wf({
      model: cheap,
      max_tokens: 16000,
      ...(cheap === HAIKU ? {} : { output_config: { effort: EFFORT_CHEAP } }),
      ...(cheap === OPUS ? { betas: [FALLBACK_BETA] } : {}),
      messages: [{ role: 'user' as const, content: 'Korrekturläs. Rätta bara stavfel och grammatik, ändra inget annat. Svara med enbart HTML.\n\n' + html }],
    }),
  );
  record('korrektur', cheap, pr);

  const faq = await claude.beta.messages.create(
    wf({
      model: cheap,
      max_tokens: 2000,
      ...(cheap === HAIKU ? {} : { output_config: { effort: EFFORT_CHEAP } }),
      ...(cheap === OPUS ? { betas: [FALLBACK_BETA] } : {}),
      messages: [{ role: 'user' as const, content: 'Skriv fyra vanliga frågor med svar utifrån artikeln. JSON.\n\n' + html }],
    }),
  );
  record('faq', cheap, faq);

  const iq = await claude.beta.messages.create(
    wf({
      model: cheap,
      max_tokens: 300,
      ...(cheap === HAIKU ? {} : { output_config: { effort: EFFORT_CHEAP } }),
      ...(cheap === OPUS ? { betas: [FALLBACK_BETA] } : {}),
      messages: [{ role: 'user' as const, content: `Ge en engelsk Unsplash-sökfras på 2-4 ord för artikeln "${topic.topic}". Svara med enbart frasen.` }],
    }),
  );
  record('bildfras', cheap, iq);

  // ── Rapport ──────────────────────────────────────────────────
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const total = steps.reduce((s, x) => s + x.usd, 0);

  console.log('─'.repeat(74));
  console.log('steg'.padEnd(24) + 'modell'.padEnd(10) + 'in'.padStart(8) + 'ut'.padStart(8) + 'USD'.padStart(9) + 'SEK'.padStart(8));
  console.log('─'.repeat(74));
  for (const s of steps) {
    console.log(
      s.name.padEnd(24) +
        (s.model === OPUS ? 'Opus 5' : s.model === SONNET ? 'Sonnet5' : 'Haiku').padEnd(10) +
        String(s.inTok).padStart(8) +
        String(s.outTok).padStart(8) +
        s.usd.toFixed(4).padStart(9) +
        (s.usd * USD_SEK).toFixed(2).padStart(8) +
        (s.searches ? `   (${s.searches} sökningar)` : ''),
    );
  }
  console.log('─'.repeat(74));
  console.log(
    'TOTALT'.padEnd(44) + total.toFixed(4).padStart(9) + (total * USD_SEK).toFixed(2).padStart(8) + `   ${words} ord`,
  );
  console.log('');
  console.log(`  2 artiklar/dag:  ${(total * 2 * 30 * USD_SEK).toFixed(0)} kr/månad`);
  console.log(`  5 artiklar/dag:  ${(total * 5 * 30 * USD_SEK).toFixed(0)} kr/månad`);
  console.log(`\n(listpris, ${USD_SEK} kr/USD — inget sparat till databasen)`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
