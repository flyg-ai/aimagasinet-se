/**
 * Compress + upload the 8 new category-hub images (hemsidebyggare,
 * presentationer, mötesverktyg, sociala medier, projektledning, e-handel,
 * översättning, dokumenthantering) to Supabase Storage.
 *
 * Source PNGs live in the user's Downloads folder; re-encode to WebP
 * (quality 80, max width 800px) via Sharp and upload to
 * featured-images/kategorier/ (same convention as upload-kategori-images.ts).
 *
 *   npx tsx scripts/upload-kategori-images-2.ts
 *
 * Idempotent — upsert:true rewrites the same key. Logs filename → public URL.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const PREFIX = 'kategorier';
const SRC_DIR = 'C:/Users/hallb/Downloads';
const MAX_WIDTH = 800;
const QUALITY = 80;

// category slug → source PNG filename (in SRC_DIR)
const IMAGES: { category: string; file: string }[] = [
  { category: 'hemsidebyggare',    file: 'ai-hemsidebyggare-kategori.png' },
  { category: 'presentationer',    file: 'ai-presentationer-kategori.png' },
  { category: 'motesverktyg',      file: 'ai-motesverktyg-kategori.png' },
  { category: 'sociala-medier',    file: 'ai-sociala-medier-kategori.png' },
  { category: 'projektledning',    file: 'ai-projektledning-kategori.png' },
  { category: 'e-handel',          file: 'ai-ehandel-kategori.png' },
  { category: 'oversattning',      file: 'ai-oversattning-kategori.png' },
  { category: 'dokumenthantering', file: 'ai-dokumenthantering-kategori.png' },
];

async function main() {
  console.log(`Compressing + uploading ${IMAGES.length} images from ${SRC_DIR}…\n`);
  const out: { category: string; url: string }[] = [];

  for (let i = 0; i < IMAGES.length; i++) {
    const { category, file } = IMAGES[i];
    const tag = `[${i + 1}/${IMAGES.length}]`;
    const src = `${SRC_DIR}/${file}`;
    try {
      if (!statSync(src, { throwIfNoEntry: false })) throw new Error(`source not found: ${src}`);
      const orig = readFileSync(src);
      const webp = await sharp(orig)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      const storageKey = `${PREFIX}/${basename(file, extname(file))}.webp`;
      const { error } = await db.storage.from(BUCKET).upload(storageKey, webp, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (error) throw new Error(error.message);
      const { data: pub } = db.storage.from(BUCKET).getPublicUrl(storageKey);
      out.push({ category, url: pub.publicUrl });
      console.log(`  ${tag} OK ${category.padEnd(18)} ${(orig.length / 1024).toFixed(0)}→${(webp.length / 1024).toFixed(0)}KB  ${storageKey}`);
    } catch (e) {
      console.error(`  ${tag} FAILED ${category}: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log('\n--- category → public URL ---');
  for (const r of out) console.log(`  ${r.category.padEnd(18)} ${r.url}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
