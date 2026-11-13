-- 0023 — featured_in_news: manuell flagga för att låta en hub/topplista
-- (type='page', path under /ai-verktyg/) dyka upp i startsidans nyhets-hero
-- tillsammans med riktiga nyheter. Satt EXPLICIT per artikel, aldrig
-- automatiskt — annars kan hero-platsen kapas av en hubb vi bara
-- republicerat utan att något faktiskt hänt (se diskussion 2026-11-13).
--
-- Applicera: paste i Supabase Dashboard → SQL Editor, eller
--   DATABASE_URL=postgres://… npx tsx scripts/apply-migration.ts supabase/migrations/0023_featured_in_news.sql

alter table articles
  add column if not exists featured_in_news boolean not null default false;
