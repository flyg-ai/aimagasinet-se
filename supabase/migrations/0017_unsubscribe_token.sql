-- 0017 — avregistreringstoken per prenumerant
--
-- Avregistreringen i välkomstmejlet var tidigare en mailto-länk, vilket
-- betydde att prenumeranten fick mejla redaktionen och någon flippa active
-- för hand. Med en token blir länken ett klick.
--
-- Token i stället för e-postadress i URL:en: adressen får inte ligga i en
-- länk som passerar loggar, referrers och mejlklienter, och en token gör det
-- omöjligt att avregistrera någon annan genom att gissa.
--
-- Applicera: paste i Supabase Dashboard -> SQL Editor.
-- Rulla tillbaka: alter table subscribers drop column unsubscribe_token;

alter table subscribers
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

create unique index if not exists subscribers_unsubscribe_token_key
  on subscribers(unsubscribe_token);

comment on column subscribers.unsubscribe_token is
  'Hemlig token för ett-kliks-avregistrering. Skickas i varje utskick.';
