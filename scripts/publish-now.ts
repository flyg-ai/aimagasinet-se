/**
 * Publicera (eller opublicera) en enskild artikel omedelbart, via slug.
 *
 * Sidorna filtrerar bara pa `published_at IS NOT NULL` — ingen jamforelse
 * mot klockan — sa ett framtida datum doljer INTE artikeln till dess. Att
 * "schemalagga" betyder darfor att kora det har kommandot vid den tidpunkt
 * man faktiskt vill att artikeln ska bli synlig.
 *
 *   npx tsx scripts/publish-now.ts <slug>              # publicera nu
 *   npx tsx scripts/publish-now.ts <slug> --unpublish   # dra tillbaka
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const slug = process.argv[2]?.trim();
const unpublish = process.argv.includes('--unpublish');

if (!slug) {
  console.error('Ange en slug: npx tsx scripts/publish-now.ts <slug> [--unpublish]');
  process.exit(1);
}

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const published_at = unpublish ? null : new Date().toISOString();
  const { data, error } = await db
    .from('articles')
    .update({ published_at })
    .eq('slug', slug)
    .select('slug,title,path')
    .single();

  if (error) {
    console.error(`FEL: ${error.message}`);
    process.exit(1);
  }
  if (!data) {
    console.error(`Ingen artikel med slug "${slug}"`);
    process.exit(1);
  }

  const row = data as { slug: string; title: string; path: string };
  console.log(
    unpublish
      ? `Opublicerad: ${row.title}`
      : `Publicerad ${published_at}: ${row.title}\n  https://aimagasinet.se${row.path}`,
  );
}

main();
