'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Hides the global header/ticker/footer/mobile-nav chrome for any path
 *  under /embed/*. Those pages are meant to be iframed inside an article
 *  (see app/embed/ai-eller-akta/page.tsx) — with the normal chrome they'd
 *  render the whole site nested inside itself. RootLayout has a single
 *  shared root for the entire app, so this is the lightest way to carve out
 *  a bare-page exception without restructuring every route into a second
 *  root-layout group. */
export function ChromeFrame({
  tickerTop,
  header,
  tickerMobile,
  mobileNav,
  footer,
  children,
}: {
  tickerTop: ReactNode;
  header: ReactNode;
  tickerMobile: ReactNode;
  mobileNav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith('/embed/');

  if (bare) {
    return <main>{children}</main>;
  }

  return (
    <>
      {tickerTop}
      {header}
      {tickerMobile}
      <main className="pb-[60px] md:pb-0">{children}</main>
      {mobileNav}
      {footer}
    </>
  );
}
