import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import { ForetagYrkeSearch, type YrkeLink } from '@/components/ForetagYrkeSearch';

/** B2B entry page for /ai-verktyg/foretag. A navigation hub that points down
 *  two ways: a category grid (by area) and a searchable yrke grid (by role).
 *  The existing editorial SEO body (content_mdx) renders below the grids. */

type CategoryCard = { title: string; href: string; desc: string; icon: string };

const CATEGORIES: CategoryCard[] = [
  { title: 'Ekonomi & bokföring', href: '/ai-verktyg/ekonomi/', icon: '📊', desc: 'Bokföring, avstämning, bokslut och redovisning.' },
  { title: 'Marknadsföring', href: '/ai-verktyg/marknadsforing/', icon: '📣', desc: 'Content, SEO, annonser och sociala medier.' },
  { title: 'Juridik & avtal', href: '/ai-verktyg/juridik/', icon: '⚖️', desc: 'Avtalsgranskning, due diligence och rättsutredning.' },
  { title: 'Kundservice', href: '/ai-verktyg/kundservice/', icon: '💬', desc: 'Chatbottar, e-postsvar och röst-AI.' },
  { title: 'Rekrytering & HR', href: '/ai-verktyg/rekrytering/', icon: '🧑‍💼', desc: 'CV-screening, jobbannonser och kandidatmatchning.' },
  { title: 'CRM', href: '/ai-verktyg/crm/', icon: '🤝', desc: 'Leads, lead scoring, prognoser och automation.' },
  { title: 'Projektledning', href: '/ai-verktyg/projektledning/', icon: '🗂️', desc: 'Planering, uppgifter och automatiserade flöden.' },
  { title: 'Sociala medier', href: '/ai-verktyg/sociala-medier/', icon: '📱', desc: 'Schemaläggning, content och analys.' },
];

const YRKEN: YrkeLink[] = [
  { label: 'Lärare/pedagog', href: '/ai-verktyg/utbildning/larare/', kw: 'lärare pedagog skola utbildning undervisning' },
  { label: 'Advokat/jurist', href: '/ai-verktyg/juridik/advokat/', kw: 'advokat jurist juridik avtal' },
  { label: 'Revisor', href: '/ai-verktyg/ekonomi/revisor/', kw: 'revisor revision ekonomi' },
  { label: 'Bokförare', href: '/ai-verktyg/ekonomi/bokforare/', kw: 'bokförare bokföring ekonomi' },
  { label: 'Marknadsförare', href: '/ai-verktyg/marknadsforing/marknadsforing-yrke/', kw: 'marknadsförare marknadsföring content seo annonser' },
  { label: 'Säljare', href: '/ai-verktyg/crm/saljare/', kw: 'säljare försäljning sälj crm account' },
  { label: 'HR-ansvarig', href: '/ai-verktyg/rekrytering/hr/', kw: 'hr personal medarbetare human resources' },
  { label: 'Fotograf', href: '/ai-verktyg/foretag/yrke/fotograf-video/', kw: 'fotograf video foto bild film' },
  { label: 'Designer', href: '/ai-verktyg/foretag/yrke/designer/', kw: 'designer design grafik ui ux' },
  { label: 'Utvecklare', href: '/ai-verktyg/ai-kod-verktyg/utvecklare/', kw: 'utvecklare programmerare kod developer engineer' },
  { label: 'Kundtjänstmedarbetare', href: '/ai-verktyg/kundservice/kundtjanst-yrke/', kw: 'kundtjänst kundservice support' },
  { label: 'Rekryterare', href: '/ai-verktyg/rekrytering/rekryterare/', kw: 'rekryterare rekrytering talent sourcing' },
];

export function ForetagHubTemplate({ article: a }: { article: Article }) {
  return (
    <article className="bg-page text-fg">
      <Hero />
      <CategoryGrid />
      <ForetagYrkeSearch yrken={YRKEN} />
      <EditorialBody html={a.content_mdx} />
    </article>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-slate-100 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-sky-700">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <Link href="/ai-verktyg" className="hover:text-sky-700">AI-verktyg</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">För företag</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-800">
          <span aria-hidden>◧</span> B2B · {CATEGORIES.length} kategorier · {YRKEN.length} yrken
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          AI för företag 2026
        </h1>

        <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-fg-subtle">
          Hitta rätt AI-verktyg för din verksamhet — sökbart efter både kategori och
          yrkesroll. Vi testar och rankar AI för svenska företag, från bokföring och
          juridik till marknadsföring, försäljning och kundservice.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          <span className="inline-flex items-center gap-2"><span aria-hidden className="text-sky-700">◧</span> För nordiska företag</span>
          <span className="inline-flex items-center gap-2"><span aria-hidden className="text-fg-faint">⊙</span> Oberoende test</span>
          <span className="inline-flex items-center gap-2"><span aria-hidden className="text-fg-faint">⚙</span> GDPR-fokus</span>
        </div>
      </div>
    </header>
  );
}

function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-16">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-700">
        Hitta verktyg efter kategori
      </div>
      <h2 className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        Verktyg efter kategori
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col rounded-xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-xl"
          >
            <span
              aria-hidden
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-2xl"
            >
              {c.icon}
            </span>
            <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-fg group-hover:text-sky-700">
              {c.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-subtle">{c.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-600">
              Utforska <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        ))}
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
      className="mx-auto max-w-3xl px-4 pb-20 pt-4 sm:px-6"
    >
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-sky-700">
        Redaktionell analys
      </div>
      <h2
        id="editorial"
        className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl"
      >
        AI i svenska B2B-flöden
      </h2>
      <div className="magazine-prose">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg prose-headings:break-words prose-headings:[overflow-wrap:anywhere]
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-sky-500 prose-h2:pl-4
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-xl prose-h3:font-bold
            prose-p:text-fg-muted prose-p:leading-[1.85] prose-p:text-[17px]
            prose-a:text-sky-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-sky-500
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-sky-300 prose-blockquote:bg-sky-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-hr:my-12 prose-hr:border-line
            prose-img:rounded-xl prose-img:border prose-img:border-line
          "
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
