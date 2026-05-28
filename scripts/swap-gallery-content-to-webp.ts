/**
 * Rewrite content_mdx of /basta-ai-bilder-galleri-2026 to point at the
 * .webp twins produced by scripts/compress-storage-images.ts.
 *
 *   npx tsx scripts/swap-gallery-content-to-webp.ts
 *
 * Only swaps a URL if a .webp counterpart actually exists in the bucket,
 * so images that were never compressed (already-small JPGs, or files that
 * were uploaded as .webp originally) are left untouched.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const PATH = '/basta-ai-bilder-galleri-2026';
const PUBLIC_PREFIX = `${url}/storage/v1/object/public/${BUCKET}/`;

async function listGalleriWebpKeys(): Promise<Set<string>> {
  const out = new Set<string>();
  let offset = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await db.storage.from(BUCKET).list('galleri', {
      limit: 100, offset, sortBy: { column: 'name', order: 'asc' },
    });
    if (error) throw new Error(`list galleri: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const e of data) if (e.name.endsWith('.webp')) out.add(`galleri/${e.name}`);
    if (data.length < 100) break;
    offset += 100;
  }
  return out;
}

async function main() {
  const webpKeys = await listGalleriWebpKeys();
  console.log(`${webpKeys.size} .webp files exist in galleri/`);

  const { data: row, error } = await db
    .from('articles')
    .select('id,content_mdx')
    .eq('path', PATH)
    .maybeSingle();
  if (error || !row) { console.error('fetch failed:', error?.message ?? 'not found'); process.exit(1); }
  const before: string = row.content_mdx ?? '';
  if (!before) { console.error('content_mdx empty — nothing to rewrite'); process.exit(1); }

  let swaps = 0;
  // Match <img src="<public-bucket-URL>/galleri/<file>.<ext>"...> and swap
  // the extension to .webp only when the .webp twin exists in storage.
  const re = new RegExp(
    `(${PUBLIC_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}galleri/)([^"]+?)\\.(png|jpe?g|gif|bmp|tiff?)(["?])`,
    'g'
  );
  const after = before.replace(re, (_full, prefix: string, name: string, _ext: string, tail: string) => {
    const newKey = `galleri/${name}.webp`;
    if (!webpKeys.has(newKey)) return _full;
    swaps++;
    return `${prefix}${name}.webp${tail}`;
  });

  console.log(`Swapped ${swaps} <img src> URLs to .webp.`);
  if (swaps === 0) {
    console.log('Nothing to update — content_mdx unchanged.');
    return;
  }

  const { data: upd, error: uErr } = await db
    .from('articles')
    .update({ content_mdx: after })
    .eq('id', row.id)
    .select('id,path');
  if (uErr) { console.error('update failed:', uErr.message); process.exit(1); }
  console.log(`OK → ${upd?.[0]?.path} (id=${upd?.[0]?.id}) content_mdx updated. ` +
    `Before: ${before.length} bytes, after: ${after.length} bytes.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
