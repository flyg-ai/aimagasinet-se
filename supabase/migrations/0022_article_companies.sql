-- 0022 — companies: kontrollerad lista med bolagsslugs per artikel, grunden
-- för ett framtida /foretag/[slug]-index. Fritext i content_mdx dedupas inte
-- ("Lovable" vs "Lovable AI"), så slugen är den enda sanningen.
--
-- Applicera: paste i Supabase Dashboard → SQL Editor, eller
--   DATABASE_URL=postgres://… npx tsx scripts/apply-migration.ts supabase/migrations/0022_article_companies.sql

alter table articles
  add column if not exists companies text[] not null default '{}';

create index if not exists articles_companies_idx
  on articles using gin (companies);
