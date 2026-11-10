import Link from 'next/link';
import { to } from '@/lib/links';
import { supabase } from '@/lib/supabase';
import { CURATED_HUB_TOOL_SLUGS } from '@/lib/route-kind';

type Row = {
  slug: string;
  title: string;
  path: string;
  featured_image: string | null;
  published_at: string;
  parent_slug: string | null;
};

/** Hub slugs whose topplista is curated by hand-picked tool slugs rather than
 *  DB parent_slug (see route-kind.ts) — they'd otherwise have zero "children"
 *  pointing at them and get misclassified as a lone tool review below. */
const CURATED_HUB_SLUGS = new Set(
  Object.keys(CURATED_HUB_TOOL_SLUGS).map((p) => p.split('/').filter(Boolean).pop()!)
);

async function fetchRows(): Promise<Row[]> {
  const { data } = await supabase
    .from('articles')
    .select('slug,title,path,featured_image,published_at,parent_slug')
    .eq('type', 'page')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(200);
  return (data ?? []) as Row[];
}

/** Två horisontella karuseller på startsidan: senast publicerade/uppdaterade
 *  kategorihubbar (topplistor) och senast publicerade/uppdaterade enskilda
 *  verktygsrecensioner. Ger färska djuplänkar ner mot båda sidtyperna —
 *  annars syns många recensioner bara från sin egen hub. */
export async function LatestToolPagesSection() {
  const all = await fetchRows();

  // Bara verktygsdomänen (/ai-verktyg/*, /ai-video/*) — uteslut /foretag/yrke/*
  // (roll-guider, varken hub eller recension i den här bemärkelsen).
  const inScope = all.filter(
    (r) =>
      (r.path.startsWith('/ai-verktyg/') || r.path.startsWith('/ai-video/')) &&
      !r.path.startsWith('/ai-verktyg/foretag')
  );

  const hubSlugs = new Set<string>(CURATED_HUB_SLUGS);
  for (const r of inScope) if (r.parent_slug) hubSlugs.add(r.parent_slug);

  const hubs = inScope.filter((r) => hubSlugs.has(r.slug)).slice(0, 10);
  const reviews = inScope.filter((r) => !hubSlugs.has(r.slug)).slice(0, 10);

  if (hubs.length === 0 && reviews.length === 0) return null;

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
          ▍ Senast uppdaterat inom AI-verktyg
        </h2>
      </div>
      <div className="flex flex-col gap-10">
        <Row
          title="Senaste AI-topplistorna"
          subtitle="Nya och uppdaterade kategoriguider"
          accent="text-indigo-700"
          items={hubs}
        />
        <Row
          title="Senaste AI-verktygsrecensionerna"
          subtitle="Enskilda AI-verktyg vi just testat eller uppdaterat"
          accent="text-emerald-700"
          items={reviews}
        />
      </div>
    </section>
  );
}

function Row({
  title,
  subtitle,
  accent,
  items,
}: {
  title: string;
  subtitle: string;
  accent: string;
  items: Row[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-black uppercase tracking-tight text-fg">{title}</h3>
        <span className={`hidden font-mono text-[10px] font-bold uppercase tracking-wider sm:inline ${accent}`}>
          {subtitle}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
          Scrolla horisontellt →
        </span>
      </div>

      <div className="-mx-4 sm:-mx-6">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((a) => (
            <li key={a.slug} className="w-56 shrink-0 snap-start">
              <Link
                href={to(a.path)}
                className="group block overflow-hidden rounded-lg border border-line bg-card transition-colors hover:border-indigo-300 hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {a.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.featured_image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                      Ingen bild
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="line-clamp-2 text-sm font-bold leading-snug tracking-tight text-fg group-hover:text-indigo-700">
                    {a.title}
                  </h4>
                  <time className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                    {new Date(a.published_at).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
