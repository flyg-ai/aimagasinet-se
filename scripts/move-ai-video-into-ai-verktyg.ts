/**
 * Flyttar AI-video-hubben från sin avvikande depth-1-struktur (/ai-video/*)
 * in i standardstrukturen (/ai-verktyg/ai-video/*), samma mönster som alla
 * andra kategori-hubbar. Städar samtidigt bort den sedan tidigare övergivna
 * dubblett-sidan /ai-verktyg/ai-video-verktyg (redan skuggad av en redirect
 * i next.config.mjs, 0 impressions senaste 30 dagarna) och stärker intern
 * länkning från ett par relevanta artiklar som nämner AI-video utan länk.
 *
 *   npx tsx scripts/move-ai-video-into-ai-verktyg.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const CHILD_SLUGS = [
  'adobe-firefly-video', 'luma-dream-machine', 'revid-ai', 'pika-labs',
  'kling-ai', 'runway-gen-3', 'heygen', 'synthesia', 'kaiber', 'invideo',
  'capcut-ai-vklipp', 'sora-2',
];

function fixLinks(content: string): { content: string; changed: number } {
  let changed = 0;
  // /ai-video/<tool> -> /ai-verktyg/ai-video/<tool> (men inte /ai-verktyg/gratis/ai-video)
  let out = content.replace(/(["'(])\/ai-video\/([a-z0-9-]+)(\/?)(["')])/g, (m, pre, tool, slash, post) => {
    changed++;
    return `${pre}/ai-verktyg/ai-video/${tool}${slash}${post}`;
  });
  // bar /ai-video (hub-länk utan undersida)
  out = out.replace(/(["'(])\/ai-video(\/?)(["')])/g, (m, pre, slash, post) => {
    changed++;
    return `${pre}/ai-verktyg/ai-video${slash}${post}`;
  });
  // https://aimagasinet.se/ai-video...
  out = out.replace(/https:\/\/aimagasinet\.se\/ai-video\//g, () => {
    changed++;
    return 'https://aimagasinet.se/ai-verktyg/ai-video/';
  });
  // gamla dubblett-sidan
  out = out.split('/ai-verktyg/ai-video-verktyg').join('/ai-verktyg/ai-video');
  if (content.includes('/ai-verktyg/ai-video-verktyg')) changed++;
  return { content: out, changed };
}

async function main() {
  console.log('=== 1. Flytta hubben ===');
  const { error: hubErr } = await db
    .from('articles')
    .update({ path: '/ai-verktyg/ai-video', parent_slug: 'ai-verktyg' })
    .eq('slug', 'ai-video');
  if (hubErr) console.error('Hub-flytt misslyckades:', hubErr);
  else console.log('OK: /ai-video -> /ai-verktyg/ai-video');

  console.log('\n=== 2. Flytta barn-sidorna ===');
  for (const slug of CHILD_SLUGS) {
    const { error } = await db
      .from('articles')
      .update({ path: `/ai-verktyg/ai-video/${slug}` })
      .eq('slug', slug)
      .eq('parent_slug', 'ai-video');
    if (error) console.error(`${slug} misslyckades:`, error);
    else console.log(`OK: /ai-video/${slug} -> /ai-verktyg/ai-video/${slug}`);
  }

  console.log('\n=== 3. Avpublicera övergiven dubblettsida ai-video-verktyg ===');
  const { error: unpubErr } = await db
    .from('articles')
    .update({ published_at: null })
    .eq('slug', 'ai-video-verktyg');
  if (unpubErr) console.error('Avpublicering misslyckades:', unpubErr);
  else console.log('OK: ai-video-verktyg avpublicerad (0 impressions, redan skuggad av redirect)');

  console.log('\n=== 4. Fixa interna länkar i alla publicerade artiklar ===');
  const { data: rows, error: selErr } = await db
    .from('articles')
    .select('slug,content_mdx')
    .not('content_mdx', 'is', null)
    .not('published_at', 'is', null);
  if (selErr) { console.error(selErr); return; }

  for (const row of rows ?? []) {
    if (!row.content_mdx.includes('/ai-video')) continue;
    const { content, changed } = fixLinks(row.content_mdx);
    if (changed === 0 || content === row.content_mdx) continue;
    const { error } = await db.from('articles').update({ content_mdx: content }).eq('slug', row.slug);
    if (error) console.error(`Länkfix misslyckades ${row.slug}:`, error);
    else console.log(`OK: ${row.slug} — ${changed} länk(ar) uppdaterad(e)`);
  }

  console.log('\n=== 5. Stärk intern länkning — nya kontextuella länkar ===');
  const NEW_LINKS: { slug: string; from: string; to: string }[] = [
    {
      slug: 'ai-videorna-som-gatt-viralt-2026-och-hur-de-gjordes',
      from: '</p>',
      to: ' Se vår <a href="/ai-verktyg/ai-video/">jämförelse av de bästa AI-videoverktygen 2026</a>.</p>',
    },
    {
      slug: 'pencil-ai',
      from: '</p>',
      to: ' Om du enbart jobbar med rörlig annonsfilm, jämför även med <a href="/ai-verktyg/ai-video/">övriga AI-videoverktyg</a>.</p>',
    },
  ];
  for (const { slug, from, to } of NEW_LINKS) {
    const { data: article, error } = await db.from('articles').select('content_mdx').eq('slug', slug).single();
    if (error || !article) { console.error(`Hoppar ${slug}:`, error); continue; }
    if (article.content_mdx.includes('/ai-verktyg/ai-video')) { console.log(`${slug}: länk finns redan, hoppar`); continue; }
    const idx = article.content_mdx.lastIndexOf(from);
    if (idx === -1) { console.error(`${slug}: hittade ingen </p> att infoga vid, hoppar`); continue; }
    const updated = article.content_mdx.slice(0, idx) + to + article.content_mdx.slice(idx + from.length);
    const { error: upErr } = await db.from('articles').update({ content_mdx: updated }).eq('slug', slug);
    if (upErr) console.error(`Misslyckades ${slug}:`, upErr);
    else console.log(`OK: ny länk tillagd i ${slug}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
