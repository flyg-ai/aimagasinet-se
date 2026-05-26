/**
 * Shared prose styling for WP HTML content.
 * Token-based: surface colors flip automatically when `.dark` is set on <html>.
 * The `dark:prose-invert` variant covers prose children we don't explicitly
 * override (e.g. blockquote bg, code language pills).
 */
export function ArticleProse({ html }: { html: string | null }) {
  return (
    <div
      className="
        prose prose-lg max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-fg
        prose-h2:mt-12 prose-h2:text-2xl
        prose-h3:mt-10 prose-h3:text-xl
        prose-p:text-fg-muted prose-p:leading-[1.8]
        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
        prose-strong:text-fg
        prose-li:text-fg-muted
        prose-blockquote:border-l-accent prose-blockquote:text-fg-muted
        prose-code:rounded prose-code:bg-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-code:before:content-none prose-code:after:content-none
        prose-img:rounded-lg prose-img:border prose-img:border-line
        prose-hr:border-line
      "
      dangerouslySetInnerHTML={{ __html: html ?? '' }}
    />
  );
}
