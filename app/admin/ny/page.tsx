import { requireAdminPage } from '@/lib/admin/auth';
import { listCategories } from '@/lib/admin/articles';
import { ArticleForm } from '../ArticleForm';

export default async function NewArticle() {
  requireAdminPage();
  return <ArticleForm categories={await listCategories()} initial={null} />;
}
