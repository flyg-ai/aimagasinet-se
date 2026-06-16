'use client';

import { useState } from 'react';

/** The only interactive (client) part of the share row. Copies the canonical
 *  article URL via navigator.clipboard and flips the label to "Kopierad!" for
 *  ~2s. No SDK, no tracking. The label has a fixed min-width so the flip never
 *  reflows the row (no layout shift). */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context / permission denied) — no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Kopiera länk till artikeln"
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border bg-card px-3.5 text-sm font-medium transition-colors ${
        copied
          ? 'border-indigo-300 text-indigo-700'
          : 'border-line text-fg-muted hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )}
      <span className="inline-block min-w-[4.75rem] text-left">
        {copied ? 'Kopierad!' : 'Kopiera länk'}
      </span>
    </button>
  );
}
