/**
 * Nyhetsartikel: Claude Fable 5.2 — vad skiljer den från Opus 5.5?
 * Fakta verifierade mot Anthropics egen lanseringssida + en oberoende analys
 * (llm-stats.com), 2026-11-11. published_at=null — väntar på granskning +
 * featured_image innan publicering.
 *
 *   npx tsx scripts/seed-news-fable-5-2.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const title = 'Claude Fable 5.2 är här — vad skiljer den egentligen från Opus 5.5?';
const excerpt =
  'Anthropic har släppt Claude Fable 5.2, en uppdatering som enligt bolaget är bäst på långa, öppna tekniska uppgifter — men som också kostar dubbelt så mycket per token som Opus 5.5. Vi reder ut vad som faktiskt skiljer dem åt.';

const content_mdx = `<p>Anthropic har släppt Claude Fable 5.2, tillsammans med systermodellen Claude Mythos 5.2 som bara erbjuds till verifierade organisationer. Om du använder Claude Code har du troligen redan sett notisen om uppdateringen — och lagt märke till varningen om att den "drar ner din användning snabbare än Opus 5.5". Det är ingen prestandaanmärkning: Fable 5.2 kostar helt enkelt dubbelt så mycket per token som Opus 5.5, så den äter upp en token-baserad kvot snabbare. Vi har gått igenom Anthropics egen lanseringssida och en oberoende analys för att se vad som faktiskt skiljer modellerna åt.</p>

<h2>Vad är nytt i Fable 5.2?</h2>
<p>Fable och Mythos 5.2 är enligt Anthropic samma underliggande modell — Mythos har bara striktare säkerhetsspärrar mot cyber- och biosäkerhetsrisker och är därför begränsad till verifierade organisationer, medan Fable är öppen för alla. Jämfört med föregångaren Fable 5.1 är den nya modellen både billigare och snabbare: 8 dollar per miljon input-token och 40 dollar per miljon output-token (ned från 10/50 dollar), med upp till 30 procent snabbare svar. Det finns även ett "fast mode" för upp till 2,5 gånger snabbare textgenerering, till 16/80 dollar per miljon token.</p>

<h2>Så jämför den sig mot Opus 5.5</h2>
<p>Enligt Anthropics egna siffror är skillnaden som störst på långa, öppna uppgifter. På Remote Labor Index — ett mått på hur stor andel av ett verkligt distansarbete modellen kan slutföra helt själv — landar Fable 5.2 på 41,3 procent mot Opus 5.5:s 21,3 procent. På agentisk kodning (FrontierSWE v2) ligger Fable 5.2 på 69,9 procent mot 62,3 för Opus 5.5.</p>
<p>På mer avgränsade kodningsuppgifter är skillnaden desto mindre — på Terminal-Bench 4.0 ligger modellerna nästan jämna (67,6 mot 66,4 procent), och på ProgramBench går Opus 5.5 faktiskt om (91,2 mot 85,6 procent). Den oberoende analyssajten llm-stats.com noterar att Fable 5.2 i deras granskning sprang slut på sitt kontextfönster innan den hann lämna in ett svar i hela 68 procent av ProgramBench-uppgifterna. Opus 5.5 behåller också ett övertag på rena kunskapsuppgifter — Anthropics egna Elo-mått GDPval-AA (1 866 mot 1 831) och AA-Briefcase (1 800 mot 1 785) ger båda Opus 5.5 ett litet försprång.</p>

<h2>Vad säger oberoende tester?</h2>
<p>De flesta sifforna i lanseringen kommer från Anthropic självt, och llm-stats.com påpekar att flera av jämförelsesiffrorna skiljer sig från hur konkurrenterna själva beskrivit sina resultat — headline-siffran på FrontierCode 2.0 (49,1 procent) bygger till exempel på en enda körning hos en partner, utan felmarginal angiven. Det oberoende testföretaget Vals AI har dock kört sitt eget index över 36 modeller och rankar Fable 5.2 som etta, med 71,31 procent — snäppet före Claude Sonnet 5.5 (70,85) och Googles Gemini 4 Carbon (70,45).</p>
<p>Fable 5.2 leder inte överallt: Gemini 4 Carbon vinner på AutomationBench (53,9 mot 51,4 procent), och på HealthBench presterar Fable 5.2 enligt llm-stats faktiskt sämre än föregångaren Fable 5.1.</p>

<h2>Vad betyder det här för dig?</h2>
<p>Anthropic positionerar själva Opus 5.5 som "den starkaste vardagsmodellen" för de flesta kodnings- och kunskapsuppgifter, medan Fable och Mythos 5.2 beskrivs som bäst för "de mest ambitiösa, öppna tekniska uppgifterna" — alltså långa, komplexa projekt snarare än snabba vardagsfrågor. Med dubbla priset per token och en tydlig fördel bara på just långa, agentiska uppgifter är Fable 5.2 ett verktyg att plocka fram för specifika, krävande jobb — inte en given uppgradering för allt du annars använder Opus eller Sonnet till.</p>
<p><em>Källor: <a href="https://www.anthropic.com/claude-fable-and-mythos-5-2">Anthropics egen lanseringssida</a> och <a href="https://llm-stats.com/blog/research/claude-fable-5-2-launch">llm-stats.com:s oberoende analys</a>.</em></p>`;

async function main() {
  const row = {
    slug: 'claude-fable-5-2-vs-opus-5-5',
    title,
    excerpt,
    content_mdx,
    category: 'teknik-modeller',
    tags: ['Anthropic', 'Claude', 'Fable 5.2', 'Opus 5.5', 'Nyhet'],
    featured_image: null,
    type: 'post',
    path: '/claude-fable-5-2-vs-opus-5-5',
    parent_slug: null,
    affiliate_url: null,
    published_at: null,
    seo_title: 'Claude Fable 5.2 vs Opus 5.5 — vad är skillnaden?',
    seo_description: excerpt,
    author_slug: 'erik-lindgren',
  };
  const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
  if (error) { console.error(error); process.exit(1); }
  console.log('OK: artikel upsertad, published_at=null — väntar på granskning + bild.');
}
main();
