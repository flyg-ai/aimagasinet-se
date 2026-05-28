import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readingTimeMinutes } from '@/lib/reading-time';

/** Paginated post-list endpoint used by <FilterableGrid> + LoadMore on
 *  the homepage. Returns the same fields the homepage server-fetches
 *  plus a derived reading_time so the client doesn't have to ship
 *  content_mdx over the wire. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset   = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));
  const category = searchParams.get('category')?.trim();

  let query = supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path,content_mdx')
    .eq('type', 'post')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Strip content_mdx from the response — clients only need the minute count.
  const articles = (data ?? []).map((a) => {
    const { content_mdx, ...rest } = a as { content_mdx: string | null } & Record<string, unknown>;
    return { ...rest, reading_time: readingTimeMinutes(content_mdx) };
  });

  return NextResponse.json({ articles, offset, limit });
}
