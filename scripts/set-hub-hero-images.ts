/**
 * Sätt featured_image på kategori-hubbar som har en befintlig kategoribild i
 * featured-images/kategorier/. HubTemplate renderar då bakgrundsbild-heron
 * (se generaliseringen i components/templates/HubTemplate.tsx).
 *
 * Hubbar utan matchande bild lämnas med null → gradient-hero, tills en bild
 * finns (t.ex. marknadsforing, ekonomi, juridik som saknar kategoribild).
 *
 *   npx tsx scripts/set-hub-hero-images.ts
 *
 * Idempotent. Verifierar att bild-URL:en svarar 200 innan den sätts.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const BASE = `${url}/storage/v1/object/public/featured-images/kategorier`;

// hub-path → kategoribild-filnamn (i featured-images/kategorier/)
const MAP: Record<string, string> = {
  '/ai-verktyg/ai-text-verktyg': 'ai-text-kategori.webp',
  '/ai-verktyg/ai-bild-verktyg': 'ai-bild-kategori.webp',
  '/ai-verktyg/ai-ljud-och-musik': 'ai-ljud-musik-kategori.webp',
  '/ai-verktyg/ai-kod-verktyg': 'ai-kod-programmering-kategori.webp',
  '/ai-verktyg/ai-automation': 'ai-automation-kategori.webp',
  '/ai-video': 'ai-video-kategori.webp',
  '/ai-verktyg/gratis': 'gratis-ai-verktyg-kategori.webp',
  '/ai-verktyg/hemsidebyggare': 'ai-hemsidebyggare-kategori.webp',
  '/ai-verktyg/presentationer': 'ai-presentationer-kategori.webp',
  '/ai-verktyg/motesverktyg': 'ai-motesverktyg-kategori.webp',
  '/ai-verktyg/sociala-medier': 'ai-sociala-medier-kategori.webp',
  '/ai-verktyg/projektledning': 'ai-projektledning-kategori.webp',
  '/ai-verktyg/e-handel': 'ai-ehandel-kategori.webp',
  '/ai-verktyg/oversattning': 'ai-oversattning-kategori.webp',
  '/ai-verktyg/dokumenthantering': 'ai-dokumenthantering-kategori.webp',
  // Batch-3-hubbar (uppladdade av scripts/upload-kategori-images-3.ts).
  '/ai-verktyg/ai-assistenter': 'ai-assistenter-kategori.webp',
  '/ai-verktyg/rost-och-tal': 'ai-rost-tal-kategori.webp',
  '/ai-verktyg/podcast-ljudredigering': 'podcast-ljudredigering-kategori.webp',
  '/ai-verktyg/produktivitet': 'ai-produktivitet-kategori.webp',
  '/ai-verktyg/e-postmarknadsforing': 'ai-epostmarknadsforing-kategori.webp',
  '/ai-verktyg/crm': 'ai-crm-kategori.webp',
  '/ai-verktyg/dataanalys': 'ai-dataanalys-kategori.webp',
  '/ai-verktyg/utbildning': 'ai-utbildning-kategori.webp',
};

async function main() {
  let ok = 0, skipped = 0;
  for (const [path, file] of Object.entries(MAP)) {
    const imageUrl = `${BASE}/${file}`;
    // Verifiera att bilden finns.
    const head = await fetch(imageUrl, { method: 'HEAD' }).catch(() => null);
    if (!head || !head.ok) { console.log(`  SKIP ${path} — bild saknas (${head?.status ?? 'err'}) ${file}`); skipped++; continue; }

    const { data, error } = await db.from('articles')
      .update({ featured_image: imageUrl })
      .eq('path', path)
      .select('path');
    if (error) { console.log(`  FAIL ${path}: ${error.message}`); skipped++; continue; }
    if (!data?.length) { console.log(`  SKIP ${path} — hub finns inte i DB`); skipped++; continue; }
    console.log(`  OK   ${path}  → ${file}`);
    ok++;
  }
  console.log(`\n${ok} hubbar fick hero-bild, ${skipped} hoppade.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
