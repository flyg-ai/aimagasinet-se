/**
 * Seed the /ai-verktyg/crm category hub to the same standard as the other
 * category hubs (scripts/seed-category-hubs.ts): a ~2000-word guide, 5 FAQ,
 * and 10 tool reviews with full profiles. Profiles + guide + FAQ generated via
 * Claude Sonnet 4.6; URLs/logos/slugs hand-specified.
 *
 *   npx tsx scripts/seed-crm-hub.ts
 *   FORCE=1 npx tsx scripts/seed-crm-hub.ts   # regenerate even if hub exists
 *
 * Writes:
 *  - lib/crm-tools.ts (CRM_REVIEW_KNOWN) — wired into REVIEW_KNOWN
 *    (ReviewTemplate) and KNOWN (HubTemplate) so review pages AND the hub
 *    topplista CTAs get fallbackUrl + curated data.
 *  - Supabase: 1 hub (slug=crm, parent_slug=ai-verktyg) + 10 reviews
 *    (parent_slug=crm). Upserts on path.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const MODEL = 'claude-sonnet-4-6';
const YEAR = 2026;
const LOGOS = [
  'bg-indigo-600', 'bg-emerald-500', 'bg-orange-500', 'bg-sky-500', 'bg-violet-600',
  'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-fuchsia-600', 'bg-cyan-600',
];

type ToolCfg = { name: string; url: string };

const CAT = {
  slug: 'crm',
  hubTitle: 'Bästa CRM med AI 2026 — kundhantering med AI',
  hubExcerpt:
    'Bästa CRM med AI 2026. Vi testar och rankar de 10 bästa AI-CRM-systemen för leads, lead scoring, försäljningsprognoser och automation — för svenska sälj- och marknadsteam.',
  seoTitle: 'Bästa CRM med AI 2026 — AI-kundhantering jämförd',
  seoDescription:
    'Bästa CRM med AI 2026. Salesforce Einstein, HubSpot, Pipedrive och fler — AI för leads, kundrelationer, försäljningsprognoser och automation, testade och rankade.',
  guideFocus:
    'AI för leads och lead scoring, kundrelationer, försäljningsprognoser, e-post- och samtalsautomation, hur svenska sälj- och marknadsteam väljer rätt CRM, GDPR och datahantering',
  criteriaHint: 'AI-funktioner, Lead scoring, Automation, Integrationer, Pris/prestanda, Användarvänlighet',
  tools: [
    { name: 'Salesforce Einstein', url: 'https://www.salesforce.com/products/einstein/' },
    { name: 'HubSpot AI', url: 'https://www.hubspot.com' },
    { name: 'Pipedrive AI', url: 'https://www.pipedrive.com' },
    { name: 'Zoho AI', url: 'https://www.zoho.com/crm/' },
    { name: 'Monday CRM AI', url: 'https://monday.com/crm' },
    { name: 'Freshsales AI', url: 'https://www.freshworks.com/crm/' },
    { name: 'Close AI', url: 'https://www.close.com' },
    { name: 'Attio', url: 'https://attio.com' },
    { name: 'Folk', url: 'https://www.folk.app' },
    { name: 'Breeze AI', url: 'https://www.hubspot.com/products/artificial-intelligence' },
  ] as ToolCfg[],
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/\.ai\b/g, '-ai')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function sonnet(user: string, maxTokens: number): Promise<string> {
  const msg = await claude.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: user }],
  });
  return msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim();
}

const stripFence = (s: string) => s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim();

type ToolGen = {
  company: string; model: string; founded: number; hq: string;
  useCases: string[]; scores: number[]; tags: string[];
  pros: string[]; cons: string[];
  offer: { title: string; price: string; bestFor: string };
  label: string; score: number; excerpt: string;
};
type Faq = { question: string; answer: string };

async function generateProfiles(slugByName: Record<string, string>): Promise<{ criteria: string[]; tools: Record<string, ToolGen> }> {
  const toolLines = CAT.tools.map((t) => `- key "${slugByName[t.name]}": ${t.name}`).join('\n');
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skapa strukturerad recensionsdata för kategorin "${CAT.hubTitle}".

Föreslå EXAKT 6 betygskriterier som passar kategorin (utgå från: ${CAT.criteriaHint}). Använd SAMMA 6 kriterier för alla verktyg.

För vart och ett av dessa 10 verktyg, skriv data på svenska:
${toolLines}

Returnera EXAKT detta JSON (inget annat, ingen \`\`\`):
{
  "criteria": ["k1","k2","k3","k4","k5","k6"],
  "tools": {
    "<key>": {
      "company": "Företag", "model": "Produkt/version", "founded": 2021, "hq": "Stad, Land",
      "useCases": ["fall1","fall2","fall3","fall4","fall5"],
      "scores": [8.8,9.0,8.5,8.7,8.9,9.1],
      "tags": ["tagg1","tagg2","tagg3","tagg4"],
      "pros": ["fördel1","fördel2","fördel3"], "cons": ["nackdel1","nackdel2"],
      "offer": { "title": "Erbjudande", "price": "Gratis · Pro X USD/mån", "bestFor": "kort fras" },
      "label": "kort etikett, t.ex. Redaktionens val", "score": 8.9,
      "excerpt": "En mening som sammanfattar verktyget."
    }
  }
}

Krav: "scores" har 6 tal (samma ordning som criteria), 7.5–9.8. "score" är helhetsbetyg 0–10. Naturlig svenska, inga floskler, inga emojis. Alla 10 nycklar MÅSTE finnas.`;
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = stripFence(await sonnet(prompt, 8000));
    try {
      const parsed = JSON.parse(raw) as { criteria: string[]; tools: Record<string, ToolGen> };
      if (!Array.isArray(parsed.criteria) || parsed.criteria.length < 6) throw new Error('criteria');
      const missing = CAT.tools.filter((t) => !parsed.tools[slugByName[t.name]]);
      if (missing.length) throw new Error(`missing ${missing.length} tools`);
      return parsed;
    } catch (e) {
      if (attempt === 1) throw new Error(`profiles JSON failed: ${e instanceof Error ? e.message : e}`);
    }
  }
  throw new Error('unreachable');
}

async function generateGuide(): Promise<string> {
  const prompt = `Du är senior redaktör på AI-Magasinet. Skriv en guide på cirka 2000 ord (svenska) för kategorisidan "${CAT.hubTitle}".

Fokus: ${CAT.guideFocus}.

Krav:
- Returnera ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`-block.
- Naturlig affärssvenska. Inga floskler ("revolutionerande", "i en värld där"). Inga emojis.
- Väv in nyckelord naturligt (CRM, AI-CRM, "AI-verktyg", "bästa", "${YEAR}").
- Inkludera naturliga interna länkar: <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>, <a href="/ai-verktyg/marknadsforing/">AI för marknadsföring</a> och <a href="/ai-verktyg/foretag/">AI för företag</a>.
- Struktur: intro, vad AI gör i ett CRM idag, vad man ska tänka på vid val, vanliga användningsfall (lead scoring, prognoser, automation), för vem passar vad (soloföretag/SMB/enterprise), GDPR och svensk datahantering, vanliga misstag, kort avslutning. Avsluta INTE med en FAQ.`;
  return stripFence(await sonnet(prompt, 6000));
}

async function generateFaq(): Promise<Faq[]> {
  const prompt = `Du är senior redaktör på AI-Magasinet. Skriv 5 vanliga frågor och korta svar (FAQ) för kategorisidan "${CAT.hubTitle}".
Svenska, "people also ask"-frågor en svensk läsare googlar. Svar 2-4 meningar, konkreta. Variera: kostnad, jämförelse, GDPR/datahantering, användningsfall, kom-igång. Inga floskler/emojis.
Returnera EXAKT JSON: {"faqs":[{"question":"...","answer":"..."}, ... 5 st]} . Ingen \`\`\`.`;
  const raw = stripFence(await sonnet(prompt, 2000));
  const parsed = JSON.parse(raw) as { faqs?: Faq[] };
  const items = (parsed.faqs ?? []).filter((f): f is Faq => typeof f?.question === 'string' && typeof f?.answer === 'string');
  if (items.length < 3) throw new Error(`only ${items.length} FAQ`);
  return items.slice(0, 5);
}

function reviewContentMdx(name: string, score: number, criteria: string[], g: ToolGen): string {
  const crit = criteria.map((c, i) => `<li>${c}: ${(g.scores[i] ?? score).toFixed(1)}/10</li>`).join('');
  return [
    `<p><strong>Betyg: ${score.toFixed(1)}/10</strong></p>`,
    `<p>${g.excerpt}</p>`,
    `<h2>Vår bedömning av ${name}</h2>`,
    `<p>${name} (${g.company}) passar bäst för ${g.offer.bestFor.toLowerCase()}. Bland styrkorna märks ${g.pros.join(', ').toLowerCase()}. Att ha i åtanke: ${g.cons.join(' och ').toLowerCase()}.</p>`,
    `<h3>Betyg per kriterium</h3>`,
    `<ul>${crit}</ul>`,
  ].join('\n');
}

async function main() {
  // Idempotency: skip if hub already exists unless FORCE.
  if (process.env.FORCE !== '1') {
    const { data } = await db.from('articles').select('path').eq('path', '/ai-verktyg/crm').maybeSingle();
    if (data) { console.log('CRM hub already exists — pass FORCE=1 to regenerate. Aborting.'); return; }
  }

  // Seed slug-uniqueness set.
  const used = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from('articles').select('slug').range(from, from + 999);
    if (error) { console.error('fetch slugs failed:', error.message); process.exit(1); }
    (data ?? []).forEach((r: { slug: string }) => used.add(r.slug));
    if (!data || data.length < 1000) break;
  }
  function uniqueSlug(base: string): string {
    let s = base;
    if (used.has(s)) s = `${base}-crm`;
    let i = 2;
    while (used.has(s)) s = `${base}-crm-${i++}`;
    used.add(s);
    return s;
  }

  const hubSlug = uniqueSlug(CAT.slug); // 'crm' unless taken
  const slugByName: Record<string, string> = {};
  for (const t of CAT.tools) slugByName[t.name] = uniqueSlug(slugify(t.name));

  console.log('Generating CRM profiles, guide and FAQ via', MODEL, '…');
  const [gen, guide, faq] = await Promise.all([generateProfiles(slugByName), generateGuide(), generateFaq()]);
  const guideWords = guide.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  profiles ok (criteria: ${gen.criteria.join(', ')})`);
  console.log(`  guide ok (${guideWords} ord), FAQ ${faq.length}`);

  const profiles: Record<string, Record<string, unknown>> = {};
  const reviewRows: Record<string, unknown>[] = [];
  let logoIdx = 0;

  for (const t of CAT.tools) {
    const key = slugByName[t.name];
    const g = gen.tools[key];
    profiles[key] = {
      logo: LOGOS[logoIdx++ % LOGOS.length],
      ctaName: t.name,
      fallbackUrl: t.url,
      company: g.company, model: g.model, founded: g.founded, hq: g.hq,
      useCases: g.useCases.slice(0, 5),
      ratingCriteria: gen.criteria.slice(0, 6).map((label, i) => ({ label, score: Number((g.scores[i] ?? g.score).toFixed(1)) })),
      tags: g.tags.slice(0, 4), pros: g.pros.slice(0, 3), cons: g.cons.slice(0, 2),
      offer: g.offer, label: g.label, score: Number(g.score.toFixed(1)),
    };
    reviewRows.push({
      slug: key,
      title: `${t.name} – Recension & Test ${YEAR}`,
      excerpt: g.excerpt,
      content_mdx: reviewContentMdx(t.name, Number(g.score.toFixed(1)), gen.criteria.slice(0, 6), g),
      category: null, tags: [], featured_image: null, type: 'page',
      path: `/ai-verktyg/${CAT.slug}/${key}`,
      parent_slug: hubSlug, affiliate_url: null,
      published_at: new Date().toISOString(), seo_title: null, seo_description: null,
    });
  }

  // Write lib/crm-tools.ts
  const file = resolve('lib/crm-tools.ts');
  writeFileSync(file,
    `/** CRM category-hub tool profiles — generated by scripts/seed-crm-hub.ts via ${MODEL}.\n` +
    ` *  Merged into REVIEW_KNOWN (ReviewTemplate) and KNOWN (HubTemplate). Re-run to refresh. */\n` +
    `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
    `export const CRM_REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(profiles, null, 2)};\n`,
    'utf8');
  console.log(`Wrote lib/crm-tools.ts (${Object.keys(profiles).length} profiles)`);

  const hubRow = {
    slug: hubSlug, title: CAT.hubTitle, excerpt: CAT.hubExcerpt, content_mdx: guide,
    category: null, tags: [], featured_image: null, type: 'page',
    path: `/ai-verktyg/${CAT.slug}`, parent_slug: 'ai-verktyg', affiliate_url: null,
    published_at: new Date().toISOString(), seo_title: CAT.seoTitle, seo_description: CAT.seoDescription,
    faq,
  };

  const { error } = await db.from('articles').upsert([hubRow, ...reviewRows], { onConflict: 'path' });
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  console.log(`Upserted CRM hub (slug=${hubSlug}) + ${reviewRows.length} reviews.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
