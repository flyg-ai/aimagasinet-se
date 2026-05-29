/**
 * Seed 8 new AI-verktyg category hubs, each with a ~1500-word guide and 10
 * tool reviews. Profiles + guides generated via Claude Sonnet 4.6; everything
 * else (URLs, logos, slugs) is hand-specified here.
 *
 *   npx tsx scripts/seed-category-hubs.ts
 *   FORCE=1 npx tsx scripts/seed-category-hubs.ts   # regenerate guides/profiles
 *
 * Writes:
 *  - lib/category-hub-tools.ts  (CATEGORY_HUB_REVIEW_KNOWN, merged into
 *    REVIEW_KNOWN by ReviewTemplate)
 *  - Supabase: 8 hub articles (parent_slug=ai-verktyg) + 80 reviews
 *    (parent_slug=<hub slug>). Upserts on path; slug uniqueness enforced
 *    by namespacing collisions.
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
type Category = {
  slug: string;          // desired path segment under /ai-verktyg/
  hubTitle: string;
  hubExcerpt: string;
  guideFocus: string;
  criteriaHint: string;  // suggested 6 rating dimensions
  tools: ToolCfg[];
};

const CATEGORIES: Category[] = [
  {
    slug: 'hemsidebyggare',
    hubTitle: 'Bästa AI-hemsidebyggare 2026',
    hubExcerpt: 'Bygg en hemsida med AI – utan kodkunskaper. Vi testar och rankar de 10 bästa AI-hemsidebyggarna för företag, e-handel och landningssidor.',
    guideFocus: 'bygga hemsida med AI utan kodkunskaper, e-handel och webbshop, landningssidor, SEO och domän',
    criteriaHint: 'Designfrihet, AI-generering, E-handel, SEO-verktyg, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Framer AI', url: 'https://www.framer.com' },
      { name: 'Wix AI', url: 'https://www.wix.com' },
      { name: 'Webflow AI', url: 'https://webflow.com' },
      { name: 'Squarespace AI', url: 'https://www.squarespace.com' },
      { name: 'Durable', url: 'https://durable.co' },
      { name: '10Web', url: 'https://10web.io' },
      { name: 'Hostinger AI', url: 'https://www.hostinger.com' },
      { name: 'Jimdo AI', url: 'https://www.jimdo.com' },
      { name: 'GoDaddy AI', url: 'https://www.godaddy.com' },
      { name: 'Gamma', url: 'https://gamma.app' },
    ],
  },
  {
    slug: 'presentationer',
    hubTitle: 'Bästa AI-presentationsverktyg 2026',
    hubExcerpt: 'Skapa professionella presentationer på minuter med AI. Vi rankar de 10 bästa verktygen för slides, pitch-decks och föredrag.',
    guideFocus: 'skapa professionella presentationer snabbt med AI, pitch-decks, designmallar, export till PowerPoint',
    criteriaHint: 'Designkvalitet, AI-generering, Mallbibliotek, Export & delning, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Gamma', url: 'https://gamma.app' },
      { name: 'Beautiful.ai', url: 'https://www.beautiful.ai' },
      { name: 'Canva AI', url: 'https://www.canva.com' },
      { name: 'Tome', url: 'https://tome.app' },
      { name: 'Pitch', url: 'https://pitch.com' },
      { name: 'Slidesgo AI', url: 'https://slidesgo.com' },
      { name: 'Plus AI', url: 'https://www.plusai.com' },
      { name: 'Decktopus', url: 'https://www.decktopus.com' },
      { name: 'MagicSlides', url: 'https://www.magicslides.app' },
      { name: 'SlidesAI', url: 'https://www.slidesai.io' },
    ],
  },
  {
    slug: 'motesverktyg',
    hubTitle: 'Bästa AI-mötesverktyg 2026',
    hubExcerpt: 'AI-mötesassistenter som transkriberar, antecknar och fångar action points åt dig. Vi rankar de 10 bästa för svenska team.',
    guideFocus: 'AI-mötesassistenter, transkribering, automatiska anteckningar, action points, integration med kalender och Zoom/Teams',
    criteriaHint: 'Transkriberingskvalitet, Svenska språkstöd, Sammanfattningar, Integrationer, Integritet & GDPR, Pris/prestanda',
    tools: [
      { name: 'Otter.ai', url: 'https://otter.ai' },
      { name: 'Fireflies.ai', url: 'https://fireflies.ai' },
      { name: 'Notion AI', url: 'https://www.notion.so' },
      { name: 'Fathom', url: 'https://fathom.video' },
      { name: 'Krisp', url: 'https://krisp.ai' },
      { name: 'MeetGeek', url: 'https://meetgeek.ai' },
      { name: 'tl;dv', url: 'https://tldv.io' },
      { name: 'Avoma', url: 'https://www.avoma.com' },
      { name: 'Sembly', url: 'https://www.sembly.ai' },
      { name: 'Zoom AI', url: 'https://www.zoom.com' },
    ],
  },
  {
    slug: 'sociala-medier',
    hubTitle: 'Bästa AI-verktyg för sociala medier 2026',
    hubExcerpt: 'Skapa, schemalägg och analysera innehåll för sociala medier med AI. Vi rankar de 10 bästa verktygen för 2026.',
    guideFocus: 'skapa och schemalägga innehåll för sociala medier med AI, captions, hashtags, content-kalender, analys',
    criteriaHint: 'Innehållsgenerering, Schemaläggning, Plattformsstöd, Analys & insikter, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Hootsuite AI', url: 'https://www.hootsuite.com' },
      { name: 'Buffer AI', url: 'https://buffer.com' },
      { name: 'Predis.ai', url: 'https://predis.ai' },
      { name: 'Flick', url: 'https://www.flick.social' },
      { name: 'Taplio', url: 'https://taplio.com' },
      { name: 'Ocoya', url: 'https://www.ocoya.com' },
      { name: 'Postwise', url: 'https://postwise.ai' },
      { name: 'Lately', url: 'https://www.lately.ai' },
      { name: 'FeedHive', url: 'https://www.feedhive.com' },
      { name: 'Publer', url: 'https://publer.com' },
    ],
  },
  {
    slug: 'projektledning',
    hubTitle: 'Bästa AI-verktyg för projektledning 2026',
    hubExcerpt: 'AI för projektplanering, prioritering och team-koordination. Vi rankar de 10 bästa projektverktygen med AI-funktioner.',
    guideFocus: 'AI för projektplanering, prioritering, automatiska statusuppdateringar och team-koordination',
    criteriaHint: 'AI-funktioner, Vyer & flexibilitet, Automation, Integrationer, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Asana AI', url: 'https://asana.com' },
      { name: 'Monday AI', url: 'https://monday.com' },
      { name: 'Notion AI', url: 'https://www.notion.so' },
      { name: 'ClickUp AI', url: 'https://clickup.com' },
      { name: 'Linear AI', url: 'https://linear.app' },
      { name: 'Jira AI', url: 'https://www.atlassian.com/software/jira' },
      { name: 'Trello AI', url: 'https://trello.com' },
      { name: 'Basecamp AI', url: 'https://basecamp.com' },
      { name: 'Height', url: 'https://height.app' },
      { name: 'Motion', url: 'https://www.usemotion.com' },
    ],
  },
  {
    slug: 'e-handel',
    hubTitle: 'Bästa AI-verktyg för e-handel 2026',
    hubExcerpt: 'AI för produktbeskrivningar, kundservice, personalisering och konvertering. Vi rankar de 10 bästa e-handelsverktygen med AI.',
    guideFocus: 'AI för produktbeskrivningar, kundservice och chatbots, personalisering och konverteringsoptimering',
    criteriaHint: 'AI-funktioner, Konvertering, Personalisering, Integrationer, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Shopify AI', url: 'https://www.shopify.com' },
      { name: 'WooCommerce AI', url: 'https://woocommerce.com' },
      { name: 'Klaviyo AI', url: 'https://www.klaviyo.com' },
      { name: 'Octane AI', url: 'https://www.octaneai.com' },
      { name: 'Tidio', url: 'https://www.tidio.com' },
      { name: 'Yotpo AI', url: 'https://www.yotpo.com' },
      { name: 'Rebuy', url: 'https://www.rebuyengine.com' },
      { name: 'Nosto', url: 'https://www.nosto.com' },
      { name: 'Obviously AI', url: 'https://www.obviously.ai' },
      { name: 'CartHook', url: 'https://carthook.com' },
    ],
  },
  {
    slug: 'oversattning',
    hubTitle: 'Bästa AI-översättningsverktyg 2026',
    hubExcerpt: 'AI-översättning för företag, webbplatser, dokument och marknadsföring. Vi rankar de 10 bästa översättningsverktygen 2026.',
    guideFocus: 'AI-översättning för företag, webbplatser, dokument och marknadsföring, kvalitet på svenska',
    criteriaHint: 'Översättningskvalitet, Svenska språkstöd, Antal språk, Integrationer, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'DeepL', url: 'https://www.deepl.com' },
      { name: 'Google Translate AI', url: 'https://translate.google.com' },
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'Claude', url: 'https://claude.ai' },
      { name: 'DeepL Write', url: 'https://www.deepl.com/write' },
      { name: 'Phrase', url: 'https://phrase.com' },
      { name: 'Lokalise AI', url: 'https://lokalise.com' },
      { name: 'Smartcat', url: 'https://www.smartcat.com' },
      { name: 'Unbabel', url: 'https://unbabel.com' },
      { name: 'ModernMT', url: 'https://www.modernmt.com' },
    ],
  },
  {
    slug: 'dokumenthantering',
    hubTitle: 'Bästa AI-verktyg för dokumenthantering 2026',
    hubExcerpt: 'AI för att läsa, sammanfatta och hantera dokument och PDF:er. Vi rankar de 10 bästa dokumentverktygen med AI.',
    guideFocus: 'AI för att läsa, sammanfatta och hantera dokument och PDF:er, dataextraktion, frågor mot dokument',
    criteriaHint: 'AI-analys, PDF & dokumentstöd, Dataextraktion, Integrationer, Integritet & GDPR, Pris/prestanda',
    tools: [
      { name: 'Adobe Acrobat AI', url: 'https://www.adobe.com/acrobat.html' },
      { name: 'Notion AI', url: 'https://www.notion.so' },
      { name: 'ChatPDF', url: 'https://www.chatpdf.com' },
      { name: 'PDF.ai', url: 'https://pdf.ai' },
      { name: 'Humata', url: 'https://www.humata.ai' },
      { name: 'Docsumo', url: 'https://www.docsumo.com' },
      { name: 'Kognitos', url: 'https://www.kognitos.com' },
      { name: 'Nanonets', url: 'https://nanonets.com' },
      { name: 'Rossum', url: 'https://rossum.ai' },
      { name: 'DocuSign AI', url: 'https://www.docusign.com' },
    ],
  },
];

/* ─── helpers ──────────────────────────────────────────────────── */

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

function stripFence(s: string): string {
  return s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

type ToolGen = {
  company: string; model: string; founded: number; hq: string;
  useCases: string[]; scores: number[]; tags: string[];
  pros: string[]; cons: string[];
  offer: { title: string; price: string; bestFor: string };
  label: string; score: number; excerpt: string;
};

async function generateProfiles(cat: Category, slugByName: Record<string, string>): Promise<{ criteria: string[]; tools: Record<string, ToolGen> }> {
  const toolLines = cat.tools.map((t) => `- key "${slugByName[t.name]}": ${t.name}`).join('\n');
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skapa strukturerad recensionsdata för kategorin "${cat.hubTitle}".

Föreslå EXAKT 6 betygskriterier som passar kategorin (utgå från: ${cat.criteriaHint}). Använd SAMMA 6 kriterier för alla verktyg.

För vart och ett av dessa 10 verktyg, skriv data på svenska:
${toolLines}

Returnera EXAKT detta JSON (inget annat, ingen \`\`\`):
{
  "criteria": ["k1","k2","k3","k4","k5","k6"],
  "tools": {
    "<key>": {
      "company": "Företag",
      "model": "Produkt/version",
      "founded": 2021,
      "hq": "Stad, Land",
      "useCases": ["fall1","fall2","fall3","fall4","fall5"],
      "scores": [8.8,9.0,8.5,8.7,8.9,9.1],
      "tags": ["tagg1","tagg2","tagg3","tagg4"],
      "pros": ["fördel1","fördel2","fördel3"],
      "cons": ["nackdel1","nackdel2"],
      "offer": { "title": "Erbjudande", "price": "Gratis · Pro X USD/mån", "bestFor": "kort fras" },
      "label": "kort etikett, t.ex. Redaktionens val",
      "score": 8.9,
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
      const missing = cat.tools.filter((t) => !parsed.tools[slugByName[t.name]]);
      if (missing.length) throw new Error(`missing ${missing.length} tools`);
      return parsed;
    } catch (e) {
      if (attempt === 1) throw new Error(`profiles JSON failed for ${cat.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }
  throw new Error('unreachable');
}

async function generateGuide(cat: Category): Promise<string> {
  const prompt = `Du är senior redaktör på AI-Magasinet. Skriv en guide på cirka 1500 ord (svenska) för kategorisidan "${cat.hubTitle}".

Fokus: ${cat.guideFocus}.

Krav:
- Returnera ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`-block.
- Naturlig affärssvenska. Inga floskler ("revolutionerande", "i en värld där"). Inga emojis.
- Väv in nyckelord naturligt (kategorinamnet, "AI-verktyg", "bästa", "${YEAR}").
- Inkludera en naturlig intern länk till jämförelsesidan: <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>.
- Struktur: intro, vad man ska tänka på vid val, vanliga användningsfall, för vem passar vad, vanliga misstag, kort avslutning. Avsluta INTE med en FAQ.`;
  return stripFence(await sonnet(prompt, 4500));
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

/* ─── main ─────────────────────────────────────────────────────── */

async function main() {
  // Existing slugs → seed the uniqueness set so we never violate slug UNIQUE.
  const used = new Set<string>();
  {
    let from = 0;
    while (true) {
      const { data, error } = await db.from('articles').select('slug').range(from, from + 999);
      if (error) { console.error('fetch slugs failed:', error.message); process.exit(1); }
      (data ?? []).forEach((r: { slug: string }) => used.add(r.slug));
      if (!data || data.length < 1000) break;
      from += 1000;
    }
  }
  function uniqueSlug(base: string, hub: string): string {
    let s = base;
    if (used.has(s)) s = `${base}-${hub}`;
    let i = 2;
    while (used.has(s)) { s = `${base}-${hub}-${i++}`; }
    used.add(s);
    return s;
  }

  const profiles: Record<string, Record<string, unknown>> = {};
  const hubRows: Record<string, unknown>[] = [];
  const reviewRows: Record<string, unknown>[] = [];
  let logoIdx = 0;

  for (const cat of CATEGORIES) {
    console.log(`\n=== ${cat.slug} ===`);
    const hubSlug = uniqueSlug(cat.slug, 'hub'); // usually === cat.slug
    const slugByName: Record<string, string> = {};
    for (const t of cat.tools) slugByName[t.name] = uniqueSlug(slugify(t.name), cat.slug);

    const gen = await generateProfiles(cat, slugByName);
    console.log(`  profiles ok (criteria: ${gen.criteria.join(', ')})`);
    const guide = await generateGuide(cat);
    console.log(`  guide ok (${guide.length} tecken)`);

    // Hub article
    hubRows.push({
      slug: hubSlug,
      title: cat.hubTitle,
      excerpt: cat.hubExcerpt,
      content_mdx: guide,
      category: null,
      tags: [] as string[],
      featured_image: null,
      type: 'page',
      path: `/ai-verktyg/${cat.slug}`,
      parent_slug: 'ai-verktyg',
      affiliate_url: null,
      published_at: new Date().toISOString(),
      seo_title: `${cat.hubTitle} — Topplista & guide`,
      seo_description: cat.hubExcerpt,
    });

    // Tools → profiles + review articles
    for (const t of cat.tools) {
      const key = slugByName[t.name];
      const g = gen.tools[key];
      const logo = LOGOS[logoIdx++ % LOGOS.length];
      profiles[key] = {
        logo,
        ctaName: t.name,
        fallbackUrl: t.url,
        company: g.company,
        model: g.model,
        founded: g.founded,
        hq: g.hq,
        useCases: g.useCases.slice(0, 5),
        ratingCriteria: gen.criteria.slice(0, 6).map((label, i) => ({ label, score: Number((g.scores[i] ?? g.score).toFixed(1)) })),
        tags: g.tags.slice(0, 4),
        pros: g.pros.slice(0, 3),
        cons: g.cons.slice(0, 2),
        offer: g.offer,
        label: g.label,
        score: Number(g.score.toFixed(1)),
      };
      reviewRows.push({
        slug: key,
        title: `${t.name} – Recension & Test ${YEAR}`,
        excerpt: g.excerpt,
        content_mdx: reviewContentMdx(t.name, Number(g.score.toFixed(1)), gen.criteria.slice(0, 6), g),
        category: null,
        tags: [] as string[],
        featured_image: null,
        type: 'page',
        path: `/ai-verktyg/${cat.slug}/${key}`,
        parent_slug: hubSlug,
        affiliate_url: null,
        published_at: new Date().toISOString(),
        seo_title: null,
        seo_description: null,
      });
    }
  }

  // Write the REVIEW_KNOWN data module.
  const file = resolve('lib/category-hub-tools.ts');
  const contents =
    `/** AI-verktyg category-hub tool profiles — generated by\n` +
    ` *  scripts/seed-category-hubs.ts via ${MODEL}. Merged into REVIEW_KNOWN\n` +
    ` *  in components/templates/ReviewTemplate.tsx. Re-run the script to refresh. */\n` +
    `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
    `export const CATEGORY_HUB_REVIEW_KNOWN: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(profiles, null, 2)};\n`;
  writeFileSync(file, contents, 'utf8');
  console.log(`\nWrote lib/category-hub-tools.ts (${Object.keys(profiles).length} profiles)`);

  // Seed DB.
  const allRows = [...hubRows, ...reviewRows];
  const { error } = await db.from('articles').upsert(allRows, { onConflict: 'path' });
  if (error) { console.error('\nupsert failed:', error.message); process.exit(1); }
  console.log(`Upserted ${hubRows.length} hubs + ${reviewRows.length} reviews.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
