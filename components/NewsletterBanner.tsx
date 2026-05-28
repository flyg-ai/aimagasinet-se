import { SubscribeForm } from '@/components/SubscribeForm';

/** Inline newsletter signup. Used as a grid-row interruption inside the
 *  filterable post grid — column-span full so it cuts cleanly across all
 *  3 columns at desktop. The actual signup happens in <SubscribeForm>,
 *  which POSTs to /api/subscribe and shows inline status feedback.
 *
 *  Styled as a deep-indigo gradient with light text so it reads as a
 *  prominent break in the otherwise light grid — the previous pastel
 *  version disappeared into the surrounding cards. */
export function NewsletterBanner() {
  return (
    <div className="col-span-full">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-700 p-8 text-white shadow-lg shadow-indigo-900/20 sm:p-10">
        {/* Decorative gloss — faint radial highlight in the top-right. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              <span aria-hidden>✉</span>
              Nyhetsbrev
            </div>
            <h3 className="text-balance text-2xl font-black tracking-tight text-white sm:text-3xl">
              Hänger med i AI-utvecklingen — på 5 minuter i veckan
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-indigo-100 sm:text-base">
              Svenska AI-nyheter, nya verktyg och faktiska användningsfall.
              Inga sponsrade utskick.
            </p>
          </div>
          <SubscribeForm variant="banner-dark" />
        </div>
      </div>
    </div>
  );
}
