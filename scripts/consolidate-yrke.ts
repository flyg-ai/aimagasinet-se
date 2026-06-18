/**
 * STEG 3+4: sweep interna länkar till de 6 yrkesguiderna i andra artiklars
 * content_mdx, sedan hård-radera de 6 raderna (efter att 301 verifierats i
 * next.config.mjs — skydd mot 404, som scripts/delete-dubbletter.ts).
 *   npx tsx scripts/consolidate-yrke.ts            (dry)
 *   npx tsx scripts/consolidate-yrke.ts --apply
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const PATHS = ['/ai-verktyg/kundservice/kundtjanst-yrke', '/ai-verktyg/rekrytering/rekryterare', '/ai-verktyg/marknadsforing/marknadsforing-yrke', '/ai-verktyg/juridik/advokat', '/ai-verktyg/ekonomi/bokforare', '/ai-verktyg/ekonomi/revisor'];

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY ===');

  // 1) Interna länkar i andra artiklars brödtext
  console.log('\n1) Inlänkar i annan brödtext (content_mdx):');
  let dangling = 0;
  for (const p of PATHS) {
    const { data } = await db.from('articles').select('path').ilike('content_mdx', `%${p}"%`).not('path', 'in', `(${PATHS.join(',')})`);
    for (const h of data ?? []) { console.log(`  ${p}  ⟵ ${h.path}`); dangling++; }
  }
  if (!dangling) console.log('  (inga inlänkar i brödtext — inga dinglande länkar)');

  // 2) Guard: 301 måste finnas i next.config.mjs för varje path
  const cfg = readFileSync(resolve('next.config.mjs'), 'utf8');
  const missing = PATHS.filter((p) => !cfg.includes(`'${p}'`));
  if (missing.length) { console.error(`\n✗ saknar 301 i next.config.mjs för: ${missing.join(', ')} — AVBRYTER`); process.exit(1); }
  console.log('\n2) ✓ alla 6 paths har 301 i next.config.mjs');

  // 3) Radera raderna
  const { data: rows } = await db.from('articles').select('slug,path').in('path', PATHS);
  console.log(`\n3) Rader att radera (${rows?.length ?? 0}):`);
  (rows ?? []).forEach((r: any) => console.log(`  - ${r.path} (slug=${r.slug})`));
  if (dangling) { console.error('\n⚠ Det finns dinglande inlänkar ovan — städa dem innan radering. AVBRYTER.'); process.exit(1); }
  if (APPLY) {
    const { data, error } = await db.from('articles').delete().in('path', PATHS).select('slug');
    if (error) { console.error('delete failed:', error.message); process.exit(1); }
    console.log(`  ✓ raderade ${data?.length ?? 0} rader`);
  } else {
    console.log('  (dry — kör med --apply)');
  }
}
main();
