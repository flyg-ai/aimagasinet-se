-- 0013 — ta bort ämnet ur kön så fort dess artikel finns
--
-- Bakgrund: article_topics markerades tidigare med used=true efter publicering.
-- Den flaggan nollställdes av något mellan körningarna, så cronen plockade samma
-- tre ämnen tre nätter i rad och publicerade dubbletter (-2, -3-suffix).
-- En rad som raderas kan inte avmarkeras. Kön blir därmed definitionen av vad
-- som återstår, i stället för en lista med en flagga som kan hamna ur synk.
--
-- Triggern gör detta i databasen och är därför oberoende av vilken kod som är
-- deployad — vilken väg som än skapar artikeln (cron, skript, manuellt)
-- försvinner ämnet ur kön i samma transaktion.
--
-- OBS: used/used_at droppas INTE här. Den kod som ligger i produktion frågar
-- fortfarande på `used = false` och skulle sluta fungera. Kolumnerna tas bort i
-- en senare migration, efter att den nya routen är i drift.
--
-- Applicera: paste i Supabase Dashboard → SQL Editor, eller
--   DATABASE_URL=postgres://… npx tsx scripts/apply-migration.ts supabase/migrations/0013_drop_topic_on_publish.sql
--
-- Rulla tillbaka:
--   drop trigger if exists articles_drop_used_topic on articles;
--   drop function if exists drop_used_topic();

create or replace function drop_used_topic() returns trigger language plpgsql as $$
begin
  -- article_topics.topic har unique-constraint (0012), så detta är en
  -- indexerad punktradering. Matchar inget om titeln inte kommer ur kön.
  delete from article_topics where topic = new.title;
  return new;
end $$;

drop trigger if exists articles_drop_used_topic on articles;
create trigger articles_drop_used_topic
  after insert or update on articles
  for each row execute function drop_used_topic();
