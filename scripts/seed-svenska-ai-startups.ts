/**
 * Skapar artikeln /svenska-ai-startups-2026 med granskande, journalistiskt
 * content_mdx (~2500 ord) via Claude Sonnet 4.6. Kopierar featured_image från
 * /svenska-ai-foretag-2026. Idempotent (upsert på path).
 *
 *   npx tsx scripts/seed-svenska-ai-startups.ts
 */
import { config as loadEnv } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const claude = new Anthropic();
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const MODEL = 'claude-sonnet-4-6';

const SYSTEM = `Du är näringslivsreporter på AI-Magasinet med ansvar för granskande bevakning av den svenska AI-sektorn. Du skriver journalistik, inte marknadsföring.

# Tonalitet
Granskande, faktabaserad och kritiskt prövande svenska. Du hyllar inte bolag — du bedömer dem. Lyft fram både styrkor och svagheter, uppköp och utländskt ägande, hype kontra substans. Inga floskler, inga superlativ utan täckning, inga emojis.

# Faktadisciplin (viktigt)
- Hitta ALDRIG på finansieringssiffror, värderingar, grundningsår eller grundare. Om du inte är rimligt säker: skriv "uppgifter om finansiering är inte offentliga" eller utelämna detaljen. Det är bättre att vara vag än att fabricera.
- Var ärlig när ett bolag är uppköpt, utländskt eller inte har AI i kärnan — det är själva poängen med en granskande text.

# Output
Ren HTML, börja med första <p>-taggen. Ingen H1 (mallen har redan en). Inga \`\`\`-block, inga inline styles.
Använd <h2>, <h3>, <p>, <ul>/<li>, <strong> sparsamt.`;

const BRIEF = `Skriv en granskande artikel på cirka 2500 ord (svenska) med rubriken "Svenska AI-startups 2026 — Vilka bolag leder utvecklingen?". Journalistisk, inte marknadsförande.

## Inledning
Utgå från frågan: "Sverige har en stark AI-startup-scen — men är vi på väg att tappa mot USA och Kina?" Sätt en ärlig, kritisk ram: Sverige har fostrat flera AI-bolag i världsklass, men många av de starkaste har redan köpts upp av utländska jättar, och vissa namn som florerar på "svenska AI-listor" är varken svenska eller AI i kärnan. Det säger något om ekosystemets mognad.

## Struktur
Gruppera bolagen i branschkategorier med <h2>: "AI-plattformar", "Computer Vision", "NLP & röst", "Healthtech AI", "Transport & mobilitet AI". Använd <h3> per bolag. För varje bolag: vad de gör, grundat (om känt), finansiering (ENDAST om rimligt känt, annars utelämna), och en granskande bedömning av varför de är intressanta — eller varför etiketten "svenskt AI-startup" haltar.

## Faktaunderlag per bolag (håll dig till detta, fabricera inget utöver)
AI-plattformar:
- Lovable (Stockholm, grundat 2023, Anton Osika m.fl.): AI som bygger appar/webbplatser från textprompt ("vibe coding"). En av Europas snabbast växande AI-startups 2024–2025, har rest betydande riskkapital. Genuint AI i kärnan — Sveriges tydligaste AI-startup-stjärna just nu.
- Sana Labs (Stockholm, grundat 2016, Joel Hellermark): AI för lärande och företagskunskap, lanserat AI-assistenten Sana AI. Välfinansierat. AI i kärnan.
- Peltarion (Stockholm): deep learning-plattform — UPPKÖPT av King (mobilspel, del av Microsoft/Activision Blizzard) 2022. Inte längre självständigt. Använd som exempel på att svensk AI-talang absorberas.
- Depict.ai (Stockholm): AI-produktrekommendationer för e-handel. AI i kärnan.

Computer Vision:
- Univrses (Stockholm): datorseende och 3D-positionering för fordon och smarta städer. AI i kärnan.
- Mapillary (Malmö): datorseende på crowdsourcad gatubildsdata — UPPKÖPT av Facebook/Meta 2020. Inte längre svenskt självständigt bolag.
- Annotell / numera Kognic (Göteborg): data-annotering och kvalitetssäkring för autonoma system. AI i kärnan.

NLP & röst:
- Sinch (Stockholm): kommunikationsplattform (CPaaS), BÖRSNOTERAT storbolag snarare än startup, med AI i meddelande- och röstprodukter. Var tydlig med att det är ett moget bolag, inte ett startup.
- Recorded Future: hotunderrättelse med maskininlärning. Grundat i Göteborg 2009 men sedan länge USA-baserat och UPPKÖPT av Mastercard 2024. Svenska rötter, men inte längre ett svenskt startup.
- Elsa Speak (ELSA): AI-uttalscoach för engelska. Huvudkontor i USA, grundare med vietnamesisk bakgrund — INTE ett svenskt bolag. Lyft ärligt att det ofta felaktigt dyker upp på svenska listor.

Healthtech AI:
- Ingen av bolagen ovan är healthtech. Var ärlig: bland de mest omtalade "svenska AI-startupsen" lyser healthtech-AI med sin frånvaro i denna lista, trots att Sverige har en stark life science-sektor. Resonera kort kring varför (regulatoriskt, långa cykler) och att de verkliga healthtech-AI-bolagen sällan når samma rampljus.

Transport & mobilitet AI:
- Univrses och Annotell/Kognic återkommer här (svensk transport-AI: datorseende, AV-data) — referera kort tillbaka.
- Embark Technology: autonoma lastbilar, USA-baserat (San Francisco), börsnoterades via SPAC 2021 och avvecklade/avyttrade verksamheten kring 2023. INTE svenskt. Använd som varning för hype-cykeln.
- Modvion (Göteborg): bygger modulära vindkrafttorn i trä. Detta är INTE ett AI-bolag utan material/cleantech. Ta upp det uttryckligen som exempel på "AI-washing" — hur startup-listor blandar in bolag utan AI i kärnan.

## Ekosystem (egen <h2> "Ekosystemet bakom bolagen")
- AI Sweden: nationellt center för tillämpad AI (Göteborg/Stockholm), offentligt finansierat — infrastruktur och samverkan, inte ett startup.
- RISE (AI-forskning): statligt forskningsinstitut. Förklara deras roll i talang- och forskningsförsörjning.

## Avslutning (<h2> "Styrkor och svagheter")
Analysera ärligt: Styrkor (stark ingenjörskultur, Lovable/Sana visar att svenska AI-startups kan nå global skala, bra forskning via RISE/AI Sweden, datorseende- och mobilitetskluster). Svagheter (de bästa köps upp av utländska jättar innan de blir svenska jättar, brist på sent riskkapital jämfört med USA, healthtech-AI underrepresenterat, och en tendens att "AI-washa" listor med bolag som varken är svenska eller AI). Svara på inledningens fråga: tappar Sverige mot USA och Kina? Ge ett nyanserat, faktabaserat svar.

Skriv artikeln nu. Ren HTML, börja med första <p>-taggen.`;

async function main() {
  const SRC = '/svenska-ai-foretag-2026';
  const { data: src } = await db.from('articles').select('featured_image').eq('path', SRC).single();
  const featured = src?.featured_image ?? null;
  console.log('featured_image kopieras:', featured ?? '(ingen)');

  console.log('Genererar via', MODEL, '…');
  const res = await claude.messages.create({
    model: MODEL,
    max_tokens: 12000,
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: BRIEF }],
  });
  const html = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text).join('').trim();
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`  ${words} ord, ${html.length} tecken`);
  if (words < 1500) { console.error('För kort — avbryter.'); process.exit(1); }

  const row = {
    slug: 'svenska-ai-startups-2026',
    title: 'Svenska AI-startups 2026 — Vilka bolag leder utvecklingen?',
    excerpt: 'Granskande genomgång av de svenska AI-startupsen 2026 — vilka som faktiskt leder, vilka som redan köpts upp av utländska jättar och vilka namn på listorna som varken är svenska eller AI i kärnan.',
    content_mdx: html,
    category: 'foretag-aktorer',
    tags: ['svenska AI-startups', 'AI-bolag', 'startups', 'riskkapital'],
    featured_image: featured,
    type: 'post' as const,
    path: '/svenska-ai-startups-2026',
    parent_slug: null,
    author_slug: 'sara-nilsson',
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: 'Svenska AI-startups 2026 — Vilka bolag leder utvecklingen?',
    seo_description: 'Granskande genomgång av svenska AI-startups 2026: AI-plattformar, computer vision, NLP, transport-AI — vilka leder, vilka är uppköpta och vad det säger om svensk AI.',
  };
  const { error } = await db.from('articles').upsert(row, { onConflict: 'path' });
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  console.log('✓ Skapade /svenska-ai-startups-2026');
}

main().catch((e) => { console.error(e); process.exit(1); });
