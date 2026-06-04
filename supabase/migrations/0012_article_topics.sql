-- 0012 — article_topics: kö av ämnen för den nattliga artikel-genereringen
-- (app/api/cron/generate-articles). Cron-jobbet plockar de äldsta oanvända
-- ämnena, genererar artiklar och markerar dem used=true.
--
-- Applicera: paste i Supabase Dashboard → SQL Editor, eller
--   DATABASE_URL=postgres://… npx tsx scripts/apply-migration.ts supabase/migrations/0012_article_topics.sql

create table if not exists article_topics (
  id          bigint generated always as identity primary key,
  topic       text not null unique,
  category    text references categories(slug) on delete set null,
  used        boolean not null default false,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists article_topics_unused_idx
  on article_topics (created_at) where used = false;

-- Intern tabell — låst för publik åtkomst. Service role (cron) kringgår RLS.
alter table article_topics enable row level security;

-- Seed: 20 AI-relaterade ämnen (idempotent via unique(topic) + on conflict).
insert into article_topics (topic, category) values
  ('Multimodala AI-modeller 2026: när text, bild och ljud smälter samman', 'teknik-modeller'),
  ('AI-agenter i praktiken: så automatiserar svenska företag sina arbetsflöden', 'foretag-aktorer'),
  ('Open source mot proprietära AI-modeller: vad ska företag välja 2026?', 'teknik-modeller'),
  ('AI och upphovsrätt: rättsläget för AI-genererat innehåll i Sverige', 'lagstiftning-policy'),
  ('Så förändrar AI den svenska arbetsmarknaden 2026', 'samhalle-paverkan'),
  ('Retrieval-augmented generation (RAG) förklarat för beslutsfattare', 'teknik-modeller'),
  ('AI i svensk sjukvård: tillämpningar, nytta och vad som krävs', 'samhalle-paverkan'),
  ('Mindre språkmodeller (SLM): när små modeller slår de stora', 'forskning-utveckling'),
  ('AI-säkerhet 2026: prompt injection, jailbreaks och hur man försvarar sig', 'ai-sakerhet-etik'),
  ('EU AI Act i praktiken: checklista för svenska företag', 'lagstiftning-policy'),
  ('AI-driven kodgenerering: hur utvecklarrollen förändras', 'samhalle-paverkan'),
  ('Vektordatabaser förklarat: ryggraden i moderna AI-applikationer', 'teknik-modeller'),
  ('AI och desinformation: deepfakes och källkritik inför valår', 'samhalle-paverkan'),
  ('Svenska AI-startups att hålla koll på 2026', 'foretag-aktorer'),
  ('Fine-tuning mot prompting: när lönar det sig att träna en egen modell?', 'forskning-utveckling'),
  ('AI-etik i praktiken: bias, transparens och ansvar', 'ai-sakerhet-etik'),
  ('AI-assistenter på jobbet: produktivitet kontra integritet', 'foretag-aktorer'),
  ('Reasoning-modeller: hur AI lärde sig att tänka steg för steg', 'forskning-utveckling'),
  ('AI och energiförbrukning: vad kostar en AI-fråga egentligen?', 'samhalle-paverkan'),
  ('Nästa generations AI-hårdvara: GPU:er, NPU:er och svensk infrastruktur', 'teknik-modeller')
on conflict (topic) do nothing;
