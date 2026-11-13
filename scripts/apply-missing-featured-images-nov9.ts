/**
 * Laddar upp 8 GPT-genererade featured images (9 november 2026) för sidor
 * som saknade bild: designer-artikeln, HR-hubben + Lattice/Deel, lärare-
 * hubben + MagicSchool AI/Brisk Teaching/Curipod. Lagringsnyckel efter
 * artikelns slug, samma konvention som apply-news-nov5-covers.ts.
 *
 *   npx tsx scripts/apply-missing-featured-images-nov9.ts
 */
import { config as loadEnv } from 'dotenv';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const BUCKET = 'featured-images';

const JOBS: { file: string; slug: string }[] = [
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_00-1.png', slug: 'basta-ai-verktyg-for-designers-2026' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_00-2.png', slug: 'hr' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_01-3.png', slug: 'lattice' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_02-4.png', slug: 'deel' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_03-5.png', slug: 'larare' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_04-6.png', slug: 'magicschool-ai' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_05-7.png', slug: 'brisk-teaching' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 9 nov. 2026 09_59_06-8.png', slug: 'curipod' },
];

async function main() {
  for (const job of JOBS) {
    const png = readFileSync(job.file);
    const webp = await sharp(png).resize(1200, 675, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
    const storageKey = `2026/11/${job.slug}.webp`;

    const { error: upErr } = await db.storage.from(BUCKET).upload(storageKey, webp, {
      contentType: 'image/webp', upsert: true, cacheControl: '31536000',
    });
    if (upErr) { console.error(`✗ ${job.slug}: upload failed — ${upErr.message}`); continue; }

    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(storageKey);
    const { error: updErr } = await db.from('articles')
      .update({ featured_image: pub.publicUrl, og_image: pub.publicUrl })
      .eq('slug', job.slug);
    if (updErr) { console.error(`✗ ${job.slug}: DB update failed — ${updErr.message}`); continue; }

    console.log(`✓ ${job.slug} → ${pub.publicUrl}`);
  }
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
