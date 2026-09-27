/** Ord som inte ska stå sist när en lång slug klipps. */
const DANGLING = new Set(['och', 'eller', 'for', 'i', 'pa', 'av', 'att', 'om', 'med', 'en', 'ett', 'till', 'mot', 'fran', 'som', 'ar', 'vill', 'har', 'inte', 'den', 'det', 'de']);

/** Slug av en rubrik, högst `max` tecken. Klipps vid ordgräns, aldrig mitt i ett
 *  ord, och slutar inte på ett bindeord. Ren TypeScript utan importer så att
 *  både cron-rutten och tsx-skripten kan använda den. */
export function slugify(s: string, max = 70): string {
  const full = s
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (full.length <= max) return full;

  let out = full[max] === '-' ? full.slice(0, max) : full.slice(0, max);
  if (full[max] !== '-') {
    const cut = out.lastIndexOf('-');
    if (cut >= 30) out = out.slice(0, cut);
  }
  const words = out.replace(/-+$/g, '').split('-');
  while (words.length > 3 && DANGLING.has(words[words.length - 1])) words.pop();
  return words.join('-');
}
