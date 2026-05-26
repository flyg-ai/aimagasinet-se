-- 0003 — affiliate URL for "Testa [Tool]" CTAs
-- Apply: Supabase Dashboard → SQL Editor → paste & run

alter table articles
  add column if not exists affiliate_url text;

comment on column articles.affiliate_url is
  'External link for "Testa →" CTA buttons (e.g. partner/affiliate). NULL = no CTA shown.';
