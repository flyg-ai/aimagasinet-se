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
    ],
  },
  async redirects() {
    return [
      {
        source: '/ai-verktyg/ai-text-verktyg/claude-3-5-sonnet',
        destination: '/ai-verktyg/ai-text-verktyg/claude',
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
    ];
  },
};

export default nextConfig;
