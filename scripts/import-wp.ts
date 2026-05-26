/**
 * Import WP export JSON into Supabase.
 * Run: npm run import
 *
 * Reads ../export/{posts,pages,categories,tags,media}.json and upserts into
 * the `categories` + `articles` tables. Idempotent — re-runs overwrite.
 *
 * Hierarchical paths:
 *   - posts → /{slug}            (parent_slug = null)
 *   - pages → derived from WP `link` field, e.g. /ai-verktyg/ai-text-verktyg/chatgpt
 *             parent_slug = slug of the path segment above
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

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── helpers ───────────────────────────────────────────────────────────────
const EXPORT_DIR = resolve(process.cwd(), '..', 'export');
const read = <T>(name: string): T =>
  JSON.parse(readFileSync(resolve(EXPORT_DIR, name), 'utf8')) as T;

const ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
  '&nbsp;': ' ', '&#8211;': '–', '&#8212;': '—', '&#8216;': '‘', '&#8217;': '’',
  '&#8220;': '“', '&#8221;': '”', '&#8230;': '…', '&#038;': '&', '&#39;': "'",
};
const decode = (s: string) =>
  s.replace(/&[#a-z0-9]+;/gi, (m) =>
    ENTITIES[m] ??
    (m.startsWith('&#') ? String.fromCodePoint(Number(m.slice(2, -1))) : m),
  );

const stripTags = (html: string) =>
  decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// ── shape of WP entities we care about ────────────────────────────────────
type WPText = { rendered: string };
type WPPost = {
  id: number; slug: string; status: string; date_gmt: string; link: string;
  title: WPText; content: WPText; excerpt: WPText;
  categories?: number[]; tags?: number[]; featured_media: number;
  parent?: number;
};
type WPCategory = { id: number; slug: string; name: string; description: string };
type WPTag = { id: number; slug: string; name: string };
type WPMedia = { id: number; source_url: string };

// ── load & build lookup maps ──────────────────────────────────────────────
const posts = read<WPPost[]>('posts.json');
const pages = read<WPPost[]>('pages.json');
const wpCats = read<WPCategory[]>('categories.json');
const wpTags = read<WPTag[]>('tags.json');
const media = read<WPMedia[]>('media.json');

const catById = new Map(wpCats.map((c) => [c.id, c]));
const tagById = new Map(wpTags.map((t) => [t.id, t]));
const mediaById = new Map(media.map((m) => [m.id, m.source_url]));
const pageById = new Map(pages.map((p) => [p.id, p]));

/** Strip domain + slashes from a WP link → "/ai-verktyg/ai-text-verktyg/chatgpt" */
function urlPathFromLink(link: string, slug: string): string {
  try {
    const path = new URL(link).pathname.replace(/^\/|\/$/g, '');
    return '/' + (path || slug);
  } catch {
    return '/' + slug;
  }
}

/** Parent slug = slug of the page directly above in the WP page tree (null for root). */
function parentSlugOf(p: WPPost): string | null {
  if (!p.parent) return null;
  return pageById.get(p.parent)?.slug ?? null;
}

// ── upsert categories first ───────────────────────────────────────────────
async function importCategories() {
  const rows = wpCats
    .filter((c) => c.slug !== 'uncategorized')
    .map((c) => ({
      slug: c.slug,
      name: decode(c.name),
      description: c.description ? decode(c.description) : null,
    }));
  const { error } = await db.from('categories').upsert(rows, { onConflict: 'slug' });
  if (error) throw error;
  console.log(`✔ categories: ${rows.length} upserted`);
}

// ── transform WP post/page → article row ──────────────────────────────────
function toArticle(p: WPPost, type: 'post' | 'page') {
  const cats = p.categories ?? [];
  const tags = p.tags ?? [];
  const firstCat = cats
    .map((id) => catById.get(id))
    .find((c) => c && c.slug !== 'uncategorized');
  const title = decode(p.title.rendered);
  const excerpt = stripTags(p.excerpt?.rendered ?? '');

  const path = type === 'post' ? `/${p.slug}` : urlPathFromLink(p.link, p.slug);
  const parent_slug = type === 'post' ? null : parentSlugOf(p);

  return {
    slug: p.slug,
    title,
    content_mdx: p.content.rendered,
    excerpt: excerpt || null,
    category: firstCat?.slug ?? null,
    tags: tags.map((id) => tagById.get(id)?.slug).filter(Boolean) as string[],
    featured_image: mediaById.get(p.featured_media) ?? null,
    type,
    path,
    parent_slug,
    published_at: p.date_gmt ? `${p.date_gmt}Z` : null,
    seo_title: title,
    seo_description: excerpt ? excerpt.slice(0, 160) : null,
  };
}

async function importArticles() {
  const rows = [
    ...posts.filter((p) => p.status === 'publish').map((p) => toArticle(p, 'post')),
    ...pages.filter((p) => p.status === 'publish').map((p) => toArticle(p, 'page')),
  ];
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const { error } = await db.from('articles').upsert(slice, { onConflict: 'slug' });
    if (error) throw error;
  }
  const postCount = rows.filter((r) => r.type === 'post').length;
  const pageCount = rows.filter((r) => r.type === 'page').length;
  console.log(
    `✔ articles: ${rows.length} upserted (${postCount} posts, ${pageCount} pages)`,
  );

  // Depth distribution sanity check
  const byDepth: Record<number, number> = {};
  for (const r of rows) {
    const d = r.path.split('/').filter(Boolean).length;
    byDepth[d] = (byDepth[d] || 0) + 1;
  }
  console.log(
    '  path depths:',
    Object.entries(byDepth)
      .sort(([a], [b]) => +a - +b)
      .map(([d, n]) => `d${d}=${n}`)
      .join(' '),
  );
}

// ── run ───────────────────────────────────────────────────────────────────
(async () => {
  console.log(`Reading from ${EXPORT_DIR}`);
  await importCategories();
  await importArticles();
  console.log('Done.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
