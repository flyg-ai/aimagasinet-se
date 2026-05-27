/**
 * Audit every article path in Supabase: classify() decision + HTTP status.
 *
 * Run: npx tsx scripts/audit-routes.ts
 *
 * Requires dev server on http://localhost:3000.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { isStandaloneSlug } from '../components/templates/StandalonePageTemplate';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('missing supabase env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BASE = process.env.AUDIT_BASE_URL || 'http://localhost:3000';

type Row = { slug: string; title: string; type: 'post' | 'page'; path: string; parent_slug: string | null };

// Mirror app/[...slug]/page.tsx::classify
type Kind =
  | 'masterHub' | 'foretagHub' | 'yrkesHub' | 'hub' | 'review'
  | 'standalone' | 'article';
function classify(path: string, depth: number, articleType: 'post' | 'page', slug: string): Kind {
  if (articleType === 'post') return 'article';
  if (path === '/ai-verktyg') return 'masterHub';
  if (path === '/ai-verktyg/foretag') return 'foretagHub';
  if (path === '/ai-verktyg/foretag/yrke') return 'yrkesHub';
  if (path.startsWith('/ai-verktyg/foretag/yrke/') && depth >= 4) return 'hub';
  if (path.startsWith('/ai-verktyg/foretag/')) return 'article';
  if (path === '/ai-verktyg/gratis' || path.startsWith('/ai-verktyg/gratis/')) return 'article';
  if (path === '/ai-video') return 'hub';
  if (path.startsWith('/ai-video/') && depth === 2) return 'review';
  if (path.startsWith('/ai-verktyg/') && depth === 2) return 'hub';
  if (path.startsWith('/ai-verktyg/') && depth >= 3) return 'review';
  if (depth === 1 && isStandaloneSlug(slug)) return 'standalone';
  return 'article';
}

async function fetchAll() {
  const all: Row[] = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await db
      .from('articles')
      .select('slug,title,type,path,parent_slug')
      .order('path', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) { console.error(error); process.exit(1); }
    const batch = (data ?? []) as Row[];
    all.push(...batch);
    if (batch.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

async function head(path: string): Promise<number> {
  try {
    const r = await fetch(BASE + path, { method: 'GET', redirect: 'manual' });
    return r.status;
  } catch (e: any) {
    return 0;
  }
}

async function main() {
  console.log('fetching articles…');
  const rows = await fetchAll();
  console.log(`got ${rows.length} articles. checking HTTP status (this takes a moment)…`);

  const buckets: Record<string, Row[]> = {};
  const status: Record<string, number> = {};

  // Throttle to ~10 concurrent for dev server stability
  const QUEUE = rows.slice();
  const WORKERS = 10;
  await Promise.all(
    Array.from({ length: WORKERS }, async () => {
      while (QUEUE.length) {
        const r = QUEUE.shift()!;
        status[r.path] = await head(r.path);
      }
    })
  );

  for (const r of rows) {
    const depth = r.path.split('/').filter(Boolean).length;
    const kind = classify(r.path, depth, r.type, r.slug);
    const code = status[r.path];
    const key = `${kind}:${code}`;
    (buckets[key] ??= []).push(r);
  }

  // Summary
  console.log('\n=== SUMMARY (kind:status → count) ===');
  Object.keys(buckets).sort().forEach((k) => {
    console.log(`  ${k.padEnd(20)} ${buckets[k].length}`);
  });

  // Detail: anything not 200
  console.log('\n=== NON-200 PATHS ===');
  for (const k of Object.keys(buckets).sort()) {
    if (k.endsWith(':200')) continue;
    console.log(`\n--- ${k} ---`);
    for (const r of buckets[k]) {
      console.log(`  [${r.type}] depth=${r.path.split('/').filter(Boolean).length}  ${r.path}  (parent=${r.parent_slug ?? '∅'})`);
    }
  }

  // Detail: depth-1 pages that classify as article (these are the "fell to ArticleTemplate" candidates)
  const depth1Articles = rows.filter((r) => {
    const depth = r.path.split('/').filter(Boolean).length;
    return depth === 1 && r.type === 'page' && classify(r.path, depth, r.type, r.slug) === 'article';
  });
  console.log(`\n=== depth-1 page-articles → ArticleTemplate (${depth1Articles.length}) ===`);
  depth1Articles.forEach((r) => console.log(`  ${r.path}`));

  // Detail: depth 4+
  const deep = rows.filter((r) => r.path.split('/').filter(Boolean).length >= 4);
  console.log(`\n=== depth >= 4 pages (${deep.length}) ===`);
  deep.forEach((r) => {
    const depth = r.path.split('/').filter(Boolean).length;
    const kind = classify(r.path, depth, r.type, r.slug);
    console.log(`  d=${depth} ${kind.padEnd(10)} ${status[r.path]} ${r.path}`);
  });
}

main();
