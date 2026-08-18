// 301: dubbletter skapade av den nattliga cronen → den ursprungliga artikeln.
//
// Bakgrund: artiklarna för de tre första seed-ämnena publicerades 2026-08-17,
// innan migration 0012 kördes. När tabellen article_topics sedan skapades låg
// samma tre ämnen där som used=false, och cron-körningen 2026-08-18 03:00 UTC
// genererade om dem. reserveSlug() la på ett -2-suffix i stället för att hoppa
// över ämnet, så tre dubbletter publicerades (id 915-917).
//
// Grundfelet är åtgärdat i app/api/cron/generate-articles/route.ts — takeTopics()
// och findNewsStories() hoppar nu över ämnen vars slug redan är upptagen.
// Raderna 915-917 är raderade ur databasen; backup i tmp/deleted-dupes-2026-08-18.json.
/** @type {{source: string, destination: string, statusCode: number}[]} */
export const cronDupeRedirects = [
  {
    source: '/multimodala-ai-modeller-2026-nar-text-bild-och-ljud-smalter-samman-2',
    destination: '/multimodala-ai-modeller-2026-nar-text-bild-och-ljud-smalter-samman',
    statusCode: 301,
  },
  {
    source: '/ai-agenter-i-praktiken-sa-automatiserar-svenska-foretag-sina-arbetsflo-2',
    destination: '/ai-agenter-i-praktiken-sa-automatiserar-svenska-foretag-sina-arbetsflo',
    statusCode: 301,
  },
  {
    source: '/open-source-mot-proprietara-ai-modeller-vad-ska-foretag-valja-2026-2',
    destination: '/open-source-mot-proprietara-ai-modeller-vad-ska-foretag-valja-2026',
    statusCode: 301,
  },
];
