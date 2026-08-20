-- 0016 — blockera artiklar med en titel som redan finns
--
-- Bakgrund: tre nätter i rad (2026-08-18, -19, -20) har samma tre artiklar
-- publicerats om med suffixen -2 och -3. Källan är inte hittad: ämnena var
-- raderade ur article_topics, rubrikerna finns inte hårdkodade i någon
-- kodversion, ingen lokal schemaläggning kör något, och texten är nygenererad
-- varje gång. Det som genererar dem gör det utanför det som går att inspektera
-- härifrån — sannolikt i Vercel-deployen eller från en parallell process.
--
-- Den här triggern stoppar det oavsett källa. Databasen är den enda punkt allt
-- måste passera.
--
-- Effekt: ett INSERT med en redan använd titel avbryts med ett fel. Cron-koden
-- fångar fel per artikel och rapporterar dem i sitt svar, så körningen fortsätter
-- med nästa ämne i stället för att haverera.
--
-- Endast INSERT: uppdatering av befintliga artiklar påverkas inte.
--
-- Applicera: paste i Supabase Dashboard -> SQL Editor.
-- Rulla tillbaka:
--   drop trigger if exists articles_block_duplicate_title on articles;
--   drop function if exists block_duplicate_title();

create or replace function block_duplicate_title() returns trigger language plpgsql as $$
begin
  if exists (select 1 from articles where title = new.title) then
    raise exception
      'Dublett blockerad: en artikel med titeln % finns redan', new.title
      using errcode = 'unique_violation';
  end if;
  return new;
end $$;

drop trigger if exists articles_block_duplicate_title on articles;
create trigger articles_block_duplicate_title
  before insert on articles
  for each row execute function block_duplicate_title();
