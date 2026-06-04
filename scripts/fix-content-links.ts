/**
 * Skriver om gamla nästlade interna länkar i articles.content_mdx till de
 * flata kanoniska paths efter review-utplattningen.
 *
 *   DRY=1 npx tsx scripts/fix-content-links.ts   # förhandsvisa antal
 *   npx tsx scripts/fix-content-links.ts          # applicera
 *
 * Stale→flat-mappningen byggs från redirect-filerna (flatten + dedup +
 * designer/fotograf), med transitiv kedje-upplösning så vi landar på det
 * slutliga målet i ETT hopp. Ersätter path-delen i href (relativa, med/utan
 * trailing slash, och absoluta https://aimagasinet.se/...-länkar) genom en
 * ordgräns-lookahead (?=["/]) så inga prefix-kollisioner sker.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const DRY = !!process.env.DRY;

async function loadPairs(file: string, name: string): Promise<[string, string][]> {
  try {
    const m: any = await import(pathToFileURL(resolve(file)).href);
    return (m[name] ?? []).map((r: any) => [r.source, r.destination] as [string, string]);
  } catch { return []; }
}

function escapeRe(s: string): string { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

async function main() {
  const pairs: [string, string][] = [
    ...await loadPairs('redirects.flatten.generated.mjs', 'flattenRedirects'),
    ...await loadPairs('redirects.dedup.generated.mjs', 'dedupRedirects'),
    ...await loadPairs('redirects-designer-fotograf.mjs', 'designerFotografRedirects'),
  ];
  const map = new Map<string, string>(pairs);
  const resolveFinal = (p: string): string => {
    let cur = p;
    for (let i = 0; i < 10; i++) { const n = map.get(cur); if (!n || n === cur) break; cur = n; }
    return cur;
  };
  // Längsta källa först → inga prefix-problem.
  const sources = Array.from(new Set(pairs.map(([s]) => s))).sort((a, b) => b.length - a.length);
  const replacers = sources.map((s) => ({
    re: new RegExp(escapeRe(s) + '(?=["/])', 'g'),
    to: resolveFinal(s),
    src: s,
  })).filter((r) => r.to !== r.src);

  const arts: { id: number; path: string; content_mdx: string | null }[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await db.from('articles').select('id,path,content_mdx').order('path').range(from, from + 999);
    if (error) { console.error(error.message); process.exit(1); }
    arts.push(...(data ?? []) as any);
    if (!data || data.length < 1000) break; from += 1000;
  }

  let changedArticles = 0, totalReplacements = 0;
  const changes: { path: string; n: number }[] = [];
  for (const a of arts) {
    let html = a.content_mdx ?? '';
    if (!html) continue;
    let n = 0;
    for (const r of replacers) {
      html = html.replace(r.re, () => { n++; return r.to; });
    }
    if (n > 0) {
      changedArticles++; totalReplacements += n;
      changes.push({ path: a.path, n });
      if (!DRY) {
        const { error } = await db.from('articles').update({ content_mdx: html }).eq('id', a.id);
        if (error) { console.error(`update failed ${a.path}: ${error.message}`); process.exit(1); }
      }
    }
  }

  console.log(`${DRY ? '[DRY] ' : ''}Artiklar som ${DRY ? 'skulle ändras' : 'ändrades'}: ${changedArticles}`);
  console.log(`${DRY ? '[DRY] ' : ''}Totalt antal länk-ersättningar: ${totalReplacements}\n`);
  changes.sort((a, b) => b.n - a.n).forEach((c) => console.log(`  ${String(c.n).padStart(3)} × ${c.path}`));
}

main().catch((e) => { console.error(e); process.exit(1); });
