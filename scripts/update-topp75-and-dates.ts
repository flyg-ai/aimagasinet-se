/**
 * 1. Backfill articles.updated_at = published_at where updated_at IS NULL.
 * 2. Update /topp-50-ai-latar-pa-spotify-2026:
 *    - expand 50 → 75 songs (same format)
 *    - Spotify embeds for the full top 10 (#4–#10 converted from links)
 *    - extra inline link to /ai-verktyg/ai-ljud-och-musik/suno-ai/
 *    - title/seo_title bumped to 75 + "Juni 2026"
 *    - updated_at = now()
 *
 *   npx tsx scripts/update-topp75-and-dates.ts
 *
 * Idempotent: link→embed conversion is keyed on Spotify IDs (a no-op once
 * converted); the 51–75 section is only inserted if "#51 —" is absent.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const PATH = '/topp-50-ai-latar-pa-spotify-2026';

/* ─── Spotify embeds for #4–#10 (IDs already in the existing links) ─── */
const EMBEDS: { type: 'track' | 'album'; id: string }[] = [
  { type: 'track', id: '4UOcKqjtn0pHHnYfFVGHqh' }, // #4
  { type: 'track', id: '0in5pWf8oEzZRjl7nl3wJO' }, // #5
  { type: 'track', id: '1VTEoni0vuY5eRjPKD3aqo' }, // #6
  { type: 'track', id: '68g7z6HNpIW23g1Bt8NhkI' }, // #7
  { type: 'album', id: '3TIWZnMFfN3VOCjix3UdIN' }, // #8
  { type: 'album', id: '2luxbfZ6WrZf81utRhcW7j' }, // #9
  { type: 'track', id: '3Z8JXku3aljmJ4uYueL2ay' }, // #10
];

function embedHtml(type: string, id: string): string {
  return `<div class="ai50-embed">
    <iframe
        style="border-radius:12px"
        src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator"
        width="100%"
        height="152"
        frameborder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy">
    </iframe>
</div>`;
}

/** Replace the single <p>…spotify…/<type>/<id>…</p> block with an embed.
 *  The lookahead keeps the match inside one <p> so we never swallow the
 *  preceding description paragraphs. No-op if already converted. */
function linkToEmbed(html: string, type: string, id: string): string {
  if (html.includes(`/embed/${type}/${id}`)) return html; // already an embed
  const re = new RegExp(`<p>(?:(?!</p>)[^])*?open\\.spotify\\.com/${type}/${id}(?:(?!</p>)[^])*?</p>`);
  return html.replace(re, embedHtml(type, id));
}

/* ─── 25 new songs (#51–#75), same short format as #21–#50 ─── */
const NEW_SONGS: [string, string][] = [
  ['Synthetic Tears 2.0 – Xania Monet', 'R&amp;B-uppföljaren som dominerade Spotify Viral 50 i vintras.'],
  ['Ghost in the Mainframe – Glorb', 'Cyberpop-anthem som blev TikTok-soundtrack över hela världen 2026.'],
  ['Prairie Protocol – Breaking Rust', 'AI-country som nådde Billboard Hot 100 — gruppens största hit hittills.'],
  ['Hymn for the Algorithm – Solomon Ray', 'AI-gospel med massiv kör, viral på Instagram Reels.'],
  ['Electric Hallelujah – AI Gospel Collective', 'Worship-meme som spreds globalt på bara några veckor.'],
  ['Static Lullaby – The Velvet Sundown', 'Drömsk AI-indie från bandets efterlängtade andra album.'],
  ['Neural Bloom – AIDEN', 'Optimistisk synthpop som blev störst i Sydkorea och Japan.'],
  ['Deepfake Heartbreak – Spalexma', 'Kontroversiell men strömmad miljontals gånger.'],
  ['Code Red Romance – Miquela', 'Virtuell influencer-pop med helt AI-genererade vokaler.'],
  ['The Last Human Song – Various AI Artists', 'Kollaborativt community-spår om AI-eran.'],
  ['Binary Sunset – Glorb', 'Instrumentell AI-electro, favorit hos producenter.'],
  ['Reborn in Reverb – The Velvet Sundown', 'Shoegaze möter AI i ett av årets mest hyllade spår.'],
  ['Faith.exe – Solomon Ray', 'Gospel/EDM-crossover som toppade flera listor.'],
  ['Midnight Dataset – Xania Monet', 'Sensuell dark-R&amp;B, en av årets mest spelade AI-låtar.'],
  ['Robot Tears Don&#8217;t Lie – Breaking Rust', 'Country-ballad, oväntat känslosam för att vara helt syntetisk.'],
  ['Hyperreal – AIDEN', 'Hyperpop-influerad och viral bland Gen Z.'],
  ['Soul of the Servers – AI Gospel Collective', 'Stor kör med AI-styrd dynamik.'],
  ['Phantom Frequencies – Glorb', 'Industriell, mörk och experimentell.'],
  ['Digital Devotion – Spalexma', 'Worship-trap-hybrid som splittrade kritikerna.'],
  ['Echo of Eden – Solomon Ray', 'Atmosfärisk AI-gospel med filmisk produktion.'],
  ['Love in Low Resolution – Miquela', 'Lo-fi AI-pop som blev en sömnplaylist-favorit.'],
  ['Simulation Symphony – Holly Herndon', 'Konstmusik med AI-körer och akademisk precision.'],
  ['Static Saints – The Velvet Sundown', 'Indie-rock med karaktäristisk AI-skörhet.'],
  ['Numb the Neural Net – Jeris Johnson', 'Hyperpop/trap-crossover skriven med AI-modeller.'],
  ['We Were the Prompt – Various AI Artists', 'Avslutande hymn om samspelet mellan människa och maskin.'],
];

function newSection(): string {
  const intro =
    `<p>\nDe 25 låtarna nedan är de som verkligen exploderade under första halvan av 2026 — många skapade med ` +
    `<a href="/ai-verktyg/ai-ljud-och-musik/suno-ai/">Suno AI</a> och liknande verktyg. De visar hur snabbt ` +
    `AI-musiken mognat: bättre röster, vassare hookar och artister som börjar kännas som riktiga varumärken.\n</p>`;
  const items = NEW_SONGS.map(([titleArtist, desc], i) =>
    `<h3>#${51 + i} — ${titleArtist}</h3>\n<p>${desc}</p>`,
  ).join('\n\n');
  return `<h2>Plats 51–75 — Nya AI-låtar som exploderade 2026</h2>\n\n${intro}\n\n${items}`;
}

/* ─── Backfill updated_at = published_at where NULL ─── */
async function backfillDates() {
  const { data, error } = await db
    .from('articles')
    .select('id,published_at')
    .is('updated_at', null);
  if (error) { console.error('backfill fetch failed:', error.message); process.exit(1); }
  const rows = (data ?? []).filter((r: { published_at: string | null }) => r.published_at);
  console.log(`Backfilling updated_at on ${rows.length} rows (updated_at IS NULL)…`);
  let ok = 0;
  for (let i = 0; i < rows.length; i += 20) {
    const chunk = rows.slice(i, i + 20) as { id: number; published_at: string }[];
    await Promise.all(
      chunk.map((r) =>
        db.from('articles').update({ updated_at: r.published_at }).eq('id', r.id)
          .then(({ error }) => { if (!error) ok++; else console.error(`  id ${r.id}: ${error.message}`); }),
      ),
    );
  }
  console.log(`  backfilled ${ok}/${rows.length}.`);
}

/* ─── Update the topp-50 article ─── */
async function updateArticle() {
  const { data, error } = await db
    .from('articles')
    .select('id,title,seo_title,content_mdx')
    .eq('path', PATH)
    .maybeSingle();
  if (error || !data) { console.error('article fetch failed:', error?.message ?? 'not found'); process.exit(1); }

  let html = data.content_mdx as string;

  // 1. Top-10 embeds
  for (const e of EMBEDS) html = linkToEmbed(html, e.type, e.id);

  // 2. Insert 51–75 section before the "AI-musikens utveckling" heading
  const anchor = '<h2>AI-musikens utveckling – varför exploderar det just nu?</h2>';
  if (!html.includes('#51 —') && html.includes(anchor)) {
    html = html.replace(anchor, `${newSection()}\n\n<hr class="ai50-divider">\n\n${anchor}`);
  }

  // 3. Make the "50" references consistent with the now-75 list
  html = html
    .replace('<strong>Topp 50 AI-låtar på Spotify</strong>', '<strong>Topp 75 AI-låtar på Spotify</strong>')
    .replace('Här är de 50 låtar som bäst representerar', 'Här är de 75 låtar som bäst representerar')
    .replace('Vår topp 50-lista visar', 'Vår topp 75-lista visar');

  const newTitle = 'Topp 75 AI-låtar & AI-artister på Spotify 2026';
  const newSeo = 'Topp 75 AI-låtar & AI-artister på Spotify 2026 — Juni 2026';

  const { error: uErr } = await db.from('articles').update({
    title: newTitle,
    seo_title: newSeo,
    content_mdx: html,
    updated_at: new Date().toISOString(),
  }).eq('id', data.id);
  if (uErr) { console.error('update failed:', uErr.message); process.exit(1); }

  const embeds = (html.match(/open\.spotify\.com\/embed\//g) ?? []).length;
  const songs = (html.match(/<h3>#\d+ —/g) ?? []).length;
  console.log(`Updated article id ${data.id}: ${songs} songs, ${embeds} embeds, ${html.length} chars.`);
  console.log(`  seo_title: ${newSeo}`);
}

async function main() {
  await backfillDates();
  await updateArticle();
  console.log('\nKlart.');
}

main().catch((e) => { console.error(e); process.exit(1); });
