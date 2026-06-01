import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

(async () => {
  const { data, error } = await db
    .from('articles')
    .select('path,slug,parent_slug,title')
    .like('path', '/ai-verktyg/foretag/yrke/%')
    .eq('type', 'page')
    .order('path');

  if (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }

  console.log(`Total rows: ${data?.length ?? 0}\n`);
  for (const r of data ?? []) {
    console.log(`${r.path}\t[slug=${r.slug}] [parent_slug=${r.parent_slug}] ${r.title ?? ''}`);
  }
})();
