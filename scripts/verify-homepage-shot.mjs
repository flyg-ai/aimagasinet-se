// One-off Playwright shot of the homepage so we can eyeball image cropping.
// Not committed-relevant — this is a transient verification helper.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = process.env.SHOT_URL ?? 'http://localhost:3001/';
const outDir = process.env.SHOT_DIR ?? 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  // Desktop viewport — that's where the hero shape matters.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  console.log(`Loading ${url}…`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  // Give image lazy-load + Next.js dev compile a chance to settle.
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Full hero + grid area shot.
  await page.screenshot({
    path: join(outDir, 'homepage-full.png'),
    fullPage: false,
  });
  console.log(`  → ${join(outDir, 'homepage-full.png')}`);

  // Whole-page shot to also see grid + Ladda fler-knapp + footer.
  await page.screenshot({
    path: join(outDir, 'homepage-fullpage.png'),
    fullPage: true,
  });
  console.log(`  → ${join(outDir, 'homepage-fullpage.png')}`);

  // Tight hero shot — anchor on the .card link wrapping the hero image.
  const hero = await page.locator('section > a').first();
  await hero.screenshot({ path: join(outDir, 'hero.png') });
  console.log(`  → ${join(outDir, 'hero.png')}`);

  // First grid card too.
  const firstCard = await page.locator('.grid > a').first();
  await firstCard.screenshot({ path: join(outDir, 'card.png') });
  console.log(`  → ${join(outDir, 'card.png')}`);
} finally {
  await browser.close();
}
