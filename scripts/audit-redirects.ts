/**
 * Audit every 301-redirect declared in next.config.mjs (hand-written entries
 * plus the generated yrkesRedirects) and verify the redirect map is healthy:
 *
 *   - every destination resolves to a live articles.path row (or a known
 *     dynamic/static route: "/" or "/kategori/*"), i.e. no 301 → 404 chain
 *   - no duplicate sources
 *   - reports sources that still shadow a live DB page (usually intentional,
 *     but worth seeing)
 *
 * Read-only — touches nothing. Exits non-zero if any destination is broken,
 * so it can double as a CI / pre-deploy guard.
 *
 *   npx tsx scripts/audit-redirects.ts
 *
 * The complementary question — "which old path lost its redirect?" — needs a
 * source of truth for old URLs (Google Search Console export). Drop a newline-
 * separated list of old paths at tmp/gsc-paths.txt and this script will also
 * flag any that neither exist in DB nor have a redirect.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
// next.config.mjs default-exports the resolved config incl. async redirects().
import nextConfigUntyped from '../next.config.mjs';

const nextConfig = nextConfigUntyped as { redirects?: () => Promise<Redirect[]> };

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('missing supabase env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

type Redirect = { source: string; destination: string; statusCode?: number };

async function allDbPaths(): Promise<Set<string>> {
  const paths = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('articles').select('path').range(from, from + 999);
    if (error) throw new Error(error.message);
    if (!data.length) break;
    data.forEach((r) => paths.add(r.path as string));
    if (data.length < 1000) break;
  }
  return paths;
}

/** Old paths to check coverage for — Google Search Console export, optional. */
function gscPaths(): string[] {
  try {
    return readFileSync('tmp/gsc-paths.txt', 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((p) => p.replace(/\/$/, '')); // normalise away trailing slash
  } catch {
    return [];
  }
}

async function main() {
  const dbPaths = await allDbPaths();
  const redirects: Redirect[] = (await nextConfig.redirects?.()) ?? [];

  // A destination is "good" if it's the home route, a category route, or a
  // live article path. (Sources/destinations are stored without trailing
  // slash; trailingSlash:true normalises the final hop at request time.)
  const resolves = (d: string) =>
    d === '/' || d.startsWith('/kategori/') || dbPaths.has(d);

  const bySource = new Map<string, string>();
  const duplicates: string[] = [];
  const brokenDest: Redirect[] = [];
  const shadowing: Redirect[] = [];

  for (const r of redirects) {
    if (bySource.has(r.source)) duplicates.push(r.source);
    bySource.set(r.source, r.destination);
    if (r.source.includes(':')) continue; // wildcard source — skip dest check
    if (!resolves(r.destination)) brokenDest.push(r);
    if (dbPaths.has(r.source)) shadowing.push(r);
  }

  console.log(`Redirects declared:        ${redirects.length}`);
  console.log(`Live article paths in DB:  ${dbPaths.size}`);
  console.log(`Duplicate sources:         ${duplicates.length}`);
  console.log(`Broken destinations:       ${brokenDest.length}`);
  console.log(`Sources shadowing a page:  ${shadowing.length}`);

  if (duplicates.length) {
    console.log('\n── DUPLICATE SOURCES ──');
    duplicates.forEach((s) => console.log('  ', s));
  }
  if (brokenDest.length) {
    console.log('\n── BROKEN DESTINATIONS (301 → 404) ──');
    brokenDest.forEach((r) => console.log(`   ${r.source}  →  ${r.destination}`));
  }
  if (shadowing.length) {
    console.log('\n── SOURCES SHADOWING A LIVE DB PAGE (usually intentional) ──');
    shadowing.forEach((r) => console.log(`   ${r.source}  →  ${r.destination}`));
  }

  // Optional GSC coverage pass.
  const gsc = gscPaths();
  if (gsc.length) {
    const uncovered = gsc.filter((p) => !dbPaths.has(p) && !bySource.has(p));
    console.log(`\n── GSC COVERAGE (tmp/gsc-paths.txt, ${gsc.length} paths) ──`);
    console.log(`   uncovered (no live page, no redirect): ${uncovered.length}`);
    uncovered.forEach((p) => console.log(`   404-RISK  ${p}`));
    if (uncovered.length) process.exitCode = 1;
  }

  if (brokenDest.length || duplicates.length) process.exitCode = 1;
  if (process.exitCode) console.log('\nFAIL — see above.');
  else console.log('\nOK — every redirect destination resolves.');
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
