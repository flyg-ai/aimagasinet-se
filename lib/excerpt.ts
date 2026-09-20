/**
 * Ingress till kort, flöden och sökresultat.
 *
 * Tidigare klipptes artikelns första stycke rakt av vid 220 tecken, vilket gav
 * ingresser som slutade mitt i en mening ("… i situationer de aldrig varit i —").
 * Nu avslutas texten alltid vid en meningsgräns. Räcker inte en hel mening till
 * klipper vi vid ett ordslut och sätter ut tre punkter.
 */

const MAX = 220;
/** Under den här längden känns en ensam mening för stubbig som ingress. */
const MIN = 70;

/** Rensar HTML och komprimerar blanktecken. */
function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Skräptecken som inte ska bli sista tecknet i en ingress. */
const TRAILING = /[\s,;:–—-]+$/;

export function excerptFromText(text: string, max = MAX): string {
  const t = plain(text);
  if (t.length <= max) return t;

  // Sista meningsslutet inom gränsen. Punkt följd av mellanslag, eller ! ? …
  const window = t.slice(0, max + 1);
  const end = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('! '),
    window.lastIndexOf('? '),
    window.lastIndexOf('… '),
  );
  if (end >= MIN) return window.slice(0, end + 1).replace(TRAILING, '');

  // Ingen hel mening fick plats — klipp vid ordslut.
  const space = window.lastIndexOf(' ');
  const cut = space > MIN ? window.slice(0, space) : window.slice(0, max);
  return `${cut.replace(TRAILING, '')}…`;
}

/** Ingress ur artikel-HTML: första stycket, avslutat vid en meningsgräns. */
export function excerptFromHtml(html: string, max = MAX): string {
  const m = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!m) return '';
  return excerptFromText(m[1], max);
}
