/**
 * Diagnostik: lista befintliga recensionssidor under /ai-video/ och
 * /ai-verktyg/ai-ljud-och-musik/ så vi vet vilka virtuella verktyg som
 * fortfarande saknar en riktig DB-artikel.
 *
 * Run: npx tsx scripts/diag-video-audio.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  for (const [label, like] of [
    ['ai-video', '/ai-video/%'],
    ['ai-ljud-och-musik', '/ai-verktyg/ai-ljud-och-musik/%'],
  ] as const) {
    const { data, error } = await db
      .from('articles')
      .select('slug,path,type')
      .like('path', like)
      .eq('type', 'page')
      .order('slug');
    if (error) { console.error(label, error.message); continue; }
    console.log(`\n=== ${label} (${data?.length ?? 0} sidor) ===`);
    data?.forEach((r) => console.log(`  ${r.slug}  →  ${r.path}`));
  }
}

main();
