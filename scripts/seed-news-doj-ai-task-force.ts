/**
 * Nyhetsartikel: USA:s justitiedepartement bildar "Super Intelligence Task
 * Force" (5 november 2026). Verifierat mot DOJ:s egna pressmeddelande
 * (justice.gov) samt Decrypt och NextGov. Draft — väntar på featured_image
 * och godkännande innan publicering.
 *
 *   npx tsx scripts/seed-news-doj-ai-task-force.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const content_mdx = `
<p>USA:s justitiedepartement (DOJ) meddelade torsdagen den 5 november 2026 att man bildar en ny enhet: Super Intelligence Task Force, internt kallad DOJ-SITF. Uppdraget är brett formulerat — att skydda USA:s ledarskap inom avancerad AI ("super intelligence", SI, i departementets egen terminologi) från missbruk, samtidigt som man ska uppmuntra fortsatt innovation i branschen. Det är det senaste tecknet på att amerikanska myndigheter nu snabbt bygger upp dedikerade AI-enheter, snarare än att hantera AI-relaterade ärenden inom befintliga avdelningar.</p>

<h2>Vilka leder enheten?</h2>

<p>Task forcen co-leds av Associate Attorney General Stanley Woodward och Associate Deputy Attorney General Stephen Weiss. Den inrättades genom ett internt memo från justitieminister (Attorney General) Todd Blanche, daterat den 13 oktober 2026, och ska enligt DOJ fungera som departementets huvudsakliga kontaktpunkt mot den bredare "Super Intelligence Force" som leds av Jay Clayton — en koppling som medieuppgifterna beskriver något olika (Decrypt kallar honom tidigare ordförande för SEC, NextGov benämner honom på ett ställe National Intelligence Director), så exakt vilken roll han har utanför kopplingen till DOJ-enheten är inte helt entydigt beskrivet i källorna.</p>

<p>I DOJ:s eget pressmeddelande citeras justitieminister Todd Blanche: "SI development will continue to be powered by American innovators." President Trump citeras i samma release: "America stands at the forefront of a new technological revolution in intelligence." Woodward själv sammanfattar uppdraget: "Our comprehensive effort will promote innovation and prevent the misuse of Super Intelligence," medan Weiss lyfter fram att målet är att "ensure companies exercise vigorous internal controls so that SI technology behaves as intended."</p>

<h2>Vad är mandatet — och vilka är målen?</h2>

<p>Enligt DOJ:s pressmeddelande ska task forcen rikta in sig på tre typer av aktörer:</p>

<ul>
  <li><strong>Utländska statliga och statsstödda aktörer</strong> som försöker undergräva USA:s ledarskap inom AI.</li>
  <li><strong>Transnationella kriminella nätverk</strong> som använder avancerad AI i sin verksamhet.</li>
  <li><strong>Enskilda och företag som begår bedrägeri</strong> eller annan olaglig verksamhet med hjälp av AI-teknik — enligt Blanches egna exempel bland annat de som medvetet riktar in sig på amerikanska skattebetalare eller kritisk infrastruktur.</li>
</ul>

<p>Utöver den brottsbekämpande delen ska enheten enligt DOJ också samordna departementets civilrättsliga AI-relaterade processer, ta fram rekommendationer för vilka typer av AI-missbruk som bör prioriteras för åtal, och driva på att AI-utvecklare själva stärker sina interna kontroller och sin riskrapportering. DOJ ger inga konkreta uppgifter om budget, bemanning eller tidsram för arbetet.</p>

<h2>Vad den tar över — kopplingen till januari-enheten</h2>

<p>Super Intelligence Task Force ersätter inte en tidigare enhet, utan absorberar arbetet från "Artificial Intelligence Litigation Task Force" — en grupp som DOJ bildade redan i januari 2026 under dåvarande justitieminister Pam Bondi, och som bland annat användes för att utmana delstatliga AI-lagar. Den gruppens pågående civilrättsliga processer och ansvar tas nu över av den nya, bredare enheten.</p>

<p>Bildandet av task forcen sker också i en bredare kontext av snabbt tilltagande federal AI-aktivitet i USA under hösten 2026: Trump undertecknade i slutet av september en exekutivorder som instruerar federala myndigheter att konsekvent använda termen "super intelligence" i stället för AI, det amerikanska finansinspektionsorganet SEC har lagt till super intelligence som ett granskningsprioriterat område inför 2027, och banktillsynsmyndigheten OCC har publicerat sitt första AI-ramverk riktat mot banker.</p>

<h2>Vad det betyder</h2>

<p>Ingen av de granskade källorna rapporterar någon kritik eller några externa reaktioner på beskedet — det här är i nuläget enbart DOJ:s och Vita husets egen beskrivning av initiativet, inte en oberoende bedömning av hur effektivt det kommer bli i praktiken. Det departementet själva lyfter fram är främst avsikt och inriktning, inte konkreta verktyg eller resurser.</p>

<p>Det som däremot är tydligt är riktningen: amerikanska myndigheter bygger nu upp permanent, dedikerad kapacitet för att hantera AI som ett eget brottsbekämpnings- och tillsynsområde, snarare än att hantera enskilda AI-relaterade ärenden ad hoc inom befintliga avdelningar. För företag och utvecklare som verkar i eller mot den amerikanska marknaden är signalen att "vi hade inga interna kontroller för det här" sannolikt blir svårare att luta sig mot framöver — oavsett om man är ett kriminellt nätverk som task forcen uttryckligen är ut efter, eller ett legitimt bolag vars system missbrukas av tredje part. Läs mer om vilka risker som redan är verklighet i vår genomgång av <a href="/ai-verktyg/ai-sakerhet/">de bästa AI-verktygen för cybersäkerhet</a>.</p>
`.trim();

const row = {
  slug: 'doj-super-intelligence-task-force',
  title: 'USA:s justitiedepartement bildar ny Super Intelligence Task Force mot AI-missbruk',
  excerpt: 'DOJ har bildat en ny enhet, ledd av Associate AG Stanley Woodward och Associate Deputy AG Stephen Weiss, riktad mot AI-missbruk från utländska aktörer, kriminella nätverk och bedragare — och som tar över arbetet från januaris AI-litigationsenhet.',
  content_mdx,
  category: 'ai-sakerhet-etik',
  tags: ['AI-säkerhet', 'USA', 'reglering', 'DOJ', 'nyhet'],
  featured_image: null,
  og_image: null,
  type: 'post',
  path: '/doj-super-intelligence-task-force',
  parent_slug: null,
  affiliate_url: null,
  published_at: null,
  seo_title: 'USA:s DOJ bildar Super Intelligence Task Force mot AI-missbruk | AI-Magasinet',
  seo_description: 'DOJ har bildat en ny enhet riktad mot AI-missbruk från utländska aktörer, kriminella nätverk och bedragare — och tar över arbetet från januaris AI-litigationsenhet.',
  author_slug: 'sara-nilsson',
  faq: null,
};

async function main() {
  const { error } = await db.from('articles').insert([row]);
  if (error) { console.error('insert failed:', error.message); process.exit(1); }
  const { data, error: readErr } = await db.from('articles').select('slug, title, category, author_slug, published_at').eq('slug', row.slug).maybeSingle();
  if (readErr) { console.error(readErr.message); process.exit(1); }
  console.log('Insatt:', data);
}
main().catch((e) => { console.error(e); process.exit(1); });
