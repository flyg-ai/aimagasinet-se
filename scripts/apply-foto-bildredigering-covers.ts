/**
 * Resizar, laddar upp och kopplar omslagsbilder för foto/bildredigering-batchen
 * (hub + 10 recensioner).
 *
 *   npx tsx scripts/apply-foto-bildredigering-covers.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const DOWNLOADS = 'C:/Users/hallb/Downloads/';

const MAP: { slug: string; file: string }[] = [
  { slug: 'foto-bildredigering', file: 'aimagasinet1.png' },
  { slug: 'topaz-photo-ai', file: 'aimagasinet2.png' },
  { slug: 'remini', file: 'aimagasinet3.png' },
  { slug: 'lets-enhance', file: 'aimagasinet4.png' },
  { slug: 'vanceai', file: 'aimagasinet5.png' },
  { slug: 'fotor', file: 'aimagasinet6.png' },
  { slug: 'picsart', file: 'aimagasinet7.png' },
  { slug: 'luminar-neo', file: 'aimagasinet8.png' },
  { slug: 'magnific-ai', file: 'aimagasinet9.png' },
  { slug: 'pixlr', file: 'aimagasinet10.png' },
  { slug: 'cutout-pro', file: 'aimagasinet11.png' },
];

async function main() {
  for (const { slug, file } of MAP) {
    const srcPath = DOWNLOADS + file;
    if (!fs.existsSync(srcPath)) {
      console.error(`SAKNAS: ${srcPath}`);
      continue;
    }
    const buf = await sharp(srcPath).resize(1200, 675, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
    const key = `2026/11/${slug}.webp`;
    const { error: upErr } = await db.storage.from('featured-images').upload(key, buf, {
      contentType: 'image/webp',
      upsert: true,
    });
    if (upErr) { console.error(`Upload-fel ${slug}:`, upErr); continue; }

    const { data: pub } = db.storage.from('featured-images').getPublicUrl(key);
    const url = pub.publicUrl;

    const { error: dbErr } = await db
      .from('articles')
      .update({ featured_image: url, og_image: url })
      .eq('slug', slug);
    if (dbErr) { console.error(`DB-fel ${slug}:`, dbErr); continue; }

    console.log(`OK: ${slug} -> ${url}`);
  }
}
main();
