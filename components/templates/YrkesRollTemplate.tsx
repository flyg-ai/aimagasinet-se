import Link from 'next/link';
import type { Article } from '@/lib/supabase';

/** Template for depth-4 yrkesroll-pages under /ai-verktyg/foretag/yrke/.
 *  This is the discovery layer above the topic hubs (depth 5) — gives
 *  marknadsförare / ekonomer a "vad vill du göra?"-overview rather than
 *  another topplista. The actual rated topplistor live one level down. */
export function YrkesRollTemplate({
  article: a,
  spec,
}: {
  article: Article;
  spec: YrkesRollSpec;
}) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} subcategoryCount={spec.subcategories.length} />
      <SubcategoryGrid subcategories={spec.subcategories} />
      <TopPicks picks={spec.topPicks} />
      <EditorialBody html={a.content_mdx} />
    </article>
  );
}

/* ─── Spec ─────────────────────────────────────────────────────── */

export type YrkesRollSubcategory = {
  title: string;
  description: string;
  href: string;
  icon: string;
  accent: string; // tailwind bg + text classes for the icon chip
};

export type YrkesRollTopPick = {
  label: string;   // "Bäst för SEO"
  brand: string;   // "ChatGPT"
  href: string;    // → subcategory hub
};

export type YrkesRollSpec = {
  subcategories: YrkesRollSubcategory[];
  topPicks: YrkesRollTopPick[];
};

const SPEC_BY_SLUG: Record<string, YrkesRollSpec> = {
  marknadsforing: {
    subcategories: [
      {
        title: 'SEO',
        description: 'Keyword-research, content-briefs och on-page-optimering med AI.',
        href: '/ai-verktyg/foretag/yrke/marknadsforing/seo',
        icon: '⌕',
        accent: 'bg-emerald-100 text-emerald-700',
      },
      {
        title: 'Content & Copywriting',
        description: 'AI-skribenter och brand voice för all marknadsföringscopy.',
        href: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting',
        icon: '✎',
        accent: 'bg-amber-100 text-amber-700',
      },
      {
        title: 'Annonser',
        description: 'Kreativ AI och performance-optimering för Meta, Google och TikTok.',
        href: '/ai-verktyg/foretag/yrke/marknadsforing/annonser',
        icon: '★',
        accent: 'bg-violet-100 text-violet-700',
      },
      {
        title: 'Sociala Medier',
        description: 'Schemaläggning, captions och visuell content för alla plattformar.',
        href: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier',
        icon: '♥',
        accent: 'bg-rose-100 text-rose-700',
      },
    ],
    topPicks: [
      { label: 'Bäst för SEO',                 brand: 'ChatGPT',        href: '/ai-verktyg/foretag/yrke/marknadsforing/seo' },
      { label: 'Bäst för Content & Copywriting', brand: 'Claude',       href: '/ai-verktyg/foretag/yrke/marknadsforing/content-copywriting' },
      { label: 'Bäst för Annonser',            brand: 'AdCreative.ai',  href: '/ai-verktyg/foretag/yrke/marknadsforing/annonser' },
      { label: 'Bäst för Sociala Medier',      brand: 'Hootsuite',      href: '/ai-verktyg/foretag/yrke/marknadsforing/sociala-medier' },
      { label: 'Bäst för Design & Bild',       brand: 'Adobe Firefly',  href: '/ai-verktyg/ai-bild-verktyg' },
    ],
  },
  'ekonomi-redovisning': {
    subcategories: [
      {
        title: 'Bokföring',
        description: 'Automatiserad bokföring med AI för kvitton, fakturor och avstämning.',
        href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing',
        icon: '◧',
        accent: 'bg-emerald-100 text-emerald-700',
      },
      {
        title: 'Redovisning',
        description: 'AI för månadsbokslut, årsredovisning och revisionsarbete.',
        href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning',
        icon: '▦',
        accent: 'bg-sky-100 text-sky-700',
      },
    ],
    topPicks: [
      { label: 'Bäst för bokföring',         brand: 'Fortnox',           href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing' },
      { label: 'Bäst för redovisning',       brand: 'Fortnox Redovisning', href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning' },
      { label: 'Bäst för utlägg & kort',     brand: 'Pleo',              href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/bokforing' },
      { label: 'Bäst för moln-redovisning',  brand: 'Xero',              href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning' },
      { label: 'Bäst för audit & Big4',      brand: 'KPMG Clara',        href: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/redovisning' },
    ],
  },
};

/** Returns the spec for the given hub slug, if any. Use this from the route
 *  to gate the template. */
export function getYrkesRollSpec(slug: string): YrkesRollSpec | null {
  return SPEC_BY_SLUG[slug] ?? null;
}

export function isYrkesRollSlug(slug: string): boolean {
  return slug in SPEC_BY_SLUG;
}

/* ─── Sections ────────────────────────────────────────────────── */

function Hero({ article: a, subcategoryCount }: { article: Article; subcategoryCount: number }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-indigo-600">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <Link href="/ai-verktyg" className="hover:text-indigo-600">AI-verktyg</Link>
          <span className="mx-2 text-line-strong">›</span>
          <Link href="/ai-verktyg/foretag" className="hover:text-indigo-600">För företag</Link>
          <span className="mx-2 text-line-strong">›</span>
          <Link href="/ai-verktyg/foretag/yrke" className="hover:text-indigo-600">Per yrke</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">{cleanTitle(a.title)}</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✦</span> {subcategoryCount} områden · {new Date().getFullYear()}
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-7xl">
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

function SubcategoryGrid({ subcategories }: { subcategories: YrkesRollSubcategory[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Snabbval
      </div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Vad vill du göra?
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          ⓘ Välj område för topplista
        </span>
      </div>

      <div className={subcategories.length >= 4 ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4' : 'grid gap-5 sm:grid-cols-2'}>
        {subcategories.map((s) => (
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
            <h3 className="text-xl font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed text-fg-subtle">{s.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Utforska <span aria-hidden>›</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TopPicks({ picks }: { picks: YrkesRollTopPick[] }) {
  return (
    <section
      aria-labelledby="top-picks"
      className="border-y border-line bg-muted"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Översikt
        </div>
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2
            id="top-picks"
            className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl"
          >
            Topp {picks.length} verktyg som täcker bredden
          </h2>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
            ⓘ En per användningsområde
          </span>
        </div>

        <ul className="overflow-hidden rounded-xl border border-line bg-card divide-y divide-line">
          {picks.map((p) => (
            <li key={p.label}>
              <Link
                href={p.href}
                className="group flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-soft sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                  <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-fg-subtle sm:min-w-[12rem]">
                    {p.label}
                  </span>
                  <span className="truncate text-lg font-black uppercase tracking-tight text-fg group-hover:text-indigo-600 sm:text-xl">
                    {p.brand}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600"
                >
                  Utforska <span>›</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
    <section
      aria-labelledby="editorial"
      className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Guide
      </div>
      <h2
        id="editorial"
        className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl"
      >
        Så använder du AI i din vardag
      </h2>
      <div className="magazine-prose">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
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

/** Strip WP "AI För X — long marketing string" prefixes for the breadcrumb. */
function cleanTitle(title: string): string {
  return title.split(/\s+[–—-]\s+|:\s+/)[0].trim();
}
