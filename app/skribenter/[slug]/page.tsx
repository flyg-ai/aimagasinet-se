import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAuthor } from '@/lib/authors';
import { ArticleCard, type ArticleCardData } from '@/components/ArticleCard';
import { AuthorAvatar } from '@/components/AuthorAvatar';
import { JsonLd } from '@/components/JsonLd';
import { personSchema, breadcrumbSchema } from '@/lib/schemas';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const author = await fetchAuthor(params.slug);
  if (!author) return { title: 'Skribent hittas inte' };
  const canonical = `/skribenter/${author.slug}/`;
  const title = `${author.name}${author.role ? ' — ' + author.role : ''}`;
  const description = author.bio ?? `Artiklar av ${author.name} på AI-Magasinet.`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { 'sv-SE': canonical },
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: canonical,
      images: author.avatar_url ? [{ url: author.avatar_url }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: author.avatar_url ? [author.avatar_url] : undefined,
    },
  };
}

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = await fetchAuthor(params.slug);
  if (!author) notFound();

  // Pull the author's posts. Pages are excluded — readers don't expect
  // hub/review pages on a journalist's profile, even though the author
  // technically curates them.
  const { data: postsRaw } = await supabase
    .from('articles')
    .select('slug,title,excerpt,featured_image,category,published_at,path')
    .eq('type', 'post')
    .eq('author_slug', params.slug)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  const posts: ArticleCardData[] = ((postsRaw ?? []) as ArticleCardData[]).map((a) => ({
    ...a,
    author_slug: params.slug,
    author_name: author.name,
  }));

  const ld = [
    personSchema(author),
    breadcrumbSchema([
      { label: 'Skribenter', href: '/skribenter' },
      { label: author.name, href: `/skribenter/${author.slug}` },
    ]),
  ];

  return (
    <article>
      <JsonLd data={ld} />
      {/* ── Hero band: avatar + bio ─────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <nav
            aria-label="Brödsmulor"
            className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg-subtle"
          >
            <Link href="/" className="hover:text-indigo-600">Hem</Link>
            <span className="mx-2 text-line-strong">›</span>
            <Link href="/skribenter" className="hover:text-indigo-600">Skribenter</Link>
            <span className="mx-2 text-line-strong">›</span>
            <span className="text-fg-muted">{author.name}</span>
          </nav>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
            <AuthorAvatar
              slug={author.slug}
              name={author.name}
              avatarUrl={author.avatar_url}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              {author.role && (
                <div className="mb-2 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-700">
                  {author.role}
                </div>
              )}
              <h1 className="text-balance text-4xl font-black tracking-tight text-fg sm:text-5xl">
                {author.name}
              </h1>
              {author.bio && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
                  {author.bio}
                </p>
              )}
              {(author.twitter_url || author.linkedin_url) && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {author.twitter_url && (
                    <a
                      href={author.twitter_url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-fg-muted transition-colors hover:border-indigo-300 hover:text-indigo-700"
                    >
                      Twitter / X
                    </a>
                  )}
                  {author.linkedin_url && (
                    <a
                      href={author.linkedin_url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-fg-muted transition-colors hover:border-indigo-300 hover:text-indigo-700"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Article grid ─────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-fg-muted">
            ▍ Artiklar av {author.name}
          </h2>
          <span className="text-xs text-fg-faint">{posts.length} st</span>
        </div>
        {posts.length === 0 ? (
          <p className="rounded-lg border border-line bg-card px-4 py-12 text-center text-fg-subtle">
            Inga publicerade artiklar ännu.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <ArticleCard key={p.slug} a={p} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

