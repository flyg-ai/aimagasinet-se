/**
 * Ny nyhetsartikel: OpenAI skär ner sin finansieringsrunda till 20 miljarder
 * dollar och har stängt en första del på 11 miljarder, enligt Bloomberg/FT/WSJ
 * (november 2026). Källor verifierade via WebFetch/WebSearch mot GV Wire
 * (Reuters), Digg (The Information/Bloomberg) och en separat sökning som
 * bekräftade nedskärningsorsaken (FT: investerare drar sig tillbaka pga oro
 * för AI-aktiemarknaden, rapporterat 30 oktober 2026).
 *
 *   npx tsx scripts/seed-news-openai-funding.ts
 *
 * Skriver published_at=null (draft, väntar på featured_image + godkännande).
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const title = 'OpenAI skär ner jätterundan till 20 miljarder dollar – har stängt första delen på 11 miljarder';
const excerpt = 'OpenAI har enligt Bloomberg och Financial Times stängt en första del på 11 miljarder dollar av en finansieringsrunda som nu siktar på totalt 20 miljarder dollar — nedskuret från ursprungliga 30 miljarder sedan investerare börjat dra sig tillbaka i spåren av oro för en AI-bubbla.';

const content_mdx = `
<p>OpenAI har enligt flera samstämmiga medierapporter stängt en första del av sin senaste finansieringsrunda — 11 miljarder dollar, till en värdering på 1,25 biljoner dollar. Det är bara halva vägen till det nedskurna målet på 20 miljarder dollar, som i sin tur är en rejäl neddragning från det ursprungliga målet på 30 miljarder. Bakom neddragningen ligger enligt Financial Times en konkret oro bland investerare för att AI-sektorns värderingar har sprungit ifrån verkligheten.</p>

<h2>Vad har hänt?</h2>

<p>Bloomberg News rapporterade först, enligt uppgifter från personer insatta i affären, att OpenAI stängt 11 miljarder dollar av en runda som värderar bolaget till 1,25 biljoner dollar pre-money — alltså värdet av bolaget innan de nya pengarna räknas in. Det här är en delstängning, inte hela rundan: resterande kapital ska enligt The Information finslipas under de kommande veckorna.</p>

<p>Wall Street Journal har rapporterat att de 11 miljarder dollarna är bekräftade åtaganden (committed capital), inte pengar som redan finns på kontot, och att summan motsvarar mindre än hälften av det ursprungliga målet på 30 miljarder dollar. En person med insyn i affären säger till flera medier att rundan ännu inte är formellt stängd och att siffrorna kan ändras.</p>

<p>Skillnaden mellan "committed" och faktiskt insatt kapital är inte bara ett tekniskt detalj. Ett åtagande är ett löfte om att skjuta till pengar när affären formellt stängs — vilket ger OpenAI en tydlig signal om hur mycket kapital bolaget kan räkna med, men det är först när pengarna faktiskt växlar händer som de kan användas till exempelvis datorkraft, löner eller de enorma infrastrukturavtal som bolaget ingått under 2026. Att en runda tar flera veckor eller månader att formellt stänga, med delstängningar längs vägen, är i sig inget ovanligt för affärer av den här storleken.</p>

<h2>Från 1,4 till 1,25 biljoner dollar — vad ligger bakom nedskärningen?</h2>

<p>Financial Times rapporterade den 30 oktober 2026 att OpenAI skurit ner målet för rundan med 10 miljarder dollar, till cirka 20 miljarder, samtidigt som värderingen sänktes från 1,4 biljoner till 1,25 biljoner dollar — en nedskrivning på 150 miljarder dollar. Enligt FT:s rapportering kom neddragningen i spåren av att investerare börjat oroa sig för AI-marknaden i stort, och att flera dragit tillbaka sina tilltänkta åtaganden i takt med att AI-relaterade aktier fallit i värde under hösten.</p>

<p>Det är värt att vara tydlig med källäget här: ingen av uppgifterna kommer från OpenAI självt. Hela historien bygger på Bloomberg, Financial Times och Wall Street Journal, som i sin tur citerar anonyma källor "insatta i affären". OpenAI har inte offentligt bekräftat vare sig summan, värderingen eller anledningen till neddragningen.</p>

<h2>Vilka investerare är med?</h2>

<p>Konkreta, bekräftade investerarnamn för just den här 11-miljardersdelen saknas i rapporteringen. Ett tidigare, separat reportage — cirka två veckor innan den här delstängningen — pekade enligt CNBC ut investerare från Förenade Arabemiraten samt riskkapitalbolaget Coatue som tänkbara ledande investerare, men TechCrunch rapporterade samtidigt att villkoren då fortfarande var under förhandling. Det går alltså inte att med säkerhet säga att det är samma aktörer som nu står bakom de 11 miljarderna.</p>

<h2>Del av ett större mönster</h2>

<p>Nedskärningen av OpenAIs runda är ett konkret exempel på något som diskuterats i amerikansk finanspress under hela hösten 2026: en växande skepsis kring hur AI-bolagens värderingar hänger ihop med deras faktiska intäkter och kostnader. Vi har tidigare skrivit om <a href="/anthropic-ipo-vad-kostar-ai-racet">vad Anthropics S-1-ansökan inför börsnoteringen avslöjade om kostnaderna i AI-racet</a> — en värdering uppåt 2 biljoner dollar, men samtidigt en bokföringsmässig förlust på 80 miljarder dollar. OpenAIs nedskurna runda pekar åt samma håll: investerare som tidigare var beredda att skriva enorma checkar utan att blinka har nu börjat räkna mer noggrant.</p>

<p>Det betyder inte att OpenAI har svårt att hitta kapital — 11 miljarder dollar i en delstängning är fortfarande en av de största finansieringsrundorna som någonsin genomförts av ett privat bolag. Men signalen är tydlig: den obegränsade tillgången till kapital som definierat AI-branschen de senaste åren möter nu sitt första riktiga motstånd.</p>

<p>Det skiljer sig också från hur tidigare OpenAI-rundor har beskrivits i media — som affärer där efterfrågan från investerare varit så stor att bolaget snarare kunnat välja och vraka bland intressenter än att behöva övertyga dem. Att en runda nu istället skärs ner i både storlek och värdering, mitt under pågående förhandlingar, är ett tydligt trendbrott jämfört med den beskrivningen.</p>

<h2>Vad betyder det här?</h2>

<p>För OpenAI själv förändrar en lägre värdering och en mindre runda troligen inte mycket på kort sikt — bolaget har fortfarande tillgång till enorma kapitalmängder jämfört med nästan vilket annat privat bolag som helst. Men för branschen i stort är det en signal värd att ta på allvar: om investerare börjar kräva mer realistiska värderingar av det mest välkapitaliserade AI-bolaget i världen, blir det svårare för mindre etablerade AI-bolag att resa kapital på de villkor de vant sig vid de senaste två åren.</p>

<p>Vi följer upp när OpenAI, Bloomberg eller Financial Times publicerar mer konkreta detaljer om resten av rundan — och om bolaget själv väljer att kommentera uppgifterna.</p>
`.trim();

const row = {
  slug: 'openai-skar-ner-finansieringsrunda-11-miljarder',
  title,
  excerpt,
  content_mdx,
  category: 'foretag-aktorer',
  tags: ['OpenAI', 'Finansiering', 'AI-bubbla', 'Värdering', 'Nyhet'],
  featured_image: null,
  og_image: null,
  type: 'post',
  path: '/openai-skar-ner-finansieringsrunda-11-miljarder',
  parent_slug: null,
  affiliate_url: null,
  published_at: null,
  seo_title: 'OpenAI skär ner finansieringsrundan till 20 miljarder dollar | AI-Magasinet',
  seo_description: excerpt,
  author_slug: 'erik-lindgren',
  faq: null,
};

async function main() {
  const { error } = await db.from('articles').insert([row]);
  if (error) { console.error('insert failed:', error.message); process.exit(1); }
  const { data, error: readErr } = await db.from('articles').select('slug, title, author_slug, category, published_at').eq('slug', row.slug).maybeSingle();
  if (readErr) { console.error(readErr.message); process.exit(1); }
  console.log('OK —', JSON.stringify(data, null, 2));
}
main();
