'use client';

import { useEffect, useMemo, useState } from 'react';

export type QuizRound = {
  id: string;
  imageUrl: string;
  isAI: boolean;
  /** Revealed after the reader answers — tool used, or photo source. */
  explanation: string;
};

/** Fisher–Yates, seeded per mount via useState initializer so every page
 *  load gets a fresh order without re-shuffling on re-render. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function resultTier(score: number, total: number): { heading: string; text: string } {
  const pct = score / total;
  if (pct >= 0.8) {
    return {
      heading: 'Skarpt öga',
      text: 'Du missade nästan ingenting. De flesta klarar inte det här.',
    };
  }
  if (pct >= 0.5) {
    return {
      heading: 'Hyfsat',
      text: 'Bättre än slumpen, men AI-bilderna lurade dig fler gånger än du kanske tror.',
    };
  }
  return {
    heading: 'AI:n vann den här rundan',
    text: 'Du låg under slumpen. Inget att skämmas för — moderna AI-bilder är gjorda för att lura exakt den här typen av snabba ögonkast.',
  };
}

export function AiOrRealQuiz({ rounds }: { rounds: QuizRound[] }) {
  // Starts in the server-rendered (unshuffled) order and shuffles once on
  // the client after mount — shuffling in the useState initializer runs
  // during SSR too, where Math.random() picks a different order than the
  // client's hydration pass, causing a hydration mismatch on every <img src>.
  const [order, setOrder] = useState(rounds);
  useEffect(() => {
    setOrder(shuffle(rounds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);

  const total = order.length;
  const current = order[index];
  const done = index >= total;

  const progressPct = useMemo(() => Math.round((Math.min(index, total) / total) * 100), [index, total]);

  function choose(guessAI: boolean) {
    if (answer !== null) return;
    setAnswer(guessAI);
    if (guessAI === current.isAI) setScore((s) => s + 1);
  }

  function next() {
    setAnswer(null);
    setIndex((i) => i + 1);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setAnswer(null);
    // Re-shuffle by reloading the component's initial state is awkward with
    // useState(() => ...); simplest reliable reset is a full page reload.
    window.location.reload();
  }

  if (done) {
    const tier = resultTier(score, total);
    const shareText = `Jag fick ${score}/${total} på AI-Magasinets "AI eller äkta?"-quiz. Klarar du fler?`;
    return (
      <div className="rounded-2xl border border-line bg-card p-6 text-center sm:p-10">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Resultat
        </div>
        <div className="text-5xl font-black tracking-tight text-fg sm:text-6xl">
          {score}/{total}
        </div>
        <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-fg">
          {tier.heading}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-fg-subtle">{tier.text}</p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={restart}
            className="rounded-xl border border-line bg-page px-5 py-2.5 text-sm font-bold text-fg transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            Testa igen
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ text: shareText, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(`${shareText} ${window.location.href}`);
              }
            }}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700"
          >
            Dela resultatet
          </button>
        </div>
      </div>
    );
  }

  const correct = answer !== null && answer === current.isAI;

  return (
    <div className="rounded-2xl border border-line bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
        <span>Bild {index + 1} av {total}</span>
        <span>{score} rätt hittills</span>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-soft">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.imageUrl}
          alt="Gissa: AI-genererad eller äkta?"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      {answer === null ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => choose(true)}
            className="rounded-xl border-2 border-line bg-page px-4 py-4 text-base font-bold text-fg transition-colors hover:border-indigo-500 hover:bg-indigo-50"
          >
            AI-genererad
          </button>
          <button
            type="button"
            onClick={() => choose(false)}
            className="rounded-xl border-2 border-line bg-page px-4 py-4 text-base font-bold text-fg transition-colors hover:border-indigo-500 hover:bg-indigo-50"
          >
            Äkta foto
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div
            className={`rounded-xl border-2 p-4 ${
              correct
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-rose-300 bg-rose-50 text-rose-900'
            }`}
          >
            <div className="font-black uppercase tracking-tight">
              {correct ? 'Rätt!' : 'Fel'} — det här var {current.isAI ? 'AI-genererat' : 'ett äkta foto'}.
            </div>
            <p className="mt-1 text-sm opacity-90">{current.explanation}</p>
          </div>
          <button
            type="button"
            onClick={next}
            className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700"
          >
            {index + 1 < total ? 'Nästa bild' : 'Se resultat'}
          </button>
        </div>
      )}
    </div>
  );
}
