/**
 * DEL B (STEG 5+6): differentiera metadata.
 * - 6 destinationshubbar: fånga BÅDE kategori- och yrkesintentionen.
 * - kod-hub: vinkla mot verktyg/jämförelse (produkt). utvecklare-guide: arbetsflöde.
 * - lägg hub→guide-länk i kod-hubbens content_mdx (guide→hub finns redan).
 *   npx tsx scripts/differentiate-meta.ts            (dry)
 *   npx tsx scripts/differentiate-meta.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

type Meta = { path: string; title: string; excerpt: string; seo_title: string; seo_description: string };
const META: Meta[] = [
  {
    path: '/ai-verktyg/kundservice',
    title: 'Bästa AI-verktygen för kundservice & kundtjänst 2026',
    excerpt: 'Bästa AI-verktygen för kundservice 2026 – Intercom Fin, Zendesk AI och Tidio för chatbottar, e-postsvar och röst-AI. Plus hur du som kundtjänstmedarbetare jobbar med ärendesammanfattning, routing och eskalering.',
    seo_title: 'AI för kundservice & kundtjänst 2026 – verktyg + guide',
    seo_description: 'Testade AI-verktyg för kundservice 2026 – chatbottar, e-postsvar och röst-AI – plus hur kundtjänst jobbar med ärenderouting och eskalering.',
  },
  {
    path: '/ai-verktyg/rekrytering',
    title: 'Bästa AI-verktygen för rekrytering & HR 2026 — för rekryterare',
    excerpt: 'Bästa AI-verktygen för rekrytering 2026 – Workday, Greenhouse, Eightfold och fler för CV-screening, jobbannonser och matchning. Plus hur du som rekryterare jobbar med sourcing, intervjuförberedelse och att minska partiskhet.',
    seo_title: 'AI för rekrytering & rekryterare 2026 – bästa verktygen',
    seo_description: 'Testade AI-verktyg för rekrytering 2026 – CV-screening, jobbannonser och matchning – plus hur rekryterare jobbar med sourcing, intervjuer och partiskhet.',
  },
  {
    path: '/ai-verktyg/marknadsforing',
    title: 'Bästa AI-verktygen för marknadsföring 2026 — för marknadsförare',
    excerpt: 'Bästa AI-verktygen för marknadsföring 2026 – ChatGPT, Jasper, Surfer SEO och fler för content, SEO, annonser och sociala medier. Plus hur du som marknadsförare bygger ett sammanhållet AI-stött marknadsflöde.',
    seo_title: 'AI för marknadsföring & marknadsförare 2026 – topp 10',
    seo_description: 'Testade AI-verktyg för marknadsföring 2026 – content, SEO, annonser och sociala medier – plus hur marknadsförare bygger ett AI-stött marknadsflöde.',
  },
  {
    path: '/ai-verktyg/juridik',
    title: 'Bästa AI-verktygen för juridik 2026 — för advokater & jurister',
    excerpt: 'Bästa AI-verktygen för juridik 2026 – Harvey AI, Spellbook, Luminance och fler för avtalsgranskning, due diligence och rättsutredningar. Plus hur du som advokat hanterar tystnadsplikt, sekretess och dokumentutkast med AI.',
    seo_title: 'AI för juridik & advokater 2026 – jämför verktyg',
    seo_description: 'Testade AI-verktyg för juridik 2026 – avtalsgranskning, due diligence och rättsutredning – plus hur du som advokat hanterar tystnadsplikt och sekretess.',
  },
  {
    path: '/ai-verktyg/ekonomi/bokforing',
    title: 'Bästa AI-verktygen för bokföring 2026 — för bokförare & byråer',
    excerpt: 'De bästa AI-verktygen för bokföring 2026 för svenska företag — automatisk kontering, kvittotolkning och avstämning. Plus hur du som bokförare jobbar med kvittoverktyg (Dext, Klippa), kundrådgivning och att skala byrån.',
    seo_title: 'AI för bokföring & bokförare 2026 – bästa verktygen',
    seo_description: 'Testade AI-verktyg för bokföring 2026 – automatisk kontering, kvittotolkning och avstämning – plus hur bokförare skalar byrån med AI och rådgivning.',
  },
  {
    path: '/ai-verktyg/ekonomi/redovisning',
    title: 'Bästa AI-verktygen för redovisning & revision 2026',
    excerpt: 'De bästa AI-verktygen för redovisning 2026 — månadsbokslut, avstämningsautomation och practice management för byråer. Plus hur du som revisor jobbar med dataanalys, stickprov (IDEA, MindBridge) och oberoende.',
    seo_title: 'AI för redovisning & revision 2026 – bästa verktygen',
    seo_description: 'Testade AI-verktyg för redovisning 2026 – månadsbokslut, avstämning och practice management – plus hur du som revisor jobbar med dataanalys och oberoende.',
  },
  // STEG 6 — kod-hub: produkt/jämförelse-vinkel (äger verktygssökningen)
  {
    path: '/ai-verktyg/ai-kod-verktyg',
    title: 'Bästa AI-kodverktygen 2026 — stor jämförelse, betyg & priser',
    excerpt: 'Jämförelse av de bästa AI-kodverktygen 2026 — Cursor, GitHub Copilot, Codeium, Windsurf och fler, rankade efter betyg, pris och funktioner.',
    seo_title: 'Bästa AI-kodverktygen 2026 – jämförelse & test',
    seo_description: 'Jämför de bästa AI-kodverktygen 2026 – Cursor, GitHub Copilot, Codeium med flera. Betyg, priser och funktioner sida vid sida.',
  },
  // STEG 6 — utvecklare-guide: arbetsflöde/how-to-vinkel (äger arbetsflödessökningen)
  {
    path: '/ai-verktyg/ai-kod-verktyg/utvecklare',
    title: 'Så använder du AI som utvecklare 2026',
    excerpt: 'Så jobbar du som utvecklare med AI i praktiken – kodkomplettering, refaktorering, felsökning, tester, dokumentation och code review, steg för steg.',
    seo_title: 'Så jobbar du som utvecklare med AI 2026',
    seo_description: 'Arbetsflödesguide för utvecklare: kodkomplettering, refaktorering, felsökning, tester och code review med AI – steg för steg, utan verktygshajp.',
  },
];

const HUB_TO_GUIDE = {
  path: '/ai-verktyg/ai-kod-verktyg',
  link: `\n<p>Vill du i stället veta hur du arbetar praktiskt med verktygen i vardagen? Läs vår arbetsflödesguide <a href="/ai-verktyg/ai-kod-verktyg/utvecklare/">Så använder du AI som utvecklare</a>.</p>`,
};

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY ===');
  let bad = 0;
  for (const m of META) {
    const tLen = m.seo_title.length, dLen = m.seo_description.length;
    const tFlag = tLen > 60 ? ' ✗>60' : '', dFlag = dLen > 155 ? ' ✗>155' : '';
    if (tFlag || dFlag) bad++;
    console.log(`\n${m.path}\n  seo_title(${tLen}${tFlag}): ${m.seo_title}\n  seo_desc(${dLen}${dFlag}): ${m.seo_description}`);
  }
  if (bad) { console.error(`\n✗ ${bad} fält över gränsen — AVBRYTER`); process.exit(1); }
  console.log('\nAlla fält inom gränser (seo_title ≤60, seo_description ≤155).');

  if (!APPLY) { console.log('\n(dry — kör med --apply)'); return; }
  for (const m of META) {
    const { error } = await db.from('articles').update({ title: m.title, excerpt: m.excerpt, seo_title: m.seo_title, seo_description: m.seo_description }).eq('path', m.path);
    if (error) { console.error(`update ${m.path}: ${error.message}`); process.exit(1); }
  }
  // hub→guide-länk (idempotent: lägg bara om den saknas)
  const { data: hub } = await db.from('articles').select('content_mdx').eq('path', HUB_TO_GUIDE.path).maybeSingle();
  const html = hub?.content_mdx ?? '';
  if (html && !html.includes('/ai-verktyg/ai-kod-verktyg/utvecklare/')) {
    const { error } = await db.from('articles').update({ content_mdx: html + HUB_TO_GUIDE.link }).eq('path', HUB_TO_GUIDE.path);
    if (error) { console.error(`hub→guide-länk: ${error.message}`); process.exit(1); }
    console.log('  ✓ hub→guide-länk tillagd i kod-hubbens content_mdx');
  } else {
    console.log('  • hub→guide-länk fanns redan / hub saknas');
  }
  console.log('Klart — metadata differentierad.');
}
main();
