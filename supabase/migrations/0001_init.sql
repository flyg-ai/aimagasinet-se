-- aimagasinet.se — initial schema
-- Apply via: Supabase Dashboard → SQL Editor (paste & run)
-- or via Supabase CLI: `supabase db push`

create table if not exists categories (
  slug        text primary key,
  name        text not null,
  description text
);

create table if not exists articles (
  id              bigint generated always as identity primary key,
  slug            text unique not null,
  title           text not null,
  content_mdx     text,
  excerpt         text,
  category        text references categories(slug) on delete set null,
  tags            text[] not null default '{}',
  featured_image  text,
  type            text not null default 'post' check (type in ('post','page')),
  published_at    timestamptz,
  seo_title       text,
  seo_description text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists articles_category_idx     on articles(category);
create index if not exists articles_published_at_idx on articles(published_at desc nulls last);
create index if not exists articles_type_idx         on articles(type);

-- updated_at trigger
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists articles_set_updated_at on articles;
create trigger articles_set_updated_at
  before update on articles
  for each row execute function set_updated_at();

-- Public read access (anon key). Writes require service role.
alter table articles   enable row level security;
alter table categories enable row level security;

drop policy if exists "public read articles"   on articles;
drop policy if exists "public read categories" on categories;

create policy "public read articles"   on articles   for select using (true);
create policy "public read categories" on categories for select using (true);
