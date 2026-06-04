import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schemas';
import { resolveToolProfile } from '@/components/templates/ReviewTemplate';

/** Navigeringshub för /ai-verktyg/gratis. Hero + subkategori-grid (4) +
 *  "Bäst gratis overall" (5) + redaktionell guide från content_mdx.
 *  Modellerad på YrkesRollTemplate så den matchar övriga hubbar i kvalitet. */
export function GratisHubTemplate({ article: a }: { article: Article }) {
  const breadcrumbLd = breadcrumbSchema([
    { label: 'Hem', href: '/' },
    { label: 'AI-verktyg', href: '/ai-verktyg' },
    { label: 'Gratis', href: '/ai-verktyg/gratis' },
  ]);

  return (
    <article className="bg-page text-fg">
      <JsonLd data={breadcrumbLd} />
      <Hero article={a} />
      <SubcategoryGrid />
      <TopPicks />
      <EditorialBody html={a.content_mdx} />
    </article>
  );
}

/* ─── Data ─────────────────────────────────────────────────────── */

type Subcategory = { title: string; description: string; href: string; icon: string; accent: string };

const SUBCATEGORIES: Subcategory[] = [
  {
    title: 'AI-text gratis',
    description: 'ChatGPT, Claude och Gemini — jämför vad du faktiskt får gratis och var gränserna går.',
    href: '/ai-verktyg/gratis/ai-text',
    icon: '✎',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'AI-bilder gratis',
    description: 'Bing Image Creator, Leonardo, Playground, Canva och Firefly — gratis bildgenerering.',
    href: '/ai-verktyg/gratis/ai-bilder',
    icon: '◐',
    accent: 'bg-violet-100 text-violet-700',
  },
  {
    title: 'AI-video gratis',
    description: 'Pika Labs, Kling AI, Runway och CapCut — skapa AI-video utan att betala.',
    href: '/ai-verktyg/gratis/ai-video',
    icon: '▶',
    accent: 'bg-cyan-100 text-cyan-700',
  },
  {
    title: 'AI-kod gratis',
    description: 'GitHub Copilot, Codeium, Cursor och Replit — gratis AI för utvecklare.',
    href: '/ai-verktyg/gratis/ai-kod',
    icon: '⌥',
    accent: 'bg-amber-100 text-amber-700',
  },
];

type Pick = { name: string; key: string; href: string; free: string };

const TOP_PICKS: Pick[] = [
  { name: 'ChatGPT',        key: 'chatgpt',        href: '/ai-verktyg/chatgpt',        free: 'Obegränsad bas-chat, bild & röst i gratisläget' },
  { name: 'Claude',         key: 'claude',         href: '/ai-verktyg/claude',         free: 'Claude Sonnet gratis — bäst skrivkvalitet av de fria' },
  { name: 'Gemini',         key: 'gemini',         href: '/ai-verktyg/gemini',         free: '2.5 Flash med generös kvot + Google-integration' },
  { name: 'Canva AI',       key: 'canva-ai',       href: '/ai-verktyg/canva-ai',       free: 'Magic Studio gratis — design och bild utan kostnad' },
  { name: 'GitHub Copilot', key: 'github-copilot', href: '/ai-verktyg/github-copilot', free: 'Gratis för studenter och open source-utvecklare' },
];

/* ─── Sections ─────────────────────────────────────────────────── */

function Hero({ article: a }: { article: Article }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-emerald-50 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-indigo-600">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <Link href="/ai-verktyg" className="hover:text-indigo-600">AI-verktyg</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">Gratis</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          <span aria-hidden>✦</span> 100% gratis · {new Date().getFullYear()}
        </span>

        <h1 className="mt-6 max-w-4xl text-balance break-words text-2xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
          {a.title}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            {a.excerpt}
          </p>
        )}
      </div>
    </header>
  );
}

function SubcategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Kategorier
      </div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
          Gratis AI per område
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          ⓘ Välj område för full jämförelse
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SUBCATEGORIES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col gap-4 rounded-xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <span
              aria-hidden
              className={`inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${s.accent}`}
            >
              {s.icon}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-fg break-words group-hover:text-indigo-600">
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed text-fg-subtle">{s.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Jämför gratis <span aria-hidden>›</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TopPicks() {
  return (
    <section aria-labelledby="top-picks" className="border-y border-line bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Redaktionens val
        </div>
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2
            id="top-picks"
            className="text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl"
          >
            Bäst gratis overall
          </h2>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
            ⓘ De fem starkaste gratisverktygen
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TOP_PICKS.map((p) => {
            const profile = resolveToolProfile(p.key, p.name);
            return (
              <Link
                key={p.key}
                href={p.href}
                className="group flex flex-col gap-3 rounded-xl border border-line bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span
                    aria-hidden
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-base font-black uppercase text-white ring-2 ring-white/40 ${profile.logo}`}
                  >
                    {p.name.charAt(0)}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Gratis
                  </span>
                </div>
                <div className="text-lg font-black tracking-tight text-fg break-words group-hover:text-indigo-600">
                  {p.name}
                </div>
                <p className="text-sm leading-relaxed text-fg-muted">{p.free}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Läs recension <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EditorialBody({ html }: { html: string | null }) {
  if (!html) return null;
  const clean = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return (
    <section aria-labelledby="guide" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Guide
      </div>
      <h2
        id="guide"
        className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl"
      >
        Allt om gratis AI-verktyg
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
            prose-table:block prose-table:overflow-x-auto prose-table:text-sm
            prose-th:bg-soft prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-bold prose-th:text-fg
            prose-td:px-3 prose-td:py-2 prose-td:align-top
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-hr:my-12 prose-hr:border-line
          "
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
