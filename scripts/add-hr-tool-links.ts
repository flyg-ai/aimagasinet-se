/**
 * Länkar in 15Five, Rippling och Culture Amp i HR-hubbens "Verktyg att
 * känna till"-sektion nu när de har egna recensionssidor (seed-hr-new-
 * tools.ts). Ren sträng-ersättning på befintlig content_mdx, ingen
 * omskrivning av övrig text.
 *
 *   npx tsx scripts/add-hr-tool-links.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

async function main() {
  const { data, error } = await db.from('articles').select('content_mdx').eq('slug', 'hr').maybeSingle();
  if (error) { console.error(error.message); process.exit(1); }
  let html = data!.content_mdx as string;

  const edits: [string, string][] = [
    // Performance management-stycket: nämn 15Five bredvid Lattice.
    [
      '<p>Det här är kärnan i vad de flesta menar med "HR-mjukvara": medarbetarsamtal, OKR/målspårning, kontinuerlig feedback och engagemangsundersökningar. AI:n i den här kategorin är som starkast när den agerar på er egen organisationsdata — era faktiska mål, er faktiska feedback — snarare än att vara en generisk chatbot ovanpå ett formulär. <a href="/ai-verktyg/lattice/">Lattice</a> är vårt tydligaste exempel här.</p>',
      '<p>Det här är kärnan i vad de flesta menar med "HR-mjukvara": medarbetarsamtal, OKR/målspårning, kontinuerlig feedback och engagemangsundersökningar. AI:n i den här kategorin är som starkast när den agerar på er egen organisationsdata — era faktiska mål, er faktiska feedback — snarare än att vara en generisk chatbot ovanpå ett formulär. <a href="/ai-verktyg/lattice/">Lattice</a> och <a href="/ai-verktyg/15five/">15Five</a> är våra tydligaste exempel här — med olika styrkor i prissättning och vilka AI-funktioner som ingår på vilken nivå.</p>',
    ],
    // Ny h3 för 15Five, infogad direkt efter Lattice-stycket i "Verktyg att känna till".
    [
      '<h3>Deel — global lön och anställning</h3>',
      '<h3>15Five — performance management med transparent prissättning</h3>\n\n<p><a href="/ai-verktyg/15five/">15Five</a> är rätt val om ni vill veta exakt vad ni betalar för innan ni pratar med säljare — ovanligt för kategorin. Grundplanerna är per användare och månad, fakturerat årligen: Engage 4 USD (engagemangsundersökningar), Perform 11 USD (lägger till AMAYA AI Thought Partner, AI-assisterade performance-samtal och 15Five Agents), Total Platform 16 USD. Fristående AI-tillägg går att välja separat: Kona Notetaker (AI-sammanfattade 1-on-1-anteckningar) för 2 USD/anställd/mån, Kona AI Coach för 19 USD/chef/mån. Läs vår <a href="/ai-verktyg/15five/">fullständiga recension</a>.</p>\n\n<h3>Deel — global lön och anställning</h3>',
    ],
    // Rippling: lägg till länk i rubriken + "fullständig recension", ta bort "ingen recension ännu".
    [
      '<h3>Rippling — enhetlig HR, IT och ekonomi med AI-agent</h3>\n\n<p>Rippling skiljer sig från de flesta HR-system genom att det explicit spänner över HR, IT och ekonomi i samma plattform, med en inbyggd AI ("Rippling AI") som svarar på frågor tvärs över all er anslutna företagsdata, bygger anpassade rapporter och dashboards, och automatiserar arbetsflöden som sträcker sig över flera system samtidigt. Modulär prissättning från 8 USD per anställd och månad plus en månatlig baskostnad — slutpriset beror på vilka moduler ni väljer och antal anställda, med offert för den exakta siffran. Inget eget "gratis"-läge, men amerikanska VC-finansierade startups kan få sex månader gratis via ett separat startup-program. Ingen egen recension på sajten ännu.</p>',
      '<h3><a href="/ai-verktyg/rippling/">Rippling</a> — enhetlig HR, IT och ekonomi med AI-agent</h3>\n\n<p>Rippling skiljer sig från de flesta HR-system genom att det explicit spänner över HR, IT och ekonomi i samma plattform, med en inbyggd AI ("Rippling AI") som svarar på frågor tvärs över all er anslutna företagsdata, bygger anpassade rapporter och dashboards, och automatiserar arbetsflöden som sträcker sig över flera system samtidigt. Modulär prissättning från 8 USD per anställd och månad plus en månatlig baskostnad — slutpriset beror på vilka moduler ni väljer och antal anställda, med offert för den exakta siffran. Inget eget "gratis"-läge, men amerikanska VC-finansierade startups kan få sex månader gratis via ett separat startup-program. Läs vår <a href="/ai-verktyg/rippling/">fullständiga recension</a>.</p>',
    ],
    // Culture Amp: samma mönster.
    [
      '<h3>Culture Amp — engagemang och kultur</h3>\n\n<p>Culture Amp är den mest etablerade specialistplattformen för medarbetarengagemang. AI Coach ingår i alla planer och omvandlar organisationens egen arbetsplatsdata till konkreta insikter och handlingsplaner, bland annat hjälp åt chefer att skriva bättre utvärderingar och hantera svåra samtal. I Engage-produkten läser AI:n igenom fritextkommentarer från medarbetarundersökningar och sammanfattar teman, trender och förslag på nästa steg automatiskt. Ingen prissättning publiceras öppet — ren offert baserad på antal anställda, vilken produkt (Engage eller Perform) och vilken supportnivå (tre nivåer beroende på organisationsstorlek: under 200, 200–999, respektive 1 000+ anställda). Ingen egen recension på sajten ännu.</p>',
      '<h3><a href="/ai-verktyg/culture-amp/">Culture Amp</a> — engagemang och kultur</h3>\n\n<p>Culture Amp är den mest etablerade specialistplattformen för medarbetarengagemang. AI Coach ingår i alla planer och omvandlar organisationens egen arbetsplatsdata till konkreta insikter och handlingsplaner, bland annat hjälp åt chefer att skriva bättre utvärderingar och hantera svåra samtal. I Engage-produkten läser AI:n igenom fritextkommentarer från medarbetarundersökningar och sammanfattar teman, trender och förslag på nästa steg automatiskt. Ingen prissättning publiceras öppet — ren offert baserad på antal anställda, vilken produkt (Engage eller Perform) och vilken supportnivå (tre nivåer beroende på organisationsstorlek: under 200, 200–999, respektive 1 000+ anställda). Läs vår <a href="/ai-verktyg/culture-amp/">fullständiga recension</a>.</p>',
    ],
    // Slutstycket: uppdatera från "ung lista" till att reflektera 5 recenserade verktyg.
    [
      'Det här är fortfarande en ung lista jämfört med våra större kategorier — vi bygger ut den löpande efterhand som fler HR-specifika AI-verktyg testas på djupet och får egna recensioner. Prioriteringen hittills har varit verktyg med en verifierbar, faktabaserad bild snarare än att fylla listan med namn vi inte kunnat kontrollera ordentligt.',
      'Fem verktyg har egna, fullständiga recensioner hittills — Workday nämns ovan men väntar på en egen genomgång. Vi bygger ut listan löpande efter hand som fler HR-specifika AI-verktyg testas på djupet. Prioriteringen hittills har varit verktyg med en verifierbar, faktabaserad bild snarare än att fylla listan med namn vi inte kunnat kontrollera ordentligt.',
    ],
  ];

  let applied = 0;
  for (const [from, to] of edits) {
    if (!html.includes(from)) {
      console.error(`✗ Needle not found (skipping this edit):\n${from.slice(0, 80)}...`);
      continue;
    }
    html = html.replace(from, to);
    applied++;
  }

  if (applied !== edits.length) {
    console.error(`Only ${applied}/${edits.length} edits applied — aborting without writing.`);
    process.exit(1);
  }

  const { error: updErr } = await db.from('articles').update({ content_mdx: html }).eq('slug', 'hr');
  if (updErr) { console.error('update failed:', updErr.message); process.exit(1); }
  console.log(`OK — ${applied}/${edits.length} edits applied and saved. New length: ${html.length} chars.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
