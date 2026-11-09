/**
 * Lägger till en riskvarning i AI-trading-hubbens guide (överst) och alla dess
 * 10 recensioner (nederst) — samma typ av disclaimer som används på
 * cryptofeber.se. Skriven som vanlig, stylad HTML (inte data-block) eftersom
 * Hub-/ReviewTemplate inte kör expandBlocks() på content_mdx — bara
 * ArticleTemplate gör det.
 *
 *   npx tsx scripts/add-trading-risk-disclaimer.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const MARKER = 'Inte finansiell rådgivning';

// Gammal, trasig variant (data-block="callout" renderas aldrig i Hub-/Review-
// mallarna — visas bara som rå JSON-text) som skrevs i ett tidigare körning.
const OLD_DISCLAIMER = '<div data-block="callout">{"variant": "varning", "title": "Inte finansiell rådgivning", "text": ["Den här artikeln är allmän information om AI-verktyg, inte finansiell rådgivning eller en rekommendation att köpa, sälja eller handla med något specifikt instrument.", "Aktier och särskilt kryptovalutor kan svänga kraftigt i värde. Ingen AI-modell, inget betygsystem och ingen \\u201cträffsäkerhet\\u201d i backtester garanterar framtida resultat \\u2014 historiska siffror är inte en garanti för hur ett verktyg eller en strategi presterar framöver.", "Handlar du med riktiga pengar kan du förlora hela eller delar av ditt insatta kapital, särskilt vid hög hävstång eller automatiserad exekvering. Gör alltid din egen research och riskbedömning, och investera aldrig mer än du har råd att förlora."]}</div>';

const DISCLAIMER = `<div style="margin:24px 0;border:1px solid #fde68a;border-left:4px solid #d97706;border-radius:10px;padding:16px 20px;background:#fffbeb;">
<p style="margin:0 0 8px;font-weight:700;color:#92400e;">${MARKER}</p>
<p style="margin:0 0 8px;color:#78350f;">Den här artikeln är allmän information om AI-verktyg, inte finansiell rådgivning eller en rekommendation att köpa, sälja eller handla med något specifikt instrument.</p>
<p style="margin:0 0 8px;color:#78350f;">Aktier och särskilt kryptovalutor kan svänga kraftigt i värde. Ingen AI-modell, inget betygsystem och ingen &quot;träffsäkerhet&quot; i backtester garanterar framtida resultat &mdash; historiska siffror är ingen garanti för hur ett verktyg eller en strategi presterar framöver.</p>
<p style="margin:0;color:#78350f;">Handlar du med riktiga pengar kan du förlora hela eller delar av ditt insatta kapital, särskilt vid hög hävstång eller automatiserad exekvering. Gör alltid din egen research och riskbedömning, och investera aldrig mer än du har råd att förlora.</p>
</div>`;

function upsertDisclaimer(html: string, placement: 'top' | 'bottom'): string {
  let base = html;
  if (base.includes(OLD_DISCLAIMER)) base = base.replace(OLD_DISCLAIMER, '').trim();
  if (base.includes(MARKER)) return base; // redan rätt variant på plats
  return placement === 'top' ? `${DISCLAIMER}\n${base}` : `${base}\n${DISCLAIMER}`;
}

async function main() {
  const { data: hub, error: hubErr } = await db.from('articles').select('id,slug,content_mdx').eq('path', '/ai-verktyg/ai-trading').maybeSingle();
  if (hubErr) throw new Error(`fetch hub: ${hubErr.message}`);
  if (!hub) throw new Error('hub /ai-verktyg/ai-trading hittades inte');

  const newHub = upsertDisclaimer(hub.content_mdx ?? '', 'top');
  if (newHub !== hub.content_mdx) {
    const { error } = await db.from('articles').update({ content_mdx: newHub }).eq('id', hub.id);
    if (error) throw new Error(`update hub: ${error.message}`);
    console.log(`✓ hub ${hub.slug} — disclaimer uppdaterad`);
  } else {
    console.log('hub: redan korrekt, skippar');
  }

  const { data: reviews, error: revErr } = await db.from('articles').select('id,slug,content_mdx').eq('parent_slug', hub.slug);
  if (revErr) throw new Error(`fetch reviews: ${revErr.message}`);
  if (!reviews?.length) throw new Error('inga recensioner hittades under hubben');

  let n = 0;
  for (const r of reviews) {
    const newBody = upsertDisclaimer(r.content_mdx ?? '', 'bottom');
    if (newBody === r.content_mdx) { console.log(`  ${r.slug}: redan korrekt, skippar`); continue; }
    const { error } = await db.from('articles').update({ content_mdx: newBody }).eq('id', r.id);
    if (error) throw new Error(`update ${r.slug}: ${error.message}`);
    n++;
  }
  console.log(`✓ ${n}/${reviews.length} recensioner uppdaterade`);
}

main().catch((e) => { console.error(e); process.exit(1); });
