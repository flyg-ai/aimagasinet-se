/**
 * Send the welcome email to one address using the local RESEND_API_KEY —
 * bypasses /api/subscribe entirely (no DB, no alreadySubscribed guard) so it
 * works regardless of the production env. Verifies the key + verified
 * from-domain can actually deliver.
 *
 *   npx tsx scripts/test-welcome-email.ts                 # → default address
 *   npx tsx scripts/test-welcome-email.ts foo@bar.com     # → custom address
 */
import { config as loadEnv } from 'dotenv';
import { Resend } from 'resend';
import { welcomeHtml } from '../lib/welcome-email';

loadEnv({ path: '.env.local' });

const to = process.argv[2] ?? 'hallberg.nicklas@gmail.com';
const from = process.env.RESEND_FROM ?? 'AI-Magasinet <kontakt@aimagasinet.se>';
const key = process.env.RESEND_API_KEY;

async function main() {
  console.log('RESEND_API_KEY present:', !!key, '· length:', key?.length ?? 0);
  console.log('from:', from, '· to:', to);
  if (!key) {
    console.error('RESEND_API_KEY saknas i .env.local — avbryter.');
    process.exit(1);
  }

  const resend = new Resend(key);
  const result = await resend.emails.send({
    from,
    to,
    subject: 'Välkommen till AI-Magasinet',
    html: welcomeHtml(to),
  });

  console.log('result:', JSON.stringify(result, null, 2));
  if (result.error) {
    console.error('FAILED — Resend returnerade ett fel (se ovan).');
    process.exit(1);
  }
  console.log(`OK — skickat till ${to} · id: ${result.data?.id}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
