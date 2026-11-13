/**
 * Laddar upp 3 GPT-genererade featured images (9 november 2026, andra
 * omgången) för de nya HR-verktygen: 15Five, Rippling, Culture Amp — som
 * publicerades utan bild på användarens uttryckliga begäran. Samma
 * konvention som apply-missing-featured-images-nov9.ts.
 *
 *   npx tsx scripts/apply-hr-new-tools-images-nov9.ts
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
  { file: 'C:/Users/hallb/Downloads/ChatGPT Image Nov 9, 2026, 11_37_47 AM-1.png', slug: '15five' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT Image Nov 9, 2026, 11_37_55 AM-2.png', slug: 'rippling' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT Image Nov 9, 2026, 11_37_58 AM-3.png', slug: 'culture-amp' },
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
