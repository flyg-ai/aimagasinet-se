/**
 * Publicerar de 6 kodgranskningsrecensionerna + listicle-artikeln, efter
 * uttryckligt godkännande. Bilder saknas fortfarande — läggs till separat.
 *
 *   npx tsx scripts/publish-ai-kodgranskning.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const SLUGS = [
  'coderabbit',
  'qodo',
  'greptile',
  'github-copilot-code-review',
  'graphite',
  'korbit-ai',
  'basta-ai-for-kodgranskning-2026',
];

async function main() {
  const now = new Date().toISOString();
  for (const slug of SLUGS) {
    const { error } = await db.from('articles').update({ published_at: now }).eq('slug', slug);
    if (error) { console.error(slug, error); process.exit(1); }
    console.log(`OK: ${slug} publicerad`);
  }
}
main();
