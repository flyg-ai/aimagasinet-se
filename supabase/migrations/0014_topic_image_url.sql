-- 0014 — förgenererad omslagsbild per ämne
--
-- Unsplash ger generiska träffar för abstrakta ämnen även med en bra sökfras
-- (se imageQueryFor i app/api/cron/generate-articles). Med image_url satt
-- använder cronen den bilden i stället, och hoppar över Unsplash helt.
--
-- Bilder laddas upp med scripts/attach-topic-images.ts, som konverterar till
-- 1200 px WebP och skriver URL:en hit. NULL = fall tillbaka på Unsplash.
--
-- Säker att köra mot befintlig kod: kolumnen är nullbar och den deployade
-- routen selectar namngivna kolumner, så den påverkas inte.
--
-- Applicera: paste i Supabase Dashboard → SQL Editor.
-- Rulla tillbaka: alter table article_topics drop column image_url;

alter table article_topics
  add column if not exists image_url text;

comment on column article_topics.image_url is
  'Förgenererad omslagsbild (Supabase Storage). NULL => Unsplash-fallback.';
