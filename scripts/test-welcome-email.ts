/**
 * Send the welcome email to one address using the local RESEND_API_KEY —
 * bypasses /api/subscribe entirely (no DB write, no alreadySubscribed guard)
 * so it works regardless of the production env. Fetches the latest 3 articles
 * from Supabase so the preview matches the real email.
 *
 *   npx tsx scripts/test-welcome-email.ts                 # → default address
 *   npx tsx scripts/test-welcome-email.ts foo@bar.com     # → custom address
 */
import { config as loadEnv } from 'dotenv';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { welcomeHtml, fetchLatestArticles } from '../lib/welcome-email';

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

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
  const articles = await fetchLatestArticles(db);
  console.log('latest articles:', articles.length, articles.map((a) => a.title));

  const resend = new Resend(key);
  const result = await resend.emails.send({
    from,
    to,
    subject: 'Välkommen till AI-Magasinet',
    html: welcomeHtml(to, articles),
  });

  console.log('result:', JSON.stringify(result, null, 2));
  if (result.error) {
    console.error('FAILED — Resend returnerade ett fel (se ovan).');
    process.exit(1);
  }
  console.log(`OK — skickat till ${to} · id: ${result.data?.id}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
