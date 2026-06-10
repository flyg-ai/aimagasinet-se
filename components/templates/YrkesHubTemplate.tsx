import Link from 'next/link';
import { to } from '@/lib/links';
import type { Article } from '@/lib/supabase';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schemas';
import { YrkesNavSearch, type YrkeNavItem } from '@/components/YrkesNavSearch';

/** Top-level yrkesroller. De fem migrerade yrkena pekar på sina kanoniska
 *  hubbar /ai-verktyg/{hub}; designer och fotograf-video ligger kvar under
 *  /ai-verktyg/foretag/yrke/* tills de migreras. */
const YRKEN: YrkeNavItem[] = [
  {
    slug: 'marknadsforing',
    title: 'Marknadsföring',
    href: '/ai-verktyg/marknadsforing',
    icon: '📣',
    description: 'AI för SEO, content, annonser och sociala medier — verktygen som ger marknadsteam mest hävstång.',
    keywords: 'seo content copywriting annonser sociala medier reklam',
  },
  {
    slug: 'ekonomi-redovisning',
    title: 'Ekonomi & Redovisning',
    href: '/ai-verktyg/ekonomi',
    icon: '📊',
    description: 'AI för bokföring, redovisning och bokslut — för småföretagare, byråer och controllers.',
    keywords: 'bokföring redovisning bokslut fortnox visma ekonomi controller',
  },
  {
    slug: 'kundservice',
    title: 'Kundservice',
    href: '/ai-verktyg/kundservice',
    icon: '💬',
    description: 'Chatbottar, e-postsvar och röst-AI som tar undan repetitiva ärenden från supportteamet.',
    keywords: 'chatbot support e-post röst voicebot kundtjänst',
  },
  {
    slug: 'rekrytering',
    title: 'Rekrytering & HR',
    href: '/ai-verktyg/rekrytering',
    icon: '👥',
    description: 'CV-screening, jobbannonser och kandidatmatchning — verktyg för moderna talent-team.',
    keywords: 'cv screening jobbannonser kandidatmatchning hr talent recruiting',
  },
  {
    slug: 'juridik',
    title: 'Juridik',
    href: '/ai-verktyg/juridik',
    icon: '⚖️',
    description: 'Avtalsgranskning, due diligence och rättsutredningar med AI som klarar svensk juridisk text.',
    keywords: 'avtal due diligence rättsutredning jurist advokat legal',
  },
  {
    slug: 'designer',
    title: 'Designer',
    href: '/ai-verktyg/foretag/yrke/designer',
    icon: '🎨',
    description: 'Grafisk design, UI/UX, bildgenerering och kort-video — AI-verktyg som lyfter designers från idé till leverans.',
    keywords: 'grafisk design ui ux bildgenerering logotyp',
  },
  {
    slug: 'fotograf-video',
    title: 'Fotograf & Videoskapare',
    href: '/ai-verktyg/foretag/yrke/fotograf-video',
    icon: '📸',
    description: 'Bildredigering, videoklippning, foto-AI och ljudsättning — för fotografer och creators som vill öka tempot.',
    keywords: 'foto bildredigering videoklippning ljudsättning retusch',
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
  const breadcrumbLd = crumbs.length > 0
    ? breadcrumbSchema([...crumbs, { label: a.title, href: a.path }])
    : null;

  return (
    <article className="bg-muted text-fg">
      {breadcrumbLd && <JsonLd data={breadcrumbLd} />}
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
                  <Link href={to(c.href)} className="hover:text-indigo-600">{c.label}</Link>
                )}
              </span>
            ))}
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>✦</span>
            AI för företag · efter yrke
          </span>

          <h1 className="mt-5 text-balance text-4xl font-black uppercase leading-[1.05] tracking-tight text-fg break-words sm:text-5xl lg:text-6xl">
            {a.title || 'AI-verktyg efter yrke'}
          </h1>

          {a.excerpt && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-subtle">
              {a.excerpt}
            </p>
          )}
        </div>
      </header>

      {/* ── SEO-intro ───────────────────────────────────────────── */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
            Så hjälper AI ditt yrke
          </div>
          <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
            AI som faktiskt effektiviserar jobbet
          </h2>
          <div className="space-y-4 text-[17px] leading-[1.75] text-fg-muted">
            <p>
              AI förändrar hur svenska företag arbetar — från marknadsföring och
              ekonomi till kundservice, rekrytering och juridik. Genom att
              automatisera repetitiva uppgifter, accelerera analysarbete och
              förbättra beslutsunderlag ger AI-verktygen tillbaka tiotals timmar
              varje vecka per medarbetare.
            </p>
            <p>
              Det svåra är inte att hitta ett AI-verktyg — det är att hitta
              <em> rätt</em> verktyg för just din roll. En SEO-specialist behöver
              en annan stack än en redovisningskonsult, och en kundservice-chef
              har andra krav än en jurist på AI-tester.
            </p>
            <p>
              Vi har testat och rankat AI-verktygen som faktiskt gör skillnad i
              svenska arbetsflöden. Välj ditt yrke nedan så får du våra topplistor,
              recensioner och praktiska guider för att komma igång snabbt.
            </p>
          </div>
        </div>
      </section>

      {/* ── Yrkes-grid ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Bläddra
        </div>
        <h2 className="mb-8 text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
          Välj yrke eller område
        </h2>

        <YrkesNavSearch items={YRKEN} />
      </section>

      {/* ── Coming soon footer ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl border border-dashed border-line bg-card/50 px-6 py-8 text-center">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fg-subtle">
            Snart fler
          </div>
          <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg break-words">
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
