/**
 * Läsning och skrivning av artiklar för admin, via service role. Bara
 * server-side: anropas från server actions och serverkomponenter under
 * app/admin/, alltid efter en sessionskontroll.
 */
import 'server-only';
import sharp from 'sharp';
import { supabaseAdmin } from '@/lib/supabase';
import { adminConfig as C } from './config';

export type AdminArticle = {
  slug: string;
  title: string;
  body: string;
  excerpt: string;
  category: string;
  image: string | null;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  updatedAt: string | null;
  /** Skribenten (author_slug). Sätts till standardvärdet på nya rader och
   *  ändras aldrig av admin. */
  author: string | null;
};

type Row = Record<string, unknown>;
const col = C.columns;

function fromRow(r: Row): AdminArticle {
  const s = (k: keyof typeof col) => (r[col[k]] as string | null) ?? '';
  return {
    slug: s('slug'),
    title: s('title'),
    body: s('body'),
    excerpt: s('excerpt'),
    category: s('category'),
    image: (r[col.image] as string | null) ?? null,
    seoTitle: s('seoTitle'),
    seoDescription: s('seoDescription'),
    publishedAt: (r[col.publishedAt] as string | null) ?? null,
    updatedAt: (r[col.updatedAt] as string | null) ?? null,
    author: (r[col.author] as string | null) ?? null,
  };
}

/** Filtrerar på de fasta fälten (type='post', parent_slug is null). */
function scoped<T extends { eq: (c: string, v: string) => T; is: (c: string, v: null) => T }>(q: T): T {
  let out = q;
  for (const [k, v] of Object.entries(C.fixedFields)) out = out.eq(k, v);
  for (const k of C.nullFields) out = out.is(k, null);
  return out;
}

function inScope(row: Row): boolean {
  for (const [k, v] of Object.entries(C.fixedFields)) if (row[k] !== v) return false;
  for (const k of C.nullFields) if (row[k] != null) return false;
  return true;
}

export async function listCategories(): Promise<{ slug: string; name: string }[]> {
  const { data, error } = await supabaseAdmin()
    .from(C.categories.table)
    .select(`${C.categories.slugColumn},${C.categories.nameColumn}`)
    .order(C.categories.nameColumn);
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    slug: String(r[C.categories.slugColumn]),
    name: String(r[C.categories.nameColumn]),
  }));
}

export async function listArticles(limit = 50): Promise<AdminArticle[]> {
  const q = supabaseAdmin()
    .from(C.table)
    .select([col.slug, col.title, col.category, col.publishedAt, col.updatedAt, col.author].join(','));
  const { data, error } = await scoped(q)
    .order(col.updatedAt, { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as Row[]).map(fromRow);
}

export async function getArticle(slug: string): Promise<AdminArticle | null> {
  const { data, error } = await supabaseAdmin().from(C.table).select('*').eq(col.path, C.articlePath(slug)).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as Row;
  if (!inScope(row)) return null;
  return fromRow(row);
}

/** Finns någon rad alls (oavsett typ) med slugen eller på adressen? Både slug
 *  och path är unika i tabellen. Slugen är redan kontrollerad mot
 *  [a-z0-9-], så den går att lägga i filtret. */
export async function pathTaken(slug: string): Promise<boolean> {
  const { count, error } = await supabaseAdmin()
    .from(C.table)
    .select(col.path, { count: 'exact', head: true })
    .or(`${col.slug}.eq.${slug},${col.path}.eq.${C.articlePath(slug)}`);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

/** Finns rubriken redan? Databastriggern block_duplicate_title (0016) stoppar
 *  annars INSERT med ett tekniskt felmeddelande. */
export async function titleTaken(title: string): Promise<boolean> {
  const { count, error } = await supabaseAdmin()
    .from(C.table)
    .select(col.path, { count: 'exact', head: true })
    .eq(col.title, title);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export type SaveInput = Omit<AdminArticle, 'image' | 'updatedAt' | 'publishedAt' | 'author'> & { publishedAt: string };

/** Skapar eller uppdaterar raden. `image` undefined = rör inte bilden. */
export async function saveArticle(a: SaveInput, image: string | null | undefined, isNew: boolean): Promise<void> {
  const db = supabaseAdmin();
  const values: Row = {
    [col.title]: a.title,
    [col.body]: a.body,
    [col.excerpt]: a.excerpt || null,
    [col.category]: a.category,
    [col.seoTitle]: a.seoTitle || null,
    [col.seoDescription]: a.seoDescription || null,
    [col.publishedAt]: a.publishedAt,
    ...C.fixedFields,
  };
  if (image !== undefined) {
    values[col.image] = image;
    for (const c of C.imageMirrorColumns) values[c] = image;
  }
  if (isNew) {
    const { error } = await db.from(C.table).insert({
      ...C.insertDefaults,
      ...values,
      [col.slug]: a.slug,
      [col.path]: C.articlePath(a.slug),
    });
    if (error) throw new Error(error.message);
  } else {
    const q = db.from(C.table).update(values).eq(col.path, C.articlePath(a.slug));
    const { error } = await scoped(q);
    if (error) throw new Error(error.message);
  }
}

export async function unpublishArticle(slug: string): Promise<void> {
  const q = supabaseAdmin().from(C.table).update({ [col.publishedAt]: null }).eq(col.path, C.articlePath(slug));
  const { error } = await scoped(q);
  if (error) throw new Error(error.message);
}

// ── Omslagsbild ────────────────────────────────────────────────────────

/**
 * Kontrollerar bilden (format ur filens innehåll, inte ur filnamnet),
 * optimerar den till en webp (bredd högst 1200 px, kvalitet 85 — samma som
 * tmp/attach-borsen-image.ts) och laddar upp den till featured-images.
 *
 * `unique` ger ett nytt filnamn. Används när en bild byts ut, eftersom
 * optimerade bilder cachas i 30 dagar (next.config minimumCacheTTL) och en
 * ersatt fil på samma adress skulle fortsätta visa den gamla.
 * Returnerar den publika URL:en.
 */
export async function uploadCover(slug: string, file: File, unique: boolean): Promise<string> {
  if (file.size > C.imageMaxBytes) throw new Error(`Bilden är för stor (max ${Math.round(C.imageMaxBytes / 1024 / 1024)} MB).`);
  const bytes = Buffer.from(await file.arrayBuffer());
  let format: string | undefined;
  try {
    format = (await sharp(bytes).metadata()).format;
  } catch {
    throw new Error('Filen går inte att läsa som bild.');
  }
  if (!format || !C.imageFormats.has(format)) throw new Error('Bara JPG, PNG och WebP går att ladda upp.');

  const webp = await sharp(bytes)
    .rotate() // följ EXIF-orienteringen från mobilkameror
    .resize({ width: C.imageWidth, withoutEnlargement: true })
    .webp({ quality: C.imageQuality })
    .toBuffer();

  const db = supabaseAdmin();
  const key = C.imageKey(slug, unique);
  const { error } = await db.storage.from(C.bucket).upload(key, webp, {
    contentType: 'image/webp',
    cacheControl: '31536000',
    upsert: true,
  });
  if (error) throw new Error(`Uppladdningen misslyckades: ${error.message}`);
  return db.storage.from(C.bucket).getPublicUrl(key).data.publicUrl;
}
