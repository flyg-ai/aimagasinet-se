/**
 * Lägger till 3 nya recensioner under HR-hubben (15Five, Rippling, Culture
 * Amp) så topplistan går från 2 till 5 verktyg — användaren efterfrågade
 * minst 5. Priser/fakta verifierade mot leverantörernas egna sidor
 * (15five.com/pricing, rippling.com/pricing, cultureamp.com/pricing) samt
 * Wikipedia för grundningsår/HQ, november 2026.
 *
 *   npx tsx scripts/seed-hr-new-tools.ts
 *
 * Skriver 3 nya rader, published_at=null, featured_image=null (väntar på
 * bild + granskning innan publicering, samma som övriga drafts denna vecka).
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { HR_TOOLS } from '../lib/yrke-tools-hr';
import { toContentMdx } from '../lib/yrke-tools';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const NEW_SLUGS = ['15five', 'rippling', 'culture-amp'];

async function main() {
  const tools = HR_TOOLS.filter((t) => NEW_SLUGS.includes(t.slug));
  if (tools.length !== NEW_SLUGS.length) {
    console.error('Hittade inte alla nya verktyg i HR_TOOLS:', tools.map((t) => t.slug));
    process.exit(1);
  }

  const rows = tools.map((t) => ({
    slug: t.slug,
    title: t.title,
    excerpt: t.oneliner,
    content_mdx: toContentMdx(t),
    category: null, tags: [] as string[], featured_image: null, type: 'page',
    path: `/ai-verktyg/${t.slug}`, parent_slug: 'hr', affiliate_url: null,
    published_at: null, seo_title: null, seo_description: t.oneliner,
  }));

  const { error } = await db.from('articles').upsert(rows, { onConflict: 'path' });
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }

  console.log(`Upserted ${rows.length} recensioner: ${rows.map((r) => r.slug).join(', ')}. published_at=null.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
