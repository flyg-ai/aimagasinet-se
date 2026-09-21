/**
 * Brödtexten: Markdown (som ChatGPT ger när man kopierar) eller HTML in,
 * sanerad HTML ut. Saneringen sker alltid på servern, med en allowlist, oavsett
 * vad som klistrats in.
 */
import 'server-only';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { adminConfig } from './config';

/** Ser texten ut som HTML (minst ett blockelement) behandlas den som HTML,
 *  annars som Markdown. */
const HTML_BLOCK_RE = /<(p|h[1-6]|ul|ol|li|table|blockquote|div|br)\b[^>]*>/i;

export function looksLikeHtml(input: string): boolean {
  return HTML_BLOCK_RE.test(input);
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Absoluta länkar till den egna sajten görs relativa, så att de räknas som
 *  interna länkar och inte pekar på en viss värd. */
function localize(href: string): string {
  const base = adminConfig.siteUrl.replace(/\/$/, '');
  const variants = [base, base.replace('https://', 'https://www.'), base.replace('https://', 'http://'), base.replace('https://', 'http://www.')];
  for (const b of variants) {
    if (href === b) return '/';
    if (href.startsWith(`${b}/`)) return href.slice(b.length);
  }
  return href;
}

/** Klasser som får vara kvar: `not-prose` och sajtens egna artikelblock
 *  (topplista, jämförelsetabell, täckningsmarkörer — se globals.css). Allt
 *  annat tas bort. */
const BLOCK_CLASSES = ['not-prose', 'toplist', 'toplist-*', 'compare-table', 'compare-table-*', 'compare-group', 'cov', 'cov-*', 'is-first'];

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'blockquote', 'br',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Bara för artikelblocken ovan; utan tillåten klass blir de nakna omslag.
    'div', 'span'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedClasses: Object.fromEntries(
    ['p', 'h3', 'ul', 'li', 'a', 'table', 'tr', 'td', 'div', 'span'].map((t) => [t, BLOCK_CLASSES]),
  ),
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  // Innehållet i de här taggarna kastas helt, inte bara taggen.
  nonTextTags: ['script', 'style', 'textarea', 'option', 'noscript', 'iframe', 'object', 'embed', 'svg', 'math', 'template'],
  transformTags: {
    h1: 'h2',
    h4: 'h3',
    h5: 'h3',
    h6: 'h3',
    b: 'strong',
    i: 'em',
    a: (tagName, attribs) => {
      const href = localize((attribs.href ?? '').trim());
      const out: Record<string, string> = {};
      if (href) out.href = href;
      if (attribs.class) out.class = attribs.class; // filtreras av allowedClasses
      if (isExternal(href)) {
        out.rel = 'nofollow noopener';
        out.target = '_blank';
      }
      return { tagName, attribs: out };
    },
  },
};

export function bodyToHtml(input: string): string {
  const source = input.replace(/\r\n/g, '\n').trim();
  if (!source) return '';
  const html = looksLikeHtml(source) ? source : (marked.parse(source, { async: false, gfm: true, breaks: false }) as string);
  return sanitizeHtml(html, OPTIONS)
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Ingress, rubriker och SEO-fält är ren text. Taggar tas bort; React och
 *  Next escapar texten när den renderas, så den lagras oescapad. */
export function plainText(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
