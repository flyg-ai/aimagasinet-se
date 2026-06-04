import { yrkesRedirects } from './redirects.generated.mjs';
import { designerFotografRedirects } from './redirects-designer-fotograf.mjs';
import { flattenRedirects } from './redirects.flatten.generated.mjs';
import { dedupRedirects } from './redirects.dedup.generated.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Match the trailing-slash form Google already has indexed from the
  // old WordPress install (e.g. /ai-verktyg/gratis/). Without this Next
  // 308-redirects /foo/ → /foo, which drops link equity on the old URLs.
  trailingSlash: true,
  images: {
    remotePatterns: [
      // Legacy WP origin — kept for any leftover content_mdx inline images.
      { protocol: 'https', hostname: 'aimagasinet.se' },
      // Supabase Storage — destination for migrated/new images.
      { protocol: 'https', hostname: '**.supabase.co' },
      // Unsplash — omslagsbilder från den nattliga artikel-genereringen.
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // ── Gamla WordPress-URL:er som Google Search Console rapporterar
      //    som 404. 301 forwards link equity / rensar crawl-felen. ──
      {
        // WP-standardinlägget som följde med installationen.
        source: '/hello-world',
        destination: '/',
        statusCode: 301,
      },
      {
        // Gammalt kombinerat nyhetsinlägg → kanonisk nyhetskategori.
        source: '/ai-nyheter/ai-konst-marknadsforing-juridik',
        destination: '/kategori/ai-nyheter',
        statusCode: 301,
      },
      {
        // Kod-hubben bytte slug ai-kod → ai-kod-verktyg.
        source: '/ai-verktyg/ai-kod/github-copilot',
        destination: '/ai-verktyg/github-copilot',
        statusCode: 301,
      },
      {
        // Ljud-hubben bytte slug ai-ljud-musik → ai-ljud-och-musik.
        source: '/ai-verktyg/ai-ljud-musik',
        destination: '/ai-verktyg/ai-ljud-och-musik',
        statusCode: 301,
      },
      {
        // WP-mediabibliotekets uppladdningar finns inte längre.
        source: '/wp-content/uploads/:path*',
        destination: '/',
        statusCode: 301,
      },
      {
        // Övriga WP-systemfiler (wp-login, wp-admin, wp-json m.fl.).
        source: '/wp-:file*',
        destination: '/',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-text-verktyg/claude-3-5-sonnet',
        destination: '/ai-verktyg/claude',
        statusCode: 301,
      },
      // Video tools moved from /ai-verktyg/ai-video-verktyg/* to /ai-video/*
      {
        source: '/ai-verktyg/ai-video-verktyg',
        destination: '/ai-video',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-video-verktyg/sora-2',
        destination: '/ai-video/sora-2',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-video-verktyg/pika-labs',
        destination: '/ai-video/pika-labs',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-video-verktyg/runway-gen-3',
        destination: '/ai-video/runway-gen-3',
        statusCode: 301,
      },
      // Older Dec 2025 short-form article superseded by the
      // comprehensive Dec 12 "Topp 50 AI-låtar"-listan. 301 forwards
      // link equity to the newer page.
      {
        source: '/ai-musik-tar-over-spotify-har-ar-fem-latar-som-redan-toppar-listorna',
        destination: '/topp-50-ai-latar-pa-spotify-2026',
        statusCode: 301,
      },
      {
        // Yrkes-indexsidan ersatt av den nya /ai-verktyg/foretag-ingångssidan
        // (kategori- + yrkes-grid). Barnsidorna /foretag/yrke/* lever kvar.
        source: '/ai-verktyg/foretag/yrke',
        destination: '/ai-verktyg/foretag',
        statusCode: 301,
      },
      // Yrkes-omstrukturering: gamla /ai-verktyg/foretag/yrke/* → kanoniska
      // /ai-verktyg/{juridik|kundservice|rekrytering|ekonomi|marknadsforing}/*
      // (auto-genererad lista, se scripts/build-redirects-config.ts).
      ...yrkesRedirects,
      // Designer/fotograf-video-uppstädning: dubbletter → kanonisk, orphans
      // flyttade till kategori-hub, tomma topplista-hubbar → kategori-hub.
      ...designerFotografRedirects,
      // Review-flattening: gamla /ai-verktyg/<kategori>/<slug> → flata
      // /ai-verktyg/<slug> (auto-genererad, se scripts/flatten-reviews.ts).
      ...flattenRedirects,
      // Dubblett-sammanslagning: raderade varianter → kanonisk /ai-verktyg/<slug>
      // (auto-genererad, se scripts/merge-duplicates.ts).
      ...dedupRedirects,
    ];
  },
};

export default nextConfig;
