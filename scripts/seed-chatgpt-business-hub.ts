/**
 * Nyhetsartikel: ChatGPT Business Hub + koppling till Wallet-lanseringen.
 * published_at=null — väntar på granskning + bild.
 *
 *   npx tsx -r dotenv/config scripts/seed-chatgpt-business-hub.ts dotenv_config_path=.env.local
 */
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const title = 'ChatGPT Business Hub: därför är OpenAI:s andra november-lansering minst lika viktig som Wallet';
const excerpt =
  'Den 10 november 2026 lanserade OpenAI "Businesses in ChatGPT" — tre dagar innan ChatGPT Wallet. Tillsammans ritar de om hur företag syns och säljer via AI, och vad marknadsavdelningar behöver börja mäta.';

const content_mdx = `<p>Medan halva LinkedIn-flödet handlade om <a href="/openai-chatgpt-wallet-ai-agenter-shoppar/">ChatGPT Wallet</a> — funktionen som låter en AI-agent faktiskt genomföra ett köp åt dig — hände något annat tre dagar tidigare som fick mindre uppmärksamhet. Den 10 november 2026 lanserade OpenAI <a href="https://openai.com/index/introducing-businesses-chatgpt/" rel="nofollow noopener" target="_blank">Businesses in ChatGPT</a>, en betafunktion med två delar: Business Hub och Business Agents. Sett tillsammans är de två lanseringarna egentligen en och samma strategi i två steg.</p>

<h2>Vad är ChatGPT Business Hub?</h2>
<p>Business Hub gör det möjligt för företag att göra anspråk på sin egen profil i ChatGPT — på samma sätt som man länge kunnat göra med en Google Business-profil. Enligt OpenAI:s egen lansering kan verifierade företag:</p>
<ul>
<li>Uppdatera grundläggande information som visas när ChatGPT svarar på frågor om företaget.</li>
<li>Koppla på ett produktflöde (en CSV-fil enligt OpenAI:s specifikation, eller en direkt Shopify-koppling) med priser, lagerstatus och sortiment.</li>
<li>Se aggregerad statistik över 28 dagar — omnämnanden och klick till den egna webbplatsen från ChatGPT.</li>
<li>För kvalificerade amerikanska e-handels- och tjänsteföretag: bygga en egen varumärkesspecifik AI-agent (Business Agent) som hjälper användare att hitta och jämföra produkter direkt i chatten.</li>
</ul>
<p>Verifieringen sker via företagets telefonnummer, mejladress, webbdomän eller Shopify-konto. Vid lansering är det kostnadsfritt att göra anspråk på och hantera sin profil, men OpenAI:s egen monetiseringsansvarige har enligt uppgift lämnat dörren öppen för att ta betalt längre fram. Befintliga Enterprise-kunder och annonsörer hanteras istället via sin OpenAI-kontakt, inte via det öppna flödet.</p>

<h2>Varför det är smart att se Hub och Wallet som samma rörelse</h2>
<p>Var och en för sig är de två funktionerna begränsade. Wallet är fortfarande bara tillgängligt för berättigade ChatGPT Pro-användare i USA med amerikanska kort, via OpenAI:s AI-agenter i Dots, och byggt tillsammans med Visa, Mastercard och American Express samt betalleverantörer som Stripe, Adyen och Checkout.com — det bygger alltså på e-handlarnas befintliga kortbetalningar snarare än en helt ny infrastruktur. Business Hub är i sin tur bara ett sätt att synas och lägga in produktdata.</p>
<p>Tillsammans bildar de en komplett kedja: Business Hub ger OpenAI korrekt, uppdaterad produktdata direkt från företaget. Business Agents gör det möjligt för en AI-agent att faktiskt rekommendera rätt produkt baserat på den datan. Wallet gör det möjligt att slutföra köpet utan att användaren lämnar chatten. Tre lanseringar inom loppet av tre dagar är knappast en slump — det är samma produktvision i tre lager.</p>

<h2>Vad det betyder för e-handlare och marknadsavdelningar</h2>
<p>Den uppenbara konsekvensen är teknisk: produktflöden, sajter och checkout-flöden måste fungera även när "kunden" är en AI-agent, inte en människa som klickar runt. Men den svårare frågan är mätbarheten. När ett köp sker helt inuti ChatGPT — från research till rekommendation till betalning — vad ska man egentligen tillskriva som "källan" till försäljningen i sin analytics? Vi skriver mer om hur knepigt attributionslandskapet redan är i <a href="/ads-organic-llm-conversion-rate-2026/">vår genomgång av conversion rate per köpkälla</a>, men Business Hub och Wallet gör frågan akut snarare än teoretisk: allt större delar av kundresan riskerar att bli osynliga för traditionell sista-klick-mätning.</p>
<p>Den praktiska startpunkten för svenska bolag just nu: Hub och Wallet är fortfarande USA-fokuserade vid lansering, men mönstret — gör produktdata läsbart och korrekt för AI-agenter innan funktionen rullas ut bredare — gäller redan. Samma logik som vi beskrivit för att synas i AI-sök generellt gäller här: om era produktflöden är ofullständiga eller föråldrade när funktionen når Sverige, är ni redan på efterkälken den dag det händer.</p>

<h2>Källor</h2>
<p>Uppgifterna om Business Hub kommer från <a href="https://openai.com/index/introducing-businesses-chatgpt/" rel="nofollow noopener" target="_blank">OpenAI:s egen lanseringssida</a>. Uppgifterna om ChatGPT Wallet är sedan tidigare verifierade i vår egen artikel om lanseringen.</p>`;

const faq = [
  {
    question: 'Vad är ChatGPT Business Hub?',
    answer: 'En betafunktion från OpenAI, lanserad 10 november 2026, som låter företag göra anspråk på sin egen profil i ChatGPT, uppdatera information, koppla på produktflöden med priser och lagerstatus, och se statistik över omnämnanden och klick från ChatGPT.',
  },
  {
    question: 'Hur hänger ChatGPT Business Hub ihop med ChatGPT Wallet?',
    answer: 'De lanserades med tre dagars mellanrum i november 2026 och bildar tillsammans en kedja: Business Hub ger OpenAI korrekt produktdata, Business Agents rekommenderar produkter baserat på datan, och Wallet gör det möjligt att slutföra köpet utan att lämna chatten.',
  },
  {
    question: 'Kostar det något att vara med i ChatGPT Business Hub?',
    answer: 'Vid lansering är det kostnadsfritt att göra anspråk på och hantera sin företagsprofil. OpenAI har enligt uppgift lämnat dörren öppen för att ta betalt för delar av funktionen längre fram.',
  },
  {
    question: 'Är ChatGPT Business Hub tillgängligt för svenska företag?',
    answer: 'Vid lansering är fokus på den amerikanska marknaden, särskilt för Business Agents som är begränsade till kvalificerade amerikanska e-handels- och tjänsteföretag. Verifiering via webbdomän eller Shopify-konto tyder på att bredare marknader kan följa efter.',
  },
];

async function main() {
  const row = {
    slug: 'chatgpt-business-hub-sa-hanger-det-ihop-med-wallet',
    title,
    excerpt,
    content_mdx,
    faq,
    category: 'ai-nyheter',
    tags: ['OpenAI', 'ChatGPT', 'Business Hub', 'ChatGPT Wallet', 'E-handel'],
    featured_image: null,
    type: 'post',
    path: '/chatgpt-business-hub-sa-hanger-det-ihop-med-wallet',
    parent_slug: null,
    affiliate_url: null,
    published_at: null,
    seo_title: title,
    seo_description: excerpt,
    author_slug: 'nicklas-hallberg',
  };
  const { data: existing } = await db.from('articles').select('slug').eq('path', row.path).maybeSingle();
  const { error } = existing
    ? await db.from('articles').update(row).eq('path', row.path)
    : await db.from('articles').insert(row);
  if (error) { console.error(error); process.exit(1); }
  console.log(`OK: artikel ${existing ? 'uppdaterad' : 'skapad'}, published_at=null — väntar på granskning + bild.`);
}
main();
