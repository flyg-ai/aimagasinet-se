/**
 * wint-ai: skriv om DB-innehåll så det beskriver SVENSKA Wint AB (wint.se,
 * Göteborg, grundat 2011, automatiserad bokföring) — inte det amerikanska
 * vatten-IoT-/controller-bolaget. Webb-verifierade fakta (doman-verifiering.md).
 * Uppdaterar title, excerpt, content_mdx. Betyg utelämnat tills ombedömning.
 *
 *   npx tsx scripts/fix-wint-content.ts            (dry)
 *   npx tsx scripts/fix-wint-content.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

const TITLE = 'Wint — helautomatiserad bokföring för aktiebolag';
const EXCERPT = 'Svensk tjänst som automatiserar bokföring, bokslut och deklaration för aktiebolag.';
const CONTENT = `<h2>Vår analys av Wint</h2>
<p>Wint är en svensk automatiserad ekonomitjänst som kombinerar bokföringsprogram och redovisningsbyrå i ett — AI sköter löpande bokföring, kvitto- och fakturahantering, betalningar, moms, lön samt bokslut och deklaration. Wint är ett av de verktyg vi lyfter fram inom bokföring, särskilt för aktiebolag som vill automatisera hela ekonomin.</p>
<p>Wint (Wint AB) grundades 2011 och har sitt huvudkontor i Göteborg. Bolaget förvärvades 2024 av riskkapitalbolaget Norvestor och har omkring 5 000 företagskunder. Verktyget utmärker sig framför allt på helautomatiserad bokföring för aktiebolag. Vi har ännu inte satt något sammanvägt betyg på Wint — en ny bedömning görs inför nästa testomgång.</p>

<h2>Funktioner som spelar roll</h2>
<ul>
  <li>Automatisk bokföring och kontering</li>
  <li>Kvitto- och fakturahantering</li>
  <li>Moms- och skattedeklaration</li>
  <li>Bokslut och årsredovisning</li>
  <li>Lönehantering</li>
</ul>

<h2>Användningsområden</h2>
<ul>
  <li>Löpande bokföring</li>
  <li>Kvitto- och fakturahantering</li>
  <li>Moms- och skatterapportering</li>
  <li>Bokslut och deklaration</li>
  <li>Lönehantering</li>
</ul>

<h2>Styrkor</h2>
<ul>
  <li>Svensk tjänst med svensk support</li>
  <li>Kombinerar bokföringsprogram och byrå i ett</li>
  <li>Heltäckande för aktiebolag — från bokföring till deklaration</li>
</ul>

<h2>Svagheter</h2>
<ul>
  <li>Främst inriktat på aktiebolag</li>
  <li>Mindre lämpligt om du vill sköta bokföringen själv i ett traditionellt program</li>
</ul>

<h2>Vem passar Wint för?</h2>
<p>Aktiebolag som vill automatisera hela ekonomin och slippa både eget bokföringsprogram och separat redovisningsbyrå. Om du istället vill sköta bokföringen själv i ett traditionellt program kan det vara värt att jämföra med övriga verktyg i topplistan ovan innan du tecknar abonnemang.</p>

<h2>Prismodell</h2>
<p>Från 699 kr/mån.</p>

<h2>Slutsats</h2>
<p>Wint är en heltäckande svensk lösning för aktiebolag som vill låta AI och en digital byrå sköta löpande bokföring, bokslut och deklaration. Vi placerar Wint som <strong>Bäst för helautomatiserad bokföring</strong>. Ett sammanvägt betyg sätts inför nästa testomgång.</p>`;

// Inget av detta får finnas kvar (fel bolag / fel pris / borttaget betyg).
const FORBIDDEN = ['Tel Aviv', 'Israel', 'controller', 'Controller', 'USD', 'vatten', 'IoT', 'av 10', 'mid-market', 'Anomaly'];

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY (kör med --apply) ===');
  const { data, error } = await db.from('articles').select('slug,title,excerpt,content_mdx').eq('slug', 'wint-ai').maybeSingle();
  if (error) { console.error('select failed:', error.message); process.exit(1); }
  if (!data) { console.error('✗ wint-ai saknas i DB — AVBRYTER'); process.exit(1); }

  for (const bad of FORBIDDEN) {
    if (TITLE.includes(bad) || EXCERPT.includes(bad) || CONTENT.includes(bad)) {
      console.error(`✗ nytt innehåll innehåller förbjuden term "${bad}" — AVBRYTER`); process.exit(1);
    }
  }
  console.log('  ✓ nytt innehåll fritt från förbjudna termer');
  console.log(`  title : ${data.title}\n        → ${TITLE}`);
  console.log(`  excerpt: ${data.excerpt}\n        → ${EXCERPT}`);
  console.log(`  content_mdx: ${data.content_mdx?.length ?? 0} → ${CONTENT.length} tecken`);
  console.log('  faq: → null (beskrev fel produkt; regenereras mot ny text via generate-faqs.ts)');

  if (APPLY) {
    const { error: uErr } = await db.from('articles')
      .update({ title: TITLE, excerpt: EXCERPT, content_mdx: CONTENT, faq: null })
      .eq('slug', 'wint-ai');
    if (uErr) { console.error('update failed:', uErr.message); process.exit(1); }
    console.log('  ✓ wint-ai uppdaterad');
  }
}
main();
