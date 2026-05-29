import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BreakingTicker } from '@/components/BreakingTicker';
import { SiteNav } from '@/components/SiteNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { JsonLd } from '@/components/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/schemas';
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
  // Self-referencing hreflang — the site is Swedish-only, so we just
  // declare sv-SE for every URL by default. Per-page metadata overrides
  // alternates when needed (currently only on article pages, which
  // re-emit canonical + languages.sv for their own slug).
  alternates: {
    canonical: '/',
    languages: { 'sv-SE': '/' },
  },
  openGraph: {
    siteName: 'AI-Magasinet',
    locale: 'sv_SE',
    type: 'website',
    images: [{ url: '/apple-icon.png', width: 180, height: 180 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aimagasinet',
    creator: '@aimagasinet',
  },
  // Tell crawlers it's OK to follow + index by default. Individual
  // route segments can override via their own metadata.
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
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
        {/* Global JSON-LD — Organization + WebSite (with SearchAction).
            Article / Review / Breadcrumb schemas are emitted by the
            individual templates that own each entity type. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        {/* 0. Brand accent line — 3px gradient hairline at the very top.
            Purely decorative (aria-hidden); sits above the ticker. */}
        <div
          aria-hidden
          className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600"
        />

        {/* 1. Breaking-news ticker — desktop keeps it at the very top.
            On mobile it's hidden here and re-rendered under the header. */}
        <div className="hidden md:block">
          <BreakingTicker items={tickerItems} />
        </div>

        {/* 2. Sticky header — explicit bg-white (not bg-overlay) and
             hardcoded zinc-900 wordmark so the wordmark doesn't disappear
             into a translucent background or fail on a CSS-var regression. */}
        <header className="sticky top-0 z-40 border-b border-line bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-6 sm:px-6 sm:py-8">
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5 text-3xl font-black tracking-tight sm:gap-3 sm:text-4xl"
            >
              {/* indigo-600 matches the brand color the user wants on the
                  AI badge. Hardcoded so the badge doesn't depend on the
                  CSS-var-backed bg-accent token (which has regressed before). */}
              <span className="rounded-md bg-indigo-600 px-2.5 py-1 text-xl font-black text-white sm:text-2xl">
                AI
              </span>
              <span className="font-black uppercase tracking-tight text-zinc-900">
                Magasinet
              </span>
            </Link>

            <SiteNav />
          </div>
        </header>

        {/* Breaking-news ticker — mobile position, between header and hero.
            Hidden on desktop (rendered at the top there instead). */}
        <div className="md:hidden">
          <BreakingTicker items={tickerItems} />
        </div>

        {/* pb-[60px] on mobile reserves room for the fixed
            MobileBottomNav so the footer/content doesn't sit under it. */}
        <main className="pb-[60px] md:pb-0">{children}</main>
        <MobileBottomNav />

        <footer className="mt-24 border-t border-zinc-800 bg-zinc-900 text-zinc-100">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded bg-indigo-600 px-1.5 py-0.5 text-sm font-black text-white">
                    AI
                  </span>
                  <span className="font-black uppercase tracking-tight text-white">
                    Magasinet
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-zinc-300">
                  Svenskt magasin om artificiell intelligens — nyheter, guider
                  och oberoende verktygsrecensioner.
                </p>
              </div>

              <nav aria-label="Kategorier">
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Kategorier
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/kategori/ai-nyheter" className="text-zinc-300 hover:text-white">AI-Nyheter</Link></li>
                  <li><Link href="/ai-verktyg" className="text-zinc-300 hover:text-white">AI-Verktyg</Link></li>
                  <li><Link href="/ai-video" className="text-zinc-300 hover:text-white">AI-Video</Link></li>
                  <li><Link href="/ai-guiden" className="text-zinc-300 hover:text-white">AI-Guiden</Link></li>
                </ul>
              </nav>

              <nav aria-label="Om oss">
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Om
                </h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/om-oss" className="text-zinc-300 hover:text-white">Om Oss</Link></li>
                  <li><Link href="/kontakt" className="text-zinc-300 hover:text-white">Kontakt</Link></li>
                </ul>
              </nav>

              <div>
                <h3 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                  Kontakt
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="mailto:kontakt@aimagasinet.se" className="text-zinc-300 hover:text-white">
                      kontakt@aimagasinet.se
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 border-t border-zinc-800 pt-6">
              <p className="text-xs leading-relaxed text-zinc-400">
                <span className="font-bold text-zinc-200">Annonsörsinformation:</span>{' '}
                AI-Magasinet kan få provision när du klickar på vissa länkar på
                denna sida. Det påverkar inte vår rankning.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                © {new Date().getFullYear()} AI-Magasinet
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
