/**
 * YrkeTool-entries för yrkesrollen "lärare" (/ai-verktyg/larare) — lektions-
 * planering, skrivfeedback och klassrumsaktiviteter. Inte samma ämne som
 * /ai-verktyg/utbildning, som är student/plugg-fokuserad.
 *
 * Imported by lib/yrke-tools.ts and spread into YRKE_TOOLS so the standard
 * KNOWN/REVIEW_KNOWN maps pick them up automatically — samma mönster som
 * yrke-tools-hr.ts.
 *
 * Priser kontrollerade mot leverantörernas egna sidor november 2026.
 */
import type { YrkeTool } from './yrke-tools';

export const LARARE_TOOLS: YrkeTool[] = [
  {
    slug: 'magicschool-ai', parent: 'larare', brand: 'MagicSchool AI', company: 'MagicSchool', founded: 2023, hq: 'Denver, USA',
    score: 8.3, fallbackUrl: 'https://www.magicschool.ai',
    title: 'MagicSchool AI — Recension 2026',
    oneliner: '80+ AI-verktyg byggda specifikt för lärare, från lektionsplaner till skrivfeedback — med en generös gratisnivå.',
    features: ['80+ färdiga lärarverktyg (lektionsplaner, rubriker, prov)', 'Raina — AI-chatbot byggd för undervisning', 'Elevverktyg och lärandeinsikter (Plus)', 'Integritets- och säkerhetsskydd för skolor'],
    pros: ['Generös gratisnivå med 80+ verktyg', 'Byggd specifikt för lärare, inte en generisk chatbot', 'Transparent pris på individnivå'],
    cons: ['Gratisnivån saknar elevverktyg och obegränsade genereringar', 'Skol/distriktsnivå kräver offert'],
    pricing: 'Free 0 USD (80+ lärarverktyg, begränsat antal genereringar). Plus 8,33 USD/mån vid årsbetalning (99,96 USD/år) eller 12,99 USD/mån — obegränsade genereringar och elevverktyg. Enterprise för skolor/distrikt: offert.',
    bestFor: 'Färdiga, ämnesspecifika lärarverktyg utan prompt-byggande',
    offer: { title: 'Gratis — 80+ verktyg', price: 'Free 0 USD · Plus 8,33 USD/mån (årsbetalning)' },
    tags: ['80+ lärarverktyg', 'Generös gratisnivå', 'Byggd för undervisning', 'Transparent individpris'],
    useCases: ['Lektionsplanering på minuter', 'Generera prov, rubriker och exit tickets', 'Differentierat material per elevnivå', 'Skrivfeedback till elever'],
    label: 'Bäst för bredd (80+ verktyg)', logo: 'bg-amber-600',
  },
  {
    slug: 'brisk-teaching', parent: 'larare', brand: 'Brisk Teaching', company: 'Brisk Teaching', founded: 2023, hq: 'San Francisco, USA',
    score: 8.1, fallbackUrl: 'https://www.briskteaching.com',
    title: 'Brisk Teaching — Recension 2026',
    oneliner: 'Chrome/Edge-tillägg som lägger AI direkt i Docs, Slides och ert LMS — inget nytt verktyg att logga in i.',
    features: ['Webbläsartillägg för Docs, Slides, YouTube och LMS', '20+ lärarverktyg i gratisplanen', 'Material på 50+ språk', 'Batch-feedback och rubrikbaserad bedömning'],
    pros: ['Jobbar direkt i verktyg ni redan använder (Docs/Slides/LMS)', 'Gratisplanen är fullt användbar, inte bara en demo', 'Stöd för 50+ språk gör den stark för flerspråkiga klassrum'],
    cons: ['Skol/distriktspris (Premium/Intelligence) kräver offert, inget listpris', 'Extensionsberoende — fungerar inte lika sömlöst utanför Chrome/Edge'],
    pricing: 'Free 0 USD för enskilda lärare (20+ verktyg). Premium (skolor/distrikt) och Intelligence (distrikt, curriculum-anpassat): båda offertbaserade, enligt FAQ prissatt per elev.',
    bestFor: 'Klassrum som redan jobbar i Google Docs/Slides eller ett LMS',
    offer: { title: 'Gratis Chrome-tillägg', price: 'Free 0 USD · Premium/Intelligence: offert' },
    tags: ['Webbläsartillägg', '50+ språk', 'Jobbar i Docs/Slides/LMS', 'Gratis grundplan'],
    useCases: ['Generera material direkt i Google Docs/Slides', 'Personlig skrivfeedback till elever', 'Anpassa läsnivå eller översätt innehåll', 'Snabb bedömning mot egen rubrik'],
    label: 'Bäst för Google Docs/Slides-klassrum', logo: 'bg-sky-600',
  },
  {
    slug: 'curipod', parent: 'larare', brand: 'Curipod', company: 'Curipod', founded: 2021, hq: 'Oslo, Norge',
    score: 7.9, fallbackUrl: 'https://curipod.com',
    title: 'Curipod — Recension 2026',
    oneliner: 'Lärarledda läs- och skrivlektioner med AI-feedback till eleverna direkt efter inlämning, använt i 14 000+ distrikt.',
    features: ['Helklasslektioner kopplade till befintlig läroplan (t.ex. HMH, Amplify CKLA)', 'AI-feedback till elever direkt efter skrivinlämning', 'Rapporter som visar kunskapsluckor per elev', 'STAAR/TELPAS-provförberedelse'],
    pros: ['Byggd för helklassundervisning, inte bara individuell AI-chatt', 'Gratisnivån är användbar varje vecka, inte en trial', 'Stark data/rapportering på elevnivå'],
    cons: ['Gratisnivån begränsar teckenlängd på elevsvar (1 000 tecken)', 'Skol/distriktspris kräver offert'],
    pricing: 'Free 0 USD för alla lärare (begränsad ELA/NO/SO-övning, elevsvar upp till 1 000 tecken). School & District: offert — obegränsad övning, bilingual-stöd, SSO. ELA Curriculum Alignment (distrikt): offert.',
    bestFor: 'Gemensamma klassrumslektioner med inbyggd skrivfeedback',
    offer: { title: 'Gratis för alla lärare', price: 'Free 0 USD · Skola/distrikt: offert' },
    tags: ['14 000+ distrikt', 'Läroplansanpassad', 'AI-skrivfeedback', 'Helklasslektioner'],
    useCases: ['Gemensamma läs- och skrivlektioner', 'Direkt AI-feedback på elevtexter', 'Identifiera kunskapsluckor i klassen', 'Prov- och testförberedelse (STAAR/TELPAS)'],
    label: 'Bäst för läroplansanpassad undervisning', logo: 'bg-emerald-700',
  },
];
