// Drives the compare wizard through all 4 steps and screenshots each.
// Usage: SHOT_MODE=desktop|mobile node scripts/verify-wizard-flow.mjs
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const base = process.env.BASE_URL ?? 'http://localhost:3137';
const url = `${base}/ai-verktyg/jamfor`;
const outDir = 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
const mode = process.env.SHOT_MODE ?? 'desktop';
mkdirSync(outDir, { recursive: true });

const tag = mode === 'mobile' ? 'm' : 'd';
const shot = async (page, name) => {
  await page.waitForTimeout(350);
  const p = join(outDir, `wiz-${tag}-${name}.png`);
  await page.screenshot({ path: p });
  console.log(`  → ${p}`);
};

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext(
    mode === 'mobile'
      ? { ...devices['iPhone 13'] }
      : { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 }
  );
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);

  // STEP 1 — tool grid
  await shot(page, '1-tools');
  // Next should be disabled before selecting 2 tools
  const nextSel = 'button:has-text("Nästa")';
  const disabledBefore = await page.locator(nextSel).first().isDisabled();
  console.log('step1 Nästa disabled before pick:', disabledBefore);

  // pick the first two tool cards (aria-pressed toggles)
  const cards = page.locator('button[aria-pressed]');
  await cards.nth(0).click();
  await cards.nth(1).click();
  await shot(page, '1-tools-picked');
  const disabledAfter = await page.locator(nextSel).first().isDisabled();
  console.log('step1 Nästa disabled after 2 picks:', disabledAfter);
  await page.locator(nextSel).first().click();

  // STEP 2 — syfte
  await page.waitForTimeout(300);
  await shot(page, '2-syfte');
  const nextS2 = page.getByRole('button', { name: 'Nästa →' });
  console.log('step2 Nästa disabled before pick:', await nextS2.isDisabled());
  // pick two syfte options
  const pills = page.locator('button[aria-pressed]');
  await pills.nth(0).click();
  await pills.nth(2).click();
  await shot(page, '2-syfte-picked');
  console.log('step2 Nästa disabled after pick:', await nextS2.isDisabled());
  await nextS2.click();

  // STEP 3 — budget
  await page.waitForTimeout(300);
  await shot(page, '3-budget');
  await page.locator('button[aria-pressed]').nth(1).click();
  await shot(page, '3-budget-picked');
  await page.getByRole('button', { name: 'Visa jämförelse →' }).click();

  // STEP 4 — result
  await page.waitForTimeout(2500); // allow recommend fetch
  await shot(page, '4-result');

  console.log('CONSOLE ERRORS:', errors.length ? errors : 'none');
} finally {
  await browser.close();
}
