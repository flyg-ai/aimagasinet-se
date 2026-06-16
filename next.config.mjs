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
    // Eftersom trailingSlash: true gör Next ett extra 308 från slash-lös form
    // till slash-form. Om en redirect-destination saknar avslutande slash blir
    // varje gammal indexerad URL därför en 2-stegskedja: 301 → 308 → 200.
    // Normalisera alla interna destinationer till slash-form så det blir ETT
    // enda 301-hopp. Idempotent; rör inte root, externa URL:er eller query/hash.
    const trailing = (dest) => {
      if (!dest || dest === '/' || /^https?:\/\//i.test(dest)) return dest;
      if (dest.endsWith('/') || dest.includes('?') || dest.includes('#')) return dest;
      return `${dest}/`;
    };
    const norm = (list) => list.map((r) => ({ ...r, destination: trailing(r.destination) }));
    return norm([
      {
        // Gamla "alla svenska AI-företag"-listan ersatt av den granskande
        // startup-artikeln.
        source: '/svenska-ai-foretag-2026',
        destination: '/svenska-ai-startups-2026',
        statusCode: 301,
      },
      {
        // Fable 5-nyheten bytte slug recension → lansering.
        source: '/claude-fable-5-recension',
        destination: '/claude-fable-5-lansering',
        statusCode: 301,
      },
      // ── Gamla WordPress-URL:er som Google Search Console rapporterar
      //    som 404. 301 forwards link equity / rensar crawl-felen. ──
      // OBS: /hello-world och alla wp-* hanteras numera som 410 Gone i
      // middleware.ts (WP-skräp ska droppas av Google, inte forwardas).
      {
        // Gammalt kombinerat nyhetsinlägg → kanonisk nyhetskategori.
        source: '/ai-nyheter/ai-konst-marknadsforing-juridik',
        destination: '/kategori/ai-nyheter',
        statusCode: 301,
      },
      // ── GSC-404-audit (juni 2026): riktiga 404 med kanonisk destination
      //    verifierad mot DB + live. Dessa MÅSTE ligga i config-redirects (körs
      //    FÖRE middleware) så att /category/-källan nedan 301:ar och inte
      //    fångas av 410-patternet för /category/ i middleware.ts. ──
      {
        // Ljud-verktyg under gammal hub-slug ai-ljud-musik (ny: ai-ljud-och-musik),
        // flatten-redirecten täcker bara den nya slugen → denna saknades.
        source: '/ai-verktyg/ai-ljud-musik/elevenlabs',
        destination: '/ai-verktyg/elevenlabs',
        statusCode: 301,
      },
      {
        // WP-dubblett med "-2"-suffix → kanonisk recension.
        source: '/ai-verktyg/juridik/harvey-ai-2',
        destination: '/ai-verktyg/harvey-ai',
        statusCode: 301,
      },
      {
        // Felaktig kategori-slug (rätt: ai-sakerhet-etik).
        source: '/kategori/ai-sakerhet',
        destination: '/kategori/ai-sakerhet-etik',
        statusCode: 301,
      },
      {
        // Gammal WP-engelsk taxonomi /category/ → svensk /kategori/ (motsvarighet finns).
        source: '/category/samhalle-paverkan',
        destination: '/kategori/samhalle-paverkan',
        statusCode: 301,
      },
      {
        // Gamla företags-ingångar → kanonisk företags-hub.
        source: '/ai-for-foretag',
        destination: '/ai-verktyg/foretag',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-for-foretag',
        destination: '/ai-verktyg/foretag',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-verktyg-for-foretag',
        destination: '/ai-verktyg/foretag',
        statusCode: 301,
      },
      {
        // Gammal kod-hub-slug → kanonisk kod-hub.
        source: '/ai-verktyg/ai-verktyg-for-kod',
        destination: '/ai-verktyg/ai-kod-verktyg',
        statusCode: 301,
      },
      {
        // Gamla bild-hub-slugs (saknad bindestreck / kort form) → kanonisk bild-hub.
        source: '/ai-verktyg/ai-bildverktyg',
        destination: '/ai-verktyg/ai-bild-verktyg',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/ai-bild',
        destination: '/ai-verktyg/ai-bild-verktyg',
        statusCode: 301,
      },
      {
        // Kort alternativ slug → kanonisk full slug (samma artikel i DB).
        source: '/trump-stoppar-anthropic-pentagon-sakerhetsrisk',
        destination: '/trump-stoppar-anthropic-i-usa-pentagon-klassar-ai-bolaget-som-sakerhetsrisk',
        statusCode: 301,
      },
      {
        // Gamla yrke-subkategorier utan egen subhub → förälder-hubben ekonomi.
        source: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/kalkyl-analys',
        destination: '/ai-verktyg/ekonomi',
        statusCode: 301,
      },
      {
        source: '/ai-verktyg/foretag/yrke/ekonomi-redovisning/rapporter',
        destination: '/ai-verktyg/ekonomi',
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
    ]);
  },
};

export default nextConfig;
