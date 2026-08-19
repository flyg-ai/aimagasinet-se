-- 0015 — använd ämnets förgenererade bild när artikeln skapas
--
-- article_topics.image_url (0014) fylls av scripts/attach-topic-images.ts.
-- Cron-routen läser den redan i koden, men den koden är inte deployad. Den här
-- triggern gör samma sak i databasen och fungerar därför oavsett vilken kod som
-- är i drift.
--
-- Körordning mot 0013: den här är BEFORE INSERT och läser image_url;
-- articles_drop_used_topic är AFTER INSERT och raderar ämnesraden. Läsningen
-- sker alltså före raderingen.
--
-- Bara INSERT: en senare uppdatering av artikeln ska inte kunna skriva över en
-- bild som satts för hand.
--
-- Rulla tillbaka:
--   drop trigger if exists articles_use_topic_image on articles;
--   drop function if exists use_topic_image();

create or replace function use_topic_image() returns trigger language plpgsql as $$
declare
  v text;
begin
  select image_url into v from article_topics where topic = new.title;
  if v is not null then
    new.featured_image := v;
  end if;
  return new;
end $$;

drop trigger if exists articles_use_topic_image on articles;
create trigger articles_use_topic_image
  before insert on articles
  for each row execute function use_topic_image();
