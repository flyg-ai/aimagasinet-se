/**
 * Laga ingresser som klippts mitt i en mening.
 *
 * Den automatiska genereringen klippte tidigare första stycket rakt av vid 220
 * tecken. Det här skriptet räknar om ingressen med lib/excerpt.ts för de
 * artiklar som drabbats, och uppdaterar seo_description när den var identisk
 * med ingressen.
 *
 *   npx tsx scripts/fix-excerpts.ts            # torrkörning
 *   npx tsx scripts/fix-excerpts.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { excerptFromHtml } from '../lib/excerpt';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

/** Slutar texten mitt i en mening? */
function truncated(s: string): boolean {
  return s.length >= 200 && !/[.!?…]$/.test(s.trim());
}

async function main() {
  const apply = process.argv.includes('--apply');
  const { data, error } = await db
    .from('articles')
    .select('id,path,excerpt,seo_description,content_mdx')
    .not('excerpt', 'is', null);
  if (error) throw new Error(error.message);

  let n = 0;
  for (const a of data ?? []) {
    const cur = (a.excerpt ?? '') as string;
    if (!truncated(cur)) continue;
    const next = excerptFromHtml((a.content_mdx ?? '') as string);
    if (!next || next === cur) continue;
    n++;
    console.log(`${a.path}\n  före: …${cur.slice(-60)}\n  efter: …${next.slice(-60)}\n`);
    if (!apply) continue;
    const patch: Record<string, string> = { excerpt: next };
    if (a.seo_description === cur) patch.seo_description = next;
    const up = await db.from('articles').update(patch).eq('id', a.id);
    if (up.error) console.error(`  FEL: ${up.error.message}`);
  }
  console.log(apply ? `${n} ingresser lagade.` : `${n} ingresser att laga. Kör med --apply.`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
