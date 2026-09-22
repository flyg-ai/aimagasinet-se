/**
 * Recensionens betyg — en enda källa. ReviewTemplate visar det här värdet i
 * hjälten och i "Andra att överväga", och topplistblocket och "Verktyg i
 * guiden" (components/ContentBlocks.tsx, ArticleTemplate) läser samma funktion,
 * så en lista kan aldrig visa ett annat betyg än recensionen.
 *
 * Ordningen är densamma som recensionssidan alltid haft:
 *   1. profilens redaktionella `score` i REVIEW_KNOWN (lib/review-profiles.ts
 *      med de genererade profilerna i lib/*-tools*.ts),
 *   2. annars "X/10" eller ★ i recensionens egen text (parseRating),
 *   3. annars ett deterministiskt värde ur slugen.
 * `score: null` i profilen betyder "ännu ej betygsatt" (t.ex. sora-2): då
 * visas ingen siffra.
 *
 * En nedlagd tjänst (profilens label "Nedlagd") får ingen siffra i listorna.
 * Recensionssidan visar fortfarande sin siffra för de nedlagda som har en
 * (Windsurf, Codeium, Relay.app) men sätter "Nedlagd" som etikett; listorna
 * visar bara etiketten, så de säger aldrig emot sidan.
 *
 * Ren TypeScript; körs även från tsx-skript (scripts/print-review-scores.ts).
 */
import { parseRating, toolNameFromTitle, type Rating } from '@/lib/rating';
import { lookupKnown, resolveToolProfile, seed } from '@/lib/review-profiles';

export const DISCONTINUED_LABEL = 'Nedlagd';

/** Det minsta av en artikelrad som behövs för betyget. content_mdx behövs
 *  bara för recensioner utan redaktionellt betyg; utan den faller betyget
 *  tillbaka på seed-värdet, precis som recensionssidan gör. */
export type ReviewScoreInput = { slug: string; title: string; content_mdx?: string | null };

export type ReviewScore = {
  /** Betyget på skalan 0–10, eller null när recensionen inte har något. */
  score: number | null;
  max: 10;
  /** Betyget som text, exakt som recensionssidan skriver det ("9.1"), eller null. */
  display: string | null;
  /** Profilens etikett ("Redaktionens val", "Nedlagd" …). */
  label: string;
  /** Tjänsten är nedlagd. Listorna visar då "Nedlagd" i stället för betyg. */
  discontinued: boolean;
  /** Profilens score är uttryckligen null: "Ännu ej betygsatt". */
  unrated: boolean;
};

/** Betyget som recensionssidan räknar det, utan hänsyn till "ej betygsatt".
 *  Används också för rankningen bland syskonen. */
export function reviewRating(a: ReviewScoreInput): Rating {
  const known = lookupKnown(a.slug, toolNameFromTitle(a.title));
  if (known?.score != null) return { score: known.score, max: 10 };
  const parsed = parseRating(a.content_mdx ?? null);
  if (parsed) return parsed;
  const h = seed(a.slug);
  const score = 7.4 + ((h % 23) * 0.1);
  return { score: Math.round(score * 10) / 10, max: 10 };
}

/** Samma format som recensionens betygsbricka. */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function reviewScore(a: ReviewScoreInput): ReviewScore {
  const profile = resolveToolProfile(a.slug, toolNameFromTitle(a.title));
  const unrated = profile.score === null;
  const discontinued = profile.label === DISCONTINUED_LABEL;
  const score = unrated ? null : reviewRating(a).score;
  return {
    score,
    max: 10,
    display: score == null ? null : formatScore(score),
    label: profile.label,
    discontinued,
    unrated,
  };
}

/** Betyget så som en lista ska visa det: siffran, eller "Nedlagd", eller null
 *  (inget betyg alls). */
export function listScoreText(s: ReviewScore): string | null {
  if (s.discontinued) return DISCONTINUED_LABEL;
  return s.display;
}
