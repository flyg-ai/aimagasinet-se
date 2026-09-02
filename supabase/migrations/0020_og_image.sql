-- Genererade Open Graph-bilder.
--
-- featured_image gar inte att aterbruka for detta: ReviewTemplate renderar den
-- som kvadratisk logotyp pa verktygssidor, inte som banner. Utan en egen kolumn
-- faller og:image tillbaka pa /apple-icon.png, vilket gor att 293 verktygssidor
-- visar sajtens logotyp nar de delas i stallet for nagot som sager vad sidan
-- handlar om.
--
-- Bilderna genereras av scripts/generate-og-images.ts och ligger i
-- featured-images-bucketen under og/. Kolumnen ar bara en pekare.

alter table articles add column if not exists og_image text;

comment on column articles.og_image is
  'Genererad 1200x630-bild for delning. Sätts av scripts/generate-og-images.ts. '
  'Anvands bara nar featured_image saknas.';
