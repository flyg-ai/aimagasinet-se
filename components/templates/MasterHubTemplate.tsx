import Link from 'next/link';
import { to } from '@/lib/links';
import type { Article } from '@/lib/supabase';
import { resolveToolProfile, toolOverallScore } from '@/components/templates/ReviewTemplate';
import { MasterHubDiscovery } from '@/components/MasterHubDiscovery';
import { YRKEN } from '@/components/templates/ForetagHubTemplate';
import { JsonLd } from '@/components/JsonLd';
import { FaqAccordion } from '@/components/FaqAccordion';
import { faqPageSchema } from '@/lib/schemas';
import { formatSvDate, contentModifiedIso } from '@/lib/format-date';
import {
  Type, Image as ImageIcon, Video, Code2, Music, Workflow,
  ChevronRight, ArrowRight, Search as SearchIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Antal publicerade recensioner under /ai-verktyg/ — hårdkodat snarare än en
 *  DB-fråga i rendern, eftersom sidan är statisk mellan deployer. Stäm av mot
 *  `select count(*) from articles where type='page' and path like '/ai-verktyg/%'
 *  and parent_slug is not null and published_at is not null` vid uppdatering. */
export const MASTER_HUB_TOOL_COUNT = 314;

/** Master hub for /ai-verktyg — lands users at a curated category grid that
 *  fans out to all sub-hubs. The article's content_mdx still renders below
 *  the grid as an editorial overview. */
export function MasterHubTemplate({ article: a }: { article: Article }) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} />
      <Top10Section />
      <TopGroupsSection />
      <MoreCategoriesSection />
      <EditorsPicks />
      <CategoryGrid />
      <EditorialBody html={a.content_mdx} />
      {Array.isArray(a.faq) && a.faq.length > 0 && (
        <>
          <FaqAccordion items={a.faq} />
          <JsonLd data={faqPageSchema(a.faq)} />
        </>
      )}
    </article>
  );
}

/** "Redaktionens val per kategori" — one editorial top-pick per main
 *  category, shown as a horizontal row directly under the hero. Scrollable
 *  on mobile, a 5-up row on desktop. Scores come from REVIEW_KNOWN so they
 *  stay in sync with the review pages. */
type Pick = { category: string; name: string; key: string; tagline: string; href: string };

const EDITORS_PICKS: Pick[] = [
  { category: 'AI-text',   name: 'Claude',     key: 'claude',     tagline: 'Bäst för längre texter & kod',  href: '/ai-verktyg/claude/' },
  { category: 'AI-bilder', name: 'Midjourney', key: 'midjourney', tagline: 'Bäst bildkvalitet 2026',         href: '/ai-verktyg/midjourney/' },
  { category: 'AI-video',  name: 'Kling AI',   key: 'kling-ai',   tagline: 'Redaktionens val för video',     href: '/ai-video/kling-ai/' },
  { category: 'AI-ljud',   name: 'Suno AI',    key: 'suno-ai',    tagline: 'Bäst för musikgenerering',       href: '/ai-verktyg/suno-ai/' },
  { category: 'AI-kod',    name: 'Cursor AI',  key: 'cursor-ai',  tagline: 'Bäst för utvecklare 2026',       href: '/ai-verktyg/cursor-ai/' },
];

function EditorsPicks() {
  return (
    <section className="border-b border-line bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Redaktionens val
        </div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
          Redaktionens favoriter
        </h2>

        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {EDITORS_PICKS.slice(0, 3).map((p) => {
            const profile = resolveToolProfile(p.key, p.name);
            const score = toolOverallScore(profile);
            return (
              <Link
                key={p.key}
                href={to(p.href)}
                className="group flex min-w-[240px] snap-start flex-col gap-3 rounded-xl border border-line bg-page p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl lg:min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-base font-black uppercase text-white ring-2 ring-white/40 ${profile.logo}`}
                  >
                    {p.name.charAt(0)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-sm font-black text-amber-600">
                    {score.toFixed(1)}
                    <span aria-hidden>★</span>
                  </span>
                </div>

                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                    {p.category}
                  </div>
                  <div className="mt-0.5 text-lg font-black tracking-tight text-fg break-words group-hover:text-indigo-600">
                    {p.name}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-fg-muted">{p.tagline}</p>

                <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  ✦ Redaktionens val
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Rankad topp 10-lista direkt under hero — matchar sökintentet för
 *  "bästa ai verktyg" (konkurrenter som rankar på frasen är nästan alla
 *  numrerade listor med namngivna verktyg högst upp, inte en kategorigrid).
 *  Poäng hämtas från samma REVIEW_KNOWN-profiler som EditorsPicks, så siffran
 *  här och på respektive recension kan aldrig gå isär. */
type Top10Item = { rank: number; category: string; name: string; key: string; tagline: string; href: string };

const TOP_10: Top10Item[] = [
  { rank: 1,  category: 'AI-text',       name: 'ChatGPT',    key: 'chatgpt',    tagline: 'Mest använd AI-assistent — bred och snabb',        href: '/ai-verktyg/chatgpt/' },
  { rank: 2,  category: 'AI-text',       name: 'Claude',     key: 'claude',     tagline: 'Bäst för längre texter & kod',                     href: '/ai-verktyg/claude/' },
  { rank: 3,  category: 'AI-bilder',     name: 'Midjourney', key: 'midjourney', tagline: 'Bäst bildkvalitet 2026',                           href: '/ai-verktyg/midjourney/' },
  { rank: 4,  category: 'AI-text',       name: 'Gemini',     key: 'gemini',     tagline: 'Bäst integrerad i Google Workspace',               href: '/ai-verktyg/gemini/' },
  { rank: 5,  category: 'AI-video',      name: 'Kling AI',   key: 'kling-ai',   tagline: 'Redaktionens val för video',                       href: '/ai-video/kling-ai/' },
  { rank: 6,  category: 'AI-bilder',     name: 'Canva AI',   key: 'canva-ai',   tagline: 'Bäst för snabb design utan designkunskap',         href: '/ai-verktyg/canva-ai/' },
  { rank: 7,  category: 'AI-kod',        name: 'Cursor AI',  key: 'cursor-ai',  tagline: 'Bäst för utvecklare 2026',                         href: '/ai-verktyg/cursor-ai/' },
  { rank: 8,  category: 'AI-ljud',       name: 'Suno AI',    key: 'suno-ai',    tagline: 'Bäst för musikgenerering',                         href: '/ai-verktyg/suno-ai/' },
  { rank: 9,  category: 'AI-ljud',       name: 'ElevenLabs', key: 'elevenlabs', tagline: 'Bäst röstkloning & text-till-tal',                 href: '/ai-verktyg/elevenlabs/' },
  { rank: 10, category: 'AI-automation', name: 'n8n',        key: 'n8n',        tagline: 'Bäst för att bygga egna AI-flöden',                href: '/ai-verktyg/n8n/' },
];

function Top10Section() {
  return (
    <section className="border-b border-line bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Topp 10
        </div>
        <h2 className="mb-2 text-2xl font-black tracking-tight text-fg sm:text-3xl">
          De 10 bästa AI-verktygen 2026
        </h2>
        <p className="mb-8 max-w-2xl text-fg-subtle">
          Rankade efter våra tester och recensioner. Klicka på ett verktyg för fullständig
          genomgång, pris och alternativ.
        </p>

        <ol className="grid gap-3 sm:grid-cols-2">
          {TOP_10.map((item) => {
            const profile = resolveToolProfile(item.key, item.name);
            const score = toolOverallScore(profile);
            return (
              <li key={item.key}>
                <Link
                  href={to(item.href)}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-page p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl"
                >
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-black text-fg-subtle"
                  >
                    {item.rank}
                  </span>
                  <span
                    aria-hidden
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-base font-black uppercase text-white ring-2 ring-white/40 ${profile.logo}`}
                  >
                    {item.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate font-black tracking-tight text-fg group-hover:text-indigo-600">
                        {item.name}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-black text-amber-600">
                        {score.toFixed(1)}
                        <span aria-hidden>★</span>
                      </span>
                    </div>
                    <p className="truncate text-sm text-fg-muted">{item.tagline}</p>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-fg-faint transition-transform group-hover:translate-x-1 group-hover:text-indigo-600"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const KATEGORI_BG = 'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/kategorier';

/** Curated category list — order is editorial, not alphabetic. Each card
 *  uses a real photo background from featured-images/kategorier/ + a
 *  bg-black/50 dark overlay + white text, matching the homepage's
 *  ExploreCategoriesSection. `fallbackGradient` is applied only when
 *  bg is null (none of the current 8 are null but the field stays so
 *  future entries can opt out of an image). */
/** `group` buckets the 34 kategorier under ~9 "vad vill du göra"-ämnen för
 *  snabbfiltret i CategoryGrid — rent frontend-lager, rör inte DB eller
 *  parent_slug. Håll i synk manuellt när en ny kategori läggs till. */
const CATEGORIES: {
  href: string;
  title: string;
  description: string;
  icon: string;
  bg: string | null;
  fallbackGradient: string;
  group: string;
}[] = [
  {
    href: '/ai-verktyg/ai-text-verktyg',
    title: 'AI för text',
    description: 'ChatGPT, Claude, Gemini och resten — våra bästa text-AI:er testade.',
    icon: '✎',
    bg: `${KATEGORI_BG}/ai-text-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    group: 'Text & skrivande',
  },
  {
    href: '/ai-video',
    title: 'AI för video',
    description: 'Kling, Runway, Pika, Sora — realistisk AI-video från text eller bild.',
    icon: '▶',
    bg: `${KATEGORI_BG}/ai-video-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-cyan-500 to-sky-700',
    group: 'Bild & video',
  },
  {
    href: '/ai-verktyg/ai-bild-verktyg',
    title: 'AI för bild',
    description: 'Midjourney, DALL·E, Firefly — bildgenerering för kreatörer.',
    icon: '◐',
    bg: `${KATEGORI_BG}/ai-bild-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-indigo-600 to-violet-800',
    group: 'Bild & video',
  },
  {
    href: '/ai-verktyg/ai-ljud-och-musik',
    title: 'AI för ljud & musik',
    description: 'Suno, ElevenLabs och andra verktyg för musik, röster och podcast.',
    icon: '♪',
    bg: `${KATEGORI_BG}/ai-ljud-musik-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
    group: 'Ljud & röst',
  },
  {
    href: '/ai-verktyg/ai-kod-verktyg',
    title: 'AI för kod',
    description: 'Cursor, Copilot, Windsurf — AI som faktiskt kan utveckla.',
    icon: '⌥',
    bg: `${KATEGORI_BG}/ai-kod-programmering-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-zinc-700 to-zinc-900',
    group: 'Kod & utveckling',
  },
  {
    href: '/ai-verktyg/ai-automation',
    title: 'AI-automation',
    description: 'Make, Zapier, n8n — koppla ihop allt med AI-driva flöden.',
    icon: '⇆',
    bg: `${KATEGORI_BG}/ai-automation-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-indigo-500 to-blue-700',
    group: 'Automation & agenter',
  },
  {
    href: '/ai-verktyg/foretag',
    title: 'AI för företag',
    description: 'B2B-användning per yrke: marknadsföring, ekonomi, sälj.',
    icon: '◧',
    bg: `${KATEGORI_BG}/ai-for-foretag-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-amber-600 to-rose-700',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/gratis',
    title: 'Gratis AI-verktyg',
    description: 'De bästa AI-verktygen utan kostnad — testade och rankade.',
    icon: '✦',
    bg: `${KATEGORI_BG}/gratis-ai-verktyg-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-fuchsia-600 to-rose-700',
    group: 'Gratis',
  },
  {
    href: '/ai-verktyg/hemsidebyggare',
    title: 'AI-hemsidebyggare',
    description: 'Framer, Wix, Webflow och fler — bygg hemsidan med AI utan kod.',
    icon: '🌐',
    bg: `${KATEGORI_BG}/ai-hemsidebyggare-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-sky-500 to-blue-700',
    group: 'Kod & utveckling',
  },
  {
    href: '/ai-verktyg/presentationer',
    title: 'AI-presentationer',
    description: 'Gamma, Beautiful.ai, Tome — proffsiga slides på minuter.',
    icon: '🖥️',
    bg: `${KATEGORI_BG}/ai-presentationer-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-orange-500 to-amber-700',
    group: 'Produktivitet & dokument',
  },
  {
    href: '/ai-verktyg/motesverktyg',
    title: 'AI-mötesverktyg',
    description: 'Otter, Fireflies, Fathom — transkribering och action points.',
    icon: '🎙️',
    bg: `${KATEGORI_BG}/ai-motesverktyg-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-teal-500 to-emerald-700',
    group: 'Produktivitet & dokument',
  },
  {
    href: '/ai-verktyg/sociala-medier',
    title: 'AI för sociala medier',
    description: 'Skapa och schemalägg innehåll med AI — Buffer, Hootsuite m.fl.',
    icon: '📱',
    bg: `${KATEGORI_BG}/ai-sociala-medier-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-pink-500 to-rose-700',
    group: 'Marknadsföring & sälj',
  },
  {
    href: '/ai-verktyg/projektledning',
    title: 'AI-projektledning',
    description: 'Asana, ClickUp, Monday — planering och prioritering med AI.',
    icon: '📋',
    bg: `${KATEGORI_BG}/ai-projektledning-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-indigo-500 to-violet-700',
    group: 'Produktivitet & dokument',
  },
  {
    href: '/ai-verktyg/e-handel',
    title: 'AI för e-handel',
    description: 'Shopify, Klaviyo, Tidio — konvertering och personalisering.',
    icon: '🛒',
    bg: `${KATEGORI_BG}/ai-ehandel-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
    group: 'Marknadsföring & sälj',
  },
  {
    href: '/ai-verktyg/oversattning',
    title: 'AI-översättning',
    description: 'DeepL, Phrase, Lokalise — översättning för företag och webb.',
    icon: '🌍',
    bg: `${KATEGORI_BG}/ai-oversattning-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-cyan-500 to-sky-700',
    group: 'Text & skrivande',
  },
  {
    href: '/ai-verktyg/dokumenthantering',
    title: 'AI-dokumenthantering',
    description: 'ChatPDF, Humata, Acrobat AI — läs och sammanfatta dokument.',
    icon: '📄',
    bg: `${KATEGORI_BG}/ai-dokumenthantering-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-zinc-600 to-zinc-800',
    group: 'Produktivitet & dokument',
  },
  {
    href: '/ai-verktyg/ai-assistenter',
    title: 'AI-assistenter',
    description: 'ChatGPT, Claude, Gemini, Perplexity — bästa AI-chatbotarna jämförda.',
    icon: '💬',
    bg: `${KATEGORI_BG}/ai-assistenter-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-indigo-500 to-blue-700',
    group: 'Text & skrivande',
  },
  {
    href: '/ai-verktyg/rost-och-tal',
    title: 'AI-röst & tal',
    description: 'ElevenLabs, Murf, Speechify — text till tal och röstsyntes på svenska.',
    icon: '🗣️',
    bg: `${KATEGORI_BG}/ai-rost-tal-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-rose-500 to-pink-700',
    group: 'Ljud & röst',
  },
  {
    href: '/ai-verktyg/podcast-ljudredigering',
    title: 'Podcast & ljudredigering',
    description: 'Descript, Adobe Podcast, Riverside — spela in och redigera med AI.',
    icon: '🎧',
    bg: `${KATEGORI_BG}/podcast-ljudredigering-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-violet-600 to-purple-800',
    group: 'Ljud & röst',
  },
  {
    href: '/ai-verktyg/produktivitet',
    title: 'AI-produktivitet',
    description: 'Notion, Reclaim, Motion — tidsplanering, anteckningar och fokus.',
    icon: '⚡',
    bg: `${KATEGORI_BG}/ai-produktivitet-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-amber-500 to-orange-700',
    group: 'Produktivitet & dokument',
  },
  {
    href: '/ai-verktyg/e-postmarknadsforing',
    title: 'AI e-postmarknadsföring',
    description: 'Mailchimp, Klaviyo, Instantly — skriv och optimera kampanjer med AI.',
    icon: '✉️',
    bg: `${KATEGORI_BG}/ai-epostmarknadsforing-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-teal-500 to-emerald-700',
    group: 'Marknadsföring & sälj',
  },
  {
    href: '/ai-verktyg/crm',
    title: 'AI-CRM',
    description: 'Salesforce, HubSpot, Pipedrive — AI för leads och kundrelationer.',
    icon: '🤝',
    bg: `${KATEGORI_BG}/ai-crm-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-sky-500 to-blue-700',
    group: 'Marknadsföring & sälj',
  },
  {
    href: '/ai-verktyg/dataanalys',
    title: 'AI-dataanalys',
    description: 'Power BI, Tableau, Julius — analysera data och bygg rapporter med AI.',
    icon: '📊',
    bg: `${KATEGORI_BG}/ai-dataanalys-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-fuchsia-600 to-rose-700',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/utbildning',
    title: 'AI för utbildning',
    description: 'Khan Academy, Duolingo, Quizlet — AI för lärare och elever.',
    icon: '🎓',
    bg: `${KATEGORI_BG}/ai-utbildning-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-emerald-500 to-green-700',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/ai-sakerhet',
    title: 'AI-säkerhet',
    description: 'CrowdStrike, Darktrace, Microsoft Security Copilot — AI mot cyberhot.',
    icon: '🛡',
    bg: 'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/2026/11/ai-sakerhet-hubb.webp',
    fallbackGradient: 'bg-gradient-to-br from-red-600 to-rose-900',
    group: 'Automation & agenter',
  },
  {
    href: '/ai-verktyg/ai-agenter',
    title: 'AI-agenter',
    description: 'Manus, Lindy, CrewAI, Devin — bygg och driv autonoma AI-agenter.',
    icon: '◎',
    bg: 'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/2026/11/ai-agenter-hubb.webp',
    fallbackGradient: 'bg-gradient-to-br from-indigo-600 to-violet-900',
    group: 'Automation & agenter',
  },
  {
    href: '/ai-verktyg/marknadsforing',
    title: 'AI-marknadsföring',
    description: 'ChatGPT, Jasper, Surfer SEO — AI för content och kampanjer.',
    icon: '📣',
    bg: `${KATEGORI_BG}/ai-marknadsforing-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-fuchsia-600 to-pink-900',
    group: 'Marknadsföring & sälj',
  },
  {
    href: '/ai-verktyg/juridik',
    title: 'AI för juridik',
    description: 'Harvey AI, Spellbook, Luminance — AI för advokater och jurister.',
    icon: '⚖',
    bg: null,
    fallbackGradient: 'bg-gradient-to-br from-slate-600 to-slate-900',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/kundservice',
    title: 'AI-kundservice',
    description: 'Intercom Fin, Zendesk AI, Tidio — AI för chattbottar och kundtjänst.',
    icon: '🎧',
    bg: `${KATEGORI_BG}/ai-kundservice-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-cyan-600 to-blue-900',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/rekrytering',
    title: 'AI för rekrytering',
    description: 'Workday, Greenhouse, Eightfold — AI för CV-screening och HR.',
    icon: '🧑‍💼',
    bg: `${KATEGORI_BG}/ai-rekrytering-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-amber-600 to-red-800',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/ui-ux',
    title: 'AI för UI/UX-design',
    description: 'Figma AI, Google Stitch, Uizard — från idé till gränssnitt med AI.',
    icon: '🎨',
    bg: `${KATEGORI_BG}/ai-ui-ux-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-violet-600 to-indigo-900',
    group: 'Bild & video',
  },
  {
    href: '/ai-verktyg/ekonomi',
    title: 'AI för ekonomi',
    description: 'Fortnox, Visma, Bokio — AI för bokföring och bokslut.',
    icon: '💰',
    bg: null,
    fallbackGradient: 'bg-gradient-to-br from-emerald-600 to-green-900',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/tiktok',
    title: 'AI för TikTok',
    description: 'Topplista och workflow för att skapa TikTok-videos snabbare med AI.',
    icon: '#',
    bg: `${KATEGORI_BG}/ai-tiktok-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-rose-600 to-fuchsia-900',
    group: 'Marknadsföring & sälj',
  },
  {
    href: '/ai-verktyg/ai-trading',
    title: 'AI för trading',
    description: 'TradingView, 3Commas, Cryptohopper — AI för aktie- och kryptohandel.',
    icon: '📈',
    bg: `${KATEGORI_BG}/ai-trading-kategori.webp`,
    fallbackGradient: 'bg-gradient-to-br from-purple-700 to-pink-900',
    group: 'Yrke & bransch',
  },
  {
    href: '/ai-verktyg/ai-humaniserare',
    title: 'AI-humaniserare',
    description: 'Undetectable AI, StealthGPT, WriteHuman — få AI-text att låta mänsklig.',
    icon: '✒',
    bg: null,
    fallbackGradient: 'bg-gradient-to-br from-slate-700 to-indigo-900',
    group: 'Text & skrivande',
  },
];

/** Ordning på snabbfilter-chipsen — matchar grupperna ovan. */
const CATEGORY_GROUPS = [
  'Text & skrivande',
  'Bild & video',
  'Ljud & röst',
  'Kod & utveckling',
  'Automation & agenter',
  'Marknadsföring & sälj',
  'Produktivitet & dokument',
  'Yrke & bransch',
  'Gratis',
];

/** Snabb-taggar i hero-sökrutan — länkar rakt till de mest sökta
 *  verktygen/kategorierna. Rent navigations-UI, ingen egen data. */
const POPULAR_TAGS: { label: string; href: string }[] = [
  { label: 'ChatGPT', href: '/ai-verktyg/chatgpt' },
  { label: 'Midjourney', href: '/ai-verktyg/midjourney' },
  { label: 'Gratis AI', href: '/ai-verktyg/gratis' },
  { label: 'Claude', href: '/ai-verktyg/claude' },
];

function Hero({ article: a }: { article: Article }) {
  const updatedIso = contentModifiedIso(a) ?? a.published_at ?? null;
  const updatedLabel = updatedIso ? formatSvDate(updatedIso) : null;
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 text-white">
      {/* Rent dekorativa, suddiga färgklumpar — ingen bild behövs, håller
          sidan snabb och ger samma "produkt"-djup som referensmockupen. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-white/60"
        >
          <Link href="/" className="hover:text-white">Hem</Link>
          <span className="mx-2 text-white/30">›</span>
          <span className="text-white/80">AI-verktyg</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
          <span aria-hidden>✦</span> {MASTER_HUB_TOOL_COUNT} verktyg · {CATEGORIES.length} kategorier
          {updatedLabel ? ` · Uppdaterad ${updatedLabel}` : ` · ${new Date().getFullYear()}`}
        </span>

        <h1 className="mt-6 max-w-4xl text-balance break-words text-2xl font-black uppercase leading-[1.02] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          {a.title}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-white/70 sm:text-xl">
            {a.excerpt}
          </p>
        )}

        <form action="/sok/" method="GET" className="mt-8 max-w-xl">
          <label className="relative block">
            <span className="sr-only">Sök bland AI-verktyg</span>
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
            />
            <input
              type="search"
              name="q"
              placeholder="Vad letar du efter för verktyg?"
              className="w-full rounded-xl border border-white/15 bg-white/10 py-4 pl-12 pr-14 text-base text-white placeholder:text-white/50 shadow-sm backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              aria-label="Sök"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white text-indigo-700 transition-colors hover:bg-white/90"
            >
              <ArrowRight className="h-5 w-5" aria-hidden />
            </button>
          </label>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-white/60">Populärt:</span>
          {POPULAR_TAGS.map((t) => (
            <Link
              key={t.href}
              href={to(t.href)}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium text-white/85 transition-colors hover:border-white/30 hover:bg-white/15"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

/** De sex största "vad vill du göra"-grupperna, lyfta ur CATEGORIES till
 *  egna framhävda kort direkt under hero — samma produkt-känsla som
 *  startsidans ExploreCategoriesSection men med exempel-verktyg i brödtexten
 *  istället för bara en bakgrundsbild. */
type TopGroup = {
  title: string;
  examples: string;
  href: string;
  icon: LucideIcon;
  tint: string;
  iconBg: string;
};

const TOP_GROUPS: TopGroup[] = [
  {
    title: 'Text & skrivande',
    examples: 'ChatGPT, Claude, Jasper',
    href: '/ai-verktyg/ai-text-verktyg',
    icon: Type,
    tint: 'bg-indigo-50 hover:bg-indigo-100',
    iconBg: 'bg-indigo-600',
  },
  {
    title: 'Bild & design',
    examples: 'Midjourney, Firefly, DALL·E',
    href: '/ai-verktyg/ai-bild-verktyg',
    icon: ImageIcon,
    tint: 'bg-pink-50 hover:bg-pink-100',
    iconBg: 'bg-pink-600',
  },
  {
    title: 'Video',
    examples: 'Kling, Runway, Sora',
    href: '/ai-video',
    icon: Video,
    tint: 'bg-emerald-50 hover:bg-emerald-100',
    iconBg: 'bg-emerald-600',
  },
  {
    title: 'Kod & utveckling',
    examples: 'Cursor, Copilot, Windsurf',
    href: '/ai-verktyg/ai-kod-verktyg',
    icon: Code2,
    tint: 'bg-orange-50 hover:bg-orange-100',
    iconBg: 'bg-orange-600',
  },
  {
    title: 'Ljud & musik',
    examples: 'Suno, ElevenLabs, Udio',
    href: '/ai-verktyg/ai-ljud-och-musik',
    icon: Music,
    tint: 'bg-fuchsia-50 hover:bg-fuchsia-100',
    iconBg: 'bg-fuchsia-600',
  },
  {
    title: 'Automation',
    examples: 'Make, Zapier, n8n',
    href: '/ai-verktyg/ai-automation',
    icon: Workflow,
    tint: 'bg-blue-50 hover:bg-blue-100',
    iconBg: 'bg-blue-600',
  },
];

function TopGroupsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <h2 className="mb-1 text-2xl font-black tracking-tight text-fg sm:text-3xl">
        Vad vill du använda AI till?
      </h2>
      <p className="mb-8 text-fg-subtle">Utforska våra huvudkategorier och hitta rätt verktyg för ditt behov.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOP_GROUPS.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.href}
              href={to(g.href)}
              className={`group flex items-start justify-between gap-3 rounded-2xl p-6 transition-colors ${g.tint}`}
            >
              <div className="flex items-start gap-4">
                <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${g.iconBg}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <div className="font-bold tracking-tight text-fg">{g.title}</div>
                  <div className="mt-0.5 text-sm text-fg-subtle">{g.examples}</div>
                </div>
              </div>
              <ArrowRight
                aria-hidden
                className="mt-1 h-5 w-5 shrink-0 text-fg-faint transition-transform group-hover:translate-x-1 group-hover:text-fg-muted"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Kompakt lista över resterande kategorier (allt som inte redan syns i
 *  TOP_GROUPS) — tre spalter, ikon + namn + pil. "Visa alla"-länken hoppar
 *  till den fullständiga, sökbara kategorigriden längre ner (CategoryGrid). */
const TOP_GROUP_HREFS = new Set(TOP_GROUPS.map((g) => to(g.href)));

function MoreCategoriesSection() {
  const rest = CATEGORIES.filter((c) => !TOP_GROUP_HREFS.has(to(c.href)));
  const shown = rest.slice(0, 8);
  const overflow = rest.length - shown.length;

  return (
    <section className="border-t border-line bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-black tracking-tight text-fg sm:text-3xl">
            Fler verktygskategorier
          </h2>
          <a href="#alla-kategorier" className="whitespace-nowrap font-semibold text-indigo-600 hover:underline">
            Visa alla {CATEGORIES.length} →
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <Link
              key={c.href}
              href={to(c.href)}
              className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-indigo-300"
            >
              <span className="flex items-center gap-3">
                <span aria-hidden className="text-lg">{c.icon}</span>
                <span className="font-semibold text-fg">{c.title}</span>
              </span>
              <ChevronRight
                aria-hidden
                className="h-4 w-4 shrink-0 text-fg-faint transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-600"
              />
            </Link>
          ))}
          {overflow > 0 && (
            <a
              href="#alla-kategorier"
              className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-line px-5 py-4 font-semibold text-fg-subtle transition-colors hover:border-indigo-300 hover:text-indigo-600"
            >
              och {overflow} till…
              <ChevronRight aria-hidden className="h-4 w-4 shrink-0" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section id="alla-kategorier" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Välj kategori
      </div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
          Alla AI-verktyg
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          ⓘ Klicka in på en kategori för topplistan
        </span>
      </div>

      {/* Sökfält + grupp-chips + live-filtrerade kort (klient-side; alla kort
          stannar i DOM för SEO, icke-träffar döljs bara med CSS). Samma
          sökruta filtrerar även yrkes-grided längre ner på sidan, så
          kategorier och yrken känns som en produkt istället för två
          separata sök-sektioner. */}
      <MasterHubDiscovery categories={CATEGORIES} groups={CATEGORY_GROUPS} yrken={YRKEN} />
    </section>
  );
}

function EditorialBody({ html }: { html: string | null }) {
  if (!html) return null;
  const clean = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return (
    <section
      aria-labelledby="editorial"
      className="mx-auto max-w-3xl px-4 pb-20 sm:px-6"
    >
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Redaktionell översikt
      </div>
      <h2
        id="editorial"
        className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl"
      >
        Så väljer du rätt AI-verktyg
      </h2>
      <div className="magazine-prose">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg prose-headings:break-words prose-headings:[overflow-wrap:anywhere]
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-4
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-xl prose-h3:font-bold
            prose-p:text-fg-muted prose-p:leading-[1.85] prose-p:text-[17px]
            prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-hr:my-12 prose-hr:border-line
            prose-img:rounded-xl prose-img:border prose-img:border-line
          "
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
