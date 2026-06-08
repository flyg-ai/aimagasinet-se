/**
 * Generate + publish two news articles in strict order so GPT-5 ends up
 * newest (top of homepage):
 *
 *   1. /vibe-coding-2026        (~2000 ord, teknik-modeller) — nyhet + praktik
 *   2. /gpt-5-recension-2026    (~2000 ord, teknik-modeller) — granskande recension
 *
 * Covers are compressed to WebP (q=80, max-width 1200px) via Sharp and
 * uploaded to bucket featured-images/YYYY/MM/. published_at is now() but
 * stamped sequentially (i*1000ms) so GPT-5 sits above vibe-coding in the
 * homepage list ordered by published_at desc.
 *
 *   npx tsx scripts/publish-vibe-gpt5.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

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
Expert, rak, praktisk svenska. Inga floskler. Inga emojis. Konkreta verktygsnamn, ungefärliga priser och faktiska exempel. Skriv som en kunnig teknikjournalist — nyhetsmässigt, lätt kritiskt, aldrig reklamigt.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan rubriken). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3>, <p>, <ul>/<ol>+<li>, <a href>, <strong>. För jämförelse-data: använd <table> med <thead>/<tbody>.`;

type ArticleSpec = {
  slug: string;
  title: string;
  category: 'teknik-modeller';
  excerpt: string;
  imagePath: string;
  tags: string[];
  wordTarget: number;
  brief: string;
};

const ARTICLES: ArticleSpec[] = [
  {
    slug: 'vibe-coding-2026',
    title: 'Vibe coding exploderar — så förändrar AI hur appar byggs',
    category: 'teknik-modeller',
    excerpt:
      'Vibe coding — att bygga appar genom att beskriva vad du vill i naturligt språk — växer explosionsartat 2026. Vi går igenom trenden, verktygen som driver den (Lovable, Cursor, Replit, v0) och frågan alla ställer: hotar det utvecklarjobben?',
    imagePath: 'C:/Users/hallb/Desktop/vibe-coding-2026.png',
    tags: ['vibe coding', 'Lovable', 'Cursor', 'Replit', 'v0', 'AI-kod', 'no-code'],
    wordTarget: 2000,
    brief: `Skriv en nyhetsartikel med praktiskt inslag (~2000 ord) om "vibe coding" — den exploderande trenden där man bygger appar genom att beskriva vad man vill i naturligt språk och låter AI skriva koden.

Vinkel: nyhet först, sedan en kort praktisk del. Nyhetsmässig ton, lätt kritisk, inte hype-reklam.

Struktur:
- Intro (1-2 stycken): Slå an trenden direkt med siffror och momentum. Termen "vibe coding" myntades av Andrej Karpathy i februari 2025 och har sedan dess gått från Twitter-skämt till en av de snabbast växande rörelserna inom mjukvaruutveckling. Nämn tillväxt: verktyg som Lovable och Cursor har dragit in hundratals miljoner dollar i intäkter på rekordtid, miljontals appar har byggts av icke-utvecklare, och en stor andel av ny kod skrivs nu med AI-assistans. (Använd ungefärliga, rimliga siffror och formuleringar som "uppskattningsvis" / "enligt företagens egna uppgifter" — påstå inte exakt statistik som fakta.)
- <h2>Vad är vibe coding egentligen?</h2> — förklara konceptet: du beskriver i prompt vad du vill ha, AI:n genererar koden, du itererar i naturligt språk istället för att skriva varje rad själv. Skillnaden mot vanlig kodning och mot klassiska no-code-verktyg. Karpathys ursprungliga beskrivning ("you fully give in to the vibes, forget that the code even exists"). Var ärlig om var det fungerar (prototyper, MVP:er, interna verktyg) och var det inte gör det (komplex produktionskod, säkerhetskritiska system).
- <h2>Verktygen som driver trenden</h2> med <h3> för var och en:
  * <h3>Lovable</h3> — svenskt(!) bolag, bygg fullstack-webbappar från en prompt, snabb tillväxt, riktar sig till icke-tekniska grundare
  * <h3>Cursor</h3> — AI-första kodeditor (fork av VS Code), populärast bland riktiga utvecklare, Composer/agent-läge, drivs i stor utsträckning av Claude
  * <h3>Replit</h3> — webbaserad miljö med "Agent" som bygger och deployar appar, allt i webbläsaren
  * <h3>v0</h3> — Vercels verktyg, genererar React/Next.js-UI från prompt, bra på snygga gränssnitt
  Inkludera gärna en kort <table> som jämför de fyra (Verktyg, Bäst för, Målgrupp, Ungefärligt pris).
- <h2>Vad säger utvecklare och företag?</h2> — citat-känsla (formulera som typiska/representativa röster, inte påhittade exakta citat från namngivna personer — använd t.ex. "Många seniora utvecklare beskriver det som…", "Grundare utan teknisk bakgrund vittnar om…"). Ta med både entusiasm (snabbhet, sänkt tröskel) och skepsis (kvalitet, teknisk skuld, "det funkar tills det inte funkar").
- <h2>Hotar vibe coding utvecklarjobben?</h2> — den kontroversiella vinkeln. Två läger: de som menar att junior-rollerna krymper och de som menar att utvecklare blir mer produktiva och flyttar upp i värdekedjan (review, arkitektur, att städa upp AI-genererad kod). Var balanserad men våga ha en åsikt. Nämn begreppet "teknisk skuld i stor skala".
- <h2>Kom igång med vibe coding på 5 minuter</h2> — kort, konkret praktisk del. En numrerad <ol>: 1) välj verktyg (Lovable för webbapp utan kod, Cursor om du redan kodar), 2) beskriv din app i en tydlig prompt — exempel på en bra prompt, 3) iterera i små steg, 4) testa direkt i förhandsvisningen, 5) deploya. Ge ett konkret prompt-exempel.
- Avsluta med <h2>Slutsats</h2> — vibe coding är här för att stanna, men ersätter inte förståelse för kod; den som kombinerar prompt-skicklighet med teknisk grund vinner.

Länka naturligt till denna interna sida via HTML <a href>, där det passar i texten (t.ex. i verktygsavsnittet eller slutsatsen):
- /ai-verktyg/ai-kod-verktyg/ — vår stora jämförelse av AI-verktyg för kod`,
  },
  {
    slug: 'gpt-5-recension-2026',
    title: 'GPT-5 testad — vad är nytt och hur bra är den egentligen?',
    category: 'teknik-modeller',
    excerpt:
      'OpenAI:s GPT-5 är här. Vi har testat den på kod, text, analys och kreativitet, jämfört den mot Claude och Gemini, och gått igenom pris och tillgänglighet. Här är vår dom: är den värd att byta till?',
    imagePath: 'C:/Users/hallb/Desktop/gpt-5-recension-2026.png',
    tags: ['GPT-5', 'OpenAI', 'ChatGPT', 'recension', 'Claude', 'Gemini', 'AI-modeller'],
    wordTarget: 2000,
    brief: `Skriv en granskande recension/nyhetsartikel (~2000 ord) om OpenAI:s GPT-5: "GPT-5 testad — vad är nytt och hur bra är den egentligen?".

Vinkel: kritisk, testande recension med nyhetston. Inte reklam. Var ärlig om både styrkor och svagheter, och om osäkerhet (formulera prestandasiffror som "i våra tester" / "enligt OpenAI" snarare än absoluta sanningar).

Struktur:
- Intro (1-2 stycken): GPT-5 är OpenAI:s största modelluppdatering sedan GPT-4 och har mötts av enorma förväntningar. Slå an frågan direkt: är det ett verkligt språng eller en inkrementell förbättring? Sätt scenen — Claude och Gemini har pressat OpenAI hårt.
- <h2>Vad är nytt i GPT-5 jämfört med GPT-4?</h2> — de viktigaste förändringarna: enad modell som själv väljer hur länge den ska "tänka" (inbyggt resonemang istället för separata o-modeller), större och mer pålitlig kontext, färre hallucinationer, bättre instruktionsföljning, starkare på kod och agentiska arbetsflöden, multimodalitet. Var konkret men markera vad som är OpenAI:s påståenden vs vad du själv testat.
- <h2>Prestanda i våra tester</h2> med <h3>:
  * <h3>Kod</h3> — hur bra genererar och felsöker den kod, agent-uppgifter, jämfört med tidigare
  * <h3>Text och svenska</h3> — skrivkvalitet, ton, hur bra svenska
  * <h3>Analys och resonemang</h3> — flerstegsproblem, matte, logik
  * <h3>Kreativitet</h3> — storytelling, idégenerering, röst
- <h2>GPT-5 vs Claude vs Gemini</h2> — den jämförande kärnan. Inkludera en <table> (kolumner: Område, GPT-5, Claude, Gemini) med rader för Kod, Svensk text, Analys/resonemang, Kreativitet, Kontext, Pris. Skriv sedan ett par stycken som nyanserar: var GPT-5 leder (resonemang, agent-arbetsflöden), var Claude fortfarande är starkast (svensk text, kodkvalitet enligt många utvecklare), var Gemini vinner (pris, gratis-tier, Google-integration).
- <h2>Pris och tillgänglighet</h2> — hur når man GPT-5 (ChatGPT Free med begränsning, Plus ~20 USD/mån, Pro, API-prissättning per miljon tokens), vilka nivåer/varianter som finns (t.ex. mini/nano för billigare bruk). Markera att exakta priser kan ändras.
- <h2>Vår dom — är GPT-5 värd att byta till?</h2> — tydligt ställningstagande efter användarprofil: för befintliga ChatGPT-användare, för utvecklare, för svenska skribenter, för den prismedvetne. Våga ge ett rakt svar istället för "det beror på".
- Avsluta med <h2>Slutsats</h2>.

Länka naturligt till dessa interna sidor via HTML <a href> där det passar i texten:
- /ai-verktyg/chatgpt/ — vår fullständiga ChatGPT-recension
- /chatgpt-vs-claude-vs-gemini-2026 — vår stora jämförelse ChatGPT vs Claude vs Gemini`,
  },
];

async function compressAndUpload(localPath: string, slug: string): Promise<string> {
  const orig = readFileSync(localPath);
  const webp = await sharp(orig)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${slug}.webp`;
  const { error } = await db.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  console.log(`    ${basename(localPath)}  ${(orig.length / 1024).toFixed(0)}→${(webp.length / 1024).toFixed(0)}KB  → ${pub.publicUrl}`);
  return pub.publicUrl;
}

async function generate(a: ArticleSpec): Promise<string> {
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 12000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: [
        `Artikel: ${a.title}`,
        `Slug: ${a.slug}`,
        `Kategori: ${a.category}`,
        `Mållängd: ~${a.wordTarget} ord`,
        '',
        a.brief,
        '',
        `Skriv artikeln nu. ~${a.wordTarget} ord, ren HTML, börja med första <p>-taggen.`,
      ].join('\n'),
    }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function publish(a: ArticleSpec, contentMdx: string, featuredImage: string, publishedAt: Date) {
  const row = {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content_mdx: contentMdx,
    category: a.category,
    tags: a.tags,
    featured_image: featuredImage,
    type: 'post' as const,
    path: `/${a.slug}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: publishedAt.toISOString(),
    seo_title: `${a.title} | AI-Magasinet`,
    seo_description: a.excerpt,
  };
  const { data, error } = await db
    .from('articles')
    .upsert(row, { onConflict: 'path' })
    .select('id,path,published_at');
  if (error) throw new Error(`publish ${a.slug}: ${error.message}`);
  return data?.[0];
}

async function main() {
  console.log(`Publishing ${ARTICLES.length} articles via ${MODEL}…\n`);
  let i = 0;
  for (const a of ARTICLES) {
    i++;
    console.log(`—— [${i}/${ARTICLES.length}] ${a.slug} ——`);
    const t0 = Date.now();
    try {
      console.log('  Compressing + uploading cover…');
      const imageUrl = await compressAndUpload(a.imagePath, a.slug);

      console.log('  Generating article via Sonnet…');
      const html = await generate(a);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

      // Sequential published_at — article 2 (GPT-5) gets a clearly later
      // timestamp so the homepage ordering by published_at desc puts it on top.
      const publishedAt = new Date(Date.now() + i * 1000);
      const r = await publish(a, html, imageUrl, publishedAt);
      const ms = Date.now() - t0;
      console.log(`  ✓ ${words}w  ${(ms / 1000).toFixed(1)}s  id=${r?.id} published_at=${r?.published_at}\n`);
    } catch (e) {
      console.error(`  ✗ FAILED: ${e instanceof Error ? e.message : e}\n`);
    }
  }
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
