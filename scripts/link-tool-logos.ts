/**
 * Link existing Supabase Storage logos to articles.featured_image so the
 * jämför-väljaren (ComparisonWizard) shows tool images instead of the
 * color-block fallback.
 *
 *   npx tsx scripts/link-tool-logos.ts          # apply
 *   DRY=1 npx tsx scripts/link-tool-logos.ts     # preview only
 *
 * Background: the wizard reads featured_image from the DB (see
 * app/ai-verktyg/jamfor/page.tsx → fetchImages). Several COMPARE_TOOLS had
 * NULL featured_image even though a logo already existed in the
 * featured-images bucket (under 2025/.. and 2026/.. — there is no logos/
 * folder). This maps each such tool's slug to its existing logo file.
 *
 * Only tools whose logo file actually exists in Storage are listed here.
 * COMPARE_TOOLS without a logo file (adobe-firefly, windsurf, tabnine,
 * codeium, make, zapier-ai, n8n) keep the gradient fallback until a logo is
 * uploaded.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const BUCKET = 'featured-images';
const DRY = !!process.env.DRY;

/** slug → storage path (within the featured-images bucket). */
const LOGOS: Record<string, string> = {
  midjourney: '2025/12/Midjourney-AI-logo.png',
  'dalle-3': '2025/12/dall-e-3-AI-bilder.png',
  'cursor-ai': '2025/12/cursor-AI-logo.png',
  'github-copilot': '2025/12/github-copilot-logo.png',
  'suno-ai': '2025/12/suno-logo.png',
  udio: '2025/11/Udio_AI_Logo.png',
  elevenlabs: '2025/12/elevenlabs.png',
};

async function urlOk(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok && (r.headers.get('content-type') ?? '').startsWith('image/');
  } catch {
    return false;
  }
}

async function main() {
  let updated = 0;
  for (const [slug, path] of Object.entries(LOGOS)) {
    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(path);
    const url = pub.publicUrl;

    if (!(await urlOk(url))) {
      console.error(`✗ ${slug}: storage-URL svarar inte med bild — hoppar över (${url})`);
      continue;
    }

    // Don't clobber an already-set image.
    const { data: rows, error: selErr } = await db
      .from('articles')
      .select('slug,featured_image')
      .eq('slug', slug);
    if (selErr) { console.error(`✗ ${slug}: select error ${selErr.message}`); continue; }
    if (!rows || rows.length === 0) { console.error(`✗ ${slug}: ingen artikel-rad`); continue; }
    if (rows[0].featured_image) { console.log(`• ${slug}: har redan bild — hoppar över`); continue; }

    if (DRY) { console.log(`[DRY] ${slug} → ${url}`); updated++; continue; }

    const { error: updErr } = await db.from('articles').update({ featured_image: url }).eq('slug', slug);
    if (updErr) { console.error(`✗ ${slug}: update error ${updErr.message}`); continue; }
    console.log(`✓ ${slug} → ${url}`);
    updated++;
  }
  console.log(`\n${DRY ? '[DRY] skulle uppdatera' : 'Uppdaterade'} ${updated} verktyg.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
