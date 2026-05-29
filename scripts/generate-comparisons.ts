/**
 * Generate head-to-head comparison copy (intro + verdict + 5 FAQ) for each
 * featured AI-tool duel via Claude Haiku 4.5 and cache it in the `comparisons`
 * table as a JSON string in `content`.
 *
 *   npx tsx scripts/generate-comparisons.ts          # only missing rows
 *   FORCE=1 npx tsx scripts/generate-comparisons.ts  # regenerate all
 *
 * Requires that supabase/migrations/0010_comparisons.sql has been applied
 * (anon-read + service-role-write). Self-contained — the pair list mirrors
 * FEATURED_COMPARISONS in lib/compare.ts; the `winner` is precomputed from
 * toolOverallScore so the verdict prose matches the page's score-based pick.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const MODEL = 'claude-haiku-4-5';
const FORCE = process.env.FORCE === '1';

type Pair = { slug: string; aName: string; bName: string; winner: string };

// slug = `${aToken}-eller-${bToken}`; winner = higher toolOverallScore.
const PAIRS: Pair[] = [
  { slug: 'chatgpt-eller-claude',          aName: 'ChatGPT',      bName: 'Claude',        winner: 'ChatGPT' },
  { slug: 'cursor-eller-github-copilot',   aName: 'Cursor AI',    bName: 'GitHub Copilot', winner: 'Cursor AI' },
  { slug: 'midjourney-eller-dall-e-3',     aName: 'Midjourney',   bName: 'DALL·E 3',      winner: 'DALL·E 3' },
  { slug: 'suno-eller-udio',               aName: 'Suno AI',      bName: 'Udio',          winner: 'Suno AI' },
  { slug: 'kling-eller-pika-labs',         aName: 'Kling AI',     bName: 'Pika Labs',     winner: 'Kling AI' },
  { slug: 'chatgpt-eller-gemini',          aName: 'ChatGPT',      bName: 'Gemini',        winner: 'ChatGPT' },
  { slug: 'claude-eller-gemini',           aName: 'Claude',       bName: 'Gemini',        winner: 'Claude' },
  { slug: 'chatgpt-eller-cursor',          aName: 'ChatGPT',      bName: 'Cursor AI',     winner: 'Cursor AI' },
  { slug: 'midjourney-eller-adobe-firefly', aName: 'Midjourney',  bName: 'Adobe Firefly', winner: 'Midjourney' },
  { slug: 'elevenlabs-eller-suno-ai',      aName: 'ElevenLabs',   bName: 'Suno AI',       winner: 'ElevenLabs' },
  { slug: 'make-eller-zapier-ai',          aName: 'Make',         bName: 'Zapier',        winner: 'Make' },
  { slug: 'cursor-eller-windsurf',         aName: 'Cursor AI',    bName: 'Windsurf',      winner: 'Cursor AI' },
];

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
  const targets = PAIRS.filter((p) => FORCE || !have.has(p.slug));
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
