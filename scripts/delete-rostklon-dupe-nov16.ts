/**
 * Raderar den gamla röstklon-dubbletten (id 1011) ur articles-tabellen.
 * Se next.config.mjs för 301-regeln som ersätter den (16 nov 2026).
 *
 *   npx tsx scripts/delete-rostklon-dupe-nov16.ts
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

async function main() {
  const { data, error } = await db.from('articles').delete().eq('id', 1011).select('id, slug');
  if (error) { console.error('ERROR', error); process.exit(1); }
  if (!data || data.length === 0) { console.error('Ingen rad raderad — id 1011 fanns inte (redan borttagen?).'); process.exit(1); }
  console.log('Raderad:', JSON.stringify(data));
}
main();
