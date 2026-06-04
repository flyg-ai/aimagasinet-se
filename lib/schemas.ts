/** schema.org JSON-LD builders. Each helper returns a plain object that
 *  the <JsonLd> component dumps into a <script type="application/ld+json">.
 *  Keeping these centralized so every template renders the same shape. */

const SITE_URL = 'https://aimagasinet.se';
const SITE_NAME = 'AI-Magasinet';
const LOGO_URL = `${SITE_URL}/apple-icon.png`;

/** Convert a relative or absolute path to a full URL with trailing slash. */
export function absolute(path: string): string {
  if (!path) return `${SITE_URL}/`;
  if (path.startsWith('http')) return path;
  const withSlash = path.endsWith('/') || path === '/' ? path : `${path}/`;
  return `${SITE_URL}${withSlash.startsWith('/') ? '' : '/'}${withSlash}`;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 180,
      height: 180,
    },
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: 'kontakt@aimagasinet.se',
      areaServed: 'SE',
      availableLanguage: 'Swedish',
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: 'sv-SE',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/sok?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

type Article = {
  title: string;
  excerpt: string | null;
  path: string;
  featured_image: string | null;
  published_at: string | null;
  updated_at?: string | null;
  category?: string | null;
  /** Optional extra keywords (e.g. tags) for keywords/news_keywords. */
  keywords?: string[];
};

type AuthorRef = { slug: string; name: string; bio: string | null; avatar_url: string | null };

/** Shared Article/NewsArticle node. `type` switches @type; `speakable` adds a
 *  SpeakableSpecification for voice/AI assistants (targets the H1 + lead). */
function articleNode(
  type: 'Article' | 'NewsArticle',
  a: Article,
  author?: AuthorRef | null,
  opts?: { speakable?: boolean },
) {
  const url = absolute(a.path);
  const authorNode = author
    ? {
        '@type': 'Person',
        '@id': absolute(`/skribenter/${author.slug}`) + '#author',
        name: author.name,
        url: absolute(`/skribenter/${author.slug}`),
        ...(author.avatar_url ? { image: author.avatar_url } : {}),
        ...(author.bio ? { description: author.bio } : {}),
      }
    : { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` };
  const keywords = (a.keywords ?? []).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': type,
    headline: a.title,
    description: a.excerpt ?? undefined,
    articleBody: a.excerpt ?? undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'sv-SE',
    datePublished: a.published_at ?? undefined,
    dateModified: a.updated_at ?? a.published_at ?? undefined,
    image: a.featured_image ? [a.featured_image] : undefined,
    author: authorNode,
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    ...(a.category ? { articleSection: a.category } : {}),
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
    ...(opts?.speakable
      ? {
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', '.article-lead'],
          },
        }
      : {}),
  };
}

/** schema.org Article. */
export function articleSchema(a: Article, author?: AuthorRef | null) {
  return articleNode('Article', a, author);
}

/** schema.org NewsArticle (Google News-kompatibel) med Speakable för
 *  röst-/AI-assistenter. */
export function newsArticleSchema(a: Article, author?: AuthorRef | null) {
  return articleNode('NewsArticle', a, author, { speakable: true });
}

type Crumb = { label: string; href?: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absolute(c.href) } : {}),
    })),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

export function personSchema(a: AuthorRef) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: a.name,
    url: absolute(`/skribenter/${a.slug}`),
    ...(a.avatar_url ? { image: a.avatar_url } : {}),
    ...(a.bio ? { description: a.bio } : {}),
  };
}
