'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/schemas';

/** Expandable FAQ list. First item opens by default. Each row toggles
 *  independently — multiple can stay open. */
export function FaqAccordion({
  items,
  heading = 'Vanliga frågor',
  subheading,
}: {
  items: FaqItem[];
  heading?: string;
  subheading?: string;
}) {
  // Track open state per index. Start with first item expanded so the
  // section doesn't read as a wall of closed rows.
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  if (items.length === 0) return null;

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        FAQ
      </div>
      <h2 className="mb-2 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        {heading}
      </h2>
      {subheading && (
        <p className="mb-6 text-fg-subtle">{subheading}</p>
      )}
      <ul className="flex flex-col gap-3">
        {items.map((it, i) => {
          const isOpen = open.has(i);
          return (
            <li
              key={i}
              className="overflow-hidden rounded-lg border border-line bg-card"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-soft"
              >
                <span className="text-base font-bold tracking-tight text-fg sm:text-lg">
                  {it.question}
                </span>
                <span
                  aria-hidden
                  className={`shrink-0 font-mono text-xl text-indigo-600 transition-transform ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-line-subtle bg-page px-5 py-4 text-[15px] leading-relaxed text-fg-muted">
                  {it.answer}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
