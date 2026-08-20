/** Welcome-email HTML for new newsletter subscribers. Pure render module
 *  (no Next imports) so it's reusable by /api/subscribe and one-off scripts.
 *  Article data is passed in — fetched via fetchLatestArticles(), which takes
 *  a Supabase client so the module never touches env directly. */
import type { SupabaseClient } from '@supabase/supabase-js';

export type WelcomeArticle = {
  title: string;
  slug: string;
  featured_image: string | null;
  category: string | null;
  path?: string | null;
};

const SITE = 'https://aimagasinet.se';

/** Latest 3 published posts for the "Senaste från magasinet" section. Returns
 *  [] on any error so the email still sends (with a fallback CTA). */
export async function fetchLatestArticles(
  db: SupabaseClient,
  limit = 3,
): Promise<WelcomeArticle[]> {
  const { data, error } = await db
    .from('articles')
    .select('title,slug,featured_image,category,path')
    .eq('type', 'post')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error || !data) {
    if (error) console.error('[welcome-email] fetchLatestArticles error:', error.message);
    return [];
  }
  return data as WelcomeArticle[];
}

function articleUrl(a: WelcomeArticle): string {
  if (a.path) return SITE + (a.path.startsWith('/') ? a.path : `/${a.path}`);
  return `${SITE}/${a.slug}/`;
}

/** Slug → badge label. Uppercase styling is applied via CSS; we just turn
 *  dashes into spaces (e.g. "ai-nyheter" → "ai nyheter" → "AI NYHETER"). */
function categoryLabel(category: string | null): string {
  if (!category) return 'Artikel';
  return category.replace(/-/g, ' ');
}

const CATEGORY_BADGE =
  'display:inline-block;background:#eef2ff;color:#4f46e5;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:3px 9px;border-radius:999px;';

/** A 150×100 thumbnail — real image when available, otherwise an indigo
 *  fallback tile with the brand mark (so the layout never breaks on null). */
function thumbHtml(a: WelcomeArticle): string {
  if (a.featured_image) {
    return `<img src="${a.featured_image}" width="150" height="100" alt="" style="display:block;width:150px;height:100px;border-radius:8px;object-fit:cover;border:1px solid #e4e4e7;" />`;
  }
  return `
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="150" style="width:150px;height:100px;background:#4f46e5;background:linear-gradient(135deg,#4338ca,#6366f1);border-radius:8px;">
                <tr><td align="center" valign="middle" height="100" style="height:100px;color:#ffffff;font-weight:900;font-size:22px;letter-spacing:1px;">AI</td></tr>
              </table>`;
}

function articleRowHtml(a: WelcomeArticle): string {
  const url = articleUrl(a);
  return `
          <tr>
            <td style="padding:18px 0;border-bottom:1px solid #ececef;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="150" valign="top" style="width:150px;padding-right:18px;">
                    <a href="${url}" style="text-decoration:none;">${thumbHtml(a)}</a>
                  </td>
                  <td valign="top">
                    <span style="${CATEGORY_BADGE}">${categoryLabel(a.category)}</span>
                    <a href="${url}" style="display:block;margin:9px 0 8px;font-size:18px !important;line-height:1.35;font-weight:800;color:#18181b;text-decoration:none;letter-spacing:-0.2px;">${a.title}</a>
                    <a href="${url}" style="font-size:14px;font-weight:700;color:#4f46e5;text-decoration:none;">Läs mer &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
}

/** Fallback when no articles could be fetched — a single CTA so the email
 *  still has a clear next step. */
function fallbackCtaHtml(): string {
  return `
          <tr><td style="padding:8px 0 4px;">
            <a href="${SITE}/ai-verktyg/" style="display:inline-block;background:#4f46e5;color:#ffffff;font-weight:700;text-decoration:none;padding:13px 22px;border-radius:8px;font-size:16px;">Utforska AI-Magasinet &rarr;</a>
          </td></tr>`;
}

/** Shared section heading — larger uppercase indigo label with an indigo
 *  left border accent. */
const SECTION_HEADING =
  'margin:0 0 14px;font-size:16px !important;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#4f46e5;border-left:4px solid #4f46e5;padding-left:12px;line-height:1.3;';

// Same Supabase Storage backgrounds the site uses on the /ai-verktyg hub.
const KATEGORI_BG =
  'https://dhsilzbxbimobgcnlilj.supabase.co/storage/v1/object/public/featured-images/kategorier';

const TOOL_CATEGORIES: { title: string; href: string; bg: string }[] = [
  { title: 'AI-text',   href: `${SITE}/ai-verktyg/ai-text-verktyg/`, bg: `${KATEGORI_BG}/ai-text-kategori.webp` },
  { title: 'AI-video',  href: `${SITE}/ai-video/`,                   bg: `${KATEGORI_BG}/ai-video-kategori.webp` },
  { title: 'AI-bilder', href: `${SITE}/ai-verktyg/ai-bild-verktyg/`, bg: `${KATEGORI_BG}/ai-bild-kategori.webp` },
  { title: 'AI-kod',    href: `${SITE}/ai-verktyg/ai-kod-verktyg/`,  bg: `${KATEGORI_BG}/ai-kod-programmering-kategori.webp` },
];

/** A single category tile: background photo + dark indigo overlay + white
 *  text. Falls back to the solid indigo bg-color when a client blocks
 *  background-image (e.g. Outlook), so the text stays readable. */
function categoryCardHtml(c: { title: string; href: string; bg: string }): string {
  return `
                  <td width="50%" valign="top" style="width:50%;padding:6px;">
                    <a href="${c.href}" style="display:block;text-decoration:none;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius:10px;overflow:hidden;background-color:#1e1b4b;background-image:url('${c.bg}');background-size:cover;background-position:center;background-repeat:no-repeat;">
                        <tr><td height="96" valign="bottom" style="height:96px;background-color:rgba(30,27,75,0.45);padding:16px;">
                          <span style="display:block;color:#ffffff;font-size:17px;font-weight:800;letter-spacing:0.2px;">${c.title}</span>
                          <span style="display:block;margin-top:3px;color:#c7d2fe;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Utforska &rarr;</span>
                        </td></tr>
                      </table>
                    </a>
                  </td>`;
}

/** "UTFORSKA AI-VERKTYG" — 2×2 category grid + a large CTA button. */
function toolSectionHtml(): string {
  const [c0, c1, c2, c3] = TOOL_CATEGORIES;
  return `
        <tr><td style="padding:32px 36px 8px;">
          <p style="${SECTION_HEADING}">Utforska AI-verktyg</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>${categoryCardHtml(c0)}${categoryCardHtml(c1)}</tr>
            <tr>${categoryCardHtml(c2)}${categoryCardHtml(c3)}</tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:18px;">
            <tr><td align="center">
              <a href="${SITE}/ai-verktyg/" style="display:inline-block;background:#4f46e5;color:#ffffff;font-weight:800;font-size:16px;text-decoration:none;padding:15px 30px;border-radius:10px;letter-spacing:0.3px;">Visa alla AI-verktyg &rarr;</a>
            </td></tr>
          </table>
        </td></tr>`;
}

/** `token` är prenumerantens unsubscribe_token (migration 0017). Saknas den
 *  faller vi tillbaka på mailto-varianten, så att gamla anrop och äldre rader
 *  utan token fortfarande får en fungerande avregistrering. */
export function welcomeHtml(
  email: string,
  articles: WelcomeArticle[] = [],
  token?: string,
): string {
  const unsubscribe = token
    ? `https://aimagasinet.se/avregistrera/?token=${encodeURIComponent(token)}`
    : `mailto:kontakt@aimagasinet.se?subject=${encodeURIComponent(
        'Avprenumerera',
      )}&body=${encodeURIComponent(`Avregistrera ${email} fran utskick.`)}`;

  const articlesBlock = articles.length
    ? articles.map(articleRowHtml).join('')
    : fallbackCtaHtml();

  return `
<!doctype html>
<html lang="sv">
<body lang="sv" style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181b;">
  <!-- Dold preheader på svenska — nudgar Gmails språkdetektor mot svenska. -->
  <div lang="sv" style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f4f5;">
    Tack för att du anmälde dig till AI-Magasinet — här är dina första lästips på svenska.
  </div>
  <table role="presentation" lang="sv" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" lang="sv" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e4e7;">

        <!-- Header — indigo gradient (indigo-700 → indigo-500), white wordmark -->
        <tr><td style="background:#4f46e5;background:linear-gradient(135deg,#4338ca 0%,#6366f1 100%);padding:32px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:rgba(255,255,255,0.18);padding:6px 11px;border-radius:6px;font-weight:900;font-size:19px;color:#ffffff;letter-spacing:-0.5px;">AI</td>
              <td style="padding-left:10px;font-weight:900;font-size:19px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">MAGASINET</td>
            </tr>
          </table>
        </td></tr>

        <!-- Welcome -->
        <tr><td style="padding:40px 36px 12px;">
          <h1 style="margin:0 0 14px;font-size:32px !important;line-height:1.25 !important;color:#18181b;letter-spacing:-0.5px;">Välkommen till AI-Magasinet! 🎉</h1>
          <p style="margin:0;font-size:18px !important;line-height:1.8 !important;color:#3f3f46;">
            Tack för att du hänger med. Vi sammanfattar det viktigaste som hänt
            inom AI — nyheter, nya verktyg och konkreta användningsfall, på
            svenska och utan hype.
          </p>
        </td></tr>

        <!-- Senaste artiklar -->
        <tr><td style="padding:32px 36px 8px;">
          <p style="${SECTION_HEADING}">Senaste från magasinet</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
${articlesBlock}
          </table>
        </td></tr>

        <!-- Utforska AI-verktyg -->
${toolSectionHtml()}

        <tr><td style="padding:28px 36px 36px;">
          <p style="margin:0;font-size:18px !important;line-height:1.8 !important;color:#71717a;">
            Tips: spara den här adressen i dina kontakter så hamnar våra utskick
            i inkorgen — inte i skräpposten.
          </p>
        </td></tr>

        <!-- Footer — grey background, unsubscribe -->
        <tr><td style="padding:28px 36px;border-top:1px solid #e4e4e7;background:#f4f4f5;">
          <p style="margin:0 0 16px;font-size:12px;line-height:1.6;color:#71717a;">
            AI-Magasinet — svenskt magasin om artificiell intelligens.<br />
            <a href="mailto:kontakt@aimagasinet.se" style="color:#4f46e5;text-decoration:none;">kontakt@aimagasinet.se</a>
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td>
              <a href="${unsubscribe}" style="display:inline-block;border:1px solid #d4d4d8;color:#52525b;font-size:12px;font-weight:700;text-decoration:none;padding:9px 16px;border-radius:8px;">Avprenumerera</a>
            </td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:11px;color:#a1a1aa;">© 2026 AI-Magasinet</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`.trim();
}
