-- 0006 — strip orphan `<div class="ai-compare ...">` wrapper opening tags from
-- the ai-text-verktyg hub.
--
-- Background: the remove-widget script removed everything from
-- `<h2>Jämför AI-textverktyg</h2>` to the next `<h2>`. That span contained the
-- widget's CLOSING </div> tags but the OPENING wrapper divs sit BEFORE the
-- starting <h2>, so they were left behind. Combined with the global
-- `.ai-compare { display: none !important }` rule in globals.css, the browser
-- auto-closed the orphan at the body boundary — sweeping the rest of the
-- article inside it and hiding everything.
--
-- Fix: surgically delete the two opening tags. Their corresponding closing
-- tags are already gone, so the resulting HTML is balanced.
--
-- Apply via Supabase Dashboard → SQL Editor. Idempotent.

update articles
set content_mdx =
  replace(
    replace(
      content_mdx,
      '<div id="ai-compare" class="ai-compare">',
      ''
    ),
    '<div class="ai-compare__header">',
    ''
  )
where slug = 'ai-text-verktyg';
