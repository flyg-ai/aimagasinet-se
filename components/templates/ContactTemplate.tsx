import Link from 'next/link';
import type { Article } from '@/lib/supabase';

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

      {/* Visual mock — no submit handler. Button type="button" prevents
          the browser from refreshing the page on click. */}
      <form
        className="space-y-5 rounded-xl border border-line bg-card p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Namn" placeholder="Förnamn Efternamn" type="text" />
          <Field id="email" label="E-post" placeholder="namn@företag.se" type="email" />
        </div>

        <div>
          <label htmlFor="subject" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            Ämne
          </label>
          <select
            id="subject"
            className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            defaultValue=""
          >
            <option value="" disabled>Välj ett ämne</option>
            <option>Tips på AI-verktyg att testa</option>
            <option>Idé för en guide eller artikel</option>
            <option>Annonsering & samarbeten</option>
            <option>Rättelse eller felrapport</option>
            <option>Annat</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
            Meddelande
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Berätta lite mer om vad det gäller…"
            className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
            ⓘ Vi svarar inom en arbetsdag
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700"
          >
            Skicka <span aria-hidden>›</span>
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  id, label, placeholder, type,
}: {
  id: string; label: string; placeholder: string; type: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-line-strong bg-card px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}

function ContactInfo() {
  const items: { label: string; value: string; href: string; note: string; icon: string }[] = [
    {
      label: 'Redaktionen',
      value: 'redaktionen@aimagasinet.se',
      href: 'mailto:redaktionen@aimagasinet.se',
      note: 'Tips, frågor om innehållet, rättelser.',
      icon: '✎',
    },
    {
      label: 'Annonsering',
      value: 'annonsering@aimagasinet.se',
      href: 'mailto:annonsering@aimagasinet.se',
      note: 'Mediakit, samarbeten, sponsrade tester.',
      icon: '◧',
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
      a: 'Absolut. Skicka en kort beskrivning + länk till redaktionen@aimagasinet.se. Vi prioriterar verktyg som funkar i svenska arbetsflöden eller som löser ett tydligt problem för svenska användare.',
    },
    {
      q: 'Skriver ni gästinlägg eller anlitar externa skribenter?',
      a: 'Ja, för specialiserade områden anlitar vi branschexperter. Skicka en kort pitch + två tidigare arbetsprover till redaktionen@aimagasinet.se så återkommer vi om det matchar pipeline.',
    },
    {
      q: 'Hittade ett faktafel — vart anmäler jag?',
      a: 'Tack för att du tar dig tid. Mejla redaktionen@aimagasinet.se med URL + vad som är fel, så rättar vi och uppdaterar artikeln med en kort rättelse-not.',
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
