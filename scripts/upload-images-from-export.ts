/**
 * Bulk-upload the WP-export media folder to Supabase Storage and rewrite
 * articles.featured_image to point at the new public URLs.
 *
 * Run AFTER null-broken-featured-images.ts (which already nulled the dead
 * Loopia refs). Idempotent: re-running re-uploads (upsert) and re-applies
 * the same URLs.
 *
 *   npx tsx scripts/upload-images-from-export.ts
 *
 * Source of truth:
 *   ../export/media/<year>/<month>/<filename>     ← local files (119)
 *   ../export/media.json                          ← media id → source_url
 *   ../export/posts.json   + ../export/pages.json ← article → featured_media
 *
 * Two-pass restore:
 *   1. From WP exports — every post/page with featured_media != 0 maps to
 *      a media item, whose source_url tells us which local file to upload
 *      and which DB row (by slug) to update.
 *   2. From hub content_mdx — the ai-text-verktyg hub embeds tool logos in
 *      <div class="ai-tool-box"> blocks. We port populate-logos.ts here so
 *      the 6 text-tool reviews get their logos back too.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

loadEnv({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const EXPORT_DIR = join(process.cwd(), '..', 'export');
const MEDIA_DIR = join(EXPORT_DIR, 'media');
const WP_URL_PREFIX = 'https://aimagasinet.se/wp-content/uploads/';

type WPMedia = { id: number; source_url: string };
type WPPost = { id: number; slug: string; featured_media: number; content?: { rendered: string } };

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function contentTypeFor(key: string): string {
  const ext = key.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png':  return 'image/png';
    case 'webp': return 'image/webp';
    case 'gif':  return 'image/gif';
    case 'svg':  return 'image/svg+xml';
    default:     return 'application/octet-stream';
  }
}

async function ensureBucket() {
  const { data: existing } = await db.storage.getBucket(BUCKET);
  if (existing) return;
  const { error } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 1024 * 1024 * 25,
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`createBucket: ${error.message}`);
  }
}

/** "C:/…/export/media/2025/11/foo.png" → "2025/11/foo.png" (POSIX slashes). */
function storageKey(filepath: string): string {
  return relative(MEDIA_DIR, filepath).split(sep).join('/');
}

/** Map https://aimagasinet.se/wp-content/uploads/2025/11/foo.png → "2025/11/foo.png" */
function keyFromWpUrl(url: string): string | null {
  if (!url.startsWith(WP_URL_PREFIX)) return null;
  return url.slice(WP_URL_PREFIX.length).split('?')[0];
}

async function uploadAll(): Promise<Map<string, string>> {
  console.log(`Walking ${MEDIA_DIR}…`);
  const files = walk(MEDIA_DIR);
  console.log(`Found ${files.length} files. Uploading to bucket "${BUCKET}"…\n`);

  const keyToPublicUrl = new Map<string, string>();
  let ok = 0, failed = 0;

  for (let i = 0; i < files.length; i++) {
    const filepath = files[i];
    const key = storageKey(filepath);
    const bytes = readFileSync(filepath);
    const tag = `[${i + 1}/${files.length}]`;
    try {
      const { error } = await db.storage.from(BUCKET).upload(key, bytes, {
        contentType: contentTypeFor(key),
        upsert: true,
        cacheControl: '31536000',
      });
      if (error) throw new Error(error.message);
      const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
      keyToPublicUrl.set(key, pub.publicUrl);
      ok++;
      if ((i + 1) % 20 === 0 || i + 1 === files.length) {
        console.log(`  ${tag} ${bytes.length} bytes  ${key}`);
      }
    } catch (e) {
      console.error(`  ${tag} FAILED ${key}: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
  }
  console.log(`\nUpload: ${ok} ok, ${failed} failed.\n`);
  return keyToPublicUrl;
}

async function restoreFromWpExports(keyToPublicUrl: Map<string, string>) {
  const media = JSON.parse(readFileSync(join(EXPORT_DIR, 'media.json'), 'utf8')) as WPMedia[];
  const posts = JSON.parse(readFileSync(join(EXPORT_DIR, 'posts.json'), 'utf8')) as WPPost[];
  const pages = JSON.parse(readFileSync(join(EXPORT_DIR, 'pages.json'), 'utf8')) as WPPost[];
  const mediaById = new Map(media.map((m) => [m.id, m.source_url]));

  const items = [...posts, ...pages].filter((p) => p.featured_media);
  console.log(`Restoring featured_image from WP exports for ${items.length} articles…`);

  let updated = 0, skipped = 0, missing = 0;
  for (const p of items) {
    const wpUrl = mediaById.get(p.featured_media);
    if (!wpUrl) { skipped++; continue; }
    const key = keyFromWpUrl(wpUrl);
    if (!key) { skipped++; continue; }
    const supaUrl = keyToPublicUrl.get(key);
    if (!supaUrl) { missing++; console.log(`  · ${p.slug}: no upload for ${key}`); continue; }
    const { data, error } = await db
      .from('articles')
      .update({ featured_image: supaUrl })
      .eq('slug', p.slug)
      .select('slug');
    if (error) { console.error(`  ✗ ${p.slug}: ${error.message}`); continue; }
    if (!data || data.length === 0) { skipped++; continue; }
    updated++;
  }
  console.log(`From WP exports: ${updated} updated, ${skipped} skipped, ${missing} missing local file.\n`);
  return updated;
}

const SLUG_MATCHERS: Array<[RegExp, string]> = [
  [/claude/i,        'claude'],
  [/chatgpt/i,       'chatgpt'],
  [/gemini/i,        'gemini'],
  [/jasper/i,        'jasper-ai'],
  [/writesonic/i,    'writesonic'],
  [/copy[.\s-]?ai/i, 'copy-ai'],
];

async function restoreToolLogosFromHub(keyToPublicUrl: Map<string, string>) {
  // The ai-text-verktyg hub embeds tool logos in <div class="ai-tool-box">
  // blocks split by "<!-- N. -->" comments. Port of populate-logos.ts.
  const { data: hub } = await db
    .from('articles')
    .select('content_mdx')
    .eq('slug', 'ai-text-verktyg')
    .maybeSingle();
  if (!hub?.content_mdx) {
    console.log('No ai-text-verktyg content_mdx to scan for tool logos. Skipping pass 2.\n');
    return 0;
  }

  const blocks = hub.content_mdx.split(/<!--\s*\d+\.[^>]*-->/i).slice(1);
  let updated = 0;
  for (const block of blocks) {
    const img = block.match(/<img[^>]+src="([^"]+)"/i);
    const h2  = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!img || !h2) continue;
    const heading = h2[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const slug = SLUG_MATCHERS.find(([re]) => re.test(heading))?.[1];
    if (!slug) continue;
    const key = keyFromWpUrl(img[1]);
    if (!key) continue;
    const supaUrl = keyToPublicUrl.get(key);
    if (!supaUrl) { console.log(`  · ${slug}: no upload for ${key}`); continue; }
    const { error } = await db
      .from('articles')
      .update({ featured_image: supaUrl })
      .eq('slug', slug);
    if (error) { console.error(`  ✗ ${slug}: ${error.message}`); continue; }
    console.log(`  ✓ ${slug.padEnd(12)} ← ${key}`);
    updated++;
  }
  console.log(`From ai-text-verktyg hub: ${updated} tool logos restored.\n`);
  return updated;
}

/** Hardcoded slug → filename map for tool-review pages whose logos were
 *  originally set by populate-logos.ts (parsing the WP hub's content_mdx).
 *  That path no longer works because the hub content was regenerated via
 *  Claude API and lost the original ai-tool-box markup. */
const TOOL_LOGO_MAP: Record<string, string> = {
  claude:         '2025/11/claude-ai.png',
  chatgpt:        '2025/11/ChatGPT-Logo.svg_.png',
  gemini:         '2025/11/Gemini_AI_Text-Verktyg.png',
  'jasper-ai':    '2025/11/jasper-ai-logo.jpg',
  writesonic:     '2025/11/writesonic.jpg',
  'copy-ai':      '2025/11/copy-ai-logo.jpg',
  'sora-2':       '2025/12/sora-logo.png',
  'kling-ai':     '2026/03/kling-AI.png',
  'runway-gen-3': '2025/12/Runway-gen3-recension-logo.png',
  'pika-labs':    '2025/12/pika-labs-logo.jpeg',
};

async function restoreToolLogosFromMap(keyToPublicUrl: Map<string, string>) {
  let updated = 0, missing = 0;
  for (const [slug, key] of Object.entries(TOOL_LOGO_MAP)) {
    const supaUrl = keyToPublicUrl.get(key);
    if (!supaUrl) { console.log(`  · ${slug}: no upload for ${key}`); missing++; continue; }
    const { data, error } = await db
      .from('articles')
      .update({ featured_image: supaUrl })
      .eq('slug', slug)
      .select('slug');
    if (error) { console.error(`  ✗ ${slug}: ${error.message}`); continue; }
    if (!data || data.length === 0) { console.log(`  · ${slug}: no DB row`); continue; }
    console.log(`  ✓ ${slug.padEnd(14)} ← ${key}`);
    updated++;
  }
  console.log(`From hardcoded tool-logo map: ${updated} updated, ${missing} missing local file.\n`);
  return updated;
}

async function main() {
  await ensureBucket();
  const keyToPublicUrl = await uploadAll();
  const a = await restoreFromWpExports(keyToPublicUrl);
  const b = await restoreToolLogosFromHub(keyToPublicUrl);
  const c = await restoreToolLogosFromMap(keyToPublicUrl);
  console.log(`Total featured_image rows touched: ${a + b + c}.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
