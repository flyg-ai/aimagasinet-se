'use client';

import { useState } from 'react';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

const SUBJECTS = [
  'Tips på AI-verktyg att testa',
  'Idé för en guide eller artikel',
  'Annonsering & samarbeten',
  'Rättelse eller felrapport',
  'Annat',
];

/** Client-side contact form. POSTs /api/contact; on 503 (no RESEND_API_KEY
 *  configured server-side) falls back to a mailto: link so the user's
 *  pre-filled message opens in their mail client. */
export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setStatus({ kind: 'error', message: 'Fyll i alla fält så hör vi av oss.' });
      return;
    }
    setStatus({ kind: 'sending' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      // Server has no RESEND_API_KEY → fall back to mailto:
      if (res.status === 503) {
        const data = await res.json().catch(() => ({ recipient: 'kontakt@aimagasinet.se' }));
        const recipient = data.recipient || 'kontakt@aimagasinet.se';
        const body = `Från: ${name} <${email}>\n\n${message}`;
        const href =
          `mailto:${recipient}` +
          `?subject=${encodeURIComponent(`[Kontakt] ${subject}`)}` +
          `&body=${encodeURIComponent(body)}`;
        window.location.href = href;
        // Treat as sent — the user's mail client now has everything.
        setStatus({ kind: 'sent' });
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Något gick fel.' }));
        setStatus({ kind: 'error', message: data.error || 'Något gick fel. Försök igen.' });
        return;
      }

      setStatus({ kind: 'sent' });
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setStatus({ kind: 'error', message: 'Kunde inte nå servern. Försök igen om en stund.' });
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
          Tack!
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tight text-fg">
          Meddelandet är på väg
        </h3>
        <p className="mt-3 text-fg-muted">
          Vi svarar inom en arbetsdag. Om ditt e-postprogram inte öppnades
          automatiskt — skicka direkt till{' '}
          <a href="mailto:kontakt@aimagasinet.se" className="font-bold text-emerald-700 hover:underline">
            kontakt@aimagasinet.se
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-card px-5 py-2 text-sm font-bold uppercase tracking-wider text-emerald-700 hover:border-emerald-400"
        >
          Skicka ett till
        </button>
      </div>
    );
  }

  const sending = status.kind === 'sending';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-line bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            Namn
          </label>
          <input
            id="name"
            type="text"
            placeholder="Förnamn Efternamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            disabled={sending}
            className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            E-post
          </label>
          <input
            id="email"
            type="email"
            placeholder="namn@företag.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={200}
            disabled={sending}
            className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          Ämne
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          disabled={sending}
          className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
        >
          <option value="" disabled>Välj ett ämne</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
          Meddelande
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="Berätta lite mer om vad det gäller…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={5000}
          disabled={sending}
          className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
        />
      </div>

      {status.kind === 'error' && (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {status.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          ⓘ Vi svarar inom en arbetsdag
        </span>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? 'Skickar…' : 'Skicka'} <span aria-hidden>›</span>
        </button>
      </div>
    </form>
  );
}
