/**
 * Tar bort nedlagda verktyg (Windsurf, Codeium, Relay.app, Play.ht, Sora 2)
 * helt ur topplistorna — inte bara dölj betyget (se lib/review-score.ts +
 * ReviewTemplate/HubTemplate-fixarna 2026-11-15), utan avpublicera dem så
 * de aldrig syns i en live topplista över huvud taget.
 *
 * Interna länkar till dem i andra artiklars content_mdx avlänkas (texten
 * finns kvar, men pekar inte längre på en 410-sida) eftersom det inte finns
 * någon given ersättare att peka om till, till skillnad från bredig-mergen.
 *
 * Direkta träffar på deras gamla URL:er 410:as via DEAD_TOOL_SLUGS i
 * middleware.ts (uppdaterat separat).
 *
 *   npx tsx scripts/unpublish-discontinued-tools.ts
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const DISCONTINUED_SLUGS = ['windsurf', 'codeium', 'relay-app', 'play-ht', 'sora-2'];

function delink(mdx: string, slug: string): string {
  const re = new RegExp(`<a\\s+href="[^"]*/ai-verktyg/(?:ai-video/)?${slug}/?"[^>]*>([^<]*)</a>`, 'g');
  return mdx.replace(re, '$1');
}

async function main() {
  const { data: linking, error: linkErr } = await db
    .from('articles')
    .select('slug,content_mdx')
    .not('content_mdx', 'is', null);
  if (linkErr) { console.error(linkErr); return; }

  for (const row of linking ?? []) {
    if (DISCONTINUED_SLUGS.includes(row.slug)) continue;
    let updated = row.content_mdx!;
    let changed = false;
    for (const slug of DISCONTINUED_SLUGS) {
      const next = delink(updated, slug);
      if (next !== updated) changed = true;
      updated = next;
    }
    if (changed) {
      const { error } = await db.from('articles').update({ content_mdx: updated }).eq('slug', row.slug);
      if (error) console.error(`Avlänkning misslyckades ${row.slug}:`, error);
      else console.log(`Avlänkat i ${row.slug}`);
    }
  }

  for (const slug of DISCONTINUED_SLUGS) {
    const { error } = await db.from('articles').update({ published_at: null }).eq('slug', slug);
    if (error) console.error(`Avpublicering misslyckades ${slug}:`, error);
    else console.log(`Avpublicerad: ${slug}`);
  }

  const parents = ['ai-kod-verktyg', 'ai-automation', 'rost-och-tal', 'ai-video'];
  for (const parent of parents) {
    const { data, error } = await db
      .from('articles')
      .select('slug')
      .eq('parent_slug', parent)
      .not('published_at', 'is', null);
    if (error) { console.error(error); continue; }
    console.log(`${parent}: ${data.length} publicerade verktyg kvar`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
