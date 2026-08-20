import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { welcomeHtml, fetchLatestArticles, type WelcomeArticle } from '@/lib/welcome-email';

/** Newsletter subscribe endpoint.
 *
 *  POST { email: string }
 *    → 200 { ok: true, alreadySubscribed?: true }
 *    → 400 { error: 'invalid_email' }
 *    → 500 { error: 'db_error' | 'unexpected' }
 *
 *  The welcome email send is best-effort — when RESEND_API_KEY is unset
 *  (or Resend rejects the from-domain because aimagasinet.se isn't
 *  verified yet) the subscription is still recorded and we return ok.
 *  emailSent is reported back so the client can surface "vi mejlar dig
 *  så snart bekräftelsedelen är på plats" if needed.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// From-adressen MÅSTE använda en domän som är verifierad i Resend.
// aimagasinet.se är verifierad → kontakt@aimagasinet.se. Override via
// RESEND_FROM om du vill byta avsändare.
const FROM = process.env.RESEND_FROM ?? 'AI-Magasinet <kontakt@aimagasinet.se>';

async function sendWelcome(email: string, articles: WelcomeArticle[], token?: string): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY;

  // 2. Är RESEND_API_KEY satt i miljön (Vercel → Project → Settings →
  //    Environment Variables)? Logga närvaro + längd, ALDRIG värdet.
  console.log('[subscribe] RESEND_API_KEY present:', !!key, '· length:', key?.length ?? 0);
  console.log('[subscribe] from:', FROM, '· to:', email);

  if (!key) {
    console.error('[subscribe] aborting — RESEND_API_KEY saknas i miljön');
    return { sent: false, reason: 'no_api_key' };
  }

  try {
    const resend = new Resend(key);
    // 1. Bekräfta att vi faktiskt når Resend-anropet.
    console.log('[subscribe] calling resend.emails.send()…');

    const result = await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Välkommen till AI-Magasinet',
      html: welcomeHtml(email, articles, token),
    });

    // Logga hela svaret — { data, error }. data?.id = lyckat utskick.
    console.log('[subscribe] resend result:', JSON.stringify(result));

    // 4. Logga eventuella fel från resend.emails.send().
    if (result.error) {
      console.error('[subscribe] resend.emails.send error:', JSON.stringify(result.error));
      const msg =
        typeof result.error === 'object' && result.error && 'message' in result.error
          ? String((result.error as { message: unknown }).message)
          : 'resend_error';
      return { sent: false, reason: msg };
    }

    console.log('[subscribe] email sent OK · id:', result.data?.id);
    return { sent: true };
  } catch (e) {
    // Nätverks-/SDK-fel som kastar exception (skiljt från result.error).
    console.error('[subscribe] resend exception:', e);
    return { sent: false, reason: e instanceof Error ? e.message : 'unknown' };
  }
}

export async function POST(req: Request) {
  let email: unknown;
  try {
    const body = await req.json();
    email = (body as { email?: unknown })?.email;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();

  let db;
  try {
    db = supabaseAdmin();
  } catch (e) {
    console.error('supabaseAdmin error:', e);
    return NextResponse.json({ error: 'config' }, { status: 500 });
  }

  // Idempotent insert — onConflict(email) flips active back to true if
  // the subscriber had been soft-deleted earlier.
  const { error: dbErr, data } = await db
    .from('subscribers')
    .upsert({ email: normalized, active: true }, { onConflict: 'email', ignoreDuplicates: false })
    .select('id,created_at');

  if (dbErr) {
    console.error('subscribers upsert:', dbErr);
    return NextResponse.json({ error: 'db_error', detail: dbErr.message }, { status: 500 });
  }

  const alreadySubscribed =
    !!data?.[0]?.created_at &&
    Date.now() - new Date(data[0].created_at).getTime() > 10_000;

  // Only send welcome email on first-time signups — re-subscribe doesn't
  // need a fresh welcome.
  console.log('[subscribe] signup', normalized, '· alreadySubscribed:', alreadySubscribed, '· created_at:', data?.[0]?.created_at);
  let emailResult: { sent: boolean; reason?: string };
  if (alreadySubscribed) {
    emailResult = { sent: false, reason: 'already_subscribed' };
  } else {
    // Latest 3 published posts for the magazine-style news boxes.
    const articles = await fetchLatestArticles(supabase);
    console.log('[subscribe] latest articles:', articles.length);
    // Token hämtas separat och best-effort. Den får aldrig ingå i upserten:
    // saknas kolumnen (migration 0017 inte körd) skulle hela registreringen
    // falla på ett fel i select-listan. Utan token faller welcomeHtml tillbaka
    // på mailto-länken.
    let token: string | undefined;
    try {
      const t = await db
        .from('subscribers')
        .select('unsubscribe_token')
        .eq('email', normalized)
        .maybeSingle();
      token = (t.data as { unsubscribe_token?: string } | null)?.unsubscribe_token;
      if (t.error) console.warn('[subscribe] ingen unsubscribe_token:', t.error.message);
    } catch (e) {
      console.warn('[subscribe] token-hämtning misslyckades:', e);
    }
    emailResult = await sendWelcome(normalized, articles, token);
  }
  console.log('[subscribe] emailResult:', JSON.stringify(emailResult));

  return NextResponse.json({
    ok: true,
    alreadySubscribed,
    emailSent: emailResult.sent,
    emailReason: emailResult.reason,
  });
}
