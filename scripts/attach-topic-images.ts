/**
 * Koppla förgenererade omslagsbilder till ämnen i article_topics.
 *
 * Du lägger bilderna i en mapp med vilka begripliga namn som helst. Skriptet
 * matchar dem mot ämnena i kön, konverterar till 1200 px WebP (q85), laddar upp
 * till Supabase Storage och skriver URL:en till article_topics.image_url.
 * Cronen använder den i stället för Unsplash när den är satt.
 *
 *   # 1. Se förslaget — inget skrivs, inget laddas upp
 *   npx tsx scripts/attach-topic-images.ts --dir=./tmp/bilder
 *
 *   # 2. Kör skarpt när matchningen ser rätt ut
 *   npx tsx scripts/attach-topic-images.ts --dir=./tmp/bilder --apply
 *
 * Matchning sker på ordöverlapp mellan filnamn och ämnesrubrik. Vill du styra
 * den exakt: inled filnamnet med ämnets id, t.ex. "7-sjukvard.png" → ämne 7.
 * Skriptet vägrar gissa när två ämnen ligger lika i poäng.
 *
 * Flaggor:
 *   --dir=PATH    Mapp med bilder (png/jpg/jpeg/webp/avif). Krävs.
 *   --apply       Ladda upp och skriv till databasen. Utan den: torrkörning.
 *   --overwrite   Tillåt att ersätta bilden på ämnen som redan har en.
 *
 * Idempotent — samma ämne skriver alltid till samma lagringsnyckel.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Saknar Supabase-env i .env.local');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = 'featured-images';
const PREFIX = 'topics';
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);

/** Ord som inte säger något om motivet och därför inte räknas i matchningen. */
const STOP = new Set([
  'och', 'for', 'pa', 'av', 'med', 'till', 'som', 'den', 'det', 'en', 'ett',
  'ar', 'att', 'om', 'vad', 'ska', 'nar', 'sa', 'mot', 'du', 'vi', 'de', 'hur',
  'kan', 'har', 'blir', 'inte', 'ur', 'da', 'the', 'and', 'ai', '2026',
]);

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}
const has = (name: string) => process.argv.includes(`--${name}`);

/** Samma normalisering som slugify i cron-routen, så nycklarna blir förutsägbara. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
}

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[åä]/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

function score(file: string, topic: string): number {
  const a = tokens(basename(file, extname(file)));
  const b = tokens(topic);
  let hits = 0;
  a.forEach((w) => {
    if (b.has(w)) hits++;
  });
  return hits;
}

type Topic = { id: number; topic: string; image_url: string | null };

const kb = (n: number) => `${Math.round(n / 1024)}KB`;

async function main() {
  const dir = arg('dir');
  const apply = has('apply');
  const overwrite = has('overwrite');

  if (!dir) {
    console.error('Ange --dir=PATH till mappen med bilder. Se filhuvudet för exempel.');
    process.exitCode = 1;
    return;
  }
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    console.error(`Ingen mapp här: ${dir}`);
    process.exitCode = 1;
    return;
  }

  const files = readdirSync(dir).filter((f) => EXTS.has(extname(f).toLowerCase()));
  if (!files.length) {
    console.error(`Inga bildfiler i ${dir}`);
    process.exitCode = 1;
    return;
  }

  // Alla kvarvarande ämnen är okonsumerade — publicerade ämnen raderas ur
  // tabellen av triggern i migration 0013. Därför inget used-filter här; den
  // flaggan har dessutom visat sig opålitlig.
  // Konvertering och uppladdning är oberoende av image_url-kolumnen. Saknas den
  // körs allt utom sista steget, och SQL:en för att koppla ihop skrivs ut på
  // slutet i stället — annars hade en saknad migration blockerat hela jobbet.
  // Bredare typ än vad respektive select ger, så båda varianterna får plats.
  type Fetched = {
    data: { id: number; topic: string; image_url?: string | null }[] | null;
    error: { message: string } | null;
  };
  let canWriteUrl = true;
  let rows: Fetched = await db
    .from('article_topics')
    .select('id,topic,image_url')
    .order('created_at', { ascending: true });
  if (rows.error && /image_url/.test(rows.error.message)) {
    canWriteUrl = false;
    console.log('OBS: kolumnen image_url saknas — laddar upp ändå, SQL skrivs ut på slutet.');
    console.log('     (kör supabase/migrations/0014_topic_image_url.sql för att slippa det)');
    console.log('');
    rows = await db
      .from('article_topics')
      .select('id,topic')
      .order('created_at', { ascending: true });
  }
  if (rows.error) {
    console.error(rows.error.message);
    process.exitCode = 1;
    return;
  }
  const topics = (rows.data ?? []).map((r) => {
    const row = r as { id: number; topic: string; image_url?: string | null };
    return { id: row.id, topic: row.topic, image_url: row.image_url ?? null };
  }) as Topic[];

  // ── Matcha ──────────────────────────────────────────────────────
  const taken = new Set<number>();
  const pairs: { file: string; topic: Topic; why: string }[] = [];
  const skipped: { file: string; why: string }[] = [];

  for (const file of files) {
    const explicit = basename(file).match(/^(\d+)[-_ ]/);
    if (explicit) {
      const t = topics.find((x) => x.id === Number(explicit[1]));
      if (!t) {
        skipped.push({ file, why: `id ${explicit[1]} finns inte i kön` });
        continue;
      }
      if (taken.has(t.id)) {
        skipped.push({ file, why: `ämne ${t.id} redan tilldelat` });
        continue;
      }
      taken.add(t.id);
      pairs.push({ file, topic: t, why: 'id ur filnamnet' });
      continue;
    }

    const ranked = topics
      .filter((t) => !taken.has(t.id))
      .map((t) => ({ t, s: score(file, t.topic) }))
      .sort((a, b) => b.s - a.s);

    const best = ranked[0];
    const runnerUp = ranked[1];
    if (!best || best.s < 2) {
      skipped.push({ file, why: 'för svag matchning' });
      continue;
    }
    if (runnerUp && runnerUp.s === best.s) {
      skipped.push({ file, why: `tvetydig — ämne ${best.t.id} och ${runnerUp.t.id} lika` });
      continue;
    }
    taken.add(best.t.id);
    pairs.push({ file, topic: best.t, why: `${best.s} gemensamma ord` });
  }

  // ── Rapportera ──────────────────────────────────────────────────
  console.log(`${files.length} bildfiler, ${topics.length} ämnen i kön\n`);
  console.log(
    apply
      ? 'SKARP KÖRNING\n'
      : 'TORRKÖRNING — inget skrivs. Lägg till --apply när matchningen ser rätt ut.\n',
  );

  for (const p of pairs) {
    const flag =
      p.topic.image_url && !overwrite
        ? '   [HAR REDAN BILD — hoppas över, kör --overwrite för att ersätta]'
        : '';
    console.log(`  ${p.file}`);
    console.log(`    -> [${p.topic.id}] ${p.topic.topic.slice(0, 58)}`);
    console.log(`       (${p.why})${flag}`);
  }
  if (skipped.length) {
    console.log('\n  Omatchade filer:');
    skipped.forEach((s) => console.log(`    ${s.file} — ${s.why}`));
  }
  const without = topics.filter((t) => !t.image_url && !taken.has(t.id));
  if (without.length) {
    console.log(`\n  Ämnen som fortfarande saknar bild (${without.length}):`);
    without.forEach((t) => console.log(`    [${t.id}] ${t.topic.slice(0, 58)}`));
  }

  if (!apply) return;

  // ── Konvertera, ladda upp, skriv ────────────────────────────────
  console.log('\n── kör ──');
  const pending: { id: number; url: string }[] = [];
  let ok = 0;
  let attempted = 0;
  for (const p of pairs) {
    if (p.topic.image_url && !overwrite) continue;
    attempted++;
    try {
      const src = join(dir, p.file);
      const before = statSync(src).size;
      const out = await sharp(src)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer({ resolveWithObject: true });

      const storageKey = `${PREFIX}/${slugify(p.topic.topic)}.webp`;
      const up = await db.storage.from(BUCKET).upload(storageKey, out.data, {
        contentType: 'image/webp',
        upsert: true,
        cacheControl: '31536000',
      });
      if (up.error) throw new Error(up.error.message);

      const publicUrl = db.storage.from(BUCKET).getPublicUrl(storageKey).data.publicUrl;
      if (canWriteUrl) {
        const upd = await db
          .from('article_topics')
          .update({ image_url: publicUrl })
          .eq('id', p.topic.id);
        if (upd.error) throw new Error(upd.error.message);
      } else {
        pending.push({ id: p.topic.id, url: publicUrl });
      }

      console.log(
        `  [${p.topic.id}] ${out.info.width}x${out.info.height}  ${kb(before)} -> ${kb(out.info.size)}  ${storageKey}`,
      );
      ok++;
    } catch (e) {
      console.log(`  [${p.topic.id}] FEL: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\n${ok} av ${attempted} uppladdade.`);
  if (pending.length) {
    console.log('\nKör detta så kopplas bilderna till ämnena:\n');
    console.log('alter table article_topics add column if not exists image_url text;');
    for (const p of pending) {
      console.log(`update article_topics set image_url = '${p.url}' where id = ${p.id};`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
