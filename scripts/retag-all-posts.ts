/**
 * Re-classify EVERY post via Claude Haiku 4.5 to spread them across the
 * 6 valid category slugs. Goal: ≥5 articles per category, none NULL.
 *
 *   npx tsx scripts/retag-all-posts.ts
 *
 * Idempotent — the model gets the same prompt every time, so reruns
 * converge. Uses cache_control on the system prompt so subsequent
 * articles reuse the cached prefix.
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

const VALID = [
  'ai-nyheter',
  'teknik-modeller',
  'foretag-aktorer',
  'ai-sakerhet-etik',
  'forskning-utveckling',
  'lagstiftning-policy',
] as const;

const SYSTEM = `Du är redaktör på AI-Magasinet och klassificerar artiklar i exakt EN av sex kategorier baserat på titel och utdrag.

Kategorier (välj den som BÄST passar):
- ai-nyheter — Allmänna nyheter, releaser, lanseringar, virala AI-händelser, "X lanserade Y"-rubriker
- teknik-modeller — Djupdykningar i modeller (GPT, Claude, Llama, Gemini, Sora, diffusion), benchmarks, jämförelser, AI-arkitektur, "Så fungerar X"
- foretag-aktorer — Specifika bolag (OpenAI, Anthropic, Google, Meta, Microsoft, Nvidia, svenska AI-bolag), finansiering, förvärv, ledarskap, strategier, marknad
- ai-sakerhet-etik — AI safety/alignment, bias, dataskydd, deepfakes som hot, integritet, GDPR i AI-kontext, etiska dilemman
- forskning-utveckling — Akademisk forskning, papers, RISE, universitetsforskning, vetenskapliga genombrott
- lagstiftning-policy — EU AI Act, lagar, regleringar, policy-debatter, myndighetsbeslut, Pentagon-rules etc

VIKTIGT: Var inte rädd att använda mindre vanliga kategorier (forskning-utveckling, lagstiftning-policy, ai-sakerhet-etik) om de passar — sajten behöver bred fördelning. Inte allt är "ai-nyheter".

Svara med ENDAST kategori-slug på en rad. Inget annat. Exempel: "ai-nyheter"`;

async function categorize(title: string, excerpt: string | null): Promise<string | null> {
  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: 50,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: `Titel: ${title}\nUtdrag: ${excerpt ?? '(inget utdrag)'}\n\nKategori:`,
    }],
  });
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .toLowerCase()
    .replace(/^["']|["']$/g, '');
  if ((VALID as readonly string[]).includes(text)) return text;
  console.warn(`  · model returned "${text}" — invalid, skipping`);
  return null;
}

async function main() {
  const { data, error } = await db
    .from('articles')
    .select('id,slug,title,excerpt,category')
    .eq('type', 'post')
    .order('published_at', { ascending: false });
  if (error) { console.error(error.message); process.exit(1); }
  const rows = data ?? [];
  console.log(`Re-tagging ${rows.length} posts via ${MODEL}…\n`);

  const before: Record<string, number> = {};
  for (const r of rows) before[r.category ?? 'null'] = (before[r.category ?? 'null'] ?? 0) + 1;

  let ok = 0, kept = 0, skipped = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const tag = `[${i + 1}/${rows.length}]`;
    const cat = await categorize(r.title, r.excerpt);
    if (!cat) { skipped++; continue; }
    if (cat === r.category) {
      console.log(`  ${tag} ${r.slug.padEnd(64).slice(0, 64)} = ${cat}`);
      kept++;
      continue;
    }
    const { error: uErr } = await db.from('articles').update({ category: cat }).eq('id', r.id);
    if (uErr) { console.error(`  ${tag} ${r.slug}: ${uErr.message}`); continue; }
    console.log(`  ${tag} ${r.slug.padEnd(64).slice(0, 64)} ${r.category ?? 'null'} → ${cat}`);
    ok++;
  }

  console.log(`\nResult: ${ok} re-tagged, ${kept} unchanged, ${skipped} skipped.`);
  console.log('\n--- BEFORE ---');
  for (const [k, v] of Object.entries(before).sort()) console.log(`  ${k.padEnd(28)} ${v}`);

  const { data: after } = await db.from('articles').select('category').eq('type', 'post');
  const counts: Record<string, number> = {};
  for (const r of after ?? []) counts[r.category ?? 'null'] = (counts[r.category ?? 'null'] ?? 0) + 1;
  console.log('\n--- AFTER ---');
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(28)} ${v}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
