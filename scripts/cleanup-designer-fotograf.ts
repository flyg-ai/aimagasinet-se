/**
 * Städar upp designer- och fotograf-video-yrkets recensioner.
 *
 *   DRY=1 npx tsx scripts/cleanup-designer-fotograf.ts   # förhandsvisa
 *   npx tsx scripts/cleanup-designer-fotograf.ts          # kör
 *
 * A) 10 verktyg som har kanonisk recension någon annanstans → DB-raden raderas
 *    (301-redirect till kanoniska sidan ligger i redirects-designer-fotograf.mjs).
 * B) 10 verktyg utan kanonisk → flyttas till rätt kategori-hub (path + parent_slug
 *    uppdateras; sluggen behålls så REVIEW_KNOWN-profilen i lib/yrke-tools-
 *    designer-fotograf.ts fortsätter matcha).
 * C) Ny hub /ai-verktyg/ui-ux skapas för de tre UI/UX-verktygen.
 * D) 8 tomma depth-5 topplista-hubbar raderas (301 → kategori-hub i redirects-filen).
 *
 * Ordning: A → B → C-delete(depth5) → skapa ui-ux-hub. Depth-5-raden
 * designer/ui-ux har slug 'ui-ux' och måste bort innan nya hubben (slug 'ui-ux')
 * skapas.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const DRY = !!process.env.DRY;

// A) radera (har kanonisk recension)
const DELETE_PATHS = [
  '/ai-verktyg/foretag/yrke/designer/bildgenerering/midjourney-design',
  '/ai-verktyg/foretag/yrke/designer/grafisk-design/adobe-firefly-design',
  '/ai-verktyg/foretag/yrke/designer/grafisk-design/canva-ai-design',
  '/ai-verktyg/foretag/yrke/designer/ui-ux/framer-ai-ux',
  '/ai-verktyg/foretag/yrke/designer/videoredigering/runway-design',
  '/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/firefly-fbild',
  '/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/pika-fbild',
  '/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/runway-fbild',
  '/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning/krisp-ljud',
  '/ai-verktyg/foretag/yrke/fotograf-video/videoklippning/canva-video-vklipp',
];

// B) flytta (slug, ny path, ny parent_slug)
const MOVES: { slug: string; oldPath: string; newPath: string; parent: string }[] = [
  { slug: 'khroma-design',      oldPath: '/ai-verktyg/foretag/yrke/designer/bildgenerering/khroma-design',        newPath: '/ai-verktyg/ai-bild-verktyg/khroma-design',     parent: 'ai-bild-verktyg' },
  { slug: 'looka-design',       oldPath: '/ai-verktyg/foretag/yrke/designer/grafisk-design/looka-design',         newPath: '/ai-verktyg/ai-bild-verktyg/looka-design',      parent: 'ai-bild-verktyg' },
  { slug: 'figma-ai-ux',        oldPath: '/ai-verktyg/foretag/yrke/designer/ui-ux/figma-ai-ux',                   newPath: '/ai-verktyg/ui-ux/figma-ai-ux',                 parent: 'ui-ux' },
  { slug: 'galileo-ai-ux',      oldPath: '/ai-verktyg/foretag/yrke/designer/ui-ux/galileo-ai-ux',                 newPath: '/ai-verktyg/ui-ux/galileo-ai-ux',               parent: 'ui-ux' },
  { slug: 'uizard-ux',          oldPath: '/ai-verktyg/foretag/yrke/designer/ui-ux/uizard-ux',                     newPath: '/ai-verktyg/ui-ux/uizard-ux',                   parent: 'ui-ux' },
  { slug: 'luminar-neo-bredig', oldPath: '/ai-verktyg/foretag/yrke/fotograf-video/bildredigering/luminar-neo-bredig', newPath: '/ai-verktyg/ai-bild-verktyg/luminar-neo-bredig', parent: 'ai-bild-verktyg' },
  { slug: 'removebg-bredig',    oldPath: '/ai-verktyg/foretag/yrke/fotograf-video/bildredigering/removebg-bredig', newPath: '/ai-verktyg/ai-bild-verktyg/removebg-bredig',   parent: 'ai-bild-verktyg' },
  { slug: 'topaz-photo-bredig', oldPath: '/ai-verktyg/foretag/yrke/fotograf-video/bildredigering/topaz-photo-bredig', newPath: '/ai-verktyg/ai-bild-verktyg/topaz-photo-bredig', parent: 'ai-bild-verktyg' },
  { slug: 'descript-ljud',      oldPath: '/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning/descript-ljud',    newPath: '/ai-verktyg/ai-ljud-och-musik/descript-ljud',   parent: 'ai-ljud-och-musik' },
  { slug: 'capcut-ai-vklipp',   oldPath: '/ai-verktyg/foretag/yrke/fotograf-video/videoklippning/capcut-ai-vklipp', newPath: '/ai-video/capcut-ai-vklipp',                    parent: 'ai-video' },
];

// D) tomma depth-5 topplista-hubbar att radera
const DELETE_HUB_PATHS = [
  '/ai-verktyg/foretag/yrke/designer/grafisk-design',
  '/ai-verktyg/foretag/yrke/designer/bildgenerering',
  '/ai-verktyg/foretag/yrke/designer/ui-ux',
  '/ai-verktyg/foretag/yrke/designer/videoredigering',
  '/ai-verktyg/foretag/yrke/fotograf-video/bildredigering',
  '/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering',
  '/ai-verktyg/foretag/yrke/fotograf-video/videoklippning',
  '/ai-verktyg/foretag/yrke/fotograf-video/ljudsattning',
];

const UI_UX_HUB = {
  slug: 'ui-ux',
  title: 'Bästa AI-verktygen för UI/UX-design 2026',
  excerpt: 'AI som tar dig från idé till färdig gränssnittsdesign — text-till-UI, sketch-to-design och AI direkt i Figma. Vi rankar de bästa UI/UX-verktygen 2026.',
  path: '/ai-verktyg/ui-ux',
  parent_slug: 'ai-verktyg',
  content_mdx: `
<p>AI har på kort tid blivit en självklar del av UI/UX-designerns verktygslåda. Där wireframes och första utkast tidigare tog timmar går det nu att generera ett komplett gränssnitt från en textbeskrivning på sekunder, digitalisera en pappersskiss med ett foto, eller låta AI föreslå komponenter och auto-layout direkt i Figma. Den här guiden går igenom hur du väljer rätt AI-verktyg för UI/UX-arbete 2026 och vad de faktiskt klarar.</p>

<h2>Vad gör AI-verktyg för UI/UX?</h2>
<p>De flesta verktyg i kategorin löser ett av tre problem: att komma igång snabbare, att slippa repetitivt pixelarbete, eller att överbrygga klyftan mellan idé och färdig design. Text-till-UI-verktyg genererar produktiona skärmar från en prompt, sketch-to-design förvandlar handritade skisser till digitala gränssnitt, och inbäddad AI (som i Figma) hjälper till med copy, komponentförslag och layout medan du jobbar.</p>

<h2>Så väljer du rätt verktyg</h2>
<ul>
  <li><strong>Jobbar du redan i Figma?</strong> Då ger inbyggd AI minst friktion — inget nytt verktyg att lära sig.</li>
  <li><strong>Behöver du snabba mockups för pitch?</strong> Text-till-UI tar dig från idé till klickbar skärm på minuter.</li>
  <li><strong>Börjar du ofta med papper och penna?</strong> Sketch-to-design digitaliserar skisser och sparar tid i ideationsfasen.</li>
  <li><strong>Krav på EU-datahantering?</strong> Kontrollera var verktyget hostar data och om det finns en europeisk leverantör.</li>
</ul>

<h2>Vanliga användningsfall</h2>
<p>De typiska flödena är wireframing och tidiga utkast, generering av onboarding- och pitch-skärmar, omvandling av skisser eller screenshots till redigerbar design, samt komponent- och design-system-arbete. AI ersätter sällan designerns omdöme — men den tar bort det mekaniska och låter dig iterera fler idéer på kortare tid.</p>

<h2>Verktyg vi täcker</h2>
<p>Vi har testat och rankat de ledande verktygen för UI/UX-design, från AI inbäddad i designerns favoritverktyg till specialiserade text-till-UI- och sketch-to-design-lösningar. Vill du ställa flera verktyg mot varandra sida vid sida kan du <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a> direkt.</p>
`.trim(),
};

async function main() {
  // A) radera dubbletter
  console.log('=== A) Radera verktyg med kanonisk recension ===');
  for (const p of DELETE_PATHS) {
    if (DRY) { console.log(`[DRY] DELETE ${p}`); continue; }
    const { data, error } = await db.from('articles').delete().eq('path', p).select('slug');
    if (error) { console.error(`✗ ${p}: ${error.message}`); continue; }
    console.log(`${data?.length ? '✓' : '·'} DELETE ${p} (${data?.length ?? 0})`);
  }

  // B) flytta orphans
  console.log('\n=== B) Flytta verktyg utan kanonisk → kategori-hub ===');
  for (const m of MOVES) {
    if (DRY) { console.log(`[DRY] MOVE ${m.slug}: ${m.oldPath} → ${m.newPath} (parent=${m.parent})`); continue; }
    const { data, error } = await db.from('articles')
      .update({ path: m.newPath, parent_slug: m.parent })
      .eq('slug', m.slug)
      .select('slug');
    if (error) { console.error(`✗ ${m.slug}: ${error.message}`); continue; }
    console.log(`${data?.length ? '✓' : '·'} MOVE ${m.slug} → ${m.newPath} (${data?.length ?? 0})`);
  }

  // D) radera tomma depth-5-hubbar (frigör bl.a. slug 'ui-ux')
  console.log('\n=== D) Radera tomma depth-5 topplista-hubbar ===');
  for (const p of DELETE_HUB_PATHS) {
    if (DRY) { console.log(`[DRY] DELETE HUB ${p}`); continue; }
    const { data, error } = await db.from('articles').delete().eq('path', p).select('slug');
    if (error) { console.error(`✗ ${p}: ${error.message}`); continue; }
    console.log(`${data?.length ? '✓' : '·'} DELETE HUB ${p} (${data?.length ?? 0})`);
  }

  // C) skapa ui-ux-hub
  console.log('\n=== C) Skapa /ai-verktyg/ui-ux-hub ===');
  if (DRY) { console.log(`[DRY] UPSERT hub ${UI_UX_HUB.path}`); }
  else {
    const row = {
      ...UI_UX_HUB,
      category: null, tags: [] as string[], featured_image: null, type: 'page',
      affiliate_url: null, published_at: new Date().toISOString(),
      seo_title: `${UI_UX_HUB.title} — Topplista & guide`, seo_description: UI_UX_HUB.excerpt,
    };
    const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
    if (error) { console.error(`✗ ui-ux hub: ${error.message}`); process.exit(1); }
    console.log(`✓ UPSERT hub ${UI_UX_HUB.path}`);
  }

  console.log('\nKlart.');
}

main().catch((e) => { console.error(e); process.exit(1); });
