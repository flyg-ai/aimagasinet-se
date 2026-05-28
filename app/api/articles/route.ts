import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readingTimeMinutes } from '@/lib/reading-time';
import { fetchAuthorsMap } from '@/lib/authors';

/** Paginated post-list endpoint used by <FilterableGrid> + LoadMore on
 *  the homepage. Returns the same fields the homepage server-fetches
 *  plus a derived reading_time so the client doesn't have to ship
 *  content_mdx over the wire. Author info is joined in by resolving
 *  author_slug against an in-memory authors map. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset   = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));
  const category = searchParams.get('category')?.trim();

  let query = supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path,content_mdx,author_slug')
    .eq('type', 'post')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const [{ data, error }, authorsMap] = await Promise.all([query, fetchAuthorsMap()]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Strip content_mdx, derive reading_time, attach author_name.
  const articles = (data ?? []).map((a) => {
    const { content_mdx, author_slug, ...rest } = a as {
      content_mdx: string | null;
      author_slug: string | null;
    } & Record<string, unknown>;
    return {
      ...rest,
      author_slug,
      author_name: author_slug ? authorsMap.get(author_slug)?.name ?? null : null,
      reading_time: readingTimeMinutes(content_mdx),
    };
  });

  return NextResponse.json({ articles, offset, limit });
}
