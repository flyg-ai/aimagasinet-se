'use client';

import { Fragment, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { ToolCategory } from '@/lib/compare';

export type CatalogTool = {
  token: string;
  name: string;
  category: ToolCategory;
  score: number;
  image: string | null;
  logo: string; // tailwind bg-* fallback accent
  price: string;
  bestFor: string;
  criteria: { label: string; score: number }[];
  useCases: string[];
  ctaUrl: string | null;
  ctaName: string;
};

type Step = 1 | 2 | 3 | 'result';

const CATEGORY_ORDER: ToolCategory[] = [
  'AI-text', 'AI-bilder', 'AI-video', 'AI-kod', 'AI-ljud', 'AI-automation',
];

/** Per-category gradient fallback when a tool has no featured image. */
const CATEGORY_GRADIENT: Record<ToolCategory, string> = {
  'AI-text': 'from-indigo-500 to-violet-700',
  'AI-bilder': 'from-fuchsia-500 to-rose-700',
  'AI-video': 'from-cyan-500 to-sky-700',
  'AI-kod': 'from-zinc-700 to-zinc-900',
  'AI-ljud': 'from-amber-500 to-orange-700',
  'AI-automation': 'from-emerald-500 to-teal-700',
};

const SYFTE: { slug: string; label: string }[] = [
  { slug: 'skrivande', label: 'Skrivande' },
  { slug: 'kodning', label: 'Kodning' },
  { slug: 'bildgenerering', label: 'Bildgenerering' },
  { slug: 'analys-research', label: 'Analys & research' },
  { slug: 'kreativitet', label: 'Kreativitet' },
  { slug: 'marknadsforing', label: 'Marknadsföring' },
  { slug: 'kundservice', label: 'Kundservice' },
  { slug: 'automation', label: 'Automation' },
];

const BUDGET: { slug: string; label: string }[] = [
  { slug: 'gratis', label: 'Gratis' },
  { slug: 'budget', label: 'Budget (under 20 USD/mån)' },
  { slug: 'professionell', label: 'Professionell (20+ USD/mån)' },
  { slug: 'egal', label: 'Spelar ingen roll' },
];

const MAX = 4;

/** Primary CTA — saturated indigo, real elevation, inviting even when
 *  disabled (muted indigo, never grey-dead). */
const CTA_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:shadow-none disabled:hover:bg-indigo-300';

export function ComparisonWizard({ catalog }: { catalog: CatalogTool[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const initTokens = (params.get('tools') ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean)
    .filter((t) => catalog.some((c) => c.token === t))
    .slice(0, MAX);
  const hasInit = initTokens.length >= 2;

  const [selected, setSelected] = useState<string[]>(hasInit ? initTokens : []);
  const [syfte, setSyfte] = useState<string[]>(
    hasInit ? (params.get('syfte') ?? '').split(',').filter(Boolean) : [],
  );
  const [budget, setBudget] = useState<string>(hasInit ? (params.get('budget') ?? '') : '');
  const [step, setStep] = useState<Step>(hasInit ? 'result' : 1);
  const [activeCat, setActiveCat] = useState<ToolCategory>('AI-text');

  const [rec, setRec] = useState<{ winner: string; recommendation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const currentKey = JSON.stringify([selected, syfte, budget]);
  const dirty = generatedKey !== null && generatedKey !== currentKey;

  function runGenerate() {
    if (selected.length < 2) return;
    setGeneratedKey(JSON.stringify([selected, syfte, budget]));
    setLoading(true); setErr(false); setRec(null);
    const labels = syfte.map((s) => SYFTE.find((x) => x.slug === s)?.label ?? s);
    fetch('/api/compare-recommend', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tools: selected, syfte: labels, budget }),
    })
      .then((r) => r.json())
      .then((d) => { if (d && d.winner) setRec(d); else setErr(true); })
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  }

  // Auto-generate once when first landing on the result step.
  useEffect(() => {
    if (step === 'result' && generatedKey === null) runGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function toggleTool(token: string) {
    setSelected((prev) => {
      if (prev.includes(token)) return prev.filter((t) => t !== token);
      if (prev.length >= MAX) return prev;
      return [...prev, token];
    });
  }
  function toggleSyfte(slug: string) {
    setSyfte((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function showResult() {
    const qs = new URLSearchParams();
    qs.set('tools', selected.join(','));
    if (syfte.length) qs.set('syfte', syfte.join(','));
    if (budget) qs.set('budget', budget);
    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    setStep('result');
  }

  function reset() {
    router.replace(pathname, { scroll: false });
    setSelected([]); setSyfte([]); setBudget(''); setRec(null); setErr(false);
    setGeneratedKey(null); setStep(1); setActiveCat('AI-text');
  }

  const stepIndex: 1 | 2 | 3 | 4 = step === 'result' ? 4 : step;

  return (
    <div>
      <StepBar current={stepIndex} />

      {/* key re-mounts the subtree on step change → replays the entrance
          animation so the brain registers that the step changed. */}
      <div key={String(step)} className="wizard-step">
        {step === 1 && (
          <StepTools
            catalog={catalog}
            selected={selected}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            onToggle={toggleTool}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepPills
            current={2}
            title="Vad ska du använda det till?"
            subtitle="Välj en eller flera — det hjälper oss ge en vassare rekommendation."
            options={SYFTE}
            selected={syfte}
            onToggle={toggleSyfte}
            onBack={() => setStep(1)}
            onSkip={() => setStep(3)}
            onNext={() => setStep(3)}
            nextLabel="Nästa →"
            nextDisabled={syfte.length === 0}
            hint="Välj minst ett syfte för att gå vidare"
          />
        )}

        {step === 3 && (
          <StepPills
            current={3}
            title="Budget?"
            subtitle="Vi väger in pris i rekommendationen."
            options={BUDGET}
            selected={budget ? [budget] : []}
            onToggle={(slug) => setBudget((b) => (b === slug ? '' : slug))}
            onBack={() => setStep(2)}
            onSkip={() => { setBudget(''); showResult(); }}
            onNext={showResult}
            nextLabel="Visa jämförelse →"
            nextDisabled={false}
            hint=""
          />
        )}

        {step === 'result' && (
          <ResultView
            catalog={catalog}
            selected={selected}
            syfte={syfte}
            budget={budget}
            onToggleSyfte={toggleSyfte}
            onSetBudget={(slug) => setBudget((b) => (b === slug ? '' : slug))}
            rec={rec}
            loading={loading}
            err={err}
            dirty={dirty}
            onGenerate={runGenerate}
            onReset={reset}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Step indicator ───────────────────────────────────────────── */

const STEP_LABELS = ['Verktyg', 'Syfte', 'Budget', 'Resultat'] as const;

function StepBar({ current }: { current: 1 | 2 | 3 | 4 }) {
  const total = STEP_LABELS.length;
  return (
    <div className="mb-6 sm:mb-7">
      <ol className="flex items-center" aria-label={`Förlopp: steg ${current} av ${total}, ${STEP_LABELS[current - 1]}`}>
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const active = n === current;
          const done = n < current;
          return (
            <Fragment key={label}>
              {i > 0 && (
                <span
                  aria-hidden
                  className={`mx-1.5 h-0.5 flex-1 rounded-full transition-colors sm:mx-2.5 ${done || active ? 'bg-indigo-500' : 'bg-line'}`}
                />
              )}
              <li className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-black transition-all ${
                    active
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : done
                        ? 'bg-indigo-600 text-white'
                        : 'bg-soft text-fg-subtle ring-1 ring-inset ring-line'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                <span className={`hidden text-sm font-bold sm:inline ${active ? 'text-fg' : done ? 'text-fg-muted' : 'text-fg-subtle'}`}>
                  {label}
                </span>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}

/* ─── Step 1: tool grid ────────────────────────────────────────── */

function StepTools({
  catalog, selected, activeCat, setActiveCat, onToggle, onNext,
}: {
  catalog: CatalogTool[];
  selected: string[];
  activeCat: ToolCategory;
  setActiveCat: (c: ToolCategory) => void;
  onToggle: (token: string) => void;
  onNext: () => void;
}) {
  const full = selected.length >= MAX;
  const tools = catalog.filter((t) => t.category === activeCat);

  return (
    <StepPanel
      current={1}
      title="Välj verktyg att jämföra"
      subtitle="Markera 2–4 verktyg. Bläddra mellan kategorierna nedan."
    >
      {/* Kategorivalet lag tidigare som sma piller i 11 px och lastes som
          dekoration — det syntes inte att verktygen bakom dem var andra. Nu
          en rad riktiga flikar: storre yta, verktygsantalet per kategori
          utskrivet, och antalet valda som prick i hornet. */}
      <div
        role="tablist"
        aria-label="Verktygskategori"
        className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
      >
        {CATEGORY_ORDER.map((c) => {
          const active = c === activeCat;
          const total = catalog.filter((t) => t.category === c).length;
          const count = selected.filter((tok) => catalog.find((t) => t.token === tok)?.category === c).length;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCat(c)}
              className={`relative flex flex-col items-start gap-0.5 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                  : 'border-line bg-card text-fg hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <span className="text-sm font-bold leading-tight">{c}</span>
              <span className={`font-mono text-[11px] ${active ? 'text-indigo-200' : 'text-fg-subtle'}`}>
                {total} verktyg
              </span>
              {count > 0 && (
                <span
                  aria-label={`${count} valda`}
                  className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    active ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {tools.map((t) => (
          <SelectableCard
            key={t.token}
            tool={t}
            selected={selected.includes(t.token)}
            disabled={full && !selected.includes(t.token)}
            onToggle={() => onToggle(t.token)}
          />
        ))}
      </div>

      <div className="sticky bottom-4 z-10 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-card/95 p-4 shadow-lg shadow-black/5 backdrop-blur">
        <span aria-live="polite" className="font-mono text-[11px] font-bold uppercase tracking-wider">
          {selected.length < 2 ? (
            <span className="text-fg-subtle">
              Välj minst 2 verktyg <span className="text-indigo-600">· {selected.length}/{MAX}</span>
            </span>
          ) : (
            <span className="text-fg-muted">{selected.length} / {MAX} valda</span>
          )}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length < 2}
          className={CTA_CLASS}
        >
          Nästa <span aria-hidden>→</span>
        </button>
      </div>
    </StepPanel>
  );
}

/* ─── Shared step panel ─────────────────────────────────────────────
   A light, elevated card with real depth (soft indigo-tinted shadow +
   indigo ring), a slim indigo accent bar on top, and an indigo-tinted
   header zone carrying the flyg.ai-style step label + the question.
   No overflow-hidden → step 1's sticky CTA bar still works. */

function StepPanel({
  current, title, subtitle, children,
}: {
  current: 1 | 2 | 3 | 4; title: string; subtitle: string; children: ReactNode;
}) {
  const label = `Jämförelse · Steg ${current} av ${STEP_LABELS.length} · ${STEP_LABELS[current - 1]}`;
  return (
    <div className="rounded-[24px] bg-card shadow-[0_2px_8px_rgba(24,24,27,0.04),0_28px_64px_-28px_rgba(79,70,229,0.30)] ring-1 ring-indigo-100">
      {/* slim indigo accent — panel identity without going dark */}
      <div aria-hidden className="h-1.5 rounded-t-[24px] bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500" />

      {/* header zone */}
      <div className="border-b border-indigo-100/70 bg-gradient-to-b from-indigo-50/80 to-card px-5 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-6">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-600">{label}</p>
        <h2 className="mt-2.5 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">{title}</h2>
        <p className="mt-1.5 text-fg-subtle">{subtitle}</p>
      </div>

      {/* body */}
      <div className="px-5 py-6 sm:px-8 sm:py-7">{children}</div>
    </div>
  );
}

function SelectableCard({
  tool, selected, disabled, onToggle,
}: {
  tool: CatalogTool; selected: boolean; disabled: boolean; onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 text-left transition-all ${selected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent hover:border-indigo-300'} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {tool.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={tool.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENT[tool.category]}`} />
      )}
      <div className={`absolute inset-0 ${disabled ? 'bg-black/70' : 'bg-black/50 group-hover:bg-black/40'} transition-colors`} />
      {selected && (
        <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white shadow">✓</span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="text-sm font-black leading-tight tracking-tight text-white">{tool.name}</div>
        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur">★ {tool.score.toFixed(1)}</div>
      </div>
    </button>
  );
}

/* ─── Steps 2 & 3: pill pickers ────────────────────────────────── */

function StepPills({
  current, title, subtitle, options, selected, onToggle, onBack, onSkip, onNext, nextLabel, nextDisabled, hint,
}: {
  current: 2 | 3;
  title: string; subtitle: string;
  options: { slug: string; label: string }[];
  selected: string[]; onToggle: (slug: string) => void;
  onBack: () => void; onSkip: () => void; onNext: () => void;
  nextLabel: string; nextDisabled: boolean; hint: string;
}) {
  return (
    <StepPanel current={current} title={title} subtitle={subtitle}>
      <PillRow options={options} selected={selected} onToggle={onToggle} />
      <div className="mt-8 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={onBack} className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle transition-colors hover:text-indigo-600">← Tillbaka</button>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onSkip} className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle transition-colors hover:text-indigo-600">Hoppa över</button>
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={CTA_CLASS}
            >
              {nextLabel}
            </button>
          </div>
        </div>
        {/* Reserved-height hint → no reflow when it toggles */}
        <p aria-live="polite" className="min-h-[1rem] text-right font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
          {nextDisabled ? hint : ''}
        </p>
      </div>
    </StepPanel>
  );
}

function PillRow({
  options, selected, onToggle,
}: {
  options: { slug: string; label: string }[]; selected: string[]; onToggle: (slug: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const on = selected.includes(o.slug);
        return (
          <button
            key={o.slug}
            type="button"
            onClick={() => onToggle(o.slug)}
            aria-pressed={on}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
              on
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'border-indigo-100 bg-indigo-50/50 text-fg-muted hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md'
            }`}
          >
            {/* fixed-width check slot: shows ✓ when chosen, empty (no grey
                circle) otherwise — keeps width stable so siblings don't reflow */}
            <span aria-hidden className="flex w-4 shrink-0 items-center justify-center text-xs font-black leading-none">
              {on ? '✓' : ''}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Result helpers ───────────────────────────────────────────── */

function criterionEmoji(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('hastighet')) return '⚡';
  if (l.includes('säkerhet') || l.includes('gdpr')) return '🔒';
  if (l.includes('svenska')) return '🇸🇪';
  if (l.includes('integration')) return '🔗';
  if (l.includes('pris')) return '💵';
  if (l.includes('text')) return '✍️';
  if (l.includes('kod')) return '💻';
  if (l.includes('visuell') || l.includes('stil') || l.includes('bild')) return '🎨';
  if (l.includes('röst') || l.includes('ljud') || l.includes('voice')) return '🎙️';
  if (l.includes('prompt')) return '🎯';
  if (l.includes('realism') || l.includes('konsistens') || l.includes('rörelse')) return '🎬';
  if (l.includes('användar')) return '🙂';
  if (l.includes('modell')) return '🧠';
  if (l.includes('kontext')) return '📚';
  if (l.includes('self') || l.includes('host') || l.includes('privacy')) return '🖥️';
  if (l.includes('community')) return '👥';
  return '✦';
}

function starCount(score: number, index: number): number {
  const base = Math.max(1, Math.min(5, Math.round(score / 2)));
  return Math.max(1, Math.min(5, base - (index === 0 ? 0 : 1)));
}

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} av 5`} className="tracking-tight text-amber-500">
      {'★'.repeat(n)}<span className="text-line-strong">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

const CAT_RATING_DIMS = [
  { emoji: '✍️', label: 'Skrivande' },
  { emoji: '💻', label: 'Kodning' },
  { emoji: '🎨', label: 'Kreativitet' },
  { emoji: '📊', label: 'Analys' },
  { emoji: '🤝', label: 'Företag' },
];
const CAT_RATING_BASE: Record<ToolCategory, number[]> = {
  'AI-text':       [4.7, 3.6, 4.0, 4.6, 4.2],
  'AI-bilder':     [3.2, 2.8, 4.9, 3.4, 3.9],
  'AI-video':      [3.0, 2.6, 4.8, 3.2, 3.8],
  'AI-kod':        [3.4, 4.8, 3.6, 4.2, 4.3],
  'AI-ljud':       [3.1, 2.7, 4.7, 3.3, 3.8],
  'AI-automation': [3.3, 4.0, 3.2, 4.4, 4.6],
};

/** Derive the five /5 category ratings from the tool's category profile,
 *  scaled by its overall score so stronger tools rate a touch higher. */
function categoryRatings(category: ToolCategory, score: number) {
  const base = CAT_RATING_BASE[category];
  const f = score / 9;
  return CAT_RATING_DIMS.map((d, i) => ({
    ...d,
    value: Math.max(1, Math.min(5, Math.round(base[i] * f * 10) / 10)),
  }));
}

/* ─── Result view ──────────────────────────────────────────────── */

function ResultView({
  catalog, selected, syfte, budget, onToggleSyfte, onSetBudget,
  rec, loading, err, dirty, onGenerate, onReset, onBack,
}: {
  catalog: CatalogTool[];
  selected: string[];
  syfte: string[];
  budget: string;
  onToggleSyfte: (slug: string) => void;
  onSetBudget: (slug: string) => void;
  rec: { winner: string; recommendation: string } | null;
  loading: boolean;
  err: boolean;
  dirty: boolean;
  onGenerate: () => void;
  onReset: () => void;
  onBack: () => void;
}) {
  const tools = selected
    .map((tok) => catalog.find((t) => t.token === tok))
    .filter((t): t is CatalogTool => !!t);
  const winner = rec?.winner ?? null;

  const cols =
    tools.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4'
    : tools.length === 3 ? 'sm:grid-cols-3'
    : 'sm:grid-cols-2';

  return (
    <div>
      <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">Din jämförelse</div>
      <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
        {tools.map((t) => t.name).join(' vs ')}
      </h2>

      {/* Detailed columns, one per tool */}
      <div className={`grid grid-cols-1 gap-4 ${cols}`}>
        {tools.map((t) => (
          <DetailColumn key={t.token} tool={t} isWinner={t.token === winner} />
        ))}
      </div>

      {/* Detailed pairwise link when exactly two tools */}
      {tools.length === 2 && (
        <div className="mt-5 text-center">
          <Link
            href={`/ai-verktyg/jamfor/${tools[0].token}-eller-${tools[1].token}`}
            className="inline-flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-wider text-indigo-600 hover:underline"
          >
            Se detaljerad jämförelse <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      {/* Recommendation section — full width */}
      <div className="mt-12 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-6 sm:p-8">
        <h3 className="text-xl font-black tracking-tight text-fg sm:text-2xl">✨ Få AI:s rekommendation</h3>
        <p className="mt-1 text-fg-subtle">Välj vad du ska göra och din budget — så väljer vi det bästa verktyget åt dig.</p>

        <div className="mt-5">
          <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">Syfte</p>
          <PillRow options={SYFTE} selected={syfte} onToggle={onToggleSyfte} />
        </div>
        <div className="mt-5">
          <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">Budget</p>
          <PillRow options={BUDGET} selected={budget ? [budget] : []} onToggle={onSetBudget} />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className={`mt-6 ${CTA_CLASS}`}
        >
          {loading ? 'Genererar…' : dirty || !rec ? 'Generera rekommendation →' : 'Uppdatera rekommendation →'}
        </button>

        {/* Output */}
        {(loading || err || rec) && (
          <div className="mt-6 rounded-xl border border-indigo-100 bg-white/60 p-5">
            {loading && <p className="text-fg-subtle">Analyserar dina val…</p>}
            {!loading && err && (
              <p className="text-fg-subtle">Kunde inte generera en rekommendation just nu. Jämför betygen på korten ovan — högst poäng vinner.</p>
            )}
            {!loading && !err && rec && (
              <>
                {winner && (
                  <p className="mb-2 text-lg font-black tracking-tight text-fg">
                    Vinnare: <span className="text-indigo-600">{tools.find((t) => t.token === winner)?.name}</span>
                  </p>
                )}
                <p className="text-base leading-relaxed text-fg-subtle sm:text-lg">{rec.recommendation}</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <button type="button" onClick={onBack} className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle hover:text-indigo-600">← Ändra val</button>
        <button type="button" onClick={onReset} className="rounded-xl border border-line bg-card px-6 py-3 font-bold text-fg transition-colors hover:border-indigo-300 hover:text-indigo-600">Börja om</button>
      </div>
    </div>
  );
}

function DetailColumn({ tool, isWinner }: { tool: CatalogTool; isWinner: boolean }) {
  const cats = categoryRatings(tool.category, tool.score);
  const detailRows: { emoji: string; label: string; value: string }[] = [
    { emoji: '⭐', label: 'Helhetsbetyg', value: tool.score.toFixed(1) },
    { emoji: '💰', label: 'Pris', value: tool.price },
    { emoji: '🏆', label: 'Bäst för', value: tool.bestFor },
    ...tool.criteria.map((c) => ({ emoji: criterionEmoji(c.label), label: c.label, value: `${c.score.toFixed(1)}/10` })),
  ];

  return (
    <div className={`overflow-hidden rounded-2xl border-2 bg-card ${isWinner ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-line'}`}>
      {/* Tool card header */}
      <div className="relative h-28">
        {tool.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tool.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENT[tool.category]}`} />
        )}
        <div className="absolute inset-0 bg-black/50" />
        {isWinner && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-white shadow">★ Rekommenderas</span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-black uppercase text-white ${tool.logo} ring-2 ring-white/40`} aria-hidden>
            {tool.name.charAt(0)}
          </span>
          <span className="text-lg font-black tracking-tight text-white">{tool.name}</span>
        </div>
      </div>

      <div className="p-5">
        {/* Big score + price */}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black leading-none tracking-tight text-indigo-600">{tool.score.toFixed(1)}</span>
          <span className="font-mono text-sm font-bold text-fg-subtle">/10</span>
        </div>
        <p className="mt-1.5 text-sm text-fg-muted">{tool.price}</p>

        {/* Detail rows */}
        <div className="mt-4 divide-y divide-line-subtle border-y border-line-subtle">
          {detailRows.map((r) => (
            <div key={r.label} className="flex items-start justify-between gap-3 py-2">
              <span className="flex items-center gap-2 text-sm text-fg-muted"><span aria-hidden>{r.emoji}</span>{r.label}</span>
              <span className="text-right text-sm font-bold text-fg">{r.value}</span>
            </div>
          ))}
        </div>

        {/* Top 3 användningsområden */}
        <p className="mb-2 mt-5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">Top 3 användningsområden</p>
        <div className="flex flex-col gap-1.5">
          {tool.useCases.slice(0, 3).map((u, i) => (
            <div key={u} className="flex items-center justify-between gap-3">
              <span className="text-sm text-fg-muted">{u}</span>
              <Stars n={starCount(tool.score, i)} />
            </div>
          ))}
        </div>

        {/* Kategoribedömningar */}
        <p className="mb-2 mt-5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">Kategoribedömningar</p>
        <div className="flex flex-col gap-1.5">
          {cats.map((c) => (
            <div key={c.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-fg-muted"><span aria-hidden>{c.emoji}</span>{c.label}</span>
              <span className="text-sm font-bold text-fg">{c.value.toFixed(1)}/5</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-6">
          {tool.ctaUrl ? (
            <a
              href={tool.ctaUrl}
              target="_blank"
              rel="nofollow noopener"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            >
              Prova {tool.ctaName} <span aria-hidden>→</span>
            </a>
          ) : (
            <span className="flex cursor-default items-center justify-center gap-2 rounded-xl bg-line-strong px-5 py-3 text-sm font-bold text-fg-subtle">
              Prova {tool.ctaName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
