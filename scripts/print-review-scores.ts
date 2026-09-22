/**
 * Skriver ut betyget för ett antal recensioner, räknat med lib/review-score.ts
 * — samma funktion som recensionssidan (ReviewTemplate), topplistblocket och
 * "Verktyg i guiden" använder. Läser bara; skriver ingenting.
 *
 *   npx tsx scripts/print-review-scores.ts                 # tio recensioner
 *   npx tsx scripts/print-review-scores.ts sora-2 semrush-ai
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { reviewScore, listScoreText } from '../lib/review-score';
import { isReviewRow } from '../lib/route-kind';
import { reviewCategoryLabel } from '../lib/review-refs';

loadEnv({ path: '.env.local' });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: { persistSession: false },
});

const DEFAULT = [
  'chatgpt', 'claude', 'sora-2', 'kling-ai', 'windsurf',
  'semrush-ai', 'surfer-seo', 'neuronwriter', 'wint-ai', 'fortnox-ai', 'rankmath-ai',
];

(async () => {
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;
  const { data, error } = await db
    .from('articles')
    .select('slug,path,title,type,parent_slug,content_mdx')
    .in('slug', slugs);
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  for (const slug of slugs) {
    const r = rows.find((x) => x.slug === slug);
    if (!r) { console.log(`${slug.padEnd(22)} (finns inte)`); continue; }
    const s = reviewScore(r);
    const kind = isReviewRow(r) ? 'recension' : 'INTE recension';
    console.log(
      `${slug.padEnd(22)} lista: ${String(listScoreText(s) ?? 'Ej betygsatt').padEnd(12)} sida: ${String(s.display ?? 'Ännu ej betygsatt').padEnd(18)} label: ${s.label.padEnd(18)} ${kind}  ${reviewCategoryLabel(r.slug, r.parent_slug) ?? ''}`,
    );
  }
})();
