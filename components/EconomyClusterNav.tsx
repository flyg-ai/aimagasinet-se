import Link from 'next/link';
import { to } from '@/lib/links';

type ClusterItem = 'ekonomi' | 'bokforing' | 'redovisning' | 'fakturering';

const ITEMS: { key: ClusterItem; label: string; href: string }[] = [
  { key: 'ekonomi', label: 'Ekonomi & ekonomistyrning', href: '/ai-verktyg/ekonomi' },
  { key: 'bokforing', label: 'Bokföring', href: '/basta-bokforingsprogram-med-ai-2026' },
  { key: 'redovisning', label: 'Redovisning & revision', href: '/ai-verktyg/redovisning' },
  { key: 'fakturering', label: 'Fakturering & utlägg', href: '/ai-verktyg/fakturering' },
];

/** Asymmetrisk klusternavigering för ekonomi-sidorna (se kannibalisering.md-
 *  diskussionen, nov 2026): `full` visas bara på katalogsidan /ai-verktyg/ekonomi,
 *  vars jobb är att dirigera trafik till de tre specifika systersidorna.
 *  `light` visas längst ner på de specifika hubbarna (redovisning, fakturering)
 *  — en enda rad, inte en prominent meny, så den inte stjäl fokus från en sida
 *  som redan är smalt fokuserad på sitt eget sökord. Bokförings-artikeln får
 *  ingen av varianterna; den länkas till via en kontextuell mening i brödtexten
 *  istället, för att inte se ut som en generisk kategorimeny på en sida som
 *  vinner just för att vara fokuserad. */
export function EconomyClusterNav({
  current,
  variant,
}: {
  current: ClusterItem;
  variant: 'full' | 'light';
}) {
  const others = ITEMS.filter((i) => i.key !== current);

  if (variant === 'light') {
    return (
      <nav aria-label="Relaterat inom ekonomi" className="mt-12 border-t border-line pt-6">
        <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">Se även</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
          {others.map((i) => (
            <li key={i.key}>
              <Link href={to(i.href)} className="text-sm font-medium text-indigo-700 hover:underline">
                {i.label} →
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Ekonomi-kategorier" className="mb-10 grid gap-3 sm:grid-cols-3">
      {others.map((i) => (
        <Link
          key={i.key}
          href={to(i.href)}
          className="group flex items-center justify-between gap-3 rounded-md border border-indigo-200 bg-indigo-50 px-4 py-3 transition-colors hover:bg-indigo-100"
        >
          <span className="text-sm font-semibold text-fg">{i.label}</span>
          <span aria-hidden className="shrink-0 text-indigo-700 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      ))}
    </nav>
  );
}
