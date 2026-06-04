/**
 * Bygger om /ai-verktyg/gratis-hubben + dess 4 subkategori-sidor med
 * fullständiga, unika guider via Claude Sonnet 4.6.
 *
 *   npx tsx scripts/seed-gratis-hubs.ts
 *   ONLY=ai-video npx tsx scripts/seed-gratis-hubs.ts   # bara en sida
 *
 * Hub-sidan (/ai-verktyg/gratis) renderas av GratisHubTemplate (subkategori-
 * grid + top-5 + guide). Subsidorna renderas av ArticleTemplate (rik guide
 * med jämförelsetabell + CTA-knappar). UPDATE per path — rör inte slug.
 *
 * CTA-knappar pekar på de flata kanoniska recensionerna (/ai-verktyg/<slug>,
 * video under /ai-video/<slug>).
 */
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
const ONLY = process.env.ONLY;

const SYSTEM = `Du är senior redaktör på AI-Magasinet, Sveriges ledande magasin om artificiell intelligens.

# Tonalitet
Expert, rak, praktisk svenska. Skriv som en kunnig kollega som har testat verktygen själv. Inga floskler. Inga emojis. Konkreta verktygsnamn, priser och use cases.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (templaten har redan en). Inga \`\`\`html-wrapping, inga inline styles, inga <style> eller <script>.

Använd: <h2>, <h3> för rubriker, <p> för stycken, <ul>/<ol>+<li> för listor, <a href> för länkar, <strong> sparsamt.

# Jämförelsetabeller
När en jämförelsetabell efterfrågas: skriv en riktig <table> med <thead>/<tbody>/<tr>/<th>/<td>, och OMSLUT hela tabellen i <div class="overflow-x-auto"> ... </div> så den kan scrollas på mobil.

# CTA-knappar
När CTA-knappar efterfrågas: använd EXAKT detta format (en per verktyg, placerad i slutet av verktygets stycke eller i en egen <p>):
<a href="DEN_KANONISKA_URLEN" class="not-prose inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white no-underline transition-colors hover:bg-indigo-700">Läs recension av VERKTYG →</a>
Använd ENBART de kanoniska URL:er som anges i uppgiften.`;

type Spec = {
  key: string;
  path: string;
  title?: string;          // sätt bara om titeln ska uppdateras
  excerpt: string;
  seoTitle: string;
  brief: string;
};

const SPECS: Spec[] = [
  {
    key: 'hub',
    path: '/ai-verktyg/gratis',
    title: 'Bästa gratis AI-verktyg 2026',
    excerpt: 'De bästa AI-verktygen du kan använda helt gratis 2026 — text, bild, video och kod. Vad som ingår, var gränserna går och när det är värt att uppgradera.',
    seoTitle: 'Bästa gratis AI-verktyg 2026 — text, bild, video & kod',
    brief: `Skriv en guide på ca 1000 ord (svenska) om gratis AI-verktyg generellt — en översikt som hör hemma på navigerings-hubben /ai-verktyg/gratis. Detta ska INTE vara en lista per verktyg (subsidorna gör det), utan en orienterande guide.

Struktur:
- Intro: 2025-2026 är gratis-tier-eran. Du kan komma förvånansvärt långt utan att betala — om du vet vad varje gratisnivå faktiskt ger.
- <h2>Vad ingår egentligen i gratis AI 2026?</h2> — översikt: text (ChatGPT, Claude, Gemini), bild (Bing, Leonardo, Firefly), video (Pika, Kling, Runway), kod (Copilot, Codeium, Cursor). Vad som blivit gratis och varför (konkurrens, open source).
- <h2>De vanligaste begränsningarna</h2> — dygns-/timgränser, modell-downgrade efter X meddelanden, vattenstämplar, kötider, och kommersiell användning (ofta förbjuden eller villkorad på gratisplaner).
- <h2>Så maximerar du gratis-AI</h2> — växla mellan tjänster, batcha frågor, bild-till-video för kontroll, open source/lokalt som backup.
- <h2>När är det värt att uppgradera?</h2> — konkreta scenarier (dagligt proffsbruk, kommersiell licens, högre upplösning, prioriterad åtkomst) och prislägen (~20 USD/mån).
- <h2>Hitta rätt gratisverktyg</h2> — kort stycke som hänvisar vidare till de fyra subkategorierna.

Länka naturligt till subkategorierna: <a href="/ai-verktyg/gratis/ai-text">gratis AI-text</a>, <a href="/ai-verktyg/gratis/ai-bilder">gratis AI-bilder</a>, <a href="/ai-verktyg/gratis/ai-video">gratis AI-video</a>, <a href="/ai-verktyg/gratis/ai-kod">gratis AI-kod</a>. Inga CTA-knappar i denna guide.`,
  },
  {
    key: 'ai-text',
    path: '/ai-verktyg/gratis/ai-text',
    excerpt: 'Vad du faktiskt får gratis på ChatGPT, Claude och Gemini 2026 — meddelandegränser, kontext, funktioner och hur du maximerar gratisversionen.',
    seoTitle: 'Gratis AI-textverktyg 2026 — ChatGPT vs Claude vs Gemini',
    brief: `Skriv en gratis-vinklad guide på ca 1500 ord (svenska) som jämför gratis-tiers för ChatGPT, Claude och Gemini. Fokus 100% på GRATIS-användning.

Struktur:
- Intro: de tre stora ger nu nästan flaggskeppsmodeller gratis — skillnaden ligger i gränserna.
- <h2>Vad får du gratis i varje verktyg</h2> — ett stycke per verktyg (ChatGPT Free, Claude Free, Gemini Free) med modell, dygns-/meddelandegräns, funktioner.
- <h2>Jämförelsetabell: gratis-tiers sida vid sida</h2> — en jämförelsetabell (omsluten i <div class="overflow-x-auto">) med kolumnerna: Verktyg | Modell (gratis) | Meddelanden/dag | Kontext | Nyckelfunktioner | Viktigaste begränsning. En rad per verktyg.
- <h2>Så maximerar du gratisversionen</h2> — konkreta tips (sparsam prompt-design, batcha, växla mellan tjänsterna, när gränsen nås).
- <h2>Vilket gratisverktyg ska du välja?</h2> — rekommendation per behov.
- Avsluta med <h2>Läs våra fullständiga recensioner</h2> följt av tre CTA-knappar.

CTA-knappar (använd EXAKT button-formatet): ChatGPT → /ai-verktyg/chatgpt, Claude → /ai-verktyg/claude, Gemini → /ai-verktyg/gemini.`,
  },
  {
    key: 'ai-bilder',
    path: '/ai-verktyg/gratis/ai-bilder',
    excerpt: 'Bing Image Creator, Leonardo, Playground, Canva och Adobe Firefly gratis 2026 — bilder/dag, upplösning, kommersiell rätt och bästa valet per användningsfall.',
    seoTitle: 'Gratis AI-bildverktyg 2026 — Bing, Leonardo, Playground & fler',
    brief: `Skriv en gratis-vinklad guide på ca 1500 ord (svenska) om gratis AI-bildverktyg. Fokus 100% på GRATIS.

Verktyg som ska täckas: Bing Image Creator (gratis DALL-E 3), Leonardo AI, Playground AI, Canva AI (gratis), Adobe Firefly (gratis).

Struktur:
- Intro: AI-bilder gratis 2026 — frågan är inte om du kan, utan vilken kombo som ger bäst resultat.
- <h2>Fem gratis-alternativ som ger verkligt värde</h2> — ett stycke per verktyg med vad du får gratis.
- <h2>Jämförelsetabell</h2> — tabell (omsluten i <div class="overflow-x-auto">) med kolumnerna: Verktyg | Bilder/dag (gratis) | Max upplösning | Kommersiell rätt | Vattenstämpel | Bäst för. En rad per verktyg.
- <h2>Bästa gratis bildgeneratorn per användningsfall</h2> — t.ex. text-i-bild (Bing/DALL-E 3), game art (Leonardo), snabb SoMe-grafik (Canva), kommersiellt säkert (Firefly), experimentellt (Playground).
- <h2>Tips för att maximera gratis-kvoten</h2>.
- Avsluta med <h2>Läs våra fullständiga recensioner</h2> följt av CTA-knappar.

CTA-knappar (EXAKT button-format): Bing Image Creator → /ai-verktyg/bing-image-creator, Leonardo AI → /ai-verktyg/leonardo-ai, Playground AI → /ai-verktyg/playground-ai, Canva AI → /ai-verktyg/canva-ai, Adobe Firefly → /ai-verktyg/adobe-firefly.`,
  },
  {
    key: 'ai-video',
    path: '/ai-verktyg/gratis/ai-video',
    excerpt: 'Pika Labs, Kling AI, Runway och CapCut gratis 2026 — videos/månad, klipplängd, upplösning, vattenstämplar och hur du får ut mest utan att betala.',
    seoTitle: 'Gratis AI-video 2026 — Pika, Kling, Runway & CapCut',
    brief: `Skriv en gratis-vinklad guide på ca 1500 ord (svenska) om gratis AI-video. Fokus 100% på GRATIS.

Verktyg: Pika Labs (gratis krediter), Kling AI (dagliga gratis krediter), Runway (gratis tier, 125 credits), CapCut AI (gratis videoeditor med AI).

Struktur:
- Intro: AI-video gratis 2026 — generösa gratis-krediter gör att du kan komma långt utan att betala.
- <h2>Fyra gratis-alternativ som ger verkligt värde</h2> — ett stycke per verktyg.
- <h2>Jämförelsetabell</h2> — tabell (omsluten i <div class="overflow-x-auto">) med kolumnerna: Verktyg | Videos/månad (gratis) | Max klipplängd | Upplösning | Vattenstämpel | Bäst för. En rad per verktyg.
- <h2>Så maximerar du gratis-krediterna</h2> — växla mellan tjänster, bild-till-video för kontroll, planera prompts.
- <h2>När räcker inte gratis?</h2> — Runway Pro, Kling Pro, Sora via ChatGPT Plus.
- Avsluta med <h2>Läs våra fullständiga recensioner</h2> följt av CTA-knappar.

CTA-knappar (EXAKT button-format): Pika Labs → /ai-video/pika-labs, Kling AI → /ai-video/kling-ai, Runway → /ai-video/runway-gen-3, CapCut AI → /ai-video/capcut-ai-vklipp.`,
  },
  {
    key: 'ai-kod',
    path: '/ai-verktyg/gratis/ai-kod',
    excerpt: 'GitHub Copilot, Codeium, Cursor och Replit gratis 2026 — funktioner, IDE-stöd och begränsningar. Komplett guide till gratis AI för utvecklare.',
    seoTitle: 'Gratis AI-kodverktyg 2026 — Copilot, Codeium, Cursor & Replit',
    brief: `Skriv en gratis-vinklad guide på ca 1500 ord (svenska) om gratis AI-kodverktyg. Fokus 100% på GRATIS.

Verktyg: GitHub Copilot (gratis för studenter/OS + gratis Free-plan), Codeium (helt gratis för individer), Cursor (gratis tier), Replit AI (gratis tier).

Struktur:
- Intro: AI-kod gratis 2026 — Codeium ger flagship-features gratis, Copilot är gratis för studenter, Cursor och Replit har generösa gratisnivåer.
- <h2>Fyra verktyg som ger verkligt värde gratis</h2> — ett stycke per verktyg.
- <h2>Jämförelsetabell</h2> — tabell (omsluten i <div class="overflow-x-auto">) med kolumnerna: Verktyg | Pris (gratis-villkor) | IDE-stöd | Autocomplete | AI-chat/agent | Viktigaste begränsning. En rad per verktyg.
- <h2>Studentrabatt och open source-program</h2> — GitHub Education, JetBrains för studenter.
- <h2>Vilket gratisverktyg passar dig?</h2> — flowchart-style rekommendation.
- Avsluta med <h2>Läs våra fullständiga recensioner</h2> följt av CTA-knappar.

CTA-knappar (EXAKT button-format): GitHub Copilot → /ai-verktyg/github-copilot, Codeium → /ai-verktyg/codeium, Cursor AI → /ai-verktyg/cursor-ai, Replit AI → /ai-verktyg/replit-ai.`,
  },
];

async function generate(brief: string): Promise<string> {
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: brief + '\n\nSkriv guiden nu. Ren HTML, börja med första <p>-taggen.' }],
  });
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim();
}

async function main() {
  const specs = ONLY ? SPECS.filter((s) => s.key === ONLY) : SPECS;
  for (const s of specs) {
    process.stdout.write(`—— ${s.path} —— `);
    const html = await generate(s.brief);
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    if (words < 500) { console.error(`\nFör kort (${words} ord) — hoppar över ${s.path}`); continue; }
    const patch: Record<string, unknown> = {
      content_mdx: html,
      excerpt: s.excerpt,
      seo_title: s.seoTitle,
      seo_description: s.excerpt,
    };
    if (s.title) patch.title = s.title;
    const { error } = await db.from('articles').update(patch).eq('path', s.path);
    if (error) { console.error(`\nupdate failed ${s.path}: ${error.message}`); process.exit(1); }
    console.log(`${words} ord ✓`);
  }
  console.log('Klart.');
}

main().catch((e) => { console.error(e); process.exit(1); });
