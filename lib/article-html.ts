/**
 * Förvandlar fristående interna länk-paragrafer i artikel-HTML till snygga
 * kort. Mål: en <p> vars enda innehåll är en länk till en intern verktygs-/
 * hubsida (/ai-verktyg/<slug> eller /ai-video/<slug>) renderas som ett kort
 * (verktygsnamn + "Läs mer →") i stället för en vanlig inline-länk.
 *
 * Endast block-länkar (paragraf = enbart länk) omvandlas — inline-länkar mitt
 * i en mening lämnas orörda. Kortet får class="not-prose" så prose-stilarna
 * inte rör det.
 */

// <p> ... <a href="/ai-verktyg/... | /ai-video/..."> text </a> ... </p>
// där paragrafen inte innehåller annan text än länken.
const BLOCK_LINK = /<p>\s*<a\s+href="((?:https?:\/\/(?:www\.)?aimagasinet\.se)?\/ai-(?:verktyg|video)\/[^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/p>/gi;

function card(href: string, label: string): string {
  return (
    `<a href="${href}" class="not-prose group my-7 flex items-center justify-between gap-4 rounded-xl border border-line bg-card px-5 py-4 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">` +
    `<span class="flex min-w-0 items-center gap-3">` +
    `<span aria-hidden class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">↗</span>` +
    `<span class="truncate text-base font-bold text-fg group-hover:text-indigo-700">${label}</span>` +
    `</span>` +
    `<span class="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-600">Läs mer →</span>` +
    `</a>`
  );
}

export function toolLinkCards(html: string): string {
  return html.replace(BLOCK_LINK, (match, href: string, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!label) return match;
    return card(href, label);
  });
}
