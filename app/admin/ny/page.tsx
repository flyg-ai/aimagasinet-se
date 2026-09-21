import { requireAdminPage } from '@/lib/admin/auth';
import { listAuthors, listCategories } from '@/lib/admin/articles';
import { adminConfig } from '@/lib/admin/config';
import { ArticleForm } from '../ArticleForm';

export default async function NewArticle() {
  requireAdminPage();
  const [categories, authors] = await Promise.all([listCategories(), listAuthors()]);
  return <ArticleForm categories={categories} authors={authors} defaultAuthor={adminConfig.authors.default} initial={null} />;
}
