/**
 * Generera Open Graph-bilder for sidor som saknar egen omslagsbild.
 *
 * Varfor det behovs: 293 verktygssidor har ingen featured_image, och den
 * kolumnen gar inte att aterbruka — ReviewTemplate renderar den som kvadratisk
 * logotyp, inte som banner. Utan bild faller og:image tillbaka pa sajtens ikon,
 * sa en delad verktygssida visar AI-Magasinets logga i stallet for nagot som
 * sager vad sidan handlar om.
 *
 * Varfor sharp och inte next/og: @vercel/og kraschar vid bygge pa Windows
 * (fileURLToPath pa WASM-resurserna), och med edge-runtime blir rutten i stallet
 * dynamisk — alltsa renderad vid varje traff. Sajten slog i Vercels CPU-tak i
 * augusti av precis den anledningen. Genererat en gang och lagrat i Storage
 * kostar varken byggtid eller drifttid.
 *
 *   npx tsx scripts/generate-og-images.ts                # torrkorning
 *   npx tsx scripts/generate-og-images.ts --apply
 *   npx tsx scripts/generate-og-images.ts --apply --force   # gor om befintliga
 *   npx tsx scripts/generate-og-images.ts --apply --limit=5
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Saknar Supabase-env i .env.local');
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const PREFIX = 'og';

const has = (n: string) => process.argv.includes(`--${n}`);
const arg = (n: string) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);

/** Varumarkesfarg per verktyg, speglar logo-klassen i REVIEW_KNOWN. Okanda
 *  faller tillbaka pa sajtens accentfarg. */
const BRAND: Record<string, string> = {
  'bg-zinc-900': '#18181b', 'bg-zinc-800': '#27272a',
  'bg-orange-700': '#c2410c', 'bg-orange-600': '#ea580c', 'bg-orange-500': '#f97316',
  'bg-indigo-600': '#4f46e5', 'bg-indigo-500': '#6366f1',
  'bg-blue-600': '#2563eb', 'bg-blue-500': '#3b82f6',
  'bg-emerald-600': '#059669', 'bg-emerald-500': '#10b981',
  'bg-rose-600': '#e11d48', 'bg-red-600': '#dc2626',
  'bg-violet-600': '#7c3aed', 'bg-purple-600': '#9333ea',
  'bg-cyan-600': '#0891b2', 'bg-teal-600': '#0d9488',
  'bg-amber-500': '#f59e0b', 'bg-yellow-500': '#eab308',
  'bg-pink-600': '#db2777', 'bg-sky-600': '#0284c7',
  'bg-green-600': '#16a34a', 'bg-lime-600': '#65a30d',
  'bg-slate-800': '#1e293b', 'bg-gray-800': '#1f2937',
};
const DEFAULT_ACCENT = '#0891b2';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Radbryt pa ordgrans. Max tre rader — fler far inte plats i 630 px. Blir det
 *  fler markeras avbrottet med ellips, annars ser en kapad titel ut som ett
 *  fel snarare an en forkortning. */
function wrap(text: string, max: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if (line && (line + ' ' + w).length > max) {
      out.push(line);
      line = w;
    } else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  if (out.length <= 3) return out;

  const kept = out.slice(0, 3);
  // Ellipsen ska rymmas: kapa sista ordet om raden redan ar full.
  let last = kept[2];
  while (last.length > max - 1 && last.includes(' ')) last = last.slice(0, last.lastIndexOf(' '));
  kept[2] = last.replace(/[\s–—-]+$/, '') + '…';
  return kept;
}

/** Titlarna bar redan "– Recension & Test 2026" och liknande pafyllnad. Det blir
 *  brus i en bild dar det anda star Recension i sidfoten. */
function cleanTitle(title: string): string {
  return title
    .replace(/\s*[–—|-]\s*(Recension|Komplett Guide|Guide|Test)\b.*$/i, '')
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .replace(/\s*\|\s*AI-Magasinet\s*$/i, '')
    .trim();
}

function svg(title: string, accent: string, score: number | null, kicker: string): string {
  const lines = wrap(title, title.length > 30 ? 22 : 18);
  const size = lines.length >= 3 ? 56 : lines.length === 2 ? 66 : 78;
  const blockH = lines.length * size * 1.12 + (score !== null ? 78 : 0);
  const startY = Math.round(315 - blockH / 2 + size * 0.78);

  const tspans = lines
    .map((l, i) => `<tspan x="72" y="${Math.round(startY + i * size * 1.12)}">${esc(l)}</tspan>`)
    .join('');

  const badgeY = Math.round(startY + (lines.length - 1) * size * 1.12 + size * 0.55);
  const badge =
    score === null
      ? ''
      : `<rect x="72" y="${badgeY}" width="118" height="58" rx="29" fill="${accent}"/>` +
        `<text x="131" y="${badgeY + 40}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="32" font-weight="700" fill="#ffffff" text-anchor="middle">${score.toFixed(1).replace('.', ',')}</text>` +
        `<text x="208" y="${badgeY + 39}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26" fill="#a1a1aa">av 10 i vårt test</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#09090b"/>
  <rect x="72" y="72" width="120" height="10" rx="5" fill="${accent}"/>
  <text font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${size}" font-weight="700" fill="#fafafa" letter-spacing="-1.5">${tspans}</text>
  ${badge}
  <text x="72" y="558" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#fafafa" letter-spacing="0.5">AI-MAGASINET</text>
  <text x="1128" y="558" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="24" fill="#71717a" text-anchor="end">${esc(kicker)}</text>
</svg>`;
}

/** Betyg och varumarkesfarg lever i REVIEW_KNOWN, som slas ihop av sju
 *  lib-moduler. Att lasa den ur ReviewTemplate.tsx som text fungerar inte —
 *  filen innehaller bara spread-raderna. Vi importerar kallorna direkt i
 *  stallet; de ar vanlig TypeScript utan JSX, sa inget React dras in. */
type Profile = { logo?: string; score?: number | null };

async function loadProfiles(): Promise<Record<string, Profile>> {
  const mods = await Promise.all([
    import('../lib/yrke-tools').then((m) => m.YRKE_REVIEW_KNOWN),
    import('../lib/category-hub-tools').then((m) => m.CATEGORY_HUB_REVIEW_KNOWN),
    import('../lib/yrkes-hub-tools').then((m) => m.YRKES_HUB_REVIEW_KNOWN),
    import('../lib/yrkes-hub-tools-extra').then((m) => m.YRKES_HUB_REVIEW_KNOWN_EXTRA),
    import('../lib/video-audio-tools').then((m) => m.VIDEO_AUDIO_REVIEW_KNOWN),
    import('../lib/crm-tools').then((m) => m.CRM_REVIEW_KNOWN),
    import('../lib/category-hub-tools-3').then((m) => m.CATEGORY_HUB_REVIEW_KNOWN_3),
  ]);
  return Object.assign({}, ...mods) as Record<string, Profile>;
}

async function main() {
  const apply = has('apply');
  const force = has('force');
  const limit = Number(arg('limit') ?? '0') || 0;

  const profiles = await loadProfiles();

  const { data: catRows } = await db.from(`categories`).select(`slug,name`);
  const categories: Record<string, string> = Object.fromEntries((catRows ?? []).map((c: any) => [c.slug, c.name]));
  console.log(`${Object.keys(profiles).length} recensionsprofiler inlästa (betyg och färg)\n`);

  // Kan vi skriva till kolumnen? Utan migration 0020 finns den inte.
  const probe = await db.from('articles').select('og_image').limit(1);
  const hasColumn = !probe.error;
  if (!hasColumn) {
    console.log('OBS: kolumnen og_image saknas — kör supabase/migrations/0020_og_image.sql först.');
    console.log('     Bilderna kan laddas upp ändå, men inget kopplas till artiklarna.\n');
  }

  const rows: { id: number; slug: string; title: string; type: string; category: string | null; og_image?: string | null }[] = [];
  for (let from = 0; ; from += 1000) {
    const cols = 'id,slug,title,type,category' + (hasColumn ? ',og_image' : '');
    const { data, error } = await db
      .from('articles')
      .select(cols)
      .is('featured_image', null)
      .not('published_at', 'is', null)
      .order('id')
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as unknown as typeof rows));
    if (!data || data.length < 1000) break;
  }

  const todo = rows.filter((r) => force || !r.og_image);
  const list = limit ? todo.slice(0, limit) : todo;

  console.log(`Sidor utan featured_image: ${rows.length}`);
  console.log(`Att generera:              ${list.length}${limit ? ` (begränsat till ${limit})` : ''}\n`);

  if (!apply) {
    for (const r of list.slice(0, 8)) {
      const p = profiles[r.slug];
      console.log(`  ${cleanTitle(r.title).padEnd(38)} ${p?.score ? p.score.toFixed(1) : '—  '}  ${p?.logo ?? ''}`);
    }
    if (list.length > 8) console.log(`  … och ${list.length - 8} till`);
    console.log('\nTorrkörning. Kör med --apply.');
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const r of list) {
    try {
      const p = profiles[r.slug];
      const accent = BRAND[p?.logo ?? ''] ?? DEFAULT_ACCENT;
      const score = typeof p?.score === 'number' ? p.score : null;
      // Sidfoten bar redan ordmarket till vanster. Kickern till hoger ska saga
      // nagot annat — verktygssidor far "Recension & test", artiklar sin
      // kategori. Tidigare stod "AI-Magasinet" pa bada sidor.
      const kicker =
        r.type === 'page'
          ? 'Recension & test 2026'
          : (r.category && categories[r.category]) || 'AI-nyheter';

      const png = await sharp(Buffer.from(svg(cleanTitle(r.title), accent, score, kicker)))
        .png({ compressionLevel: 9 })
        .toBuffer();

      const key = `${PREFIX}/${r.slug}.png`;
      const up = await db.storage.from(BUCKET).upload(key, png, {
        contentType: 'image/png',
        upsert: true,
        cacheControl: '31536000',
      });
      if (up.error) throw new Error(up.error.message);

      const publicUrl = db.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
      if (hasColumn) {
        const { error } = await db.from('articles').update({ og_image: publicUrl }).eq('id', r.id);
        if (error) throw new Error(error.message);
      }
      ok++;
      if (ok % 25 === 0 || list.length <= 10) console.log(`  ${ok}/${list.length}  ${r.slug}`);
    } catch (e) {
      failed++;
      console.error(`  FEL ${r.slug}: ${(e as Error).message}`);
    }
  }

  console.log(`\nKlart. ${ok} genererade, ${failed} misslyckades.`);
  if (!hasColumn) console.log('Kör migrationen och sedan om detta skript för att koppla dem till artiklarna.');
}

main().catch((e) => {
  console.error(e.message || e);
  process.exitCode = 1;
});
