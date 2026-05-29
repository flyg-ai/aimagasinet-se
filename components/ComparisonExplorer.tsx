'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type ToolOpt = { token: string; name: string; category: string; logo: string };
export type CompCard = {
  slug: string;
  aName: string; bName: string;
  aLogo: string; bLogo: string;
  aScore: number; bScore: number;
  category: string;
};

/** Interactive hub: pick tool A + B from searchable, category-grouped
 *  dropdowns and jump to the head-to-head, plus a category-filterable grid
 *  of the curated comparisons. Client component — owns selection + filter
 *  state and navigates with the router. */
export function ComparisonExplorer({
  tools,
  comparisons,
  categories,
}: {
  tools: ToolOpt[];
  comparisons: CompCard[];
  categories: string[];
}) {
  const router = useRouter();
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);

  const sameTool = a !== null && a === b;
  const canCompare = !!a && !!b && !sameTool;

  function compare() {
    if (!canCompare) return;
    router.push(`/ai-verktyg/jamfor/${a}-eller-${b}`);
  }

  return (
    <div>
      {/* Selector card */}
      <div className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <ToolSelect label="Välj verktyg A" tools={tools} value={a} onChange={setA} accent="indigo" />
          <div className="hidden pb-3 sm:block">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line-strong bg-page font-mono text-xs font-black uppercase text-fg">
              VS
            </span>
          </div>
          <ToolSelect label="Välj verktyg B" tools={tools} value={b} onChange={setB} accent="cyan" />
        </div>

        <button
          type="button"
          onClick={compare}
          disabled={!canCompare}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-fg-subtle"
        >
          Jämför <span aria-hidden>→</span>
        </button>
        {sameTool && (
          <p className="mt-2 text-center text-sm text-rose-500">Välj två olika verktyg.</p>
        )}
      </div>

      {/* Curated comparisons + category filter */}
      <div className="mt-14">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Populära dueller
        </div>
        <h2 className="mb-6 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
          Alla jämförelser
        </h2>
        <ComparisonGrid comparisons={comparisons} categories={categories} />
      </div>
    </div>
  );
}

/* ─── Searchable, grouped tool select ──────────────────────────── */

function ToolSelect({
  label,
  tools,
  value,
  onChange,
  accent,
}: {
  label: string;
  tools: ToolOpt[];
  value: string | null;
  onChange: (token: string) => void;
  accent: 'indigo' | 'cyan';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = tools.find((t) => t.token === value) ?? null;
  const accentRing = accent === 'indigo' ? 'focus-within:border-indigo-400' : 'focus-within:border-cyan-400';

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cats = Array.from(new Set(tools.map((t) => t.category)));
    return cats
      .map((category) => ({
        category,
        items: tools.filter((t) => t.category === category && t.name.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [tools, query]);

  return (
    <div className="relative" ref={ref}>
      <label className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-2.5 rounded-xl border border-line bg-page px-4 py-3 text-left transition-colors hover:border-line-strong ${accentRing}`}
      >
        {selected ? (
          <>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black uppercase text-white ${selected.logo}`} aria-hidden>
              {selected.name.charAt(0)}
            </span>
            <span className="min-w-0 flex-1 truncate font-bold tracking-tight text-fg">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-fg-subtle">Sök verktyg…</span>
        )}
        <span aria-hidden className={`shrink-0 text-fg-subtle transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 max-h-[320px] w-full overflow-hidden rounded-xl border border-line bg-card shadow-xl shadow-black/10">
          <div className="border-b border-line-subtle p-2">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök…"
              className="w-full rounded-lg border border-line bg-page px-3 py-2 text-sm text-fg outline-none focus:border-indigo-400"
            />
          </div>
          <div className="max-h-[248px] overflow-y-auto py-1">
            {groups.length === 0 && (
              <p className="px-4 py-3 text-sm text-fg-subtle">Inga träffar.</p>
            )}
            {groups.map((g) => (
              <div key={g.category}>
                <div className="px-3 pb-1 pt-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                  {g.category}
                </div>
                {g.items.map((t) => (
                  <button
                    key={t.token}
                    type="button"
                    onClick={() => { onChange(t.token); setOpen(false); setQuery(''); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-soft"
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black uppercase text-white ${t.logo}`} aria-hidden>
                      {t.name.charAt(0)}
                    </span>
                    <span className="truncate text-sm font-semibold text-fg">{t.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Category-filterable comparison grid ──────────────────────── */

function ComparisonGrid({ comparisons, categories }: { comparisons: CompCard[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>('Alla');
  const chips = ['Alla', ...categories];
  const shown = filter === 'Alla' ? comparisons : comparisons.filter((c) => c.category === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const active = chip === filter;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setFilter(chip)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors ${
                active
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-line bg-card text-fg-muted hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <Link
            key={c.slug}
            href={`/ai-verktyg/jamfor/${c.slug}`}
            className="group flex flex-col rounded-2xl border border-line bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <Side name={c.aName} logo={c.aLogo} score={c.aScore} color="text-indigo-600" />
              <span className="shrink-0 font-mono text-xs font-black uppercase tracking-tight text-fg-subtle">vs</span>
              <Side name={c.bName} logo={c.bLogo} score={c.bScore} color="text-cyan-600" align="right" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="rounded-full bg-soft px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                {c.category}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600 transition-transform group-hover:translate-x-0.5">
                Jämför <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function Side({
  name, logo, score, color, align = 'left',
}: {
  name: string; logo: string; score: number; color: string; align?: 'left' | 'right';
}) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2.5 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black uppercase text-white ${logo}`} aria-hidden>
        {name.charAt(0)}
      </span>
      <div className="min-w-0">
        <div className="truncate text-sm font-black tracking-tight text-fg">{name}</div>
        <div className={`font-mono text-[11px] font-bold tabular-nums ${color}`}>{score.toFixed(1)}/10</div>
      </div>
    </div>
  );
}
