/**
 * One-shot migration: download every articles.featured_image from Loopia
 * (the old WP origin) and re-host it in Supabase Storage. Updates each row's
 * featured_image to point at the new public URL.
 *
 * Run BEFORE Loopia hosting is decommissioned — the script downloads via
 * curl with --resolve pinned to the Loopia IP so it keeps working even
 * after DNS has partly cut over to Vercel.
 *
 *   npx tsx scripts/migrate-images-to-storage.ts
 *
 * Idempotent: rows already pointing at *.supabase.co/storage are skipped.
 * Re-run is safe.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'node:child_process';

loadEnv({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
/** Loopia origin IP captured from the still-cached DNS record. The CN on the
 *  cert is aimagasinet.se, which is why we need --resolve rather than just
 *  hitting the IP directly. */
const LOOPIA_IP = '216.198.79.1';

function downloadViaLoopia(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const args = [
      '-sSL',
      '--max-time', '30',
      '--resolve', `${u.hostname}:443:${LOOPIA_IP}`,
      '--write-out', '%{http_code}',
      '-o', '-',
      url,
    ];
    const curl = spawn('curl', args);
    const chunks: Buffer[] = [];
    let stderr = '';
    curl.stdout.on('data', (c) => chunks.push(c));
    curl.stderr.on('data', (c) => { stderr += c.toString(); });
    curl.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`curl exited ${code}: ${stderr.trim() || '(no stderr)'}`));
        return;
      }
      // The last 3 bytes are the HTTP status code we appended via --write-out.
      const buf = Buffer.concat(chunks);
      const status = buf.slice(-3).toString();
      if (!/^\d{3}$/.test(status)) {
        reject(new Error(`unexpected curl trailer: ${JSON.stringify(status)}`));
        return;
      }
      if (status !== '200') {
        reject(new Error(`HTTP ${status} for ${url}`));
        return;
      }
      resolve(buf.slice(0, buf.length - 3));
    });
  });
}

/** Map https://aimagasinet.se/wp-content/uploads/2025/11/copy-ai-logo.jpg
 *  → "2025/11/copy-ai-logo.jpg" inside the bucket. Preserves the date
 *  directory tree so collisions on "image.jpg" don't matter. */
function storageKeyFor(url: string): string {
  const u = new URL(url);
  const marker = '/wp-content/uploads/';
  const idx = u.pathname.indexOf(marker);
  if (idx === -1) {
    // Fallback: use the bare filename.
    const segments = u.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || 'unknown.bin';
  }
  return u.pathname.slice(idx + marker.length);
}

function contentTypeFor(key: string): string {
  const ext = key.toLowerCase().split('.').pop();
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png':  return 'image/png';
    case 'webp': return 'image/webp';
    case 'gif':  return 'image/gif';
    case 'svg':  return 'image/svg+xml';
    default:     return 'application/octet-stream';
  }
}

async function ensureBucket() {
  const { data: existing } = await db.storage.getBucket(BUCKET);
  if (existing) return;
  const { error } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 1024 * 1024 * 25, // 25MB
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`createBucket: ${error.message}`);
  }
}

async function migrate() {
  await ensureBucket();

  const { data, error } = await db
    .from('articles')
    .select('id,path,featured_image')
    .not('featured_image', 'is', null);
  if (error) throw new Error(`select: ${error.message}`);

  const rows = (data ?? []) as { id: number; path: string; featured_image: string }[];
  console.log(`Found ${rows.length} articles with featured_image.\n`);

  let migrated = 0, skipped = 0, failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const tag = `[${i + 1}/${rows.length}] ${r.path}`;

    if (r.featured_image.includes('.supabase.co/storage/')) {
      console.log(`${tag}  SKIP (already migrated)`);
      skipped++;
      continue;
    }

    const key = storageKeyFor(r.featured_image);

    try {
      const bytes = await downloadViaLoopia(r.featured_image);
      const { error: upErr } = await db.storage
        .from(BUCKET)
        .upload(key, bytes, {
          contentType: contentTypeFor(key),
          upsert: true,
          cacheControl: '31536000',
        });
      if (upErr) throw new Error(`upload: ${upErr.message}`);

      const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
      const newUrl = pub.publicUrl;

      const { error: dbErr } = await db
        .from('articles')
        .update({ featured_image: newUrl })
        .eq('id', r.id);
      if (dbErr) throw new Error(`update: ${dbErr.message}`);

      console.log(`${tag}  ${bytes.length} bytes  →  ${newUrl}`);
      migrated++;
    } catch (e) {
      console.error(`${tag}  FAILED: ${e instanceof Error ? e.message : e}`);
      failed++;
    }
  }

  console.log(`\nDone: ${migrated} migrated, ${skipped} skipped, ${failed} failed.`);
}

migrate().catch((e) => { console.error(e); process.exit(1); });
