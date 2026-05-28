import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/** Paginated post-list endpoint used by <LoadMoreArticles> on the homepage.
 *  Returns the same fields the homepage server-fetches so the client can
 *  render <ArticleCard> without a second round trip. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10) || 0);
  const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));

  const { data, error } = await supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path')
    .eq('type', 'post')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ articles: data ?? [], offset, limit });
}
