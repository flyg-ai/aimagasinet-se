/**
 * Upsert the 60 yrke-topic review pages (SEO, copy, ads, social,
 * bokföring, redovisning) defined in lib/yrke-tools.ts.
 *
 * Run: npx tsx scripts/seed-yrke-reviews.ts
 *
 * Idempotent — upserts on path. Inserts type=page so classify() routes
 * them to ReviewTemplate (depth 6 under the yrke topic subtrees).
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { YRKE_TOOLS, toContentMdx } from '../lib/yrke-tools';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const PARENT_PATH: Record<string, string> = {
  seo: 'marknadsforing/seo',
  'content-copywriting': 'marknadsforing/content-copywriting',
  annonser: 'marknadsforing/annonser',
  'sociala-medier': 'marknadsforing/sociala-medier',
  bokforing: 'ekonomi-redovisning/bokforing',
  redovisning: 'ekonomi-redovisning/redovisning',
  // Juridik
  avtalsgranskning: 'juridik/avtalsgranskning',
  'due-diligence': 'juridik/due-diligence',
  rattsutredningar: 'juridik/rattsutredningar',
  // Kundservice
  chatbot: 'kundservice/chatbot',
  'epost-svar': 'kundservice/epost-svar',
  'rost-ai': 'kundservice/rost-ai',
  // Rekrytering
  'cv-screening': 'rekrytering/cv-screening',
  jobbannonser: 'rekrytering/jobbannonser',
  kandidatmatchning: 'rekrytering/kandidatmatchning',
  // Designer
  'grafisk-design': 'designer/grafisk-design',
  'ui-ux': 'designer/ui-ux',
  'designer-bildgenerering': 'designer/bildgenerering',
  videoredigering: 'designer/videoredigering',
  // Fotograf-video
  bildredigering: 'fotograf-video/bildredigering',
  videoklippning: 'fotograf-video/videoklippning',
  'foto-bildgenerering': 'fotograf-video/bildgenerering',
  ljudsattning: 'fotograf-video/ljudsattning',
};

async function main() {
  const rows = YRKE_TOOLS.map((t) => ({
    slug: t.slug,
    title: t.title,
    excerpt: t.oneliner,
    content_mdx: toContentMdx(t),
    category: null,
    tags: [] as string[],
    featured_image: null,
    type: 'page',
    path: `/ai-verktyg/foretag/yrke/${PARENT_PATH[t.parent]}/${t.slug}`,
    parent_slug: t.parent,
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: null,
    seo_description: null,
  }));

  console.log(`Upserting ${rows.length} yrke review pages…`);
  const { data, error } = await db
    .from('articles')
    .upsert(rows, { onConflict: 'path' })
    .select('slug,path');

  if (error) {
    console.error('upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`OK — wrote ${data?.length ?? 0} rows.`);
  // Print 2 per parent for sanity
  const seen: Record<string, number> = {};
  for (const d of (data ?? [])) {
    const parent = d.path.split('/').slice(-2, -1)[0];
    if ((seen[parent] ?? 0) < 2) {
      console.log(`  ${d.path}`);
      seen[parent] = (seen[parent] ?? 0) + 1;
    }
  }
}

main();
