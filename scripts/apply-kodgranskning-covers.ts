/**
 * Resizar, laddar upp och kopplar omslagsbilder för de 7 kodgranskningssidorna.
 *
 *   npx tsx scripts/apply-kodgranskning-covers.ts
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
  { slug: 'basta-ai-for-kodgranskning-2026', file: 'ChatGPT Image Nov 12, 2026, 02_12_00 PM-.png' },
  { slug: 'coderabbit', file: 'ChatGPT Image Nov 12, 2026, 02_12_27 PM-2.png' },
  { slug: 'qodo', file: 'ChatGPT Image Nov 12, 2026, 02_12_32 PM-3.png' },
  { slug: 'greptile', file: 'ChatGPT Image Nov 12, 2026, 02_12_35 PM-4.png' },
  { slug: 'graphite', file: 'ChatGPT Image Nov 12, 2026, 02_12_38 PM-5.png' },
  { slug: 'github-copilot-code-review', file: 'ChatGPT Image Nov 12, 2026, 02_12_41 PM-6.png' },
  { slug: 'korbit-ai', file: 'ChatGPT Image Nov 12, 2026, 02_12_45 PM-7.png' },
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
