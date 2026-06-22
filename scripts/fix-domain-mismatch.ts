/**
 * Domän-mismatch-fixrunda (se doman-mismatch.md + doman-verifiering.md).
 *
 *   GRUPP 3 — avpublicera döda/påhittade (hård radering + 410 i middleware.ts):
 *     • klara-ai        — OVERIFIERAD produktidentitet (klara.se = arkitektkontor;
 *                         ingen bokförings-domän kunde webb-verifieras).
 *     • pattern89       — uppgått i Shutterstock, ingen egen produkt kvar.
 *     • replica-studios — tjänsten nedlagd 2025-06-30.
 *     Städar även inlänkar i bokforing- (klara) och annonser-bodyn (pattern89).
 *
 *   GRUPP 4 — flytta till rätt hub (rent metadata: path är flat /ai-verktyg/<slug>,
 *     så parent_slug-bytet ändrar INGEN URL → ingen redirect behövs):
 *     • gamma         hemsidebyggare → presentationer
 *     • khroma-design ai-bild-verktyg → ui-ux
 *     • obviously-ai  e-handel        → dataanalys
 *
 * Metod = hård radering (som scripts/cleanup-dead-tools.ts); 410 i middleware.ts
 * äger URL:erna. Ingen status-kolumn finns.
 *
 *   npx tsx scripts/fix-domain-mismatch.ts            (dry)
 *   npx tsx scripts/fix-domain-mismatch.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const DEAD = ['klara-ai', 'pattern89', 'replica-studios'];

const MOVES: { slug: string; to: string }[] = [
  { slug: 'gamma', to: 'presentationer' },
  { slug: 'khroma-design', to: 'ui-ux' },
  { slug: 'obviously-ai', to: 'dataanalys' },
];

// (path, regex, ersättning, etikett) — inlänkstädning i andra sidors body.
const BODY_EDITS: [string, RegExp, string, string][] = [
  [
    '/ai-verktyg/ekonomi/bokforing',
    / Det finns också nischade alternativ som <a href="\/ai-verktyg\/klara-ai">Klara<\/a>, som är optimerad för frilansare och konsulter med få men återkommande transaktionstyper\./,
    '',
    'bokforing: klara-ai-mening borttagen',
  ],
  [
    '/ai-verktyg/marknadsforing/annonser',
    /<p><a href="\/ai-verktyg\/pattern89">Pattern89<\/a> löser ett liknande problem men med starkare fokus på prediktiv analys: systemet bedömer en kreativs förväntade CTR och konverteringsfrekvens innan du publicerar\. Det minskar den tid och budget som annars går åt till att testa uppenbart svaga varianter\.<\/p>\n\n/,
    '',
    'annonser: pattern89-stycke borttaget',
  ],
];

async function cleanBodies() {
  for (const [path, re, repl, label] of BODY_EDITS) {
    const { data } = await db.from('articles').select('content_mdx').eq('path', path).maybeSingle();
    const html: string = data?.content_mdx ?? '';
    if (!html) { console.error(`✗ ingen content_mdx för ${path} — AVBRYTER`); process.exit(1); }
    if (!re.test(html)) { console.error(`✗ matchade INTE: ${label} — AVBRYTER (ingen text rörd)`); process.exit(1); }
    const next = html.replace(re, repl);
    console.log(`  ✓ ${label} (${html.length} → ${next.length} tecken)`);
    // Säkerhetskoll: ingen död länk kvar i denna body
    for (const slug of DEAD) {
      if (next.includes(`/ai-verktyg/${slug}`)) { console.error(`✗ kvarvarande död länk /ai-verktyg/${slug} i ${path} — AVBRYTER`); process.exit(1); }
    }
    if (APPLY) {
      const { error } = await db.from('articles').update({ content_mdx: next }).eq('path', path);
      if (error) { console.error('update content_mdx failed:', error.message); process.exit(1); }
      console.log(`    → uppdaterad`);
    }
  }
}

async function moveHubs() {
  for (const { slug, to } of MOVES) {
    const { data } = await db.from('articles').select('slug,parent_slug,path').eq('slug', slug).maybeSingle();
    if (!data) { console.error(`✗ hittade inte ${slug} — AVBRYTER`); process.exit(1); }
    console.log(`  ${slug}: parent_slug ${data.parent_slug} → ${to}  (URL ${data.path} oförändrad)`);
    if (APPLY) {
      const { error } = await db.from('articles').update({ parent_slug: to }).eq('slug', slug);
      if (error) { console.error('update parent_slug failed:', error.message); process.exit(1); }
      console.log(`    → flyttad`);
    }
  }
}

async function deleteRows() {
  const { data: rows } = await db.from('articles').select('slug,path').in('slug', DEAD);
  console.log(`  rader att radera (${rows?.length ?? 0}):`);
  (rows ?? []).forEach((r: any) => console.log(`    - ${r.path}`));
  if (APPLY) {
    const { data, error } = await db.from('articles').delete().in('slug', DEAD).select('slug');
    if (error) { console.error('delete failed:', error.message); process.exit(1); }
    console.log(`    ✓ raderade ${data?.length ?? 0} rader`);
  }
}

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY (kör med --apply) ===');
  console.log('\n1) Städar inlänkar i andra sidors body:');
  await cleanBodies();
  console.log('\n2) Flyttar verktyg till rätt hub (parent_slug):');
  await moveHubs();
  console.log('\n3) Raderar döda/påhittade rader:');
  await deleteRows();
  console.log('\nKlart.');
}
main();
