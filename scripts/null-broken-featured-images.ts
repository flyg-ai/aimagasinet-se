/**
 * One-shot cleanup: null out every articles.featured_image that points at
 * the now-decommissioned Loopia WP origin
 * (https://aimagasinet.se/wp-content/uploads/...). Those URLs all return
 * 403/404 since DNS cut over to Vercel, so the <img> tags break.
 *
 * After this runs, ArticleCard / SidebarArticleCard fall back to the
 * <CardCover> gradient placeholder instead of showing a broken-image icon.
 *
 * Idempotent: re-running is a no-op since matched rows already have null.
 * Run AFTER you've migrated any images you want to keep — see
 * scripts/migrate-images-to-storage.ts for that path (uses --resolve to a
 * working origin IP).
 *
 *   npx tsx scripts/null-broken-featured-images.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BROKEN_PREFIX = 'https://aimagasinet.se/wp-content/uploads/';

async function main() {
  // First, count what we're about to nuke so the log is informative.
  const { data: hits, error: selErr } = await db
    .from('articles')
    .select('id,path,featured_image')
    .like('featured_image', `${BROKEN_PREFIX}%`);
  if (selErr) { console.error(selErr); process.exit(1); }

  console.log(`Will null out ${hits?.length ?? 0} featured_image URLs pointing at the dead Loopia origin.`);
  (hits ?? []).slice(0, 10).forEach((r) => console.log(`  - ${r.path}\n    ${r.featured_image}`));
  if ((hits?.length ?? 0) > 10) console.log(`  …and ${(hits?.length ?? 0) - 10} more`);

  const { error: updErr, count } = await db
    .from('articles')
    .update({ featured_image: null }, { count: 'exact' })
    .like('featured_image', `${BROKEN_PREFIX}%`);
  if (updErr) { console.error(updErr); process.exit(1); }

  console.log(`\nNulled ${count ?? 0} rows.`);
}

main();
