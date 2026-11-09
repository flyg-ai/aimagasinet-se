/**
 * Sätter ett brandat gradient-omslag för AI-trading-hubben (samma SVG+sharp-
 * mönster som nyhetsartiklarnas covers) tills en riktig foto-cover finns —
 * samma tillfälliga lösning som användes för ai-agenter/ai-sakerhet innan
 * deras riktiga "hubb"-foton laddades upp via apply-manual-covers.ts.
 *
 *   npx tsx scripts/set-ai-trading-hub-cover.ts
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const BUCKET = 'featured-images';
const TITLE = 'Bästa AI-verktygen för trading 2026';
const KICKER = 'KATEGORIGUIDE';
const FROM = '#581c87', TO = '#db2777';

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

async function main() {
  const W = 1200, H = 675;
  const lines = wrapText(TITLE, 22);
  const lineHeight = 60;
  const totalH = lines.length * lineHeight;
  const startY = H / 2 - totalH / 2 + 10;

  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${FROM}"/>
      <stop offset="100%" stop-color="${TO}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${W - 90}" cy="90" r="220" fill="rgba(255,255,255,0.06)"/>
  <circle cx="60" cy="${H - 40}" r="160" fill="rgba(255,255,255,0.05)"/>
  <rect x="70" y="60" width="${26 + KICKER.length * 11}" height="44" rx="22" fill="rgba(255,255,255,0.15)"/>
  <text x="${70 + 13 + KICKER.length * 5.5}" y="89" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.5" fill="#ffffff" text-anchor="middle">${escXml(KICKER)}</text>
  ${lines.map((l, i) => `<text x="70" y="${startY + i * lineHeight}" font-family="Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">${escXml(l)}</text>`).join('\n  ')}
  <text x="70" y="${H - 48}" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="rgba(255,255,255,0.75)">AI-MAGASINET</text>
</svg>`.trim();

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const webp = await sharp(png).webp({ quality: 90 }).toBuffer();
  const key = '2026/11/ai-trading-hubb.webp';
  const { error: upErr } = await db.storage.from(BUCKET).upload(key, webp, {
    contentType: 'image/webp', upsert: true, cacheControl: '31536000',
  });
  if (upErr) throw new Error(`upload: ${upErr.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);

  const { error } = await db.from('articles').update({ featured_image: pub.publicUrl }).eq('path', '/ai-verktyg/ai-trading');
  if (error) throw new Error(`update: ${error.message}`);
  console.log(`✓ ai-trading hub cover satt: ${pub.publicUrl}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
