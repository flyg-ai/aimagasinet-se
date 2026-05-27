/**
 * Manually publish a new article — or attach cover art to an existing one.
 *
 * Two modes:
 *
 *   1. FULL PUBLISH — provide --topic, --slug, --category, --content (HTML
 *      file) and optionally --image. The row is upserted on path.
 *
 *      npx tsx scripts/publish-article.ts \
 *        --topic="Bästa AI-prompter för ChatGPT 2026" \
 *        --slug=basta-ai-prompter-chatgpt-2026 \
 *        --category=ai-nyheter \
 *        --content=./tmp/prompts.html \
 *        --image=./tmp/cover.png
 *
 *   2. IMAGE-ONLY PATCH — provide --slug and --image only. The image is
 *      uploaded to Supabase Storage and featured_image on the existing row
 *      is patched in place. Body and metadata are left untouched.
 *
 *      npx tsx scripts/publish-article.ts \
 *        --slug=basta-ai-prompter-chatgpt-2026 \
 *        --image=./tmp/cover.png
 *
 * Flags:
 *   --topic     Required for full publish. Used as article title.
 *   --slug      Always required. URL path: /<slug>.
 *   --category  Required for full publish. Must match a categories.slug row.
 *   --content   Required for full publish. Path to HTML file → content_mdx.
 *               If omitted, the script does an image-only patch instead.
 *   --image     Optional in full publish, required in image-only mode.
 *               Uploaded to bucket "featured-images" under <year>/<month>/.
 *   --excerpt   Optional. Otherwise derived from first <p> of content.
 *   --tags      Optional. Comma-separated.
 *   --seo-title Optional. Defaults to topic + " | AI-Magasinet".
 *   --seo-desc  Optional. Defaults to excerpt.
 *
 * Idempotent — full publishes upsert on path; image-only patches always
 * overwrite the same storage key under <year>/<month>/<filename>.
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

  if (!slug) {
    console.error('Usage:\n' +
      '  Full publish:   --topic=... --slug=... --category=... --content=path/to.html [--image=path] [...]\n' +
      '  Image-only:     --slug=... --image=path/to.png');
    process.exit(1);
  }

  // ── Image-only / partial update path ────────────────────────────
  // If --content isn't given we only patch the existing row, instead of
  // doing a full upsert. Useful when you just want to add cover art to an
  // already-published article without re-shipping the body.
  if (!content) {
    if (!image) {
      console.error('Provide either --content (full publish) or --image (image-only update).');
      process.exit(1);
    }
    if (!statSync(image, { throwIfNoEntry: false })) {
      console.error(`Image file not found: ${image}`);
      process.exit(1);
    }
    console.log(`Uploading ${image} to Supabase Storage…`);
    const featuredImage = await uploadImage(image);
    console.log(`  → ${featuredImage}`);

    const { data, error } = await db
      .from('articles')
      .update({ featured_image: featuredImage })
      .eq('slug', slug)
      .select('id,slug,path,featured_image');
    if (error) { console.error('update failed:', error.message); process.exit(1); }
    if (!data || data.length === 0) {
      console.error(`No article found with slug=${slug}.`);
      process.exit(1);
    }
    console.log(`OK → ${data[0].path} (id=${data[0].id}) featured_image set.`);
    return;
  }

  // ── Full publish path ───────────────────────────────────────────
  if (!topic || !category) {
    console.error('Full publish requires --topic and --category in addition to --slug and --content.');
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
