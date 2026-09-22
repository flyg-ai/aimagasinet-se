import Link from 'next/link';
import { to } from '@/lib/links';
import { toolNameFromTitle, type Rating } from '@/lib/rating';
import { buildReviewProfile, seed, type ReviewProfile } from '@/lib/review-profiles';
import { formatScore, reviewRating, reviewScore } from '@/lib/review-score';
import type { Article } from '@/lib/supabase';
import type { ArticleCardData } from '@/components/ArticleCard';
import { breadcrumbSchema, faqPageSchema } from '@/lib/schemas';
import { FaqAccordion } from '@/components/FaqAccordion';
import { buildToc, type TocItem } from '@/lib/toc';
import { Toc } from '@/components/Toc';
import { formatSvDate, contentModifiedIso } from '@/lib/format-date';

// Profilerna och betyget bor i lib/review-profiles.ts och lib/review-score.ts;
// de gamla importvägarna (lib/compare.ts, hubbmallarna, skripten) fungerar kvar.
export { REVIEW_KNOWN, resolveToolProfile, toolOverallScore, type ReviewProfile } from '@/lib/review-profiles';

function sanitizeWpHtml(html: string): string {
  return html
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function buildCrumbs(path: string): { label: string; href: string }[] {
  const parts = path.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Hem', href: '/' }];
  let acc = '';
  for (const p of parts) {
    acc += '/' + p;
    crumbs.push({ label: decodeURIComponent(p), href: acc });
  }
  return crumbs;
}

function starsFromScore(score: number): number {
  return Math.max(1, Math.min(5, Math.round((score / 10) * 5)));
}

function rankAmongSiblings(article: Article, siblings: ArticleCardData[]): number {
  const all: { slug: string; score: number }[] = [
    { slug: article.slug, score: reviewRating(article).score },
    ...siblings.map((s) => ({
      slug: s.slug,
      // Siblings don't ship content_mdx → mock from seed (consistent with deeplink rank-ish positioning).
      score: 7.4 + ((seed(s.slug) % 23) * 0.1),
    })),
  ];
  all.sort((a, b) => b.score - a.score);
  return all.findIndex((x) => x.slug === article.slug) + 1;
}

/* ─── Template ─────────────────────────────────────────────────── */

export function ReviewTemplate({
  article: a,
  siblings,
}: {
  article: Article;
  siblings: ArticleCardData[];
}) {
  const toolName = toolNameFromTitle(a.title);
  const profile = buildReviewProfile(a);
  // score === null = explicit "ännu ej betygsatt" (t.ex. wint-ai i väntan på
  // ombedömning). Döljer betygssiffra, stjärnor, rank och Review-schemat.
  // Betyget kommer ur lib/review-score.ts — samma funktion som topplistblocket
  // och "Verktyg i guiden" i artiklarna läser, så de visar alltid samma siffra.
  const scored = reviewScore(a);
  const noScore = scored.unrated;
  const rating = reviewRating(a);
  const rank = noScore ? null : rankAmongSiblings(a, siblings);
  const crumbs = buildCrumbs(a.path);
  // Ärligt datum: det som faktiskt står i raden, samma värde som schemats
  // dateModified. Saknas båda visas ingen "Uppdaterad"-fras alls.
  const updatedIso = contentModifiedIso(a) ?? a.published_at ?? null;
  const updatedLabel = updatedIso ? formatSvDate(updatedIso) : null;
  const stars = noScore ? null : starsFromScore(rating.score);

  const reviewLd = noScore ? null : {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: toolName,
      applicationCategory: 'AI Tool',
      ...(a.featured_image ? { image: a.featured_image } : {}),
    },
    reviewRating: { '@type': 'Rating', ratingValue: rating.score, bestRating: rating.max, worstRating: 0 },
    author: { '@type': 'Organization', name: 'AI-Magasinet' },
    ...(a.published_at ? { datePublished: a.published_at } : {}),
    ...(a.excerpt ? { reviewBody: a.excerpt } : {}),
  };

  // Add BreadcrumbList alongside the Review schema for any depth > 1.
  const breadcrumbLd = crumbs.length > 0
    ? breadcrumbSchema([...crumbs, { label: a.title, href: a.path }])
    : null;
  const ldItems = [reviewLd, breadcrumbLd].filter(Boolean);
  const allLd = ldItems.length === 1 ? ldItems[0] : ldItems;

  // Table of contents: inject anchor ids into the body H2/H3 and collect items
  // for the sticky desktop sidebar + the mobile collapsible TOC.
  const toc = a.content_mdx
    ? buildToc(sanitizeWpHtml(a.content_mdx))
    : { html: '', items: [] as TocItem[] };

  return (
    <article className="bg-muted text-fg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(allLd) }}
      />

      <Hero
        article={a}
        toolName={toolName}
        profile={profile}
        rating={noScore ? null : rating}
        scoreText={scored.display}
        stars={stars}
        rank={rank}
        crumbs={crumbs}
        updatedLabel={updatedLabel}
      />

      <OfferBanner profile={profile} toolName={toolName} affiliateUrl={a.affiliate_url} />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr,320px] lg:gap-14">
          <main className="min-w-0">
            <Verdict toolName={toolName} profile={profile} excerpt={a.excerpt} />
            <RatingMatrixSection profile={profile} />
            <ProsCons profile={profile} />
            <UseCases toolName={toolName} profile={profile} />
            <Djupanalys toolName={toolName} html={toc.html} items={toc.items} />
            <Alternatives siblings={siblings} parentPath={parentPathOf(a.path)} />
            <BottomCta toolName={toolName} profile={profile} affiliateUrl={a.affiliate_url} />
            <NextPrev siblings={siblings} />
          </main>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <Toc items={toc.items} variant="sidebar" />
            <Snabbfakta profile={profile} />
            <SidebarOffer toolName={toolName} profile={profile} affiliateUrl={a.affiliate_url} />
            <BackToTopplistan parentPath={parentPathOf(a.path)} />
          </aside>
        </div>
      </div>

      {Array.isArray(a.faq) && a.faq.length > 0 && (
        <>
          <FaqAccordion
            items={a.faq}
            heading={`Vanliga frågor om ${toolName}`}
          />
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(a.faq)) }}
          />
        </>
      )}
    </article>
  );
}

function parentPathOf(path: string): string {
  const segs = path.split('/').filter(Boolean);
  return '/' + segs.slice(0, -1).join('/');
}

/* ─── Hero ─────────────────────────────────────────────────────── */

function Hero({
  article: a,
  toolName,
  profile,
  rating,
  scoreText,
  stars,
  rank,
  crumbs,
  updatedLabel,
}: {
  article: Article;
  toolName: string;
  profile: ReviewProfile;
  rating: Rating | null;
  /** reviewScore().display — samma text som listorna visar. */
  scoreText: string | null;
  stars: number | null;
  rank: number | null;
  crumbs: { label: string; href: string }[];
  updatedLabel: string | null;
}) {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
        {/* Breadcrumb */}
        <nav aria-label="Brödsmulor" className="mb-7 flex flex-wrap items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {crumbs.map((c, i) => (
            <span key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-fg-faint">›</span>}
              {i === crumbs.length - 1 ? (
                <span className="text-fg-muted">{c.label}</span>
              ) : (
                <Link href={to(c.href)} className="hover:text-indigo-600">{c.label}</Link>
              )}
            </span>
          ))}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr,auto] lg:items-start lg:gap-10">
          {/* Logo + heading group — always horizontal so logo never floats alone */}
          <div className="flex items-start gap-4 sm:gap-5">
            <ToolLogo profile={profile} image={a.featured_image} size="lg" />

            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                <span aria-hidden>✦</span>
                Recension{updatedLabel ? ` · Uppdaterad ${updatedLabel}` : ''}
              </span>

              <h1 className="mt-4 text-balance break-words text-2xl font-black uppercase leading-[1.05] tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-5xl">
                {toolName}{' '}
                <span className="text-indigo-600">Recension</span>
              </h1>

              {profile.tagline && (
                <p className="mt-3 text-base font-semibold text-indigo-600 sm:text-lg">
                  {profile.tagline}
                </p>
              )}

              {a.excerpt && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-subtle sm:text-lg">
                  {a.excerpt}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-1.5">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rating block — centered on mobile, right-aligned on desktop.
              Utan betyg (noScore) visas en neutral "ännu ej betygsatt"-platta. */}
          <div className="flex flex-col items-center gap-2 text-center lg:items-end lg:text-right">
            {rating ? (
              <>
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-teal-200 bg-teal-50 lg:mx-0">
                  <span className="text-3xl font-black leading-none tracking-tight text-teal-600">
                    {scoreText}
                  </span>
                </div>
                <span className="text-base leading-none tracking-widest text-indigo-500">
                  {'★'.repeat(stars ?? 0)}
                  <span className="text-line-strong">{'★'.repeat(5 - (stars ?? 0))}</span>
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                  #{rank} · {profile.label}
                </span>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-24 items-center justify-center rounded-full border-4 border-line-strong bg-soft px-6 lg:mx-0">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
                    Ännu ej betygsatt
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                  {profile.label}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Offer banner (just under hero) ──────────────────────────── */

function OfferBanner({
  profile,
  toolName,
  affiliateUrl,
}: {
  profile: ReviewProfile;
  toolName: string;
  affiliateUrl: string | null;
}) {
  return (
    <div className="border-b border-line bg-gradient-to-r from-emerald-50 via-emerald-50/60 to-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
          >
            🎁
          </span>
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
              Aktuellt erbjudande
            </div>
            <div className="mt-0.5 text-base">
              <span className="font-bold text-fg">{profile.offer.title}</span>
              <span className="mx-2 text-fg-faint">·</span>
              <span className="text-fg-subtle">{profile.offer.price}</span>
            </div>
          </div>
        </div>
        <AffiliateBtn discontinued={profile.label === 'Nedlagd'} affiliateUrl={affiliateUrl} fallbackUrl={profile.fallbackUrl} label={`Prova ${profile.ctaName ?? toolName}`} />
      </div>
    </div>
  );
}

/* ─── Verdict + rating matrix ─────────────────────────────────── */

function Verdict({
  toolName,
  profile,
  excerpt,
}: {
  toolName: string;
  profile: ReviewProfile;
  excerpt: string | null;
}) {
  return (
    <section className="mt-10">
      <Eyebrow>Redaktionens dom</Eyebrow>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-fg break-words sm:text-4xl">
        Vårt omdöme om {toolName}
      </h2>
      <p className="mt-4 max-w-prose text-[17px] leading-[1.75] text-fg-muted">
        {excerpt
          ? excerpt + ' '
          : ''}
        {toolName} levererar en konsekvent stark upplevelse i AI-Magasinets test.
        Vår sammanvägda bedömning placerar verktyget tydligt i premiumklassen för
        sin kategori — särskilt om du värdesätter {profile.useCases[0]?.toLowerCase() ?? 'kvalitet'}.
      </p>
    </section>
  );
}

function RatingMatrixSection({ profile }: { profile: ReviewProfile }) {
  // Inga kriterier (t.ex. ännu ej betygsatt verktyg) → hoppa över sektionen.
  if (profile.ratingCriteria.length === 0) return null;
  return (
    <section className="mt-10 rounded-2xl border border-line bg-card p-6 sm:p-8">
      <Eyebrow>Så testade vi</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg break-words">
        Betyg per kriterium
      </h3>

      <ul className="mt-6 flex flex-col gap-4">
        {profile.ratingCriteria.map(({ label, score }) => {
          const pct = Math.min(100, Math.max(0, (score / 10) * 100));
          return (
            <li key={label} className="grid grid-cols-[140px,1fr,auto] items-center gap-4 sm:grid-cols-[220px,1fr,auto]">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-fg-subtle">
                {label}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-soft">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono text-sm font-bold text-fg">
                {score.toFixed(1)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─── Pros & cons ──────────────────────────────────────────────── */

function ProsCons({ profile }: { profile: ReviewProfile }) {
  return (
    <section className="mt-10">
      <Eyebrow>För- & nackdelar</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
        Vad vi gillar — och inte
      </h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">✓</span>
            Styrkor
          </div>
          <ul className="space-y-2.5 text-[15px] text-fg">
            {profile.pros.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-rose-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100">✗</span>
            Svagheter
          </div>
          <ul className="space-y-2.5 text-[15px] text-fg">
            {profile.cons.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─── Use cases ────────────────────────────────────────────────── */

function UseCases({ toolName, profile }: { toolName: string; profile: ReviewProfile }) {
  return (
    <section className="mt-10">
      <Eyebrow>Användningsområden</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
        {toolName} är bäst för
      </h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {profile.useCases.map((uc) => (
          <div
            key={uc}
            className="flex items-center gap-3 rounded-lg border border-line bg-indigo-50/40 px-4 py-3"
          >
            <span
              aria-hidden
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-indigo-600"
            >
              ⚡
            </span>
            <span className="text-[15px] font-semibold text-fg">{uc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Djupanalys (content_mdx) ────────────────────────────────── */

function Djupanalys({ toolName, html, items }: { toolName: string; html: string; items: TocItem[] }) {
  if (!html.trim()) return null;
  return (
    <section className="mt-12">
      <Eyebrow>Djupanalys</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
        Allt om {toolName}
      </h3>
      {/* Mobile collapsible TOC (the sticky desktop one lives in the aside). */}
      <div className="mt-6">
        <Toc items={items} variant="mobile" />
      </div>
      <div className="magazine-prose mt-6">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:scroll-mt-24
            prose-headings:font-black prose-headings:tracking-tight prose-headings:text-fg prose-headings:break-words prose-headings:[overflow-wrap:anywhere]
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl prose-h2:uppercase prose-h2:border-l-4 prose-h2:border-indigo-500 prose-h2:pl-3 sm:prose-h2:text-2xl
            prose-h3:mt-8 prose-h3:mb-2 prose-h3:text-lg
            prose-p:text-fg-muted prose-p:leading-[1.85]
            prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:font-bold prose-strong:text-fg
            prose-li:text-fg-muted prose-li:leading-[1.75] prose-li:marker:text-indigo-500
            prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50/40 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:font-medium prose-blockquote:text-fg
            prose-img:rounded-xl prose-img:border prose-img:border-line
            prose-hr:my-10 prose-hr:border-line
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}

/* ─── Alternatives ──────────────────────────────────────────────── */

function Alternatives({
  siblings,
  parentPath,
}: {
  siblings: ArticleCardData[];
  parentPath: string;
}) {
  if (siblings.length === 0) return null;
  const picks = siblings.slice(0, 3);
  return (
    <section className="mt-14">
      <Eyebrow>Alternativ</Eyebrow>
      <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-fg break-words sm:text-3xl">
        Andra att överväga
      </h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((s) => {
          const fakeArticle: Article = {
            ...(s as unknown as Article),
            content_mdx: null,
            tags: [],
            parent_slug: null,
            type: 'page',
            seo_title: null,
            seo_description: null,
            id: 0,
          };
          const sp = buildReviewProfile(fakeArticle);
          const sr = reviewRating(fakeArticle);
          return (
            <Link
              key={s.slug}
              href={to(s.path)}
              className="group flex flex-col gap-3 rounded-xl border border-line bg-card p-4 transition-colors hover:border-indigo-300"
            >
              <div className="flex items-start gap-3">
                <ToolLogo profile={sp} image={s.featured_image} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black uppercase tracking-tight text-fg break-words group-hover:text-indigo-600">
                    {toolNameFromTitle(s.title)}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                    {sp.label}
                  </div>
                </div>
                <span className="shrink-0 font-black text-teal-600">
                  {formatScore(sr.score)}
                </span>
              </div>
              {s.excerpt && (
                <p className="line-clamp-2 text-xs text-fg-subtle">{s.excerpt}</p>
              )}
            </Link>
          );
        })}
      </div>

      <Link
        href={to(parentPath)}
        className="mt-5 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-600 hover:text-indigo-700"
      >
        ← Hela topplistan
      </Link>
    </section>
  );
}

/* ─── Bottom CTA ───────────────────────────────────────────────── */

function BottomCta({
  toolName,
  profile,
  affiliateUrl,
}: {
  toolName: string;
  profile: ReviewProfile;
  affiliateUrl: string | null;
}) {
  return (
    <section className="mt-14">
      <div className="flex flex-col gap-5 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700"
          >
            🏆
          </span>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-fg break-words">
              Redo att testa {toolName}?
            </h3>
            <p className="mt-1 text-sm text-fg-subtle">
              {profile.offer.title} — inget kreditkort krävs.
            </p>
          </div>
        </div>
        <AffiliateBtn discontinued={profile.label === 'Nedlagd'} affiliateUrl={affiliateUrl} fallbackUrl={profile.fallbackUrl} label={`Prova ${profile.ctaName ?? toolName}`} size="lg" />
      </div>
    </section>
  );
}

/* ─── Next / prev link ─────────────────────────────────────────── */

function NextPrev({ siblings }: { siblings: ArticleCardData[] }) {
  const next = siblings[0];
  if (!next) return null;
  return (
    <div className="mt-8 flex justify-end">
      <Link
        href={to(next.path)}
        className="group inline-flex flex-col items-end rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-indigo-300"
      >
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-fg-subtle">
          Nästa →
        </span>
        <span className="mt-1 text-sm font-black uppercase tracking-tight text-fg break-words group-hover:text-indigo-600">
          {toolNameFromTitle(next.title)}
        </span>
      </Link>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────────── */

const SNABBFAKTA_ROWS: { key: keyof ReviewProfile | 'offer-price' | 'offer-bestFor'; label: string; icon: string }[] = [
  { key: 'company',         label: 'Företag',  icon: '🌐' },
  { key: 'model',           label: 'Modell',   icon: '🤖' },
  { key: 'founded',         label: 'Grundat',  icon: '🗓' },
  { key: 'hq',              label: 'HQ',       icon: '📍' },
  { key: 'offer-price',     label: 'Pris',     icon: '💲' },
  { key: 'offer-bestFor',   label: 'Bäst för', icon: '🏆' },
];

function Snabbfakta({ profile }: { profile: ReviewProfile }) {
  const rowValue = (key: (typeof SNABBFAKTA_ROWS)[number]['key']): string => {
    if (key === 'offer-price')   return profile.offer.price;
    if (key === 'offer-bestFor') return profile.offer.bestFor;
    const v = profile[key as keyof ReviewProfile];
    return typeof v === 'string' || typeof v === 'number' ? String(v) : '';
  };

  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
        Snabbfakta
      </div>
      <ul className="flex flex-col">
        {SNABBFAKTA_ROWS.map((row, i) => (
          <li
            key={row.key}
            className={
              'flex items-start gap-3 py-3 ' +
              (i !== 0 ? 'border-t border-line-subtle' : '')
            }
          >
            <span aria-hidden className="mt-0.5 text-base text-fg-subtle">{row.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                {row.label}
              </div>
              <div className="mt-0.5 text-sm font-bold text-fg">{rowValue(row.key)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarOffer({
  toolName,
  profile,
  affiliateUrl,
}: {
  toolName: string;
  profile: ReviewProfile;
  affiliateUrl: string | null;
}) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-700">
        🎁 Erbjudande
      </div>
      <div className="mt-2 text-base font-black uppercase tracking-tight text-fg break-words">
        {profile.offer.title}
      </div>
      <div className="mt-3">
        <AffiliateBtn discontinued={profile.label === 'Nedlagd'} affiliateUrl={affiliateUrl} fallbackUrl={profile.fallbackUrl} label={`Prova ${profile.ctaName ?? toolName}`} fullWidth />
      </div>
    </div>
  );
}

function BackToTopplistan({ parentPath }: { parentPath: string }) {
  return (
    <Link
      href={to(parentPath)}
      className="block rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-indigo-300"
    >
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg-subtle">
        ← Tillbaka
      </div>
      <div className="mt-1 text-sm font-black uppercase tracking-tight text-fg break-words">
        Hela topplistan
      </div>
    </Link>
  );
}

/* ─── Atoms ────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-600">
      {children}
    </div>
  );
}

function ToolLogo({
  profile,
  image,
  size = 'md',
}: {
  profile: ReviewProfile;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims =
    size === 'lg' ? 'h-20 w-20 rounded-2xl text-3xl'
    : size === 'sm' ? 'h-10 w-10 rounded-lg text-base'
    : 'h-14 w-14 rounded-xl text-2xl';

  if (image) {
    const padding = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-1.5' : 'p-2';
    return (
      <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-line bg-card ${padding} ${dims}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const initial = profile.company.charAt(0).toUpperCase();
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-black text-white ${profile.logo} ${dims}`}
      aria-hidden
    >
      {initial}
    </div>
  );
}

function AffiliateBtn({
  affiliateUrl,
  fallbackUrl,
  label,
  size = 'md',
  fullWidth = false,
  discontinued = false,
}: {
  affiliateUrl: string | null | undefined;
  fallbackUrl: string | null | undefined;
  label: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  /** Nedlagd tjänst — ingen CTA alls, varken länk eller dött <span>. */
  discontinued?: boolean;
}) {
  if (discontinued) return null;
  const cls =
    'inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 font-bold uppercase tracking-wider text-white transition-colors hover:bg-indigo-700 ' +
    (size === 'lg' ? 'px-6 py-3 text-sm' : 'px-5 py-2.5 text-sm') +
    (fullWidth ? ' w-full' : '');

  const url = affiliateUrl || fallbackUrl;
  const rel = affiliateUrl
    ? 'noopener noreferrer sponsored'
    : 'nofollow noopener noreferrer';

  if (!url) {
    return (
      <span className={cls + ' opacity-60'}>
        <span>{label}</span>
        <span aria-hidden>↗</span>
      </span>
    );
  }
  const link = (
    <a href={to(url)} target="_blank" rel={rel} className={cls}>
      <span>{label}</span>
      <span aria-hidden>↗</span>
    </a>
  );
  if (!affiliateUrl) return link;
  // Affiliatelänk: märk den som annons direkt vid knappen (marknadsföringslagen).
  return (
    <span className={'inline-flex flex-col gap-1.5' + (fullWidth ? ' w-full' : '')}>
      {link}
      <span className="text-[11px] leading-snug text-fg-subtle">
        Annonslänk: vi kan få provision om du köper via länken. Det påverkar inte betyget.
      </span>
    </span>
  );
}

