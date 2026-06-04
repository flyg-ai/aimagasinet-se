/** Table-of-contents extraction for review/article bodies.
 *
 *  buildToc() scans an HTML body for <h2>/<h3> headings, injects a stable
 *  `id` on each (so anchor links work) and returns the rewritten HTML plus a
 *  flat list of {level, text, id}. Headings that already carry an id keep it.
 */
export type TocItem = { level: 2 | 3; text: string; id: string };

function slugify(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[åä]/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'sektion';
  let id = base;
  let i = 2;
  while (used.has(id)) id = `${base}-${i++}`;
  used.add(id);
  return id;
}

export function buildToc(html: string): { html: string; items: TocItem[] } {
  const items: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(
    /<(h[23])\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const level = tag.toLowerCase() === 'h2' ? 2 : 3;
      const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (!text) return match;

      const existing = attrs.match(/\bid=["']([^"']+)["']/);
      let id: string;
      let newAttrs = attrs;
      if (existing) {
        id = existing[1];
        used.add(id);
      } else {
        id = slugify(text, used);
        newAttrs = `${attrs} id="${id}"`;
      }
      items.push({ level: level as 2 | 3, text, id });
      return `<${tag}${newAttrs}>${inner}</${tag}>`;
    }
  );

  return { html: out, items };
}
