/**
 * Nyhetsartikel om AI-textwatermarking i EU (research gjord utanför detta
 * script via WebSearch, primärkällor: TechCrunch 5 okt 2026, Bleeping
 * Computer, Silicon Canals, Russell McVeagh — EU AI Act artikel 50).
 *
 *   1. ai-text-watermark-eu-vad-betyder-det (ai-sakerhet-etik)
 *
 * VIKTIGT: lämnar published_at = null. Användaren granskar innan vi sätter
 * datum och går live — se memory/feedback_review_before_publish.md.
 *
 *   npx tsx scripts/publish-ai-news-watermark.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';

loadEnv({ path: '.env.local' });

const COVER_SOURCE = 'C:/Users/hallb/Downloads/AI TEXT vattenmärkning.png';

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
Du får ENBART framställa sådant som markerats VERIFIERAT som fakta (källor: TechCrunch 5 okt 2026, Bleeping Computer, Silicon Canals, Russell McVeagh — EU AI Act artikel 50). Allt osäkert måste tydligt ramas in som osäkert (t.ex. exakt startdatum i november, om Google faktiskt har detektor-access). Hitta ALDRIG på en namngiven källa, ett citat eller en länk som inte givits dig. Skriv inte ut exakta URL:er i brödtexten.

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

const ARTICLE: ArticleSpec = {
  slug: 'ai-text-watermark-eu-vad-betyder-det',
  title: 'AI-text får osynlig watermark i EU — det här betyder det för dig',
  category: 'ai-sakerhet-etik',
  authorSlug: 'erik-lindgren',
  wordTarget: 1000,
  excerpt: 'OpenAI och Anthropic märker nu AI-genererad text med en osynlig, maskinläsbar watermark för EU-användare — ett krav från EU:s AI-förordning. Men detektorn är stängd för allmänheten, och det förändrar inte hur Google bedömer AI-innehåll.',
  tags: ['AI-säkerhet', 'EU AI Act', 'watermark', 'ChatGPT', 'Claude', 'reglering', 'nyhet'],
  brandFrom: '#1e1b4b', brandTo: '#4338ca',
  kicker: 'Reglering',
  relatedLinks: [
    { url: '/ai-verktyg/ai-text-verktyg/chatgpt', label: 'ChatGPT-recension' },
    { url: '/ai-verktyg/ai-text-verktyg/claude', label: 'Claude-recension' },
  ],
  brief: `Skriv en nyhetsartikel (~1000 ord) om: "AI-text får osynlig watermark i EU — det här betyder det för dig". Vinkel: förklara nyheten pedagogiskt, men lägg särskild vikt vid att lugna läsare som är sajtägare/skribenter — detta är INTE ett verktyg som avslöjar AI-text för Google eller konkurrenter.

# VERIFIERAT (TechCrunch 5 okt 2026, Bleeping Computer, Silicon Canals, Russell McVeagh)
- EU:s AI-förordning (AI Act), artikel 50, kräver sedan 2 augusti 2026 att leverantörer av generativ AI gör sin AI-genererade text, ljud, bild och video maskinläsbart identifierbar.
- Skyldigheten gäller leverantören (företaget som bygger modellen), inte den enskilda användaren som publicerar text.
- Övergångsregel: generativa system som redan fanns på marknaden före 2 augusti 2026 har fram till 2 december 2026 på sig att uppfylla kravet. Innehåll som redan publicerats före 2 augusti behöver inte märkas i efterhand.
- Anthropic (Claude) började watermarka text i augusti 2026, efter att ha skrivit under EU:s "Code of Practice" om transparens. Äldre Claude-modeller får samma övergångsperiod.
- OpenAI meddelade 5 oktober 2026 att de rullar ut en osynlig watermark (internt kallad "TextGrain") på ChatGPT- och Codex-text för EU-användare, "under kommande veckor" — alltså ungefär den tidsperiod vi nu är i (artikeln skrivs i november 2026).
- Omfattning: gäller alla ChatGPT-planer i EU. Det är INTE global default — utanför EU är det av som standard. API-kunder världen över kan själva välja att slå på watermarking (opt-in), oavsett var de befinner sig.
- Hur det fungerar (på en övergripande nivå, utan att OpenAI/Anthropic gått in på tekniska detaljer offentligt): watermarken är inbäddad i hur texten statistiskt är uppbyggd (ordval/mönster), inte ett synligt badge eller en osynlig textsträng man kan se med blotta ögat.
- Detektorn (verktyget som läser av watermarken) är INTE offentlig. Tillgång ges bara till godkända forskare och organisationer, efter ansökan, från fall till fall. Allmänheten, inklusive sökmotorer, har alltså ingen bekräftad, öppen tillgång till att kontrollera om en text är watermarkad.
- Begränsningar som OpenAI själva påpekat: watermarken kan försvinna om texten redigeras, översätts, eller är mycket kort. Och viktigast: att en watermark SAKNAS bevisar INTE att texten är skriven av en människa — det kan bero på redigering, en modell utan watermarking aktiverat, eller en leverantör utanför EU-kravet.
- Separat från den osynliga watermarken finns ett krav på SYNLIG märkning av AI-genererat innehåll som publiceras i "allmänhetens intresse" (t.ex. nyhetsartiklar) — men det kravet gäller den som PUBLICERAR innehållet (deployer), och faller bort om en människa med redaktoriellt ansvar har granskat och godkänt texten innan publicering. Håll isär dessa två saker tydligt i artikeln: (1) osynlig maskinläsbar watermark hos AI-leverantören, (2) synlig label hos publiceraren av visst innehåll — olika regler, olika ansvariga.
- Böter för bristande efterlevnad av AI Act kan uppgå till 15 miljoner euro eller 3% av global omsättning, beroende på vad som är högst — men det är ett ansvar för AI-LEVERANTÖREN (OpenAI, Anthropic, Google etc.), inte för den som använder verktygen eller publicerar text.

# VÅR EGEN BEDÖMNING (AI-Magasinets analys, markera tydligt som just det — inte TechCrunch-fakta)
- Google straffar inte AI-innehåll baserat på denna watermark. Googles egen policy mot "scaled content abuse" (sedan mars 2024-uppdateringen av sökalgoritmen) bygger på kvalitets- och mönstersignaler i innehållet självt — helt oberoende av om en text har en OpenAI- eller Anthropic-watermark eller inte.
- Även om Google ville läsa av watermarken finns ingen bekräftad, öppen tillgång till detektorn för sökmotorer eller konkurrenter.
- Slutsats för svenska sajtägare/skribenter: detta förändrar inte spelplanen för SEO eller innehållsstrategi. Det som alltid gällt — kvalitet, originalitet, faktisk nytta för läsaren — är fortsatt det som avgör, inte en dold watermark.

# STRUKTUR
- Intro: slå an nyheten kort och konkret — sedan november 2026 bär AI-genererad text från ChatGPT och Claude en osynlig "vattenstämpel" för EU-användare. Etablera att detta väcker en rimlig fråga hos läsare: påverkar det mig?
- <h2>Vad är watermarken, egentligen?</h2> — förklara enkelt: inbäddad i textens mönster, inte synlig, inte en separat textsträng.
- <h2>Varför gör de det nu?</h2> — EU AI Act artikel 50, tidslinjen (2 aug krav, 2 dec övergångsperiod ute), vilka bolag som redan infört det.
- <h2>Vem kan faktiskt läsa av den?</h2> — detektorn är stängd, bara godkända forskare, ingen offentlig tillgång. Nämn också begränsningarna (redigering kan ta bort den, frånvaro bevisar inget).
- <h2>Osynlig watermark vs. synlig AI-label — två olika saker</h2> — förklara skillnaden mellan leverantörens maskinläsbara märkning och publicerarens eventuella synliga etikett, och undantaget för redaktoriellt granskat innehåll.
- <h2>Påverkar det dig som sajtägare eller skribent?</h2> — vår bedömning: nej, inte i praktiken. Google använder egna kvalitetssignaler, ingen bekräftad extern tillgång till detektorn. Det som avgör är fortsatt innehållets kvalitet, inte en dold markör.
- Kort, nykter avslutning: en viktig transparensåtgärd på pappret, men i dagsläget mest relevant för forskare och tillsynsmyndigheter — inte för vanliga användare av AI-text.`,
};

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
  const png = fs.existsSync(COVER_SOURCE) ? fs.readFileSync(COVER_SOURCE) : await makeCover(a);
  const webp = await sharp(png).resize(1200, 675, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
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
  console.log(`Drafting article (published_at = null)...\n`);
  const t0 = Date.now();
  try {
    const cover = await uploadCover(ARTICLE);
    const html = await generate(ARTICLE);
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const r = await saveDraft(ARTICLE, html, cover);
    console.log(`✓ ${ARTICLE.slug}  ${words}w  ${((Date.now() - t0) / 1000).toFixed(1)}s  id=${r?.id}`);
  } catch (e) {
    console.error(`✗ ${ARTICLE.slug} FAILED:`, e instanceof Error ? e.message : e);
  }
  console.log('\nDone. Draft saved with published_at = null — review locally before publishing.');
}

main();
