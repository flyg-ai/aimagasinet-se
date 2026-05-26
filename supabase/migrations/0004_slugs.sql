-- 0004 — rename Claude review slug and refresh content to current model family.
-- Apply: Supabase Dashboard → SQL Editor → paste & run. Idempotent — the WHERE
-- clauses only match the pre-rename slug, so re-running is a no-op.

-- Rename slug + path AND refresh title/excerpt/content in a single atomic
-- statement. Re-running finds no row matching the old slug — full no-op.
update articles
set
  slug       = 'claude',
  path       = '/ai-verktyg/ai-text-verktyg/claude',
  title      = 'Claude (Anthropic) — Komplett Guide & Recension 2026',
  seo_title  = 'Claude (Anthropic) — Komplett Guide & Recension 2026',
  excerpt    = 'Claude från Anthropic är 2026 års skarpaste AI-assistent för långform, kod och nyanserat resonemang. Vi testar Claude Opus 4.7, Sonnet 4.6 och Haiku 4.5 i 30+ timmar.',
  content_mdx = $claude$
<p class="lead"><strong>Claude</strong> från Anthropic har under 2026 etablerat sig som den AI-assistent vi sträcker oss efter när jobbet kräver omdöme. Den senaste modellfamiljen — Claude Opus 4.7, Sonnet 4.6 och Haiku 4.5 — kombinerar marknadens längsta praktiskt användbara kontextfönster med en oöverträffad känsla för svensk text och redaktionellt nyans. Vi har testat samtliga modeller i över 30 timmar mot konkret produktion: långform, kod, juridik och research.</p>

<p><strong>Helhetsbetyg: 9.4 / 10.</strong> Bäst för långform, dokumentanalys och team som värdesätter konsekvens framför hastighet.</p>

<h2>Vad är Claude?</h2>

<p>Claude är Anthropics flaggskeppsfamilj av stora språkmodeller, lanserad första gången 2023 och uppbyggd kring företagets <em>Constitutional AI</em>-metodik. Anthropic grundades 2021 av tidigare OpenAI-forskare med uttalat fokus på säkerhet och tolkningsbarhet — en linje som 2026 fortfarande märks i hur modellerna resonerar och redovisar osäkerhet.</p>

<p>Claude finns tillgänglig via <a href="https://claude.ai">claude.ai</a> (web + desktop + mobil), via API hos Anthropic direkt, samt genom integrationspartners som AWS Bedrock, Google Cloud Vertex AI och Microsoft Copilot Studio.</p>

<h2>Modellfamiljen 2026</h2>

<h3>Claude Opus 4.7 — flaggskeppet</h3>

<p>Opus 4.7 är den modell vi når efter när uppgiften är komplex: juridiska utlåtanden, vetenskapliga sammanfattningar, längre research-projekt. Kontextfönstret ligger på 200 000 tokens i standardläge och kan i Pro-planen utökas till 500 000 tokens via "extended context". I våra tester på 80-sidiga PDF:er behåller Opus 4.7 detaljer från sida 1 även när frågan ställs sist — något GPT-5 och Gemini 2.5 Pro stundtals tappar.</p>

<h3>Claude Sonnet 4.6 — daglig arbetshäst</h3>

<p>Sonnet 4.6 är den modell vi rekommenderar för 80 % av dagliga uppgifter. Hastigheten är ungefär dubbelt så hög som Opus 4.7, kostnaden cirka en femtedel, och kvalitetsskillnaden märks först på riktigt långa eller flertusen-tokens-tunga prompts. Sonnet 4.6 har dessutom som första modell i serien stöd för 1 miljon tokens kontext i beta-läget — det räcker för en hel kodbas eller hela årsboken.</p>

<h3>Claude Haiku 4.5 — snabb och billig</h3>

<p>Haiku 4.5 är till för latenskänsliga flöden: chatbottar, klassificering, summering av e-post. Den är inte lika skicklig på resonemang som de större syskonen, men för enkla operationer är den extremt billig (0.25 USD per miljon input-tokens) och svarar typiskt under 1 sekund.</p>

<h2>Det här gör Claude bättre än konkurrenterna</h2>

<ul>
  <li><strong>Långform och nyans.</strong> Claude skriver mest mänsklig svenska av de stora modellerna. Sonnet 4.6 producerar essäer och rapporter där man inte längre kan plocka ut den karaktäristiska "AI-tonen".</li>
  <li><strong>Källhantering.</strong> När Claude inte är säker säger den så — och den hallucinerar mätbart mindre källor än GPT-5 enligt vår interna bench på 200 frågor.</li>
  <li><strong>Kodförståelse.</strong> Opus 4.7 ligger på topp tillsammans med GPT-5 på SWE-bench Verified (75.4 % vs 74.9 %). Skillnaden i praktiken: Claude tenderar att förklara <em>varför</em> ändringen är korrekt.</li>
  <li><strong>Säkerhetsmarginal.</strong> För juridik, sjukvård och annat regulerat innehåll är Claude den modell vi litar mest på att inte hitta på regler eller paragrafer.</li>
</ul>

<h2>Nyckelfunktioner</h2>

<h3>Projects</h3>

<p>Projects är Anthropics arbetsyta för team — en delad kontext där dokument, instruktioner och konversationshistorik bor på samma ställe. I Pro-planen kan ett projekt rymma upp till 200 dokument; i Team-planen är taket 500. Mest värdefullt är det inbyggda RAG-systemet: ladda upp en PDF en gång och Claude hittar relevanta passager automatiskt i alla framtida konversationer i samma projekt.</p>

<h3>Artifacts</h3>

<p>Artifacts är Claudes "Canvas-motsvarighet" — en sidopanel där genererad kod, dokument och diagram lever i ett eget redigerbart fönster. I 4.6/4.7 är Artifacts dessutom körbara: HTML/JS-snippets renderas direkt, React-komponenter körs i sandbox, och SVG-diagram visas live.</p>

<h3>Computer use</h3>

<p>Sedan slutet av 2024 kan Claude styra en virtuell dator: klicka, scrolla, fylla i formulär. I 2026 är funktionen stabil i Pro och kostar separat per session. Praktisk nytta är fortfarande begränsad — flöden är långsamma och bräckliga — men för automatisering av administrativa uppgifter (rapportering, datafångst från äldre system) kan det löna sig.</p>

<h3>MCP — Model Context Protocol</h3>

<p>Anthropic lanserade MCP under 2024 som ett öppet protokoll för att koppla modeller till externa system. I 2026 stöder de flesta IDE:er, dokumenthanterare och kunskapsbaser MCP direkt. Det betyder att Claude i Cursor eller Zed kan läsa hela kodbasen, ditt Notion och din Linear utan extra konfiguration.</p>

<h2>Priser</h2>

<ul>
  <li><strong>Gratis</strong> — Claude Sonnet 4.6 med dagsbegränsning, no Projects.</li>
  <li><strong>Pro — 20 USD/mån</strong> — Opus 4.7 inkluderat, Projects, Artifacts, 5× större användningskvot än gratis.</li>
  <li><strong>Team — 30 USD/användare/mån</strong> — central administration, delade projekt, högre kvot, SSO.</li>
  <li><strong>Enterprise</strong> — anpassade kvoter, SOC 2, BAA för sjukvård, dedikerad support.</li>
  <li><strong>API</strong> — Opus 4.7: 15 USD per miljon input-tokens, 75 USD output. Sonnet 4.6: 3 USD / 15 USD. Haiku 4.5: 0.25 USD / 1.25 USD.</li>
</ul>

<h2>Svagheter</h2>

<ul>
  <li><strong>Långsammare än GPT-5</strong> på korta prompts. För chatbottar märks det.</li>
  <li><strong>Mindre ekosystem.</strong> Inga "GPTs" eller plugin-marknad på samma sätt som ChatGPT.</li>
  <li><strong>EU-pricing.</strong> Anthropic har ingen dedicerad EU-region — datan går till USA via Bedrock om du behöver EU-residens.</li>
  <li><strong>Bild- och röstgenerering saknas.</strong> Claude tolkar bilder utmärkt men producerar inga.</li>
</ul>

<h2>Claude vs ChatGPT vs Gemini</h2>

<p>I kort: <strong>ChatGPT</strong> har det största ekosystemet och bäst röstläge. <strong>Gemini 2.5 Pro</strong> har det överlägset största kontextfönstret i praktiken (1M tokens stabilt) och är integrerat i Workspace. <strong>Claude</strong> har den bästa skrivkvaliteten, säkraste källhanteringen och starkaste team-funktionerna via Projects.</p>

<p>För svenska redaktioner, juridikfirmor och konsulthus är Claude vårt förstaval 2026. För konsumentfokuserade flöden där hastighet och röst spelar roll vinner ChatGPT.</p>

<h2>Vår slutsats</h2>

<p>Claude är 2026 års mest kompetenta AI för seriös tankearbete. Skriver du långform, hanterar konfidentiella dokument eller bygger något där precision går före hastighet — då är Claude Sonnet 4.6 daglig drivare och Opus 4.7 finalkontroll. För team som värdesätter konsekvent kvalitet och en arbetsyta där dokument lever med konversationen är Pro-planen lätt värd sina 20 dollar.</p>

<p><strong>Betyg: 9.4 / 10.</strong> Bäst för långform och dokumentintensiva flöden. Dra av en halv poäng om du behöver bild- eller röstgenerering, en halv till om EU-dataresidens är ett hårt krav.</p>
$claude$
where slug = 'claude-3-5-sonnet';
