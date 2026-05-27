import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });

(async () => {
  const yrkeTopics = [
    { parent: 'seo',                   path: '/ai-verktyg/foretag/yrke/marknadsforing/seo' },
    { parent: 'content-copywriting',   path: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting' },
    { parent: 'annonser',              path: '/ai-verktyg/foretag/yrke/marknadsforing/annonser' },
    { parent: 'sociala-medier',        path: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier' },
    { parent: 'bokforing',             path: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing' },
    { parent: 'redovisning',           path: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning' },
  ];

  for (const { parent, path } of yrkeTopics) {
    const { data: hub } = await db
      .from('articles')
      .select('slug,path')
      .eq('path', path)
      .maybeSingle();
    const { data: children } = await db
      .from('articles')
      .select('slug,parent_slug,path')
      .eq('parent_slug', parent)
      .order('slug');
    console.log(`\n── ${path}`);
    console.log(`   hub slug:      ${hub?.slug ?? '(NOT FOUND)'}`);
    console.log(`   children of '${parent}': ${children?.length ?? 0}`);
    (children ?? []).forEach((c) => console.log(`     - ${c.slug} (parent_slug=${c.parent_slug})  →  ${c.path}`));
  }
})();
