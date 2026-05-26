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

        {/* 2. Sticky header */}
        <header className="sticky top-0 z-40 border-b border-line bg-overlay backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2 text-xl font-black tracking-tight"
            >
              <span className="rounded bg-accent px-1.5 py-0.5 text-sm font-black text-accent-fg">
                AI
              </span>
              <span className="hidden font-black uppercase tracking-tight text-fg sm:inline">
                Magasinet
              </span>
            </Link>

            <SiteNav />
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t border-line-subtle">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <span className="font-black uppercase tracking-tight text-fg-muted">
                AI-Magasinet
              </span>{' '}
              · Svenskt magasin om artificiell intelligens
            </div>
            <div>© {new Date().getFullYear()} AI-Magasinet</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
