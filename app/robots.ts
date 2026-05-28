import type { MetadataRoute } from 'next';

const BASE = 'https://aimagasinet.se';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep API routes and Next.js internals out of search.
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
