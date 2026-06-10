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
