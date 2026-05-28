/**
 * Replace the WP-imported content_mdx of /ai-verktyg with a clean ~800-word
 * editorial overview generated via Claude Sonnet 4.6. This drops the 6
 * embedded "Robot Ai Chatgpt" placeholder images from the legacy content
 * and gives the master hub a readable redaktionell översikt instead.
 *
 *   npx tsx scripts/rewrite-ai-verktyg-overview.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `Du är senior redaktör på AI-Magasinet. Skriv en redaktionell översikt för master-hubsidan /ai-verktyg.

# Tonalitet
Expert, rak, praktisk svenska. Inga floskler ("revolutionerande", "i en värld där..."). Inga emojis. Konkreta exempel framför generiska påståenden.

# Struktur (~800 ord)
- En kort intro (1-2 stycken) som etablerar vad AI-verktygslandskapet ser ut som 2026 och hur man tänker när man väljer verktyg.
- 4-5 H2-rubriker som täcker:
  * Så väljer du rätt AI-verktyg
  * Skillnaden mellan generella vs specialiserade verktyg
  * Gratis vs betalt — när är det värt att betala?
  * Hur snabbt åldras AI-verktygslandskapet?
  * (valfri) Vanliga misstag när man börjar
- Avsluta med en pragmatisk sammanfattning av vad läsaren ska göra härnäst

# Länkning
Länka naturligt till dessa sidor (HTML <a href>):
- /ai-verktyg/ai-text-verktyg — AI-Text
- /ai-verktyg/ai-bild-verktyg — AI-Bild
- /ai-verktyg/ai-kod-verktyg — AI-Kod
- /ai-video — AI-Video
- /ai-verktyg/ai-ljud-och-musik — AI-Ljud & Musik
- /ai-verktyg/ai-automation — AI-Automation
- /ai-verktyg/foretag — AI för företag
- /ai-verktyg/gratis — Gratis AI-verktyg
- /ai-guiden — AI-Guiden
Använd 4-6 av dem, naturligt insvävda i prosan.

# Output
Ren HTML — börja med första <p>-taggen, sluta med en </p> eller </ul>. Ingen H1 (templaten har redan). Inga kodblock, ingen \`\`\`html-wrapping.

Använd:
- <h2>, <h3> för rubriker
- <p> för stycken
- <ul>/<ol> + <li> för listor
- <a href="..."> för länkar
- <strong> sparsamt`;

async function main() {
  const slug = 'ai-verktyg';
  const path = '/ai-verktyg';
  console.log(`Generating ${path} overview via ${MODEL}…`);

  const response = await claude.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: 'Skriv redaktionell översikt (~800 ord) nu. Ren HTML, börja med första <p>-taggen.',
    }],
  });

  const html = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  ${words} words, ${html.length} bytes.`);
  console.log(`  usage: input=${response.usage.input_tokens}  cache_read=${response.usage.cache_read_input_tokens ?? 0}  output=${response.usage.output_tokens}`);

  const { data, error } = await db
    .from('articles')
    .update({ content_mdx: html })
    .eq('path', path)
    .select('id,slug,path');
  if (error) { console.error('update failed:', error.message); process.exit(1); }
  console.log(`OK → ${data?.[0]?.path} (id=${data?.[0]?.id}) updated.`);
  void slug;
}

main().catch((e) => { console.error(e); process.exit(1); });
