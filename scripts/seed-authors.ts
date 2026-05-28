/**
 * Seed the 3 launch authors of AI-Magasinet and upload Nicklas's
 * profile picture to the "avatars" Supabase Storage bucket.
 *
 *   npx tsx scripts/seed-authors.ts
 *
 * Requires that 0008_authors.sql has already been applied (the script
 * upserts into the authors table — if the table doesn't exist you'll
 * see a Postgres error and the script aborts before touching anything
 * else).
 *
 * Idempotent — upserts on slug, re-runs replace bio/role.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const BUCKET = 'avatars';
const NICKLAS_AVATAR_SRC = 'C:/Users/hallb/Desktop/profilbild.jpg';

function contentTypeFor(filename: string): string {
  switch (extname(filename).toLowerCase()) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png':  return 'image/png';
    case '.webp': return 'image/webp';
    default:      return 'application/octet-stream';
  }
}

async function ensureBucket() {
  const { data: existing } = await db.storage.getBucket(BUCKET);
  if (existing) {
    console.log(`Bucket "${BUCKET}" already exists.`);
    return;
  }
  const { error } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 1024 * 1024 * 5,
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`createBucket: ${error.message}`);
  }
  console.log(`Created public bucket "${BUCKET}".`);
}

async function uploadAvatar(localPath: string, slug: string): Promise<string> {
  if (!statSync(localPath, { throwIfNoEntry: false })) {
    throw new Error(`Avatar source not found: ${localPath}`);
  }
  const ext = extname(localPath).toLowerCase() || '.jpg';
  const key = `${slug}${ext}`;
  const bytes = readFileSync(localPath);
  const { error } = await db.storage.from(BUCKET).upload(key, bytes, {
    contentType: contentTypeFor(localPath),
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  const { data: pub } = db.storage.from(BUCKET).getPublicUrl(key);
  console.log(`  ✓ avatar ${basename(localPath)} → ${pub.publicUrl}`);
  return pub.publicUrl;
}

type AuthorSeed = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  twitter_url?: string;
  linkedin_url?: string;
};

async function main() {
  await ensureBucket();

  const nicklasAvatar = await uploadAvatar(NICKLAS_AVATAR_SRC, 'nicklas-hallberg');

  const authors: (AuthorSeed & { avatar_url: string | null })[] = [
    {
      slug: 'nicklas-hallberg',
      name: 'Nicklas Hallberg',
      role: 'Grundare & Chefredaktör',
      avatar_url: nicklasAvatar,
      linkedin_url: 'https://www.linkedin.com/in/nicklashallberg/',
      bio:
        'Nicklas är grundare och chefredaktör för AI-Magasinet. Han har arbetat med SEO och digital ' +
        'marknadsföring i över tio år och var tidigt ute med att integrera AI-verktyg i strategier för ' +
        'svenska företag — från small-business-kunder till börsbolag. På AI-Magasinet är hans fokus ' +
        'att skriva praktiska, ärliga guider och recensioner som faktiskt hjälper läsaren välja rätt ' +
        'verktyg, snarare än att jaga branschens senaste hype. Han testar alla verktyg själv innan ' +
        'de hamnar i en topplista.',
    },
    {
      slug: 'erik-lindgren',
      name: 'Erik Lindgren',
      role: 'AI-journalist',
      avatar_url: null,
      bio:
        'Erik bevakar AI-nyhetsflödet för AI-Magasinet — från OpenAI- och Anthropic-releases till ' +
        'EU AI Act och svenska regulatoriska turer. Han kommer från traditionell näringslivs- och ' +
        'teknikjournalistik och hans styrka är att översätta tunga modell-papers och pressmeddelanden ' +
        'till svensk klartext utan att tappa nyansen. Erik är särskilt intresserad av hur AI-policy ' +
        'och säkerhetsdebatt utvecklas i Norden, och varför det ibland skiljer sig från Bay Area-' +
        'narrativet i amerikansk media.',
    },
    {
      slug: 'sara-nilsson',
      name: 'Sara Nilsson',
      role: 'Teknikskribent',
      avatar_url: null,
      bio:
        'Sara är teknikskribent på AI-Magasinet och dyker djupt i hur modellerna faktiskt fungerar. ' +
        'Med bakgrund som mjukvaruutvecklare och senare ML-praktiker, skriver hon förklarande artiklar ' +
        'om transformer-arkitektur, diffusion-modeller, RAG-pipelines och hur olika modell-familjer ' +
        'jämför sig på benchmarks som faktiskt betyder något. Hon föredrar konkreta jämförelser framför ' +
        'marknadssiffror — om en modell sägs vara "bäst" så vill hon veta på vilken evalueringsuppgift, ' +
        'med vilken sampling och vad det kostade i compute.',
    },
  ];

  console.log(`Upserting ${authors.length} authors…`);
  const { data, error } = await db
    .from('authors')
    .upsert(authors, { onConflict: 'slug' })
    .select('slug,name,role');
  if (error) { console.error('upsert authors:', error.message); process.exit(1); }
  for (const a of data ?? []) console.log(`  ✓ ${a.slug.padEnd(20)} ${a.name} — ${a.role}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
