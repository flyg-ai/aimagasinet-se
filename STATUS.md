# aimagasinet.se — läget just nu (2026-10-22)

## Bugg hittad och fixad: AI-konsult-hubben skickade alltid "Stockholm"

Ägaren pekade ut att "Få hjälp att hitta rätt" och "Utforska konsulter efter stad" på `/ai-konsult/`
felaktigt länkade till Stockholms-sidan. Grävde djupare än länken: `AiKonsultWizard`/`AiKonsultForm` har
INGET synligt ort-fält — `city` är en tyst prop som default:ade till `'Stockholm'` och skickades rakt in i
mejlet till oss (`Ny förfrågan: AI-konsult, Stockholm`) så fort någon fyllde i wizardern direkt på
huvudsidan, oavsett var företaget faktiskt låg. **Fixat:**
- Tog bort `'Stockholm'`-defaulten i `AiKonsultWizard.tsx`/`AiKonsultForm.tsx`.
- Formuläret visar nu ett "Vilken ort?"-fält NÄR `city` inte redan är känd (dvs. på huvudhubben) — på de
  riktiga stadssidorna (`/ai-konsult/goteborg/` osv) frågas inget, orten är redan given av sammanhanget.
- De 5 hårdkodade `/ai-konsult/stockholm/`-länkarna på huvudsidan (`app/ai-konsult/page.tsx`) pekar nu om
  till `#hitta-ratt` / `#stader`-ankare på samma sida istället. Tog även bort en redundant "Se alla
  orter"-länk (listan under den visade redan ALLA städer, `HUB_CITIES` mappar hela `CITIES`-arrayen).
- Testat lokalt: wizardern på huvudsidan visar nu ort-fältet och skickar rätt värde, stadssidorna frågar
  inget och fungerar som innan.
**Opushat** — väntar på godkännande.

## Klart: tre konkurrerande artiklar om svenska AI-bolag städade upp

Ägaren tyckte Lovable inte längre känns som ett "startup" (värt miljarder) i vår startup-lista. Vid
granskning visade det sig att det låg **tre** olika artiklar om samma ämne i databasen, inte två:

- `/svenska-ai-startups-2026` (id 836, publ. juni) — mest kritisk/granskande, men redan 301:ad till
  nedanstående via `redirects.seo-test.mjs` (test 4) sedan tidigare. Fungerar som avsett, ingen bugg.
- **`/svenska-ai-foretag-2026`** (id 458, publ. 7–8 okt) — bredast, redan tydligt avgränsad till bolag där
  AI är kärnan (uttrycklig FAQ om varför Spotify/Klarna/Volvo Cars INTE räknas). Detta är den som faktiskt
  ligger bakom redirecten och är **kanonisk nu**.
- `/svenska-ai-startups-att-halla-koll-pa-2026` (id 1099, publ. 12 okt) — tunnast, okritisk, dubblett.
  **Avpublicerad** (samma mönster som CV-dubbletten tidigare: `type`/`published_at` nollat, inte raderad).

**Gjort på kanoniska artikeln (`/svenska-ai-foretag-2026`, redan live i DB):**
- Uppdaterat Einride-stycket med juni 2026-nyheten: börsnotering på Nasdaq via SPAC (Legato Merger Corp.
  III), värdering 1,35 md dollar.
- Lagt till tre nya, researchade bolag som saknades: **Tandem Health** (AI-journalföring för vården,
  Kinnevik/EQT-finansierad), **Hopsworks** (MLOps/feature store, ex-Logical Clocks, KTH-ursprung),
  **Opper** (Task Completion API, backat av Lovable-investerarna Emblem/Greens Ventures).
- Ny FAQ-post om dessa nya bolag.

**Återstår — kräver deploy:** 301-regel `/svenska-ai-startups-att-halla-koll-pa-2026` →
`/svenska-ai-foretag-2026` är tillagd i `next.config.mjs` men inte pushad. Tills den är deployad ger den
avpublicerade URL:en 404 istället för redirect (ingen SEO-skada på kort sikt, men bör inte lämnas länge).
Ligger i samma opushade batch som AI-konsult-bugfixen ovan.

**Nästa steg om ägaren vill gå vidare:** lägg ev. till fler av de ~44 kvarvarande, overifierade bolagen
från AI Swedens partnerlista (endast Kognic, Hopsworks, Tandem Health, Opper är nu verifierade/täckta).

## Ny konvention: companies-taggning (grund för ett framtida /foretag/[slug]-index)

Ägaren vill kunna ranka på enskilda bolag (typ reviews för Claude, men för svenska AI-bolag) down the
line. Byggde grunden nu istället för att reda ut fritext-dubbletter senare:

- **Migration `0022_article_companies.sql`** — ny kolumn `articles.companies text[]` + GIN-index. Köjord i
  Supabase Dashboard av ägaren (klart).
- **`lib/companies.ts`** — register med kontrollerad slug per bolag (`lovable`, `legora`, `einride` osv),
  namn, webbplats, en-raders beskrivning, status (`startup`/`etablerad`/`uppkopt`). Lägg till bolaget här
  FÖRST, tagga sedan artikeln — annars syns det inte i ett framtida index.
- **Konvention framåt:** när en artikel nämner ett bolag substantiellt (inte bara i förbigående), lägg dess
  slug i `articles.companies`. Fritext i rubriker/brödtext dedupas INTE automatiskt — slugen är den enda
  sanningen.
- **Bakåtfyllt:** `/svenska-ai-foretag-2026` (20 bolag) och `/svenska-ai-startups-2026` (10 bolag, redirectad
  men raden finns kvar) är taggade nu.
- **Inte byggt än:** själva `/foretag/[slug]`-hubbsidan. Nästa steg när det blir aktuellt: en sida som
  listar alla artiklar där `companies` innehåller slugen, plus en-ras-profilen från `lib/companies.ts`.

## PÅGÅENDE — väntar på ägaren innan nästa steg: GEO-superguide

Ägaren vill ha en stor (~3000 ord), bildrik pelarartikel om **GEO (Generative Engine Optimization)** — hur
man syns i ChatGPT/Perplexity/Google AI Overviews etc. Ingen sådan guide finns idag (bara en verktygslista,
`/basta-ai-seo-verktyg-2026`). **Research är redan klar** — `seo-geo`-skillet laddades och gav en
källbelagd kunskapsbas (Googles egna GEO-dokument + OpenAI/Anthropic/Apple crawler-dokumentation +
Ahrefs/SE Ranking-studier), så nästa session behöver INTE göra om den researchen. Nyckelfynd att bygga på:

- **Google säger själva att GEO inte är en egen disciplin** — det är SEO applicerat på AI-ytor. Avfärdar
  uttryckligen llms.txt, "chunking" och mention-farming som verkningslösa för Google Search specifikt.
- **Varumärkesomnämnanden slår backlinks ~3x** för AI-synlighet (Ahrefs, 75 000 varumärken, dec 2025).
  YouTube-omnämnanden korrelerar starkast (0,737), Reddit och Wikipedia högt, Domain Rating/backlinks
  svagast (0,266).
- **AI Overviews och AI Mode är två SEPARATA citeringsmotorer** — samma slutsats 86% av gångerna, men
  citerar samma URL bara 13,7% av gångerna (Ahrefs, 540 000 sökfrågor).
- **Kritisk crawler-distinktion:** `GPTBot` (bara träning) ≠ `OAI-SearchBot` (avgör ChatGPT Search-
  citerbarhet). `Google-Extended` (bara Gemini-träning) ≠ `Googlebot` (avgör AI Overviews/AI Mode-synlighet).
  Samma mönster för `ClaudeBot` vs `Claude-SearchBot`.
- Plattformsspecifikt: ChatGPT citerar mest Wikipedia (47,9%) och Reddit (11,3%); Perplexity citerar mest
  Reddit (46,7%).
- Full detalj finns i skillet självt: `C:\Users\hallb\.claude\skills\seo-geo\` (särskilt
  `references/google-ai-optimization-guide.md` och `references/llmstxt-evidence.md`).

**Föreslagen struktur (godkänd riktning, inte skriven än):** 1) Vad är GEO (och varför Google säger att det
inte är nytt) 2) De stora AI-ytorna förklarade (bild: AIO/AI Mode som separata motorer) 3) Myterna som inte
funkar 4) Vad som faktiskt korrelerar med synlighet (bild: stapeldiagram varumärkeskorrelationer)
5) Crawlare — vem får komma in (bild/tabell som reder ut GPTBot-vs-OAI-SearchBot-förvirringen)
6) Plattform för plattform 7) Praktisk checklista (quick wins → medium → high impact) 8) FAQ.

**VÄNTAR PÅ:** ägaren ska be ChatGPT om en egen disposition (prompt gavs: "Jag ska skriva en superguide om
GEO... Ge mig din bästa disposition för en 3000-ords guide... plus de 3 mest konkreta råden") och återkommer
med GPT:s svar i en NY chatt, för att mergas med researchen ovan innan skrivandet börjar. **Gör inget mer på
den här artikeln förrän ägaren är tillbaka med det.**

## Nytt sedan 21–22 okt: Search Console-access + ett helt optimeringspass

**Setup:** Kopplade in `seo-google`-skillet mot riktig Search Console-data. Service account fanns redan i
GCP (`aimagasinet@aimagasinet.iam.gserviceaccount.com`), nyckelfil hittades i gamla Downloads (`~/Downloads/
aimagasinet-273507b83ddf.json`) och kopierades till `~/.config/claude-seo/service_account.json` + skrev
`~/.config/claude-seo/google-api.json` (OBS på Windows: använd `/`-sökvägar i JSON, `\`-escapning i en bash-
heredoc trasslade till det första försöket). Fungerar nu live, Tier 1.

**Analys gjord:** sidor med position 7–15 (impressions men låg CTR). **Viktigt fynd:** varumärkessökningar
(claude, github copilot, cursor) är inte värda att jaga — officiella sajter dominerar position 1–3
strukturellt oavsett innehåll. Generiska köpbeslut-sökningar ("bästa ai appen") är mer vinnbara.
**Sajtomfattande mönster:** av 55 "bästa X/topp X"-sidor hade bara 2 en jämförelsetabell och ~30 saknade
fördelar/nackdelar — de bästa sidorna (4 100–5 600 ord) är flera gånger längre än snittet (800–2000 ord).

**Åtgärdat i den här omgången (prioriterat efter GSC-impressions):**
- `/basta-ai-apparna-for-mobilen-topp-15` (400 impr) — jämförelsetabell + fördelar/nackdelar på alla 15
  appar, 920→~1900 ord. Hittade och fixade samtidigt ett sakfel: Socratic-appen är avvecklad (flyttad till
  Google Lens), artikeln påstod fel att den gick att ladda ner.
- `/ai-verktyg/marknadsforing/annonser` (147 impr) och `/ai-verktyg/marknadsforing/content-copywriting`
  (19 impr) — jämförelsetabeller tillagda.
- `/basta-ai-musikappen-gratis-2026` + `/basta-ai-bildappen-gratis-2026` — tog bort en tom "Vanliga
  frågor"-stubbe (`<h2>Vanliga frågor</h2><p>Svaren finns i FAQ-avsnittet nedan.</p>`) som dubblerade den
  riktiga FAQ-sektionen i tomgång. Samma mönster kan finnas på fler sidor från samma skrivflöde — inte
  sökt igenom systematiskt än.
- **Löste en äkta sökordskannibalisering:** två CV/personligt brev-artiklar var byte-identiska, publicerade
  4 minuter efter varandra. Den utan impressions raderad ur DB, 301-redirect pushad i `next.config.mjs`
  (`305c1e9`).
- `/sa-ser-du-om-en-bild-ar-fejk/` byggdes ut separat (ägaren tyckte den var för tunn, 456 ord) till 788 ord
  med genuint ny research: OpenAI och Google lanserade båda C2PA/SynthID-vattenstämpling för AI-bilder 2026.

**Kvarstår, inte gjort:** samma tabell/fördelar-nackdelar-mönster för de ~50 andra "bästa X"-sidorna som
inte hade mätbara GSC-impressions värda att agera på i den här omgången — värt en ny körning om några
veckor när mer data samlats. Konkurrentdata (aikompassen.com) visar en kollaps från 105 till 13 rankande
sökord mellan juni och oktober 2026 — okänt varför, bara aggregerade siffror analyserade, ingen
sökordsnivå-export än.

## Äldre: ny guide publicerad — `/ai-guiden/ai-agenter`

Utgångspunkt: ägaren undrade om `ai.se`:s "Skapa din egen AI-agent"-sida (som rankar #1) var värd att
efterlikna. Research visade att den rankningen troligen beror på domänauktoritet (AI Sweden, statligt/EU-
finansierat), inte på innehållskvalitet — ingen synlig schema markup, inkonsekventa rubriknivåer, video utan
transkription. Svensk konkurrens på "vad är en AI-agent"/"skapa AI-agent" var genomgående svag (cm.com =
produktmarknadsföring, Salesforce = säljsida, unite.ai sv = bra struktur men för tekniskt tät för nybörjare).
Luckan: ingen svensk sida kombinerade en enkel förklaring med konkreta, namngivna verktyg i en praktisk övning.

**Byggd lösning:** `/ai-guiden/ai-agenter` (type='page', parent_slug='ai-guiden', samma mönster som de 6
befintliga `/ai-guiden/*`-guiderna från `scripts/seed-ai-guiden.ts`). Innehåll: vad en agent är kontra chatbot/
assistent, agentens fyra byggstenar (modell/instruktioner/verktyg/styrslinga), två praktiska bygg-vägar
(ChatGPT/Claude utan kod, n8n/Make/Zapier för att koppla till riktiga system) med numrerade steg-för-steg,
vanliga misstag/risker, FAQ (6 frågor i `faq`-kolumnen). Interna länkar till riktiga befintliga sidor (verifierat
mot DB innan publicering, inte gissat): `/ai-verktyg/chatgpt`, `/ai-verktyg/claude`, `/ai-verktyg/n8n`,
`/ai-verktyg/make`, `/ai-verktyg/zapier-ai`, jämförelsesidorna `make-eller-n8n`/`zapier-ai-eller-n8n`, den
befintliga `/ai-agenter-i-praktiken-...`-artikeln, Claude Code-guiden, AI-konsult-hubben, och syskonguiderna
under `/ai-guiden`. Publicerad direkt via ett engångsskript i `tmp/` (nu borttaget) + cache-revaliderad live
(`/ai-guiden/ai-agenter/` och `/ai-guiden/` gav `revalidated` i svaret). Verifierat i webbläsare: rendering,
FAQ-accordion, länkar pekar rätt.

**Inte gjort:** Copilot Studio och Lindy AI nämns inte (ingen egen recension att länka till — flaggat som
möjliga framtida artiklar om de blir relevanta).

## Search Console-access satt upp + första optimeringspasset

Ägaren ville koppla in Google Search Console-data för att hitta sidor med position 7–15 (impressions men
inga klick) och se vad konkurrenter på position 1–5 har som vi saknar. **Setup:** service account fanns redan
i GCP (`aimagasinet@aimagasinet.iam.gserviceaccount.com`), nyckelfil hittades i `~/Downloads/
aimagasinet-273507b83ddf.json` från ett tidigare tillfälle — kopierad till `~/.config/claude-seo/
service_account.json` + skrev `~/.config/claude-seo/google-api.json` (OBS: använd `/`-sökvägar i JSON:en på
Windows, `\`-escapning i en bash-heredoc trasslade till det första försöket). Nu Tier 1, GSC fungerar live
via `seo-google`-skillet (`/seo google gsc <property>`).

**Viktigt fynd:** sökord på varumärkesnamn (claude, github copilot, cursor, pipedream) — höga impressions,
0 klick, position 7–9 — är INTE värda att jaga. De officiella sajterna dominerar position 1–3 strukturellt
oavsett innehåll. Fokusera istället på generiska köpbeslut-sökningar ("bästa ai appen", "bästa ai") där det
inte finns en dominerande officiell konkurrent.

**Sajtomfattande mönster hittat:** av 55 "bästa X/topp X"-sidor hade bara 2 en jämförelsetabell och ~30
saknade fördelar/nackdelar helt — de två bästa sidorna (4 100 och 5 600 ord, med tabell) är flera gånger
längre än snittet (800–2000 ord). **Första optimeringsomgången, prioriterat efter faktiska GSC-impressions:**
- `/basta-ai-apparna-for-mobilen-topp-15` (400 impr) — lade till jämförelsetabell + fördelar/nackdelar på
  alla 15 appar (920→~1900 ord). Upptäckte och fixade samtidigt sakfel: Socratic-appen är avvecklad (funktion
  flyttad till Google Lens), artikeln påstod fel att den gick att ladda ner.
- `/ai-verktyg/marknadsforing/annonser` (147 impr) — lade till jämförelsetabell över de 8 nämnda verktygen.
- `/basta-ai-musikappen-gratis-2026` och `/basta-ai-bildappen-gratis-2026` — tog bort en tom
  "Vanliga frågor"-stubbe (`<h2>Vanliga frågor</h2><p>Svaren finns i FAQ-avsnittet nedan.</p>`) som bara
  dubblerade den riktiga FAQ-sektionen i tomgång. Samma mönster kan finnas på fler sidor skrivna av samma
  flöde — inte sökt igenom systematiskt än.
- `/ai-verktyg/marknadsforing/content-copywriting` (19 impr) — lade till jämförelsetabell över 9 verktyg.
  Saknar fortfarande featured_image (type='page', samma StandalonePageTemplate-begränsning som ai-guiden).

**Bonusfynd under revisionen: löst en riktig sökordskannibalisering.** Två artiklar om AI för CV/personligt
brev (`/ai-cv-och-personligt-brev-verktyg-prompts` och `/ai-cv-personligt-brev-basta-verktygen-prompts`) var
byte-för-byte identiska, publicerade 4 minuter efter varandra 19 aug — ett uppenbart dubbelpublicerings-
misstag. Den med 0 impressions raderades ur DB; en 301-redirect till den kanoniska (som hade riktiga
impressions) lades till i `next.config.mjs`, i samma stil som `redirects.dedup.generated.mjs`/
`merge-duplicates.ts` redan hanterar för /ai-verktyg/-dubbletter. **Redirecten kräver en deploy för att
aktiveras** (Next.js `redirects()` byggs in vid build-time) — ligger opushad i väntan på godkännande.

**Kvarstår, inte gjort än:** samma tabell/fördelar-nackdelar-mönster för de ~50 andra "bästa X"-sidorna som
inte prioriterades i den här omgången (ingen av dem hade mätbara GSC-impressions värda att agera på just nu,
men kan vara värt en ny KOH-körning om några veckor när mer data samlats).

## Trafik-brainstorm: leta fler "Spotify-artiklar"

Ägaren pekade ut `/topp-50-ai-latar-pa-spotify-2026/` (egentligen 75 AI-låtar/artister) som en artikel som
drar stadigt mycket klick dagligen, och vill hitta fler ämnen i samma anda — trend + kontrovers + listformat
+ svensk vinkel + uppdateras löpande. Research gav 10 kandidater (Tilly Norwood/AI-skådespelare, Sora-
nedstängningen, AI-influencers, AI-companion-appar, AI-deepfakes, virala AI-bildtrender, AI-böcker på Amazon,
AI-nyhetsuppläsare, AI-NPC:er, AI-låtar på TikTok). **Publicerad först:** `/basta-ai-filmerna-2026/`
(category ai-nyheter, type post, author sara-nilsson) — en genomgång av den oberoende AI-kortfilmsscenen
(Sparknify Human vs. AI Film Festival, AI International Film Festival, Shortest AI Film Competition), med
namngivna vinnare och skapare, plus Air Head/Shy Kids-fallet som visar att "helt AI-genererat" ofta överdrivs
i marknadsföring. Länkar till egna recensioner av Midjourney och Kling AI.

**Viktig lärdom under research:** ett första utkast till en "15 virala AI-videor 2026"-lista visade sig vara
en AI-genererad, ogrundad innehålls-farm-artikel (ingen skapare, inga verifierbara källor för visningssiffror)
— användes INTE som underlag. Research för AI-böcker på Amazon gav däremot gott om verifierbara, namngivna
fall (Thélyson Orélien, "Shy Girl"/Hachette, H.M. Smiths "Daggermouth", Lena McDonalds "Darkhollow Academy"
med kvarglömd AI-prompt-text, Stony Brook-studien) — en tänkt framtida artikel bör vinklas som avslöjanden/
skandaler snarare än "bästa AI-böckerna", eftersom det inte finns legitima AI-böcker att hylla på samma sätt
som AI-musikakter. **Nästa kandidater att bygga, i prioritetsordning:** AI-skådespelare/Tilly Norwood
(Hollywood-kontrovers pågår just nu), Sora-nedstängningen + bästa alternativen (naturlig affiliate-koppling
till video-recensionerna), AI-influencers-lista.

**Tredje artikeln i serien: `/basta-ai-bockerna-2026/`.** Ägaren ville INTE ha en ren skandal-vinkel (som jag
först föreslog) utan en topplista-känsla likt film-artikeln: böcker som öppet är AI-skrivna OCH bra, med
skandalerna som en sekundär sektion. Research gav bara 5 äkta träffar för den positiva kategorin (Sympathy
Tower Tokyo/Rie Kudan — vann Akutagawa-priset, Japans finaste litteraturpris; Death of an Author/Stephen
Marche; Pharmako-AI och Air Age Blueprint/K Allado-McDowell; 1 the Road/Ross Goodwin) — ärligt mycket
tunnare än film-listans 28, eftersom öppenhet om tung AI-användning straffas hårt av den etablerade
bokbranschen (se Shy Girl/Hachette). Skandal-sektionen är desto rikare: Daggermouth (Simon & Schuster,
Stony Brook-studien flaggade 60% AI), Thélyson Orélien (utesluten ur Prix Goncourt-urvalet), Shy Girl,
Darkhollow Academy (kvarglömd AI-prompt-text). Nordisk vinkel: norska "Lise vs Gianni" (Cappelen Damm drog
tillbaka den), och en AI-illustrerad barnbok som faktiskt VANN Adlibris pris 2025. Länkar till vårt eget
AI-detektor-kluster (GPTZero, Originality.ai, Copyleaks, basta-ai-detektorer-2026).

**Ny: anpassad 404-sida (`app/not-found.tsx`).** Ägaren visade en Lovable-prototyp (mörkt tema, "AI Guide
Hub") med en animerad punkt-/linjebakgrund bakom "404"-siffrorna. Byggde en egen `NotFoundNetworkBg.tsx`
(canvas) som samplar "404"-glyfen till en spridd punktmängd, kopplar ihop närliggande punkter med linjer och
låter dem driva sakta — respekterar `prefers-reduced-motion`. **Riktig bugg under byggandet:**
`getBoundingClientRect()` ger brutna CSS-pixelvärden (t.ex. 670.4px), men canvasens faktiska bredd avrundas
till heltal när den sätts — använde av misstag det obrutna värdet i pixelindex-beräkningen mot
`getImageData()`, vilket förskjuter varje rads minnesadress och gör att INGA punkter hittas (helt tom
canvas, inga JS-fel). Fixat genom att använda canvasens faktiska `.width`/`.height` (efter avrundning) i
indexeringen. Sidan i övrigt: riktiga interna länkar (Startsidan/AI-Nyheter/AI-Verktyg/AI-Guiden), en
sidebar med de 4 senaste ARTIKLARNA (hämtat live från DB — INTE påhittad "mest läst"-statistik, vi har
ingen sådan data) och det riktiga nyhetsbrevsformuläret (`SubscribeForm`). Testat mot flera 404-URL:er,
animationen bekräftad röra sig via två skärmdumpar med mellanrum.

**Bugg hittad och fixad: dubbel FAQ-sektion.** Tre av de fyra artiklarna i den här sessionen (filmerna,
böckerna, fejk-bild-quizet) hade av misstag BÅDE en egen inskriven `<h2>Vanliga frågor</h2>` i `content_mdx`
OCH strukturerad data i `faq`-kolumnen som `ArticleTemplate` redan renderar automatiskt som ett dragspel
(FaqAccordion) — syntes som två "Vanliga frågor"-sektioner på sidan. Tog bort de inskrivna duplikaten ur
alla tre artiklars `content_mdx`. **Passade också på att flytta FAQ-sektionen i `ArticleTemplate.tsx`** — låg
tidigare EFTER Taggar/Dela-sektionen (kändes bakvänt, FAQ hör innehållsmässigt ihop med artikeln, inte med
sidfots-metadata). Ligger nu direkt efter artikeltexten, före Taggar/Dela. Verifierat mot flera artiklar
(med FAQ, utan FAQ) att inget annat gick sönder.

**Uppdatering samma dag — bygga ut filmlistan + embeds:** Listan utökades från 8 till 28 namngivna filmer/
skapare (Runway AI Film Festival med riktiga prispengar, AI International Film Festival, Sparknify 2025+2026,
Shortest AI Film Competition, plus Paul Trillo/Dave Clark individuellt), och fick en "Att hålla koll på:
Critterz"-sektion om OpenAIs AI-assisterade långfilm mot Cannes. La sedan in riktiga YouTube-embeds (samma
mönster som Spotify-artikelns Spotify-iframes, se `scripts/update-topp75-and-dates.ts` `embedHtml()`) för topp
3: A Face Only A Mother Could Love (Robert Gaudettes egen kanal), Air Head (OpenAIs kanal), The Hardest Part
(Washed Outs officiella kanal) — alla verifierade genom att faktiskt söka upp dem på YouTube, inte gissade
video-ID:n. **Försökte utöka till topp 5 embeds + topp 10-länkar på ägarens begäran, men avbröt:** sökte
igenom placering 4–10 (Yuki, Down The Hatch, BENCH, TAIRELL ISN'T REAL, Crownless & Bound, THE WELL, Riders
Club) och ingen av dem har en publik YouTube-upload än — stämmer med vad artikeln redan säger om att färska
2026-vinnare oftast bara visas på festivaler. Ägaren accepterade att stanna vid 3 embeds (en sida med fler
iframes blir också onödigt tung).

**Omslagsbild (og_image) satt i efterhand:** `/ai-guiden/*`-sidorna renderar aldrig `featured_image`
(StandalonePageTemplate läser den inte alls), så og:image-fallbacken är `og_image`. De 6 befintliga guiderna
hade redan en genererad sådan via `scripts/generate-og-images.ts` (mörk bakgrund, titel, sidfot). Samma stil
återskapades manuellt för `ai-agenter` (ej via bulk-skriptet, eftersom det sätter kicker-texten "Recension &
test 2026" på alla `type='page'`-rader — fel för en guide. Satte "AI-guiden" som kicker istället). Lagrad på
samma `featured-images/og/`-prefix i Storage. **Upptäckt i förbigående, inte åtgärdat:** alla 6 befintliga
`/ai-guiden/*`-sidor har fortfarande fel kicker-text ("Recension & test 2026" på en nybörjarguide) — litet,
inte brådskande, men värt att fixa om `generate-og-images.ts` körs om eller utökas med ett per-typ-villkor.



Överlämning till en ny chatt. Läs den här filen först, sedan `ADMIN.md` om du ska röra /admin,
och **`C:\Users\hallb\.claude\CLAUDE.md`** (global, laddas automatiskt i alla projekt — innehåller
Vercel/GitHub-kontostrukturen som annars är lätt att missförstå som ett säkerhetsproblem).

## Så jobbar vi

- **Repo:** `C:\Users\hallb\Desktop\aimagasinet.se\web`. Next.js 14.2.35 (App Router), Tailwind, Supabase.
- **Svenska i allt** som syns för läsare, och i commit-meddelanden.
- **Aldrig påhittade fakta.** Verifiera priser och nyheter på leverantörens egen sida eller via WebSearch.
  Attribuera generiskt ("tester/bedömningar gjorda") i stället för att påstå "vi testade X" om det inte är
  bokstavligen sant. Om ni faktiskt testat något (se AI-detektor-klustret och Claude Code-guiden nedan),
  skriv det öppet, inklusive vad som gick fel.
- **Committa aldrig utan explicit begäran**, men batcha inte i onödan när en fix rättar till något som redan
  är live och fel (t.ex. Vercel-CPU-fixet nedan pushades direkt).
- **tmp/-mappen är gitignored** — engångsskript för DB-ändringar skrivs dit och tas bort direkt efter körning.
- **Ett separat projekt, aijakten.se, påbörjades i den här sessionen men är helt avbrutet härifrån** —
  se `C:\Users\hallb\Desktop\aijakten.se\web\STATUS.md` om det kommer upp. Rör ingenting där från en
  aimagasinet-chatt.

## Databas (Supabase) — oförändrat sedan tidigare

- **`articles`:** `slug`, `path` (utan avslutande snedstreck), `title`, `content_mdx` (HTML trots namnet),
  `excerpt`, `seo_title`, `seo_description`, `category`, `tags`, `type` (`post` = artikel/nyhet, `page` =
  recension/hubb/standalone-guide), `author_slug`, `faq`, `featured_image`, `og_image`, `published_at`,
  `parent_slug`, `affiliate_url`, `updated_at`, `content_updated_at`.
- **`content_updated_at`** ändras bara när `title` eller `content_mdx` ändras. Styr "Uppdaterad …",
  `dateModified`, metataggen och sitemapen.
- **`parent_slug` är inte kosmetisk** — `lib/route-kind.ts` `classify()` använder den för att avgöra om en
  `/ai-verktyg/<slug>`-sida (djup 2) ska renderas som recension eller som en tom kategori-hubb. En recension
  utan `parent_slug` (eller med `parent_slug === 'ai-verktyg'`) blir fel mall. Se incidenten nedan.
- **Skribenter i `authors`:** `redaktionen`, `nicklas-hallberg` (grundare, riktiga djupguider/recensioner),
  `erik-lindgren`, `sara-nilsson` (pseudonymer för riktiga bidragsgivare som inte vill stå med riktiga namn
  — nämn inte det här för någon utanför den här kontexten).
- **Bilder:** bucket `featured-images`, omslag på `articles/<slug>.webp`, sharp → 1200 px webp kvalitet 85.
  Inbäddade bilder i långa artiklar ligger i en undermapp, t.ex. `articles/<slug>/bild-N.webp`.
- **`comparisons`-tabellen:** JSON-blob per slug som driver `/ai-verktyg/jamfor/[jamforelse]/`.

## Cache och publicering

- **`revalidate = false`** på `app/[...slug]/page.tsx` sedan commit `c11939b` (5 okt) — artiklar byggs bara
  om på begäran.
- **NYTT (19 okt): samma bugg hittades och fixades på två till rutter.** `app/kategori/[slug]/page.tsx` och
  `app/skribenter/[slug]/page.tsx` hade `revalidate = 3600` men saknade `generateStaticParams` — renderades
  alltså dynamiskt mot Supabase vid VARJE anrop, inklusive varje sidas Next-prefetch av länkarna i
  header/mobilmeny/byline (dessa syns på nästan varje sida på hela sajten). Fixat: båda har nu
  `generateStaticParams`. Verifierat live: `x-vercel-cache: HIT`/`PRERENDER`. **Kvarstår:** kategorisidans
  artikelfråga (rad ~44 i `page.tsx`) saknar fortfarande `.limit()` — en obegränsad lista byggs vid varje
  statisk regenerering. Litet problem, inte brådskande.
- **Cron för nattlig AI-artikelgenerering är PAUSAD** (`vercel.json` har en tom `crons`-array) sedan ett par
  dagar — publicera manuellt via `/admin` tills vidare. Routen (`app/api/cron/generate-articles/route.ts`)
  finns kvar orörd; kan triggas manuellt med `curl -X POST ".../api/cron/generate-articles/?mode=news"`.
- **Rensa cachen på begäran:** `POST /api/revalidate/?key=<REVALIDATE_TOKEN>&path=/nagon-sida/` — OBS
  avslutande snedstreck på `/api/revalidate/`, annars 308-redirectar den och tappar POST-body.
- **Lokal dev-cache (`.next/cache`) kan bli stale** även efter omstart av dev-servern om en sida har
  `revalidate = false` — radera mappen (`rm -rf .next/cache`) om en redigerad artikel inte uppdateras lokalt.

## Vercel-förbrukningen — utredd grundligt, troligen löst

Kontot (kontakt-1657, Hobby) låg på "Exceeded free resources" i flera mätare. Två separata agent-utredningar
(Fable + Opus) pekade ut grundorsaken:
1. **Historisk:** maj–5 okt hade artikelrutten ingen/felaktig revalidate-konfiguration → varje sidvisning
   kostade en full funktionskörning. Fixat 5 okt.
2. **Pågående fram till 19 okt:** samma bugg på kategori-/skribent-rutterna (se ovan), förvärrat av att de
   länkas/prefetchas från nästan varje sida. Fixat nu.
Om CPU/ISR-writes fortfarande är höga ett par dagar efter den här sessionen: kolla Vercel → Observability →
Functions, gruppera på route, se om någon annan rutt dominerar. Jämförelsepunkt: flyg.ai (större, mer
trafikerad syskonsajt, annat Vercel-konto) ligger normalt på 7–9 min CPU/dag.

## Senaste sessionens innehållsarbete (2026-10-13 till 2026-10-19)

**AI-konsult utökat till 9 städer:** Stockholm/Göteborg/Malmö (fanns) + Linköping, Örebro, Västerås,
Helsingborg, Norrköping, Jönköping (nya). Alla bolag verifierade mot egna webbplatser i två omgångar.
Uppsala uteslöts helt — inget bolag med verifierbart lokalt kontor hittades trots upprepade försök.

**Nytt stort innehållskluster: AI-detektorer.** Byggt från grunden, med ett riktigt genomfört test:
- Hub: `/basta-ai-detektorer-2026` — 7 verktyg (GPTZero, ZeroGPT, Originality.ai, Copyleaks, Winston AI,
  Turnitin AI, Content at Scale), nu ~15 000 tecken med köpguide/vanliga misstag/svenska förhållanden/EU
  AI Act-utblick, i samma klass som `/basta-ai-seo-verktyg-2026`.
- Testartikel: `/fungerar-ai-detektorer-pa-svenska` — tre textprov (mänskligt, rå AI, "humaniserad" AI) körda
  genom de verktyg som faktiskt gick att testa gratis. Resultat redovisat ärligt inklusive när verktyg hade
  fel (Originality.ai flaggade en äkta mänsklig text som 100 % AI; ZeroGPT missade den humaniserade AI-texten).
- 5 nya recensioner (GPTZero, Originality.ai, Copyleaks, Winston AI, ZeroGPT). **Incident:** alla fem
  saknade `parent_slug` vid publicering → renderades som tomma hubb-sidor i stället för recensioner, och
  `ReviewTemplate` fyllde i generiska/påhittade mock-betyg (fel verktygs siffror visades). Fixat: `parent_slug`
  satt i DB + riktiga profiler tillagda i `lib/review-profiles.ts` (kodändring, pushad). **Lärdom:** en ny
  recension MÅSTE ha `parent_slug` satt till en verklig hub (t.ex. `ai-text-verktyg`), annars blir både
  mall och innehåll fel utan att det syns vid en snabb koll.
- Gammal cannibaliserande artikel om "vilken AI är bäst på svenska" konsoliderad in i den breda
  `/chatgpt-vs-claude-vs-gemini-2026` (seo-test 5, se `redirects.seo-test.mjs`) + 301.
- Egen Google "Preferred Sources"-knapp (`components/PreferredSourceButton.tsx`) på alla artiklar — ersätter
  Googles otydliga standardtext ("Lägg till i önskade listor") med "Visa oss oftare i Google".

**Ny artikel: Claude Code för nybörjare.** `/claude-code-for-nyborjare-bygg-din-forsta-ai-bot` — en riktigt
genomförd nybörjarguide, kulminerar i en på riktigt byggd och testad AI-kundtjänstbot (scratch-projekt i
`C:\Users\hallb\Desktop\claude-code-demo-chatbot`, inte i detta repo). Skriven i två versioner efter
ägarfeedback: andra versionen är kortare (18 min läsning), chattbaserad i stället för terminal-tung, och
visar BÅDA ett gratis regelbaserat alternativ och det AI-drivna alternativet med ärlig kostnadsjämförelse i
kronor (kurs 9,50 kr/USD, samma som i prisartikeln). **Öppet:** kunde inte ta riktiga skärmdumpar av själva
skrivbordsapp-samtalet (inget skärmdumpsverktyg för det i den agentsessionen) — den delen är exempeltext.
Sex gamla, nu oanvända terminal-skärmdumpar ligger kvar i Storage (`featured-images/articles/
claude-code-nyborjarguide/bild-2,3,4,5,9,10.webp`) — trivial städning.

**Konkurrensanalys (Toolify.ai + tidigare GPT-analys av aival/aikompassen/hurbra) — två bekräftade,
obyggda luckor kvar:**
1. "Sammanfatta PDF/dokument med AI" — bara två enskilda recensioner (ChatPDF, PDF.ai), ingen egen lista.
2. "Bästa AI-verktyg för Excel/kalkylark 2026" — bara en "10 tips"-artikel, ingen verktygsjämförelse.
Mindre, snabb fix som inte gjorts än: länka Claude Code-guiden till den befintliga
`/ai-verktyg/kundservice/` ("Bästa AI-verktygen för kundservice & kundtjänst 2026") för läsare som hellre
köper en färdig lösning än bygger själva.

**Ny, obyggd idé: betald granskning för företag.** Diskuterat men inte implementerat: en CTA på
verktygs-hubbar ("Vill du att vi recenserar ert verktyg?") där betalning köper en GARANTERAD
granskningsplats inom en viss tid — ALDRIG ett garanterat bra betyg eller en köpt placering i rankningen.
Måste formuleras konsekvent med vad Om oss/Kontakt redan lovar ("placeringar är inte till salu"). Pris inte
bestämt. Kräver: justerad Kontakt-/Om oss-text, en CTA-komponent, ett enkelt formulär (kan återanvända
mönstret från `app/api/ai-konsult-forfragan/`).

## Vercel/GitHub-kontostrukturen — läs den globala CLAUDE.md för full utredning

Kort version: tre separata Vercel-konton (`hallbergnicklas-5899` äger julklapp-ai/parfym-ai/flyg-ai,
`kontakt-1657` äger aimagasinet-se/flyamba/cryptofeber-se/lagpriskalender.se, `kontakt-5070` äger
frisörtider). Samma GitHub-konto (`flyg-ai`) pushar till allt, men är Vercel-inloggningskopplat till
`kontakt-1657` — så pushar till hallbergnicklas-5899-ägda projekt blockeras ibland. Fungerande workaround:
`npx vercel login` + `npx vercel --prod`, inloggad som hallbergnicklas-5899. Full dokumentation i
`C:\Users\hallb\.claude\CLAUDE.md`.

## Öppna punkter (ej lösta, okänd aktualitet om de är gamla)

1. Integritetspolicyn var spärrad tills platshållare (ansvarig bolag, gallringstid, USA-överföring) fylls i
   — okänt om det fortfarande gäller, kolla `/integritetspolicy`.
2. `/ai-guiden/ai-for-dig-som-aldrig-testat-det` — opublicerat utkast (id 1053), okänt om aktuellt.
3. Loggor saknas för flera SEO-verktyg (Semrush, Ahrefs, Surfer, NeuronWriter, Clearscope, Screaming Frog).
4. Kategorisidans obegränsade artikelfråga (se Cache-avsnittet ovan) — lägg till `.limit()`.
5. Sex oanvända skärmdumpar i Storage (se Claude Code-guiden ovan) — kan raderas när som helst.

## Affiliate

- **Live:** Descript, Kling, Revid.ai (`/ai-video/revid-ai`, betyg 9,0/10).
- Om oss/kontakt säger att provisioner inte påverkar rankningen — håll den principen konsekvent om den
  betalda granskningsidén (se ovan) byggs.
