/**
 * Distribute author_slug across every article. Deterministic so re-runs
 * give the same assignment — uses a tiny hash of the slug so we don't
 * need to remember which post got which author between runs.
 *
 *   npx tsx scripts/assign-authors.ts
 *
 * Default split: ~70% Nicklas / ~15% Erik / ~15% Sara.
 *
 * Requires that 0008_authors.sql has been applied AND that seed-authors.ts
 * has run (the three author rows must exist for the FK to validate).
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const AUTHORS = ['nicklas-hallberg', 'erik-lindgren', 'sara-nilsson'] as const;

/** Stable djb2-ish hash of a string → non-negative 32-bit int. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

/** Pick author based on slug hash modulo 20: 14 → Nicklas (70%),
 *  3 → Erik (15%), 3 → Sara (15%). */
function pickAuthor(slug: string): typeof AUTHORS[number] {
  const bucket = hash(slug) % 20;
  if (bucket < 14) return 'nicklas-hallberg';
  if (bucket < 17) return 'erik-lindgren';
  return 'sara-nilsson';
}

async function main() {
  const { data: articles, error } = await db
    .from('articles')
    .select('id,slug,author_slug')
    .order('id');
  if (error) { console.error('fetch articles:', error.message); process.exit(1); }

  const rows = articles ?? [];
  console.log(`Assigning author_slug for ${rows.length} articles…\n`);

  const counts: Record<string, number> = { 'nicklas-hallberg': 0, 'erik-lindgren': 0, 'sara-nilsson': 0 };
  let touched = 0, kept = 0, failed = 0;

  for (const r of rows) {
    const author = pickAuthor(r.slug);
    counts[author]++;
    if (r.author_slug === author) { kept++; continue; }
    const { error: uErr } = await db
      .from('articles')
      .update({ author_slug: author })
      .eq('id', r.id);
    if (uErr) {
      console.error(`  ✗ id=${r.id} ${r.slug}: ${uErr.message}`);
      failed++;
      continue;
    }
    touched++;
  }

  console.log(`\nResult: ${touched} updated, ${kept} unchanged, ${failed} failed.`);
  console.log('\nDistribution:');
  for (const [slug, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    const pct = ((n / rows.length) * 100).toFixed(1);
    console.log(`  ${slug.padEnd(20)} ${String(n).padStart(4)}  (${pct}%)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
