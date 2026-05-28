-- aimagasinet.se — bylines & author profile pages
-- Apply via: Supabase Dashboard → SQL Editor (paste & run)
-- or via Supabase CLI: `supabase db push`

create table if not exists authors (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  role         text,
  bio          text,
  avatar_url   text,
  twitter_url  text,
  linkedin_url text,
  created_at   timestamptz not null default now()
);

create index if not exists authors_slug_idx on authors(slug);

alter table articles
  add column if not exists author_slug text references authors(slug) on delete set null;

create index if not exists articles_author_slug_idx on articles(author_slug);

-- RLS: anon can read author rows for /skribenter/<slug> pages; only
-- service-role writes (matches the articles/categories pattern).
alter table authors enable row level security;

drop policy if exists "anon read authors" on authors;
create policy "anon read authors" on authors
  for select using (true);
