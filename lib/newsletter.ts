/**
 * Veckobrevet — datamodell och rendering.
 *
 * Innehållet lagras strukturerat i newsletters.content, inte som HTML. Både
 * mejlet och webbsidan renderas härifrån, så det finns bara en sanning om vad
 * ett nummer innehåller och bara ett ställe att ändra utseendet på.
 *
 * Strukturen är medvetet låst: samma fyra delar varje vecka. Det gör brevet
 * skannbart för läsaren och genereringen betydligt mer tillförlitlig.
 */

export type NewsletterItem = {
  title: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
};

export type NewsletterContent = {
  /** Veckans viktigaste — en rubrik och några meningar. */
  headline: string;
  lead: string;
  /** Fyra kortare notiser med varsin källa. */
  items: NewsletterItem[];
  /** Vad veckan betyder här. Sajtens faktiska nisch. */
  swedishAngle: { title: string; body: string };
  /** Något läsaren kan testa på fem minuter. */
  tryThis: { title: string; body: string };
};

export type Newsletter = {
  id: number;
  week: string;
  subject: string;
  content: NewsletterContent;
  status: 'draft' | 'approved' | 'published' | 'sent';
  created_at: string;
  sent_at: string | null;
};

/** ISO-vecka på formen "2026-v34". Torsdagsregeln ger rätt årsskifte. */
export function isoWeek(d: Date = new Date()): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-v${String(week).padStart(2, '0')}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Ren HTML utan inline-styles — sidan ärver sajtens typografi via prose.
 *  Mejlversionen får egna styles när utskicket byggs; den delen finns inte än. */
export function renderNewsletterHtml(c: NewsletterContent): string {
  const items = (c.items ?? [])
    .map(
      (i) =>
        `<h3>${esc(i.title)}</h3>\n<p>${esc(i.body)} <a href="${esc(i.sourceUrl)}" rel="nofollow noopener" target="_blank">${esc(i.sourceName)}</a></p>`,
    )
    .join('\n');

  return [
    `<h2>${esc(c.headline)}</h2>`,
    `<p>${esc(c.lead)}</p>`,
    `<h2>Veckans notiser</h2>`,
    items,
    `<h2>${esc(c.swedishAngle.title)}</h2>`,
    `<p>${esc(c.swedishAngle.body)}</p>`,
    `<h2>${esc(c.tryThis.title)}</h2>`,
    `<p>${esc(c.tryThis.body)}</p>`,
  ].join('\n');
}

/** Ordräkning för att hålla löftet om fem minuters läsning. */
export function newsletterWordCount(c: NewsletterContent): number {
  const parts = [
    c.headline,
    c.lead,
    ...(c.items ?? []).flatMap((i) => [i.title, i.body]),
    c.swedishAngle?.title,
    c.swedishAngle?.body,
    c.tryThis?.title,
    c.tryThis?.body,
  ].filter(Boolean) as string[];
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}
