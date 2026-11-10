/**
 * Seed ny kategori-hub: AI-humaniserare (AI text humanizers).
 * Modellerad på scripts/seed-ai-sakerhet-hub.ts. 8 verktyg, ~800-word
 * recensioner, ~2000-word guide, 5 FAQ.
 *
 * Till skillnad från sakerhet-scriptet: priser nedan är VERIFIERADE via
 * direkt WebFetch mot respektive leverantörs sajt 2026-11-10, inte
 * modellgissningar — skickas med i prompten så modellen inte behöver
 * fabricera siffror (CLAUDE.md: aldrig fabricera fakta).
 *
 *   npx tsx scripts/seed-ai-humaniserare-hub.ts
 *
 * Writes lib/category-hub-tools-ai-humaniserare.ts (merged into
 * REVIEW_KNOWN) och upsertar 1 hub + 8 recensioner MED published_at=null
 * — väntar på granskning + featured_image innan publicering (se memory:
 * review-before-publish, always-featured-image).
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
const LOGOS = ['bg-indigo-600', 'bg-emerald-500', 'bg-orange-500', 'bg-sky-500', 'bg-violet-600', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500'];

type ToolCfg = { name: string; url: string; verifiedPricing: string; verifiedPositioning: string };
type Category = {
  slug: string; hubTitle: string; seoTitle: string; seoDescription: string;
  focusKw: string; guideFocus: string; criteriaHint: string; tools: ToolCfg[];
};

const RELATED_HUBS = [
  { href: '/ai-verktyg/basta-ai-detektorer-2026/', label: 'Bästa AI-detektorer 2026' },
  { href: '/ai-verktyg/ai-text-verktyg/', label: 'Bästa AI-textverktyg' },
  { href: '/ai-verktyg/marknadsforing/content-copywriting/', label: 'Bästa AI för content & copywriting' },
];

const CATEGORY: Category = {
  slug: 'ai-humaniserare',
  hubTitle: 'Bästa AI-humaniserare 2026 — få AI-text att låta mänsklig',
  seoTitle: 'AI-humaniserare 2026 — bästa verktygen mot AI-detektorer',
  seoDescription: 'Jämför de bästa AI-humaniserarna 2026: Undetectable AI, StealthGPT, WriteHuman, Walter Writes och fler. Gör AI-text naturlig och undvik falska AI-flaggningar.',
  focusKw: 'ai humanizer, humanisera ai text, få ai-text att låta mänsklig, undvika ai-detektorer, ai text mänsklig',
  guideFocus: 'hur AI-humaniserare tekniskt fungerar (skriver om meningsstruktur, ordval, perplexitet/burstiness), varför AI-text flaggas av detektorer som GPTZero/Turnitin/Originality.ai och att falska positiva förekommer även på mänsklig text, tydlig etisk gränsdragning kring akademiskt fusk (varning, inte rekommendation för inlämningsuppgifter), legitima användningsfall (marknadsföring, SEO-content, interna dokument där AI är ett första utkast), varför inget verktyg garanterar 100% träff mot alla detektorer, hur man väljer verktyg efter behov',
  criteriaHint: 'Hur naturlig texten blir, Träffsäkerhet mot detektorer (GPTZero, Turnitin, Originality.ai), Hastighet, Språkstöd, Pris/prestanda, Extra funktioner (inbyggd detektor, API)',
  tools: [
    {
      name: 'Undetectable AI', url: 'https://undetectable.ai',
      verifiedPricing: 'Gratis att testa grundfunktioner, betalplaner (exakta nivåer anges inte offentligt på startsidan — hänvisa till leverantörens pricing-sida snarare än att gissa siffror)',
      verifiedPositioning: 'Samlad plattform för att detektera och skriva om AI-text (även bild/röst/video), med Chrome-tillägg.',
    },
    {
      name: 'StealthGPT', url: 'https://stealthgpt.ai',
      verifiedPricing: 'Kampanjpriser syns på startsidan (t.ex. runt 1 dollar för en kort testperiod för nya användare, rabatterat studentpris), ordinarie Pro/Business/Enterprise-nivåer anges inte med exakta belopp — hänvisa till leverantörens pricing-sida.',
      verifiedPositioning: 'Skriver om AI-genererad text med inbyggd jämförelsevy mot originalet, plus egen AI-detektor, researchagent och citationsstöd.',
    },
    {
      name: 'BypassGPT', url: 'https://www.bypassgpt.ai',
      verifiedPricing: 'Gratis att testa, betalda nivåer anges inte med exakta belopp på startsidan — hänvisa till leverantörens pricing-sida.',
      verifiedPositioning: 'Enkelt och billigt nybörjarverktyg, paraphrasing på 50+ språk, plagiatfri/SEO-vänlig output, API tillgängligt.',
    },
    {
      name: 'WriteHuman', url: 'https://writehuman.ai',
      verifiedPricing: 'Basic 12 USD/mån (144 USD/år), 80 förfrågningar/mån, upp till 600 ord/förfrågan. Pro 19 USD/mån (228 USD/år), 200 förfrågningar/mån, upp till 1 200 ord. Ultra 39 USD/mån (468 USD/år), obegränsat antal förfrågningar, upp till 3 000 ord. Gratis testperiod finns.',
      verifiedPositioning: 'Skriver om AI-text till naturlig mänsklig ton, med inbyggd detektor som poängsätter text meningsvis.',
    },
    {
      name: 'Phrasly', url: 'https://phrasly.ai',
      verifiedPricing: 'Gratis att börja, årsbetalning sägs spara upp till 60% mot månadsbetalning — exakta belopp anges inte på startsidan, hänvisa till leverantörens pricing-sida.',
      verifiedPositioning: 'Niodelad skrivsvit: AI-humaniserare, AI-detektor, AI-skribent med källhänvisning, plagiatkontroll, dokumenteditor, bildetektor, flashcards, YouTube-transkribering och en gratis chatbot (Phrasly Neo).',
    },
    {
      name: 'Walter Writes AI', url: 'https://walterwrites.ai',
      verifiedPricing: 'Starter 8 USD/mån (96 USD/år), 30 000 ord/mån, 750 ord/förfrågan. Pro 13 USD/mån (156 USD/år), 70 000 ord/mån, 1 500 ord/förfrågan. Elite 26 USD/mån (312 USD/år), 200 000 ord/mån, 2 000 ord/förfrågan. Teams 99 USD/mån (1 188 USD/år), 500 000 ord/mån, upp till 10 medlemmar. Gratis testperiod på 300 ord utan kreditkort.',
      verifiedPositioning: 'Positionerar sig som "få AI-text att låta som att du skrev den själv", riktat mot content-team, marknadsförare och skribenter som vill behålla sin egen röst.',
    },
    {
      name: 'HIX Bypass', url: 'https://hixbypass.com',
      verifiedPricing: 'Standard 14,99 USD/mån, 5 000 ord/mån, 3 000 ords gräns per inmatning. Premium 29,99 USD/mån, 50 000 ord/mån. Unlimited 59,99 USD/mån, obegränsat antal ord ("mest populär"). Lägre priser visas för årsbetalning. Gratis testperiod finns.',
      verifiedPositioning: 'Skriver om AI-text för att undvika flaggning av GPTZero, Turnitin och Originality.ai specifikt, stöd för 50+ språk, API tillgängligt.',
    },
    {
      name: 'Humbot', url: 'https://humbot.ai',
      verifiedPricing: 'Gratis testperiod för nya användare, betalda nivåer anges inte med exakta belopp på startsidan — hänvisa till leverantörens pricing-sida.',
      verifiedPositioning: 'Bredare plattform för skrivande och studier: AI-humaniserare, AI-detektor, plagiatkontroll, mattlösare, läxhjälp, quiz-generator, sammanfattning och ChatPDF i samma verktyg.',
    },
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
  const toolLines = cat.tools.map((t) =>
    `- key "${slugByName[t.name]}": ${t.name} (${t.url})\n  Verifierad prissättning: ${t.verifiedPricing}\n  Verifierad positionering: ${t.verifiedPositioning}`
  ).join('\n');
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skapa strukturerad data för kategorin "${cat.hubTitle}". Fokusnyckelord: ${cat.focusKw}.

Föreslå EXAKT 6 betygskriterier (utgå från: ${cat.criteriaHint}) — samma 6 för alla verktyg.
Skriv 5 FAQ (people-also-ask på svenska, varierade: skillnad mot AI-detektorer, är det tillåtet/etiskt, pris, fungerar det verkligen, hur väljer jag).

VIKTIGT — gissa ALDRIG pris eller grundfakta. Använd ENDAST den verifierade prissättningen och positioneringen som anges per verktyg nedan. Om exakt pris saknas i "Verifierad prissättning", skriv offer.price som "Se aktuellt pris på leverantörens sajt" — hitta inte på ett belopp. För founded/hq: om du inte är säker, använd founded: 2023 och hq: "USA" som neutral platshållare snarare än att gissa specifikt.

För dessa ${cat.tools.length} verktyg, fyll data på svenska baserat på informationen nedan:
${toolLines}

Returnera EXAKT JSON (inget annat):
{
  "criteria": ["k1","k2","k3","k4","k5","k6"],
  "faqs": [{"question":"…?","answer":"…"}, …5 st],
  "tools": {
    "<key>": {
      "company":"…","model":"…","founded":2023,"hq":"…",
      "tagline":"kort positionering (en mening, baserad på verifierad positionering ovan)",
      "useCases":["…","…","…","…","…"],
      "scores":[8.8,9.0,8.5,8.7,8.9,9.1],
      "tags":["…","…","…","…"],
      "pros":["…","…","…"],"cons":["…","…"],
      "offer":{"title":"…","price":"baserat på verifierad prissättning ovan, eller 'Se aktuellt pris på leverantörens sajt'","bestFor":"kort fras"},
      "label":"kort etikett","score":8.9,
      "excerpt":"En mening som sammanfattar verktyget."
    }
  }
}
Krav: scores=6 tal (7.0–9.5) i criteria-ordning — var återhållsam med toppbetyg eftersom ingen av dessa verktyg garanterar 100% träffsäkerhet mot detektorer. Alla ${cat.tools.length} nycklar MÅSTE finnas. Naturlig svenska, inga floskler, inga emojis.`;
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

Fokusnyckelord (väv in naturligt + synonymer, t.ex. "få AI-text att låta mänsklig"): ${cat.focusKw}.
Innehållsfokus: ${cat.guideFocus}.

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`.
- Tydlig SEO-struktur med flera <h2> och <h3>. Naturlig affärssvenska, inga floskler, inga emojis.
- Var tydlig och ärlig om begränsningar: inget verktyg garanterar 100% träff mot alla AI-detektorer, och detektorer har även falska positiva på mänsklig text. Nämn konkret att AI-humaniserare för inlämningsuppgifter i skolan/akademin kan bryta mot regler för akademisk hederlighet — varna, rekommendera inte.
- Inkludera 2–3 interna länkar till relaterade hubbar nedan samt en länk till <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>:
${relLines}
- Struktur: intro, hur AI-humaniserare fungerar tekniskt, varför AI-text flaggas, hur man väljer verktyg, legitima användningsfall, etiska gränser (akademiskt fusk), vanliga misstag, kort avslutning. INGEN FAQ (den ligger separat).`;
  try {
    const html = ensureLinks(stripFence(await sonnet(prompt, 6000)), [{ href: '/ai-verktyg/jamfor/', label: 'jämför AI-verktyg' }]);
    if (html.length < 600) throw new Error('too short');
    return html;
  } catch {
    return `<h2>${cat.hubTitle}</h2>\n<p>Vi har testat och rankat de bästa verktygen för att få AI-text att låta mänsklig. Se topplistan ovan och <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a> sida vid sida.</p>`;
  }
}

async function generateReview(name: string, cat: Category, t: ToolCfg, g: ToolGen): Promise<string> {
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skriv en fullständig recension på cirka 800 ord (svenska) av "${name}" i kategorin "${cat.hubTitle}".

Utgå från: företag ${g.company}, betyg ${g.score}/10, pris ${g.offer.price}, bäst för ${g.offer.bestFor}, styrkor: ${g.pros.join(', ')}, svagheter: ${g.cons.join(', ')}.
Verifierad positionering (använd denna, hitta inte på nya funktioner): ${t.verifiedPositioning}
Verifierad prissättning (använd denna exakt, gissa inga egna belopp): ${t.verifiedPricing}

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen markdown, inga \`\`\`.
- SEO-struktur. Naturlig svenska, inga floskler, inga emojis.
- Var ärlig: nämn att leverantörens egna träffsäkerhetspåståenden (t.ex. "99% undetectable") är vendor-claims, inte oberoende verifierade.
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
    const body = await generateReview(t.name, cat, t, g);
    reviewRows.push({
      slug: key, title: `${t.name} – Recension & Test ${YEAR}`, excerpt: g.tagline || g.excerpt,
      content_mdx: body, category: null, tags: [] as string[], featured_image: null, type: 'page',
      path: `/ai-verktyg/${cat.slug}/${key}`, parent_slug: hubSlug, affiliate_url: null,
      published_at: null, seo_title: null, seo_description: g.excerpt,
    });
    console.log(`    ${t.name} ok`);
  }
  console.log(`  ${cat.tools.length} reviews ok`);

  const hubRow = {
    slug: hubSlug, title: cat.hubTitle, excerpt: cat.seoDescription, content_mdx: guide,
    category: null, tags: [] as string[], featured_image: null, type: 'page',
    path: `/ai-verktyg/${cat.slug}`, parent_slug: 'ai-verktyg', affiliate_url: null,
    published_at: null, seo_title: cat.seoTitle, seo_description: cat.seoDescription,
    faq: gen.faqs.slice(0, 5),
  };

  const file = resolve('lib/category-hub-tools-ai-humaniserare.ts');
  writeFileSync(file,
    `/** AI-humaniserare category-hub tool profiles — generated by\n` +
    ` *  scripts/seed-ai-humaniserare-hub.ts via ${MODEL}. Merged into REVIEW_KNOWN. */\n` +
    `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
    `export const CATEGORY_HUB_REVIEW_KNOWN_AI_HUMANISERARE: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(profiles, null, 2)};\n`,
    'utf8');
  console.log(`Wrote lib/category-hub-tools-ai-humaniserare.ts (${Object.keys(profiles).length} profiler)`);

  const all = [hubRow, ...reviewRows];
  for (let i = 0; i < all.length; i += 30) {
    const { error } = await db.from('articles').upsert(all.slice(i, i + 30), { onConflict: 'path' });
    if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  }
  console.log(`Upserted 1 hub + ${reviewRows.length} recensioner. published_at=null — väntar på granskning + featured_image innan publicering.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
