/**
 * Resizar, laddar upp och kopplar omslagsbilder för vibe coding-batchen
 * (hub + 6 nya recensioner) samt de tre tidigare bildlösa/platshållar-hubbarna
 * (juridik, ekonomi, trading). Publicerar vibe coding-batchen med dagens datum.
 *
 *   npx tsx scripts/apply-vibe-coding-and-fix-covers.ts
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

const MAP: { slug: string; file: string; publishNow: boolean }[] = [
  { slug: 'vibe-coding', file: '1.png', publishNow: true },
  { slug: 'lovable', file: '2.png', publishNow: true },
  { slug: 'bolt-new', file: '3.png', publishNow: true },
  { slug: 'base44', file: '4.png', publishNow: true },
  { slug: 'google-antigravity', file: '5.png', publishNow: true },
  { slug: 'v0', file: '6.png', publishNow: true },
  { slug: 'magic-patterns', file: '7.png', publishNow: true },
  { slug: 'ai-verktyg-juridik', file: '8.png', publishNow: false },
  { slug: 'ai-verktyg-ekonomi', file: '9.png', publishNow: false },
  { slug: 'ai-trading', file: '10.png', publishNow: false },
];

async function main() {
  const now = new Date().toISOString();
  for (const { slug, file, publishNow } of MAP) {
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

    const update: Record<string, unknown> = { featured_image: url, og_image: url };
    if (publishNow) update.published_at = now;

    const { error: dbErr } = await db.from('articles').update(update).eq('slug', slug);
    if (dbErr) { console.error(`DB-fel ${slug}:`, dbErr); continue; }

    console.log(`OK: ${slug} -> ${url}${publishNow ? ' (publicerad)' : ''}`);
  }
}
main();
