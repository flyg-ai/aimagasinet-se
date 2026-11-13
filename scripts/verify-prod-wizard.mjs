// Polls prod for the new wizard panel label, then screenshots it.
// The label "Jämförelse · Steg N av 4 · …" is unique to the design-lift
// commit, so its presence confirms the new deploy is live.
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const url = 'https://aimagasinet.se/ai-verktyg/jamfor';
const outDir = 'C:/Users/hallb/Desktop/aimagasinet.se/web/tmp-shots';
const mode = process.env.SHOT_MODE ?? 'desktop';
const maxMs = parseInt(process.env.MAX_MS ?? '300000', 10); // 5 min
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext(
  mode === 'mobile'
    ? { ...devices['iPhone 13'] }
    : { viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 }
);
const page = await ctx.newPage();
const marker = /Jämförelse\s*·\s*Steg\s*\d\s*av\s*4/i;

const started = Date.now();
let live = false;
let attempt = 0;
while (Date.now() - started < maxMs) {
  attempt++;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(1200);
    const html = await page.content();
    if (marker.test(html)) { live = true; break; }
    console.log(`attempt ${attempt}: new label not yet live…`);
  } catch (e) {
    console.log(`attempt ${attempt}: ${String(e).slice(0, 80)}`);
  }
  await page.waitForTimeout(15000);
}

const tag = mode === 'mobile' ? 'm' : 'd';
const out = join(outDir, `prod-${tag}-step1.png`);
await page.screenshot({ path: out });
console.log(live ? `LIVE ✓  → ${out}` : `TIMEOUT (old version still served) → ${out}`);
await browser.close();
process.exit(live ? 0 : 2);
