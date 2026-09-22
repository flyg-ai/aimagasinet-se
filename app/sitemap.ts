import type { MetadataRoute } from 'next';

// Sitemapen hamtar hela artikeltabellen. Utan revalidate gjordes det vid varje
// crawler-traff, vilket ar en stor del av CPU-tiden pa en sajt med 400 sidor.
// En timme ar gott om farskhet for en sitemap.
export const revalidate = 3600;
import { supabase } from '@/lib/supabase';
import { featuredSlugs } from '@/lib/compare';

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

type SitemapRow = {
  path: string | null;
  type: 'post' | 'page';
  updated_at: string | null;
  published_at: string | null;
  content_updated_at?: string | null;
};

/** Hamtar artiklarna med content_updated_at (migration 0021). Finns kolumnen
 *  inte an svarar PostgREST med 42703 / "column ... does not exist" — da
 *  gors samma fraga utan den, och lastModified faller tillbaka pa updated_at. */
async function fetchSitemapRows() {
  const base = 'path,type,updated_at,published_at';
  const query = (cols: string) =>
    supabase.from('articles').select(cols).order('updated_at', { ascending: false });
  let res = await query(`${base},content_updated_at`);
  if (
    res.error &&
    (res.error.code === '42703' || /content_updated_at.*does not exist|does not exist.*content_updated_at/i.test(res.error.message))
  ) {
    res = await query(base);
  }
  if (res.error) console.error('[sitemap] supabase error:', res.error.message);
  return (res.data ?? []) as unknown as SitemapRow[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pull every article in one shot — 262 rows at time of writing, well
  // under Google's 50K-per-sitemap limit.
  const [articles, categoriesRes] = await Promise.all([
    fetchSitemapRows(),
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

  for (const a of articles) {
    if (!a.path) continue;
    // Opublicerat hor inte hemma i sitemapen. Faltet hamtades men anvandes
    // aldrig, sa avpublicerade artiklar pekades ut for Google.
    if (!a.published_at) continue;
    const { changeFrequency, priority } = freqAndPriority(a.path, a.type);
    out.push({
      url: `${BASE}${withTrailing(a.path)}`,
      lastModified:
        toIso(a.content_updated_at) ?? toIso(a.updated_at) ?? toIso(a.published_at) ?? now,
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

  // Jamforelserna bor i koden, inte i articles-tabellen, sa slingan ovan
  // missar dem: varken hubben eller nagon av duellerna har nansin legat i
  // sitemapen. Google har bara kunnat hitta dem via interna lankar.
  out.push({
    url: `${BASE}/ai-verktyg/jamfor/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  });
  for (const slug of featuredSlugs()) {
    out.push({
      url: `${BASE}/ai-verktyg/jamfor/${slug}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return out;
}
