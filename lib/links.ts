/**
 * Trailing-slash-normalisering för INTERNA länkar.
 *
 * Sajten kör next.config.mjs `trailingSlash: true`, så den kanoniska formen av
 * varje sida slutar med "/". DB-fältet `path` lagras dock utan avslutande slash
 * (t.ex. "/ai-verktyg/chatgpt"). Renderar man `href={a.path}` rakt av blir varje
 * intern länk ett 308-hopp för Googlebot (slash-lös → slash), vilket slösar
 * crawl-budget och låter intern länkkraft rinna genom en redirect i stället för
 * rakt till den kanoniska URL:en.
 *
 * `to()` lägger på slash-formen. Idempotent och säker: rör inte root, externa
 * URL:er, ankare/mailto eller query-/hash-länkar.
 */
export function to(href: string | null | undefined): string {
  if (!href) return '/';
  if (href === '/') return '/';
  if (/^(https?:)?\/\//i.test(href)) return href; // extern
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return href;
  const [pathPart, rest = ''] = href.split(/(?=[?#])/, 2);
  if (pathPart.endsWith('/')) return href;
  return `${pathPart}/${rest}`;
}

/**
 * Bygger en klick-spårad /go/[slug]-länk för en verktygsknapp ("Prova X" /
 * "Läs recension"). Loggas i tool_clicks (migration 0024) innan besökaren
 * 302:as vidare till den riktiga affiliate- eller fallback-URL:en.
 *
 * `source` identifierar VAR på sajten knappen satt (t.ex. "review-hero",
 * "hub-toplist") så klicken går att bryta ner per placering, inte bara per
 * verktyg.
 */
export function goLink(
  slug: string,
  targetUrl: string,
  opts: { source: string; isAffiliate: boolean },
): string {
  const params = new URLSearchParams({
    u: targetUrl,
    src: opts.source,
    aff: opts.isAffiliate ? '1' : '0',
  });
  return `/go/${encodeURIComponent(slug)}?${params.toString()}`;
}
