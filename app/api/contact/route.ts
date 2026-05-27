import { NextResponse } from 'next/server';

/** POST /api/contact — sends the contact form to kontakt@aimagasinet.se via
 *  Resend when RESEND_API_KEY is set in the environment. When the key is
 *  missing, returns 503 { useMailto: true } so the client can fall back to a
 *  mailto: link without the user re-typing.
 *
 *  Server-only — never run in the edge runtime, since Resend's SDK uses
 *  Node-only crypto and we don't want to bundle it client-side. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

const RECIPIENT = 'kontakt@aimagasinet.se';
const FROM = process.env.RESEND_FROM_ADDRESS || 'AI-Magasinet <onboarding@resend.dev>';

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  // Validate. Each field has a hard ceiling so a single request can't
  // ship 10MB into the email body.
  const errors: string[] = [];
  if (!isNonEmptyString(body.name, 200)) errors.push('name');
  if (!isNonEmptyString(body.email, 200) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email as string)) errors.push('email');
  if (!isNonEmptyString(body.subject, 200)) errors.push('subject');
  if (!isNonEmptyString(body.message, 5000)) errors.push('message');
  if (errors.length > 0) {
    return NextResponse.json({ error: `Invalid fields: ${errors.join(', ')}` }, { status: 400 });
  }

  const { name, email, subject, message } = body as Record<'name' | 'email' | 'subject' | 'message', string>;

  // No key configured → tell the client to fall back to mailto:. We return
  // 503 (Service Unavailable) so the response is structurally distinguishable
  // from a validation error or success — the client switches strategy.
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { useMailto: true, recipient: RECIPIENT },
      { status: 503 }
    );
  }

  try {
    // Lazy-load Resend so installations without the key skip the SDK module.
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM,
      to: [RECIPIENT],
      replyTo: email,
      subject: `[Kontakt] ${subject}`,
      text: [
        `Från: ${name} <${email}>`,
        `Ämne: ${subject}`,
        '',
        message,
      ].join('\n'),
      html: [
        `<p><strong>Från:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
        `<p><strong>Ämne:</strong> ${escapeHtml(subject)}</p>`,
        `<hr />`,
        `<p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>`,
      ].join(''),
    });

    if (error) {
      console.error('[contact] resend error:', error);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[contact] unexpected:', e);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
