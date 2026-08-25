/**
 * Godkänn och publicera en artikel som ligger som utkast.
 *
 * Längre artiklar (article_topics.target_words >= 1500) publiceras med
 * published_at = null. De bär chefredaktörens namn och ska läsas innan de går
 * ut. Utkast syns inte i flöden, sitemap eller på sin egen URL — läs dem med
 * ?key=<CRON_SECRET> på slutet.
 *
 *   # Lista allt som väntar
 *   npx tsx scripts/approve-article.ts
 *
 *   # Publicera
 *   npx tsx scripts/approve-article.ts --slug=ai-angest-varfor-sa-manga
 *
 *   # Ångra en publicering
 *   npx tsx scripts/approve-article.ts --slug=... --unpublish
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Saknar Supabase-env i .env.local');
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });
const BASE = 'https://aimagasinet.se';

function arg(n: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : undefined;
}
const has = (n: string) => process.argv.includes(`--${n}`);

type Row = {
  id: number;
  slug: string;
  title: string;
  path: string;
  author_slug: string | null;
  featured_image: string | null;
  content_mdx: string | null;
  faq: unknown;
  created_at: string;
};

const words = (h: string | null) =>
  (h ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

async function main() {
  const slug = arg('slug');
  const unpublish = has('unpublish');

  // ── Ångra ────────────────────────────────────────────────────
  if (unpublish) {
    if (!slug) {
      console.error('--unpublish kräver --slug=');
      process.exitCode = 1;
      return;
    }
    const r = await db
      .from('articles')
      .update({ published_at: null })
      .eq('slug', slug)
      .select('id,slug');
    if (r.error) {
      console.error(r.error.message);
      process.exitCode = 1;
      return;
    }
    if (!r.data?.length) {
      console.error(`Ingen artikel med slug ${slug}.`);
      process.exitCode = 1;
      return;
    }
    console.log(`Avpublicerad: ${slug} (id=${r.data[0].id}). Syns inte längre någonstans.`);
    return;
  }

  // ── Lista ────────────────────────────────────────────────────
  if (!slug) {
    const { data, error } = await db
      .from('articles')
      .select('id,slug,title,path,author_slug,featured_image,content_mdx,faq,created_at')
      .is('published_at', null)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error.message);
      process.exitCode = 1;
      return;
    }
    const rows = (data ?? []) as Row[];
    if (!rows.length) {
      console.log('Inga utkast väntar.');
      return;
    }

    console.log(`${rows.length} utkast väntar på godkännande:\n`);
    for (const a of rows) {
      const h2 = (a.content_mdx?.match(/<h2/gi) ?? []).length;
      const links = (a.content_mdx?.match(/href="\//g) ?? []).length;
      const faqs = Array.isArray(a.faq) ? a.faq.length : 0;
      console.log(`  ${a.title}`);
      console.log(
        `    ${words(a.content_mdx)} ord · ${h2} H2 · ${links} interna länkar · ${faqs} FAQ · ` +
          `${a.featured_image ? 'bild' : 'INGEN BILD'} · ${a.author_slug ?? 'ingen skribent'}`,
      );
      console.log(`    läs:  ${BASE}${a.path}/?key=<CRON_SECRET>`);
      console.log(`    kör:  npx tsx scripts/approve-article.ts --slug=${a.slug}\n`);
    }
    return;
  }

  // ── Publicera ────────────────────────────────────────────────
  const found = await db
    .from('articles')
    .select('id,slug,title,path,published_at')
    .eq('slug', slug)
    .maybeSingle();
  if (found.error) {
    console.error(found.error.message);
    process.exitCode = 1;
    return;
  }
  if (!found.data) {
    console.error(`Ingen artikel med slug ${slug}.`);
    process.exitCode = 1;
    return;
  }
  if (found.data.published_at) {
    console.log(`${slug} är redan publicerad (${found.data.published_at.slice(0, 16)}).`);
    return;
  }

  const r = await db
    .from('articles')
    .update({ published_at: new Date().toISOString() })
    .eq('slug', slug)
    .select('id,path,published_at');
  if (r.error) {
    console.error(r.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Publicerad: ${found.data.title}`);
  console.log(`  ${BASE}${r.data[0].path}/`);
  console.log(`  Syns i flödet inom fem minuter — sidorna cachas 300 s.`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
