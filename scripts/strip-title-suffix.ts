/**
 * Ta bort dubblerat varumärkessuffix ur seo_title.
 *
 * app/layout.tsx sätter title.template = "%s | AI-Magasinet" och lägger på
 * suffixet själv. Rader som redan bär det får "… | AI-Magasinet | AI-Magasinet"
 * i title-taggen.
 *
 *   npx tsx tmp/strip-title-suffix.ts            # torrkörning
 *   npx tsx tmp/strip-title-suffix.ts --apply
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

const SUFFIX = /\s*\|\s*AI-Magasinet\s*$/i;

async function main() {
  const apply = process.argv.includes('--apply');

  // PostgREST tar max 1000 rader per svar — sidbrytning krävs.
  const rows: { id: number; seo_title: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from('articles')
      .select('id,seo_title')
      .not('seo_title', 'is', null)
      .order('id')
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as { id: number; seo_title: string }[]));
    if (!data || data.length < 1000) break;
  }

  const hits = rows.filter((r) => SUFFIX.test(r.seo_title));
  console.log(`${rows.length} artiklar har seo_title, ${hits.length} bär dubblerat suffix.`);
  for (const r of hits.slice(0, 5)) console.log(`  ${r.id}  ${r.seo_title}`);
  if (hits.length > 5) console.log(`  … och ${hits.length - 5} till`);

  if (!apply) {
    console.log('\nTorrkörning. Kör med --apply.');
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const r of hits) {
    const next = r.seo_title.replace(SUFFIX, '').trim();
    if (!next) {
      failed++;
      console.error(`  ${r.id}: tom titel efter strip — hoppar över`);
      continue;
    }
    const { error } = await db.from('articles').update({ seo_title: next }).eq('id', r.id);
    if (error) {
      failed++;
      console.error(`  ${r.id}: ${error.message}`);
    } else ok++;
  }
  console.log(`\nRättade ${ok}, misslyckades ${failed}.`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
