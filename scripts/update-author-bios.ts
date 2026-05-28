/**
 * One-shot DB update of the three author rows with refreshed bios and
 * social links. Run after seed-authors.ts has created the initial rows.
 *
 *   npx tsx scripts/update-author-bios.ts
 *
 * Idempotent — upserts on slug.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

type AuthorUpdate = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  linkedin_url?: string;
  twitter_url?: string;
};

const AUTHORS: AuthorUpdate[] = [
  {
    slug: 'nicklas-hallberg',
    name: 'Nicklas Hallberg',
    role: 'Grundare & Chefredaktör',
    linkedin_url: 'https://www.linkedin.com/in/nicklas-hallberg-1987aa25/',
    bio:
      'Nicklas Hallberg är grundare av AI-Magasinet och flyg.ai. Han arbetar som ' +
      'SEO-specialist och AI-konsult med fokus på hur svenska företag kan använda AI ' +
      'för att växa. Tidigare erfarenhet inom SEM, social marketing och webbutveckling. ' +
      'På AI-Magasinet är hans fokus att skriva praktiska, ärliga guider och recensioner ' +
      'som faktiskt hjälper läsaren välja rätt verktyg — han testar alla verktyg själv ' +
      'innan de hamnar i en topplista. Driver också flyg.ai där samma redaktionella ' +
      'rigorositet appliceras på AI-driven flygsökning.',
  },
  {
    slug: 'erik-lindgren',
    name: 'Erik Lindgren',
    role: 'AI-journalist',
    bio:
      'Erik Lindgren är AI-journalist på AI-Magasinet med bakgrund inom teknik- och ' +
      'näringslivsjournalistik. Han bevakar de stora modell-releaserna från OpenAI, ' +
      'Anthropic, Google och Meta — men ägnar lika mycket tid åt LLM-vardagsanvändning, ' +
      'AI-kodverktyg som Cursor och Copilot, och automationsstacken runt AI-agenter. ' +
      'Hans styrka är att översätta tunga modellpapers och tekniska pressmeddelanden ' +
      'till svensk klartext utan att tappa nyansen, och att skilja mellan vad som ' +
      'faktiskt fungerar i produktion och vad som bara fungerar på demo-videon.',
  },
  {
    slug: 'sara-nilsson',
    name: 'Sara Nilsson',
    role: 'Teknikskribent',
    bio:
      'Sara Nilsson är teknikskribent på AI-Magasinet med specialisering på AI-etik, ' +
      'juridik och AI för företag. Hennes fokus ligger i skärningspunkten mellan vad ' +
      'AI tekniskt kan göra och vad svenska regelverk, GDPR och kommande EU AI Act ' +
      'faktiskt tillåter. Hon skriver djupgående om bias, dataskydd och ansvarsfrågor ' +
      'i AI-deployment, men också om mer praktiska B2B-användningsfall — från ' +
      'avtalsgranskning på advokatbyråer till AI-driven kundservice i e-handel.',
  },
];

async function main() {
  console.log(`Updating ${AUTHORS.length} authors…`);
  const { data, error } = await db
    .from('authors')
    .upsert(AUTHORS, { onConflict: 'slug' })
    .select('slug,name,role');
  if (error) { console.error(error.message); process.exit(1); }
  for (const a of data ?? []) console.log(`  ✓ ${a.slug.padEnd(20)} ${a.name} — ${a.role}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
