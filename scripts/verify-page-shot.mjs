// Generic fullPage screenshot helper — pass SHOT_URL.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.SHOT_URL ?? 'http://localhost:3000/';
const outDir = process.env.SHOT_DIR ?? 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
const name = process.env.SHOT_NAME ?? 'page-fullpage.png';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(outDir, name), fullPage: true });
  console.log(`  → ${join(outDir, name)}`);
} finally {
  await browser.close();
}
