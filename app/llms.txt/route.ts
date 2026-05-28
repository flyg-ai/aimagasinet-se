/** /llms.txt — well-known endpoint for AI crawlers.
 *
 *  Format follows the emerging llms.txt convention
 *  (https://llmstxt.org) — a markdown-ish file with an H1 site name,
 *  a one-paragraph summary, and bulleted links grouped by section so
 *  retrieval systems can quickly map the site. */
export const revalidate = 3600;

const BODY = `# AI-Magasinet

> Svenskt magasin om artificiell intelligens — nyheter, guider, verktygsrecensioner
> och B2B-användning per yrke. Allt skrivs på naturlig svenska, utan hype,
> och alla verktyg testas av redaktionen innan de hamnar i en topplista.

AI-Magasinet startade 2025 och drivs av Nicklas Hallberg som chefredaktör.
Sajten är CC-uppmärkt där det är möjligt, kommersiella länkar är märkta som
affiliate-länkar. Vi använder själva AI-verktyg för översättning och faktagranskning
men slutredigering görs alltid av en mänsklig redaktör.

## Sektioner

- [AI-nyheter](https://aimagasinet.se/): startsidan listar de senaste nyheterna
- [AI-Verktyg](https://aimagasinet.se/ai-verktyg/): mästerhubb för alla verktygskategorier
- [AI för text](https://aimagasinet.se/ai-verktyg/ai-text-verktyg/): ChatGPT, Claude, Gemini, Jasper, Writesonic
- [AI för bild](https://aimagasinet.se/ai-verktyg/ai-bild-verktyg/): Midjourney, DALL-E 3, Adobe Firefly, Stable Diffusion, Leonardo
- [AI för kod](https://aimagasinet.se/ai-verktyg/ai-kod-verktyg/): Cursor, GitHub Copilot, Windsurf, Tabnine, Codeium
- [AI för ljud & musik](https://aimagasinet.se/ai-verktyg/ai-ljud-och-musik/): Suno, ElevenLabs, Udio, Mubert, AIVA
- [AI Video](https://aimagasinet.se/ai-video/): Kling, Runway, Pika, Sora, HeyGen
- [AI för företag](https://aimagasinet.se/ai-verktyg/foretag/): B2B-verktyg per yrke
- [AI för marknadsföring](https://aimagasinet.se/ai-verktyg/foretag/yrke/marknadsforing/): SEO, content, annonser, sociala medier
- [AI för juridik](https://aimagasinet.se/ai-verktyg/foretag/yrke/juridik/): avtalsgranskning, due diligence, rättsutredningar
- [AI för kundservice](https://aimagasinet.se/ai-verktyg/foretag/yrke/kundservice/): chatbottar, e-postsvar, röst-AI
- [AI för rekrytering](https://aimagasinet.se/ai-verktyg/foretag/yrke/rekrytering/): CV-screening, jobbannonser, kandidatmatchning
- [AI-Guiden](https://aimagasinet.se/ai-guiden/): nybörjarguider, prompta bättre, framtidens AI

## Maskinläsbara filer

- [sitemap.xml](https://aimagasinet.se/sitemap.xml): alla artiklar + sektionsindex med lastmod
- [robots.txt](https://aimagasinet.se/robots.txt): crawler-direktiv

## Skribenter

- [Nicklas Hallberg](https://aimagasinet.se/skribenter/nicklas-hallberg/) — Grundare & Chefredaktör
- [Erik Lindgren](https://aimagasinet.se/skribenter/erik-lindgren/) — AI-journalist
- [Sara Nilsson](https://aimagasinet.se/skribenter/sara-nilsson/) — Teknikskribent

## Kontakt

- E-post: kontakt@aimagasinet.se
- [Om oss](https://aimagasinet.se/om-oss/) · [Kontakt](https://aimagasinet.se/kontakt/)
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
