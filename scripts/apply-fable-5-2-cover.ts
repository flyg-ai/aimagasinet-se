/**
 * Laddar upp den GPT-genererade omslagsbilden för Fable 5.2-nyheten.
 * Samma mönster som apply-news-nov9-covers.ts.
 *
 *   npx tsx scripts/apply-fable-5-2-cover.ts
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
const SLUG = 'claude-fable-5-2-vs-opus-5-5';
const FILE = 'C:/Users/hallb/AppData/Local/Temp/claude/497fc275126f2841/482e8db7-f991-461c-9012-16b0e386ae54/images/12.webp';

async function main() {
  const src = readFileSync(FILE);
  const webp = await sharp(src).resize(1200, 675, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
  const storageKey = `2026/11/${SLUG}.webp`;

  const { error: upErr } = await db.storage.from(BUCKET).upload(storageKey, webp, {
    contentType: 'image/webp', upsert: true, cacheControl: '31536000',
  });
  if (upErr) { console.error(`✗ upload failed — ${upErr.message}`); process.exit(1); }

  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(storageKey);
  const { error: updErr } = await db.from('articles')
    .update({ featured_image: pub.publicUrl, og_image: pub.publicUrl })
    .eq('slug', SLUG);
  if (updErr) { console.error(`✗ DB update failed — ${updErr.message}`); process.exit(1); }

  console.log(`✓ ${SLUG} → ${pub.publicUrl}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
