/**
 * Canonical yrkes-hubbar: slå ihop dubblett-recensionerna under
 * /ai-verktyg/foretag/yrke/* till EN kanonisk recension per verktyg under en
 * ny depth-2 hub /ai-verktyg/{juridik|kundservice|rekrytering|ekonomi|marknadsforing}.
 *
 * Modellerad på scripts/seed-category-hubs-2.ts. Skiljer sig genom att
 * verktygslistan + curated profiler hämtas från lib/yrke-tools.ts (YRKE_TOOLS)
 * istället för att uppfinnas — varje varumärke grupperas inom yrket och dess
 * 1–N parent-varianter mergas till en kanonisk recension.
 *
 *   npx tsx scripts/seed-yrkes-canonical-hubs.ts juridik
 *   npx tsx scripts/seed-yrkes-canonical-hubs.ts juridik kundservice rekrytering
 *   (utan argument → juridik, pilot)
 *
 * Skriver:
 *   - lib/yrkes-hub-tools.ts  (YRKES_HUB_KNOWN + YRKES_HUB_REVIEW_KNOWN,
 *     ska mergas in i HubTemplate KNOWN resp. ReviewTemplate REVIEW_KNOWN)
 *   - tmp/yrkes-redirects.json  (gamla dubblett-paths → kanonisk path, för
 *     redirect- och delete-stegen)
 *   - DB: upsert {hub} + {N kanoniska reviews}, onConflict path
 *
 * Idempotent på path. Raderar INGET — det sker i ett separat steg efter att
 * redirects ligger i next.config.mjs.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { YRKE_TOOLS, toHubProfile, toReviewProfile, toContentMdx, type YrkeTool, type YrkeParent } from '../lib/yrke-tools';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const MODEL = 'claude-sonnet-4-6';
const YEAR = 2026;

/** Old yrke subtree path per parent — must match seed-yrke-reviews.ts. */
const PARENT_PATH: Record<string, string> = {
  seo: 'marknadsforing/seo',
  'content-copywriting': 'marknadsforing/content-copywriting',
  annonser: 'marknadsforing/annonser',
  'sociala-medier': 'marknadsforing/sociala-medier',
  bokforing: 'ekonomi-redovisning/bokforing',
  redovisning: 'ekonomi-redovisning/redovisning',
  avtalsgranskning: 'juridik/avtalsgranskning',
  'due-diligence': 'juridik/due-diligence',
  rattsutredningar: 'juridik/rattsutredningar',
  chatbot: 'kundservice/chatbot',
  'epost-svar': 'kundservice/epost-svar',
  'rost-ai': 'kundservice/rost-ai',
  'cv-screening': 'rekrytering/cv-screening',
  jobbannonser: 'rekrytering/jobbannonser',
  kandidatmatchning: 'rekrytering/kandidatmatchning',
};

type Profession = {
  key: string;
  hubSlug: string;
  hubPath: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  yrkeLabel: string; // för guide-rubriken "Så effektiviserar du {X} med AI"
  parents: YrkeParent[];
  parentLabels: Record<string, string>; // parent → människo-läsbar användningsområde
  focusKw: string;
};

const PROFESSIONS: Record<string, Profession> = {
  juridik: {
    key: 'juridik',
    hubSlug: 'ai-verktyg-juridik',
    hubPath: '/ai-verktyg/juridik',
    title: 'Bästa AI-verktygen för juridik 2026 — avtal, due diligence & rättsutredningar',
    seoTitle: 'AI för juridik 2026 — bästa AI-verktygen för jurister',
    seoDescription: 'Bästa AI-verktygen för juridik 2026. Harvey AI, Spellbook, Luminance, Lexis+ och fler för avtalsgranskning, due diligence och rättsutredningar — testade och rankade.',
    yrkeLabel: 'juristarbetet',
    parents: ['avtalsgranskning', 'due-diligence', 'rattsutredningar'],
    parentLabels: {
      avtalsgranskning: 'Avtalsgranskning',
      'due-diligence': 'Due diligence',
      rattsutredningar: 'Rättsutredningar',
    },
    focusKw: 'AI för juridik, AI för jurister, AI avtalsgranskning, legal AI svenska',
  },
  kundservice: {
    key: 'kundservice',
    hubSlug: 'ai-verktyg-kundservice',
    hubPath: '/ai-verktyg/kundservice',
    title: 'Bästa AI-verktygen för kundservice 2026 — chatbottar, e-postsvar & röst-AI',
    seoTitle: 'AI för kundservice 2026 — bästa AI-verktygen för support',
    seoDescription: 'Bästa AI-verktygen för kundservice 2026. Intercom Fin, Zendesk AI, Freshdesk, Tidio och fler för chatbottar, e-postsvar och röst-AI — testade och rankade.',
    yrkeLabel: 'kundservicearbetet',
    parents: ['chatbot', 'epost-svar', 'rost-ai'],
    parentLabels: {
      chatbot: 'Chatbottar',
      'epost-svar': 'E-postsvar',
      'rost-ai': 'Röst-AI och voicebottar',
    },
    focusKw: 'AI för kundservice, AI chatbot kundtjänst, AI support svenska',
  },
  rekrytering: {
    key: 'rekrytering',
    hubSlug: 'ai-verktyg-rekrytering',
    hubPath: '/ai-verktyg/rekrytering',
    title: 'Bästa AI-verktygen för rekrytering & HR 2026 — CV-screening, jobbannonser & matchning',
    seoTitle: 'AI för rekrytering 2026 — bästa AI-verktygen för HR',
    seoDescription: 'Bästa AI-verktygen för rekrytering 2026. Workday, Greenhouse, Eightfold, Beamery och fler för CV-screening, jobbannonser och kandidatmatchning — testade och rankade.',
    yrkeLabel: 'rekryteringsarbetet',
    parents: ['cv-screening', 'jobbannonser', 'kandidatmatchning'],
    parentLabels: {
      'cv-screening': 'CV-screening',
      jobbannonser: 'Jobbannonser',
      kandidatmatchning: 'Kandidatmatchning',
    },
    focusKw: 'AI för rekrytering, AI för HR, AI CV-screening, recruiting AI svenska',
  },
  ekonomi: {
    key: 'ekonomi',
    hubSlug: 'ai-verktyg-ekonomi',
    hubPath: '/ai-verktyg/ekonomi',
    title: 'Bästa AI-verktygen för ekonomi & redovisning 2026 — bokföring, avstämning & bokslut',
    seoTitle: 'AI för ekonomi 2026 — bästa AI-verktygen för bokföring',
    seoDescription: 'Bästa AI-verktygen för ekonomi och redovisning 2026. Fortnox, Visma, Bokio, Dooer, Pleo och fler för bokföring, avstämning och bokslut — testade och rankade.',
    yrkeLabel: 'ekonomiarbetet',
    parents: ['bokforing', 'redovisning'],
    parentLabels: {
      bokforing: 'Bokföring',
      redovisning: 'Redovisning',
    },
    focusKw: 'AI för ekonomi, AI bokföring, AI redovisning svenska',
  },
  marknadsforing: {
    key: 'marknadsforing',
    hubSlug: 'ai-verktyg-marknadsforing',
    hubPath: '/ai-verktyg/marknadsforing',
    title: 'Bästa AI-verktygen för marknadsföring 2026 — content, SEO, annonser & sociala medier',
    seoTitle: 'AI för marknadsföring 2026 — bästa AI-verktygen',
    seoDescription: 'Bästa AI-verktygen för marknadsföring 2026. ChatGPT, Jasper, Surfer SEO, AdCreative och fler för content, SEO, annonser och sociala medier — testade och rankade.',
    yrkeLabel: 'marknadsföringsarbetet',
    parents: ['seo', 'content-copywriting', 'annonser', 'sociala-medier'],
    parentLabels: {
      seo: 'SEO',
      'content-copywriting': 'Content & copywriting',
      annonser: 'Annonser',
      'sociala-medier': 'Sociala medier',
    },
    focusKw: 'AI för marknadsföring, AI marknadsföring svenska, AI content SEO annonser',
  },
};

/* ─── helpers ──────────────────────────────────────────────────── */

function slugify(s: string): string {
  return s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/\.ai\b/g, '-ai').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function stripFence(s: string): string {
  return s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim();
}
function uniq<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }

async function sonnet(user: string, maxTokens: number, system?: string): Promise<string> {
  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    ...(system ? { system: [{ type: 'text' as const, text: system, cache_control: { type: 'ephemeral' as const } }] } : {}),
    messages: [{ role: 'user', content: user }],
  });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim();
}

const GUIDE_SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens. Du skriver guide-text för hubbsidor.

Röst: expert, rak och praktisk — inte "AI-ig". Skriv för svenska företagare och proffs som vill förstå AI på riktigt.
- Konkret framför generiskt — verkliga verktyg, prismodeller, use cases, siffror.
- Erkänn nyanser. Inga floskler ("revolutionerar", "game changer", "i en värld där"). Inga emojis.
- Naturlig affärssvenska, inte direktöversatt engelska.

Output ska vara REN HTML (renderas via dangerouslySetInnerHTML): <h2>, <h3>, <p>, <ul>/<li>, <a href="...">, <strong> (sparsamt). Ingen markdown, ingen \`\`\`-wrapping, ingen <h1> (finns redan i templaten). Börja med en <p>-tagg.`;

/* ─── canonical merge ──────────────────────────────────────────── */

type Variant = YrkeTool & { _path: string };
type Canon = {
  slug: string;
  brand: string;
  merged: YrkeTool;       // för profiler (toHubProfile/toReviewProfile)
  variants: Variant[];    // källrecensioner
  score: number;
};

/** Bygg en kanonisk YrkeTool genom att slå ihop 1–N parent-varianter. */
function mergeVariants(variants: Variant[]): YrkeTool {
  const base = [...variants].sort((a, b) => b.score - a.score)[0]; // högsta betyg
  return {
    ...base,
    score: Math.round((variants.reduce((s, v) => s + v.score, 0) / variants.length) * 10) / 10,
    features: uniq(variants.flatMap((v) => v.features)).slice(0, 6),
    pros: uniq(variants.flatMap((v) => v.pros)).slice(0, 4),
    cons: uniq(variants.flatMap((v) => v.cons)).slice(0, 3),
    useCases: uniq(variants.flatMap((v) => v.useCases)).slice(0, 8),
    tags: uniq(variants.flatMap((v) => v.tags)).slice(0, 4),
  };
}

function collectCanon(prof: Profession): Canon[] {
  const tools = YRKE_TOOLS.filter((t) => prof.parents.includes(t.parent))
    .map((t): Variant => ({ ...t, _path: `/ai-verktyg/foretag/yrke/${PARENT_PATH[t.parent]}/${t.slug}` }));
  const byBrand = new Map<string, Variant[]>();
  for (const t of tools) {
    const key = slugify(t.brand);
    (byBrand.get(key) ?? byBrand.set(key, []).get(key)!).push(t);
  }
  const canon: Canon[] = [];
  for (const [base, variants] of Array.from(byBrand.entries())) {
    const merged = mergeVariants(variants);
    canon.push({ slug: base, brand: merged.brand, merged, variants, score: merged.score });
  }
  return canon.sort((a, b) => b.score - a.score);
}

/* ─── content generation ───────────────────────────────────────── */

async function mergeReviewBody(prof: Profession, c: Canon): Promise<string> {
  const betyg = `<p><strong>Betyg: ${c.score.toFixed(1)}/10</strong></p>`;
  // Single variant → ingen merge behövs, använd canonical content direkt.
  if (c.variants.length === 1) {
    return `${betyg}\n${toContentMdx(c.merged)}`;
  }
  const areas = c.variants.map((v) => `### ${prof.parentLabels[v.parent]}\nUse cases: ${v.useCases.join(', ')}\nKälltext:\n${toContentMdx(v)}`).join('\n\n---\n\n');
  const prompt = `Slå ihop ${c.variants.length} separata recensioner av "${c.brand}" (samma verktyg, olika användningsområden inom ${prof.key}) till EN kanonisk recension på cirka 1000 ord (svenska).

Fakta att utgå från: företag ${c.merged.company}, grundat ${c.merged.founded}, ${c.merged.hq}, sammanvägt betyg ${c.score.toFixed(1)}/10, pris: ${c.merged.pricing}. Styrkor: ${c.merged.pros.join(', ')}. Svagheter: ${c.merged.cons.join(', ')}.

De separata användningsområdena och deras källtexter:

${areas}

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen markdown, inga \`\`\`, ingen <h1>.
- Struktur: <h2>Vår analys av ${c.brand}</h2> (intro), <h2>Funktioner som spelar roll</h2>, <h2>Användningsområden inom ${prof.key}</h2> med en <h3> per användningsområde (${c.variants.map((v) => prof.parentLabels[v.parent]).join(', ')}) som beskriver hur ${c.brand} används just där, <h2>Styrkor</h2> och <h2>Svagheter</h2> (<ul>), <h2>Prismodell</h2>, <h2>Vem passar ${c.brand} för?</h2>, <h2>Slutsats</h2>.
- Kombinera unikt innehåll från källtexterna, undvik upprepning. Naturlig svenska, inga floskler, inga emojis. Skriv INTE betygsraden (läggs till separat).`;
  try {
    const body = stripFence(await sonnet(prompt, 3000));
    if (body.replace(/<[^>]+>/g, '').length < 500) throw new Error('too short');
    return `${betyg}\n${body}`;
  } catch (e) {
    console.warn(`    merge fallback för ${c.slug}: ${e instanceof Error ? e.message : e}`);
    return `${betyg}\n${toContentMdx(c.merged)}`;
  }
}

async function generateGuide(prof: Profession, canon: Canon[]): Promise<string> {
  const topp = canon.slice(0, 5).map((c) => `${c.brand} (${c.score.toFixed(1)}/10)`).join(', ');
  const areor = Object.values(prof.parentLabels).join(', ');
  const prompt = `Skriv en guide på cirka 1500 ord (svenska) för hubbsidan "${prof.title}". Rubrikvinkel: "Så effektiviserar du ${prof.yrkeLabel} med AI".

Fokusnyckelord (väv in naturligt): ${prof.focusKw}.
Användningsområden att täcka: ${areor}.
Verktyg som finns i topplistan ovan (referera till några vid namn): ${topp}.

Krav:
- ENBART ren HTML enligt systeminstruktionen. Börja med <p>.
- Struktur: kort intro om varför AI inom ${prof.key} är värt att förstå nu → en <h2> per användningsområde (${areor}) med konkreta exempel och namngivna verktyg → en <h2> "Så väljer du rätt AI-verktyg för ${prof.key}" med urvalskriterier → kort avslutning.
- Inkludera 2–3 interna länkar i prosan: <a href="${prof.hubPath}/${canon[0]?.slug}/">${canon[0]?.brand}</a>, <a href="${prof.hubPath}/${canon[1]?.slug}/">${canon[1]?.brand}</a> och <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>.
- INGEN FAQ (ligger separat).`;
  try {
    const html = stripFence(await sonnet(prompt, 6000, GUIDE_SYSTEM));
    if (html.replace(/<[^>]+>/g, '').length < 800) throw new Error('too short');
    return html;
  } catch (e) {
    console.warn(`  guide fallback: ${e instanceof Error ? e.message : e}`);
    return `<p>Vi har testat och rankat de bästa AI-verktygen för ${prof.key}. Se topplistan ovan och <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a> sida vid sida.</p>`;
  }
}

type Faq = { question: string; answer: string };
async function generateFaqs(prof: Profession, canon: Canon[]): Promise<Faq[]> {
  const prompt = `Skriv 5 FAQ (people-also-ask, svenska) för hubbsidan om AI för ${prof.key}. Varierade frågor: skillnad mellan verktyg, pris, svenska/GDPR, hur man kommer igång, vilket verktyg som passar vem. Utgå från verktyg som ${canon.slice(0, 4).map((c) => c.brand).join(', ')}.
Returnera EXAKT JSON: [{"question":"…?","answer":"… (2–4 meningar)"}, … 5 st]. Inget annat, ingen \`\`\`.`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = stripFence(await sonnet(prompt, 2000));
      const arr = JSON.parse(raw) as Faq[];
      if (Array.isArray(arr) && arr.length >= 5 && arr.every((f) => f.question && f.answer)) return arr.slice(0, 5);
      throw new Error('shape');
    } catch (e) {
      if (attempt === 1) { console.warn(`  faq fallback: ${e instanceof Error ? e.message : e}`); return []; }
    }
  }
  return [];
}

/* ─── main ─────────────────────────────────────────────────────── */

async function loadUsedSlugs(): Promise<Set<string>> {
  const used = new Set<string>();
  let from = 0;
  while (true) {
    const { data, error } = await db.from('articles').select('slug').range(from, from + 999);
    if (error) { console.error('fetch slugs failed:', error.message); process.exit(1); }
    (data ?? []).forEach((r: { slug: string }) => used.add(r.slug));
    if (!data || data.length < 1000) break;
    from += 1000;
  }
  return used;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => PROFESSIONS[a]);
  const keys = args.length ? args : ['juridik'];
  const DRY = process.env.DRY === '1';
  console.log(`Yrkes-hub seed för: ${keys.join(', ')}${DRY ? '  [DRY — ingen API/DB]' : ''}\n`);

  const used = await loadUsedSlugs();
  function uniqueSlug(base: string): string {
    let s = base, i = 2;
    while (used.has(s)) s = `${base}-${i++}`;
    used.add(s); return s;
  }

  // Ackumulerade profiler + redirect-map över alla körda yrken (slås ihop med ev. befintliga vid behov).
  const hubKnown: Record<string, ReturnType<typeof toHubProfile>> = {};
  const reviewKnown: Record<string, ReturnType<typeof toReviewProfile>> = {};
  const redirects: { from: string; to: string }[] = [];
  const deletePaths: string[] = [];

  for (const key of keys) {
    const prof = PROFESSIONS[key];
    console.log(`=== ${prof.key}  (${prof.hubPath}) ===`);
    const canon = collectCanon(prof);
    // tilldela kanoniska slugs (frigörs när dubbletter raderas; uniqueSlug skyddar mot krock)
    for (const c of canon) c.slug = uniqueSlug(c.slug);
    console.log(`  ${canon.length} kanoniska verktyg: ${canon.map((c) => `${c.slug}×${c.variants.length}`).join(', ')}`);

    if (DRY) {
      for (const c of canon) {
        hubKnown[c.slug] = toHubProfile(c.merged);
        reviewKnown[c.slug] = toReviewProfile(c.merged);
        for (const v of c.variants) {
          const canonicalPath = `${prof.hubPath}/${c.slug}`;
          redirects.push({ from: v._path, to: canonicalPath });
          deletePaths.push(v._path);
        }
      }
      console.log(`  [DRY] ${prof.hubPath} → ${canon.length} reviews, ${canon.reduce((s, c) => s + c.variants.length, 0)} redirects\n`);
      continue;
    }

    const guide = await generateGuide(prof, canon);
    console.log(`  guide ok (${guide.length} tecken)`);
    const faqs = await generateFaqs(prof, canon);
    console.log(`  faq ok (${faqs.length})`);

    const hubRow = {
      slug: prof.hubSlug, title: prof.title, excerpt: prof.seoDescription, content_mdx: guide,
      category: null, tags: [] as string[], featured_image: null, type: 'page',
      path: prof.hubPath, parent_slug: 'ai-verktyg', affiliate_url: null,
      published_at: new Date().toISOString(), seo_title: prof.seoTitle, seo_description: prof.seoDescription,
      faq: faqs.length ? faqs : null,
    };

    const reviewRows: Record<string, unknown>[] = [];
    for (const c of canon) {
      hubKnown[c.slug] = toHubProfile(c.merged);
      reviewKnown[c.slug] = toReviewProfile(c.merged);
      const body = await mergeReviewBody(prof, c);
      const canonicalPath = `${prof.hubPath}/${c.slug}`;
      reviewRows.push({
        slug: c.slug, title: `${c.brand} – Recension & Test ${YEAR}`, excerpt: c.merged.oneliner,
        content_mdx: body, category: null, tags: [] as string[], featured_image: null, type: 'page',
        path: canonicalPath, parent_slug: prof.hubSlug, affiliate_url: null,
        published_at: new Date().toISOString(), seo_title: null, seo_description: c.merged.oneliner,
      });
      for (const v of c.variants) {
        redirects.push({ from: v._path, to: canonicalPath });
        deletePaths.push(v._path);
      }
      console.log(`    ${c.slug}  (merge ${c.variants.length}→1, ${(body.length / 1000).toFixed(1)}k)`);
    }

    const all = [hubRow, ...reviewRows];
    for (let i = 0; i < all.length; i += 30) {
      const { error } = await db.from('articles').upsert(all.slice(i, i + 30), { onConflict: 'path' });
      if (error) { console.error('upsert failed:', error.message); process.exit(1); }
    }
    console.log(`  upserted hub + ${reviewRows.length} reviews\n`);
  }

  // Skriv profil-lib.
  const libPath = resolve('lib/yrkes-hub-tools.ts');
  writeFileSync(libPath,
    `/** Kanoniska yrkes-hub-profiler — genererade av\n` +
    ` *  scripts/seed-yrkes-canonical-hubs.ts. YRKES_HUB_KNOWN mergas in i\n` +
    ` *  HubTemplate KNOWN, YRKES_HUB_REVIEW_KNOWN i ReviewTemplate REVIEW_KNOWN. */\n` +
    `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
    `export const YRKES_HUB_KNOWN = ${JSON.stringify(hubKnown, null, 2)};\n\n` +
    `export const YRKES_HUB_REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(reviewKnown, null, 2)};\n`,
    'utf8');
  console.log(`Wrote lib/yrkes-hub-tools.ts (${Object.keys(reviewKnown).length} profiler)`);

  // Skriv redirect/delete-map.
  mkdirSync(resolve('tmp'), { recursive: true });
  writeFileSync(resolve('tmp/yrkes-redirects.json'), JSON.stringify({ redirects, deletePaths }, null, 2), 'utf8');
  console.log(`Wrote tmp/yrkes-redirects.json (${redirects.length} redirects, ${deletePaths.length} delete-paths)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
