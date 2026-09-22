/**
 * Innehållsblock i artiklarnas content_mdx (HTML): topplista med betyg ur
 * recensionerna, jämförelsekort, steg för steg, faktaruta, stapeldiagram och
 * bild. Blocken renderas som React-komponenter på servern
 * (components/ContentBlocks.tsx, via ArticleProse i ArticleTemplate).
 * Portad från cryptofeber.se (samma syntax), med toplist som nytt block.
 *
 * ── Syntax ───────────────────────────────────────────────────────────
 * Ett block är en div med attributet data-block och en JSON som enda innehåll:
 *
 *   <div data-block="callout">{"variant": "tips", "text": "Börja med Search Console."}</div>
 *
 * Varför JSON och inte HTML inuti diven: JSON går att validera exakt, felen går
 * att peka ut (JSON.parse säger var), och innehållet kan inte bryta sig ut ur
 * blocket. Text i blocken får två sorters inline-markering, samma som i
 * Markdown: **fet** och [länktext](https://adress eller /intern/adress/).
 * Annan HTML i JSON:en renderas som text. JSON:en får inte innehålla "<" —
 * skriv \u003c (admin gör det automatiskt).
 *
 * Blocken och deras fält:
 *   toplist  {title?, note?, sort?: "score" | "editorial", items: [{review, badge?, text?, featured?}] (1–25)}
 *            Standard sort "score": högst betyg först. Rader med featured: true
 *            ("Vårt val") läggs alltid överst, i den ordning de står. "editorial"
 *            behåller ordningen som den är skriven.
 *            review är recensionens slug ("semrush-ai") eller adress
 *            ("/ai-verktyg/semrush-ai/"). Logga, namn, kategori och betyg
 *            hämtas ur recensionen (lib/review-refs.ts, lib/review-score.ts) —
 *            betyget skrivs aldrig i blocket. Ordningen är den redaktionella.
 *   compare  {title?, cards: [{title, text?, rows: [{label, value}], link?: {href, text?}, source?}] (2–4), source?}
 *            Ett värde som börjar med Ja, Nej eller Delvis får färg och ikon.
 *   steps    {title?, steps: [{title, text?: sträng eller lista (stycken), items?: [...] (punktlista), after?: stycken efter listan, href?, source?}] (minst 2), source?}
 *   callout  {variant: "tips" | "varning" | "info", title?, text?: sträng eller lista, items?: [...]}
 *   chart    {title, unit?, note?, items: [{label, value: tal, display?}] (minst 2), source}
 *            Utan source renderas diagrammet inte, och reglerna stoppar det.
 *   image    {src, alt, caption?, width?, height?}
 *            src är en bild i Storage-bucketen featured-images: sökvägen i
 *            bucketen ("2026/09/namn.png", gärna med "featured-images/" först)
 *            eller hela den publika Storage-URL:en på vår Supabase-värd.
 *            png, jpg, webp eller avif. alt krävs. width/height (originalets
 *            pixlar) ger rätt bildformat innan bilden laddats; utan dem
 *            reserveras 16:9. Renderas som <figure> med lat laddning.
 * source är {text, url} eller en lista av sådana.
 *
 * ── Reglerna ─────────────────────────────────────────────────────────
 * lib/article-rules.ts kör sina regler på `expandBlocks()`: varje block ersätts
 * av vanlig HTML där källänksregeln gäller som för ett stycke. Syntaxfel blir
 * regelfynd med koden 'block' och en okänd recension i en topplista koden
 * 'review-unknown' — båda stoppar publiceringen i /admin.
 *
 * Filen är ren TypeScript utan importer: den körs av tsx-skripten, i admin och
 * i serverkomponenterna.
 */

export type BlockType = 'toplist' | 'compare' | 'steps' | 'callout' | 'chart' | 'image';
export const BLOCK_TYPES: readonly BlockType[] = ['toplist', 'compare', 'steps', 'callout', 'chart', 'image'];

export type Source = { text: string; url: string };
export type CompareRow = { label: string; value: string };
export type CompareCard = { title: string; text?: string; rows: CompareRow[]; link?: { href: string; text?: string }; source?: Source[] };
export type CompareBlock = { type: 'compare'; title?: string; cards: CompareCard[]; source?: Source[] };
export type Step = { title: string; text: string[]; items: string[]; after: string[]; href?: string; source?: Source[] };
export type StepsBlock = { type: 'steps'; title?: string; steps: Step[]; source?: Source[] };
export type CalloutVariant = 'tips' | 'varning' | 'info';
export type CalloutBlock = { type: 'callout'; variant: CalloutVariant; title?: string; text: string[]; items: string[] };
export type ChartItem = { label: string; value: number; display: string };
export type ChartBlock = { type: 'chart'; title: string; unit?: string; note?: string; items: ChartItem[]; source: Source[] };
/** src är normaliserad till sökvägen i bucketen featured-images ("2026/09/namn.png"). */
export type ImageBlock = { type: 'image'; src: string; alt: string; caption?: string; width?: number; height?: number };
/** review är normaliserad: en slug ("semrush-ai") eller en adress utan
 *  avslutande snedstreck ("/ai-verktyg/semrush-ai"). */
export type ToplistItem = { review: string; badge?: string; text?: string; featured?: boolean };
export type ToplistBlock = { type: 'toplist'; title?: string; note?: string; sort: 'score' | 'editorial'; items: ToplistItem[] };
export type Block = ToplistBlock | CompareBlock | StepsBlock | CalloutBlock | ChartBlock | ImageBlock;

/** Storage-bucketen för bilder. */
export const IMAGE_BUCKET = 'featured-images';
/** Sökväg i bucketen: mapp- och filnamn av bokstäver, siffror, bindestreck,
 *  understreck och punkt; inga ".."-segment (kontrolleras separat). */
const IMAGE_PATH_RE = /^(?:featured-images\/)?((?:[a-z0-9][a-z0-9_.-]*\/)*[a-z0-9][a-z0-9_.-]*\.(?:png|jpe?g|webp|avif))$/i;
const IMAGE_URL_RE = /^https:\/\/([^/]+)\/storage\/v1\/object\/public\/featured-images\/([^?#]+)$/;

/** Normaliserar ett bildblocks src till sökvägen i bucketen featured-images,
 *  eller null om bilden inte ligger där. En hel URL godtas bara med vår
 *  Supabase-värd. */
export function imageStoragePath(src: string): string | null {
  const s = src.trim();
  const url = s.match(IMAGE_URL_RE);
  let path = s;
  if (url) {
    const own = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined;
    let host = '';
    try { host = own ? new URL(own).host : ''; } catch { host = ''; }
    if (!host || url[1] !== host) return null;
    path = url[2];
  }
  if (path.split('/').some((seg) => seg === '..' || seg === '.')) return null;
  const m = path.match(IMAGE_PATH_RE);
  return m ? m[1] : null;
}

/** Den publika adressen till en bild i bucketen. */
export function imagePublicUrl(path: string): string {
  const base = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '' : '').replace(/\/$/, '');
  return `${base}/storage/v1/object/public/${IMAGE_BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

// ── Recensioner i topplistan ────────────────────────────────────────────

/** Sektionerna där recensionerna ligger (se lib/route-kind.ts). */
const REVIEW_PATH_RE = /^\/ai-(?:verktyg|video)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)+$/;
const REVIEW_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Normaliserar en recensionsreferens: slug eller adress (relativ eller på
 * aimagasinet.se, med eller utan avslutande snedstreck). Returnerar slugen
 * eller adressen utan snedstreck på slutet, eller null om den inte är giltig.
 */
export function normalizeReviewRef(ref: string): string | null {
  let s = ref.trim().replace(/^https?:\/\/(?:www\.)?aimagasinet\.se(?=\/)/i, '').replace(/[?#].*$/, '');
  if (s.startsWith('/')) {
    s = s.replace(/\/+$/, '');
    return REVIEW_PATH_RE.test(s) ? s : null;
  }
  return REVIEW_SLUG_RE.test(s) ? s : null;
}

/** Blocket i HTML:en. JSON:en får inte innehålla "</div>" — admin och
 *  extractBlocks() skriver < som \u003c, så den kan inte göra det. */
const BLOCK_SRC = '<div\\s+data-block="([a-z]+)"\\s*>([\\s\\S]*?)<\\/div>';
const blockRe = () => new RegExp(BLOCK_SRC, 'gi');
const ANY_BLOCK_RE = /data-block\s*=/i;

export type Part = { kind: 'html'; html: string } | { kind: 'block'; block: Block } | { kind: 'invalid'; type: string; error: string };

// ── Inline-markering: **fet** och [text](adress) ────────────────────────

export type Inline = { t: 'text'; v: string } | { t: 'b'; v: string } | { t: 'a'; v: string; href: string };

const INLINE_RE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function isAllowedHref(href: string): boolean {
  return /^https:\/\/[^\s"'<>]+$/.test(href) || /^\/[^\s"'<>]*$/.test(href) || /^#[A-Za-z0-9-]+$/.test(href);
}

export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  const re = new RegExp(INLINE_RE.source, 'g');
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ t: 'text', v: s.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'b', v: m[1] });
    else out.push({ t: 'a', v: m[2], href: m[3] });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ t: 'text', v: s.slice(last) });
  return out;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inlineHtml(s: string): string {
  return parseInline(s)
    .map((n) => (n.t === 'text' ? esc(n.v) : n.t === 'b' ? `<strong>${esc(n.v)}</strong>` : `<a href="${esc(n.href)}">${esc(n.v)}</a>`))
    .join('');
}

function sourcesHtml(src?: Source[]): string {
  return (src ?? []).map((s) => ` <a href="${esc(s.url)}">${esc(s.text)}</a>`).join('');
}

// ── Validering ──────────────────────────────────────────────────────────

/** Valideringsfel märks med en egenskap och inte med en egen Error-klass:
 *  instanceof på en ärvd Error är opålitligt när koden kompileras till ES5. */
type BlockError = Error & { contentBlock: true };
const isBlockError = (e: unknown): e is BlockError => !!e && (e as BlockError).contentBlock === true;

function fail(msg: string): never {
  throw Object.assign(new Error(msg), { contentBlock: true as const });
}

function str(v: unknown, where: string, required = true): string | undefined {
  if (v === undefined || v === null || v === '') {
    if (required) fail(`${where} saknas`);
    return undefined;
  }
  if (typeof v !== 'string') fail(`${where} ska vara text`);
  const s = v.trim();
  if (required && !s) fail(`${where} är tom`);
  checkLinks(s, where);
  return s || undefined;
}

function checkLinks(s: string, where: string) {
  for (const n of parseInline(s)) {
    if (n.t === 'a' && !isAllowedHref(n.href)) fail(`${where}: länken "${n.href}" ska börja med https:// eller /`);
  }
}

function sources(v: unknown, where: string, required = false): Source[] | undefined {
  if (v === undefined || v === null) {
    if (required) fail(`${where} saknas (källrad med text och url krävs)`);
    return undefined;
  }
  const list = Array.isArray(v) ? v : [v];
  if (list.length === 0) {
    if (required) fail(`${where} är tom (källrad med text och url krävs)`);
    return undefined;
  }
  return list.map((s, i) => {
    const w = `${where}${Array.isArray(v) ? `[${i}]` : ''}`;
    if (!s || typeof s !== 'object') fail(`${w} ska vara {"text": …, "url": …}`);
    const o = s as Record<string, unknown>;
    const text = str(o.text, `${w}.text`)!;
    const url = str(o.url, `${w}.url`)!;
    if (!/^https:\/\//.test(url)) fail(`${w}.url ska vara en https-adress`);
    if (!isAllowedHref(url)) fail(`${w}.url är ingen giltig adress`);
    return { text, url };
  });
}

function obj(v: unknown, where: string): Record<string, unknown> {
  if (!v || typeof v !== 'object' || Array.isArray(v)) fail(`${where} ska vara ett objekt`);
  return v as Record<string, unknown>;
}

function list(v: unknown, where: string, min: number, max = Infinity): unknown[] {
  if (!Array.isArray(v)) fail(`${where} ska vara en lista`);
  if (v.length < min || v.length > max) {
    fail(`${where} ska ha ${max === Infinity ? `minst ${min}` : `${min}–${max}`} poster (har ${v.length})`);
  }
  return v;
}

function textList(v: unknown, where: string): string[] {
  if (v === undefined || v === null) return [];
  const arr = typeof v === 'string' ? [v] : list(v, where, 1);
  return arr.map((x, i) => str(x, `${where}[${i}]`)!);
}

/** Tolkar och validerar ett blocks JSON. Kastar BlockError med ett läsbart fel. */
function toBlock(type: string, json: string): Block {
  if (!(BLOCK_TYPES as readonly string[]).includes(type)) fail(`okänd blocktyp "${type}" (${BLOCK_TYPES.join(', ')})`);
  let data: unknown;
  try {
    data = JSON.parse(decodeEntities(json).trim());
  } catch (e) {
    fail(`ogiltig JSON — ${(e as Error).message}`);
  }
  const d = obj(data, 'blocket');

  if (type === 'toplist') {
    const seen = new Set<string>();
    const items = list(d.items, 'items', 1, 25).map((it, i) => {
      const w = `items[${i}]`;
      const o = obj(it, w);
      const raw = str(o.review, `${w}.review`)!;
      const review = normalizeReviewRef(raw);
      if (!review) fail(`${w}.review "${raw}" ska vara en recensions slug (t.ex. "semrush-ai") eller adress (t.ex. "/ai-verktyg/semrush-ai/")`);
      if (seen.has(review)) fail(`${w}.review "${raw}" finns redan i listan`);
      seen.add(review);
      if (o.featured !== undefined && typeof o.featured !== 'boolean') fail(`${w}.featured ska vara true eller false`);
      return { review, badge: str(o.badge, `${w}.badge`, false), text: str(o.text, `${w}.text`, false), featured: o.featured === true };
    });
    const sort = d.sort === undefined ? 'score' : d.sort;
    if (sort !== 'score' && sort !== 'editorial') fail('sort ska vara "score" eller "editorial"');
    return { type, title: str(d.title, 'title', false), note: str(d.note, 'note', false), sort, items };
  }

  if (type === 'compare') {
    const cards = list(d.cards, 'cards', 2, 4).map((c, i) => {
      const w = `cards[${i}]`;
      const o = obj(c, w);
      const rows = list(o.rows, `${w}.rows`, 1).map((r, j) => {
        const ro = obj(r, `${w}.rows[${j}]`);
        return { label: str(ro.label, `${w}.rows[${j}].label`)!, value: str(ro.value, `${w}.rows[${j}].value`)! };
      });
      let link: CompareCard['link'];
      if (o.link !== undefined && o.link !== null) {
        const l = obj(o.link, `${w}.link`);
        const href = str(l.href, `${w}.link.href`)!;
        if (!isAllowedHref(href)) fail(`${w}.link.href ska börja med https:// eller /`);
        link = { href, text: str(l.text, `${w}.link.text`, false) };
      }
      return { title: str(o.title, `${w}.title`)!, text: str(o.text, `${w}.text`, false), rows, link, source: sources(o.source, `${w}.source`) };
    });
    return { type, title: str(d.title, 'title', false), cards, source: sources(d.source, 'source') };
  }

  if (type === 'steps') {
    const steps = list(d.steps, 'steps', 2).map((s, i) => {
      const w = `steps[${i}]`;
      const o = obj(s, w);
      const href = str(o.href, `${w}.href`, false);
      if (href && !isAllowedHref(href)) fail(`${w}.href ska börja med https://, / eller #`);
      return {
        title: str(o.title, `${w}.title`)!,
        text: textList(o.text, `${w}.text`),
        items: textList(o.items, `${w}.items`),
        after: textList(o.after, `${w}.after`),
        href,
        source: sources(o.source, `${w}.source`),
      };
    });
    return { type, title: str(d.title, 'title', false), steps, source: sources(d.source, 'source') };
  }

  if (type === 'callout') {
    const variant = str(d.variant, 'variant')!;
    if (!['tips', 'varning', 'info'].includes(variant)) fail(`variant ska vara tips, varning eller info (är "${variant}")`);
    const text = textList(d.text, 'text');
    const items = textList(d.items, 'items');
    if (text.length === 0 && items.length === 0) fail('text eller items krävs');
    return { type, variant: variant as CalloutVariant, title: str(d.title, 'title', false), text, items };
  }

  if (type === 'image') {
    const raw = str(d.src, 'src')!;
    const path = imageStoragePath(raw);
    if (!path) fail(`src "${raw}" ska vara en bild i Storage-bucketen featured-images, t.ex. "2026/09/namn.png" eller hela den publika URL:en (png, jpg, webp eller avif)`);
    const dim = (v: unknown, w: string): number | undefined => {
      if (v === undefined || v === null) return undefined;
      if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 10000) fail(`${w} ska vara ett heltal i pixlar`);
      return v as number;
    };
    const width = dim(d.width, 'width');
    const height = dim(d.height, 'height');
    if ((width === undefined) !== (height === undefined)) fail('width och height anges tillsammans eller inte alls');
    return { type, src: path, alt: str(d.alt, 'alt (beskrivande alt-text)')!, caption: str(d.caption, 'caption', false), width, height };
  }

  // chart
  const src = sources(d.source, 'source', true)!;
  const unit = str(d.unit, 'unit', false);
  const items = list(d.items, 'items', 2).map((it, i) => {
    const w = `items[${i}]`;
    const o = obj(it, w);
    if (typeof o.value !== 'number' || !Number.isFinite(o.value) || o.value < 0) fail(`${w}.value ska vara ett tal ≥ 0 (inte text)`);
    const value = o.value as number;
    const display = str(o.display, `${w}.display`, false) ?? `${String(value).replace('.', ',')}${unit ? ` ${unit}` : ''}`;
    return { label: str(o.label, `${w}.label`)!, value, display };
  });
  return { type: 'chart', title: str(d.title, 'title')!, unit, note: str(d.note, 'note', false), items, source: src };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

// ── Dela upp, expandera, normalisera ────────────────────────────────────

export function hasBlocks(html: string | null | undefined): boolean {
  return !!html && /data-block\s*=/i.test(html);
}

/** Delar brödtexten i HTML-bitar och block, i ordning. */
export function splitBlocks(html: string): Part[] {
  const parts: Part[] = [];
  const re = blockRe();
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    if (m.index > last) parts.push({ kind: 'html', html: html.slice(last, m.index) });
    try {
      parts.push({ kind: 'block', block: toBlock(m[1].toLowerCase(), m[2]) });
    } catch (e) {
      if (!isBlockError(e)) throw e;
      parts.push({ kind: 'invalid', type: m[1], error: e.message });
    }
    last = m.index + m[0].length;
  }
  if (last < html.length) parts.push({ kind: 'html', html: html.slice(last) });
  return parts;
}

/** Syntaxfel i blocken, som läsbara meddelanden. Fångar också data-block som
 *  regexen inte känner igen (fel citattecken, saknad </div>). */
export function blockErrors(html: string | null | undefined): string[] {
  if (!hasBlocks(html)) return [];
  const errors: string[] = [];
  let n = 0;
  for (const p of splitBlocks(html!)) {
    if (p.kind === 'block') n += 1;
    if (p.kind === 'invalid') {
      n += 1;
      errors.push(`block ${n} (${p.type}): ${p.error}`);
    }
    if (p.kind === 'html' && ANY_BLOCK_RE.test(p.html)) {
      const at = p.html.search(/<[^>]*data-block/i);
      errors.push(`data-block med fel syntax — skriv <div data-block="typ">{…JSON…}</div>: "${p.html.slice(Math.max(0, at), at + 60)}…"`);
    }
  }
  return errors;
}

/** Blocket som vanlig HTML, för reglerna, lästiden och ordräkningen. */
export function blockToHtml(b: Block): string {
  switch (b.type) {
    case 'toplist':
      // Betyget står inte i blocket (det hämtas ur recensionen), så bara den
      // redaktionella texten räknas här.
      return (b.title ? `<p>${inlineHtml(b.title)}</p>` : '')
        + '<ol>' + b.items.map((it) => `<li>${[it.badge, it.text].filter((t): t is string => !!t).map(inlineHtml).join('. ')}</li>`).join('') + '</ol>'
        + (b.note ? `<p>${inlineHtml(b.note)}</p>` : '');
    case 'compare':
      return (b.title ? `<p>${inlineHtml(b.title)}</p>` : '') + b.cards.map((c) => {
        const rows = c.rows.map((r) => ` ${inlineHtml(r.label)}: ${inlineHtml(r.value)}.`).join('');
        const link = c.link ? ` <a href="${esc(c.link.href)}">${esc(c.link.text ?? 'Läs mer')}</a>` : '';
        return `<p>${inlineHtml(c.title)}. ${c.text ? inlineHtml(c.text) : ''}${rows}${link}${sourcesHtml(c.source)}${sourcesHtml(b.source)}</p>`;
      }).join('');
    case 'steps':
      return (b.title ? `<p>${inlineHtml(b.title)}</p>` : '') + '<ol>' + b.steps.map((s) =>
        `<li>${inlineHtml(s.title)}. ${s.text.map(inlineHtml).join(' ')}${[...s.items, ...s.after].map((t) => ` ${inlineHtml(t)}`).join('')}${s.href ? ` <a href="${esc(s.href)}">läs mer</a>` : ''}${sourcesHtml(s.source)}${sourcesHtml(b.source)}</li>`,
      ).join('') + '</ol>';
    case 'callout':
      return (b.title ? `<p>${inlineHtml(b.title)}</p>` : '')
        + b.text.map((t) => `<p>${inlineHtml(t)}</p>`).join('')
        + (b.items.length ? `<ul>${b.items.map((t) => `<li>${inlineHtml(t)}</li>`).join('')}</ul>` : '');
    case 'image':
      return b.caption ? `<p>${inlineHtml(b.caption)}</p>` : '';
    case 'chart':
      return `<p>${inlineHtml(b.title)}. ${b.items.map((i) => `${esc(i.label)}: ${esc(i.display)}.`).join(' ')} ${b.note ? inlineHtml(b.note) : ''}${sourcesHtml(b.source)}</p>`;
  }
}

/** Brödtexten med varje giltigt block ersatt av vanlig HTML; ogiltiga block tas bort. */
export function expandBlocks(html: string | null | undefined): string {
  if (!html || !hasBlocks(html)) return html ?? '';
  return splitBlocks(html).map((p) => (p.kind === 'html' ? p.html : p.kind === 'block' ? blockToHtml(p.block) : '')).join('');
}

/** Alla recensionsreferenser i brödtextens giltiga topplistor (normaliserade),
 *  i ordning och utan dubbletter. */
export function toplistRefs(html: string | null | undefined): string[] {
  if (!html || !hasBlocks(html)) return [];
  const out: string[] = [];
  for (const p of splitBlocks(html)) {
    if (p.kind === 'block' && p.block.type === 'toplist') {
      for (const it of p.block.items) if (!out.includes(it.review)) out.push(it.review);
    }
  }
  return out;
}

/** JSON som går att lägga direkt i HTML: <, > och & skrivs som \u-escapes. */
function safeJson(v: unknown): string {
  return JSON.stringify(v).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

/**
 * För admin: plockar ut blocken ur inklistrad text innan resten saneras.
 * `restore` sätter tillbaka dem — giltiga block som normaliserad JSON, ogiltiga
 * som escapad text (så att reglerna kan peka ut felet, men inget kan köras).
 */
export function extractBlocks(input: string): { text: string; restore: (html: string) => string } {
  const saved: string[] = [];
  const text = input.replace(blockRe(), (_w, type: string, json: string) => {
    const t = type.toLowerCase();
    let out: string;
    try {
      const raw = JSON.parse(decodeEntities(json).trim()) as unknown;
      toBlock(t, json); // kastar vid fel
      out = `<div data-block="${t}">${safeJson(raw)}</div>`;
    } catch {
      out = `<div data-block="${esc(t)}">${esc(json.trim())}</div>`;
    }
    saved.push(out);
    return `\n\nAIMBLOCK${saved.length - 1}X\n\n`;
  });
  const restore = (html: string) =>
    html.replace(/(?:<p>\s*)?AIMBLOCK(\d+)X(?:\s*<\/p>)?/g, (_w, i: string) => saved[Number(i)] ?? '');
  return { text, restore };
}

/** Exempel på varje block, att kopiera. Visas under brödtextfältet i admin och
 *  står också i ADMIN.md — ändra båda samtidigt. */
export const BLOCK_EXAMPLES: readonly { type: BlockType; name: string; code: string }[] = [
  {
    type: 'toplist',
    name: 'Topplista (1–25 verktyg; betyg, logga och kategori hämtas ur recensionen)',
    code: '<div data-block="toplist">{"title": "Våra förstahandsval", "items": [\n  {"review": "semrush-ai", "badge": "Bäst allt-i-ett", "text": "Sökord, teknik och rapporter i samma abonnemang."},\n  {"review": "/ai-verktyg/ahrefs-ai/", "badge": "Bäst för länkar"},\n  {"review": "neuronwriter", "text": "Budgetalternativet till Surfer."}\n], "note": "Ordningen är redaktionens; betygen kommer från respektive recension."}</div>',
  },
  {
    type: 'compare',
    name: 'Jämförelsekort (2–4 kort)',
    code: '<div data-block="compare">{"cards": [\n  {"title": "Surfer SEO", "text": "Optimerar texten mot SERP:en.", "rows": [\n    {"label": "Gratisnivå", "value": "Nej"},\n    {"label": "Svenska texter", "value": "Ja, hanteras väl"}],\n   "link": {"href": "/ai-verktyg/surfer-seo/", "text": "Läs recensionen"}},\n  {"title": "NeuronWriter", "rows": [\n    {"label": "Gratisnivå", "value": "Nej"},\n    {"label": "Svenska texter", "value": "Delvis"}],\n   "link": {"href": "/ai-verktyg/neuronwriter/"}}\n]}</div>',
  },
  {
    type: 'steps',
    name: 'Steg för steg',
    code: '<div data-block="steps">{"steps": [\n  {"title": "Hitta sidorna som rankar men inte klickas", "text": "Sortera på exponeringar i **Search Console**."},\n  {"title": "Skriv om titel och beskrivning"},\n  {"title": "Vänta och mät", "text": "Jämför mot baslinjen."}\n]}</div>',
  },
  {
    type: 'callout',
    name: 'Faktaruta (variant tips, varning eller info)',
    code: '<div data-block="callout">{"variant": "tips", "title": "Sätt en baslinje först",\n "text": "Exportera Search Console-data innan du startar prenumerationen.",\n "items": ["Klick och exponeringar per sida", "Genomsnittlig position"]}</div>',
  },
  {
    type: 'chart',
    name: 'Stapeldiagram (källa krävs)',
    code: '<div data-block="chart">{"title": "Pris per månad", "unit": "USD",\n "items": [{"label": "Verktyg A", "value": 139}, {"label": "Verktyg B", "value": 29}],\n "note": "Månadsbetalning.",\n "source": [{"text": "A:s prissida", "url": "https://example.com/a"}, {"text": "B:s prissida", "url": "https://example.com/b"}]}</div>',
  },
  {
    type: 'image',
    name: 'Bild (alt krävs; filen i Storage-bucketen featured-images)',
    code: '<div data-block="image">{"src": "2026/09/seo-verktyg-oversikt.png", "width": 1600, "height": 900,\n "alt": "Search Consoles resultatrapport med exponeringar och klick per sida.",\n "caption": "Valfri bildtext."}</div>',
  },
];
