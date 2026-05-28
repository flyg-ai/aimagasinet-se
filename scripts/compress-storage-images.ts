/**
 * Compress every image in the Supabase Storage bucket "featured-images"
 * that exceeds a size threshold by re-encoding to WebP at quality 80 and
 * max width 1200px via Sharp. Rewrites articles.featured_image URLs to
 * point at the new .webp keys.
 *
 *   npx tsx scripts/compress-storage-images.ts            # default 300KB threshold
 *   THRESHOLD_KB=500 npx tsx scripts/compress-storage-images.ts
 *
 * Idempotent — already-uploaded .webp counterparts are skipped on re-run.
 * The original (large) file is left in place so a manual rollback is
 * trivial; delete the originals separately when satisfied.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const THRESHOLD = (Number(process.env.THRESHOLD_KB) || 300) * 1024;
const MAX_WIDTH = 1200;
const QUALITY = 80;

const PUBLIC_PREFIX = `${url}/storage/v1/object/public/${BUCKET}/`;

type Entry = { key: string; size: number };

/** Recursively list every object under the bucket, returning relative paths
 *  like "2026/05/foo.png" + size in bytes. */
async function listAll(): Promise<Entry[]> {
  const queue: string[] = [''];
  const out: Entry[] = [];
  while (queue.length) {
    const prefix = queue.shift()!;
    let offset = 0;
    // Supabase storage.list returns max 100 by default; loop until exhausted.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data, error } = await db.storage.from(BUCKET).list(prefix, {
        limit: 100, offset, sortBy: { column: 'name', order: 'asc' },
      });
      if (error) throw new Error(`list ${prefix}: ${error.message}`);
      if (!data || data.length === 0) break;
      for (const e of data) {
        // Folders have null `id` and an empty metadata.
        if (!e.id || !e.metadata) {
          queue.push(prefix ? `${prefix}/${e.name}` : e.name);
        } else {
          const fullKey = prefix ? `${prefix}/${e.name}` : e.name;
          const size = (e.metadata as { size?: number } | null)?.size ?? 0;
          out.push({ key: fullKey, size });
        }
      }
      if (data.length < 100) break;
      offset += 100;
    }
  }
  return out;
}

/** Same path/dir, swap extension to .webp. */
function webpKey(origKey: string): string {
  return origKey.replace(/\.(png|jpe?g|gif|bmp|tiff?)$/i, '.webp');
}

async function downloadBytes(key: string): Promise<Uint8Array> {
  const { data, error } = await db.storage.from(BUCKET).download(key);
  if (error || !data) throw new Error(`download ${key}: ${error?.message ?? 'no data'}`);
  return new Uint8Array(await data.arrayBuffer());
}

async function uploadWebp(key: string, bytes: Uint8Array): Promise<string> {
  const { error } = await db.storage.from(BUCKET).upload(key, bytes, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  return pub.publicUrl;
}

/** Rewrite articles.featured_image rows that pointed at the old URL. */
async function rewriteFeaturedImage(oldUrl: string, newUrl: string): Promise<number> {
  const { data, error } = await db
    .from('articles')
    .update({ featured_image: newUrl })
    .eq('featured_image', oldUrl)
    .select('id');
  if (error) throw new Error(`update featured_image: ${error.message}`);
  return data?.length ?? 0;
}

async function main() {
  console.log(`Listing bucket "${BUCKET}"…`);
  const all = await listAll();
  console.log(`Found ${all.length} objects total.`);

  const targets = all
    .filter((e) => e.size > THRESHOLD)
    .filter((e) => /\.(png|jpe?g|gif|bmp|tiff?)$/i.test(e.key));
  const webpExisting = new Set(all.filter((e) => e.key.endsWith('.webp')).map((e) => e.key));
  console.log(`${targets.length} images > ${(THRESHOLD / 1024).toFixed(0)} KB to compress.\n`);

  let ok = 0, skipped = 0, failed = 0, dbUpdated = 0;
  let totalBefore = 0, totalAfter = 0;

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    const tag = `[${i + 1}/${targets.length}]`;
    const newKey = webpKey(t.key);
    try {
      if (webpExisting.has(newKey)) {
        console.log(`  ${tag} SKIP ${t.key} (${newKey} exists)`);
        skipped++;
        continue;
      }
      const orig = await downloadBytes(t.key);
      const compressed = await sharp(Buffer.from(orig))
        .rotate() // honor EXIF orientation
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      // Bail if WebP isn't actually smaller (mostly safety, ~never triggers).
      if (compressed.length >= orig.length) {
        console.log(`  ${tag} SKIP ${t.key} (webp ${(compressed.length / 1024).toFixed(0)}KB ≥ orig ${(orig.length / 1024).toFixed(0)}KB)`);
        skipped++;
        continue;
      }

      const newUrl = await uploadWebp(newKey, new Uint8Array(compressed));
      const oldUrl = `${PUBLIC_PREFIX}${t.key}`;
      const updated = await rewriteFeaturedImage(oldUrl, newUrl);
      totalBefore += orig.length;
      totalAfter += compressed.length;
      dbUpdated += updated;
      console.log(
        `  ${tag} OK ${t.key.padEnd(60)} ${(orig.length / 1024).toFixed(0)}→${(compressed.length / 1024).toFixed(0)}KB  ` +
        `db_rows=${updated}`
      );
      ok++;
    } catch (e) {
      console.error(`  ${tag} FAILED ${t.key}: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
  }

  const savedKB = (totalBefore - totalAfter) / 1024;
  console.log(
    `\nResult: ${ok} compressed, ${skipped} skipped, ${failed} failed.\n` +
    `Storage saved: ${savedKB.toFixed(0)} KB (${(savedKB / 1024).toFixed(1)} MB).\n` +
    `articles.featured_image rows updated: ${dbUpdated}.`
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
