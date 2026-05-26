-- 0005 — refresh hub editorial content_mdx for /ai-verktyg/ai-text-verktyg.
-- Apply: Supabase Dashboard → SQL Editor → paste & run.
-- Idempotent — second run finds no old strings to replace and no-ops.
--
-- Fixes:
--   • "Claude 3.5 Sonnet"            → "Claude (Anthropic)"
--   • old slug in URLs               → new slug
--   • https://aimagasinet.se/ai-…    → /ai-…   (on-domain, relative)
--   • "<a class='ai-button'>X Recension</a>" → "Läs full recension →"
--     (so a.ai-button styling in globals.css turns it into the CTA button)

update articles
set content_mdx =
  regexp_replace(
    replace(
      replace(
        replace(
          content_mdx,
          'Claude 3.5 Sonnet',
          'Claude (Anthropic)'
        ),
        '/ai-verktyg/ai-text-verktyg/claude-3-5-sonnet/',
        '/ai-verktyg/ai-text-verktyg/claude/'
      ),
      'https://aimagasinet.se/ai-verktyg/',
      '/ai-verktyg/'
    ),
    '(<a[^>]*class="[^"]*ai-button[^"]*"[^>]*>)[^<]+(</a>)',
    '\1Läs full recension &rarr;\2',
    'g'
  )
where path = '/ai-verktyg/ai-text-verktyg';
