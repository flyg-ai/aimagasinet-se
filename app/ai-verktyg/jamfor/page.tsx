import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import {
  resolveToolProfile,
  toolOverallScore,
  REVIEW_KNOWN,
} from '@/components/templates/ReviewTemplate';
import { toolNameFromTitle } from '@/lib/rating';
import { CURATED_HUB_TOOL_SLUGS } from '@/lib/route-kind';
import {
  FEATURED_COMPARISONS,
  TOOL_CATEGORIES,
  comparisonSlug,
  comparisonCategory,
  resolveToken,
} from '@/lib/compare';
import { breadcrumbSchema } from '@/lib/schemas';
import { ComparisonWizard, type CatalogTool, type CatalogCategory } from '@/components/ComparisonWizard';
import { JAMFOR_SEO_HTML } from '@/lib/jamfor-seo';

/** Kategori-hubbar som inte är riktiga verktygskategorier och därför aldrig
 *  ska ge en egen flik i jämför-väljaren: navigeringshubbar ('foretag' har
 *  bara ett enda barn, 'yrke', som leder in i ett helt eget 6-nivåers träd;
 *  'gratis' listar bara om samma verktyg under ett pris-filter) och hubbar
 *  utan egna publicerade barn eller en tom kuraterad lista (ai-verktyg-
 *  ekonomi är en ren länksida sedan 18 nov 2026 — CURATED_HUB_TOOL_SLUGS har
 *  den som [] med flit — tiktok har 0 DB-rader). OBS: ai-verktyg-redovisning
 *  (path /ai-verktyg/redovisning) ska INTE stå här — den har en riktig
 *  kuraterad lista på 8 verktyg, bara 0 egna DB-barn. ai-video-verktyg stod
 *  här tidigare av samma skäl ("0 DB-rader") — felaktigt: hub-SIDAN heter
 *  ai-video-verktyg, men dess 11 recenserade verktyg (HeyGen, Kling, Runway
 *  m.fl.) ligger i DB med parent_slug='ai-video', ett annat slug än hubbens
 *  eget. Se HUB_PARENT_SLUG_ALIAS nedan — hela kategorin saknades i
 *  jämföraren tills detta upptäcktes. */
const EXCLUDED_HUB_SLUGS = new Set([
  'foretag', 'gratis', 'ai-verktyg-ekonomi', 'tiktok',
]);

/** Hub-sidans eget slug matchar inte alltid dess barns parent_slug i DB
 *  (se ai-video-verktyg ovan) — slå upp DB-frågans parent_slug här istället
 *  för att anta att den alltid är samma som h.slug. */
const HUB_PARENT_SLUG_ALIAS: Record<string, string> = {
  'ai-video-verktyg': 'ai-video',
};

/** Djup-3-underhubbar (marknadsforing/ekonomi) — samma CURATED_HUB_TOOL_
 *  SLUGS-källa som de riktiga hub-sidorna själva, men de ligger inte som
 *  direkta barn till /ai-verktyg i DB (utan under t.ex. /ai-verktyg/
 *  marknadsforing), så den vanliga hub-frågan missar dem helt. ekonomi/
 *  redovisning är explicit UTESLUTEN — route-kind.ts säger uttryckligen att
 *  "ingen trafik når längre denna path" (301:ad till /ai-verktyg/redovisning,
 *  som redan täcks via den riktiga hub-raden ovan). */
const SUBHUB_EXTRAS: { path: string; slug: string; label: string }[] = [
  { path: '/ai-verktyg/marknadsforing/seo', slug: 'marknadsforing-seo', label: 'Marknadsföring: SEO' },
  { path: '/ai-verktyg/marknadsforing/content-copywriting', slug: 'marknadsforing-content', label: 'Marknadsföring: Content & copy' },
  { path: '/ai-verktyg/marknadsforing/annonser', slug: 'marknadsforing-annonser', label: 'Marknadsföring: Annonser' },
  { path: '/ai-verktyg/marknadsforing/sociala-medier', slug: 'marknadsforing-sociala-medier', label: 'Marknadsföring: Sociala medier' },
  { path: '/ai-verktyg/ekonomi/bokforing', slug: 'ekonomi-bokforing', label: 'Bokföring' },
];

/** Korta, lasbara flik-etiketter per hub-slug — hub-titlarna sjalva ar
 *  SEO-rubriker ("Basta AI-verktygen for cybersakerhet 2026") och duger inte
 *  som flik-text. En rad per hub, satt en gang; nya hubbar far ett fallback
 *  (hub.title) tills de laggs till har. */
const CATEGORY_LABELS: Record<string, string> = {
  'ai-text-verktyg': 'Text',
  'ai-bild-verktyg': 'Bild',
  'ai-video-verktyg': 'Video',
  'ai-kod-verktyg': 'Kod',
  'ai-ljud-och-musik': 'Ljud & musik',
  'ai-automation': 'Automation',
  'ai-agenter-hub': 'AI-agenter',
  'ai-assistenter': 'AI-assistenter',
  'ai-humaniserare': 'AI-humaniserare',
  'ai-sakerhet': 'Cybersäkerhet',
  'ai-trading': 'Trading',
  'ai-verktyg-fakturering': 'Fakturering',
  'ai-verktyg-juridik': 'Juridik',
  'ai-verktyg-kundservice': 'Kundservice',
  'ai-verktyg-marknadsforing': 'Marknadsföring',
  'ai-verktyg-rekrytering': 'Rekrytering',
  crm: 'CRM',
  dataanalys: 'Dataanalys',
  dokumenthantering: 'Dokumenthantering',
  'e-handel': 'E-handel',
  'e-postmarknadsforing': 'E-postmarknadsföring',
  'foto-bildredigering': 'Foto & bildredigering',
  hemsidebyggare: 'Hemsidebyggare',
  hr: 'HR',
  larare: 'Lärare',
  motesverktyg: 'Mötesverktyg',
  oversattning: 'Översättning',
  'podcast-ljudredigering': 'Podcast & ljudredigering',
  presentationer: 'Presentationer',
  produktbilder: 'Produktbilder',
  produktivitet: 'Produktivitet',
  projektledning: 'Projektledning',
  'rost-och-tal': 'Röst & tal',
  'sociala-medier-hub': 'Sociala medier',
  transkribering: 'Transkribering',
  'ui-ux': 'UI/UX-design',
  utbildning: 'Utbildning',
  'vibe-coding': 'Vibe coding',
  'marknadsforing-seo': 'Marknadsföring: SEO',
  'marknadsforing-content': 'Marknadsföring: Content & copy',
  'marknadsforing-annonser': 'Marknadsföring: Annonser',
  'marknadsforing-sociala-medier': 'Marknadsföring: Sociala medier',
  'ekonomi-bokforing': 'Bokföring',
};

/** Hubbar i den ordning de ska visas som flikar — de sex ursprungliga
 *  kategorierna forst (storst volym/mest sokt), resten i den ordning de
 *  raknades upp har. Hub som saknas i listan hamnar sist, alfabetiskt. */
const CATEGORY_ORDER_HINT = [
  'ai-text-verktyg', 'ai-bild-verktyg', 'ai-video-verktyg', 'ai-kod-verktyg',
  'ai-ljud-och-musik', 'ai-automation',
];

export const revalidate = 3600;

const YEAR = new Date().getFullYear();

export const metadata: Metadata = {
  title: 'Jämför AI-verktyg 2026 — Välj rätt för dig',
  description:
    'Jämför AI-verktyg sida vid sida — betyg, pris och styrkor. Välj upp till fyra verktyg och få en tydlig vinnare för just ditt syfte och din budget.',
  alternates: {
    canonical: '/ai-verktyg/jamfor/',
    languages: { 'sv-SE': '/ai-verktyg/jamfor/' },
  },
};

/** featured_image per tool, keyed by REVIEW_KNOWN key (= article slug for
 *  most tools). Best-effort — missing images fall back to a category
 *  gradient in the wizard. */
async function fetchImages(keys: string[]): Promise<Record<string, string | null>> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug,featured_image')
    .in('slug', keys);
  if (error || !data) {
    if (error) console.error('[jamfor] fetchImages error:', error.message);
    return {};
  }
  const map: Record<string, string | null> = {};
  for (const row of data as { slug: string; featured_image: string | null }[]) {
    map[row.slug] = row.featured_image;
  }
  return map;
}

/** Bygger hela jämför-väljarens katalog från den riktiga verktygsbanken —
 *  alla hubbar under /ai-verktyg, inte bara de sex ursprungliga (text/bild/
 *  video/kod/ljud/automation). Samma princip som hub-sidorna själva: en
 *  hub med en CURATED_HUB_TOOL_SLUGS-post använder den listan (annars skulle
 *  t.ex. workflows-guiden eller nedlagda Relay.app dyka upp), övriga hämtar
 *  sina publicerade barn direkt via parent_slug.
 *
 *  Varje verktyg kräver en RIKTIG REVIEW_KNOWN-rad för att tas med — annars
 *  faller resolveToolProfile tillbaka på påhittad mock-data (pris/kriterier/
 *  pros&cons), vilket är precis den sortens fabricerat innehåll som inte får
 *  visas. I praktiken filtrerar detta automatiskt bort de fåtal verktyg som
 *  ännu inte fått en skriven recension, plus guide-/listsidor som av misstag
 *  fått fel parent_slug (samma slags bugg som workflows-fallet) — de har
 *  aldrig haft en REVIEW_KNOWN-rad och exkluderas utan en separat blocklista.
 *
 *  Ett verktyg som förekommer under flera hubbar (t.ex. ChatGPT i både
 *  ai-assistenter och ai-text-verktyg) får en enda kategori — den första
 *  hubben den hittas i, i CATEGORY_ORDER_HINT-ordning. */
async function buildFullCatalog(): Promise<{ catalog: CatalogTool[]; categories: CatalogCategory[] }> {
  const { data: hubRows, error: hubErr } = await supabase
    .from('articles')
    .select('slug,title,path')
    .eq('parent_slug', 'ai-verktyg')
    .eq('type', 'page');
  if (hubErr || !hubRows) {
    console.error('[jamfor] buildFullCatalog hub query error:', hubErr?.message);
    return { catalog: [], categories: [] };
  }

  const hubs = hubRows
    .filter((h) => !EXCLUDED_HUB_SLUGS.has(h.slug))
    .concat(SUBHUB_EXTRAS.map((e) => ({ slug: e.slug, title: e.label, path: e.path })))
    .sort((a, b) => {
      const ia = CATEGORY_ORDER_HINT.indexOf(a.slug);
      const ib = CATEGORY_ORDER_HINT.indexOf(b.slug);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      return (CATEGORY_LABELS[a.slug] ?? a.title).localeCompare(CATEGORY_LABELS[b.slug] ?? b.title, 'sv');
    });

  // Per hub: curated slug-lista om en finns, annars publicerade DB-barn.
  const hubToolSlugs = new Map<string, string[]>();
  const titleBySlug = new Map<string, string>();
  for (const h of hubs) {
    const curated = CURATED_HUB_TOOL_SLUGS[h.path];
    if (curated) {
      hubToolSlugs.set(h.slug, curated);
      continue;
    }
    const { data: kids, error } = await supabase
      .from('articles')
      .select('slug,title')
      .eq('parent_slug', HUB_PARENT_SLUG_ALIAS[h.slug] ?? h.slug)
      .not('published_at', 'is', null);
    if (error) { console.error('[jamfor] hub children error', h.slug, error.message); continue; }
    hubToolSlugs.set(h.slug, (kids ?? []).map((k) => k.slug));
    for (const k of kids ?? []) titleBySlug.set(k.slug, k.title);
  }

  // Curaterade listor ger bara slugs, inte titlar — hämta de saknade i en
  // samlad fråga istället för en fråga per verktyg.
  const allSlugs = Array.from(new Set(Array.from(hubToolSlugs.values()).flat()));
  const needTitles = allSlugs.filter((s) => !titleBySlug.has(s));
  if (needTitles.length > 0) {
    const { data: titleRows } = await supabase.from('articles').select('slug,title').in('slug', needTitles);
    for (const r of titleRows ?? []) titleBySlug.set(r.slug, r.title as string);
  }

  const images = await fetchImages(allSlugs);

  // Ett verktyg -> en kategori (första hubben den dyker upp i).
  const categoryBySlug = new Map<string, { slug: string; label: string }>();
  for (const h of hubs) {
    const label = CATEGORY_LABELS[h.slug] ?? h.title;
    for (const toolSlug of hubToolSlugs.get(h.slug) ?? []) {
      if (!categoryBySlug.has(toolSlug)) categoryBySlug.set(toolSlug, { slug: h.slug, label });
    }
  }

  const catalog: CatalogTool[] = [];
  for (const [toolSlug, cat] of Array.from(categoryBySlug)) {
    if (!(toolSlug in REVIEW_KNOWN)) continue; // ingen riktig recension — hoppa, fabricera inte
    const title = titleBySlug.get(toolSlug) ?? toolSlug;
    const name = toolNameFromTitle(title);
    const profile = resolveToolProfile(toolSlug, name);
    if (profile.label === 'Nedlagd') continue;
    catalog.push({
      token: toolSlug,
      name,
      category: cat.slug,
      categoryLabel: cat.label,
      score: toolOverallScore(profile),
      image: images[toolSlug] ?? null,
      logo: profile.logo,
      price: profile.offer.price,
      bestFor: profile.offer.bestFor,
      criteria: profile.ratingCriteria,
      useCases: profile.useCases,
      ctaUrl: profile.fallbackUrl ?? null,
      ctaName: profile.ctaName ?? name,
    });
  }

  const categories: CatalogCategory[] = hubs
    .map((h) => ({ slug: h.slug, label: CATEGORY_LABELS[h.slug] ?? h.title, count: catalog.filter((t) => t.category === h.slug).length }))
    .filter((c) => c.count > 0);

  return { catalog, categories };
}

function display(token: string) {
  const ref = resolveToken(token);
  if (!ref) throw new Error(`Unknown compare token: ${token}`);
  const profile = resolveToolProfile(ref.key, ref.name);
  return { name: ref.name, logo: profile.logo, score: toolOverallScore(profile) };
}

/** Clean skeleton matching the wizard's first-step footprint so there is
 *  no layout jump when the client component hydrates. */
function WizardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      {/* progress line + step dots */}
      <div className="mb-3 h-3 w-44 rounded bg-soft" />
      <div className="mb-9 flex items-center gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <Fragment key={i}>
            {i > 0 && <span className="h-0.5 flex-1 rounded-full bg-soft" />}
            <span className="h-8 w-8 rounded-full bg-soft" />
          </Fragment>
        ))}
      </div>
      {/* panel */}
      <div className="rounded-3xl border border-line bg-card p-5 sm:p-7">
        <div className="h-8 w-64 max-w-full rounded bg-soft" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-soft" />
        <div className="mb-6 mt-6 flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="h-8 w-20 rounded-full bg-soft" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="aspect-[4/3] rounded-xl bg-soft" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function JamforHub() {
  // Valjaren (steg 1-4) dras fran HELA den riktiga verktygsbanken (373
  // recensioner i ~37 kategorier), inte bara de ursprungliga 52 i 6 fasta
  // kategorier — se buildFullCatalog(). De fardiga duellerna langre ner pa
  // sidan ("Populara jamforelser") anvander fortfarande COMPARE_TOOLS/
  // FEATURED_COMPARISONS: det ar 29 fardigskrivna SEO-sidor, inte valjaren,
  // och en egen, storre fas att utoka till hela banken.
  const { catalog, categories } = await buildFullCatalog();

  /** Duellerna grupperade per kategori. Som platt lista gick de tolv forsta
   *  an, men med tjugonio blir det en vagg dar inget hittas — rubrikerna gor
   *  att man kan hoppa till den kategori man faktiskt ar ute efter. */
  const popularGroups = TOOL_CATEGORIES.map((category) => ({
    category,
    duels: FEATURED_COMPARISONS.filter(([x, y]) => comparisonCategory(x, y) === category).map(
      ([x, y]) => ({ slug: comparisonSlug(x, y), a: display(x), b: display(y) }),
    ),
  })).filter((g) => g.duels.length > 0);
  const duelCount = popularGroups.reduce((n, g) => n + g.duels.length, 0);

  const breadcrumbLd = breadcrumbSchema([
    { label: 'Hem', href: '/' },
    { label: 'AI-verktyg', href: '/ai-verktyg' },
    { label: 'Jämför', href: '/ai-verktyg/jamfor' },
  ]);

  return (
    <article className="bg-page text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <header className="relative overflow-hidden border-b border-line bg-gradient-to-br from-indigo-50 via-card to-cyan-50">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12">
          <nav aria-label="Brödsmulor" className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Link href="/" className="hover:text-indigo-600">Hem</Link>
            <span className="mx-2 text-line-strong">›</span>
            <Link href="/ai-verktyg" className="hover:text-indigo-600">AI-verktyg</Link>
            <span className="mx-2 text-line-strong">›</span>
            <span className="text-fg-muted">Jämför</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            <span aria-hidden>⚔</span> Jämför steg för steg · {YEAR}
          </span>

          <h1 className="mt-6 max-w-3xl text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
            Jämför AI-verktyg 2026
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-fg-subtle sm:text-xl">
            Jämför betyg, pris och styrkor sida vid sida. Välj upp till fyra
            verktyg, berätta vad du ska göra och din budget — så får du en tydlig
            vinnare för just ditt behov.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Suspense fallback={<WizardSkeleton />}>
          <ComparisonWizard catalog={catalog} categories={categories} />
        </Suspense>
      </section>

      {/* Curated pairwise comparisons — kept for SEO + internal linking */}
      <section className="border-t border-line bg-card">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600">
            Populära jämförelser
          </div>
          <h2 className="mb-2 border-b border-line pb-3 text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
            Färdiga dueller
          </h2>
          <p className="mb-9 text-sm text-fg-subtle">
            {duelCount} jämförelser vi redan skrivit. Hittar du inte din — bygg den själv i väljaren ovan.
          </p>

          <div className="space-y-9">
            {popularGroups.map((g) => (
              <div key={g.category}>
                <h3 className="mb-3 flex items-baseline gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-fg-muted">
                  {g.category}
                  <span className="text-fg-subtle">· {g.duels.length}</span>
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {g.duels.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/ai-verktyg/jamfor/${c.slug}`}
                      className="group flex items-center justify-center gap-2 rounded-xl border border-line bg-page px-4 py-4 text-center text-sm font-bold tracking-tight text-fg transition-colors hover:border-indigo-300 hover:bg-indigo-50"
                    >
                      <span className="text-indigo-600">{c.a.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">vs</span>
                      <span className="text-cyan-600">{c.b.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* SEO-text (genererad via Claude Sonnet) */}
          <div
            className="mt-12 max-w-3xl text-base leading-relaxed text-fg-subtle [&_a:hover]:underline [&_a]:font-semibold [&_a]:text-indigo-600 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-fg [&_p]:mb-4"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JAMFOR_SEO_HTML }}
          />
        </div>
      </section>
    </article>
  );
}
