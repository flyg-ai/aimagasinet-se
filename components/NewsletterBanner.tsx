import Link from 'next/link';

/** Inline newsletter signup. Used as a grid-row interruption inside the
 *  filterable post grid — column-span full so it cuts cleanly across all
 *  3 columns at desktop. Form posts to a /prenumerera anchor; no
 *  backend is wired up yet, the user enters their email on the landing
 *  page. */
export function NewsletterBanner() {
  return (
    <div className="col-span-full">
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-1">
        <div className="rounded-[10px] border border-indigo-200/60 bg-white/70 p-6 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-700">
                <span aria-hidden>✉</span>
                Nyhetsbrev
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
                Hänger med i AI-utvecklingen — på 5 minuter i veckan
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Svenska AI-nyheter, nya verktyg och faktiska use cases.
                Inga sponsrade utskick.
              </p>
            </div>
            <Link
              href="#prenumerera"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-indigo-600 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-indigo-700"
            >
              Prenumerera <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
