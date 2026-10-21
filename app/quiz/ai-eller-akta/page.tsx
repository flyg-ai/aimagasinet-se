import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbSchema } from '@/lib/schemas';
import { AiOrRealQuiz } from '@/components/AiOrRealQuiz';
import { AI_ELLER_AKTA_ROUNDS } from '@/lib/ai-eller-akta-quiz';

export const metadata: Metadata = {
  title: 'AI eller äkta? Testa dig själv — bildquiz | AI-Magasinet',
  description:
    'Tio bilder, en fråga varje gång: AI-genererad eller ett äkta foto? Testa ditt öga och se hur du klarar dig mot moderna AI-bildverktyg.',
  alternates: {
    canonical: '/quiz/ai-eller-akta/',
    languages: { 'sv-SE': '/quiz/ai-eller-akta/' },
  },
};

export default function AiEllerAktaQuiz() {
  const breadcrumbLd = breadcrumbSchema([
    { label: 'Hem', href: '/' },
    { label: 'AI eller äkta?', href: '/quiz/ai-eller-akta' },
  ]);

  return (
    <article className="bg-page text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-cyan-50">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
          <nav aria-label="Brödsmulor" className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Link href="/" className="hover:text-indigo-600">Hem</Link>
            <span className="mx-2 text-line-strong">›</span>
            <span className="text-fg-muted">AI eller äkta?</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>✦</span> Quiz · 10 bilder
          </span>

          <h1 className="mt-6 max-w-2xl text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl">
            AI eller äkta? Testa dig själv
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-fg-subtle">
            Tio bilder. En fråga varje gång: AI-genererad eller ett äkta foto?
            Klicka dig igenom och se hur många du klarar.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <AiOrRealQuiz rounds={AI_ELLER_AKTA_ROUNDS} />
      </section>
    </article>
  );
}
