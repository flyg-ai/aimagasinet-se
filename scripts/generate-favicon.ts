/**
 * Render the AI-Magasinet brand mark (indigo-600 square + white "AI"
 * wordmark) to PNG via Sharp at the sizes Next.js App Router auto-
 * discovers:
 *   app/icon.png         → /favicon  (32x32, modern browsers)
 *   app/apple-icon.png   → /apple-touch-icon  (180x180, iOS home-screen)
 *   app/favicon.ico      → /favicon.ico  (legacy, multi-resolution ICO)
 *
 *   npx tsx scripts/generate-favicon.ts
 *
 * Re-runs are idempotent — same SVG → same bytes.
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const APP_DIR = join(process.cwd(), 'app');
const INDIGO_600 = '#4f46e5';

/** Inline SVG sized to the target viewport. The "AI" wordmark uses a
 *  generic sans-serif stack — librsvg (Sharp's SVG renderer) falls back
 *  to whatever's installed; on the dev machine that's Arial/Segoe UI,
 *  on Vercel it's Liberation Sans. Both render the AI shape we want. */
function svg(size: number): string {
  // Slightly inset rounded square (8% corner radius) on a transparent
  // canvas so the icon looks like a chip, not a hard-edged tile.
  const r = Math.round(size * 0.18);
  const fontSize = Math.round(size * 0.55);
  // Visual-center the text by nudging y a hair off geometric center
  // because uppercase letters sit slightly above the baseline midpoint.
  const cy = Math.round(size * 0.5 + fontSize * 0.35);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${INDIGO_600}"/>
  <text x="${size / 2}" y="${cy}"
        font-family="Arial, Helvetica, 'Liberation Sans', sans-serif"
        font-size="${fontSize}" font-weight="900"
        text-anchor="middle" fill="#ffffff" letter-spacing="-1">AI</text>
</svg>`;
}

async function pngBuffer(size: number): Promise<Buffer> {
  return sharp(Buffer.from(svg(size)))
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function render(size: number, out: string) {
  const png = await pngBuffer(size);
  writeFileSync(out, png);
  console.log(`  → ${out}  (${size}x${size}, ${png.length} bytes)`);
}

async function renderIco(sizes: number[], out: string) {
  const pngs = await Promise.all(sizes.map(pngBuffer));
  const ico = await pngToIco(pngs);
  writeFileSync(out, ico);
  console.log(`  → ${out}  (${sizes.join('+')}, ${ico.length} bytes)`);
}

async function main() {
  await render(32, join(APP_DIR, 'icon.png'));
  await render(180, join(APP_DIR, 'apple-icon.png'));
  // Multi-resolution ICO for legacy browsers and Windows pinning.
  await renderIco([16, 32, 48], join(APP_DIR, 'favicon.ico'));
  console.log('\nNext.js auto-discovers app/icon.png, app/apple-icon.png and app/favicon.ico — restart dev for them to take effect.');
}

main().catch((e) => { console.error(e); process.exit(1); });
