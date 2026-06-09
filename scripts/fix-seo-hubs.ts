/**
 * Fas 1 av SEO-fixen: variera meta-title + meta-description på alla
 * kategori-hubbar. Idag delar ~15 hubbar exakt samma mall
 * ("Bästa AI-verktyg för X 2026 — Topplista & guide") och flera saknar
 * seo_description (faller tillbaka på rörig excerpt). Vi roterar bland 5
 * titel-mönster och 3 description-mönster via Claude Haiku.
 *
 * Regler (tvingas fram i kod efter generering):
 *   - seo_title  ≤ 60 tecken, separator " – " (en dash), STOR bokstav efter " – "
 *   - seo_description ≤ 155 tecken
 *   - /ai-verktyg/ai-kod-verktyg får en fast titel enligt spec
 *
 * Uppdaterar bara seo_title + seo_description (inte H1/title), i linje med
 * update-parent-hub-meta.ts. Idempotent.
 *
 *   npx tsx scripts/fix-seo-hubs.ts          # skarp körning
 *   DRY=1 npx tsx scripts/fix-seo-hubs.ts    # generera + skriv ut, rör inte DB
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { TITLE_MAX, DESC_MAX } from './audit-seo';

loadEnv({ path: '.env.local' });
const DRY = !!process.env.DRY;
const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

/** path → kategori-etikett som [kategori]-platshållaren ersätts med. */
const HUBS: { path: string; kategori: string }[] = [
  { path: '/ai-verktyg/tiktok', kategori: 'TikTok' },
  { path: '/ai-verktyg/ai-automation', kategori: 'automation' },
  { path: '/ai-verktyg/ai-kod-verktyg', kategori: 'kod' },
  { path: '/ai-verktyg/ai-video-verktyg', kategori: 'video' },
  { path: '/ai-verktyg/ai-bild-verktyg', kategori: 'bild' },
  { path: '/ai-verktyg/ai-ljud-och-musik', kategori: 'ljud & musik' },
  { path: '/ai-verktyg/ai-text-verktyg', kategori: 'text' },
  { path: '/ai-verktyg/hemsidebyggare', kategori: 'hemsidebyggare' },
  { path: '/ai-verktyg/presentationer', kategori: 'presentationer' },
  { path: '/ai-verktyg/motesverktyg', kategori: 'möten' },
  { path: '/ai-verktyg/sociala-medier', kategori: 'sociala medier' },
  { path: '/ai-verktyg/projektledning', kategori: 'projektledning' },
  { path: '/ai-verktyg/e-handel', kategori: 'e-handel' },
  { path: '/ai-verktyg/oversattning', kategori: 'översättning' },
  { path: '/ai-verktyg/dokumenthantering', kategori: 'dokumenthantering' },
  { path: '/ai-verktyg/juridik', kategori: 'juridik' },
  { path: '/ai-verktyg/kundservice', kategori: 'kundservice' },
  { path: '/ai-verktyg/rekrytering', kategori: 'rekrytering' },
  { path: '/ai-verktyg/ekonomi', kategori: 'ekonomi' },
  { path: '/ai-verktyg/marknadsforing', kategori: 'marknadsföring' },
  { path: '/ai-verktyg/marknadsforing/seo', kategori: 'SEO' },
  { path: '/ai-verktyg/marknadsforing/content-copywriting', kategori: 'content & copywriting' },
  { path: '/ai-verktyg/marknadsforing/annonser', kategori: 'annonser' },
  { path: '/ai-verktyg/marknadsforing/sociala-medier', kategori: 'sociala medier' },
  { path: '/ai-verktyg/ekonomi/bokforing', kategori: 'bokföring' },
  { path: '/ai-verktyg/ekonomi/redovisning', kategori: 'redovisning' },
  { path: '/ai-verktyg/ui-ux', kategori: 'UI/UX-design' },
  { path: '/ai-verktyg/crm', kategori: 'CRM' },
  { path: '/ai-verktyg/ai-assistenter', kategori: 'AI-assistenter' },
  { path: '/ai-verktyg/rost-och-tal', kategori: 'röst & tal' },
  { path: '/ai-verktyg/podcast-ljudredigering', kategori: 'podcast & ljudredigering' },
  { path: '/ai-verktyg/produktivitet', kategori: 'produktivitet' },
  { path: '/ai-verktyg/e-postmarknadsforing', kategori: 'e-postmarknadsföring' },
  { path: '/ai-verktyg/dataanalys', kategori: 'dataanalys' },
  { path: '/ai-verktyg/utbildning', kategori: 'utbildning' },
];

/** Fast titel enligt spec — får inte genereras om. */
const FORCED_TITLE: Record<string, string> = {
  '/ai-verktyg/ai-kod-verktyg': 'AI för kod 2026 – Bästa verktygen för utvecklare',
};

const TITLE_PATTERNS = [
  'Bästa AI-verktyg för [kategori] 2026 – Topp 10 recenserade',
  '[Kategori] med AI – De bästa verktygen just nu',
  'AI för [kategori] – Jämför & hitta rätt verktyg 2026',
  'Topp 10 AI-verktyg för [kategori] – Recensioner & guide',
  '[Kategori] AI-verktyg 2026 – Så väljer du rätt',
];
const DESC_PATTERNS = [
  'Vi har testat och recenserat de bästa AI-verktygen för [kategori]. Hitta rätt verktyg för ditt behov.',
  'Komplett guide till AI för [kategori] 2026. Jämför funktioner, pris och betyg – välj rätt direkt.',
  'Topp 10 AI-verktyg för [kategori] testade av redaktionen. Se betyg, pris och vad varje verktyg är bäst på.',
];

type Gen = { title: string; description: string };

/** Normalisera separator till " – " och tvinga stor bokstav efter den. */
function normalizeTitle(t: string): string {
  let s = t.trim().replace(/\s*[—–-]\s+/g, ' – ');
  s = s.replace(/ – (\p{Ll})/u, (_m, c: string) => ` – ${c.toUpperCase()}`);
  return s;
}
const upper1 = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

async function callHaiku(prompt: string, maxTokens = 4000): Promise<string> {
  const msg = await claude.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function generate(): Promise<Record<string, Gen>> {
  const hubLines = HUBS.filter((h) => !FORCED_TITLE[h.path])
    .map((h, i) => `${i + 1}. ${h.path} — kategori: "${h.kategori}"`)
    .join('\n');

  const prompt = `Du är SEO-redaktör på AI-Magasinet (svensk sajt om AI-verktyg). Skriv meta-title och meta-description för ${HUBS.length - Object.keys(FORCED_TITLE).length} kategori-hubbar.

ROTERA bland dessa 5 TITEL-mönster (fördela jämnt, ~lika många av varje, och låt ALDRIG två hubbar efter varandra i listan få samma mönster):
${TITLE_PATTERNS.map((p, i) => `T${i + 1}. ${p}`).join('\n')}

ROTERA bland dessa 3 DESCRIPTION-mönster (fördela jämnt):
${DESC_PATTERNS.map((p, i) => `D${i + 1}. ${p}`).join('\n')}

REGLER:
- Ersätt [kategori]/[Kategori] med kategori-etiketten. [Kategori] = stor begynnelsebokstav.
- Om en bokstavlig insättning blir klumpig (t.ex. "AI-verktyg för AI-assistenter" eller "AI-verktyg för text" där "AI" upprepas), formulera om NATURLIGT men behåll mönstrets struktur och ton.
- TITEL: MAX 60 tecken. Sikta på 50-58. Separator " – " (en dash med mellanslag). STOR bokstav direkt efter " – ".
- DESCRIPTION: MAX 155 tecken. Helst 140-155. Naturlig svenska.
- Variera — det får INTE kännas som samma mall överallt.

HUBBAR:
${hubLines}

Returnera EXAKT JSON, inget annat, ingen markdown:
{"<path>": {"title":"...","description":"..."}, ... alla paths ...}`;

  const raw = await callHaiku(prompt);
  return JSON.parse(raw) as Record<string, Gen>;
}

/** Skicka tillbaka för-långa fält till Haiku för en stramare omskrivning. */
async function shorten(items: { path: string; kategori: string; title: string; description: string }[]): Promise<Record<string, Gen>> {
  if (!items.length) return {};
  const lines = items.map((it) =>
    `${it.path} (kategori: ${it.kategori})\n  title(${it.title.length}): ${it.title}\n  desc(${it.description.length}): ${it.description}`,
  ).join('\n');
  const prompt = `Korta ner följande svenska meta-fält så att TITLE ≤ 60 tecken och DESCRIPTION ≤ 155 tecken, utan att tappa innebörd. Behåll separatorn " – " i titlar och STOR bokstav efter den. Returnera EXAKT JSON {"<path>":{"title":"...","description":"..."}, ...}:\n\n${lines}`;
  const raw = await callHaiku(prompt, 2000);
  return JSON.parse(raw) as Record<string, Gen>;
}

async function main() {
  const gen = await generate();

  // Slå ihop genererat + tvingade titlar, normalisera, validera.
  const result: Record<string, Gen> = {};
  for (const h of HUBS) {
    const g = gen[h.path];
    const forced = FORCED_TITLE[h.path];
    let title = forced ?? g?.title;
    let description = g?.description;
    if (!title || !description) {
      // Tvingad titel saknar ev. description i gen — bygg från D1-mönstret.
      if (forced && !description) description = `Vi har testat och recenserat de bästa AI-verktygen för ${h.kategori}. Hitta rätt verktyg för ditt behov.`;
      if (!title || !description) { console.error(`  saknar data: ${h.path}`); continue; }
    }
    result[h.path] = { title: normalizeTitle(title), description: upper1(description.trim()) };
  }

  // Andra passet: korta ner det som fortfarande bryter mot gränserna.
  const tooLong = HUBS
    .filter((h) => !FORCED_TITLE[h.path])
    .filter((h) => result[h.path] && (result[h.path].title.length > TITLE_MAX || result[h.path].description.length > DESC_MAX))
    .map((h) => ({ path: h.path, kategori: h.kategori, ...result[h.path] }));
  if (tooLong.length) {
    console.log(`\nKortar ner ${tooLong.length} fält som överskred gränsen…`);
    const fixed = await shorten(tooLong);
    for (const [path, g] of Object.entries(fixed)) {
      if (g.title) result[path].title = normalizeTitle(g.title);
      if (g.description) result[path].description = upper1(g.description.trim());
    }
  }

  // Rapportera + applicera.
  let ok = 0, warn = 0;
  for (const h of HUBS) {
    const r = result[h.path];
    if (!r) continue;
    const tFlag = r.title.length > TITLE_MAX ? ' ⚠TITLE' : '';
    const dFlag = r.description.length > DESC_MAX ? ' ⚠DESC' : '';
    if (tFlag || dFlag) warn++;
    console.log(`${h.path}\n  T(${r.title.length})${tFlag}: ${r.title}\n  D(${r.description.length})${dFlag}: ${r.description}`);
    if (!DRY) {
      const { error } = await db.from('articles')
        .update({ seo_title: r.title, seo_description: r.description })
        .eq('path', h.path);
      if (error) { console.error(`  FAIL: ${error.message}`); continue; }
    }
    ok++;
  }
  console.log(`\n${DRY ? '[DRY] ' : ''}${ok}/${HUBS.length} hubbar ${DRY ? 'genererade' : 'uppdaterade'}. ${warn ? `${warn} kvarstående varningar.` : 'Inga gränsöverskridanden.'}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
