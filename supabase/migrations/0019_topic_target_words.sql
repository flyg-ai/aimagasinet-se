-- 0019 — mallängd per ämne
--
-- Systemprompten kapar vid ~800 ord, vilket är rätt för de flesta ämnen. Men
-- vissa förtjänar djup — de artiklar som drar mest trafik pa sajten ligger pa
-- 2400–3000 ord. Utan ett falt har fick de skrivas ut och utokas for hand.
--
-- NULL = anvand promptens standardlangd. Ett varde overstyr den.
--
-- Applicera: paste i Supabase Dashboard -> SQL Editor.
-- Rulla tillbaka: alter table article_topics drop column target_words;

alter table article_topics
  add column if not exists target_words integer
  check (target_words is null or (target_words between 400 and 4000));

comment on column article_topics.target_words is
  'Onskad artikellangd i ord. NULL => promptens standard (~800).';
