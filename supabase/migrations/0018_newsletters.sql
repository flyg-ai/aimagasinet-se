-- 0018 — veckobrev som utkast
--
-- Brev genereras till den har tabellen med status='draft' och skickas aldrig
-- automatiskt. Ett utskick gar inte att ta tillbaka, till skillnad fran en
-- artikel, sa en manniska ska lasa varje nummer innan det gar ut.
--
-- content ar strukturerad data (rubrik, notiser, kallor), inte HTML. Bade
-- mejlet och webbsidan renderas fran samma data via lib/newsletter.ts, sa att
-- det bara finns en sanning om vad numret innehaller.
--
-- Applicera: paste i Supabase Dashboard -> SQL Editor.
-- Rulla tillbaka: drop table newsletters;

create table if not exists newsletters (
  id         bigint generated always as identity primary key,
  week       text unique not null,          -- ISO-vecka, t.ex. "2026-v34"
  subject    text not null,                 -- amnesrad
  content    jsonb not null,                -- se NewsletterContent i lib/newsletter.ts
  status     text not null default 'draft'
             check (status in ('draft', 'approved', 'published', 'sent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at    timestamptz
);

create index if not exists newsletters_status_idx on newsletters(status);
create index if not exists newsletters_created_at_idx on newsletters(created_at desc);

drop trigger if exists newsletters_set_updated_at on newsletters;
create trigger newsletters_set_updated_at
  before update on newsletters
  for each row execute function set_updated_at();

-- Intern tabell. Utkast far aldrig vara publikt lasbara — sidan
-- /veckobrev/[week] anvander service role och slapper bara igenom
-- publicerade nummer utan nyckel.
alter table newsletters enable row level security;
