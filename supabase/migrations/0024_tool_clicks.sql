-- 0024 — tool_clicks: loggar klick på "Prova X"/"Läs recension"-knapparna
-- via /go/[slug]-redirecten, så vi får förstapartsdata på vilka verktyg som
-- faktiskt konverterar besökare till klick (inte bara sidvisningar).
--
-- source = var på sajten knappen satt ('review-hero' | 'review-bottom' |
-- 'review-sidebar' | 'hub-toplist' | ...), is_affiliate = true om länken
-- hade en riktig affiliate_url (annars en vanlig fallbackUrl-länk).
--
-- RLS på utan policies = bara service-role (backend) kan läsa/skriva.
-- Inga publika policies, så anon-nyckeln kan aldrig nå tabellen.
--
-- Applicera: paste i Supabase Dashboard → SQL Editor, eller
--   DATABASE_URL=postgres://… npx tsx scripts/apply-migration.ts supabase/migrations/0024_tool_clicks.sql

create table if not exists tool_clicks (
  id bigint generated always as identity primary key,
  slug text not null,
  source text,
  is_affiliate boolean not null default false,
  referer text,
  created_at timestamptz not null default now()
);

create index if not exists tool_clicks_slug_idx on tool_clicks (slug);
create index if not exists tool_clicks_created_at_idx on tool_clicks (created_at);

alter table tool_clicks enable row level security;
