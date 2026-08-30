import type { MetadataRoute } from 'next';

// Sitemapen hamtar hela artikeltabellen. Utan revalidate gjordes det vid varje
// crawler-traff, vilket ar en stor del av CPU-tiden pa en sajt med 400 sidor.
// En timme ar gott om farskhet for en sitemap.
export const revalidate = 3600;
import { supabase } from '@/lib/supabase';

const BASE = 'https://aimagasinet.se';

/** Trailing-slash all article paths so they match the canonical form
 *  produced by next.config.mjs `trailingSlash: true`. The root path stays
 *  as plain "/". */
function withTrailing(path: string): string {
  if (!path || path === '/') return '/';
  return path.endsWith('/') ? path : `${path}/`;
}

function toIso(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Heuristics for changeFrequency + priority based on path depth and type.
 *  Homepage and master hubs get the highest priority; deep review pages
 *  rank lower because they change less often. */
function freqAndPriority(path: string, type: 'post' | 'page'): {
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
} {
  if (path === '/')                          return { changeFrequency: 'hourly',  priority: 1.0 };
  const depth = path.split('/').filter(Boolean).length;
  if (type === 'post')                       return { changeFrequency: 'monthly', priority: 0.6 };
  if (depth <= 1)                            return { changeFrequency: 'daily',   priority: 0.9 };
  if (depth === 2)                           return { changeFrequency: 'weekly',  priority: 0.8 };
  if (depth === 3)                           return { changeFrequency: 'weekly',  priority: 0.7 };
  return { changeFrequency: 'monthly', priority: 0.5 };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pull every article in one shot — 262 rows at time of writing, well
  // under Google's 50K-per-sitemap limit.
  const [articlesRes, categoriesRes] = await Promise.all([
    supabase
      .from('articles')
      .select('path,type,updated_at,published_at')
      .order('updated_at', { ascending: false }),
    supabase.from('categories').select('slug'),
  ]);

  const now = new Date().toISOString();
  const out: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
  ];

  for (const a of articlesRes.data ?? []) {
    if (!a.path) continue;
    // Opublicerat hor inte hemma i sitemapen. Faltet hamtades men anvandes
    // aldrig, sa avpublicerade artiklar pekades ut for Google.
    if (!a.published_at) continue;
    const { changeFrequency, priority } = freqAndPriority(a.path, a.type);
    out.push({
      url: `${BASE}${withTrailing(a.path)}`,
      lastModified: toIso(a.updated_at) ?? toIso(a.published_at) ?? now,
      changeFrequency,
      priority,
    });
  }

  for (const c of categoriesRes.data ?? []) {
    out.push({
      url: `${BASE}/kategori/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    });
  }

  return out;
}
