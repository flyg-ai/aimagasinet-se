/**
 * Seed ny kategori-hub: AI för lärare (/ai-verktyg/larare).
 *
 * Format-test, motpol till designer-testet (flat artikel). Lärare är en
 * egen yrkesroll, skild från /ai-verktyg/utbildning (student/plugg-fokus,
 * se kannibalisering.md). Samma mönster som HR: riktiga, WebFetch-
 * verifierade verktyg (MagicSchool AI, Brisk Teaching, Curipod) i
 * lib/yrke-tools-larare.ts, plus cross-ref till den befintliga Khanmigo-
 * recensionen (VIRTUAL_HUB_CHILDREN['larare'] i HubTemplate.tsx) i stället
 * för en duplicerad recension.
 *
 *   npx tsx scripts/seed-larare-hub.ts
 *
 * Skriver 1 hub + 3 recensioner, published_at=null (väntar på granskning +
 * featured_image innan publicering).
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { LARARE_TOOLS } from '../lib/yrke-tools-larare';
import { toContentMdx } from '../lib/yrke-tools';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const YEAR = 2026;

const hubGuide = `
<h2>AI-verktyg byggda för lärare — inte bara för plugg</h2>
<p>Sök du på "AI för lärare" hittar du oftast listor över samma allmänna chattbottar som eleverna redan använder. Den här sidan handlar om något annat: AI-verktyg som är byggda för undervisningens egna uppgifter — lektionsplanering, differentiering, rättning och skrivfeedback — snarare än för att svara på frågor eller plugga inför ett prov.</p>
<p>Det är en viktig skillnad mot vår <a href="/ai-verktyg/utbildning/">utbildningshubb</a>, som samlar verktyg för elever och studenter. Här samlar vi istället verktyg som sparar tid i lärarens eget arbete: planering, bedömning och material.</p>

<h2>Vad skiljer ett "lärarverktyg" från en vanlig AI-chatt?</h2>
<p>ChatGPT, Claude och Gemini kan absolut hjälpa till med lektionsplanering om du skriver rätt prompt. Skillnaden med verktyg som MagicSchool AI, Brisk Teaching och Curipod är att de redan har strukturen på plats: färdiga mallar för rubriker, differentierat material per läsnivå, koppling till läroplan och — i flera fall — direkt integration i Google Docs, Slides eller skolans LMS. Du slipar bort prompt-arbetet och får ett resultat anpassat för klassrummet direkt.</p>

<h2>Gratis kontra betalt — vad får du egentligen?</h2>
<p>Samtliga verktyg nedan har en fungerande gratisnivå för enskilda lärare, men med tydliga begränsningar: antal genereringar, teckenlängd på elevsvar eller vilka verktyg som ingår. Skol- och distriktsnivåer är i de flesta fall offertbaserade snarare än listpris — räkna med att behöva boka ett samtal om ni vill ha inköp på hela skolan eller district-wide SSO och datasäkerhetsavtal.</p>

<h2>Så väljer du rätt verktyg</h2>
<ul>
  <li><strong>Brett verktygsbibliotek:</strong> MagicSchool AI täcker flest användningsfall (80+ verktyg) på en gratisnivå.</li>
  <li><strong>Redan i Google Docs/Slides eller LMS:</strong> Brisk Teaching jobbar som webbläsartillägg direkt i verktyg ni redan använder.</li>
  <li><strong>Gemensamma klassrumslektioner med skrivfeedback:</strong> Curipod är byggt för helklassundervisning kopplat till befintlig läroplan.</li>
  <li><strong>Sokratisk AI-handledning till eleverna, plus lärarstöd:</strong> Khanmigo (Khan Academy) är helt gratis och täcker både elev- och lärarsidan.</li>
</ul>

<h2>Integritet och elevdata</h2>
<p>Elevdata är känsligare än vanlig affärsdata, och det är värt att kolla varje leverantörs datapolicy innan ni rullar ut ett verktyg brett — särskilt om elever under 13 år är inblandade. De större aktörerna (MagicSchool AI, Brisk, Curipod, Khan Academy) har samtliga publika sidor om dataskydd och erbjuder särskilda avtal för skolor/distrikt, men detaljerna skiljer sig åt.</p>

<h2>Vanliga misstag</h2>
<p>Det vanligaste misstaget är att välja ett verktyg utifrån hur imponerande en demo ser ut, snarare än hur det passar er vardag. Om ni redan lever i Google Workspace är ett webbläsartillägg som Brisk ofta enklare att få adoption på än ett helt nytt verktyg man måste logga in i separat. Om ni istället vill ha färdiga lektionsmallar för flera ämnen är MagicSchool AI:s breda bibliotek svårt att slå.</p>
`.trim();

const faq = [
  {
    question: 'Är AI-verktyg för lärare gratis?',
    answer: 'Samtliga verktyg i den här listan har en gratisnivå för enskilda lärare, men med begränsningar i antal genereringar eller funktioner. Skol- och distriktsplaner med SSO, datasäkerhetsavtal och adminkontroller är i regel offertbaserade.',
  },
  {
    question: 'Skiljer sig AI för lärare från AI för studenter?',
    answer: 'Ja. Verktyg för lärare fokuserar på planering, bedömning och material (lektionsplaner, rubriker, skrivfeedback till en hel klass), medan verktyg för studenter (se vår utbildningshubb) fokuserar på att hjälpa eleven själv plugga, repetera och förstå ett ämne.',
  },
  {
    question: 'Vilket AI-verktyg passar om vi redan jobbar i Google Docs och Slides?',
    answer: 'Brisk Teaching är byggt som ett webbläsartillägg som lägger AI-funktioner direkt i Docs, Slides, YouTube och de flesta LMS-system, så ni slipper logga in i ett separat verktyg.',
  },
  {
    question: 'Kan AI rätta och ge feedback på elevers uppsatser?',
    answer: 'Ja, flera av verktygen (Brisk Teaching, Curipod, MagicSchool AI) har inbyggd skrivfeedback som kan ge eleven kommentarer direkt efter inlämning, ofta kopplat till en rubrik ni själva ställer in. Granska alltid AI-genererad feedback innan den går till eleven.',
  },
  {
    question: 'Är elevdata säker i dessa verktyg?',
    answer: 'De större leverantörerna erbjuder särskilda dataskyddsavtal för skolor och distrikt, men villkoren skiljer sig åt. Läs leverantörens egen datapolicy och, om möjligt, teckna ett skolspecifikt avtal innan ni rullar ut verktyget brett.',
  },
];

async function main() {
  const hubRow = {
    slug: 'larare',
    title: `Bästa AI-verktygen för lärare ${YEAR}`,
    excerpt: 'AI-verktyg byggda för lärares eget arbete — lektionsplanering, differentiering, rättning och skrivfeedback. MagicSchool AI, Brisk Teaching, Curipod och Khanmigo jämförda.',
    content_mdx: hubGuide,
    category: null, tags: [] as string[], featured_image: null, type: 'page',
    path: '/ai-verktyg/larare', parent_slug: 'ai-verktyg', affiliate_url: null,
    published_at: null,
    seo_title: `AI för lärare ${YEAR} — bästa AI-verktygen för lektionsplanering och bedömning`,
    seo_description: 'Jämför AI-verktyg byggda för lärare: MagicSchool AI, Brisk Teaching, Curipod och Khanmigo. Lektionsplanering, differentiering och skrivfeedback — inte bara plugg-AI.',
    faq,
  };

  const reviewRows = LARARE_TOOLS.map((t) => ({
    slug: t.slug,
    title: t.title,
    excerpt: t.oneliner,
    content_mdx: toContentMdx(t),
    category: null, tags: [] as string[], featured_image: null, type: 'page',
    path: `/ai-verktyg/${t.slug}`, parent_slug: 'larare', affiliate_url: null,
    published_at: null, seo_title: null, seo_description: t.oneliner,
  }));

  // hubRow re-uses the existing 'larare' slug (currently at
  // /ai-verktyg/utbildning/larare, orphaned) — upsert on slug so it's
  // repurposed in place, same pattern as the Galileo→Stitch rename.
  // Skipped on re-run when ONLY_REVIEWS=1 (title-uniqueness trigger blocks
  // a same-title upsert; use that when only review bodies changed).
  if (!process.env.ONLY_REVIEWS) {
    const { error: hubError } = await db.from('articles').upsert([hubRow], { onConflict: 'slug' });
    if (hubError) { console.error('hub upsert failed:', hubError.message); process.exit(1); }
  }
  if (process.env.ONLY_REVIEWS) {
    // Plain UPDATE by slug — the title-uniqueness trigger blocks upsert's
    // INSERT ... ON CONFLICT path even when the row already has that title.
    for (const r of reviewRows) {
      const { slug, ...rest } = r;
      const { error } = await db.from('articles').update(rest).eq('slug', slug);
      if (error) { console.error(`update ${slug} failed:`, error.message); process.exit(1); }
    }
  } else {
    const { error } = await db.from('articles').upsert(reviewRows, { onConflict: 'path' });
    if (error) { console.error('reviews upsert failed:', error.message); process.exit(1); }
  }
  console.log(`Upserted 1 hub (larare) + ${reviewRows.length} recensioner: ${reviewRows.map((r) => r.slug).join(', ')}. published_at=null.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
