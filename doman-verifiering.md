# Domän-verifiering — uppföljning av doman-mismatch.md

_Read-only. Genererad 2026-06-22. Endast webb-verifierade domäner anges — inga gissningar. Inga källfiler ändrade._

| # | namn | bekräftad domän | källa | lever | rätt hub |
|---|---|---|---|---|---|
| 1 | Klara (bokföring) | **OVERIFIERAD** | — | — | — |
| 2 | Synthesis AI (utbildning) | **synthesis.com** (produktyta `synthesis.com/tutor`) | synthesis.com/tutor; thehustle.co-profil | ja | utbildning |
| 3 | Leonardo AI | **leonardo.ai** | leonardo.ai | ja | ai-bild-verktyg |
| 4 | Ideogram | **ideogram.ai** | ideogram.ai | ja | ai-bild-verktyg |
| 5 | Playground AI | **playground.com** | playground.com | ja | ai-bild-verktyg |
| 6 | Bing Image Creator | **bing.com/images/create** | bing.com/images/create; microsoft.com/bing | ja | ai-bild-verktyg |
| 7 | Flux (FLUX.1) | **bfl.ai** (Black Forest Labs; `blackforestlabs.ai` redirectar hit) | bfl.ai/models; github.com/black-forest-labs/flux | ja | ai-bild-verktyg |
| 8 | Stable Diffusion | **stability.ai** | stability.ai/stable-image | ja | ai-bild-verktyg |

## 1. klara-ai — OVERIFIERAD

Ingen citerbar bokförings-domän kunde bekräftas. Gissar därför ingen.

- Vår recension beskriver: "automatiserad bokföring för småföretagare", grundat 2018, HK Stockholm, mobil-first (kvitto/faktura/moms/skatt). Företagsfältet i lib anger "Klara (Wint)".
- **Wint (`wint.se`, Göteborg, grundat 2011) marknadsför ingen produkt vid namn "Klara"** — Wint-/Klara-kopplingen kunde inte beläggas i någon primärkälla. Källor: wint.se, wint.se/produkten, allabolag.se (Wint AB).
- `klara.se` = **KLARA arkitekter** (Karlstad) — ej bokföring.
- `klaraconsulting.se` = **Klara Consulting**, en redovisnings-/konsultbyrå (~550 anställda, full-service redovisning/lön/rådgivning) — INTE en mobil-first bokföringsprodukt grundad 2018. Källa: klaraconsulting.se.
- Beskrivningen "mobil-first bokföring grundad 2018 i Stockholm" gick inte att matcha mot någon befintlig produktdomän (App Store/produktsajt/bolagsregister).

**Slutsats:** Posten är OVERIFIERAD — den recenserade produktens identitet kan inte knytas till en verifierbar bokförings-domän. Bör behandlas som ej-belagd tills en primärkälla finns. (Detta är ett starkare utfall än "fel domän": det är oklart om produkten existerar i den beskrivna formen.)

## 2. synthesis-ai — RÄTT DOMÄN (synthesis.com), hub korrekt

Detta löser upp den tidigare OSÄKER-flaggan.

- Vår `content_mdx` beskriver uttryckligen **utbildningsplattformen**: "en utbildningsplattform utvecklad av företaget Synthesis i Austin, USA, grundat 2018 … barns förmåga att lösa problem … interaktiva spel och simuleringar". Det är alltså edtech-Synthesis, inte datorseende-bolaget.
- **synthesis.com** (`/tutor`) är den produkten: lever (25 000+ familjer, ålder 5–11, 7 dagars provperiod, iPad/desktop). Sprang ur Elon Musks Ad Astra-skola. Källa: synthesis.com/tutor, thehustle.co.
- **synthesis.ai** är ett ANNAT bolag (syntetisk data/datorseende för ML) — ska INTE användas här.
- Befintlig domän `synthesis.com` är alltså **korrekt** för det vår recension beskriver, och hub `utbildning` är rätt. Ingen ändring behövs.

## 3. De sex bildverktygen — alla lever, officiella domäner bekräftade

Samtliga är aktiva (till skillnad från pattern89/replica-studios). Korrekt hub för alla sex: **ai-bild-verktyg**.

- **leonardo-ai → leonardo.ai** — aktiv "Generative AI Platform for Images, Art & Video"; webb + iOS/Android, gratisnivå.
- **ideogram → ideogram.ai** — aktiv; modell "Ideogram 4.0", stark på text-i-bild, gratisnivå.
- **playground-ai → playground.com** — aktiv; positionerar sig numera bredare som "AI design studio" men bildgenerering är fortfarande kärnan.
- **bing-image-creator → bing.com/images/create** (Microsoft) — aktiv, gratis. Notera: den ursprungliga DALL·E 3-backenden fasas ut, men produkten lever med ersättningsmodeller (MAI-Image-2, GPT-4o).
- **flux → bfl.ai** (Black Forest Labs; `blackforestlabs.ai` redirectar hit) — aktiv; FLUX.1 [dev]/[schnell]/[pro], FLUX.1 Kontext, FLUX.2. Öppna vikter på Hugging Face.
- **stable-diffusion → stability.ai** (Stability AI) — aktiv; pågående Stable Image / Stable Diffusion-modelllinje, öppna vikter på huggingface.co/stabilityai.

> Dessa sex saknar `fallbackUrl` i registret (`REVIEW_KNOWN`), så deras CTA länkar i nuläget inte ut till respektive domän. Domänerna ovan är de verifierade officiella — men själva fältet behöver sättas för att länken ska fungera (utanför denna read-only audit).
