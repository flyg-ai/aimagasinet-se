import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BreakingTicker } from '@/components/BreakingTicker';
import { SiteNav } from '@/components/SiteNav';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aimagasinet.se'),
  title: {
    default: 'AI-Magasinet — svenska AI-nyheter, guider och recensioner',
    template: '%s | AI-Magasinet',
  },
  description:
    'AI-Magasinet är ditt svenska magasin om AI: nyheter, djupgående guider och recensioner av AI-verktyg.',
  openGraph: { siteName: 'AI-Magasinet', locale: 'sv_SE', type: 'website' },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tickerRes = await supabase
    .from('articles')
    .select('slug,title,path')
    .eq('type', 'post')
    .order('published_at', { ascending: false })
    .limit(8);

  const tickerItems = tickerRes.data ?? [];

  return (
    <html lang="sv" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-page font-sans text-fg">
        {/* 1. Breaking-news ticker */}
        <BreakingTicker items={tickerItems} />

        {/* 2. Sticky header — explicit bg-white (not bg-overlay) and
             hardcoded zinc-900 wordmark so the wordmark doesn't disappear
             into a translucent background or fail on a CSS-var regression. */}
        <header className="sticky top-0 z-40 border-b border-line bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2 text-xl font-black tracking-tight"
            >
              {/* indigo-600 matches the brand color the user wants on the
                  AI badge. Hardcoded so the badge doesn't depend on the
                  CSS-var-backed bg-accent token (which has regressed before). */}
              <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-sm font-black text-white">
                AI
              </span>
              <span className="hidden font-black uppercase tracking-tight text-zinc-900 sm:inline">
                Magasinet
              </span>
            </Link>

            <SiteNav />
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-line bg-card">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-sm font-black text-white">
                    AI
                  </span>
                  <span className="font-black uppercase tracking-tight text-zinc-900">
                    Magasinet
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-fg-subtle">
                  Svenskt magasin om artificiell intelligens — nyheter, guider
                  och oberoende verktygsrecensioner.
                </p>
              </div>

              <nav aria-label="Kategorier">
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-muted">
                  Kategorier
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/kategori/ai-nyheter" className="text-fg-subtle hover:text-accent">AI-Nyheter</Link></li>
                  <li><Link href="/ai-verktyg" className="text-fg-subtle hover:text-accent">AI-Verktyg</Link></li>
                  <li><Link href="/ai-video" className="text-fg-subtle hover:text-accent">AI-Video</Link></li>
                  <li><Link href="/ai-guiden" className="text-fg-subtle hover:text-accent">AI-Guiden</Link></li>
                </ul>
              </nav>

              <nav aria-label="Om oss">
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-muted">
                  Om
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/om-oss" className="text-fg-subtle hover:text-accent">Om Oss</Link></li>
                  <li><Link href="/kontakt" className="text-fg-subtle hover:text-accent">Kontakt</Link></li>
                </ul>
              </nav>

              <div>
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-muted">
                  Kontakt
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="mailto:kontakt@aimagasinet.se" className="text-fg-subtle hover:text-accent">
                      kontakt@aimagasinet.se
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-line-subtle pt-6">
              <p className="text-xs leading-relaxed text-fg-subtle">
                <span className="font-bold text-fg-muted">Annonsörsinformation:</span>{' '}
                AI-Magasinet kan få provision när du klickar på vissa länkar på
                denna sida. Det påverkar inte vår rankning.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-fg-faint">
                © {new Date().getFullYear()} AI-Magasinet
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
