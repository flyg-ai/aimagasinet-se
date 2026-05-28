/**
 * Generate + publish two posts in strict order so the second one ends
 * up newest on the homepage:
 *
 *   1. /ai-for-ehandel-2026          (~2000 ord, foretag-aktorer)
 *   2. /chatgpt-vs-claude-vs-gemini-2026  (~2500 ord, teknik-modeller)
 *
 * Both covers are compressed to WebP (q=80, max-width 1200px) via Sharp
 * and uploaded to bucket featured-images/2026/05/. Published_at is set
 * sequentially so the comparison article sits above the e-handel one
 * in the homepage chronological list.
 *
 *   npx tsx scripts/publish-two-articles.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';

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
Expert, rak, praktisk svenska. Inga floskler. Inga emojis. Konkreta verktygsnamn, ungefärliga priser och faktiska exempel.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3>, <p>, <ul>/<ol>+<li>, <a href>, <strong>. För jämförelse-data: använd <table> med <thead>/<tbody>.`;

type ArticleSpec = {
  slug: string;
  title: string;
  category: 'foretag-aktorer' | 'teknik-modeller';
  excerpt: string;
  imagePath: string;
  tags: string[];
  wordTarget: number;
  brief: string;
};

const ARTICLES: ArticleSpec[] = [
  {
    slug: 'ai-for-ehandel-2026',
    title: 'AI för e-handel 2026 — Så ökar du försäljningen med AI',
    category: 'foretag-aktorer',
    excerpt: 'Konkreta AI-verktyg som lyfter omsättningen i e-handeln 2026 — från produktbeskrivningar och bildgenerering till kundservice-bottar och prediktiv lagerstyrning.',
    imagePath: 'C:/Users/hallb/Desktop/ai-for-e-handel-2026.png',
    tags: ['e-handel', 'AI för företag', 'försäljning', 'shopify', 'klarna'],
    wordTarget: 2000,
    brief: `Skriv en praktisk B2B-guide (~2000 ord) om AI för e-handel 2026.

Sidan ska hjälpa svenska e-handlare förstå var AI faktiskt flyttar siffror — inte demo-magi, utan ROI-bevisade use cases.

Struktur:
- Intro (1-2 stycken): 2026 är året då AI faktiskt skalat in i e-handeln. Inte som demo-prat — utan i form av lyckade produkt-recommendation-engines, AI-genererade produktbeskrivningar och chatbottar som löser 60% av support-ärendena.
- <h2>Sex AI-områden där svenska e-handlare ökar försäljningen 2026</h2>
- <h2>1. AI-genererade produktbeskrivningar och alt-texter</h2> — verktyg som ChatGPT/Claude för bulk-generering, SEO-vinster, vad svenska e-handlare som BLIW eller Babyland gör i dag
- <h2>2. AI-bildgenerering för produktbilder och lifestyle</h2> — Adobe Firefly för bakgrundsbyte, Midjourney för lifestyle-shots, Remove.bg för cutouts
- <h2>3. Personalisering och rekommendationsmotorer</h2> — Klaviyo AI för e-post, Algolia för on-site sök, Shopify Magic
- <h2>4. AI-driven kundservice</h2> — Intercom Fin, Zendesk AI, hur det integreras med Klarna och svenska betalflöden
- <h2>5. Prediktiv lagerstyrning och prissättning</h2> — verktyg för demand forecasting, dynamisk prissättning
- <h2>6. Annonsoptimering med AI</h2> — Meta Advantage+, Google PMax, AdCreative.ai
- <h2>Konkreta ROI-exempel från 2025</h2> — case-studies (kort, beskrivande): X% kortare svarstider, Y% ökad konvertering
- <h2>Vanliga fallgropar</h2> — överautomation, kvalitet på AI-genererad text, GDPR-aspekter
- Avsluta med <h2>Så kommer du igång — en 30-dagars plan</h2>

Länka naturligt 4-6 av dessa via HTML <a href>:
- /ai-verktyg/foretag — AI för företag
- /ai-verktyg/foretag/yrke/marknadsforing/sociala-medier — AI för sociala medier
- /ai-verktyg/foretag/yrke/marknadsforing/annonser — AI för annonser
- /ai-verktyg/foretag/yrke/kundservice/chatbot — AI-chatbottar
- /ai-verktyg/ai-text-verktyg/chatgpt — ChatGPT
- /ai-verktyg/ai-bild-verktyg/adobe-firefly — Adobe Firefly
- /ai-verktyg/ai-bild-verktyg/midjourney — Midjourney`,
  },
  {
    slug: 'chatgpt-vs-claude-vs-gemini-2026',
    title: 'ChatGPT vs Claude vs Gemini 2026 — Vilket AI är bäst?',
    category: 'teknik-modeller',
    excerpt: 'Vi testar de tre största AI-modellerna sida vid sida på svensk text, kod, analys, kreativitet och pris — komplett jämförelse med vinnare per kategori.',
    imagePath: 'C:/Users/hallb/Desktop/chatgpt-vs-claude-vs-gemini-2026.png',
    tags: ['ChatGPT', 'Claude', 'Gemini', 'jämförelse', 'GPT-5', 'Claude Sonnet 4.6'],
    wordTarget: 2500,
    brief: `Skriv en grundlig jämförelse-artikel (~2500 ord) "ChatGPT vs Claude vs Gemini 2026".

Sidan ska vara *den* svenska källan för vilken AI som är bäst för olika användningsfall. Krävt: skarpa vinnare per kategori, inte luddiga "det beror på"-svar.

Struktur:
- Intro (1-2 stycken): Tre modeller har dominerat AI-året 2026 — GPT-5 från OpenAI, Claude Sonnet 4.6 från Anthropic och Gemini 2.5 Pro från Google. Vi testar dem alla på det som spelar roll för svenska användare.
- <h2>De tre modellerna i siffror</h2> — inkludera en <table> med kolumner: Modell, Senaste version, Kontext, Priser (API), Modaliteter, Hemmaplattform. Rader: ChatGPT (GPT-5), Claude (Sonnet 4.6), Gemini (2.5 Pro).
- <h2>Testmetodik</h2> — vi körde fem kategorier: svensk text, kod, analys & resonemang, kreativitet, pris/prestanda
- <h2>1. Svensk text — vem skriver bäst svenska?</h2>
  * Vinnare: Claude. Diskutera varför (bättre grammatik, mindre direktöversatt engelska, naturligare ton)
  * Tvåa: Gemini
  * Trea: ChatGPT
- <h2>2. Kod — vem genererar bäst code?</h2>
  * Vinnare: Claude (Sonnet 4.6 är branschstandard i Cursor)
  * Tvåa: ChatGPT
  * Trea: Gemini
- <h2>3. Analys och resonemang</h2>
  * Vinnare: ChatGPT (GPT-5 med thinking-modell)
  * Tvåa: Claude
  * Trea: Gemini
- <h2>4. Kreativitet — storytelling och idégenerering</h2>
  * Vinnare: Claude (mest nyanserad röst)
  * Tvåa: ChatGPT
  * Trea: Gemini
- <h2>5. Pris och prestanda</h2>
  * Vinnare: Gemini (mest generös gratis-tier + billigast API)
  * Tvåa: Claude (Sonnet 4.6 bästa $/kvalitet)
  * Trea: ChatGPT (dyrast på toppmodellerna)
- <h2>Sammanfattningstabell — vinnare per kategori</h2> — <table> med fem rader, kolumn 1 = kategori, 2-4 = de tre modellerna med ✓ på vinnaren och summary
- <h2>Så väljer du — beslutsguide efter användarprofil</h2>
  * Skribent/copywriter → Claude
  * Utvecklare → Claude (eller GPT-5)
  * Researcher/analytiker → ChatGPT
  * Småföretagare som vill ha bäst gratis → Gemini
  * Google-Workspace-användare → Gemini
- <h2>Vad har förändrats sedan 2024?</h2> — kort om GPT-4 → GPT-5, Claude 3.5 → 4.6, Gemini 1.5 → 2.5
- <h2>Avgörande nyheter att hålla koll på 2026-2027</h2> — vad är på väg
- Avsluta med <h2>Slutsats — vi ger Claude marginalvinsten 2026</h2>

Länka naturligt 4-6 av dessa via HTML <a href>:
- /ai-verktyg/ai-text-verktyg/chatgpt — ChatGPT-recension
- /ai-verktyg/ai-text-verktyg/claude — Claude-recension
- /ai-verktyg/ai-text-verktyg/gemini — Gemini-recension
- /ai-verktyg/ai-text-verktyg — Alla AI-textverktyg
- /ai-verktyg/gratis/ai-text — Gratis AI-text-tiers
- /basta-ai-prompter-chatgpt-2026 — ChatGPT-prompter`,
  },
];

function contentTypeFor(filename: string): string {
  const ext = extname(filename).toLowerCase();
  if (ext === '.webp') return 'image/webp';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

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
  void contentTypeFor; // keep helper exported for parity with publish-article.ts
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

      // Sequential publish_at — second article gets a clearly later
      // timestamp so the homepage ordering by published_at picks
      // ChatGPT-vs-Claude-vs-Gemini as the freshest.
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
