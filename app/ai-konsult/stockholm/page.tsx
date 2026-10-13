import type { Metadata } from 'next';
import Link from 'next/link';
import { STOCKHOLM_COMPANIES } from '@/lib/ai-konsult/stockholm';
import { STOCKHOLM_SEO_HTML } from '@/lib/ai-konsult/seo-text';
import AiKonsultWizard from '@/components/AiKonsultWizard';

export const metadata: Metadata = {
  title: 'AI-konsult Stockholm: fem bolag och hur du väljer rätt',
  description: 'Fem AI-konsulter i Stockholmsområdet, med källa på varje uppgift, och frågor att ställa innan du anlitar en AI-konsult.',
  alternates: { canonical: 'https://aimagasinet.se/ai-konsult/stockholm/' },
};

const STEPS = [
  { title: 'Beskriv problemet', text: 'Vad vill ni uppnå, och vilka utmaningar vill ni lösa?' },
  { title: 'Sätt en budget', text: 'Ett avgränsat första uppdrag är oftast enklast att jämföra och styra.' },
  { title: 'Be om referenser', text: 'Fråga efter exempel på liknande uppdrag och erfarenheter i er bransch.' },
];

export default function AiKonsultStockholm() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      {/* Hero */}
      <section className="pt-8 sm:pt-12">
        <nav className="text-sm text-fg/60" aria-label="Brödsmulor">
          <Link href="/" className="hover:underline">Start</Link>
          <span className="mx-2">/</span>
          <Link href="/ai-konsult/" className="hover:underline">AI-konsulter</Link>
          <span className="mx-2">/</span>
          <span>Stockholm</span>
        </nav>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">AI-konsulter · Stockholm</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
              Hitta rätt AI-konsult i <span className="text-indigo-600">Stockholm</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-fg/70">
              Jämför bolag inom AI, automation och data. Listan är redaktionell och bygger på uppgifter från bolagens egna webbplatser.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#bolag" className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">
                Utforska konsulterna ↓
              </a>
              <a href="#kontakta" className="rounded-lg px-5 py-3 font-medium text-indigo-600 hover:underline">
                Kontakta oss för hjälp att välja →
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-lg">
            <p className="text-sm font-medium opacity-80">Från idé till AI i verksamheten</p>
            <ol className="mt-6 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm opacity-80">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Lista och sidopanel */}
      <section id="bolag" className="mt-16 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-fg">AI-konsulter i Stockholm</h2>
              <p className="mt-2 text-fg/70">Vilken hjälp behöver ni?</p>
            </div>
            <p className="text-sm text-fg/60">{STOCKHOLM_COMPANIES.length} bolag · Sorterade redaktionellt</p>
          </div>

          <ul className="mt-8 grid gap-4">
            {STOCKHOLM_COMPANIES.map((c) => (
              <li key={c.slug} className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-5 sm:flex-row sm:items-center dark:border-white/10 dark:bg-white/5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-bold ${c.tone}`} aria-hidden>
                  {c.letter}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-fg">{c.name}</h3>
                  <p className="text-sm text-fg/60">{c.city}</p>
                  <p className="mt-2 text-fg/80">{c.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.services.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                  <Link href={`/ai-konsult/stockholm/${c.slug}/`} className="rounded-lg border border-indigo-600 px-4 py-2 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50">
                    Visa företag →
                  </Link>
                  <a href={c.website} target="_blank" rel="nofollow noopener" className="text-center text-sm text-indigo-600 hover:underline sm:text-right">
                    Webbplats ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-6 lg:sticky lg:top-24 lg:self-start dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold text-fg">Börja med ett tydligt mål</h2>
          <p className="mt-2 text-sm text-fg/70">Ett tydligt syfte gör det enklare att hitta rätt konsult och jämföra förslagen.</p>
          <ol className="mt-6 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-fg">{s.title}</p>
                  <p className="text-sm text-fg/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* Förfrågan: upplysningen står alltid före knappen. */}
      <section id="kontakta" className="mt-16 scroll-mt-24">
        <AiKonsultWizard city="Stockholm" />
      </section>

      {/* Redaktionell guide under listan. Texten ligger i lib/ai-konsult/seo-text.ts. */}
      <section id="guide" className="prose prose-neutral mt-16 max-w-3xl dark:prose-invert prose-headings:font-semibold prose-headings:text-fg">
        <div dangerouslySetInnerHTML={{ __html: STOCKHOLM_SEO_HTML }} />
      </section>
    </main>
  );
}
