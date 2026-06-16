/**
 * Publicerar nyhetsartikeln /claude-fable-5-nedstangd OCH lägger en
 * update-banner högst upp i den befintliga reviewn /claude-fable-5-lansering.
 *
 * Allt i en körning så det blir EN logisk ändring:
 *   1. Komprimerar hero-bilden (Desktop PNG → WebP q80, max 1200px) och laddar
 *      upp till featured-images/2026/06/claude-fable-5-nedstangd.webp.
 *   2. Upsertar den nya nyhetsartikeln (type=post, parent_slug=null).
 *   3. Prependar en idempotent update-notis i reviewns content_mdx + sätter
 *      updated_at = now (→ dateModified i JSON-LD).
 *
 * Innehållet är handskrivet (inte Sonnet-genererat) för att hålla den strikta
 * faktadisciplinen exakt — enbart verifierade fakta, källor Time/Fortune/
 * TechCrunch med riktiga URL:er.
 *
 *   npx tsx scripts/publish-claude-fable-5-nedstangd.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BUCKET = 'featured-images';
const DESKTOP = 'C:/Users/hallb/Desktop';
const NEW_SLUG = 'claude-fable-5-nedstangd';
const REVIEW_SLUG = 'claude-fable-5-lansering';
const LANSERING_IMAGE =
  'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/2026/06/claude-fable-5-recension.webp';

const TITLE = 'Claude Fable 5 nedstängd — USA stoppar Anthropics nya toppmodell';
const EXCERPT =
  'Bara dagar efter lanseringen är Anthropics nya toppmodell Claude Fable 5 — och systermodellen Mythos 5 — otillgänglig i hela världen. Orsaken är ett exportbeslut från USA:s regering som förbjuder alla utom amerikanska medborgare att använda modellerna.';
const SEO_TITLE = 'Claude Fable 5 nedstängd – USA stoppar Anthropic';
const SEO_DESCRIPTION =
  'USA:s regering tvingade Anthropic att stänga av Claude Fable 5 för alla utanför USA. Så gick det till – och vad det betyder för Sverige.';
const TAGS = ['Claude Fable 5', 'Mythos 5', 'Anthropic', 'exportkontroll', 'USA', 'nyhet'];

// Riktiga källor (verifierade via webbsök 16 juni 2026).
const TIME = 'https://time.com/article/2026/06/13/anthropic-fable-mythos-ban-US-security/';
const FORTUNE =
  'https://fortune.com/2026/06/13/anthropic-disables-fable-mythos-export-controls-national-security-threat/';
const TECHCRUNCH =
  'https://techcrunch.com/2026/06/13/amazon-ceo-reportedly-raised-anthropic-model-concerns-before-government-crackdown/';
const REL = 'nofollow noopener noreferrer';

const CONTENT = `<p>Bara tre dagar efter att Anthropic den 9 juni lanserade sin nya toppmodell Claude Fable 5 tvingades bolaget att stänga av den — tillsammans med systermodellen Mythos 5 — för samtliga användare i hela världen, sedan USA:s regering utfärdat ett exportkontroll-direktiv med hänvisning till nationell säkerhet.</p>

<p>Det är, såvitt känt, första gången amerikanska myndigheter använder exportkontroller för att dra tillbaka en kommersiell AI-modell som redan är i bred, publik användning. För svenska användare betyder beslutet att två av marknadens mest kapabla modeller från en dag till nästa inte längre går att nå.</p>

<h2>Så gick det till</h2>

<p>Den 9 juni släppte Anthropic Claude Fable 5 publikt, vid sidan av den mer begränsade Mythos 5. Mythos-class beskrevs som ett helt nytt toppnivå-tier ovanför bolagets tidigare Opus-serie — den kraftfullaste modellfamilj Anthropic dittills gjort allmänt tillgänglig. Fable 5 gjordes brett tillgänglig, medan Mythos 5 släpptes i mer begränsad form. Vill du läsa vår genomgång av modellen finns <a href="/claude-fable-5-lansering/">vår test av Fable 5</a> kvar att läsa.</p>

<p>Mottagandet blev snabbt stökigt. Redan inom 48 timmar efter lanseringen publicerade en forskare under aliaset "Pliny the Liberator" Fable 5:s systemprompt — modellens dolda grundinstruktioner — öppet på X och GitHub. Systemprompten är de instruktioner som styr hur en modell uppträder och var dess gränser går; när den läcker ut publikt får utomstående i praktiken en karta över modellens skyddsräcken, och därmed uppslag till hur de kan kringgås.</p>

<p>Under fredagen den 12 juni utfärdade USA:s handelsdepartement ett exportkontroll-direktiv som förbjöd alla som inte är amerikanska medborgare att använda Fable 5 och Mythos 5. Förbudet drogs brett: det omfattade både personer utanför USA och icke-medborgare inne i landet — inklusive Anthropics egna utländska anställda. Som skäl angavs nationell säkerhet. För att kunna följa ordern, utan att behöva sålla bort en stor del av sin egen användarbas och personal, valde Anthropic att stänga av båda modellerna globalt — för alla användare. Den 13 juni var nedstängningen ett faktum, enligt rapportering i bland annat <a href="${TIME}" rel="${REL}">Time</a> och <a href="${FORTUNE}" rel="${REL}">Fortune</a>.</p>

<h2>Varför USA grep in</h2>

<p>Utlösaren ska ha varit en säkerhetsupptäckt hos Amazon. Enligt <a href="${TECHCRUNCH}" rel="${REL}">TechCrunch</a> var det Amazons egna säkerhetsforskare som via prompter lyckades få Fable 5 att lämna ut spärrad information som kan användas i cyberattacker — en fråga som Amazons vd Andy Jassy lyfte mot regeringen. Wall Street Journal har rapporterat att det är just Amazons säkerhetsforskare som står bakom rapporten.</p>

<p>Lägg därtill den publika systemprompt-läckan, och bilden för myndigheterna blev en nyligen släppt modell som både är osedvanligt skicklig på att hitta sårbarheter i kod och vars skyddsspärrar visat sig gå att kringgå. Att en sådan modell hamnar i fokus för nationella säkerhetsfarhågor är inte förvånande — men att svaret blev en fullständig exportspärr på en redan publik produkt är ett nytt och dramatiskt steg.</p>

<p>Exportkontroller har historiskt riktats mot hårdvara — avancerade chip, tillverkningsutrustning och liknande fysiska komponenter. Att samma regelverk nu används mot en mjukvarumodell, och dessutom en som redan finns ute i bred publik användning, markerar ett principiellt skifte i hur amerikanska myndigheter betraktar de mest kapabla AI-modellerna: inte som vilken programvara som helst, utan som en strategisk tillgång i klass med exportkontrollerad teknik.</p>

<h2>Anthropics svar</h2>

<p>Anthropic beskriver beslutet som ett missförstånd. Bolaget menar att den påstådda säkerhetsbristen inte är allvarlig nog för att motivera en global nedstängning, och att man fått begränsad information om vad direktivet egentligen grundar sig på. Anthropic förhandlar nu med Vita huset för att få tillbaka åtkomsten, och teknisk personal har enligt uppgift rest till Washington för att reda ut situationen på plats.</p>

<p>För Anthropic står mycket på spel. Fable 5 och Mythos 5 var tänkta att vara bolagets nya flaggskepp och ett tydligt försprång gentemot konkurrenterna; att de släcks ned bara dagar efter lansering är både ett kommersiellt avbräck och en förtroendefråga gentemot de kunder som hunnit bygga in modellerna i sina system. Bolaget har understrukit att åtkomsten ska återställas så snart som möjligt. Hur lång den processen blir — och på vilka villkor modellerna i så fall får återvända — är i skrivande stund oklart.</p>

<h2>Vad betyder det för svenska användare</h2>

<p>Konkret: just nu går det inte att använda Claude Fable 5 eller Mythos 5 från Sverige. Förbudet träffar alla som inte är amerikanska medborgare, vilket i praktiken stänger ute hela den svenska användarbasen — företag, utvecklare och privatpersoner. Anthropics äldre modeller, som Opus 4.8, omfattas inte av beslutet, och för den som behöver ett alternativ finns andra toppmodeller som <a href="/gpt-5-recension-2026/">GPT-5</a> kvar. En djupare genomgång av Claude som plattform finns i vår <a href="/ai-verktyg/claude/">recension av Claude</a>.</p>

<p>Men händelsen blottlägger något större än ett tillfälligt avbrott. När en enskild regering med ett pennstreck kan släcka åtkomsten till de mest kapabla AI-modellerna — globalt, över en helg — uppstår frågan om ett europeiskt beroende av amerikansk AI. Kritiker har pekat på risken för en sorts "killswitch" i Vita huset: en knapp som kan stänga av verktyg som svenska verksamheter byggt in i sina arbetsflöden, utan att de själva har något att säga till om.</p>

<p>I förlängningen reser det farhågor om ett AI-världens A-lag och B-lag, där amerikanska användare får tillgång till den absoluta frontlinjen medan resten av världen hänvisas till äldre eller svagare modeller. För svenska företag som vägt in Fable 5 i sina planer är lärdomen obekväm men tydlig: tillgången till spjutspetsmodeller är inte garanterad, och beredskap för att kunna byta leverantör eller modell är inte längre en teoretisk fråga.</p>

<p>Vi uppdaterar artikeln när läget ändras.</p>`;

const BANNER_MARKER = '<!-- update-notice:nedstangd -->';
const BANNER = `${BANNER_MARKER}
<div class="not-prose my-6 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-5 py-4">
<span aria-hidden class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">!</span>
<p class="m-0 text-[15px] leading-relaxed text-fg"><strong>Uppdaterad 16 juni 2026:</strong> Claude Fable 5 är tillfälligt otillgänglig utanför USA efter ett exportbeslut från amerikanska regeringen. <a href="/claude-fable-5-nedstangd/" class="font-semibold text-indigo-700 underline">Läs mer i vår nyhetsartikel →</a></p>
</div>
`;

function findHeroImage(): string | null {
  const files = readdirSync(DESKTOP);
  // Matcha "Fable 5 ... Mythos 5 ... stängs ner ... usa.png" robust mot mellanslag.
  const hit = files.find(
    (f) =>
      /\.png$/i.test(f) &&
      /fable\s*5/i.test(f) &&
      /mythos/i.test(f) &&
      /(st[äa]ngs|usa)/i.test(f)
  );
  return hit ? join(DESKTOP, hit) : null;
}

async function compressAndUpload(localPath: string, slug: string): Promise<string> {
  const orig = readFileSync(localPath);
  const webp = await sharp(orig)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${slug}.webp`;
  const { error } = await db.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  console.log(
    `    ${basename(localPath)}  ${(orig.length / 1024).toFixed(0)}→${(webp.length / 1024).toFixed(0)}KB  → ${pub.publicUrl}`
  );
  return pub.publicUrl;
}

async function main() {
  const nowIso = new Date().toISOString();

  // ── 1. Hero-bild ────────────────────────────────────────────
  console.log('1. Hero-bild…');
  let featuredImage = LANSERING_IMAGE;
  let imageFlag = '';
  const hero = findHeroImage();
  if (hero) {
    featuredImage = await compressAndUpload(hero, NEW_SLUG);
  } else {
    imageFlag = 'INGEN bild hittad på Desktop — använder samma som lanseringsartikeln.';
    console.log(`    ⚠ ${imageFlag}`);
  }

  // ── 2. Ny nyhetsartikel ─────────────────────────────────────
  console.log('2. Upsertar nyhetsartikel…');
  const wordCount = CONTENT.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const row = {
    slug: NEW_SLUG,
    title: TITLE,
    excerpt: EXCERPT,
    content_mdx: CONTENT,
    category: 'ai-nyheter',
    tags: TAGS,
    featured_image: featuredImage,
    type: 'post' as const,
    path: `/${NEW_SLUG}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    author_slug: null as string | null,
    published_at: nowIso,
    updated_at: nowIso,
    seo_title: SEO_TITLE,
    seo_description: SEO_DESCRIPTION,
  };
  const ins = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,path,published_at');
  if (ins.error) throw new Error(`publish ${NEW_SLUG}: ${ins.error.message}`);
  console.log(`    ✓ id=${ins.data?.[0]?.id} ${ins.data?.[0]?.path} (${wordCount} ord)`);

  // ── 3. Update-banner på reviewn (idempotent) ────────────────
  console.log('3. Update-banner på reviewn…');
  const cur = await db.from('articles').select('content_mdx').eq('slug', REVIEW_SLUG).single();
  if (cur.error) throw new Error(`read ${REVIEW_SLUG}: ${cur.error.message}`);
  const existing = cur.data?.content_mdx ?? '';
  if (existing.includes(BANNER_MARKER)) {
    console.log('    • banner finns redan — hoppar över (men bumpar updated_at).');
  }
  const newContent = existing.includes(BANNER_MARKER) ? existing : `${BANNER}\n${existing}`;
  const upd = await db
    .from('articles')
    .update({ content_mdx: newContent, updated_at: nowIso })
    .eq('slug', REVIEW_SLUG)
    .select('id,updated_at');
  if (upd.error) throw new Error(`update ${REVIEW_SLUG}: ${upd.error.message}`);
  console.log(`    ✓ id=${upd.data?.[0]?.id} updated_at=${upd.data?.[0]?.updated_at}`);

  console.log('\nKlart.');
  if (imageFlag) console.log(`OBS: ${imageFlag}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
