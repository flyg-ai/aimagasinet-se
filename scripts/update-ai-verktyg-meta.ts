// One-off: update SEO metadata on the /ai-verktyg master hub row.
//   - seo_title       → shorter, non-cannibalising (no "Jämför"), fits <title>+suffix ≤60
//   - title (H1)      → clean "Bästa AI-verktygen 2026"
//   - seo_description → ≤155, unique to the hub
// Everything else (excerpt, image, etc.) left untouched. Idempotent.
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });

const NEW = {
  title: 'Bästa AI-verktygen 2026',
  seo_title: 'Bästa AI-verktygen 2026 – Text, bild & kod',
  seo_description:
    'Utforska de bästa AI-verktygen 2026 för text, bild, video, ljud, kod och företag – både gratis och betalda, samlade och jämförbara på ett ställe.',
};

const len = (s: string | null | undefined) => (s == null ? 0 : Array.from(s).length);

async function main() {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const before = await db
    .from('articles')
    .select('id,title,seo_title,seo_description')
    .eq('path', '/ai-verktyg')
    .maybeSingle();
  if (before.error) throw before.error;
  if (!before.data) throw new Error('NO ROW for /ai-verktyg');
  console.log('BEFORE:', JSON.stringify(before.data, null, 2));

  const { data, error } = await db
    .from('articles')
    .update(NEW)
    .eq('path', '/ai-verktyg')
    .select('id,title,seo_title,seo_description')
    .maybeSingle();
  if (error) throw error;

  console.log('AFTER :', JSON.stringify(data, null, 2));
  const suffix = ' | AI-Magasinet';
  console.log('rendered <title> :', (data!.seo_title ?? data!.title) + suffix,
    '->', len((data!.seo_title ?? data!.title) + suffix), 'tecken');
  console.log('seo_description  :', len(data!.seo_description), 'tecken');
}

main().catch((e) => { console.error(e); process.exit(1); });
