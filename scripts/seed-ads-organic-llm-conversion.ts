/**
 * Rapport-artikel: conversion rate per köpkälla (betalt/organiskt/AI).
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx -r dotenv/config scripts/seed-ads-organic-llm-conversion.ts dotenv_config_path=.env.local
 */
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const title =
  'Vad driver köpet egentligen? Betald annonsering, organiskt eller AI — så ser conversion rate ut per källa (november 2026)';
const excerpt =
  'AI-trafikens konvertering har vänt från sämre till bäst på bara ett år enligt Adobes aggregerade siffror — men den mest rigorösa akademiska studien på området visar ett mer nyanserat läge: det beror helt på vilken typ av produkt det handlar om.';

const content_mdx = `<p>Det här är ett område där ett halvårsgammalt tal redan är inaktuellt — AI-chattbotarnas shoppingfunktioner mognar så snabbt att samma mätpunkt kan se helt olika ut beroende på om den är tagen i augusti 2025 eller september 2026. Vi har prioriterat de färskaste och mest rigorösa källorna: en peer-reviewad studie publicerad i tidskriften <em>Marketing Science</em>, Adobes löpande månadsmätningar, och färska branschstudier från hösten 2026 — med tydlig flaggning när en siffra bygger på en enskild kund snarare än ett brett dataset.</p>

<h2>Den mest rigorösa studien: det beror på vad som säljs</h2>
<p>Forskarna Maximilian Kaiser och Christian Schulze (Frankfurt School of Finance & Management) analyserade tolv månaders förstapartsdata (augusti 2024–juli 2025) från 973 e-handelssajter med sammanlagt 20 miljarder dollar i omsättning — över 164 miljoner köp totalt, varav drygt 50 000 kunde knytas direkt till ChatGPT-hänvisningar. Studien är peer-reviewad och publicerad i <em>Marketing Science</em>.</p>
<ul>
<li><strong>Trafikandel:</strong> ChatGPT och andra LLM:er stod för under 0,2 procent av alla sessioner — ungefär 200 gånger mindre än Google Organic.</li>
<li><strong>Konvertering, e-handel i genomsnitt:</strong> Google Organic konverterade 13 procent oftare än organisk ChatGPT-trafik, och affiliate-länkar 86 procent oftare. Bara betald social trafik presterade sämre än ChatGPT (−53 procent).</li>
<li><strong>Den viktiga nyansen:</strong> För enkla rutinköp (standardvaror med lågt beslutsengagemang) vinner Google stort. Men för komplexa produkter och tjänster — finans, försäkring, fordon, B2B-tjänster — fick sajterna 4,6 gånger högre andel LLM-trafik, och där slog LLM-trafiken fem av åtta traditionella kanaler i konverteringsgrad, inklusive Google Organic och Direct.</li>
</ul>
<p>Samma forskarduo publicerade i oktober 2026 en uppföljning (ännu inte peer-reviewad, under granskning) specifikt om betalda ChatGPT-annonser i USA: ett betalt ChatGPT-klick genererade i genomsnitt 0,89 dollar i intäkt per besök, mot 2,45 dollar för en betald Google-sökannons — en konverteringsgrad på 0,37 procent mot 1,17 procent. Källorna skiljer sig åt om underlaget var 102 annonsörssajter med full säljspårning eller 1 898 butiker i en stegvis utrullning, så betrakta samplingsstorleken med viss osäkerhet tills den slutgiltiga versionen publiceras.</p>

<h2>Adobes aggregerade trend säger något annat — och det beror på vad man mäter</h2>
<p>Adobe Analytics mäter löpande AI-hänvisad trafik till amerikanska detaljhandelssajter i stort, och trenden där pekar i rakt motsatt riktning jämfört med den akademiska studiens genomsnitt:</p>
<ul>
<li><strong>September 2026:</strong> AI-hänvisade besök konverterade cirka 90 procent bättre än icke-AI-trafik och genererade 83 procent mer intäkt per besök — den starkaste siffran Adobe mätt sedan de började följa måttet.</li>
<li><strong>Augusti 2025, alltså ett år tidigare:</strong> AI-hänvisade besök konverterade 9 procent <em>sämre</em> än icke-AI-trafik.</li>
<li><strong>Inför högsäsongen 2026:</strong> Adobe väntar sig 159 procent mer AI-trafik på Thanksgiving, 95 procent på Black Friday och 88 procent på Cyber Monday jämfört med 2025, med en ungefär dubblerad intäkts-per-besök-fördel.</li>
</ul>
<p>Skillnaden mot Frankfurt School-studien är inte nödvändigtvis en motsägelse — det är sannolikt två olika saker som mäts. Adobe jämför AI-trafik mot <em>all annan trafik blandad</em> (inklusive svagt presterande kanaler som betald social), medan Kaiser & Schulze jämför specifikt mot Google Organic och andra starka kanaler var för sig. Adobe påpekar också själva att måttet bara räknar klick som kommer <em>utifrån</em> ett AI-verktyg — köp som sker inuti en AI-assistents eget shoppingflöde (till exempel ChatGPT Wallet) syns inte alls i Adobes statistik.</p>

<h2>B2B och SaaS: ett tredje, mer splittrat mönster</h2>
<p>Utanför ren e-handel ger studierna en tredje bild, vilket förklarar varför inlägg på LinkedIn ofta verkar säga rakt motsatta saker:</p>
<ul>
<li><strong>Amsive</strong> analyserade sex månaders GA4-data från 54 sajter (B2B och B2C blandat) med statistisk signifikanstestning. Totalresultatet: 4,87 procent konvertering för LLM-trafik mot 4,60 procent för organiskt — en skillnad som <em>inte var statistiskt signifikant</em> när man testade den. LLM-trafik utgjorde under 1 procent av alla sessioner i datasetet. Sekundärkällor ger olika siffror för B2B- respektive B2C-segmenten specifikt, så vi avstår från att citera den uppdelningen exakt här — helhetsslutsatsen (ingen säkerställd skillnad) står dock fast.</li>
<li><strong>Seer Interactive</strong> rapporterade en betydligt mer dramatisk siffra — cirka 16 procent konvertering för ChatGPT-trafik mot 1,8 procent för Google Organic, baserat på 1 370 AI-drivna konverteringar. Viktigt: detta är <strong>en enskild kunds data</strong>, inte ett branschgenomsnitt, och bör inte generaliseras — vilket även flera analysbolag själva påpekat när de slutat citera just den siffran rakt av.</li>
<li><strong>Microsoft Clarity</strong> rapporterade, över 1 277 sajter, att AI-hänvisningar ledde till registrering (sign-up) i 1,66 procent av fallen mot 0,15 procent för traditionell sök.</li>
</ul>

<h2>Det stora perspektivet: hur stor är AI-trafiken egentligen?</h2>
<p>Oavsett konverteringsgrad är volymen fortfarande liten. Cloudflare Radar, som mäter andelen sök-hänvisningar över sitt nätverk, satte Googles andel av global söktrafik till ungefär 87–91 procent under 2026 beroende på mätperiod och vilka referrers som räknas in — AI-chattbotarnas andel av utgående klick är fortfarande en bråkdel av det. En analys av över 100 000 butiksordrar (Enalitica, uppdaterad till 7 november 2026) visar AI-trafikens andel av det totala antalet ordrar gå från under 0,1 procent i mitten av 2025 till omkring 1,2 procent i oktober–november 2026, där cirka 95 av 100 AI-hänvisade ordrar kom från ChatGPT.</p>
<p>Samtidigt sjunker klickfrekvensen till organiska resultat tydligt när Google visar en AI Overview — enligt Pew Research från 15 till 8 procent — och enligt Forrester (januari 2026) uppger 94 procent av B2B-köpare att de använder AI någonstans i sin köpprocess. Researchen flyttar alltså in i chatten även när det faktiska klicket och köpet fortfarande sker någon annanstans.</p>

<h2>Vad det betyder för er marknadsmix</h2>
<p>Den mest träffsäkra sammanfattningen är inte "AI konverterar X gånger bättre eller sämre" — det beror på vad ni säljer. Säljer ni enkla, lågengagemangsprodukter konkurrerar AI-trafik fortfarande sämre än etablerad organisk och betald sök, enligt den mest rigorösa studien på området. Säljer ni komplexa produkter eller tjänster som kräver research — finans, försäkring, B2B, fordon — är bilden omvänd: där får ni redan i dag mer AI-trafik och den trafiken konverterar bättre än flera traditionella kanaler. Lägg till detta att rollen i köpresan skiljer sig åt: AI-chattar fungerar idag mer som ett research- och filtreringssteg i mitten av tratten snarare än det sista klicket före köp, medan Google Organic och betald sök fortfarande dominerar just det sista steget.</p>
<p>Det ligger i linje med den bredare förändring vi beskrivit i <a href="/ai-forandrar-seo-nar-klick-forsvinner/">hur AI förändrar SEO när klicken försvinner</a>. Praktiskt för svenska bolag: om ni säljer komplexa produkter eller tjänster, prioritera att er produktdata och ert innehåll går att läsa och citera korrekt av AI-agenter redan nu — det är där AI-trafiken redan i dag är mest värd. Säljer ni enklare produkter kan ni vänta något längre, men börja ändå mäta AI-hänvisad trafik som en egen kanal, eftersom den växer snabbast av alla just nu oavsett utgångsläge. Flera av <a href="/basta-ai-seo-verktyg-2026/">de bästa AI-SEO-verktygen 2026</a> har redan börjat bygga in just den här typen av AI-synlighetsspårning, vilket gör dem värda att se över oavsett vilken sida av spektrat ni befinner er på.</p>

<h2>Så ska du egentligen tolka allt det här?</h2>
<p>Den ärliga slutsatsen är att det just nu är genuint svårt att räkna på enskilda källors betydelse. Ett köp som statistiskt "tillskrivs" Google Organic kan ha researchats klart i en AI-chatt veckan innan, och ett köp som ser ut som direkttrafik kan ha sin egentliga startpunkt i en rekommendation från Perplexity. Var i köpresan det faktiska värdet uppstod — var någonstans beslutet egentligen "föddes" — är i praktiken omöjligt att isolera till en enda kanal med dagens mätverktyg. Precis som alltid handlar det om att se till hela tratten, inte döma ut eller kröna en enskild källa utifrån en enda siffra i en rapport.</p>
<p>Lägg därtill att det här är en ovanligt föränderlig bransch. AI-landskapet i stort, och i förlängningen hela sökbranschen, förändras i en takt där ett kvartal kan välta om slutsatserna helt — vilket exemplet ovan (från −9 procent till +90 procent på 13 månader) visar tydligt. Det är rimligen för tidigt att dra några säkra, långsiktiga slutsatser om exakt vart det här är på väg.</p>
<p>Men en sak går att säga med större säkerhet: AI har redan börjat förändra både sök och köpbeteende på riktigt, och kommer med stor sannolikhet få en extrem inverkan på sök framöver — och i förlängningen på SEO, SEM och alla närliggande discipliner. Vi står inför en stor förändring, frågan är bara exakt hur den kommer att se ut när den har satt sig. Time will tell — men precis därför gäller det att stå på tårna, mäta kontinuerligt och gräva i nya rapporter när de kommer, snarare än att bygga en strategi på en enskild siffra som ändå sannolikt är inaktuell om sex månader.</p>

<h2>Källor</h2>
<p>Kaiser & Schulze, <a href="https://ecommerceresearch.org/organic-llm/" rel="nofollow noopener" target="_blank">"ChatGPT Referrals to E-Commerce Websites"</a> (peer-reviewad i Marketing Science) samt deras oktober 2026-uppföljning om ChatGPT Ads; Adobes löpande <a href="https://business.adobe.com/blog/ai-traffic-higher-revenue-per-visit-retail-holiday" rel="nofollow noopener" target="_blank">AI Traffic Trends-rapporter</a>; Amsive, <a href="https://www.amsive.com/insights/seo/does-llm-traffic-convert-better-than-organic-a-new-data-backed-study/" rel="nofollow noopener" target="_blank">"Does LLM Traffic Convert Better Than Organic?"</a>; Seer Interactive, <a href="https://www.seerinteractive.com/insights/case-study-6-learnings-about-how-traffic-from-chatgpt-converts" rel="nofollow noopener" target="_blank">kundcase om ChatGPT-trafik</a>; Cloudflare Radar sök-referral-rapporter; samt Enalitica, Microsoft Clarity, Pew Research och Forrester för kompletterande siffror.</p>`;

const faq = [
  {
    question: 'Konverterar trafik från ChatGPT bättre eller sämre än Google Organic?',
    answer: 'Det beror på vad som säljs. Den mest rigorösa studien (973 e-handelssajter, peer-reviewad i Marketing Science) visar att Google Organic konverterar 13 procent bättre än ChatGPT-trafik i genomsnitt för enkla produkter. För komplexa produkter och tjänster som finans, försäkring och B2B är det tvärtom — där konverterar LLM-trafik bättre än flera traditionella kanaler.',
  },
  {
    question: 'Hur stor andel av all webbtrafik kommer från AI-chattbotar?',
    answer: 'Fortfarande liten, men växande snabbt. En studie satte LLM-trafikens andel till under 0,2 procent av alla sessioner (2024–2025-data). En nyare orderanalys (Enalitica, november 2026) visar AI-trafikens andel av det totala antalet butiksordrar ha stigit till omkring 1,2 procent, varav ungefär 95 procent kommer från ChatGPT.',
  },
  {
    question: 'Varför ger olika rapporter om AI-trafik så olika resultat?',
    answer: 'Tre skäl: tidsperiod (AI-trafikens konvertering har förbättrats dramatiskt under 2026 jämfört med 2025), vilken typ av produkt som mäts (enkla vs komplexa köp), och vad man jämför mot (Adobe jämför mot all annan trafik blandad, medan akademiska studier ofta jämför mot specifika kanaler som Google Organic var för sig).',
  },
  {
    question: 'Hur presterar betald ChatGPT-annonsering jämfört med Google-annonser?',
    answer: 'Enligt en opublicerad uppföljningsstudie (oktober 2026, under granskning) genererade ett betalt ChatGPT-klick 0,89 dollar i intäkt per besök i USA, mot 2,45 dollar för en betald Google-sökannons — en konverteringsgrad på 0,37 procent mot 1,17 procent.',
  },
];

async function main() {
  const row = {
    slug: 'ads-organic-llm-conversion-rate-2026',
    title,
    excerpt,
    content_mdx,
    faq,
    category: 'foretag-aktorer',
    tags: ['Marknadsföring', 'Conversion rate', 'AI-sök', 'Attribution', 'E-handel'],
    featured_image: null,
    type: 'post',
    path: '/ads-organic-llm-conversion-rate-2026',
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
