import { NextResponse } from 'next/server';
import { Resend } from 'resend';

/** Förfrågan från formuläret "Vill du att vi förmedlar en förfrågan?".
 *
 *  POST { need: string, email: string, consent: true }
 *    → 200 { ok: true }
 *    → 400 { error: 'invalid' }
 *    → 500 { error: 'send_failed' }
 *
 *  Ingen data sparas i databasen. Förfrågan mejlas till redaktionen, som
 *  styr vidare till bolag. Samtycket krävs, annars tas förfrågan inte emot.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO = process.env.AI_KONSULT_FORFRAGAN_TO ?? 'kontakt@aimagasinet.se';
const FROM = process.env.RESEND_FROM ?? 'AI-Magasinet <kontakt@aimagasinet.se>';

export async function POST(req: Request) {
  let body: { need?: unknown; email?: unknown; consent?: unknown; forward?: unknown; city?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const need = typeof body.need === 'string' ? body.need.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const city = typeof body.city === 'string' ? body.city.trim().slice(0, 80) : 'Stockholm';
  // Vidareförmedling är ett eget, valfritt samtycke. Lagras som ja/nej och tidpunkt.
  const forward = body.forward === true;
  const consentAt = new Date().toISOString();

  if (body.consent !== true || !EMAIL_RE.test(email) || need.length < 10 || need.length > 2000) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('[ai-konsult-forfragan] RESEND_API_KEY saknas');
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }

  try {
    const resend = new Resend(key);
    const result = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Ny förfrågan: AI-konsult, ${city}`,
      text: `Ny förfrågan via AI-konsult-sidan.\n\nOrt: ${city}\nE-post: ${email}\n\nBehov:\n${need}\n\nSamtycke att svara: lämnat ${consentAt} (UTC).\nSamtycke att förmedla: ${forward ? `lämnat ${consentAt} (UTC)` : 'nej, ej lämnat'}.`,
    });
    if (result.error) {
      console.error('[ai-konsult-forfragan] resend error:', JSON.stringify(result.error));
      return NextResponse.json({ error: 'send_failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[ai-konsult-forfragan] exception:', e);
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }
}
