# Saknade bilder — audit (393 artiklar/sidor totalt)

> Read-only audit. Genererad av `scripts/audit-images.ts`. Inget ändrat i DB.

## STEG 1 — Schema (bildrelaterade kolumner i `articles`)

Bildrelaterade kolumner som hittades: `featured_image`

| Kolumn | Har värde | Saknar |
|---|---|---|
| `featured_image` | 79 | 314 |

**Viktigt:** Det finns **inget separat logo-fält** i `articles`. Verktygsloggor
lagras i samma `featured_image`-kolumn (se `scripts/link-tool-logos.ts`).
I `REVIEW_KNOWN`-profilerna är `logo` bara en Tailwind-färgklass (t.ex.
`bg-emerald-500`), inte en bild — men profilerna har `fallbackUrl` (officiell
domän) som används för logo.dev i grupp D.

`categories`-tabellen: kolumner = [slug, name, description] — ingen bildkolumn, kategorisidor har ingen hero by design.

## STEG 2 — Resultat

### Totalt saknade per kategori
`featured_image`: 79 har bild, 314 saknar (av 393).

| Grupp | Beskrivning | Antal |
|---|---|---|
| A | Reviews utan `featured_image` (hero/logga) | 272 |
| B | Hubbar/landningssidor utan `featured_image` (hero) | 25 |
| C | Artiklar/posts utan `featured_image` | 13 |
| E | Övriga sidor utan bild (page-articles, ej A/B/C) | 4 |
| **Summa unika utan bild** | A+B+C+E (D = A) | **314** |
| D | Verktyg utan logga (= A, berikat med domän) | 272 |

_Sortering: A/D = kända verktyg (marquee) först, sedan alfabetiskt. B = viktigaste hub-typ först (master → företag → guide → kategori-hubbar). C = senast publicerad först._

### A) REVIEWS som saknar featured_image (272)
| Path | Titel | Slug | Kind |
|---|---|---|---|
| /ai-verktyg/grok | Grok – Recension & Test 2026 | grok | review |
| /ai-verktyg/deepseek | DeepSeek – Recension & Test 2026 | deepseek | review |
| /ai-verktyg/perplexity | Perplexity – Recension & Test 2026 | perplexity | review |
| /ai-verktyg/stable-diffusion | Stable Diffusion — Recension 2026 | stable-diffusion | review |
| /ai-verktyg/leonardo-ai | Leonardo AI — Recension 2026 | leonardo-ai | review |
| /ai-verktyg/ideogram | Ideogram — Recension 2026 | ideogram | review |
| /ai-verktyg/flux | Flux — Recension 2026 | flux | review |
| /ai-verktyg/adobe-firefly | Adobe Firefly — Recension 2026 | adobe-firefly | review |
| /ai-verktyg/canva-ai | Canva AI (Magic Studio) — Recension 2026 | canva-ai | review |
| /ai-video/heygen | HeyGen – Recension & test 2026 | heygen | review |
| /ai-video/synthesia | Synthesia – Recension & test 2026 | synthesia | review |
| /ai-verktyg/notion-ai | Notion AI – Recension & Test 2026 | notion-ai | review |
| /ai-verktyg/grammarly | Grammarly – Recension & Test 2026 | grammarly | review |
| /ai-verktyg/deepl | DeepL – Recension & Test 2026 | deepl | review |
| /ai-verktyg/gamma | Gamma – Recension & Test 2026 | gamma | review |
| /ai-verktyg/descript | Descript – Recension & Test 2026 | descript | review |
| /ai-verktyg/zapier-ai | Zapier AI – Marknadens mest använda automationsplattform | zapier-ai | review |
| /ai-verktyg/make | Make – AI-driven workflow-automation för komplexa flöden | make | review |
| /ai-verktyg/10web | 10Web – Recension & Test 2026 | 10web | review |
| /ai-verktyg/accountingai | AccountingAI — AI-driven bokföring för engelska marknaden | accountingai | review |
| /ai-verktyg/accountingai-pro | AccountingAI Pro — AI för internationell redovisning | accountingai-pro | review |
| /ai-verktyg/activecampaign-ai | ActiveCampaign AI – Recension & Test 2026 | activecampaign-ai | review |
| /ai-verktyg/activepieces | ActivePieces – Open source-alternativ till Zapier | activepieces | review |
| /ai-verktyg/adcreative-ai | AdCreative.ai — kreativa AI-annonser med performance score | adcreative-ai | review |
| /ai-verktyg/adobe-acrobat-ai | Adobe Acrobat AI – Recension & Test 2026 | adobe-acrobat-ai | review |
| /ai-verktyg/adobe-podcast | Adobe Podcast – Recension & test 2026 | adobe-podcast | review |
| /ai-verktyg/ahrefs-ai | Ahrefs AI — branschens djupaste backlink- och keyword-data med AI-lager | ahrefs-ai | review |
| /ai-verktyg/aisera | Aisera – Recension & Test 2026 | aisera | review |
| /ai-verktyg/aiva | AIVA – Recension & test 2026 | aiva | review |
| /ai-verktyg/akiflow | Akiflow – Recension & Test 2026 | akiflow | review |
| /ai-verktyg/akkio | Akkio – Recension & Test 2026 | akkio | review |
| /ai-verktyg/albert-ai | Albert — autonom AI-marketer för paid media | albert-ai | review |
| /ai-verktyg/alitu | Alitu – Recension & Test 2026 | alitu | review |
| /ai-verktyg/amazon-codewhisperer | Amazon CodeWhisperer – AI-kodassistent för AWS-utvecklare | amazon-codewhisperer | review |
| /ai-verktyg/amazon-polly | Amazon Polly – Recension & Test 2026 | amazon-polly | review |
| /ai-verktyg/anyword | Anyword — performance-AI med score per variant | anyword | review |
| /ai-verktyg/asana-ai | Asana AI – Recension & Test 2026 | asana-ai | review |
| /ai-verktyg/attio | Attio – Recension & Test 2026 | attio | review |
| /ai-verktyg/auphonic | Auphonic – Recension & Test 2026 | auphonic | review |
| /ai-verktyg/avoma | Avoma – Recension & Test 2026 | avoma | review |
| /ai-verktyg/bardeen | Bardeen – AI-agenter direkt i din webbläsare | bardeen | review |
| /ai-verktyg/basecamp-ai | Basecamp AI – Recension & Test 2026 | basecamp-ai | review |
| /ai-verktyg/beamery | Beamery – Recension & Test 2026 | beamery | review |
| /ai-verktyg/beautiful-ai | Beautiful.ai – Recension & Test 2026 | beautiful-ai | review |
| /ai-verktyg/billogram-ai | Billogram — smart fakturering och betalningar med AI | billogram-ai | review |
| /ai-verktyg/bing-image-creator | Bing Image Creator — Recension 2026 | bing-image-creator | review |
| /ai-verktyg/bokio-ai | Bokio AI — gratis bokföring med AI för enskild firma | bokio-ai | review |
| /ai-verktyg/boomy | Boomy – Recension & test 2026 | boomy | review |
| /ai-verktyg/breeze-ai | Breeze AI – Recension & Test 2026 | breeze-ai | review |
| /ai-verktyg/brevo-ai | Brevo AI – Recension & Test 2026 | brevo-ai | review |
| /ai-verktyg/buffer-ai | Buffer AI Assistant — schemaläggning som inte sticker i ögonen | buffer-ai | review |
| /ai-verktyg/buzzsprout-ai | Buzzsprout AI – Recension & Test 2026 | buzzsprout-ai | review |
| /ai-verktyg/carthook | CartHook – Recension & Test 2026 | carthook | review |
| /ai-verktyg/casetext | Casetext – Recension & Test 2026 | casetext | review |
| /ai-verktyg/chatbot-com | ChatBot.com – Recension & Test 2026 | chatbot-com | review |
| /ai-verktyg/chatpdf | ChatPDF – Recension & Test 2026 | chatpdf | review |
| /ai-verktyg/cleanvoice-ai | Cleanvoice AI – Recension & Test 2026 | cleanvoice-ai | review |
| /ai-verktyg/clearscope | Clearscope — premium content-optimering med tydliga betyg | clearscope | review |
| /ai-verktyg/clickup-ai | ClickUp AI – Recension & Test 2026 | clickup-ai | review |
| /ai-verktyg/close-ai | Close AI – Recension & Test 2026 | close-ai | review |
| /ai-verktyg/codeium | Codeium – Gratis AI-kodassistent för 70+ språk | codeium | review |
| /ai-verktyg/contentatscale | Content at Scale — long-form på autopilot, AI Detector inbyggt | contentatscale | review |
| /ai-verktyg/contractpodai | ContractPodAi – Recension & Test 2026 | contractpodai | review |
| /ai-verktyg/coursera-ai | Coursera AI – Recension & Test 2026 | coursera-ai | review |
| /ai-verktyg/cron | Cron – Recension & Test 2026 | cron | review |
| /ai-verktyg/datarobot | DataRobot – Recension & Test 2026 | datarobot | review |
| /ai-verktyg/decktopus | Decktopus – Recension & Test 2026 | decktopus | review |
| /ai-verktyg/deepl-write | DeepL Write – Recension & Test 2026 | deepl-write | review |
| /ai-verktyg/deloitte-ai | Deloitte AI — global revision och advisory med AI | deloitte-ai | review |
| /ai-verktyg/descript-ljud | Descript — Recension 2026 | descript-ljud | review |
| /ai-verktyg/docsumo | Docsumo – Recension & Test 2026 | docsumo | review |
| /ai-verktyg/docusign-ai | DocuSign AI – Recension & Test 2026 | docusign-ai | review |
| /ai-verktyg/dooer | Dooer — autonom bokföring där AI sköter allt | dooer | review |
| /ai-verktyg/drift | Drift – Recension & Test 2026 | drift | review |
| /ai-verktyg/duolingo-ai | Duolingo AI – Recension & Test 2026 | duolingo-ai | review |
| /ai-verktyg/durable | Durable – Recension & Test 2026 | durable | review |
| /ai-verktyg/ebrevia | eBrevia – Recension & Test 2026 | ebrevia | review |
| /ai-verktyg/eightfold-ai | Eightfold AI – Recension & Test 2026 | eightfold-ai | review |
| /ai-verktyg/ekonomi/bokforing | Bästa AI-verktyg för bokföring 2026 | ai-verktyg-ekonomi-bokforing | review |
| /ai-verktyg/ekonomi/redovisning | Bästa AI-verktyg för redovisning 2026 | ai-verktyg-ekonomi-redovisning | review |
| /ai-verktyg/ey-ai | EY AI — EY.ai för revision och tax | ey-ai | review |
| /ai-verktyg/fathom | Fathom – Recension & Test 2026 | fathom | review |
| /ai-verktyg/fedica | Fedica — audience-analys och content för Twitter/X och Bluesky | fedica | review |
| /ai-verktyg/feedhive | FeedHive – Recension & Test 2026 | feedhive | review |
| /ai-verktyg/fetcher | Fetcher – Recension & Test 2026 | fetcher | review |
| /ai-verktyg/figma-ai-ux | Figma AI — Recension 2026 | figma-ai-ux | review |
| /ai-verktyg/fireflies-ai | Fireflies.ai – Recension & Test 2026 | fireflies-ai | review |
| /ai-verktyg/flick | Flick – Recension & Test 2026 | flick | review |
| /ai-verktyg/flick-ai | Flick AI — hashtag-research och Instagram-AI | flick-ai | review |
| /ai-verktyg/folk | Folk – Recension & Test 2026 | folk | review |
| /ai-verktyg/forethought | Forethought – Recension & Test 2026 | forethought | review |
| /ai-verktyg/fortnox-ai | Fortnox AI — Sveriges mest använda bokföringsprogram med AI | fortnox-ai | review |
| /ai-verktyg/fortnox-redovisning | Fortnox Redovisning — byråverktyget för svenska redovisningskonsulter | fortnox-redovisning | review |
| /ai-verktyg/framer-ai | Framer AI – Recension & Test 2026 | framer-ai | review |
| /ai-verktyg/frase-io | Frase.io — SERP-research och AI-content i ett | frase-io | review |
| /ai-verktyg/freshdesk-ai | Freshdesk AI – Recension & Test 2026 | freshdesk-ai | review |
| /ai-verktyg/freshsales-ai | Freshsales AI – Recension & Test 2026 | freshsales-ai | review |
| /ai-verktyg/galileo-ai-ux | Galileo AI — Text-to-UI Recension 2026 | galileo-ai-ux | review |
| /ai-verktyg/godaddy-ai | GoDaddy AI – Recension & Test 2026 | godaddy-ai | review |
| /ai-verktyg/google-translate-ai | Google Translate AI – Recension & Test 2026 | google-translate-ai | review |
| /ai-verktyg/greenhouse-ai | Greenhouse AI – Recension & Test 2026 | greenhouse-ai | review |
| /ai-verktyg/h2o-ai | H2O.ai – Recension & Test 2026 | h2o-ai | review |
| /ai-verktyg/harvey-ai | Harvey AI – Recension & Test 2026 | harvey-ai | review |
| /ai-verktyg/headliner | Headliner – Recension & Test 2026 | headliner | review |
| /ai-verktyg/height | Height – Recension & Test 2026 | height | review |
| /ai-verktyg/hirevue | HireVue – Recension & Test 2026 | hirevue | review |
| /ai-verktyg/hootsuite-ai | Hootsuite AI — OwlyWriter genererar och schemalägger | hootsuite-ai | review |
| /ai-verktyg/hostinger-ai | Hostinger AI – Recension & Test 2026 | hostinger-ai | review |
| /ai-verktyg/hubspot-ai | HubSpot AI – Recension & Test 2026 | hubspot-ai | review |
| /ai-verktyg/hubspot-email | HubSpot Email – Recension & Test 2026 | hubspot-email | review |
| /ai-verktyg/humata | Humata – Recension & Test 2026 | humata | review |
| /ai-verktyg/hypotenuse-ai | Hypotenuse AI — e-handel-AI för produktbeskrivningar i skala | hypotenuse-ai | review |
| /ai-verktyg/instantly-ai | Instantly AI – Recension & Test 2026 | instantly-ai | review |
| /ai-verktyg/intercom-ai | Intercom AI – Recension & Test 2026 | intercom-ai | review |
| /ai-verktyg/ironclad-ai | Ironclad AI – Recension & Test 2026 | ironclad-ai | review |
| /ai-verktyg/jasper-content | Jasper för content & copywriting — brand voice för team | jasper-content | review |
| /ai-verktyg/jetbrains-ai | JetBrains AI – AI-assistent i IntelliJ, PyCharm och WebStorm | jetbrains-ai | review |
| /ai-verktyg/jimdo-ai | Jimdo AI – Recension & Test 2026 | jimdo-ai | review |
| /ai-verktyg/jira-ai | Jira AI – Recension & Test 2026 | jira-ai | review |
| /ai-verktyg/julius-ai | Julius AI – Recension & Test 2026 | julius-ai | review |
| /ai-verktyg/khan-academy-ai | Khan Academy AI – Recension & Test 2026 | khan-academy-ai | review |
| /ai-verktyg/khanmigo | Khanmigo – Recension & Test 2026 | khanmigo | review |
| /ai-verktyg/khroma-design | Khroma — AI-färgpaletter Recension 2026 | khroma-design | review |
| /ai-verktyg/kira-systems | Kira Systems – Recension & Test 2026 | kira-systems | review |
| /ai-verktyg/klara-ai | Klara — automatiserad bokföring för småföretagare | klara-ai | review |
| /ai-verktyg/klaviyo-ai | Klaviyo AI – Recension & Test 2026 | klaviyo-ai | review |
| /ai-verktyg/koala-writer | KoalaWriter — long-form SEO-AI med live SERP-data | koala-writer | review |
| /ai-verktyg/kognitos | Kognitos – Recension & Test 2026 | kognitos | review |
| /ai-verktyg/kpmg-ai | KPMG AI — KPMG Clara och AI-driven revision | kpmg-ai | review |
| /ai-verktyg/krisp | Krisp – Recension & Test 2026 | krisp | review |
| /ai-verktyg/lalal-ai | Lalal.ai – Recension & test 2026 | lalal-ai | review |
| /ai-verktyg/lately | Lately – Recension & Test 2026 | lately | review |
| /ai-verktyg/lately-ai | Lately.ai — gör om long-form-content till social posts | lately-ai | review |
| /ai-verktyg/lavender | Lavender – Recension & Test 2026 | lavender | review |
| /ai-verktyg/legalzoom-ai | LegalZoom AI – Recension & Test 2026 | legalzoom-ai | review |
| /ai-verktyg/lemlist | Lemlist – Recension & Test 2026 | lemlist | review |
| /ai-verktyg/lever-ai | Lever AI – Recension & Test 2026 | lever-ai | review |
| /ai-verktyg/lexis-ai | Lexis+ AI – Recension & Test 2026 | lexis-ai | review |
| /ai-verktyg/linear-ai | Linear AI – Recension & Test 2026 | linear-ai | review |
| /ai-verktyg/lokalise-ai | Lokalise AI – Recension & Test 2026 | lokalise-ai | review |
| /ai-verktyg/looka-design | Looka — AI-logotypgenerator Recension 2026 | looka-design | review |
| /ai-verktyg/looker-ai | Looker AI – Recension & Test 2026 | looker-ai | review |
| /ai-verktyg/lovo-ai | LOVO AI – Recension & Test 2026 | lovo-ai | review |
| /ai-verktyg/luminance | Luminance – Recension & Test 2026 | luminance | review |
| /ai-verktyg/luminar-neo-bredig | Luminar Neo AI — Recension 2026 | luminar-neo-bredig | review |
| /ai-verktyg/madgicx | Madgicx — AI-marketing-cloud för Meta-annonser | madgicx | review |
| /ai-verktyg/magicslides | MagicSlides – Recension & Test 2026 | magicslides | review |
| /ai-verktyg/mailchimp-ai | Mailchimp AI – Recension & Test 2026 | mailchimp-ai | review |
| /ai-verktyg/marketmuse | MarketMuse — AI för content-strategi i stora bibliotek | marketmuse | review |
| /ai-verktyg/marknadsforing/annonser | Bästa AI-verktyg för annonsering 2026 | ai-verktyg-marknadsforing-annonser | review |
| /ai-verktyg/marknadsforing/content-copywriting | Bästa AI för content & copywriting 2026 | ai-verktyg-marknadsforing-content-copywriting | review |
| /ai-verktyg/marknadsforing/seo | Bästa AI-verktyg för SEO 2026 | ai-verktyg-marknadsforing-seo | review |
| /ai-verktyg/marknadsforing/sociala-medier | Bästa AI för sociala medier 2026 | ai-verktyg-marknadsforing-sociala-medier | review |
| /ai-verktyg/meetgeek | MeetGeek – Recension & Test 2026 | meetgeek | review |
| /ai-verktyg/mem-ai | Mem.ai – Recension & Test 2026 | mem-ai | review |
| /ai-verktyg/meta-ai | Meta AI – Recension & Test 2026 | meta-ai | review |
| /ai-verktyg/microsoft-copilot | Microsoft Copilot – Recension & Test 2026 | microsoft-copilot | review |
| /ai-verktyg/mistral-le-chat | Mistral Le Chat – Recension & Test 2026 | mistral-le-chat | review |
| /ai-verktyg/modernmt | ModernMT – Recension & Test 2026 | modernmt | review |
| /ai-verktyg/monday-ai | Monday AI – Recension & Test 2026 | monday-ai | review |
| /ai-verktyg/monday-crm-ai | Monday CRM AI – Recension & Test 2026 | monday-crm-ai | review |
| /ai-verktyg/motion | Motion – Recension & Test 2026 | motion | review |
| /ai-verktyg/motionapp | Motion — kreativ analytics-AI för paid social | motionapp | review |
| /ai-verktyg/mubert | Mubert – Recension & test 2026 | mubert | review |
| /ai-verktyg/murf-ai | Murf AI – Recension & Test 2026 | murf-ai | review |
| /ai-verktyg/n8n | n8n – Open source-automation du kan självhosta | n8n | review |
| /ai-verktyg/nanonets | Nanonets – Recension & Test 2026 | nanonets | review |
| /ai-verktyg/neuronwriter | NeuronWriter — NLP-driven SEO-editor för småföretagare | neuronwriter | review |
| /ai-verktyg/nosto | Nosto – Recension & Test 2026 | nosto | review |
| /ai-verktyg/obsidian-ai | Obsidian AI – Recension & Test 2026 | obsidian-ai | review |
| /ai-verktyg/obviously-ai | Obviously AI – Recension & Test 2026 | obviously-ai | review |
| /ai-verktyg/ocoya | Ocoya — all-in-one social med AI-content, design och schemaläggning | ocoya | review |
| /ai-verktyg/octane-ai | Octane AI – Recension & Test 2026 | octane-ai | review |
| /ai-verktyg/otter-ai | Otter.ai – Recension & Test 2026 | otter-ai | review |
| /ai-verktyg/paradox | Paradox – Recension & Test 2026 | paradox | review |
| /ai-verktyg/pattern89 | Pattern89 — kreativ intelligens från Shutterstock | pattern89 | review |
| /ai-verktyg/pdf-ai | PDF.ai – Recension & Test 2026 | pdf-ai | review |
| /ai-verktyg/pencil-ai | Pencil — AI-video och statiska annonser för Meta | pencil-ai | review |
| /ai-verktyg/persado | Persado — enterprise-AI för emotion-driven copy | persado | review |
| /ai-verktyg/photomath-ai | Photomath AI – Recension & Test 2026 | photomath-ai | review |
| /ai-verktyg/phrase | Phrase – Recension & Test 2026 | phrase | review |
| /ai-verktyg/pi-ai | Pi AI – Recension & Test 2026 | pi-ai | review |
| /ai-verktyg/pieces | Pieces – Lokalt AI-snippet- och kontextminne | pieces | review |
| /ai-verktyg/pipedream | Pipedream – Kodbara workflows för utvecklare | pipedream | review |
| /ai-verktyg/pipedrive-ai | Pipedrive AI – Recension & Test 2026 | pipedrive-ai | review |
| /ai-verktyg/pitch | Pitch – Recension & Test 2026 | pitch | review |
| /ai-verktyg/play-ht | Play.ht – Recension & Test 2026 | play-ht | review |
| /ai-verktyg/playground-ai | Playground AI — Recension 2026 | playground-ai | review |
| /ai-verktyg/pleo-ai | Pleo — företagskort och utläggshantering med AI | pleo-ai | review |
| /ai-verktyg/plus-ai | Plus AI – Recension & Test 2026 | plus-ai | review |
| /ai-verktyg/podcastle | Podcastle – Recension & Test 2026 | podcastle | review |
| /ai-verktyg/polymer | Polymer – Recension & Test 2026 | polymer | review |
| /ai-verktyg/postwise | Postwise — AI för X (Twitter) tweets och trådar | postwise | review |
| /ai-verktyg/power-automate | Microsoft Power Automate – Automation i Microsoft 365 | power-automate | review |
| /ai-verktyg/power-bi-copilot | Power BI Copilot – Recension & Test 2026 | power-bi-copilot | review |
| /ai-verktyg/predis-ai | Predis.ai — AI-skapad social-content på sekunder | predis-ai | review |
| /ai-verktyg/publer | Publer – Recension & Test 2026 | publer | review |
| /ai-verktyg/pw-ai | PwC AI Tools — Big4-AI för revision och redovisning | pw-ai | review |
| /ai-verktyg/pymetrics | Pymetrics – Recension & Test 2026 | pymetrics | review |
| /ai-verktyg/quickbooks-ai | QuickBooks AI — Intuit Assist för småföretagare | quickbooks-ai | review |
| /ai-verktyg/quizlet-ai | Quizlet AI – Recension & Test 2026 | quizlet-ai | review |
| /ai-verktyg/rankmath-ai | Rank Math AI — WordPress SEO-plugin med Content AI inbyggt | rankmath-ai | review |
| /ai-verktyg/rebuy | Rebuy – Recension & Test 2026 | rebuy | review |
| /ai-verktyg/reclaim-ai | Reclaim AI – Recension & Test 2026 | reclaim-ai | review |
| /ai-verktyg/reconcile-ai | Reconcile AI — AI för automatisk avstämning | reconcile-ai | review |
| /ai-verktyg/reflect | Reflect – Recension & Test 2026 | reflect | review |
| /ai-verktyg/relay-app | Relay.app – AI-automation med human-in-the-loop | relay-app | review |
| /ai-verktyg/removebg-bredig | Remove.bg — AI-bakgrundsborttagning Recension 2026 | removebg-bredig | review |
| /ai-verktyg/replica-studios | Replica Studios – Recension & Test 2026 | replica-studios | review |
| /ai-verktyg/replit-ai | Replit AI – Bygg och deploya appar med AI i webbläsaren | replit-ai | review |
| /ai-verktyg/resemble-ai | Resemble AI – Recension & Test 2026 | resemble-ai | review |
| /ai-verktyg/revealbot | Revealbot — automatiseringsregler för Meta, Google och TikTok | revealbot | review |
| /ai-verktyg/riverside-fm | Riverside.fm – Recension & Test 2026 | riverside-fm | review |
| /ai-verktyg/rossum | Rossum – Recension & Test 2026 | rossum | review |
| /ai-verktyg/rows-ai | Rows AI – Recension & Test 2026 | rows-ai | review |
| /ai-verktyg/rytr-content | Rytr för content & copywriting — billigast pro-plan | rytr-content | review |
| /ai-verktyg/salesforce-einstein | Salesforce Einstein – Recension & Test 2026 | salesforce-einstein | review |
| /ai-verktyg/screaming-frog-ai | Screaming Frog AI — Crawler med AI för tekniska SEO-audits | screaming-frog-ai | review |
| /ai-verktyg/seekout | SeekOut – Recension & Test 2026 | seekout | review |
| /ai-verktyg/sembly | Sembly – Recension & Test 2026 | sembly | review |
| /ai-verktyg/semrush-ai | Semrush AI — komplett SEO-svit med AI-content och rank tracking | semrush-ai | review |
| /ai-verktyg/shopify-ai | Shopify AI – Recension & Test 2026 | shopify-ai | review |
| /ai-verktyg/slidesai | SlidesAI – Recension & Test 2026 | slidesai | review |
| /ai-verktyg/slidesgo-ai | Slidesgo AI – Recension & Test 2026 | slidesgo-ai | review |
| /ai-verktyg/smartcat | Smartcat – Recension & Test 2026 | smartcat | review |
| /ai-verktyg/smartlead | Smartlead – Recension & Test 2026 | smartlead | review |
| /ai-verktyg/smartly-io | Smartly.io — nordisk martech-plattform för social advertising | smartly-io | review |
| /ai-verktyg/socratic | Socratic – Recension & Test 2026 | socratic | review |
| /ai-verktyg/soundraw | Soundraw – Recension & test 2026 | soundraw | review |
| /ai-verktyg/sourcegraph-cody | Sourcegraph Cody – AI som förstår hela din kodbas | sourcegraph-cody | review |
| /ai-verktyg/speechify | Speechify – Recension & Test 2026 | speechify | review |
| /ai-verktyg/speedledger-ai | SpeedLedger e-bokföring — webbaserad bokföring med smart kategorisering | speedledger-ai | review |
| /ai-verktyg/spellbook | Spellbook – Recension & Test 2026 | spellbook | review |
| /ai-verktyg/splice | Splice – Recension & test 2026 | splice | review |
| /ai-verktyg/squarespace-ai | Squarespace AI – Recension & Test 2026 | squarespace-ai | review |
| /ai-verktyg/sunsama | Sunsama – Recension & Test 2026 | sunsama | review |
| /ai-verktyg/surfer-seo | Surfer SEO — AI-content som rankar med Google | surfer-seo | review |
| /ai-verktyg/synthesis-ai | Synthesis AI – Recension & Test 2026 | synthesis-ai | review |
| /ai-verktyg/tableau-ai | Tableau AI – Recension & Test 2026 | tableau-ai | review |
| /ai-verktyg/tabnine | Tabnine – Privacy-first AI-kodassistent | tabnine | review |
| /ai-verktyg/taplio | Taplio — AI för LinkedIn-content och relationer | taplio | review |
| /ai-verktyg/taxdome-ai | TaxDome — practice management för redovisningsbyråer | taxdome-ai | review |
| /ai-verktyg/tidio | Tidio – Recension & Test 2026 | tidio | review |
| /ai-verktyg/tl-dv | tl;dv – Recension & Test 2026 | tl-dv | review |
| /ai-verktyg/todoist-ai | Todoist AI – Recension & Test 2026 | todoist-ai | review |
| /ai-verktyg/tome | Tome – Recension & Test 2026 | tome | review |
| /ai-verktyg/topaz-photo-bredig | Topaz Photo AI — Recension 2026 | topaz-photo-bredig | review |
| /ai-verktyg/trello-ai | Trello AI – Recension & Test 2026 | trello-ai | review |
| /ai-verktyg/turnitin-ai | Turnitin AI – Recension & Test 2026 | turnitin-ai | review |
| /ai-verktyg/uizard-ux | Uizard — Sketch-to-Design Recension 2026 | uizard-ux | review |
| /ai-verktyg/unbabel | Unbabel – Recension & Test 2026 | unbabel | review |
| /ai-verktyg/visma-ai | Visma eEkonomi — nordisk bokföring med stark AI-koppling | visma-ai | review |
| /ai-verktyg/voicemaker | Voicemaker – Recension & Test 2026 | voicemaker | review |
| /ai-verktyg/warmer-ai | Warmer.ai – Recension & Test 2026 | warmer-ai | review |
| /ai-verktyg/webflow-ai | Webflow AI – Recension & Test 2026 | webflow-ai | review |
| /ai-verktyg/wellsaid-labs | Wellsaid Labs – Recension & Test 2026 | wellsaid-labs | review |
| /ai-verktyg/windsurf | Windsurf – Agentisk AI-kodeditor från Codeium | windsurf | review |
| /ai-verktyg/wint-ai | Wint AI — AI-controller för månadsbokslut | wint-ai | review |
| /ai-verktyg/wix-ai | Wix AI – Recension & Test 2026 | wix-ai | review |
| /ai-verktyg/woocommerce-ai | WooCommerce AI – Recension & Test 2026 | woocommerce-ai | review |
| /ai-verktyg/workday-ai | Workday AI – Recension & Test 2026 | workday-ai | review |
| /ai-verktyg/workflows | AI Workflow Automation – Bästa verktygen, exempel & komplett guide | workflows | review |
| /ai-verktyg/xero-ai | Xero AI — global molnredovisning med AI-features | xero-ai | review |
| /ai-verktyg/yotpo-ai | Yotpo AI – Recension & Test 2026 | yotpo-ai | review |
| /ai-verktyg/zendesk-ai | Zendesk AI – Recension & Test 2026 | zendesk-ai | review |
| /ai-verktyg/zoho-ai | Zoho AI – Recension & Test 2026 | zoho-ai | review |
| /ai-verktyg/zoom-ai | Zoom AI – Recension & Test 2026 | zoom-ai | review |
| /ai-video/adobe-firefly-video | Adobe Firefly Video – Recension & test 2026 | adobe-firefly-video | review |
| /ai-video/capcut-ai-vklipp | CapCut AI — Videoredigering Recension 2026 | capcut-ai-vklipp | review |
| /ai-video/invideo | InVideo – Recension & test 2026 | invideo | review |
| /ai-video/kaiber | Kaiber – Recension & test 2026 | kaiber | review |
| /ai-video/luma-dream-machine | Luma Dream Machine – Recension & test 2026 | luma-dream-machine | review |

### B) HUBBAR / LANDNINGSSIDOR som saknar featured_image (25)
| Path | Titel | Slug | Kind |
|---|---|---|---|
| /ai-verktyg | AI-verktyg: Jämför de Bästa AI-verktygen 2026 | ai-verktyg | masterHub |
| /ai-verktyg/foretag | De Bästa AI-verktygen för Företag – Stor Jämförelse & Guide 2026 | foretag | foretagHub |
| /ai-guiden | AI-Guiden: Kom igång med AI – Lär dig Grunderna och Skapa med AI | ai-guiden | guideHub |
| /ai-verktyg/foretag/yrke | AI-Verktyg Efter Yrke – Hitta Rätt AI För Ditt Arbete | yrke | yrkesHub |
| /ai-verktyg/ai-video-verktyg | AI-video verktyg – Stor jämförelse av de bästa verktygen för AI-video (2026) | ai-video-verktyg | hub |
| /ai-verktyg/ekonomi | Bästa AI-verktygen för ekonomi & redovisning 2026 — bokföring, avstämning & bokslut | ai-verktyg-ekonomi | hub |
| /ai-verktyg/juridik | Bästa AI-verktygen för juridik 2026 — avtal, due diligence & rättsutredningar | ai-verktyg-juridik | hub |
| /ai-verktyg/kundservice | Bästa AI-verktygen för kundservice 2026 — chatbottar, e-postsvar & röst-AI | ai-verktyg-kundservice | hub |
| /ai-verktyg/marknadsforing | Bästa AI-verktygen för marknadsföring 2026 — content, SEO, annonser & sociala medier | ai-verktyg-marknadsforing | hub |
| /ai-verktyg/rekrytering | Bästa AI-verktygen för rekrytering & HR 2026 — CV-screening, jobbannonser & matchning | ai-verktyg-rekrytering | hub |
| /ai-verktyg/tiktok | AI-Verktyg för TikTok | tiktok | hub |
| /ai-verktyg/ui-ux | Bästa AI-verktygen för UI/UX-design 2026 | ui-ux | hub |
| /ai-verktyg/foretag/yrke/designer | AI för Designers — Verktyg, workflow och toplistor 2026 | designer | yrkesRoll |
| /ai-verktyg/foretag/yrke/fotograf-video | AI för Fotografer & Videoskapare — Verktyg och workflow 2026 | fotograf-video | yrkesRoll |
| /bygga-app-med-ai | Bygg Appar & Webbplatser Med AI (2026) | bygga-app-med-ai | standalone |
| /bygga-mobilapp-med-ai | Bygga Mobilapp med AI 2026: 10 Bästa Verktygen för Mobilappar | bygga-mobilapp-med-ai | standalone |
| /skapa-faceless-content-med-ai | Skapa Faceless Content med AI: Bästa Verktygen och Guide (2026) | skapa-faceless-content-med-ai | standalone |
| /ai-guiden/ai-pa-jobbet | AI på jobbet — Produktivitet och konkret användning 2026 | ai-pa-jobbet | standalone |
| /ai-guiden/framtidens-ai | Framtidens AI — Trender och vad som händer 2026-2028 | framtidens-ai | standalone |
| /ai-guiden/hur-fungerar-ai | Hur fungerar AI? — Tekniken bakom moderna AI-modeller | hur-fungerar-ai | standalone |
| /ai-guiden/komma-igang-med-ai | Komma igång med AI — Nybörjarguide steg för steg | komma-igang-med-ai | standalone |
| /ai-guiden/prompta-battre | Prompta bättre — Prompt engineering för svenska användare | prompta-battre | standalone |
| /ai-guiden/vad-ar-ai | Vad är AI? — Komplett guide för svenska läsare 2026 | vad-ar-ai | standalone |
| /om-oss | Om oss på AI-Magasinet | om-oss | about |
| /kontakt | Kontakt | kontakt | contact |

### C) ARTIKLAR / POSTS som saknar featured_image (13)
| Slug | Titel | Publicerad |
|---|---|---|
| rekryterare | Rekrytering effektivare — hur AI väljer rätt kandidater | 2026-06-03T12:27:39.668+00:00 |
| kundtjanst | Kundservice med intelligens — AI-lösningar för 2026 | 2026-06-03T12:27:00.243+00:00 |
| utvecklare | Så använder du AI som utvecklare 2026 | 2026-06-03T12:26:14.174+00:00 |
| hr-ansvarig | HR och AI 2026 — verktyg och tips för moderna HR-team | 2026-06-03T12:25:32.169+00:00 |
| saljare | Säljare och AI — så vinner du fler affärer 2026 | 2026-06-03T12:24:52.031+00:00 |
| marknadsforare | Marknadsföring med AI — komplett guide för 2026 | 2026-06-03T12:24:06.563+00:00 |
| bokforare | Bokföring med AI — automatisera och effektivisera 2026 | 2026-06-03T12:23:18.7+00:00 |
| revisor | AI i revisionen — vad fungerar och vad bör du tänka på? | 2026-06-03T12:22:31.759+00:00 |
| advokat | Juridik och AI 2026 — guide för advokater och jurister | 2026-06-03T12:21:50.438+00:00 |
| larare | Personlig undervisning med AI — 2026-guide för lärare | 2026-06-03T12:21:07.031+00:00 |
| ai-tar-over-tiktok-flodet | AI tar över TikTok-flödet – varför blir det allt svårare att se vad som är verkligt? | 2026-01-15T12:26:22+00:00 |
| sa-bygger-du-ett-agentiskt-ai-system-en-komplett-guide-till-kontrollplans-arkitektur-for-sakra-modulara-och-skalbara-verktygsdrivna-resonemangsfloden | Så bygger du ett agentiskt AI-system – en komplett guide till kontrollplans-arkitektur för säkra, modulära och skalbara verktygsdrivna resonemangsflöden | 2025-11-30T01:05:30+00:00 |
| nvidia-lanserar-orchestrator-8b-ai-hjarna-som-lar-sig-valja-ratt-verktyg-och-modell-for-varje-uppgift | NVIDIA lanserar Orchestrator-8B – AI-hjärna som lär sig välja rätt verktyg och modell för varje uppgift | 2025-11-29T23:22:06+00:00 |

### D) VERKTYGSLOGGOR som saknas (272) — med officiell domän för logo.dev
| Verktyg | Slug | Officiell domän |
|---|---|---|
| Grok – Recension & Test 2026 | grok | grok.com |
| DeepSeek – Recension & Test 2026 | deepseek | deepseek.com |
| Perplexity – Recension & Test 2026 | perplexity | perplexity.ai |
| Stable Diffusion — Recension 2026 | stable-diffusion | — (ingen i REVIEW_KNOWN) |
| Leonardo AI — Recension 2026 | leonardo-ai | — (ingen i REVIEW_KNOWN) |
| Ideogram — Recension 2026 | ideogram | — (ingen i REVIEW_KNOWN) |
| Flux — Recension 2026 | flux | — (ingen i REVIEW_KNOWN) |
| Adobe Firefly — Recension 2026 | adobe-firefly | adobe.com |
| Canva AI (Magic Studio) — Recension 2026 | canva-ai | — (ingen i REVIEW_KNOWN) |
| HeyGen – Recension & test 2026 | heygen | heygen.com |
| Synthesia – Recension & test 2026 | synthesia | synthesia.io |
| Notion AI – Recension & Test 2026 | notion-ai | notion.so |
| Grammarly – Recension & Test 2026 | grammarly | grammarly.com |
| DeepL – Recension & Test 2026 | deepl | deepl.com |
| Gamma – Recension & Test 2026 | gamma | gamma.app |
| Descript – Recension & Test 2026 | descript | descript.com |
| Zapier AI – Marknadens mest använda automationsplattform | zapier-ai | zapier.com |
| Make – AI-driven workflow-automation för komplexa flöden | make | make.com |
| 10Web – Recension & Test 2026 | 10web | 10web.io |
| AccountingAI — AI-driven bokföring för engelska marknaden | accountingai | accountingai.com |
| AccountingAI Pro — AI för internationell redovisning | accountingai-pro | accountingai.com |
| ActiveCampaign AI – Recension & Test 2026 | activecampaign-ai | activecampaign.com |
| ActivePieces – Open source-alternativ till Zapier | activepieces | activepieces.com |
| AdCreative.ai — kreativa AI-annonser med performance score | adcreative-ai | adcreative.ai |
| Adobe Acrobat AI – Recension & Test 2026 | adobe-acrobat-ai | adobe.com |
| Adobe Podcast – Recension & test 2026 | adobe-podcast | podcast.adobe.com |
| Ahrefs AI — branschens djupaste backlink- och keyword-data med AI-lager | ahrefs-ai | ahrefs.com |
| Aisera – Recension & Test 2026 | aisera | aisera.com |
| AIVA – Recension & test 2026 | aiva | aiva.ai |
| Akiflow – Recension & Test 2026 | akiflow | akiflow.com |
| Akkio – Recension & Test 2026 | akkio | akkio.com |
| Albert — autonom AI-marketer för paid media | albert-ai | albert.ai |
| Alitu – Recension & Test 2026 | alitu | alitu.com |
| Amazon CodeWhisperer – AI-kodassistent för AWS-utvecklare | amazon-codewhisperer | aws.amazon.com |
| Amazon Polly – Recension & Test 2026 | amazon-polly | aws.amazon.com |
| Anyword — performance-AI med score per variant | anyword | anyword.com |
| Asana AI – Recension & Test 2026 | asana-ai | asana.com |
| Attio – Recension & Test 2026 | attio | attio.com |
| Auphonic – Recension & Test 2026 | auphonic | auphonic.com |
| Avoma – Recension & Test 2026 | avoma | avoma.com |
| Bardeen – AI-agenter direkt i din webbläsare | bardeen | bardeen.ai |
| Basecamp AI – Recension & Test 2026 | basecamp-ai | basecamp.com |
| Beamery – Recension & Test 2026 | beamery | beamery.com |
| Beautiful.ai – Recension & Test 2026 | beautiful-ai | beautiful.ai |
| Billogram — smart fakturering och betalningar med AI | billogram-ai | billogram.com |
| Bing Image Creator — Recension 2026 | bing-image-creator | — (ingen i REVIEW_KNOWN) |
| Bokio AI — gratis bokföring med AI för enskild firma | bokio-ai | bokio.se |
| Boomy – Recension & test 2026 | boomy | boomy.com |
| Breeze AI – Recension & Test 2026 | breeze-ai | hubspot.com |
| Brevo AI – Recension & Test 2026 | brevo-ai | brevo.com |
| Buffer AI Assistant — schemaläggning som inte sticker i ögonen | buffer-ai | buffer.com |
| Buzzsprout AI – Recension & Test 2026 | buzzsprout-ai | buzzsprout.com |
| CartHook – Recension & Test 2026 | carthook | carthook.com |
| Casetext – Recension & Test 2026 | casetext | casetext.com |
| ChatBot.com – Recension & Test 2026 | chatbot-com | chatbot.com |
| ChatPDF – Recension & Test 2026 | chatpdf | chatpdf.com |
| Cleanvoice AI – Recension & Test 2026 | cleanvoice-ai | cleanvoice.ai |
| Clearscope — premium content-optimering med tydliga betyg | clearscope | clearscope.io |
| ClickUp AI – Recension & Test 2026 | clickup-ai | clickup.com |
| Close AI – Recension & Test 2026 | close-ai | close.com |
| Codeium – Gratis AI-kodassistent för 70+ språk | codeium | codeium.com |
| Content at Scale — long-form på autopilot, AI Detector inbyggt | contentatscale | contentatscale.ai |
| ContractPodAi – Recension & Test 2026 | contractpodai | contractpodai.com |
| Coursera AI – Recension & Test 2026 | coursera-ai | coursera.org |
| Cron – Recension & Test 2026 | cron | cron.com |
| DataRobot – Recension & Test 2026 | datarobot | datarobot.com |
| Decktopus – Recension & Test 2026 | decktopus | decktopus.com |
| DeepL Write – Recension & Test 2026 | deepl-write | deepl.com |
| Deloitte AI — global revision och advisory med AI | deloitte-ai | www2.deloitte.com |
| Descript — Recension 2026 | descript-ljud | descript.com |
| Docsumo – Recension & Test 2026 | docsumo | docsumo.com |
| DocuSign AI – Recension & Test 2026 | docusign-ai | docusign.com |
| Dooer — autonom bokföring där AI sköter allt | dooer | dooer.com |
| Drift – Recension & Test 2026 | drift | drift.com |
| Duolingo AI – Recension & Test 2026 | duolingo-ai | duolingo.com |
| Durable – Recension & Test 2026 | durable | durable.co |
| eBrevia – Recension & Test 2026 | ebrevia | ebrevia.com |
| Eightfold AI – Recension & Test 2026 | eightfold-ai | eightfold.ai |
| Bästa AI-verktyg för bokföring 2026 | ai-verktyg-ekonomi-bokforing | — (ingen i REVIEW_KNOWN) |
| Bästa AI-verktyg för redovisning 2026 | ai-verktyg-ekonomi-redovisning | — (ingen i REVIEW_KNOWN) |
| EY AI — EY.ai för revision och tax | ey-ai | ey.com |
| Fathom – Recension & Test 2026 | fathom | fathom.video |
| Fedica — audience-analys och content för Twitter/X och Bluesky | fedica | fedica.com |
| FeedHive – Recension & Test 2026 | feedhive | feedhive.com |
| Fetcher – Recension & Test 2026 | fetcher | fetcher.ai |
| Figma AI — Recension 2026 | figma-ai-ux | figma.com |
| Fireflies.ai – Recension & Test 2026 | fireflies-ai | fireflies.ai |
| Flick – Recension & Test 2026 | flick | flick.social |
| Flick AI — hashtag-research och Instagram-AI | flick-ai | flick.social |
| Folk – Recension & Test 2026 | folk | folk.app |
| Forethought – Recension & Test 2026 | forethought | forethought.ai |
| Fortnox AI — Sveriges mest använda bokföringsprogram med AI | fortnox-ai | fortnox.se |
| Fortnox Redovisning — byråverktyget för svenska redovisningskonsulter | fortnox-redovisning | fortnox.se |
| Framer AI – Recension & Test 2026 | framer-ai | framer.com |
| Frase.io — SERP-research och AI-content i ett | frase-io | frase.io |
| Freshdesk AI – Recension & Test 2026 | freshdesk-ai | freshworks.com |
| Freshsales AI – Recension & Test 2026 | freshsales-ai | freshworks.com |
| Galileo AI — Text-to-UI Recension 2026 | galileo-ai-ux | usegalileo.ai |
| GoDaddy AI – Recension & Test 2026 | godaddy-ai | godaddy.com |
| Google Translate AI – Recension & Test 2026 | google-translate-ai | translate.google.com |
| Greenhouse AI – Recension & Test 2026 | greenhouse-ai | greenhouse.com |
| H2O.ai – Recension & Test 2026 | h2o-ai | h2o.ai |
| Harvey AI – Recension & Test 2026 | harvey-ai | harvey.ai |
| Headliner – Recension & Test 2026 | headliner | headliner.app |
| Height – Recension & Test 2026 | height | height.app |
| HireVue – Recension & Test 2026 | hirevue | hirevue.com |
| Hootsuite AI — OwlyWriter genererar och schemalägger | hootsuite-ai | hootsuite.com |
| Hostinger AI – Recension & Test 2026 | hostinger-ai | hostinger.com |
| HubSpot AI – Recension & Test 2026 | hubspot-ai | hubspot.com |
| HubSpot Email – Recension & Test 2026 | hubspot-email | hubspot.com |
| Humata – Recension & Test 2026 | humata | humata.ai |
| Hypotenuse AI — e-handel-AI för produktbeskrivningar i skala | hypotenuse-ai | hypotenuse.ai |
| Instantly AI – Recension & Test 2026 | instantly-ai | instantly.ai |
| Intercom AI – Recension & Test 2026 | intercom-ai | intercom.com |
| Ironclad AI – Recension & Test 2026 | ironclad-ai | ironcladapp.com |
| Jasper för content & copywriting — brand voice för team | jasper-content | jasper.ai |
| JetBrains AI – AI-assistent i IntelliJ, PyCharm och WebStorm | jetbrains-ai | jetbrains.com |
| Jimdo AI – Recension & Test 2026 | jimdo-ai | jimdo.com |
| Jira AI – Recension & Test 2026 | jira-ai | atlassian.com |
| Julius AI – Recension & Test 2026 | julius-ai | julius.ai |
| Khan Academy AI – Recension & Test 2026 | khan-academy-ai | khanacademy.org |
| Khanmigo – Recension & Test 2026 | khanmigo | khanmigo.ai |
| Khroma — AI-färgpaletter Recension 2026 | khroma-design | khroma.co |
| Kira Systems – Recension & Test 2026 | kira-systems | kirasystems.com |
| Klara — automatiserad bokföring för småföretagare | klara-ai | klara.se |
| Klaviyo AI – Recension & Test 2026 | klaviyo-ai | klaviyo.com |
| KoalaWriter — long-form SEO-AI med live SERP-data | koala-writer | koala.sh |
| Kognitos – Recension & Test 2026 | kognitos | kognitos.com |
| KPMG AI — KPMG Clara och AI-driven revision | kpmg-ai | kpmg.com |
| Krisp – Recension & Test 2026 | krisp | krisp.ai |
| Lalal.ai – Recension & test 2026 | lalal-ai | lalal.ai |
| Lately – Recension & Test 2026 | lately | lately.ai |
| Lately.ai — gör om long-form-content till social posts | lately-ai | lately.ai |
| Lavender – Recension & Test 2026 | lavender | lavender.ai |
| LegalZoom AI – Recension & Test 2026 | legalzoom-ai | legalzoom.com |
| Lemlist – Recension & Test 2026 | lemlist | lemlist.com |
| Lever AI – Recension & Test 2026 | lever-ai | lever.co |
| Lexis+ AI – Recension & Test 2026 | lexis-ai | lexisnexis.com |
| Linear AI – Recension & Test 2026 | linear-ai | linear.app |
| Lokalise AI – Recension & Test 2026 | lokalise-ai | lokalise.com |
| Looka — AI-logotypgenerator Recension 2026 | looka-design | looka.com |
| Looker AI – Recension & Test 2026 | looker-ai | looker.com |
| LOVO AI – Recension & Test 2026 | lovo-ai | lovo.ai |
| Luminance – Recension & Test 2026 | luminance | luminance.com |
| Luminar Neo AI — Recension 2026 | luminar-neo-bredig | skylum.com |
| Madgicx — AI-marketing-cloud för Meta-annonser | madgicx | madgicx.com |
| MagicSlides – Recension & Test 2026 | magicslides | magicslides.app |
| Mailchimp AI – Recension & Test 2026 | mailchimp-ai | mailchimp.com |
| MarketMuse — AI för content-strategi i stora bibliotek | marketmuse | marketmuse.com |
| Bästa AI-verktyg för annonsering 2026 | ai-verktyg-marknadsforing-annonser | — (ingen i REVIEW_KNOWN) |
| Bästa AI för content & copywriting 2026 | ai-verktyg-marknadsforing-content-copywriting | — (ingen i REVIEW_KNOWN) |
| Bästa AI-verktyg för SEO 2026 | ai-verktyg-marknadsforing-seo | — (ingen i REVIEW_KNOWN) |
| Bästa AI för sociala medier 2026 | ai-verktyg-marknadsforing-sociala-medier | — (ingen i REVIEW_KNOWN) |
| MeetGeek – Recension & Test 2026 | meetgeek | meetgeek.ai |
| Mem.ai – Recension & Test 2026 | mem-ai | get.mem.ai |
| Meta AI – Recension & Test 2026 | meta-ai | meta.ai |
| Microsoft Copilot – Recension & Test 2026 | microsoft-copilot | copilot.microsoft.com |
| Mistral Le Chat – Recension & Test 2026 | mistral-le-chat | chat.mistral.ai |
| ModernMT – Recension & Test 2026 | modernmt | modernmt.com |
| Monday AI – Recension & Test 2026 | monday-ai | monday.com |
| Monday CRM AI – Recension & Test 2026 | monday-crm-ai | monday.com |
| Motion – Recension & Test 2026 | motion | usemotion.com |
| Motion — kreativ analytics-AI för paid social | motionapp | motionapp.com |
| Mubert – Recension & test 2026 | mubert | mubert.com |
| Murf AI – Recension & Test 2026 | murf-ai | murf.ai |
| n8n – Open source-automation du kan självhosta | n8n | n8n.io |
| Nanonets – Recension & Test 2026 | nanonets | nanonets.com |
| NeuronWriter — NLP-driven SEO-editor för småföretagare | neuronwriter | neuronwriter.com |
| Nosto – Recension & Test 2026 | nosto | nosto.com |
| Obsidian AI – Recension & Test 2026 | obsidian-ai | obsidian.md |
| Obviously AI – Recension & Test 2026 | obviously-ai | obviously.ai |
| Ocoya — all-in-one social med AI-content, design och schemaläggning | ocoya | ocoya.com |
| Octane AI – Recension & Test 2026 | octane-ai | octaneai.com |
| Otter.ai – Recension & Test 2026 | otter-ai | otter.ai |
| Paradox – Recension & Test 2026 | paradox | paradox.ai |
| Pattern89 — kreativ intelligens från Shutterstock | pattern89 | shutterstock.com |
| PDF.ai – Recension & Test 2026 | pdf-ai | pdf.ai |
| Pencil — AI-video och statiska annonser för Meta | pencil-ai | trypencil.com |
| Persado — enterprise-AI för emotion-driven copy | persado | persado.com |
| Photomath AI – Recension & Test 2026 | photomath-ai | photomath.com |
| Phrase – Recension & Test 2026 | phrase | phrase.com |
| Pi AI – Recension & Test 2026 | pi-ai | pi.ai |
| Pieces – Lokalt AI-snippet- och kontextminne | pieces | pieces.app |
| Pipedream – Kodbara workflows för utvecklare | pipedream | pipedream.com |
| Pipedrive AI – Recension & Test 2026 | pipedrive-ai | pipedrive.com |
| Pitch – Recension & Test 2026 | pitch | pitch.com |
| Play.ht – Recension & Test 2026 | play-ht | play.ht |
| Playground AI — Recension 2026 | playground-ai | — (ingen i REVIEW_KNOWN) |
| Pleo — företagskort och utläggshantering med AI | pleo-ai | pleo.io |
| Plus AI – Recension & Test 2026 | plus-ai | plusai.com |
| Podcastle – Recension & Test 2026 | podcastle | podcastle.ai |
| Polymer – Recension & Test 2026 | polymer | polymersearch.com |
| Postwise — AI för X (Twitter) tweets och trådar | postwise | postwise.ai |
| Microsoft Power Automate – Automation i Microsoft 365 | power-automate | powerautomate.microsoft.com |
| Power BI Copilot – Recension & Test 2026 | power-bi-copilot | powerbi.microsoft.com |
| Predis.ai — AI-skapad social-content på sekunder | predis-ai | predis.ai |
| Publer – Recension & Test 2026 | publer | publer.com |
| PwC AI Tools — Big4-AI för revision och redovisning | pw-ai | pwc.com |
| Pymetrics – Recension & Test 2026 | pymetrics | harver.com |
| QuickBooks AI — Intuit Assist för småföretagare | quickbooks-ai | quickbooks.intuit.com |
| Quizlet AI – Recension & Test 2026 | quizlet-ai | quizlet.com |
| Rank Math AI — WordPress SEO-plugin med Content AI inbyggt | rankmath-ai | rankmath.com |
| Rebuy – Recension & Test 2026 | rebuy | rebuyengine.com |
| Reclaim AI – Recension & Test 2026 | reclaim-ai | reclaim.ai |
| Reconcile AI — AI för automatisk avstämning | reconcile-ai | reconcile.com |
| Reflect – Recension & Test 2026 | reflect | reflect.app |
| Relay.app – AI-automation med human-in-the-loop | relay-app | relay.app |
| Remove.bg — AI-bakgrundsborttagning Recension 2026 | removebg-bredig | remove.bg |
| Replica Studios – Recension & Test 2026 | replica-studios | replicastudios.com |
| Replit AI – Bygg och deploya appar med AI i webbläsaren | replit-ai | replit.com |
| Resemble AI – Recension & Test 2026 | resemble-ai | resemble.ai |
| Revealbot — automatiseringsregler för Meta, Google och TikTok | revealbot | revealbot.com |
| Riverside.fm – Recension & Test 2026 | riverside-fm | riverside.fm |
| Rossum – Recension & Test 2026 | rossum | rossum.ai |
| Rows AI – Recension & Test 2026 | rows-ai | rows.com |
| Rytr för content & copywriting — billigast pro-plan | rytr-content | rytr.me |
| Salesforce Einstein – Recension & Test 2026 | salesforce-einstein | salesforce.com |
| Screaming Frog AI — Crawler med AI för tekniska SEO-audits | screaming-frog-ai | screamingfrog.co.uk |
| SeekOut – Recension & Test 2026 | seekout | seekout.com |
| Sembly – Recension & Test 2026 | sembly | sembly.ai |
| Semrush AI — komplett SEO-svit med AI-content och rank tracking | semrush-ai | semrush.com |
| Shopify AI – Recension & Test 2026 | shopify-ai | shopify.com |
| SlidesAI – Recension & Test 2026 | slidesai | slidesai.io |
| Slidesgo AI – Recension & Test 2026 | slidesgo-ai | slidesgo.com |
| Smartcat – Recension & Test 2026 | smartcat | smartcat.com |
| Smartlead – Recension & Test 2026 | smartlead | smartlead.ai |
| Smartly.io — nordisk martech-plattform för social advertising | smartly-io | smartly.io |
| Socratic – Recension & Test 2026 | socratic | socratic.org |
| Soundraw – Recension & test 2026 | soundraw | soundraw.io |
| Sourcegraph Cody – AI som förstår hela din kodbas | sourcegraph-cody | sourcegraph.com |
| Speechify – Recension & Test 2026 | speechify | speechify.com |
| SpeedLedger e-bokföring — webbaserad bokföring med smart kategorisering | speedledger-ai | speedledger.se |
| Spellbook – Recension & Test 2026 | spellbook | spellbook.legal |
| Splice – Recension & test 2026 | splice | splice.com |
| Squarespace AI – Recension & Test 2026 | squarespace-ai | squarespace.com |
| Sunsama – Recension & Test 2026 | sunsama | sunsama.com |
| Surfer SEO — AI-content som rankar med Google | surfer-seo | surferseo.com |
| Synthesis AI – Recension & Test 2026 | synthesis-ai | synthesis.com |
| Tableau AI – Recension & Test 2026 | tableau-ai | tableau.com |
| Tabnine – Privacy-first AI-kodassistent | tabnine | tabnine.com |
| Taplio — AI för LinkedIn-content och relationer | taplio | taplio.com |
| TaxDome — practice management för redovisningsbyråer | taxdome-ai | taxdome.com |
| Tidio – Recension & Test 2026 | tidio | tidio.com |
| tl;dv – Recension & Test 2026 | tl-dv | tldv.io |
| Todoist AI – Recension & Test 2026 | todoist-ai | todoist.com |
| Tome – Recension & Test 2026 | tome | tome.app |
| Topaz Photo AI — Recension 2026 | topaz-photo-bredig | topazlabs.com |
| Trello AI – Recension & Test 2026 | trello-ai | trello.com |
| Turnitin AI – Recension & Test 2026 | turnitin-ai | turnitin.com |
| Uizard — Sketch-to-Design Recension 2026 | uizard-ux | uizard.io |
| Unbabel – Recension & Test 2026 | unbabel | unbabel.com |
| Visma eEkonomi — nordisk bokföring med stark AI-koppling | visma-ai | vismaspcs.se |
| Voicemaker – Recension & Test 2026 | voicemaker | voicemaker.in |
| Warmer.ai – Recension & Test 2026 | warmer-ai | warmer.ai |
| Webflow AI – Recension & Test 2026 | webflow-ai | webflow.com |
| Wellsaid Labs – Recension & Test 2026 | wellsaid-labs | wellsaidlabs.com |
| Windsurf – Agentisk AI-kodeditor från Codeium | windsurf | codeium.com |
| Wint AI — AI-controller för månadsbokslut | wint-ai | wint.ai |
| Wix AI – Recension & Test 2026 | wix-ai | wix.com |
| WooCommerce AI – Recension & Test 2026 | woocommerce-ai | woocommerce.com |
| Workday AI – Recension & Test 2026 | workday-ai | workday.com |
| AI Workflow Automation – Bästa verktygen, exempel & komplett guide | workflows | zapier.com |
| Xero AI — global molnredovisning med AI-features | xero-ai | xero.com |
| Yotpo AI – Recension & Test 2026 | yotpo-ai | yotpo.com |
| Zendesk AI – Recension & Test 2026 | zendesk-ai | zendesk.com |
| Zoho AI – Recension & Test 2026 | zoho-ai | zoho.com |
| Zoom AI – Recension & Test 2026 | zoom-ai | zoom.com |
| Adobe Firefly Video – Recension & test 2026 | adobe-firefly-video | firefly.adobe.com |
| CapCut AI — Videoredigering Recension 2026 | capcut-ai-vklipp | capcut.com |
| InVideo – Recension & test 2026 | invideo | invideo.io |
| Kaiber – Recension & test 2026 | kaiber | kaiber.ai |
| Luma Dream Machine – Recension & test 2026 | luma-dream-machine | lumalabs.ai |

### E) ÖVRIGA sidor utan bild (4) — ej A/B/C
| Path | Titel | Slug | Kind |
|---|---|---|---|
| /ai-verktyg/gratis/ai-bilder | Gratis AI-bildverktyg — Skapa AI-bilder utan att betala 2026 | ai-bilder | article |
| /ai-verktyg/gratis/ai-kod | Gratis AI-kodverktyg — Cursor, Copilot & Codeium 2026 | ai-kod | article |
| /ai-verktyg/gratis/ai-text | Gratis AI-textverktyg — Jämför ChatGPT, Claude & Gemini 2026 | ai-text | article |
| /ai-verktyg/gratis/ai-video | Gratis AI-video — Pika, Kling & Runway utan att betala 2026 | gratis-ai-video | article |
