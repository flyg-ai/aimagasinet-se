-- aimagasinet.se — newsletter subscribers
-- Apply via: Supabase Dashboard → SQL Editor (paste & run)
-- or via Supabase CLI: `supabase db push`

create table if not exists subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now(),
  active     boolean not null default true
);

create index if not exists subscribers_active_idx     on subscribers(active);
create index if not exists subscribers_created_at_idx on subscribers(created_at desc);

-- RLS: only service-role writes. Anon role never reads/writes this table.
alter table subscribers enable row level security;

-- (No anon policies — service-role bypasses RLS.)
