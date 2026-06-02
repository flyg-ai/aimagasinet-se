/**
 * Reposition the two parent hubs (/ai-verktyg/marknadsforing and
 * /ai-verktyg/ekonomi) as navigation hubs: update their SEO title (and, for
 * marknadsföring, drop the SEO-keyword-stuffed meta description in favour of a
 * broad navigation-oriented one). The subcategory grid + broad topplista are
 * handled in code (HubTemplate / app/[...slug]/page.tsx); this only touches
 * the DB-stored meta. Idempotent.
 *
 *   npx tsx scripts/update-parent-hub-meta.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

type Patch = { path: string; seo_title: string; seo_description?: string };

const PATCHES: Patch[] = [
  {
    path: '/ai-verktyg/marknadsforing',
    seo_title: 'AI för marknadsföring 2026 — Verktyg för SEO, content, annonser & sociala medier',
    // De-SEO'd: navigation-oriented, no keyword stuffing / tool names.
    seo_description:
      'Hitta rätt AI-verktyg för marknadsföring 2026. En överblick med guider till content & copywriting, annonsering och sociala medier — uppdelat i tydliga kategorier.',
  },
  {
    path: '/ai-verktyg/ekonomi',
    seo_title: 'AI för ekonomi 2026 — Verktyg för bokföring & redovisning',
  },
];

async function main() {
  for (const p of PATCHES) {
    const patch: Record<string, string> = { seo_title: p.seo_title };
    if (p.seo_description) patch.seo_description = p.seo_description;
    const { data, error } = await db
      .from('articles')
      .update(patch)
      .eq('path', p.path)
      .select('id,path,seo_title,seo_description');
    if (error) { console.error(`FAILED ${p.path}: ${error.message}`); process.exitCode = 1; continue; }
    if (!data?.length) { console.error(`No row for ${p.path}`); process.exitCode = 1; continue; }
    console.log(`OK ${p.path}`);
    console.log(`   seo_title: ${data[0].seo_title}`);
    console.log(`   seo_desc:  ${data[0].seo_description}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
