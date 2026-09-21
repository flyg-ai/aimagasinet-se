import type { MetadataRoute } from 'next';

const BASE = 'https://aimagasinet.se';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep API routes, Next.js internals and the admin page out of search.
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
