// Tight shot of the "Mer just nu" sidebar so we can read the thumbnails
// after fixing the flex-stretch crop bug. Self-contained — start dev,
// then run with SHOT_URL pointing at the right port.
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
  await page.waitForTimeout(2500);

  const aside = page.locator('aside').first();
  await aside.screenshot({ path: join(outDir, 'sidebar.png') });
  console.log(`  → ${join(outDir, 'sidebar.png')}`);
} finally {
  await browser.close();
}
