/**
 * SEO-pass for the jämför-feature, generated via Claude Sonnet 4.6.
 *
 *   npx tsx scripts/seo-jamfor-pass.ts
 *
 * Does three things:
 *  1. Appends a ~600-word "bästa AI-verktyg 2026" section to /ai-verktyg
 *     (content_mdx in Supabase), with an internal link to /ai-verktyg/jamfor/.
 *  2. Appends short internal-link blurbs to the text/kod/ljud/video category
 *     pages, linking to the relevant static comparison pages.
 *  3. Writes a ~500-word "jämför AI-verktyg" SEO block to lib/jamfor-seo.ts
 *     (rendered under "Populära jämförelser" on the hub).
 *
 * Idempotent — DB content is merged at the <!--seo-jamfor--> marker, so
 * re-running replaces the generated section instead of duplicating it.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const MODEL = 'claude-sonnet-4-6';
const MARKER = '<!--seo-jamfor-->';

const SYSTEM = `Du är senior SEO-redaktör på AI-Magasinet (svenskt magasin om AI).

# Krav
- Skriv på svenska — naturlig affärssvenska, inte direktöversatt engelska.
- Returnera ENBART ren HTML: <h2>, <p> och <a href="...">. Ingen <html>/<body>, ingen markdown, inga \`\`\`-block.
- Väv in nyckelord och synonymer naturligt — aldrig keyword-stuffing.
- Inkludera EXAKT de länkar (href + ankartext) som anges, infogade naturligt i löptexten.
- Inga floskler ("revolutionerande", "i en värld där...", "game changer"). Inga emojis. Ingen affiliate-CTA.`;

async function sonnet(user: string): Promise<string> {
  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: 2500,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

/** Guarantee every required link is present — append a fallback line if the
 *  model skipped one (so internal linking never silently breaks). */
function ensureLinks(html: string, links: { href: string; label: string }[]): string {
  const missing = links.filter((l) => !html.includes(l.href));
  if (missing.length === 0) return html;
  const line = missing.map((l) => `<a href="${l.href}">${l.label}</a>`).join(' · ');
  return `${html}\n<p>Relaterat: ${line}</p>`;
}

function prompt(heading: string, words: number, focus: string, context: string, links: { href: string; label: string }[]): string {
  return [
    context,
    `Skriv ett SEO-avsnitt på cirka ${words} ord.`,
    `Inled med rubriken: <h2>${heading}</h2>`,
    `Fokusnyckelord/teman att väva in naturligt: ${focus}.`,
    `Länkar som MÅSTE finnas med (infoga naturligt i texten):`,
    ...links.map((l) => `- <a href="${l.href}">${l.label}</a>`),
    '',
    'Returnera bara HTML enligt instruktionerna.',
  ].join('\n');
}

type DbTarget = {
  path: string;
  words: number;
  heading: string;
  focus: string;
  context: string;
  links: { href: string; label: string }[];
};

const DB_TARGETS: DbTarget[] = [
  {
    path: '/ai-verktyg',
    words: 600,
    heading: 'Så hittar du de bästa AI-verktygen 2026',
    focus: 'bästa AI-verktyg, AI-verktyg 2026, samt synonymerna AI-program, AI-tjänster och intelligenta verktyg',
    context: 'Detta är översiktssidan /ai-verktyg som listar alla kategorier av AI-verktyg: text, bild, video, kod, ljud och automation.',
    links: [{ href: '/ai-verktyg/jamfor/', label: 'jämför AI-verktyg sida vid sida' }],
  },
  {
    path: '/ai-verktyg/ai-text-verktyg',
    words: 120,
    heading: 'Jämför text-AI:erna mot varandra',
    focus: 'bästa AI-verktyg för text, jämför AI-verktyg',
    context: 'Detta är kategorisidan för AI-textverktyg (ChatGPT, Claude, Gemini m.fl.).',
    links: [
      { href: '/ai-verktyg/jamfor/chatgpt-eller-claude/', label: 'ChatGPT eller Claude' },
      { href: '/ai-verktyg/jamfor/chatgpt-eller-gemini/', label: 'ChatGPT eller Gemini' },
    ],
  },
  {
    path: '/ai-verktyg/ai-kod-verktyg',
    words: 100,
    heading: 'Vilken AI-kodassistent ska du välja?',
    focus: 'bästa AI-verktyg för kod, jämför AI-verktyg',
    context: 'Detta är kategorisidan för AI-kodverktyg (Cursor, GitHub Copilot, Windsurf m.fl.).',
    links: [{ href: '/ai-verktyg/jamfor/cursor-eller-github-copilot/', label: 'Cursor eller GitHub Copilot' }],
  },
  {
    path: '/ai-verktyg/ai-ljud-och-musik',
    words: 100,
    heading: 'Jämför AI för musik och röst',
    focus: 'bästa AI-verktyg för ljud och musik, jämför AI-verktyg',
    context: 'Detta är kategorisidan för AI-ljud och musik (Suno, Udio, ElevenLabs m.fl.).',
    links: [{ href: '/ai-verktyg/jamfor/suno-eller-udio/', label: 'Suno eller Udio' }],
  },
  {
    path: '/ai-video',
    words: 100,
    heading: 'Jämför AI-videoverktygen',
    focus: 'bästa AI-verktyg för video, jämför AI-verktyg',
    context: 'Detta är kategorisidan för AI-video (Kling, Runway, Pika Labs, Sora m.fl.).',
    links: [{ href: '/ai-verktyg/jamfor/kling-eller-pika-labs/', label: 'Kling eller Pika Labs' }],
  },
];

function merge(existing: string | null, html: string): string {
  const base = existing ? existing.split(MARKER)[0].trimEnd() : '';
  return `${base}\n${MARKER}\n${html}\n`;
}

async function updateDbTargets() {
  for (const t of DB_TARGETS) {
    const { data, error } = await db
      .from('articles')
      .select('id,content_mdx')
      .eq('path', t.path)
      .maybeSingle();
    if (error) { console.error(`  ${t.path} fetch FAILED: ${error.message}`); continue; }
    if (!data) { console.error(`  ${t.path} — ingen artikel hittad, hoppar över`); continue; }

    const html = ensureLinks(await sonnet(prompt(t.heading, t.words, t.focus, t.context, t.links)), t.links);
    const next = merge((data as { content_mdx: string | null }).content_mdx, html);
    const { error: uErr } = await db.from('articles').update({ content_mdx: next }).eq('id', (data as { id: number }).id);
    if (uErr) { console.error(`  ${t.path} update FAILED: ${uErr.message}`); continue; }
    console.log(`  OK  ${t.path.padEnd(34)} (+${html.length} tecken)`);
  }
}

async function writeJamforSeo() {
  const links = [
    { href: '/ai-verktyg/jamfor/chatgpt-eller-claude/', label: 'ChatGPT eller Claude' },
    { href: '/ai-verktyg/jamfor/cursor-eller-github-copilot/', label: 'Cursor eller GitHub Copilot' },
    { href: '/ai-verktyg/jamfor/midjourney-eller-dall-e-3/', label: 'Midjourney eller DALL·E 3' },
    { href: '/ai-verktyg/jamfor/suno-eller-udio/', label: 'Suno eller Udio' },
    { href: '/ai-verktyg/jamfor/kling-eller-pika-labs/', label: 'Kling eller Pika Labs' },
  ];
  const html = ensureLinks(
    await sonnet(prompt(
      'Därför lönar det sig att jämföra AI-verktyg',
      500,
      'jämför AI-verktyg, jämförelse av AI-verktyg, bästa AI-verktyg 2026',
      'Detta är en SEO-text som visas längst ned på jämförelsesidan /ai-verktyg/jamfor. Den ska förklara varför man bör jämföra AI-verktyg och vägleda till de populäraste jämförelserna.',
      links,
    )),
    links,
  );
  const file = resolve('lib/jamfor-seo.ts');
  const contents =
    `/** SEO-text för /ai-verktyg/jamfor — genererad av scripts/seo-jamfor-pass.ts\n` +
    ` *  via ${MODEL}. Redigera i scriptet och kör om, inte här. */\n` +
    `export const JAMFOR_SEO_HTML = ${JSON.stringify(html)};\n`;
  writeFileSync(file, contents, 'utf8');
  console.log(`  OK  lib/jamfor-seo.ts (${html.length} tecken)`);
}

async function main() {
  console.log(`SEO-pass via ${MODEL}…\n`);
  console.log('DB-sidor:');
  await updateDbTargets();
  console.log('\njämför-SEO-block:');
  await writeJamforSeo();
  console.log('\nKlart.');
}

main().catch((e) => { console.error(e); process.exit(1); });
