/**
 * Deterministisk reparation efter att seed-yrkes-canonical-hubs.ts körts två
 * gånger (slug-dubbletter) + credit-stopp. INGEN Anthropic-API används.
 *
 *   npx tsx scripts/repair-yrkes-lib.ts          (dry: bara rapport)
 *   npx tsx scripts/repair-yrkes-lib.ts --apply  (radera juridik -2 dups + skriv lib/redirects)
 *
 * 1. Raderar de 10 felaktiga juridik "-2"-recensionerna (skapade av andra körningen).
 * 2. Läser kvarvarande kanoniska rader (parent_slug = hub-slug) och regenererar
 *    lib/yrkes-hub-tools.ts + tmp/yrkes-redirects.json nyckade på radernas FAKTISKA slug,
 *    deterministiskt från YRKE_TOOLS (toHubProfile/toReviewProfile).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { YRKE_TOOLS, toHubProfile, toReviewProfile } from '../lib/yrke-tools';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const PARENT_PATH: Record<string, string> = {
  avtalsgranskning: 'juridik/avtalsgranskning', 'due-diligence': 'juridik/due-diligence', rattsutredningar: 'juridik/rattsutredningar',
  chatbot: 'kundservice/chatbot', 'epost-svar': 'kundservice/epost-svar', 'rost-ai': 'kundservice/rost-ai',
  'cv-screening': 'rekrytering/cv-screening', jobbannonser: 'rekrytering/jobbannonser', kandidatmatchning: 'rekrytering/kandidatmatchning',
};
const HUBS: Record<string, string[]> = {
  'ai-verktyg-juridik': ['avtalsgranskning', 'due-diligence', 'rattsutredningar'],
  'ai-verktyg-kundservice': ['chatbot', 'epost-svar', 'rost-ai'],
  'ai-verktyg-rekrytering': ['cv-screening', 'jobbannonser', 'kandidatmatchning'],
};
function slugify(s: string): string {
  return s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/\.ai\b/g, '-ai').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  // 1. Radera juridik "-2"-dubbletter.
  const { data: dups } = await db.from('articles').select('slug,path').eq('parent_slug', 'ai-verktyg-juridik').like('slug', '%-2');
  console.log(`Juridik -2 dubbletter: ${dups?.length ?? 0}${dups?.length ? ' → ' + dups.map((d) => d.slug).join(', ') : ''}`);
  if (APPLY && dups?.length) {
    const { error } = await db.from('articles').delete().eq('parent_slug', 'ai-verktyg-juridik').like('slug', '%-2');
    if (error) { console.error('delete failed:', error.message); process.exit(1); }
    console.log(`  raderade ${dups.length} rader`);
  }

  // 2. Läs kvarvarande kanoniska rader.
  const reviewKnown: Record<string, ReturnType<typeof toReviewProfile>> = {};
  const hubKnown: Record<string, ReturnType<typeof toHubProfile>> = {};
  const redirects: { from: string; to: string }[] = [];
  const deletePaths: string[] = [];
  let missing = 0;

  for (const [hubSlug, parents] of Object.entries(HUBS)) {
    const { data: rows } = await db.from('articles').select('slug,path,title').eq('parent_slug', hubSlug).eq('type', 'page');
    for (const row of rows ?? []) {
      const base = row.slug.replace(/-\d+$/, '');
      const variants = YRKE_TOOLS.filter((t) => parents.includes(t.parent) && slugify(t.brand) === base);
      if (!variants.length) { console.warn(`  ⚠ ingen YRKE_TOOLS-match för ${row.slug} (base=${base})`); missing++; continue; }
      const top = [...variants].sort((a, b) => b.score - a.score)[0];
      const merged = {
        ...top,
        score: Math.round((variants.reduce((s, v) => s + v.score, 0) / variants.length) * 10) / 10,
        features: Array.from(new Set(variants.flatMap((v) => v.features))).slice(0, 6),
        pros: Array.from(new Set(variants.flatMap((v) => v.pros))).slice(0, 4),
        cons: Array.from(new Set(variants.flatMap((v) => v.cons))).slice(0, 3),
        useCases: Array.from(new Set(variants.flatMap((v) => v.useCases))).slice(0, 8),
        tags: Array.from(new Set(variants.flatMap((v) => v.tags))).slice(0, 4),
      };
      hubKnown[row.slug] = toHubProfile(merged);
      reviewKnown[row.slug] = toReviewProfile(merged);
      for (const v of variants) {
        const from = `/ai-verktyg/foretag/yrke/${PARENT_PATH[v.parent]}/${v.slug}`;
        redirects.push({ from, to: row.path });
        deletePaths.push(from);
      }
    }
    console.log(`${hubSlug}: ${(rows ?? []).length} rader`);
  }

  console.log(`\nProfiler: ${Object.keys(reviewKnown).length}, redirects: ${redirects.length}, missing: ${missing}`);

  if (APPLY) {
    writeFileSync(resolve('lib/yrkes-hub-tools.ts'),
      `/** Kanoniska yrkes-hub-profiler — deterministiskt regenererade av\n` +
      ` *  scripts/repair-yrkes-lib.ts. YRKES_HUB_KNOWN → HubTemplate KNOWN,\n` +
      ` *  YRKES_HUB_REVIEW_KNOWN → ReviewTemplate REVIEW_KNOWN. */\n` +
      `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
      `export const YRKES_HUB_KNOWN = ${JSON.stringify(hubKnown, null, 2)};\n\n` +
      `export const YRKES_HUB_REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(reviewKnown, null, 2)};\n`,
      'utf8');
    mkdirSync(resolve('tmp'), { recursive: true });
    writeFileSync(resolve('tmp/yrkes-redirects.json'), JSON.stringify({ redirects, deletePaths }, null, 2), 'utf8');
    console.log('Skrev lib/yrkes-hub-tools.ts + tmp/yrkes-redirects.json');
  } else {
    console.log('(dry — kör med --apply för att radera + skriva filer)');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
