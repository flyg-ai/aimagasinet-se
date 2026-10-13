/**
 * Avpublicerar /vilken-ai-ar-bast-pa-svenska-vi-testade-chatgpt-claude-och-gemini
 * (published_at = NULL). Innehållet konsoliderades in i
 * /chatgpt-vs-claude-vs-gemini-2026 + 301, se redirects.seo-test.mjs (Test 5).
 *
 *   npx tsx scripts/unpublish-vilken-ai-ar-bast-pa-svenska.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PATH = '/vilken-ai-ar-bast-pa-svenska-vi-testade-chatgpt-claude-och-gemini';

async function run() {
  const { error } = await supabase
    .from('articles')
    .update({ published_at: null })
    .eq('path', PATH);
  if (error) throw error;
  console.log('OK — unpublished', PATH);
}

run().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
