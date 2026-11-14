import { NextResponse, type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/** Klick-spårad utgående länk för verktygsknapparna ("Prova X" / "Läs
 *  recension"). Loggar till tool_clicks (migration 0024) innan den 302:ar
 *  vidare — target-URL:en skickas med som ?u= i stället för att slås upp i
 *  DB:n igen, så en bruten/ändrad affiliate_url aldrig kan blocka klicket.
 *
 *  Undantagen från middleware.ts (matcher) och robots.ts (disallow) — den
 *  här rutten är ett tekniskt hopp, inte en sida som ska crawlas/indexeras. */

export const dynamic = 'force-dynamic';

function isSafeExternalUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const target = req.nextUrl.searchParams.get('u');
  const source = req.nextUrl.searchParams.get('src');
  const isAffiliate = req.nextUrl.searchParams.get('aff') === '1';

  if (!target || !isSafeExternalUrl(target)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const db = supabaseAdmin();
    const { error } = await db.from('tool_clicks').insert({
      slug: params.slug,
      source,
      is_affiliate: isAffiliate,
      referer: req.headers.get('referer'),
    });
    if (error) console.error('tool_clicks insert misslyckades:', error);
  } catch (err) {
    console.error('tool_clicks insert kastade:', err);
  }

  return NextResponse.redirect(target, { status: 302 });
}
