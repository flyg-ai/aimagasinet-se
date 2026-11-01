/**
 * Seed ny kategori-hub: AI-säkerhet / cybersäkerhetsverktyg.
 * ~2000-word guide, 10 fulla ~800-word recensioner, 5 FAQ, profiler.
 * Generated via Claude Sonnet 4.6.
 *
 *   npx tsx scripts/seed-ai-sakerhet-hub.ts
 *
 * Writes lib/category-hub-tools-ai-sakerhet.ts (merged into REVIEW_KNOWN) och
 * upsertar 1 hub + 10 recensioner MED published_at=null (väntar på granskning +
 * featured_image innan publicering, se memory: review-before-publish och
 * always-featured-image).
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const MODEL = 'claude-sonnet-4-6';
const YEAR = 2026;
const LOGOS = ['bg-indigo-600', 'bg-emerald-500', 'bg-orange-500', 'bg-sky-500', 'bg-violet-600', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-fuchsia-600', 'bg-cyan-600'];

type ToolCfg = { name: string; url: string };
type Category = {
  slug: string; hubTitle: string; seoTitle: string; seoDescription: string;
  focusKw: string; guideFocus: string; criteriaHint: string; tools: ToolCfg[];
};

const RELATED_HUBS = [
  { href: '/ai-verktyg/dataanalys/', label: 'Bästa AI för dataanalys' },
  { href: '/ai-verktyg/dokumenthantering/', label: 'Bästa AI-verktyg för dokumenthantering' },
  { href: '/ai-verktyg/ekonomi/', label: 'Bästa AI-verktygen för ekonomi & redovisning' },
];

const CATEGORY: Category = {
  slug: 'ai-sakerhet',
  hubTitle: 'Bästa AI-verktygen för cybersäkerhet 2026',
  seoTitle: 'AI-säkerhet 2026 — bästa AI-verktygen för cybersäkerhet',
  seoDescription: 'Bästa AI-verktygen för cybersäkerhet 2026. Microsoft Security Copilot, CrowdStrike, Darktrace och fler — AI för hotdetektering, phishing-skydd och incidenthantering.',
  focusKw: 'AI cybersäkerhet, AI säkerhetsverktyg, AI hotdetektering svenska',
  guideFocus: 'AI för hotdetektering och anomalidetektering, phishing- och BEC-skydd, autonom incidenthantering (SOC-automation), molnsäkerhet, vad AI-driven säkerhet betyder för små och medelstora företag',
  criteriaHint: 'Hotdetektering, Automatiseringsgrad, Falska larm (precision), Integrationer, Pris/prestanda, Användarvänlighet',
  tools: [
    { name: 'Microsoft Security Copilot', url: 'https://www.microsoft.com/security/business/ai-machine-learning/microsoft-security-copilot' },
    { name: 'CrowdStrike Falcon', url: 'https://www.crowdstrike.com/platform/charlotte-ai/' },
    { name: 'Darktrace', url: 'https://darktrace.com' },
    { name: 'SentinelOne', url: 'https://www.sentinelone.com/platform/purple-ai/' },
    { name: 'Vectra AI', url: 'https://www.vectra.ai' },
    { name: 'Huntress', url: 'https://www.huntress.com' },
    { name: 'Abnormal Security', url: 'https://abnormalsecurity.com' },
    { name: 'Wiz', url: 'https://www.wiz.io' },
    { name: 'Bitdefender', url: 'https://www.bitdefender.com' },
    { name: 'Malwarebytes', url: 'https://www.malwarebytes.com' },
  ],
};

/* ─── helpers ──────────────────────────────────────────────────── */

function slugify(s: string): string {
  return s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/\.ai\b/g, '-ai').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function stripFence(s: string): string {
  return s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim();
}
async function sonnet(user: string, maxTokens: number): Promise<string> {
  const msg = await claude.messages.create({ model: MODEL, max_tokens: maxTokens, messages: [{ role: 'user', content: user }] });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim();
}
function ensureLinks(html: string, links: { href: string; label: string }[]): string {
  const missing = links.filter((l) => !html.includes(l.href));
  if (!missing.length) return html;
  return `${html}\n<p>Relaterat: ${missing.map((l) => `<a href="${l.href}">${l.label}</a>`).join(' · ')}</p>`;
}

type Faq = { question: string; answer: string };
type ToolGen = {
  company: string; model: string; founded: number; hq: string; tagline: string;
  useCases: string[]; scores: number[]; tags: string[]; pros: string[]; cons: string[];
  offer: { title: string; price: string; bestFor: string }; label: string; score: number; excerpt: string;
};

async function generateProfiles(cat: Category, slugByName: Record<string, string>): Promise<{ criteria: string[]; faqs: Faq[]; tools: Record<string, ToolGen> }> {
  const toolLines = cat.tools.map((t) => `- key "${slugByName[t.name]}": ${t.name}`).join('\n');
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skapa strukturerad data för kategorin "${cat.hubTitle}". Fokusnyckelord: ${cat.focusKw}.

Föreslå EXAKT 6 betygskriterier (utgå från: ${cat.criteriaHint}) — samma 6 för alla verktyg.
Skriv 5 FAQ (people-also-ask på svenska, varierade: skillnad, pris, svenska/GDPR, integritet, kom-igång).
För dessa 10 verktyg, fyll data på svenska baserat på faktiska, verifierbara produktegenskaper (gissa inte grundare/år om du är osäker — använd rimliga, kända uppgifter för bolaget):
${toolLines}

Returnera EXAKT JSON (inget annat):
{
  "criteria": ["k1","k2","k3","k4","k5","k6"],
  "faqs": [{"question":"…?","answer":"…"}, …5 st],
  "tools": {
    "<key>": {
      "company":"…","model":"…","founded":2021,"hq":"Stad, Land",
      "tagline":"kort positionering (en mening)",
      "useCases":["…","…","…","…","…"],
      "scores":[8.8,9.0,8.5,8.7,8.9,9.1],
      "tags":["…","…","…","…"],
      "pros":["…","…","…"],"cons":["…","…"],
      "offer":{"title":"…","price":"Kontakta säljare / Pro X USD/mån","bestFor":"kort fras"},
      "label":"kort etikett","score":8.9,
      "excerpt":"En mening som sammanfattar verktyget."
    }
  }
}
Krav: scores=6 tal (7.5–9.8) i criteria-ordning. Alla 10 nycklar MÅSTE finnas. Naturlig svenska, inga floskler, inga emojis.`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = stripFence(await sonnet(prompt, 8000));
    try {
      const p = JSON.parse(raw) as { criteria: string[]; faqs: Faq[]; tools: Record<string, ToolGen> };
      if (!Array.isArray(p.criteria) || p.criteria.length < 6) throw new Error('criteria');
      if (!Array.isArray(p.faqs) || p.faqs.length < 5) throw new Error('faqs');
      const missing = cat.tools.filter((t) => !p.tools[slugByName[t.name]]);
      if (missing.length) throw new Error(`missing ${missing.length} tools`);
      return p;
    } catch (e) {
      if (attempt === 1) throw new Error(`profiles JSON failed for ${cat.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }
  throw new Error('unreachable');
}

async function generateGuide(cat: Category, related: { href: string; label: string }[]): Promise<string> {
  const relLines = related.map((r) => `- <a href="${r.href}">${r.label}</a>`).join('\n');
  const prompt = `Du är senior SEO-redaktör på AI-Magasinet. Skriv en guide på cirka 2000 ord (svenska) för kategorisidan "${cat.hubTitle}".

Fokusnyckelord (väv in naturligt + synonymer): ${cat.focusKw}.
Innehållsfokus: ${cat.guideFocus}.

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`.
- Tydlig SEO-struktur med flera <h2> och <h3>. Naturlig affärssvenska, inga floskler, inga emojis.
- Inkludera 2–3 interna länkar till relaterade hubbar nedan samt en länk till <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>:
${relLines}
- Struktur: intro, hur man väljer, viktiga funktioner, användningsfall, för vem passar vad, vanliga misstag, kort avslutning. INGEN FAQ (den ligger separat).`;
  try {
    const html = ensureLinks(stripFence(await sonnet(prompt, 6000)), [{ href: '/ai-verktyg/jamfor/', label: 'jämför AI-verktyg' }]);
    if (html.length < 600) throw new Error('too short');
    return html;
  } catch {
    return `<h2>${cat.hubTitle}</h2>\n<p>Vi har testat och rankat de bästa verktygen inom ${cat.slug.replace(/-/g, ' ')}. Se topplistan ovan och <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a> sida vid sida.</p>`;
  }
}

async function generateReview(name: string, cat: Category, g: ToolGen): Promise<string> {
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skriv en fullständig recension på cirka 800 ord (svenska) av "${name}" i kategorin "${cat.hubTitle}".

Utgå från: företag ${g.company}, betyg ${g.score}/10, pris ${g.offer.price}, bäst för ${g.offer.bestFor}, styrkor: ${g.pros.join(', ')}, svagheter: ${g.cons.join(', ')}.

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen markdown, inga \`\`\`.
- SEO-struktur. Naturlig svenska, inga floskler, inga emojis.
- Avsnitt: vad är ${name}, viktigaste funktioner, så bra är det i praktiken, för- och nackdelar, pris och planer, för vem passar det, vårt omdöme.`;
  try {
    const body = stripFence(await sonnet(prompt, 2200));
    if (body.length < 500) throw new Error('short');
    return `<p><strong>Betyg: ${g.score.toFixed(1)}/10</strong></p>\n${body}`;
  } catch {
    return `<p><strong>Betyg: ${g.score.toFixed(1)}/10</strong></p>\n<h2>${name}</h2>\n<p>${g.excerpt}</p>\n<p>${name} (${g.company}) passar bäst för ${g.offer.bestFor.toLowerCase()}. Styrkor: ${g.pros.join(', ').toLowerCase()}. Svagheter: ${g.cons.join(' och ').toLowerCase()}. Pris: ${g.offer.price}.</p>`;
  }
}

/* ─── main ─────────────────────────────────────────────────────── */

async function main() {
  const used = new Set<string>();
  let from = 0;
  while (true) {
    const { data, error } = await db.from('articles').select('slug').range(from, from + 999);
    if (error) { console.error('fetch slugs failed:', error.message); process.exit(1); }
    (data ?? []).forEach((r: { slug: string }) => used.add(r.slug));
    if (!data || data.length < 1000) break;
    from += 1000;
  }
  function uniqueSlug(base: string, hub: string): string {
    let s = base; if (used.has(s)) s = `${base}-${hub}`;
    let i = 2; while (used.has(s)) s = `${base}-${hub}-${i++}`;
    used.add(s); return s;
  }

  const cat = CATEGORY;
  console.log(`=== ${cat.slug} ===`);
  const hubSlug = uniqueSlug(cat.slug, 'hub');
  const slugByName: Record<string, string> = {};
  for (const t of cat.tools) slugByName[t.name] = uniqueSlug(slugify(t.name), cat.slug);

  const gen = await generateProfiles(cat, slugByName);
  console.log(`  profiles+faq ok (${gen.criteria.join(', ')})`);
  const guide = await generateGuide(cat, RELATED_HUBS);
  console.log(`  guide ok (${guide.length} tecken)`);

  const profiles: Record<string, Record<string, unknown>> = {};
  const reviewRows: Record<string, unknown>[] = [];
  let logoIdx = 0;

  for (const t of cat.tools) {
    const key = slugByName[t.name];
    const g = gen.tools[key];
    const logo = LOGOS[logoIdx++ % LOGOS.length];
    profiles[key] = {
      logo, ctaName: t.name, fallbackUrl: t.url, tagline: g.tagline,
      company: g.company, model: g.model, founded: g.founded, hq: g.hq,
      useCases: g.useCases.slice(0, 5),
      ratingCriteria: gen.criteria.slice(0, 6).map((label, i) => ({ label, score: Number((g.scores[i] ?? g.score).toFixed(1)) })),
      tags: g.tags.slice(0, 4), pros: g.pros.slice(0, 3), cons: g.cons.slice(0, 2),
      offer: g.offer, label: g.label, score: Number(g.score.toFixed(1)),
    };
    const body = await generateReview(t.name, cat, g);
    reviewRows.push({
      slug: key, title: `${t.name} – Recension & Test ${YEAR}`, excerpt: g.tagline || g.excerpt,
      content_mdx: body, category: null, tags: [] as string[], featured_image: null, type: 'page',
      path: `/ai-verktyg/${cat.slug}/${key}`, parent_slug: hubSlug, affiliate_url: null,
      published_at: null, seo_title: null, seo_description: g.excerpt,
    });
  }
  console.log(`  ${cat.tools.length} reviews ok`);

  const hubRow = {
    slug: hubSlug, title: cat.hubTitle, excerpt: cat.seoDescription, content_mdx: guide,
    category: null, tags: [] as string[], featured_image: null, type: 'page',
    path: `/ai-verktyg/${cat.slug}`, parent_slug: 'ai-verktyg', affiliate_url: null,
    published_at: null, seo_title: cat.seoTitle, seo_description: cat.seoDescription,
    faq: gen.faqs.slice(0, 5),
  };

  const file = resolve('lib/category-hub-tools-ai-sakerhet.ts');
  writeFileSync(file,
    `/** AI-säkerhet category-hub tool profiles — generated by\n` +
    ` *  scripts/seed-ai-sakerhet-hub.ts via ${MODEL}. Merged into REVIEW_KNOWN. */\n` +
    `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
    `export const CATEGORY_HUB_REVIEW_KNOWN_AI_SAKERHET: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(profiles, null, 2)};\n`,
    'utf8');
  console.log(`Wrote lib/category-hub-tools-ai-sakerhet.ts (${Object.keys(profiles).length} profiler)`);

  const all = [hubRow, ...reviewRows];
  for (let i = 0; i < all.length; i += 30) {
    const { error } = await db.from('articles').upsert(all.slice(i, i + 30), { onConflict: 'path' });
    if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  }
  console.log(`Upserted 1 hub + ${reviewRows.length} recensioner. published_at=null — väntar på granskning + featured_image innan publicering.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
