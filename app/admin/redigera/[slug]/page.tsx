import { notFound } from 'next/navigation';
import { requireAdminPage } from '@/lib/admin/auth';
import { getArticle, listAuthors, listCategories } from '@/lib/admin/articles';
import { adminConfig } from '@/lib/admin/config';
import { ArticleForm } from '../../ArticleForm';

export default async function EditArticle({ params }: { params: { slug: string } }) {
  requireAdminPage();
  const [article, categories, authors] = await Promise.all([getArticle(decodeURIComponent(params.slug)), listCategories(), listAuthors()]);
  if (!article) notFound();
  return <ArticleForm categories={categories} authors={authors} defaultAuthor={adminConfig.authors.default} initial={article} />;
}
