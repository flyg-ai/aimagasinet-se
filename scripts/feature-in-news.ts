/**
 * Flaggar (eller avflaggar) en artikel för att dyka upp i startsidans
 * nyhets-hero, oavsett type/path. Manuellt, redaktionellt beslut — se
 * migration 0023_featured_in_news.sql.
 *
 *   npx tsx scripts/feature-in-news.ts <slug> [on|off]   (default: on)
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

async function main() {
  const slug = process.argv[2];
  const mode = process.argv[3] ?? 'on';
  if (!slug) {
    console.error('Usage: npx tsx scripts/feature-in-news.ts <slug> [on|off]');
    process.exit(1);
  }
  const value = mode === 'off' ? false : true;
  const { data, error } = await db
    .from('articles')
    .update({ featured_in_news: value })
    .eq('slug', slug)
    .select('slug,title,path')
    .single();
  if (error) { console.error(error); process.exit(1); }
  console.log(`${value ? 'Flaggad' : 'Avflaggad'}: ${data.slug} (${data.path}) — ${data.title}`);
}
main();
