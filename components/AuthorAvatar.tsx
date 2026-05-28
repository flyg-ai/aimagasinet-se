import { avatarGradient } from '@/lib/authors';

/** Avatar widget — real image when avatar_url is set, gradient + initial
 *  letter otherwise. Used on the author page hero and in the
 *  article-template byline. */
export function AuthorAvatar({
  slug,
  name,
  avatarUrl,
  size = 'md',
}: {
  slug: string;
  name: string;
  avatarUrl: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim =
    size === 'sm' ? 'h-9 w-9 text-xs'
    : size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32 text-4xl sm:text-5xl'
    : 'h-12 w-12 text-base';
  const gradient = avatarGradient(slug);
  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  return avatarUrl ? (
    <span className={`relative inline-flex shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md ${dim}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={avatarUrl} alt={`${name}-porträtt`} className="h-full w-full object-cover object-center" />
    </span>
  ) : (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-black text-white shadow-md ${gradient} ${dim}`}
    >
      {initial}
    </span>
  );
}
