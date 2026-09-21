'use server';

/**
 * Server actions för /admin. Varje action utom login kontrollerar sessionen
 * först och gör ingenting utan den.
 */
import type { ReactNode } from 'react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAdmin, login, logout } from '@/lib/admin/auth';
import { adminConfig as C } from '@/lib/admin/config';
import { bodyToHtml, plainText } from '@/lib/admin/body';
import {
  getArticle, listAuthors, listCategories, pathTaken, saveArticle, titleTaken, unpublishArticle, uploadCover,
  type AdminArticle,
} from '@/lib/admin/articles';
import { Preview } from '@/lib/admin/Preview';
import { excerptFromHtml, excerptFromText } from '@/lib/excerpt';

export type Issue = { message: string; hard: boolean; field?: string; blockIndex?: number; block?: string };

const DENIED = 'Ingen giltig session. Logga in igen.';
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ── Inloggning ─────────────────────────────────────────────────────────

export async function loginAction(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  const res = await login(String(form.get('password') ?? ''));
  if (!res.ok) return { error: res.error };
  redirect('/admin/');
}

export async function logoutAction(): Promise<void> {
  logout();
  redirect('/admin/login/');
}

// ── Slug ───────────────────────────────────────────────────────────────

async function slugProblem(slug: string): Promise<string | null> {
  if (!slug) return 'Slug saknas.';
  if (!SLUG_RE.test(slug)) return 'Slug får bara innehålla a–z, 0–9 och bindestreck.';
  if (C.reservedSlugs.includes(slug) || C.reservedSlugPatterns.some((re) => re.test(slug))) {
    return 'Slug krockar med en av sajtens egna sidor.';
  }
  if (await pathTaken(slug)) return `Adressen ${C.articleUrl(slug)} är redan upptagen.`;
  return null;
}

export async function checkSlugAction(slug: string): Promise<{ ok: boolean; message: string }> {
  if (!isAdmin()) return { ok: false, message: DENIED };
  const problem = await slugProblem(String(slug ?? '').trim());
  return problem ? { ok: false, message: problem } : { ok: true, message: 'Ledig.' };
}

// ── Formuläret ─────────────────────────────────────────────────────────

type Evaluated = { article: AdminArticle; issues: Issue[]; isNew: boolean; previousCategory: string | null; previousAuthor: string | null };

async function evaluate(form: FormData): Promise<Evaluated> {
  const str = (k: string) => String(form.get(k) ?? '');
  const originalSlug = str('originalSlug').trim();
  const isNew = !originalSlug;
  const slug = isNew ? str('slug').trim() : originalSlug;

  const existing = isNew ? null : await getArticle(originalSlug);
  if (!isNew && !existing) throw new Error(`Hittar ingen artikel med slug "${originalSlug}".`);

  const issues: Issue[] = [];
  const title = plainText(str('title'));
  const body = bodyToHtml(str('body'));

  // Tomma fält får samma standardvärden som den nattliga artikelgenereringen
  // (app/api/cron/generate-articles): ingress ur första stycket, SEO-titel =
  // rubriken (app/layout lägger på "| AI-Magasinet"), SEO-beskrivning = ingressen.
  let excerpt = plainText(str('excerpt'));
  if (!excerpt && body) {
    excerpt = excerptFromHtml(body);
    if (excerpt) issues.push({ message: 'Ingressen är tom — första stycket används.', hard: false, field: 'excerpt' });
  }
  let seoTitle = plainText(str('seoTitle'));
  const seoTitleDefaulted = !seoTitle;
  if (!seoTitle && title) {
    seoTitle = title;
    issues.push({ message: 'SEO-titeln är tom — rubriken används.', hard: false, field: 'seo_title' });
  }
  let seoDescription = plainText(str('seoDescription'));
  if (!seoDescription && excerpt) {
    seoDescription = excerptFromText(excerpt, C.seoDescriptionMax);
    issues.push({ message: 'SEO-beskrivningen är tom — ingressen används.', hard: false, field: 'seo_description' });
  }

  const article: AdminArticle = {
    slug,
    title,
    body,
    excerpt,
    category: str('category').trim(),
    image: str('removeImage') === '1' ? null : existing?.image ?? null,
    seoTitle,
    seoDescription,
    publishedAt: str('publishedAt').trim() || new Date().toISOString(),
    updatedAt: existing?.updatedAt ?? null,
    author: str('author').trim() || existing?.author || C.authors.default,
  };

  if (isNew) {
    const p = await slugProblem(slug);
    if (p) issues.push({ message: p, hard: true, field: 'slug' });
    if (title && (await titleTaken(title))) {
      issues.push({ message: 'Det finns redan en artikel med exakt den rubriken.', hard: true, field: 'title' });
    }
  }
  if (!article.title) issues.push({ message: 'Rubriken är tom.', hard: true, field: 'title' });
  if (!article.body) issues.push({ message: 'Brödtexten är tom.', hard: true, field: 'body' });

  const authors = new Set((await listAuthors()).map((x) => x.slug));
  if (!authors.has(article.author ?? '')) issues.push({ message: 'Okänd skribent.', hard: true, field: 'author' });

  const categories = new Set((await listCategories()).map((c) => c.slug));
  for (const r of C.validate({ ...article, publishedAt: article.publishedAt ?? '' }, categories)) {
    // Tomma obligatoriska fält har redan egna meddelanden ovan.
    if (r.code === 'missing' && ['slug', 'title', 'content_mdx'].includes(String(r.field))) continue;
    // En rubrik över 60 tecken som SEO-titel är ingen inmatningsmiss: Google
    // kortar den. Varning, inte stopp.
    if (r.code === 'seo-title-length' && seoTitleDefaulted) {
      issues.push({ message: `Rubriken är ${seoTitle.length} tecken och används som SEO-titel; Google kortar allt över ${C.seoTitleMax}. Skriv gärna en kortare SEO-titel.`, hard: false, field: 'seo_title' });
      continue;
    }
    const hard = C.hardStops.has(r.code) || (r.code === 'missing' && C.requiredFields.includes(String(r.field)));
    issues.push({ message: r.message, hard, field: r.field, blockIndex: r.blockIndex, block: r.block });
  }
  return { article, issues, isNew, previousCategory: existing?.category ?? null, previousAuthor: existing?.author ?? null };
}

export type PreviewResult = { error?: string; issues?: Issue[]; node?: ReactNode };

export async function previewAction(form: FormData): Promise<PreviewResult> {
  if (!isAdmin()) return { error: DENIED };
  try {
    const { article, issues } = await evaluate(form);
    return { issues, node: <Preview a={article} /> };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export type PublishResult = { error?: string; issues?: Issue[]; url?: string };

export async function publishAction(form: FormData): Promise<PublishResult> {
  if (!isAdmin()) return { error: DENIED };
  try {
    const { article, issues, isNew, previousCategory, previousAuthor } = await evaluate(form);
    if (issues.some((i) => i.hard)) return { issues, error: 'Rätta de röda punkterna innan du publicerar.' };

    let image: string | null | undefined = form.get('removeImage') === '1' ? null : undefined;
    const file = form.get('image');
    if (file instanceof File && file.size > 0) {
      // Nytt filnamn när en bild byts ut, så att cachade versioner inte visas.
      image = await uploadCover(article.slug, file, !isNew || !!article.image);
    }

    await saveArticle({ ...article, publishedAt: article.publishedAt! }, image, isNew);
    for (const p of C.revalidatePaths(article, previousCategory, previousAuthor)) revalidatePath(p);
    return { issues, url: C.articleUrl(article.slug) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function unpublishAction(form: FormData): Promise<void> {
  if (!isAdmin()) throw new Error(DENIED);
  const slug = String(form.get('slug') ?? '');
  const existing = await getArticle(slug);
  if (!existing) throw new Error('Artikeln finns inte.');
  await unpublishArticle(slug);
  for (const p of C.revalidatePaths(existing)) revalidatePath(p);
  redirect('/admin/');
}
