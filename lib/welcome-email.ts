/** Welcome-email HTML for new newsletter subscribers. Pure module (no Next
 *  imports) so it can be reused both by the /api/subscribe route and by
 *  one-off scripts (scripts/test-welcome-email.ts). */

/** "Kom igång"-kort — ikon + titel + länk. Email-safe emojis as icons. */
const STARTER_CARDS: { icon: string; title: string; href: string }[] = [
  { icon: '🛠️', title: 'Bästa AI-verktyg 2026', href: 'https://aimagasinet.se/ai-verktyg/' },
  { icon: '🎵', title: 'Topp 50 AI-låtar på Spotify', href: 'https://aimagasinet.se/topp-50-ai-latar-pa-spotify-2026/' },
  { icon: '💼', title: 'AI för ditt yrke', href: 'https://aimagasinet.se/ai-verktyg/foretag/' },
];

function starterCardHtml(card: { icon: string; title: string; href: string }): string {
  return `
            <a href="${card.href}" style="display:block;text-decoration:none;margin:0 0 12px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fafafa;border:1px solid #e4e4e7;border-radius:10px;">
                <tr>
                  <td width="56" valign="middle" style="padding:14px 0 14px 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr><td align="center" valign="middle" width="40" height="40" style="background:#eef2ff;border-radius:8px;font-size:20px;line-height:40px;">${card.icon}</td></tr>
                    </table>
                  </td>
                  <td valign="middle" style="padding:14px 16px;">
                    <span style="font-size:15px;font-weight:700;color:#18181b;letter-spacing:-0.2px;">${card.title}</span>
                  </td>
                  <td width="32" valign="middle" align="right" style="padding:14px 18px 14px 0;font-size:18px;font-weight:700;color:#4f46e5;">&rarr;</td>
                </tr>
              </table>
            </a>`;
}

export function welcomeHtml(email: string): string {
  const unsubscribe = `mailto:kontakt@aimagasinet.se?subject=${encodeURIComponent(
    'Avprenumerera',
  )}&body=${encodeURIComponent(`Avregistrera ${email} fran utskick.`)}`;

  return `
<!doctype html>
<html lang="sv">
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181b;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">

        <!-- Dark header — indigo-600 background, white wordmark -->
        <tr><td style="background:#4f46e5;padding:28px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background:rgba(255,255,255,0.18);padding:6px 10px;border-radius:6px;font-weight:900;font-size:18px;color:#ffffff;letter-spacing:-0.5px;">AI</td>
              <td style="padding-left:10px;font-weight:900;font-size:18px;color:#ffffff;letter-spacing:1px;text-transform:uppercase;">MAGASINET</td>
            </tr>
          </table>
        </td></tr>

        <!-- Welcome -->
        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#18181b;letter-spacing:-0.5px;">Välkommen till AI-Magasinet! 🎉</h1>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#3f3f46;">
            Du är nu med i Sveriges mest lästa AI-community. Vi mejlar dig de
            viktigaste AI-nyheterna, nya verktyg och konkreta användningsfall —
            på svenska, utan hype.
          </p>
        </td></tr>

        <!-- Kom igång-kort -->
        <tr><td style="padding:0 32px 8px;">
          <p style="margin:0 0 14px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#4f46e5;">Kom igång</p>
${STARTER_CARDS.map(starterCardHtml).join('')}
        </td></tr>

        <tr><td style="padding:16px 32px 32px;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
            Tips: spara den här adressen i dina kontakter så hamnar våra utskick
            i inkorgen — inte i skräpposten.
          </p>
        </td></tr>

        <!-- Footer — grey background -->
        <tr><td style="padding:24px 32px;border-top:1px solid #e4e4e7;background:#f4f4f5;">
          <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:#71717a;">
            AI-Magasinet — svenskt magasin om artificiell intelligens.<br />
            <a href="mailto:kontakt@aimagasinet.se" style="color:#4f46e5;text-decoration:none;">kontakt@aimagasinet.se</a>
          </p>
          <p style="margin:0;font-size:12px;line-height:1.6;color:#a1a1aa;">
            <a href="${unsubscribe}" style="color:#71717a;text-decoration:underline;">Avprenumerera</a>
            &nbsp;·&nbsp; © 2026 AI-Magasinet
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`.trim();
}
