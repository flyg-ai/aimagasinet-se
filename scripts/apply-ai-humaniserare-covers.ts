/**
 * Laddar upp de 9 GPT-genererade omslagsbilderna för AI-humaniserare-hubben
 * (hub + 8 recensioner). Samma mönster som apply-news-nov9-covers.ts.
 *
 * Mappning bekräftad genom att faktiskt titta på varje bild (inte bara
 * filordning) mot de 9 prompterna som skickades: 1=hub, 2=undetectable-ai,
 * 3=stealthgpt, 4=bypassgpt, 5=writehuman, 6=phrasly, 7=walter-writes-ai,
 * 8=hix-bypass, 9=humbot.
 *
 *   npx tsx scripts/apply-ai-humaniserare-covers.ts
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
const DL = 'C:/Users/hallb/Downloads';

const JOBS: { file: string; slug: string }[] = [
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_28_55 PM-1.png`, slug: 'ai-humaniserare' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_01 PM-2.png`, slug: 'undetectable-ai' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_03 PM-3.png`, slug: 'stealthgpt' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_05 PM-4.png`, slug: 'bypassgpt' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_06 PM-5.png`, slug: 'writehuman' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_07 PM-6.png`, slug: 'phrasly' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_09 PM-7.png`, slug: 'walter-writes-ai' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_10 PM-8.png`, slug: 'hix-bypass' },
  { file: `${DL}/ChatGPT Image Nov 10, 2026, 03_29_12 PM-9.png`, slug: 'humbot' },
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
