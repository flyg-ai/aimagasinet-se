import { ContentBlock } from '@/components/ContentBlocks';
import { hasBlocks, splitBlocks } from '@/lib/content-blocks';
import { wrapTables } from '@/lib/article-html';
import { EMPTY_REVIEW_INDEX, type ReviewIndex } from '@/lib/review-refs';

/**
 * Shared prose styling for WP HTML content.
 * Token-based: surface colors flip automatically when `.dark` is set on <html>.
 * The `dark:prose-invert` variant covers prose children we don't explicitly
 * override (e.g. blockquote bg, code language pills).
 *
 * Tabellerna stylas i app/globals.css (.article-prose .table-wrap); varje
 * vanlig tabell läggs i ett omslag av wrapTables(). Innehållsblocken
 * (<div data-block="…">, lib/content-blocks.ts) renderas som React mellan
 * HTML-bitarna. En brödtext utan block renderas exakt som förut: en div med
 * dangerouslySetInnerHTML.
 */
const PROSE = `
  article-prose prose prose-lg max-w-none dark:prose-invert
  prose-headings:tracking-tight prose-headings:text-fg prose-headings:break-words prose-headings:[overflow-wrap:anywhere]
  prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-[26px] prose-h2:font-semibold prose-h2:border-l-[3px] prose-h2:border-indigo-500 prose-h2:pl-4
  prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-[20px] prose-h3:font-medium
  prose-p:text-[18px] prose-p:text-fg-muted prose-p:leading-[1.8]
  prose-a:text-indigo-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
  prose-strong:font-semibold prose-strong:text-fg
  prose-li:text-[18px] prose-li:text-fg-muted prose-li:leading-[1.8] prose-li:marker:text-indigo-500
  prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:font-medium prose-blockquote:text-fg
  prose-code:rounded prose-code:bg-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-code:before:content-none prose-code:after:content-none
  prose-img:w-full prose-img:rounded-lg prose-img:border prose-img:border-line
  prose-figure:my-8 prose-figcaption:mt-3 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-fg-subtle
  prose-hr:my-12 prose-hr:border-line
`;

export function ArticleProse({ html, reviews = EMPTY_REVIEW_INDEX }: { html: string | null; reviews?: ReviewIndex }) {
  const body = html ?? '';
  if (!hasBlocks(body)) {
    return <div className={PROSE} dangerouslySetInnerHTML={{ __html: wrapTables(body) }} />;
  }
  return (
    <div className={PROSE}>
      {splitBlocks(body).map((p, i) => {
        if (p.kind === 'html') {
          return p.html.trim() ? <div key={i} className="cb-html" dangerouslySetInnerHTML={{ __html: wrapTables(p.html) }} /> : null;
        }
        if (p.kind === 'block') return <ContentBlock key={i} block={p.block} reviews={reviews} />;
        return null; // ogiltigt block: reglerna i /admin stoppar det före publicering
      })}
    </div>
  );
}
