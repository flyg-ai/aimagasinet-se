import type { ReactNode } from 'react';
import Link from 'next/link';
import { to } from '@/lib/links';
import { FaqAccordion } from '@/components/FaqAccordion';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schemas';
import {
  COMPARE_TOOLS,
  FEATURED_COMPARISONS,
  comparisonSlug,
  toolPricing,
  type ComparedTool,
  type ComparisonContent,
} from '@/lib/compare';

/* flyg.ai-inspired head-to-head. Tool A is indigo, tool B is cyan throughout.
   `content` is always supplied by the route — Haiku-generated when a Supabase
   row exists, deterministic templated fallback otherwise. */

const SE_MONTHS = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
];

function monthLabel(): string {
  const d = new Date();
  return `${SE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const SIDE = {
  a: { text: 'text-indigo-600', bar: 'bg-indigo-500', ring: 'border-indigo-200', btn: 'bg-indigo-600 hover:bg-indigo-700', pill: 'bg-indigo-100 text-indigo-700' },
  b: { text: 'text-cyan-600', bar: 'bg-cyan-500', ring: 'border-cyan-200', btn: 'bg-cyan-600 hover:bg-cyan-700', pill: 'bg-cyan-100 text-cyan-700' },
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

  const ld = [breadcrumbSchema(crumbs), faqPageSchema(content.faqs)];

  return (
    <article className="bg-muted text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <Hero a={a} b={b} crumbs={crumbs} />

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <Snabbfakta a={a} b={b} />
        <WinnerSection winner={winner} loser={loser} verdict={content.verdict} tie={a.score === b.score} />
        <CriteriaTable a={a} b={b} />
        <ProsCons a={a} b={b} />
        <CtaPair a={a} b={b} />
        <MagazineText a={a} b={b} intro={content.intro} />
      </div>

      <FaqAccordion items={content.faqs} heading={`Vanliga frågor om ${a.ref.name} vs ${b.ref.name}`} />

      <RelatedComparisons currentSlug={slug} />
    </article>
  );
}

/* ─── Logo ─────────────────────────────────────────────────────── */

function ToolLogo({
  name,
  color,
  image,
  size = 'md',
}: { name: string; color: string; image?: string | null; size?: 'md' | 'lg' | 'xl' }) {
  const dims =
    size === 'xl' ? 'h-20 w-20 text-3xl rounded-3xl'
    : size === 'lg' ? 'h-16 w-16 text-2xl rounded-2xl'
    : 'h-11 w-11 text-lg rounded-xl';
  if (image) {
    return (
      <span className={`flex shrink-0 items-center justify-center overflow-hidden border border-line bg-card shadow-sm ${dims}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span className={`flex shrink-0 items-center justify-center font-black uppercase text-white shadow-sm ${color} ${dims}`} aria-hidden>
      {name.charAt(0)}
    </span>
  );
}

/* ─── Hero — two big tool cards + VS ───────────────────────────── */

function Hero({ a, b, crumbs }: { a: ComparedTool; b: ComparedTool; crumbs: { label: string; href: string }[] }) {
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
                <Link href={to(c.href)} className="hover:text-indigo-600">{c.label}</Link>
              )}
            </span>
          ))}
        </nav>

        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>⚔</span> Jämförelse · Uppdaterad {monthLabel()}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
            <span className={SIDE.a.text}>{a.ref.name}</span>{' '}
            <span className="text-fg-faint">eller</span>{' '}
            <span className={SIDE.b.text}>{b.ref.name}</span>?
          </h1>
        </div>

        {/* Two big tool cards with a big VS badge between */}
        <div className="relative mt-10 grid items-stretch gap-4 sm:grid-cols-2">
          <BigToolCard tool={a} side="a" />
          <BigToolCard tool={b} side="b" />
          {/* Centered VS badge — absolute on desktop, inline divider on mobile */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-page bg-fg font-mono text-base font-black uppercase tracking-tight text-page shadow-lg">
              VS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function BigToolCard({ tool, side }: { tool: ComparedTool; side: 'a' | 'b' }) {
  const kit = SIDE[side];
  const p = tool.profile;
  return (
    <div className={`flex flex-col items-center rounded-2xl border-2 bg-card p-6 text-center shadow-sm ${kit.ring}`}>
      <ToolLogo name={tool.ref.name} color={p.logo} image={tool.image} size="xl" />
      <h2 className="mt-4 text-xl font-black tracking-tight text-fg break-words">{tool.ref.name}</h2>
      <p className="mt-1 text-xs text-fg-subtle">{p.company} · {p.model}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={`text-4xl font-black leading-none tracking-tight ${kit.text}`}>{tool.score.toFixed(1)}</span>
        <span className="font-mono text-xs font-bold text-fg-subtle">/10</span>
      </div>
      <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${kit.pill}`}>
        {p.label}
      </span>
    </div>
  );
}

/* ─── Snabbfakta row ───────────────────────────────────────────── */

/** En cell i gratisraden. Gron bock nar det finns en gratisniva, dampad
 *  bock-fri text nar det inte gor det — sa att svaret gar att lasa av utan
 *  att jamfora tva prosastrangar mot varandra. */
function FreeCell({ value }: { value: string | null }) {
  if (!value) {
    return (
      <span className="flex items-start gap-1.5 text-sm text-fg-subtle">
        <span aria-hidden className="mt-px font-bold text-fg-subtle">–</span>
        <span>Ingen gratisnivå</span>
      </span>
    );
  }
  return (
    <span className="flex items-start gap-1.5 text-sm font-semibold text-emerald-700">
      <span aria-hidden className="mt-px">✓</span>
      <span>{value}</span>
    </span>
  );
}

function Snabbfakta({ a, b }: { a: ComparedTool; b: ComparedTool }) {
  // Priset i profilen ar en enda strang dar gratisnivan ligger inbakad
  // ("Gratis · Pro 20 USD/man"). Uppdelad blir bade priset och gratisnivan
  // lasbara var for sig, vilket var hela poangen med tabellen.
  const pa = toolPricing(a.ref.key, a.profile.offer);
  const pb = toolPricing(b.ref.key, b.profile.offer);

  const rows: { label: string; av: ReactNode; bv: ReactNode }[] = [
    { label: 'Pris', av: pa.paid, bv: pb.paid },
    { label: 'Gratisnivå', av: <FreeCell value={pa.free} />, bv: <FreeCell value={pb.free} /> },
    { label: 'Bäst för', av: a.profile.offer.bestFor, bv: b.profile.offer.bestFor },
    { label: 'Typ', av: a.ref.category, bv: b.ref.category },
  ];
  return (
    <section className="pt-10 sm:pt-12">
      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="grid grid-cols-[88px_1fr_1fr] items-center gap-3 border-b border-line bg-soft px-4 py-3 sm:grid-cols-[120px_1fr_1fr] sm:px-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">Snabbfakta</span>
          <span className={`truncate text-sm font-black tracking-tight ${SIDE.a.text}`}>{a.ref.name}</span>
          <span className={`truncate text-sm font-black tracking-tight ${SIDE.b.text}`}>{b.ref.name}</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`grid grid-cols-[88px_1fr_1fr] gap-3 px-4 py-3 sm:grid-cols-[120px_1fr_1fr] sm:px-6 ${i > 0 ? 'border-t border-line-subtle' : ''}`}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-muted">{r.label}</span>
            <span className="text-sm text-fg">{r.av}</span>
            <span className="text-sm text-fg">{r.bv}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Winner ───────────────────────────────────────────────────── */

function WinnerSection({ winner, loser, verdict, tie }: { winner: ComparedTool; loser: ComparedTool; verdict: string; tie: boolean }) {
  return (
    <section className="pt-14 sm:pt-20">
      <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="border-b border-indigo-100 bg-white/40 px-6 py-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
            {tie ? 'Oavgjort' : 'Vinnaren är'}
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <ToolLogo name={winner.ref.name} color={winner.profile.logo} image={winner.image} size="lg" />
            <div>
              <h3 className="text-2xl font-black tracking-tight text-fg break-words sm:text-3xl">{winner.ref.name}</h3>
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {winner.score.toFixed(1)} mot {loser.score.toFixed(1)}
              </span>
            </div>
          </div>
          <p className="mt-5 text-base leading-relaxed text-fg-subtle sm:text-lg">{verdict}</p>
        </div>
      </div>
    </section>
  );
}

/* ─── Criteria table (win indicator per row) ───────────────────── */

function CriteriaTable({ a, b }: { a: ComparedTool; b: ComparedTool }) {
  const rows = a.profile.ratingCriteria.map((cA, i) => ({
    label: cA.label,
    av: cA.score,
    bv: b.profile.ratingCriteria[i]?.score ?? 0,
  }));

  return (
    <section className="pt-14 sm:pt-20">
      <SectionHeader kicker="Betyg" title="Kriterium för kriterium" />
      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {/* Header */}
        <div className="grid grid-cols-[1fr_72px_72px] items-center gap-2 border-b border-line bg-soft px-4 py-3 sm:grid-cols-[1fr_96px_96px] sm:px-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">Kriterium</span>
          <span className={`text-center font-mono text-[11px] font-black uppercase ${SIDE.a.text}`}>{a.ref.name}</span>
          <span className={`text-center font-mono text-[11px] font-black uppercase ${SIDE.b.text}`}>{b.ref.name}</span>
        </div>
        {rows.map((r, i) => (
          <CriteriaRow key={r.label} label={r.label} av={r.av} bv={r.bv} striped={i % 2 === 1} />
        ))}
        {/* Total */}
        <CriteriaRow label="Totalbetyg" av={a.score} bv={b.score} total />
      </div>
    </section>
  );
}

function CriteriaRow({ label, av, bv, striped, total }: { label: string; av: number; bv: number; striped?: boolean; total?: boolean }) {
  const aWins = av > bv;
  const bWins = bv > av;
  const bg = total ? 'bg-soft' : striped ? 'bg-muted' : '';
  const border = total ? 'border-t-2 border-line' : 'border-t border-line-subtle';
  return (
    <div className={`grid grid-cols-[1fr_72px_72px] items-center gap-2 px-4 py-3 sm:grid-cols-[1fr_96px_96px] sm:px-6 ${border} ${bg}`}>
      <span className={`${total ? 'font-mono text-[11px] font-black uppercase tracking-wider text-fg' : 'text-sm text-fg-muted'}`}>{label}</span>
      <ScoreCell value={av} win={aWins} total={total} />
      <ScoreCell value={bv} win={bWins} total={total} />
    </div>
  );
}

function ScoreCell({ value, win, total }: { value: number; win: boolean; total?: boolean }) {
  return (
    <span
      className={`mx-auto inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1 tabular-nums ${
        win
          ? 'bg-emerald-50 font-black text-emerald-700'
          : `font-bold ${total ? 'text-fg' : 'text-fg-subtle'}`
      } ${total ? 'text-base' : 'text-sm'}`}
    >
      {win && <span aria-hidden className="text-[10px]">▲</span>}
      {value.toFixed(1)}
    </span>
  );
}

/* ─── Pros / cons pills ────────────────────────────────────────── */

function ProsCons({ a, b }: { a: ComparedTool; b: ComparedTool }) {
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
    <div className={`rounded-2xl border-2 bg-card p-6 ${kit.ring}`}>
      <div className="mb-4 flex items-center gap-3">
        <ToolLogo name={tool.ref.name} color={p.logo} image={tool.image} />
        <h3 className="text-lg font-black tracking-tight text-fg break-words">{tool.ref.name}</h3>
      </div>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600">Fördelar</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {p.pros.map((pro) => (
          <span key={pro} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span aria-hidden>+</span> {pro}
          </span>
        ))}
      </div>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-500">Nackdelar</p>
      <div className="flex flex-wrap gap-2">
        {p.cons.map((con) => (
          <span key={con} className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600">
            <span aria-hidden>−</span> {con}
          </span>
        ))}
      </div>
    </div>
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
  const label = <>{tool.ctaLabel} <span aria-hidden>→</span></>;
  if (!tool.ctaUrl) return <span className={`${cls} cursor-default opacity-80`}>{label}</span>;
  return <a href={to(tool.ctaUrl)} target="_blank" rel="nofollow noopener" className={cls}>{label}</a>;
}

/* ─── Magazine analysis text (Haiku) ───────────────────────────── */

function MagazineText({ a, b, intro }: { a: ComparedTool; b: ComparedTool; intro: string }) {
  return (
    <section className="pt-14 sm:pt-20">
      <SectionHeader kicker="Analys" title={`${a.ref.name} vs ${b.ref.name} i korthet`} />
      <div className="rounded-2xl border border-line bg-card p-6 sm:p-8">
        <p className="text-lg leading-relaxed text-fg-muted sm:text-xl">{intro}</p>
      </div>
    </section>
  );
}

/* ─── Related comparisons ──────────────────────────────────────── */

function RelatedComparisons({ currentSlug }: { currentSlug: string }) {
  const nameOf = (token: string) => COMPARE_TOOLS.find((t) => t.token === token)?.name ?? token;
  const others = FEATURED_COMPARISONS
    .map(([x, y]) => ({ slug: comparisonSlug(x, y), aName: nameOf(x), bName: nameOf(y) }))
    .filter((c) => c.slug !== currentSlug)
    .slice(0, 6);

  if (others.length === 0) return null;

  return (
    <section className="border-t border-line bg-card">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHeader kicker="Fler jämförelser" title="Andra populära jämförelser" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={to(`/ai-verktyg/jamfor/${c.slug}`)}
              className="group flex items-center justify-center gap-2 rounded-xl border border-line bg-page px-4 py-4 text-center text-sm font-bold tracking-tight text-fg break-words transition-colors hover:border-indigo-300 hover:bg-indigo-50"
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
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">{kicker}</div>
      <h2 className="mb-6 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">{title}</h2>
    </>
  );
}
