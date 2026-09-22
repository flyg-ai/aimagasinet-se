/** Svensk datumsträng ("16 september 2026") ur en ISO-tidsstämpel.
 *  Samma uttryck som ArticleTemplate redan använder — brutet ut hit så att
 *  recensions-, hub- och jämförelsesidornas "Uppdaterad"-etikett kan visa det
 *  FAKTISKA datumet i stället för innevarande månad vid renderingstillfället.
 *  Etiketten ska matcha `dateModified` i schemat (lib/schemas.ts). */
export function formatSvDate(iso: string): string {
  return new Date(iso).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Ärligt ändringsdatum för en artikel: content_updated_at (flyttas bara när
 *  title/content_mdx ändras, migration 0021) med updated_at som reserv så att
 *  koden fungerar innan migrationen körts. Samma värde ska synas i
 *  "Senast uppdaterad", dateModified, og modifiedTime och sitemapen. */
export function contentModifiedIso(a: {
  content_updated_at?: string | null;
  updated_at?: string | null;
}): string | null {
  return a.content_updated_at ?? a.updated_at ?? null;
}
