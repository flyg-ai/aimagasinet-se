/**
 * Nattlig artikel-generering. Anropas av Vercel Cron (se vercel.json).
 *
 * Två lägen, valda med ?mode=:
 *
 *   (default)     Plockar de äldsta oanvända ämnena ur article_topics och
 *                 skriver en artikel per ämne.
 *   ?mode=news    Söker på webben efter dygnets viktigaste AI-nyheter med
 *                 relevans för svensk marknad och skriver en artikel per
 *                 nyhet, med källhänvisningar och interna länkar.
 *
 * COUNT styr hur många artiklar ett anrop producerar. Schemat i vercel.json kör
 * två anrop per dag (06 och 08 svensk tid), så COUNT=1 ger två artiklar per dag.
 * Vercel Hobby tillåter högst två cron-jobb.
 *
 * Båda lägen delar publiceringsväg (Unsplash-omslag + upsert på path,
 * published_at=now()) och fyller på ämneskön automatiskt när den sinar.
 *
 * Kräver env: ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY,
 * NEXT_PUBLIC_SUPABASE_URL, UNSPLASH_ACCESS_KEY, CRON_SECRET (rekommenderas).
 *
 * Auth: Vercel Cron skickar `Authorization: Bearer <CRON_SECRET>` när
 * CRON_SECRET är satt. Är den satt kräver vi matchning; annars körs den öppet
 * (men loggar en varning) så att den fungerar innan secret konfigurerats.
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// 300 s är taket på Vercel Hobby — högre värde får bygget att avvisas med
// "invalid maxDuration value". Nyhetsläget gör en websökning plus generering
// på Opus 5 och ligger nära gränsen; timeout innebär att inget publiceras.
export const maxDuration = 300;

/** Artiklar per anrop. Schemat kör två anrop per dag. */
const COUNT = 1;
const MODEL = 'claude-opus-5';
/** Thinking är på som standard på Opus 5 och ryms inom max_tokens
 *  tillsammans med svarstexten — därav marginalen. */
const MAX_TOKENS = 8000;
/** Tidsbudget. Vercel dodar funktionen vid maxDuration utan att skriva nagot i
 *  loggen — vi avbryter hellre sjalva med marginal och rapporterar varfor.
 *  30 s buffert racker for upsert, amnesmarkering och svar. */
const BUDGET_MS = 270_000;
/** Under sa har lang tid kvar startas ingen ny generering. */
const MIN_GENERATE_MS = 70_000;
/** Fyll på ämneskön när färre än så här många oanvända ämnen återstår.
 *  Schemat drar en ämnesartikel per dag, så det är ~9 dygns marginal. */
const REFILL_THRESHOLD = 9;
const REFILL_COUNT = 20;
/** Antal publicerade artiklar som erbjuds som interna länkmål. */
const LINK_CANDIDATES = 80;
/** Antal senaste rubriker som skickas in för att undvika dubbelbevakning. */
const RECENT_TITLES = 30;
/** Byline. Kortare loptext gar pa redaktionsposten — den ska inte signeras av
 *  en enskild person. Langre artiklar ar de vi satsar pa att ranka pa och som
 *  chefredaktoren staller sig bakom, sa de far hans namn. */
const AUTHOR_DEFAULT = 'redaktionen';
const AUTHOR_FEATURE = 'nicklas-hallberg';
/** Fran och med den har mallangden raknas artikeln som en satsning. */
const FEATURE_MIN_WORDS = 1500;

function isFeature(targetWords?: number | null): boolean {
  return (targetWords ?? 0) >= FEATURE_MIN_WORDS;
}

function bylineFor(targetWords?: number | null): string {
  return isFeature(targetWords) ? AUTHOR_FEATURE : AUTHOR_DEFAULT;
}

const SYSTEM_PROMPT = `Du är redaktör på AI-Magasinet — Sveriges ledande magasin om artificiell intelligens.

TONALITET:
- Rak, konkret och engagerande — som en kunnig kollega som förklarar något spännande
- Inte akademisk eller formell — vi skriver för nyfikna människor, inte forskare
- Svenska hela vägen — ingen onödig engelska
- Personlig men professionell — "vi testar", "vi ser att", "det intressanta är"
- Undvik: "i takt med att", "detta innebär att", "det är värt att notera", klichéer och floskler

STRUKTUR (ren HTML, ingen markdown):
- Stark inledning som fångar direkt — inga långa uppbyggnader
- H2-rubriker som är konkreta och klickbara — "Så fungerar X", "Det här betyder det för dig"
- Korta stycken, max 3-4 meningar
- Konkreta exempel, siffror och fakta — undvik vaga generaliseringar
- Intern länk till 2-3 relevanta sidor på aimagasinet.se (verktyg, guider, nyheter)
- Avslutning med en tydlig takeaway eller nästa steg för läsaren

ÄMNEN SOM FUNGERAR:
- Praktiska AI-verktyg svenska användare faktiskt kan använda
- Nyheter med direkt påverkan på svenska företag eller privatpersoner
- "Hur fungerar X" — konkreta förklaringar av AI-fenomen
- Listor och rankings — topp 10, bästa, billigaste etc
- Svenska vinklar på internationella nyheter

UNDVIK:
- Abstrakta filosofiska diskussioner om AI:s framtid
- Teknisk jargong utan förklaring
- Artiklar om "AI i allmänhet" utan konkret krok
- Mer än 800 ord om ämnet inte motiverar det`;

const NEWS_ADDENDUM = `

# Nyhetsartiklar
Detta är en nyhetsartikel om en händelse det senaste dygnet. Utöver riktlinjerna ovan:

- Slå fast nyheten i första stycket: vad som hänt, vem, när. Inga uppvärmningsstycken.
- Sätt in händelsen i svensk kontext — vad den betyder för svenska företag, myndigheter eller utvecklare.
- Skriv bara det källorna faktiskt stödjer. Är något oklart eller obekräftat, skriv ut det istället för att gissa. Hitta inte på siffror, citat eller namn.
- Referera källorna i brödtexten med <a href="URL" rel="nofollow noopener" target="_blank">källans namn</a>. Använd endast URL:er ur källistan du fått.`;

const NEWS_RESEARCH_PROMPT = `Du är nyhetsredaktör på AI-Magasinet, ett svenskt magasin om artificiell intelligens. Din uppgift är att researcha dagens viktigaste AI-nyheter.

Sök på webben och identifiera de nyheter om artificiell intelligens som publicerats det senaste dygnet och som är mest relevanta för en svensk läsekrets: beslutsfattare, utvecklare och företagare.

Det avgörande kriteriet: skulle någon utanför AI-branschen faktiskt söka på det här? En nyhet som ingen söker på blir en artikel ingen läser, hur korrekt den än är.

Prioritera i denna ordning:
1. Nyheter som direkt rör Sverige eller svenska aktörer.
2. Händelser som redan diskuteras brett — där namnet på företaget, produkten eller personen är något vanligt folk känner igen och söker på.
3. EU-beslut, regleringar och rättsfall som får genomslag i Sverige.
4. Internationella nyheter med konkret betydelse för svenska verksamheter eller privatpersoner.

Välj bort branschinternt även när det är korrekt och aktuellt: modeller som pensioneras, versionsnummer, prisjusteringar på API:er, finansieringsrundor och personalförändringar. Sådant söker ingen på utanför branschen. Undantag: om händelsen påverkar något en vanlig användare märker i en tjänst hen använder — då är det den vinkeln som ska drivas, inte versionsnumret.

Undvik ren produktmarknadsföring, spekulativa rykten och nyheter utan verifierbar primärkälla.

Redovisa varje kandidat med: en föreslagen svensk rubrik, två-tre meningar om vad som hänt och varför det angår svenska läsare, den sökfras du tror att en vanlig person skulle använda för att hitta nyheten, samt de fullständiga URL:erna till de källor du faktiskt läst. Skriv ut URL:erna i klartext.

Kan du inte formulera en trovärdig sökfras för en kandidat är det ett tecken på att ingen letar efter den. Ta med den ändå i listan, men säg det rakt ut.`;

/** SDK 0.99 saknar typer för `fallbacks` (beta server-side-fallback-2026-07-01).
 *  Parametern serialiseras oförändrad i request-body:n, så den läggs på efter
 *  typkontrollen. Ta bort helpern när @anthropic-ai/sdk uppgraderas. */
function withFallbacks<T extends object>(params: T): T {
  return { ...params, fallbacks: 'default' } as T;
}

const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

/** Delas mellan alla anrop i en korning. */
type Deadline = { endsAt: number };
const msLeft = (dl: Deadline) => dl.endsAt - Date.now();

/** Request-options: avbryt nar budgeten tar slut, och lat inte SDK:ns
 *  standardomforsok multiplicera tiden. */
function opts(dl: Deadline) {
  return { signal: AbortSignal.timeout(Math.max(1000, msLeft(dl))), maxRetries: 1 };
}

type BetaParams = Anthropic.Beta.MessageCreateParamsNonStreaming;

/** Server-tools kör en serverloop med 10 iterationer som tak. Slår den i taket
 *  returneras stop_reason='pause_turn' och turen måste återupptas genom att
 *  assistant-svaret skickas tillbaka. Utan detta får man ett halvfärdigt svar
 *  utan felmeddelande. */
async function createWithResume(
  claude: Anthropic,
  params: BetaParams,
  dl: Deadline,
  maxResumes = 1,
): Promise<Anthropic.Beta.BetaMessage> {
  const messages = [...params.messages];
  let msg = await claude.beta.messages.create(withFallbacks({ ...params, messages }), opts(dl));
  // Varje resume skickar om hela konversationen och kostar lika mycket tid som
  // ursprungsanropet. Med 300 s budget finns bara rad for ett.
  for (let i = 0; i < maxResumes && msg.stop_reason === 'pause_turn' && msLeft(dl) > MIN_GENERATE_MS; i++) {
    messages.push({
      role: 'assistant',
      content: msg.content as unknown as Anthropic.Beta.BetaContentBlockParam[],
    });
    msg = await claude.beta.messages.create(withFallbacks({ ...params, messages }), opts(dl));
  }
  return msg;
}

function textOf(msg: Anthropic.Beta.BetaMessage): string {
  if (msg.stop_reason === 'refusal') {
    throw new Error('modellen nekade förfrågan (stop_reason=refusal)');
  }
  return msg.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:html|json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '');
}

function firstParagraph(html: string): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return '';
  return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 220);
}

function wordCount(html: string): number {
  return html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
}

/** Hämta en liggande omslagsbild från Unsplash. Returnerar URL eller null. */
async function unsplashImage(query: string): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${key}` }, cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      results?: { urls?: { regular?: string }; links?: { download_location?: string } }[];
    };
    // Flera ämnen ger ofta samma bildfras ("data center server racks" träffade
    // tre av sjutton i kön). Med per_page=1 blir det bokstavligen samma foto på
    // flera artiklar — därför slumpas ett av träffarna i stället.
    type Photo = { urls?: { regular?: string }; links?: { download_location?: string } };
    const results = (data.results ?? []).filter(
      (p: Photo): p is Photo & { urls: { regular: string } } => typeof p.urls?.regular === 'string',
    );
    if (!results.length) return null;
    const photo = results[Math.floor(Math.random() * results.length)];
    // Unsplash API-villkor: trigga en download-event (best-effort).
    if (photo.links?.download_location) {
      fetch(photo.links.download_location, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => {});
    }
    return photo.urls.regular;
  } catch {
    return null;
  }
}

/** Unsplash söker på engelska och är byggt för korta fraser. Koden skickade
 *  tidigare in hela den svenska rubriken, vilket i praktiken gav slumpmässiga
 *  träffar. Här tas en kort, konkret engelsk bildfras fram i stället.
 *  Returnerar null vid fel — då används rubriken som förut. */
async function imageQueryFor(claude: Anthropic, title: string, dl: Deadline): Promise<string | null> {
  try {
    const res = await claude.beta.messages.create(
      withFallbacks({
        model: MODEL,
        max_tokens: 300,
        betas: [FALLBACK_BETA],
        output_config: {
          format: {
            type: 'json_schema' as const,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['query'],
              properties: { query: { type: 'string' } },
            },
          },
        },
        messages: [
          {
            role: 'user' as const,
            content:
              `Artikelrubrik: "${title}". ` +
              'Ge en sökfras på ENGELSKA för att hitta ett passande redaktionellt foto på Unsplash. ' +
              'Två till fyra ord som beskriver ett konkret, fotograferbart motiv — inte abstrakta begrepp. ' +
              'Skriv till exempel "data center servers", inte "artificial intelligence". ' +
              'Inga varumärken och ingen text i bilden.',
          },
        ],
      }),
      opts(dl),
    );
    const q = (JSON.parse(textOf(res)) as { query?: string }).query?.trim();
    return q && q.length > 1 ? q : null;
  } catch {
    return null;
  }
}

/* ── Länkhygien ────────────────────────────────────────────────────
   Modellen får en lista giltiga interna sökvägar, men vi litar inte på
   att den håller sig till den. Interna länkar som inte finns i listan
   plattas till ren text; externa länkar får rel/target om de saknas. */

/** Mallen renderar titeln som <h1> (ArticleTemplate.tsx:116) och
 *  lib/article-html.ts strippar inga rubriker, så en <h1> i brödtexten ger
 *  sidan två h1:or. En promptregel är rådgivande — det här är garantin. */
function demoteH1(html: string): string {
  return html.replace(/<h1\b([^>]*)>/gi, '<h2$1>').replace(/<\/h1\s*>/gi, '</h2>');
}

/** Korrekturläsning i ett eget anrop.
 *
 *  Modellen som skrev texten är också den som är blind för sina egna stavfel —
 *  "Det är där tryckt märks först" gick ut i produktion. Ett separat anrop med
 *  enda uppgift att rätta språket ser texten med nya ögon.
 *
 *  Vakterna är hårda med flit: ändras ordantalet mer än fem procent, eller
 *  försvinner en länk, behåller vi originalet. Ett korrektur som passar på att
 *  skriva om texten är värre än stavfelet det rättade. */
type Faq = { question: string; answer: string };

/** Vanliga frågor till artikeln.
 *
 *  articles.faq fanns redan och används av hub-, recensions- och
 *  jämförelsemallarna, men ingenting fyllde den för type='post'. Frågorna
 *  ger FAQPage-schema och därmed chans till utökade sökresultat — och de här
 *  ämnena är frågeformade av naturen ("får jag lägga ut en AI-låt på Spotify").
 *
 *  Returnerar null vid fel eller tidsbrist. En artikel utan FAQ är fullt
 *  funktionell; mallen renderar bara ingenting. */
async function generateFaq(
  claude: Anthropic,
  title: string,
  html: string,
  dl: Deadline,
): Promise<Faq[] | null> {
  if (msLeft(dl) < 40_000) return null;
  try {
    const res = await claude.beta.messages.create(
      withFallbacks({
        model: MODEL,
        max_tokens: 2000,
        betas: [FALLBACK_BETA],
        output_config: {
          format: {
            type: 'json_schema' as const,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['faqs'],
              properties: {
                faqs: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['question', 'answer'],
                    properties: { question: { type: 'string' }, answer: { type: 'string' } },
                  },
                },
              },
            },
          },
        },
        messages: [
          {
            role: 'user' as const,
            content:
              `Artikeln "${title}" finns nedan. Skriv fyra vanliga frågor med svar.\n\n` +
              'Frågorna ska vara sådana en läsare faktiskt söker på — konkreta och ' +
              'frågeformade, inte rubriker med frågetecken.\n' +
              'Svaren: två till fyra meningar, direkta, på svenska.\n' +
              'Svara ENDAST utifrån vad som står i artikeln. Lägg inte till nya ' +
              'påståenden, siffror eller källor som inte finns i texten.\n' +
              'Upprepa inte en H2-rubrik som fråga.\n\n' +
              html,
          },
        ],
      }),
      opts(dl),
    );
    const parsed = JSON.parse(textOf(res)) as { faqs?: Faq[] };
    const faqs = (parsed.faqs ?? []).filter((f) => f.question?.trim() && f.answer?.trim());
    return faqs.length ? faqs.slice(0, 5) : null;
  } catch {
    return null;
  }
}

async function proofread(claude: Anthropic, html: string, dl: Deadline): Promise<string> {
  if (msLeft(dl) < 40_000) return html;
  try {
    const res = await claude.beta.messages.create(
      withFallbacks({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        betas: [FALLBACK_BETA],
        messages: [
          {
            role: 'user' as const,
            content:
              'Korrekturläs texten nedan. Rätta stavfel, särskrivningar, felböjningar och ' +
              'grammatiska fel.\n\n' +
              'Ändra INGET annat. Inte ordval, inte meningsbyggnad, inte struktur, inte ' +
              'HTML-taggar, inte länkar. Är texten redan korrekt returnerar du den oförändrad.\n\n' +
              'Svara med enbart den rättade HTML-koden, utan kommentarer.\n\n' +
              html,
          },
        ],
      }),
      opts(dl),
    );
    if (res.stop_reason === 'max_tokens') return html;
    const fixed = textOf(res);

    if (!fixed.startsWith('<')) return html;
    const linkCount = (s: string) => (s.match(/href="/g) || []).length;
    if (linkCount(fixed) !== linkCount(html)) return html;
    const before = wordCount(html);
    const after = wordCount(fixed);
    if (before === 0 || Math.abs(after - before) / before > 0.05) return html;

    return fixed;
  } catch {
    return html;
  }
}

function sanitizeLinks(
  html: string,
  allowedPaths: Set<string>,
): { html: string; internal: number; external: number } {
  let internal = 0;
  let external = 0;
  const out = html.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, attrs: string, inner: string) => {
      const href = attrs.match(/href\s*=\s*"([^"]*)"/i)?.[1];
      if (!href) return inner;

      if (href.startsWith('/')) {
        if (!allowedPaths.has(href)) return inner; // uppdiktad sökväg → ren text
        internal++;
        return match;
      }
      if (/^https?:\/\//i.test(href)) {
        external++;
        let a = attrs;
        if (!/\brel\s*=/i.test(a)) a += ' rel="nofollow noopener"';
        if (!/\btarget\s*=/i.test(a)) a += ' target="_blank"';
        return `<a${a}>${inner}</a>`;
      }
      return inner; // mailto:, ankare, relativa sökvägar → ren text
    },
  );
  return { html: out, internal, external };
}

/* ── Kontext som båda lägen delar ─────────────────────────────────── */

type Ctx = {
  categorySlugs: string[];
  usedSlugs: Set<string>;
  /** path → titel, för interna länkar. Paths har avslutande snedstreck
   *  eftersom sajten kör trailingSlash: true (se lib/links.ts). */
  linkTargets: { path: string; title: string }[];
  allowedPaths: Set<string>;
  recentTitles: string[];
};

/** DB lagrar path utan avslutande snedstreck, sajten kanoniserar med.
 *  Samma normalisering som lib/links.ts to(). */
function withSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/** PostgREST returnerar max 1000 rader per anrop. Ett ofullständigt slug-set
 *  gör att reserveSlug() kan dela ut en slug som redan finns, och då skriver
 *  upsert på path över en publicerad artikel istället för att skapa en ny.
 *  Därför sidindelat. */
const PAGE = 1000;

async function allSlugs(db: SupabaseClient): Promise<string[]> {
  const out: string[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from('articles')
      .select('slug')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`kunde inte läsa slugs: ${error.message}`);
    const page = data ?? [];
    out.push(...page.map((r: { slug: string }) => r.slug));
    if (page.length < PAGE) return out;
  }
}

async function loadContext(db: SupabaseClient): Promise<Ctx> {
  // Fel här sväljs inte: tomma listor skulle ge enum: [] i JSON-schemat
  // (ogiltigt schema → API 400) och dölja ett DB-fel bakom ett modellfel.
  const [cats, recent, usedSlugs] = await Promise.all([
    db.from('categories').select('slug'),
    db
      .from('articles')
      .select('title,path')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(LINK_CANDIDATES),
    allSlugs(db),
  ]);

  if (cats.error) throw new Error(`kunde inte läsa kategorier: ${cats.error.message}`);
  if (recent.error) throw new Error(`kunde inte läsa artiklar: ${recent.error.message}`);

  const categorySlugs = (cats.data ?? []).map((c: { slug: string }) => c.slug);
  if (!categorySlugs.length) {
    throw new Error('categories-tabellen är tom — kan inte bygga kategorischemat');
  }

  const linkTargets = (recent.data ?? [])
    .filter((r: { path: string | null }) => !!r.path)
    .map((r: { title: string; path: string }) => ({
      path: withSlash(r.path),
      title: r.title,
    }));

  return {
    categorySlugs,
    usedSlugs: new Set(usedSlugs),
    linkTargets,
    allowedPaths: new Set(linkTargets.map((t) => t.path)),
    recentTitles: linkTargets.slice(0, RECENT_TITLES).map((t) => t.title),
  };
}

function reserveSlug(ctx: Ctx, title: string): string {
  const base = slugify(title) || 'artikel';
  let s = base;
  let i = 2;
  while (ctx.usedSlugs.has(s)) s = `${base}-${i++}`;
  ctx.usedSlugs.add(s);
  return s;
}

/* ── Jobb ─────────────────────────────────────────────────────────── */

type Source = { url: string; title: string };

type Job = {
  title: string;
  category: string | null;
  slug: string;
  /** Sätts i topics-läget — markeras used efter lyckad publicering. */
  topicId?: number;
  /** Förgenererad omslagsbild från article_topics.image_url. Är den satt
   *  hoppas Unsplash över helt. Finns aldrig i nyhetsläget — de ämnena
   *  upptäcks vid körning och går inte att förbereda. */
  imageUrl?: string | null;
  /** Önskad längd i ord (article_topics.target_words). Overstyr promptens
   *  standard pa ~800 ord for amnen som fortjanar djup. */
  targetWords?: number | null;
  /** Sätts i nyhetsläget. */
  angle?: string;
  sources?: Source[];
};

async function takeTopics(db: SupabaseClient, ctx: Ctx): Promise<Job[]> {
  const { data, error } = await db
    .from('article_topics')
    .select('id,topic,category,image_url,target_words')
    .eq('used', false)
    .order('created_at', { ascending: true })
    .limit(COUNT + 10);
  if (error) {
    const hint = /article_topics/.test(error.message)
      ? ' (kör migrationen supabase/migrations/0012_article_topics.sql först)'
      : '';
    throw new Error(error.message + hint);
  }
  // Ett ämne vars slug redan är upptagen ÄR redan publicerat — troligen
  // utanför kön. Utan den här kontrollen la reserveSlug() på ett -2-suffix
  // och en dublett publicerades (id 915-917, 2026-08-18). Markera som
  // avklarat i stället och gå vidare till nästa ämne.
  const jobs: Job[] = [];
  const alreadyPublished: number[] = [];
  type Row = {
    id: number;
    topic: string;
    category: string | null;
    image_url: string | null;
    target_words: number | null;
  };
  for (const t of (data ?? []) as Row[]) {
    if (jobs.length >= COUNT) break;
    if (ctx.usedSlugs.has(slugify(t.topic))) {
      alreadyPublished.push(t.id);
      continue;
    }
    jobs.push({
      title: t.topic,
      category: t.category,
      slug: reserveSlug(ctx, t.topic),
      topicId: t.id,
      imageUrl: t.image_url,
      targetWords: t.target_words,
    });
  }
  if (alreadyPublished.length) {
    await db
      .from('article_topics')
      .update({ used: true, used_at: new Date().toISOString() })
      .in('id', alreadyPublished);
    console.warn(
      `[cron] ${alreadyPublished.length} ämne(n) hade redan en publicerad artikel — markerade som använda utan att generera om.`,
    );
  }
  return jobs;
}

/* ── Nyhetsläge ───────────────────────────────────────────────────── */

type Story = { title: string; angle: string; category: string; sources: Source[] };

async function findNewsStories(claude: Anthropic, ctx: Ctx, dl: Deadline): Promise<Job[]> {
  const today = new Date().toISOString().slice(0, 10);

  // Steg 1 — research med websökning. Fri text; strukturen plockas ut i steg 2.
  // (Delat i två anrop så att den strukturerade extraktionen inte behöver samsas
  //  med server-tool-loopen.)
  const research = await createWithResume(claude, {
    model: MODEL,
    // Briefingen behover inte vara lang — den ska bara mata extraktionssteget.
    max_tokens: 5000,
    betas: [FALLBACK_BETA],
    // Varje sokning ar en rundtur pa Anthropics sida. Atta ryms inte i 300 s.
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 4 }],
    system: [{ type: 'text', text: NEWS_RESEARCH_PROMPT }],
    messages: [
      {
        role: 'user',
        content:
          `Dagens datum är ${today}. Sök reda på de viktigaste AI-nyheterna publicerade sedan ${today} minus ett dygn.\n\n` +
          `Vi har redan publicerat följande artiklar — föreslå inget som överlappar dem:\n` +
          ctx.recentTitles.map((t) => `- ${t}`).join('\n'),
      },
    ],
  }, dl);
  const briefing = textOf(research);

  // Steg 2 — strukturera de tre bästa. Inga verktyg, bara schemat.
  const extracted = await claude.beta.messages.create(
    withFallbacks({
      model: MODEL,
      max_tokens: 4000,
      betas: [FALLBACK_BETA],
      output_config: {
        format: {
          type: 'json_schema' as const,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['stories'],
            properties: {
              stories: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['title', 'angle', 'category', 'sources'],
                  properties: {
                    title: { type: 'string' },
                    angle: { type: 'string' },
                    category: { type: 'string', enum: ctx.categorySlugs },
                    sources: {
                      type: 'array',
                      items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['url', 'title'],
                        properties: { url: { type: 'string' }, title: { type: 'string' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      messages: [
        {
          role: 'user',
          content:
            `Nedan är en researchsammanställning. Välj ${
              COUNT === 1
                ? 'den enskilt starkaste nyheten'
                : `de ${COUNT} starkaste nyheterna`
            } för en svensk AI-läsekrets ` +
            `och returnera den strukturerat. Rubriken ska vara färdig att publicera på svenska. ` +
            `Ta bara med källor vars fullständiga URL står i sammanställningen — hitta inte på URL:er.\n\n` +
            briefing,
        },
      ],
    }),
    opts(dl),
  );

  const raw = textOf(extracted);
  let parsed: { stories?: Story[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('kunde inte tolka researchsvaret som JSON');
  }

  const valid = new Set(ctx.categorySlugs);
  return (
    (parsed.stories ?? [])
      // Samma skydd som i takeTopics: en nyhet vars slug redan finns är
      // redan bevakad — publicera den inte igen under ett -2-suffix.
      .filter((s) => !ctx.usedSlugs.has(slugify(s.title)))
      .slice(0, COUNT)
      .map((s) => ({
        title: s.title,
        category: valid.has(s.category) ? s.category : null,
        slug: reserveSlug(ctx, s.title),
        angle: s.angle,
        sources: (s.sources ?? []).filter((src) => /^https?:\/\//i.test(src.url)),
      }))
  );
}

/* ── Generering + publicering ─────────────────────────────────────── */

type Result = {
  title: string;
  ok: boolean;
  slug?: string;
  words?: number;
  internalLinks?: number;
  faq?: number;
  author?: string;
  status?: string;
  sources?: number;
  error?: string;
};

async function generateAndPublish(
  claude: Anthropic,
  db: SupabaseClient,
  job: Job,
  ctx: Ctx,
  dl: Deadline,
): Promise<Result> {
  const isNews = !!job.sources;

  // Systemprompten kräver 2-3 interna länkar i BÅDA lägen, så länkmålen måste
  // med i båda. Utan listan hittar modellen på sökvägar, och sanitizeLinks()
  // plattar dem till ren text — instruktionen hade tyst fallerat.
  const linkBlock = [
    `Interna länkmål — använd endast dessa sökvägar, exakt som de står (med avslutande snedstreck):`,
    ...ctx.linkTargets.map((t) => `- ${t.title} — ${t.path}`),
  ].join('\n');

  const userPrompt = isNews
    ? [
        `Skriv en nyhetsartikel med rubriken "${job.title}".`,
        ``,
        `Vinkel: ${job.angle}`,
        ``,
        `Källor (använd endast dessa URL:er):`,
        ...(job.sources ?? []).map((s) => `- ${s.title} — ${s.url}`),
        ``,
        linkBlock,
        ``,
        `Ren HTML, börja med första <p>-taggen.`,
      ].join('\n')
    : [
        `Skriv en artikel med titeln "${job.title}".`,
        ``,
        // Modellen känner inte till dagens datum. Utan detta beskrivs redan
        // passerade tidsgränser som framtida — en artikel publicerad
        // 2026-08-21 skrev att EU-krav från 2 augusti "träder i kraft".
        `Dagens datum är ${new Date().toISOString().slice(0, 10)}. Kontrollera tempus mot det:`,
        `datum som passerat ska skrivas i dåtid, inte som något som ska hända.`,
        ``,
        `Hänvisar du till en lag, en studie, en rapport, en myndighet eller ett`,
        `EU-regelverk — länka till källan med <a href="URL" rel="nofollow noopener" target="_blank">.`,
        `Det gäller även namngivna studier och myndigheter: refererar du en studie`,
        `ska läsaren kunna klicka sig till den. Hittar du ingen säker URL, skriv ut`,
        `namn, årtal och paragraf i klartext i stället för att gissa en adress.`,
        ``,
        `Artikeln ska innehålla minst tre kontrollerbara faktauppgifter — årtal,`,
        `siffror, paragrafer, namngivna studier, rapporter eller myndigheter.`,
        `Räcker inte underlaget: skriv färre påståenden. Hitta aldrig på en siffra.`,
        ...(job.targetWords
          ? [
              ``,
              `Längd: cirka ${job.targetWords} ord. Det överstyr längdregeln i`,
              `systemprompten. Bygg ut med fler H2-sektioner där varje rubrik besvarar`,
              `en konkret fråga — inte med längre stycken.`,
            ]
          : []),
        ``,
        `Rör artikeln oro, ångest eller psykisk hälsa: avsluta med var läsaren kan`,
        `vända sig i Sverige — 1177 Vårdguiden, eller Mind på mind.se. Skriv det`,
        `bara när ämnet faktiskt kräver det, inte som standardtillägg.`,
        ``,
        linkBlock,
        ``,
        `Ren HTML, börja med första <p>-taggen.`,
      ].join('\n');

  // Bildfrågan behöver bara rubriken och körs därför parallellt med
  // genereringen — den kostar ingen extra väggklocka.
  const [msg, imageQuery] = await Promise.all([
    claude.beta.messages.create(
      withFallbacks({
        model: MODEL,
        // Thinking ryms inom samma tak som svarstexten. En lang artikel behover
        // darfor mer utrymme an standardvardet, annars kapas den mitt i.
        max_tokens: Math.min(
          16000,
          Math.max(MAX_TOKENS, Math.round((job.targetWords ?? 0) * 4.5)),
        ),
        betas: [FALLBACK_BETA],
        system: [{ type: 'text', text: isNews ? SYSTEM_PROMPT + NEWS_ADDENDUM : SYSTEM_PROMPT }],
        messages: [{ role: 'user', content: userPrompt }],
      }),
      opts(dl),
    ),
    // Har ämnet en förgenererad bild behövs ingen Unsplash-fras alls.
    job.imageUrl ? Promise.resolve(null) : imageQueryFor(claude, job.title, dl),
  ]);

  // En artikel som kapats mitt i HTML-koden passerar 400-ordsgränsen och skulle
  // publiceras trasig. Ordräkningen fångar inte det — stop_reason gör det.
  if (msg.stop_reason === 'max_tokens') {
    throw new Error(`svaret kapades av max_tokens (${MAX_TOKENS}) — publiceras inte`);
  }

  // Korrektur före länkhygienen, så att sanitizeLinks får sista ordet om
  // något skulle ha rubbats på vägen.
  const generated = await proofread(claude, demoteH1(textOf(msg)), dl);
  const { html, internal } = sanitizeLinks(generated, ctx.allowedPaths);
  const words = wordCount(html);
  if (words < 400) throw new Error(`för kort (${words} ord)`);

  const excerpt = firstParagraph(html);
  // Bild och FAQ är oberoende av varandra — kör dem parallellt så de inte
  // adderar två väntetider till budgeten.
  const [image, faq] = await Promise.all([
    job.imageUrl ? Promise.resolve(job.imageUrl) : unsplashImage(imageQuery ?? job.title),
    generateFaq(claude, job.title, html, dl),
  ]);

  const { error } = await db.from('articles').upsert(
    {
      slug: job.slug,
      title: job.title,
      excerpt,
      content_mdx: html,
      category: job.category,
      tags: [],
      featured_image: image,
      type: 'post',
      path: `/${job.slug}`,
      parent_slug: null,
      affiliate_url: null,
      // Satsningarna publiceras som utkast. De baar chefredaktorens namn och
      // ska lasas innan de gar ut; published_at=null haller dem borta fran
      // floden, sitemap och sin egen URL tills scripts/approve-article.ts kors.
      published_at: isFeature(job.targetWords) ? null : new Date().toISOString(),
      seo_title: `${job.title} | AI-Magasinet`,
      seo_description: excerpt,
      faq,
      author_slug: bylineFor(job.targetWords),
    },
    { onConflict: 'path' }
  );
  if (error) throw new Error(error.message);

  if (job.topicId != null) {
    await db
      .from('article_topics')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', job.topicId);
  }

  return {
    title: job.title,
    ok: true,
    slug: job.slug,
    words,
    internalLinks: internal,
    sources: job.sources?.length ?? 0,
    faq: faq?.length ?? 0,
    author: bylineFor(job.targetWords),
    status: isFeature(job.targetWords) ? 'utkast — vantar pa godkannande' : 'publicerad',
  };
}

/* ── Påfyllning av ämneskön ───────────────────────────────────────── */

async function refillTopicsIfLow(
  claude: Anthropic,
  db: SupabaseClient,
  ctx: Ctx,
  dl: Deadline,
): Promise<{ unused: number; refilled: number; error?: string }> {
  // Inte head:true — en HEAD-request har ingen body att läsa felet ur, så en
  // saknad tabell ger count=null *utan* error och påfyllningen körs i onödan.
  const { count, error: cErr } = await db
    .from('article_topics')
    .select('id', { count: 'exact' })
    .eq('used', false)
    .limit(1);
  if (cErr) return { unused: -1, refilled: 0, error: cErr.message };
  if (count == null) {
    return { unused: -1, refilled: 0, error: 'kunde inte räkna oanvända ämnen' };
  }

  const unused = count;
  if (unused >= REFILL_THRESHOLD) return { unused, refilled: 0 };

  // Alla befintliga ämnen (även använda) skickas in som dublettspärr.
  const { data: existing, error: eErr } = await db.from('article_topics').select('topic');
  if (eErr) return { unused, refilled: 0, error: eErr.message };
  const existingTopics = (existing ?? []).map((r: { topic: string }) => r.topic);

  const msg = await claude.beta.messages.create(
    withFallbacks({
      model: MODEL,
      max_tokens: 4000,
      betas: [FALLBACK_BETA],
      output_config: {
        format: {
          type: 'json_schema' as const,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['topics'],
            properties: {
              topics: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['topic', 'category'],
                  properties: {
                    topic: { type: 'string' },
                    category: { type: 'string', enum: ctx.categorySlugs },
                  },
                },
              },
            },
          },
        },
      },
      messages: [
        {
          role: 'user',
          content:
            `Föreslå ${REFILL_COUNT} nya artikelämnen för AI-Magasinet, ett svenskt magasin om artificiell intelligens ` +
            `för beslutsfattare, utvecklare och företagare.\n\n` +
            `Varje ämne ska vara en färdig, konkret artikelrubrik på svenska som håller minst ett år — ` +
            `guider, förklaringar, jämförelser och branschanalyser snarare än dagsaktuella nyheter. ` +
            `Sprid dem över kategorierna.\n\n` +
            `Dessa ämnen finns redan. Föreslå inget som överlappar dem:\n` +
            existingTopics.map((t) => `- ${t}`).join('\n'),
        },
      ],
    }),
    opts(dl),
  );

  let parsed: { topics?: { topic: string; category: string }[] };
  try {
    parsed = JSON.parse(textOf(msg));
  } catch {
    return { unused, refilled: 0, error: 'kunde inte tolka ämnesförslagen som JSON' };
  }

  const valid = new Set(ctx.categorySlugs);
  const rows = (parsed.topics ?? [])
    .filter((t) => t.topic?.trim())
    .slice(0, REFILL_COUNT)
    .map((t) => ({
      topic: t.topic.trim(),
      category: valid.has(t.category) ? t.category : null,
    }));
  if (!rows.length) return { unused, refilled: 0, error: 'inga giltiga ämnen returnerades' };

  // topic har unique-constraint (0012) — dubbletter ignoreras tyst.
  const { error: iErr } = await db
    .from('article_topics')
    .upsert(rows, { onConflict: 'topic', ignoreDuplicates: true });
  if (iErr) return { unused, refilled: 0, error: iErr.message };

  return { unused, refilled: rows.length };
}

/* ── Handler ──────────────────────────────────────────────────────── */

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (req.headers.get('authorization') !== `Bearer ${secret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  } else {
    console.warn('[cron] CRON_SECRET ej satt — endpointen körs oskyddad.');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || !process.env.ANTHROPIC_API_KEY) {
    return Response.json({ ok: false, error: 'Saknar env (Supabase/Anthropic).' }, { status: 500 });
  }
  const db = createClient(url, serviceKey, { auth: { persistSession: false } });
  const claude = new Anthropic();

  const mode = new URL(req.url).searchParams.get('mode') === 'news' ? 'news' : 'topics';
  const dl: Deadline = { endsAt: Date.now() + BUDGET_MS };

  let ctx: Ctx;
  let jobs: Job[];
  try {
    ctx = await loadContext(db);
    jobs = mode === 'news' ? await findNewsStories(claude, ctx, dl) : await takeTopics(db, ctx);
  } catch (e) {
    return Response.json(
      { ok: false, mode, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  // Genereringarna är oberoende av varandra och alla slugs är redan
  // reserverade, så de kan köras parallellt.
  // Researchsteget kan ata upp budgeten. Da ar det battre att sluta har och
  // rapportera an att bli dodad mitt i en upsert.
  if (jobs.length && msLeft(dl) < MIN_GENERATE_MS) {
    return Response.json(
      {
        ok: false,
        mode,
        error: `for lite tid kvar (${Math.round(msLeft(dl) / 1000)} s) — researchsteget tog for lang tid`,
        jobs: jobs.map((j) => j.title),
      },
      { status: 500 },
    );
  }

  const settled = await Promise.allSettled(
    jobs.map((job) => generateAndPublish(claude, db, job, ctx, dl)),
  );
  const results: Result[] = settled.map((s, i) =>
    s.status === 'fulfilled'
      ? s.value
      : {
          title: jobs[i].title,
          ok: false,
          error: s.reason instanceof Error ? s.reason.message : String(s.reason),
        },
  );

  // Får aldrig fälla genereringen.
  let topics: Awaited<ReturnType<typeof refillTopicsIfLow>>;
  try {
    topics =
      msLeft(dl) < 45_000
        ? { unused: -1, refilled: 0, error: 'hoppade over — for lite tid kvar' }
        : await refillTopicsIfLow(claude, db, ctx, dl);
  } catch (e) {
    topics = { unused: -1, refilled: 0, error: e instanceof Error ? e.message : String(e) };
  }

  return Response.json({
    ok: true,
    mode,
    generated: results.filter((r) => r.ok).length,
    elapsedMs: BUDGET_MS - msLeft(dl),
    results,
    topics,
  });
}
