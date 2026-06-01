/**
 * Bygg redirects.generated.mjs från redirect-maparna (trio + ekonomi/mktf) +
 * legacy hub/yrkesRoll-paths för trion. Importeras av next.config.mjs.
 *
 *   npx tsx scripts/build-redirects-config.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

writeFileSync(resolve('redirects.generated.mjs'),
  `// AUTO-GENERERAD av scripts/build-redirects-config.ts — redigera inte för hand.\n` +
  `// 301-redirects: gamla /ai-verktyg/foretag/yrke/* → kanoniska /ai-verktyg/{hub}/*\n` +
  `/** @type {{source: string, destination: string, statusCode: number}[]} */\n` +
  `export const yrkesRedirects = ${JSON.stringify(out, null, 2)};\n`,
  'utf8');
console.log(`Skrev redirects.generated.mjs (${out.length} redirects)`);
