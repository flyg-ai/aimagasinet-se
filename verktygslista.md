# Publicerade verktygssidor (tool reviews)

**Genererad:** läsning av Supabase (read-only). **Totalt: 268 verktygssidor** i 27 hubbar.

Urval: `type=page`, publicerad, path under `/ai-verktyg/`, klassificerad som `review` av `app/[...slug]/page.tsx` `classify()` — dvs. djup-2 med `parent_slug ≠ ai-verktyg`. Kategori-hubbar, sub-hubbar (seo, bokföring …), `/gratis/*`, `/foretag/*` och yrkesroll-sidor är exkluderade (de är inte verktygssidor).

**Kolumner:** namn · slug · hub (`parent_slug`) · CTA (`affiliate_url`, annars `fallbackUrl` ur profil-libs) · äkta brödtext.
**"Äkta brödtext"** = *Nej* om kroppen är en tunn auto-stub (≤1 `<h2>` **och** <1500 tecken: betyg + "Vår bedömning" + kriterielista monterad ur profildata), annars *Ja*. → Ja: 194 · Nej: 74.

> Obs: `affiliate_url` är **NULL för samtliga 268** verktygssidor i DB — CTA-kolumnen visar därför genomgående `fallbackUrl` från profil-biblioteken.
>
> ⚠️ 6 verktyg saknar **både** affiliate_url och fallbackUrl (ingen REVIEW_KNOWN-profil, ingen fuzzy-match). På live renderas då en **död, oklickbar "Prova X"-knapp** (AffiliateBtn faller tillbaka på `<span>` utan href). Bör åtgärdas: `leonardo-ai`, `ideogram`, `playground-ai`, `bing-image-creator`, `flux`, `stable-diffusion`.
>
> ⚠️ 1 verktyg får sin CTA via `lookupKnown`:s **fuzzy substring-matchning** (ingen exakt profil) — opålitligt. Notabel bugg: `canva-ai` ("Canva AI (Magic Studio)") matchar nyckeln `udio` (st**udio**) och pekar därför fel, mot udio.com. Markerade med `⚠️fuzzy→<nyckel>` nedan: `canva-ai`.

## Antal per hub

| Hub (`parent_slug`) | Antal |
|---|---|
| ai-assistenter | 7 |
| ai-automation | 9 |
| ai-bild-verktyg | 15 |
| ai-kod-verktyg | 10 |
| ai-ljud-och-musik | 11 |
| ai-text-verktyg | 6 |
| ai-verktyg-ekonomi | 17 |
| ai-verktyg-juridik | 10 |
| ai-verktyg-kundservice | 9 |
| ai-verktyg-marknadsforing | 33 |
| ai-verktyg-rekrytering | 10 |
| crm | 8 |
| dataanalys | 9 |
| dokumenthantering | 9 |
| e-handel | 10 |
| e-postmarknadsforing | 9 |
| hemsidebyggare | 10 |
| motesverktyg | 10 |
| oversattning | 8 |
| podcast-ljudredigering | 8 |
| presentationer | 8 |
| produktivitet | 8 |
| projektledning | 8 |
| rost-och-tal | 9 |
| sociala-medier-hub | 4 |
| ui-ux | 3 |
| utbildning | 10 |
| **TOTALT** | **268** |

## ai-assistenter (7)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| DeepSeek | `deepseek` | ai-assistenter | https://www.deepseek.com | Ja |
| Grok | `grok` | ai-assistenter | https://grok.com | Ja |
| Meta AI | `meta-ai` | ai-assistenter | https://www.meta.ai | Ja |
| Microsoft Copilot | `microsoft-copilot` | ai-assistenter | https://copilot.microsoft.com | Ja |
| Mistral Le Chat | `mistral-le-chat` | ai-assistenter | https://chat.mistral.ai | Ja |
| Perplexity | `perplexity` | ai-assistenter | https://www.perplexity.ai | Ja |
| Pi AI | `pi-ai` | ai-assistenter | https://pi.ai | Ja |

## ai-automation (9)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| ActivePieces | `activepieces` | ai-automation | https://www.activepieces.com | Ja |
| AI Workflow Automation | `workflows` | ai-automation | https://zapier.com | Ja |
| Bardeen | `bardeen` | ai-automation | https://www.bardeen.ai | Ja |
| Make | `make` | ai-automation | https://www.make.com | Ja |
| Microsoft Power Automate | `power-automate` | ai-automation | https://powerautomate.microsoft.com | Ja |
| n8n | `n8n` | ai-automation | https://n8n.io | Ja |
| Pipedream | `pipedream` | ai-automation | https://pipedream.com | Ja |
| Relay.app | `relay-app` | ai-automation | https://www.relay.app | Ja |
| Zapier AI | `zapier-ai` | ai-automation | https://zapier.com | Ja |

## ai-bild-verktyg (15)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Adobe Firefly | `adobe-firefly` | ai-bild-verktyg | https://www.adobe.com/products/firefly.html | Ja |
| Bing Image Creator | `bing-image-creator` | ai-bild-verktyg | (saknas) | Ja |
| Canva AI (Magic Studio) | `canva-ai` | ai-bild-verktyg | https://www.udio.com  ⚠️fuzzy→udio | Ja |
| DALL-E 3 | `dalle-3` | ai-bild-verktyg | https://openai.com/dall-e-3 | Ja |
| Flux | `flux` | ai-bild-verktyg | (saknas) | Ja |
| Ideogram | `ideogram` | ai-bild-verktyg | (saknas) | Ja |
| Khroma | `khroma-design` | ai-bild-verktyg | https://khroma.co | Ja |
| Leonardo AI | `leonardo-ai` | ai-bild-verktyg | (saknas) | Ja |
| Looka | `looka-design` | ai-bild-verktyg | https://looka.com | Ja |
| Luminar Neo AI | `luminar-neo-bredig` | ai-bild-verktyg | https://skylum.com/luminar | Ja |
| Midjourney | `midjourney` | ai-bild-verktyg | https://www.midjourney.com | Ja |
| Playground AI | `playground-ai` | ai-bild-verktyg | (saknas) | Ja |
| Remove.bg | `removebg-bredig` | ai-bild-verktyg | https://www.remove.bg | Ja |
| Stable Diffusion | `stable-diffusion` | ai-bild-verktyg | (saknas) | Ja |
| Topaz Photo AI | `topaz-photo-bredig` | ai-bild-verktyg | https://www.topazlabs.com/topaz-photo-ai | Ja |

## ai-kod-verktyg (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Amazon CodeWhisperer | `amazon-codewhisperer` | ai-kod-verktyg | https://aws.amazon.com/codewhisperer/ | Ja |
| Codeium | `codeium` | ai-kod-verktyg | https://codeium.com | Ja |
| Cursor AI | `cursor-ai` | ai-kod-verktyg | https://www.cursor.com | Ja |
| GitHub Copilot | `github-copilot` | ai-kod-verktyg | https://github.com/features/copilot | Ja |
| JetBrains AI | `jetbrains-ai` | ai-kod-verktyg | https://www.jetbrains.com/ai/ | Ja |
| Pieces | `pieces` | ai-kod-verktyg | https://pieces.app | Ja |
| Replit AI | `replit-ai` | ai-kod-verktyg | https://replit.com | Ja |
| Sourcegraph Cody | `sourcegraph-cody` | ai-kod-verktyg | https://sourcegraph.com/cody | Ja |
| Tabnine | `tabnine` | ai-kod-verktyg | https://www.tabnine.com | Ja |
| Windsurf | `windsurf` | ai-kod-verktyg | https://codeium.com/windsurf | Ja |

## ai-ljud-och-musik (11)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Adobe Podcast | `adobe-podcast` | ai-ljud-och-musik | https://podcast.adobe.com | Ja |
| AIVA | `aiva` | ai-ljud-och-musik | https://www.aiva.ai | Ja |
| Boomy | `boomy` | ai-ljud-och-musik | https://boomy.com | Ja |
| Descript | `descript-ljud` | ai-ljud-och-musik | https://www.descript.com | Ja |
| ElevenLabs | `elevenlabs` | ai-ljud-och-musik | https://elevenlabs.io | Ja |
| Lalal.ai | `lalal-ai` | ai-ljud-och-musik | https://www.lalal.ai | Ja |
| Mubert | `mubert` | ai-ljud-och-musik | https://mubert.com | Ja |
| Soundraw | `soundraw` | ai-ljud-och-musik | https://soundraw.io | Ja |
| Splice | `splice` | ai-ljud-och-musik | https://splice.com | Ja |
| Suno AI | `suno-ai` | ai-ljud-och-musik | https://suno.com | Ja |
| Udio | `udio` | ai-ljud-och-musik | https://www.udio.com | Ja |

## ai-text-verktyg (6)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| ChatGPT | `chatgpt` | ai-text-verktyg | https://chat.openai.com | Ja |
| Claude | `claude` | ai-text-verktyg | https://claude.ai | Ja |
| Copy.ai | `copy-ai` | ai-text-verktyg | https://www.copy.ai | Ja |
| Gemini | `gemini` | ai-text-verktyg | https://gemini.google.com | Ja |
| Jasper AI | `jasper-ai` | ai-text-verktyg | https://www.jasper.ai | Ja |
| Writesonic | `writesonic` | ai-text-verktyg | https://writesonic.com | Ja |

## ai-verktyg-ekonomi (17)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Billogram | `billogram-ai` | ai-verktyg-ekonomi | https://www.billogram.com | Ja |
| Bokio AI | `bokio-ai` | ai-verktyg-ekonomi | https://www.bokio.se | Ja |
| Deloitte AI | `deloitte-ai` | ai-verktyg-ekonomi | https://www2.deloitte.com/global/en/pages/about-deloitte/articles/artificial-intelligence.html | Ja |
| Dooer | `dooer` | ai-verktyg-ekonomi | https://www.dooer.com | Ja |
| EY AI | `ey-ai` | ai-verktyg-ekonomi | https://www.ey.com/en_gl/ai | Ja |
| Fortnox AI | `fortnox-ai` | ai-verktyg-ekonomi | https://www.fortnox.se | Ja |
| Fortnox Redovisning | `fortnox-redovisning` | ai-verktyg-ekonomi | https://www.fortnox.se | Ja |
| Klara | `klara-ai` | ai-verktyg-ekonomi | https://www.klara.se | Ja |
| KPMG AI | `kpmg-ai` | ai-verktyg-ekonomi | https://kpmg.com/xx/en/home/services/advisory/management-consulting/digital-lighthouse/ai-and-machine-learning.html | Ja |
| Pleo | `pleo-ai` | ai-verktyg-ekonomi | https://www.pleo.io | Ja |
| PwC AI Tools | `pw-ai` | ai-verktyg-ekonomi | https://www.pwc.com/gx/en/issues/artificial-intelligence.html | Ja |
| QuickBooks AI | `quickbooks-ai` | ai-verktyg-ekonomi | https://quickbooks.intuit.com | Ja |
| SpeedLedger e-bokföring | `speedledger-ai` | ai-verktyg-ekonomi | https://www.speedledger.se | Ja |
| TaxDome | `taxdome-ai` | ai-verktyg-ekonomi | https://taxdome.com | Ja |
| Visma eEkonomi | `visma-ai` | ai-verktyg-ekonomi | https://www.vismaspcs.se/produkter/visma-eekonomi | Ja |
| Wint AI | `wint-ai` | ai-verktyg-ekonomi | https://wint.ai | Ja |
| Xero AI | `xero-ai` | ai-verktyg-ekonomi | https://www.xero.com | Ja |

## ai-verktyg-juridik (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Casetext | `casetext` | ai-verktyg-juridik | https://casetext.com | Ja |
| ContractPodAi | `contractpodai` | ai-verktyg-juridik | https://contractpodai.com | Ja |
| eBrevia | `ebrevia` | ai-verktyg-juridik | https://ebrevia.com | Ja |
| Harvey AI | `harvey-ai` | ai-verktyg-juridik | https://www.harvey.ai | Ja |
| Ironclad AI | `ironclad-ai` | ai-verktyg-juridik | https://ironcladapp.com | Ja |
| Kira Systems | `kira-systems` | ai-verktyg-juridik | https://kirasystems.com | Ja |
| LegalZoom AI | `legalzoom-ai` | ai-verktyg-juridik | https://www.legalzoom.com | Ja |
| Lexis+ AI | `lexis-ai` | ai-verktyg-juridik | https://www.lexisnexis.com/lexis-plus-ai | Ja |
| Luminance | `luminance` | ai-verktyg-juridik | https://www.luminance.com | Ja |
| Spellbook | `spellbook` | ai-verktyg-juridik | https://www.spellbook.legal | Ja |

## ai-verktyg-kundservice (9)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Aisera | `aisera` | ai-verktyg-kundservice | https://aisera.com | Ja |
| ChatBot.com | `chatbot-com` | ai-verktyg-kundservice | https://www.chatbot.com | Ja |
| Drift | `drift` | ai-verktyg-kundservice | https://www.drift.com | Ja |
| Forethought | `forethought` | ai-verktyg-kundservice | https://forethought.ai | Ja |
| Freshdesk AI | `freshdesk-ai` | ai-verktyg-kundservice | https://www.freshworks.com/freshdesk | Ja |
| HubSpot AI | `hubspot-ai` | ai-verktyg-kundservice | https://www.hubspot.com | Ja |
| Intercom AI | `intercom-ai` | ai-verktyg-kundservice | https://www.intercom.com | Ja |
| Salesforce Einstein | `salesforce-einstein` | ai-verktyg-kundservice | https://www.salesforce.com/products/einstein-ai-solutions | Ja |
| Zendesk AI | `zendesk-ai` | ai-verktyg-kundservice | https://www.zendesk.com | Ja |

## ai-verktyg-marknadsforing (33)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| AdCreative.ai | `adcreative-ai` | ai-verktyg-marknadsforing | https://www.adcreative.ai | Ja |
| Ahrefs AI | `ahrefs-ai` | ai-verktyg-marknadsforing | https://ahrefs.com | Ja |
| Albert | `albert-ai` | ai-verktyg-marknadsforing | https://albert.ai | Ja |
| Anyword | `anyword` | ai-verktyg-marknadsforing | https://anyword.com | Ja |
| Buffer AI Assistant | `buffer-ai` | ai-verktyg-marknadsforing | https://buffer.com | Ja |
| Clearscope | `clearscope` | ai-verktyg-marknadsforing | https://www.clearscope.io | Ja |
| Content at Scale | `contentatscale` | ai-verktyg-marknadsforing | https://contentatscale.ai | Ja |
| Fedica | `fedica` | ai-verktyg-marknadsforing | https://fedica.com | Ja |
| Flick AI | `flick-ai` | ai-verktyg-marknadsforing | https://flick.social | Ja |
| Frase.io | `frase-io` | ai-verktyg-marknadsforing | https://www.frase.io | Ja |
| Hootsuite AI | `hootsuite-ai` | ai-verktyg-marknadsforing | https://www.hootsuite.com | Ja |
| Hypotenuse AI | `hypotenuse-ai` | ai-verktyg-marknadsforing | https://www.hypotenuse.ai | Ja |
| Jasper för content & copywriting | `jasper-content` | ai-verktyg-marknadsforing | https://www.jasper.ai | Ja |
| KoalaWriter | `koala-writer` | ai-verktyg-marknadsforing | https://koala.sh | Ja |
| Lately.ai | `lately-ai` | ai-verktyg-marknadsforing | https://www.lately.ai | Ja |
| Madgicx | `madgicx` | ai-verktyg-marknadsforing | https://madgicx.com | Ja |
| MarketMuse | `marketmuse` | ai-verktyg-marknadsforing | https://www.marketmuse.com | Ja |
| Motion | `motionapp` | ai-verktyg-marknadsforing | https://motionapp.com | Ja |
| NeuronWriter | `neuronwriter` | ai-verktyg-marknadsforing | https://neuronwriter.com | Ja |
| Ocoya | `ocoya` | ai-verktyg-marknadsforing | https://www.ocoya.com | Ja |
| Pattern89 | `pattern89` | ai-verktyg-marknadsforing | https://www.shutterstock.com/discover/pattern89 | Ja |
| Pencil | `pencil-ai` | ai-verktyg-marknadsforing | https://www.trypencil.com | Ja |
| Persado | `persado` | ai-verktyg-marknadsforing | https://www.persado.com | Ja |
| Postwise | `postwise` | ai-verktyg-marknadsforing | https://postwise.ai | Ja |
| Predis.ai | `predis-ai` | ai-verktyg-marknadsforing | https://predis.ai | Ja |
| Rank Math AI | `rankmath-ai` | ai-verktyg-marknadsforing | https://rankmath.com | Ja |
| Revealbot | `revealbot` | ai-verktyg-marknadsforing | https://revealbot.com | Ja |
| Rytr för content & copywriting | `rytr-content` | ai-verktyg-marknadsforing | https://rytr.me | Ja |
| Screaming Frog AI | `screaming-frog-ai` | ai-verktyg-marknadsforing | https://www.screamingfrog.co.uk/seo-spider/ | Ja |
| Semrush AI | `semrush-ai` | ai-verktyg-marknadsforing | https://www.semrush.com | Ja |
| Smartly.io | `smartly-io` | ai-verktyg-marknadsforing | https://www.smartly.io | Ja |
| Surfer SEO | `surfer-seo` | ai-verktyg-marknadsforing | https://surferseo.com | Ja |
| Taplio | `taplio` | ai-verktyg-marknadsforing | https://taplio.com | Ja |

## ai-verktyg-rekrytering (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Beamery | `beamery` | ai-verktyg-rekrytering | https://www.beamery.com | Ja |
| Eightfold AI | `eightfold-ai` | ai-verktyg-rekrytering | https://eightfold.ai | Ja |
| Fetcher | `fetcher` | ai-verktyg-rekrytering | https://fetcher.ai | Ja |
| Greenhouse AI | `greenhouse-ai` | ai-verktyg-rekrytering | https://www.greenhouse.com | Ja |
| HireVue | `hirevue` | ai-verktyg-rekrytering | https://www.hirevue.com | Ja |
| Lever AI | `lever-ai` | ai-verktyg-rekrytering | https://www.lever.co | Ja |
| Paradox | `paradox` | ai-verktyg-rekrytering | https://www.paradox.ai | Ja |
| Pymetrics | `pymetrics` | ai-verktyg-rekrytering | https://www.harver.com | Ja |
| SeekOut | `seekout` | ai-verktyg-rekrytering | https://seekout.com | Ja |
| Workday AI | `workday-ai` | ai-verktyg-rekrytering | https://www.workday.com | Ja |

## crm (8)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Attio | `attio` | crm | https://attio.com | Nej |
| Breeze AI | `breeze-ai` | crm | https://www.hubspot.com/products/artificial-intelligence | Nej |
| Close AI | `close-ai` | crm | https://www.close.com | Nej |
| Folk | `folk` | crm | https://www.folk.app | Nej |
| Freshsales AI | `freshsales-ai` | crm | https://www.freshworks.com/crm/ | Nej |
| Monday CRM AI | `monday-crm-ai` | crm | https://monday.com/crm | Nej |
| Pipedrive AI | `pipedrive-ai` | crm | https://www.pipedrive.com | Nej |
| Zoho AI | `zoho-ai` | crm | https://www.zoho.com/crm/ | Nej |

## dataanalys (9)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Akkio | `akkio` | dataanalys | https://www.akkio.com | Ja |
| DataRobot | `datarobot` | dataanalys | https://www.datarobot.com | Ja |
| H2O.ai | `h2o-ai` | dataanalys | https://h2o.ai | Ja |
| Julius AI | `julius-ai` | dataanalys | https://julius.ai | Ja |
| Looker AI | `looker-ai` | dataanalys | https://looker.com | Ja |
| Polymer | `polymer` | dataanalys | https://www.polymersearch.com | Ja |
| Power BI Copilot | `power-bi-copilot` | dataanalys | https://powerbi.microsoft.com | Ja |
| Rows AI | `rows-ai` | dataanalys | https://rows.com | Ja |
| Tableau AI | `tableau-ai` | dataanalys | https://www.tableau.com | Ja |

## dokumenthantering (9)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Adobe Acrobat AI | `adobe-acrobat-ai` | dokumenthantering | https://www.adobe.com/acrobat.html | Nej |
| ChatPDF | `chatpdf` | dokumenthantering | https://www.chatpdf.com | Nej |
| Docsumo | `docsumo` | dokumenthantering | https://www.docsumo.com | Nej |
| DocuSign AI | `docusign-ai` | dokumenthantering | https://www.docusign.com | Nej |
| Humata | `humata` | dokumenthantering | https://www.humata.ai | Nej |
| Kognitos | `kognitos` | dokumenthantering | https://www.kognitos.com | Nej |
| Nanonets | `nanonets` | dokumenthantering | https://nanonets.com | Nej |
| PDF.ai | `pdf-ai` | dokumenthantering | https://pdf.ai | Nej |
| Rossum | `rossum` | dokumenthantering | https://rossum.ai | Nej |

## e-handel (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| CartHook | `carthook` | e-handel | https://carthook.com | Nej |
| Klaviyo AI | `klaviyo-ai` | e-handel | https://www.klaviyo.com | Nej |
| Nosto | `nosto` | e-handel | https://www.nosto.com | Nej |
| Obviously AI | `obviously-ai` | e-handel | https://www.obviously.ai | Nej |
| Octane AI | `octane-ai` | e-handel | https://www.octaneai.com | Nej |
| Rebuy | `rebuy` | e-handel | https://www.rebuyengine.com | Nej |
| Shopify AI | `shopify-ai` | e-handel | https://www.shopify.com | Nej |
| Tidio | `tidio` | e-handel | https://www.tidio.com | Ja |
| WooCommerce AI | `woocommerce-ai` | e-handel | https://woocommerce.com | Nej |
| Yotpo AI | `yotpo-ai` | e-handel | https://www.yotpo.com | Nej |

## e-postmarknadsforing (9)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| ActiveCampaign AI | `activecampaign-ai` | e-postmarknadsforing | https://www.activecampaign.com | Ja |
| Brevo AI | `brevo-ai` | e-postmarknadsforing | https://www.brevo.com | Ja |
| HubSpot Email | `hubspot-email` | e-postmarknadsforing | https://www.hubspot.com/products/marketing/email | Ja |
| Instantly AI | `instantly-ai` | e-postmarknadsforing | https://instantly.ai | Ja |
| Lavender | `lavender` | e-postmarknadsforing | https://www.lavender.ai | Ja |
| Lemlist | `lemlist` | e-postmarknadsforing | https://www.lemlist.com | Ja |
| Mailchimp AI | `mailchimp-ai` | e-postmarknadsforing | https://mailchimp.com | Ja |
| Smartlead | `smartlead` | e-postmarknadsforing | https://www.smartlead.ai | Ja |
| Warmer.ai | `warmer-ai` | e-postmarknadsforing | https://warmer.ai | Ja |

## hemsidebyggare (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| 10Web | `10web` | hemsidebyggare | https://10web.io | Nej |
| Durable | `durable` | hemsidebyggare | https://durable.co | Nej |
| Framer AI | `framer-ai` | hemsidebyggare | https://www.framer.com | Nej |
| Gamma | `gamma` | hemsidebyggare | https://gamma.app | Nej |
| GoDaddy AI | `godaddy-ai` | hemsidebyggare | https://www.godaddy.com | Nej |
| Hostinger AI | `hostinger-ai` | hemsidebyggare | https://www.hostinger.com | Nej |
| Jimdo AI | `jimdo-ai` | hemsidebyggare | https://www.jimdo.com | Nej |
| Squarespace AI | `squarespace-ai` | hemsidebyggare | https://www.squarespace.com | Nej |
| Webflow AI | `webflow-ai` | hemsidebyggare | https://webflow.com | Nej |
| Wix AI | `wix-ai` | hemsidebyggare | https://www.wix.com | Nej |

## motesverktyg (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Avoma | `avoma` | motesverktyg | https://www.avoma.com | Nej |
| Fathom | `fathom` | motesverktyg | https://fathom.video | Nej |
| Fireflies.ai | `fireflies-ai` | motesverktyg | https://fireflies.ai | Nej |
| Krisp | `krisp` | motesverktyg | https://krisp.ai | Nej |
| MeetGeek | `meetgeek` | motesverktyg | https://meetgeek.ai | Nej |
| Notion AI | `notion-ai` | motesverktyg | https://www.notion.so | Nej |
| Otter.ai | `otter-ai` | motesverktyg | https://otter.ai | Nej |
| Sembly | `sembly` | motesverktyg | https://www.sembly.ai | Nej |
| tl;dv | `tl-dv` | motesverktyg | https://tldv.io | Nej |
| Zoom AI | `zoom-ai` | motesverktyg | https://www.zoom.com | Nej |

## oversattning (8)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| DeepL | `deepl` | oversattning | https://www.deepl.com | Nej |
| DeepL Write | `deepl-write` | oversattning | https://www.deepl.com/write | Nej |
| Google Translate AI | `google-translate-ai` | oversattning | https://translate.google.com | Nej |
| Lokalise AI | `lokalise-ai` | oversattning | https://lokalise.com | Nej |
| ModernMT | `modernmt` | oversattning | https://www.modernmt.com | Nej |
| Phrase | `phrase` | oversattning | https://phrase.com | Nej |
| Smartcat | `smartcat` | oversattning | https://www.smartcat.com | Nej |
| Unbabel | `unbabel` | oversattning | https://unbabel.com | Nej |

## podcast-ljudredigering (8)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Alitu | `alitu` | podcast-ljudredigering | https://alitu.com | Ja |
| Auphonic | `auphonic` | podcast-ljudredigering | https://auphonic.com | Ja |
| Buzzsprout AI | `buzzsprout-ai` | podcast-ljudredigering | https://www.buzzsprout.com | Ja |
| Cleanvoice AI | `cleanvoice-ai` | podcast-ljudredigering | https://cleanvoice.ai | Ja |
| Descript | `descript` | podcast-ljudredigering | https://www.descript.com | Ja |
| Headliner | `headliner` | podcast-ljudredigering | https://www.headliner.app | Ja |
| Podcastle | `podcastle` | podcast-ljudredigering | https://podcastle.ai | Ja |
| Riverside.fm | `riverside-fm` | podcast-ljudredigering | https://riverside.fm | Ja |

## presentationer (8)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Beautiful.ai | `beautiful-ai` | presentationer | https://www.beautiful.ai | Nej |
| Decktopus | `decktopus` | presentationer | https://www.decktopus.com | Nej |
| MagicSlides | `magicslides` | presentationer | https://www.magicslides.app | Nej |
| Pitch | `pitch` | presentationer | https://pitch.com | Nej |
| Plus AI | `plus-ai` | presentationer | https://www.plusai.com | Nej |
| SlidesAI | `slidesai` | presentationer | https://www.slidesai.io | Nej |
| Slidesgo AI | `slidesgo-ai` | presentationer | https://slidesgo.com | Nej |
| Tome | `tome` | presentationer | https://tome.app | Nej |

## produktivitet (8)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Akiflow | `akiflow` | produktivitet | https://akiflow.com | Ja |
| Cron | `cron` | produktivitet | https://cron.com | Ja |
| Mem.ai | `mem-ai` | produktivitet | https://get.mem.ai | Ja |
| Obsidian AI | `obsidian-ai` | produktivitet | https://obsidian.md | Ja |
| Reclaim AI | `reclaim-ai` | produktivitet | https://reclaim.ai | Ja |
| Reflect | `reflect` | produktivitet | https://reflect.app | Ja |
| Sunsama | `sunsama` | produktivitet | https://sunsama.com | Ja |
| Todoist AI | `todoist-ai` | produktivitet | https://todoist.com | Ja |

## projektledning (8)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Asana AI | `asana-ai` | projektledning | https://asana.com | Nej |
| Basecamp AI | `basecamp-ai` | projektledning | https://basecamp.com | Nej |
| ClickUp AI | `clickup-ai` | projektledning | https://clickup.com | Nej |
| Jira AI | `jira-ai` | projektledning | https://www.atlassian.com/software/jira | Nej |
| Linear AI | `linear-ai` | projektledning | https://linear.app | Nej |
| Monday AI | `monday-ai` | projektledning | https://monday.com | Nej |
| Motion | `motion` | projektledning | https://www.usemotion.com | Nej |
| Trello AI | `trello-ai` | projektledning | https://trello.com | Nej |

## rost-och-tal (9)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Amazon Polly | `amazon-polly` | rost-och-tal | https://aws.amazon.com/polly/ | Ja |
| LOVO AI | `lovo-ai` | rost-och-tal | https://lovo.ai | Ja |
| Murf AI | `murf-ai` | rost-och-tal | https://murf.ai | Ja |
| Play.ht | `play-ht` | rost-och-tal | https://play.ht | Ja |
| Replica Studios | `replica-studios` | rost-och-tal | https://replicastudios.com | Ja |
| Resemble AI | `resemble-ai` | rost-och-tal | https://www.resemble.ai | Ja |
| Speechify | `speechify` | rost-och-tal | https://speechify.com | Ja |
| Voicemaker | `voicemaker` | rost-och-tal | https://voicemaker.in | Ja |
| Wellsaid Labs | `wellsaid-labs` | rost-och-tal | https://wellsaidlabs.com | Ja |

## sociala-medier-hub (4)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| FeedHive | `feedhive` | sociala-medier-hub | https://www.feedhive.com | Nej |
| Flick | `flick` | sociala-medier-hub | https://www.flick.social | Nej |
| Lately | `lately` | sociala-medier-hub | https://www.lately.ai | Nej |
| Publer | `publer` | sociala-medier-hub | https://publer.com | Nej |

## ui-ux (3)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Figma AI | `figma-ai-ux` | ui-ux | https://www.figma.com/ai | Ja |
| Galileo AI | `galileo-ai-ux` | ui-ux | https://www.usegalileo.ai | Ja |
| Uizard | `uizard-ux` | ui-ux | https://uizard.io | Ja |

## utbildning (10)

| Namn | Slug | Hub/kategori | affiliate_url / fallbackUrl | Äkta brödtext |
|---|---|---|---|---|
| Coursera AI | `coursera-ai` | utbildning | https://www.coursera.org | Ja |
| Duolingo AI | `duolingo-ai` | utbildning | https://www.duolingo.com | Ja |
| Grammarly | `grammarly` | utbildning | https://www.grammarly.com | Ja |
| Khan Academy AI | `khan-academy-ai` | utbildning | https://www.khanacademy.org | Ja |
| Khanmigo | `khanmigo` | utbildning | https://www.khanmigo.ai | Ja |
| Photomath AI | `photomath-ai` | utbildning | https://photomath.com | Ja |
| Quizlet AI | `quizlet-ai` | utbildning | https://quizlet.com | Ja |
| Socratic | `socratic` | utbildning | https://socratic.org | Ja |
| Synthesis AI | `synthesis-ai` | utbildning | https://www.synthesis.com | Ja |
| Turnitin AI | `turnitin-ai` | utbildning | https://www.turnitin.com | Ja |
