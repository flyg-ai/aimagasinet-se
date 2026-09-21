/**
 * Förhandsgranskningen: artikeln renderad med sajtens egen artikelmall
 * (ArticleTemplate → buildToc, toolLinkCards, ArticleProse), precis som
 * app/[...slug]/page.tsx gör för type='post'. Sajtspecifik — byts ut
 * tillsammans med config.ts när modulen flyttas.
 * Serverkomponent; returneras från server action previewAction().
 */
import 'server-only';
import { ArticleTemplate } from '@/components/templates/ArticleTemplate';
import { fetchAuthor } from '@/lib/authors';
import type { Article } from '@/lib/supabase';
import type { AdminArticle } from './articles';

export async function Preview({ a }: { a: AdminArticle }) {
  const now = new Date().toISOString();
  const article: Article = {
    id: 0,
    slug: a.slug,
    path: `/${a.slug}`,
    parent_slug: null,
    title: a.title,
    content_mdx: a.body,
    excerpt: a.excerpt || null,
    category: a.category || null,
    tags: [],
    featured_image: a.image,
    type: 'post',
    affiliate_url: null,
    author_slug: a.author,
    faq: null,
    seo_title: a.seoTitle || null,
    seo_description: a.seoDescription || null,
    published_at: a.publishedAt ?? now,
    updated_at: a.publishedAt ?? now,
  };
  const author = a.author ? await fetchAuthor(a.author) : null;
  return <ArticleTemplate article={article} items={[]} author={author} related={[]} />;
}
