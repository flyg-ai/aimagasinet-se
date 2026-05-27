import Link from 'next/link';
import type { Article } from '@/lib/supabase';

/** Master hub for /ai-verktyg — lands users at a curated category grid that
 *  fans out to all sub-hubs. The article's content_mdx still renders below
 *  the grid as an editorial overview. */
export function MasterHubTemplate({ article: a }: { article: Article }) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} />
      <CategoryGrid />
      <EditorialBody html={a.content_mdx} />
    </article>
  );
}

/** Curated category list — order is editorial, not alphabetic. Keys are
 *  symbolic so we can render icons without coupling to DB slugs. */
const CATEGORIES: {
  href: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}[] = [
  {
    href: '/ai-verktyg/ai-text-verktyg',
    title: 'AI för text',
    description: 'ChatGPT, Claude, Gemini och resten — våra bästa text-AI:er testade.',
    icon: '✎',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    href: '/ai-video',
    title: 'AI för video',
    description: 'Kling, Runway, Pika, Sora — realistisk AI-video från text eller bild.',
    icon: '▶',
    accent: 'bg-red-100 text-red-700',
  },
  {
    href: '/ai-verktyg/ai-bild-verktyg',
    title: 'AI för bild',
    description: 'Midjourney, DALL·E, Firefly — bildgenerering för kreatörer.',
    icon: '◐',
    accent: 'bg-violet-100 text-violet-700',
  },
  {
    href: '/ai-verktyg/ai-ljud-och-musik',
    title: 'AI för ljud & musik',
    description: 'Suno, ElevenLabs och andra verktyg för musik, röster och podcast.',
    icon: '♪',
    accent: 'bg-amber-100 text-amber-700',
  },
  {
    href: '/ai-verktyg/ai-kod-verktyg',
    title: 'AI för kod',
    description: 'Cursor, Copilot, Windsurf — AI som faktiskt kan utveckla.',
    icon: '⌥',
    accent: 'bg-zinc-200 text-zinc-800',
  },
  {
    href: '/ai-verktyg/ai-automation',
    title: 'AI-automation',
    description: 'Make, Zapier, n8n — koppla ihop allt med AI-driva flöden.',
    icon: '⇆',
    accent: 'bg-indigo-100 text-indigo-700',
  },
  {
    href: '/ai-verktyg/foretag',
    title: 'AI för företag',
    description: 'B2B-användning per yrke: marknadsföring, ekonomi, sälj.',
    icon: '◧',
    accent: 'bg-sky-100 text-sky-700',
  },
  {
    href: '/ai-verktyg/gratis',
    title: 'Gratis AI-verktyg',
    description: 'De bästa AI-verktygen utan kostnad — testade och rankade.',
    icon: '✦',
    accent: 'bg-teal-100 text-teal-700',
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
          <span className="text-fg-muted">AI-verktyg</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✦</span> {CATEGORIES.length} kategorier · {new Date().getFullYear()}
        </span>

        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-7xl">
          {a.title}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-3xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            {a.excerpt}
          </p>
        )}
      </div>
    </header>
  );
}

function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Välj kategori
      </div>
      <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h2 className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Alla AI-verktyg
        </h2>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          ⓘ Klicka in på en kategori för topplistan
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col gap-4 rounded-xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className={`inline-flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${c.accent}`}
              >
                {c.icon}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-fg group-hover:text-indigo-600">
                {c.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-fg-subtle">{c.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Se topplistan <span aria-hidden>›</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function EditorialBody({ html }: { html: string | null }) {
  if (!html) return null;
  const clean = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return (
    <section
      aria-labelledby="editorial"
      className="mx-auto max-w-3xl px-4 pb-20 sm:px-6"
    >
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Redaktionell översikt
      </div>
      <h2
        id="editorial"
        className="mb-8 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl"
      >
        Så väljer du rätt AI-verktyg
      </h2>
      <div className="magazine-prose">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-4
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-xl prose-h3:font-bold
            prose-p:text-fg-muted prose-p:leading-[1.85] prose-p:text-[17px]
            prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-hr:my-12 prose-hr:border-line
            prose-img:rounded-xl prose-img:border prose-img:border-line
          "
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
