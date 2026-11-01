/**
 * Nyhetsartikel kopplad till den nya AI-säkerhet-hubben (/ai-verktyg/ai-sakerhet/):
 *
 *   1. mistral-large-4-cybersakerhet (ai-sakerhet-etik)
 *
 * Källa: TechCrunch, 29 okt 2026 — primärkälla.
 *
 * published_at = null — användaren granskar + väljer bild innan publicering,
 * se memory/feedback_review_before_publish.md och
 * memory/feedback_always_featured_image.md.
 *
 *   npx tsx scripts/publish-ai-news-mistral-cyber.ts
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
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta (källa: TechCrunch, 29 oktober 2026 — en primär nyhetskälla, inte en aggregator). Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan rubriken). Inga \`\`\`html-wrappers, inga inline styles, inga <style>/<script>-taggar.

Använd: <h2>, <h3>, <p>, <ul>/<ol>+<li>, <strong>. Länka naturligt till relaterade interna sidor med <a href="..."> där det anges i briefen.`;

type ArticleSpec = {
  slug: string;
  title: string;
  category: string;
  authorSlug: string;
  wordTarget: number;
  excerpt: string;
  tags: string[];
  brandFrom: string;
  brandTo: string;
  kicker: string;
  relatedLinks: { url: string; label: string }[];
  brief: string;
};

const ARTICLES: ArticleSpec[] = [
  {
    slug: 'mistral-large-4-cybersakerhet',
    title: 'Mistral släpper vikterna till sin biljon-parameter-modell — riktad mot cybersäkerhet',
    category: 'ai-sakerhet-etik',
    authorSlug: 'erik-lindgren',
    wordTarget: 1000,
    excerpt: 'Franska Mistral AI har öppet släppt vikterna till Mistral Large 4, en modell med över en biljon parametrar som företaget positionerar som ett verktyg för "suverän cyberförsvarsförmåga" åt företag och myndigheter.',
    tags: ['Mistral AI', 'cybersäkerhet', 'öppen källkod', 'AI-säkerhet', 'nyhet'],
    brandFrom: '#7f1d1d', brandTo: '#b91c1c',
    kicker: 'AI-säkerhet',
    relatedLinks: [{ url: '/ai-verktyg/ai-sakerhet/', label: 'Bästa AI-verktygen för cybersäkerhet' }],
    brief: `Skriv en nyhetsartikel (~1000 ord) om: "Mistral släpper vikterna till sin biljon-parameter-modell — riktad mot cybersäkerhet".

# VERIFIERAT (TechCrunch, 29 okt 2026)
- Franska Mistral AI har släppt vikterna till Mistral Large 4 (ML4), en modell med över en biljon parametrar, internt kallad "Le Chonk".
- Modellen introducerades första gången tidigare i oktober 2026; nu släpps själva vikterna öppet.
- Vikterna är de numeriska värden som styr modellen och som uppstår under träningen. De finns tillgängliga på Hugging Face samt via Mistrals eget API.
- Att vikterna är öppna betyder att företag och myndigheter kan ladda ner och köra modellen själva, inklusive helt on-premise (lokalt, utan molnberoende).
- Pierre Stock, Mistrals Head of Science ("VP of Science" i källan), säger att åtkomsten "inte kan stängas av per definition, eftersom modellen är öppet viktad" (fri översättning av "can't be cut off by definition because the model is open-weighted").
- Mistral positionerar ML4 som ett verktyg för "suverän cyberförsvarsförmåga" ("sovereign cyber defense capabilities") åt företag och myndigheter.
- Enligt Mistral kan modellen hjälpa organisationer att upptäcka, analysera och svara på hot i både kod och IT-infrastruktur.
- Stock säger att modellen kan identifiera, koordinera och svara på större säkerhetsincidenter i realtid.
- Prestanda: Mistral uppger att ML4 presterar jämförbart med GLM-5.3, en kinesisk öppet viktad modell som ansetts vara en av de bästa öppna modellerna, särskilt för cybersäkerhetsarbete — men att ML4 använder 47 procent färre tokens per uppgift.
- Mistral hävdar att ML4 rankar högst av alla öppna modeller på agentiska kodningsuppgifter, enligt Artificial Analysis Coding Agent Index.
- Mistral säger sig nå "state of the art"-prestanda till en bråkdel av den beräkningskraft och det kapital som stängda labb som OpenAI och Anthropic lägger.
- Mistrals vd Arthur Mensch säger att AI bör "vara ett verktyg för egenmakt, inte dominans" (fri översättning av "be a tool for empowerment, not dominance").
- Stock säger att Mistral vill att jämförbar cyberförmåga ska finnas tillgänglig för alla snabbt, eftersom illvilliga aktörer också kan använda AI för att attackera.
- Stock erkänner riskerna från de senaste incidenterna med AI-agenter som agerat utanför avsedda ramar ("rogue AI agents"), men varnar för överreaktion — god säkerhet beskrivs som "ett svårt problem" ("a hard problem").
- Artikeln anger inga exakta priser eller licensvillkor för ML4.

# STRUKTUR
- Intro: Mistral släpper öppet en av sina största modeller någonsin — och riktar den rakt mot cyberförsvar, inte chattbot-konkurrens.
- <h2>Vad är Mistral Large 4?</h2> — storlek, öppna vikter, var den finns (Hugging Face, API), vad "öppna vikter" konkret innebär för en organisation (egen drift, ingen nedstängningsrisk).
- <h2>Varför cybersäkerhet?</h2> — hotdetektering, analys och respons i realtid, "suverän cyberförsvarsförmåga"-vinkeln, Stocks citat.
- <h2>Hur bra är den?</h2> — jämförelsen med GLM-5.3, tokeneffektivitet, kodnings-ranking, Mistrals "state of the art"-påstående (var tydlig: det är Mistrals egna siffror, inte oberoende verifierat i källan).
- <h2>Öppen AI som strategi</h2> — Mensch-citatet, Mistral som motpol till stängda labb som OpenAI/Anthropic, varför öppna vikter är relevant för myndigheter som inte vill vara beroende av utländska AI-bolag.
- <h2>Men också en risk?</h2> — Stocks kommentar om rogue AI-agenter och att god säkerhet är svårt; nämn kort att öppna vikter med stark kapacitet även är ett dubbeleggat svärd (samma verktyg kan användas defensivt och offensivt), utan att spekulera bortom källan.
- Avslutning: koppla till att AI-driven cybersäkerhet är ett växande fält just nu — länka naturligt till AI-Magasinets jämförelse av AI-verktyg för cybersäkerhet.
- Väv in länken till /ai-verktyg/ai-sakerhet/ naturligt, förslagsvis i avslutningen eller i "hur bra är den"-avsnittet, t.ex. "I vår genomgång av <a href="/ai-verktyg/ai-sakerhet/">AI-verktyg för cybersäkerhet</a> ...".`,
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
  const lineHeight = 60;
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
  ${lines.map((l, i) => `<text x="70" y="${startY + i * lineHeight}" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">${escXml(l)}</text>`).join('\n  ')}
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

async function saveDraft(a: ArticleSpec, html: string, featuredImage: string) {
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
    published_at: null as string | null, // INTE publicerad — väntar på granskning
    seo_title: `${a.title} | AI-Magasinet`,
    seo_description: a.excerpt,
  };
  const { data, error } = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,path');
  if (error) throw new Error(`upsert ${a.slug}: ${error.message}`);
  return data?.[0];
}

async function main() {
  console.log(`Drafting ${ARTICLES.length} news article(s) (published_at = null)...\n`);
  for (const a of ARTICLES) {
    const t0 = Date.now();
    try {
      const cover = await uploadCover(a);
      const html = await generate(a);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const r = await saveDraft(a, html, cover);
      console.log(`✓ ${a.slug}  ${words}w  ${((Date.now() - t0) / 1000).toFixed(1)}s  id=${r?.id}`);
    } catch (e) {
      console.error(`✗ ${a.slug} FAILED:`, e instanceof Error ? e.message : e);
    }
  }
  console.log('\nDone. Draft saved with published_at = null — review locally before publishing.');
}

main();
