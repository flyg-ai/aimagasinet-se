/**
 * 20 YrkeTool entries for the two new yrkesroller "Designer" and
 * "Fotograf & Videoskapare" (depth-4 pages under /ai-verktyg/foretag/
 * yrke/). Each tool is explicitly mapped to its natural subcategory —
 * no auto-expansion across subs (different from yrke-tools-extended.ts
 * which replicates 3× for the juridik/kundservice/rekrytering pattern).
 *
 * Slug suffixes (-design, -ux, -dbild, -dvid, -bredig, -vklipp, -fbild,
 * -ljud) keep slugs unique across yrkesroller — Adobe Firefly and
 * Runway appear in both yrkesroller for different reasons.
 *
 * Imported by lib/yrke-tools.ts and spread into YRKE_TOOLS so the
 * standard seed-yrke-reviews.ts + KNOWN/REVIEW_KNOWN maps pick them
 * up automatically.
 */
import type { YrkeTool } from './yrke-tools';

export const DESIGNER_FOTOGRAF_TOOLS: YrkeTool[] = [
  /* ── DESIGNER · Grafisk design ─────────────────────────────── */
  {
    slug: 'looka-design', parent: 'grafisk-design',
    brand: 'Looka', company: 'Looka Inc.', founded: 2016, hq: 'Toronto, Kanada',
    score: 7.9, fallbackUrl: 'https://looka.com',
    title: 'Looka — AI-logotypgenerator Recension 2026',
    oneliner: 'AI-driven logotypgenerator + brand kit-bygge på minuter — för startups och småföretagare.',
    features: ['Brand Kit-generering', 'Logo + favicon + social-paket', 'Färgpalett + typsnitt-förslag', 'Reseller-licens'],
    pros: ['Snabbaste vägen från idé till logo', 'Komplett brand-paket', 'Engångsköp finns'],
    cons: ['Begränsad kreativ frihet', 'Logos kan kännas generiska'],
    pricing: 'Logo Pack 20 USD engångs; Brand Kit 65 USD; Subscriptions från 8 USD/mån.',
    bestFor: 'Solopreneurer och startups som behöver snabb visuell identitet',
    offer: { title: 'Engångsköp möjligt', price: 'Från 20 USD engångs' },
    tags: ['Logo', 'Brand Kit', 'Startups', 'Engångsköp'],
    useCases: ['Startup-logo', 'Visitkort', 'Brand-paket', 'Re-brand', 'Domännamn-test'],
    label: 'Bäst för snabb logo', logo: 'bg-amber-600',
  },

  /* ── DESIGNER · UI/UX ──────────────────────────────────────── */
  {
    slug: 'figma-ai-ux', parent: 'ui-ux',
    brand: 'Figma AI', company: 'Figma (Adobe)', founded: 2012, hq: 'San Francisco, USA',
    score: 9.3, fallbackUrl: 'https://www.figma.com/ai',
    title: 'Figma AI — Recension 2026',
    oneliner: 'AI-funktioner inbäddade i Figma — från First Draft till Auto-Layout-prompts.',
    features: ['First Draft från prompt', 'AI-omformulering av copy', 'Auto-layout-förslag', 'Visual search i bibliotek'],
    pros: ['Direkt i designers favoritverktyg', 'Stark prompt-följsamhet', 'Sömlös med Dev Mode'],
    cons: ['Premium-features krävs för full AI', 'Vissa funktioner i beta'],
    pricing: 'Free Starter; Professional 15 USD/seat/mån; Organization 45.',
    bestFor: 'Produktdesigners och UX-team',
    offer: { title: 'Free Starter-plan', price: 'Free / Pro 15 USD/seat/mån' },
    tags: ['Figma', 'First Draft', 'Auto-Layout', 'Produkt-design'],
    useCases: ['Wireframes', 'Komponentförslag', 'Auto-layout', 'Dev-handoff', 'Design-system'],
    label: 'Redaktionens val', logo: 'bg-violet-700',
  },
  {
    slug: 'galileo-ai-ux', parent: 'ui-ux',
    brand: 'Galileo AI', company: 'Galileo', founded: 2022, hq: 'San Francisco, USA',
    score: 8.5, fallbackUrl: 'https://www.usegalileo.ai',
    title: 'Galileo AI — Text-to-UI Recension 2026',
    oneliner: 'Genererar produktiona UI-skärmar från textbeskrivning — exporterar direkt till Figma.',
    features: ['Text-to-UI på sekunder', 'Figma-export', 'Komponentbibliotek inbyggt', 'Mobile-first templates'],
    pros: ['Bästa text-to-UI på marknaden', 'Snabbar wireframe-process drastiskt', 'Bra för pitch-mockups'],
    cons: ['Begränsad customization efter generering', 'Pris hoppar vid skala'],
    pricing: 'Free trial; Pro 19 USD/mån; Teams 30/user/mån.',
    bestFor: 'Designteam som behöver snabba mockups',
    offer: { title: 'Free trial', price: 'Pro 19 USD/mån' },
    tags: ['Text-to-UI', 'Mockups', 'Figma-export', 'Wireframes'],
    useCases: ['Pitch-mockups', 'Wireframes', 'Onboarding-screens', 'Design-system', 'Klient-presentationer'],
    label: 'Bäst för mockups', logo: 'bg-indigo-700',
  },
  {
    slug: 'uizard-ux', parent: 'ui-ux',
    brand: 'Uizard', company: 'Uizard Technologies', founded: 2018, hq: 'Köpenhamn, Danmark',
    score: 8.2, fallbackUrl: 'https://uizard.io',
    title: 'Uizard — Sketch-to-Design Recension 2026',
    oneliner: 'Förvandlar pappersskisser och screenshots till digitala UI-designs via AI.',
    features: ['Hand-drawn-to-UI', 'Screenshot-to-design', 'Theme generator', 'Code-export (begränsad)'],
    pros: ['Unik sketch-to-UI-funktionalitet', 'Danskt bolag — EU-baserat', 'Bra för ideationsfasen'],
    cons: ['Output behöver finputs', 'Mindre community än Figma'],
    pricing: 'Free 3 projekt; Pro 19 USD/mån; Business 39.',
    bestFor: 'Designers som börjar med pappersskisser',
    offer: { title: 'Free 3 projekt', price: 'Pro 19 USD/mån' },
    tags: ['Sketch-to-UI', 'EU-baserat', 'Ideation', 'Theme generator'],
    useCases: ['Pappersskiss-digitalisering', 'Screenshot-redesign', 'Tema-generering', 'Ideationssession', 'Pitch-prototyp'],
    label: 'Bäst sketch-to-UI', logo: 'bg-emerald-700',
  },
  /* ── DESIGNER · Bildgenerering (designer-vinkel) ───────────── */
  {
    slug: 'khroma-design', parent: 'designer-bildgenerering',
    brand: 'Khroma', company: 'Khroma', founded: 2020, hq: 'London, UK',
    score: 7.6, fallbackUrl: 'https://khroma.co',
    title: 'Khroma — AI-färgpaletter Recension 2026',
    oneliner: 'AI som lär sig dina färgpreferenser och genererar oändliga palett-förslag.',
    features: ['Lär sig från dina färg-val', 'Genererar palett-par', 'Typografi + gradient-förslag', 'Spara favoriter'],
    pros: ['Smart palett-rekommendation', 'Bra för designer som fastnat i färg-block', 'Engångs-träning per användare'],
    cons: ['Bara färger — inga andra design-features', 'Mindre community'],
    pricing: 'Helt gratis (alfa).',
    bestFor: 'Designers som vill upptäcka nya färgpaletter',
    offer: { title: 'Helt gratis', price: 'Gratis' },
    tags: ['Färgpaletter', 'Gratis', 'Typografi', 'Gradients'],
    useCases: ['Färgpaletter', 'Brand-färger', 'Gradients', 'Typografikombos', 'Inspirationsverktyg'],
    label: 'Bäst för färgpaletter', logo: 'bg-fuchsia-600',
  },

  /* ── DESIGNER · Videoredigering ────────────────────────────── */
  /* ── FOTOGRAF · Bildredigering ─────────────────────────────── */
  {
    slug: 'luminar-neo-bredig', parent: 'bildredigering',
    brand: 'Luminar Neo AI', company: 'Skylum', founded: 2008, hq: 'Bellevue, USA',
    score: 9.1, fallbackUrl: 'https://skylum.com/luminar',
    title: 'Luminar Neo AI — Recension 2026',
    oneliner: 'AI-driven foto-editor med scene-detection, sky replacement och structure-AI.',
    features: ['Sky AI / Sun Rays / Atmosphere AI', 'Structure AI för landskap', 'Portrait Bokeh AI', 'Plugin för Photoshop/Lightroom'],
    pros: ['Bästa AI-himlen på marknaden', 'En-klick-redigeringar för landskap', 'Engångsköp finns'],
    cons: ['Inte ersättare för Lightroom — komplement', 'Tunga AI-extensions extra'],
    pricing: 'Engångsköp 99 USD; Pro 119 USD/år; Extensions 299 USD.',
    bestFor: 'Landskaps- och bröllops-fotografer',
    offer: { title: '30 dagar gratis trial', price: '99 USD engångs' },
    tags: ['Sky AI', 'Landskap', 'Engångsköp', 'Photoshop-plugin'],
    useCases: ['Landskapsfoto', 'Bröllopsfoto', 'Sky replacement', 'Portrait-retusch', 'Komposit'],
    label: 'Redaktionens val', logo: 'bg-indigo-700',
  },
  {
    slug: 'topaz-photo-bredig', parent: 'bildredigering',
    brand: 'Topaz Photo AI', company: 'Topaz Labs', founded: 2005, hq: 'Dallas, USA',
    score: 9.2, fallbackUrl: 'https://www.topazlabs.com/topaz-photo-ai',
    title: 'Topaz Photo AI — Recension 2026',
    oneliner: 'Branschstandard för AI-driven upscaling, denoising och skärpning.',
    features: ['Upscale upp till 6x', 'Denoise med subjekt-detection', 'Sharpen för out-of-focus', 'Face Recovery'],
    pros: ['Marknadsledande upscale-kvalitet', 'Engångsköp = ingen prenumeration', 'Standalone + plugin'],
    cons: ['Pricey för engångsköp', 'GPU-intensiv'],
    pricing: 'Engångsköp 199 USD inkl. 1 års uppdateringar; sedan 99 USD/år.',
    bestFor: 'Yrkesfotografer som behöver maximal bildkvalitet',
    offer: { title: '30 dagar gratis trial', price: '199 USD engångs' },
    tags: ['Upscale', 'Denoise', 'Engångsköp', 'Photoshop-plugin'],
    useCases: ['Upscale gamla foton', 'Bröllopsbilder', 'Tryckkvalitet', 'Stock-foto-prep', 'Arkiv-restaurering'],
    label: 'Bäst för upscale', logo: 'bg-slate-700',
  },
  {
    slug: 'removebg-bredig', parent: 'bildredigering',
    brand: 'Remove.bg', company: 'Kaleido AI', founded: 2018, hq: 'Wien, Österrike',
    score: 8.6, fallbackUrl: 'https://www.remove.bg',
    title: 'Remove.bg — AI-bakgrundsborttagning Recension 2026',
    oneliner: 'Marknadsledande för automatisk bakgrundsborttagning — API, web och desktop-app.',
    features: ['Automatisk bakgrundsborttagning', 'Batch-processing', 'API för utvecklare', 'Photoshop/Sketch-plugin'],
    pros: ['Bästa bakgrundsborttagning på marknaden', 'Snabb API', 'Hairline-kvalitet på hår och päls'],
    cons: ['Smalt användningsområde', 'Pricey vid hög volym'],
    pricing: 'Free preview-kvalitet; HD-bilder 0.20 USD/st eller subscription från 9 USD/mån.',
    bestFor: 'E-handlare och produktfotografer',
    offer: { title: 'Free preview-bilder', price: 'Subscription från 9 USD/mån' },
    tags: ['Bakgrund', 'API', 'Batch', 'E-handel'],
    useCases: ['Produktbilder', 'Porträtt-cutout', 'Marknadsföring', 'Batch-processing', 'E-handel'],
    label: 'Bäst bakgrundsborttagning', logo: 'bg-emerald-600',
  },

  /* ── FOTOGRAF · Videoklippning ─────────────────────────────── */
  {
    slug: 'capcut-ai-vklipp', parent: 'videoklippning',
    brand: 'CapCut AI', company: 'ByteDance', founded: 2019, hq: 'Singapore',
    score: 8.9, fallbackUrl: 'https://www.capcut.com',
    title: 'CapCut AI — Videoredigering Recension 2026',
    oneliner: 'Gratis videoredigerare med inbyggd AI — auto-captions, talking head-features och scen-redigering.',
    features: ['Auto-captions på 60+ språk', 'AI-bakgrundsborttagning', 'Magic Cut för långa intervjuer', 'Cross-device sync'],
    pros: ['Helt gratis huvudfunktionalitet', 'Mobil + desktop sync', 'Snabb auto-redigering'],
    cons: ['Tillhör ByteDance (TikTok-moderbolag)', 'Sponsrade features kan dyka upp'],
    pricing: 'Free huvudversion; Pro 8 USD/mån för premium-effekter.',
    bestFor: 'Content-creators för TikTok, Reels och Shorts',
    offer: { title: 'Helt gratis', price: 'Pro 8 USD/mån' },
    tags: ['Auto-captions', 'Gratis', 'Mobil', 'TikTok-flow'],
    useCases: ['TikTok-content', 'Reels', 'YouTube Shorts', 'Reaktionsvideos', 'Intervjuredigering'],
    label: 'Redaktionens val gratis', logo: 'bg-zinc-900',
  },
  /* ── FOTOGRAF · Bildgenerering (foto-vinkel) ───────────────── */
  /* ── FOTOGRAF · Ljudsättning ───────────────────────────────── */
  {
    slug: 'descript-ljud', parent: 'ljudsattning',
    brand: 'Descript', company: 'Descript', founded: 2017, hq: 'San Francisco, USA',
    score: 9.0, fallbackUrl: 'https://www.descript.com',
    title: 'Descript — Recension 2026',
    oneliner: 'Ljud- och videoredigering via transkription — redigera ljud genom att redigera text.',
    features: ['Edit-by-text', 'Studio Sound (AI denoising)', 'Overdub (AI voice cloning)', 'Inbyggd screen recording'],
    pros: ['Revolutionerande edit-by-text', 'Bästa AI-denoising', 'All-in-one för podcast/video'],
    cons: ['Brant inlärningskurva första veckan', 'Pro krävs för Overdub'],
    pricing: 'Free 1 timme/månad; Creator 12 USD/mån; Pro 24.',
    bestFor: 'Podcasters och YouTube-creators',
    offer: { title: 'Free 1 tim/mån', price: 'Creator 12 USD/mån' },
    tags: ['Podcast', 'Edit-by-text', 'Voice cloning', 'Studio Sound'],
    useCases: ['Podcast-redigering', 'Intervjuer', 'Voice-over', 'Talking head-video', 'Screen recording'],
    label: 'Redaktionens val', logo: 'bg-purple-700',
  },
];
