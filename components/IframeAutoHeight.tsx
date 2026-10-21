'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const MESSAGE_TYPE = 'aimagasinet-embed-resize';

/** Listens for height reports from same-origin embed iframes (see
 *  app/embed/*) and resizes the matching <iframe> so there's never dead
 *  space or clipped content below a fixed pixel height. Mounted once,
 *  globally, in RootLayout — harmless on pages with no embed iframes. */
export function IframeAutoHeight() {
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || e.data.type !== MESSAGE_TYPE) return;
      const iframes = document.querySelectorAll('iframe');
      for (const frame of Array.from(iframes)) {
        if (frame.contentWindow === e.source) {
          frame.style.height = `${e.data.height}px`;
          break;
        }
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return null;
}

/** Wrap an /embed/* page's content in this. Measures the WRAPPED element's
 *  own natural height via ResizeObserver — not document/body height, which
 *  is pinned to at least 100vh by RootLayout's `min-h-screen` body class and
 *  so can only ever mirror the iframe's current height, never shrink below
 *  it. Reports on mount and on every subsequent size change (round change,
 *  answer reveal, image load, viewport resize). */
export function EmbedAutoHeight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function report() {
      try {
        window.parent.postMessage(
          { type: MESSAGE_TYPE, height: el!.getBoundingClientRect().height },
          '*',
        );
      } catch {
        // Not embedded, or cross-origin parent — safe to ignore.
      }
    }

    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
