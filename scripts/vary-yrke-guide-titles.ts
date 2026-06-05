/**
 * Variera titlar + excerpt/meta på de 10 yrkes-guiderna så de inte alla följer
 * mönstret "AI för X 2026 — så använder du AI i Y". 6 titlar är handsatta enligt
 * önskemål; de 4 övriga + alla excerpt/meta-descriptions genereras via Claude
 * Haiku, med kravet att max 3 guider får dela liknande inledning.
 *
 *   npx tsx scripts/vary-yrke-guide-titles.ts
 *
 * Uppdaterar title, seo_title, excerpt, seo_description i DB.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

type Guide = { path: string; yrke: string; title?: string };
const GUIDES: Guide[] = [
  { path: '/ai-verktyg/rekrytering/hr', yrke: 'HR-ansvarig', title: 'HR och AI 2026 — verktyg och tips för moderna HR-team' },
  { path: '/ai-verktyg/crm/saljare', yrke: 'säljare', title: 'Säljare och AI — så vinner du fler affärer 2026' },
  { path: '/ai-verktyg/marknadsforing/marknadsforing-yrke', yrke: 'marknadsförare', title: 'Marknadsföring med AI — komplett guide för 2026' },
  { path: '/ai-verktyg/ekonomi/bokforare', yrke: 'bokförare', title: 'Bokföring med AI — automatisera och effektivisera 2026' },
  { path: '/ai-verktyg/ekonomi/revisor', yrke: 'revisor', title: 'AI i revisionen — vad fungerar och vad bör du tänka på?' },
  { path: '/ai-verktyg/juridik/advokat', yrke: 'advokat och jurist', title: 'Juridik och AI 2026 — guide för advokater och jurister' },
  { path: '/ai-verktyg/utbildning/larare', yrke: 'lärare och pedagog' },
  { path: '/ai-verktyg/ai-kod-verktyg/utvecklare', yrke: 'utvecklare och programmerare' },
  { path: '/ai-verktyg/kundservice/kundtjanst-yrke', yrke: 'kundtjänstmedarbetare' },
  { path: '/ai-verktyg/rekrytering/rekryterare', yrke: 'rekryterare' },
];

type Out = { title: string; excerpt: string; metaDescription: string };

async function main() {
  const fixedLines = GUIDES.filter((g) => g.title).map((g) => `- ${g.path} (${g.yrke}): TITEL = "${g.title}"`).join('\n');
  const genLines = GUIDES.filter((g) => !g.title).map((g) => `- ${g.path} (${g.yrke}): generera ny varierad titel`).join('\n');

  const prompt = `Du är SEO-redaktör på AI-Magasinet. Vi har 10 yrkes-guider om AI. Alla hade tidigare mönstret "AI för X 2026 — så använder du AI i Y" och vi vill variera dem.

För dessa 6 guider — BEHÅLL den givna titeln exakt:
${fixedLines}

För dessa 4 guider — generera en NY varierad svensk titel (inkludera gärna 2026), 50-65 tecken:
${genLines}

Krav på titlarna sammantaget: MAX 3 guider får dela liknande inledning/mönster. De 6 fasta använder redan mönstret "[Yrke] och AI" tre gånger (HR, Säljare, Juridik) — så de 4 nya titlarna får INTE börja med "[Yrke] och AI". Variera inledningarna (t.ex. "AI i …", "… med AI", "Så …", en fråga, etc.).

För ALLA 10 guider: skriv även en NY varierad excerpt (en mening, ~20-30 ord) och en meta description (~140-160 tecken). Variera formuleringarna — undvik att alla börjar med "Praktisk guide för …".

Returnera EXAKT JSON (inget annat, ingen \`\`\`):
{"<path>": {"title":"...","excerpt":"...","metaDescription":"..."}, ...alla 10 paths...}`;

  const msg = await claude.messages.create({ model: 'claude-haiku-4-5', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] });
  const raw = msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim()
    .replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(raw) as Record<string, Out>;

  // Säkerställ att de 6 fasta titlarna behålls exakt (oavsett vad modellen råkar returnera).
  for (const g of GUIDES) if (g.title && parsed[g.path]) parsed[g.path].title = g.title;

  let ok = 0;
  for (const g of GUIDES) {
    const o = parsed[g.path];
    if (!o?.title || !o.excerpt) { console.error(`  saknar data för ${g.path}`); continue; }
    const { error } = await db.from('articles').update({
      title: o.title, seo_title: o.title, excerpt: o.excerpt, seo_description: o.metaDescription ?? o.excerpt,
    }).eq('path', g.path);
    if (error) { console.error(`  FAIL ${g.path}: ${error.message}`); continue; }
    console.log(`  OK ${g.path}\n     "${o.title}"`);
    ok++;
  }
  console.log(`\n${ok}/${GUIDES.length} guider uppdaterade.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
