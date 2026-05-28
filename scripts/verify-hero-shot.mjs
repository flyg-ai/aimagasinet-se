// Tight close-up shot of the hero card on mobile so we can see what's
// leaking at the top edge.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.SHOT_URL ?? 'http://localhost:3000/';
const outDir = process.env.SHOT_DIR ?? 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  // The hero is the first link below the header that contains an h1.
  const hero = page.locator('a:has(h1)').first();
  await hero.screenshot({ path: join(outDir, 'hero-mobile-tight.png') });
  console.log(`  → ${join(outDir, 'hero-mobile-tight.png')}`);

  // Also a region shot of just the header + first 250px of hero so the
  // boundary between ticker/header/hero is visible.
  await page.screenshot({
    path: join(outDir, 'hero-mobile-boundary.png'),
    clip: { x: 0, y: 0, width: 390, height: 320 },
  });
  console.log(`  → ${join(outDir, 'hero-mobile-boundary.png')}`);
} finally {
  await browser.close();
}
