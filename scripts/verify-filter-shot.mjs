// Verify FilterableGrid + TrendingSection: shot of the default view, then
// shot after clicking the Företag & Aktörer pill to make sure auto-load
// kicks in and at least one card appears.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.SHOT_URL ?? 'http://localhost:3000/';
const outDir = process.env.SHOT_DIR ?? 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  console.log(`Loading ${url}…`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);

  // 1. Trending row close-up.
  const trending = page.locator('section').filter({ hasText: 'Mest lästa nu' }).first();
  await trending.screenshot({ path: join(outDir, 'trending.png') });
  console.log(`  → ${join(outDir, 'trending.png')}`);

  // 2. Default fullpage shot.
  await page.screenshot({ path: join(outDir, 'homepage-default.png'), fullPage: true });
  console.log(`  → ${join(outDir, 'homepage-default.png')}`);

  // 3. Click "Företag & Aktörer" pill, wait for auto-load, screenshot grid.
  await page.getByRole('button', { name: /Företag & Aktörer/i }).click();
  await page.waitForTimeout(2500);
  const gridSection = page.locator('section').filter({ hasText: 'Senaste artiklarna' }).first();
  await gridSection.screenshot({ path: join(outDir, 'filter-foretag.png') });
  console.log(`  → ${join(outDir, 'filter-foretag.png')}`);

  // 4. Click "AI-Säkerhet" pill, similar.
  await page.getByRole('button', { name: /AI-Säkerhet/i }).click();
  await page.waitForTimeout(2500);
  await gridSection.screenshot({ path: join(outDir, 'filter-sakerhet.png') });
  console.log(`  → ${join(outDir, 'filter-sakerhet.png')}`);
} finally {
  await browser.close();
}
