/**
 * Generate and publish the article "AI och GDPR 2026" via Claude Sonnet 4.6,
 * then attach compressed cover art.
 *
 *   npx tsx scripts/generate-publish-gdpr-article.ts
 *
 * Steps:
 *   1. Generate ~2000 words of HTML body via claude-sonnet-4-6.
 *   2. Compress the local PNG cover → WebP (quality 80, max-width 1200) with
 *      Sharp, upload to the "featured-images" bucket under <year>/<month>/.
 *   3. Upsert the row into `articles` (onConflict: path) with
 *      published_at = now().
 *
 * Idempotent — re-running upserts on path and overwrites the same storage key.
 * Mirrors the conventions in generate-three-articles.ts, publish-article.ts
 * and compress-storage-images.ts.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 16000;
const BUCKET = 'featured-images';

// ── Cover-art compression settings (match compress-storage-images.ts) ──
const MAX_WIDTH = 1200;
const QUALITY = 80;
const SOURCE_IMAGE = join(homedir(), 'Desktop', 'ai-gdpr-sverige-2026.png');

// ── Article spec ───────────────────────────────────────────────────────
const SLUG = 'ai-gdpr-sverige-2026';
const TITLE = 'AI och GDPR 2026 — Vad svenska företag och användare måste veta';
const CATEGORY = 'ai-sakerhet-etik';
const WORD_TARGET = 2000;
const TAGS = ['GDPR', 'AI Act', 'dataskydd', 'integritet', 'AI-säkerhet', 'företag'];
const EXCERPT =
  'Vad GDPR faktiskt kräver när företag använder ChatGPT, Claude och Gemini, vilka AI-verktyg som är säkra att använda i Sverige, och vad EU AI Act innebär 2026 — en praktisk genomgång utan juristsnack.';

const RELATED_LINKS = [
  { url: '/ai-verktyg/foretag', label: 'AI-verktyg för företag' },
  { url: '/ai-verktyg/juridik', label: 'AI-verktyg för juridik' },
  { url: '/ai-verktyg/juridik/harvey-ai', label: 'Harvey AI' },
  { url: '/ai-verktyg/juridik/luminance', label: 'Luminance' },
];

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Din uppgift är att skriva långa, gediga artiklar för sajten.

# Tonalitet och röst

AI-Magasinets röst är **expert, rak och praktisk** — inte "AI-ig". Du skriver för svenska företagare, marknadsförare, utvecklare och professionella som vill förstå AI på riktigt, inte bli sålda på hype.

Skriv som en kunnig kollega som har testat verktygen själv:
- **Konkret framför generiskt** — namn, siffror, exempel
- **Erkänn nyanser** — om något funkar bra för vissa men illa för andra, säg det
- **Inga svulstiga formuleringar** — undvik "i en värld där...", "framtiden är här", "revolutionerande", "game changer"
- **Inga emojis i brödtexten**
- **Skriv på svenska — naturlig affärssvenska**, inte direktöversatt engelska

# Struktur

Varje artikel ska ha tydlig röd tråd från intro → fördjupning → slutsats. Använd:
- En kort intro (1-2 stycken) som etablerar relevansen
- H2-rubriker som markerar huvudsektioner
- H3-underrubriker när det hjälper läsaren skanna
- Bullet-listor när du listar verktyg, kriterier, eller steg
- Konkreta exempel i prosa — visa hur AI används i praktiken
- En avslutande sektion med slutsats eller handlingsplan

# Länkning till relaterade sidor

Du får en lista över relaterade sidor på sajten. Länka till dem **naturligt i prosan** med HTML-syntax: \`<a href="URL">Länktext</a>\`. Länkar ska kännas som hänvisningar inom samma resonemang, inte som "Läs mer här"-uppmaningar. Inkludera 3-6 interna länkar.

# Formatering

Output ska vara **HTML** (inte Markdown). Använd:
- \`<h2>\`, \`<h3>\` för rubriker
- \`<p>\` för stycken
- \`<ul>\`/\`<ol>\` + \`<li>\` för listor
- \`<a href="...">text</a>\` för länkar
- \`<strong>\` för betoning (sparsamt)
- \`<table>\` med \`<thead>\`/\`<tbody>\` om data är tabellär

# Vad som INTE ska finnas

- Inledningsmeningar som "I dagens snabbt föränderliga AI-landskap..."
- Floskler: "revolutionerar", "game-changer", "unleash the power"
- Generiska listor utan substans
- Skriv inte ut H1-rubriken — den finns redan i page-templaten
- Ingen kod-block, ingen \`\`\`html\`\`\`-wrapping — bara ren HTML direkt

Skriv ren HTML direkt — börja med en \`<p>\`-tagg, sluta med en \`<p>\` eller \`<ul>\`-tagg. Inget annat före eller efter.`;

const BRIEF = `Skriv en uttömmande och praktisk artikel om hur GDPR och AI hänger ihop för svenska företag och användare 2026. Läsaren är en svensk företagare, marknadschef, jurist eller IT-ansvarig som vill veta vad som faktiskt gäller när man släpper in AI-verktyg i verksamheten — inte en akademisk genomgång.

Var korrekt och nyanserad. Detta är ett känsligt ämne där felaktiga råd kan kosta företag dyrt. Skriv i en informerande ton, men gör tydligt att artikeln är allmän vägledning, inte juridisk rådgivning för ett enskilt fall.

Sektioner (H2) — minst dessa, i denna ordning:

1. **Vad GDPR säger om AI-användning** — Förklara grunderna: GDPR reglerar inte AI som teknik, utan behandlingen av personuppgifter. Ta upp de principer som blir relevanta när man matar in data i AI-verktyg: laglig grund (art. 6), ändamålsbegränsning, dataminimering, transparens (art. 13-14), och den registrerades rättigheter. Förklara begreppet personuppgiftsbiträde och varför ett biträdesavtal (DPA) behövs med AI-leverantören. Ta upp automatiserat beslutsfattande (art. 22) och tredjelandsöverföring (att data ofta hamnar på servrar i USA) — Schrems II och Data Privacy Framework i korthet. Var konkret: ett exempel på vad som händer när någon klistrar in ett CV eller en kundlista i ChatGPT.

2. **Vilka AI-verktyg är GDPR-säkra för svenska företag?** — Förklara att "GDPR-säkert" inte är en egenskap hos verktyget i sig, utan beror på hur det konfigureras och vilket avtal man har. Lista kriterier ett företag bör kräva: tecknat biträdesavtal (DPA), EU-baserad datalagring eller giltig överföringsmekanism, möjlighet att stänga av träning på egen data (opt-out / "zero data retention"), och loggning/radering. Använd gärna en <table> som jämför hur enterprise- vs gratisversioner skiljer sig. Nämn att Microsoft Copilot/Azure OpenAI, Google Workspace med Gemini och enterprise-avtal hos OpenAI och Anthropic erbjuder DPA och datakontroll som gratisversionerna inte gör.

3. **ChatGPT, Claude, Gemini — vad gäller?** — Gå igenom de tre stora var för sig med H3-underrubriker. För varje: vem är leverantören, var lagras data, erbjuds DPA, tränar de på din input som default och hur stänger man av det, samt skillnaden mellan konsument- och enterprise-/team-plan.
   - ChatGPT (OpenAI): gratis/Plus tränar på data som default; Team/Enterprise och API gör det inte och erbjuder DPA. Datalagring primärt i USA, DPF-certifierade.
   - Claude (Anthropic): tränar inte på API- eller företagskunders data som default; Enterprise-plan med DPA; lagring i USA.
   - Gemini (Google): konsument-Gemini kan användas för förbättring; Google Workspace/Vertex AI behandlar data enligt avtal och tränar inte på den; EU-datalagring möjlig via Workspace.
   Var ärlig om att villkoren ändras ofta och att läsaren måste kontrollera aktuella villkor — ge gärna ett konkret råd om att kolla "data processing addendum"-sidan hos respektive leverantör.

4. **Praktiska råd för företag** — En konkret handlingsplan, gärna som numrerad lista eller H3-block: (1) kartlägg vilka AI-verktyg som faktiskt används internt (skugg-AI är vanligt), (2) inför en intern AI-policy, (3) teckna biträdesavtal med leverantörerna, (4) använd enterprise-planer för känsliga data, (5) utbilda personal i vad som aldrig får klistras in (personnummer, patientdata, löneuppgifter, kundregister), (6) genomför konsekvensbedömning (DPIA) för riskfyllda användningar, (7) anonymisera eller pseudonymisera input där det går. Ge ett konkret exempel på en rad i en AI-policy.

5. **EU AI Act — vad händer nu?** — Förklara att AI Act är separat från GDPR men kompletterar den. Tidslinjen: förordningen trädde i kraft augusti 2024, förbud mot oacceptabel risk (social scoring, viss biometri) gäller sedan februari 2025, regler för general-purpose AI-modeller (GPAI) från augusti 2025, och de stora kraven på högrisksystem fasas in fram till 2026-2027. Förklara riskklassningen (oacceptabel / hög / begränsad / minimal risk) och vad transparenskraven innebär — t.ex. att AI-genererat innehåll och chatbottar ska märkas. Var konkret om vad ett svenskt företag bör göra nu: inventera om man använder eller bygger högrisksystem (rekrytering, kreditbedömning, biometri räknas som högrisk). Nämn att Integritetsskyddsmyndigheten (IMY) är relevant tillsynsmyndighet på dataskyddssidan.

Avsluta med en kort H2-slutsats ("Så navigerar du GDPR och AI 2026" eller liknande) som sammanfattar de viktigaste sakerna att göra: teckna DPA, använd enterprise-planer för känsligt, ha en policy, märk AI-innehåll, håll koll på AI Act-tidslinjen.

Lägg in en kort brasklapp någonstans (gärna i intro eller slutsats) om att artikeln är allmän information och inte ersätter juridisk rådgivning.

Totalt: cirka 2000 ord. Konkret, korrekt, svensk affärssvenska, inga floskler. Använd minst en <table>.`;

async function generate(): Promise<{ html: string; usage: Anthropic.Usage }> {
  const userPrompt = [
    `Artikel: ${TITLE}`,
    `Slug: ${SLUG}`,
    `Kategori: ${CATEGORY}`,
    `Mållängd: ~${WORD_TARGET} ord`,
    '',
    'Brief:',
    BRIEF,
    '',
    'Relaterade sidor att länka till naturligt i prosan (inkludera minst /ai-verktyg/foretag och /ai-verktyg/juridik):',
    ...RELATED_LINKS.map((l) => `- ${l.label} → ${l.url}`),
    '',
    `Skriv artikeln nu. ~${WORD_TARGET} ord, ren HTML, börja med första <p>-taggen.`,
  ].join('\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const html = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  return { html, usage: response.usage };
}

/** Compress the local PNG → WebP and upload under <year>/<month>/. Returns the public URL. */
async function uploadCover(): Promise<string> {
  if (!statSync(SOURCE_IMAGE, { throwIfNoEntry: false })) {
    throw new Error(`Cover image not found: ${SOURCE_IMAGE}`);
  }
  const original = readFileSync(SOURCE_IMAGE);
  const webp = await sharp(original)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${SLUG}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload failed: ${error.message}`);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(key);
  console.log(
    `  cover: ${(original.length / 1024).toFixed(0)} KB PNG → ` +
    `${(webp.length / 1024).toFixed(0)} KB WebP  → ${pub.publicUrl}`
  );
  return pub.publicUrl;
}

async function persist(html: string, featuredImage: string): Promise<string> {
  const row = {
    slug: SLUG,
    title: TITLE,
    excerpt: EXCERPT,
    content_mdx: html,
    category: CATEGORY,
    tags: TAGS,
    featured_image: featuredImage,
    type: 'post' as const,
    path: `/${SLUG}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: new Date().toISOString(), // now()
    seo_title: `${TITLE} | AI-Magasinet`,
    seo_description: EXCERPT,
  };

  const { data, error } = await supabase
    .from('articles')
    .upsert(row, { onConflict: 'path' })
    .select('id,path,published_at');
  if (error) throw new Error(`upsert ${SLUG}: ${error.message}`);
  return `id=${data?.[0]?.id} path=${data?.[0]?.path} published_at=${data?.[0]?.published_at}`;
}

async function main() {
  console.log(`Generating "${TITLE}" with ${MODEL}…`);
  const t0 = Date.now();

  const { html, usage } = await generate();
  const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const linkCount = (html.match(/<a\s+href="\/ai-verktyg/gi) || []).length;
  console.log(
    `  generated: ${wordCount} words, ${linkCount} internal /ai-verktyg links, ` +
    `${((Date.now() - t0) / 1000).toFixed(1)}s, output=${usage.output_tokens} tok`
  );

  // Guardrails — fail loudly rather than publish something off-spec.
  if (wordCount < 1400) throw new Error(`Too short (${wordCount} words); aborting publish.`);
  for (const required of ['/ai-verktyg/foretag', '/ai-verktyg/juridik']) {
    if (!html.includes(`href="${required}"`)) {
      throw new Error(`Missing required internal link ${required}; aborting publish.`);
    }
  }

  console.log('Compressing and uploading cover art…');
  const featuredImage = await uploadCover();

  console.log('Upserting article row…');
  const info = await persist(html, featuredImage);
  console.log(`OK → ${info}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
