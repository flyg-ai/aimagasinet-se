/**
 * Mergar /ai-verktyg/gratis/ai-bilder in i huvudhubben /ai-verktyg/ai-bild-verktyg
 * (GSC: gratis-sidan kannibaliserade huvudhubben på "ai bild/bilder" — pos 27,6
 * mot huvudhubbens pos 8,5 på samma fras, se kannibaliserings-analysen).
 *
 * 1. Fixar interna länkar (14 sidor) som pekade på den gamla sidan → pekar nu
 *    direkt på huvudhubben (undviker onödigt redirect-hopp).
 * 2. Avpublicerar den gamla gratis/ai-bilder-raden (plockas bort ur sitemap).
 * 3. Lägger till en "Gratis AI-bildverktyg"-sektion i huvudhubbens content_mdx.
 *
 * 301:an själv ligger i next.config.mjs.
 *
 *   npx tsx scripts/merge-gratis-ai-bilder-into-hub.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const OLD = '/ai-verktyg/gratis/ai-bilder';
const NEW = '/ai-verktyg/ai-bild-verktyg';

const GRATIS_SECTION = `
<h2>Gratis AI-bildverktyg</h2>
<p>Flera av verktygen ovan går att använda helt gratis, åtminstone i en begränsad form — bra att veta om ni bara vill testa innan ni betalar för en prenumeration:</p>
<ul>
<li><strong><a href="/ai-verktyg/bing-image-creator">Bing Image Creator</a></strong> — helt gratis, ingen kortuppgift krävs. Bygger på DALL-E 3 och är det mest generösa helt kostnadsfria alternativet.</li>
<li><strong><a href="/ai-verktyg/playground-ai">Playground AI</a></strong> — gratis gräns på bilder per dag, räcker bra för sporadiskt bruk.</li>
<li><strong><a href="/ai-verktyg/ideogram">Ideogram</a></strong> — gratisnivå med begränsat antal genereringar per dag, stark på text i bilder.</li>
<li><strong><a href="/ai-verktyg/leonardo-ai">Leonardo AI</a></strong> — dagliga gratiskrediter som räcker till en handfull bilder.</li>
<li><strong><a href="/ai-verktyg/canva-ai">Canva AI (Magic Studio)</a></strong> — ingår i Canvas gratisplan med begränsat antal AI-genereringar per månad.</li>
</ul>
<p>Verktyg som <a href="/ai-verktyg/midjourney">Midjourney</a>, <a href="/ai-verktyg/dalle-3">DALL-E 3</a> (fristående API) och <a href="/ai-verktyg/flux">Flux</a> saknar numera en riktigt användbar gratisnivå — där får ni räkna med att betala från första bilden.</p>
`;

async function main() {
  // 1. Fixa interna länkar
  const { data: linking, error: linkErr } = await db
    .from('articles')
    .select('slug,content_mdx')
    .ilike('content_mdx', `%${OLD}%`);
  if (linkErr) throw linkErr;

  for (const row of linking ?? []) {
    if (row.slug === 'ai-bild-verktyg') continue; // hanteras separat i steg 3
    const updated = row.content_mdx
      .split(`${OLD}/`).join(`${NEW}/`)
      .split(`"${OLD}"`).join(`"${NEW}"`);
    const { error } = await db.from('articles').update({ content_mdx: updated }).eq('slug', row.slug);
    if (error) { console.error(`Länkfix misslyckades för ${row.slug}:`, error); continue; }
    console.log(`Länk fixad: ${row.slug}`);
  }

  // 2. Avpublicera gamla sidan
  const { error: unpubErr } = await db
    .from('articles')
    .update({ published_at: null })
    .eq('path', OLD);
  if (unpubErr) console.error('Avpublicering misslyckades:', unpubErr);
  else console.log('Gamla gratis/ai-bilder avpublicerad.');

  // 3. Lägg till gratis-sektion i huvudhubben + fixa ev. självlänk
  const { data: hub, error: hubErr } = await db
    .from('articles')
    .select('content_mdx')
    .eq('slug', 'ai-bild-verktyg')
    .single();
  if (hubErr) throw hubErr;

  let hubContent = hub.content_mdx
    .split(`${OLD}/`).join(`${NEW}/`)
    .split(`"${OLD}"`).join(`"${NEW}"`);
  if (!hubContent.includes('Gratis AI-bildverktyg')) {
    hubContent += GRATIS_SECTION;
  }
  const { error: hubUpdErr } = await db
    .from('articles')
    .update({ content_mdx: hubContent })
    .eq('slug', 'ai-bild-verktyg');
  if (hubUpdErr) throw hubUpdErr;
  console.log('Huvudhubben uppdaterad med gratis-sektion.');
}
main().catch((e) => { console.error(e); process.exit(1); });
