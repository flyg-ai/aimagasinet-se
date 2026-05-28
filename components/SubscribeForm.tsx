'use client';

import { useState } from 'react';

type Variant = 'banner' | 'compact';

type Props = {
  /** "banner" = full inline form for the homepage NewsletterBanner.
   *  "compact" = small floating button + popover used by the header CTA. */
  variant?: Variant;
  /** Optional CTA label override. */
  ctaLabel?: string;
};

type Status = 'idle' | 'loading' | 'ok' | 'already' | 'error';

/** Newsletter form that POSTs to /api/subscribe. Shows inline status
 *  feedback after submit. Used in two places:
 *   - NewsletterBanner (variant="banner") — large inline form
 *   - SiteNav (variant="compact") — small popover-style trigger */
export function SubscribeForm({ variant = 'banner', ctaLabel = 'Prenumerera' }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const code = (data as { error?: string }).error ?? 'unknown';
        const msg =
          code === 'invalid_email' ? 'Det där såg inte ut som en giltig e-postadress.'
          : code === 'db_error'    ? 'Kunde inte spara just nu — försök igen om en stund.'
          : 'Något gick fel — försök igen.';
        setStatus('error');
        setMessage(msg);
        return;
      }
      const { alreadySubscribed, emailSent } = data as { alreadySubscribed?: boolean; emailSent?: boolean };
      if (alreadySubscribed) {
        setStatus('already');
        setMessage('Du är redan på listan — vi hörs snart.');
      } else if (emailSent) {
        setStatus('ok');
        setMessage('Tack! Vi har skickat ett välkomstmail till dig.');
      } else {
        setStatus('ok');
        setMessage('Tack! Du är med på listan.');
      }
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Något gick fel.');
    }
  }

  const isBusy = status === 'loading';

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setPopoverOpen((v) => !v)}
          aria-expanded={popoverOpen}
          aria-controls="subscribe-popover"
          className="hidden rounded-md bg-accent px-3.5 py-2 text-sm font-bold uppercase tracking-wider text-accent-fg transition-colors hover:bg-accent-hover sm:inline-block"
        >
          {ctaLabel}
        </button>
        {popoverOpen && (
          <div
            id="subscribe-popover"
            className="absolute right-0 top-full z-40 mt-2 w-80 rounded-lg border border-line bg-white p-4 shadow-xl"
          >
            <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-700">
              ✉ Nyhetsbrev
            </div>
            <p className="mb-3 text-xs text-zinc-600">
              Svenska AI-nyheter och nya verktyg, en gång i veckan.
            </p>
            <form onSubmit={submit} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.se"
                disabled={isBusy}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
              >
                {isBusy ? 'Skickar…' : 'Prenumerera'}
              </button>
            </form>
            {message && <StatusLine status={status} message={message} />}
          </div>
        )}
      </div>
    );
  }

  // Banner variant — inline form for homepage.
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:max-w-lg">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.se"
          disabled={isBusy}
          className="flex-1 rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBusy ? (
            <>
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Skickar…
            </>
          ) : (
            <>
              {ctaLabel} <span aria-hidden>→</span>
            </>
          )}
        </button>
      </form>
      {message && <StatusLine status={status} message={message} />}
    </div>
  );
}

function StatusLine({ status, message }: { status: Status; message: string }) {
  const tone =
    status === 'ok'      ? 'text-emerald-700'
    : status === 'already' ? 'text-zinc-700'
    : status === 'error'   ? 'text-rose-700'
    : 'text-zinc-500';
  return (
    <p role="status" aria-live="polite" className={`text-xs font-medium ${tone}`}>
      {message}
    </p>
  );
}
