/**
 * Flatten all genuine tool reviews from /ai-verktyg/<kategori>/<slug> to the
 * canonical flat /ai-verktyg/<slug>. PATH ONLY — parent_slug is preserved so
 * the category hubs keep their topplista children (and HubTemplate's
 * "Läs recension" links auto-update to the new flat path).
 *
 * Scope (genuine reviews): depth-3, type=page, under /ai-verktyg/, with a
 * non-null parent_slug, EXCLUDING the /foretag/ and /gratis/ subtrees and the
 * 6 curated subcategory hubs (which have parent_slug=null). Designer/fotograf
 * yrkesroll pages are depth-4 hubs and are not included.
 *
 *   DRY_RUN=1 npx tsx scripts/flatten-reviews.ts   # plan only, writes redirects file
 *   npx tsx scripts/flatten-reviews.ts             # live: updates DB paths
 *
 * Always (re)writes redirects.flatten.generated.mjs (old path → new flat path,
 * 301), imported by next.config.mjs. Idempotent — rows already flat are skipped.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const DRY = process.env.DRY_RUN === '1';
const depth = (p: string) => p.split('/').filter(Boolean).length;

type Row = { slug: string; path: string; title: string; type: string; parent_slug: string | null };

async function main() {
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from('articles')
      .select('slug,path,title,type,parent_slug')
      .ilike('path', '/ai-verktyg/%')
      .range(from, from + 999);
    if (error) { console.error(error.message); process.exit(1); }
    if (!data?.length) break;
    rows.push(...(data as Row[]));
    if (data.length < 1000) break;
  }

  const allPaths = new Set(rows.map((r) => r.path));

  // Genuine reviews to flatten.
  const reviews = rows.filter((r) =>
    r.type === 'page' &&
    depth(r.path) === 3 &&
    r.parent_slug != null &&
    !r.path.startsWith('/ai-verktyg/foretag/') &&
    !r.path.startsWith('/ai-verktyg/gratis/')
  );

  const moves: { slug: string; from: string; to: string }[] = [];
  const collisions: { slug: string; from: string; to: string }[] = [];
  for (const r of reviews) {
    const to = `/ai-verktyg/${r.slug}`;
    if (to === r.path) continue;            // already flat
    if (allPaths.has(to)) { collisions.push({ slug: r.slug, from: r.path, to }); continue; }
    moves.push({ slug: r.slug, from: r.path, to });
  }

  console.log(`Reviews matched: ${reviews.length}`);
  console.log(`To move: ${moves.length}`);
  console.log(`Collisions (flat path already exists — SKIPPED): ${collisions.length}`);
  collisions.forEach((c) => console.log(`   SKIP ${c.from} -> ${c.to}`));
  console.log('\nSample moves:');
  moves.slice(0, 12).forEach((m) => console.log(`   ${m.from}  ->  ${m.to}`));

  // Write the 301 redirects module (old path → new flat path). ONLY when there
  // are moves — re-running post-migration finds 0 moves (rows already flat), and
  // overwriting with an empty list would wipe the committed redirects and 404
  // every old URL. So we preserve the existing file in that case.
  if (moves.length > 0) {
    const redirects = moves.map((m) => ({ source: m.from, destination: m.to, statusCode: 301 }));
    const file = resolve('redirects.flatten.generated.mjs');
    writeFileSync(file,
      `// AUTO-GENERERAD av scripts/flatten-reviews.ts — redigera inte för hand.\n` +
      `// 301: gamla /ai-verktyg/<kategori>/<slug> → flata /ai-verktyg/<slug>.\n` +
      `/** @type {{source: string, destination: string, statusCode: number}[]} */\n` +
      `export const flattenRedirects = ${JSON.stringify(redirects, null, 2)};\n`,
      'utf8');
    console.log(`\nWrote redirects.flatten.generated.mjs (${redirects.length} redirects)`);
  } else {
    console.log('\nNo moves — redirects.flatten.generated.mjs left untouched (already migrated).');
  }

  if (DRY) { console.log('\nDRY_RUN — no DB changes.'); return; }

  // Live: update path only, in batches. parent_slug untouched.
  let ok = 0, failed = 0;
  for (const m of moves) {
    const { error } = await db.from('articles').update({ path: m.to }).eq('slug', m.slug).eq('path', m.from);
    if (error) { failed++; console.error(`   FAIL ${m.from}: ${error.message}`); }
    else ok++;
  }
  console.log(`\nDB updated: ${ok} ok, ${failed} failed.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
