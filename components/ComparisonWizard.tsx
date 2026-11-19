'use client';

import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { resolveToken } from '@/lib/compare';
import { PURPOSE_TAXONOMY } from '@/lib/compare-purposes';

export type CatalogTool = {
  token: string;
  name: string;
  /** Hub-slug ("ai-bild-verktyg", "projektledning", ...) — hela den riktiga
   *  verktygsbanken, inte bara de sex ursprungliga kategorierna. */
  category: string;
  categoryLabel: string;
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

export type CatalogCategory = { slug: string; label: string; count: number };

type Step = 1 | 2 | 3 | 'result';

/** Deterministisk gradient-fargsattning for en kategori utan egen bild —
 *  samma princip som LOGO_COLORS i lib/review-profiles.ts, men for bakgrunder.
 *  Nagra tiotals kategorier ska inte krava en handskriven farg var. */
const GRADIENT_PALETTE = [
  'from-indigo-500 to-violet-700', 'from-fuchsia-500 to-rose-700',
  'from-cyan-500 to-sky-700', 'from-zinc-700 to-zinc-900',
  'from-amber-500 to-orange-700', 'from-emerald-500 to-teal-700',
  'from-blue-500 to-indigo-800', 'from-rose-500 to-pink-700',
  'from-teal-500 to-cyan-800', 'from-orange-500 to-red-700',
  'from-violet-500 to-purple-800', 'from-lime-600 to-emerald-800',
];
function categoryGradient(category: string): string {
  let h = 0;
  for (let i = 0; i < category.length; i++) h = (h * 31 + category.charCodeAt(i)) >>> 0;
  return GRADIENT_PALETTE[h % GRADIENT_PALETTE.length];
}

const BUDGET: { slug: string; label: string }[] = [
  { slug: 'gratis', label: 'Gratis' },
  { slug: 'budget', label: 'Budget (under 20 USD/mån)' },
  { slug: 'professionell', label: 'Professionell (20+ USD/mån)' },
  { slug: 'egal', label: 'Spelar ingen roll' },
];

const MAX = 4;

/** Syftesalternativ for steg 2 + resultatvyn. Kategorier med en kurerad,
 *  research-baserad taxonomi (lib/compare-purposes.ts) visar den istallet
 *  for de valda verktygens egna useCases-rader, som ar for inkonsekventa
 *  mellan verktyg for att fungera som ett rent syftesval. Kategorier utan
 *  egen taxonomi faller fortfarande tillbaka pa den gamla useCases-unionen. */
function purposeOptionsForTools(tools: CatalogTool[]): { slug: string; label: string }[] {
  const seen = new Set<string>();
  const out: { slug: string; label: string }[] = [];
  const curatedCats = Array.from(new Set(tools.map((t) => t.category).filter((c) => PURPOSE_TAXONOMY[c])));
  for (const cat of curatedCats) {
    for (const o of PURPOSE_TAXONOMY[cat]) {
      if (!seen.has(o.slug)) { seen.add(o.slug); out.push(o); }
    }
  }
  for (const t of tools) {
    if (PURPOSE_TAXONOMY[t.category]) continue;
    for (const uc of t.useCases) {
      if (!seen.has(uc)) { seen.add(uc); out.push({ slug: uc, label: uc }); }
    }
  }
  return out;
}

/** Primary CTA — saturated indigo, real elevation, inviting even when
 *  disabled (muted indigo, never grey-dead). */
const CTA_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:shadow-none disabled:hover:bg-indigo-300';

export function ComparisonWizard({ catalog, categories }: { catalog: CatalogTool[]; categories: CatalogCategory[] }) {
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
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.slug ?? '');

  const [rec, setRec] = useState<{ winner: string; recommendation: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const currentKey = JSON.stringify([selected, syfte, budget]);
  const dirty = generatedKey !== null && generatedKey !== currentKey;

  // "Vad ska du anvanda det till" byggs av de VALDA VERKTYGENS EGNA riktiga
  // anvandningsomraden (t.ex. Midjourney: konceptkonst/reklamvisualer/
  // bokomslag) istallet for en fast lista med atta generiska syften — den
  // skulle aldrig passa alla ~37 kategorier (bokforing och bildgenerering
  // har inget gemensamt "syfte"). Ingen fabricering: det ar samma text som
  // redan star i respektive recension. Byter man verktyg sa ett tidigare
  // valt syfte inte langre finns bland alternativen, plockas det bort.
  const purposeOptions = useMemo(() => {
    const tools = selected.map((tok) => catalog.find((c) => c.token === tok)).filter((t): t is CatalogTool => !!t);
    return purposeOptionsForTools(tools);
  }, [selected, catalog]);
  useEffect(() => {
    setSyfte((prev) => {
      const allowed = new Set(purposeOptions.map((o) => o.slug));
      const next = prev.filter((s) => allowed.has(s));
      return next.length === prev.length ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purposeOptions]);

  function runGenerate() {
    if (selected.length < 2) return;
    setGeneratedKey(JSON.stringify([selected, syfte, budget]));
    setLoading(true); setErr(false); setRec(null);
    fetch('/api/compare-recommend', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tools: selected, syfte, budget }),
    })
      .then((r) => r.json())
      .then((d) => { if (d && d.winner) setRec(d); else setErr(true); })
      .catch(() => setErr(true))
      .finally(() => setLoading(false));
  }

  // Rekommendationen genereras INTE automatiskt. Resultatsteget nas ocksa
  // genom att ladda en URL med ?tools=, sa en autofyrning kostade ett
  // Haiku-anrop per uppdatering, delning, bakatknapp och crawlerbesok av
  // samma lank — utan att nagon bett om det. Verktygskorten och betygen
  // renderas anda; anropet sker forst nar anvandaren trycker pa knappen.

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
    setGeneratedKey(null); setStep(1); setActiveCat(categories[0]?.slug ?? '');
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
            categories={categories}
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
            subtitle="Välj en eller flera av de valda verktygens egna användningsområden — det hjälper oss ge en vassare rekommendation."
            options={purposeOptions}
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
  catalog, categories, selected, activeCat, setActiveCat, onToggle, onNext,
}: {
  catalog: CatalogTool[];
  categories: CatalogCategory[];
  selected: string[];
  activeCat: string;
  setActiveCat: (c: string) => void;
  onToggle: (token: string) => void;
  onNext: () => void;
}) {
  const full = selected.length >= MAX;
  const [catFilter, setCatFilter] = useState('');
  const visibleCategories = catFilter.trim()
    ? categories.filter((c) => c.label.toLowerCase().includes(catFilter.trim().toLowerCase()))
    : categories;
  const tools = catalog.filter((t) => t.category === activeCat);

  return (
    <StepPanel
      current={1}
      title="Välj verktyg att jämföra"
      subtitle={`Markera 2–4 verktyg. ${categories.length} kategorier, ${catalog.length} verktyg totalt — sök eller bläddra nedan.`}
    >
      {/* ~37 riktiga kategorier (hela verktygsbanken, inte bara de sex
          ursprungliga) ryms inte som en fast flik-grid — ett sokfalt filtrerar
          flikraden, som i sig ar en horisontellt skrollbar rad piller
          (samma monster som PillRow) istallet for en grid som skulle bli en
          vagg av rutor. Antalet valda som prick i hornet, som innan. */}
      <div className="mb-4 relative">
        <input
          type="search"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          placeholder="Sök kategori (t.ex. bild, bokföring, HR...)"
          className="w-full rounded-xl border border-line bg-card px-4 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div
        role="tablist"
        aria-label="Verktygskategori"
        className="mb-7 flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1"
      >
        {visibleCategories.map((c) => {
          const active = c.slug === activeCat;
          const count = selected.filter((tok) => catalog.find((t) => t.token === tok)?.category === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCat(c.slug)}
              className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-4 py-2 text-left text-sm font-bold transition-all ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                  : 'border-line bg-card text-fg hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              {c.label}
              <span className={`font-mono text-[10px] font-normal ${active ? 'text-indigo-200' : 'text-fg-subtle'}`}>
                {c.count}
              </span>
              {count > 0 && (
                <span
                  aria-label={`${count} valda`}
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    active ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
        {visibleCategories.length === 0 && (
          <p className="px-1 py-2 text-sm text-fg-subtle">Ingen kategori matchar &quot;{catFilter}&quot;.</p>
        )}
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

      {/* bg-card/95 gav genomskinlig rad: --bg-card ar en fardig farg
          (#ffffff), inte kanalvarden, sa Tailwinds opacitetsmodifierare
          bygger ogiltig CSS som webblasaren slanger — resultatet blev
          rgba(0,0,0,0) och verktygskorten syntes rakt igenom. bg-soft ar
          opak i bada temana (#f4f4f5 / #18181b).

          bottom-4 lade raden bakom MobileBottomNav, som ar fixed bottom-0
          med hojd 60 px och z-50. Pa mobil lyfts den darfor over navet;
          fran md: finns inget nav och 16 px racker. */}
      <div className="sticky bottom-[76px] z-30 mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line-strong bg-soft p-4 shadow-lg shadow-black/10 md:bottom-4">
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
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient(tool.category)}`} />
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

/** "Kategoribedömningar" används att vara en FAST femaxlig tabell
 *  (Skrivande/Kodning/Kreativitet/Analys/Företag) med påhittade baivärden
 *  skalade med helhetsbetyget — fel axlar för en bildjämförelse (ingen
 *  "Bildgenerering"-rad) och siffror som inte kom från recensionen. Riktiga,
 *  kategorianpassade kriterier finns redan per verktyg i tool.criteria
 *  (textverktyg får textkvalitet/svenska, videoverktyg får visuell
 *  kvalitet/promptföljsamhet osv.) — använd dem i stället för att hitta
 *  på nya. /10-betyget skalas till /5 för stjärnformatet. */
function criteriaAsStars(criteria: { label: string; score: number }[]) {
  return criteria.map((c) => ({
    emoji: criterionEmoji(c.label),
    label: c.label,
    value: Math.max(1, Math.min(5, Math.round((c.score / 2) * 10) / 10)),
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
  const purposeOptions = purposeOptionsForTools(tools);
  // "Se detaljerad jamforelse" lankar bara till en av de 29 fardigskrivna
  // SEO-duellsidorna — de tacker bara verktyg i den gamla COMPARE_TOOLS-
  // listan, inte hela banken. Lanken visas darfor bara nar bada verktygen
  // faktiskt har en sadan sida, annars 404:ar den.
  const hasDetailedDuel = tools.length === 2 && !!resolveToken(tools[0].token) && !!resolveToken(tools[1].token);

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
      {hasDetailedDuel && (
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
          <PillRow options={purposeOptions} selected={syfte} onToggle={onToggleSyfte} />
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
  const cats = criteriaAsStars(tool.criteria);
  const detailRows: { emoji: string; label: string; value: string }[] = [
    { emoji: '⭐', label: 'Helhetsbetyg', value: tool.score.toFixed(1) },
    { emoji: '💰', label: 'Pris', value: tool.price },
    { emoji: '🏆', label: 'Bäst för', value: tool.bestFor },
  ];

  return (
    <div className={`overflow-hidden rounded-2xl border-2 bg-card ${isWinner ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-line'}`}>
      {/* Tool card header */}
      <div className="relative h-28">
        {tool.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tool.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient(tool.category)}`} />
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
