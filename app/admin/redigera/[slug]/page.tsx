import { notFound } from 'next/navigation';
import { requireAdminPage } from '@/lib/admin/auth';
import { getArticle, listCategories } from '@/lib/admin/articles';
import { ArticleForm } from '../../ArticleForm';

export default async function EditArticle({ params }: { params: { slug: string } }) {
  requireAdminPage();
  const [article, categories] = await Promise.all([getArticle(decodeURIComponent(params.slug)), listCategories()]);
  if (!article) notFound();
  return <ArticleForm categories={categories} initial={article} />;
}
