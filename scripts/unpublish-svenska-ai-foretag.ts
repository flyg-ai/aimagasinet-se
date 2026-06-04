/**
 * Avpublicerar gamla /svenska-ai-foretag-2026 (ersatt av den granskande
 * /svenska-ai-startups-2026 + 301 i next.config.mjs). Sätter type='post' och
 * published_at=NULL så den faller bort ur listningar (senaste/kategori), medan
 * 301:an fortsatt fångar URL:en.
 *
 *   npx tsx scripts/unpublish-svenska-ai-foretag.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

async function main() {
  const { data, error } = await db
    .from('articles')
    .update({ type: 'post', published_at: null })
    .eq('path', '/svenska-ai-foretag-2026')
    .select('path,type,published_at');
  if (error) { console.error('update failed:', error.message); process.exit(1); }
  if (!data || data.length === 0) { console.error('ingen rad matchade /svenska-ai-foretag-2026'); process.exit(1); }
  console.log('✓ Uppdaterad:', JSON.stringify(data[0]));
}

main().catch((e) => { console.error(e); process.exit(1); });
