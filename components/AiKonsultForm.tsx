'use client';

import { useState } from 'react';

/** Formulär för att låta redaktionen förmedla en förfrågan till AI-konsulter.
 *  Upplysningen visas alltid före knappen. Kryssrutan är inte förkryssad. */
export default function AiKonsultForm({ city = 'Stockholm', presetNeed = '' }: { city?: string; presetNeed?: string }) {
  const [need, setNeed] = useState(presetNeed);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [forward, setForward] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setState('sending');
    try {
      const res = await fetch('/api/ai-konsult-forfragan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ need, email, consent: true, forward, city }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h3 className="mt-6 text-2xl font-semibold text-fg">Tack! Din förfrågan är skickad.</h3>
        <p className="mt-2 text-fg/70">Vi går igenom ditt behov och återkommer på den e-postadress du angav.</p>
        <ol className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-2">
          <li className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Skickat</p>
            <p className="mt-1 font-medium text-fg">Vi har tagit emot din förfrågan.</p>
          </li>
          <li className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-fg/50">Nästa steg</p>
            <p className="mt-1 font-medium text-fg">Vi går igenom ert behov och hör av oss.</p>
          </li>
        </ol>
        <p className="mt-6 text-sm text-fg/60">Om du vill, förmedlar vi kontakten vidare till en AI-konsult. Du bestämmer själv vad som händer härnäst.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-indigo-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
      <h2 className="text-xl font-semibold text-fg">Hitta rätt AI-konsult. Kontakta oss</h2>
      <p className="mt-2 text-sm text-fg/80">
        Beskriv kort vad ni vill uppnå, så hjälper vi er hitta rätt bolag i listan.
        Vi kan förmedla kontakten vidare till AI-konsulter.
      </p>

      <label className="mt-5 block text-sm font-medium text-fg" htmlFor="need">Vad behöver ni hjälp med?</label>
      <textarea
        id="need"
        required
        minLength={10}
        maxLength={2000}
        rows={4}
        value={need}
        onChange={(e) => setNeed(e.target.value)}
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-fg dark:border-white/15 dark:bg-white/5"
        placeholder="Till exempel: vi vill sortera inkommande kundärenden och föreslå svar."
      />

      <label className="mt-4 block text-sm font-medium text-fg" htmlFor="email">Din e-post</label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-fg dark:border-white/15 dark:bg-white/5"
        placeholder="namn@foretag.se"
      />

      <label className="mt-5 flex items-start gap-3 text-sm text-fg/80">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>
          Jag godkänner att AI-Magasinet använder min e-postadress och mitt meddelande för att svara på förfrågan.
        </span>
      </label>

      <label className="mt-4 flex items-start gap-3 text-sm text-fg/80">
        <input
          type="checkbox"
          checked={forward}
          onChange={(e) => setForward(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span>
          Jag godkänner att AI-Magasinet förmedlar min e-postadress och mitt meddelande till AI-konsulter som kan hjälpa mig. Valfritt.
        </span>
      </label>

      <button
        type="submit"
        disabled={!consent || state === 'sending'}
        className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-600/40"
      >
        {state === 'sending' ? 'Skickar…' : 'Skicka förfrågan →'}
      </button>
      {state === 'error' && (
        <p className="mt-3 text-sm text-red-700">Något gick fel. Försök igen om en stund.</p>
      )}
    </form>
  );
}
