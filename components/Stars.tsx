import type { Rating } from '@/lib/rating';

const SIZES = {
  sm: { star: 'text-base', text: 'text-xs' },
  md: { star: 'text-xl', text: 'text-sm' },
  lg: { star: 'text-3xl', text: 'text-lg' },
  xl: { star: 'text-4xl sm:text-5xl', text: 'text-xl sm:text-2xl' },
} as const;

export function Stars({
  rating,
  size = 'md',
}: {
  rating: Rating;
  size?: keyof typeof SIZES;
}) {
  // 10-point → 5-star, rounded to nearest integer
  const fiveScore = (rating.score / rating.max) * 5;
  const full = Math.round(fiveScore);
  const empty = 5 - full;
  const s = SIZES[size];

  return (
    <div
      className="inline-flex items-center gap-3"
      aria-label={`Betyg: ${rating.score} av ${rating.max}`}
    >
      <span className={`${s.star} font-bold leading-none tracking-widest text-accent`}>
        {'★'.repeat(full)}
        <span className="text-line-strong">{'★'.repeat(empty)}</span>
      </span>
      <span className={`${s.text} font-mono font-bold text-fg`}>
        {rating.score}
        <span className="text-fg-subtle">/{rating.max}</span>
      </span>
    </div>
  );
}
