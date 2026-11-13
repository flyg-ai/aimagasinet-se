# Kannibalisering: yrkessidor vs kategori-hubbar

**Read-only-analys** (inget ändrat). Alla 10 yrkesguider ligger som `type=post` på djup 3 under en kategori-hub: `/ai-verktyg/<kategori>/<yrke>/`. De har `parent_slug=null` och renderas med ArticleTemplate (ingen topplista). Hubbarna är `type=page` med verktygs-topplista.

**Verktyg på yrkessidan** = antal *specifika verktygsrecensioner* (djup-2 tool-slugs) som länkas i brödtexten — inte hub-/kategori-länkar. **Verktyg på hubben** = topplistans storlek (kuraterad lista där sådan finns, annars antal `parent_slug`-barn).

> Genomgående mönster: yrkesguiderna länkar nästan **inga** egna verktyg — de pekar mest på själva hubben. De delar alltså i praktiken ingen verktygs-uppsättning med hubben; överlappet är **topikalt/sökord**, inte verktygslistor. Varje guide har dock unik redaktionell prosa (~5–6k tecken).

## Översikt

| Kategori-hub | Yrkessida | Verktyg hub | Verktyg yrke | Delar verktyg? | Unikt på yrkessidan | Synonymi | Rekommendation |
|---|---|---|---|---|---|---|---|
| `/ai-verktyg/ai-kod-verktyg` | `/ai-verktyg/ai-kod-verktyg/utvecklare` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Nära publik (utvecklare = användare av kodverktyg), men distinkt intention | **Behåll + differentiera (canonical kvar)** |
| `/ai-verktyg/crm` | `/ai-verktyg/crm/saljare` | 8 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Svag (säljare använder CRM, men annan vinkel) | **Behåll + differentiera** |
| `/ai-verktyg/ekonomi` | `/ai-verktyg/ekonomi/bokforare` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Delroll av ekonomi | **301 yrke → sub-hub /ai-verktyg/ekonomi/bokforing** |
| `/ai-verktyg/ekonomi` | `/ai-verktyg/ekonomi/revisor` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Delroll av ekonomi | **301 yrke → sub-hub /ai-verktyg/ekonomi/redovisning** |
| `/ai-verktyg/juridik` | `/ai-verktyg/juridik/advokat` | 10 | 1 | harvey-ai | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: harvey-ai (finns dock i hubben) | Stark överlapp (advokat utövar juridik) | **301 yrke → hub (merga guidetext först)** |
| `/ai-verktyg/kundservice` | `/ai-verktyg/kundservice/kundtjanst-yrke` | 9 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Synonymer (kundtjänst = kundservice) | **301 yrke → hub** |
| `/ai-verktyg/marknadsforing` | `/ai-verktyg/marknadsforing/marknadsforing-yrke` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Nära synonym (marknadsförare ↔ marknadsföring) | **301 yrke → hub** |
| `/ai-verktyg/rekrytering` | `/ai-verktyg/rekrytering/hr` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~5k tecken); unika verktyg: inga | Överlapp (HR bredare än rekrytering) | **301 yrke → hub** |
| `/ai-verktyg/rekrytering` | `/ai-verktyg/rekrytering/rekryterare` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~5k tecken); unika verktyg: inga | Nära synonym (rekryterare = person som rekryterar) | **301 yrke → hub** |
| `/ai-verktyg/utbildning` | `/ai-verktyg/utbildning/larare` | 10 | 0 | Nej (0 verktyg) | Ja: redaktionell yrkesguide (~6k tecken); unika verktyg: inga | Delmängd (lärare är en publik inom utbildning) | **301 yrke → hub** |

## Per par — detalj & motivering

### `/ai-verktyg/ai-kod-verktyg/utvecklare`  ↔  `/ai-verktyg/ai-kod-verktyg`

- **Hub:** AI-verktyg för kod – stor jämförelse av de bästa verktygen för utvecklare (2026) — 10 verktyg i topplistan.
- **Yrkessida:** 5950 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Nära publik (utvecklare = användare av kodverktyg), men distinkt intention
- **Rekommendation:** Behåll + differentiera (canonical kvar) — Workflow-guide ≠ verktygsjämförelse. Olika sökintention. Behåll men länka tydligt till hubben och undvik samma title-keywords.

### `/ai-verktyg/crm/saljare`  ↔  `/ai-verktyg/crm`

- **Hub:** Bästa CRM med AI 2026 — kundhantering med AI — 8 verktyg i topplistan.
- **Yrkessida:** 5659 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Svag (säljare använder CRM, men annan vinkel)
- **Rekommendation:** Behåll + differentiera — Säljguide ≠ CRM-verktygslista. Distinkt intention. Behåll, differentiera title/H1.

### `/ai-verktyg/ekonomi/bokforare`  ↔  `/ai-verktyg/ekonomi`

- **Hub:** Bästa AI-verktygen för ekonomi & redovisning 2026 — bokföring, avstämning & bokslut — 10 verktyg i topplistan.
- **Yrkessida:** 5870 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Delroll av ekonomi
- **Rekommendation:** 301 yrke → sub-hub /ai-verktyg/ekonomi/bokforing — Matchar bokförings-sub-hubben exakt. 301 dit, inte till parent.

### `/ai-verktyg/ekonomi/revisor`  ↔  `/ai-verktyg/ekonomi`

- **Hub:** Bästa AI-verktygen för ekonomi & redovisning 2026 — bokföring, avstämning & bokslut — 10 verktyg i topplistan.
- **Yrkessida:** 5586 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Delroll av ekonomi
- **Rekommendation:** 301 yrke → sub-hub /ai-verktyg/ekonomi/redovisning — Mer specifik än parent-hubben. Peka mot redovisnings-sub-hubben hellre än /ekonomi.

### `/ai-verktyg/juridik/advokat`  ↔  `/ai-verktyg/juridik`

- **Hub:** Bästa AI-verktygen för juridik 2026 — avtal, due diligence & rättsutredningar — 10 verktyg i topplistan.
- **Yrkessida:** 5540 tecken redaktionell guide, 1 specifika verktygslänkar (harvey-ai).
- **Delar verktyg?** harvey-ai — finns redan i hubben.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Stark överlapp (advokat utövar juridik)
- **Rekommendation:** 301 yrke → hub (merga guidetext först) — Enda unika verktygslänk (harvey-ai) finns redan i hubben. Behåll guidens prosa genom att lyfta in den i hubben, sedan 301.

### `/ai-verktyg/kundservice/kundtjanst-yrke`  ↔  `/ai-verktyg/kundservice`

- **Hub:** Bästa AI-verktygen för kundservice 2026 — chatbottar, e-postsvar & röst-AI — 9 verktyg i topplistan.
- **Yrkessida:** 5654 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Synonymer (kundtjänst = kundservice)
- **Rekommendation:** 301 yrke → hub — Ren synonym. Hubben är money-page med topplista; yrkesguiden listar inga egna verktyg. Slå ihop ev. guidetext i hubben, 301:a sidan.

### `/ai-verktyg/marknadsforing/marknadsforing-yrke`  ↔  `/ai-verktyg/marknadsforing`

- **Hub:** Bästa AI-verktygen för marknadsföring 2026 — content, SEO, annonser & sociala medier — 10 verktyg i topplistan.
- **Yrkessida:** 6129 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Nära synonym (marknadsförare ↔ marknadsföring)
- **Rekommendation:** 301 yrke → hub — Samma sökintention. Guiden har 0 egna verktyg. Konsolidera till hubben.

### `/ai-verktyg/rekrytering/hr`  ↔  `/ai-verktyg/rekrytering`

- **Hub:** Bästa AI-verktygen för rekrytering & HR 2026 — CV-screening, jobbannonser & matchning — 10 verktyg i topplistan.
- **Yrkessida:** 5273 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Överlapp (HR bredare än rekrytering)
- **Rekommendation:** 301 yrke → hub — Hubrubriken inkluderar redan "HR". 0 egna verktyg. Konsolidera.

### `/ai-verktyg/rekrytering/rekryterare`  ↔  `/ai-verktyg/rekrytering`

- **Hub:** Bästa AI-verktygen för rekrytering & HR 2026 — CV-screening, jobbannonser & matchning — 10 verktyg i topplistan.
- **Yrkessida:** 5126 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Nära synonym (rekryterare = person som rekryterar)
- **Rekommendation:** 301 yrke → hub — Hubben "rekrytering & HR" täcker redan rollen. Guiden listar 0 verktyg. Konsolidera.

### `/ai-verktyg/utbildning/larare`  ↔  `/ai-verktyg/utbildning`

- **Hub:** Bästa AI-verktyg för utbildning 2026 — AI för lärare & elever — 10 verktyg i topplistan.
- **Yrkessida:** 5563 tecken redaktionell guide, 0 specifika verktygslänkar.
- **Delar verktyg?** Nej — yrkessidan listar inga egna verktyg, bara hub-/kategori-länkar.
- **Unikt innehåll/verktyg?** Unik prosa: Ja (yrkesspecifik workflow-guide). Unika verktyg hubben saknar: Nej.
- **Synonymi:** Delmängd (lärare är en publik inom utbildning)
- **Rekommendation:** 301 yrke → hub — Hubben riktar sig redan "för lärare & elever". 0 egna verktyg. Konsolidera.
