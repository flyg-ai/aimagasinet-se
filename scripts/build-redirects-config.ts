/**
 * Bygg redirects.generated.mjs från redirect-maparna (trio + ekonomi/mktf) +
 * legacy hub/yrkesRoll-paths för trion. Importeras av next.config.mjs.
 *
 *   npx tsx scripts/build-redirects-config.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flattenRedirects } from '../redirects.flatten.generated.mjs';
import { dedupRedirects } from '../redirects.dedup.generated.mjs';

type R = { from: string; to: string };

// Trio: gamla kategori-hubbar + yrkesRoll → ny kanonisk hub.
const TRIO_LEGACY: R[] = [
  ['juridik', ['', 'avtalsgranskning', 'due-diligence', 'rattsutredningar']],
  ['kundservice', ['', 'chatbot', 'epost-svar', 'rost-ai']],
  ['rekrytering', ['', 'cv-screening', 'jobbannonser', 'kandidatmatchning']],
].flatMap(([yrke, subs]) =>
  (subs as string[]).map((sub) => ({
    from: `/ai-verktyg/foretag/yrke/${yrke}${sub ? '/' + sub : ''}`,
    to: `/ai-verktyg/${yrke}`,
  }))
);

function load(file: string): R[] {
  try { return (JSON.parse(readFileSync(resolve(file), 'utf8')).redirects ?? []) as R[]; }
  catch { return []; }
}

const all = [...load('tmp/yrkes-redirects.json'), ...load('tmp/ekonomi-mktf-redirects.json'), ...TRIO_LEGACY];

// Dedup på source (källa), första vinner. Hoppa no-ops.
const seen = new Set<string>();
const out: { source: string; destination: string; statusCode: number }[] = [];
for (const r of all) {
  if (r.from === r.to || seen.has(r.from)) continue;
  seen.add(r.from);
  out.push({ source: r.from, destination: r.to, statusCode: 301 });
}

// Kollapsa 301-kedjor: destinationer som pekar på en flatten-källa (gammal
// nästlad review-path) eller en raderad dubblett-variant resolvas transitivt
// till sitt slutliga mål, så vi får ett hopp inte flera.
// Se scripts/flatten-reviews.ts / merge-duplicates.ts / collapse-redirect-chains.ts.
const map = new Map<string, string>([
  ...flattenRedirects.map((r) => [r.source, r.destination] as [string, string]),
  ...dedupRedirects.map((r) => [r.source, r.destination] as [string, string]),
]);
for (const r of out) {
  let cur = r.destination;
  for (let i = 0; i < 10; i++) { const n = map.get(cur); if (!n || n === cur) break; cur = n; }
  r.destination = cur;
}

writeFileSync(resolve('redirects.generated.mjs'),
  `// AUTO-GENERERAD av scripts/build-redirects-config.ts — redigera inte för hand.\n` +
  `// 301-redirects: gamla /ai-verktyg/foretag/yrke/* → kanoniska /ai-verktyg/{hub}/*\n` +
  `/** @type {{source: string, destination: string, statusCode: number}[]} */\n` +
  `export const yrkesRedirects = ${JSON.stringify(out, null, 2)};\n`,
  'utf8');
console.log(`Skrev redirects.generated.mjs (${out.length} redirects)`);
