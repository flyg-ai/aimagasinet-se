/**
 * wint-ai-specifik FAQ-generering (samma modell/JSON-kontrakt som
 * scripts/generate-faqs.ts) MEN strikt grundad på den korrigerade
 * content_mdx + verifierade profilfält. Anledning att inte köra den generiska
 * scripten: (1) den matar bara title+excerpt → modellen hittar på siffror
 * (det var så det felaktiga "1 500-3 000 kr/mån"-FAQ:t uppstod); (2) den
 * klassar flata /ai-verktyg/wint-ai (depth 2) som 'hub', inte 'review'.
 *
 * Modellen får BARA använda fakta som finns i texten/faktarutan nedan.
 * Inga påhittade priser, procent, integrationsnamn eller kundsiffror.
 *
 *   npx tsx scripts/generate-faqs-wint.ts            # dry – skriver inte
 *   npx tsx scripts/generate-faqs-wint.ts --apply    # skriver faq till DB
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const MODEL = 'claude-haiku-4-5';
const APPLY = process.argv.includes('--apply');

// Den ENDA fakta modellen får använda (utöver löptexten i content_mdx).
const FACTS = `VERIFIERADE FAKTA (de enda siffror/namn du får använda):
- Bolag: Wint AB. Huvudkontor: Göteborg, Sverige. Grundat: 2011.
- Förvärvat 2024 av riskkapitalbolaget Norvestor. Omkring 5 000 företagskunder.
- Pris: från 699 kr/mån.
- Vad det är: svensk automatiserad ekonomitjänst som kombinerar bokföringsprogram och redovisningsbyrå i ett. AI sköter löpande bokföring, kvitto- och fakturahantering, betalningar, moms, lön samt bokslut och deklaration.
- Främst för aktiebolag.
- Styrkor: svensk tjänst med svensk support; kombinerar program + byrå; heltäckande för aktiebolag (från bokföring till deklaration).
- Svagheter: främst inriktat på aktiebolag; mindre lämpligt om du vill sköta bokföringen själv i ett traditionellt program.
- Wint är ÄNNU INTE betygsatt av AI-Magasinet (ny bedömning görs inför nästa testomgång).`;

const SYSTEM = `Du är senior redaktör på AI-Magasinet. Skriv 5 vanliga frågor med korta, konkreta svar (FAQ) om verktyget Wint.

# Hård regel om fakta
- Använd ENBART fakta som finns i den medskickade löptexten och faktarutan. Hitta INTE på något.
- Inga siffror, priser, procent, tidsbesparingar, kundantal, integrationsnamn (t.ex. specifika system) eller funktioner som inte uttryckligen står i underlaget.
- Enda priset som får nämnas är "från 699 kr/mån". Nämn INGA andra belopp.
- Sätt INGET betyg och påstå inte att Wint är "bäst" eller topprankat — verktyget är ännu inte betygsatt.
- Om en vanlig fråga (t.ex. exakt vilka system Wint integrerar med, eller exakt hur mycket tid man sparar) inte går att besvara från underlaget: ställ en annan fråga som GÅR att besvara, eller svara på en allmän nivå utan att uppfinna detaljer.

# Stil
- Svenska (naturlig affärssvenska). Svaren 2-4 meningar, konkreta. Inga floskler, inga emojis, ingen affiliate-CTA.
- Variera frågetyper: vad det är/vem det passar, kostnad, kom-igång, aktiebolag vs enskild firma, för- och nackdelar.

# Output
Returnera EXAKT JSON, inget annat:
{ "faqs": [ { "question": "?", "answer": "." }, ... 5 st ] }
INGEN \`\`\`json-wrapping, ingen prosa.`;

function htmlToText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

type Faq = { question: string; answer: string };

/** Modellutkastet (temp 0) faktagranskat mot content_mdx/faktarutan. Frågorna
 *  skrivs ordagrant; #2 trimmad — modellens "priset varierar beroende på
 *  omfattningen av dina behov" finns INTE i underlaget och är borttagen.
 *  Detta (inte ett nytt modellanrop) är det som skrivs vid --apply, så att det
 *  som hamnar i DB är exakt det granskade. */
const REVIEWED: Faq[] = [
  { question: 'Vad är Wint och vem är det gjort för?', answer: 'Wint är en svensk automatiserad ekonomitjänst som kombinerar bokföringsprogram och redovisningsbyrå i ett. Det är främst utformat för aktiebolag som vill automatisera hela ekonomin — från löpande bokföring och fakturahantering till moms, lön, bokslut och deklaration.' },
  { question: 'Vad kostar Wint?', answer: 'Wint kostar från 699 kr/mån. Tjänsten är ett abonnemang som ersätter både eget bokföringsprogram och separat redovisningsbyrå.' },
  { question: 'Vilka uppgifter hanterar Wint automatiskt?', answer: 'Wint sköter automatisk bokföring och kontering, kvitto- och fakturahantering, moms- och skattedeklaration, bokslut och årsredovisning samt lönehantering. Du behöver inte hantera dessa manuellt.' },
  { question: 'Är Wint lämpligt om jag vill sköta bokföringen själv?', answer: 'Nej, Wint är utformat för helautomatisering och passar mindre bra om du föredrar att sköta bokföringen själv i ett traditionellt bokföringsprogram. I så fall kan det vara värt att jämföra med andra verktyg.' },
  { question: 'Är Wint en svensk tjänst med svensk support?', answer: 'Ja, Wint är en svensk tjänst grundad 2011 med huvudkontor i Göteborg. Bolaget erbjuder svensk support och har omkring 5 000 företagskunder.' },
];

async function main() {
  console.log(APPLY ? '=== APPLY ===' : '=== DRY (kör med --apply) ===');
  const { data, error } = await db.from('articles').select('id,title,excerpt,content_mdx,faq').eq('slug', 'wint-ai').maybeSingle();
  if (error || !data) { console.error('✗ kunde inte hämta wint-ai:', error?.message); process.exit(1); }

  const userPrompt = [
    `Titel: ${data.title}`,
    `Sammanfattning: ${data.excerpt ?? ''}`,
    '',
    FACTS,
    '',
    'LÖPTEXT (content_mdx, ren text):',
    htmlToText(data.content_mdx ?? ''),
    '',
    'Skriv nu 5 FAQ-frågor och svar. Returnera bara JSON-objektet.',
  ].join('\n');

  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: 2000,
    temperature: 0,
    system: [{ type: 'text', text: SYSTEM }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  const text = msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim()
    .replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: { faqs?: Faq[] };
  try { parsed = JSON.parse(text); } catch (e) { console.error('Ogiltig JSON:', text.slice(0, 300)); process.exit(1); }
  const faqs = (parsed.faqs ?? []).filter((f): f is Faq => typeof f?.question === 'string' && typeof f?.answer === 'string').slice(0, 5);
  if (faqs.length < 5) { console.error(`✗ fick bara ${faqs.length} frågor`); process.exit(1); }

  // Förbjudna termer (fel produkt / icke-belagda siffror) — hård guard.
  const FORBIDDEN = /Tel Aviv|Israel|controller|vatten|IoT|månadsbokslut|mid-market|Anomaly|USD|1 ?[05]00|2 ?000|3 ?000|E-conomic|\b\d{1,3} ?procent\b|\b\d+ ?%/i;
  console.log('\nGenererade frågor:\n');
  let flagged = 0;
  faqs.forEach((f, i) => {
    const bad = FORBIDDEN.test(f.question + ' ' + f.answer);
    if (bad) flagged++;
    console.log(`${i + 1}. ${f.question}`);
    console.log(`   ${f.answer}${bad ? '   ⚠️ INNEHÅLLER MÖJLIGEN OBELAGD/FEL UPPGIFT' : ''}\n`);
  });
  if (flagged) { console.error(`✗ ${flagged} svar flaggade — skriver INTE. Granska prompten.`); process.exit(1); }
  console.log('✓ Inga förbjudna/obelagda termer i modellutkastet.');

  // Skriv den faktagranskade (frozen) versionen, inte det råa utkastet.
  for (const f of REVIEWED) {
    if (FORBIDDEN.test(f.question + ' ' + f.answer)) { console.error(`✗ REVIEWED innehåller förbjuden term: ${f.question}`); process.exit(1); }
  }
  console.log(`\nGranskad version som skrivs (${REVIEWED.length} frågor):`);
  REVIEWED.forEach((f, i) => console.log(`  ${i + 1}. ${f.question}`));

  if (APPLY) {
    const { error: uErr } = await db.from('articles').update({ faq: REVIEWED }).eq('id', data.id);
    if (uErr) { console.error('update misslyckades:', uErr.message); process.exit(1); }
    console.log('\n✓ faq skriven till wint-ai.');
  } else {
    console.log('\n(DRY — inget skrivet. Kör med --apply.)');
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
