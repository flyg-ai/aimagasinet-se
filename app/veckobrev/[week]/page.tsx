import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import {
  renderNewsletterHtml,
  newsletterWordCount,
  type Newsletter,
} from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

type Props = { params: { week: string }; searchParams: { key?: string } };

/** Ett nummer av veckobrevet.
 *
 *  Publicerade nummer är öppna — arkivet är hela poängen med att lägga brevet
 *  på webben, eftersom icke-prenumeranter kan hitta det och skriva upp sig.
 *
 *  Utkast kräver ?key= som matchar CRON_SECRET. Läsning sker via service role,
 *  så tabellens RLS skyddar inte i sig — nyckelkontrollen nedan gör det.
 *  Vill du skilja på behörigheterna: lägg till en egen NEWSLETTER_KEY och
 *  byt jämförelsen här. */
async function load(week: string): Promise<Newsletter | null> {
  try {
    const { data } = await supabaseAdmin()
      .from('newsletters')
      .select('id,week,subject,content,status,created_at,sent_at')
      .eq('week', week)
      .maybeSingle();
    return (data as Newsletter | null) ?? null;
  } catch {
    return null;
  }
}

function visible(n: Newsletter, key?: string): boolean {
  if (n.status === 'published' || n.status === 'sent') return true;
  const secret = process.env.CRON_SECRET;
  return !!secret && key === secret;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const n = await load(params.week);
  if (!n || !visible(n, searchParams.key)) return { title: 'Veckobrev | AI-Magasinet' };
  const isDraft = n.status === 'draft' || n.status === 'approved';
  return {
    title: `${n.subject} | AI-Magasinet`,
    description: n.content?.lead?.slice(0, 160),
    // Utkast ska aldrig indexeras, inte ens om nyckeln läcker.
    robots: isDraft ? { index: false, follow: false } : undefined,
  };
}

export default async function VeckobrevPage({ params, searchParams }: Props) {
  const n = await load(params.week);
  // Samma svar för "finns inte" och "utkast utan nyckel" — annars går det att
  // ta reda på vilka veckor som ligger i pipeline.
  if (!n || !visible(n, searchParams.key)) notFound();

  const isDraft = n.status === 'draft' || n.status === 'approved';
  const words = newsletterWordCount(n.content);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-14">
      {isDraft && (
        <div className="mb-8 rounded-lg border border-amber-400/50 bg-amber-50 px-4 py-3 text-[14px] leading-relaxed text-amber-900">
          <strong>Utkast — inte skickat till någon.</strong> Status <code>{n.status}</code>,{' '}
          {words} ord, genererat {new Date(n.created_at).toLocaleString('sv-SE')}. Sidan är
          noindex och kräver nyckel.
        </div>
      )}

      <p className="text-[13px] font-semibold uppercase tracking-wide text-fg/50">
        Veckobrev · {n.week.replace('-v', ' vecka ')}
      </p>
      <h1 className="mt-2 text-balance text-[30px] font-medium leading-[1.15] tracking-tight text-fg sm:text-[38px]">
        {n.subject}
      </h1>

      <article
        className="prose prose-neutral mt-9 max-w-none dark:prose-invert prose-headings:font-medium prose-h2:text-[22px] prose-h3:text-[17px] prose-a:underline"
        dangerouslySetInnerHTML={{ __html: renderNewsletterHtml(n.content) }}
      />

      {!isDraft && (
        <p className="mt-12 border-t border-fg/10 pt-6 text-[15px] leading-relaxed text-fg/60">
          Vill du ha det här i inkorgen?{' '}
          <a className="underline" href="/">
            Skriv upp dig på startsidan
          </a>
          .
        </p>
      )}
    </main>
  );
}
