/**
 * Regenerera content_mdx för de 6 rekryterings-recensioner som fick
 * deterministisk fallback (credit-stopp): beamery, hirevue, seekout, lever-ai,
 * pymetrics, fetcher. Sonnet-mergar 3 varianter → 1 med H3 per användningsområde.
 *
 *   npx tsx scripts/regen-rekrytering-fallbacks.ts
 *
 * UPDATE av content_mdx på /ai-verktyg/rekrytering/{slug} — ingen path/slug ändras.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { YRKE_TOOLS, toContentMdx } from '../lib/yrke-tools';

loadEnv({ path: '.env.local' });
const claude = new Anthropic();
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const MODEL = 'claude-sonnet-4-6';

const SLUGS = ['beamery', 'hirevue', 'seekout', 'lever-ai', 'pymetrics', 'fetcher'];
const PARENTS = ['cv-screening', 'jobbannonser', 'kandidatmatchning'];
const LABELS: Record<string, string> = { 'cv-screening': 'CV-screening', jobbannonser: 'Jobbannonser', kandidatmatchning: 'Kandidatmatchning' };
function slugify(s: string): string { return s.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/\.ai\b/g, '-ai').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function stripFence(s: string): string { return s.replace(/^```(?:json|html)?\s*/i, '').replace(/```\s*$/i, '').trim(); }
function uniq<T>(a: T[]): T[] { return Array.from(new Set(a)); }

async function main() {
  for (const slug of SLUGS) {
    const variants = YRKE_TOOLS.filter((t) => PARENTS.includes(t.parent) && slugify(t.brand) === slug);
    if (variants.length < 2) { console.warn(`⚠ ${slug}: ${variants.length} varianter, hoppar`); continue; }
    const top = [...variants].sort((a, b) => b.score - a.score)[0];
    const merged = {
      ...top, score: Math.round((variants.reduce((s, v) => s + v.score, 0) / variants.length) * 10) / 10,
      pros: uniq(variants.flatMap((v) => v.pros)).slice(0, 4), cons: uniq(variants.flatMap((v) => v.cons)).slice(0, 3),
    };
    const areas = variants.map((v) => `### ${LABELS[v.parent]}\n${toContentMdx(v)}`).join('\n\n---\n\n');
    const prompt = `Slå ihop ${variants.length} recensioner av "${merged.brand}" (olika rekryterings-användningsområden) till EN kanonisk recension ~1000 ord (svenska). Betyg ${merged.score.toFixed(1)}/10, pris ${merged.pricing}. Styrkor: ${merged.pros.join(', ')}. Svagheter: ${merged.cons.join(', ')}. Områden + källtexter:\n\n${areas}\n\nKrav: REN HTML (<h2>,<h3>,<p>,<ul>/<li>), ingen <h1>, ingen markdown/\`\`\`. Struktur: <h2>Vår analys av ${merged.brand}</h2>, <h2>Funktioner som spelar roll</h2>, <h2>Användningsområden inom rekrytering</h2> med <h3> per område (${variants.map((v) => LABELS[v.parent]).join(', ')}), <h2>Styrkor</h2>, <h2>Svagheter</h2>, <h2>Prismodell</h2>, <h2>Vem passar ${merged.brand} för?</h2>, <h2>Slutsats</h2>. Skriv INTE betygsraden.`;
    const msg = await claude.messages.create({ model: MODEL, max_tokens: 3000, messages: [{ role: 'user', content: prompt }] });
    const m = stripFence(msg.content.filter((b): b is Anthropic.TextBlock => b.type === 'text').map((b) => b.text).join('').trim());
    if (m.replace(/<[^>]+>/g, '').length < 500) { console.warn(`⚠ ${slug}: för kort, hoppar`); continue; }
    const body = `<p><strong>Betyg: ${merged.score.toFixed(1)}/10</strong></p>\n${m}`;
    const { data, error } = await db.from('articles').update({ content_mdx: body }).eq('path', `/ai-verktyg/rekrytering/${slug}`).select('id');
    if (error) { console.error(`${slug} update failed:`, error.message); process.exit(1); }
    console.log(`${slug}: uppdaterad (${(body.length / 1000).toFixed(1)}k, ${data?.length ?? 0} rad)`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
