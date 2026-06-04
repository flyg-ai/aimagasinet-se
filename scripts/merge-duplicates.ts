/**
 * Merge duplicate tool reviews into one canonical per tool. For each group the
 * base slug is canonical; the variant rows are 301'd to it and deleted. For the
 * two groups whose variant carries richer content (chatgpt-marknadsforing,
 * tidio-2) the unique content is merged into the canonical via Claude Haiku
 * before deletion.
 *
 *   DRY_RUN=1 npx tsx scripts/merge-duplicates.ts   # plan + write redirect files, no DB writes
 *   npx tsx scripts/merge-duplicates.ts             # live: merge content, delete variants
 *
 * Writes:
 *  - redirects.dedup.generated.mjs  (variant flat path → canonical flat path)
 *  - rewrites redirects.flatten.generated.mjs so any flatten destination that
 *    pointed at a now-deleted variant goes straight to the canonical (no chain).
 *
 * CURATED_HUB_TOOL_SLUGS remaps (claude-content→claude etc.) are applied in
 * app/[...slug]/page.tsx separately.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { flattenRedirects } from '../redirects.flatten.generated.mjs';

loadEnv({ path: '.env.local' });
const DRY = process.env.DRY_RUN === '1';
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

type Group = { canonical: string; variants: string[]; mergeFrom?: string };
const GROUPS: Group[] = [
  { canonical: 'chatgpt', variants: ['chatgpt-marknadsforing', 'chatgpt-oversattning'], mergeFrom: 'chatgpt-marknadsforing' },
  { canonical: 'claude', variants: ['claude-content', 'claude-oversattning'] },
  { canonical: 'notion-ai', variants: ['notion-ai-projektledning', 'notion-ai-dokumenthantering'] },
  { canonical: 'writesonic', variants: ['writesonic-content'] },
  { canonical: 'copy-ai', variants: ['copy-ai-content'] },
  { canonical: 'salesforce-einstein', variants: ['salesforce-einstein-crm'] },
  { canonical: 'hubspot-ai', variants: ['hubspot-ai-crm'] },
  { canonical: 'tidio', variants: ['tidio-2'], mergeFrom: 'tidio-2' },
  { canonical: 'canva-ai', variants: ['canva-ai-presentationer'] },
  { canonical: 'gamma', variants: ['gamma-presentationer'] },
  { canonical: 'hootsuite-ai', variants: ['hootsuite-ai-sociala-medier'] },
  { canonical: 'buffer-ai', variants: ['buffer-ai-sociala-medier'] },
  { canonical: 'predis-ai', variants: ['predis-ai-sociala-medier'] },
  { canonical: 'taplio', variants: ['taplio-sociala-medier'] },
  { canonical: 'postwise', variants: ['postwise-sociala-medier'] },
  { canonical: 'ocoya', variants: ['ocoya-sociala-medier'] },
];

type Row = { slug: string; path: string; title: string; content_mdx: string | null };

async function mergeContent(canonical: Row, variant: Row): Promise<string> {
  const prompt = `Du är redaktör på AI-Magasinet. Nedan är två recensioner av samma verktyg (${canonical.title}). Den FÖRSTA är den kanoniska. Den ANDRA innehåller extra/unik information. Slå ihop dem till EN recension som behåller den kanoniskas struktur men införlivar unika fakta, vinklar och exempel från den andra. Ta bort upprepningar.

Returnera ENBART ren HTML (<h2>,<h3>,<p>,<ul>/<li>,<table>). Ingen markdown, inga \`\`\`-block. Skriv inte H1.

=== KANONISK ===
${canonical.content_mdx ?? ''}

=== ALTERNATIV (unik info att införliva) ===
${variant.content_mdx ?? ''}`;
  const msg = await claude.messages.create({ model: 'claude-haiku-4-5', max_tokens: 6000, messages: [{ role: 'user', content: prompt }] });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim()
    .replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

async function main() {
  const allSlugs = GROUPS.flatMap((g) => [g.canonical, ...g.variants]);
  const { data, error } = await db.from('articles').select('slug,path,title,content_mdx').in('slug', allSlugs);
  if (error) { console.error(error.message); process.exit(1); }
  const bySlug = new Map((data as Row[]).map((r) => [r.slug, r]));

  // Validate.
  const missing = allSlugs.filter((s) => !bySlug.has(s));
  if (missing.length) { console.error('MISSING slugs (aborting):', missing.join(', ')); process.exit(1); }

  // Variant flat path → canonical flat path.
  const variantToCanonical = new Map<string, string>();   // variant flat path → canonical flat path
  const dedupRedirects: { source: string; destination: string; statusCode: number }[] = [];
  let variantCount = 0;
  for (const g of GROUPS) {
    const canon = bySlug.get(g.canonical)!;
    for (const v of g.variants) {
      const vr = bySlug.get(v)!;
      variantToCanonical.set(vr.path, canon.path);
      dedupRedirects.push({ source: vr.path, destination: canon.path, statusCode: 301 });
      variantCount++;
    }
  }
  console.log(`${GROUPS.length} grupper, ${variantCount} varianter att 301:a + radera.`);

  // Rewrite flatten redirects: any destination pointing at a deleted variant → canonical.
  const flat = flattenRedirects.map((r) => {
    const dest = variantToCanonical.get(r.destination);
    return dest ? { ...r, destination: dest } : r;
  });
  const flatChanged = flat.filter((r, i) => r.destination !== flattenRedirects[i].destination).length;

  if (DRY) {
    console.log('\nDRY_RUN — skriver redirect-filer men rör inte DB.');
  } else {
    // Content merge for the two richer-variant groups.
    for (const g of GROUPS.filter((g) => g.mergeFrom)) {
      const canon = bySlug.get(g.canonical)!;
      const variant = bySlug.get(g.mergeFrom!)!;
      console.log(`  merging ${variant.slug} (${variant.content_mdx?.length} tecken) → ${canon.slug}…`);
      const merged = await mergeContent(canon, variant);
      const { error: uErr } = await db.from('articles').update({ content_mdx: merged }).eq('slug', canon.slug);
      if (uErr) { console.error(`  merge update failed: ${uErr.message}`); process.exit(1); }
      console.log(`    → ${canon.slug} content_mdx uppdaterad (${merged.length} tecken)`);
    }
    // Delete variants.
    const variantSlugs = GROUPS.flatMap((g) => g.variants);
    const { error: dErr } = await db.from('articles').delete().in('slug', variantSlugs);
    if (dErr) { console.error('delete failed:', dErr.message); process.exit(1); }
    console.log(`  Raderade ${variantSlugs.length} varianter.`);
  }

  // Write redirect files (always — they reflect the intended end state).
  writeFileSync(resolve('redirects.dedup.generated.mjs'),
    `// AUTO-GENERERAD av scripts/merge-duplicates.ts — redigera inte för hand.\n` +
    `// 301: raderade dubblett-varianter → kanonisk /ai-verktyg/<slug>.\n` +
    `/** @type {{source: string, destination: string, statusCode: number}[]} */\n` +
    `export const dedupRedirects = ${JSON.stringify(dedupRedirects, null, 2)};\n`, 'utf8');
  console.log(`\nWrote redirects.dedup.generated.mjs (${dedupRedirects.length} redirects)`);

  // Rewrite flatten file (collapse variant destinations → canonical) preserving header.
  const fp = resolve('redirects.flatten.generated.mjs');
  const header = readFileSync(fp, 'utf8').slice(0, readFileSync(fp, 'utf8').indexOf('export const'));
  writeFileSync(fp, `${header}export const flattenRedirects = ${JSON.stringify(flat, null, 2)};\n`, 'utf8');
  console.log(`Rewrote redirects.flatten.generated.mjs (${flatChanged} destinationer omdirigerade till kanonisk).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
