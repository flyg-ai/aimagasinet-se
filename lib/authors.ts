import { supabase } from './supabase';

export type Author = {
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
};

/** Fetch every author row and return a slug→Author map. Gracefully
 *  returns an empty Map if the authors table doesn't exist yet — that
 *  way the rest of the site keeps rendering even when migration 0008
 *  hasn't been applied. */
export async function fetchAuthorsMap(): Promise<Map<string, Author>> {
  const { data, error } = await supabase
    .from('authors')
    .select('slug,name,role,bio,avatar_url,twitter_url,linkedin_url');
  if (error) {
    // Most likely: relation "public.authors" does not exist (pre-migration).
    return new Map();
  }
  return new Map((data ?? []).map((a) => [a.slug, a as Author]));
}

/** Fetch one author by slug. Returns null if table doesn't exist or no row. */
export async function fetchAuthor(slug: string): Promise<Author | null> {
  const { data, error } = await supabase
    .from('authors')
    .select('slug,name,role,bio,avatar_url,twitter_url,linkedin_url')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as Author;
}

/** Tailwind gradient palette used as fallback avatar background when
 *  avatar_url is null. Stable per-slug hash so each author keeps the
 *  same color across renders. */
const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-700',
  'from-cyan-500 to-sky-700',
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-rose-600',
  'from-fuchsia-500 to-rose-700',
  'from-rose-500 to-pink-700',
];

export function avatarGradient(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = ((h * 31 + slug.charCodeAt(i)) >>> 0);
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}
