/**
 * SEO meta-audit (read-only). Pull every article, classify it the same way
 * app/[...slug]/page.tsx does, and flag meta violations against editorial rules:
 *   - title MAX 60 tecken (helst 50-58)  — gäller den title som FAKTISKT visas
 *   - description MAX 155 tecken          — seo_description || excerpt
 *   - stor bokstav efter " – " (dash-separator) i title
 *
 * Review-sidor renderar en beräknad titel ("[Tool] Recension 2026") och
 * ignorerar lagrad seo_title — därför granskas INTE deras titellängd, bara
 * description.
 *
 * Skriver hela datasetet till tmp/seo-audit.json och en sammanfattning till
 * stdout.  npx tsx scripts/audit-seo.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';

loadEnv({ path: '.env.local' });
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export const TITLE_MAX = 60;
export const DESC_MAX = 155;
/** lowercase letter immediately after a space-wrapped dash separator */
export const DASH_LC = /\s[–—-]\s+(\p{Ll})/u;

export type Row = {
  id: number;
  slug: string;
  path: string;
  type: 'post' | 'page';
  parent_slug: string | null;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  excerpt: string | null;
};

/** depth-3 curated subcategory hubs — classify() treats these as 'hub' not 'review' */
export const SUBHUB_PATHS = new Set([
  '/ai-verktyg/marknadsforing/seo',
  '/ai-verktyg/marknadsforing/content-copywriting',
  '/ai-verktyg/marknadsforing/annonser',
  '/ai-verktyg/marknadsforing/sociala-medier',
  '/ai-verktyg/ekonomi/bokforing',
  '/ai-verktyg/ekonomi/redovisning',
]);

/** Faithful subset of classify(): the ONLY question that matters for titles is
 *  whether the displayed title is render-computed (review) or stored. */
export function isReview(r: Row): boolean {
  if (r.type === 'post') return false;
  const depth = r.path.split('/').filter(Boolean).length;
  if (SUBHUB_PATHS.has(r.path)) return false;
  if (r.path.startsWith('/ai-video/') && depth === 2) return true;
  if (r.path.startsWith('/ai-verktyg/foretag/yrke/') && depth >= 6) return true;
  if (r.path.startsWith('/ai-verktyg/') && depth === 2) {
    return !!r.parent_slug && r.parent_slug !== 'ai-verktyg';
  }
  if (r.path.startsWith('/ai-verktyg/') && depth >= 3) {
    return !r.path.startsWith('/ai-verktyg/foretag/yrke/') ||
      r.path.split('/').filter(Boolean).length >= 6;
  }
  return false;
}

/** Category hubs eligible for the Haiku variant-rotation: depth-2 topic hubs
 *  (parent = master hub) + the depth-3 curated subhubs. Navigational hubs
 *  (foretag, gratis, master, yrke) keep their bespoke titles. */
export function isCategoryHub(r: Row): boolean {
  if (r.type !== 'page') return false;
  const depth = r.path.split('/').filter(Boolean).length;
  if (SUBHUB_PATHS.has(r.path)) return true;
  if (!r.path.startsWith('/ai-verktyg/') || depth !== 2) return false;
  if (r.path === '/ai-verktyg/foretag' || r.path === '/ai-verktyg/gratis') return false;
  return !r.parent_slug || r.parent_slug === 'ai-verktyg';
}

export function effectiveTitle(r: Row): string {
  return (r.seo_title || r.title || '').trim();
}
export function effectiveDesc(r: Row): string {
  return (r.seo_description || r.excerpt || '').trim();
}

export async function fetchAll(): Promise<Row[]> {
  const out: Row[] = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('articles')
      .select('id,slug,path,type,parent_slug,title,seo_title,seo_description,excerpt')
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    out.push(...(data as Row[]));
    if (data.length < PAGE) break;
  }
  return out;
}

export type Audited = Row & {
  review: boolean;
  category_hub: boolean;
  eff_title: string;
  eff_title_len: number;
  eff_desc: string;
  eff_desc_len: number;
  title_too_long: boolean;   // only meaningful for non-review
  desc_too_long: boolean;
  lc_after_dash: boolean;    // only meaningful for non-review
};

export function audit(rows: Row[]): Audited[] {
  return rows.map((r) => {
    const review = isReview(r);
    const t = effectiveTitle(r);
    const d = effectiveDesc(r);
    return {
      ...r,
      review,
      category_hub: isCategoryHub(r),
      eff_title: t,
      eff_title_len: t.length,
      eff_desc: d,
      eff_desc_len: d.length,
      title_too_long: !review && t.length > TITLE_MAX,
      desc_too_long: d.length > DESC_MAX,
      lc_after_dash: !review && DASH_LC.test(t),
    };
  });
}

async function main() {
  const rows = await fetchAll();
  const a = audit(rows);

  mkdirSync('tmp', { recursive: true });
  writeFileSync('tmp/seo-audit.json', JSON.stringify(a, null, 2));

  const hubs = a.filter((x) => x.category_hub);
  const titleLong = a.filter((x) => x.title_too_long);
  const descLong = a.filter((x) => x.desc_too_long);
  const lcDash = a.filter((x) => x.lc_after_dash);

  console.log(`Totalt: ${rows.length}  (post ${rows.filter((r) => r.type === 'post').length} / page ${rows.filter((r) => r.type === 'page').length})`);
  console.log(`Reviews: ${a.filter((x) => x.review).length}   Kategori-hubbar: ${hubs.length}`);
  console.log('');
  console.log(`VIOLATIONS`);
  console.log(`  Title > ${TITLE_MAX} (visad, ej review): ${titleLong.length}`);
  console.log(`  Desc  > ${DESC_MAX}:                   ${descLong.length}`);
  console.log(`  Liten bokstav efter dash:        ${lcDash.length}`);
  console.log('');
  console.log('── KATEGORI-HUBBAR ──');
  for (const h of hubs) console.log(`  ${h.path}  T${h.eff_title_len} D${h.eff_desc_len}`);
  console.log('');
  console.log('── TITLE > 60 (non-review) ──');
  for (const x of titleLong) console.log(`  (${x.eff_title_len})${x.category_hub ? ' [HUB]' : ''} ${x.path}\n      ${x.eff_title}`);
  console.log('');
  console.log('── DESC > 155 ──');
  for (const x of descLong) console.log(`  (${x.eff_desc_len})${x.category_hub ? ' [HUB]' : x.review ? ' [REVIEW]' : ''} ${x.path}\n      ${x.eff_desc.slice(0, 170)}`);
  console.log('');
  console.log('── LITEN BOKSTAV EFTER DASH (non-review) ──');
  for (const x of lcDash) console.log(`  ${x.category_hub ? '[HUB] ' : ''}${x.path}\n      ${x.eff_title}`);
}

// Run only when invoked directly (allows importing the helpers above).
if (process.argv[1] && process.argv[1].endsWith('audit-seo.ts')) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
