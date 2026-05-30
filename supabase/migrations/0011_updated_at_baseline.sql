-- aimagasinet.se — reset updated_at baseline
-- Apply via: Supabase Dashboard → SQL Editor (paste & run)
-- or: DATABASE_URL=… npx tsx scripts/apply-migration.ts supabase/migrations/0011_updated_at_baseline.sql
--
-- Background: articles has an on-update trigger (moddatetime-style) that sets
-- updated_at = now() on EVERY write. That's good going forward, but it means
-- updated_at can't be reset to a historical value through the PostgREST API —
-- the trigger overrides whatever value the client sends. As a result, bulk
-- touches left most rows with a uniform "today" updated_at that differs from
-- published_at, which would render a misleading "Senast uppdaterad: <idag>" on
-- every article and emit a mass-identical dateModified (an SEO red flag).
--
-- This resets the baseline so updated_at = published_at for all existing
-- articles. We disable USER triggers for the single UPDATE so the auto-bump
-- trigger doesn't clobber the value, then re-enable it. The trigger stays in
-- place afterwards and keeps maintaining updated_at on real future edits.
--
-- The /topp-50-ai-latar-pa-spotify-2026 article is intentionally re-published
-- (published_at = now()), so its updated_at = published_at after this — which
-- is correct (freshly updated + republished).

begin;

-- Disable user-defined triggers on articles for this transaction only.
-- (DISABLE TRIGGER USER leaves internal/FK constraint triggers intact.)
alter table articles disable trigger user;

update articles
set updated_at = published_at
where published_at is not null;

alter table articles enable trigger user;

commit;
