import Link from 'next/link';
import type { Article } from '@/lib/supabase';

/** Hardcoded profession deeplinks. Add more here as sub-pages get published. */
const YRKEN: { slug: string; title: string; icon: string; description: string }[] = [
  {
    slug: 'marknadsforing',
    title: 'Marknadsföring',
    icon: '📣',
    description: 'AI för kampanjplanering, copy och kanalstrategi — verktygen som ger marknadsteam mest hävstång.',
  },
  {
    slug: 'seo',
    title: 'SEO',
    icon: '🔍',
    description: 'Sökordsanalys, contentbriefs, on-page-optimering och länkbyggande automatiserat med AI.',
  },
  {
    slug: 'content-copywriting',
    title: 'Content & Copywriting',
    icon: '✍️',
    description: 'Bloggar, landningssidor, sociala medier och e-post — bäst-i-test för svensk text.',
  },
  {
    slug: 'annonser',
    title: 'Annonser',
    icon: '🎯',
    description: 'Google Ads, Meta, LinkedIn — AI som skriver rubriker, brödtext och tester variationer.',
  },
  {
    slug: 'bokforing',
    title: 'Bokföring',
    icon: '📊',
    description: 'AI-assisterad bokföring, kvittohantering och rapportering för småföretagare och soloentreprenörer.',
  },
  {
    slug: 'redovisning',
    title: 'Redovisning',
    icon: '🧾',
    description: 'Verktyg för redovisningskonsulter — automatisk klassificering, avstämning och årsbokslut.',
  },
  {
    slug: 'kundservice',
    title: 'Kundservice',
    icon: '💬',
    description: 'Chatbottar, e-postsvar och röst-AI som tar undan repetitiva ärenden från supportteamet.',
  },
  {
    slug: 'rekrytering',
    title: 'Rekrytering & HR',
    icon: '👥',
    description: 'CV-screening, jobbannonser och kandidat-matching — verktyg för moderna talent-team.',
  },
  {
    slug: 'juridik',
    title: 'Juridik',
    icon: '⚖️',
    description: 'Avtalsgranskning, due diligence och rättsutredningar med AI som klarar svensk juridisk text.',
  },
];

function buildCrumbs(path: string): { label: string; href: string }[] {
  const parts = path.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Hem', href: '/' }];
  let acc = '';
  for (const p of parts) {
    acc += '/' + p;
    crumbs.push({ label: decodeURIComponent(p), href: acc });
  }
  return crumbs;
}

export function YrkesHubTemplate({ article: a }: { article: Article }) {
  const crumbs = buildCrumbs(a.path);

  return (
    <article className="bg-muted text-fg">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
          {/* Breadcrumb */}
          <nav aria-label="Brödsmulor" className="mb-7 flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="text-fg-faint">›</span>}
                {i === crumbs.length - 1 ? (
                  <span className="text-fg-muted">{c.label}</span>
                ) : (
                  <Link href={c.href} className="hover:text-indigo-600">{c.label}</Link>
                )}
              </span>
            ))}
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>✦</span>
            AI för företag · efter yrke
          </span>

          <h1 className="mt-5 text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
            {a.title || 'AI-verktyg efter yrke'}
          </h1>

          {a.excerpt && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-subtle">
              {a.excerpt}
            </p>
          )}

          {/* Search field (visual, ingen submit-logik ännu) */}
          <div className="mt-8 max-w-2xl">
            <label className="relative block">
              <span className="sr-only">Sök efter yrke</span>
              <span aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Sök efter ditt yrke eller område..."
                className="w-full rounded-full border border-line bg-card py-3.5 pl-12 pr-4 text-base text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <p className="mt-2 px-4 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
              {YRKEN.length} yrken · fler tillkommer löpande
            </p>
          </div>
        </div>
      </header>

      {/* ── Yrkes-grid ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Bläddra
        </div>
        <h2 className="mb-8 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Välj yrke eller område
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {YRKEN.map((y) => (
            <Link
              key={y.slug}
              href={`${a.path.replace(/\/$/, '')}/${y.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-line bg-card p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <span
                aria-hidden
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl text-indigo-700"
              >
                {y.icon}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
                {y.title}
              </h3>
              <p className="text-sm leading-relaxed text-fg-subtle">{y.description}</p>
              <span className="mt-auto pt-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
                Utforska →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Coming soon footer ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-dashed border-line bg-card/50 px-6 py-8 text-center">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fg-subtle">
            Snart fler
          </div>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg">
            Fler yrken på väg
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-fg-subtle">
            Vi publicerar nya yrkes-guider varje månad. Tipsa om ditt yrke i nyhetsbrevet
            så prioriterar vi det i nästa omgång.
          </p>
        </div>
      </section>
    </article>
  );
}
