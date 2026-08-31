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

/** Sökvägar vars gamla destination var hubben — filtreras bort ur de
 *  genererade listorna så att ingen kedja uppstår. */
export const seoTestSupersededSources = new Set([
  '/ai-verktyg/foretag/yrke/marknadsforing/seo',
]);

export const seoTestRedirects = [
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
];
