/**
 * Ekonomi + marknadsföring: skapa kanoniska depth-2 hubbar och FLYTTA
 * (re-home) de befintliga recensionerna dit — uppdaterar path + parent_slug
 * på plats (slug behålls → befintliga YRKE_*-profiler gäller automatiskt).
 * Mergar ENDAST ChatGPT ×4 → 1 ny kanonisk recension.
 *
 *   npx tsx scripts/rehome-hubs.ts            (dry)
 *   npx tsx scripts/rehome-hubs.ts --apply
 *
 * Skriver (vid --apply):
 *   - DB: 2 hub-rader + flyttar ~56 recensioner + 1 ChatGPT-canonical
 *   - lib/yrkes-hub-tools-extra.ts (profil för chatgpt-marknadsforing)
 *   - tmp/ekonomi-mktf-redirects.json (redirects + chatgpt deletePaths)
 *
 * Raderar inga gamla recensioner (utom ChatGPT-dubbletterna som hanteras i
 * det avslutande delete-steget efter push).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { YRKE_TOOLS, toHubProfile, toReviewProfile, toContentMdx, type YrkeParent } from '../lib/yrke-tools';

loadEnv({ path: '.env.local' });
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const APPLY = process.argv.includes('--apply');
const MODEL = 'claude-sonnet-4-6';
const YEAR = 2026;

const PARENT_PATH: Record<string, string> = {
  seo: 'marknadsforing/seo', 'content-copywriting': 'marknadsforing/content-copywriting',
  annonser: 'marknadsforing/annonser', 'sociala-medier': 'marknadsforing/sociala-medier',
  bokforing: 'ekonomi-redovisning/bokforing', redovisning: 'ekonomi-redovisning/redovisning',
};

type Prof = {
  key: string; hubSlug: string; hubPath: string; title: string; seoTitle: string; seoDescription: string;
  yrkeLabel: string; parents: YrkeParent[]; parentLabels: Record<string, string>; focusKw: string;
  /** gamla hub/yrkesRoll-paths som ska 301:as till nya hubben */
  legacyHubPaths: string[];
};

const PROFS: Prof[] = [
  {
    key: 'ekonomi', hubSlug: 'ai-verktyg-ekonomi', hubPath: '/ai-verktyg/ekonomi',
    title: 'Bästa AI-verktygen för ekonomi & redovisning 2026 — bokföring, avstämning & bokslut',
    seoTitle: 'AI för ekonomi 2026 — bästa AI-verktygen för bokföring',
    seoDescription: 'Bästa AI-verktygen för ekonomi och redovisning 2026. Fortnox, Visma, Bokio, Dooer, Pleo och fler för bokföring, avstämning och bokslut — testade och rankade.',
    yrkeLabel: 'ekonomiarbetet', parents: ['bokforing', 'redovisning'],
    parentLabels: { bokforing: 'Bokföring', redovisning: 'Redovisning' },
    focusKw: 'AI för ekonomi, AI bokföring, AI redovisning svenska',
    legacyHubPaths: [
      '/ai-verktyg/foretag/yrke/ekonomi-redovisning',
      '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing',
      '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning',
    ],
  },
  {
    key: 'marknadsforing', hubSlug: 'ai-verktyg-marknadsforing', hubPath: '/ai-verktyg/marknadsforing',
    title: 'Bästa AI-verktygen för marknadsföring 2026 — content, SEO, annonser & sociala medier',
    seoTitle: 'AI för marknadsföring 2026 — bästa AI-verktygen',
    seoDescription: 'Bästa AI-verktygen för marknadsföring 2026. ChatGPT, Jasper, Surfer SEO, AdCreative och fler för content, SEO, annonser och sociala medier — testade och rankade.',
    yrkeLabel: 'marknadsföringsarbetet', parents: ['seo', 'content-copywriting', 'annonser', 'sociala-medier'],
    parentLabels: { seo: 'SEO', 'content-copywriting': 'Content & copywriting', annonser: 'Annonser', 'sociala-medier': 'Sociala medier' },
    focusKw: 'AI för marknadsföring, AI marknadsföring svenska, AI content SEO annonser',
    legacyHubPaths: [
      '/ai-verktyg/foretag/yrke/marknadsforing',
      '/ai-verktyg/foretag/yrke/marknadsforing/seo',
      '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting',
      '/ai-verktyg/foretag/yrke/marknadsforing/annonser',
      '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier',
    ],
  },
];

function stripFence(s: string): string { return s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim(); }
function uniq<T>(a: T[]): T[] { return Array.from(new Set(a)); }
async function sonnet(user: string, maxTokens: number, system?: string): Promise<string> {
  const msg = await claude.messages.create({
    model: MODEL, max_tokens: maxTokens,
    ...(system ? { system: [{ type: 'text' as const, text: system, cache_control: { type: 'ephemeral' as const } }] } : {}),
    messages: [{ role: 'user', content: user }],
  });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim();
}
const GUIDE_SYSTEM = `Du är senior redaktör på AI-Magasinet. Röst: expert, rak, praktisk — inte "AI-ig". Konkret framför generiskt, verkliga verktyg/priser/exempel, erkänn nyanser, inga floskler ("revolutionerar", "game changer"), inga emojis, naturlig affärssvenska. Output REN HTML (<h2>,<h3>,<p>,<ul>/<li>,<a href>,<strong> sparsamt), ingen markdown, ingen \`\`\`, ingen <h1>. Börja med <p>.`;

async function genGuide(prof: Prof, topp: { slug: string; brand: string; score: number }[]): Promise<string> {
  const areor = Object.values(prof.parentLabels).join(', ');
  const topNames = topp.slice(0, 5).map((t) => `${t.brand} (${t.score.toFixed(1)}/10)`).join(', ');
  const prompt = `Skriv en guide på ~1500 ord (svenska) för hubbsidan "${prof.title}". Rubrikvinkel: "Så effektiviserar du ${prof.yrkeLabel} med AI".
Fokusnyckelord: ${prof.focusKw}. Användningsområden: ${areor}. Verktyg i topplistan: ${topNames}.
Krav: REN HTML enligt systeminstruktion, börja med <p>. Struktur: intro → en <h2> per användningsområde (${areor}) med konkreta exempel + namngivna verktyg → <h2> "Så väljer du rätt AI-verktyg för ${prof.key}" → kort avslutning. Inkludera interna länkar: <a href="${prof.hubPath}/${topp[0]?.slug}/">${topp[0]?.brand}</a>, <a href="${prof.hubPath}/${topp[1]?.slug}/">${topp[1]?.brand}</a>, <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>. INGEN FAQ.`;
  try {
    const html = stripFence(await sonnet(prompt, 6000, GUIDE_SYSTEM));
    if (html.replace(/<[^>]+>/g, '').length < 800) throw new Error('too short');
    return html;
  } catch (e) { console.warn(`  guide fallback: ${e instanceof Error ? e.message : e}`); return `<p>Vi har testat och rankat de bästa AI-verktygen för ${prof.key}. Se topplistan ovan och <a href="/ai-verktyg/jamfor/">jämför AI-verktyg</a>.</p>`; }
}
type Faq = { question: string; answer: string };
async function genFaqs(prof: Prof, topp: { brand: string }[]): Promise<Faq[]> {
  const prompt = `Skriv 5 FAQ (people-also-ask, svenska) för hubbsidan om AI för ${prof.key}. Varierade: skillnad, pris, svenska/GDPR, kom-igång, vem passar vad. Utgå från ${topp.slice(0, 4).map((t) => t.brand).join(', ')}. Returnera EXAKT JSON: [{"question":"…?","answer":"…"}, …5]. Inget annat.`;
  for (let i = 0; i < 2; i++) {
    try { const arr = JSON.parse(stripFence(await sonnet(prompt, 2000))) as Faq[]; if (Array.isArray(arr) && arr.length >= 5) return arr.slice(0, 5); throw new Error('shape'); }
    catch (e) { if (i === 1) { console.warn(`  faq fallback: ${e instanceof Error ? e.message : e}`); return []; } }
  }
  return [];
}

async function main() {
  const redirects: { from: string; to: string }[] = [];
  const chatgptDeletePaths: string[] = [];
  const extraHubKnown: Record<string, ReturnType<typeof toHubProfile>> = {};
  const extraReviewKnown: Record<string, ReturnType<typeof toReviewProfile>> = {};

  for (const prof of PROFS) {
    console.log(`\n=== ${prof.key}  (${prof.hubPath}) ${APPLY ? '' : '[DRY]'} ===`);
    const tools = YRKE_TOOLS.filter((t) => prof.parents.includes(t.parent));
    const topp = [...tools].sort((a, b) => b.score - a.score).map((t) => ({ slug: t.slug, brand: t.brand, score: t.score }));

    // ChatGPT-grupp (endast denna mergas).
    const chatgptVariants = tools.filter((t) => t.brand.toLowerCase() === 'chatgpt');
    const single = tools.filter((t) => t.brand.toLowerCase() !== 'chatgpt');
    console.log(`  ${tools.length} verktyg → ${single.length} re-home + ${chatgptVariants.length ? '1 ChatGPT-merge' : 'ingen merge'}`);

    // 1) hub-rad
    const guide = APPLY ? await genGuide(prof, topp) : '<p>(dry)</p>';
    const faqs = APPLY ? await genFaqs(prof, topp) : [];
    if (APPLY) console.log(`  guide ${guide.length} tkn, faq ${faqs.length}`);
    const hubRow = {
      slug: prof.hubSlug, title: prof.title, excerpt: prof.seoDescription, content_mdx: guide,
      category: null, tags: [] as string[], featured_image: null, type: 'page',
      path: prof.hubPath, parent_slug: 'ai-verktyg', affiliate_url: null,
      published_at: new Date().toISOString(), seo_title: prof.seoTitle, seo_description: prof.seoDescription,
      faq: faqs.length ? faqs : null,
    };
    if (APPLY) {
      const { error } = await db.from('articles').upsert([hubRow], { onConflict: 'path' });
      if (error) { console.error('hub upsert failed:', error.message); process.exit(1); }
    }

    // 2) re-home single-variant reviews (UPDATE path + parent_slug)
    for (const t of single) {
      const oldPath = `/ai-verktyg/foretag/yrke/${PARENT_PATH[t.parent]}/${t.slug}`;
      const newPath = `${prof.hubPath}/${t.slug}`;
      redirects.push({ from: oldPath, to: newPath });
      if (APPLY) {
        const { data, error } = await db.from('articles').update({ path: newPath, parent_slug: prof.hubSlug }).eq('path', oldPath).select('id');
        if (error) { console.error(`move ${oldPath} failed:`, error.message); process.exit(1); }
        if (!data?.length) console.warn(`    ⚠ ingen rad vid ${oldPath}`);
      }
    }
    console.log(`  re-homed ${single.length} recensioner`);

    // 3) ChatGPT-merge (marknadsföring)
    if (chatgptVariants.length > 1) {
      const top = [...chatgptVariants].sort((a, b) => b.score - a.score)[0];
      const merged = {
        ...top, score: Math.round((chatgptVariants.reduce((s, v) => s + v.score, 0) / chatgptVariants.length) * 10) / 10,
        features: uniq(chatgptVariants.flatMap((v) => v.features)).slice(0, 6),
        pros: uniq(chatgptVariants.flatMap((v) => v.pros)).slice(0, 4),
        cons: uniq(chatgptVariants.flatMap((v) => v.cons)).slice(0, 3),
        useCases: uniq(chatgptVariants.flatMap((v) => v.useCases)).slice(0, 8),
        tags: uniq(chatgptVariants.flatMap((v) => v.tags)).slice(0, 4),
      };
      const canonSlug = 'chatgpt-marknadsforing';
      const canonPath = `${prof.hubPath}/${canonSlug}`;
      extraHubKnown[canonSlug] = toHubProfile(merged);
      extraReviewKnown[canonSlug] = toReviewProfile(merged);
      let body = `<p><strong>Betyg: ${merged.score.toFixed(1)}/10</strong></p>\n${toContentMdx(merged)}`;
      if (APPLY) {
        const areas = chatgptVariants.map((v) => `### ${prof.parentLabels[v.parent]}\n${toContentMdx(v)}`).join('\n\n---\n\n');
        try {
          const m = stripFence(await sonnet(`Slå ihop ${chatgptVariants.length} recensioner av ChatGPT (olika marknadsförings-användningsområden) till EN kanonisk recension ~1000 ord (svenska). Betyg ${merged.score.toFixed(1)}/10, pris ${merged.pricing}. Områden + källtexter:\n\n${areas}\n\nKrav: REN HTML (<h2>,<h3>,<p>,<ul>/<li>), ingen <h1>, ingen markdown/\`\`\`. Struktur: <h2>Vår analys av ChatGPT</h2>, <h2>Funktioner</h2>, <h2>Användningsområden inom marknadsföring</h2> med <h3> per område (${chatgptVariants.map((v) => prof.parentLabels[v.parent]).join(', ')}), <h2>Styrkor</h2>, <h2>Svagheter</h2>, <h2>Prismodell</h2>, <h2>Vem passar ChatGPT för?</h2>, <h2>Slutsats</h2>. Skriv INTE betygsraden.`, 3000));
          if (m.replace(/<[^>]+>/g, '').length >= 500) body = `<p><strong>Betyg: ${merged.score.toFixed(1)}/10</strong></p>\n${m}`;
        } catch (e) { console.warn(`  chatgpt merge fallback: ${e instanceof Error ? e.message : e}`); }
        const { error } = await db.from('articles').upsert([{
          slug: canonSlug, title: `ChatGPT för marknadsföring – Recension & Test ${YEAR}`, excerpt: merged.oneliner,
          content_mdx: body, category: null, tags: [] as string[], featured_image: null, type: 'page',
          path: canonPath, parent_slug: prof.hubSlug, affiliate_url: null,
          published_at: new Date().toISOString(), seo_title: null, seo_description: merged.oneliner,
        }], { onConflict: 'path' });
        if (error) { console.error('chatgpt upsert failed:', error.message); process.exit(1); }
      }
      for (const v of chatgptVariants) {
        const oldPath = `/ai-verktyg/foretag/yrke/${PARENT_PATH[v.parent]}/${v.slug}`;
        redirects.push({ from: oldPath, to: canonPath });
        chatgptDeletePaths.push(oldPath);
      }
      console.log(`  ChatGPT ${chatgptVariants.length}→1 (${canonPath})`);
    }

    // 4) legacy hub/yrkesRoll → ny hub
    for (const lp of prof.legacyHubPaths) redirects.push({ from: lp, to: prof.hubPath });
  }

  if (APPLY) {
    writeFileSync(resolve('lib/yrkes-hub-tools-extra.ts'),
      `/** Extra yrkes-hub-profiler (ChatGPT-merge) — genererade av\n` +
      ` *  scripts/rehome-hubs.ts. Mergas in i HubTemplate KNOWN / ReviewTemplate REVIEW_KNOWN. */\n` +
      `import type { ReviewProfile } from '@/components/templates/ReviewTemplate';\n\n` +
      `export const YRKES_HUB_KNOWN_EXTRA = ${JSON.stringify(extraHubKnown, null, 2)};\n\n` +
      `export const YRKES_HUB_REVIEW_KNOWN_EXTRA: Record<string, Partial<ReviewProfile>> = ${JSON.stringify(extraReviewKnown, null, 2)};\n`,
      'utf8');
    mkdirSync(resolve('tmp'), { recursive: true });
    writeFileSync(resolve('tmp/ekonomi-mktf-redirects.json'), JSON.stringify({ redirects, chatgptDeletePaths }, null, 2), 'utf8');
    console.log(`\nSkrev lib/yrkes-hub-tools-extra.ts + tmp/ekonomi-mktf-redirects.json (${redirects.length} redirects, ${chatgptDeletePaths.length} chatgpt-delete)`);
  } else {
    console.log(`\n[DRY] skulle skapa ${redirects.length} redirects, ${chatgptDeletePaths.length} chatgpt-delete`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
