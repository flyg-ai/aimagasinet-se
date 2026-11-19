import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/components/templates/MasterHubTemplate';

/** Tar bort tecken som har betydelse i PostgREST-filter och LIKE-mönster
 *  (samma whitelist som /sok/-sidans cleanQuery). */
function cleanQuery(raw: string | null): string {
  return (raw ?? '').replace(/[,()%_*\\]/g, ' ').trim().slice(0, 100);
}

export type SearchSuggestion = { title: string; href: string };

/** Live-sökförslag för hero-sökrutan på /ai-verktyg: kategorier matchas
 *  client-side-snabbt mot den statiska CATEGORIES-listan, verktyg (enskilda
 *  recensioner) slås upp i DB. Kategorier går alltid före verktyg i svaret
 *  — motsvarar "sök på bokstäverna ELLER kategorin, kategori först". */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = cleanQuery(searchParams.get('q'));
  if (q.length < 2) {
    return NextResponse.json({ categories: [], tools: [] });
  }
  const needle = q.toLowerCase();

  const categories: SearchSuggestion[] = CATEGORIES
    .filter((c) => c.title.toLowerCase().includes(needle))
    .slice(0, 5)
    .map((c) => ({ title: c.title, href: c.href }));

  const { data, error } = await supabase
    .from('articles')
    .select('title,path')
    .like('path', '/ai-verktyg/%')
    .not('parent_slug', 'eq', 'ai-verktyg')
    .not('parent_slug', 'is', null)
    .not('published_at', 'is', null)
    .ilike('title', `%${q}%`)
    .order('title', { ascending: true })
    .limit(6);

  if (error) {
    console.error('[search-suggest] supabase error:', error.message);
  }

  const tools: SearchSuggestion[] = (data ?? [])
    .filter((r): r is { title: string; path: string } => !!r.path)
    .map((r) => ({ title: r.title, href: r.path }));

  return NextResponse.json({ categories, tools });
}
