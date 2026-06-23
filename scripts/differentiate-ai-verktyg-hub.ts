/**
 * Differentiera /ai-verktyg (hubb) mot /ai-verktyg/jamfor (jämförelseverktyg).
 * Slår INTE ihop, 301:ar inget — bara metadata + avduplicering av brödtext.
 *
 * Hubben ska äga "översikt / bästa / alla kategorier"; jamfor äger "jämför / X vs Y".
 *  1. seo_title: bort med "Jämför" → översikt/guide/kategorier.
 *  2. title (= H1 i MasterHubTemplate): upptäck/överblick, inte "jämför".
 *  3. excerpt (= ingress): bredd/kategorier/redaktionens val.
 *  4. seo_description: bredd/kategorier/redaktionens val.
 *  5. content_mdx: ta bort det stycke om "vanligt misstag ... jämför mot
 *     konkurrenterna på pris/integration/dataintegritet" som är (nästan)
 *     identiskt med jamfor-sidans SEO-text. Behåll hub→jamfor-länken via en
 *     kort, hub-vinklad mening. "Så väljer du rätt"-guiden lämnas orörd.
 *
 *   npx tsx scripts/differentiate-ai-verktyg-hub.ts            (dry)
 *   npx tsx scripts/differentiate-ai-verktyg-hub.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const PATH = '/ai-verktyg';

const SEO_TITLE = 'Bästa AI-verktygen 2026 — guide & alla kategorier';
const TITLE = 'Bästa AI-verktygen 2026 — översikt per kategori';
const EXCERPT = 'Din kompletta överblick över AI-verktygslandskapet 2026 — utforska alla kategorier från text och bild till kod och företag, med redaktionens toppval i varje.';
const SEO_DESCRIPTION = 'Utforska de bästa AI-verktygen 2026 samlade per kategori — text, bild, video, ljud, kod, företag och mer. Med redaktionens toppval och guide för att välja rätt.';

// Det (nästan) identiska stycket som även finns på jamfor-sidan (JAMFOR_SEO_HTML).
const DUP_PARA = '<p>Ett vanligt misstag är att välja det mest omtalade alternativet utan att jämföra det mot konkurrenterna på de parametrar som faktiskt spelar roll för dig: pris per användning, språkstöd, integrationsmöjligheter och dataintegritet. För att underlätta det arbetet kan du <a href="/ai-verktyg/jamfor/">jämföra AI-verktyg sida vid sida</a> i vårt jämförelseverktyg, där du väljer kategori och filtrerar på de egenskaper som är viktigast för ditt användningsfall.</p>';
// Ersätts av en kort mening som BEHÅLLER hub→jamfor-länken men utan den
// duplicerade "jämför mot konkurrenterna"-motiveringen (den hör hemma på jamfor).
const REPLACEMENT = '<p>Vill du ställa två verktyg mot varandra på betyg, pris och styrkor kan du <a href="/ai-verktyg/jamfor/">jämföra AI-verktyg sida vid sida</a> i vårt jämförelseverktyg.</p>';

function show(label: string, before: string | null, after: string) {
  console.log(`\n— ${label} —`);
  console.log(`FÖRE: ${JSON.stringify(before)}`);
  console.log(`EFTER: ${JSON.stringify(after)}`);
}

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY (kör med --apply) ===');
  const { data, error } = await db.from('articles')
    .select('id,seo_title,title,excerpt,seo_description,content_mdx').eq('path', PATH).maybeSingle();
  if (error || !data) { console.error('✗ kunde inte hämta', PATH, error?.message); process.exit(1); }

  show('seo_title', data.seo_title, SEO_TITLE);
  show('title (H1)', data.title, TITLE);
  show('excerpt (ingress)', data.excerpt, EXCERPT);
  show('seo_description', data.seo_description, SEO_DESCRIPTION);

  const html: string = data.content_mdx ?? '';
  if (!html.includes(DUP_PARA)) { console.error('\n✗ hittade INTE det duplicerade stycket ordagrant — AVBRYTER (ingen text rörd)'); process.exit(1); }
  const nextHtml = html.replace(DUP_PARA, REPLACEMENT);
  // Säkerhetskoll: dup-frasen borta, hub→jamfor-länk kvar.
  if (nextHtml.includes('jämföra det mot konkurrenterna på de parametrar')) { console.error('✗ dup-frasen finns kvar — AVBRYTER'); process.exit(1); }
  if (!nextHtml.includes('href="/ai-verktyg/jamfor/"')) { console.error('✗ hub→jamfor-länken försvann — AVBRYTER'); process.exit(1); }
  console.log('\n— content_mdx —');
  console.log(`  borttaget dup-stycke (${DUP_PARA.length} tecken) → kort cross-link (${REPLACEMENT.length} tecken)`);
  console.log(`  längd: ${html.length} → ${nextHtml.length}`);
  console.log('  hub→jamfor-länk: BEHÅLLEN');

  if (SEO_TITLE.length > 60) { console.error(`✗ seo_title ${SEO_TITLE.length} tecken > 60`); process.exit(1); }

  if (APPLY) {
    const { error: uErr } = await db.from('articles').update({
      seo_title: SEO_TITLE, title: TITLE, excerpt: EXCERPT, seo_description: SEO_DESCRIPTION, content_mdx: nextHtml,
    }).eq('id', data.id);
    if (uErr) { console.error('update misslyckades:', uErr.message); process.exit(1); }
    console.log('\n✓ /ai-verktyg uppdaterad.');
  } else {
    console.log('\n(DRY — inget skrivet.)');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
