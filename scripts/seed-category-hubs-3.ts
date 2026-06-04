/**
 * Seed 7 nya kategori-hubbar (ai-assistenter, rost-och-tal, podcast-
 * ljudredigering, produktivitet, e-postmarknadsforing, dataanalys, utbildning)
 * och regenerera CRM-hubbens guide — samma standard som övriga hubbar.
 *
 * Flat-arkitektur: recensioner skapas som /ai-verktyg/<slug> (depth-2,
 * parent_slug=<hub>). Verktyg som redan finns som flat review (ChatGPT, Claude
 * …) skapas INTE om — de refereras bara i hubbens kurerade lista
 * (CURATED_HUB_TOOL_SLUGS i app/[...slug]/page.tsx, läggs till för hand).
 *
 * Per hub: guide ~2000 ord (Sonnet) + 5 FAQ + profiler (Sonnet), och en
 * recension ~600 ord (Haiku) per NYTT verktyg.
 *
 *   npx tsx scripts/seed-category-hubs-3.ts
 *   FORCE=1 ...   # regenerera hub-guide även om hubben finns
 *
 * Skriver lib/category-hub-tools-3.ts (CATEGORY_HUB_REVIEW_KNOWN_3) — mergas in
 * i REVIEW_KNOWN (ReviewTemplate) + KNOWN (HubTemplate).
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

const SONNET = 'claude-sonnet-4-6';
const HAIKU = 'claude-haiku-4-5';
const YEAR = 2026;
const FORCE = process.env.FORCE === '1';
const LOGOS = ['bg-indigo-600','bg-emerald-500','bg-orange-500','bg-sky-500','bg-violet-600','bg-rose-500','bg-amber-500','bg-teal-500','bg-fuchsia-600','bg-cyan-600'];

type Tool = { name: string; url: string };
type Hub = { slug: string; seoTitle: string; seoDescription: string; guideFocus: string; criteriaHint: string; tools: Tool[] };

const HUBS: Hub[] = [
  {
    slug: 'ai-assistenter',
    seoTitle: 'Bästa AI-assistenter 2026 — ChatGPT, Claude, Gemini & fler',
    seoDescription: 'Bästa AI-assistenten 2026? Vi testar ChatGPT, Claude, Gemini, Perplexity, Copilot och fler — svenskt språkstöd, integritet, GDPR och pris jämfört.',
    guideFocus: 'skillnader mellan AI-assistenter, svenskt språkstöd, integritet och datahantering (GDPR), gratisnivåer och pris, samt vilken assistent som passar vilket behov',
    criteriaHint: 'Svarskvalitet, Svenska språkstöd, Integritet & GDPR, Integrationer, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'ChatGPT', url: 'https://chat.openai.com' }, { name: 'Claude', url: 'https://claude.ai' },
      { name: 'Gemini', url: 'https://gemini.google.com' }, { name: 'Perplexity', url: 'https://www.perplexity.ai' },
      { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com' }, { name: 'Meta AI', url: 'https://www.meta.ai' },
      { name: 'Mistral Le Chat', url: 'https://chat.mistral.ai' }, { name: 'DeepSeek', url: 'https://www.deepseek.com' },
      { name: 'Grok', url: 'https://grok.com' }, { name: 'Pi AI', url: 'https://pi.ai' },
    ],
  },
  {
    slug: 'rost-och-tal',
    seoTitle: 'Bästa AI röst & tal 2026 — Text till tal & röstsyntes',
    seoDescription: 'Bästa text-till-tal AI 2026. Vi testar ElevenLabs, Murf, Speechify och fler för svenska röster, podcast, e-learning och tillgänglighet.',
    guideFocus: 'röstsyntes och text-till-tal, podcastproduktion, e-learning och narration, tillgänglighet och uppläsning, samt svenska röster och voice cloning',
    criteriaHint: 'Röstrealism, Svenska språkstöd, Röstbibliotek, Voice cloning, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'ElevenLabs', url: 'https://elevenlabs.io' }, { name: 'Murf AI', url: 'https://murf.ai' },
      { name: 'Speechify', url: 'https://speechify.com' }, { name: 'Play.ht', url: 'https://play.ht' },
      { name: 'Resemble AI', url: 'https://www.resemble.ai' }, { name: 'Wellsaid Labs', url: 'https://wellsaidlabs.com' },
      { name: 'LOVO AI', url: 'https://lovo.ai' }, { name: 'Voicemaker', url: 'https://voicemaker.in' },
      { name: 'Replica Studios', url: 'https://replicastudios.com' }, { name: 'Amazon Polly', url: 'https://aws.amazon.com/polly/' },
    ],
  },
  {
    slug: 'podcast-ljudredigering',
    seoTitle: 'Bästa AI-verktyg för podcast & ljudredigering 2026',
    seoDescription: 'Bästa AI för podcast 2026. Descript, Adobe Podcast, Riverside och fler — spela in, redigera, transkribera och publicera podcast med AI.',
    guideFocus: 'spela in, redigera, transkribera och publicera podcast med AI, brusreducering och ljudförbättring, samt distribution och show notes',
    criteriaHint: 'Ljudkvalitet, AI-redigering, Transkribering, Svenska språkstöd, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Descript', url: 'https://www.descript.com' }, { name: 'Adobe Podcast', url: 'https://podcast.adobe.com' },
      { name: 'Riverside.fm', url: 'https://riverside.fm' }, { name: 'Cleanvoice AI', url: 'https://cleanvoice.ai' },
      { name: 'Auphonic', url: 'https://auphonic.com' }, { name: 'Podcastle', url: 'https://podcastle.ai' },
      { name: 'Alitu', url: 'https://alitu.com' }, { name: 'Headliner', url: 'https://www.headliner.app' },
      { name: 'Buzzsprout AI', url: 'https://www.buzzsprout.com' }, { name: 'Otter.ai', url: 'https://otter.ai' },
    ],
  },
  {
    slug: 'produktivitet',
    seoTitle: 'Bästa AI-produktivitetsverktyg 2026 — Jobba smartare med AI',
    seoDescription: 'Bästa AI-produktivitetsverktyg 2026. Notion AI, Reclaim, Motion och fler för tidsplanering, anteckningar, prioritering och fokus.',
    guideFocus: 'AI för tidsplanering och kalender, anteckningar och kunskapshantering, prioritering och fokus, samt automatisering av rutinuppgifter',
    criteriaHint: 'AI-funktioner, Tidsplanering, Anteckningar, Integrationer, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Notion AI', url: 'https://www.notion.so' }, { name: 'Obsidian AI', url: 'https://obsidian.md' },
      { name: 'Mem.ai', url: 'https://get.mem.ai' }, { name: 'Reclaim AI', url: 'https://reclaim.ai' },
      { name: 'Todoist AI', url: 'https://todoist.com' }, { name: 'Sunsama', url: 'https://sunsama.com' },
      { name: 'Motion', url: 'https://www.usemotion.com' }, { name: 'Akiflow', url: 'https://akiflow.com' },
      { name: 'Cron', url: 'https://cron.com' }, { name: 'Reflect', url: 'https://reflect.app' },
    ],
  },
  {
    slug: 'e-postmarknadsforing',
    seoTitle: 'Bästa AI för e-postmarknadsföring 2026 — Topp 10 verktyg',
    seoDescription: 'Bästa AI för e-postmarknadsföring 2026. Mailchimp, Klaviyo, Brevo och fler — skriv, personalisera och optimera e-postkampanjer med AI.',
    guideFocus: 'AI för att skriva och personalisera e-post, segmentering och automation, A/B-testning och optimering, samt leverans och cold outreach',
    criteriaHint: 'AI-funktioner, Personalisering, Automation, Leveransbarhet, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Mailchimp AI', url: 'https://mailchimp.com' }, { name: 'Klaviyo AI', url: 'https://www.klaviyo.com' },
      { name: 'ActiveCampaign AI', url: 'https://www.activecampaign.com' }, { name: 'Brevo AI', url: 'https://www.brevo.com' },
      { name: 'HubSpot Email', url: 'https://www.hubspot.com/products/marketing/email' }, { name: 'Instantly AI', url: 'https://instantly.ai' },
      { name: 'Lemlist', url: 'https://www.lemlist.com' }, { name: 'Smartlead', url: 'https://www.smartlead.ai' },
      { name: 'Lavender', url: 'https://www.lavender.ai' }, { name: 'Warmer.ai', url: 'https://warmer.ai' },
    ],
  },
  {
    slug: 'dataanalys',
    seoTitle: 'Bästa AI för dataanalys 2026 — Business Intelligence med AI',
    seoDescription: 'Bästa AI för dataanalys 2026. Tableau, Power BI Copilot, Julius och fler — analysera data, skapa rapporter och fatta datadrivna beslut.',
    guideFocus: 'AI för att analysera data, skapa rapporter och dashboards, ställa frågor i naturligt språk, samt prediktiv analys och beslutsstöd',
    criteriaHint: 'AI-funktioner, Visualisering, Naturligt språk, Integrationer, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Tableau AI', url: 'https://www.tableau.com' }, { name: 'Power BI Copilot', url: 'https://powerbi.microsoft.com' },
      { name: 'Looker AI', url: 'https://looker.com' }, { name: 'Julius AI', url: 'https://julius.ai' },
      { name: 'Obviously AI', url: 'https://www.obviously.ai' }, { name: 'DataRobot', url: 'https://www.datarobot.com' },
      { name: 'H2O.ai', url: 'https://h2o.ai' }, { name: 'Akkio', url: 'https://www.akkio.com' },
      { name: 'Polymer', url: 'https://www.polymersearch.com' }, { name: 'Rows AI', url: 'https://rows.com' },
    ],
  },
  {
    slug: 'utbildning',
    seoTitle: 'Bästa AI-verktyg för utbildning 2026 — AI för lärare & elever',
    seoDescription: 'Bästa AI för utbildning 2026. Khan Academy, Duolingo, Khanmigo och fler — AI för lärare, elever, distansutbildning och språkinlärning.',
    guideFocus: 'AI för lärare och elever, distansutbildning, språkinlärning och pluggstöd, samt vad svenska skollagen och skolverket säger om AI i skolan',
    criteriaHint: 'Pedagogisk kvalitet, Svenska språkstöd, Ämnesbredd, Integritet & elevdata, Pris/prestanda, Användarvänlighet',
    tools: [
      { name: 'Khan Academy AI', url: 'https://www.khanacademy.org' }, { name: 'Duolingo AI', url: 'https://www.duolingo.com' },
      { name: 'Coursera AI', url: 'https://www.coursera.org' }, { name: 'Synthesis AI', url: 'https://www.synthesis.com' },
      { name: 'Khanmigo', url: 'https://www.khanmigo.ai' }, { name: 'Quizlet AI', url: 'https://quizlet.com' },
      { name: 'Socratic', url: 'https://socratic.org' }, { name: 'Photomath AI', url: 'https://photomath.com' },
      { name: 'Grammarly', url: 'https://www.grammarly.com' }, { name: 'Turnitin AI', url: 'https://www.turnitin.com' },
    ],
  },
];

function slugify(s: string): string {
  return s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/\.ai\b/g, '-ai').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const stripFence = (s: string) => s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim();
function textOf(msg: Anthropic.Message) {
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim();
}
async function ask(model: string, prompt: string, maxTokens: number) {
  return textOf(await claude.messages.create({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] }));
}

type ToolGen = {
  company: string; model: string; founded: number; hq: string; useCases: string[];
  scores: number[]; tags: string[]; pros: string[]; cons: string[];
  offer: { title: string; price: string; bestFor: string }; label: string; score: number; excerpt: string;
};
type Faq = { question: string; answer: string };

async function generateProfiles(hub: Hub, slugByName: Record<string, string>) {
  const toolLines = hub.tools.map((t) => `- key "${slugByName[t.name]}": ${t.name}`).join('\n');
  const prompt = `Du är senior AI-verktygsredaktör på AI-Magasinet. Skapa strukturerad data för kategorin "${hub.seoTitle}".

Föreslå EXAKT 6 betygskriterier (utgå från: ${hub.criteriaHint}) — samma 6 för alla verktyg. Skriv 5 vanliga frågor + svar (FAQ) för kategorisidan. För vart och ett av dessa 10 verktyg, skriv data på svenska:
${toolLines}

Returnera EXAKT detta JSON (inget annat, ingen \`\`\`):
{"criteria":["k1","k2","k3","k4","k5","k6"],
 "faqs":[{"question":"...?","answer":"..."},{"question":"...?","answer":"..."},{"question":"...?","answer":"..."},{"question":"...?","answer":"..."},{"question":"...?","answer":"..."}],
 "tools":{"<key>":{"company":"","model":"","founded":2021,"hq":"Stad, Land","useCases":["","","","",""],"scores":[8.8,9,8.5,8.7,8.9,9.1],"tags":["","","",""],"pros":["","",""],"cons":["",""],"offer":{"title":"","price":"Gratis · Pro X USD/mån","bestFor":""},"label":"Redaktionens val","score":8.9,"excerpt":"En mening."}}}

Krav: scores har 6 tal 7.5–9.8 (samma ordning som criteria). Naturlig svenska, inga floskler, inga emojis. Alla 10 nycklar + 5 faqs MÅSTE finnas.`;
  for (let a = 0; a < 2; a++) {
    const raw = stripFence(await ask(SONNET, prompt, 8000));
    try {
      const p = JSON.parse(raw) as { criteria: string[]; faqs: Faq[]; tools: Record<string, ToolGen> };
      if (!Array.isArray(p.criteria) || p.criteria.length < 6) throw new Error('criteria');
      if (!Array.isArray(p.faqs) || p.faqs.length < 5) throw new Error('faqs');
      const missing = hub.tools.filter((t) => !p.tools[slugByName[t.name]]);
      if (missing.length) throw new Error(`missing ${missing.length} tools`);
      return p;
    } catch (e) { if (a === 1) throw new Error(`profiles JSON ${hub.slug}: ${e instanceof Error ? e.message : e}`); }
  }
  throw new Error('unreachable');
}

async function generateGuide(hub: Hub, siblings: { href: string; label: string }[]) {
  const links = [
    { href: '/ai-verktyg/jamfor/', label: 'jämför AI-verktyg' },
    { href: '/ai-verktyg/', label: 'alla AI-verktyg' },
    ...siblings,
  ];
  const prompt = `Du är senior SEO-redaktör på AI-Magasinet. Skriv en guide på cirka 2000 ord (svenska) för kategorisidan "${hub.seoTitle}".

Fokus: ${hub.guideFocus}.

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen <html>/<body>, ingen markdown, inga \`\`\`-block, ingen <h1>.
- Naturlig affärssvenska, SEO-medveten (väv in nyckelord naturligt: kategorinamnet, "AI-verktyg", "bästa", "${YEAR}"). Inga floskler, inga emojis.
- Inkludera 3-5 interna länkar naturligt i prosan med <a href="...">: ${links.map((l) => `${l.href} (${l.label})`).join(', ')}.
- Struktur: intro, vad man ska tänka på vid val, vanliga användningsfall, för vem passar vad, vanliga misstag, kort avslutning. Avsluta INTE med FAQ.`;
  return stripFence(await ask(SONNET, prompt, 6000));
}

async function generateReview(name: string, hub: Hub, g: ToolGen, criteria: string[]) {
  const prompt = `Du är AI-verktygsredaktör på AI-Magasinet. Skriv en recension på cirka 600 ord (svenska) av "${name}" i kategorin ${hub.seoTitle}.

Fakta att utgå från: företag ${g.company}, ${g.hq}, grundat ${g.founded}. Passar bäst för: ${g.offer.bestFor}. Styrkor: ${g.pros.join(', ')}. Svagheter: ${g.cons.join(', ')}. Användningsfall: ${g.useCases.join(', ')}. Helhetsbetyg ${g.score}/10.

Krav:
- ENBART ren HTML: <h2>, <h3>, <p>, <ul>/<li>. Ingen markdown, inga \`\`\`-block, ingen <h1>. Börja med <p><strong>Betyg: ${g.score.toFixed(1)}/10</strong></p>.
- Naturlig svenska, konkret, inga floskler, inga emojis. Täck: vad det är, vad det är bäst på, för- och nackdelar, pris, och för vem det passar. Nämn svenskt språkstöd om relevant.`;
  return stripFence(await ask(HAIKU, prompt, 2500));
}

async function main() {
  // Befintliga slugs (skapa inte om redan-flata reviews).
  const existing = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data } = await db.from('articles').select('slug').range(from, from + 999);
    (data ?? []).forEach((r: { slug: string }) => existing.add(r.slug));
    if (!data || data.length < 1000) break;
  }

  const profiles: Record<string, Record<string, unknown>> = {};
  let logoIdx = 0;

  for (const hub of HUBS) {
    const hubPath = `/ai-verktyg/${hub.slug}`;
    if (!FORCE) {
      const { data } = await db.from('articles').select('content_mdx').eq('path', hubPath).maybeSingle();
      if (data?.content_mdx) { console.log(`SKIP hub ${hub.slug} (finns; FORCE=1 för att regen)`); continue; }
    }
    console.log(`\n=== ${hub.slug} ===`);
    const slugByName: Record<string, string> = {};
    for (const t of hub.tools) slugByName[t.name] = slugify(t.name);

    const gen = await generateProfiles(hub, slugByName);
    console.log(`  profiler+faq ok (${gen.criteria.join(', ')})`);
    const siblings = HUBS.filter((h) => h.slug !== hub.slug).slice(0, 2).map((h) => ({ href: `/ai-verktyg/${h.slug}/`, label: h.seoTitle.split('—')[0].trim().toLowerCase() }));
    const guide = await generateGuide(hub, siblings);
    const guideWords = guide.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`  guide ok (${guideWords} ord)`);

    // Hub-artikel.
    await db.from('articles').upsert({
      slug: hub.slug, title: hub.seoTitle, excerpt: hub.seoDescription, content_mdx: guide,
      category: null, tags: [], featured_image: null, type: 'page', path: hubPath,
      parent_slug: 'ai-verktyg', affiliate_url: null, published_at: new Date().toISOString(),
      seo_title: hub.seoTitle, seo_description: hub.seoDescription, faq: gen.faqs.slice(0, 5),
    }, { onConflict: 'path' });

    // Recensioner för NYA verktyg.
    let created = 0, referenced = 0;
    for (const t of hub.tools) {
      const key = slugByName[t.name];
      const g = gen.tools[key];
      if (existing.has(key)) { referenced++; continue; } // referera befintlig, skapa inte om
      const body = await generateReview(t.name, hub, g, gen.criteria);
      await db.from('articles').upsert({
        slug: key, title: `${t.name} – Recension & Test ${YEAR}`, excerpt: g.excerpt, content_mdx: body,
        category: null, tags: [], featured_image: null, type: 'page', path: `/ai-verktyg/${key}`,
        parent_slug: hub.slug, affiliate_url: null, published_at: new Date().toISOString(),
        seo_title: null, seo_description: null,
      }, { onConflict: 'path' });
      profiles[key] = {
        logo: LOGOS[logoIdx++ % LOGOS.length], ctaName: t.name, fallbackUrl: t.url,
        company: g.company, model: g.model, founded: g.founded, hq: g.hq, useCases: g.useCases.slice(0, 5),
        ratingCriteria: gen.criteria.slice(0, 6).map((label, i) => ({ label, score: Number((g.scores[i] ?? g.score).toFixed(1)) })),
        tags: g.tags.slice(0, 4), pros: g.pros.slice(0, 3), cons: g.cons.slice(0, 2), offer: g.offer, label: g.label, score: Number(g.score.toFixed(1)),
      };
      existing.add(key);
      created++;
    }
    console.log(`  ${created} nya recensioner, ${referenced} refererade befintliga`);
  }

  // CRM: regenerera guide (~2000), behåll FAQ.
  {
    const crmHub: Hub = {
      slug: 'crm', seoTitle: 'Bästa CRM med AI 2026 — kundhantering med AI',
      seoDescription: '', guideFocus: 'AI för leads och lead scoring, kundrelationer, försäljningsprognoser, e-post- och samtalsautomation, samt hur svenska sälj- och marknadsteam väljer rätt CRM (GDPR)',
      criteriaHint: '', tools: [],
    };
    const guide = await generateGuide(crmHub, HUBS.slice(0, 2).map((h) => ({ href: `/ai-verktyg/${h.slug}/`, label: h.seoTitle.split('—')[0].trim().toLowerCase() })));
    const w = guide.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    await db.from('articles').update({ content_mdx: guide }).eq('path', '/ai-verktyg/crm');
    console.log(`\nCRM guide regenererad (${w} ord).`);
  }

  // Skriv lib.
  writeFileSync(resolve('lib/category-hub-tools-3.ts'),
    `/** Kategori-hub-profiler (batch 3) — genererad av scripts/seed-category-hubs-3.ts.\n` +
    ` *  Mergas in i REVIEW_KNOWN (ReviewTemplate) + KNOWN (HubTemplate). */\n` +
    `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
    `export const CATEGORY_HUB_REVIEW_KNOWN_3: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(profiles, null, 2)};\n`,
    'utf8');
  console.log(`\nWrote lib/category-hub-tools-3.ts (${Object.keys(profiles).length} profiler).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
