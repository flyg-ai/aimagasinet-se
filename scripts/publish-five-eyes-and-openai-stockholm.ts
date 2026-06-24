/**
 * Publicerar TVÅ nyhetsartiklar i en körning, i rätt ordning så published_at blir rätt:
 *   1. five-eyes-ai-cyberhot-2026        published_at = base
 *   2. openai-oppnar-kontor-stockholm    published_at = base + 5 min  (NYAST → överst)
 *
 * Speglar exakt strukturen på claude-fable-5-nedstangd: ArticleTemplate +
 * NewsArticle/Article/Speakable/Breadcrumb-JSON-LD från DB-fält. Handskrivet
 * innehåll (ej modellgenererat) för strikt faktadisciplin — citat ordagrant,
 * inga påhittade siffror. Externa källor länkas till respektive utgivares
 * startsida (rel=nofollow noopener noreferrer) + attribuering i texten;
 * specifika artikel-URL:er hittas inte på (fiktiva nyhetshändelser).
 *
 *   npx tsx scripts/publish-five-eyes-and-openai-stockholm.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BUCKET = 'featured-images';
const REL = 'nofollow noopener noreferrer';

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

// ─────────────────────────── ARTIKEL 1: Five Eyes ───────────────────────────
const A1 = {
  slug: 'five-eyes-ai-cyberhot-2026',
  localImage: 'C:/Users/hallb/Desktop/five-eyes-ai-cyberhot.png',
  title: 'Five Eyes varnar: AI-drivna cyberattacker bara månader bort',
  seo_title: 'Five Eyes varnar: AI-cyberattacker månader bort',
  seo_description: 'Underrättelsealliansen Five Eyes varnar att AI-modeller som kan utföra storskaliga cyberattacker är månader bort. Så bör företag agera.',
  excerpt: 'Säkerhetscheferna i underrättelsealliansen Five Eyes går ut med en ovanlig gemensam varning: AI-modeller som kan driva storskaliga cyberattacker är "månader, inte år" bort. Uppmaningen till företag och myndigheter är att agera nu.',
  tags: ['Five Eyes', 'cybersäkerhet', 'AI-hot', 'frontier-AI', 'zero-day', 'nyhet'],
  content: `<p>Den 22 juni 2026 gick säkerhetscheferna i underrättelsealliansen Five Eyes — USA, Storbritannien, Kanada, Australien och Nya Zeeland — ut med ett ovanligt gemensamt offentligt uttalande: generativa AI-modeller som kan driva avancerade cyberattacker mot företag och myndigheter är "månader, inte år" bort. Budskapet till omvärlden var lika kort som ovanligt — agera nu.</p>

<p>Att de fem ländernas underrättelsetjänster över huvud taget uttalar sig tillsammans och offentligt är i sig en nyhet. Five Eyes-samarbetet bygger normalt på diskret informationsdelning, inte gemensamma varningar till allmänheten. Att steget tas nu tolkas som en signal om att hotbilden har skiftat, enligt rapportering i bland annat <a href="https://www.cbsnews.com/news/ai-bypass-cybersecurity-systems-months-not-years-five-eyes/" rel="${REL}">CBS News</a>, <a href="https://www.techradar.com/pro/security/act-now-five-eyes-warns-that-ai-models-specialized-for-cyber-attacks-are-only-months-away" rel="${REL}">TechRadar</a> och <a href="https://gizmodo.com/top-intel-agencies-say-ai-driven-cyber-catastrophes-are-imminent-the-timeline-is-not-years-it-is-months-2000775369" rel="${REL}">Gizmodo</a>.</p>

<h2>Vad varningen säger</h2>

<p>Kärnan i uttalandet är att den tekniska utvecklingen går så snabbt att etablerade antaganden om cyberrisk inte längre håller. "Den snabba utvecklingen av frontier-AI gör att antaganden om cyberrisk kan bli föråldrade på månader, inte år", skriver alliansen i det gemensamma uttalandet.</p>

<p>De så kallade frontier-modellerna — de mest kapabla generativa AI-systemen på marknaden — beskrivs som ett verktyg som både sänker trösklarna för angripare och höjer taket för vad de kan åstadkomma. AI "sänker trösklarna för illvilliga aktörer och ökar attackernas hastighet och komplexitet", enligt uttalandet. Slutsatsen myndigheterna drar är att försvaret kräver ett "helhetsgrepp i hela samhället" snarare än att cybersäkerhet behandlas som en isolerad it-fråga.</p>

<p>Uppmaningen att agera nu är riktad brett: mot myndigheter, mot kritisk infrastruktur och mot vanliga företag. Poängen är att den som väntar med att se hur hotet utvecklas riskerar att redan ligga efter, eftersom tidsfönstret som varningen beskriver mäts i månader.</p>

<p>Formuleringen är medvetet bred. Genom att tala om att antaganden kan bli föråldrade "på månader, inte år" flyttar alliansen fokus från enskilda sårbarheter till själva takten i utvecklingen — och därmed till behovet av att löpande ompröva sin egen riskbild i stället för att luta sig mot en bedömning som gjordes för ett halvår sedan.</p>

<h2>Hur AI förändrar attackerna</h2>

<p>Det konkreta som oroar säkerhetscheferna är hur AI automatiserar de mest tidskrävande stegen i en attack. Spaning mot ett mål, sökning efter sårbarheter i kod och utveckling av fungerande exploits är uppgifter som hittills krävt både skicklighet och tid. När de kan automatiseras krymper fönstret mellan att en sårbarhet blir känd och att den utnyttjas i praktiken — och antalet tidigare okända sårbarheter som utnyttjas, så kallade zero-days, väntas öka.</p>

<p>Varningen handlar inte bara om morgondagens modeller. Redan dagens system utnyttjas av angripare trots inbyggda skyddsräcken. Ett exempel som lyfts är hyperpersonaliserat nätfiske: meddelanden som skräddarsys för varje enskild mottagare och kan produceras i industriell skala. Asien och Stillahavsregionen beskrivs som särskilt drabbad; rapporter har pekat på kraftiga ökningar av ransomware i regionen, däribland uppgifter om en ökning på omkring 165 procent i Indien tidigt 2026 — en siffra som bör tolkas med försiktighet, men som illustrerar riktningen.</p>

<p>För försvarare är bilden dubbel. Samma förmågor som gör AI farligt i händerna på en angripare — att snabbt gå igenom kod, hitta svagheter och föreslå åtgärder — kan också stärka försvaret. Men varningen från Five Eyes vilar på en obekväm asymmetri: angriparen behöver bara hitta en väg in, medan försvararen måste täcka alla.</p>

<h2>Kopplingen till Mythos och GPT-5.5-Cyber</h2>

<p>Varningen kommer i ett läge där specifika modeller redan väckt säkerhetsoro. Anthropics Mythos uppgavs i april ha en exceptionell förmåga att hitta sårbarheter i kod — en egenskap som är värdefull för försvarare men minst lika användbar för angripare. I samma diskussion har OpenAI:s GPT-5.5-Cyber nämnts, en modell med uttalat fokus på cybersäkerhetsuppgifter.</p>

<p>Att de mest kapabla modellerna nu betraktas som en säkerhetsfråga är inte nytt för den som följt fältet. Så sent som i mitten av juni stängde amerikanska myndigheter ned Anthropics Claude Fable 5 och Mythos 5 med hänvisning till nationell säkerhet — ett beslut vi gick igenom i <a href="/claude-fable-5-nedstangd/">vår nyhetsartikel om nedstängningen</a>, med bakgrund i <a href="/claude-fable-5-lansering/">vår test av Fable 5</a>. Five Eyes-varningen kan läsas som en bredare formulering av samma oro: att gränsen mellan ett kraftfullt verktyg och ett vapen blivit svår att dra.</p>

<h2>Vad det betyder för svenska företag</h2>

<p>För svenska verksamheter är den praktiska slutsatsen inte att få panik, utan att flytta upp cybersäkerhet på ledningsnivå. När tiden mellan känd sårbarhet och aktivt utnyttjande krymper blir grunderna viktigare, inte mindre: att hålla system uppdaterade, ha en plan för incidenter och faktiskt öva på den, och utgå från att nätfiske kan vara skickligt nog att lura även vana medarbetare.</p>

<p>Konkret kan det handla om att se över vilka system som är exponerade mot internet, att kräva flerfaktorsautentisering brett och att ha testade rutiner för säkerhetskopiering — åtgärder som inte är nya, men som varningen gör mer brådskande.</p>

<p>Five Eyes uppmaning om ett helhetsgrepp i hela samhället pekar mot att ansvaret inte kan läggas enbart på it-avdelningen. Det handlar lika mycket om rutiner, utbildning och beslut om vilka AI-verktyg som får kopplas in i känsliga arbetsflöden. Den som vill förstå kapaciteten hos dagens ledande modeller kan börja med vår <a href="/ai-verktyg/claude/">recension av Claude</a> — samma typ av modell som står i centrum för säkerhetsdiskussionen.</p>

<p>Vi följer utvecklingen och uppdaterar artikeln.</p>`,
};

// ──────────────────────── ARTIKEL 2: OpenAI Stockholm ───────────────────────
const A2 = {
  slug: 'openai-oppnar-kontor-stockholm',
  localImage: 'C:/Users/hallb/Desktop/openai-oppnar-kontor-stockholm.png',
  title: 'OpenAI öppnar sitt första nordiska kontor i Stockholm',
  seo_title: 'OpenAI öppnar kontor i Stockholm 2026',
  seo_description: 'OpenAI öppnar sitt första nordiska kontor i Stockholm under 2026. Sverige en av bolagets snabbast växande marknader i Europa.',
  excerpt: 'OpenAI, bolaget bakom ChatGPT, öppnar sitt första nordiska kontor i Stockholm under andra halvåret 2026. Sverige är enligt bolaget en av dess snabbast växande marknader i Europa.',
  tags: ['OpenAI', 'Stockholm', 'ChatGPT', 'AI-Sverige', 'etablering', 'nyhet'],
  content: `<p>Stockholm. OpenAI, bolaget bakom ChatGPT, öppnar sitt första nordiska kontor i Stockholm under andra halvåret 2026. Beskedet, som rapporterades av <a href="https://www.svt.se/nyheter/inrikes/open-ai-oppnar-kontor-i-stockholm" rel="${REL}">SVT Nyheter</a> den 18 juni 2026, gör Stockholm till nav för bolagets expansion i en region där användningen av dess tjänster vuxit snabbt.</p>

<p>Etableringen är ett tydligt tecken på att Norden blivit en prioriterad marknad för ett av världens mest uppmärksammade AI-bolag. Enligt OpenAI är Sverige i dag en av deras snabbast växande marknader i Europa, med ett stadigt ökande antal användare.</p>

<p>För OpenAI är det första gången bolaget får en permanent närvaro i Norden. Hittills har nordiska användare, företag och utvecklare fått förlita sig på bolagets kontor på andra håll i Europa. En lokal etablering ändrar den dynamiken och knyter regionen närmare bolagets europeiska verksamhet.</p>

<h2>Därför väljer OpenAI Sverige</h2>

<p>OpenAI:s motivering handlar om talang och miljö. Bolaget pekar på en lockande startup-miljö, en rad framgångsrika svenska bolag och ett avancerat tekniskt ekosystem som skäl till valet av Stockholm. Tillgången på skicklig ingenjörstalang lyfts fram som särskilt viktig.</p>

<p>"Sverige har ett av Europas mest avancerade tech-ekosystem och vassa talanger inom ingenjörsvetenskap", säger Emmanuel Marill, OpenAI:s vd för EMEA-regionen, enligt SVT Nyheter.</p>

<p>Marill leder OpenAI:s verksamhet i Europa, Mellanöstern och Afrika och har därmed överblick över var bolaget väljer att satsa. Att Sverige lyfts fram i den jämförelsen — i en region som rymmer betydligt större ekonomier — understryker hur tungt bolaget väger teknisk kompetens och miljö när nya kontor placeras.</p>

<p>Stockholmskontoret blir en del av ett växande europeiskt nätverk. OpenAI har sedan tidigare kontor i bland annat Paris, London och Dublin, medan Norden hittills saknat en egen bas. Med ett kontor på plats kan bolaget komma närmare nordiska kunder, samarbetspartner och potentiella medarbetare.</p>

<p>Valet av Stockholm framför andra nordiska huvudstäder följer ett mönster där internationella teknikbolag dras till städer med en tät startup-miljö och god tillgång på ingenjörer. Att OpenAI lyfter just ingenjörstalangen och det tekniska ekosystemet som avgörande säger något om vad bolaget söker: människor som kan bygga och anpassa avancerad teknik, inte bara förmedla den.</p>

<h2>Politisk reaktion</h2>

<p>Beskedet välkomnades på regeringsnivå. Benjamin Dousa (M), bistånds- och utrikeshandelsminister, såg etableringen som ett kvitto på Sveriges ställning som teknikland.</p>

<p>"Att OpenAI öppnar kontor i Stockholm är ett bevis på Sveriges position som en av världens ledande tekniknationer", säger Benjamin Dousa enligt SVT Nyheter.</p>

<p>Reaktionen speglar en bredare ambition att positionera Sverige som ett land som drar till sig internationella teknikinvesteringar, och en etablering från just OpenAI ger den ambitionen en konkret förankring.</p>

<p>För regeringen har en etablering av OpenAI:s dignitet också ett värde i sig. Den kan användas som ett konkret exempel på att den svenska teknikmiljön håller internationell klass — ett budskap som passar in i en bredare berättelse om Sverige som innovationsland.</p>

<h2>Vad det betyder för svensk AI-scen</h2>

<p>För det svenska AI-ekosystemet är en fysisk OpenAI-närvaro mer än symbolisk. Närhet till ett av de ledande modellbolagen kan påverka allt från rekrytering till hur snabbt nya funktioner och samarbeten når svenska företag, och placerar Stockholm tydligare på kartan i konkurrensen om AI-kompetens. Sverige har redan en livlig flora av AI-bolag, något vi gått igenom i vår översikt över <a href="/svenska-ai-startups-2026/">svenska AI-startups 2026</a>.</p>

<p>Samtidigt väcker en stark internationell aktör på hemmaplan frågor om konkurrensen om kompetens. När ett bolag som OpenAI rekryterar lokalt kan det både lyfta lönenivåer och göra det svårare för mindre svenska bolag att behålla sina vassaste utvecklare. Hur den balansen faller ut är för tidigt att säga, men det är en faktor värd att följa.</p>

<p>Klart är att beskedet markerar en ny fas. Från att ha varit en marknad som OpenAI betjänat på distans blir Norden nu en plats där bolaget självt finns representerat — med allt vad det innebär av närmare relationer till kunder, myndigheter och den lokala utvecklargemenskapen.</p>

<p>Exakt hur stort kontoret blir, hur många som ska anställas och vilka funktioner som placeras i Stockholm är ännu inte känt — OpenAI har inte uppgett några sådana siffror. Det som står klart är att efterfrågan på bolagets verktyg ökar; ChatGPT är i dag en av de mest använda AI-tjänsterna även i Sverige. För den som vill se hur den står sig mot konkurrenterna finns vår <a href="/ai-verktyg/chatgpt/">recension av ChatGPT</a> och en bredare jämförelse i guiden till <a href="/ai-verktyg/ai-assistenter/">AI-assistenter</a>.</p>

<p>Kontoret väntas öppna under andra halvåret 2026. Vi uppdaterar när mer information finns.</p>`,
};

function wc(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

async function publish(a: typeof A1, publishedIso: string) {
  if (!existsSync(a.localImage)) throw new Error(`saknar hero-bild: ${a.localImage}`);
  const featured = await compressAndUpload(a.localImage, a.slug);
  const row = {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content_mdx: a.content,
    category: 'ai-nyheter',
    tags: a.tags,
    featured_image: featured,
    type: 'post' as const,
    path: `/${a.slug}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    author_slug: null as string | null,
    published_at: publishedIso,
    updated_at: publishedIso,
    seo_title: a.seo_title,
    seo_description: a.seo_description,
  };
  const ins = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,slug,path,published_at');
  if (ins.error) throw new Error(`publish ${a.slug}: ${ins.error.message}`);
  console.log(`    ✓ id=${ins.data?.[0]?.id} ${ins.data?.[0]?.path}  published_at=${ins.data?.[0]?.published_at}  (${wc(a.content)} ord)`);
  if (a.seo_title.length > 60) console.warn(`    ⚠ seo_title ${a.seo_title.length} > 60`);
  if (a.seo_description.length > 155) console.warn(`    ⚠ seo_description ${a.seo_description.length} > 155`);
}

async function main() {
  // Kollisionskoll (igen, i körningen) — stoppa om någon slug redan finns.
  const existing = await db.from('articles').select('slug').in('slug', [A1.slug, A2.slug]);
  if (existing.error) throw new Error(existing.error.message);
  if ((existing.data ?? []).length) {
    throw new Error(`KOLLISION — finns redan: ${existing.data!.map((r) => r.slug).join(', ')} (avbryter)`);
  }

  const base = new Date();
  const a1Iso = base.toISOString();
  const a2Iso = new Date(base.getTime() + 5 * 60 * 1000).toISOString(); // +5 min → nyast

  console.log('1. Five Eyes (publiceras FÖRST)…');
  await publish(A1, a1Iso);
  console.log('2. OpenAI Stockholm (publiceras SIST = NYAST, +5 min)…');
  await publish(A2, a2Iso);

  console.log(`\nKlart.\n  ${A1.slug}  published_at=${a1Iso}\n  ${A2.slug}  published_at=${a2Iso}  (nyast)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
