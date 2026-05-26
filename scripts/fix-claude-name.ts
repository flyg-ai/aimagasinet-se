/**
 * Normalise Claude's display name across the AI-text hub:
 *
 *   1. Hub editorial body (`articles.content_mdx` where slug='ai-text-verktyg'):
 *      replace "Claude (Anthropic)" → "Claude" everywhere.
 *
 *   2. Claude review row (slug='claude'): strip " (Anthropic)" from `title`
 *      and `seo_title`. `toolNameFromTitle` derives the per-tool display name
 *      from `title`, so this single change makes "Claude" appear in
 *      RankRow / BestInTest / ComparisonTable / Snabbval automatically —
 *      no HubTemplate code change needed.
 *
 * Run: npm run fix-claude-name
 *
 * Idempotent — re-runs replace already-replaced strings, which are no-ops.
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

async function main() {
  // ── 1. Hub content_mdx ───────────────────────────────────────
  const hub = await db
    .from('articles')
    .select('content_mdx')
    .eq('slug', 'ai-text-verktyg')
    .maybeSingle();

  if (hub.error) { console.error('Read hub failed:', hub.error.message); process.exit(1); }
  if (!hub.data)  { console.error("No 'ai-text-verktyg' row."); process.exit(1); }

  const oldHub = hub.data.content_mdx ?? '';
  const hitsInHub = (oldHub.match(/Claude \(Anthropic\)/g) ?? []).length;
  const newHub = oldHub.replaceAll('Claude (Anthropic)', 'Claude');

  if (hitsInHub > 0) {
    const upd = await db
      .from('articles')
      .update({ content_mdx: newHub })
      .eq('slug', 'ai-text-verktyg');
    if (upd.error) { console.error('Update hub failed:', upd.error.message); process.exit(1); }
    console.log(`✓ ai-text-verktyg.content_mdx: replaced ${hitsInHub} occurrence(s) of "Claude (Anthropic)" → "Claude" (${oldHub.length} → ${newHub.length} chars).`);
  } else {
    console.log('· ai-text-verktyg.content_mdx: no occurrences — already clean.');
  }

  // ── 2. Claude article title / seo_title ──────────────────────
  const claude = await db
    .from('articles')
    .select('title,seo_title')
    .eq('slug', 'claude')
    .maybeSingle();

  if (claude.error) { console.error('Read claude failed:', claude.error.message); process.exit(1); }
  if (!claude.data)  { console.error("No 'claude' row."); process.exit(1); }

  const oldTitle    = claude.data.title    ?? '';
  const oldSeoTitle = claude.data.seo_title ?? '';
  const newTitle    = oldTitle.replaceAll(' (Anthropic)', '');
  const newSeoTitle = oldSeoTitle.replaceAll(' (Anthropic)', '');

  if (newTitle !== oldTitle || newSeoTitle !== oldSeoTitle) {
    const upd = await db
      .from('articles')
      .update({ title: newTitle, seo_title: newSeoTitle })
      .eq('slug', 'claude');
    if (upd.error) { console.error('Update claude failed:', upd.error.message); process.exit(1); }
    console.log('✓ claude.title:');
    console.log(`    "${oldTitle}"`);
    console.log(`  → "${newTitle}"`);
    if (oldSeoTitle !== oldTitle) {
      console.log('✓ claude.seo_title:');
      console.log(`    "${oldSeoTitle}"`);
      console.log(`  → "${newSeoTitle}"`);
    }
  } else {
    console.log('· claude.title / seo_title: already clean.');
  }

  console.log('\nDone. toolNameFromTitle("Claude — Komplett Guide & Recension 2026") = "Claude".');
}

main().catch((e) => { console.error(e); process.exit(1); });
