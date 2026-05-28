/**
 * Seed the 2 new yrkesroller (designer + fotograf-video) plus their 8
 * subcategory hubs. Then generate fresh guide-text for each via
 * Claude Sonnet 4.6.
 *
 *   npx tsx scripts/seed-designer-fotograf.ts
 *
 * After this runs, also run:
 *   npx tsx scripts/seed-yrke-reviews.ts
 * to populate the 20 verktyg review pages from the YrkeTool specs
 * in lib/yrke-tools-designer-fotograf.ts.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `Du är senior redaktör på AI-Magasinet. Skriv polerade hubsidor om AI för specifika yrken (eller delar av yrken).

# Tonalitet
Expert, rak, praktisk svenska. Inga floskler. Inga emojis. Konkreta verktygsnamn, ungefärliga priser och use cases.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3>, <p>, <ul>/<li>, <a href>, <strong>.`;

type PageSpec = {
  slug: string;
  title: string;
  excerpt: string;
  parentSlug: string;
  path: string;
  brief: string;
  /** ~ token budget for max_tokens, also reflected in the brief. */
  wordTarget: number;
};

/* ── Yrkesroll pages (depth 4) ──────────────────────────────── */

const YRKESROLLER: PageSpec[] = [
  {
    slug: 'designer',
    title: 'AI för Designers — Verktyg, workflow och toplistor 2026',
    excerpt: 'Hela landskapet av AI-verktyg för designers 2026 — från Adobe Firefly och Figma AI till Midjourney, sorterat efter vad du faktiskt vill göra.',
    parentSlug: 'yrke',
    path: '/ai-verktyg/foretag/yrke/designer',
    wordTarget: 1200,
    brief: `Skriv en yrkesroll-landningssida (~1200 ord) för "AI för Designers".

Sidan är hubben över 4 subkategorier (grafisk design, UI/UX, bildgenerering, videoredigering) som var och en har sin egen topplista. Syftet är att hjälpa designers förstå var AI faktiskt sparar tid 2026 och vart de ska klicka för rätt verktygskategori.

Struktur:
- Intro (1-2 stycken) — vad som faktiskt förändrats för designers 2024-2026
- <h2>Vad AI faktiskt gör för designers 2026</h2> — konkret om kreativ assistans vs ersättning
- <h2>Fyra områden där AI levererar</h2> — kort presentation av varje subcategory + länk
- <h2>Vår designer-AI-stack 2026</h2> — vilka verktyg vi skulle välja som ny designer idag
- <h2>Frågor designers ställer oftast</h2> — typ "ersätter AI mig?", "kommersiell licens?", "Photoshop vs Figma vs Midjourney?"
- Avsluta med <h2>Så kommer du igång</h2>

Länka naturligt till:
- /ai-verktyg/foretag/yrke/designer/grafisk-design — Grafisk design
- /ai-verktyg/foretag/yrke/designer/ui-ux — UI/UX
- /ai-verktyg/foretag/yrke/designer/bildgenerering — Bildgenerering
- /ai-verktyg/foretag/yrke/designer/videoredigering — Videoredigering
- /ai-verktyg/ai-bild-verktyg — alla AI-bildverktyg
- /ai-verktyg/foretag/yrke — alla yrkesroller`,
  },
  {
    slug: 'fotograf-video',
    title: 'AI för Fotografer & Videoskapare — Verktyg och workflow 2026',
    excerpt: 'AI-verktyg som faktiskt funkar för fotografer och creators 2026 — Luminar, Topaz, Runway, CapCut och Descript, sorterade efter användning.',
    parentSlug: 'yrke',
    path: '/ai-verktyg/foretag/yrke/fotograf-video',
    wordTarget: 1200,
    brief: `Skriv en yrkesroll-landningssida (~1200 ord) för "AI för Fotografer & Videoskapare".

Sidan är hubben över 4 subkategorier (bildredigering, videoklippning, bildgenerering, ljudsättning) som var och en har sin egen topplista.

Struktur:
- Intro (1-2 stycken) — vad som förändrats för creators 2024-2026
- <h2>Vad AI faktiskt gör för fotografer 2026</h2> — retusch, upscaling, sky replacement
- <h2>Vad AI faktiskt gör för videoskapare 2026</h2> — klippning, captions, ljud
- <h2>Fyra områden där AI levererar</h2> — kort presentation av varje subcategory + länk
- <h2>Vår foto-video-stack 2026</h2> — rekommenderad stack
- <h2>Vanliga frågor</h2> — typ "AI vs Lightroom?", "kommersiell licens på AI-foton?", "creator-program-monetisering"
- Avsluta med <h2>Så kommer du igång</h2>

Länka naturligt till:
- /ai-verktyg/foretag/yrke/fotograf-video/bildredigering
- /ai-verktyg/foretag/yrke/fotograf-video/videoklippning
- /ai-verktyg/foretag/yrke/fotograf-video/bildgenerering
- /ai-verktyg/foretag/yrke/fotograf-video/ljudsattning
- /ai-verktyg/ai-bild-verktyg
- /ai-video
- /skapa-faceless-content-med-ai`,
  },
];

/* ── Subcategory hubs (depth 5) ─────────────────────────────── */

const SUBHUBS: PageSpec[] = [
  // Designer
  {
    slug: 'grafisk-design', parentSlug: 'designer',
    title: 'AI för Grafisk Design — Topplista 2026',
    excerpt: 'Canva AI, Adobe Firefly och Looka — de bästa AI-verktygen för grafisk design 2026.',
    path: '/ai-verktyg/foretag/yrke/designer/grafisk-design',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI för Grafisk Design". Topplistan består av Canva AI, Adobe Firefly och Looka — tre verktyg som täcker olika delar av designprocessen. Diskutera när vart och ett passar, kommersiell licens, prismodeller och svensk användning. Länka till de tre verktygens recensioner under /ai-verktyg/foretag/yrke/designer/grafisk-design/, samt till huvudsidan /ai-verktyg/foretag/yrke/designer.`,
  },
  {
    slug: 'ui-ux', parentSlug: 'designer',
    title: 'AI för UI/UX-design — Topplista 2026',
    excerpt: 'Figma AI, Galileo AI, Uizard och Framer AI — AI-verktygen som accelererar UI/UX-processen.',
    path: '/ai-verktyg/foretag/yrke/designer/ui-ux',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI för UI/UX-design". Topplistan har Figma AI, Galileo AI, Uizard och Framer AI. Diskutera hur AI förändrar UI-flödet: från första wireframe, via iterationer, till handoff. Olika verktyg passar olika fas. Länka till verktygsrecensionerna under /ai-verktyg/foretag/yrke/designer/ui-ux/.`,
  },
  {
    slug: 'bildgenerering-designer', // Internal label, URL is /designer/bildgenerering
    parentSlug: 'designer',
    title: 'AI för Bildgenerering (Designer) — Topplista 2026',
    excerpt: 'Midjourney och Khroma — AI-bildgenerering för designers som behöver moodboards, koncept och färgpaletter.',
    path: '/ai-verktyg/foretag/yrke/designer/bildgenerering',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI-bildgenerering för designers". Topplistan har Midjourney och Khroma. Fokusera på designer-vinkel: moodboards, koncept-art, hero-bilder, färgpalett-utforskning. Skiljer sig från ren bildgenerering för marknadsförare/foto. Länka till verktygsrecensionerna under /ai-verktyg/foretag/yrke/designer/bildgenerering/ + /ai-verktyg/ai-bild-verktyg.`,
  },
  {
    slug: 'videoredigering', parentSlug: 'designer',
    title: 'AI för Videoredigering (Designer) — Topplista 2026',
    excerpt: 'Runway och AI-driven videoredigering för designers som behöver kort rörelse i sina projekt.',
    path: '/ai-verktyg/foretag/yrke/designer/videoredigering',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI-videoredigering för designers". Topplistan har just nu Runway, plus en kort jämförelse mot andra AI-video-verktyg (Kling, Pika). Fokus på designer-användning: hero-video, animerade illustrationer, brand-rörelse. Länka till /ai-verktyg/foretag/yrke/designer/videoredigering/runway-design samt /ai-video för bredare topplistan.`,
  },
  // Fotograf-video
  {
    slug: 'bildredigering', parentSlug: 'fotograf-video',
    title: 'AI för Bildredigering — Topplista 2026',
    excerpt: 'Luminar Neo AI, Topaz Photo AI och Remove.bg — de bästa AI-verktygen för fotoredigering 2026.',
    path: '/ai-verktyg/foretag/yrke/fotograf-video/bildredigering',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI för bildredigering". Topplistan har Luminar Neo AI, Topaz Photo AI och Remove.bg. Diskutera retusch, upscale, bakgrundsbyte och hur AI-verktyg kompletterar (inte ersätter) Lightroom/Photoshop. Engångsköp vs subscription. Länka till verktygsrecensionerna under /ai-verktyg/foretag/yrke/fotograf-video/bildredigering/.`,
  },
  {
    slug: 'videoklippning', parentSlug: 'fotograf-video',
    title: 'AI för Videoklippning — Topplista 2026',
    excerpt: 'CapCut AI och Canva Video — AI-driven videoklippning för shorts, Reels och marknadsföring.',
    path: '/ai-verktyg/foretag/yrke/fotograf-video/videoklippning',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI för videoklippning". Topplistan har CapCut AI och Canva Video. Fokus på AI-funktioner: auto-captions, scen-redigering, Magic Cut för långa intervjuer. CapCut för creators, Canva för marknadsföringsteam. Länka till verktygsrecensionerna under /ai-verktyg/foretag/yrke/fotograf-video/videoklippning/.`,
  },
  {
    slug: 'bildgenerering-foto', // Internal, URL is /fotograf-video/bildgenerering
    parentSlug: 'fotograf-video',
    title: 'AI för Foto- och Videogenerering — Topplista 2026',
    excerpt: 'Adobe Firefly, Runway Gen-3 och Pika Labs — AI som genererar och animerar fotografier och videor.',
    path: '/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI-bildgenerering för fotografer". Topplistan har Adobe Firefly, Runway Gen-3 och Pika Labs. Fokus på fotograf-vinkel: foto-utvidgning, cinemagraphs, foto-till-video, kommersiell licens. Skiljer sig från designer-bildgenerering (moodboards). Länka till verktygsrecensionerna.`,
  },
  {
    slug: 'ljudsattning', parentSlug: 'fotograf-video',
    title: 'AI för Ljudsättning — Topplista 2026',
    excerpt: 'Descript och Krisp — AI för ljudredigering, brusreducering och voice-over till videor och podcasts.',
    path: '/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning',
    wordTarget: 1000,
    brief: `Skriv hub-guide (~1000 ord) för "AI för ljudsättning". Topplistan har Descript och Krisp. Diskutera podcast-redigering, brusreducering, voice cloning (med säkerhetsperspektiv), AI-transcription och hur de sammankopplas med video-workflow. Länka till verktygsrecensionerna under /ai-verktyg/foretag/yrke/fotograf-video/ljudsattning/.`,
  },
];

async function generateContent(p: PageSpec): Promise<string> {
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: `Sida: ${p.path}\nTitel: ${p.title}\n\n${p.brief}\n\nSkriv guiden nu. Ren HTML, börja med första <p>-taggen.`,
    }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

async function upsert(p: PageSpec, contentMdx: string) {
  const row = {
    slug: p.slug.replace(/-(designer|foto)$/, ''),  // Strip internal disambiguation suffixes
    title: p.title,
    excerpt: p.excerpt,
    content_mdx: contentMdx,
    category: null,
    tags: [] as string[],
    featured_image: null,
    type: 'page' as const,
    path: p.path,
    parent_slug: p.parentSlug,
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: null,
    seo_description: null,
  };
  const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
  if (error) throw new Error(`upsert ${p.path}: ${error.message}`);
}

async function main() {
  const all = [...YRKESROLLER, ...SUBHUBS];
  console.log(`Generating ${all.length} pages (2 yrkesroller + 8 sub-hubs) via ${MODEL}…\n`);

  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    const t0 = Date.now();
    try {
      const html = await generateContent(p);
      await upsert(p, html);
      const ms = Date.now() - t0;
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      console.log(`  [${i + 1}/${all.length}] ${p.path.padEnd(56)} ${words}w  ${(ms / 1000).toFixed(1)}s`);
    } catch (e) {
      console.error(`  [${i + 1}/${all.length}] ${p.path} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log('\nDone. Next: npx tsx scripts/seed-yrke-reviews.ts');
}

main().catch((e) => { console.error(e); process.exit(1); });
