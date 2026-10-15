'use client';

import { useEffect, useState } from 'react';

type PreferredSourceModule = {
  preferredSource: {
    init: (opts: { theme: 'light' | 'dark'; lang: string }) => void;
    addPreferredSource: () => void;
  };
};

/** Laddar Googles Preferred Sources-modul som ett rent browser-ESM-import —
 *  webpackIgnore så Next inte försöker bunta en extern URL, och ts-expect-error
 *  eftersom TypeScript inte kan typchecka en remote modulspecifik. */
function loadModule(): Promise<PreferredSourceModule> {
  // @ts-expect-error — extern ESM-URL, ingen typdeklaration finns.
  return import(/* webpackIgnore: true */ 'https://news.google.com/swg/js/v1/publisher.mjs');
}

/** Egen knapp mot Googles Preferred Sources-API, i stället för standard-
 *  knappen (som bara har fast text — "Lägg till i önskade listor" på
 *  svenska, otydligt för de flesta läsare). Manuellt styrd variant av
 *  samma funktion: https://developers.google.com/search/docs/appearance/preferred-sources
 *
 *  Gör inte sajten berättigad i sig — det avgör Google separat. */
export function PreferredSourceButton() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadModule()
      .then((mod) => {
        if (cancelled) return;
        mod.preferredSource.init({ theme: 'light', lang: 'sv' });
        setReady(true);
      })
      .catch(() => {
        // Tyst fel — knappen döljer sig själv om Google-skriptet inte går att ladda.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={() => loadModule().then((mod) => mod.preferredSource.addPreferredSource())}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-fg-subtle transition-colors hover:border-indigo-300 hover:text-indigo-700"
      title="Gör att AI-Magasinet visas oftare för dig i Googles nyheter och AI-svar"
    >
      <svg aria-hidden width="14" height="14" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13 17.7 9.5 24 9.5z" />
        <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 2.9-2.2 5.4-4.6 7.1l7.2 5.6c4.2-3.9 6.3-9.6 6.3-17.2z" />
        <path fill="#FBBC05" d="M10.5 19.3a14.3 14.3 0 0 0 0 9.4l-7.9 6.1a24 24 0 0 1 0-21.6l7.9 6.1z" />
        <path fill="#EA4335" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2 1.4-4.6 2.2-8.7 2.2-6.3 0-11.6-3.5-13.5-9.5l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
      </svg> Visa oss oftare i Google
    </button>
  );
}
