import Link from 'next/link';
import { to } from '@/lib/links';
import type { Article } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';
import { ArticleCard } from '@/components/ArticleCard';

/** Renders /ai-guiden. Search field (visual mock) + category grid + featured
 *  guide + senaste guider (latest posts in the AI-Guiden category).
 *
 *  Categories are curated; some are pages on this site (fetched if seeded),
 *  some are cross-links to other sections (/ai-verktyg, /kategori/ai-sakerhet). */
export function GuideHubTemplate({
  article: a,
  guides,
  latest,
}: {
  article: Article;
  guides: ArticleCardData[];
  latest: ArticleCardData[];
}) {
  const featured = guides.find((g) => g.slug === 'vad-ar-ai') ?? guides[0];

  return (
    <article className="bg-page text-fg">
      <Hero article={a} />
      {featured && <Featured guide={featured} />}
      <CategoryGrid guides={guides} />
      {latest.length > 0 && <LatestGuides latest={latest} />}
    </article>
  );
}

/* ─── Categories ────────────────────────────────────────────────
   8 curated cards. The first 6 link to /ai-guiden/[slug] (must have a
   matching DB row before they 200). The last 2 deep-link out to other
   sections of the site as the user spec calls for. */

type GuideCategory = {
  slug: string;     // matches the DB slug (and link path)
  href: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
};

const CATEGORIES: GuideCategory[] = [
  {
    slug: 'vad-ar-ai',
    href: '/ai-guiden/vad-ar-ai',
    title: 'Vad är AI?',
    description: 'Grunderna — vad är artificiell intelligens egentligen, och varför är det viktigt nu?',
    icon: '?',
    accent: 'bg-indigo-100 text-indigo-700',
  },
  {
    slug: 'hur-fungerar-ai',
    href: '/ai-guiden/hur-fungerar-ai',
    title: 'Hur fungerar AI?',
    description: 'Tekniken bakom — neurala nätverk, träning, modeller och vad som faktiskt händer under huven.',
    icon: '⚙',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    slug: 'komma-igang-med-ai',
    href: '/ai-guiden/komma-igang-med-ai',
    title: 'Komma igång med AI',
    description: 'För nybörjare — så väljer du verktyg, skapar konton och tar dina första AI-prompter.',
    icon: '▶',
    accent: 'bg-amber-100 text-amber-700',
  },
  {
    slug: 'prompta-battre',
    href: '/ai-guiden/prompta-battre',
    title: 'Prompta bättre',
    description: 'Prompt engineering — så får du AI-verktygen att leverera det du faktiskt vill ha.',
    icon: '✎',
    accent: 'bg-rose-100 text-rose-700',
  },
  {
    slug: 'ai-pa-jobbet',
    href: '/ai-guiden/ai-pa-jobbet',
    title: 'AI på jobbet',
    description: 'Produktivitet — använd AI för att spara tid på rapporter, möten, mejl och beslutsstöd.',
    icon: '◧',
    accent: 'bg-sky-100 text-sky-700',
  },
  {
    slug: 'framtidens-ai',
    href: '/ai-guiden/framtidens-ai',
    title: 'Framtidens AI',
    description: 'Trender — agenter, multimodal AI, reglering och vad som händer på 12-36 månaders sikt.',
    icon: '✦',
    accent: 'bg-violet-100 text-violet-700',
  },
  // Cross-link cards — these point to other sections of the site
  {
    slug: 'ai-verktyg',
    href: '/ai-verktyg',
    title: 'AI-verktyg',
    description: 'Topplistor och recensioner av AI-verktyg — text, video, bild, kod, automation, företag.',
    icon: '▦',
    accent: 'bg-fuchsia-100 text-fuchsia-700',
  },
  {
    slug: 'etik-och-sakerhet',
    href: '/kategori/ai-sakerhet',
    title: 'Etik & säkerhet',
    description: 'AI-säkerhet, bias, dataskydd och de viktigaste etiska frågorna att hålla koll på.',
    icon: '⚖',
    accent: 'bg-zinc-200 text-zinc-800',
  },
];

function Hero({ article: a }: { article: Article }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-indigo-600">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">AI-Guiden</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✦</span> Sveriges AI-guide · {new Date().getFullYear()}
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-7xl">
          {a.title || 'AI-Guiden'}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            {a.excerpt}
          </p>
        )}

        {/* Search field — visual mock, no submit logic */}
        <div className="mt-8 max-w-2xl">
          <label className="relative block">
            <span className="sr-only">Sök i AI-Guiden</span>
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Sök en guide — t.ex. prompta, ChatGPT, GDPR…"
              className="w-full rounded-full border border-line bg-card py-3.5 pl-12 pr-4 text-base text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
        </div>
      </div>
    </header>
  );
}

function Featured({ guide }: { guide: ArticleCardData }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Börja här
      </div>
      <Link
        href={to(guide.path)}
        className="group block overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-indigo-50 via-card to-muted p-6 transition-colors hover:border-indigo-300 sm:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              ★ Featured
            </span>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-fg group-hover:text-indigo-600 sm:text-4xl">
              {guide.title}
            </h2>
            {guide.excerpt && (
              <p className="mt-3 text-base leading-relaxed text-fg-subtle sm:text-lg">
                {guide.excerpt}
              </p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white">
            Läs guiden <span aria-hidden>›</span>
          </span>
        </div>
      </Link>
    </section>
  );
}

function CategoryGrid({ guides }: { guides: ArticleCardData[] }) {
  // Map slug → DB title for the "Senaste uppdaterad" line on cards that
  // back onto a real article.
  const dbBySlug = Object.fromEntries(guides.map((g) => [g.slug, g] as const));

  return (
    <section className="border-y border-line bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          Kategorier
        </div>
        <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2 className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
            Hela AI-guiden
          </h2>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
            ⓘ {CATEGORIES.length} kategorier
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const db = dbBySlug[c.slug];
            const display = db?.excerpt || c.description;
            return (
              <Link
                key={c.slug}
                href={to(c.href)}
                className="group flex flex-col gap-4 rounded-xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${c.accent}`}
                >
                  {c.icon}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-fg-subtle">{display}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Utforska <span aria-hidden>›</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LatestGuides({ latest }: { latest: ArticleCardData[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Nytt i guiden
      </div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Senaste guider
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          {latest.length} senaste
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {latest.slice(0, 6).map((a) => (
          <ArticleCard key={a.slug} a={a} />
        ))}
      </div>
    </section>
  );
}
