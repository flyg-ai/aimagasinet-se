import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

loadEnv({ path: '.env.local' });

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
const claude = new Anthropic();

async function main() {
  console.log('Generating /ai-verktyg/foretag/yrke/fotograf-video/bildgenerering with unique slug…');
  const res = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    system: [{
      type: 'text',
      text: 'Du är senior redaktör på AI-Magasinet. Skriv polerad hubsida för svensk publik. Ren HTML utan H1, inga floskler, inga emojis, inga inline styles.',
    }],
    messages: [{
      role: 'user',
      content:
        'Skriv hub-guide (~1000 ord) om AI-bildgenerering för fotografer och videoskapare. ' +
        'Topplistan: Adobe Firefly (Generative Fill i Photoshop), Runway Gen-3 (foto-till-video, cinemagraphs), Pika Labs (snabb AI-video). ' +
        'Fokus på fotograf-vinkel — foto-utvidgning, bakgrundsbyte, animera stillbilder, kommersiell licens. ' +
        'Länka till verktygsrecensionerna under /ai-verktyg/foretag/yrke/fotograf-video/bildgenerering/ och /ai-verktyg/foretag/yrke/fotograf-video. ' +
        'Skriv guiden nu. Ren HTML, börja med första <p>-taggen.',
    }],
  });

  const html = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  ${words} ord`);

  const { error } = await db.from('articles').upsert({
    slug: 'foto-bildgenerering',
    title: 'AI för Foto- och Videogenerering — Topplista 2026',
    excerpt: 'Adobe Firefly, Runway Gen-3 och Pika Labs — AI som genererar och animerar fotografier och videor.',
    content_mdx: html,
    type: 'page',
    path: '/ai-verktyg/foretag/yrke/fotograf-video/bildgenerering',
    parent_slug: 'fotograf-video',
    affiliate_url: null,
    published_at: new Date().toISOString(),
    tags: [],
    category: null,
    featured_image: null,
  }, { onConflict: 'path' });

  if (error) {
    console.error('upsert failed:', error.message);
    process.exit(1);
  }
  console.log('  ✓ inserted');
}

main().catch((e) => { console.error(e); process.exit(1); });
