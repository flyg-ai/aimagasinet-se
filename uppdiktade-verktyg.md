# Uppdiktade / seed-genererade verktyg — audit

> **Read-only.** Inget ändrat i DB eller kod. Genererad av `scripts/audit-fake-tools.ts`
> + `scripts/audit-fake-enrich.ts` + manuella webbsökningar. 276 verktygs­recensioner granskade.

## Metod & huvudslutsats

Alla 276 recensionssidor under `/ai-verktyg/` och `/ai-video/` är **programmatiskt
seedade** (se STEG 2). Det betyder dock **inte** att verktygen är påhittade — de
allra flesta beskriver **riktiga, välkända produkter** (DeepL, Asana, Notion,
HubSpot, Salesforce, Fortnox, Visma, Harvey, Semrush …). Seeden använde alltså
mest korrekta produktnamn och korrekta domäner.

**Det enda klart uppdiktade innehållet:** `accountingai` + `accountingai-pro`
(samma parkerade domän, generisk "fyllnads"-profil). `reconcile-ai` är osäker.

Signalvärde efter kalibrering:
- **Parkerad/död fallback-domän** = stark signal (men bara `accountingai.com` var faktiskt parkerad).
- `GUESS-DOMAIN`/`NO-LOGO` = **brus** — slår på nästan alla (riktiga verktygs domäner härleds naturligt ur namnet; loggor saknas generellt, se separat bild-audit).
- **Filler-signatur i profiltexten** ("Generisk AI-…", "Mindre etablerat", company == brand) = pekar ut `accountingai`/`accountingai-pro` unikt.

---

## STEG 1 — Döda / parkerade fallback-URL:er

Alla 276 recensioner har `affiliate_url = NULL`, så CTA-knappen använder
`fallbackUrl` (från `REVIEW_KNOWN`-profilen) med `rel="nofollow noopener noreferrer"`.
Probe med browser-UA, följer redirects. Endast dessa 7 gav anomali:

| Slug | fallbackUrl | HTTP | Tolkning | Verdikt |
|---|---|---|---|---|
| `accountingai` | https://accountingai.com | 200, **114 b stub** | **Parkerad** (GoDaddy JS-lander) | **FAKE** |
| `accountingai-pro` | https://accountingai.com | 200, **114 b stub** | **Parkerad** (samma domän) | **FAKE** |
| `reconcile-ai` | https://reconcile.com | 200 | Live men **inte** den beskrivna produkten | **OSÄKER** |
| `drift` | https://www.drift.com | 200 | Live (Drift, uppköpt av Salesloft) | REAL |
| `eightfold-ai` | https://eightfold.ai | 200 | Live (Eightfold AI) | REAL |
| `smartlead` | https://www.smartlead.ai | 200 | Live (träffen "for **Sale**s" i title var falsklarm) | REAL |
| `height` | https://height.app | curl 000 | Bot-block; **riktig produkt men nedlagd 2025-09-24** | REAL (nedlagd) |
| `play-ht` | https://play.ht | curl 000 | Bot-block; live (PlayHT/PlayAI) | REAL |

> Ingen **riktig** produkt pekar på en parkerad/felaktig domän. Den enda parkerade
> domänen (`accountingai.com`) tillhör det uppdiktade verktyget.

---

## STEG 2 — Seed-ursprung

Hela `/ai-verktyg/`-korpusen är seed-genererad i klustrade batchar. `created_at`:

| Datum | Antal | Notis |
|---|---|---|
| 2026-05-24 | 17 | tidig seed |
| **2026-05-27** | **69** | **flyg-ai yrke-seed** (commit `010dc1b`) — här ligger `accountingai` |
| 2026-05-28 | 11 | designer/fotograf |
| 2026-05-29 | 68 | juridik/kundservice/rekrytering |
| 2026-06-01 | 43 | kategori-hubbar |
| 2026-06-03 | 8 | |
| 2026-06-04 | 60 | kategori-hubbar batch 3 |

Profilkälla (var `REVIEW_KNOWN`-datan definieras i koden):

| Källa (lib-fil) | Antal | |
|---|---|---|
| `category-hub-tools.ts` | 68 | |
| `yrke-tools.ts` (27 maj-seed) | 63 | innehåller `accountingai`, `accountingai-pro`, `reconcile-ai` |
| `category-hub-tools-3.ts` | 60 | |
| inline i `ReviewTemplate.tsx` (handskrivna) | 35 | chatgpt, claude m.fl. |
| `yrkes-hub-tools.ts` | 29 | |
| `video-audio-tools.ts` | 13 | |
| `crm-tools.ts` | 8 | |

**Gemensamt seed-mönster (alla 276):** `affiliate_url` NULL (100 %), logga saknas
oftast, AI-genererad brödtext, klustrad `created_at`. Mönstret skiljer alltså
**inte** äkta från påhittat — det måste avgöras per verktyg (STEG 3).

---

## STEG 3 — Verklighetsbedömning (webbsökt)

- **`accountingai` → FAKE.** Sökning på "AccountingAI / accountingai.com" ger ingen
  sådan produkt; riktiga AI-bokföringsverktyg är Zeni, Docyt, AI Accountant,
  KeeBooks. Domänen är parkerad. Profilen är fyllnad ("Generisk AI-bokföring …",
  "Mindre etablerat", company == brand).
- **`accountingai-pro` → FAKE.** "Pro-versionen av AccountingAI" — samma påhittade
  varumärke, samma parkerade domän.
- **`reconcile-ai` → OSÄKER.** Den beskrivna produkten ("Reconcile, NY, grundat
  2021, automatisk avstämning") återfinns inte. `reconcile.com` är en levande men
  orelaterad sajt; `getreconcile.com` är en AI-konsultbyrå, inte ett
  avstämningsverktyg. Riktiga avstämningsverktyg: Trintech, FloQast, Numeric,
  BlackLine. Sannolikt påhittat, men domänen lever → manuell koll.
- Övriga 273 → **REAL** (kända produkter; stickprov + namngranskning av samtliga).

---

## Tre åtgärdsgrupper

### 🔴 FAKE — avpublicera / 410
| Slug | Path | Skäl |
|---|---|---|
| `accountingai` | `/ai-verktyg/accountingai/` | Påhittat varumärke, parkerad domän |
| `accountingai-pro` | `/ai-verktyg/accountingai-pro/` | Påhittat varumärke, parkerad domän |

### 🟡 REAL men fel/död domän — fixa URL
*(ingen)* — Ingen riktig produkt hittades med parkerad/felaktig fallback-domän.
`drift.com` lever (Drift → Salesloft); `height.app`/`play.ht` blockerar bara bottar.

### ⚪ OSÄKER — manuell koll
| Slug | Path | Skäl |
|---|---|---|
| `reconcile-ai` | `/ai-verktyg/reconcile-ai/` | Beskriven produkt återfinns inte; `reconcile.com` lever men orelaterad |

### ℹ️ Bonus-fynd (ej påhittat, men värt en titt)
- **`height`** (`/ai-verktyg/height/`) — riktig produkt men **lades ned 2025-09-24**.
  Recension av ett dött verktyg → överväg avpublicering (samma som FAKE-hantering,
  men av annan orsak).

---

## Beroenden inför ev. borttagning (för senare — inget gjort nu)
Om FAKE-sidorna ska bort måste även dessa referenser städas, annars dinglar de:
- `app/[...slug]/page.tsx` → `CURATED_HUB_TOOL_SLUGS`: `accountingai` (bokföring),
  `accountingai-pro` + `reconcile-ai` (redovisning) ligger i hub-topplistorna.
- `redirects.generated.mjs` / `redirects.flatten.generated.mjs`: gamla yrke-URL:er
  301:ar in till `/ai-verktyg/accountingai(-pro)` — bör peka om eller 410:as.
- Profildata i `lib/yrke-tools.ts` (raderna för slug ovan).
