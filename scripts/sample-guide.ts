import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

(async () => {
  const { data } = await db.from('articles').select('content_mdx').eq('path', '/ai-verktyg/ai-text-verktyg').maybeSingle();
  const html = data?.content_mdx ?? '';
  console.log(`length: ${html.length} chars`);
  console.log(`h2 count: ${(html.match(/<h2/g) ?? []).length}`);
  console.log(`h3 count: ${(html.match(/<h3/g) ?? []).length}`);
  console.log(`internal links: ${(html.match(/<a href="\/[^"]+"/g) ?? []).length}`);
  console.log(`words: ${html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length}`);
  console.log('\n--- first 800 chars ---\n');
  console.log(html.slice(0, 800));
})();
