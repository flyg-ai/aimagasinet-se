/**
 * Remove the intro block from the ai-text-verktyg hub:
 *   • "🏆 Bästa AI-textverktyg just nu" mobile-picks card
 *   • the old "Jämför AI-textverktyg" widget (h2 + controls)
 *   • the intro paragraphs about AI-skrivverktyg
 *   • the <hr> separator that follows
 *
 * Stops cleanly RIGHT BEFORE "<!-- 1. CLAUDE -->" so the reviews are
 * untouched. The start anchor is `<div class="ai-mobile-picks">` — using
 * the inner <h3> as anchor would leave an orphan div opener and break
 * the rest of the page (this is what happened twice before).
 *
 * Run: npm run remove-intro
 *
 * Confirmation required: prints the full diff, prompts for "ja",
 * aborts on anything else. NEVER writes without "ja".
 */
import { createInterface } from 'node:readline';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const SLUG = 'ai-text-verktyg';
const START_MARKER = '<div class="ai-mobile-picks">';
const END_MARKER = '<!-- 1.';
const CONTEXT_CHARS = 200;
const MAX_PREVIEW_CHARS = 4000;   // truncate the "TO BE REMOVED" preview if huge
const SANITY_MAX = 10000;          // refuse if removal range exceeds this

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function countTags(text: string, tag: string): { opens: number; closes: number } {
  const opens = (text.match(new RegExp(`<${tag}\\b`, 'gi')) ?? []).length;
  const closes = (text.match(new RegExp(`</${tag}>`, 'gi')) ?? []).length;
  return { opens, closes };
}

async function main() {
  const { data, error } = await db
    .from('articles')
    .select('id,path,content_mdx')
    .eq('slug', SLUG)
    .maybeSingle();

  if (error) { console.error('Fetch failed:', error.message); process.exit(1); }
  if (!data) { console.error(`No articles row with slug='${SLUG}'.`); process.exit(1); }

  const html = data.content_mdx ?? '';
  if (!html) { console.error('content_mdx is empty.'); process.exit(0); }

  const start = html.indexOf(START_MARKER);
  const end   = html.indexOf(END_MARKER);
  if (start === -1) { console.log(`Start marker not found: ${START_MARKER}`); process.exit(0); }
  if (end === -1)   { console.log(`End marker not found: ${END_MARKER}`);   process.exit(0); }
  if (end <= start) { console.error('End anchor precedes start. Aborting.'); process.exit(1); }

  const removed = html.slice(start, end);
  const before  = html.slice(Math.max(0, start - CONTEXT_CHARS), start);
  const after   = html.slice(end, end + CONTEXT_CHARS);

  if (removed.length > SANITY_MAX) {
    console.error(`Removal range (${removed.length} chars) exceeds sanity max of ${SANITY_MAX}. Aborting.`);
    console.error('If this is intentional, raise SANITY_MAX in the script.');
    process.exit(1);
  }

  // Tag-balance audit
  const tagAudit = (['div', 'h2', 'h3', 'script', 'style', 'hr'] as const).map((t) => {
    const inRemoved = countTags(removed, t);
    return { tag: t, ...inRemoved, diff: inRemoved.opens - inRemoved.closes };
  });

  console.log(`Row: id=${data.id} ${data.path}`);
  console.log(`content_mdx: ${html.length} chars`);
  console.log(`Removal range: [${start}, ${end}) = ${removed.length} chars (~${Math.round(removed.length / html.length * 100)}%)\n`);

  console.log('Tag balance INSIDE removal range:');
  console.table(tagAudit);

  console.log('\n═══ ' + CONTEXT_CHARS + ' chars BEFORE (kept) ' + '═'.repeat(40));
  console.log(before);

  console.log('\n═══ TO BE REMOVED (' + removed.length + ' chars' +
    (removed.length > MAX_PREVIEW_CHARS ? `, showing first ${MAX_PREVIEW_CHARS}` : '') +
    ') ' + '═'.repeat(40));
  console.log(
    removed.length > MAX_PREVIEW_CHARS
      ? removed.slice(0, MAX_PREVIEW_CHARS) + `\n\n…[truncated ${removed.length - MAX_PREVIEW_CHARS} chars]…`
      : removed
  );

  console.log('\n═══ ' + CONTEXT_CHARS + ' chars AFTER (kept) ' + '═'.repeat(40));
  console.log(after);
  console.log('═'.repeat(70));

  console.log('\nThis removes the "Bästa AI-textverktyg just nu" mobile-picks card, the');
  console.log('"Jämför AI-textverktyg" widget (incl. checkboxes/intro), and the intro');
  console.log('paragraphs about AI-skrivverktyg. Reviews ("1. Claude" and below) are kept.');

  const answer = await prompt('\nTa bort detta från databasen? Skriv "ja" för att bekräfta: ');
  if (answer.trim().toLowerCase() !== 'ja') {
    console.log('Avbryter. Inget skrivet till databasen.');
    process.exit(0);
  }

  const newHtml = html.slice(0, start) + html.slice(end);
  const { error: upErr } = await db
    .from('articles')
    .update({ content_mdx: newHtml })
    .eq('slug', SLUG);

  if (upErr) { console.error('Update failed:', upErr.message); process.exit(1); }

  console.log(`✓ Bort. ${html.length} → ${newHtml.length} chars (-${html.length - newHtml.length}).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
