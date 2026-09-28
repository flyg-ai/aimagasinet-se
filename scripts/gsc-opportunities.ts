/**
 * Sökdata från Search Console → prioriterad lista med två sorters förslag:
 *
 *   1. FEL INTENT  — frasen har exponeringar men usel position (>15) på en
 *      sida som troligen inte borde vara svaret. Kandidat för en egen artikel.
 *   2. JUSTERA     — sidan rankar hyggligt (position 4–15) men rubriken/SEO-
 *      titeln/FAQ nämner inte frasen. Kandidat för ett rubrik- eller FAQ-
 *      tillägg, samma mönster som gjordes för Spotify- och bildartikeln.
 *
 * Sidor vars content_updated_at ligger inom fönstret flaggas separat och
 * hoppas över i rekommendationerna — deras snitt blandar läget före och
 * efter ändringen och går inte att lita på förrän Google hunnit krypa om.
 *
 *   npx tsx scripts/gsc-opportunities.ts               # senaste 28 dagarna
 *   npx tsx scripts/gsc-opportunities.ts --days=90
 *   npx tsx scripts/gsc-opportunities.ts --days=28 --min-impressions=10
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { querySearchAnalytics, type GscRow } from '../lib/gsc';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

function arg(name: string, fallback: number): number {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m ? Number(m.split('=')[1]) : fallback;
}

const WINDOW_DAYS = arg('days', 28);
const MIN_IMPRESSIONS = arg('min-impressions', 20);
const POOR_POSITION = 15; // sämre än detta + exponeringar => trolig fel-intent
const TUNE_MIN_POSITION = 4; // bättre än detta är redan bra nog, inget att göra
const RECENTLY_CHANGED_GRACE_DAYS = 21; // vänta minst så länge efter en ändring

const STOPWORDS = new Set(['och', 'för', 'med', 'att', 'är', 'en', 'ett', 'av', 'på', 'i', 'som', 'du', 'ni', 'de', 'det', 'den', 'till', 'om', 'har', 'vi', 'din', 'er', 'kan', 'man']);

function normalizePath(pageUrl: string): string {
  try {
    return new URL(pageUrl).pathname.replace(/\/+$/, '') || '/';
  } catch {
    return pageUrl;
  }
}

function significantWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-zåäö0-9\s-]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/** true om alla betydelsebärande ord i frasen redan syns i titel/SEO-titel/FAQ. */
function alreadyTargeted(query: string, haystack: string): boolean {
  const words = significantWords(query);
  if (words.length === 0) return true;
  const h = haystack.toLowerCase();
  return words.every((w) => h.includes(w));
}

async function fetchAllRows(startDate: string, endDate: string): Promise<GscRow[]> {
  const rows: GscRow[] = [];
  let startRow = 0;
  for (;;) {
    const batch = await querySearchAnalytics({
      startDate,
      endDate,
      dimensions: ['query', 'page'],
      rowLimit: 25000,
      startRow,
    });
    rows.push(...batch);
    if (batch.length < 25000) break;
    startRow += batch.length;
  }
  return rows;
}

async function main() {
  const end = new Date();
  end.setDate(end.getDate() - 3); // GSC-data har ett par dagars eftersläpning
  const start = new Date(end);
  start.setDate(start.getDate() - WINDOW_DAYS);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const startDate = fmt(start);
  const endDate = fmt(end);

  console.log(`Fönster: ${startDate} – ${endDate} (${WINDOW_DAYS} dagar), min ${MIN_IMPRESSIONS} exponeringar\n`);

  const rows = await fetchAllRows(startDate, endDate);
  console.log(`${rows.length} rader (fråga × sida) hämtade från Search Console.\n`);

  const byPage = new Map<string, GscRow[]>();
  for (const r of rows) {
    const path = normalizePath(r.keys[1]);
    if (!byPage.has(path)) byPage.set(path, []);
    byPage.get(path)!.push(r);
  }

  const { data: articles, error } = await db
    .from('articles')
    .select('path,title,seo_title,seo_description,faq,content_updated_at,published_at,type')
    .not('published_at', 'is', null);
  if (error) throw error;
  const byPath = new Map((articles ?? []).map((a) => [a.path.replace(/\/+$/, ''), a]));

  const recentlyChanged: { path: string; title: string; updated: string }[] = [];
  const felIntent: { path: string; title: string; query: string; clicks: number; impressions: number; position: number }[] = [];
  const tune: { path: string; title: string; query: string; clicks: number; impressions: number; position: number }[] = [];
  let unmanagedImpressions = 0;

  for (const [path, pageRows] of Array.from(byPage.entries())) {
    const article = byPath.get(path);
    if (!article) {
      unmanagedImpressions += pageRows.reduce((s: number, r: GscRow) => s + r.impressions, 0);
      continue;
    }

    const changedAt = article.content_updated_at ? new Date(article.content_updated_at) : null;
    const graceStart = new Date(end);
    graceStart.setDate(graceStart.getDate() - RECENTLY_CHANGED_GRACE_DAYS);
    if (changedAt && changedAt > start && changedAt > graceStart) {
      recentlyChanged.push({ path, title: article.title, updated: article.content_updated_at! });
      continue;
    }

    const haystack = `${article.title} ${article.seo_title ?? ''} ${article.seo_description ?? ''} ${
      Array.isArray(article.faq) ? article.faq.map((f: { question: string }) => f.question).join(' ') : ''
    }`;

    for (const r of pageRows) {
      const query = r.keys[0];
      if (r.impressions < MIN_IMPRESSIONS) continue;

      if (r.position > POOR_POSITION) {
        felIntent.push({ path, title: article.title, query, clicks: r.clicks, impressions: r.impressions, position: r.position });
      } else if (r.position >= TUNE_MIN_POSITION && !alreadyTargeted(query, haystack)) {
        tune.push({ path, title: article.title, query, clicks: r.clicks, impressions: r.impressions, position: r.position });
      }
    }
  }

  felIntent.sort((a, b) => b.impressions - a.impressions);
  tune.sort((a, b) => b.impressions - a.impressions);

  console.log(`═══ Nyligen ändrade sidor — hoppas över, vänta minst ${RECENTLY_CHANGED_GRACE_DAYS} dagar ═══`);
  if (recentlyChanged.length === 0) console.log('  (inga)');
  for (const p of recentlyChanged) console.log(`  ${p.updated.slice(0, 10)}  ${p.path}  —  ${p.title}`);

  console.log(`\n═══ FEL INTENT — dålig position trots exponeringar, kandidat för egen artikel (topp 25) ═══`);
  for (const f of felIntent.slice(0, 25)) {
    console.log(`  ${String(f.impressions).padStart(4)} visn  pos ${f.position.toFixed(1).padStart(5)}  ${f.clicks} klick  "${f.query}"  →  ${f.path}`);
  }
  if (felIntent.length === 0) console.log('  (inga över tröskeln)');

  console.log(`\n═══ JUSTERA BEFINTLIG ARTIKEL — rankar okej, frasen saknas i rubrik/SEO/FAQ (topp 25) ═══`);
  for (const t of tune.slice(0, 25)) {
    console.log(`  ${String(t.impressions).padStart(4)} visn  pos ${t.position.toFixed(1).padStart(5)}  ${t.clicks} klick  "${t.query}"  →  ${t.path}  (${t.title})`);
  }
  if (tune.length === 0) console.log('  (inga över tröskeln)');

  console.log(`\n${unmanagedImpressions} exponeringar låg på sidor som inte finns i \`articles\`-tabellen (t.ex. dynamiska jämförelser) och ingår inte ovan.`);
}

main().catch((e) => { console.error('FEL:', e.message || e); process.exitCode = 1; });
