// Hover the AI-Verktyg trigger and screenshot the mega-menu, then hover
// AI Video and screenshot that simple dropdown.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.SHOT_URL ?? 'http://localhost:3000/';
const outDir = process.env.SHOT_DIR ?? 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  // 1. Hover AI-Verktyg → mega menu (use header nav scope)
  const headerNav = page.locator('nav.hidden').first();
  await headerNav.getByRole('link').filter({ hasText: 'AI-Verktyg' }).first().hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, 'nav-ai-verktyg.png'), clip: { x: 0, y: 0, width: 1440, height: 360 } });
  console.log(`  → ${join(outDir, 'nav-ai-verktyg.png')}`);

  // 2. Hover AI Video → simple dropdown
  await headerNav.getByRole('link').filter({ hasText: 'AI Video' }).first().hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(outDir, 'nav-ai-video.png'), clip: { x: 0, y: 0, width: 1440, height: 360 } });
  console.log(`  → ${join(outDir, 'nav-ai-video.png')}`);
} finally {
  await browser.close();
}
