import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 410 Gone för WP-skräp som Google Search Console rapporterar som 404.
 *
 * 410 (i stället för 404) signalerar att resursen är permanent borttagen, vilket
 * får Google att droppa URL:en ur indexet snabbare än ett 404. Mönsterbaserat så
 * vi slipper rad-för-rad-regler för varje gammal wp-/feed-/paginerings-URL.
 *
 * ORDNING: next.config.mjs `redirects()` körs FÖRE middleware i Next.js
 * request-pipelinen (headers → redirects → middleware → routes). Därför 301:ar
 * C-klassade källor som /category/samhalle-paverkan/ i config och når aldrig hit.
 * REDIRECTED-setet nedan är ett bälte-och-hängslen-skydd ifall den ordningen
 * någon gång skulle ändras — vi 410:ar aldrig en URL som har en 301.
 */

const GONE: RegExp[] = [
  /^\/wp-/i, // wp-content, wp-admin, wp-includes, wp-json, wp-login, wp-emoji…
  /^\/author(\/|$)/i, // WP author-arkiv
  /^\/category(\/|$)/i, // WP engelsk taxonomi (svenska /kategori/ är live)
  /(^|\/)feed\/?$/i, // RSS-feeds: /x/feed/ och /feed/
  /\/page\/\d+\/?$/i, // paginering: /page/N och .../page/N
  /^\/hello-world\/?$/i, // WP-standardinlägget
  /^\/\d+\/?$/, // bart numeriskt WP attachment/page-id, t.ex. /10
];

// C-klassade /category/-källor som har en 301 i next.config.mjs.
const REDIRECTED = new Set(['/category/samhalle-paverkan', '/category/samhalle-paverkan/']);

// Avpublicerade verktygssidor — 410 Gone. FAKE (påhittade varumärken) eller
// nedlagda produkter; se uppdiktade-verktyg.md. Matchas på SISTA path-segmentet
// så även gamla yrke-/ekonomi-URL:er som pekade hit fångas (deras 301-regler
// filtreras bort i next.config.mjs så de faller hit i stället för att 301:a).
const DEAD_TOOL_SLUGS = new Set(['accountingai', 'accountingai-pro', 'reconcile-ai', 'height']);

function gone() {
  return new NextResponse('410 Gone', {
    status: 410,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  });
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (REDIRECTED.has(pathname)) return NextResponse.next();
  const lastSeg = pathname.replace(/\/+$/, '').split('/').pop() ?? '';
  if (DEAD_TOOL_SLUGS.has(lastSeg)) return gone();
  if (GONE.some((re) => re.test(pathname))) return gone();
  return NextResponse.next();
}

export const config = {
  // Kör på allt utom Next-interna assets; GONE-mönstren avgör vad som 410:as.
  matcher: ['/((?!_next/).*)'],
};
