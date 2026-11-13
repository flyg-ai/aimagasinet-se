/**
 * Laddar upp 6 GPT-genererade kategori-bilder (saknade kort på /ai-verktyg +
 * startsidan: marknadsföring, kundservice, rekrytering, UI/UX, TikTok, samt
 * AI-trading) till Storage-mappen "kategorier", döpta efter kategorins slug
 * (samma konvention som övriga *-kategori.webp-filer), och skriver in
 * respektive publika URL i koden nedan att klistra in manuellt i
 * ExploreCategoriesSection.tsx + MasterHubTemplate.tsx.
 *
 *   npx tsx scripts/apply-missing-category-images.ts
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

const JOBS: { file: string; name: string }[] = [
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 5 nov. 2026 15_40_51-1.png', name: 'ai-marknadsforing-kategori' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 5 nov. 2026 15_40_51-2.png', name: 'ai-kundservice-kategori' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 5 nov. 2026 15_40_52-3.png', name: 'ai-rekrytering-kategori' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 5 nov. 2026 15_40_52-4.png', name: 'ai-ui-ux-kategori' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 5 nov. 2026 15_40_53-5.png', name: 'ai-tiktok-kategori' },
  { file: 'C:/Users/hallb/Downloads/ChatGPT-bild 5 nov. 2026 15_40_54-6.png', name: 'ai-trading-kategori' },
];

async function main() {
  for (const job of JOBS) {
    const png = readFileSync(job.file);
    const webp = await sharp(png).resize(1200, 900, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
    const storageKey = `kategorier/${job.name}.webp`;

    const { error: upErr } = await db.storage.from(BUCKET).upload(storageKey, webp, {
      contentType: 'image/webp', upsert: true, cacheControl: '31536000',
    });
    if (upErr) { console.error(`✗ ${job.name}: upload failed — ${upErr.message}`); continue; }

    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(storageKey);
    console.log(`✓ ${job.name} → ${pub.publicUrl}`);
  }
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
