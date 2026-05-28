/**
 * Generate 5 FAQ Q&A pairs per article (hub / review / yrkesroll) via
 * Claude Haiku 4.5 and persist as a jsonb array on articles.faq.
 *
 *   npx tsx scripts/generate-faqs.ts            # all relevant articles
 *   npx tsx scripts/generate-faqs.ts --only=review
 *   FORCE=1 npx tsx scripts/generate-faqs.ts    # overwrite existing
 *
 * Requires that 0009_faq.sql has been applied.
 *
 * Targeting:
 *  - HubTemplate pages         → type=page, depth 1-2 under /ai-verktyg
 *                                + the /ai-video hub
 *  - ReviewTemplate pages      → type=page, depth >= 3 under /ai-verktyg
 *                                + /ai-video/[tool] depth 2
 *  - YrkesRoll pages           → /ai-verktyg/foretag/yrke/[yrke] (depth 4)
 *
 *  Already-populated rows are skipped unless FORCE=1.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-haiku-4-5';
const FORCE = process.env.FORCE === '1';
const onlyKindArg = process.argv.find((a) => a.startsWith('--only='))?.slice(7);

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  path: string;
  type: 'post' | 'page';
  parent_slug: string | null;
  faq: unknown;
};

type Kind = 'hub' | 'review' | 'yrkesroll';

function classify(a: ArticleRow): Kind | null {
  const depth = a.path.split('/').filter(Boolean).length;
  // /ai-verktyg/foretag/yrke/[yrke] = depth 4, yrkesroll
  if (/^\/ai-verktyg\/foretag\/yrke\/[^/]+$/.test(a.path)) return 'yrkesroll';
  // /ai-verktyg/foretag/yrke/[yrke]/[hub] = depth 5 hub
  if (/^\/ai-verktyg\/foretag\/yrke\/[^/]+\/[^/]+$/.test(a.path)) return 'hub';
  // /ai-verktyg/foretag/yrke/[yrke]/[hub]/[tool] = depth 6 review
  if (/^\/ai-verktyg\/foretag\/yrke\/[^/]+\/[^/]+\/[^/]+$/.test(a.path)) return 'review';
  // /ai-verktyg/<cat>           depth 2 → hub
  if (/^\/ai-verktyg\/[^/]+$/.test(a.path) && depth === 2) return 'hub';
  // /ai-verktyg/<cat>/<tool>    depth 3 → review
  if (/^\/ai-verktyg\/[^/]+\/[^/]+$/.test(a.path) && depth === 3) return 'review';
  // /ai-video                    hub
  if (a.path === '/ai-video') return 'hub';
  // /ai-video/<tool>             review
  if (/^\/ai-video\/[^/]+$/.test(a.path) && depth === 2) return 'review';
  return null;
}

const SYSTEM = `Du är senior redaktör på AI-Magasinet. Skriv 5 vanliga frågor och korta, konkreta svar (FAQ) för en sida på sajten.

# Krav
- Skriv på svenska (naturlig affärssvenska, inte direktöversatt engelska).
- Frågorna ska vara sådana som en svensk läsare faktiskt ställer — tänk "people also ask"-frågor från Google.
- Svaren ska vara 2-4 meningar, konkreta och informativa. Inga svar som "det beror på" utan att ge ett konkret intervall eller exempel.
- Inga floskler ("revolutionerande", "i en värld där...", "game changer").
- Inga affiliate-CTA i svaren. Inga emojis.
- Variera frågetyper: kostnad, jämförelse, säkerhet/integritet, användningsfall, kom-igång.

# Output
Returnera EXAKT JSON i detta format, ingenting annat:
{
  "faqs": [
    { "question": "Fråga 1?", "answer": "Svar 1." },
    { "question": "Fråga 2?", "answer": "Svar 2." },
    { "question": "Fråga 3?", "answer": "Svar 3." },
    { "question": "Fråga 4?", "answer": "Svar 4." },
    { "question": "Fråga 5?", "answer": "Svar 5." }
  ]
}

INGEN \`\`\`json\`\`\`-wrapping, inga kommentarer, ingen prosa före eller efter — bara JSON-objektet.`;

type Faq = { question: string; answer: string };

async function generateFor(a: ArticleRow, kind: Kind): Promise<Faq[]> {
  const contextLabel = kind === 'review' ? 'AI-verktygsrecension' : kind === 'hub' ? 'kategori-hub' : 'yrkesroll-landningssida';
  const userPrompt = [
    `Sida: ${a.path}`,
    `Titel: ${a.title}`,
    `Sammanfattning: ${a.excerpt ?? '(saknas)'}`,
    `Typ: ${contextLabel}`,
    '',
    'Skriv 5 FAQ-frågor och svar nu. Returnera bara JSON-objektet enligt schemat.',
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
    // Tolerate occasional ```json wrapping despite the instruction.
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  let parsed: { faqs?: Faq[] };
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error(`invalid JSON from model: ${e instanceof Error ? e.message : e}\nGot: ${text.slice(0, 200)}`);
  }
  const items = (parsed.faqs ?? []).filter(
    (f): f is Faq => typeof f?.question === 'string' && typeof f?.answer === 'string'
  );
  if (items.length < 3) throw new Error(`only ${items.length} valid items returned`);
  return items.slice(0, 5);
}

async function main() {
  // Fetch every article in one shot — there are ~260 rows total, of
  // which the classifier rejects most. The select(faq) errors with a
  // helpful message if migration 0009 hasn't been applied.
  const { data, error } = await db
    .from('articles')
    .select('id,slug,title,excerpt,path,type,parent_slug,faq')
    .order('path');
  if (error) {
    console.error('Fetch failed:', error.message);
    if (/faq/.test(error.message)) {
      console.error('\nLooks like migration 0009_faq.sql has not been applied yet. Paste it into Supabase Dashboard → SQL Editor and re-run.');
    }
    process.exit(1);
  }

  const targets: { row: ArticleRow; kind: Kind }[] = [];
  for (const r of (data ?? []) as ArticleRow[]) {
    const kind = classify(r);
    if (!kind) continue;
    if (onlyKindArg && kind !== onlyKindArg) continue;
    if (r.faq && !FORCE) continue;
    targets.push({ row: r, kind });
  }
  console.log(`Generating FAQs for ${targets.length} pages via ${MODEL}…\n`);

  const counts: Record<Kind, number> = { hub: 0, review: 0, yrkesroll: 0 };
  let ok = 0, failed = 0;

  for (let i = 0; i < targets.length; i++) {
    const { row, kind } = targets[i];
    const tag = `[${i + 1}/${targets.length}]`;
    try {
      const faqs = await generateFor(row, kind);
      const { error: uErr } = await db
        .from('articles')
        .update({ faq: faqs })
        .eq('id', row.id);
      if (uErr) throw new Error(uErr.message);
      counts[kind]++;
      ok++;
      console.log(`  ${tag} ${kind.padEnd(9)} ${row.path.padEnd(60).slice(0, 60)} ${faqs.length}q`);
    } catch (e) {
      failed++;
      console.error(`  ${tag} FAILED ${row.path}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(`\nDone — ${ok} written, ${failed} failed.`);
  console.log(`  hub: ${counts.hub}, review: ${counts.review}, yrkesroll: ${counts.yrkesroll}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
