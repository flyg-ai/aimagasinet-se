/**
 * Laddar upp de 28 GPT-genererade featured images (15 november 2026) för sidorna
 * i den sedan tidigare identifierade bildbacklogen (hub/guide-sidor utan
 * featured_image). Bildprompter + motiv finns dokumenterade i Claude-minnet
 * image-prompts-backlog-27-pages.md. Matchning mot slug gjord manuellt genom
 * att granska varje bilds motiv mot den prompt som beställdes för respektive sida.
 *
 * OBS: kör ENDAST uppladdning + DB-update här, ingen /api/revalidate — det görs
 * nästa gång vi kör ut en artikel (enligt användarens instruktion 2026-11-16).
 *
 *   npx tsx scripts/apply-27-pages-backlog-images-nov15.ts
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
const DIR = 'C:/Users/hallb/Downloads';

const JOBS: { file: string; slug: string }[] = [
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_23_48 PM-1.png`, slug: 'utvecklare' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_23_51 PM-2.png`, slug: 'hr-ansvarig' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_23_53 PM-3.png`, slug: 'saljare' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_23_55 PM-4.png`, slug: 'ui-ux' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_23_57 PM-5.png`, slug: 'ai-verktyg-ekonomi-redovisning' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_23_59 PM-6.png`, slug: 'fotograf-video' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_01 PM-7.png`, slug: 'designer' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_03 PM-8.png`, slug: 'ai-verktyg-marknadsforing' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_05 PM-9.png`, slug: 'ai-verktyg-marknadsforing-sociala-medier' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_07 PM-10.png`, slug: 'ai-verktyg-marknadsforing-annonser' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_14 PM-1.png`, slug: 'ai-verktyg-marknadsforing-content-copywriting' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_20 PM-2.png`, slug: 'ai-verktyg-kundservice' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_23 PM-3.png`, slug: 'ai-verktyg-rekrytering' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_25 PM-4.png`, slug: 'ai-kod' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_27 PM-5.png`, slug: 'ai-text' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_29 PM-6.png`, slug: 'gratis-ai-video' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_31 PM-7.png`, slug: 'revid-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_33 PM-8.png`, slug: 'vad-ar-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_35 PM-9.png`, slug: 'hur-fungerar-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_37 PM-10.png`, slug: 'komma-igang-med-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_46 PM-1.png`, slug: 'prompta-battre' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_49 PM-2.png`, slug: 'ai-pa-jobbet' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_51 PM-3.png`, slug: 'framtidens-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_53 PM-4.png`, slug: 'skapa-faceless-content-med-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_55 PM-5.png`, slug: 'bygga-mobilapp-med-ai' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_57 PM-6.png`, slug: 'tiktok' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_24_59 PM-7.png`, slug: 'ai-tar-over-tiktok-flodet' },
  { file: `${DIR}/ChatGPT Image Nov 15, 2026, 10_25_01 PM-8.png`, slug: 'yrke' },
];

async function main() {
  let ok = 0, fail = 0;
  for (const job of JOBS) {
    const png = readFileSync(job.file);
    const webp = await sharp(png).resize(1200, 675, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
    const storageKey = `2026/11/${job.slug}-featured.webp`;

    const { error: upErr } = await db.storage.from(BUCKET).upload(storageKey, webp, {
      contentType: 'image/webp', upsert: true, cacheControl: '31536000',
    });
    if (upErr) { console.error(`✗ ${job.slug}: upload failed — ${upErr.message}`); fail++; continue; }

    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(storageKey);
    const { data: updated, error: updErr } = await db.from('articles')
      .update({ featured_image: pub.publicUrl, og_image: pub.publicUrl })
      .eq('slug', job.slug)
      .select('id');
    if (updErr) { console.error(`✗ ${job.slug}: DB update failed — ${updErr.message}`); fail++; continue; }
    if (!updated || updated.length === 0) { console.error(`✗ ${job.slug}: no article row matched this slug`); fail++; continue; }

    console.log(`✓ ${job.slug} → ${pub.publicUrl}`);
    ok++;
  }
  console.log(`\nKlart: ${ok} uppdaterade, ${fail} misslyckades. Ingen revalidate körd — görs vid nästa artikel-publicering.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
