/**
 * Rensa cachen för enskilda sidor på begäran.
 *
 * Sidorna byggs om en gång i timmen (revalidate = 3600). Det räcker för
 * innehåll som inte ändras, men inte när en artikel publiceras. Då anropar
 * publiceringsskriptet den här routen så att artikeln, startsidan och dess
 * kategori byggs om direkt.
 *
 *   curl -X POST "https://aimagasinet.se/api/revalidate?key=<CRON_SECRET>&path=/min-artikel/"
 *
 * `path` kan upprepas. Utan path rensas bara startsidan.
 */
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  // REVALIDATE_TOKEN finns för att CRON_SECRET är markerad som Sensitive i
  // Vercel och därför inte går att läsa ut till en lokal .env.local.
  const accepted = [process.env.REVALIDATE_TOKEN, process.env.CRON_SECRET].filter(Boolean);
  if (!key || !accepted.includes(key)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const paths = url.searchParams.getAll('path').filter((p) => p.startsWith('/'));
  const targets = Array.from(new Set(paths.length ? ['/', ...paths] : ['/']));
  targets.forEach((p) => revalidatePath(p));

  return NextResponse.json({ revalidated: targets, now: Date.now() });
}
