/**
 * Byter de externa källänkarna i de två nya nyhetsartiklarna från utgivarnas
 * STARTSIDOR till exakta DJUPLÄNKAR. Rör inget annat: bara href-värdet byts,
 * rel="nofollow noopener noreferrer", länktext, prosa och tidsstämplar
 * (published_at/updated_at) lämnas orörda.
 *
 *   npx tsx scripts/fix-source-deeplinks.ts            (dry)
 *   npx tsx scripts/fix-source-deeplinks.ts --apply
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');

// slug → [ [från-href, till-href], ... ]  (matchas med avslutande citattecken
// så enbart startsidan träffas, aldrig en redan-djup URL).
const SWAPS: Record<string, [string, string][]> = {
  'five-eyes-ai-cyberhot-2026': [
    ['href="https://www.cbsnews.com/"', 'href="https://www.cbsnews.com/news/ai-bypass-cybersecurity-systems-months-not-years-five-eyes/"'],
    ['href="https://www.techradar.com/"', 'href="https://www.techradar.com/pro/security/act-now-five-eyes-warns-that-ai-models-specialized-for-cyber-attacks-are-only-months-away"'],
    ['href="https://gizmodo.com/"', 'href="https://gizmodo.com/top-intel-agencies-say-ai-driven-cyber-catastrophes-are-imminent-the-timeline-is-not-years-it-is-months-2000775369"'],
  ],
  'openai-oppnar-kontor-stockholm': [
    ['href="https://www.svt.se/nyheter/"', 'href="https://www.svt.se/nyheter/inrikes/open-ai-oppnar-kontor-i-stockholm"'],
  ],
};

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY (kör med --apply) ===');
  for (const [slug, swaps] of Object.entries(SWAPS)) {
    const { data, error } = await db.from('articles').select('id,content_mdx').eq('slug', slug).maybeSingle();
    if (error || !data) { console.error(`✗ kunde inte hämta ${slug}: ${error?.message}`); process.exit(1); }
    let html: string = data.content_mdx ?? '';
    console.log(`\n${slug}:`);
    for (const [from, to] of swaps) {
      const n = html.split(from).length - 1;
      if (n !== 1) { console.error(`  ✗ "${from}" hittades ${n} ggr (väntade 1) — AVBRYTER`); process.exit(1); }
      html = html.replace(from, to);
      // verifiera att rel ligger kvar direkt efter den nya href:en
      const i = html.indexOf(to);
      const after = html.slice(i + to.length, i + to.length + 40);
      if (!after.includes('rel="nofollow noopener noreferrer"')) { console.error(`  ✗ rel saknas efter ${to} — AVBRYTER`); process.exit(1); }
      console.log(`  ✓ ${from}\n      → ${to}  (rel kvar)`);
    }
    if (APPLY) {
      // content_mdx ENDAST — published_at/updated_at orörda.
      const { error: uErr } = await db.from('articles').update({ content_mdx: html }).eq('id', data.id);
      if (uErr) { console.error('  update misslyckades:', uErr.message); process.exit(1); }
      console.log('  → uppdaterad (endast content_mdx)');
    }
  }
  console.log(APPLY ? '\n✓ Klart.' : '\n(DRY — inget skrivet.)');
}
main().catch((e) => { console.error(e); process.exit(1); });
