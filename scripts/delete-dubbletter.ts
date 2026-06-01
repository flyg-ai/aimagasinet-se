/**
 * SLUTSTEG (kör EFTER att redirects pushats/deployats): radera de gamla
 * dubblett-recensionerna. Tills redirects är live skulle radering ge 404.
 *
 *   npx tsx scripts/delete-dubbletter.ts          (dry: visar vad som raderas)
 *   npx tsx scripts/delete-dubbletter.ts --apply
 *
 * Raderar:
 *   - 90 trio-dubbletter (tmp/yrkes-redirects.json deletePaths)
 *   - 4 ChatGPT-dubbletter (tmp/ekonomi-mktf-redirects.json chatgptDeletePaths)
 * Totalt 94 rader. ekonomi/mktf-recensionerna är FLYTTADE (inte raderade).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

function read(file: string, key: string): string[] {
  try { return (JSON.parse(readFileSync(resolve(file), 'utf8'))[key] ?? []) as string[]; } catch { return []; }
}

async function main() {
  const trio = read('tmp/yrkes-redirects.json', 'deletePaths');
  const chatgpt = read('tmp/ekonomi-mktf-redirects.json', 'chatgptDeletePaths');
  const paths = Array.from(new Set([...trio, ...chatgpt]));
  console.log(`Radera ${paths.length} rader (${trio.length} trio + ${chatgpt.length} ChatGPT)`);

  // Verifiera att redirects finns innan radering (skydd mot 404).
  let missingRedirect = 0;
  try {
    const cfg = readFileSync(resolve('redirects.generated.mjs'), 'utf8');
    for (const p of paths) if (!cfg.includes(`"${p}"`)) missingRedirect++;
  } catch { missingRedirect = paths.length; }
  if (missingRedirect) {
    console.error(`⚠ ${missingRedirect} paths saknar redirect i redirects.generated.mjs — AVBRYTER (radera inte utan redirect).`);
    process.exit(1);
  }
  console.log('✓ alla paths har redirect i redirects.generated.mjs');

  if (!APPLY) { console.log('(dry — kör med --apply)'); return; }

  let deleted = 0;
  for (let i = 0; i < paths.length; i += 50) {
    const chunk = paths.slice(i, i + 50);
    const { data, error } = await db.from('articles').delete().in('path', chunk).select('id');
    if (error) { console.error('delete failed:', error.message); process.exit(1); }
    deleted += data?.length ?? 0;
  }
  console.log(`Raderade ${deleted} rader.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
