/**
 * Categorize any post where category IS NULL or category = 'uncategorized'
 * by asking Claude Haiku to pick one of the 5 valid slugs based on title +
 * excerpt. Idempotent — only touches matching rows.
 *
 *   npx tsx scripts/tag-uncategorized.ts
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
] as const;

const SYSTEM = `Du är redaktör på AI-Magasinet. Klassificera artiklar i exakt en av fem kategorier baserat på titel och utdrag.

Kategorier:
- ai-nyheter — Allmänna AI-nyheter, releaser, branschhändelser, virala AI-stories, ChatGPT/Claude/etc-uppdateringar
- teknik-modeller — Djupdykning i modeller, arkitekturer (GPT, LLaMA, Diffusion), benchmarks, jämförelser av modeller, AI-teknologi
- foretag-aktorer — Specifika bolag (OpenAI, Anthropic, Google AI, Meta AI), finansiering, förvärv, ledarskap, marknadsstrategier
- ai-sakerhet-etik — AI safety, alignment, bias, dataskydd, etiska dilemman, deepfakes som hot
- forskning-utveckling — Akademisk forskning, papers, framsteg från universitet, RISE, forskningsgrupper

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
  console.warn(`  · model returned "${text}" — not in VALID list, skipping`);
  return null;
}

async function main() {
  const { data, error } = await db
    .from('articles')
    .select('id,slug,title,excerpt')
    .eq('type', 'post')
    .or('category.is.null,category.eq.uncategorized');
  if (error) { console.error(error.message); process.exit(1); }
  const rows = data ?? [];
  console.log(`Tagging ${rows.length} uncategorized posts via ${MODEL}…\n`);

  let ok = 0, skipped = 0;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const tag = `[${i + 1}/${rows.length}]`;
    const cat = await categorize(r.title, r.excerpt);
    if (!cat) { skipped++; continue; }
    const { error: uErr } = await db.from('articles').update({ category: cat }).eq('id', r.id);
    if (uErr) { console.error(`  ${tag} ${r.slug}: ${uErr.message}`); continue; }
    console.log(`  ${tag} ${r.slug.padEnd(60)} → ${cat}`);
    ok++;
  }
  console.log(`\nDone — ${ok} tagged, ${skipped} skipped.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
