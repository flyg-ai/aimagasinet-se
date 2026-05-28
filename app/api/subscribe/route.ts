import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

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

const FROM = process.env.RESEND_FROM ?? 'AI-Magasinet <noreply@aimagasinet.se>';

function welcomeHtml(): string {
  return `
<!doctype html>
<html lang="sv">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181b;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
        <tr><td style="background:#4f46e5;padding:28px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:rgba(255,255,255,0.18);padding:6px 10px;border-radius:6px;font-weight:900;font-size:18px;color:#ffffff;letter-spacing:-0.5px;">AI</td>
              <td style="padding-left:10px;font-weight:900;font-size:18px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">MAGASINET</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;color:#18181b;letter-spacing:-0.5px;">Tack för att du prenumererar på AI-Magasinet</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#3f3f46;">
            Du är nu med på listan. Vi mejlar dig de viktigaste AI-nyheterna,
            nya verktyg och konkreta användningsfall — på svenska, utan hype
            och utan sponsrade utskick.
          </p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#3f3f46;">
            Under tiden — kika på sajten:
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
            <tr><td>
              <a href="https://aimagasinet.se" style="display:inline-block;background:#4f46e5;color:#ffffff;font-weight:700;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;letter-spacing:0.5px;text-transform:uppercase;">Till AI-Magasinet →</a>
            </td></tr>
          </table>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
            Vill du inte längre få utskick? Svara på det här mejlet med
            "avregistrera" så tar vi bort dig från listan direkt.
          </p>
        </td></tr>
        <tr><td style="padding:24px 32px;border-top:1px solid #e4e4e7;background:#fafafa;">
          <p style="margin:0;font-size:12px;line-height:1.6;color:#71717a;">
            AI-Magasinet — svenskt magasin om artificiell intelligens.<br />
            <a href="mailto:kontakt@aimagasinet.se" style="color:#4f46e5;text-decoration:none;">kontakt@aimagasinet.se</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim();
}

async function sendWelcome(email: string): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: 'no_api_key' };
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Välkommen till AI-Magasinet',
      html: welcomeHtml(),
    });
    if (error) {
      console.error('resend.emails.send error:', error);
      return { sent: false, reason: typeof error === 'object' && error && 'message' in error ? String((error as { message: unknown }).message) : 'resend_error' };
    }
    return { sent: true };
  } catch (e) {
    console.error('resend exception:', e);
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
  const emailResult = alreadySubscribed ? { sent: false, reason: 'already_subscribed' } : await sendWelcome(normalized);

  return NextResponse.json({
    ok: true,
    alreadySubscribed,
    emailSent: emailResult.sent,
    emailReason: emailResult.reason,
  });
}
