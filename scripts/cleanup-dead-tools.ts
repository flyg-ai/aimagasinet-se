/**
 * Avpublicering av 4 uppdiktade/döda verktyg (se uppdiktade-verktyg.md):
 *   1. Städar inlänkar i redovisning-subhubbens content_mdx.
 *   2. Hård-raderar de 4 raderna (accountingai, accountingai-pro, reconcile-ai, height).
 *
 * Metod = hård radering (som scripts/delete-dubbletter.ts) eftersom sidorna ska
 * vara borta för gott (410 i middleware.ts äger URL:erna). Soft-unpublish skulle
 * lämna kvar påhittade rader i DB/sitemap. Det finns ingen `status`-kolumn.
 *
 *   npx tsx scripts/cleanup-dead-tools.ts            (dry)
 *   npx tsx scripts/cleanup-dead-tools.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const DEAD = ['accountingai', 'accountingai-pro', 'reconcile-ai', 'height'];
const REDOVISNING = '/ai-verktyg/ekonomi/redovisning';

// (regex, ersättning, etikett)
const EDITS: [RegExp, string, string][] = [
  [
    /<p><a href="\/ai-verktyg\/accountingai-pro">AccountingAI Pro<\/a>[\s\S]*?bästa AI-verktyg för bokföring 2026<\/a>\.<\/p>/,
    '<p>Läs mer om angränsande automationsfunktioner i vår guide till <a href="/ai-verktyg/ekonomi/bokforing">bästa AI-verktyg för bokföring 2026</a>.</p>',
    'p: AccountingAI Pro-stycke → trimmad bokföring-länk',
  ],
  [
    /<h2>Specialiserade avstämningsverktyg<\/h2>\s*<p>[\s\S]*?\/ai-verktyg\/reconcile-ai[\s\S]*?<\/p>/,
    '',
    'h2+p: hela "Specialiserade avstämningsverktyg"-sektionen (Reconcile AI)',
  ],
  [
    /<li><strong>Hög volym av månadsavstämningar\?<\/strong>[\s\S]*?\/ai-verktyg\/reconcile-ai[\s\S]*?<\/li>/,
    '',
    'li: Reconcile AI-rekommendation i handlingsplanen',
  ],
  [
    /<li><strong>Vill du strukturera hela byrådriften bättre\?<\/strong>[\s\S]*?<\/li>/,
    '<li><strong>Vill du strukturera hela byrådriften bättre?</strong> Titta på <a href="/ai-verktyg/taxdome-ai">TaxDome</a> med fokus på hur bra systemet hanterar just din typ av uppdragsmix.</li>',
    'li: AccountingAI Pro vs TaxDome → endast TaxDome',
  ],
];

async function cleanBody() {
  const { data } = await db.from('articles').select('content_mdx').eq('path', REDOVISNING).maybeSingle();
  let html: string = data?.content_mdx ?? '';
  if (!html) { console.error('✗ hittade ingen content_mdx för', REDOVISNING); process.exit(1); }
  const before = html.length;
  for (const [re, repl, label] of EDITS) {
    if (!re.test(html)) { console.error(`✗ matchade INTE: ${label} — AVBRYTER (ingen text rörd)`); process.exit(1); }
    html = html.replace(re, repl);
    console.log(`  ✓ ${label}`);
  }
  html = html.replace(/\n{3,}/g, '\n\n'); // städa ev. dubbla tomrader
  // Säkerhetskoll: inga döda länkar kvar
  for (const needle of ['/ai-verktyg/accountingai', '/ai-verktyg/reconcile-ai', '/ai-verktyg/height']) {
    if (html.includes(needle)) { console.error(`✗ kvarvarande död länk ${needle} — AVBRYTER`); process.exit(1); }
  }
  console.log(`  body: ${before} → ${html.length} tecken`);
  if (APPLY) {
    const { error } = await db.from('articles').update({ content_mdx: html }).eq('path', REDOVISNING);
    if (error) { console.error('update content_mdx failed:', error.message); process.exit(1); }
    console.log('  ✓ content_mdx uppdaterad');
  }
}

async function deleteRows() {
  const { data: rows } = await db.from('articles').select('slug,path').in('slug', DEAD);
  console.log(`\nRader att radera (${rows?.length ?? 0}):`);
  (rows ?? []).forEach((r: any) => console.log(`  - ${r.path}`));
  if (APPLY) {
    const { data, error } = await db.from('articles').delete().in('slug', DEAD).select('slug');
    if (error) { console.error('delete failed:', error.message); process.exit(1); }
    console.log(`  ✓ raderade ${data?.length ?? 0} rader`);
  }
}

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY (kör med --apply) ===');
  console.log('\n1) Städar redovisning-bodyn:');
  await cleanBody();
  console.log('\n2) Raderar rader:');
  await deleteRows();
}
main();
