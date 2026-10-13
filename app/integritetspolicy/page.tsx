import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// OBS: texten innehåller platshållare i hakparenteser. Sidan är spärrad tills de är ifyllda:
// ta bort gardet nedan och noindex-raden när texten är klar.
export const metadata: Metadata = {
  title: 'Integritetspolicy | AI-Magasinet',
  description: 'Så hanterar AI-Magasinet personuppgifter, bland annat i formuläret för att hitta rätt AI-konsult.',
  robots: { index: false, follow: false },
};

export default function Integritetspolicy() {
  if (process.env.NODE_ENV !== 'development') notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6">
      <nav className="text-sm text-fg/60" aria-label="Brödsmulor">
        <Link href="/" className="hover:underline">Start</Link>
        <span className="mx-2">/</span>
        <span>Integritetspolicy</span>
      </nav>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-fg">Integritetspolicy</h1>
      <p className="mt-4 text-fg/70">Den här policyn beskriver hur personuppgifter hanteras på AI-Magasinet.</p>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold text-fg">Vem som ansvarar</h2>
        <p className="text-fg/80">
          Personuppgiftsansvarig är [ange namn på person eller bolag bakom AI-Magasinet, och organisationsnummer om det finns].
          Kontakt: <a href="mailto:kontakt@aimagasinet.se" className="text-indigo-600 underline">kontakt@aimagasinet.se</a>.
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold text-fg">Formuläret för att hitta rätt AI-konsult</h2>
        <p className="text-fg/80">Vi behandlar följande uppgifter:</p>
        <ul className="list-disc space-y-2 pl-5 text-fg/80">
          <li>Den beskrivning av behov som du skriver i fältet.</li>
          <li>Din e-postadress.</li>
          <li>Vilka samtycken du lämnat, och när.</li>
        </ul>
        <p className="text-fg/80">
          <strong>Samtycke att svara.</strong> Du måste kryssa i rutan för att vi ska kunna besvara din förfrågan. Vi använder uppgifterna för det och inget annat.
        </p>
        <p className="text-fg/80">
          <strong>Samtycke att förmedla.</strong> Det är ett separat och valfritt val. Om du kryssar i rutan förmedlar vi din e-postadress och ditt meddelande till en AI-konsult, som därefter kontaktar dig direkt. Du kan återkalla samtycket när som helst, genom att kontakta oss. Om du inte kryssar i rutan förmedlas inga uppgifter vidare.
        </p>
        <p className="text-fg/80">
          <strong>Rättslig grund:</strong> ditt samtycke, som lämnas genom att kryssa i respektive ruta innan du skickar förfrågan.
        </p>
        <p className="text-fg/80">
          <strong>Lagring och gallring:</strong> förfrågan lagras i vår e-postinkorg. Vi har ingen databas för förfrågningar. Uppgifterna gallras [ange tidsgräns, till exempel 12 månader efter att ärendet avslutats].
        </p>
        <p className="text-fg/80">
          <strong>Mottagare och leverantörer:</strong> vi använder tekniska leverantörer för att ta emot och skicka mejl (Resend) och för att driva webbplatsen (Vercel). De behandlar uppgifterna för vår räkning. Vi förmedlar uppgifter till AI-konsulter endast enligt det valfria samtycket ovan.
        </p>
        <p className="text-fg/80">
          <strong>Överföring utanför EU/EES:</strong> Resend och Vercel är amerikanska bolag. Överföringen sker med stöd av [ange skyddsmekanism, till exempel EU-US Data Privacy Framework eller standardavtalsklausuler, efter kontroll av respektive leverantör].
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold text-fg">Dina rättigheter</h2>
        <p className="text-fg/80">Du har rätt att:</p>
        <ul className="list-disc space-y-2 pl-5 text-fg/80">
          <li>få veta vilka uppgifter vi har om dig och få ett utdrag,</li>
          <li>få felaktiga uppgifter rättade,</li>
          <li>få dina uppgifter raderade, när det finns skäl för det,</li>
          <li>begära begränsning av behandlingen, när det finns skäl för det,</li>
          <li>få dina uppgifter i ett maskinläsbart format, när behandlingen bygger på samtycke,</li>
          <li>invända mot behandling som bygger på vårt berättigade intresse,</li>
          <li>återkalla ditt samtycke när som helst, utan att det påverkar behandling som gjorts tidigare.</li>
        </ul>
        <p className="text-fg/80">
          Rättigheterna är inte ovillkorliga, och vilka som gäller beror på behandlingen. Skicka en begäran till{' '}
          <a href="mailto:kontakt@aimagasinet.se" className="text-indigo-600 underline">kontakt@aimagasinet.se</a>.
          Du kan också klaga till Integritetsskyddsmyndigheten (IMY).
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold text-fg">Webbstatistik</h2>
        <p className="text-fg/80">
          Vi använder Vercel Analytics för att se besöksstatistik. Den omfattar sidvisningar, hänvisande sida, ungefärlig plats och typ av enhet.
          Vi skickar inte e-postadresser eller formulärtext i den statistiken, och inga sådana uppgifter ingår i webbadresser.
        </p>
      </section>

      <p className="mt-12 text-sm text-fg/60">Senast uppdaterad: oktober 2026.</p>
    </main>
  );
}
