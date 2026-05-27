import Link from 'next/link';
import type { Article } from '@/lib/supabase';

/** Renders /om-oss. Mission + redaktionen + varför + kontakt-CTA.
 *  Content stays in code (no DB editing surface for this page yet);
 *  article.content_mdx is rendered after the team section if present. */
export function AboutTemplate({ article: a }: { article: Article }) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} />
      <Mission />
      <Team />
      <WhyWeExist />
      <ContactCta />
      {a.content_mdx && <EditorialBody html={a.content_mdx} />}
    </article>
  );
}

function Hero({ article: a }: { article: Article }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-muted">
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
        <nav
          aria-label="Brödsmulor"
          className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          <Link href="/" className="hover:text-indigo-600">Hem</Link>
          <span className="mx-2 text-line-strong">›</span>
          <span className="text-fg-muted">Om oss</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✦</span> Om AI-Magasinet
        </span>

        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-6xl">
          {a.title || 'Om AI-Magasinet'}
        </h1>

        {a.excerpt && (
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            {a.excerpt}
          </p>
        )}
      </div>
    </header>
  );
}

function Mission() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Mission
      </div>
      <h2 className="mb-6 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        Vi förklarar AI på riktigt
      </h2>
      <div className="space-y-4 text-[17px] leading-[1.75] text-fg-muted">
        <p>
          AI-Magasinet är Sveriges oberoende magasin om artificiell intelligens.
          Vi skriver för svenska företagare, marknadsförare, utvecklare och
          professionella som vill förstå AI på riktigt — inte bli sålda på hype.
        </p>
        <p>
          Vår mission är enkel: <strong>hjälpa svenska läsare välja, använda
          och dra nytta av AI-verktyg utan brus.</strong> Det betyder att vi
          testar verktygen själva, rankar dem oberoende, och säger nej när
          marknadsföringen är överdriven.
        </p>
      </div>
    </section>
  );
}

function Team() {
  const members: { name: string; role: string; bio: string; initial: string; accent: string }[] = [
    {
      name: 'Redaktionen',
      role: 'Chefredaktör & Tester',
      bio: 'AI-Magasinets redaktion testar och rankar AI-verktyg i svenska arbetsflöden. Vi har bakgrund inom teknik, journalistik och digital marknadsföring.',
      initial: 'R',
      accent: 'bg-indigo-600',
    },
    {
      name: 'Tekniska skribenter',
      role: 'Skribenter & Analytiker',
      bio: 'Utvecklare, dataanalytiker och AI-praktiker som skriver djupgående om hur AI-modellerna faktiskt fungerar och hur du bygger med dem.',
      initial: 'T',
      accent: 'bg-emerald-600',
    },
    {
      name: 'Branschexperter',
      role: 'Gästskribenter & Källor',
      bio: 'Vi anlitar branschexperter för specialiserade områden — SEO, redovisning, juridik — så att rekommendationerna faktiskt håller i svensk kontext.',
      initial: 'B',
      accent: 'bg-amber-600',
    },
  ];

  return (
    <section className="border-y border-line bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Redaktionen
        </div>
        <h2 className="mb-10 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Vilka är vi?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <article key={m.name} className="rounded-xl border border-line bg-card p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-black text-white ${m.accent}`}>
                  {m.initial}
                </div>
                <div className="min-w-0">
                  <div className="text-lg font-black uppercase tracking-tight text-fg">{m.name}</div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">{m.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-fg-subtle">{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyWeExist() {
  const reasons: { title: string; body: string; icon: string }[] = [
    {
      title: 'Oberoende rankningar',
      body: 'Vi tar inte betalt för placeringar. Rankningarna bygger på faktiska tester i svenska arbetsflöden — inte på vem som annonserar mest.',
      icon: '⚖',
    },
    {
      title: 'Svensk kontext',
      body: 'AI-verktyg testas på svenska data, mot svenska användningsfall — bokföring enligt K2/K3, SEO mot svenska SERPs, copy på svenska. Inte direktöversatta amerikanska tester.',
      icon: '◧',
    },
    {
      title: 'Praktiska guider',
      body: 'Mindre teori, mer "så här gör du". Vi skriver för läsare som faktiskt ska sätta upp ett verktyg i morgon, inte bara förstå konceptet.',
      icon: '⚙',
    },
    {
      title: 'Transparens',
      body: 'När vi tjänar provision på affiliate-länkar skriver vi det rakt ut. Provisioner påverkar inte vår rankning — det redovisar vi också rakt ut.',
      icon: '✓',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Varför vi finns
      </div>
      <h2 className="mb-10 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        Det här driver oss
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {reasons.map((r) => (
          <article key={r.title} className="rounded-xl border border-line bg-card p-6">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-xl text-indigo-700"
              >
                {r.icon}
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight text-fg">{r.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-fg-subtle">{r.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="border-t border-line bg-indigo-50/60">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 text-center">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Säg hej
        </div>
        <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Vill du komma i kontakt?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-fg-subtle">
          Har du tips på verktyg vi borde testa? En idé för en guide?
          Frågor om annonsering eller samarbeten? Vi svarar inom en arbetsdag.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700"
          >
            Kontakta oss <span aria-hidden>›</span>
          </Link>
          <a
            href="mailto:kontakt@aimagasinet.se"
            className="inline-flex items-center gap-2 rounded-md border border-line bg-card px-6 py-3 text-sm font-bold uppercase tracking-wider text-fg hover:border-indigo-300 hover:text-indigo-700"
          >
            kontakt@aimagasinet.se
          </a>
        </div>
      </div>
    </section>
  );
}

function EditorialBody({ html }: { html: string | null }) {
  if (!html) return null;
  const clean = html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    // /om-oss should be ren text — the WP import shipped a large lamp
    // illustration mid-page that fights the team-grid for attention.
    // Strip standalone <img> (including self-closing) and <figure>/<picture>
    // blocks so the AboutTemplate sections own the visual hierarchy.
    .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*\/?>/gi, '');
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="magazine-prose">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg
            prose-h2:mt-12 prose-h2:text-2xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-4
            prose-p:text-fg-muted prose-p:leading-[1.85]
            prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
          "
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
