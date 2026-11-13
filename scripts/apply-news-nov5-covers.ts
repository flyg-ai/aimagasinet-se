/**
 * Ladda upp de två GPT-genererade omslagsbilderna för nyhetsartiklarna från
 * 5 november 2026, och ersätt gradient-platshållarna. Lagringsnyckeln namnges
 * efter artikelns slug (inte generiskt filnamn) — håll den konventionen för
 * framtida bilduppladdningar också.
 *
 *   npx tsx scripts/apply-news-nov5-covers.ts
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
  {
    file: 'C:/Users/hallb/Desktop/Neon-robot hand klickar på AI-gränssnitt-3 (1).png',
    slug: 'gemini-computer-use-generellt-tillgangligt',
  },
  {
    file: 'C:/Users/hallb/Desktop/Neonartad börsuppgång i lila-2 (1).png',
    slug: 'anthropic-ipo-vad-kostar-ai-racet',
  },
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
