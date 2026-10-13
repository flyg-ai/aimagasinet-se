import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findStockholmCompany } from '@/lib/ai-konsult/stockholm';
import AiKonsultForm from '@/components/AiKonsultForm';

type Props = { params: { company: string } };

export function generateMetadata({ params }: Props): Metadata {
  const c = findStockholmCompany(params.company);
  if (!c) return {};
  const title = `${c.name}: AI-konsult i ${c.city}`;
  return {
    title,
    description: `${c.name} i ${c.city}. ${c.text} Uppgifterna är hämtade från bolagets egen webbplats.`,
    alternates: { canonical: `https://aimagasinet.se/ai-konsult/stockholm/${c.slug}/` },
  };
}

const QUESTIONS = [
  { q: 'Vilket problem ska AI lösa?', a: 'Utgå från en konkret process eller utmaning i verksamheten som ni vill förbättra.' },
  { q: 'Vilken data behöver ni tillgång till?', a: 'Tydliggör vilken data som behövs och hur åtkomst och säkerhet ska hanteras.' },
  { q: 'Hur ser upplägg och kostnad ut?', a: 'Stäm av omfattning, ansvarsfördelning och hur uppföljning sker.' },
];

export default function StockholmCompanyPage({ params }: Props) {
  const c = findStockholmCompany(params.company);
  if (!c) notFound();

  const siteLabel = c.website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
    <main className="pb-16">
      {/* Huvud */}
      <header className="border-b border-black/10 bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:border-white/10 dark:from-white/5 dark:via-transparent dark:to-white/5">
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
          <nav className="text-sm text-fg/60" aria-label="Brödsmulor">
            <Link href="/" className="hover:underline">Start</Link>
            <span className="mx-2">/</span>
            <Link href="/ai-konsult/stockholm/" className="hover:underline">AI-konsulter i Stockholm</Link>
            <span className="mx-2">/</span>
            <span>{c.name}</span>
          </nav>

          <div className="mt-6 flex flex-col gap-6 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-5">
              <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-3xl font-bold shadow-sm ${c.tone}`} aria-hidden>
                {c.letter}
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{c.name}</h1>
                <p className="mt-1 text-fg/80">AI-konsult i {c.city}</p>
                <p className="mt-1 text-sm text-fg/60">{c.city} · {c.region}</p>
                <span className="mt-3 inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-fg/70 shadow-sm dark:bg-white/10">
                  Redaktionell företagsprofil
                </span>
              </div>
            </div>
            <a href={c.website} target="_blank" rel="nofollow noopener" className="rounded-lg bg-indigo-600 px-5 py-3 text-center font-medium text-white hover:bg-indigo-700">
              Besök {c.name}s webbplats ↗
            </a>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm font-medium text-fg/70" aria-label="Sektioner">
            <a href="#oversikt" className="border-b-2 border-indigo-600 pb-3 text-indigo-600">Översikt</a>
            <a href="#tjanster" className="pb-3 hover:text-fg">Tjänster</a>
            <a href="#kontakta" className="pb-3 hover:text-fg">Inför kontakt</a>
            <a href="#fragor" className="pb-3 hover:text-fg">Vanliga frågor</a>
          </nav>
        </div>
      </header>

      <div className="mx-auto mt-10 grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-14">
          {/* Översikt */}
          <section id="oversikt" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Om {c.name}</h2>
            <p className="mt-3 text-fg/80">{c.text}</p>
            <p className="mt-3 text-sm text-fg/60">Källa: {c.name}s webbplats.</p>
          </section>

          {/* Tjänster */}
          <section id="tjanster" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Tjänster och kompetens</h2>
            <p className="mt-2 text-sm text-fg/60">Tjänsteområden så som de står på bolagets webbplats.</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {c.services.map((s) => (
                <li key={s} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-fg dark:border-white/10 dark:bg-white/5">
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {/* Inför kontakt */}
          <section id="kontakta" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Bra frågor inför första kontakten</h2>
            <ol className="mt-5 divide-y divide-black/10 dark:divide-white/10">
              {QUESTIONS.map((x, i) => (
                <li key={x.q} className="flex gap-4 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">{i + 1}</span>
                  <div>
                    <p className="font-medium text-fg">{x.q}</p>
                    <p className="mt-1 text-sm text-fg/70">{x.a}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Förfrågan */}
          <AiKonsultForm city={c.city} />

          {/* Kundcase */}
          <section className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-lg font-semibold text-fg">Kundcase och referenser</h2>
            <p className="mt-2 text-fg/80">{c.cases}</p>
          </section>

          {/* Vanliga frågor */}
          <section id="fragor" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight text-fg">Vanliga frågor om {c.name}</h2>
            <dl className="mt-5 divide-y divide-black/10 rounded-xl border border-black/10 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
              <div className="p-5">
                <dt className="font-medium text-fg">Var finns {c.name}?</dt>
                <dd className="mt-2 text-fg/80">{c.address ? `${c.address}.` : `Adressen står inte på webbplatsen. Orten är ${c.city}.`}</dd>
              </div>
              <div className="p-5">
                <dt className="font-medium text-fg">Vilka tjänster erbjuder {c.name}?</dt>
                <dd className="mt-2 text-fg/80">{c.services.join(', ')}.</dd>
              </div>
              <div className="p-5">
                <dt className="font-medium text-fg">Hur kontaktar jag {c.name}?</dt>
                <dd className="mt-2 text-fg/80">
                  {c.email ? `E-post: ${c.email}. ` : ''}{c.phone ? `Telefon: ${c.phone}. ` : ''}Kontaktsidan finns på <a href={c.website} target="_blank" rel="nofollow noopener" className="text-indigo-600 hover:underline">{siteLabel}</a>.
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Sidopanel */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="text-lg font-semibold text-fg">Kontakt och företagsinfo</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-fg/60">Ort</dt><dd className="text-right text-fg">{c.city}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-fg/60">Region</dt><dd className="text-right text-fg">{c.region}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-fg/60">Webbplats</dt><dd className="text-right"><a href={c.website} target="_blank" rel="nofollow noopener" className="text-indigo-600 hover:underline">{siteLabel}</a></dd></div>
              {c.email && <div className="flex justify-between gap-4"><dt className="text-fg/60">E-post</dt><dd className="text-right"><a href={`mailto:${c.email}`} className="text-indigo-600 hover:underline">{c.email}</a></dd></div>}
              {c.address && <div className="flex justify-between gap-4"><dt className="text-fg/60">Adress</dt><dd className="text-right text-fg">{c.address}</dd></div>}
            </dl>
            <a href={c.website} target="_blank" rel="nofollow noopener" className="mt-5 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-700">
              Besök {c.name} ↗
            </a>
            <p className="mt-3 text-xs text-fg/60">Du kontaktar företaget direkt.</p>
          </section>

          <section className="rounded-xl bg-indigo-50 p-6 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">För företaget</p>
            <h2 className="mt-2 text-lg font-semibold text-fg">Arbetar du på {c.name}?</h2>
            <p className="mt-1 text-sm text-fg/70">Gör anspråk på profilen och håll informationen aktuell.</p>
            <ul className="mt-4 space-y-2 text-sm text-fg/80">
              <li>✓ Uppdatera företagsbeskrivningen</li>
              <li>✓ Komplettera tjänster och kontakt</li>
              <li>✓ Lägg till relevanta kundcase</li>
            </ul>
            <button type="button" disabled className="mt-5 w-full cursor-not-allowed rounded-lg bg-indigo-600/50 px-4 py-2.5 text-sm font-medium text-white">
              Gör anspråk på profilen (kommer snart)
            </button>
          </section>
        </aside>
      </div>

      {/* Källrad */}
      <div className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-fg/70 dark:border-white/10 dark:bg-white/5">
          <span>Sammanställt av AI-Magasinet med {c.name}s webbplats som källa.</span>
          <Link href="/ai-konsult/stockholm/" className="font-medium text-indigo-600 hover:underline">Jämför fler AI-konsulter i Stockholm →</Link>
        </div>
      </div>
    </main>
  );
}
