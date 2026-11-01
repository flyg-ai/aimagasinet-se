/**
 * Ladda upp tre GPT-genererade omslagsbilder (användaren skapade dem från de
 * bildprompter som gavs) och sätt dem som featured_image/og_image, istället
 * för de genererade gradient-platshållarna.
 *
 *   npx tsx scripts/apply-manual-covers.ts
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

const JOBS: { file: string; slug: string; storageKey: string; setOgImage: boolean }[] = [
  {
    file: 'C:/Users/hallb/Downloads/binance-hack.png',
    slug: 'binance-hack-6-3-miljarder-nordkorea',
    storageKey: '2026/11/binance-hack-6-3-miljarder-nordkorea.webp',
    setOgImage: true,
  },
  {
    file: 'C:/Users/hallb/Downloads/mistral-cybersakerhetsmodell.png',
    slug: 'mistral-large-4-cybersakerhet',
    storageKey: '2026/11/mistral-large-4-cybersakerhet.webp',
    setOgImage: true,
  },
  {
    file: 'C:/Users/hallb/Downloads/ai-sakerhet-hubb.png',
    slug: 'ai-sakerhet',
    storageKey: '2026/11/ai-sakerhet-hubb.webp',
    setOgImage: false,
  },
];

async function main() {
  for (const job of JOBS) {
    const png = readFileSync(job.file);
    const webp = await sharp(png).webp({ quality: 90 }).toBuffer();

    const { error: upErr } = await db.storage.from(BUCKET).upload(job.storageKey, webp, {
      contentType: 'image/webp', upsert: true, cacheControl: '31536000',
    });
    if (upErr) { console.error(`✗ ${job.slug}: upload failed — ${upErr.message}`); continue; }

    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(job.storageKey);
    const update: Record<string, string> = { featured_image: pub.publicUrl };
    if (job.setOgImage) update.og_image = pub.publicUrl;

    const { error: updErr } = await db.from('articles').update(update).eq('slug', job.slug);
    if (updErr) { console.error(`✗ ${job.slug}: DB update failed — ${updErr.message}`); continue; }

    console.log(`✓ ${job.slug} → ${pub.publicUrl}`);
  }
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
