/**
 * Slår ihop de gamla, tunna "-bredig"-recensionerna (luminar-neo-bredig,
 * topaz-photo-bredig) med de nya, djupare recensionerna av samma verktyg
 * som skrevs under foto-bildredigering-hubben. removebg-bredig rörs INTE —
 * den återanvänds legitimt i produktbilder-hubbens kuraterade lista
 * (CURATED_HUB_TOOL_SLUGS i lib/route-kind.ts) och har ingen nyare motsvarighet.
 *
 *   npx tsx scripts/merge-bredig-duplicates.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const MERGES: { oldSlug: string; newSlug: string }[] = [
  { oldSlug: 'luminar-neo-bredig', newSlug: 'luminar-neo' },
  { oldSlug: 'topaz-photo-bredig', newSlug: 'topaz-photo-ai' },
];

async function main() {
  for (const { oldSlug, newSlug } of MERGES) {
    const { data: linking, error: linkErr } = await db
      .from('articles')
      .select('slug,content_mdx')
      .ilike('content_mdx', `%/ai-verktyg/${oldSlug}%`);
    if (linkErr) { console.error(linkErr); continue; }

    for (const row of linking ?? []) {
      const updated = row.content_mdx.split(`/ai-verktyg/${oldSlug}`).join(`/ai-verktyg/${newSlug}`);
      const { error } = await db.from('articles').update({ content_mdx: updated }).eq('slug', row.slug);
      if (error) console.error(`Länkfix misslyckades ${row.slug}:`, error);
      else console.log(`Länk fixad i ${row.slug}: ${oldSlug} -> ${newSlug}`);
    }

    const { error: unpubErr } = await db.from('articles').update({ published_at: null }).eq('slug', oldSlug);
    if (unpubErr) console.error(`Avpublicering misslyckades ${oldSlug}:`, unpubErr);
    else console.log(`Avpublicerad: ${oldSlug}`);
  }

  const { data: finalChildren, error: countErr } = await db
    .from('articles')
    .select('slug')
    .eq('parent_slug', 'ai-bild-verktyg')
    .not('published_at', 'is', null);
  if (countErr) { console.error(countErr); return; }
  const count = finalChildren.length;
  console.log(`Nytt antal publicerade verktyg i ai-bild-verktyg: ${count}`);

  const { error: titleErr } = await db
    .from('articles')
    .update({
      title: `AI för bild: de ${count} bästa AI-bildverktygen 2026`,
      seo_title: `AI för bild 2026 — de ${count} bästa AI-bildverktygen & bildgeneratorerna`,
    })
    .eq('slug', 'ai-bild-verktyg');
  if (titleErr) console.error(titleErr);
  else console.log(`Titel uppdaterad till ${count} verktyg.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
