import Link from 'next/link';
import type { Article } from '@/lib/supabase';

/** Renders /kontakt. Hero + visual form mock (no submit logic) + contact
 *  info cards + FAQ. */
export function ContactTemplate({ article: a }: { article: Article }) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} />
      <EmailBlock />
      <Faq />
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
          <span className="text-fg-muted">Kontakt</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          <span aria-hidden>✉</span> Säg hej
        </span>

        <h1 className="mt-6 max-w-3xl text-balance text-5xl font-black uppercase leading-[1.02] tracking-tight text-fg sm:text-6xl">
          Kontakta AI-Magasinet
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
          {a.excerpt ||
            'Tips på verktyg, idéer för guider, annonsering eller samarbeten — vi svarar inom en arbetsdag.'}
        </p>
      </div>
    </header>
  );
}

function EmailBlock() {
  return (
    <section aria-labelledby="email" className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="rounded-2xl border border-line bg-card p-8 text-center sm:p-12">
        <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
          E-post
        </div>
        <h2 id="email" className="text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          Hör av dig direkt
        </h2>
        <p className="mt-4 text-fg-muted">
          Tips på verktyg, frågor om innehållet, annonsering, samarbeten eller
          rättelser — skicka ett mejl så svarar vi inom en arbetsdag.
        </p>

        <a
          href="mailto:kontakt@aimagasinet.se"
          className="mt-8 inline-flex items-center gap-3 rounded-md bg-indigo-600 px-6 py-4 text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700 sm:text-lg"
        >
          <span aria-hidden className="text-xl">✉</span>
          kontakt@aimagasinet.se
        </a>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          ⓘ Svarstid: en arbetsdag · Mån–Fre
        </p>

        <div className="mt-10 border-t border-line-subtle pt-6 text-sm text-fg-subtle">
          Funderar du på annonsering eller samarbeten? Skriv det i ämnesraden så
          går mejlet rätt direkt. <Link href="/om-oss" className="font-semibold text-indigo-600 hover:underline">Läs mer om oss</Link>.
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const qa: { q: string; a: string }[] = [
    {
      q: 'Hur fort svarar ni på mejl?',
      a: 'Vi besvarar de flesta mejl inom en arbetsdag. Tipset om ett AI-verktyg som ska testas kan ta längre tid eftersom vi prioriterar utifrån vad läsare frågar mest efter.',
    },
    {
      q: 'Tar ni betalt för att rekommendera verktyg?',
      a: 'Nej. Placeringar i topplistor och rankningar är aldrig till salu. Vi tjänar provision på vissa affiliate-länkar, men det påverkar inte rankningen och vi skriver alltid ut när en länk är sponsrad.',
    },
    {
      q: 'Kan jag tipsa er om ett verktyg ni borde testa?',
      a: 'Absolut. Skicka en kort beskrivning + länk till kontakt@aimagasinet.se. Vi prioriterar verktyg som funkar i svenska arbetsflöden eller som löser ett tydligt problem för svenska användare.',
    },
    {
      q: 'Skriver ni gästinlägg eller anlitar externa skribenter?',
      a: 'Ja, för specialiserade områden anlitar vi branschexperter. Skicka en kort pitch + två tidigare arbetsprover till kontakt@aimagasinet.se så återkommer vi om det matchar pipeline.',
    },
    {
      q: 'Hittade ett faktafel — vart anmäler jag?',
      a: 'Tack för att du tar dig tid. Mejla kontakt@aimagasinet.se med URL + vad som är fel, så rättar vi och uppdaterar artikeln med en kort rättelse-not.',
    },
  ];

  return (
    <section className="border-t border-line bg-muted">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
          Vanliga frågor
        </div>
        <h2 className="mb-10 border-b border-line pb-3 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
          FAQ
        </h2>
        <dl className="flex flex-col gap-6">
          {qa.map((item) => (
            <div key={item.q} className="rounded-xl border border-line bg-card p-6">
              <dt className="font-black uppercase tracking-tight text-fg">{item.q}</dt>
              <dd className="mt-2 text-[15px] leading-[1.75] text-fg-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
