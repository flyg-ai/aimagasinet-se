/**
 * Nyhetsartikel: Nvidia utan Jensen Huang — vad betyder det för AI-hårdvarumarknaden
 * och Kina-exporten. Fokus på marknad/export, inte den personliga skandalen (nämns
 * kort som kontext för VD-bytet).
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx -r dotenv/config scripts/seed-nvidia-huang-china-chips.ts dotenv_config_path=.env.local
 */
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const title = 'Nvidia utan Jensen Huang: vad VD-bytet betyder för AI-hårdvarumarknaden och Kina-exporten';
const excerpt =
  'Dagar efter att Jensen Huang petades som Nvidia-VD stoppade bolaget helt sin kinesiska chipförsäljning — en vändning som accelererar en marknadsandelsförskjutning som redan pågått hela 2026. Vi går igenom vad som faktiskt hänt och vad det betyder för AI-hårdvarumarknaden.';

const content_mdx = `<p>Den 12 november 2026 avgick Jensen Huang som vd och styrelseledamot i Nvidia, med omedelbar verkan. Bakgrunden är enligt flera samstämmiga medierapporter en styrelseutredning kring uppgivna utomäktenskapliga relationer, där en av de inblandade enligt amerikansk underrättelsetjänst misstänks ha spionerat för Peking — uppgifter som varken Nvidia eller Huang själv bekräftat i någon offentlig kommentar, och som Justitiedepartementet enligt uppgift utreder separat. CFO Colette Kress är tillförordnad vd medan styrelsen söker en permanent ersättare, och Harvey C. Jones har utsetts till bolagets första styrelseordförande.</p>

<p>Den delen av historien har fått stor uppmärksamhet. Den mer underbyggda — och för er som jobbar med AI-infrastruktur mer relevanta — delen är vad som hänt med Nvidias Kina-affär i veckorna efter avgången, och vad det säger om hur beroende hela AI-hårdvarumarknaden var av en enskild person.</p>

<h2>Nvidia stoppar Kina-försäljningen helt</h2>
<p>På kvartalsrapporten den 17 november 2026 meddelade Kress att Nvidia helt slutat leverera sina licensierade Hopper-baserade datacenterchip, inklusive H200, till Kina — och därmed avslutat sin del i det som flera bevakare kallat ett kryphål i den amerikanska exportbegränsningen mot avancerade AI-chip. Nvidia bokförde 2,4 miljarder dollar i Kina-försäljning av licensierad Hopper-hårdvara under bolagets tredje fiskala kvartal, och den kommande guidningen räknar inte in någon sådan affär alls framöver. Kress gav ingen förklaring till beslutet och sa inte om pausen är permanent.</p>
<p>Flera bevakare kopplar beslutet till nya amerikanska regler som begränsar avancerade datacenterchip för kinesiska aktörer med fjärråtkomst till dem — men pekar samtidigt på en mer uppenbar förklaring: Huang hade personligen förhandlat fram Kina-tillgången med Trump-administrationen, enligt uppgift kopplad till en tullöverenskommelse på 25 procent. Hans efterträdare vände om beslutet inom dagar efter att han lämnat posten, vilket flera analytiker tolkar som att den interna påtryckaren för fortsatt Kina-handel helt enkelt inte längre finns kvar i ledningen.</p>

<h2>Marknadsandelen i Kina har redan rasat hela 2026 — oberoende av VD-bytet</h2>
<p>Det här är inte en ny trend som uppstod med VD-bytet, utan en accelererande fortsättning på något som redan pågått hela året. Enligt IDC-data, rapporterad av Reuters i oktober, föll Nvidias andel av Kinas datacenter-AI-chipmarknad till 34 procent under första halvåret 2026, ner från 55 procent för helåret 2025. Under samma period nästan fördubblade Huawei sina leveranser av Ascend-chip till 572 000 enheter, vilket gav bolaget en marknadsandel på 28 procent — en lucka på bara sex procentenheter, jämfört med 31 procentenheter ett år tidigare.</p>
<p>Huaweis egen ledning har gått längre och hävdat att Ascend redan passerat Nvidia, men utan att publicera några jämförande prestandasiffror — och IDC:s egen mätning placerar fortfarande Huawei sex poäng efter, inte före. Investmentbanken Bernstein har däremot gått ut med en betydligt mer dramatisk prognos: enligt deras modell kan Nvidias Kina-andel falla till omkring 8 procent vid årsskiftet, med Huawei runt 50 procent. Det är viktigt att hålla isär: Bernsteins siffror är en prognos för årsskiftet, inte ett uppmätt nuläge, och bygger dessutom på en annan utgångspunkt (40 procent för 2025) än IDC:s 55 procent.</p>

<h2>Starka siffror, fallande aktie — och en fråga om bolagets sårbarhet</h2>
<p>Paradoxalt nog levererade Nvidia sitt första kvartal utan Huang bättre siffror än väntat: 115,8 miljarder dollar i intäkter mot analytikernas förväntade 109,1 miljarder, och bolaget höjde sin tillväxtprognos för räkenskapsåret 2028 till 75 procent från tidigare 70 — trots att Kina helt exkluderats ur datacenterprognosen. Ändå föll aktien, med rapporter om en nedgång på runt 30 procent i aktievärde under den senaste månaden.</p>
<p>Analytikerkåren är delad om varför. Bernsteins Stacy Rasgon menar att efterfrågan på AI-beräkningskraft inte gått någonstans och att siffrorna ensamma borde driva upp kursen. Andra, som investeraren Vinod Khosla, menar att förlusten av Huang personligen är en stor nackdel för bolagets värde. Baird-analytikern Tristan Gerra sänkte aktien till neutral och flaggade för en möjlig nedskrivning på upp till 5 miljarder dollar kopplad till lager avsett för kinesisk efterfrågan som nu inte blir av.</p>
<p>Den mest relevanta frågan för AI-hårdvarumarknaden i stort kommer från analytiker som Ben Bajarin och Jay Goldberg: den egentliga risken är inte GPU-efterfrågan i sig — den är enligt flera bedömare fortsatt uthyrd för minst två år framåt — utan Nvidias roll som informell finansieringsmotor bakom en stor del av branschens AI-infrastrukturaffärer. Den rollen, menar de, har i praktiken byggts kring en enskild persons relationer och trovärdighet snarare än institutionella strukturer, vilket gör hela upplägget sårbart när den personen plötsligt försvinner.</p>

<h2>Vad det betyder framåt</h2>
<p>Tre saker värda att följa för er som bevakar AI-hårdvarumarknaden: För det första ser Kina-exitpolitiken ut att bli permanent snarare än tillfällig, vilket öppnar ännu mer utrymme för Huawei att konsolidera sin redan snabbt växande position som Kinas primära AI-chipleverantör — oavsett om Bernsteins mer dramatiska prognos eller IDC:s mer konservativa mätning visar sig stämma bäst. För det andra kvarstår frågan om Nvidias bredare finansieringsroll i AI-infrastrukturbranschen överlever ett ledarskapsbyte intakt, vilket får betydelse långt bortom Kina-affären. För det tredje: med en tillförordnad vd och en pågående styrelserekrytering är strategisk kontinuitet långt ifrån given — nästa permanenta vd kan komma att sätta en helt annan kurs för både Kina-politik och de stora finansieringsupplägg som byggt mycket av dagens AI-hausse.</p>

<h2>Källor</h2>
<p>Reuters/IDC-data om marknadsandelar i Kina (oktober 2026), Nvidias kvartalsrapport och kommentarer från CFO/tillförordnad vd Colette Kress (17 november 2026), samt analytikerreaktioner rapporterade av CNBC, Yahoo Finance och Benzinga.</p>`;

const faq = [
  {
    question: 'Varför avgick Jensen Huang som Nvidia-vd?',
    answer: 'Enligt flera samstämmiga medierapporter efter en styrelseutredning kring uppgivna utomäktenskapliga relationer, där en av de inblandade enligt amerikansk underrättelsetjänst misstänks ha spionerat för Kina. Varken Nvidia eller Huang har offentligt bekräftat skälet, och Justitiedepartementet utreder enligt uppgift saken separat.',
  },
  {
    question: 'Har Nvidia slutat sälja AI-chip till Kina?',
    answer: 'Ja. Den 17 november 2026 meddelade tillförordnade vd:n Colette Kress att Nvidia helt slutat leverera sina licensierade Hopper-baserade datacenterchip, inklusive H200, till Kina. Beslutet kom dagar efter Jensen Huangs avgång, som personligen hade förhandlat fram den kinesiska marknadstillgången.',
  },
  {
    question: 'Hur stor är Nvidias marknadsandel för AI-chip i Kina nu?',
    answer: 'Enligt IDC-data rapporterad av Reuters föll Nvidias andel till 34 procent under första halvåret 2026, ner från 55 procent för helåret 2025, medan Huaweis Ascend-chip nådde 28 procent. Investmentbanken Bernstein har gått ut med en mer dramatisk prognos om omkring 8 procent vid årsskiftet, men det är en modellprognos, inte en uppmätt siffra.',
  },
  {
    question: 'Påverkade VD-bytet Nvidias finansiella resultat?',
    answer: 'Nvidia slog faktiskt analytikernas förväntningar med 115,8 miljarder dollar i intäkter och höjde sin tillväxtprognos till 75 procent för räkenskapsåret 2028, trots att Kina exkluderats helt. Ändå föll aktien, med rapporter om runt 30 procents nedgång den senaste månaden — vilket flera analytiker kopplar till osäkerhet om ledarskapet snarare än den underliggande affären.',
  },
];

async function main() {
  const row = {
    slug: 'nvidia-utan-jensen-huang-ai-hardvarumarknaden-kina',
    title,
    excerpt,
    content_mdx,
    faq,
    category: 'foretag-aktorer',
    tags: ['Nvidia', 'Jensen Huang', 'AI-chip', 'Kina', 'Huawei', 'Exportkontroll'],
    featured_image: null,
    type: 'post',
    path: '/nvidia-utan-jensen-huang-ai-hardvarumarknaden-kina',
    parent_slug: null,
    affiliate_url: null,
    published_at: null,
    seo_title: title,
    seo_description: excerpt,
    author_slug: 'nicklas-hallberg',
  };
  const { data: existing } = await db.from('articles').select('slug').eq('path', row.path).maybeSingle();
  const { error } = existing
    ? await db.from('articles').update(row).eq('path', row.path)
    : await db.from('articles').insert(row);
  if (error) { console.error(error); process.exit(1); }
  console.log(`OK: artikel ${existing ? 'uppdaterad' : 'skapad'}, published_at=null — väntar på granskning + bild.`);
}
main();
