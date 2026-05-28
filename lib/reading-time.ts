/** Rough "5 min read"-style estimate from an article's HTML body.
 *  Strips tags, counts whitespace-separated words, divides by 200 WPM.
 *  Floors to a minimum of 1 minute so we never render "0 min". */
export function readingTimeMinutes(html: string | null | undefined): number {
  if (!html) return 1;
  const text = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
