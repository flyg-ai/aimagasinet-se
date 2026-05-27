/**
 * Generate guide-text for the 9 new juridik/kundservice/rekrytering hub pages
 * + the /ai-verktyg/foretag landing page SEO-intro via Claude API. Persists
 * to articles.content_mdx via Supabase service role. Idempotent — overwrites.
 *
 * Run: npx tsx scripts/generate-new-hub-guides.ts
 *
 * Shares system prompt with generate-hub-guides.ts and uses cache_control so
 * the prompt is written once and read 9× across the batch.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 8000;

const SYSTEM_PROMPT = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Din uppgift är att skriva guide-text för hubbsidor på sajten.

# Tonalitet och röst

AI-Magasinets röst är **expert, rak och praktisk** — inte "AI-ig". Du skriver för svenska företagare, marknadsförare, utvecklare och professionella som vill förstå AI på riktigt, inte bli sålda på hype.

Skriv som en kunnig kollega som har testat verktygen själv:
- **Konkret framför generiskt** — "Harvey AI tränas på legal text och hanterar M&A-flöden" inte "AI revolutionerar juridiken"
- **Specifika namn, siffror, exempel** — nämn verkliga verktyg, prismodeller, use cases
- **Erkänn nyanser** — om något funkar bra för vissa men illa för andra, säg det
- **Inga svulstiga formuleringar** — undvik "i en värld där...", "framtiden är här", "revolutionerande", "game changer"
- **Inga emojis i brödtexten**
- **Skriv på svenska — naturlig affärssvenska**, inte direktöversatt engelska

# Struktur

Varje guide ska ha tydlig röd tråd från intro → användningsområden → praktiska tips → slutsats. ~1500 ord totalt. Använd:

- En kort intro (1-2 stycken) som etablerar varför AI inom området är värt att förstå just nu
- 3-5 H2-rubriker som markerar huvudsektioner
- H3-underrubriker när det hjälper läsaren skanna
- Bullet-listor när du listar verktyg, kriterier, eller steg
- Konkreta exempel i prosa — visa hur AI används i praktiken
- En avslutande sektion med "Så väljer du" eller "Slutsats" som ger läsaren en handlingsplan

# Länkning till relaterade sidor

Du får en lista över relaterade sidor på sajten. Länka till dem **naturligt i prosan** med HTML-syntax: \`<a href="URL">Länktext</a>\`. Länkar ska kännas som hänvisningar inom samma resonemang, inte som "Läs mer här"-uppmaningar. Inkludera 3-6 interna länkar per guide.

# Formatering

Output ska vara **HTML** (inte Markdown) eftersom det renderas via dangerouslySetInnerHTML i magazine-prose. Använd:
- \`<h2>\`, \`<h3>\` för rubriker
- \`<p>\` för stycken
- \`<ul>\`/\`<ol>\` + \`<li>\` för listor
- \`<a href="...">text</a>\` för länkar
- \`<strong>\` för betoning (sparsamt)

# Vad som INTE ska finnas

- Inledningsmeningar som "I dagens snabbt föränderliga AI-landskap..."
- Floskler: "revolutionerar", "game-changer", "unleash the power"
- Generiska listor utan substans
- Korrekturmarkering, slut-summeringar i fetstil, CTA-knappar i texten
- Skriv inte ut H1-rubriken — den finns redan i page-templaten
- Ingen kod-block, ingen \`\`\`html\`\`\`-wrapping — bara ren HTML direkt

Skriv ren HTML direkt — börja med en \`<p>\`-tagg, sluta med en \`<p>\` eller \`<ul>\`-tagg. Inget annat före eller efter.`;

type HubSpec = {
  path: string;
  topic: string;
  audience: string;
  relatedLinks: { url: string; label: string }[];
  wordTarget?: number;
};

const HUBS: HubSpec[] = [
  // /ai-verktyg/foretag SEO-intro — slightly shorter
  {
    path: '/ai-verktyg/foretag',
    topic: 'AI för företag — verktyg, användningsområden och så väljer du',
    audience: 'Företagare, chefer och teamleads som vill förstå hur AI-verktyg kan implementeras i verksamheten — från marknadsföring och juridik till kundservice och rekrytering.',
    wordTarget: 1200,
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke', label: 'AI-verktyg efter yrke' },
      { url: '/ai-verktyg/foretag/yrke/marknadsforing', label: 'AI för marknadsföring' },
      { url: '/ai-verktyg/foretag/yrke/juridik', label: 'AI för juridik' },
      { url: '/ai-verktyg/foretag/yrke/kundservice', label: 'AI för kundservice' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering', label: 'AI för rekrytering' },
      { url: '/ai-verktyg/foretag/yrke/ekonomi-redovisning', label: 'AI för ekonomi & redovisning' },
    ],
  },

  // ── Juridik ──────────────────────────────────────────────────
  {
    path: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning',
    topic: 'AI för avtalsgranskning — Harvey AI, Spellbook, Ironclad och Luminance för svenska byråer och bolagsjurister',
    audience: 'Advokater, bolagsjurister och paralegals på svenska byråer som granskar kommersiella avtal mot egna playbooks.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning/harvey-ai-avtal', label: 'Harvey AI för avtalsgranskning' },
      { url: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning/spellbook-avtal', label: 'Spellbook för avtalsgranskning' },
      { url: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning/ironclad-ai-avtal', label: 'Ironclad AI' },
      { url: '/ai-verktyg/foretag/yrke/juridik/due-diligence', label: 'AI för due diligence' },
      { url: '/ai-verktyg/foretag/yrke/juridik', label: 'AI för juridik' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/juridik/due-diligence',
    topic: 'AI för due diligence — Luminance, Kira Systems, eBrevia och Harvey i M&A-flöden',
    audience: 'M&A-jurister, transaktionsadvokater och DD-team på advokatbyråer och investmentbolag.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/juridik/due-diligence/luminance-dd', label: 'Luminance för DD' },
      { url: '/ai-verktyg/foretag/yrke/juridik/due-diligence/kira-systems-dd', label: 'Kira Systems' },
      { url: '/ai-verktyg/foretag/yrke/juridik/due-diligence/ebrevia-dd', label: 'eBrevia' },
      { url: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning', label: 'AI för avtalsgranskning' },
      { url: '/ai-verktyg/foretag/yrke/juridik', label: 'AI för juridik' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/juridik/rattsutredningar',
    topic: 'AI för rättsutredningar — Harvey, Lexis+ AI och Casetext för svensk och internationell rätt',
    audience: 'Bolagsjurister, advokater och paralegals som gör rättsutredningar och behöver verifierbara citat.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/juridik/rattsutredningar/lexis-ai-ratts', label: 'Lexis+ AI' },
      { url: '/ai-verktyg/foretag/yrke/juridik/rattsutredningar/casetext-ratts', label: 'Casetext CoCounsel' },
      { url: '/ai-verktyg/foretag/yrke/juridik/rattsutredningar/harvey-ai-ratts', label: 'Harvey AI' },
      { url: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning', label: 'AI för avtalsgranskning' },
      { url: '/ai-verktyg/foretag/yrke/juridik', label: 'AI för juridik' },
    ],
  },

  // ── Kundservice ──────────────────────────────────────────────
  {
    path: '/ai-verktyg/foretag/yrke/kundservice/chatbot',
    topic: 'AI-chatbottar för kundservice — Intercom Fin, Zendesk AI, Freshdesk Freddy och Tidio Lyro',
    audience: 'Customer service-chefer, support-leads och digitala chefer som vill automatisera tier-1-ärenden.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/kundservice/chatbot/intercom-ai-chatbot', label: 'Intercom AI Fin' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/chatbot/zendesk-ai-chatbot', label: 'Zendesk AI' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/chatbot/tidio-chatbot', label: 'Tidio Lyro' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/epost-svar', label: 'AI för e-postsvar' },
      { url: '/ai-verktyg/foretag/yrke/kundservice', label: 'AI för kundservice' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/kundservice/epost-svar',
    topic: 'AI för e-postsvar i kundservice — Zendesk AI, Freshdesk Freddy, Forethought och Salesforce Einstein',
    audience: 'Support-team, kundtjänstchefer och e-handlare som hanterar stora volymer support-mejl.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/kundservice/epost-svar/zendesk-ai-epost', label: 'Zendesk AI för e-post' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/epost-svar/forethought-epost', label: 'Forethought' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/epost-svar/salesforce-einstein-epost', label: 'Salesforce Einstein' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/chatbot', label: 'AI-chatbottar' },
      { url: '/ai-verktyg/foretag/yrke/kundservice', label: 'AI för kundservice' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/kundservice/rost-ai',
    topic: 'Röst-AI och voicebottar för kundservice — telefon-support, transkribering och samtalsanalys',
    audience: 'Contact center-chefer, customer success-chefer och företag med stora telefon-supportflöden.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/kundservice/rost-ai/aisera-rost', label: 'Aisera röst-AI' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/rost-ai/salesforce-einstein-rost', label: 'Salesforce Einstein Voice' },
      { url: '/ai-verktyg/foretag/yrke/kundservice/rost-ai/intercom-ai-rost', label: 'Intercom Fin Voice' },
      { url: '/ai-verktyg/ai-ljud-och-musik/elevenlabs', label: 'ElevenLabs (röst-AI)' },
      { url: '/ai-verktyg/foretag/yrke/kundservice', label: 'AI för kundservice' },
    ],
  },

  // ── Rekrytering ──────────────────────────────────────────────
  {
    path: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening',
    topic: 'AI för CV-screening — Workday, Greenhouse, Eightfold och Pymetrics i moderna rekryteringsflöden',
    audience: 'Talent acquisition-team, rekryteringskonsulter och HR-chefer på medelstora och stora svenska bolag.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening/workday-ai-cv', label: 'Workday AI' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening/greenhouse-ai-cv', label: 'Greenhouse AI' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening/eightfold-ai-cv', label: 'Eightfold AI' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/jobbannonser', label: 'AI för jobbannonser' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering', label: 'AI för rekrytering' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/rekrytering/jobbannonser',
    topic: 'AI för jobbannonser — skriv inkluderande annonser och testa tone, bias och attraktivitet',
    audience: 'Rekryterare, employer branding-team och TA-chefer som vill optimera jobbannonser för bredd och kvalitet.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/rekrytering/jobbannonser/workday-ai-annonser', label: 'Workday AI för annonser' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/jobbannonser/greenhouse-ai-annonser', label: 'Greenhouse AI' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/jobbannonser/paradox-annonser', label: 'Paradox Olivia' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening', label: 'AI för CV-screening' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering', label: 'AI för rekrytering' },
    ],
  },
  {
    path: '/ai-verktyg/foretag/yrke/rekrytering/kandidatmatchning',
    topic: 'AI för kandidatmatchning — Beamery, Eightfold, SeekOut och Fetcher för skills-baserad rekrytering',
    audience: 'Sourcing-team, executive search-konsulter och TA-team med komplexa skills-pipelines.',
    relatedLinks: [
      { url: '/ai-verktyg/foretag/yrke/rekrytering/kandidatmatchning/eightfold-ai-matchning', label: 'Eightfold AI' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/kandidatmatchning/beamery-matchning', label: 'Beamery' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/kandidatmatchning/seekout-matchning', label: 'SeekOut' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening', label: 'AI för CV-screening' },
      { url: '/ai-verktyg/foretag/yrke/rekrytering', label: 'AI för rekrytering' },
    ],
  },
];

async function generate(hub: HubSpec): Promise<{ html: string; usage: Anthropic.Usage }> {
  const userPrompt = [
    `Hubsida: ${hub.path}`,
    `Ämne: ${hub.topic}`,
    `Målgrupp: ${hub.audience}`,
    '',
    'Relaterade sidor att länka till naturligt i prosan (HTML <a href> i texten):',
    ...hub.relatedLinks.map((l) => `- ${l.label} → ${l.url}`),
    '',
    `Skriv guide-texten nu. ~${hub.wordTarget ?? 1500} ord, ren HTML, börja med första <p>-taggen.`,
  ].join('\n');

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const html = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();

  return { html, usage: response.usage };
}

async function persist(path: string, html: string): Promise<number> {
  const { data, error } = await supabase
    .from('articles')
    .update({ content_mdx: html })
    .eq('path', path)
    .select('id');
  if (error) throw new Error(`supabase update ${path}: ${error.message}`);
  return data?.length ?? 0;
}

async function main() {
  console.log(`Generating ${HUBS.length} guide articles with ${MODEL}…\n`);
  let totalInput = 0, totalCacheRead = 0, totalCacheWrite = 0, totalOutput = 0;

  for (let i = 0; i < HUBS.length; i++) {
    const hub = HUBS[i];
    const t0 = Date.now();
    try {
      const { html, usage } = await generate(hub);
      const wordCount = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const rowsUpdated = await persist(hub.path, html);
      const dt = Date.now() - t0;
      console.log(
        `[${i + 1}/${HUBS.length}] ${hub.path}` +
        `  ${wordCount} words  ${(dt / 1000).toFixed(1)}s  ` +
        `cache_read=${usage.cache_read_input_tokens ?? 0}  ` +
        `cache_write=${usage.cache_creation_input_tokens ?? 0}  ` +
        `output=${usage.output_tokens}  rows=${rowsUpdated}`
      );
      totalInput += usage.input_tokens;
      totalCacheRead += usage.cache_read_input_tokens ?? 0;
      totalCacheWrite += usage.cache_creation_input_tokens ?? 0;
      totalOutput += usage.output_tokens;
    } catch (e) {
      console.error(`[${i + 1}/${HUBS.length}] ${hub.path} FAILED: ${e instanceof Error ? e.message : e}`);
    }
  }

  console.log(
    `\nTotal: input=${totalInput}  cache_read=${totalCacheRead}  ` +
    `cache_write=${totalCacheWrite}  output=${totalOutput}`
  );
}

main();
