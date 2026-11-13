# Hub-audit: marknadsföring

_Read-only kategori- & listvärde-audit. Genererad 2026-06-22. Inget ändrat — endast bedömning._

Omfattar nav-hubben `/ai-verktyg/marknadsforing` + de fyra subhubbarna **SEO**, **content & copywriting**, **annonser**, **sociala medier**. 36 unika verktyg (curerade listor i `app/[...slug]/page.tsx`). Bedömning bygger på profil + `content_mdx` (DB) samt känd produktkännedom; beskrivningarna stickprovskollades och är genomgående **tool-specifika och korrekta** (mall-strukturerade via `toContentMdx`, men inga fel-produkt-/generiska texter som i wint-fallet).

## Sammanfattning — viktigaste fynden

1. **Två korshubb-dubbletter** (samma produkt, två sidor):
   - **Jasper**: `jasper-content` (marknadsföring) ↔ `jasper-ai` (ai-text-verktyg).
   - **Lately**: `lately-ai` (marknadsföring) ↔ `lately` (sociala-medier-hub).
   → Slå ihop / välj en kanonisk sida + 301.
2. **Enterprise/perifert för svensk publik** (svagt listvärde): `persado` (Fortune 500), `albert-ai` (autonom enterprise paid media), `fedica` (mindre X/Bluesky-verktyg).
3. **Svag "AI"-vinkel men etablerat verktyg**: `screaming-frog-ai` (teknisk crawler; AI är ett tunt tillägg) — behåll men nedtona AI-framing.
4. **Cross-listade textverktyg** (hemvist = `ai-text-verktyg`, listas här som content): `chatgpt`, `claude`, `copy-ai`, `writesonic` — korrekt korslistning, behåll.
5. **Möjlig dubbel hemvist**: `hypotenuse-ai` (produktbeskrivningar för e-handel) passar även i `e-handel`-hubben.

## Nav-hub (`/ai-verktyg/marknadsforing`) — bred topplista

| verktyg | vad det gör | rätt hub? | listvärde | beskrivning stämmer? | rekommendation |
|---|---|---|---|---|---|
| chatgpt | Generell AI-assistent, här som content-motor | Hemvist ai-text-verktyg; ok korslistad | stark | ja | behåll (korslistad) |
| claude | Generell AI-assistent, stark på långform | Hemvist ai-text-verktyg; ok korslistad | stark | ja | behåll (korslistad) |
| jasper-content | Marknadsföringsplattform kring brand voice/team | Ja (content) | stark | ja | **kolla närmare — dubblett av `jasper-ai`** |
| copy-ai | Kort copy, ads & sociala medier | Hemvist ai-text-verktyg; ok korslistad | stark | ja | behåll (korslistad) |
| anyword | Performance-copy med predictive score per variant | Ja (content/annons) | ok | ja | behåll |
| adcreative-ai | AI-genererade banners/annonser med score | Ja (annonser) | stark | ja | behåll |
| madgicx | AI-marketing-cloud för Meta-annonser | Ja (annonser) | ok | ja | behåll |
| hootsuite-ai | Schemaläggare + OwlyWriter AI | Ja (sociala) | stark | ja | behåll |
| buffer-ai | Lätt schemaläggare med AI Assistant | Ja (sociala) | stark | ja | behåll |
| ocoya | All-in-one social: content/design/schemaläggning | Ja (sociala) | ok | ja | behåll |

## SEO

| verktyg | vad det gör | rätt hub? | listvärde | beskrivning stämmer? | rekommendation |
|---|---|---|---|---|---|
| semrush-ai | Komplett SEO-svit med AI-briefs & rank tracking | Ja (SEO) | stark | ja | behåll |
| ahrefs-ai | Branschledande backlink-/keyword-data + AI-lager | Ja (SEO) | stark | ja | behåll |
| surfer-seo | AI-content-editor som scorar mot topp-10 | Ja (SEO) | stark | ja | behåll |
| clearscope | Premium content-grading mot SERP | Ja (SEO) | ok | ja | behåll |
| frase-io | SERP-research + AI-skrivande, prisvärt | Ja (SEO) | ok | ja | behåll |
| neuronwriter | NLP-driven SEO-editor, billig | Ja (SEO) | ok | ja | behåll |
| marketmuse | Content-strategi-AI, mappar luckor på stora sajter | Ja (SEO) | ok | ja | behåll |
| rankmath-ai | WordPress SEO-plugin med Content AI | Ja (SEO) | ok | ja | behåll |
| screaming-frog-ai | Klassisk SEO-crawler med AI-extraktion | Ja (teknisk SEO) | svag (tunn AI-vinkel) | ja | behåll, nedtona AI-framing |

## Content & copywriting

| verktyg | vad det gör | rätt hub? | listvärde | beskrivning stämmer? | rekommendation |
|---|---|---|---|---|---|
| jasper-content | Brand voice-content för team | Ja (content) | stark | ja | **kolla närmare — dubblett av `jasper-ai`** |
| copy-ai | Kort copy/ads/social | Hemvist ai-text-verktyg | stark | ja | behåll (korslistad) |
| writesonic | Snabb copy, SEO & marknadsföring | Hemvist ai-text-verktyg | ok | ja | behåll (korslistad) |
| koala-writer | Long-form SEO-skribent med live SERP | Ja (content/SEO) | ok | ja | behåll |
| rytr-content | Billigast pro-plan, för frilansare | Ja (content) | ok | ja | behåll |
| hypotenuse-ai | Produktbeskrivningar för e-handel i skala | Ja (content); passar även e-handel | ok | ja | behåll (ev. korslista i e-handel) |
| anyword | Performance-copy med score per variant | Ja (content) | ok | ja | behåll |
| contentatscale | Long-form på autopilot + AI-detektor-säker | Ja (content) | ok | ja | behåll |

## Annonser

| verktyg | vad det gör | rätt hub? | listvärde | beskrivning stämmer? | rekommendation |
|---|---|---|---|---|---|
| adcreative-ai | AI-annonskreativ med predictive score | Ja (annonser) | stark | ja | behåll |
| pencil-ai | AI-video & statiska Meta-annonser | Ja (annonser) | ok | ja | behåll |
| persado | Enterprise emotion-driven copy (Fortune 500) | Ja (annonser) | svag (enterprise, perifert) | ja | nedprioritera |
| smartly-io | Nordisk martech för social advertising i skala | Ja (annonser) | ok (nordisk relevans, enterprise) | ja | behåll |
| albert-ai | Autonom AI-marketer för paid media | Ja (annonser) | svag (enterprise) | ja | nedprioritera |
| motionapp | Kreativ analytics-AI för paid social | Ja (annonser) | ok | ja | behåll |
| madgicx | AI-cloud för Meta-annonsörer | Ja (annonser) | ok | ja | behåll |
| revealbot | Automatiseringsregler för Meta/Google/TikTok | Ja (annonser) | ok (nisch: performance) | ja | behåll |

## Sociala medier

| verktyg | vad det gör | rätt hub? | listvärde | beskrivning stämmer? | rekommendation |
|---|---|---|---|---|---|
| hootsuite-ai | Schemaläggare + OwlyWriter AI | Ja (sociala) | stark | ja | behåll |
| buffer-ai | Lätt schemaläggare + AI Assistant | Ja (sociala) | stark | ja | behåll |
| predis-ai | Skapar posts/carousels/video från en idé | Ja (sociala) | ok | ja | behåll |
| flick-ai | Hashtag-research & content för Instagram | Ja (sociala) | ok (nisch: IG) | ja | behåll |
| lately-ai | Gör om long-form till social posts | Ja (sociala) | ok | ja | **kolla närmare — dubblett av `lately`** |
| ocoya | All-in-one social med AI-content | Ja (sociala) | ok | ja | behåll |
| postwise | AI-skribent/schemaläggare för X (Twitter) | Ja (sociala) | ok (nisch: X) | ja | behåll |
| taplio | AI för LinkedIn-content & relationer | Ja (sociala) | ok (nisch: LinkedIn, stark för B2B) | ja | behåll |
| fedica | Audience-analys/content för X/Bluesky | Ja (sociala) | svag (mindre verktyg) | ja | nedprioritera |

## Åtgärdsförslag (för en framtida, ej read-only, runda)

- **Dubbletter:** besluta kanonisk sida för Jasper (`jasper-ai` vs `jasper-content`) och Lately (`lately` vs `lately-ai`); slå ihop innehåll, 301:a den andra (single-hop, flat URL).
- **Nedprioritera i topplistor:** `persado`, `albert-ai`, `fedica` (perifera för svensk SMB-publik) — behåll sidorna men lyft fram starkare alternativ.
- **`hypotenuse-ai`:** överväg korslistning i `e-handel`.
- **`screaming-frog-ai`:** behåll, men "AI"-vinkeln är tunn — justera framing/förväntan.
- Beskrivningarna är korrekta men mall-strukturerade (samma "Vår analys av X …"-ram) — kandidat för mer unik redaktionell text på de starkaste verktygen.
