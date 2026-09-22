/**
 * Allt sajtspecifikt för adminmodulen (app/admin/ + lib/admin/). Portad från
 * cryptofeber.se; det här är filen — tillsammans med förhandsgranskningen i
 * lib/admin/Preview.tsx — som skiljer sajterna åt. Se ADMIN.md.
 */
import { checkArticle, SEO_DESCRIPTION_MAX, SEO_TITLE_MAX, type RuleCode } from '@/lib/article-rules';

export const adminConfig = {
  siteName: 'AI-Magasinet',
  /** Kanonisk bas-URL. Absoluta länkar hit i brödtexten görs relativa, så att
   *  de räknas som interna länkar. */
  siteUrl: 'https://aimagasinet.se',

  // ── Databasen ──────────────────────────────────────────────────────────
  table: 'articles',
  /** Kolumnerna modulen läser och skriver. Vänster sida är modulens namn,
   *  höger sida kolumnen i tabellen. */
  columns: {
    slug: 'slug',
    path: 'path',
    title: 'title',
    /** HTML, trots namnet. */
    body: 'content_mdx',
    excerpt: 'excerpt',
    category: 'category',
    image: 'featured_image',
    seoTitle: 'seo_title',
    seoDescription: 'seo_description',
    publishedAt: 'published_at',
    updatedAt: 'updated_at',
    author: 'author_slug',
  },
  /** Fält som alltid sätts på en ny rad och kontrolleras på en befintlig: admin
   *  listar och redigerar bara rader med exakt de värdena. */
  fixedFields: { type: 'post' } as Record<string, string>,
  /** Kolumner som måste vara null på raden (nyhetsartiklar ligger på toppnivå;
   *  recensioner och hubbar har en förälder och rörs inte). */
  nullFields: ['parent_slug'],
  /** Kolumner som får samma värde som bilden. Tom: og_image är den genererade
   *  delningsbilden och används bara när featured_image saknas. */
  imageMirrorColumns: [] as string[],
  /** Kolumner som får ett startvärde på en ny rad men aldrig skrivs över vid
   *  redigering. Skribenten behålls alltså vid redigering. */
  insertDefaults: {
    tags: [] as string[],
    parent_slug: null,
    affiliate_url: null,
    faq: null,
  } as Record<string, unknown>,

  categories: { table: 'categories', slugColumn: 'slug', nameColumn: 'name' },
  /** Skribenterna i väljaren. Nya artiklar förväljs till redaktionen. */
  authors: { table: 'authors', slugColumn: 'slug', nameColumn: 'name', default: 'redaktionen' },

  // ── Adresser ───────────────────────────────────────────────────────────
  /** Värdet i kolumnen path: inget avslutande snedstreck. */
  articlePath: (slug: string) => `/${slug}`,
  /** Publik URL med avslutande snedstreck (trailingSlash: true i next.config). */
  articleUrl: (slug: string) => `/${slug}/`,
  /** Sidor som ska byggas om efter publicering/avpublicering. */
  revalidatePaths: (
    a: { slug: string; category: string | null; author: string | null },
    previousCategory?: string | null,
    previousAuthor?: string | null,
  ) =>
    [
      `/${a.slug}/`,
      '/',
      a.category ? `/kategori/${a.category}/` : null,
      previousCategory && previousCategory !== a.category ? `/kategori/${previousCategory}/` : null,
      a.author ? `/skribenter/${a.author}/` : null,
      previousAuthor && previousAuthor !== a.author ? `/skribenter/${previousAuthor}/` : null,
      '/sitemap.xml',
    ].filter((p): p is string => !!p),
  /** Slugs som krockar med egna routes, eller som middleware.ts 410:ar, och
   *  därför aldrig får bli en artikel. */
  reservedSlugs: [
    'admin', 'api', 'ai-verktyg', 'avregistrera', 'kategori', 'skribenter', 'utkast', 'veckobrev',
    'fonts', 'llms.txt', 'robots.txt', 'sitemap.xml', 'author', 'category', 'feed', 'page', 'hello-world',
    // DEAD_TOOL_SLUGS i middleware.ts
    'accountingai', 'accountingai-pro', 'reconcile-ai', 'height', 'klara-ai', 'pattern89', 'replica-studios',
  ],
  /** Mönster ur middleware.ts GONE-listan som skulle ge 410 på artikeln. */
  reservedSlugPatterns: [/^wp-/, /^\d+$/],

  // ── Bilder ─────────────────────────────────────────────────────────────
  bucket: 'featured-images',
  /** Nyckeln blir `<år>/<månad>/<slug>-hero[-<tid>].webp`. */
  imageKey: (slug: string, unique: boolean) => {
    const d = new Date();
    const ym = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    return `${ym}/${slug}-hero${unique ? `-${Date.now().toString(36)}` : ''}.webp`;
  },
  imageWidth: 1200,
  imageQuality: 85,
  /** Server actions tar högst 4 MB (next.config.mjs); webbläsaren skalar ner
   *  större filer före uppladdning, se ArticleForm. */
  imageMaxBytes: 4 * 1024 * 1024,
  imageFormats: new Set(['jpeg', 'png', 'webp']),

  // ── Validering ─────────────────────────────────────────────────────────
  seoTitleMax: SEO_TITLE_MAX,
  seoDescriptionMax: SEO_DESCRIPTION_MAX,
  /** Kör sajtens innehållsregler. Returnerar fynd med en kod; koderna i
   *  `hardStops` stoppar publiceringen, resten visas som varningar. */
  validate: (a: {
    slug: string; title: string; excerpt: string; category: string; body: string;
    seoTitle: string; seoDescription: string; publishedAt: string;
  }, categories: ReadonlySet<string>, unknownReviews: readonly string[] = []) =>
    checkArticle(
      {
        slug: a.slug, title: a.title, excerpt: a.excerpt, category: a.category,
        content_mdx: a.body, seo_title: a.seoTitle, seo_description: a.seoDescription,
        published_at: a.publishedAt,
      },
      // En minuts marginal för klockskillnad mellan webbläsare och server.
      { categories, now: Date.now() + 60_000, unknownReviews },
    ),
  hardStops: new Set<RuleCode>(['category', 'date-invalid', 'date-future', 'seo-title-length', 'seo-description-length', 'block', 'review-unknown']),
  /** Obligatoriska fält (utöver hardStops). Tomma fält i övrigt blir varningar. */
  requiredFields: ['slug', 'title', 'content_mdx', 'category', 'published_at'],
};

export type AdminConfig = typeof adminConfig;
