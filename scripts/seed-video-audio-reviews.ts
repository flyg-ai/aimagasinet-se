/**
 * Promote the ai-video + ai-ljud-och-musik VIRTUAL_HUB_CHILDREN to real DB
 * review pages. Mirrors scripts/seed-category-hubs.ts but for single tools.
 *
 *   npx tsx scripts/seed-video-audio-reviews.ts
 *   FORCE=1 npx tsx scripts/seed-video-audio-reviews.ts   # regenerate content
 *
 * For each tool:
 *  - Claude Haiku generates the structured facts (company/model/founded/hq/
 *    useCases/ratingCriteria) and a ~600-word Swedish HTML review body.
 *  - The curated topplista data (score/tags/pros/cons/offer/label/fallbackUrl)
 *    is hand-specified here so the hub ranking and review page stay in sync.
 *
 * Writes:
 *  - lib/video-audio-tools.ts   (VIDEO_AUDIO_REVIEW_KNOWN — merged into
 *    REVIEW_KNOWN by ReviewTemplate). Udio is skipped (it already has a
 *    hand-written REVIEW_KNOWN profile).
 *  - Supabase: 14 review articles. Video → /ai-video/<slug> (parent_slug
 *    ai-video); ljud → /ai-verktyg/ai-ljud-och-musik/<slug> (parent_slug
 *    ai-ljud-och-musik). Upserts on path.
 *
 * fallbackUrl is rendered with rel="nofollow noopener" by the review/hub
 * templates (editorial reference, not affiliate).
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
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

const MODEL = 'claude-haiku-4-5-20251001';
const YEAR = 2026;
const FORCE = !!process.env.FORCE;

type Group = 'video' | 'ljud';
type Offer = { title: string; price: string; bestFor: string };
type Tool = {
  slug: string;
  brand: string;
  group: Group;
  logo: string;
  ctaName: string;
  score: number;
  fallbackUrl: string;
  tags: string[];
  pros: string[];
  cons: string[];
  offer: Offer;
  label: string;
  excerpt: string;
  criteriaHint: string; // 6 suggested rating dimensions
  /** Skip writing a REVIEW_KNOWN profile (already hand-written). */
  skipProfile?: boolean;
};

const VIDEO_CRITERIA = 'Visuell kvalitet, Promptföljsamhet, Konsistens & rörelse, Generationstid, Pris / generering, Stilkontroll';
const MUSIC_CRITERIA = 'Ljudkvalitet, Stilbredd, Lyrik-AI, Hastighet, Pris / spår, Användarvänlighet';

const TOOLS: Tool[] = [
  /* ── AI-video → /ai-video/<slug> ───────────────────────────── */
  {
    slug: 'heygen', brand: 'HeyGen', group: 'video',
    logo: 'bg-purple-600', ctaName: 'HeyGen', score: 8.7, fallbackUrl: 'https://www.heygen.com',
    tags: ['Avatarer', 'Företag', '40+ språk', 'Talking heads'],
    pros: ['Realistiska avatarer', 'Bred språkstöd', 'Stark för säljvideo'],
    cons: ['Smalt användningsområde', 'Pris hoppar snabbt'],
    offer: { title: 'Gratis 3 min/månad', price: 'Gratis · Creator 29 USD/mån', bestFor: 'AI-avatarer för företag' },
    label: 'Bäst för avatarer',
    excerpt: 'Företagsledande AI-avatarer för utbildningar, säljvideor och kundkommunikation.',
    criteriaHint: 'Avatarrealism, Läppsynk, Språkstöd, Röstkvalitet, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'synthesia', brand: 'Synthesia', group: 'video',
    logo: 'bg-blue-600', ctaName: 'Synthesia', score: 8.5, fallbackUrl: 'https://www.synthesia.io',
    tags: ['230+ avatarer', '140 språk', 'L&D', 'Enterprise'],
    pros: ['Branschstandard för utbildning', 'Säker för enterprise', 'Massiv språkbredd'],
    cons: ['Dyrt för småteam', 'Mindre rörlig än konkurrenter'],
    offer: { title: '36 min gratis', price: 'Gratis · Starter 22 USD/mån', bestFor: 'AI-avatarer för utbildning' },
    label: 'Bäst för L&D',
    excerpt: 'AI-avatarer på 140+ språk — branschstandard för intern utbildning och L&D.',
    criteriaHint: 'Avatarrealism, Språkstöd, Mallar & mallbibliotek, Enterprise-säkerhet, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'invideo', brand: 'InVideo', group: 'video',
    logo: 'bg-orange-600', ctaName: 'InVideo', score: 8.0, fallbackUrl: 'https://invideo.io',
    tags: ['Sociala medier', 'TikTok/Reels', 'Mallar', 'AI-röster'],
    pros: ['Snabbt social media-flöde', '5000+ mallar', 'Inbyggda röster'],
    cons: ['Lägre kvalitet per generering', 'Vattenstämpel i gratis'],
    offer: { title: '4h video/månad gratis', price: 'Gratis · Plus 20 USD/mån', bestFor: 'Social media-video i volym' },
    label: 'Bäst för social media',
    excerpt: 'Social media-video direkt från text-prompt — färdiga mallar för TikTok, Reels, Shorts.',
    criteriaHint: 'Visuell kvalitet, Mallbibliotek, AI-röster, Generationstid, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'luma-dream-machine', brand: 'Luma Dream Machine', group: 'video',
    logo: 'bg-cyan-600', ctaName: 'Luma', score: 8.4, fallbackUrl: 'https://lumalabs.ai',
    tags: ['Dream Machine', 'Realism', 'Image-to-video', 'Genesis'],
    pros: ['Naturlig fysik och rörelse', 'Stark image-to-video', 'Bra pris'],
    cons: ['Kortare clips', 'Mindre stilkontroll'],
    offer: { title: '30 generationer gratis', price: 'Gratis · Standard 30 USD/mån', bestFor: 'Realistisk text-till-video' },
    label: 'Bäst för naturlig rörelse',
    excerpt: 'Realistisk text-till-video med imponerande fysik och naturlig kamerarörelse.',
    criteriaHint: VIDEO_CRITERIA,
  },
  {
    slug: 'adobe-firefly-video', brand: 'Adobe Firefly Video', group: 'video',
    logo: 'bg-rose-600', ctaName: 'Firefly Video', score: 7.8, fallbackUrl: 'https://firefly.adobe.com',
    tags: ['Adobe', 'Premiere Pro', 'Generative Extend', 'Kommersiellt säker'],
    pros: ['Inbyggt i Premiere Pro', 'Tränad på licensierat material', 'Bäst för pro-workflows'],
    cons: ['Kräver Creative Cloud', 'Mindre kraftfull stand-alone'],
    offer: { title: 'Ingår i Creative Cloud', price: 'CC 60 USD/mån', bestFor: 'Adobe-användare och pro-team' },
    label: 'Bäst för Creative Cloud',
    excerpt: 'Adobes AI-video integrerad i Premiere Pro och Creative Cloud — kommersiellt säker.',
    criteriaHint: 'Visuell kvalitet, Adobe-integration, Kommersiell trygghet, Generationstid, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'kaiber', brand: 'Kaiber', group: 'video',
    logo: 'bg-amber-600', ctaName: 'Kaiber', score: 7.5, fallbackUrl: 'https://kaiber.ai',
    tags: ['Musikvideo', 'Beat sync', 'Animation', 'Artister'],
    pros: ['Synkar till musik', 'Konstnärlig estetik', 'Spotify-integration'],
    cons: ['Smalt användningsområde', 'Mindre realistisk'],
    offer: { title: '7 dagar Pro gratis', price: 'Gratis · Pro 15 USD/mån', bestFor: 'Musiker och artister' },
    label: 'Bäst för musikvideor',
    excerpt: 'Musikvideor och artistinnehåll — synkad rörelse till takten, optimerat för konstnärer.',
    criteriaHint: 'Konstnärlig estetik, Beat sync, Animationskvalitet, Generationstid, Pris / prestanda, Användarvänlighet',
  },

  /* ── AI-ljud & musik → /ai-verktyg/ai-ljud-och-musik/<slug> ── */
  {
    slug: 'udio', brand: 'Udio', group: 'ljud', skipProfile: true,
    logo: 'bg-rose-600', ctaName: 'Udio', score: 9.0, fallbackUrl: 'https://www.udio.com',
    tags: ['Musikalisk nyans', 'Lyrik-AI', 'Stems', 'Remix'],
    pros: ['Mer musikalisk realism än Suno', 'Stark på instrumental', 'Bra svensk text-stöd'],
    cons: ['Långsammare', 'Färre exportformat'],
    offer: { title: '10 spår gratis/dag', price: 'Gratis · Standard 10 USD/mån', bestFor: 'Musikproduktion med AI' },
    label: 'Bäst för musikalisk nyans',
    excerpt: 'Suno-konkurrent med fokus på musikalisk nyans och realistisk produktionskvalitet.',
    criteriaHint: MUSIC_CRITERIA,
  },
  {
    slug: 'mubert', brand: 'Mubert', group: 'ljud',
    logo: 'bg-teal-600', ctaName: 'Mubert', score: 8.2, fallbackUrl: 'https://mubert.com',
    tags: ['Streaming', 'Royaltyfri', 'Realtid', 'API'],
    pros: ['Oändlig bakgrundsmusik', 'Royaltyfri för creators', 'API för utvecklare'],
    cons: ['Mindre konstnärlig kontroll', 'Smal nyttighet'],
    offer: { title: 'Gratis för personligt bruk', price: 'Gratis · Creator 14 USD/mån', bestFor: 'Streamers och content-creators' },
    label: 'Bäst för bakgrundsmusik',
    excerpt: 'Royaltyfri AI-musik streamad i realtid — perfekt för streamers, podcasts och bakgrundsmusik.',
    criteriaHint: 'Ljudkvalitet, Stilbredd, Royaltyfrihet, API & integrationer, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'aiva', brand: 'AIVA', group: 'ljud',
    logo: 'bg-indigo-600', ctaName: 'AIVA', score: 8.5, fallbackUrl: 'https://www.aiva.ai',
    tags: ['Filmmusik', 'MIDI-export', 'Klassiskt', 'Spel'],
    pros: ['Exporterar noter och MIDI', 'Klassisk musikteori', 'Bra för film & spel'],
    cons: ['Lägre kvalitet på populärmusik', 'Mindre intuitivt UI'],
    offer: { title: 'Gratisplan tillgänglig', price: 'Gratis · Standard 15 EUR/mån', bestFor: 'Film-, spel- och klassisk musik' },
    label: 'Bäst för kompositörer',
    excerpt: 'AI-kompositör för filmmusik, spel och klassiska arrangemang — exporterar noter och MIDI.',
    criteriaHint: 'Ljudkvalitet, Komposition & arrangemang, MIDI/notexport, Stilbredd, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'soundraw', brand: 'Soundraw', group: 'ljud',
    logo: 'bg-emerald-600', ctaName: 'Soundraw', score: 8.0, fallbackUrl: 'https://soundraw.io',
    tags: ['Royaltyfri', 'Anpassningsbar', 'Stems', 'Mood-baserad'],
    pros: ['Granulär anpassning per spår', 'Stems-export', 'Royaltyfri kommersiellt'],
    cons: ['Begränsad stilbredd', 'Vattenstämpel i gratis'],
    offer: { title: 'Gratis preview', price: 'Creator 17 USD/mån', bestFor: 'YouTube-creators och reklam' },
    label: 'Bäst för YouTubers',
    excerpt: 'Royaltyfri AI-musik för creators — anpassa längd, energi och instrument per spår.',
    criteriaHint: 'Ljudkvalitet, Anpassningsbarhet, Stems-export, Royaltyfrihet, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'boomy', brand: 'Boomy', group: 'ljud',
    logo: 'bg-fuchsia-600', ctaName: 'Boomy', score: 7.4, fallbackUrl: 'https://boomy.com',
    tags: ['1-klick', 'Spotify-release', 'Royaltyandel', 'Enkelt'],
    pros: ['Snabbast att komma igång', 'Publicera till streaming-tjänster', 'Tjäna royalty'],
    cons: ['Begränsad kontroll', 'Lägre produktionskvalitet'],
    offer: { title: '25 låtar gratis', price: 'Gratis · Creator 10 USD/mån', bestFor: 'Snabb publicering till streaming' },
    label: 'Bäst för nybörjare',
    excerpt: 'Skapa låtar på sekunder och publicera direkt till Spotify, Apple Music och TikTok.',
    criteriaHint: 'Ljudkvalitet, Enkelhet, Streaming-publicering, Hastighet, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'splice', brand: 'Splice', group: 'ljud',
    logo: 'bg-orange-600', ctaName: 'Splice', score: 8.3, fallbackUrl: 'https://splice.com',
    tags: ['Samples', 'AI-sökning', 'Stems-separation', 'Producenter'],
    pros: ['Miljontals samples', 'AI hittar matchande loops', 'Producent-favorit'],
    cons: ['Kräver DAW-kunskap', 'Inte gen-AI för hela låtar'],
    offer: { title: 'Sample-bibliotek från 8 USD/mån', price: 'Creator 8 USD/mån', bestFor: 'Musikproducenter' },
    label: 'Bäst för producenter',
    excerpt: 'AI-sökning bland miljontals samples och AI-stems-separation för producenter.',
    criteriaHint: 'Sample-bibliotek, AI-sökning, Stems-separation, Ljudkvalitet, Pris / prestanda, Användarvänlighet',
  },
  {
    slug: 'lalal-ai', brand: 'Lalal.ai', group: 'ljud',
    logo: 'bg-sky-600', ctaName: 'Lalal.ai', score: 8.7, fallbackUrl: 'https://www.lalal.ai',
    tags: ['Stems-separation', 'Vocal isolation', 'Karaoke', 'API'],
    pros: ['Marknadsledande separation', 'Snabb', 'Stöd för 10+ stems'],
    cons: ['Smalt användningsområde', 'Begränsade minuter i gratis'],
    offer: { title: '10 min gratis/månad', price: 'Gratis · Lite 9 USD/mån', bestFor: 'Karaoke, remix och stems' },
    label: 'Bäst för stems-separation',
    excerpt: 'Branschledande AI för stems-separation — isolera sång, trummor, bas och andra spår.',
    criteriaHint: 'Separationskvalitet, Antal stems, Hastighet, Ljudbevarande, Pris / minut, Användarvänlighet',
  },
  {
    slug: 'adobe-podcast', brand: 'Adobe Podcast', group: 'ljud',
    logo: 'bg-rose-700', ctaName: 'Adobe Podcast', score: 8.6, fallbackUrl: 'https://podcast.adobe.com',
    tags: ['AI Enhance', 'Brusreducering', 'Gratis', 'Webb'],
    pros: ['Studio-kvalitet i webbläsaren', 'Helt gratis', 'Adobe-kvalitet'],
    cons: ['Endast röstförbättring', 'Köbaserat vid hög belastning'],
    offer: { title: 'Helt gratis', price: 'Gratis · ingår i Creative Cloud', bestFor: 'Podcasters och röstinspelning' },
    label: 'Bäst gratis-verktyget',
    excerpt: 'Studio-kvalitet på röstinspelningar via AI-förbättring — gratis i webbläsaren.',
    criteriaHint: 'Röstförbättring, Brusreducering, Ljudkvalitet, Hastighet, Pris, Användarvänlighet',
  },
];

/* ─── helpers ──────────────────────────────────────────────────── */

function pathFor(t: Tool): string {
  return t.group === 'video'
    ? `/ai-video/${t.slug}`
    : `/ai-verktyg/ai-ljud-och-musik/${t.slug}`;
}
function parentFor(t: Tool): string {
  return t.group === 'video' ? 'ai-video' : 'ai-ljud-och-musik';
}
function hubPathFor(t: Tool): string {
  return t.group === 'video' ? '/ai-video/' : '/ai-verktyg/ai-ljud-och-musik/';
}

async function haiku(user: string, maxTokens: number): Promise<string> {
  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: user }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim();
}

function stripFence(s: string): string {
  return s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

type Facts = {
  company: string; model: string; founded: number; hq: string;
  useCases: string[]; scores: number[]; criteria: string[];
};

async function generateFacts(t: Tool): Promise<Facts> {
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skapa strukturerad faktadata för verktyget "${t.brand}" (en AI-tjänst för ${t.group === 'video' ? 'video­generering / avatarer' : 'ljud och musik'}).

Föreslå EXAKT 6 betygskriterier som passar verktyget (utgå från: ${t.criteriaHint}).

Returnera EXAKT detta JSON (inget annat, ingen \`\`\`):
{
  "company": "Företagsnamn bakom ${t.brand}",
  "model": "Produkt/modellnamn eller senaste version",
  "founded": 2021,
  "hq": "Stad, Land",
  "useCases": ["fall1","fall2","fall3","fall4","fall5"],
  "criteria": ["k1","k2","k3","k4","k5","k6"],
  "scores": [8.8,9.0,8.5,8.7,8.9,9.1]
}

Krav: helhetsbetyget för verktyget är ${t.score.toFixed(1)}/10 — låt de 6 delbetygen i "scores" (7.0–9.8) variera realistiskt runt det. "scores" har 6 tal i samma ordning som "criteria". Använd korrekta fakta om företaget bakom ${t.brand}. Naturlig svenska, inga floskler, inga emojis.`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = stripFence(await haiku(prompt, 1200));
    try {
      const p = JSON.parse(raw) as Facts;
      if (!p.company || !Array.isArray(p.criteria) || p.criteria.length < 6 || !Array.isArray(p.scores) || p.scores.length < 6) {
        throw new Error('shape');
      }
      return p;
    } catch (e) {
      if (attempt === 1) throw new Error(`facts JSON failed for ${t.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }
  throw new Error('unreachable');
}

async function generateBody(t: Tool): Promise<string> {
  const prompt = `Du är senior redaktör på AI-Magasinet. Skriv en verktygsrecension på cirka 600 ord (svenska) om AI-verktyget "${t.brand}".

Kontext om ${t.brand}: ${t.excerpt}
Styrkor: ${t.pros.join('; ')}.
Svagheter: ${t.cons.join('; ')}.
Prismodell: ${t.offer.price}. Passar bäst för: ${t.offer.bestFor}.

Krav:
- Returnera ENBART ren HTML: <h2>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`-block, ingen H1.
- Börja med raden: <p><strong>Betyg: ${t.score.toFixed(1)}/10</strong></p>
- Naturlig svenska. Inga floskler ("revolutionerande", "i en värld där"), inga emojis, inga påhittade exakta siffror utöver det du fått.
- Väv in nyckelord naturligt (${t.brand}, "AI-verktyg", "${YEAR}").
- Inkludera en intern länk till hubben: <a href="${hubPathFor(t)}">${t.group === 'video' ? 'fler AI-videoverktyg' : 'fler AI-ljud- och musikverktyg'}</a>.
- Struktur: kort intro, vad ${t.brand} är och gör, viktigaste funktionerna (gärna en <ul>), styrkor och svagheter, prismodell, och en avslutande bedömning av vem verktyget passar för. Avsluta INTE med en FAQ.`;
  const body = stripFence(await haiku(prompt, 2500));
  // Guarantee the rating marker is present for parseRating + hero score.
  return /Betyg:\s*\d/.test(body)
    ? body
    : `<p><strong>Betyg: ${t.score.toFixed(1)}/10</strong></p>\n${body}`;
}

/* ─── main ─────────────────────────────────────────────────────── */

async function main() {
  // Skip tools whose review article already exists unless FORCE.
  const existing = new Set<string>();
  {
    const { data } = await db
      .from('articles')
      .select('path')
      .or('path.like./ai-video/%,path.like./ai-verktyg/ai-ljud-och-musik/%')
      .eq('type', 'page');
    (data ?? []).forEach((r: { path: string }) => existing.add(r.path));
  }

  const profiles: Record<string, Record<string, unknown>> = {};
  const rows: Record<string, unknown>[] = [];

  for (const t of TOOLS) {
    const path = pathFor(t);
    const alreadyThere = existing.has(path);
    if (alreadyThere && !FORCE) {
      console.log(`• ${t.slug} — finns redan, hoppar över (FORCE=1 för att regenerera)`);
      continue;
    }
    console.log(`\n=== ${t.slug} (${t.group}) ===`);

    const facts = await generateFacts(t);
    console.log(`  facts ok — ${facts.company}, ${facts.hq} (criteria: ${facts.criteria.join(', ')})`);
    const body = await generateBody(t);
    console.log(`  body ok (${body.length} tecken)`);

    if (!t.skipProfile) {
      profiles[t.slug] = {
        logo: t.logo,
        ctaName: t.ctaName,
        score: t.score,
        fallbackUrl: t.fallbackUrl,
        company: facts.company,
        model: facts.model,
        founded: facts.founded,
        hq: facts.hq,
        useCases: facts.useCases.slice(0, 5),
        ratingCriteria: facts.criteria.slice(0, 6).map((label, i) => ({
          label,
          score: Number((facts.scores[i] ?? t.score).toFixed(1)),
        })),
        tags: t.tags.slice(0, 4),
        pros: t.pros.slice(0, 3),
        cons: t.cons.slice(0, 2),
        offer: t.offer,
        label: t.label,
      };
    }

    rows.push({
      slug: t.slug,
      title: `${t.brand} – Recension & test ${YEAR}`,
      excerpt: t.excerpt,
      content_mdx: body,
      category: null,
      tags: [] as string[],
      featured_image: null,
      type: 'page',
      path,
      parent_slug: parentFor(t),
      affiliate_url: null,
      published_at: new Date().toISOString(),
      seo_title: null,
      seo_description: t.excerpt,
    });
  }

  // Write the REVIEW_KNOWN data module (merge of any newly generated profiles
  // with whatever is already in the file, so re-runs don't drop tools).
  if (Object.keys(profiles).length > 0) {
    const file = resolve('lib/video-audio-tools.ts');
    let merged = profiles;
    try {
      const prev = (await import(pathToFileURL(file).href)).VIDEO_AUDIO_REVIEW_KNOWN as Record<string, Record<string, unknown>>;
      merged = { ...prev, ...profiles };
    } catch { /* first run — file doesn't exist yet */ }
    const contents =
      `/** AI-video + AI-ljud/musik review profiles — generated by\n` +
      ` *  scripts/seed-video-audio-reviews.ts via ${MODEL}. Merged into\n` +
      ` *  REVIEW_KNOWN in components/templates/ReviewTemplate.tsx. Udio is\n` +
      ` *  intentionally absent (it has a hand-written profile). Re-run the\n` +
      ` *  script to refresh. */\n` +
      `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
      `export const VIDEO_AUDIO_REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(merged, null, 2)};\n`;
    writeFileSync(file, contents, 'utf8');
    console.log(`\nWrote lib/video-audio-tools.ts (${Object.keys(merged).length} profiler)`);
  }

  if (rows.length === 0) {
    console.log('\nInga nya artiklar att skriva.');
    return;
  }
  const { error } = await db.from('articles').upsert(rows, { onConflict: 'path' });
  if (error) { console.error('\nupsert failed:', error.message); process.exit(1); }
  console.log(`Upserted ${rows.length} recensioner.`);
  rows.forEach((r) => console.log(`  ${r.path as string}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
