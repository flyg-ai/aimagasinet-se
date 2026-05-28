import Link from 'next/link';

export type Crumb = { label: string; href: string };

/** Human-readable labels for path segments. Falls back to the raw slug
 *  (with dashes → spaces) when the segment isn't in the map. */
const SEGMENT_LABELS: Record<string, string> = {
  '': 'Start',
  'ai-verktyg': 'AI-verktyg',
  'foretag': 'För företag',
  'yrke': 'Yrke',
  'ai-text-verktyg': 'AI-text',
  'ai-bild-verktyg': 'AI-bild',
  'ai-kod-verktyg': 'AI-kod',
  'ai-ljud-och-musik': 'AI-ljud & musik',
  'ai-automation': 'AI-automation',
  'ai-video': 'AI-video',
  'ai-guiden': 'AI-Guiden',
  'gratis': 'Gratis AI-verktyg',
  'marknadsforing': 'Marknadsföring',
  'content-copywriting': 'Content & copywriting',
  'sociala-medier': 'Sociala medier',
  'ekonomi-redovisning': 'Ekonomi & redovisning',
  'bokforing': 'Bokföring',
  'redovisning': 'Redovisning',
  'kundservice': 'Kundservice',
  'rekrytering': 'Rekrytering',
  'juridik': 'Juridik',
  'avtalsgranskning': 'Avtalsgranskning',
  'due-diligence': 'Due diligence',
  'rattsutredningar': 'Rättsutredningar',
  'chatbot': 'Chatbot',
  'epost-svar': 'E-postsvar',
  'rost-ai': 'Röst-AI',
  'cv-screening': 'CV-screening',
  'jobbannonser': 'Jobbannonser',
  'kandidatmatchning': 'Kandidatmatchning',
  'skribenter': 'Skribenter',
  'kategori': 'Kategori',
};

function labelFor(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  // Generic prettifier — replace dashes with spaces + title-case.
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Mobile breadcrumb is space-constrained. When the trail has more than
 *  3 levels we collapse the middle into "…" with the leftmost ancestor
 *  + last 2 levels visible. Desktop always shows the full trail. */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length === 0) return null;

  // Desktop: full trail. Mobile: leading "…" link to the top ancestor
  // when there are 4+ crumbs, else show all.
  const showAllMobile = crumbs.length <= 3;
  const mobileCrumbs = showAllMobile ? crumbs : crumbs.slice(-2);
  const collapsedRoot = showAllMobile ? null : crumbs[0];

  return (
    <nav
      aria-label="Brödsmulor"
      className="mb-5 -mx-1 overflow-x-auto"
    >
      {/* Desktop view — flex-wrap full trail. */}
      <ol className="hidden flex-wrap items-center gap-1 px-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle sm:flex">
        <li>
          <Link href="/" className="inline-block rounded px-2 py-1 hover:bg-soft hover:text-accent">
            Start
          </Link>
        </li>
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              <Sep />
              {isLast ? (
                <span aria-current="page" className="rounded px-2 py-1 text-fg-muted">
                  {c.label}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="inline-block rounded px-2 py-1 hover:bg-soft hover:text-accent"
                >
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile view — compact, larger tap targets, ellipsis collapse. */}
      <ol className="flex items-center gap-1 px-1 font-mono text-xs font-semibold uppercase tracking-wider text-fg-subtle sm:hidden">
        {collapsedRoot ? (
          <>
            <li>
              <Link
                href={collapsedRoot.href}
                aria-label={collapsedRoot.label}
                className="inline-block rounded px-2 py-1.5 hover:bg-soft hover:text-accent"
              >
                …
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/" className="inline-block rounded px-2 py-1.5 hover:bg-soft hover:text-accent">
              Start
            </Link>
          </li>
        )}
        {mobileCrumbs.map((c, i) => {
          const isLast = i === mobileCrumbs.length - 1;
          return (
            <li key={c.href} className="flex min-w-0 items-center gap-1">
              <Sep />
              {isLast ? (
                <span
                  aria-current="page"
                  className="truncate rounded px-2 py-1.5 text-fg-muted"
                >
                  {c.label}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="truncate rounded px-2 py-1.5 hover:bg-soft hover:text-accent"
                >
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Sep() {
  return (
    <span aria-hidden className="select-none text-fg-faint">
      ›
    </span>
  );
}

/** Build crumbs from a "/a/b/c"-style path, dropping the final segment
 *  (the current page renders its own h1 instead). Labels are looked up
 *  in SEGMENT_LABELS for nicer wording. */
export function buildCrumbs(path: string): Crumb[] {
  const segs = path.split('/').filter(Boolean);
  return segs.slice(0, -1).map((seg, i) => ({
    label: labelFor(seg),
    href: '/' + segs.slice(0, i + 1).join('/'),
  }));
}
