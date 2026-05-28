-- aimagasinet.se — FAQ blocks attached to hub/review/yrkesroll pages
-- Apply via: Supabase Dashboard → SQL Editor (paste & run)

alter table articles
  add column if not exists faq jsonb;

-- Optional partial index for "articles with a faq" lookups.
create index if not exists articles_faq_idx
  on articles ((faq is not null))
  where faq is not null;

-- Shape stored: jsonb array of { question: text, answer: text }.
-- Example:
--   [{"question": "Vad kostar ChatGPT?", "answer": "Gratis-version finns…"}, …]
