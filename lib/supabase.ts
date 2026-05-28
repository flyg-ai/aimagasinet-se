import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Public client (RSC, anon read-only via RLS).
// Missing env produces a client that errors on first query — that's fine for builds.
export const supabase: SupabaseClient = createClient(
  url || 'http://placeholder.supabase.co',
  anonKey || 'placeholder',
  { auth: { persistSession: false } },
);

// Admin client — service role, server-only. Used by import script.
export function supabaseAdmin(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return createClient(url, key, { auth: { persistSession: false } });
}

export type Article = {
  id: number;
  slug: string;
  title: string;
  content_mdx: string | null;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  featured_image: string | null;
  type: 'post' | 'page';
  path: string;            // canonical URL path, e.g. "/ai-verktyg/ai-text-verktyg/chatgpt"
  parent_slug: string | null;
  affiliate_url: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  /** FK to authors.slug — populated after migration 0008_authors.sql.
   *  Optional in TypeScript so pre-migration fetches still type-check. */
  author_slug?: string | null;
};

export type Category = {
  slug: string;
  name: string;
  description: string | null;
};
