/**
 * Köttig listartikel om AI-influencers (samma format/anda som
 * /topp-50-ai-latar-pa-spotify-2026) — handskriven för tight faktakontroll
 * eftersom branschen saknar oberoende verifiering av följarsiffror.
 * Research: Euronews, TechCrunch, CNN, Business Insider (via sekundärkällor),
 * Axios, Love the Work/Cannes Lions-entry, Wikipedia (Miquela).
 *
 *   npx tsx scripts/publish-ai-influencers.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import fs from 'fs';

loadEnv({ path: '.env.local' });

const COVER_SOURCE = 'C:/Users/hallb/Desktop/AI-influencer.png';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const BUCKET = 'featured-images';
const CONTENT_FILE = 'C:/Users/hallb/AppData/Local/Temp/claude/497fc275126f2841/482e8db7-f991-461c-9012-16b0e386ae54/scratchpad/ai-influencers-content.html';

const ARTICLE = {
  slug: 'ai-influencers-2026-de-storsta-virtuella-personerna',
  title: 'AI-influencers 2026 — de största virtuella personerna som aldrig funnits',
  category: 'ai-nyheter',
  authorSlug: 'sara-nilsson',
  excerpt: 'Lil Miquela, Aitana López, Milla Sofia, Lu do Magalu — AI-genererade influencers tjänar nu riktiga varumärkespengar. Vi går igenom de största profilerna, hur du avslöjar en, och varför Dove nyligen förbjöd AI-modeller helt.',
  tags: ['AI-influencers', 'sociala medier', 'virtuella influencers', 'marknadsföring', 'guide'],
  brandFrom: '#581c87', brandTo: '#db2777',
  kicker: 'AI & kultur',
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

async function makeCover(): Promise<Buffer> {
  const W = 1200, H = 675;
  const lines = wrapText(ARTICLE.title, 26);
  const lineHeight = 60;
  const totalH = lines.length * lineHeight;
  const startY = H / 2 - totalH / 2 + 10;

  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${ARTICLE.brandFrom}"/>
      <stop offset="100%" stop-color="${ARTICLE.brandTo}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W - 90}" cy="90" r="220" fill="rgba(255,255,255,0.06)"/>
  <circle cx="60" cy="${H - 40}" r="160" fill="rgba(255,255,255,0.05)"/>
  <rect x="70" y="60" width="${26 + ARTICLE.kicker.length * 15}" height="44" rx="22" fill="rgba(255,255,255,0.15)"/>
  <text x="${70 + 13 + ARTICLE.kicker.length * 7.5}" y="89" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5" fill="#ffffff" text-anchor="middle">${escXml(ARTICLE.kicker.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="70" y="${startY + i * lineHeight}" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">${escXml(l)}</text>`).join('\n  ')}
  <text x="70" y="${H - 48}" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.75)">AI-MAGASINET</text>
</svg>`.trim();

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function uploadCover(): Promise<string> {
  const png = fs.existsSync(COVER_SOURCE) ? fs.readFileSync(COVER_SOURCE) : await makeCover();
  const webp = await sharp(png).resize(1200, 675, { fit: 'cover' }).webp({ quality: 90 }).toBuffer();
  const now = new Date();
  const key = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${ARTICLE.slug}.webp`;
  const { error } = await db.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp', upsert: true, cacheControl: '31536000',
  });
  if (error) throw new Error(`cover upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  return pub.publicUrl;
}

async function main() {
  const html = fs.readFileSync(CONTENT_FILE, 'utf8');
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const cover = await uploadCover();

  const row = {
    slug: ARTICLE.slug,
    title: ARTICLE.title,
    excerpt: ARTICLE.excerpt,
    content_mdx: html,
    category: ARTICLE.category,
    tags: ARTICLE.tags,
    featured_image: cover,
    og_image: cover,
    author_slug: ARTICLE.authorSlug,
    type: 'post' as const,
    path: `/${ARTICLE.slug}`,
    parent_slug: null as string | null,
    affiliate_url: null as string | null,
    published_at: null as string | null, // INTE publicerad — väntar på granskning
    seo_title: `${ARTICLE.title} | AI-Magasinet`,
    seo_description: ARTICLE.excerpt,
  };
  const { data: existing } = await db.from('articles').select('id').eq('path', row.path).maybeSingle();
  const { data, error } = existing
    ? await db.from('articles').update(row).eq('id', existing.id).select('id,path')
    : await db.from('articles').insert(row).select('id,path');
  if (error) throw new Error(`save: ${error.message}`);
  console.log(`✓ ${ARTICLE.slug}  ${words}w  id=${data?.[0]?.id}`);
  console.log('Draft saved with published_at = null — review locally before publishing.');
}

main();
