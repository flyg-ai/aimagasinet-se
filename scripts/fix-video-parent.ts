/**
 * Re-parent video tools under /ai-video and populate featured_image from the
 * /ai-video hub's inline <img> tags.
 *
 * Current state (verified):
 *   - /ai-video has only kling-ai as child (parent_slug='ai-video')
 *   - sora-2, pika-labs, runway-gen-3 sit under parent_slug='ai-video-verktyg'
 *     (which has generic AI-Magasinet placeholder logos in its content_mdx)
 *   - /ai-video content_mdx has the REAL tool logos for all 4
 *
 * After this script:
 *   - All 4 video tools share parent_slug='ai-video'
 *   - /ai-video hub renders all 4 in the topplistan
 *   - featured_image populated from the /ai-video inline <img> tags
 *   - URL paths are NOT changed (sora-2/pika-labs/runway-gen-3 keep their
 *     /ai-verktyg/ai-video-verktyg/* paths — change those separately if needed)
 *
 * Run: npm run fix-video-parent
 * Asks for "ja" before writing.
 */
import { createInterface } from 'node:readline';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env vars'); process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const REPARENT_SLUGS = ['sora-2', 'pika-labs', 'runway-gen-3'];

// Map of alt-text patterns to child slugs (case-insensitive substring match)
const LOGO_MATCHERS: Array<[RegExp, string]> = [
  [/kling/i,             'kling-ai'],
  [/sora/i,              'sora-2'],
  [/pika/i,              'pika-labs'],
  [/runway/i,            'runway-gen-3'],
];

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a); }));
}

async function main() {
  // Read /ai-video content to extract logo URLs
  const hub = await db
    .from('articles')
    .select('content_mdx')
    .eq('slug', 'ai-video')
    .maybeSingle();
  if (hub.error || !hub.data) { console.error('No /ai-video row'); process.exit(1); }

  const html = hub.data.content_mdx ?? '';

  // Extract { alt, src } pairs from inline <img>
  type Imatch = { alt: string; src: string };
  const matches: Imatch[] = [];
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/gi)) {
    matches.push({ src: m[1], alt: m[2] });
  }

  // Map to child slugs
  const logoForSlug = new Map<string, string>();
  for (const { alt, src } of matches) {
    for (const [pattern, slug] of LOGO_MATCHERS) {
      if (pattern.test(alt) && !logoForSlug.has(slug)) {
        logoForSlug.set(slug, src);
      }
    }
  }

  // Resolve to absolute URLs (some are relative /wp-content/...)
  const absoluteUrl = (u: string) =>
    u.startsWith('http') ? u : `https://aimagasinet.se${u}`;

  console.log('═'.repeat(70));
  console.log('STEG 1: parent_slug-omflyttning');
  console.log('═'.repeat(70));
  for (const slug of REPARENT_SLUGS) {
    console.log(`  ${slug.padEnd(15)}: ai-video-verktyg → ai-video`);
  }
  console.log('  kling-ai: redan parent_slug=ai-video (no change)');

  console.log('\n' + '═'.repeat(70));
  console.log('STEG 2: featured_image från /ai-video inline-img-taggar');
  console.log('═'.repeat(70));
  for (const slug of ['kling-ai', 'sora-2', 'pika-labs', 'runway-gen-3']) {
    const url = logoForSlug.get(slug);
    if (url) {
      console.log(`  ${slug.padEnd(15)}: ${absoluteUrl(url)}`);
    } else {
      console.log(`  ${slug.padEnd(15)}: (ingen match — featured_image lämnas orörd)`);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('KONSEKVENS:');
  console.log('  • /ai-video hub kommer visa 4 verktyg (var: 1)');
  console.log('  • /ai-verktyg/ai-video-verktyg hub blir tom → faller till ArticleTemplate');
  console.log('  • URL-paths är OFÖRÄNDRADE — sora-2/pika-labs/runway-gen-3 ligger kvar på');
  console.log('    /ai-verktyg/ai-video-verktyg/* (parent_slug och path är nu inkonsekventa).');
  console.log('═'.repeat(70));

  const answer = await prompt('\nApplicera dessa ändringar? Skriv "ja" för att bekräfta: ');
  if (answer.trim().toLowerCase() !== 'ja') {
    console.log('Avbryter. Inget skrivet till databasen.');
    process.exit(0);
  }

  // Apply parent_slug fix
  for (const slug of REPARENT_SLUGS) {
    const r = await db
      .from('articles')
      .update({ parent_slug: 'ai-video' })
      .eq('slug', slug)
      .select('slug');
    if (r.error) console.error(`  ✗ ${slug}: ${r.error.message}`);
    else if (!r.data || r.data.length === 0) console.warn(`  · ${slug}: no row matched`);
    else console.log(`  ✓ ${slug} re-parented`);
  }

  // Apply featured_image
  for (const slug of ['kling-ai', 'sora-2', 'pika-labs', 'runway-gen-3']) {
    const url = logoForSlug.get(slug);
    if (!url) continue;
    const r = await db
      .from('articles')
      .update({ featured_image: absoluteUrl(url) })
      .eq('slug', slug)
      .select('slug');
    if (r.error) console.error(`  ✗ ${slug}: ${r.error.message}`);
    else if (!r.data || r.data.length === 0) console.warn(`  · ${slug}: no row matched`);
    else console.log(`  ✓ ${slug} logo set`);
  }

  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
