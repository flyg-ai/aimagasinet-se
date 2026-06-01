/**
 * Radera de gamla kategori-hub- och yrkesRoll-raderna för de 5 migrerade yrkena
 * ur DB så de försvinner ur den DB-drivna sitemapen. De 301:as redan på kodnivå
 * (redirects.generated.mjs är deployad), så radering bryter inga URL:er.
 *
 *   npx tsx scripts/delete-legacy-hubs.ts          (dry)
 *   npx tsx scripts/delete-legacy-hubs.ts --apply
 *
 * Rör INTE /ai-verktyg/foretag/yrke (navsidan) eller designer/fotograf-video.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const Y = '/ai-verktyg/foretag/yrke';
const PATHS = [
  // yrkesRoll (depth 4)
  `${Y}/juridik`, `${Y}/kundservice`, `${Y}/rekrytering`, `${Y}/ekonomi-redovisning`, `${Y}/marknadsforing`,
  // kategori-hubbar (depth 5)
  `${Y}/juridik/avtalsgranskning`, `${Y}/juridik/due-diligence`, `${Y}/juridik/rattsutredningar`,
  `${Y}/kundservice/chatbot`, `${Y}/kundservice/epost-svar`, `${Y}/kundservice/rost-ai`,
  `${Y}/rekrytering/cv-screening`, `${Y}/rekrytering/jobbannonser`, `${Y}/rekrytering/kandidatmatchning`,
  `${Y}/ekonomi-redovisning/bokforing`, `${Y}/ekonomi-redovisning/redovisning`,
  `${Y}/marknadsforing/seo`, `${Y}/marknadsforing/content-copywriting`, `${Y}/marknadsforing/annonser`, `${Y}/marknadsforing/sociala-medier`,
];

async function main() {
  console.log(`${PATHS.length} legacy hub/yrkesRoll-paths`);

  // Guard: varje path måste ha en redirect deployad.
  const cfg = readFileSync(resolve('redirects.generated.mjs'), 'utf8');
  const missing = PATHS.filter((p) => !cfg.includes(`"${p}"`));
  if (missing.length) { console.error(`⚠ saknar redirect: ${missing.join(', ')} — AVBRYTER`); process.exit(1); }
  console.log('✓ alla har redirect i redirects.generated.mjs');

  // Säkerhet: bekräfta att raderna inte har kvarvarande barn (skulle bli föräldralösa).
  const { data: rows } = await db.from('articles').select('slug,path').in('path', PATHS);
  console.log(`finns i DB: ${rows?.length ?? 0}`);
  for (const r of rows ?? []) {
    const { count } = await db.from('articles').select('*', { count: 'exact', head: true }).eq('parent_slug', r.slug);
    if (count) console.log(`  ${r.path}: ${count} barn kvar (${r.slug})`);
  }

  if (!APPLY) { console.log('(dry — kör med --apply)'); return; }
  const { data, error } = await db.from('articles').delete().in('path', PATHS).select('id');
  if (error) { console.error('delete failed:', error.message); process.exit(1); }
  console.log(`Raderade ${data?.length ?? 0} rader.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
