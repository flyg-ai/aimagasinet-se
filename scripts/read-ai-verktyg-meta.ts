// Read-only: dump current SEO metadata for the /ai-verktyg master hub row.
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const len = (s: string | null | undefined) => (s == null ? 0 : Array.from(s).length);

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  const { data, error } = await db
    .from('articles')
    .select('id,path,slug,title,seo_title,seo_description,excerpt')
    .eq('path', '/ai-verktyg')
    .maybeSingle();

  if (error) throw error;
  if (!data) { console.log('NO ROW for /ai-verktyg'); return; }

  const suffix = ' | AI-Magasinet';
  const seoTitle: string | null = data.seo_title ?? null;
  const rendered = (seoTitle ?? data.title) + suffix;

  console.log(JSON.stringify({
    id: data.id,
    path: data.path,
    slug: data.slug,
    title_H1: data.title,
    title_H1_len: len(data.title),
    seo_title: seoTitle,
    seo_title_len: len(seoTitle),
    rendered_title_with_suffix: rendered,
    rendered_title_len: len(rendered),
    seo_description: data.seo_description,
    seo_description_len: len(data.seo_description),
    excerpt: data.excerpt,
    excerpt_len: len(data.excerpt),
  }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
