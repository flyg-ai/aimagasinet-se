/**
 * Manually publish a new article to the articles table.
 *
 * Reusable CLI for one-off publishing. Used by humans or by future
 * generation scripts that delegate the upload/insert step here.
 *
 *   npx tsx scripts/publish-article.ts \
 *     --topic="Bästa AI-prompter för ChatGPT 2026" \
 *     --slug=basta-ai-prompter-chatgpt-2026 \
 *     --category=ai-nyheter \
 *     --content=./tmp/prompts.html \
 *     --image=./tmp/cover.png
 *
 * Flags:
 *   --topic     Required.  Used as article title.
 *   --slug      Required.  Becomes the URL path: /<slug>.
 *   --category  Required.  Must match a categories.slug row.
 *   --content   Required.  Path to HTML file (becomes content_mdx).
 *   --image     Optional.  Local image path → uploaded to Supabase
 *               Storage bucket "featured-images" under year/month/.
 *               If omitted, featured_image is left null.
 *   --excerpt   Optional.  Otherwise derived from first <p> of content.
 *   --tags      Optional.  Comma-separated.
 *   --seo-title Optional.  Defaults to topic + " | AI-Magasinet".
 *   --seo-desc  Optional.  Defaults to excerpt.
 *
 * The script is idempotent — re-running with the same slug upserts
 * (onConflict=path), letting you regenerate content_mdx without
 * polluting the table.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }

const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = 'featured-images';

function arg(name: string): string | undefined {
  const flag = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(flag));
  if (hit) return hit.slice(flag.length);
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1] && !process.argv[idx + 1].startsWith('--')) {
    return process.argv[idx + 1];
  }
  return undefined;
}

function contentTypeFor(filename: string): string {
  switch (extname(filename).toLowerCase()) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png':  return 'image/png';
    case '.webp': return 'image/webp';
    case '.gif':  return 'image/gif';
    case '.svg':  return 'image/svg+xml';
    default:      return 'application/octet-stream';
  }
}

function firstParagraph(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 220);
}

async function uploadImage(localPath: string): Promise<string> {
  const bytes = readFileSync(localPath);
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${basename(localPath)}`;
  const { error } = await db.storage
    .from(BUCKET)
    .upload(key, bytes, {
      contentType: contentTypeFor(localPath),
      upsert: true,
      cacheControl: '31536000',
    });
  if (error) throw new Error(`upload failed: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  return pub.publicUrl;
}

async function main() {
  const topic    = arg('topic');
  const slug     = arg('slug');
  const category = arg('category');
  const content  = arg('content');
  const image    = arg('image');
  const excerpt  = arg('excerpt');
  const tagsArg  = arg('tags');
  const seoTitle = arg('seo-title');
  const seoDesc  = arg('seo-desc');

  if (!topic || !slug || !category || !content) {
    console.error('Usage: --topic=... --slug=... --category=... --content=path/to.html [--image=path] [--excerpt=...] [--tags=a,b] [--seo-title=...] [--seo-desc=...]');
    process.exit(1);
  }

  if (!statSync(content, { throwIfNoEntry: false })) {
    console.error(`Content file not found: ${content}`);
    process.exit(1);
  }
  const html = readFileSync(content, 'utf8').trim();
  const computedExcerpt = excerpt ?? firstParagraph(html);

  let featuredImage: string | null = null;
  if (image) {
    if (!statSync(image, { throwIfNoEntry: false })) {
      console.error(`Image file not found: ${image}`);
      process.exit(1);
    }
    console.log(`Uploading ${image} to Supabase Storage…`);
    featuredImage = await uploadImage(image);
    console.log(`  → ${featuredImage}`);
  }

  const row = {
    slug,
    title: topic,
    excerpt: computedExcerpt,
    content_mdx: html,
    category,
    tags: tagsArg ? tagsArg.split(',').map((t) => t.trim()).filter(Boolean) : [],
    featured_image: featuredImage,
    type: 'post' as const,
    path: `/${slug}`,
    parent_slug: null,
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: seoTitle ?? `${topic} | AI-Magasinet`,
    seo_description: seoDesc ?? computedExcerpt,
  };

  console.log(`Upserting article ${row.path} (category=${category})…`);
  const { data, error } = await db
    .from('articles')
    .upsert(row, { onConflict: 'path' })
    .select('id,slug,path,published_at');
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }

  console.log(`OK → ${data?.[0]?.path} (id=${data?.[0]?.id}, published_at=${data?.[0]?.published_at})`);
}

main().catch((e) => { console.error(e); process.exit(1); });
