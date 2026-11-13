# Yrkesguider: behåll & differentiera vs 301

> **Read-only bedömning.** Inget ändrat. Underlag: `content_mdx` för de fyra
> guiderna + faktiska hub-medlemmar (via `parent_slug`) i DB.

De fyra guiderna ligger som barn-poster (type=post) direkt under sin närmaste
hub. Alla fyra är **arbetsflödes-/how-to-guider** ("hur du arbetar som X med AI")
medan hubbarna är **verktygs-topplistor** (ranking + recensioner). Det är två
olika format — guiderna länkar uppåt till hubben för verktygsval.

## Hub-medlemmar (referens, via parent_slug)
| Hub | Verktyg i hubben |
|---|---|
| `/ai-verktyg/ai-kod-verktyg` | amazon-codewhisperer, codeium, cursor-ai, github-copilot, jetbrains-ai, pieces, replit-ai, sourcegraph-cody, tabnine, windsurf |
| `/ai-verktyg/rekrytering` | beamery, eightfold-ai, fetcher, greenhouse-ai, hirevue, lever-ai, paradox, pymetrics, seekout, workday-ai |
| `/ai-verktyg/crm` | attio, breeze-ai, close-ai, folk, freshsales-ai, monday-crm-ai, pipedrive-ai, zoho-ai |
| `/ai-verktyg/utbildning` | coursera-ai, duolingo-ai, grammarly, khan-academy-ai, khanmigo, photomath-ai, quizlet-ai, socratic, synthesis-ai, turnitin-ai |

---

## hr-ansvarig — `/ai-verktyg/rekrytering/hr`
- **Närmaste hub:** `/ai-verktyg/rekrytering`. **Relation:** HR är **bredare** än hubben — rekrytering är bara en av fem delar (guiden täcker även onboarding, intern kommunikation/policy, kompetensutveckling). Rekrytering ⊂ HR.
- **Yrkesspecifikt?** **Ja, starkt.** CV-screening-arbetsflöde, onboarding-planer, policy-omskrivning till "medarbetarsvenska", partiskhet/bias i historisk rekryteringsdata, GDPR + personuppgiftsbiträdesavtal för kandidatdata, analys av medarbetarundersökningar.
- **Egna verktyg som hubben saknar:** **Teamtailor, Workable** (rekrytering, ej i hubben), **LinkedIn Learning, Degreed, 360Learning** (L&D), **Notion AI, Microsoft Copilot/Copilot Studio** (onboarding/produktivitet), Claude/ChatGPT (text). Hubben har bara HireVue av de nämnda.
- **Bedömning:** ✅ **BEHÅLL & differentiera.** Bredare än hubben, tydligt HR-specifikt värde, listar verktyg och vinklar hubben inte har.

## larare — `/ai-verktyg/utbildning/larare`
- **Närmaste hub:** `/ai-verktyg/utbildning`. **Relation:** **Annat fokus** än hubben. Hubben listar EdTech-/inlärnings-appar för elever/självstudier (Duolingo, Khan Academy, Quizlet, Photomath). Guiden handlar om **lärarens produktivitet** (planering, material, bedömning) med generella verktyg. **Noll verktygsöverlapp** med hubben.
- **Yrkesspecifikt?** **Ja, starkt.** Lektionsplanering enligt Lgr22, prov/bedömningsmatriser, individanpassning (dyslexi, högpresterande), betygssättning som **myndighetsutövning**, elevdata/åtgärdsprogram + kommunala AI-riktlinjer.
- **Egna verktyg som hubben saknar:** **ChatGPT, Claude, Midjourney, Adobe Firefly, Gamma, Beautiful.ai** — samtliga saknas i utbildnings-hubben (som har EdTech-appar i stället).
- **Bedömning:** ✅ **BEHÅLL & differentiera.** Helt annan vinkel och målgrupp än hubben; starkt lärarspecifikt; inget innehållsöverlapp.

## saljare — `/ai-verktyg/crm/saljare`
- **Närmaste hub:** `/ai-verktyg/crm`. **Relation:** Säljare är **bredare** än CRM — guiden täcker hela säljcykeln; CRM är ett av fem steg (prospektering, säljmejl, samtalsanalys, prognos, CRM).
- **Yrkesspecifikt?** **Ja, starkt.** Lead scoring mot ideal kundprofil, personaliserade säljmejl i skala, samtalsanalys (taltid/invändningar), pipeline-forecasting, CRM-hygien.
- **Egna verktyg som hubben saknar:** **Apollo.io, Clay** (prospektering), **Gong, Chorus, Fireflies.ai** (samtalsintelligens), **Jasper** (mejl), **Salesforce Einstein** (forecasting). Inget av dessa finns i CRM-hubben (som är rena CRM-plattformar).
- **Bedömning:** ✅ **BEHÅLL & differentiera.** Bredare än hubben, fullt säljcykel-perspektiv, många verktyg hubben inte har.

## utvecklare — `/ai-verktyg/ai-kod-verktyg/utvecklare`
- **Närmaste hub:** `/ai-verktyg/ai-kod-verktyg`. **Relation:** **Samma scope/målgrupp** som hubben (utvecklare som kodar med AI). Skillnaden är enbart **format** — workflow vs topplista.
- **Yrkesspecifikt?** **Ja i vinkel**, men medvetet **verktygsagnostiskt** ("Poängen är inte vilket verktyg du väljer"). Utvecklarspecifika moment: kodkomplettering, agentisk kodning, refaktorering, felsökning av stack traces/race conditions, testgenerering (Jest/Pytest/JUnit), JSDoc/docstrings, AI-stödd code review.
- **Egna verktyg som hubben saknar:** **Inga** — guiden namnger inga verktyg alls, bara länkar till hubbarna `ai-kod-verktyg` och `ai-text-verktyg`.
- **Bedömning:** ✅ **BEHÅLL & differentiera — men svagast av de fyra.** Innehållet duplicerar inte hubben (workflow ≠ ranking), men differentieringen vilar **helt** på how-to-vinkeln; den tillför inga unika verktyg och har samma målgrupp som hubben. Detta är den enda som ligger nära en 301-kandidat. **Rekommendation om den behålls:** håll den renodlat som arbetsflöde och låt hubben äga verktygsvalet — om den börjar lista verktyg blir den överlappande och då är 301 → hubben rätt.

---

## Sammanfattning
| Yrke | Närmaste hub | Relation till hub | Yrkesspecifikt | Unika verktyg vs hub | Bedömning |
|---|---|---|---|---|---|
| hr-ansvarig | rekrytering | Bredare (rekr ⊂ HR) | Starkt | Teamtailor, Workable, L&D-verktyg m.fl. | ✅ BEHÅLL |
| larare | utbildning | Annan vinkel (lärare vs elev) | Starkt | ChatGPT, Midjourney, Gamma m.fl. (0 överlapp) | ✅ BEHÅLL |
| saljare | crm | Bredare (hela säljcykeln) | Starkt | Apollo, Clay, Gong, Fireflies m.fl. | ✅ BEHÅLL |
| utvecklare | ai-kod-verktyg | Samma scope, annat format | Vinkel ja, verktygsagnostisk | Inga | ✅ BEHÅLL (svagast; närmast 301) |

**Slutsats:** Alla fyra har eget yrkesvärde och bör behållas — tre av dem (hr, larare, saljare) är tydligt bredare/annorlunda än sin hub och listar verktyg hubben saknar. `utvecklare` är gränsfallet: behåll som arbetsflödesguide, men det är den som skulle 301:as först om konsolidering någon gång blir aktuellt.
