-- 0002 — add hierarchical path + parent_slug for WP page tree
-- Apply: Supabase Dashboard → SQL Editor → paste & run

alter table articles
  add column if not exists path        text,
  add column if not exists parent_slug text;

-- Unique once backfill is done; safe to add now since column is NULL everywhere
do $$ begin
  if not exists (
    select 1 from pg_indexes where indexname = 'articles_path_key'
  ) then
    create unique index articles_path_key on articles(path);
  end if;
end $$;

create index if not exists articles_parent_slug_idx on articles(parent_slug);
