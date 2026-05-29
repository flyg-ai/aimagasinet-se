import type { Metadata } from 'next';
import Link from 'next/link';
import {
  resolveToolProfile,
  toolOverallScore,
} from '@/components/templates/ReviewTemplate';
import {
  COMPARE_TOOLS,
  FEATURED_COMPARISONS,
  comparisonSlug,
} from '@/lib/compare';
import { breadcrumbSchema } from '@/lib/schemas';

export const revalidate = 300;

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Jämför AI-verktyg sida vid sida (${YEAR})`,
  description:
    'ChatGPT vs Claude, Cursor vs Copilot, Midjourney vs DALL·E och fler. Vi ställer de populäraste AI-verktygen mot varandra — betyg, för- och nackdelar och pris.',
  alternates: {
    canonical: '/ai-verktyg/jamfor/',
    languages: { 'sv-SE': '/ai-verktyg/jamfor/' },
  },
};

function ref(token: string) {
  const t = COMPARE_TOOLS.find((x) => x.token === token);
  if (!t) throw new Error(`Unknown compare token: ${token}`);
  const profile = resolveToolProfile(t.key, t.name);
  return { name: t.name, logo: profile.logo, score: toolOverallScore(profile) };
}

export default function JamforHub() {
  const cards = FEATURED_COMPARISONS.map(([x, y]) => ({
    slug: comparisonSlug(x, y),
    a: ref(x),
    b: ref(y),
  }));

  const breadcrumbLd = breadcrumbSchema([
    { label: 'Hem', href: '/' },
    { label: 'AI-verktyg', href: '/ai-verktyg' },
    { label: 'Jämför', href: '/ai-verktyg/jamfor' },
  ]);

  return (
    <article className="bg-page text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-cyan-50">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
          <nav aria-label="Brödsmulor" className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Link href="/" className="hover:text-indigo-600">Hem</Link>
            <span className="mx-2 text-line-strong">›</span>
            <Link href="/ai-verktyg" className="hover:text-indigo-600">AI-verktyg</Link>
            <span className="mx-2 text-line-strong">›</span>
            <span className="text-fg-muted">Jämför</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>⚔</span> {cards.length} jämförelser · {YEAR}
          </span>

          <h1 className="mt-6 max-w-3xl text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
            Jämför AI-verktyg sida vid sida
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            Vi ställer de mest populära AI-verktygen mot varandra — betyg per kriterium,
            för- och nackdelar, pris och en tydlig vinnare. Välj en duell nedan.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Populära dueller
        </div>
        <h2 className="mb-8 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
          Alla jämförelser
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.slug}
              href={`/ai-verktyg/jamfor/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <Side name={c.a.name} logo={c.a.logo} score={c.a.score} color="text-indigo-600" />
                <span className="shrink-0 font-mono text-xs font-black uppercase tracking-tight text-fg-subtle">
                  vs
                </span>
                <Side name={c.b.name} logo={c.b.logo} score={c.b.score} color="text-cyan-600" align="right" />
              </div>
              <span className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600 transition-transform group-hover:translate-x-0.5">
                Jämför <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

function Side({
  name,
  logo,
  score,
  color,
  align = 'left',
}: {
  name: string;
  logo: string;
  score: number;
  color: string;
  align?: 'left' | 'right';
}) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2.5 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black uppercase text-white ${logo}`}
        aria-hidden
      >
        {name.charAt(0)}
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-black tracking-tight text-fg">{name}</div>
        <div className={`font-mono text-[11px] font-bold tabular-nums ${color}`}>{score.toFixed(1)}/10</div>
      </div>
    </div>
  );
}
