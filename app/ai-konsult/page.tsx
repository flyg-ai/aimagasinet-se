import type { Metadata } from 'next';
import Link from 'next/link';
import AiKonsultWizard from '@/components/AiKonsultWizard';

export const metadata: Metadata = {
  title: 'Hitta rätt AI-konsult för ditt företag',
  description: 'Utforska AI-konsulter i Sverige och hitta rätt kompetens för ditt företag. Jämför bolag efter stad, med källa på varje uppgift.',
  alternates: { canonical: 'https://aimagasinet.se/ai-konsult/' },
};

const CITIES = [
  { name: 'Stockholm', href: '/ai-konsult/stockholm/', live: true },
  { name: 'Göteborg', href: '', live: false },
  { name: 'Malmö', href: '', live: false },
];

const SERVICES = [
  { title: 'AI-strategi', text: 'Få hjälp att identifiera möjligheter, sätta riktning och skapa en plan som passar er verksamhet.' },
  { title: 'Automation & AI-agenter', text: 'Effektivisera processer och återkommande arbetsuppgifter med hjälp av AI och agenter.' },
  { title: 'Utveckling & integration', text: 'Bygga och integrera AI-lösningar i era befintliga system och arbetsflöden.' },
];

const STEPS = [
  { n: '01', title: 'Beskriv målet', text: 'Vad vill ni uppnå, och vilken utmaning vill ni lösa?' },
  { n: '02', title: 'Avgränsa första projektet', text: 'Ett tydligt och hanterbart uppdrag är ofta enklast att jämföra och styra.' },
  { n: '03', title: 'Jämför erfarenhet och arbetssätt', text: 'Fråga efter liknande projekt, branscherfarenhet och hur de arbetar.' },
];

const FAQ = [
  { q: 'Vad gör en AI-konsult?', a: 'En AI-konsult hjälper ett företag att kartlägga var AI kan användas, välja verktyg, bygga en pilot och integrera lösningen i befintliga system.' },
  { q: 'Vad kostar en AI-konsult?', a: 'Priserna varierar mycket. Enligt Opsios prisguide ligger en AI-konsult i Sverige typiskt mellan 1 200 och 2 500 kronor i timmen.' },
  { q: 'Behöver konsulten finnas i samma stad?', a: 'Nej. Många arbetar på distans. Kontrollera med bolaget hur de arbetar och var de träffar kunder.' },
  { q: 'Hur förbereder vi ett första möte?', a: 'Beskriv problemet i en mening, uppskatta vad det kostar i dag, och se till att någon på företaget äger uppgiften. Frågorna att ställa finns på Stockholmssidan.' },
];

export default function AiKonsultHub() {
  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-8 sm:px-6 lg:grid-cols-2 lg:pt-12">
        <div>
          <nav className="text-sm text-fg/60" aria-label="Brödsmulor">
            <Link href="/" className="hover:underline">Start</Link>
            <span className="mx-2">/</span>
            <span>AI-konsult</span>
          </nav>
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-indigo-600">AI-konsulter i Sverige</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
            Hitta rätt AI-konsult <span className="text-indigo-600">för ditt företag.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-fg/70">
            Utforska konsulter inom AI, automation och data. Hitta kompetensen som passar era mål och ert nästa steg.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/ai-konsult/stockholm/#kontakta" className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700">
              Få hjälp att hitta rätt →
            </Link>
            <Link href="/ai-konsult/stockholm/" className="rounded-lg px-6 py-3 font-medium text-indigo-600 hover:underline">
              Utforska konsulter efter stad ↓
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-medium text-fg/60">Vad vill ni ha hjälp med?</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['Automatisera arbetet', 'Bygga en AI-lösning', 'Strategi och rådgivning', 'Utbilda teamet'].map((opt) => (
              <div key={opt} className="rounded-xl border border-black/10 p-4 text-sm font-medium text-fg dark:border-white/10">{opt}</div>
            ))}
          </div>
          <Link href="/ai-konsult/stockholm/#kontakta" className="mt-5 block rounded-lg bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-700">
            Nästa steg →
          </Link>
          <p className="mt-3 text-center text-xs text-fg/60">Osäker? Beskriv ert behov, så hjälper vi er vidare.</p>
        </div>
      </section>

      {/* Städer */}
      <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-fg">Hitta AI-konsult i din stad</h2>
          <Link href="/ai-konsult/stockholm/" className="text-sm font-medium text-indigo-600 hover:underline">Se alla orter →</Link>
        </div>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {CITIES.map((c) => (
            <li key={c.name}>
              {c.live ? (
                <Link href={c.href} className="block rounded-xl border border-black/10 bg-white p-6 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xl font-semibold text-fg">{c.name}</p>
                  <p className="mt-2 text-sm text-fg/70">Fem AI-konsulter i Stockholmsområdet, med källa på varje uppgift.</p>
                  <p className="mt-4 text-sm font-medium text-indigo-600">Utforska konsulter →</p>
                </Link>
              ) : (
                <div className="block rounded-xl border border-dashed border-black/15 p-6 dark:border-white/15">
                  <p className="text-xl font-semibold text-fg/60">{c.name}</p>
                  <p className="mt-2 text-sm text-fg/50">Kommer snart.</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Guide */}
      <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <AiKonsultWizard />
      </section>

      {/* Tjänster */}
      <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-fg">Vad kan en AI-konsult hjälpa er med?</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <li key={s.title} className="rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-lg font-semibold text-fg">{s.title}</p>
              <p className="mt-2 text-sm text-fg/70">{s.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Steg */}
      <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl bg-indigo-50 p-8 sm:p-12 dark:bg-white/5">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-fg">Från AI-idé till ett tydligt uppdrag</h2>
              <p className="mt-4 text-fg/80">
                Börja i liten skala och utgå från ett konkret behov. En AI-konsult kan hjälpa er att kartlägga möjligheter, välja rätt angreppssätt och få fram ett första, avgränsat uppdrag som skapar värde.
              </p>
            </div>
            <ol className="space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-indigo-700">{s.n}</span>
                  <div>
                    <p className="font-semibold text-fg">{s.title}</p>
                    <p className="mt-1 text-sm text-fg/70">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-20 grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-fg">Vanliga frågor om AI-konsulter</h2>
          <dl className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-white/5">
            {FAQ.map((f) => (
              <div key={f.q} className="p-5">
                <dt className="font-medium text-fg">{f.q}</dt>
                <dd className="mt-2 text-sm text-fg/80">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
        <aside className="rounded-2xl bg-indigo-600 p-8 text-white lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Kom igång</p>
          <h2 className="mt-3 text-2xl font-semibold">Osäker på var ni ska börja?</h2>
          <p className="mt-3 text-sm text-white/85">
            Berätta kort om er verksamhet och vad ni vill uppnå. Vi hjälper er att hitta rätt typ av AI-konsult och nästa steg.
          </p>
          <Link href="/ai-konsult/stockholm/#kontakta" className="mt-6 block rounded-lg bg-white px-4 py-3 text-center font-medium text-indigo-700 hover:bg-indigo-50">
            Beskriv ert behov →
          </Link>
        </aside>
      </section>
    </main>
  );
}
