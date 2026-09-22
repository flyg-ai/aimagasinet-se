# /admin — publicera artiklar utan skript

En lösenordsskyddad sida för att skriva, förhandsgranska, publicera, redigera och
avpublicera artiklar på aimagasinet.se. Ingen länk dit från sajten, `noindex`
(metadata och `X-Robots-Tag` från middleware), utesluten i robots.txt och finns
inte i sitemapen (den läser bara `articles`).

Modulen är portad från cryptofeber.se. Allt som skiljer sajterna åt ligger i
`lib/admin/config.ts` och `lib/admin/Preview.tsx`.

## Env-variabler

| Namn | Vad |
|---|---|
| `ADMIN_PASSWORD` | Lösenordet. Långt och unikt — det är det enda som skyddar sidan. |
| `ADMIN_SESSION_SECRET` | Signerar sessionscookien. Minst 32 tecken, slumpat: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Finns redan. Service role används bara på servern (`lib/admin/*` importerar `server-only`). |

Saknas `ADMIN_PASSWORD` eller `ADMIN_SESSION_SECRET` (eller är hemligheten kortare
än 32 tecken) svarar allt under `/admin` 404. Lägg in dem i Vercel → Settings →
Environment Variables (Production) och deploya om. Byt hemligheten för att logga
ut alla sessioner.

## Vad admin rör — och inte rör

- Bara rader i `articles` med `type = 'post'` och `parent_slug` null, alltså
  nyheter och guider på toppnivå. Recensioner, hubbar och sidor syns inte och
  går inte att redigera härifrån.
- Adressen är `https://aimagasinet.se/<slug>/`; `path` sparas som `/<slug>`.
- Skribenten väljs i formuläret ur tabellen `authors`. Nya artiklar förväljs till
  `redaktionen` (AI-Magasinets redaktion). Nya rader får `tags = []`, `faq = null`,
  `affiliate_url = null`. Vid redigering behålls taggar och FAQ.
- `content_mdx` innehåller HTML, trots namnet.
- Ingenting raderas. Avpublicering sätter `published_at` till null.

## Använda formuläret

1. Gå till `https://aimagasinet.se/admin/` och logga in. Sessionen gäller i 12
   timmar. Felaktiga försök ger en växande väntetid per IP.
2. **Ny artikel.** Rubriken föreslår en slug; ändra den gärna till en kortare
   sökfras. Slugen kontrolleras mot databasen (både `slug` och `path`) och mot
   sajtens egna rutter när du lämnar fältet, och går inte att ändra efter
   publicering. Rubriken får inte redan finnas — databastriggern
   `block_duplicate_title` stoppar annars inserten.
3. **Brödtext:** klistra in Markdown direkt från ChatGPT, eller HTML. Texten
   saneras på servern: bara stycken, H2/H3, listor, länkar, fet/kursiv, citat,
   radbrytningar och tabeller blir kvar. `#` blir H2. Länkar till aimagasinet.se
   görs relativa; externa länkar får `rel="nofollow noopener"` och
   `target="_blank"`. `class` behålls bara för `not-prose` och sajtens
   artikelblock (`toplist*`, `compare-table*`, `compare-group`, `cov*`,
   `is-first`), och `div`/`span` släpps bara igenom för att bära de klasserna.
   Innehållsblocken (`<div data-block="…">`, se nedan) plockas ut före
   saneringen och sparas som validerad JSON.
4. **Tomma fält** fylls som i den nattliga artikelgenereringen: ingressen tas ur
   första stycket (`lib/excerpt.ts`), SEO-titeln blir rubriken (app/layout lägger
   på "| AI-Magasinet" — skriv den inte själv) och SEO-beskrivningen blir
   ingressen kortad till 155 tecken. Det visas som gula varningar.
5. **Omslagsbild** (valfri): JPG/PNG/WebP. Servern optimerar den med sharp till
   en webp (bredd högst 1200 px, kvalitet 85) och lägger den i bucketen
   `featured-images` under `<år>/<månad>/<slug>-hero.webp`. Byts bilden ut får
   filen ett nytt namn (`-hero-<tid>.webp`), eftersom optimerade bilder cachas i
   30 dagar (`minimumCacheTTL`). Filer över 3,5 MB skalas ner i webbläsaren
   först — server actions tar högst 4 MB (`serverActions.bodySizeLimit` i
   next.config.mjs). Utan bild visas artikeln utan omslag. `og_image` rörs inte.
6. **Förhandsgranska** visar artikeln i sajtens egen artikelmall
   (`ArticleTemplate`, med ToC och verktygskort) och listar fynden:
   - Röda = stoppar publicering: tom rubrik/brödtext, okänd kategori, upptagen
     eller reserverad slug, rubrik som redan finns, datum i framtiden,
     SEO-titel > 60 eller SEO-beskrivning > 155 tecken (när du skrivit dem
     själv; en lång rubrik som används som SEO-titel ger bara en varning),
     ett innehållsblock med fel syntax (t.ex. trasig JSON) och en topplista
     som pekar på en recension som inte finns eller inte är publicerad.
   - Gula = varningar ur `lib/article-rules.ts`: tal över tolv (årtal
     undantagna), procent eller belopp i ett stycke utan källänk, färre än två
     interna länkar, tomma SEO-fält/ingress. Varningarna stoppar inte, men läs dem.
7. **Publicera.** Artikeln, startsidan, kategorisidan (och den gamla om
   kategorin byttes), skribentsidan och sitemapen byggs om, och du får en länk
   till artikeln.
8. **Redigera/avpublicera** från listan på `/admin/`. Publicera igen från
   redigeringen.

## Innehållsblock

Ett block är en `div` med attributet `data-block` och en JSON som enda
innehåll, på en egen rad i brödtexten. Blocken renderas som React på servern
(`components/ContentBlocks.tsx`, via `ArticleProse` i `ArticleTemplate`);
syntaxen och valideringen finns i `lib/content-blocks.ts`, samma format som på
cryptofeber.se.

- I texten fungerar `**fet**` och `[länktext](https://… eller /intern/adress/)`.
  Annan HTML i JSON:en visas som text. JSON:en får inte innehålla `<` (admin
  skriver om det till `\u003c` när du publicerar).
- **Topplista:** ange bara recensionen (`review`: slug som `"semrush-ai"` eller
  adress som `"/ai-verktyg/semrush-ai/"`), plus valfri `badge` och `text`.
  Logga, namn, kategori och betyg hämtas ur recensionen när sidan renderas —
  betyget räknas av `lib/review-score.ts`, samma funktion som recensionssidan
  använder, så de kan inte visa olika siffror. En nedlagd tjänst visas som
  "Nedlagd" utan siffra. Ordningen i blocket är den redaktionella (1–25 rader).
- **Jämförelsekort:** ett värde som börjar med Ja, Nej eller Delvis blir en
  grön, röd eller gul markering.
- **Diagram** kräver `source` ({text, url}); utan källa visas det inte.
- **Bild** kräver `alt` och en fil i Storage-bucketen `featured-images`
  (sökvägen i bucketen, t.ex. `2026/09/namn.png`, eller hela den publika
  URL:en). Ange gärna `width`/`height` i pixlar så att sidan inte hoppar.
- **Verktyg i guiden** är inget block: länkar artikeln (i texten eller i en
  topplista) till minst tre publicerade recensioner visas en lista med namn,
  kategori och betyg längst ner, sorterad på betyg.
- Vanliga tabeller får sajtens tabellstil automatiskt (rundad ram, scroll på
  mobil). `<span class="cov cov-yes">Ja</span>`, `cov-partial` och `cov-no`
  ger färgade Ja/Delvis/Nej-markeringar i en cell.

Exemplen står också under brödtextfältet i formuläret (`BLOCK_EXAMPLES` i
`lib/content-blocks.ts` — ändra båda samtidigt).

#### Topplista (1–25 verktyg; betyg, logga och kategori hämtas ur recensionen)

```html
<div data-block="toplist">{"title": "Våra förstahandsval", "items": [
  {"review": "semrush-ai", "badge": "Bäst allt-i-ett", "text": "Sökord, teknik och rapporter i samma abonnemang."},
  {"review": "/ai-verktyg/ahrefs-ai/", "badge": "Bäst för länkar"},
  {"review": "neuronwriter", "text": "Budgetalternativet till Surfer."}
], "note": "Ordningen är redaktionens; betygen kommer från respektive recension."}</div>
```

#### Jämförelsekort (2–4 kort)

```html
<div data-block="compare">{"cards": [
  {"title": "Surfer SEO", "text": "Optimerar texten mot SERP:en.", "rows": [
    {"label": "Gratisnivå", "value": "Nej"},
    {"label": "Svenska texter", "value": "Ja, hanteras väl"}],
   "link": {"href": "/ai-verktyg/surfer-seo/", "text": "Läs recensionen"}},
  {"title": "NeuronWriter", "rows": [
    {"label": "Gratisnivå", "value": "Nej"},
    {"label": "Svenska texter", "value": "Delvis"}],
   "link": {"href": "/ai-verktyg/neuronwriter/"}}
]}</div>
```

#### Steg för steg

```html
<div data-block="steps">{"steps": [
  {"title": "Hitta sidorna som rankar men inte klickas", "text": "Sortera på exponeringar i **Search Console**."},
  {"title": "Skriv om titel och beskrivning"},
  {"title": "Vänta och mät", "text": "Jämför mot baslinjen."}
]}</div>
```

#### Faktaruta (variant tips, varning eller info)

```html
<div data-block="callout">{"variant": "tips", "title": "Sätt en baslinje först",
 "text": "Exportera Search Console-data innan du startar prenumerationen.",
 "items": ["Klick och exponeringar per sida", "Genomsnittlig position"]}</div>
```

#### Stapeldiagram (källa krävs)

```html
<div data-block="chart">{"title": "Pris per månad", "unit": "USD",
 "items": [{"label": "Verktyg A", "value": 139}, {"label": "Verktyg B", "value": 29}],
 "note": "Månadsbetalning.",
 "source": [{"text": "A:s prissida", "url": "https://example.com/a"}, {"text": "B:s prissida", "url": "https://example.com/b"}]}</div>
```

#### Bild (alt krävs; filen i Storage-bucketen featured-images)

```html
<div data-block="image">{"src": "2026/09/seo-verktyg-oversikt.png", "width": 1600, "height": 900,
 "alt": "Search Consoles resultatrapport med exponeringar och klick per sida.",
 "caption": "Valfri bildtext."}</div>
```

## Filer

```
app/admin/                 sidorna och server actions (generiska)
lib/admin/auth.ts          inloggning och session (generisk)
lib/admin/body.ts          Markdown/HTML → sanerad HTML (allowlist för aimagasinet)
lib/admin/articles.ts      läsning/skrivning + bildoptimering och uppladdning
lib/admin/config.ts        ALLT sajtspecifikt — kolumner, adresser, revalidering, bilder
lib/admin/Preview.tsx      förhandsgranskning med ArticleTemplate
lib/article-rules.ts       innehållsreglerna (varningar och hårda stopp)
lib/content-blocks.ts      innehållsblocken: syntax, validering, exempel
components/ContentBlocks.tsx  blocken och "Verktyg i guiden" som React
lib/review-refs.ts         recensionerna en artikel pekar på (en fråga)
lib/review-score.ts        recensionens betyg — samma för sida och listor
middleware.ts              X-Robots-Tag: noindex på /admin
app/robots.ts              Disallow: /admin/
```

Beroenden: `marked`, `sanitize-html`, `server-only`, `sharp` (flyttad till
dependencies) och `@types/sanitize-html`.
