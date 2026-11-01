/**
 * Hämtar och sätter featured_image (logotyp) för ALLA verktygsrecensioner på
 * sajten som saknar bild — se saknade-bilder.md grupp A/D (272 st vid audit-
 * tillfället). Körs live mot DB + REVIEW_KNOWN istället för den statiska
 * audit-filen, så den täcker även nytillkomna verktyg (t.ex. AI-säkerhet-
 * hubbens 10 nya).
 *
 * Metod: domänen kommer från varje verktygs `fallbackUrl` i REVIEW_KNOWN
 * (den riktiga officiella sajten, inte gissad). Logga hämtas i turordning:
 *   1. unavatar.io (ingen nyckel krävs — aggregerar Clearbit/Google favicons
 *      m.fl. internt). Svarar 200 även för okända domäner med en FAST,
 *      identisk platshållar-SVG ("Logo for unavatar.") — filtreras bort
 *      explicit.
 *   2. logo.dev (kräver LOGO_DEV_TOKEN i .env.local — en publishable key,
 *      pk_…). Svarar HTTP 200 för en riktig hittad logga men HTTP 202 för en
 *      genererad platshållare på okänd domän — 202 avvisas därför.
 * Clearbit Logo API testades separat och är helt nedlagt (anslutning dör).
 * .ico-svar avvisas också (renderade tomt i <img> på sajten, bekräftat).
 * Riktiga loggor laddas upp till Supabase Storage (permanent kopia, inte
 * hotlink) och sätts som featured_image — bara för rader som saknar bild
 * sedan innan.
 *
 * Verktyg utan fallbackUrl i REVIEW_KNOWN kan inte hanteras automatiskt och
 * listas separat i slutet för manuell uppföljning.
 *
 *   npx tsx scripts/fetch-missing-tool-logos.ts          # apply
 *   DRY=1 npx tsx scripts/fetch-missing-tool-logos.ts    # preview only
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { REVIEW_KNOWN } from '../lib/review-profiles';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const BUCKET = 'featured-images';
const DRY = !!process.env.DRY;
const CONCURRENCY = 6;

function domainOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

const UNAVATAR_FALLBACK_MARKER = 'Logo for unavatar';
const LOGO_DEV_TOKEN = process.env.LOGO_DEV_TOKEN;

async function fetchFromUnavatar(domain: string): Promise<{ buf: Buffer; contentType: string } | null> {
  try {
    const res = await fetch(`https://unavatar.io/${domain}`);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) return null;
    if (contentType.includes('icon')) return null; // .ico renders blank in <img> here — confirmed on-page, skip
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 200) return null; // too small to be real
    if (contentType.includes('svg') && buf.toString('utf8').includes(UNAVATAR_FALLBACK_MARKER)) {
      return null; // unavatar's generic "no logo found" placeholder — reject
    }
    return { buf, contentType };
  } catch {
    return null;
  }
}

async function fetchFromLogoDev(domain: string): Promise<{ buf: Buffer; contentType: string } | null> {
  if (!LOGO_DEV_TOKEN) return null;
  try {
    const res = await fetch(`https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=256&format=png`);
    if (res.status !== 200) return null; // 202 = logo.dev's own generated placeholder for an unknown domain
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 200) return null;
    return { buf, contentType };
  } catch {
    return null;
  }
}

async function fetchLogo(domain: string): Promise<{ buf: Buffer; contentType: string } | null> {
  return (await fetchFromUnavatar(domain)) ?? (await fetchFromLogoDev(domain));
}

async function processOne(row: { slug: string; path: string }, fallbackUrl: string): Promise<'ok' | 'no-logo' | 'error'> {
  const domain = domainOf(fallbackUrl);
  if (!domain) return 'error';

  const logo = await fetchLogo(domain);
  if (!logo) return 'no-logo';

  if (DRY) {
    console.log(`[DRY] ${row.slug} ← ${domain} (${logo.contentType}, ${logo.buf.byteLength}b)`);
    return 'ok';
  }

  const ext = logo.contentType.includes('svg') ? 'svg' : logo.contentType.includes('jpeg') ? 'jpg' : 'png';
  const key = `logos/${row.slug}.${ext}`;
  const { error: upErr } = await db.storage.from(BUCKET).upload(key, logo.buf, {
    contentType: logo.contentType, upsert: true, cacheControl: '31536000',
  });
  if (upErr) { console.error(`✗ ${row.slug}: storage upload failed — ${upErr.message}`); return 'error'; }

  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  const { error: updErr } = await db.from('articles').update({ featured_image: pub.publicUrl }).eq('slug', row.slug);
  if (updErr) { console.error(`✗ ${row.slug}: DB update failed — ${updErr.message}`); return 'error'; }

  console.log(`✓ ${row.slug} ← ${domain}`);
  return 'ok';
}

async function main() {
  console.log(DRY ? 'DRY RUN — inga ändringar sparas.\n' : 'Hämtar och sätter saknade verktygsloggor...\n');

  // All rows missing an image, in slug-batches (no .in() size limit worries —
  // articles table is <2000 rows, one page covers it).
  const { data: rows, error } = await db
    .from('articles')
    .select('slug,path,title')
    .is('featured_image', null)
    .range(0, 1999);
  if (error) { console.error('fetch rows failed:', error.message); process.exit(1); }

  const candidates = (rows ?? [])
    .map((r) => ({ ...r, fallbackUrl: REVIEW_KNOWN[r.slug]?.fallbackUrl }))
    .filter((r): r is typeof r & { fallbackUrl: string } => !!r.fallbackUrl);

  const noProfile = (rows ?? []).filter((r) => !REVIEW_KNOWN[r.slug]);
  console.log(`${rows?.length ?? 0} rader saknar bild totalt. ${candidates.length} har en känd fallbackUrl (REVIEW_KNOWN) och hanteras här.\n`);

  let ok = 0, noLogo = 0, errCount = 0;
  const noLogoSlugs: string[] = [];

  let idx = 0;
  async function worker() {
    while (idx < candidates.length) {
      const i = idx++;
      const row = candidates[i];
      const result = await processOne(row, row.fallbackUrl);
      if (result === 'ok') ok++;
      else if (result === 'no-logo') { noLogo++; noLogoSlugs.push(row.slug); }
      else errCount++;
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\n${DRY ? '[DRY] skulle sätta' : 'Satte'} ${ok} loggor. ${noLogo} hade ingen hämtbar logga. ${errCount} fel.`);
  if (noLogoSlugs.length) {
    console.log(`\nIngen logga hittad för (manuell uppföljning):`);
    noLogoSlugs.forEach((s) => console.log(`  • ${s}`));
  }
  if (noProfile.length) {
    console.log(`\n${noProfile.length} rader utan featured_image saknar även REVIEW_KNOWN-profil (hubbar/artiklar/verktyg utan fallbackUrl) — hanteras inte av det här scriptet:`);
    noProfile.slice(0, 40).forEach((r) => console.log(`  • ${r.slug}  (${r.path})`));
    if (noProfile.length > 40) console.log(`  … och ${noProfile.length - 40} till`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
