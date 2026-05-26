/**
 * Populate `articles.featured_image` for the AI-text-verktyg children by
 * extracting each tool's `<img>` URL from the hub article's content_mdx.
 *
 * The WP export had `featured_media: 0` on every child page, so import-wp.ts
 * left featured_image NULL. The actual logos are however embedded inline in
 * the hub article inside <div class="ai-tool-box"> blocks. This script
 * harvests them, maps each to the matching child slug, and writes the URL.
 *
 * Run: npm run populate-logos
 *
 * Idempotent for unchanged data — re-running just rewrites the same URL.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// Tool-name → child-slug matchers (heading text → DB slug)
const SLUG_MATCHERS: Array<[RegExp, string]> = [
  [/claude/i,     'claude'],
  [/chatgpt/i,    'chatgpt'],
  [/gemini/i,     'gemini'],
  [/jasper/i,     'jasper-ai'],
  [/writesonic/i, 'writesonic'],
  [/copy[.\s-]?ai/i, 'copy-ai'],
];

function pickSlug(headingText: string): string | null {
  for (const [pattern, slug] of SLUG_MATCHERS) {
    if (pattern.test(headingText)) return slug;
  }
  return null;
}

async function main() {
  const hub = await db
    .from('articles')
    .select('content_mdx')
    .eq('slug', 'ai-text-verktyg')
    .maybeSingle();

  if (hub.error) { console.error('Read hub failed:', hub.error.message); process.exit(1); }
  if (!hub.data) { console.error("No 'ai-text-verktyg' row."); process.exit(1); }

  const html = hub.data.content_mdx ?? '';

  // Split on the "<!-- N." review comments. Each block thereafter is one tool.
  const blocks = html.split(/<!--\s*\d+\.[^>]*-->/i).slice(1);

  type Found = { slug: string; url: string; heading: string };
  const found: Found[] = [];
  const skipped: string[] = [];

  for (const block of blocks) {
    const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);
    const h2Match  = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!imgMatch || !h2Match) continue;
    const heading = h2Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const slug = pickSlug(heading);
    if (slug) {
      found.push({ slug, url: imgMatch[1], heading });
    } else {
      skipped.push(heading);
    }
  }

  console.log(`Found ${found.length} matched tools, skipped ${skipped.length}.\n`);
  found.forEach((f) => {
    console.log(`  ${f.slug.padEnd(12)} ← "${f.heading}"`);
    console.log(`    ${f.url}`);
  });
  if (skipped.length > 0) {
    console.log(`\nSkipped (no slug matcher):`);
    skipped.forEach((s) => console.log(`  • ${s}`));
  }

  console.log();

  // Apply updates
  for (const { slug, url } of found) {
    const upd = await db
      .from('articles')
      .update({ featured_image: url })
      .eq('slug', slug)
      .select('slug');
    if (upd.error) {
      console.error(`  ✗ ${slug}: ${upd.error.message}`);
    } else if (!upd.data || upd.data.length === 0) {
      console.warn(`  · ${slug}: no row matched (article not in DB).`);
    } else {
      console.log(`  ✓ ${slug} updated`);
    }
  }

  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
