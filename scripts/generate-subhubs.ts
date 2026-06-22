/**
 * Generate the 6 curated subcategory hub pages under /ai-verktyg/marknadsforing
 * and /ai-verktyg/ekonomi. Each page is a type='page' row rendered by
 * HubTemplate (topplistan = curated tool subset, wired in app/[...slug]/page.tsx
 * via SUBHUB_TOOL_SLUGS). This script fills the editorial body + FAQ:
 *
 *   - content_mdx: ~1000-word HTML guide via claude-sonnet-4-6, with inline
 *     links to the parent hub, the sibling subcategories, and the real tool
 *     reviews that make up the topplistan.
 *   - faq: 5 Q&A pairs via claude-haiku-4-5 (same shape as generate-faqs.ts).
 *
 * Idempotent — upserts on path. Re-run with FORCE=1 to regenerate bodies.
 *
 *   npx tsx scripts/generate-subhubs.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const GUIDE_MODEL = 'claude-sonnet-4-6';
const FAQ_MODEL = 'claude-haiku-4-5';
const FORCE = process.env.FORCE === '1';

type SubHub = {
  path: string;
  slug: string;
  title: string;       // H1 (also seo_title)
  parentLabel: string; // for prose + crumbs context
  parentPath: string;
  theme: string;       // what this subcategory is about, for the guide brief
  toolSlugs: string[];
  tags: string[];
  excerpt: string;
};

const PARENT_MKTF = { label: 'AI-verktyg för marknadsföring', path: '/ai-verktyg/marknadsforing' };
const PARENT_EKO = { label: 'AI-verktyg för ekonomi & redovisning', path: '/ai-verktyg/ekonomi' };

const SUBHUBS: SubHub[] = [
  {
    path: '/ai-verktyg/marknadsforing/seo',
    slug: 'ai-verktyg-marknadsforing-seo',
    title: 'Bästa AI-verktyg för SEO 2026',
    parentLabel: PARENT_MKTF.label, parentPath: PARENT_MKTF.path,
    theme: 'AI-verktyg för sökmotoroptimering (SEO): keyword-research, SERP-analys, content-optimering efter sökintention, teknisk SEO och on-page-betyg. Förklara hur AI förändrat SEO-arbetet 2026 (sökintention, NLP-baserad optimering, AI Overviews i Google och hur det påverkar trafik), och vilka kriterier man väljer verktyg efter.',
    toolSlugs: ['semrush-ai', 'surfer-seo', 'ahrefs-ai', 'clearscope', 'frase-io', 'neuronwriter', 'marketmuse', 'rankmath-ai', 'screaming-frog-ai'],
    tags: ['SEO', 'AI-SEO', 'content-optimering', 'keyword-research'],
    excerpt: 'De bästa AI-verktygen för SEO 2026 — keyword-research, SERP-analys, content-optimering och teknisk SEO, testade och rankade för svenska användare.',
  },
  {
    path: '/ai-verktyg/marknadsforing/content-copywriting',
    slug: 'ai-verktyg-marknadsforing-content-copywriting',
    title: 'Bästa AI för content & copywriting 2026',
    parentLabel: PARENT_MKTF.label, parentPath: PARENT_MKTF.path,
    theme: 'AI-verktyg för content och copywriting: long-form-artiklar, produktbeskrivningar, annonstexter, brand voice och bulk-content. Förklara skillnaden mellan rena copy-generatorer och content-workflow-plattformar, vad som krävs för bra svenska, och hur man undviker generisk AI-text.',
    toolSlugs: ['claude-content', 'jasper-content', 'copy-ai-content', 'writesonic-content', 'koala-writer', 'rytr-content', 'hypotenuse-ai', 'anyword', 'contentatscale'],
    tags: ['content', 'copywriting', 'AI-text', 'brand voice'],
    excerpt: 'De bästa AI-verktygen för content och copywriting 2026 — från long-form till annonstext och brand voice, jämförda för svensk text.',
  },
  {
    path: '/ai-verktyg/marknadsforing/annonser',
    slug: 'ai-verktyg-marknadsforing-annonser',
    title: 'Bästa AI-verktyg för annonsering 2026',
    parentLabel: PARENT_MKTF.label, parentPath: PARENT_MKTF.path,
    theme: 'AI-verktyg för annonsering och paid media: kreativ-generering för Meta/Google/TikTok, performance-prediction, automatiserad budgivning och kreativ-analys. Förklara hur AI används både för att producera annonskreativ och för att optimera spend, och vad som skiljer enterprise-plattformar från självbetjäningsverktyg.',
    toolSlugs: ['adcreative-ai', 'pencil-ai', 'persado', 'smartly-io', 'albert-ai', 'motionapp', 'madgicx', 'revealbot'],
    tags: ['annonsering', 'paid media', 'Meta Ads', 'performance marketing'],
    excerpt: 'De bästa AI-verktygen för annonsering 2026 — kreativ-generering, performance-prediction och automatiserad budgivning för paid media.',
  },
  {
    path: '/ai-verktyg/marknadsforing/sociala-medier',
    slug: 'ai-verktyg-marknadsforing-sociala-medier',
    title: 'Bästa AI för sociala medier 2026',
    parentLabel: PARENT_MKTF.label, parentPath: PARENT_MKTF.path,
    theme: 'AI-verktyg för sociala medier: content-generering, schemaläggning, hashtag- och audience-research, samt plattformsspecifika verktyg (LinkedIn, Instagram, X/Twitter, TikTok). Förklara hur AI snabbar upp social-flödet utan att texten känns robotaktig, och hur man väljer verktyg efter vilka kanaler man jobbar i.',
    toolSlugs: ['hootsuite-ai', 'buffer-ai', 'predis-ai', 'flick-ai', 'lately-ai', 'ocoya', 'postwise', 'taplio', 'fedica'],
    tags: ['sociala medier', 'social media', 'schemaläggning', 'content'],
    excerpt: 'De bästa AI-verktygen för sociala medier 2026 — content, schemaläggning och plattformsspecifik AI för LinkedIn, Instagram, X och TikTok.',
  },
  {
    path: '/ai-verktyg/ekonomi/bokforing',
    slug: 'ai-verktyg-ekonomi-bokforing',
    title: 'Bästa AI-verktyg för bokföring 2026',
    parentLabel: PARENT_EKO.label, parentPath: PARENT_EKO.path,
    theme: 'AI-verktyg för bokföring för svenska företag: automatisk kontering, kvitto- och fakturatolkning, avstämning och löpande bokföring. Fokusera på svenska aktörer (Fortnox, Visma, Bokio, Dooer, SpeedLedger) och vad AI faktiskt automatiserar idag jämfört med marknadsföringslöften. Ta upp vad enskild firma vs aktiebolag bör välja.',
    toolSlugs: ['fortnox-ai', 'visma-ai', 'bokio-ai', 'dooer', 'speedledger-ai', 'billogram-ai', 'wint-ai', 'pleo-ai'],
    tags: ['bokföring', 'AI-bokföring', 'Fortnox', 'automatisk kontering'],
    excerpt: 'De bästa AI-verktygen för bokföring 2026 för svenska företag — automatisk kontering, kvittotolkning och avstämning, med fokus på svenska aktörer.',
  },
  {
    path: '/ai-verktyg/ekonomi/redovisning',
    slug: 'ai-verktyg-ekonomi-redovisning',
    title: 'Bästa AI-verktyg för redovisning 2026',
    parentLabel: PARENT_EKO.label, parentPath: PARENT_EKO.path,
    theme: 'AI-verktyg för redovisning och revision: månadsbokslut, avstämningsautomation, practice management för redovisningsbyråer och Big4-revisionsplattformar. Skilj på verktyg för redovisningskonsulter/byråer och internationella revisionsplattformar (PwC, Deloitte, KPMG, EY). Förklara vad AI gör för bokslutsprocessen.',
    toolSlugs: ['fortnox-redovisning', 'pw-ai', 'deloitte-ai', 'kpmg-ai', 'ey-ai', 'xero-ai', 'quickbooks-ai', 'taxdome-ai'],
    tags: ['redovisning', 'revision', 'månadsbokslut', 'redovisningsbyrå'],
    excerpt: 'De bästa AI-verktygen för redovisning 2026 — månadsbokslut, avstämningsautomation och practice management för byråer och revision.',
  },
];

const GUIDE_SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Du skriver den redaktionella guidetexten till en kategori-sida (en "hub") som listar och rankar AI-verktyg inom ett område.

# Kontext
Sidan har redan en automatiskt genererad topplista med verktygskort ovanför din text — du ska INTE återskapa en rankad lista eller upprepa betyg. Din text är den redaktionella guiden som ger sammanhang: hur kategorin ser ut 2026, vad man ska titta efter, vilka avvägningar som finns, och hur de namngivna verktygen skiljer sig.

# Tonalitet
- Expert, rak och praktisk affärssvenska. Skriv som en kollega som testat verktygen.
- Konkret framför generiskt — namn, siffror, exempel.
- Erkänn nyanser: vad passar vem.
- Inga floskler ("revolutionerande", "i en värld där...", "game changer"), inga emojis.

# Struktur (~1000 ord)
- Börja direkt med ett kort intro-stycke (<p>) som etablerar varför kategorin är relevant 2026.
- 3-5 H2-sektioner. Använd H3 och punktlistor där det hjälper läsaren skanna.
- Väv in de namngivna verktygen naturligt i prosan och länka till deras recensioner med <a href="...">. Länka också till parent-hubben och de syskonsidor du får. 4-8 interna länkar totalt, naturligt placerade.
- Avsluta med en kort H2-sektion: hur man väljer rätt verktyg / handlingsplan.

# Format
Ren HTML (inte Markdown): <h2>, <h3>, <p>, <ul>/<li>, <a href>, <strong> (sparsamt), <table> om data är tabellär. Skriv INTE H1 (den finns i templaten). Ingen \`\`\`-wrapping. Börja med <p>, sluta med </p> eller </ul>. Inget annat före eller efter.`;

const FAQ_SYSTEM = `Du är senior redaktör på AI-Magasinet. Skriv 5 vanliga frågor och korta, konkreta svar (FAQ) för en kategori-sida om AI-verktyg.

# Krav
- Svenska, naturlig affärssvenska. Frågorna ska vara "people also ask"-frågor en svensk läsare faktiskt googlar.
- Svar 2-4 meningar, konkreta (ge intervall/exempel, inte "det beror på"). Inga floskler, inga emojis, ingen affiliate-CTA.
- Variera: kostnad, jämförelse, säkerhet/integritet (för ekonomi: bokföringslagen/GDPR), användningsfall, kom-igång.

# Output
Returnera EXAKT JSON, inget annat:
{"faqs":[{"question":"...","answer":"..."},{"question":"...","answer":"..."},{"question":"...","answer":"..."},{"question":"...","answer":"..."},{"question":"...","answer":"..."}]}
Ingen \`\`\`json\`\`\`-wrapping, ingen prosa.`;

type Tool = { name: string; path: string };
type Faq = { question: string; answer: string };

async function fetchTools(slugs: string[]): Promise<Tool[]> {
  const { data, error } = await db.from('articles').select('slug,title,path').in('slug', slugs);
  if (error) throw new Error(`fetch tools: ${error.message}`);
  const bySlug = new Map((data ?? []).map((r) => [r.slug as string, r]));
  // Preserve the editorial order from toolSlugs; drop any missing.
  return slugs
    .map((s) => bySlug.get(s))
    .filter(Boolean)
    .map((r) => ({ name: (r!.title as string).split(/\s+[–—-]\s+/)[0].trim(), path: r!.path as string }));
}

async function genGuide(s: SubHub, tools: Tool[], siblings: { label: string; path: string }[]): Promise<string> {
  const userPrompt = [
    `Kategori-sida: ${s.title}`,
    `URL: ${s.path}`,
    `Ämne: ${s.theme}`,
    '',
    `Parent-hub att länka till: ${s.parentLabel} → ${s.parentPath}`,
    'Syskonsidor (andra subkategorier) att gärna länka till någon av:',
    ...siblings.map((x) => `- ${x.label} → ${x.path}`),
    '',
    'Verktyg som finns i topplistan ovanför texten — länka till deras recensioner när du nämner dem:',
    ...tools.map((t) => `- ${t.name} → ${t.path}`),
    '',
    `Skriv guiden nu. ~1000 ord, ren HTML, börja med <p>. Nämn och länka minst 5 av verktygen ovan plus parent-hubben.`,
  ].join('\n');

  const res = await claude.messages.create({
    model: GUIDE_MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: GUIDE_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim();
}

async function genFaq(s: SubHub): Promise<Faq[]> {
  const userPrompt = [
    `Sida: ${s.path}`,
    `Titel: ${s.title}`,
    `Ämne: ${s.theme}`,
    '',
    'Skriv 5 FAQ-frågor och svar nu. Returnera bara JSON-objektet.',
  ].join('\n');

  const msg = await claude.messages.create({
    model: FAQ_MODEL,
    max_tokens: 2000,
    system: [{ type: 'text', text: FAQ_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim()
    .replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(text) as { faqs?: Faq[] };
  const items = (parsed.faqs ?? []).filter(
    (f): f is Faq => typeof f?.question === 'string' && typeof f?.answer === 'string'
  );
  if (items.length < 3) throw new Error(`only ${items.length} FAQ items`);
  return items.slice(0, 5);
}

async function main() {
  console.log(`Generating ${SUBHUBS.length} subcategory hubs…\n`);
  for (let i = 0; i < SUBHUBS.length; i++) {
    const s = SUBHUBS[i];
    const tag = `[${i + 1}/${SUBHUBS.length}]`;
    try {
      // Skip body regen if a populated row already exists (unless FORCE).
      if (!FORCE) {
        const { data: existing } = await db
          .from('articles').select('content_mdx,faq').eq('path', s.path).maybeSingle();
        if (existing?.content_mdx && existing?.faq) {
          console.log(`  ${tag} SKIP ${s.path} (already populated; FORCE=1 to regen)`);
          continue;
        }
      }

      const tools = await fetchTools(s.toolSlugs);
      const siblings = SUBHUBS
        .filter((x) => x.parentPath === s.parentPath && x.path !== s.path)
        .map((x) => ({ label: x.title, path: x.path }));

      const [html, faq] = await Promise.all([genGuide(s, tools, siblings), genFaq(s)]);
      const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      const links = (html.match(/<a\s+href="\/ai-verktyg/gi) || []).length;
      if (words < 700) throw new Error(`guide too short (${words} words)`);

      const row = {
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        content_mdx: html,
        category: null as string | null,
        tags: s.tags,
        featured_image: null as string | null,
        type: 'page' as const,
        path: s.path,
        parent_slug: null as string | null,
        affiliate_url: null as string | null,
        published_at: new Date().toISOString(),
        seo_title: s.title,
        seo_description: s.excerpt,
        faq,
      };
      const { data, error } = await db
        .from('articles').upsert(row, { onConflict: 'path' }).select('id,path');
      if (error) throw new Error(error.message);
      console.log(`  ${tag} OK ${s.path}  ${words}w  ${links} verktygslänkar  ${faq.length}q  (id=${data?.[0]?.id}, ${tools.length} tools)`);
    } catch (e) {
      console.error(`  ${tag} FAILED ${s.path}: ${e instanceof Error ? e.message : e}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
