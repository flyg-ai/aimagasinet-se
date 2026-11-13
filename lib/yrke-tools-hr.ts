/**
 * YrkeTool-entries för yrkesrollen "HR" (/ai-verktyg/hr) — medarbetarsamtal,
 * prestationsuppföljning och global lön/anställning. Inte rekrytering, det
 * har sin egen kategori (ai-verktyg-rekrytering).
 *
 * Imported by lib/yrke-tools.ts and spread into YRKE_TOOLS so the standard
 * KNOWN/REVIEW_KNOWN maps pick them up automatically — samma mönster som
 * yrke-tools-designer-fotograf.ts.
 *
 * Priser kontrollerade mot leverantörernas egna sidor november 2026.
 */
import type { YrkeTool } from './yrke-tools';

export const HR_TOOLS: YrkeTool[] = [
  {
    slug: 'deel', parent: 'hr', brand: 'Deel', company: 'Deel', founded: 2019, hq: 'San Francisco, USA',
    score: 8.1, fallbackUrl: 'https://www.deel.com',
    title: 'Deel — Recension 2026',
    oneliner: 'Global HR-, lön- och anställningsplattform (EOR/PEO) med AI i rekryteringsflödet.',
    features: ['Employer of Record i 130+ länder', 'AI-driven kandidatscreening', 'AI-sammanfattningar av intervjuer', 'Samlad lön, compliance och förmånsadministration'],
    pros: ['Flest länder för Employer of Record', 'Samlar lön, anställning och viss rekrytering', 'Ovanligt transparenta utgångspriser'],
    cons: ['AI koncentrerad till rekryteringsflödet, inte löpande HR-admin', 'EOR dyrt jämfört med lokalt bolag där ni redan finns'],
    pricing: 'Utgångspriser per anställd/contractor och månad: EOR från 599 USD, US PEO från 125 USD, Contractors från 49 USD.',
    bestFor: 'Internationell anställning och lön',
    offer: { title: 'EOR från 599 USD/anställd/mån', price: 'Från 599 USD/anställd/mån (EOR)' },
    tags: ['EOR i 130+ länder', 'AI-kandidatscreening', 'Global lön', 'Transparent prissida'],
    useCases: ['Internationell anställning utan eget bolag', 'Lönehantering och compliance i flera länder', 'Contractor-utbetalningar i stor skala', 'AI-stöttad kandidatscreening'],
    label: 'Bäst för global anställning', logo: 'bg-emerald-600',
  },
  {
    slug: 'lattice', parent: 'hr', brand: 'Lattice', company: 'Lattice', founded: 2015, hq: 'San Francisco, USA',
    score: 8.0, fallbackUrl: 'https://lattice.com',
    title: 'Lattice — Recension 2026',
    oneliner: 'Specialiserad performance management-plattform med AI kopplat till er egen feedback- och måldata.',
    features: ['AI Agent svarar på medarbetarfrågor och coachar chefer', 'AI-analys och trender i engagemangsundersökningar', 'Flexibla granskningscykler', 'OKR-spårning och successionsplanering'],
    pros: ['AI kopplad till er egen feedback- och måldata', 'Flexibla granskningscykler', 'Stark Workday-integration'],
    cons: ['Inte längre ett eget HRIS (löne/HRIS-moduler utfasade)', 'Minsta årsavtal 4 000 USD'],
    pricing: 'Per säte och månad, fakturerat årligen: Performance 10 USD, Goals & OKRs 8 USD, Engagement 4 USD. Minsta årsavtal 4 000 USD.',
    bestFor: 'Performance management med AI kopplat till egen data',
    offer: { title: 'Performance 10 USD/säte/mån', price: '10 USD/säte/mån · min 4 000 USD/år' },
    tags: ['Performance management', 'AI Agent', 'OKR', 'Fakturerat årligen'],
    useCases: ['Medarbetarsamtal och prestationsgranskningar', 'Mål- och OKR-uppföljning', 'Engagemangsundersökningar med AI-trendanalys', 'Lönerevision kopplad till prestationsdata'],
    label: 'Bäst för performance management', logo: 'bg-violet-600',
  },
  {
    slug: '15five', parent: 'hr', brand: '15Five', company: '15Five', founded: 2011, hq: 'San Francisco, USA',
    score: 7.9, fallbackUrl: 'https://www.15five.com',
    title: '15Five — Recension 2026',
    oneliner: 'Performance management-plattform med ovanligt transparent prissättning — AI-assisterade samtal, AI-coachning och AI-sammanfattade 1-on-1-anteckningar.',
    features: ['AMAYA AI Thought Partner och Insights Dashboard i Perform-planen', 'AI-assisterade performance-samtal och AI-syntetiserad fritextfeedback', 'Kona AI Coach-tillägg ger AI-coachning baserat på er egen 15Five-data', 'Kona Notetaker transkriberar och sammanfattar 1-on-1-möten automatiskt'],
    pros: ['Ovanligt transparent, per-användare-prissättning rakt på startsidan', 'Tydlig prisstege mellan engagemang (Engage) och performance (Perform)', 'Flera fristående AI-tillägg (coaching, mötesanteckningar) går att välja separat'],
    cons: ['Flest AI-funktioner låsta till Perform/Total Platform — inte Engage-planen', 'Tilläggen (Kona Coach, Notetaker, kompensation) adderar snabbt till grundpriset'],
    pricing: 'Per användare och månad, fakturerat årligen: Engage 4 USD, Perform 11 USD, Total Platform 16 USD. Tillägg: Kona Notetaker 2 USD/anställd/mån, Kona AI Coach 19 USD/chef/mån, Manager Products 49 USD/chef/mån. Enligt leverantören uppdaterade februari 2026 — kan ha ändrats.',
    bestFor: 'Team som vill ha tydligt prissatta AI-tillägg för performance management',
    offer: { title: 'Perform 11 USD/användare/mån', price: '11 USD/användare/mån (Perform) · fakturerat årligen' },
    tags: ['Transparent prisstege', 'AMAYA AI', 'Kona AI-coachning', 'AI-mötesanteckningar'],
    useCases: ['AI-assisterade performance-samtal och utvecklingsplaner', 'AI-sammanfattade 1-on-1-anteckningar (Kona Notetaker)', 'AI-coachning för chefer baserat på egen data (Kona Coach)', 'Engagemangsundersökningar med heatmaps och benchmarking'],
    label: 'Bäst för transparent AI-prissättning', logo: 'bg-amber-600',
  },
  {
    slug: 'rippling', parent: 'hr', brand: 'Rippling', company: 'Rippling', founded: 2016, hq: 'San Francisco, USA',
    score: 7.6, fallbackUrl: 'https://www.rippling.com',
    title: 'Rippling — Recension 2026',
    oneliner: 'Enhetlig HR-, IT- och ekonomiplattform med en inbyggd AI som svarar på frågor tvärs över all er företagsdata.',
    features: ['Rippling AI svarar på frågor tvärs över HR-, IT- och ekonomidata', 'Bygger anpassade rapporter och dashboards med AI', 'Automatiserar arbetsflöden över flera system samtidigt', 'Modulärt system — HR, IT och ekonomi i en och samma plattform'],
    pros: ['Spänner över HR, IT och ekonomi i ett system', 'AI:n har tillgång till all ansluten företagsdata, inte bara HR', 'Sex månader gratis för VC-finansierade startups via eget program'],
    cons: ['Inget publikt listpris på moduler — kräver offert för exakt totalkostnad', 'Överdimensionerat för ett litet företag som bara behöver grundläggande HR'],
    pricing: 'Modulär prissättning från 8 USD per anställd och månad plus en icke publicerad månatlig baskostnad — slutpriset beror på vilka moduler ni väljer och antal anställda, med offert för den exakta siffran. Amerikanska VC-finansierade startups kan få sex månader gratis via ett separat startup-program.',
    bestFor: 'Företag som vill ersätta flera separata HR-, IT- och ekonomisystem med ett',
    offer: { title: 'Från 8 USD/anställd/mån + offert', price: 'Från 8 USD/anställd/mån (moduler, offertbaserat totalpris)' },
    tags: ['HR + IT + ekonomi i ett', 'AI tvärs över all data', 'Modulär prissättning', 'Startup-program'],
    useCases: ['Ersätta flera separata HR-, IT- och ekonomisystem', 'AI-svar och rapporter tvärs över all företagsdata', 'Automatisera arbetsflöden över avdelningar', 'Global anställning och utrustningshantering i samma system'],
    label: 'Bäst för enhetlig HR/IT/ekonomi', logo: 'bg-sky-600',
  },
  {
    slug: 'culture-amp', parent: 'hr', brand: 'Culture Amp', company: 'Culture Amp', founded: 2009, hq: 'Melbourne, Australien',
    score: 7.4, fallbackUrl: 'https://www.cultureamp.com',
    title: 'Culture Amp — Recension 2026',
    oneliner: 'Specialiserad plattform för medarbetarengagemang med AI Coach inbyggt i alla planer.',
    features: ['AI Coach omvandlar organisationsdata till insikter och åtgärdsplaner i alla planer', 'AI-sammanfattningar av fritextkommentarer i engagemangsundersökningar', 'AI-driven analys som hittar mönster och trender i stor skala', 'Inbyggd koppling mot People Science-forskning och benchmarking'],
    pros: ['AI Coach ingår i samtliga planer, inte bara dyraste nivån', 'Stark forskningsgrund (People Science) bakom undersökningsmetodiken', 'Omfattande integrationer mot Slack, Teams och HRIS-system'],
    cons: ['Inget publikt listpris alls — allt kräver offert', 'Mer fokuserat på mätning av kultur/engagemang än löpande performance management eller lön'],
    pricing: 'Helt offertbaserat, fakturerat årligen. Priset beror på företagsstorlek (under 200, 200–999, eller 1000+ anställda) och vilka moduler (Engage, Perform, People Science Consulting) ni väljer. Inget publikt listpris finns.',
    bestFor: 'Mätning och förbättring av medarbetarengagemang i stor skala',
    offer: { title: 'Offertbaserat — AI Coach ingår i alla planer', price: 'Offert (fakturerat årligen)' },
    tags: ['AI Coach i alla planer', 'Engagemangsundersökningar', 'People Science-forskning', 'Offertbaserat'],
    useCases: ['Engagemangsundersökningar med AI-sammanfattade kommentarer', 'Upptäcka mönster och trender i medarbetardata', 'Benchmarking mot andra organisationer', 'Åtgärdsplaner genererade av AI Coach'],
    label: 'Bäst för medarbetarengagemang', logo: 'bg-rose-600',
  },
];
