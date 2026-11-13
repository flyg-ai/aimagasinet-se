/**
 * Lägger till en intern länk i /ai-verktyg/ai-kod-verktyg mot den nya
 * fristående artikeln om kodgranskning (basta-ai-for-kodgranskning-2026),
 * utan att ändra något annat på den redan publicerade, välrankade sidan.
 *
 *   npx tsx scripts/link-ai-kod-verktyg-to-kodgranskning.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const OLD = `<p>Att be ett AI-verktyg granska en pull request-diff ger inte samma djupa granskning som en erfaren kollega — det missar ofta arkitekturella problem och prestandakonsekvenser. Däremot är det bra på att hitta uppenbara buggar, peka ut saknad felhantering och generera docstrings för befintlig kod. Det fungerar som ett komplement till mänsklig granskning, inte en ersättning.</p>`;

const NEW = `<p>Att be ett AI-verktyg granska en pull request-diff ger inte samma djupa granskning som en erfaren kollega — det missar ofta arkitekturella problem och prestandakonsekvenser. Däremot är det bra på att hitta uppenbara buggar, peka ut saknad felhantering och generera docstrings för befintlig kod. Det fungerar som ett komplement till mänsklig granskning, inte en ersättning. Letar du specifikt efter verktyg dedikerade åt kodgranskning (PR-review) snarare än kodskrivning, som CodeRabbit, Qodo och Greptile? Se vår separata genomgång: <a href="/basta-ai-for-kodgranskning-2026">Bästa AI för kodgranskning 2026</a>.</p>`;

async function main() {
  const { data, error: fErr } = await db.from('articles').select('content_mdx').eq('slug', 'ai-kod-verktyg').single();
  if (fErr || !data) { console.error('fetch failed', fErr); process.exit(1); }
  if (!data.content_mdx.includes(OLD)) { console.error('OLD string not found — aborting'); process.exit(1); }
  const updated = data.content_mdx.replace(OLD, NEW);
  const { error } = await db.from('articles').update({ content_mdx: updated }).eq('slug', 'ai-kod-verktyg');
  if (error) { console.error(error); process.exit(1); }
  console.log('OK: länk tillagd i ai-kod-verktyg.');
}
main();
