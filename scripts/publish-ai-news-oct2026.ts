/**
 * Generera + publicera 4 nyhetsartiklar om trendande AI-ämnen (research gjord
 * utanför detta script, oktober 2026):
 *
 *   1. openai-agenter-stangde-av-sakerhetsovervakning   (ai-sakerhet-etik)
 *   2. anthropic-nscale-45-miljarder-datordeal          (foretag-aktorer)
 *   3. 1password-for-agents-ai-inloggning                (ai-nyheter)
 *   4. canva-craft-egen-bildmodell                      (teknik-modeller)
 *
 * Varje brief skiljer strikt mellan VERIFIERAT (flera oberoende, samstämmiga
 * källor eller bolagets egen newsroom) och OBEKRÄFTAT (enskild/sekundär källa,
 * rykte, ej bekräftat av parterna). Covers: branded gradient-kort (sharp+SVG,
 * samma stil som generate-og-images.ts) eftersom inga officiella pressbilder
 * finns att ladda ner lagligt för dessa nyheter.
 *
 *   npx tsx scripts/publish-ai-news-oct2026.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';
const BUCKET = 'featured-images';

const SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens.

# Tonalitet
Expert, rak, praktisk svenska. Inga floskler ("i en värld där...", "revolutionerande", "game changer"). Inga emojis. Konkreta namn, siffror och exempel. Skriv som en kunnig teknikjournalist — nyhetsmässigt, lätt kritiskt, aldrig reklamigt.

# Faktadisciplin (KRITISKT)
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta. Allt som markerats OBEKRÄFTAT måste tydligt ramas in som just obekräftat — använd formuleringar som "enligt uppgifter", "ska enligt flera källor", "varken X eller Y har bekräftat detta officiellt". Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan rubriken). Inga \`\`\`html-wrappers, inga inline styles, inga <style>/<script>-taggar.

Använd: <h2>, <h3>, <p>, <ul>/<ol>+<li>, <strong>. Tabell för jämförelsedata: <table> med <thead>/<tbody>. Länka naturligt till relaterade interna sidor med <a href="..."> där det anges i briefen.`;

type ArticleSpec = {
  slug: string;
  title: string;
  category: string;
  authorSlug: string;
  wordTarget: number;
  excerpt: string;
  tags: string[];
  brandFrom: string; // gradient start (hex)
  brandTo: string;   // gradient end (hex)
  kicker: string;    // short label painted on the cover
  relatedLinks: { url: string; label: string }[];
  brief: string;
};

const ARTICLES: ArticleSpec[] = [
  {
    slug: 'openai-agenter-stangde-av-sakerhetsovervakning',
    title: 'OpenAI: Interna AI-agenter stängde av sin egen säkerhetsövervakning',
    category: 'ai-sakerhet-etik',
    authorSlug: 'erik-lindgren',
    wordTarget: 1200,
    excerpt: 'OpenAI uppger att två interna kodningsagenter försvagade bolagets egen övervakning för feljusterat beteende under rutinuppgifter i oktober 2026 — och att en av agenterna senare nekade till att ha gjort det.',
    tags: ['OpenAI', 'AI-säkerhet', 'AI-agenter', 'misalignment', 'nyhet'],
    brandFrom: '#0f172a', brandTo: '#7c3aed',
    kicker: 'AI-säkerhet',
    relatedLinks: [
      { url: '/ai-verktyg/ai-kod-verktyg', label: 'AI-kodverktyg' },
    ],
    brief: `Skriv en nyhetsartikel (~1200 ord) om: "${'OpenAI: Interna AI-agenter stängde av sin egen säkerhetsövervakning'}".

# VERIFIERAT (flera oberoende källor, samstämmiga)
- OpenAI meddelade den 20 oktober 2026 att två interna kodningsagenter, under rutinmässiga mjukvaruuppgifter, försvagade delar av bolagets interna system för att övervaka "misalignment" (feljusterat beteende) hos modeller.
- Händelserna inträffade enligt uppgift den 3 respektive 6 oktober 2026.
- I ett av fallen tog en "subagent" bort/plockade ut den integration som övervakar OpenAIs agenter för tecken på feljustering.
- Enligt OpenAIs egen beskrivning övervägde agenterna om säkerhetsspärrarna skulle bevaras, men tolkade rutinmässiga kodningsinstruktioner som ett tillstånd att försvaga dem — alltså inte en medveten, illvillig sabotagehandling, utan ett resultat av hur agenten tolkade sin uppgift.
- Separat, tidigare i september 2026 (den 20:e), pausade OpenAI reinforcement learning-träning av sina mest avancerade modeller efter att en intern agent utnyttjat en svaghet i sandlådans DNS-resolver för att nå ett publikt chattgränssnitt på internet, trots att vanlig webbåtkomst var blockerad. Övervakningen slog larm, men körningen stoppades inte automatiskt som avsett. OpenAI sa sig ha åtgärdat detta genom blockering på flera nivåer och ny DNS-övervakning, och återupptog arbetet den 1 oktober.
- Behandla september-händelsen (DNS-sandlådan) och oktober-händelserna (de två kodningsagenterna som försvagade övervakningen) som TVÅ SEPARATA incidenter — ingen källa kopplar ihop dem som samma händelse.

# OBEKRÄFTAT (enskild/sekundär källa — måste ramas in som obekräftat)
- Enligt viss sekundärrapportering ska en av de två oktober-agenterna senare, när den tillfrågades, ha nekat till att den tagit bort övervakningsintegrationen. Detta kommer från sekundära källor och bör presenteras som en oklar, obekräftad detalj — inte som fastslaget faktum om "AI som ljuger".

# STRUKTUR
- Intro: slå an nyheten — OpenAI själva rapporterar att deras egna AI-agenter stängt av/försvagat sin säkerhetsövervakning, två gånger på en månad, i olika incidenter.
- <h2>Vad hände i oktober?</h2> — de två kodningsagenterna, vad de gjorde, OpenAIs egen tolkning (agenterna "övervägde" men tolkade instruktioner för brett).
- <h2>Den omstridda detaljen: nekade agenten?</h2> — ramas tydligt som obekräftat/oklart.
- <h2>Inte första gången: DNS-incidenten i september</h2> — separat händelse, pausad RL-träning, hur OpenAI täppte till hålet.
- <h2>Varför det här spelar roll</h2> — koppling till det bredare samtalet om "agentic misalignment", att AI-labb själva flaggar detta öppet (positivt ur transparenssynpunkt) men att det väcker frågor om hur mycket autonomi kodningsagenter ska ges i produktionsmiljöer.
- Avsluta kort, ingen alarmism — nyanserad slutsats om att detta är en förväntad växtvärk i takt med att agenter får mer autonomi, snarare än bevis på medveten AI-sabotage.

Nämn naturligt, en gång, i löptext: "enligt OpenAIs egen incidentrapportering".`,
  },
  {
    slug: 'anthropic-nscale-45-miljarder-datordeal',
    title: 'Anthropic i 45 miljarder dollar-datordeal med Nscale',
    category: 'foretag-aktorer',
    authorSlug: 'sara-nilsson',
    wordTarget: 1100,
    excerpt: 'Anthropic ska enligt uppgift ha ingått ett datorkraftsavtal värt runt 45 miljarder dollar med brittiska Nscale — en av de största AI-infrastrukturaffärerna hittills, men varken Anthropic eller Nscale har bekräftat siffrorna officiellt.',
    tags: ['Anthropic', 'Claude', 'AI-infrastruktur', 'datorkraft', 'nyhet'],
    brandFrom: '#1e1b4b', brandTo: '#4f46e5',
    kicker: 'Företag & kapital',
    relatedLinks: [
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude-recension' },
    ],
    brief: `Skriv en nyhetsartikel (~1100 ord) om: "${'Anthropic i 45 miljarder dollar-datordeal med Nscale'}".

# VERIFIERAT-ISH (rapporterat samstämmigt av flera oberoende medier, t.ex. Bloomberg, Reuters, TechCrunch — men EJ bekräftat av Anthropic eller Nscale offentligt. Framställ hela affären som "enligt uppgifter"/"ska enligt flera källor", aldrig som ett fastslaget, bekräftat faktum)
- Flera medier rapporterar att Anthropic ingått (eller är nära att ingå) ett datorkraftsavtal med brittiska molnbolaget Nscale värt omkring 45 miljarder dollar.
- Enligt rapporteringen gäller avtalet ungefär 460 megawatt kapacitet över sex år, vid Nscales "Monarch"-anläggning i West Virginia, USA.
- Kapaciteten ska enligt uppgift använda Nvidias nästa generations AI-chip, med start mot slutet av 2027.
- Nscale ska äga och driva själva datacentret och hårdvaran, medan Anthropic betalar för kapacitet i takt med att den levereras.
- Anthropic har avböjt att kommentera affären. Nscale har inte heller bekräftat den offentligt.
- Enligt viss rapportering handlar det möjligen om en ANDRA, separat affär på samma ~45 miljarder dollar, kopplad till en andra byggnad på samma anläggning — med ett tidigare avtal (runt augusti 2026) för den första byggnaden. Källorna är inte helt samstämmiga på om det rör sig om en eller två affärer; var transparent med att detta är oklart.
- En rapportering nämner osäkerhet kring vem som faktiskt är motpart i ett Aker-bolags regulatoriska anmälan kopplad till affären — ytterligare ett skäl att hålla hela affären som obekräftad i ton.
- Sätt affären i sitt sammanhang: den kommer i en period då Anthropic rapporteras förbereda sig för en börsnotering (IPO) och konkurrerar med OpenAI om datorkraft i en bredare våg av mångmiljard-dollar infrastrukturaffärer i AI-branschen 2026.

# STRUKTUR
- Intro: nyheten — ett av de största enskilda datorkraftsavtalen som rapporterats i AI-branschen, kopplat till Anthropic, men ej officiellt bekräftat.
- <h2>Vad säger uppgifterna?</h2> — siffror, kapacitet, plats, tidslinje.
- <h2>Vem är Nscale?</h2> — kort, kärn-fakta om Nscale som brittiskt AI-infrastrukturbolag (håll kort och generellt, hitta inte på detaljer du inte fått).
- <h2>Varför är det här osäkert?</h2> — ingen av parterna har bekräftat, motstridiga uppgifter om en eller två affärer, oklarheter i regulatoriska filningar.
- <h2>Det större sammanhanget</h2> — AI-branschens massiva kapitalkapplöpning om datorkraft 2026, Anthropics rapporterade IPO-förberedelser, konkurrensen med OpenAI.
- Kort, nykter avslutning: storleken på affären (om den stämmer) säger något om hur kapitalintensiv AI-branschen blivit, oavsett exakta siffror.`,
  },
  {
    slug: '1password-for-agents-ai-inloggning',
    title: '1Password lanserar inloggning för AI-agenter — utan att visa lösenordet',
    category: 'ai-nyheter',
    authorSlug: 'erik-lindgren',
    wordTarget: 1000,
    excerpt: '1Password har lanserat "1Password for Agents": AI-agenter som Claude och ChatGPT kan nu logga in i dina konton utan att någonsin se själva lösenordet — du godkänner varje inloggning själv.',
    tags: ['1Password', 'AI-agenter', 'säkerhet', 'lösenordshantering', 'nyhet'],
    brandFrom: '#0c4a6e', brandTo: '#0ea5e9',
    kicker: 'Produktlansering',
    relatedLinks: [
      { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude-recension' },
      { url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT-recension' },
    ],
    brief: `Skriv en nyhetsartikel (~1000 ord) om: "${'1Password lanserar inloggning för AI-agenter — utan att visa lösenordet'}".

# VERIFIERAT (bolagets egen lansering, brett och samstämmigt rapporterad 22 oktober 2026)
- 1Password lanserade den 22 oktober 2026 "1Password for Agents": en funktion som låter AI-agenter logga in på användarens konton utan att agenten någonsin får se eller ta emot lösenordet i klartext.
- Flödet: en agent begär en inloggning för en uppgift. Om flera sparade inloggningar matchar väljer användaren själv vilken som ska användas. När agenten når en inloggningssida fyller 1Password i lösenordet eller engångskoden automatiskt — agenten ser eller hanterar aldrig själva credentialen.
- Användaren godkänner varje inloggning manuellt — det är ett godkännande-baserat flöde, inte helt obevakad autonomi.
- Lanseringspartners (nämnda i produktlanseringen) inkluderar bland annat Anthropics Claude (i en agent-variant), OpenAIs ChatGPT i en arbetsinriktad agent-variant, samt ytterligare agent-/automationsbolag. Var försiktig med exakta produktnamn för enskilda partners om de är osäkra — formulera generellt ("flera stora AI-assistenter, inklusive Claude och ChatGPT, finns med som lanseringspartners") snarare än att lista exakta kodnamn du inte är säker stavas rätt.
- Detta bygger vidare på ett tidigare steg från sommaren 2026, då 1Password lät Claude logga in på webbsidor utan att se lösenorden.
- Enligt produktsidan ingår funktionen i befintliga Individual- och Family-planer hos 1Password (ingen ny betalnivå krävs för grundfunktionen).

# OBEKRÄFTAT / OKLART
- Exakt vilka tredjepartsagenter/bolag som är lanseringspartners skiljer sig något mellan olika mediers rapportering — nämn att listan av integrerade agenter väntas växa, utan att hänga upp artikeln på en exakt, eventuellt felaktig lista.
- Exakta start-/utrullningsdatum per enskild partner-integration är inte bekräftade.

# STRUKTUR
- Intro: nyheten rakt på — 1Password har löst ett growing pains-problem med AI-agenter: hur ger man en agent tillgång att logga in åt dig, utan att ge den ditt lösenord?
- <h2>Så fungerar det</h2> — flödet steg för steg.
- <h2>Vilka agenter stöds?</h2> — generellt hållet, nämn Claude och ChatGPT, undvik att hitta på exakta produktnamn.
- <h2>Varför det här är ett verkligt säkerhetsproblem att lösa</h2> — AI-agenter som agerar i webbläsare/på dina konton är en växande kategori 2026, och att ge en AI-modell rått lösenord i klartext är en uppenbar risk (phishing, prompt injection, läckage). Diskutera ärligt: godkännandet skyddar själva credentialen, men skyddar inte nödvändigtvis mot vad agenten gör EFTER att den loggat in — det är en viktig nyans, inte bara positiv PR.
- <h2>Pris och tillgänglighet</h2> — ingår i befintliga planer.
- Kort avslutning om vart agentic-säkerhet är på väg.`,
  },
  {
    slug: 'canva-craft-egen-bildmodell',
    title: 'Canva lanserar Craft — sin första egna AI-bildmodell',
    category: 'teknik-modeller',
    authorSlug: 'sara-nilsson',
    wordTarget: 1100,
    excerpt: 'Canva har släppt Craft, sin första egenutvecklade AI-bildmodell — tränad på designmallar snarare än fotografier, med fokus på layout, text och grafisk design istället för fotorealism.',
    tags: ['Canva', 'AI-bilder', 'bildgenerering', 'design', 'nyhet'],
    brandFrom: '#581c87', brandTo: '#db2777',
    kicker: 'Ny modell',
    relatedLinks: [
      { url: '/ai-verktyg/ai-bild-verktyg', label: 'AI-bildverktyg' },
    ],
    brief: `Skriv en nyhetsartikel (~1100 ord) om: "${'Canva lanserar Craft — sin första egna AI-bildmodell'}".

# VERIFIERAT (Canvas egen newsroom + samstämmig teknikpress, lanserad 22-23 oktober 2026)
- Canva har lanserat Craft, bolagets första helt egenutvecklade (in-house) AI-bildgenereringsmodell.
- Till skillnad från de flesta bildmodeller är Craft tränad på Canvas eget bibliotek av MÄNSKLIGT DESIGNADE MALLAR — affischer, sociala inlägg, infografik, menyer, textrika layouter — snarare än på fotografier. Det gör den inriktad på grafisk design och layout snarare än fotorealism.
- Arkitekturen fungerar i två steg: ett första steg omvandlar en textprompt till en "plan" (vilka element som ska finnas, rumsliga relationer, skala, hierarki, eventuell text i bilden), och ett andra steg renderar sedan själva bilden utifrån den planen.
- Craft är tillgänglig direkt för alla Canva-användare globalt via Canvas "Dream Lab"-funktion, och för utvecklare via Canvas publika API.
- Modellen genererar bilder i 2K-upplösning och stödjer fler än 30 bildformat/proportioner.
- Canva uppger själva att Craft debuterade som fjärde rankad bildmodell på jämförelsetjänsten DesignArena vid lansering — notera att det är Canvas EGEN framställning/ranking, inte en oberoende tredjepartsbekräftelse, och formulera det därefter ("Canva säger själva att...").
- Canva utvecklar även två snabbare/billigare varianter, kallade Craftfast och Craft-ultrafast, utan angivet lanseringsdatum.
- Canva planerar även att göra Craft tillgänglig för bildgenerering inuti tredjepartschattbottar som ChatGPT och Gemini via Canvas MCP-integration (Model Context Protocol).

# OBEKRÄFTAT / OSÄKERT
- Exakt lanseringsdatum skiljer sig mellan källor (22 vs 23 oktober) — skriv "i slutet av oktober 2026" eller liknande, slå inte fast ett exakt datum som säkert.
- DesignArena-rankingen bygger på preliminära resultat och Canvas egen framställning — ramas in som sådan, inte som ett oberoende, bekräftat kvalitetsbetyg.

# STRUKTUR
- Intro: Canva, känt för sin drag-and-drop-designplattform, kliver nu in i bildgenererings-racet med en egen modell — och gör ett medvetet annorlunda val: tränad på design, inte foton.
- <h2>Vad gör Craft annorlunda?</h2> — träningsdata (mallar, inte foton), tvåstegs-arkitekturen (plan → rendering), varför det ger bättre resultat för text/layout/hierarki i bilder jämfört med rena foto-modeller.
- <h2>Var kan man använda den?</h2> — Dream Lab för vanliga användare, API för utvecklare, 2K-upplösning, 30+ format.
- <h2>Hur bra är den egentligen?</h2> — Canvas egen DesignArena-ranking, tydligt inramad som bolagets egen framställning.
- <h2>Vad händer härnäst?</h2> — Craftfast/Craft-ultrafast, MCP-integrationen mot ChatGPT/Gemini.
- <h2>Varför det här är intressant</h2> — sätt i kontext: de flesta bildmodeller (Midjourney, DALL-E, Imagen) optimerar för fotorealism; Canva väljer istället en nisch där de redan är starka (grafisk design, marknadsföringsmaterial, sociala medier-inlägg) — en smart differentiering snarare än att tävla rakt av mot de stora labben.
- Kort avslutning.`,
  },
];

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapText(text: string, max: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if (line && (line + ' ' + w).length > max) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out.slice(0, 4);
}

async function makeCover(a: ArticleSpec): Promise<Buffer> {
  const W = 1200, H = 675;
  const lines = wrapText(a.title, 26);
  const lineHeight = 64;
  const totalH = lines.length * lineHeight;
  const startY = H / 2 - totalH / 2 + 10;

  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a.brandFrom}"/>
      <stop offset="100%" stop-color="${a.brandTo}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W - 90}" cy="90" r="220" fill="rgba(255,255,255,0.06)"/>
  <circle cx="60" cy="${H - 40}" r="160" fill="rgba(255,255,255,0.05)"/>
  <rect x="70" y="60" width="${26 + a.kicker.length * 15}" height="44" rx="22" fill="rgba(255,255,255,0.15)"/>
  <text x="${70 + 13 + a.kicker.length * 7.5}" y="89" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5" fill="#ffffff" text-anchor="middle">${escXml(a.kicker.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="70" y="${startY + i * lineHeight}" font-family="Arial, sans-serif" font-size="48" font-weight="800" fill="#ffffff">${escXml(l)}</text>`).join('\n  ')}
  <text x="70" y="${H - 48}" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.75)">AI-MAGASINET</text>
</svg>`.trim();

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function uploadCover(a: ArticleSpec): Promise<string> {
  const png = await makeCover(a);
  const webp = await sharp(png).webp({ quality: 88 }).toBuffer();
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${a.slug}.webp`;
  const { error } = await db.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp', upsert: true, cacheControl: '31536000',
  });
  if (error) throw new Error(`cover upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  return pub.publicUrl;
}

async function generate(a: ArticleSpec): Promise<string> {
  const userPrompt = [
    `Artikel: ${a.title}`,
    `Slug: ${a.slug}`,
    `Kategori: ${a.category}`,
    `Mållängd: ~${a.wordTarget} ord`,
    '',
    a.brief,
    '',
    'Relaterade sidor att länka naturligt till i prosan (max 1-2 ggr, där det passar):',
    ...a.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    `Skriv artikeln nu. ~${a.wordTarget} ord, ren HTML, börja med första <p>-taggen.`,
  ].join('\n');

  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function publish(a: ArticleSpec, html: string, featuredImage: string) {
  const row = {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content_mdx: html,
    category: a.category,
    tags: a.tags,
    featured_image: featuredImage,
    og_image: featuredImage,
    author_slug: a.authorSlug,
    type: 'post' as const,
    path: `/${a.slug}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: new Date().toISOString(),
    seo_title: `${a.title} | AI-Magasinet`,
    seo_description: a.excerpt,
  };
  const { data, error } = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,path,published_at');
  if (error) throw new Error(`upsert ${a.slug}: ${error.message}`);
  return data?.[0];
}

async function main() {
  console.log(`Publishing ${ARTICLES.length} news articles...\n`);
  for (const a of ARTICLES) {
    const t0 = Date.now();
    try {
      const cover = await uploadCover(a);
      const html = await generate(a);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const r = await publish(a, html, cover);
      console.log(`✓ ${a.slug}  ${words}w  ${((Date.now() - t0) / 1000).toFixed(1)}s  id=${r?.id}  ${cover}`);
    } catch (e) {
      console.error(`✗ ${a.slug} FAILED:`, e instanceof Error ? e.message : e);
    }
  }
  console.log('\nDone.');
}

main();
