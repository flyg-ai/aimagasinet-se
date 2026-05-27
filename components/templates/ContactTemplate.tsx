import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import { ContactForm } from '@/components/ContactForm';

/** Renders /kontakt. Hero + visual form mock (no submit logic) + contact
 *  info cards + FAQ. */
export function ContactTemplate({ article: a }: { article: Article }) {
  return (
    <article className="bg-page text-fg">
      <Hero article={a} />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr,360px] lg:gap-14">
          <FormMock />
          <ContactInfo />
        </div>
      </div>
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

function FormMock() {
  return (
    <section aria-labelledby="form">
      <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
        Skicka ett meddelande
      </div>
      <h2 id="form" className="mb-6 text-3xl font-black uppercase tracking-tight text-fg sm:text-4xl">
        Hör av dig
      </h2>
      <ContactForm />
    </section>
  );
}

function ContactInfo() {
  const items: { label: string; value: string; href: string; note: string; icon: string }[] = [
    {
      label: 'E-post',
      value: 'kontakt@aimagasinet.se',
      href: 'mailto:kontakt@aimagasinet.se',
      note: 'Tips på verktyg, frågor om innehållet, annonsering och samarbeten — vi svarar inom en arbetsdag.',
      icon: '✉',
    },
  ];

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-xl border border-line bg-card p-6">
        <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
          E-post
        </div>
        <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-fg">
          Hör av dig direkt
        </h3>
        <ul className="flex flex-col divide-y divide-line-subtle">
          {items.map((i) => (
            <li key={i.label} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700"
                >
                  {i.icon}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">{i.label}</div>
                  <a
                    href={i.href}
                    className="mt-0.5 block break-all text-sm font-bold text-fg hover:text-indigo-600"
                  >
                    {i.value}
                  </a>
                  <p className="mt-1 text-xs leading-relaxed text-fg-subtle">{i.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
        <h3 className="font-black uppercase tracking-tight text-fg">Annonsering?</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
          Vi tar emot mediakit-förfrågningar och sponsrade tester men placerar
          aldrig i topplistor mot betalning.
        </p>
        <Link
          href="/om-oss"
          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600"
        >
          Läs mer om oss <span aria-hidden>›</span>
        </Link>
      </div>
    </aside>
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
