/**
 * Stärker /ai-verktyg/crm — GSC visar pos 25–60+ på allt ("ai crm" pos 36,8,
 * "crm med ai" pos 55,3), trots 13k tecken innehåll. Grundorsak: bara 3 interna
 * länkar in till hubben i hela sajten (jmf ai-kod-verktyg: 13, ai-bild-verktyg: 29).
 *
 * 1. seo_title → matchar "ai crm" rakt av istället för "AI-verktyg för CRM".
 * 2. Ny H2-sektion i hubben som förklarar AI-CRM som koncept (matchar de
 *    förklarande long-tail-frågorna i GSC-datan).
 * 3. Länk tillbaka till hubben från alla 8 recensioner i klustret (saknades helt).
 * 4. Två naturliga cross-länkar från hubspot-ai och drift där CRM redan nämns.
 *
 *   npx tsx scripts/fix-crm-hub-seo.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const NEW_SEO_TITLE = 'Bästa AI CRM 2026 — topp 10 AI-drivna CRM-system';

const EXPLAINER_SECTION = `
<h2>Vad gör ett CRM med AI annorlunda?</h2>
<p>Ett vanligt CRM lagrar kontakter, affärer och historik — men kräver att säljare manuellt loggar samtal, uppdaterar statusar och skriver sammanfattningar. Ett AI-CRM gör en stor del av det jobbet åt er: det lyssnar på säljsamtal och skriver sammanfattningen automatiskt, föreslår nästa steg utifrån tidigare vunna affärer, flaggar affärer som riskerar att stanna av, och uppdaterar fält i CRM:et utan att någon öppnar systemet manuellt. Skillnaden märks mest i hur mycket administration säljare slipper — inte i vilka fält som finns i databasen.</p>
<p>De flesta etablerade CRM-system (HubSpot, Pipedrive, Zoho) har byggt på AI-lager ovanpå sina befintliga plattformar. Nyare utmanare som Attio och Folk är AI-drivna från grunden och passar team som bygger ett eget datamodell istället för att anpassa sig till ett färdigt system.</p>
`;

const BACKLINK_SENTENCE = (slug: string) =>
  `<p>Se hur det jämför sig mot de andra bästa alternativen i vår <a href="/ai-verktyg/crm">fullständiga jämförelse av AI CRM 2026</a>.</p>`;

const CRM_CHILDREN = [
  'monday-crm-ai', 'pipedrive-ai', 'freshsales-ai', 'attio',
  'breeze-ai', 'zoho-ai', 'close-ai', 'folk',
];

async function main() {
  // 1. seo_title
  const { error: titleErr } = await db.from('articles').update({ seo_title: NEW_SEO_TITLE }).eq('slug', 'crm');
  if (titleErr) throw titleErr;
  console.log('OK: seo_title uppdaterad');

  // 2. Explainer-sektion i hubben (infogas efter första h2, dvs tidigt i guiden)
  const { data: hub, error: hubErr } = await db.from('articles').select('content_mdx').eq('slug', 'crm').single();
  if (hubErr) throw hubErr;
  if (!hub.content_mdx.includes('Vad gör ett CRM med AI annorlunda?')) {
    const firstH2 = hub.content_mdx.indexOf('<h2>');
    const updated = firstH2 === -1
      ? hub.content_mdx + EXPLAINER_SECTION
      : hub.content_mdx.slice(0, firstH2) + EXPLAINER_SECTION + hub.content_mdx.slice(firstH2);
    const { error } = await db.from('articles').update({ content_mdx: updated }).eq('slug', 'crm');
    if (error) throw error;
    console.log('OK: förklarande sektion tillagd i hubben');
  }

  // 3. Backlänk i alla 8 klustersidor
  for (const slug of CRM_CHILDREN) {
    const { data, error } = await db.from('articles').select('content_mdx').eq('slug', slug).single();
    if (error) { console.error(`Hoppar ${slug}:`, error); continue; }
    if (data.content_mdx.includes('/ai-verktyg/crm')) { console.log(`${slug}: redan länkad, hoppar`); continue; }
    // Infoga efter första "intro"-stycket (andra <p>, efter betyg-stycket)
    const firstP = data.content_mdx.indexOf('</p>');
    const secondP = data.content_mdx.indexOf('</p>', firstP + 4);
    if (secondP === -1) { console.error(`${slug}: hittade inte intro-stycket, hoppar`); continue; }
    const insertAt = secondP + 4;
    const updated = data.content_mdx.slice(0, insertAt) + BACKLINK_SENTENCE(slug) + data.content_mdx.slice(insertAt);
    const { error: updErr } = await db.from('articles').update({ content_mdx: updated }).eq('slug', slug);
    if (updErr) { console.error(`Misslyckades ${slug}:`, updErr); continue; }
    console.log(`OK: backlänk tillagd i ${slug}`);
  }

  // 4. Cross-länkar från hubspot-ai och drift (befintlig CRM-text görs till länk)
  const crossLinks: [string, string, string][] = [
    ['hubspot-ai', 'HubSpot CRM', 'HubSpot <a href="/ai-verktyg/crm">CRM</a>'],
    ['drift', 'som CRM-kärna', 'som <a href="/ai-verktyg/crm">CRM</a>-kärna'],
  ];
  for (const [slug, find, replace] of crossLinks) {
    const { data, error } = await db.from('articles').select('content_mdx').eq('slug', slug).single();
    if (error) { console.error(`Hoppar ${slug}:`, error); continue; }
    if (!data.content_mdx.includes(find)) { console.error(`${slug}: hittade inte "${find}", hoppar`); continue; }
    if (data.content_mdx.includes('/ai-verktyg/crm')) { console.log(`${slug}: redan länkad, hoppar`); continue; }
    const updated = data.content_mdx.replace(find, replace);
    const { error: updErr } = await db.from('articles').update({ content_mdx: updated }).eq('slug', slug);
    if (updErr) { console.error(`Misslyckades ${slug}:`, updErr); continue; }
    console.log(`OK: cross-länk tillagd i ${slug}`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
