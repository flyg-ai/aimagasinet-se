/**
 * Generate the profession guide pages linked from the new /ai-verktyg/foretag
 * yrke-grid. Each is a ~800-word practical "Så använder du AI som [yrke]"-guide
 * via Claude Sonnet 4.6, stored as type='post' (→ ArticleTemplate) with
 * parent_slug=null so it never pollutes a hub topplista. Idempotent — upserts
 * on path; FORCE=1 regenerates bodies.
 *
 *   npx tsx scripts/generate-yrke-guides.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const MODEL = 'claude-sonnet-4-6';
const FORCE = process.env.FORCE === '1';

type Yrke = {
  path: string; baseSlug: string; yrke: string; title: string; excerpt: string;
  tags: string[]; focus: string; links: { label: string; href: string }[];
};

const YRKEN: Yrke[] = [
  {
    path: '/ai-verktyg/utbildning/larare', baseSlug: 'larare', yrke: 'lärare och pedagog',
    title: 'AI för lärare 2026 — så använder du AI i undervisningen',
    excerpt: 'Praktisk guide för lärare: så använder du AI för lektionsplanering, material, bedömning och feedback — med konkreta verktygstips och vad du bör undvika.',
    tags: ['AI för lärare', 'utbildning', 'pedagogik'],
    focus: 'lektionsplanering, skapa material och prov, individanpassning, återkoppling och bedömning, samt vad man bör tänka på kring källkritik och elevdata',
    links: [
      { label: 'AI-textverktyg', href: '/ai-verktyg/ai-text-verktyg/' },
      { label: 'AI-presentationsverktyg', href: '/ai-verktyg/presentationer/' },
      { label: 'AI-bildverktyg', href: '/ai-verktyg/ai-bild-verktyg/' },
    ],
  },
  {
    path: '/ai-verktyg/juridik/advokat', baseSlug: 'advokat', yrke: 'advokat och jurist',
    title: 'AI för advokater & jurister 2026 — så använder du AI i juridiken',
    excerpt: 'Praktisk guide för jurister: AI för avtalsgranskning, rättsutredning, due diligence och dokumentutkast — med verktygstips och fallgropar kring sekretess.',
    tags: ['AI för jurister', 'juridik', 'advokat'],
    focus: 'avtalsgranskning, rättsutredning och praxissökning, due diligence, utkast till dokument, samt sekretess och tystnadsplikt vid AI-användning',
    links: [
      { label: 'AI-verktyg för juridik', href: '/ai-verktyg/juridik/' },
      { label: 'Harvey AI', href: '/ai-verktyg/juridik/harvey-ai/' },
      { label: 'AI-textverktyg', href: '/ai-verktyg/ai-text-verktyg/' },
    ],
  },
  {
    path: '/ai-verktyg/ekonomi/revisor', baseSlug: 'revisor', yrke: 'revisor',
    title: 'AI för revisorer 2026 — så använder du AI i revisionen',
    excerpt: 'Praktisk guide för revisorer: AI för dataanalys, avvikelseidentifiering, dokumentation och bokslut — med verktygstips och vad du bör tänka på kring kvalitet.',
    tags: ['AI för revisorer', 'revision', 'ekonomi'],
    focus: 'dataanalys och stickprov, avvikelse- och riskidentifiering, dokumentation och rapportering, månads- och årsbokslut, samt kvalitetssäkring och oberoende',
    links: [
      { label: 'AI-verktyg för ekonomi', href: '/ai-verktyg/ekonomi/' },
      { label: 'AI för redovisning', href: '/ai-verktyg/ekonomi/redovisning/' },
    ],
  },
  {
    path: '/ai-verktyg/ekonomi/bokforare', baseSlug: 'bokforare', yrke: 'bokförare',
    title: 'AI för bokförare 2026 — så använder du AI i bokföringen',
    excerpt: 'Praktisk guide för bokförare: AI för automatisk kontering, kvittotolkning, avstämning och kundkommunikation — med konkreta verktygstips för svenska byråer.',
    tags: ['AI för bokförare', 'bokföring', 'ekonomi'],
    focus: 'automatisk kontering och kvittotolkning, avstämningar, löpande bokföring, kundkommunikation och rådgivning, samt hur byråer skalar med AI',
    links: [
      { label: 'AI för bokföring', href: '/ai-verktyg/ekonomi/bokforing/' },
      { label: 'AI-verktyg för ekonomi', href: '/ai-verktyg/ekonomi/' },
    ],
  },
  {
    path: '/ai-verktyg/marknadsforing/marknadsforing-yrke', baseSlug: 'marknadsforare', yrke: 'marknadsförare',
    title: 'AI för marknadsförare 2026 — så använder du AI i marknadsföringen',
    excerpt: 'Praktisk guide för marknadsförare: AI för content, SEO, annonser och sociala medier — med konkreta verktygstips och en arbetsflödesplan.',
    tags: ['AI för marknadsförare', 'marknadsföring'],
    focus: 'content och copywriting, SEO, annonsproduktion och paid media, sociala medier, samt hur man bygger ett AI-stött marknadsflöde utan generisk text',
    links: [
      { label: 'AI för marknadsföring', href: '/ai-verktyg/marknadsforing/' },
      { label: 'AI för SEO', href: '/ai-verktyg/marknadsforing/seo/' },
      { label: 'AI för content & copywriting', href: '/ai-verktyg/marknadsforing/content-copywriting/' },
    ],
  },
  {
    path: '/ai-verktyg/crm/saljare', baseSlug: 'saljare', yrke: 'säljare',
    title: 'AI för säljare 2026 — så använder du AI i försäljningen',
    excerpt: 'Praktisk guide för säljare: AI för leads, lead scoring, mejl, samtalsanalys och prognoser — med verktygstips för CRM och hur du vinner tid till kundmöten.',
    tags: ['AI för säljare', 'försäljning', 'CRM'],
    focus: 'prospektering och lead scoring, personaliserade säljmejl, samtals- och mötesanalys, försäljningsprognoser, samt hur AI i ditt CRM frigör tid till kundmöten',
    links: [
      { label: 'Bästa CRM med AI', href: '/ai-verktyg/crm/' },
      { label: 'AI för marknadsföring', href: '/ai-verktyg/marknadsforing/' },
      { label: 'AI-verktyg för företag', href: '/ai-verktyg/foretag/' },
    ],
  },
  {
    path: '/ai-verktyg/rekrytering/hr', baseSlug: 'hr-ansvarig', yrke: 'HR-ansvarig',
    title: 'AI för HR 2026 — så använder du AI i HR-arbetet',
    excerpt: 'Praktisk guide för HR: AI för rekrytering, onboarding, medarbetarkommunikation och kompetensutveckling — med verktygstips och vad du bör tänka på kring partiskhet.',
    tags: ['AI för HR', 'HR', 'personal'],
    focus: 'rekrytering och CV-screening, onboarding, intern kommunikation och policydokument, kompetensutveckling, samt risker kring partiskhet och personuppgifter',
    links: [
      { label: 'AI för rekrytering & HR', href: '/ai-verktyg/rekrytering/' },
      { label: 'AI-textverktyg', href: '/ai-verktyg/ai-text-verktyg/' },
    ],
  },
  {
    path: '/ai-verktyg/ai-kod-verktyg/utvecklare', baseSlug: 'utvecklare', yrke: 'utvecklare och programmerare',
    title: 'AI för utvecklare 2026 — så använder du AI i kodningen',
    excerpt: 'Praktisk guide för utvecklare: AI för kodkomplettering, refaktorering, felsökning, tester och dokumentation — med verktygstips och hur du behåller kvaliteten.',
    tags: ['AI för utvecklare', 'kod', 'programmering'],
    focus: 'kodkomplettering och agentisk kodning, refaktorering, felsökning, tester, dokumentation och code review, samt hur man behåller kvalitet och säkerhet',
    links: [
      { label: 'AI-kodverktyg', href: '/ai-verktyg/ai-kod-verktyg/' },
      { label: 'AI-textverktyg', href: '/ai-verktyg/ai-text-verktyg/' },
    ],
  },
  {
    path: '/ai-verktyg/kundservice/kundtjanst-yrke', baseSlug: 'kundtjanst', yrke: 'kundtjänstmedarbetare',
    title: 'AI för kundtjänst 2026 — så använder du AI i kundservice',
    excerpt: 'Praktisk guide för kundtjänst: AI för svarsförslag, chatbottar, ärendesammanfattning och tonläge — med verktygstips och hur du behåller den mänskliga känslan.',
    tags: ['AI för kundtjänst', 'kundservice'],
    focus: 'svarsförslag och mallar, chatbottar och självbetjäning, ärendesammanfattning och routing, tonläge och översättning, samt när en människa bör ta över',
    links: [
      { label: 'AI för kundservice', href: '/ai-verktyg/kundservice/' },
      { label: 'AI-textverktyg', href: '/ai-verktyg/ai-text-verktyg/' },
    ],
  },
  {
    path: '/ai-verktyg/rekrytering/rekryterare', baseSlug: 'rekryterare', yrke: 'rekryterare',
    title: 'AI för rekryterare 2026 — så använder du AI i rekryteringen',
    excerpt: 'Praktisk guide för rekryterare: AI för jobbannonser, CV-screening, kandidatmatchning och intervjuförberedelse — med verktygstips och fallgropar kring partiskhet.',
    tags: ['AI för rekryterare', 'rekrytering'],
    focus: 'jobbannonser, CV-screening och gallring, kandidatmatchning och sourcing, intervjuförberedelse, samt partiskhet, transparens och kandidatupplevelse',
    links: [
      { label: 'AI för rekrytering & HR', href: '/ai-verktyg/rekrytering/' },
      { label: 'AI-verktyg för företag', href: '/ai-verktyg/foretag/' },
    ],
  },
];

async function genGuide(y: Yrke): Promise<string> {
  const linkLines = y.links.map((l) => `- ${l.label} → ${l.href}`).join('\n');
  const prompt = `Du är senior redaktör på AI-Magasinet. Skriv en praktisk guide på cirka 800 ord (svenska) med rubriken/temat "Så använder du AI som ${y.yrke}".

Fokus: ${y.focus}.

Krav:
- Returnera ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`-block. Skriv INTE ut H1 (titeln finns i mallen). Börja med ett <p>.
- Naturlig affärssvenska, konkret och praktisk. Inga floskler ("revolutionerande", "i en värld där"). Inga emojis.
- Ge konkreta, praktiska verktygsrekommendationer och exempel på arbetsflöden för yrket.
- Väv in dessa interna länkar naturligt i prosan med <a href="...">:
${linkLines}
- Avsluta med en kort sektion om vad man bör tänka på (kvalitet, sekretess/GDPR, mänsklig kontroll). Ingen FAQ.`;
  const msg = await claude.messages.create({ model: MODEL, max_tokens: 4000, messages: [{ role: 'user', content: prompt }] });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim()
    .replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

async function main() {
  // slug-uniqueness set
  const used = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data } = await db.from('articles').select('slug').range(from, from + 999);
    (data ?? []).forEach((r: { slug: string }) => used.add(r.slug));
    if (!data || data.length < 1000) break;
  }
  const uniqueSlug = (base: string) => {
    let s = base, i = 2;
    while (used.has(s)) s = `${base}-${i++}`;
    used.add(s);
    return s;
  };

  console.log(`Generating ${YRKEN.length} yrke guides via ${MODEL}…\n`);
  for (let i = 0; i < YRKEN.length; i++) {
    const y = YRKEN[i];
    const tag = `[${i + 1}/${YRKEN.length}]`;
    try {
      if (!FORCE) {
        const { data } = await db.from('articles').select('content_mdx').eq('path', y.path).maybeSingle();
        if (data?.content_mdx) { console.log(`  ${tag} SKIP ${y.path} (exists)`); continue; }
      }
      const html = await genGuide(y);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const links = (html.match(/<a\s+href="\//gi) || []).length;
      if (words < 550) throw new Error(`too short (${words} words)`);

      // Keep an existing row's slug if present; else allocate a unique one.
      const { data: existing } = await db.from('articles').select('slug').eq('path', y.path).maybeSingle();
      const slug = existing?.slug ?? uniqueSlug(y.baseSlug);

      const row = {
        slug, title: y.title, excerpt: y.excerpt, content_mdx: html,
        category: null, tags: y.tags, featured_image: null,
        type: 'post' as const, path: y.path, parent_slug: null, affiliate_url: null,
        published_at: new Date().toISOString(),
        seo_title: y.title, seo_description: y.excerpt,
      };
      const { data, error } = await db.from('articles').upsert(row, { onConflict: 'path' }).select('id,path');
      if (error) throw new Error(error.message);
      console.log(`  ${tag} OK ${y.path}  ${words}w  ${links} länkar  (id=${data?.[0]?.id}, slug=${slug})`);
    } catch (e) {
      console.error(`  ${tag} FAILED ${y.path}: ${e instanceof Error ? e.message : e}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
