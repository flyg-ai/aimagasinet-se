/**
 * Formattest: SEO-hubben 301:as till artikelversionen.
 *
 * Bakgrund. /ai-verktyg/marknadsforing/seo låg på position 24,9 med 156
 * exponeringar och noll klick per 28 dagar. En konkurrent med nyare domän
 * rankar etta på samma fråga med en artikel på /blog/. Vi testar om formatet
 * är skillnaden genom att publicera samma ämne som artikel — längre, med
 * Article-schema, författare, datum och sökfrasen i URL:en.
 *
 * Varför 301 och inte noindex: en 301 konsoliderar alla signaler till den nya
 * URL:en. Med noindex ligger hubben kvar och kan fortsätta konkurrera om
 * Googles val av kanonisk sida, vilket riskerar ett falskt negativt resultat.
 *
 * Kedja undviken: /ai-verktyg/foretag/yrke/marknadsforing/seo pekade tidigare
 * på hubben (se redirects.generated.mjs). Den regeln filtreras bort nedan och
 * ersätts med ett direkthopp, annars blir gamla indexerade URL:er 301 → 301.
 * Den gamla yrkes-URL:en hade 2 526 exponeringar på sexton månader — värd att
 * skicka rätt.
 *
 * ÅTERSTÄLLNING om testet faller ut negativt:
 *   1. ta bort importen och spridningen i next.config.mjs
 *   2. npx tsx tmp/seo-test-aterstall.ts
 */

/** Sökvägar vars gamla destination var en av hubbarna — filtreras bort ur de
 *  genererade listorna och ur next.config.mjs egen lista, så att ingen kedja
 *  uppstår. */
export const seoTestSupersededSources = new Set([
  '/ai-verktyg/foretag/yrke/marknadsforing/seo',
  '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing',
  '/ai-verktyg/ekonomi/bokforare',
  '/ai-verktyg/ui-ux/galileo-ai-ux',
  '/ai-verktyg/foretag/yrke/designer/ui-ux/galileo-ai-ux',
  '/ai-verktyg/utbildning/larare',
  '/ai-verktyg/ai-kod-verktyg/utvecklare',
]);

export const seoTestRedirects = [
  // ── Test 1: SEO-verktyg (1 september 2026) ──────────────────────
  {
    source: '/ai-verktyg/marknadsforing/seo',
    destination: '/basta-ai-seo-verktyg-2026',
    statusCode: 301,
  },
  {
    // Direkthopp i stället för kedja via hubben.
    source: '/ai-verktyg/foretag/yrke/marknadsforing/seo',
    destination: '/basta-ai-seo-verktyg-2026',
    statusCode: 301,
  },

  // ── Test 2: bokföring (2 september 2026) ────────────────────────
  // Hubben låg på position 22,7 med 1 018 exponeringar per 28 dagar och noll
  // barnsidor. Sex gånger mer trafik att mäta på än SEO-hubben.
  {
    source: '/ai-verktyg/ekonomi/bokforing',
    destination: '/basta-bokforingsprogram-med-ai-2026',
    statusCode: 301,
  },
  {
    // Hade 8 684 exponeringar över sexton månader — den tyngsta av de gamla
    // yrkes-URL:erna. Direkthopp, inte kedja via hubben.
    source: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing',
    destination: '/basta-bokforingsprogram-med-ai-2026',
    statusCode: 301,
  },
  {
    // Yrkesguiden "bokförare" 301:ade tidigare till hubben.
    source: '/ai-verktyg/ekonomi/bokforare',
    destination: '/basta-bokforingsprogram-med-ai-2026',
    statusCode: 301,
  },

  // ── Test 3: sälj (24 september 2026) ────────────────────────────
  // Säljarsidan rankade inte och hade inga inkommande länkar i innehållet.
  {
    source: '/ai-verktyg/crm/saljare',
    destination: '/basta-ai-verktyg-for-salj-2026',
    statusCode: 301,
  },

  // ── Test 4: svenska AI-bolag (7 oktober 2026) ───────────────────
  // Två artiklar om samma ämne. Den nya (/svenska-ai-foretag-2026) är
  // bredare och uppdaterad med Lovable, Legora och Neko Health, som
  // helt saknades i båda originalversionerna. Den gamla konsolideras in.
  {
    source: '/svenska-ai-startups-2026',
    destination: '/svenska-ai-foretag-2026',
    statusCode: 301,
  },

  // ── Test 5: vilken AI är bäst / på svenska (13 oktober 2026) ────
  // Intern kannibalisering: konkurrenter (aihjalp.se, hurbra.se) rankar på
  // "vilken är bästa AI-appen på svenska" med en enda bred "king"-artikel som
  // täcker flera delfrågor (svenska, kod, pris...) i samma stycke. Vi hade
  // samma ämne utspritt på två sidor: en smal men exakt frastitel-matchande
  // sida och en bredare flerkategorisida som redan hade en egen (svagare)
  // svensk-text-sektion. Den smalare konsolideras in — dess verkliga
  // testmetodik (fem uppgifter, aug 2026) ersatte den breda sidans tidigare
  // svensk-text-avsnitt, plus ett nytt Snabbt svar-block och utökad FAQ.
  {
    source: '/vilken-ai-ar-bast-pa-svenska-vi-testade-chatgpt-claude-och-gemini',
    destination: '/chatgpt-vs-claude-vs-gemini-2026',
    statusCode: 301,
  },

  // ── Test 6: Galileo AI → Google Stitch (5 november 2026) ───────
  // Galileo AI köptes av Google i maj 2025 och relanserades samma dag som
  // Google Stitch, gratis via Google Labs — de betalda planerna försvann i
  // bytet. Samma recensionssida, ny slug/URL som matchar det faktiska namnet.
  {
    source: '/ai-verktyg/galileo-ai-ux',
    destination: '/ai-verktyg/google-stitch',
    statusCode: 301,
  },
  {
    // Direkthopp i stället för kedja via flatten-redirecten.
    source: '/ai-verktyg/ui-ux/galileo-ai-ux',
    destination: '/ai-verktyg/google-stitch',
    statusCode: 301,
  },
  {
    // Direkthopp i stället för kedja via redirects-designer-fotograf.mjs.
    source: '/ai-verktyg/foretag/yrke/designer/ui-ux/galileo-ai-ux',
    destination: '/ai-verktyg/google-stitch',
    statusCode: 301,
  },

  // ── Test 7: designer (5 november 2026) ──────────────────────────
  // Yrkesroll-sidan /foretag/yrke/designer (depth 4, djupt nästlad, svag
  // intern länkning) hade ~0 exponeringar på 90 dagar för "designer"-
  // relaterade sökord sajt-övergripande. Flyttad till en flat artikel,
  // samma mönster som sälj/SEO-testerna.
  {
    source: '/ai-verktyg/foretag/yrke/designer',
    destination: '/basta-ai-verktyg-for-designers-2026',
    statusCode: 301,
  },

  // ── Test 8: HR (5 november 2026) ─────────────────────────────────
  // /ai-verktyg/rekrytering/hr var en föräldralös yrkesguide (692
  // exponeringar/16 mån, pos 35 — mest trafik att mäta på av de fyra
  // kvarvarande yrkessidorna). HR är ett eget ämne från rekrytering
  // (se /ai-verktyg/rekrytering), så den fick en egen kategori-hub i
  // samma tunga HubTemplate-stil som ai-text-verktyg, istället för en
  // flat artikel — motpol till designer-testet ovan.
  {
    source: '/ai-verktyg/rekrytering/hr',
    destination: '/ai-verktyg/hr',
    statusCode: 301,
  },

  // ── Test 9: lärare (6 november 2026) ─────────────────────────────
  // /ai-verktyg/utbildning/larare var en föräldralös yrkesguide (102
  // exponeringar/16 mån, pos 18,6) med skev search intent mot
  // /ai-verktyg/utbildning-hubben, som är student/plugg-fokuserad och inte
  // samma ämne (se kannibalisering.md). Lärare fick en egen kategori-hub
  // i samma mönster som HR-testet ovan, med riktiga verktyg (MagicSchool
  // AI, Brisk Teaching, Curipod) plus en cross-ref till den redan
  // publicerade Khanmigo-recensionen under /ai-verktyg/utbildning.
  {
    source: '/ai-verktyg/utbildning/larare',
    destination: '/ai-verktyg/larare',
    statusCode: 301,
  },

  // ── Test 10: utvecklare → konsolidering (6 november 2026) ────────
  // /ai-verktyg/ai-kod-verktyg/utvecklare var en djupt nästlad
  // arbetsflödesguide ("så jobbar du som utvecklare") med bara 39
  // exponeringar/16 mån (pos 23,9). Till skillnad från lärare/HR är detta
  // INTE ett eget ämne — /ai-verktyg/ai-kod-verktyg redan rankar starkt
  // (5 352 exponeringar/16 mån, pos 5,6) på exakt den sökintention
  // ("ai utvecklare", "ai för utvecklare") den smala sidan tävlade om.
  // Konsoliderad rakt in i den redan vinnande hubben, samma logik som
  // SEO/bokförings-testerna ovan men i motsatt riktning (smal sida →
  // befintlig stark hub, inte en ny artikel).
  {
    source: '/ai-verktyg/ai-kod-verktyg/utvecklare',
    destination: '/ai-verktyg/ai-kod-verktyg',
    statusCode: 301,
  },
];
