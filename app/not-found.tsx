import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { NotFoundNetworkBg } from '@/components/NotFoundNetworkBg';
import { SubscribeForm } from '@/components/SubscribeForm';

export const metadata = {
  title: 'Sidan kunde inte hittas | AI-Magasinet',
  robots: { index: false, follow: true },
};

const READ_MORE = [
  { href: '/', icon: '⌂', label: 'Startsidan', desc: 'Dagens ledartiklar, recensioner och guider i en samlad vy.' },
  { href: '/kategori/ai-nyheter', icon: '▤', label: 'AI-Nyheter', desc: 'Dagens nyheter från den svenska och nordiska AI-scenen.' },
  { href: '/ai-verktyg', icon: '🛠', label: 'AI-Verktyg', desc: 'Recensioner och jämförelser av hundratals AI-verktyg.' },
  { href: '/ai-guiden', icon: '📖', label: 'AI-Guiden', desc: 'Nybörjarguider — från vad AI är till hur du kommer igång.' },
];

export default async function NotFound() {
  const { data } = await supabase
    .from('articles')
    .select('title,path')
    .eq('type', 'post')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(4);
  const latest = data ?? [];

  return (
    <div className="bg-page text-fg">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <main className="min-w-0">
            <div className="rounded-2xl border border-line bg-card p-5 sm:p-8">
              <div className="mb-4 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-fg-subtle">
                <span>04 · AI-Magasinet / Neural Link</span>
                <span className="text-rose-600">Signal lost</span>
              </div>

              <NotFoundNetworkBg />

              <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                <span>err_404 / destination unknown</span>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
                Fel 404 · Sidan finns inte
              </div>
              <h1 className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-4xl md:text-5xl">
                Sidan kunde inte hittas
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-subtle">
                Adressen kan vara felstavad, artikeln kan ha flyttats — eller
                så har vi tagit bort den. Här är de vanligaste vägarna vidare.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700"
                >
                  <span aria-hidden>⌂</span> Till startsidan
                </Link>
                <Link
                  href="/kategori/ai-nyheter"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-page px-6 py-3 text-sm font-bold text-fg transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span aria-hidden>▤</span> Senaste nyheterna
                </Link>
              </div>
            </div>

            <div className="mt-14">
              <h2 className="mb-5 border-b border-line pb-3 text-xl font-black uppercase tracking-tight text-fg">
                <span className="mr-2 inline-block h-5 w-1 bg-indigo-500 align-middle" />
                Läs vidare
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {READ_MORE.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-xl border border-line bg-card p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                      {item.icon}
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 font-black uppercase tracking-tight text-fg">
                        {item.label}
                        <span aria-hidden className="text-fg-subtle transition-transform group-hover:translate-x-0.5">→</span>
                      </span>
                      <span className="mt-1 block text-sm text-fg-subtle">{item.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </main>

          <aside className="mt-10 flex flex-col gap-6 lg:mt-0">
            {latest.length > 0 && (
              <div className="rounded-xl border border-line bg-card p-5">
                <div className="mb-4 bg-soft px-0 py-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
                  Senaste artiklarna
                </div>
                <ol className="flex flex-col gap-4">
                  {latest.map((a, i) => (
                    <li key={a.path}>
                      <Link href={a.path} className="group flex gap-3">
                        <span className="font-mono text-sm font-bold text-indigo-300 group-hover:text-indigo-600">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-bold leading-snug text-fg group-hover:text-indigo-600">
                          {a.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
              <h3 className="text-lg font-black uppercase tracking-tight text-fg">
                Få nyhetsbrevet
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-subtle">
                Varje fredag sammanfattar vi veckans viktigaste AI-händelser
                för den svenska marknaden.
              </p>
              <div className="mt-4">
                <SubscribeForm />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
