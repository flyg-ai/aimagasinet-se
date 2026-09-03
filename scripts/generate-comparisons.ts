/**
 * Generate head-to-head comparison copy (intro + verdict + 5 FAQ) for each
 * featured AI-tool duel via Claude Haiku 4.5 and cache it in the `comparisons`
 * table as a JSON string in `content`.
 *
 *   npx tsx scripts/generate-comparisons.ts                       # only missing rows
 *   FORCE=1 npx tsx scripts/generate-comparisons.ts               # regenerate all
 *   ONLY=chatgpt-eller-claude FORCE=1 npx tsx scripts/…           # one pair, forced
 *
 * Requires that supabase/migrations/0010_comparisons.sql has been applied
 * (anon-read + service-role-write). The pair list and the `winner` are derived
 * from FEATURED_COMPARISONS and toolOverallScore, so the verdict prose always
 * matches the page's own score-based pick.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { FEATURED_COMPARISONS, comparisonSlug, resolveToken } from '../lib/compare';
import { resolveToolProfile, toolOverallScore } from '../components/templates/ReviewTemplate';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const MODEL = 'claude-haiku-4-5';
const FORCE = process.env.FORCE === '1';
/** Restrict generation to a single slug (still honours FORCE for that slug). */
const ONLY = process.env.ONLY?.trim() || null;

type Pair = { slug: string; aName: string; bName: string; winner: string };

/** Parlistan harleds ur FEATURED_COMPARISONS och vinnaren ur
 *  toolOverallScore — samma kalla som sidan sjalv anvander. Den handkopierade
 *  listan som stod har lag och slapade efter varje gang en duell lades till,
 *  och en felskriven vinnare hade gett en text som argumenterar for fel
 *  verktyg an vad sidans betyg visar. */
const PAIRS: Pair[] = FEATURED_COMPARISONS.map(([aToken, bToken]) => {
  const a = resolveToken(aToken);
  const b = resolveToken(bToken);
  if (!a || !b) throw new Error(`okand token i FEATURED_COMPARISONS: ${aToken} / ${bToken}`);
  const sa = toolOverallScore(resolveToolProfile(a.key, a.name));
  const sb = toolOverallScore(resolveToolProfile(b.key, b.name));
  return {
    slug: comparisonSlug(aToken, bToken),
    aName: a.name,
    bName: b.name,
    winner: sa >= sb ? a.name : b.name,
  };
});

const SYSTEM = `Du är senior redaktör på AI-Magasinet och skriver en jämförelse mellan två AI-verktyg.

# Krav
- Skriv på svenska (naturlig affärssvenska, inte direktöversatt engelska).
- "intro": 2-3 meningar som introducerar duellen och vad valet brukar handla om. Konkret, ingen hype.
- "verdict": 3-4 meningar som motiverar varför det angivna vinnande verktyget tar hem det totalt sett, men erkänner när det andra verktyget är bättre. Du MÅSTE utgå från den angivna vinnaren — argumentera för den, hitta inte på en egen vinnare.
- "faqs": exakt 5 "people also ask"-frågor med svar på 2-4 meningar. Variera frågetyper: skillnad, vilket är bäst, pris, nybörjare, kan man använda båda.
- Inga floskler ("revolutionerande", "game changer", "i en värld där..."). Inga emojis. Inga affiliate-CTA.

# Output
Returnera EXAKT JSON i detta format, ingenting annat:
{
  "intro": "…",
  "verdict": "…",
  "faqs": [
    { "question": "…?", "answer": "…" },
    { "question": "…?", "answer": "…" },
    { "question": "…?", "answer": "…" },
    { "question": "…?", "answer": "…" },
    { "question": "…?", "answer": "…" }
  ]
}

INGEN \`\`\`json\`\`\`-wrapping, inga kommentarer, ingen prosa före eller efter — bara JSON-objektet.`;

type Faq = { question: string; answer: string };
type Content = { intro: string; verdict: string; faqs: Faq[] };

async function generateFor(p: Pair): Promise<Content> {
  const userPrompt = [
    `Verktyg A: ${p.aName}`,
    `Verktyg B: ${p.bName}`,
    `Vinnare (sammanvägt betyg, utgå från denna): ${p.winner}`,
    '',
    `Skriv jämförelsen mellan ${p.aName} och ${p.bName} nu. Returnera bara JSON-objektet enligt schemat.`,
  ].join('\n');

  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: 2000,
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

  let parsed: { intro?: string; verdict?: string; faqs?: Faq[] };
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error(`invalid JSON from model: ${e instanceof Error ? e.message : e}\nGot: ${text.slice(0, 200)}`);
  }
  const faqs = (parsed.faqs ?? []).filter(
    (f): f is Faq => typeof f?.question === 'string' && typeof f?.answer === 'string',
  );
  if (typeof parsed.intro !== 'string' || typeof parsed.verdict !== 'string' || faqs.length < 3) {
    throw new Error(`incomplete content (intro/verdict/faqs=${faqs.length})`);
  }
  return { intro: parsed.intro, verdict: parsed.verdict, faqs: faqs.slice(0, 5) };
}

async function existingSlugs(): Promise<Set<string>> {
  const { data, error } = await db.from('comparisons').select('slug');
  if (error) {
    if (/relation .*comparisons.* does not exist|could not find the table/i.test(error.message)) {
      console.error(
        '\nTable `comparisons` not found. Apply supabase/migrations/0010_comparisons.sql first:\n' +
        '  • Supabase Dashboard → SQL Editor → paste the file → Run, or\n' +
        '  • DATABASE_URL=… npx tsx scripts/apply-migration.ts supabase/migrations/0010_comparisons.sql\n',
      );
      process.exit(2);
    }
    console.error('Fetch failed:', error.message);
    process.exit(1);
  }
  return new Set((data ?? []).map((r: { slug: string }) => r.slug));
}

async function main() {
  const have = await existingSlugs();
  if (ONLY && !PAIRS.some((p) => p.slug === ONLY)) {
    console.error(`ONLY=${ONLY} matches no known pair. Valid slugs:\n  ${PAIRS.map((p) => p.slug).join('\n  ')}`);
    process.exit(1);
  }
  const targets = PAIRS
    .filter((p) => !ONLY || p.slug === ONLY)
    .filter((p) => FORCE || !have.has(p.slug));
  console.log(`Generating comparisons for ${targets.length}/${PAIRS.length} pairs via ${MODEL}…\n`);

  let ok = 0, failed = 0;
  for (let i = 0; i < targets.length; i++) {
    const p = targets[i];
    const tag = `[${i + 1}/${targets.length}]`;
    try {
      const content = await generateFor(p);
      const { error } = await db.from('comparisons').upsert(
        {
          slug: p.slug,
          verktyg_a: p.aName,
          verktyg_b: p.bName,
          content: JSON.stringify(content),
        },
        { onConflict: 'slug' },
      );
      if (error) throw new Error(error.message);
      ok++;
      console.log(`  ${tag} OK     ${p.slug.padEnd(32)} ${content.faqs.length}q`);
    } catch (e) {
      failed++;
      console.error(`  ${tag} FAILED ${p.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\nDone — ${ok} written, ${failed} failed.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
