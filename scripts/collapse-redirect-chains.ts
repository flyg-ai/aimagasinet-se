/**
 * Collapse 301 chains created by the review-flattening. The yrkes- and
 * designer/fotograf-redirects were generated BEFORE reviews were flattened, so
 * their destinations point at the old nested review paths (e.g.
 * /ai-verktyg/juridik/harvey-ai) — which are now themselves flatten-redirect
 * sources → /ai-verktyg/harvey-ai. That's a double 301 hop.
 *
 * This rewrites both committed redirect modules in place so every destination
 * that is a flatten-source is replaced by its flat target — one hop, no chain.
 * Idempotent: destinations already flat aren't in the flatten map, so re-runs
 * are no-ops. Headers + export names are preserved.
 *
 *   npx tsx scripts/collapse-redirect-chains.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flattenRedirects } from '../redirects.flatten.generated.mjs';
import { dedupRedirects } from '../redirects.dedup.generated.mjs';
import { yrkesRedirects } from '../redirects.generated.mjs';
import { designerFotografRedirects } from '../redirects-designer-fotograf.mjs';

type Redirect = { source: string; destination: string; statusCode: number };

// Combined source→destination map: flatten (nested → flat /ai-verktyg/<slug>)
// and dedup (deleted variant → canonical). Used to resolve any destination to
// its FINAL target so no redirect points at a path that itself redirects.
const map = new Map<string, string>([
  ...flattenRedirects.map((r) => [r.source, r.destination] as [string, string]),
  ...dedupRedirects.map((r) => [r.source, r.destination] as [string, string]),
]);

/** Follow the map transitively to the terminal target (cycle-guarded). */
function resolveDest(dest: string): string {
  let cur = dest;
  for (let i = 0; i < 10; i++) {
    const next = map.get(cur);
    if (!next || next === cur) break;
    cur = next;
  }
  return cur;
}

/** Replace each destination with its final resolved target. */
function collapse(arr: Redirect[]): { out: Redirect[]; changed: number } {
  let changed = 0;
  const out = arr.map((r) => {
    const dest = resolveDest(r.destination);
    if (dest !== r.destination) { changed++; return { ...r, destination: dest }; }
    return r;
  });
  return { out, changed };
}

/** Rewrite a redirect .mjs file, preserving everything before `export const`. */
function rewrite(file: string, exportName: string, arr: Redirect[]): number {
  const path = resolve(file);
  const src = readFileSync(path, 'utf8');
  const header = src.slice(0, src.indexOf('export const'));
  const { out, changed } = collapse(arr);
  writeFileSync(path, `${header}export const ${exportName} = ${JSON.stringify(out, null, 2)};\n`, 'utf8');
  return changed;
}

const a = rewrite('redirects.generated.mjs', 'yrkesRedirects', yrkesRedirects as Redirect[]);
const b = rewrite('redirects-designer-fotograf.mjs', 'designerFotografRedirects', designerFotografRedirects as Redirect[]);
console.log(`Collapsed chains — yrkesRedirects: ${a}, designerFotografRedirects: ${b}`);
console.log('Re-run is a no-op (destinations already flat).');
