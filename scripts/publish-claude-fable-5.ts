/**
 * Generate + publish ONE news article:
 *
 *   /claude-fable-5-recension  (~1800 ord, ai-nyheter) — granskande nyhet
 *
 * Vinkel: nyhet/recension om Anthropics nya toppmodell Claude Fable 5.
 * Cover compressed to WebP (q=80, max-width 1200px) via Sharp, uploaded to
 * featured-images/YYYY/MM/. published_at = now().
 *
 * VIKTIGT: Briefen nedan skiljer strikt på VERIFIERAT (Anthropics egna
 * modell-/prisuppgifter) och OBEKRÄFTAT (rykten). Den genererande modellen
 * får INTE framställa obekräftade uppgifter som fakta och får INTE hitta på
 * namngivna källor.
 *
 *   npx tsx scripts/publish-claude-fable-5.ts
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
Expert, rak, praktisk svenska. Inga floskler. Inga emojis. Konkreta namn, ungefärliga priser och faktiska exempel. Skriv som en kunnig teknikjournalist — nyhetsmässigt, lätt kritiskt, aldrig reklamigt.

# Faktadisciplin (KRITISKT)
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta. Allt som markerats OBEKRÄFTAT/RYKTE måste tydligt ramas in som just ett obekräftat rykte — använd formuleringar som "obekräftade uppgifter gör gällande", "rykten som cirkulerat i utvecklarkretsar", "detta är inte bekräftat av Anthropic". Hitta ALDRIG på en namngiven källa, citat eller länk. Hänvisa bara till källa där det uttryckligen anges i briefen.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan rubriken). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3>, <p>, <ul>/<ol>+<li>, <a href>, <strong>. För jämförelse-data: använd <table> med <thead>/<tbody>.`;

const SLUG = 'claude-fable-5-recension';
const TITLE = 'Claude Fable 5 testad — så bra är Anthropics nya toppmodell';
const CATEGORY = 'ai-nyheter';
const IMAGE_PATH = 'C:/Users/hallb/Desktop/claude fable 5.png';
const WORD_TARGET = 1800;
const EXCERPT =
  'Anthropic har släppt Claude Fable 5 — en helt ny toppmodell ovanför Opus-serien. Vi går igenom vad som är nytt, vad den kostar (dubbelt mot Opus), säkerhetsbegränsningarna och de obekräftade ryktena som redan cirkulerar. Här är vår bedömning: är den värd priset?';
const TAGS = ['Claude Fable 5', 'Anthropic', 'Claude', 'Opus 4.8', 'AI-modeller', 'recension', 'nyhet'];

const BRIEF = `Skriv en granskande NYHETSARTIKEL (~${WORD_TARGET} ord) om Anthropics nya toppmodell Claude Fable 5: "${TITLE}".

Vinkel: nyhet först, med granskande/recenserande ton. Vad är nytt, hur bra är den, är den värd priset? Inte reklam — var ärlig om både styrkor och osäkerhet.

# FAKTA-UNDERLAG — läs faktadisciplinen i systemprompten noga

## VERIFIERAT (får framställas som fakta — källa: Anthropics egna modell- och prisuppgifter)
- Claude Fable 5 är Anthropics nya, mest kraftfulla och mest intelligenta modell. Den utgör en helt ny nivå ("tier") OVANFÖR Opus-serien.
- Modell-id i API:et är "claude-fable-5".
- Pris: 10 USD per miljon input-tokens och 50 USD per miljon output-tokens.
- Till jämförelse kostar Claude Opus 4.8: 5 USD input / 25 USD output per miljon tokens. Fable 5 är alltså ungefär dubbelt så dyr som Opus.
- Fable 5 är starkare än Opus på resonemang (reasoning), kodning, vision och längre autonomt (long-horizon) arbete.
- Tekniskt har Fable 5 i stort sett samma API-gränssnitt som Opus 4.7/4.8: bara "adaptive thinking" stöds (ingen manuell tänk-budget), och sampling-parametrar som temperature är borttagna. En liten skillnad: att uttryckligen stänga av tänkandet ger ett fel — man utelämnar parametern istället. (Skriv detta lättfattligt, inte för tekniskt — en mening eller två räcker.)
- Modellen är tillgänglig via Claude API (Anthropics eget API). 1M kontextfönster.
- Kontextfönster: BÅDE Opus 4.8 och Fable 5 har 1 miljon tokens kontextfönster. Kontextfönstret är alltså INTE en skillnad mellan modellerna — framställ det inte som en uppgradering i Fable 5. (Om du gör en jämförelsetabell: ta antingen bort kontextfönster-raden eller ange 1M för båda.)
- Säkerhet: modellen vägrar (blockerar) förfrågningar inom högrisk-områden som cybersäkerhet och biologi/kemi — den har inbyggda realtidsskydd och returnerar en vägran ("refusal") i de kategorierna.

## OBEKRÄFTAT / RYKTE (MÅSTE ramas in tydligt som obekräftat — ingen namngiven källa får hittas på)
- Det cirkulerar uppgifter om att Fable 5 skulle vara en publik version av en intern modell med kodnamnet "Claude Mythos". Detta är INTE bekräftat av Anthropic — behandla som ett rykte.
- Det finns uppgifter om att modellen, när den blockerar inom de känsliga områdena, automatiskt "faller tillbaka" på Opus 4.8 i stället. Att vägran sker är verifierat; den specifika automatiska fallback-mekanismen till Opus 4.8 är INTE bekräftad — ram in som obekräftat.
- Bredare tillgänglighet utöver Claude API (t.ex. AWS Bedrock, Google Cloud / Vertex AI, Microsoft Foundry) har nämnts men är i skrivande stund INTE bekräftad för Fable 5 specifikt. Skriv att Claude API är den bekräftade vägen, och att utrullning till molnplattformarna uppges vara på väg men ännu inte är bekräftad.
- En kontrovers har blossat upp: Fable 5 anklagas i obekräftade uppgifter för att i hemlighet begränsa sina kapaciteter för forskare. Detta är en OBEKRÄFTAD anklagelse utan offentlig källa — ram in mycket tydligt som ett rykte/en anklagelse som cirkulerat, ange explicit att Anthropic inte bekräftat något och att inga belägg presenterats offentligt. Var balanserad: nämn att liknande rykten ofta uppstår kring nya toppmodeller.

# STRUKTUR
- Intro (1-2 stycken): Slå an nyheten direkt — Anthropic har lanserat Claude Fable 5, en ny toppmodell ovanför Opus. Ställ frågan som driver artikeln: ett verkligt språng, och värt det dubbla priset?
- <h2>Vad är Claude Fable 5?</h2> — ny toppnivå ovanför Opus, mest kraftfull/intelligent. Här nämner du Mythos-ryktet, tydligt inramat som obekräftat.
- <h2>Vad är nytt jämfört med Opus 4.8?</h2> — bättre reasoning, kodning, vision, längre autonomt arbete. Den korta tekniska noten om adaptive thinking. Gärna en kort <table> (Egenskap | Opus 4.8 | Fable 5) med rader för t.ex. Reasoning, Kodning, Vision, Autonomt arbete, Pris.
- <h2>Vad kostar den?</h2> — 10/50 USD per miljon tokens, ungefär dubbelt mot Opus 4.8 (5/25). Diskutera ärligt: för vem är dubbla priset motiverat?
- <h2>Säkerhetsbegränsningar</h2> — vägrar inom cyber/bio/kemi (verifierat). Fallback-till-Opus-4.8 ramas in som obekräftat rykte.
- <h2>Tillgänglighet</h2> — Claude API bekräftat; molnplattformar (Bedrock, Google Cloud, Microsoft Foundry) uppges på väg men obekräftat.
- <h2>Kontroversen: begränsar Anthropic modellen för forskare?</h2> — den obekräftade anklagelsen, mycket tydligt inramad som rykte utan belägg, balanserat.
- <h2>Vår dom — när ska du använda Fable 5?</h2> — tydligt ställningstagande efter användarprofil: när Fable 5 vs Opus vs Sonnet. Våga ge raka svar (t.ex. Fable 5 för de allra svåraste/längsta uppgifterna där intelligens slår kostnad; Opus 4.8 för de flesta avancerade jobb; Sonnet för volym/snabbhet/kostnad).
- Avsluta med <h2>Slutsats</h2>.

Länka naturligt till denna interna sida via HTML <a href> (använd EXAKT denna form med avslutande slash) där det passar i texten, t.ex. i avsnittet om vad Fable 5 är eller i domen:
- /ai-verktyg/claude/ — vår fullständiga genomgång av Claude

Ange källa diskret för de verifierade pris-/modelluppgifterna (t.ex. "enligt Anthropics egna modell- och prisuppgifter"). Hitta INTE på någon källa för ryktena.`;

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

async function generate(): Promise<string> {
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 12000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: [
        `Artikel: ${TITLE}`,
        `Slug: ${SLUG}`,
        `Kategori: ${CATEGORY} (AI-Nyheter)`,
        `Mållängd: ~${WORD_TARGET} ord`,
        '',
        BRIEF,
        '',
        `Skriv artikeln nu. ~${WORD_TARGET} ord, ren HTML, börja med första <p>-taggen.`,
      ].join('\n'),
    }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function publish(contentMdx: string, featuredImage: string, publishedAt: Date) {
  const row = {
    slug: SLUG,
    title: TITLE,
    excerpt: EXCERPT,
    content_mdx: contentMdx,
    category: CATEGORY,
    tags: TAGS,
    featured_image: featuredImage,
    type: 'post' as const,
    path: `/${SLUG}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: publishedAt.toISOString(),
    seo_title: `${TITLE} | AI-Magasinet`,
    seo_description: EXCERPT,
  };
  const { data, error } = await db
    .from('articles')
    .upsert(row, { onConflict: 'path' })
    .select('id,path,published_at');
  if (error) throw new Error(`publish ${SLUG}: ${error.message}`);
  return data?.[0];
}

async function main() {
  console.log(`Publishing 1 article via ${MODEL}…\n`);
  console.log(`—— ${SLUG} ——`);
  const t0 = Date.now();

  console.log('  Compressing + uploading cover…');
  const imageUrl = await compressAndUpload(IMAGE_PATH, SLUG);

  console.log('  Generating article via Sonnet…');
  const html = await generate();
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

  const publishedAt = new Date();
  const r = await publish(html, imageUrl, publishedAt);
  const ms = Date.now() - t0;
  console.log(`  ✓ ${words}w  ${(ms / 1000).toFixed(1)}s  id=${r?.id} published_at=${r?.published_at}\n`);
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
