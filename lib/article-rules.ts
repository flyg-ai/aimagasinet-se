/**
 * Innehållsreglerna för artiklar (type='post') som publiceras via /admin.
 *
 * Portade från cryptofebers lib/article-rules.ts, men bara de generiska
 * reglerna: tal utan källänk, för få interna länkar, tomma SEO-fält och
 * formella kontroller (kategori, datum, SEO-längder). Adminformuläret
 * (app/admin/) delar upp fynden i hårda stopp och varningar via `code`, se
 * lib/admin/config.ts.
 *
 * Innehållsblocken (lib/content-blocks.ts): syntaxfel ger koden 'block' och
 * en topplista med en recension som inte finns koden 'review-unknown'. Båda är
 * hårda stopp i /admin. Reglerna nedan körs på blocken som vanlig HTML
 * (expandBlocks), så att källänksregeln gäller text i blocken också.
 *
 * Filen får inte importera något från Next eller Node, så att den även kan
 * köras från skript med tsx.
 */
import { blockErrors, expandBlocks } from './content-blocks';

export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 155;
export const MIN_INTERNAL_LINKS = 2;

export type ArticleInput = {
  slug?: string;
  title?: string;
  seo_title?: string;
  seo_description?: string;
  excerpt?: string;
  category?: string;
  published_at?: string;
  content_mdx?: string;
};

export type RuleCode =
  | 'missing'
  | 'seo-title-length'
  | 'seo-description-length'
  | 'category'
  | 'date-invalid'
  | 'date-future'
  | 'internal-links'
  | 'unsourced-number'
  /** Fel syntax i ett innehållsblock (ogiltig JSON, okänt fält, fel värde). */
  | 'block'
  /** En topplista pekar på en recension som inte finns eller inte är publicerad. */
  | 'review-unknown';

export type RuleIssue = {
  code: RuleCode;
  /** Fältet det gäller, när det finns ett. */
  field?: keyof ArticleInput;
  message: string;
  /** Styckets text (utan taggar) för fynd som gäller ett enskilt <p>/<li>. */
  block?: string;
  /** Styckets ordningsnummer bland <p>/<li> i brödtexten, från 0. */
  blockIndex?: number;
};

const REQUIRED = ['slug', 'title', 'seo_title', 'seo_description', 'excerpt', 'category', 'published_at', 'content_mdx'] as const;

// ── Spärr: siffror utan källa i samma stycke ───────────────────────────

/** Bokstäver, inklusive de svenska (utan \p{L}, som kräver u-flaggan). */
const LETTER = 'A-Za-zÀ-ÖØ-öø-ÿ';
/** Ett tal, men bara när siffrorna inte gränsar till bokstäver. "GPT4o" och
 *  "H100" är namn; "450" och "407,1" är kvantiteter. */
const NUMBER_RE = new RegExp(`(?<![0-9${LETTER}])\\d+(?:[.,]\\d+)?(?![0-9${LETTER}])`, 'g');
const PERCENT_RE = /\d\s*(?:%|procent)/i;
/** "kr" avslutas med en negativ lookahead och inte med \b: JavaScripts \b
 *  räknar å, ä och ö som icke-ordstecken, så `kr\b` matchar mitt inne i
 *  "kräver". */
const AMOUNT_RE = /\d[\d.,\s]*\s*(?:kr(?![A-Za-zåäöÅÄÖ])|kronor|dollar|euro|usd|sek|eur|miljon|miljoner|miljard|miljarder)/i;
const LINK_RE = /<a\s[^>]*href=/i;
const BLOCK_RE = /<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
/** Interna länkar är relativa ("/…"); body.ts gör absoluta aimagasinet.se-
 *  länkar relativa innan reglerna körs. */
const INTERNAL_LINK_RE = /<a\s[^>]*href="\/[^"/][^"]*"/g;
const MAX_BARE_NUMBER = 12;

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returnerar en förklaring om stycket bryter mot regeln, annars null. */
export function unsourcedNumber(inner: string): string | null {
  if (LINK_RE.test(inner)) return null;
  const text = stripTags(inner);
  if (PERCENT_RE.test(text)) return 'procenttal';
  if (AMOUNT_RE.test(text)) return 'belopp';
  NUMBER_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = NUMBER_RE.exec(text)) !== null) {
    const n = Number(m[0].replace(',', '.'));
    // Årtal (2024, 2026 …) är inte påståenden som kräver källa.
    if (/^(19|20)\d\d$/.test(m[0])) continue;
    if (Number.isFinite(n) && n > MAX_BARE_NUMBER) return `talet ${m[0]}`;
  }
  return null;
}

export function countInternalLinks(html: string): number {
  return (html.match(INTERNAL_LINK_RE) ?? []).length;
}

/** Kör alla regler på en artikel. `categories` är kategorislugs ur databasen. */
export function checkArticle(
  a: ArticleInput,
  opts: {
    categories: ReadonlySet<string>;
    now?: number;
    /** Topplistreferenser utan publicerad recension (lib/review-refs.ts
     *  unknownToplistRefs); slås upp i databasen av anroparen. */
    unknownReviews?: readonly string[];
  },
): RuleIssue[] {
  const now = opts.now ?? Date.now();
  const out: RuleIssue[] = [];

  for (const field of REQUIRED) {
    if (!a[field]) out.push({ code: 'missing', field, message: `${field} saknas` });
  }
  if (a.seo_title && a.seo_title.length > SEO_TITLE_MAX) {
    out.push({ code: 'seo-title-length', field: 'seo_title', message: `SEO-titeln är ${a.seo_title.length} tecken (max ${SEO_TITLE_MAX})` });
  }
  if (a.seo_description && a.seo_description.length > SEO_DESCRIPTION_MAX) {
    out.push({ code: 'seo-description-length', field: 'seo_description', message: `SEO-beskrivningen är ${a.seo_description.length} tecken (max ${SEO_DESCRIPTION_MAX})` });
  }
  if (a.category && !opts.categories.has(a.category)) out.push({ code: 'category', field: 'category', message: `Okänd kategori "${a.category}"` });

  // published_at får ligga bakåt i tiden men aldrig framåt: en artikel med
  // framtida datum syns i flödena med ett datum som inte har inträffat.
  const published = a.published_at ? Date.parse(a.published_at) : NaN;
  if (Number.isNaN(published)) out.push({ code: 'date-invalid', field: 'published_at', message: 'Publiceringsdatumet går inte att tolka' });
  else if (published > now) out.push({ code: 'date-future', field: 'published_at', message: 'Publiceringsdatumet ligger i framtiden' });

  // Innehållsblocken: syntaxfel och okända recensioner stoppar. Resten av
  // reglerna körs på brödtexten med blocken som vanlig HTML.
  for (const e of blockErrors(a.content_mdx)) {
    out.push({ code: 'block', field: 'content_mdx', message: `innehållsblock: ${e}` });
  }
  for (const ref of opts.unknownReviews ?? []) {
    out.push({ code: 'review-unknown', field: 'content_mdx', message: `topplistan pekar på "${ref}", som inte är en publicerad recension` });
  }
  const body = expandBlocks(a.content_mdx);

  // Interna länkar: minst två. Artiklar som inte länkar vidare i sajten är
  // återvändsgränder både för läsaren och för länkstrukturen.
  const internal = countInternalLinks(body);
  if (internal < MIN_INTERNAL_LINKS) {
    out.push({ code: 'internal-links', field: 'content_mdx', message: `Bara ${internal} interna länkar (minst ${MIN_INTERNAL_LINKS})` });
  }

  BLOCK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let index = 0;
  while ((m = BLOCK_RE.exec(body)) !== null) {
    const why = unsourcedNumber(m[2]);
    if (why) {
      const text = stripTags(m[2]);
      out.push({
        code: 'unsourced-number',
        field: 'content_mdx',
        message: `${why} i ett stycke utan källänk — "${text.slice(0, 90)}…"`,
        block: text,
        blockIndex: index,
      });
    }
    index += 1;
  }
  return out;
}
