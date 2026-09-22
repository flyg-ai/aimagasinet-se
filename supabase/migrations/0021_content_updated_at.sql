-- Ärligt innehållsdatum.
--
-- updated_at bumpas av triggern articles_set_updated_at (0001_init.sql) vid
-- VARJE uppdatering av raden — även bildbyten, excerpt-justeringar och
-- cache-fixar. Det gör "Senast uppdaterad", JSON-LD dateModified, og
-- modifiedTime och sitemapens lastModified missvisande.
--
-- content_updated_at flyttas bara fram när title eller content_mdx faktiskt
-- ändras. Koden läser content_updated_at ?? updated_at, så den fungerar både
-- före och efter att migrationen körts.
--
-- Körs manuellt i Supabase Dashboard -> SQL Editor. Idempotent.

begin;

alter table articles add column if not exists content_updated_at timestamptz;

comment on column articles.content_updated_at is
  'Senaste ändring av title eller content_mdx. Sätts av triggern '
  'articles_set_content_updated_at. Driver "Senast uppdaterad", dateModified '
  'och sitemapens lastModified.';

-- Backfill. User-triggrar stängs av för just denna UPDATE, annars skulle
-- set_updated_at() bumpa updated_at på samtliga rader (samma teknik som
-- 0011_updated_at_baseline.sql). Bara rader som saknar värde röres, så en
-- omkörning är ofarlig.
alter table articles disable trigger user;

update articles
set content_updated_at = coalesce(updated_at, published_at, created_at)
where content_updated_at is null;

alter table articles enable trigger user;

create or replace function set_content_updated_at() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    if new.content_updated_at is null then
      new.content_updated_at := now();
    end if;
  elsif new.title is distinct from old.title
     or new.content_mdx is distinct from old.content_mdx then
    new.content_updated_at := now();
  else
    new.content_updated_at := old.content_updated_at;
  end if;
  return new;
end $$;

-- Egen trigger bredvid articles_set_updated_at; de rör olika kolumner och
-- påverkar inte varandra.
drop trigger if exists articles_set_content_updated_at on articles;
create trigger articles_set_content_updated_at
  before insert or update on articles
  for each row execute function set_content_updated_at();

commit;
