/**
 * Read every image in C:\\Users\\hallb\\Desktop\\Img ai\\, re-encode to
 * WebP (quality 80, max width 800px) via Sharp, and upload to the
 * Supabase Storage bucket "featured-images" under kategorier/.
 *
 *   npx tsx scripts/upload-kategori-images.ts
 *
 * The script logs each filename → public URL so the homepage's
 * ExploreCategoriesSection can be wired to the right URL by hand.
 * Idempotent — upsert: true rewrites the same key on re-runs.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const PREFIX = 'kategorier';
const SRC = 'C:/Users/hallb/Desktop/Img ai';
const MAX_WIDTH = 800;
const QUALITY = 80;

function isImage(name: string): boolean {
  return /\.(png|jpe?g|webp|gif|bmp)$/i.test(name);
}

async function main() {
  if (!statSync(SRC, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(`Source folder not found: ${SRC}`);
    process.exit(1);
  }
  const files = readdirSync(SRC).filter(isImage).sort();
  console.log(`Processing ${files.length} images from ${SRC}…\n`);

  const results: { src: string; key: string; url: string; bytes: { in: number; out: number } }[] = [];

  for (let i = 0; i < files.length; i++) {
    const name = files[i];
    const path = join(SRC, name);
    const tag = `[${i + 1}/${files.length}]`;
    try {
      const orig = readFileSync(path);
      const webp = await sharp(orig)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      // Replace extension with .webp and strip directories.
      const newName = basename(name, extname(name)) + '.webp';
      const storageKey = `${PREFIX}/${newName}`;
      const { error } = await db.storage.from(BUCKET).upload(storageKey, webp, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (error) throw new Error(error.message);
      const { data: pub } = db.storage.from(BUCKET).getPublicUrl(storageKey);

      results.push({
        src: name,
        key: storageKey,
        url: pub.publicUrl,
        bytes: { in: orig.length, out: webp.length },
      });
      console.log(
        `  ${tag} OK ${name.padEnd(40)} ${(orig.length / 1024).toFixed(0)}→${(webp.length / 1024).toFixed(0)}KB`
      );
    } catch (e) {
      console.error(`  ${tag} FAILED ${name}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log('\n--- Filename → Public URL ---\n');
  for (const r of results) {
    console.log(`  ${r.src.padEnd(40)} → ${r.url}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
