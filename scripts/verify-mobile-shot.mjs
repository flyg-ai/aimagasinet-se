// Mobile-viewport screenshot — verifies the bottom nav + new Explore
// section render properly at iPhone-class width.
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
  await page.waitForTimeout(2000);

  // Above-the-fold shot of the mobile home with bottom nav visible.
  await page.screenshot({ path: join(outDir, 'mobile-home-top.png') });
  console.log(`  → ${join(outDir, 'mobile-home-top.png')}`);

  // Scroll a bit so the Explore section is in frame too.
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(outDir, 'mobile-home-explore.png') });
  console.log(`  → ${join(outDir, 'mobile-home-explore.png')}`);

  // Full mobile page so we can spot-check the rest.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(outDir, 'mobile-home-full.png'), fullPage: true });
  console.log(`  → ${join(outDir, 'mobile-home-full.png')}`);
} finally {
  await browser.close();
}
