import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

(async () => {
  for (const parent of ['ai-verktyg', 'foretag', 'yrke', 'marknadsforing', 'ekonomi-redovisning']) {
    const { data } = await db.from('articles').select('slug,title,path,parent_slug').eq('parent_slug', parent).order('title');
    console.log(`\n=== parent_slug='${parent}' (${data?.length ?? 0}) ===`);
    (data ?? []).forEach((r: any) => console.log(`  ${r.path}  —  ${r.title}`));
  }
})();
