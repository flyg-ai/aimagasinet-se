import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Utkast | AI-Magasinet',
  robots: { index: false, follow: false },
};

type Props = { params: { slug: string }; searchParams: { key?: string } };

/** Läsvy för opublicerade artiklar.
 *
 *  Ligger på egen rutt med flit. Tidigare låg nyckelkontrollen i
 *  app/[...slug]/page.tsx, men att läsa searchParams där gör HELA artikelrutten
 *  dynamiskt renderad — revalidate=300 slutade gälla och alla 400 artiklar
 *  gick till databasen vid varje sidvisning. Det syntes direkt i Vercels
 *  CPU-mätning.
 *
 *  Här spelar det ingen roll: rutten träffas bara av den som har nyckeln.
 *  Layouten är avskalad — det här är till för att läsa texten före
 *  godkännande, inte för att se den färdiga sidan. */
export default async function Utkast({ params, searchParams }: Props) {
  const secret = process.env.CRON_SECRET;
  if (!secret || searchParams.key !== secret) notFound();

  const { data } = await supabaseAdmin()
    .from('articles')
    .select('title,content_mdx,published_at,author_slug,featured_image,created_at')
    .eq('slug', params.slug)
    .maybeSingle();
  if (!data) notFound();

  const words = (data.content_mdx ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-14">
      <div className="mb-8 rounded-lg border border-amber-400/50 bg-amber-50 px-4 py-3 text-[14px] leading-relaxed text-amber-900">
        {data.published_at ? (
          <>
            <strong>Redan publicerad.</strong> Den här sidan visar databasinnehållet — läs den
            riktiga versionen på <code>/{params.slug}/</code>.
          </>
        ) : (
          <>
            <strong>Utkast — inte publicerat.</strong> {words} ord, skribent{' '}
            <code>{data.author_slug ?? 'ingen'}</code>, {data.featured_image ? 'bild finns' : 'ingen bild'}.
            Publicera med <code>npx tsx scripts/approve-article.ts --slug={params.slug}</code>
          </>
        )}
      </div>

      <h1 className="text-balance text-[30px] font-medium leading-[1.15] tracking-tight text-fg sm:text-[38px]">
        {data.title}
      </h1>

      <article
        className="prose prose-neutral mt-9 max-w-none dark:prose-invert prose-headings:font-medium prose-a:underline"
        dangerouslySetInnerHTML={{ __html: data.content_mdx ?? '' }}
      />
    </main>
  );
}
