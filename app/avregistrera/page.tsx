import type { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Avregistrera dig | AI-Magasinet',
  robots: { index: false, follow: false },
};

type Props = { searchParams: { token?: string; status?: string } };

/** Avregistrering sker i två steg med flit.
 *
 *  Mejlklienter och säkerhetsskannrar hämtar länkar i förväg för att kolla
 *  att de är ofarliga. Skulle en GET avregistrera direkt hade prenumeranter
 *  tystnat utan att ha klickat på något. Därför visar sidan en bekräftelse
 *  och själva avregistreringen sker på POST. */
export default async function Avregistrera({ searchParams }: Props) {
  const token = searchParams.token?.trim();
  const done = searchParams.status === 'done';

  let state: 'saknas' | 'okand' | 'aktiv' | 'redan' | 'klar' = 'saknas';
  let email: string | null = null;

  if (token) {
    try {
      const { data } = await supabaseAdmin()
        .from('subscribers')
        .select('email,active')
        .eq('unsubscribe_token', token)
        .maybeSingle();

      if (!data) state = 'okand';
      else {
        email = data.email as string;
        state = done ? 'klar' : data.active ? 'aktiv' : 'redan';
      }
    } catch {
      state = 'okand';
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-20">
      <h1 className="text-[28px] font-medium leading-tight tracking-tight text-fg sm:text-[34px]">
        {state === 'klar' || state === 'redan' ? 'Du är avregistrerad' : 'Avregistrera dig'}
      </h1>

      {state === 'saknas' && (
        <p className="mt-5 text-[17px] leading-relaxed text-fg/70">
          Länken saknar en giltig kod. Använd länken längst ner i något av våra mejl, eller
          hör av dig till <a className="underline" href="mailto:kontakt@aimagasinet.se">kontakt@aimagasinet.se</a> så
          löser vi det.
        </p>
      )}

      {state === 'okand' && (
        <p className="mt-5 text-[17px] leading-relaxed text-fg/70">
          Vi hittar ingen prenumeration för den här länken. Den kan redan vara använd. Hör av
          dig till <a className="underline" href="mailto:kontakt@aimagasinet.se">kontakt@aimagasinet.se</a> om
          du fortsätter få mejl.
        </p>
      )}

      {state === 'aktiv' && (
        <>
          <p className="mt-5 text-[17px] leading-relaxed text-fg/70">
            Vill du sluta få utskick till <strong className="text-fg">{email}</strong>?
          </p>
          <form action="/api/unsubscribe" method="post" className="mt-7">
            <input type="hidden" name="token" value={token} />
            <button
              type="submit"
              className="rounded-lg bg-fg px-5 py-3 text-[15px] font-semibold text-bg transition-opacity hover:opacity-90"
            >
              Ja, avregistrera mig
            </button>
          </form>
          <p className="mt-6 text-[14px] leading-relaxed text-fg/50">
            Ångrar du dig kan du skriva upp dig igen när som helst på startsidan.
          </p>
        </>
      )}

      {(state === 'klar' || state === 'redan') && (
        <>
          <p className="mt-5 text-[17px] leading-relaxed text-fg/70">
            {email ? (
              <>
                <strong className="text-fg">{email}</strong> får inga fler utskick från oss.
              </>
            ) : (
              'Adressen får inga fler utskick från oss.'
            )}
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-fg/60">
            Tack för att du läste. Sajten finns kvar om du vill titta förbi —{' '}
            <a className="underline" href="/">
              aimagasinet.se
            </a>
            .
          </p>
        </>
      )}
    </main>
  );
}
