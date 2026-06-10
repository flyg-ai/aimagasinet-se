/**
 * Fas 2 av SEO-fixen: allt UTOM kategori-hubbarna (de fixas av
 * fix-seo-hubs.ts). Läser tmp/seo-audit.json och åtgärdar:
 *
 *   1. seo_title med inbakat " | AI-Magasinet" — dubbelsuffix-bugg eftersom
 *      layout.tsx redan lägger på det. Strippas.
 *   2. Liten bokstav efter " – " i title → STOR (deterministiskt).
 *   3. Title > 60 tecken (icke-review) → kortare seo_title via Claude Haiku.
 *      Review-sidor hoppas över (titel beräknas vid render).
 *   4. Description > 155 tecken → kortare seo_description via Claude Haiku.
 *
 * Skriver bara seo_title / seo_description — aldrig title (H1) eller excerpt.
 * Kör audit-seo.ts FÖRST så tmp/seo-audit.json är färskt.
 *
 *   npx tsx scripts/audit-seo.ts && npx tsx scripts/fix-seo-rest.ts
 *   DRY=1 npx tsx scripts/fix-seo-rest.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { TITLE_MAX, DESC_MAX, type Audited } from './audit-seo';

loadEnv({ path: '.env.local' });
const DRY = !!process.env.DRY;
const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const SUFFIX = /\s*[|–—-]\s*AI-Magasinet\s*$/i;

function stripSuffix(s: string): string {
  return s.replace(SUFFIX, '').trim();
}
function normalizeTitle(t: string): string {
  let s = t.trim().replace(/\s*[—–]\s+/g, ' – ');
  s = s.replace(/ – ([a-zà-ÿ])/, (_m, c: string) => ` – ${c.toUpperCase()}`);
  return s;
}
const upper1 = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

/** Sista utväg: kapa vid ordgräns ≤ max (utan att lämna "…"). */
function hardTrim(s: string, max: number): string {
  if (s.length <= max) return s;
  let cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  if (sp > max * 0.6) cut = cut.slice(0, sp);
  return cut.replace(/[\s,–—-]+$/, '').trim();
}

async function callHaiku(prompt: string, maxTokens: number): Promise<string> {
  const msg = await claude.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim()
    .replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

/** Korta ner titlar → ≤60 tecken. Returnerar path→title. */
async function shortenTitles(items: { path: string; title: string }[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const part of chunk(items, 12)) {
    const lines = part.map((it) => `${it.path}\n  (${it.title.length}) ${it.title}`).join('\n');
    const prompt = `Du är SEO-redaktör på AI-Magasinet (svensk AI-sajt). Skriv en KORTARE meta-title (<title>-tagg) för varje artikel nedan. Den långa rubriken är artikelns H1 — din meta-title ska fånga samma sak men koncist.

REGLER:
- MAX 60 tecken, sikta på 50-58.
- Behåll det viktigaste sökordet/kroken och årtal (2026) om det finns i originalet.
- Om du använder " – " som separator: STOR bokstav direkt efter.
- Naturlig svenska. Lägg INTE till "| AI-Magasinet" (det läggs på automatiskt).

ARTIKLAR:
${lines}

Returnera EXAKT JSON, inget annat: {"<path>":"<ny title>", ...}`;
    const parsed = JSON.parse(await callHaiku(prompt, 1500)) as Record<string, string>;
    for (const [k, v] of Object.entries(parsed)) out[k] = v;
  }
  return out;
}

/** Korta ner descriptions → ≤155 tecken. Returnerar path→description. */
async function shortenDescs(items: { path: string; desc: string }[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const part of chunk(items, 12)) {
    const lines = part.map((it) => `${it.path}\n  (${it.desc.length}) ${it.desc}`).join('\n');
    const prompt = `Du är SEO-redaktör på AI-Magasinet (svensk AI-sajt). Korta ner varje meta-description nedan till MAX 155 tecken (helst 140-155) utan att tappa kärnan. Naturlig, säljande svenska. Avsluta inte med "…".

TEXTER:
${lines}

Returnera EXAKT JSON, inget annat: {"<path>":"<ny description>", ...}`;
    const parsed = JSON.parse(await callHaiku(prompt, 3000)) as Record<string, string>;
    for (const [k, v] of Object.entries(parsed)) out[k] = v;
  }
  return out;
}

async function main() {
  const all = JSON.parse(readFileSync('tmp/seo-audit.json', 'utf8')) as Audited[];
  // Hubbar hanteras separat.
  const rows = all.filter((r) => !r.category_hub);

  // ── TITLAR ──────────────────────────────────────────────
  // Kandidater: icke-review med title>60, ELLER liten bokstav efter dash,
  // ELLER inbakat AI-Magasinet-suffix i seo_title.
  const titleUpdates: Record<string, string> = {};
  const needHaiku: { path: string; title: string }[] = [];

  for (const r of rows) {
    if (r.review) continue;
    const hasSuffix = !!r.seo_title && SUFFIX.test(r.seo_title);
    if (!r.title_too_long && !r.lc_after_dash && !hasSuffix) continue;

    let t = normalizeTitle(stripSuffix(r.eff_title));
    if (t.length <= TITLE_MAX) {
      // Deterministiskt fix räckte (suffix-strip och/eller versalisering).
      if (t !== r.eff_title) titleUpdates[r.path] = t;
    } else {
      needHaiku.push({ path: r.path, title: t });
    }
  }

  if (needHaiku.length) {
    console.log(`Kortar ner ${needHaiku.length} titlar via Haiku…`);
    const fixed = await shortenTitles(needHaiku);
    for (const it of needHaiku) {
      const v = fixed[it.path];
      if (!v) { console.error(`  saknar titel: ${it.path}`); continue; }
      titleUpdates[it.path] = normalizeTitle(stripSuffix(v));
    }
  }

  // ── DESCRIPTIONS ────────────────────────────────────────
  const descCandidates = rows.filter((r) => r.desc_too_long).map((r) => ({ path: r.path, desc: r.eff_desc }));
  const descUpdates: Record<string, string> = {};
  if (descCandidates.length) {
    console.log(`Kortar ner ${descCandidates.length} descriptions via Haiku…`);
    const fixed = await shortenDescs(descCandidates);
    for (const it of descCandidates) {
      const v = fixed[it.path];
      if (!v) { console.error(`  saknar desc: ${it.path}`); continue; }
      descUpdates[it.path] = upper1(v.trim());
    }
  }

  // ── ANDRA PASSET: tvinga ner kvarvarande gränsöverskridanden ──
  const tLeft = Object.entries(titleUpdates).filter(([, t]) => t.length > TITLE_MAX).map(([path, title]) => ({ path, title }));
  if (tLeft.length) {
    const fixed = await shortenTitles(tLeft);
    for (const it of tLeft) {
      const v = fixed[it.path] ? normalizeTitle(stripSuffix(fixed[it.path])) : it.title;
      titleUpdates[it.path] = hardTrim(v, TITLE_MAX);
    }
  }
  const dLeft = Object.entries(descUpdates).filter(([, d]) => d.length > DESC_MAX).map(([path, desc]) => ({ path, desc }));
  if (dLeft.length) {
    const fixed = await shortenDescs(dLeft);
    for (const it of dLeft) {
      const v = fixed[it.path] ? upper1(fixed[it.path].trim()) : it.desc;
      descUpdates[it.path] = hardTrim(v, DESC_MAX);
    }
  }

  // ── APPLICERA ───────────────────────────────────────────
  const paths = Array.from(new Set([...Object.keys(titleUpdates), ...Object.keys(descUpdates)]));
  let ok = 0, warn = 0;
  for (const path of paths) {
    const patch: Record<string, string> = {};
    const t = titleUpdates[path];
    const d = descUpdates[path];
    if (t) patch.seo_title = t;
    if (d) patch.seo_description = d;
    const tFlag = t && t.length > TITLE_MAX ? ' ⚠TITLE' : '';
    const dFlag = d && d.length > DESC_MAX ? ' ⚠DESC' : '';
    if (tFlag || dFlag) warn++;
    console.log(`${path}`);
    if (t) console.log(`  T(${t.length})${tFlag}: ${t}`);
    if (d) console.log(`  D(${d.length})${dFlag}: ${d}`);
    if (!DRY) {
      const { error } = await db.from('articles').update(patch).eq('path', path);
      if (error) { console.error(`  FAIL: ${error.message}`); continue; }
    }
    ok++;
  }
  console.log(`\n${DRY ? '[DRY] ' : ''}${ok} sidor ${DRY ? 'planerade' : 'uppdaterade'} (titel: ${Object.keys(titleUpdates).length}, desc: ${Object.keys(descUpdates).length}). ${warn ? `${warn} varningar.` : 'Inga gränsöverskridanden.'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
