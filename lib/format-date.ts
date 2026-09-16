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
