# Domän → fel företag — audit av /ai-verktyg/

_Audit-vinkel: verktyg vars angivna domän pekar på FEL FÖRETAG / fel bransch (inte enbart döda/parkerade domäner). Genererad 2026-06-22. Read-only — inga källfiler ändrade._

## Metod

- Hämtade alla **316 sidor** under `/ai-verktyg/` från Supabase (`articles`, live). `affiliate_url` är NULL på alla — utgående domän kommer från `fallbackUrl` i `lib/*.ts` + inline-registret `REVIEW_KNOWN` i `components/templates/ReviewTemplate.tsx` (slå-upp via `resolveToolProfile`).
- **276 löv-verktyg** (sidor med förälder-hub). **264** hade en upplösbar utgående domän och webb-verifierades (verktygsnamn + kategori). **12** saknade domän/var översiktssidor (se nederst).
- Varje verktyg webb-söktes mot sin hub-kategori; domänens faktiska verksamhet jämfördes med hubben. Inga rättningar gissade utan webb-verifiering.

## Sammanfattning

- **FEL DOMÄN (fel bransch/företag):** 3
- **OSÄKER (rätt domän men fel hub-kategori, nedlagd tjänst, eller namn/domän-tvetydighet):** 6
- **OK (webb-verifierade):** 255

## Flaggade verktyg

| slug | hub | angiven domän | vad domänen ÄR | trolig rätt domän | bedömning |
|---|---|---|---|---|---|
| `canva-ai` | ai-bild-verktyg | `udio.com` | Udio — AI-musikgenerator (USA). Helt fel bransch (musik) för ett bildverktyg. | canva.com | **FEL DOMÄN** |
| `klara-ai` | ai-verktyg-ekonomi | `klara.se` | KLARA arkitekter — svensk arkitektbyrå i Karlstad. Fel bransch. | ej verifierad (Klara bokföring ingår i Wint-koncernen) | **FEL DOMÄN** |
| `wint-ai` | ai-verktyg-ekonomi | `wint.ai` | Wint — amerikanskt IoT-bolag för vattenläckagedetektion (NYC). Fel bransch. | wint.se | **FEL DOMÄN** |
| `khroma-design` | ai-bild-verktyg | `khroma.co` | Khroma — AI-färgpaletter för designers (domän korrekt). Ligger i ai-bild-verktyg men genererar inte bilder. | rätt domän — hör hemma under ui-ux | **OSÄKER** |
| `pattern89` | ai-verktyg-marknadsforing | `shutterstock.com` | Shutterstock — generisk stock media. Pattern89 köptes upp 2021 och finns inte kvar som egen produkt. | produkten nedlagd | **OSÄKER** |
| `obviously-ai` | e-handel | `obviously.ai` | Obviously AI (numera Zams) — no-code ML/prediktiv analys (domän korrekt). Svag passning mot e-handel. | rätt domän — svag hub-passning | **OSÄKER** |
| `gamma` | hemsidebyggare | `gamma.app` | Gamma — AI-presentationsverktyg (domän korrekt). Men ligger i hub hemsidebyggare; Gamma är primärt presentationer. | rätt domän — fel hub-kategori | **OSÄKER** |
| `replica-studios` | rost-och-tal | `replicastudios.com` | Replica Studios — AI-röst (domän korrekt). Tjänsten lades ned 2025-06-30. | rätt domän — tjänst nedlagd | **OSÄKER** |
| `synthesis-ai` | utbildning | `synthesis.com` | synthesis.com = Synthesis, mattetutor för barn (passar utbildning). Men namnet "Synthesis AI" syftar på datorseende-/syntetdata-bolaget som ligger på synthesis.ai. | synthesis.ai (om CV-bolaget avses); annars rätt namn = bara "Synthesis" | **OSÄKER** |

### Kommentar till de skarpa fynden

- **`canva-ai` → udio.com** — tydligaste felet. Canva (bildhub) länkar till Udio, en AI-musiktjänst. Klassiskt klipp-och-klistra-fel; rätt domän är `canva.com`.
- **`wint-ai` → wint.ai** — frö-exemplet, bekräftat. wint.ai = amerikanskt IoT-bolag för vattenläckage; svenska bokföringstjänsten Wint (Göteborg) ligger på `wint.se`.
- **`klara-ai` → klara.se** — klara.se är **KLARA arkitekter** (Karlstad), inte bokföring. Klara-bokföring ingår i Wint-koncernen; ingen ren bokförings-domän kunde webb-verifieras, så rätt domän lämnas öppen.
- **`synthesis-ai`** — tvetydigt: synthesis.com är en mattetutor (passar utbildning), men namnet "Synthesis AI" matchar datorseende-bolaget på synthesis.ai. Antingen är namnet fel eller domänen.
- **`pattern89`** och **`replica-studios`** — domänerna pekar rätt men produkterna är nedlagda/uppslukade (gränsar till FAKE/dött, överlappar tidigare död-domän-audit).
- **`gamma`, `obviously-ai`, `khroma-design`** — domänen är korrekt, men verktyget ligger i fel hub-kategori (ej domän→fel-företag i strikt mening).

## Verktyg utan auditerbar domän

Dessa hade ingen `fallbackUrl` i registret (utgående CTA saknar/använder default) — kunde inte domän-auditeras och bör kollas separat:

`leonardo-ai`, `ideogram`, `playground-ai`, `bing-image-creator`, `flux`, `stable-diffusion` (alla i bild-hubben).

Översiktssidor (inte verktyg, ingen domän): `ai-video-verktyg`, `fotograf-video`, `gratis-ai-video`, `tiktok`, `designer`, `ai-bilder`.

## Alla webb-verifierade OK (255)

Domänen tillhör verktyget och matchar hubben. (Noterbart: `casetext`/`kira-systems` redirectar till Thomson Reuters/Litera men domänen tillhör fortfarande produkten; `codeium`→Windsurf/Devin, `cron`→Notion Calendar — rätt bolagslinje.)

| slug | hub | domän |
|---|---|---|
| `deepseek` | ai-assistenter | `deepseek.com` |
| `grok` | ai-assistenter | `grok.com` |
| `meta-ai` | ai-assistenter | `meta.ai` |
| `microsoft-copilot` | ai-assistenter | `copilot.microsoft.com` |
| `mistral-le-chat` | ai-assistenter | `chat.mistral.ai` |
| `perplexity` | ai-assistenter | `perplexity.ai` |
| `pi-ai` | ai-assistenter | `pi.ai` |
| `activepieces` | ai-automation | `activepieces.com` |
| `bardeen` | ai-automation | `bardeen.ai` |
| `make` | ai-automation | `make.com` |
| `n8n` | ai-automation | `n8n.io` |
| `pipedream` | ai-automation | `pipedream.com` |
| `power-automate` | ai-automation | `powerautomate.microsoft.com` |
| `relay-app` | ai-automation | `relay.app` |
| `workflows` | ai-automation | `zapier.com` |
| `zapier-ai` | ai-automation | `zapier.com` |
| `adobe-firefly` | ai-bild-verktyg | `adobe.com` |
| `dalle-3` | ai-bild-verktyg | `openai.com` |
| `looka-design` | ai-bild-verktyg | `looka.com` |
| `luminar-neo-bredig` | ai-bild-verktyg | `skylum.com` |
| `midjourney` | ai-bild-verktyg | `midjourney.com` |
| `removebg-bredig` | ai-bild-verktyg | `remove.bg` |
| `topaz-photo-bredig` | ai-bild-verktyg | `topazlabs.com` |
| `amazon-codewhisperer` | ai-kod-verktyg | `aws.amazon.com` |
| `codeium` | ai-kod-verktyg | `codeium.com` |
| `cursor-ai` | ai-kod-verktyg | `cursor.com` |
| `github-copilot` | ai-kod-verktyg | `github.com` |
| `jetbrains-ai` | ai-kod-verktyg | `jetbrains.com` |
| `pieces` | ai-kod-verktyg | `pieces.app` |
| `replit-ai` | ai-kod-verktyg | `replit.com` |
| `sourcegraph-cody` | ai-kod-verktyg | `sourcegraph.com` |
| `tabnine` | ai-kod-verktyg | `tabnine.com` |
| `windsurf` | ai-kod-verktyg | `codeium.com` |
| `adobe-podcast` | ai-ljud-och-musik | `podcast.adobe.com` |
| `aiva` | ai-ljud-och-musik | `aiva.ai` |
| `boomy` | ai-ljud-och-musik | `boomy.com` |
| `descript-ljud` | ai-ljud-och-musik | `descript.com` |
| `elevenlabs` | ai-ljud-och-musik | `elevenlabs.io` |
| `lalal-ai` | ai-ljud-och-musik | `lalal.ai` |
| `mubert` | ai-ljud-och-musik | `mubert.com` |
| `soundraw` | ai-ljud-och-musik | `soundraw.io` |
| `splice` | ai-ljud-och-musik | `splice.com` |
| `suno-ai` | ai-ljud-och-musik | `suno.com` |
| `udio` | ai-ljud-och-musik | `udio.com` |
| `chatgpt` | ai-text-verktyg | `chat.openai.com` |
| `claude` | ai-text-verktyg | `claude.ai` |
| `copy-ai` | ai-text-verktyg | `copy.ai` |
| `gemini` | ai-text-verktyg | `gemini.google.com` |
| `jasper-ai` | ai-text-verktyg | `jasper.ai` |
| `writesonic` | ai-text-verktyg | `writesonic.com` |
| `billogram-ai` | ai-verktyg-ekonomi | `billogram.com` |
| `bokio-ai` | ai-verktyg-ekonomi | `bokio.se` |
| `deloitte-ai` | ai-verktyg-ekonomi | `www2.deloitte.com` |
| `dooer` | ai-verktyg-ekonomi | `dooer.com` |
| `ey-ai` | ai-verktyg-ekonomi | `ey.com` |
| `fortnox-ai` | ai-verktyg-ekonomi | `fortnox.se` |
| `fortnox-redovisning` | ai-verktyg-ekonomi | `fortnox.se` |
| `kpmg-ai` | ai-verktyg-ekonomi | `kpmg.com` |
| `pleo-ai` | ai-verktyg-ekonomi | `pleo.io` |
| `pw-ai` | ai-verktyg-ekonomi | `pwc.com` |
| `quickbooks-ai` | ai-verktyg-ekonomi | `quickbooks.intuit.com` |
| `speedledger-ai` | ai-verktyg-ekonomi | `speedledger.se` |
| `taxdome-ai` | ai-verktyg-ekonomi | `taxdome.com` |
| `visma-ai` | ai-verktyg-ekonomi | `vismaspcs.se` |
| `xero-ai` | ai-verktyg-ekonomi | `xero.com` |
| `casetext` | ai-verktyg-juridik | `casetext.com` |
| `contractpodai` | ai-verktyg-juridik | `contractpodai.com` |
| `ebrevia` | ai-verktyg-juridik | `ebrevia.com` |
| `harvey-ai` | ai-verktyg-juridik | `harvey.ai` |
| `ironclad-ai` | ai-verktyg-juridik | `ironcladapp.com` |
| `kira-systems` | ai-verktyg-juridik | `kirasystems.com` |
| `legalzoom-ai` | ai-verktyg-juridik | `legalzoom.com` |
| `lexis-ai` | ai-verktyg-juridik | `lexisnexis.com` |
| `luminance` | ai-verktyg-juridik | `luminance.com` |
| `spellbook` | ai-verktyg-juridik | `spellbook.legal` |
| `aisera` | ai-verktyg-kundservice | `aisera.com` |
| `chatbot-com` | ai-verktyg-kundservice | `chatbot.com` |
| `drift` | ai-verktyg-kundservice | `drift.com` |
| `forethought` | ai-verktyg-kundservice | `forethought.ai` |
| `freshdesk-ai` | ai-verktyg-kundservice | `freshworks.com` |
| `hubspot-ai` | ai-verktyg-kundservice | `hubspot.com` |
| `intercom-ai` | ai-verktyg-kundservice | `intercom.com` |
| `salesforce-einstein` | ai-verktyg-kundservice | `salesforce.com` |
| `zendesk-ai` | ai-verktyg-kundservice | `zendesk.com` |
| `adcreative-ai` | ai-verktyg-marknadsforing | `adcreative.ai` |
| `ahrefs-ai` | ai-verktyg-marknadsforing | `ahrefs.com` |
| `albert-ai` | ai-verktyg-marknadsforing | `albert.ai` |
| `anyword` | ai-verktyg-marknadsforing | `anyword.com` |
| `buffer-ai` | ai-verktyg-marknadsforing | `buffer.com` |
| `clearscope` | ai-verktyg-marknadsforing | `clearscope.io` |
| `contentatscale` | ai-verktyg-marknadsforing | `contentatscale.ai` |
| `fedica` | ai-verktyg-marknadsforing | `fedica.com` |
| `flick-ai` | ai-verktyg-marknadsforing | `flick.social` |
| `frase-io` | ai-verktyg-marknadsforing | `frase.io` |
| `hootsuite-ai` | ai-verktyg-marknadsforing | `hootsuite.com` |
| `hypotenuse-ai` | ai-verktyg-marknadsforing | `hypotenuse.ai` |
| `jasper-content` | ai-verktyg-marknadsforing | `jasper.ai` |
| `koala-writer` | ai-verktyg-marknadsforing | `koala.sh` |
| `lately-ai` | ai-verktyg-marknadsforing | `lately.ai` |
| `madgicx` | ai-verktyg-marknadsforing | `madgicx.com` |
| `marketmuse` | ai-verktyg-marknadsforing | `marketmuse.com` |
| `motionapp` | ai-verktyg-marknadsforing | `motionapp.com` |
| `neuronwriter` | ai-verktyg-marknadsforing | `neuronwriter.com` |
| `ocoya` | ai-verktyg-marknadsforing | `ocoya.com` |
| `pencil-ai` | ai-verktyg-marknadsforing | `trypencil.com` |
| `persado` | ai-verktyg-marknadsforing | `persado.com` |
| `postwise` | ai-verktyg-marknadsforing | `postwise.ai` |
| `predis-ai` | ai-verktyg-marknadsforing | `predis.ai` |
| `rankmath-ai` | ai-verktyg-marknadsforing | `rankmath.com` |
| `revealbot` | ai-verktyg-marknadsforing | `revealbot.com` |
| `rytr-content` | ai-verktyg-marknadsforing | `rytr.me` |
| `screaming-frog-ai` | ai-verktyg-marknadsforing | `screamingfrog.co.uk` |
| `semrush-ai` | ai-verktyg-marknadsforing | `semrush.com` |
| `smartly-io` | ai-verktyg-marknadsforing | `smartly.io` |
| `surfer-seo` | ai-verktyg-marknadsforing | `surferseo.com` |
| `taplio` | ai-verktyg-marknadsforing | `taplio.com` |
| `beamery` | ai-verktyg-rekrytering | `beamery.com` |
| `eightfold-ai` | ai-verktyg-rekrytering | `eightfold.ai` |
| `fetcher` | ai-verktyg-rekrytering | `fetcher.ai` |
| `greenhouse-ai` | ai-verktyg-rekrytering | `greenhouse.com` |
| `hirevue` | ai-verktyg-rekrytering | `hirevue.com` |
| `lever-ai` | ai-verktyg-rekrytering | `lever.co` |
| `paradox` | ai-verktyg-rekrytering | `paradox.ai` |
| `pymetrics` | ai-verktyg-rekrytering | `harver.com` |
| `seekout` | ai-verktyg-rekrytering | `seekout.com` |
| `workday-ai` | ai-verktyg-rekrytering | `workday.com` |
| `attio` | crm | `attio.com` |
| `breeze-ai` | crm | `hubspot.com` |
| `close-ai` | crm | `close.com` |
| `folk` | crm | `folk.app` |
| `freshsales-ai` | crm | `freshworks.com` |
| `monday-crm-ai` | crm | `monday.com` |
| `pipedrive-ai` | crm | `pipedrive.com` |
| `zoho-ai` | crm | `zoho.com` |
| `akkio` | dataanalys | `akkio.com` |
| `datarobot` | dataanalys | `datarobot.com` |
| `h2o-ai` | dataanalys | `h2o.ai` |
| `julius-ai` | dataanalys | `julius.ai` |
| `looker-ai` | dataanalys | `looker.com` |
| `polymer` | dataanalys | `polymersearch.com` |
| `power-bi-copilot` | dataanalys | `powerbi.microsoft.com` |
| `rows-ai` | dataanalys | `rows.com` |
| `tableau-ai` | dataanalys | `tableau.com` |
| `adobe-acrobat-ai` | dokumenthantering | `adobe.com` |
| `chatpdf` | dokumenthantering | `chatpdf.com` |
| `docsumo` | dokumenthantering | `docsumo.com` |
| `docusign-ai` | dokumenthantering | `docusign.com` |
| `humata` | dokumenthantering | `humata.ai` |
| `kognitos` | dokumenthantering | `kognitos.com` |
| `nanonets` | dokumenthantering | `nanonets.com` |
| `pdf-ai` | dokumenthantering | `pdf.ai` |
| `rossum` | dokumenthantering | `rossum.ai` |
| `carthook` | e-handel | `carthook.com` |
| `klaviyo-ai` | e-handel | `klaviyo.com` |
| `nosto` | e-handel | `nosto.com` |
| `octane-ai` | e-handel | `octaneai.com` |
| `rebuy` | e-handel | `rebuyengine.com` |
| `shopify-ai` | e-handel | `shopify.com` |
| `tidio` | e-handel | `tidio.com` |
| `woocommerce-ai` | e-handel | `woocommerce.com` |
| `yotpo-ai` | e-handel | `yotpo.com` |
| `activecampaign-ai` | e-postmarknadsforing | `activecampaign.com` |
| `brevo-ai` | e-postmarknadsforing | `brevo.com` |
| `hubspot-email` | e-postmarknadsforing | `hubspot.com` |
| `instantly-ai` | e-postmarknadsforing | `instantly.ai` |
| `lavender` | e-postmarknadsforing | `lavender.ai` |
| `lemlist` | e-postmarknadsforing | `lemlist.com` |
| `mailchimp-ai` | e-postmarknadsforing | `mailchimp.com` |
| `smartlead` | e-postmarknadsforing | `smartlead.ai` |
| `warmer-ai` | e-postmarknadsforing | `warmer.ai` |
| `ai-kod` | gratis | `codeium.com` |
| `ai-text` | gratis | `chat.openai.com` |
| `10web` | hemsidebyggare | `10web.io` |
| `durable` | hemsidebyggare | `durable.co` |
| `framer-ai` | hemsidebyggare | `framer.com` |
| `godaddy-ai` | hemsidebyggare | `godaddy.com` |
| `hostinger-ai` | hemsidebyggare | `hostinger.com` |
| `jimdo-ai` | hemsidebyggare | `jimdo.com` |
| `squarespace-ai` | hemsidebyggare | `squarespace.com` |
| `webflow-ai` | hemsidebyggare | `webflow.com` |
| `wix-ai` | hemsidebyggare | `wix.com` |
| `avoma` | motesverktyg | `avoma.com` |
| `fathom` | motesverktyg | `fathom.video` |
| `fireflies-ai` | motesverktyg | `fireflies.ai` |
| `krisp` | motesverktyg | `krisp.ai` |
| `meetgeek` | motesverktyg | `meetgeek.ai` |
| `notion-ai` | motesverktyg | `notion.so` |
| `otter-ai` | motesverktyg | `otter.ai` |
| `sembly` | motesverktyg | `sembly.ai` |
| `tl-dv` | motesverktyg | `tldv.io` |
| `zoom-ai` | motesverktyg | `zoom.com` |
| `deepl` | oversattning | `deepl.com` |
| `deepl-write` | oversattning | `deepl.com` |
| `google-translate-ai` | oversattning | `translate.google.com` |
| `lokalise-ai` | oversattning | `lokalise.com` |
| `modernmt` | oversattning | `modernmt.com` |
| `phrase` | oversattning | `phrase.com` |
| `smartcat` | oversattning | `smartcat.com` |
| `unbabel` | oversattning | `unbabel.com` |
| `alitu` | podcast-ljudredigering | `alitu.com` |
| `auphonic` | podcast-ljudredigering | `auphonic.com` |
| `buzzsprout-ai` | podcast-ljudredigering | `buzzsprout.com` |
| `cleanvoice-ai` | podcast-ljudredigering | `cleanvoice.ai` |
| `descript` | podcast-ljudredigering | `descript.com` |
| `headliner` | podcast-ljudredigering | `headliner.app` |
| `podcastle` | podcast-ljudredigering | `podcastle.ai` |
| `riverside-fm` | podcast-ljudredigering | `riverside.fm` |
| `beautiful-ai` | presentationer | `beautiful.ai` |
| `decktopus` | presentationer | `decktopus.com` |
| `magicslides` | presentationer | `magicslides.app` |
| `pitch` | presentationer | `pitch.com` |
| `plus-ai` | presentationer | `plusai.com` |
| `slidesai` | presentationer | `slidesai.io` |
| `slidesgo-ai` | presentationer | `slidesgo.com` |
| `tome` | presentationer | `tome.app` |
| `akiflow` | produktivitet | `akiflow.com` |
| `cron` | produktivitet | `cron.com` |
| `mem-ai` | produktivitet | `get.mem.ai` |
| `obsidian-ai` | produktivitet | `obsidian.md` |
| `reclaim-ai` | produktivitet | `reclaim.ai` |
| `reflect` | produktivitet | `reflect.app` |
| `sunsama` | produktivitet | `sunsama.com` |
| `todoist-ai` | produktivitet | `todoist.com` |
| `asana-ai` | projektledning | `asana.com` |
| `basecamp-ai` | projektledning | `basecamp.com` |
| `clickup-ai` | projektledning | `clickup.com` |
| `jira-ai` | projektledning | `atlassian.com` |
| `linear-ai` | projektledning | `linear.app` |
| `monday-ai` | projektledning | `monday.com` |
| `motion` | projektledning | `usemotion.com` |
| `trello-ai` | projektledning | `trello.com` |
| `amazon-polly` | rost-och-tal | `aws.amazon.com` |
| `lovo-ai` | rost-och-tal | `lovo.ai` |
| `murf-ai` | rost-och-tal | `murf.ai` |
| `play-ht` | rost-och-tal | `play.ht` |
| `resemble-ai` | rost-och-tal | `resemble.ai` |
| `speechify` | rost-och-tal | `speechify.com` |
| `voicemaker` | rost-och-tal | `voicemaker.in` |
| `wellsaid-labs` | rost-och-tal | `wellsaidlabs.com` |
| `feedhive` | sociala-medier-hub | `feedhive.com` |
| `flick` | sociala-medier-hub | `flick.social` |
| `lately` | sociala-medier-hub | `lately.ai` |
| `publer` | sociala-medier-hub | `publer.com` |
| `figma-ai-ux` | ui-ux | `figma.com` |
| `galileo-ai-ux` | ui-ux | `usegalileo.ai` |
| `uizard-ux` | ui-ux | `uizard.io` |
| `coursera-ai` | utbildning | `coursera.org` |
| `duolingo-ai` | utbildning | `duolingo.com` |
| `grammarly` | utbildning | `grammarly.com` |
| `khan-academy-ai` | utbildning | `khanacademy.org` |
| `khanmigo` | utbildning | `khanmigo.ai` |
| `photomath-ai` | utbildning | `photomath.com` |
| `quizlet-ai` | utbildning | `quizlet.com` |
| `socratic` | utbildning | `socratic.org` |
| `turnitin-ai` | utbildning | `turnitin.com` |

