/**
 * Restore a single page's `content_mdx` from the WP export.
 *
 * Run: npm run restore -- ai-text-verktyg
 *      (or: tsx scripts/restore-page.ts ai-text-verktyg)
 *
 * Defaults to slug `ai-text-verktyg` if no argument is given. Reads
 * `../export/pages.json`, finds the page with the matching slug, and
 * overwrites `articles.content_mdx` for that row. Other columns are left
 * untouched.
 *
 * Note: this restores the raw WP export. Any content-mutating migrations
 * applied AFTER the export (e.g. 0005_hub_content_refresh.sql) will be
 * undone — re-run them if needed.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local',
  );
  process.exit(1);
}

const slug = process.argv[2] ?? 'ai-text-verktyg';

type WPText = { rendered: string };
type WPPage = {
  id: number;
  slug: string;
  title: WPText;
  content: WPText;
};

const exportPath = resolve(process.cwd(), '..', 'export', 'pages.json');
let pages: WPPage[];
try {
  pages = JSON.parse(readFileSync(exportPath, 'utf8')) as WPPage[];
} catch (err) {
  console.error(`Failed to read ${exportPath}:`, (err as Error).message);
  process.exit(1);
}

const page = pages.find((p) => p.slug === slug);
if (!page) {
  console.error(`No page with slug='${slug}' in ${exportPath}.`);
  console.error(`Available slugs (sample): ${pages.slice(0, 10).map((p) => p.slug).join(', ')}…`);
  process.exit(1);
}

const html = page.content?.rendered ?? '';
if (!html) {
  console.error(`Page '${slug}' has no content.rendered.`);
  process.exit(1);
}

console.log(`Found "${page.title.rendered}" (WP id ${page.id}, ${html.length} chars)`);

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const { data, error } = await db
    .from('articles')
    .update({ content_mdx: html })
    .eq('slug', slug)
    .select('id,slug,path,title');

  if (error) {
    console.error('Update failed:', error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.error(`No articles row with slug='${slug}'. Nothing updated.`);
    process.exit(1);
  }

  console.log(`✓ Restored content_mdx for articles.id=${data[0].id} (${data[0].path}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
