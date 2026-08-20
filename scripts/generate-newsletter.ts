/**
 * Generera ett veckobrev som UTKAST. Skickar ingenting.
 *
 *   # Utkast för innevarande vecka — visas bara, sparas inte
 *   npx tsx scripts/generate-newsletter.ts
 *
 *   # Spara till databasen som draft
 *   npx tsx scripts/generate-newsletter.ts --save
 *
 *   # En annan vecka, eller skriv över ett befintligt utkast
 *   npx tsx scripts/generate-newsletter.ts --week=2026-v33 --save --force
 *
 * Två anrop: ett researchsteg med websökning över senaste sju dygnen, och ett
 * som strukturerar resultatet mot ett fast schema. Uppdelningen gör att den
 * strukturerade utdatan inte behöver samsas med server-tool-loopen.
 *
 * Innehållet sparas strukturerat, inte som HTML — se lib/newsletter.ts.
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { isoWeek, newsletterWordCount, type NewsletterContent } from '../lib/newsletter';

loadEnv({ path: '.env.local' });

const MODEL = 'claude-opus-5';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';
const claude = new Anthropic();

function wf<T extends object>(p: T): T {
  return { ...p, fallbacks: 'default' } as T;
}
function arg(n: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : undefined;
}
const has = (n: string) => process.argv.includes(`--${n}`);

const RESEARCH_PROMPT = `Du är nyhetsredaktör på AI-Magasinet, ett svenskt magasin om artificiell intelligens. Läsarna är nyfikna privatpersoner, företagare och yrkesverksamma — inte forskare.

Sök på webben och kartlägg vad som faktiskt hänt inom AI de senaste sju dygnen.

Leta efter:
1. Den enskilt största händelsen — det folk kommer prata om.
2. Fyra kortare nyheter med verklig substans.
3. Något som rör Sverige eller EU direkt, eller ett internationellt beslut med konkret svensk påverkan.
4. Ett verktyg eller en funktion en vanlig läsare kan testa själv på fem minuter.

Undvik produktlanseringar utan nyhetsvärde, rykten utan källa, och renodlade finansnyheter om värderingar.

Leta upp PRIMÄRKÄLLAN för varje nyhet — bolagets eget blogginlägg, myndighetens beslut, forskargruppens rapport. En nyhetssammanställning eller en blogg som refererar någon annan duger bara om primärkällan inte går att hitta.

Redovisa varje kandidat med vad som hänt, varför det spelar roll, och den fullständiga URL:en till källan. Skriv ut URL:erna i klartext, och ange om det är en primärkälla eller ett andrahandsreferat.`;

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['subject', 'headline', 'lead', 'items', 'swedishAngle', 'tryThis'],
  properties: {
    subject: { type: 'string' },
    headline: { type: 'string' },
    lead: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'body', 'sourceName', 'sourceUrl'],
        properties: {
          title: { type: 'string' },
          body: { type: 'string' },
          sourceName: { type: 'string' },
          sourceUrl: { type: 'string' },
        },
      },
    },
    swedishAngle: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'body'],
      properties: { title: { type: 'string' }, body: { type: 'string' } },
    },
    tryThis: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'body'],
      properties: { title: { type: 'string' }, body: { type: 'string' } },
    },
  },
};

function textOf(m: Anthropic.Beta.BetaMessage): string {
  if (m.stop_reason === 'refusal') throw new Error('modellen nekade förfrågan');
  return m.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

async function main() {
  const week = arg('week') ?? isoWeek();
  const save = has('save');
  const today = new Date().toISOString().slice(0, 10);

  console.log(`Vecka ${week} · ${save ? 'sparas som utkast' : 'TORRKÖRNING (--save för att spara)'}\n`);

  // Steg 1 — research med websökning.
  console.log('Söker igenom veckan…');
  let research = await claude.beta.messages.create(
    wf({
      model: MODEL,
      max_tokens: 8000,
      betas: [FALLBACK_BETA],
      tools: [{ type: 'web_search_20260209' as const, name: 'web_search' as const, max_uses: 16 }],
      system: [{ type: 'text' as const, text: RESEARCH_PROMPT }],
      messages: [
        {
          role: 'user' as const,
          content: `Dagens datum är ${today}. Kartlägg AI-veckan som gått, alltså de senaste sju dygnen.`,
        },
      ],
    }),
  );
  // Server-tool-loopen pausar efter tio iterationer; återuppta vid behov.
  const msgs: Anthropic.Beta.BetaMessageParam[] = [
    { role: 'user', content: `Dagens datum är ${today}. Kartlägg AI-veckan som gått, alltså de senaste sju dygnen.` },
  ];
  for (let i = 0; i < 2 && research.stop_reason === 'pause_turn'; i++) {
    msgs.push({ role: 'assistant', content: research.content as unknown as Anthropic.Beta.BetaContentBlockParam[] });
    research = await claude.beta.messages.create(
      wf({
        model: MODEL,
        max_tokens: 8000,
        betas: [FALLBACK_BETA],
        tools: [{ type: 'web_search_20260209' as const, name: 'web_search' as const, max_uses: 16 }],
        system: [{ type: 'text' as const, text: RESEARCH_PROMPT }],
        messages: msgs,
      }),
    );
  }
  const briefing = textOf(research);
  console.log(`  briefing: ${briefing.length} tecken\n`);

  // Steg 2 — strukturera.
  console.log('Skriver numret…');
  const drafted = await claude.beta.messages.create(
    wf({
      model: MODEL,
      max_tokens: 6000,
      betas: [FALLBACK_BETA],
      output_config: { format: { type: 'json_schema' as const, schema: SCHEMA } },
      messages: [
        {
          role: 'user' as const,
          content:
            'Här är en researchsammanställning över AI-veckan. Skriv veckobrevet för AI-Magasinet.\n\n' +
            'Ton: rak, konkret och engagerande, som en kunnig kollega. Skriv för nyfikna människor, ' +
            'inte forskare. Svenska hela vägen. Inga floskler, inga emojis, inget "i takt med att".\n\n' +
            'subject: ämnesrad, max 60 tecken, konkret snarare än lockande.\n' +
            'headline + lead: veckans enskilt viktigaste händelse, tre meningar.\n' +
            'items: exakt fyra notiser, två–tre meningar var. Varje notis ska ha SIN EGEN källa — ' +
            'två notiser får aldrig peka på samma URL. Föredra primärkällor.\n' +
            'swedishAngle: EN enda sak som veckan betyder i Sverige. Max 120 ord.\n' +
            'tryThis: ETT enda förslag läsaren kan testa på fem minuter. Max 120 ord. Beskriv exakt vad man gör.\n\n' +
            'Regler som gäller undantagslöst:\n' +
            '- Lova ALDRIG något om kommande nummer eller om vad redaktionen ska göra. Du får inte ' +
            'utlova intervjuer, uppföljningar, att någon ska kontaktas eller att svar kommer senare. ' +
            'Skriv bara om det som redan hänt.\n' +
            '- Välj inte en händelse du inte kunnat bekräfta som huvudnyhet. Är det bästa du har ' +
            'osäkert, ta något mindre men säkert som headline och lägg det osäkra som notis med ' +
            'tydlig reservation.\n' +
            '- Använd bara URL:er som står i sammanställningen. Hitta inte på källor.\n' +
            '- Ta bara med händelser från de senaste sju dygnen. Är något äldre hör det inte ' +
            'hemma i en veckosammanfattning, hur intressant det än är — välj något annat.\n' +
            '- Väg in källans tyngd. En forumtråd eller en changelog-aggregator kan användas, ' +
            'men inte för mer än en av de fyra notiserna.\n\n' +
            'Totalt 600–800 ord — fyll spannet, korta inte ner i onödan.\n\n' +
            briefing,
        },
      ],
    }),
  );

  const content = JSON.parse(textOf(drafted)) as NewsletterContent & { subject: string };
  const words = newsletterWordCount(content);

  // ── Visa numret ──────────────────────────────────────────────
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`ÄMNESRAD: ${content.subject}`);
  console.log(`${'─'.repeat(70)}\n`);
  console.log(`## ${content.headline}\n${content.lead}\n`);
  console.log('## Veckans notiser');
  (content.items ?? []).forEach((i, n) => {
    console.log(`\n${n + 1}. ${i.title}\n   ${i.body}\n   källa: ${i.sourceName} — ${i.sourceUrl}`);
  });
  console.log(`\n## ${content.swedishAngle.title}\n${content.swedishAngle.body}`);
  console.log(`\n## ${content.tryThis.title}\n${content.tryThis.body}`);
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`${words} ord · ${content.items?.length ?? 0} notiser`);
  if (words > 900) console.log('VARNING: längre än löftet om fem minuters läsning.');
  if ((content.items?.length ?? 0) !== 4) console.log('VARNING: fel antal notiser.');

  if (!save) {
    console.log('\nInget sparat. Kör om med --save när numret ser bra ut.');
    return;
  }

  // ── Spara som utkast ─────────────────────────────────────────
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

  const existing = await db.from('newsletters').select('id,status').eq('week', week).maybeSingle();
  if (existing.error && !/newsletters/.test(existing.error.message)) {
    console.error(`\nDatabasfel: ${existing.error.message}`);
    process.exitCode = 1;
    return;
  }
  if (existing.error) {
    console.error('\nTabellen newsletters saknas — kör supabase/migrations/0018_newsletters.sql först.');
    process.exitCode = 1;
    return;
  }
  if (existing.data && !has('force')) {
    console.error(`\nVecka ${week} finns redan (status=${existing.data.status}). Kör med --force för att skriva över.`);
    process.exitCode = 1;
    return;
  }
  if (existing.data && existing.data.status !== 'draft') {
    console.error(`\nVägrar skriva över vecka ${week}: status är ${existing.data.status}, inte draft.`);
    process.exitCode = 1;
    return;
  }

  const { subject, ...rest } = content;
  const up = await db
    .from('newsletters')
    .upsert({ week, subject, content: rest, status: 'draft' }, { onConflict: 'week' })
    .select('id,week,status');
  if (up.error) {
    console.error(`\nKunde inte spara: ${up.error.message}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nSparat som utkast: id=${up.data[0].id}, vecka ${up.data[0].week}, status=${up.data[0].status}`);
  console.log(`Läs det på /veckobrev/${week}/?key=<CRON_SECRET>`);
  console.log('Inget har skickats till någon.');
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
