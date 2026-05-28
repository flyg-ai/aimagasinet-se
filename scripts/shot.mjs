// Generic shot helper. Pass SHOT_URL + SHOT_NAME + SHOT_MODE=desktop|mobile.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.SHOT_URL ?? 'http://localhost:3000/';
const outDir = process.env.SHOT_DIR ?? 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
const name = process.env.SHOT_NAME ?? 'shot.png';
const mode = process.env.SHOT_MODE ?? 'desktop';
const fullPage = process.env.SHOT_FULL === '1';
const scrollY = parseInt(process.env.SHOT_SCROLL ?? '0', 10) || 0;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext(
    mode === 'mobile'
      ? { ...devices['iPhone 13'] }
      : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
  );
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  if (scrollY) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: join(outDir, name), fullPage });
  console.log(`  → ${join(outDir, name)}`);
} finally {
  await browser.close();
}
