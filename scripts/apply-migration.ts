/**
 * Apply a Supabase migration .sql file using a direct Postgres connection.
 *
 *   DATABASE_URL=postgres://... npx tsx scripts/apply-migration.ts <file>
 *
 * Falls back to printing instructions when DATABASE_URL isn't set —
 * the service-role key alone cannot run DDL via PostgREST.
 *
 * To get DATABASE_URL: Supabase Dashboard → Project Settings → Database
 * → Connection string → URI (pooler or direct, either works).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

const file = process.argv[2];
if (!file) {
  console.error('Usage: npx tsx scripts/apply-migration.ts <path/to/file.sql>');
  process.exit(1);
}
const path = resolve(file);
if (!existsSync(path)) {
  console.error(`File not found: ${path}`);
  process.exit(1);
}
const sql = readFileSync(path, 'utf8');

const url = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;
if (!url) {
  console.error(
    'DATABASE_URL not set in .env.local.\n\n' +
    'Either:\n' +
    '  1. Add DATABASE_URL=postgres://… to .env.local and re-run this command, OR\n' +
    '  2. Paste the SQL below into Supabase Dashboard → SQL Editor:\n\n' +
    '------ BEGIN SQL ------\n' +
    sql +
    '\n------ END SQL ------\n'
  );
  process.exit(2);
}

(async () => {
  // Lazy-import so the script still gives a useful error when pg isn't
  // installed.
  let pg;
  try {
    pg = await import('pg');
  } catch {
    console.error('pg not installed — run `npm install --save-dev pg @types/pg` and retry.');
    process.exit(1);
  }
  const client = new pg.default.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log(`Applying ${file}…`);
  try {
    await client.query(sql);
    console.log('  OK');
  } catch (e) {
    console.error(`  FAILED: ${e instanceof Error ? e.message : e}`);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
