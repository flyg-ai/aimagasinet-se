/**
 * Parse a rating out of WP HTML content.
 * Looks for "X/10" or "X,5/10" patterns first, falls back to counting ★ stars.
 * Returns { score, max } on a 10-point scale, or null if nothing found.
 */
export type Rating = { score: number; max: number };

export function parseRating(html: string | null | undefined): Rating | null {
  if (!html) return null;
  const text = html.replace(/<[^>]+>/g, ' ');

  // 1. Look for "9/10", "8.5/10", "9,2 / 10"
  const slashMatch = text.match(/(\d+(?:[.,]\d+)?)\s*\/\s*10\b/);
  if (slashMatch) {
    const score = parseFloat(slashMatch[1].replace(',', '.'));
    if (score >= 0 && score <= 10) return { score, max: 10 };
  }

  // 2. Count consecutive ★ characters (1-5)
  const starMatch = text.match(/★{1,5}/);
  if (starMatch) {
    return { score: starMatch[0].length * 2, max: 10 };
  }

  return null;
}

/**
 * Pull a clean tool name out of an article title.
 *   "ChatGPT – Recension, Test & Guide (2026)"      → "ChatGPT"
 *   "Cursor AI – Komplett Guide"                     → "Cursor AI"
 *   "Kling AI: Bästa Verktyget för AI-Video 2026"    → "Kling AI"
 * Splits on em/en-dash, " - ", or ":" — keeps the first part.
 */
export function toolNameFromTitle(title: string): string {
  return title.split(/\s+[–—-]\s+|:\s+/)[0].trim();
}
