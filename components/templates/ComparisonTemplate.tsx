import Link from 'next/link';
import { FaqAccordion } from '@/components/FaqAccordion';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schemas';
import {
  COMPARE_TOOLS,
  FEATURED_COMPARISONS,
  comparisonSlug,
  type ComparedTool,
  type ComparisonContent,
} from '@/lib/compare';

/* Two-tool head-to-head comparison page. Tool A is rendered in indigo,
   tool B in cyan, throughout (cards, bars, CTAs) so the eye can track each
   side. `content` is always supplied by the route — Haiku-generated when a
   Supabase row exists, templated fallback otherwise. */

const SE_MONTHS = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
];

function monthLabel(): string {
  const d = new Date();
  return `${SE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Per-side colour kit so we set classes once and reuse. */
const SIDE = {
  a: {
    text: 'text-indigo-600', bar: 'bg-indigo-500', ring: 'border-indigo-200',
    tint: 'bg-indigo-50', chipBg: 'bg-indigo-100', chipText: 'text-indigo-700',
    btn: 'bg-indigo-600 hover:bg-indigo-700',
  },
  b: {
    text: 'text-cyan-600', bar: 'bg-cyan-500', ring: 'border-cyan-200',
    tint: 'bg-cyan-50', chipBg: 'bg-cyan-100', chipText: 'text-cyan-700',
    btn: 'bg-cyan-600 hover:bg-cyan-700',
  },
} as const;

export function ComparisonTemplate({
  a,
  b,
  content,
  slug,
}: {
  a: ComparedTool;
  b: ComparedTool;
  content: ComparisonContent;
  slug: string;
}) {
  const winner = a.score >= b.score ? a : b;
  const loser = a.score >= b.score ? b : a;
  const path = `/ai-verktyg/jamfor/${slug}`;

  const crumbs = [
    { label: 'Hem', href: '/' },
    { label: 'AI-verktyg', href: '/ai-verktyg' },
    { label: 'Jämför', href: '/ai-verktyg/jamfor' },
    { label: `${a.ref.name} vs ${b.ref.name}`, href: path },
  ];

  const breadcrumbLd = breadcrumbSchema(crumbs);
  const faqLd = faqPageSchema(content.faqs);

  return (
    <article className="bg-muted text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, faqLd]) }}
      />

      <Hero a={a} b={b} crumbs={crumbs} intro={content.intro} />

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <RatingMatrix a={a} b={b} />
        <ProsConsGrid a={a} b={b} />
        <WinnerSection winner={winner} loser={loser} verdict={content.verdict} />
        <CtaPair a={a} b={b} />
      </div>

      <FaqAccordion
        items={content.faqs}
        heading={`Vanliga frågor om ${a.ref.name} vs ${b.ref.name}`}
      />

      <RelatedComparisons currentSlug={slug} />
    </article>
  );
}

/* ─── Logo ─────────────────────────────────────────────────────── */

function ToolLogo({ name, color, size = 'md' }: { name: string; color: string; size?: 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'h-16 w-16 text-2xl rounded-2xl' : 'h-11 w-11 text-lg rounded-xl';
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-black uppercase text-white shadow-sm ${color} ${dims}`}
      aria-hidden
    >
      {name.charAt(0)}
    </span>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────── */

function Hero({
  a,
  b,
  crumbs,
  intro,
}: {
  a: ComparedTool;
  b: ComparedTool;
  crumbs: { label: string; href: string }[];
  intro: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-cyan-50">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
        <nav aria-label="Brödsmulor" className="mb-7 flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-line-strong">›</span>}
              {i === crumbs.length - 1 ? (
                <span className="text-fg-muted">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-indigo-600">{c.label}</Link>
              )}
            </span>
          ))}
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✦</span> Jämförelse · Uppdaterad {monthLabel()}
        </span>

        <h1 className="mt-5 text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
          <span className={SIDE.a.text}>{a.ref.name}</span>{' '}
          <span className="text-fg-faint">eller</span>{' '}
          <span className={SIDE.b.text}>{b.ref.name}</span>?
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-fg-subtle sm:text-lg">
          {intro}
        </p>

        {/* Two tool cards with a VS badge between them */}
        <div className="mt-9 grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <ToolCard tool={a} side="a" />
          <div className="flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-line-strong bg-card font-mono text-sm font-black uppercase tracking-tight text-fg shadow-sm">
              VS
            </span>
          </div>
          <ToolCard tool={b} side="b" />
        </div>
      </div>
    </header>
  );
}

function ToolCard({ tool, side }: { tool: ComparedTool; side: 'a' | 'b' }) {
  const kit = SIDE[side];
  const p = tool.profile;
  return (
    <div className={`flex flex-col rounded-2xl border bg-card p-5 shadow-sm ${kit.ring}`}>
      <div className="flex items-center gap-3">
        <ToolLogo name={tool.ref.name} color={p.logo} size="lg" />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-black tracking-tight text-fg">{tool.ref.name}</h2>
          <p className="truncate text-xs text-fg-subtle">{p.company} · {p.model}</p>
        </div>
        <div className="ml-auto flex flex-col items-center">
          <span className={`text-2xl font-black leading-none tracking-tight ${kit.text}`}>
            {tool.score.toFixed(1)}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-fg-subtle">av 10</span>
        </div>
      </div>
      <span className={`mt-4 inline-flex w-fit items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${kit.chipBg} ${kit.chipText}`}>
        {p.label}
      </span>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.tags.slice(0, 4).map((t) => (
          <span key={t} className="rounded-full border border-line bg-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Rating matrix ────────────────────────────────────────────── */

function RatingMatrix({ a, b }: { a: ComparedTool; b: ComparedTool }) {
  // Pair criteria by index — tools within the same category share label order.
  const rows = a.profile.ratingCriteria.map((cA, i) => ({
    label: cA.label,
    scoreA: cA.score,
    scoreB: b.profile.ratingCriteria[i]?.score ?? 0,
  }));

  return (
    <section className="pt-12 sm:pt-16">
      <SectionHeader kicker="Betyg" title="Betygsmatris" />

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
        <LegendDot color={SIDE.a.bar} label={a.ref.name} />
        <LegendDot color={SIDE.b.bar} label={b.ref.name} />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-card p-5 sm:p-7">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-fg-muted">
              {r.label}
            </div>
            <Bar score={r.scoreA} color={SIDE.a.bar} numberClass={SIDE.a.text} />
            <div className="h-1.5" />
            <Bar score={r.scoreB} color={SIDE.b.bar} numberClass={SIDE.b.text} />
          </div>
        ))}

        {/* Overall row */}
        <div className="mt-1 border-t border-line pt-5">
          <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg">
            Totalbetyg
          </div>
          <Bar score={a.score} color={SIDE.a.bar} numberClass={SIDE.a.text} bold />
          <div className="h-1.5" />
          <Bar score={b.score} color={SIDE.b.bar} numberClass={SIDE.b.text} bold />
        </div>
      </div>
    </section>
  );
}

function Bar({ score, color, numberClass, bold }: { score: number; color: string; numberClass: string; bold?: boolean }) {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-soft">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`w-9 shrink-0 text-right tabular-nums ${bold ? 'text-base font-black' : 'text-sm font-bold'} ${numberClass}`}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} aria-hidden />
      <span className="font-semibold text-fg">{label}</span>
    </span>
  );
}

/* ─── Pros / cons ──────────────────────────────────────────────── */

function ProsConsGrid({ a, b }: { a: ComparedTool; b: ComparedTool }) {
  return (
    <section className="pt-14 sm:pt-20">
      <SectionHeader kicker="För & nackdelar" title="Styrkor och svagheter" />
      <div className="grid gap-5 sm:grid-cols-2">
        <ProsConsCard tool={a} side="a" />
        <ProsConsCard tool={b} side="b" />
      </div>
    </section>
  );
}

function ProsConsCard({ tool, side }: { tool: ComparedTool; side: 'a' | 'b' }) {
  const kit = SIDE[side];
  const p = tool.profile;
  return (
    <div className={`rounded-2xl border bg-card p-6 ${kit.ring}`}>
      <div className="mb-4 flex items-center gap-3">
        <ToolLogo name={tool.ref.name} color={p.logo} />
        <h3 className="text-lg font-black tracking-tight text-fg">{tool.ref.name}</h3>
      </div>
      <ul className="flex flex-col gap-2">
        {p.pros.map((pro) => (
          <li key={pro} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <span className="mt-0.5 shrink-0 font-bold text-emerald-600" aria-hidden>+</span>
            <span>{pro}</span>
          </li>
        ))}
        {p.cons.map((con) => (
          <li key={con} className="flex items-start gap-2.5 text-sm text-fg-muted">
            <span className="mt-0.5 shrink-0 font-bold text-rose-500" aria-hidden>−</span>
            <span>{con}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Winner ───────────────────────────────────────────────────── */

function WinnerSection({ winner, loser, verdict }: { winner: ComparedTool; loser: ComparedTool; verdict: string }) {
  return (
    <section className="pt-14 sm:pt-20">
      <SectionHeader kicker="Slutsats" title="Redaktionens val" />
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <ToolLogo name={winner.ref.name} color={winner.profile.logo} size="lg" />
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">
              Vinnare · {winner.score.toFixed(1)} vs {loser.score.toFixed(1)}
            </span>
            <h3 className="text-2xl font-black tracking-tight text-fg">{winner.ref.name}</h3>
          </div>
        </div>
        <p className="mt-5 text-base leading-relaxed text-fg-subtle">{verdict}</p>
      </div>
    </section>
  );
}

/* ─── CTA pair ─────────────────────────────────────────────────── */

function CtaPair({ a, b }: { a: ComparedTool; b: ComparedTool }) {
  return (
    <section className="pt-14 sm:pt-20">
      <div className="grid gap-4 sm:grid-cols-2">
        <CtaButton tool={a} side="a" />
        <CtaButton tool={b} side="b" />
      </div>
      <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        Länkar till verktygens egna sidor · priser i USD
      </p>
    </section>
  );
}

function CtaButton({ tool, side }: { tool: ComparedTool; side: 'a' | 'b' }) {
  const kit = SIDE[side];
  const cls = `flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-sm transition-colors ${kit.btn}`;
  const label = (
    <>
      {tool.ctaLabel} <span aria-hidden>→</span>
    </>
  );
  if (!tool.ctaUrl) {
    return <span className={`${cls} cursor-default opacity-80`}>{label}</span>;
  }
  return (
    <a href={tool.ctaUrl} target="_blank" rel="nofollow noopener" className={cls}>
      {label}
    </a>
  );
}

/* ─── Related comparisons ──────────────────────────────────────── */

function RelatedComparisons({ currentSlug }: { currentSlug: string }) {
  const nameOf = (token: string) =>
    COMPARE_TOOLS.find((t) => t.token === token)?.name ?? token;
  const others = FEATURED_COMPARISONS
    .map(([x, y]) => ({ slug: comparisonSlug(x, y), aName: nameOf(x), bName: nameOf(y) }))
    .filter((c) => c.slug !== currentSlug);

  if (others.length === 0) return null;

  return (
    <section className="border-t border-line bg-card">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHeader kicker="Fler jämförelser" title="Andra populära dueller" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/ai-verktyg/jamfor/${c.slug}`}
              className="group flex items-center justify-center gap-2 rounded-xl border border-line bg-page px-4 py-4 text-center text-sm font-bold tracking-tight text-fg transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="text-indigo-600">{c.aName}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">vs</span>
              <span className="text-cyan-600">{c.bName}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Shared ───────────────────────────────────────────────────── */

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <>
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        {kicker}
      </div>
      <h2 className="mb-6 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
    </>
  );
}
