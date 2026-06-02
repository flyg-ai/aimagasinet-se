/**
 * Guard: assert that every tool profile across all REVIEW_KNOWN sources (and
 * the HubTemplate topplista profiles) has a fallbackUrl. fallbackUrl is the
 * external CTA target used when articles.affiliate_url is NULL, so a missing
 * one means a dead "Prova X"-button.
 *
 *   npx tsx scripts/audit-fallback-urls.ts
 *
 * Exits non-zero if any profile lacks a (valid http) fallbackUrl, so it can
 * run in CI / pre-deploy. Read-only.
 *
 * Two kinds of source:
 *   - Data libs exporting Partial<ReviewProfile> records → imported and
 *     inspected at runtime (the real risk surface, since the field is
 *     optional there). yrke-tools' fallbackUrl is a required YrkeTool field,
 *     included here for completeness.
 *   - Inline object literals in the two template .tsx files → scanned
 *     statically (they can't be imported without pulling in React/next).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { YRKE_REVIEW_KNOWN } from '../lib/yrke-tools';
import { CATEGORY_HUB_REVIEW_KNOWN } from '../lib/category-hub-tools';
import { YRKES_HUB_REVIEW_KNOWN } from '../lib/yrkes-hub-tools';
import { YRKES_HUB_REVIEW_KNOWN_EXTRA } from '../lib/yrkes-hub-tools-extra';
import { VIDEO_AUDIO_REVIEW_KNOWN } from '../lib/video-audio-tools';

type Profile = { fallbackUrl?: string; ctaName?: string };
type Miss = { source: string; key: string };

const RECORD_SOURCES: Record<string, Record<string, Profile>> = {
  'lib/yrke-tools.ts (YRKE_REVIEW_KNOWN)': YRKE_REVIEW_KNOWN,
  'lib/category-hub-tools.ts': CATEGORY_HUB_REVIEW_KNOWN,
  'lib/yrkes-hub-tools.ts': YRKES_HUB_REVIEW_KNOWN,
  'lib/yrkes-hub-tools-extra.ts': YRKES_HUB_REVIEW_KNOWN_EXTRA,
  'lib/video-audio-tools.ts': VIDEO_AUDIO_REVIEW_KNOWN,
};

const isValid = (u: string | undefined): boolean => !!u && /^https?:\/\/[^ ]+\.[^ ]+/.test(u);

/** Brace-walk an object literal `const NAME ... = { … }` and report each
 *  depth-1 entry whose body lacks a `fallbackUrl:` key. Spreads are skipped. */
function scanLiteral(file: string, constName: string): Miss[] {
  const src = readFileSync(resolve(file), 'utf8');
  const anchor = src.indexOf(`const ${constName}`);
  if (anchor < 0) throw new Error(`${constName} not found in ${file}`);
  let i = src.indexOf('{', anchor) + 1;
  let depth = 1;
  const out: Miss[] = [];
  while (i < src.length && depth > 0) {
    if (depth === 1) {
      const km = src
        .slice(i)
        .match(/^\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\.\.\.\s*[A-Za-z0-9_]+\s*,?|((?:'[^']+'|"[^"]+"|[A-Za-z0-9_$-]+))\s*:\s*{)/);
      if (km) {
        if (km[1]) {
          const key = km[1].replace(/['"]/g, '');
          let j = i + km[0].length;
          let d = 1;
          while (j < src.length && d > 0) {
            const c = src[j];
            if (c === '{') d++;
            else if (c === '}') d--;
            j++;
          }
          if (!/\bfallbackUrl\s*:/.test(src.slice(i + km[0].length, j))) {
            out.push({ source: `${file} (${constName})`, key });
          }
          i = j;
          continue;
        }
        i += km[0].length; // spread — skip
        continue;
      }
    }
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    i++;
  }
  return out;
}

function main() {
  const missing: Miss[] = [];
  let checked = 0;

  for (const [source, rec] of Object.entries(RECORD_SOURCES)) {
    for (const [key, prof] of Object.entries(rec)) {
      checked++;
      if (!isValid(prof.fallbackUrl)) missing.push({ source, key });
    }
  }

  for (const [file, name] of [
    ['components/templates/ReviewTemplate.tsx', 'REVIEW_KNOWN'],
    ['components/templates/HubTemplate.tsx', 'KNOWN'],
    ['components/templates/HubTemplate.tsx', 'VIRTUAL_KNOWN'],
  ] as const) {
    const miss = scanLiteral(file, name);
    // scanLiteral only counts entries; add to the running total via a probe.
    checked += countEntries(file, name);
    missing.push(...miss);
  }

  console.log(`Checked ${checked} tool profiles across 8 sources.`);
  if (missing.length === 0) {
    console.log('OK — every profile has a valid fallbackUrl.');
    return;
  }
  console.log(`\nFAIL — ${missing.length} profile(s) missing fallbackUrl:`);
  for (const m of missing) console.log(`   ${m.key}  (${m.source})`);
  process.exitCode = 1;
}

/** Count depth-1 entries (excluding spreads) in an object literal. */
function countEntries(file: string, constName: string): number {
  const src = readFileSync(resolve(file), 'utf8');
  const anchor = src.indexOf(`const ${constName}`);
  let i = src.indexOf('{', anchor) + 1;
  let depth = 1;
  let n = 0;
  while (i < src.length && depth > 0) {
    if (depth === 1) {
      const km = src
        .slice(i)
        .match(/^\s*(?:\/\*[\s\S]*?\*\/\s*)*(?:\.\.\.\s*[A-Za-z0-9_]+\s*,?|((?:'[^']+'|"[^"]+"|[A-Za-z0-9_$-]+))\s*:\s*{)/);
      if (km) {
        if (km[1]) {
          n++;
          let j = i + km[0].length;
          let d = 1;
          while (j < src.length && d > 0) {
            const c = src[j];
            if (c === '{') d++;
            else if (c === '}') d--;
            j++;
          }
          i = j;
          continue;
        }
        i += km[0].length;
        continue;
      }
    }
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    i++;
  }
  return n;
}

main();
