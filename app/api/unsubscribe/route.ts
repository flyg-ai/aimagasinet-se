import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Avregistrering. Endast POST — se kommentaren i app/avregistrera/page.tsx
 *  om varför en GET inte får ha den här effekten.
 *
 *  Tar emot formulärets `token` och sätter active=false. Svarar med en
 *  303-omdirigering tillbaka till bekräftelsesidan, så att flödet fungerar
 *  helt utan klient-JS. */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const token = String(form?.get('token') ?? '').trim();

  const back = (params: string) =>
    NextResponse.redirect(new URL(`/avregistrera/?${params}`, req.url), 303);

  if (!token) return back('status=fel');

  try {
    const { data, error } = await supabaseAdmin()
      .from('subscribers')
      .update({ active: false })
      .eq('unsubscribe_token', token)
      .select('id');

    // Okänd token ger ingen rad tillbaka. Vi säger inte vilket det var —
    // sidan visar samma besked oavsett, så en gissad token inte avslöjar
    // om adressen finns.
    if (error || !data?.length) {
      console.warn('[unsubscribe] ingen träff för token');
      return back(`token=${encodeURIComponent(token)}`);
    }

    console.log('[unsubscribe] avregistrerad, id:', data[0].id);
    return back(`token=${encodeURIComponent(token)}&status=done`);
  } catch (e) {
    console.error('[unsubscribe] fel:', e);
    return back(`token=${encodeURIComponent(token)}`);
  }
}
