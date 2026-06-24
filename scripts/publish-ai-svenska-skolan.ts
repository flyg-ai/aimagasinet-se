/**
 * Publicerar den redaktionella featuren /ai-svenska-skolan-2026.
 * Speglar exakt strukturen på claude-fable-5-nedstangd: ArticleTemplate +
 * NewsArticle/Article/Speakable/Breadcrumb-JSON-LD från DB-fält.
 *
 * Fenomen-artikel om AI i skolan (statistik/policy/debatt/Skolverket) — INTE en
 * verktygslista. Inga specifika AI-verktyg nämns; interna länkar pekar mot de
 * praktiska sidorna (lärarguide + utbildningshub) som komplement, så de
 * förstärker varandra i stället för att kannibalisera.
 *
 * Handskrivet, strikt faktadisciplin: enbart Skolverkets lägesbild (26 maj 2026),
 * citat ordagrant, "åtta/sju/fyra av tio" återges som sådana (ej procent).
 *
 *   npx tsx scripts/publish-ai-svenska-skolan.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const SLUG = 'ai-svenska-skolan-2026';
const LOCAL_IMAGE = 'C:/Users/hallb/Desktop/ai-svenska-skolan-2026.png';
const REL = 'nofollow noopener noreferrer';

const PRESS = 'https://www.skolverket.se/om-skolverket/nyheter-och-pressmeddelanden/pressmeddelanden/pressmeddelanden/2026-05-26-skolverket-foljer-upp-ai-anvandningen-i-skolan';
const SKOLVERKET_AI = 'https://www.skolverket.se/ai';

const TITLE = 'Så förändrar AI den svenska skolan — åtta av tio lärare använder det nu';
const SEO_TITLE = 'Så förändrar AI den svenska skolan 2026';
const SEO_DESCRIPTION = 'Åtta av tio lärare använder nu AI i jobbet. Så förändrar AI den svenska skolan – planering, bedömning, fusk och Skolverkets nya råd.';
const EXCERPT = 'Nära åtta av tio lärare använder nu AI i sitt arbete, enligt Skolverkets nya lägesbild. Så snabbt har tekniken gått från nyhet till vardag i den svenska skolan — och så hanterar Skolverket fusk, bedömning och ett nytt skolämne.';
const TAGS = ['AI i skolan', 'Skolverket', 'utbildning', 'lärare', 'skolpolitik', 'nyhet'];

const CONTENT = `<p>Stockholm. Nära åtta av tio lärare använder nu AI i någon del av sitt arbete. Det framgår av Skolverkets andra <a href="${PRESS}" rel="${REL}">lägesbild om AI i skolan</a>, som myndigheten publicerade den 26 maj 2026 — en mätning som visar hur snabbt tekniken gått från nyhet till vardag i klassrummen.</p>

<p>Bilden bygger på enkätsvar från 368 lärare i Skolverkets lärarpanel, med tyngdpunkt på grundskola, förskoleklass och fritidshem. Myndigheten är noga med att påpeka att underlaget inte ger en nationellt representativ bild, utan en indikation på hur läget utvecklas. Men riktningen är tydlig: andelen lärare som använder AI har ökat sedan motsvarande mätning 2024, och användningen har spridit sig till nya delar av yrket.</p>

<h2>Vad lärarna faktiskt använder AI till</h2>

<p>Det vanligaste användningsområdet är planering och förberedelse av undervisning. Sju av tio lärare uppger att de använt AI för det minst en gång under höstterminen 2025 eller början av vårterminen 2026. Det handlar om att ta fram lektionsupplägg, variera uppgifter och få idéer till hur ett moment kan läggas upp.</p>

<p>Längre in i undervisningen blir AI mindre närvarande. I själva genomförandet av lektionerna, och i efterarbete som bedömning, är användningen mer begränsad. Däremot är administration och kommunikation ett område där tekniken fått snabbt fäste: lärare använder AI för att översätta, formulera mejl till vårdnadshavare och kollegor, skapa checklistor och sammanställa mötesanteckningar — sysslor som ligger runt omkring själva undervisningen.</p>

<p>Mönstret pekar mot att AI i första hand blivit ett verktyg för att spara tid i för- och efterarbetet, snarare än något som ännu förändrat mötet med eleverna i klassrummet. För den som vill se hur det praktiska arbetet kan se ut finns en separat genomgång i vår guide <a href="/ai-verktyg/utbildning/larare/">för dig som är lärare: så använder du AI i arbetet</a>.</p>

<h2>Eleverna kommer in i bilden</h2>

<p>Det är inte bara lärarna själva som använder AI. Fyra av tio lärare har nu initierat eller godkänt att deras elever använder AI-tjänster — en kraftig ökning från knappt två av tio i 2024 års mätning. Att låta elever arbeta med tekniken har alltså på kort tid gått från undantag till något som en betydande andel lärare aktivt tillåter eller uppmuntrar.</p>

<p>Användningen är vanligare på högstadiet än i de lägre årskurserna, vilket inte är förvånande givet uppgifternas karaktär. Samtidigt visar lägesbilden en mer oväntad förskjutning: ökningen av lärarnas egen AI-användning är störst i grundskolans lägre årskurser. Den tydliga skillnad mellan låg- och högstadielärare som fanns 2024 har därmed börjat jämnas ut.</p>

<p>"Bland de lärare som deltagit i båda undersökningarna ser vi att AI-användningen nu har jämnat ut sig mellan dessa grupper", säger Beatrice Pahv, undervisningsråd på Skolverket.</p>

<h2>Oron: fusk, skriftspråk och självständighet</h2>

<p>Entusiasmen är långt ifrån total. Många lärare ser fortsatt tydliga risker, framför allt kopplade till fusk och till en oreflekterad användning där tekniken används utan eftertanke. En del har redan anpassat sin undervisning och sina bedömningstillfällen för att möta problemet — exempelvis genom att lägga om hur och när elever får visa sina kunskaper.</p>

<p>En återkommande oro handlar om elevernas eget skriftspråk: att förmågan att formulera sig i skrift kan påverkas negativt, och att eleverna blir mindre självständiga om de lutar sig för tungt mot AI. Skolverket har i en tidigare bedömning under våren varnat för just detta — att elevers skriftliga förmåga kan påverkas när skriftliga inlämningar tas bort för att minska fuskrisken. Lösningen på ett problem riskerar med andra ord att skapa ett nytt.</p>

<p>"Oreflekterad användning av AI i undervisningen kan påverka både elevers lärande och deras förmåga att värdera kvalitet i AI-genererade material negativt", säger Niklas Leide, undervisningsråd på Skolverket.</p>

<h2>Skolverkets linje: komplement, inte ersättning</h2>

<p>Skolverkets besked är att AI ska ses som ett komplement, inte som en ersättning för lärarens arbete och bedömning. Konkret avråder myndigheten från att använda AI-genererade texter som betygsunderlag: kan läraren inte säkerställa att eleven själv producerat en text, bör den inte ligga till grund för betygsättning.</p>

<p>För att hantera vardagen rekommenderar myndigheten att varje skola tar fram nedskrivna riktlinjer för hur AI får användas, anpassade efter elevernas ålder och lärarnas kompetens. Stödmaterial för det arbetet finns samlat på myndighetens sida <a href="${SKOLVERKET_AI}" rel="${REL}">skolverket.se/ai</a>. Samtidigt visar lägesbilden att många lärare upplever att de står ensamma: stödet från huvudman och rektor brister, och riktlinjerna saknas ofta där de skulle behövas som mest.</p>

<p>Till bilden hör också fenomenet "skugg-AI" — system som används i skolans verksamhet utan att först ha granskats — som lyfts som ett växande problem. Och i bakgrunden finns EU:s AI-förordning, som ställer krav på transparens och riskklassning som även berör skolan. Regelverket runt tekniken håller med andra ord på att ta form samtidigt som användningen redan är utbredd.</p>

<h2>AI blir eget skolämne — men lärarna saknas</h2>

<p>Parallellt med att AI används som verktyg har det också blivit ett eget ämne. Ämnet artificiell intelligens har införts i gymnasieskolan och inom komvux — ett tecken på att tekniken nu betraktas som ett kunskapsområde i sin egen rätt, inte bara som ett hjälpmedel.</p>

<p>Problemet är att lärarna saknas. Det råder stor brist på behöriga lärare i det nya ämnet; mycket få i landet har formell behörighet att undervisa i det. Fortbildning pågår, men med ett begränsat antal platser, vilket innebär att utbyggnaden av ämnet riskerar att bromsas av just kompetensförsörjningen. Att införa ett ämne går snabbare än att utbilda dem som ska undervisa i det.</p>

<h2>Vad händer härnäst</h2>

<p>Lägesbilden ritar upp en utveckling som går fort men ojämnt. Tekniken är redan en del av många lärares vardag, medan ramverk, riktlinjer och kompetens fortfarande är under uppbyggnad. Mycket av det närmaste året lär därför handla om att låta det senare komma ifatt det förra.</p>

<p>Två frågor framstår som särskilt avgörande. Den ena är kompetensutveckling: om lärare ska kunna använda AI klokt — och bedöma elevernas användning — behöver fortbildningen nå bredare än i dag. Den andra är likvärdighet. När stöd, riktlinjer och resurser varierar mellan skolor och huvudmän finns en risk att elever möter mycket olika förutsättningar beroende på var de går. Hur den frågan hanteras avgör om AI blir en kraft som jämnar ut eller förstärker skillnader i skolan.</p>

<p>Det som lägesbilden inte kan svara på är hur djupt tekniken till slut förändrar själva undervisningen. Hittills syns AI tydligast i för- och efterarbetet, medan klassrummet i stort är sig likt. Om — och i så fall hur — den gränsen förskjuts framåt är en av de mer öppna frågorna, och något som kommande mätningar får utvisa.</p>

<p>För skolledare och lärare som vill omsätta detta i praktiskt arbete samlar vi konkreta verktyg och genomgångar i vår <a href="/ai-verktyg/utbildning/">hub för AI i utbildning</a>, och en bredare introduktion till tekniken finns i <a href="/ai-guiden/">AI-Guiden</a>.</p>

<p>Bilden som träder fram är varken larmrapport eller hyllning. AI erbjuder svenska lärare verkliga möjligheter att spara tid och variera undervisningen — men ställer samtidigt skarpa krav på omdöme, tydliga regler och likvärdig tillgång. Hur väl skolan lyckas förena de två kommer att avgöra vad tekniken betyder för eleverna. Vi följer utvecklingen.</p>`;

function wc(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

async function compressAndUpload(localPath: string, slug: string): Promise<string> {
  const orig = readFileSync(localPath);
  const webp = await sharp(orig).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${slug}.webp`;
  const { error } = await db.storage.from(BUCKET).upload(key, webp, { contentType: 'image/webp', upsert: true, cacheControl: '31536000' });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  console.log(`    ${basename(localPath)}  ${(orig.length / 1024).toFixed(0)}→${(webp.length / 1024).toFixed(0)}KB  → ${pub.publicUrl}`);
  return pub.publicUrl;
}

async function main() {
  // Kollisionskoll i körningen — stoppa om slug redan finns.
  const dupe = await db.from('articles').select('slug').eq('slug', SLUG);
  if (dupe.error) throw new Error(dupe.error.message);
  if ((dupe.data ?? []).length) throw new Error(`KOLLISION — ${SLUG} finns redan (avbryter)`);

  if (!existsSync(LOCAL_IMAGE)) throw new Error(`saknar hero-bild: ${LOCAL_IMAGE}`);
  console.log('1. Hero-bild…');
  const featured = await compressAndUpload(LOCAL_IMAGE, SLUG);

  console.log('2. Publicerar artikel…');
  const nowIso = new Date().toISOString();
  const row = {
    slug: SLUG,
    title: TITLE,
    excerpt: EXCERPT,
    content_mdx: CONTENT,
    category: 'ai-nyheter',
    tags: TAGS,
    featured_image: featured,
    type: 'post' as const,
    path: `/${SLUG}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    author_slug: null as string | null,
    published_at: nowIso,
    updated_at: nowIso,
    seo_title: SEO_TITLE,
    seo_description: SEO_DESCRIPTION,
  };
  const ins = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,slug,path,published_at');
  if (ins.error) throw new Error(`publish ${SLUG}: ${ins.error.message}`);
  console.log(`    ✓ id=${ins.data?.[0]?.id} ${ins.data?.[0]?.path}  published_at=${ins.data?.[0]?.published_at}  (${wc(CONTENT)} ord)`);
  if (SEO_TITLE.length > 60) console.warn(`    ⚠ seo_title ${SEO_TITLE.length} > 60`);
  if (SEO_DESCRIPTION.length > 155) console.warn(`    ⚠ seo_description ${SEO_DESCRIPTION.length} > 155`);

  // Sanity: inga kända verktygsnamn (kannibaliseringsskydd).
  const TOOLS = /chatgpt|claude|gemini|copilot|midjourney|perplexity|gpt-?[0-9]/i;
  if (TOOLS.test(CONTENT)) console.warn('    ⚠ möjligt verktygsnamn i texten — kontrollera!');
  else console.log('    ✓ inga specifika verktygsnamn i texten');

  console.log('\nKlart.');
}
main().catch((e) => { console.error(e); process.exit(1); });
