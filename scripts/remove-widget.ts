/**
 * Remove ONLY the "Jämför AI-textverktyg" comparison widget from the
 * ai-text-verktyg page's content_mdx.
 *
 * Run: npm run remove-widget
 *
 * Definition (per spec):
 *   Start: the <h2 ...> tag whose body contains "Jämför AI-textverktyg"
 *   End:   just before the next <h2 or <hr in the document
 *
 * Behaviour:
 *   1. Fetch current content_mdx from Supabase.
 *   2. Compute the slice that would be removed.
 *   3. Print the slice + ~200 chars of surrounding context.
 *   4. Prompt for "ja". Anything else → abort, no write.
 *   5. Only on "ja", update the row.
 *
 * Safe to re-run: if the widget isn't present, the script aborts cleanly.
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
const KEYWORD = 'Jämför AI-textverktyg';
const CONTEXT_CHARS = 200;

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

/** Locate the start/end indices of the widget. Returns null if not found. */
function findWidget(html: string): { start: number; end: number } | null {
  // Start: <h2 ...> ... KEYWORD ... — first <h2 tag whose content contains the keyword.
  const startRe = /<h2[^>]*>[\s\S]*?Jämför AI-textverktyg/i;
  const m = html.match(startRe);
  if (!m || m.index === undefined) return null;
  const start = m.index;

  // End: first occurrence of <h2 or <hr AFTER the start (skipping the start tag itself).
  const searchFrom = start + 3; // skip past "<h2"
  const lower = html.toLowerCase();
  const nextH2 = lower.indexOf('<h2', searchFrom);
  const nextHr = lower.indexOf('<hr', searchFrom);
  const candidates = [nextH2, nextHr].filter((i) => i !== -1);
  if (candidates.length === 0) {
    // No terminator found — refuse rather than wipe the rest of the document.
    return null;
  }
  const end = Math.min(...candidates);
  return { start, end };
}

async function main() {
  const { data, error } = await db
    .from('articles')
    .select('id,path,content_mdx')
    .eq('slug', SLUG)
    .maybeSingle();

  if (error) {
    console.error('Fetch failed:', error.message);
    process.exit(1);
  }
  if (!data) {
    console.error(`No articles row with slug='${SLUG}'.`);
    process.exit(1);
  }

  const html = data.content_mdx ?? '';
  if (!html) {
    console.error('content_mdx is empty. Nothing to do.');
    process.exit(0);
  }

  const hit = findWidget(html);
  if (!hit) {
    console.log(`No "${KEYWORD}" widget found (or no terminator). Nothing to do.`);
    process.exit(0);
  }

  const { start, end } = hit;
  const removed = html.slice(start, end);
  const before = html.slice(Math.max(0, start - CONTEXT_CHARS), start);
  const after = html.slice(end, end + CONTEXT_CHARS);

  console.log(`Row: id=${data.id} ${data.path}`);
  console.log(`Current content_mdx: ${html.length} chars`);
  console.log(`Widget span: [${start}, ${end}) — ${removed.length} chars to remove\n`);

  console.log('═══ ' + CONTEXT_CHARS + ' chars BEFORE (kept) ' + '═'.repeat(40));
  console.log(before);
  console.log('\n═══ TO BE REMOVED (' + removed.length + ' chars) ' + '═'.repeat(40));
  console.log(removed);
  console.log('\n═══ ' + CONTEXT_CHARS + ' chars AFTER (kept) ' + '═'.repeat(40));
  console.log(after);
  console.log('═'.repeat(70));

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

  if (upErr) {
    console.error('Update failed:', upErr.message);
    process.exit(1);
  }

  console.log(`✓ Widget borttagen. ${html.length} → ${newHtml.length} chars (-${html.length - newHtml.length}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
