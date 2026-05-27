/**
 * Seed DB rows for 3 new yrkesroller (kundservice, rekrytering, juridik)
 * + their 9 subcategory hubs. Idempotent — upserts on path.
 *
 * Run: npx tsx scripts/seed-new-yrkesroller.ts
 *
 * - depth-4 rows: parent_slug='yrke', type='page' → YrkesRollTemplate
 *   (registered in SPEC_BY_SLUG of YrkesRollTemplate.tsx)
 * - depth-5 rows: parent_slug=<yrkesroll>, type='page' → HubTemplate
 *   (rendered as empty hub until tools are seeded for the subcategory)
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
loadEnv({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error('Missing service-role env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

type Page = {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  parent_slug: string;
  path: string;
};

const ROLES: Page[] = [
  {
    slug: 'kundservice',
    title: 'AI för Kundservice — Chatbottar, e-postsvar och röst-AI 2026',
    excerpt: 'AI som tar undan de repetitiva 60 % av kundärendena så supportteamet kan fokusera på det som verkligen behöver en människa.',
    intro: 'Kundservice är ett av de yrken där AI har störst genomslag just nu. Moderna AI-bottar löser självständigt enklare ärenden i webbchatt, e-post och telefonsupport — och eskalerar smartare till människor när det krävs. Resultatet är kortare svarstider, lägre supportkostnader och nöjdare kunder.',
    parent_slug: 'yrke',
    path: '/ai-verktyg/foretag/yrke/kundservice',
  },
  {
    slug: 'rekrytering',
    title: 'AI för Rekrytering & HR — CV-screening, jobbannonser och matchning 2026',
    excerpt: 'Verktygen som hjälper moderna talent-team screena hundratals CV på minuter och skriva inkluderande annonser som lockar rätt kandidater.',
    intro: 'AI förändrar hela rekryteringsprocessen — från hur jobbannonser formuleras, till hur CV rangordnas och hur kandidatmatchning sker. Bästa verktygen sparar veckor av screening per roll och lyfter samtidigt kvaliteten på shortlistan genom mer objektiv bedömning.',
    parent_slug: 'yrke',
    path: '/ai-verktyg/foretag/yrke/rekrytering',
  },
  {
    slug: 'juridik',
    title: 'AI för Juridik — Avtal, due diligence och rättsutredningar 2026',
    excerpt: 'AI som granskar avtal, accelererar due diligence och hittar rätt praxis i svensk juridisk text — för advokatbyråer och bolagsjurister.',
    intro: 'Juridik var länge en bransch där AI mest skapade rubriker, men 2026 har specialiserade verktyg blivit produktivitetshöjare för advokater och bolagsjurister. AI granskar avtal mot din playbook, accelererar due diligence-läsning och hittar relevant praxis snabbare än manuell research.',
    parent_slug: 'yrke',
    path: '/ai-verktyg/foretag/yrke/juridik',
  },
];

const SUBCATEGORIES: Page[] = [
  // Kundservice
  {
    slug: 'chatbot', title: 'AI Chatbottar för kundservice — Topplista 2026',
    excerpt: 'De bästa AI-chatbottarna för webbchatt, Slack och Messenger — testade på svenska och engelska ärenden.',
    intro: 'AI-chatbottar har gått från enkla FAQ-svarare till självständiga agenter som kan hantera komplexa kundärenden över flera kanaler. De bästa bottarna integreras direkt med din ärendehantering, lär sig från historiken och eskalerar till människa vid rätt tillfälle.',
    parent_slug: 'kundservice',
    path: '/ai-verktyg/foretag/yrke/kundservice/chatbot',
  },
  {
    slug: 'epost-svar', title: 'AI för E-postsvar i kundservice — Topplista 2026',
    excerpt: 'AI-verktyg som föreslår och skriver svar på support-mejl — minskar väntetider och frigör supportteamets tid.',
    intro: 'AI-assisterade e-postsvar fungerar bäst när de är inbäddade i din befintliga inbox eller helpdesk. Verktygen läser kontexten, drar fram rätt produktinformation och föreslår ett färdigt svar — supportagenten behöver bara godkänna eller justera.',
    parent_slug: 'kundservice',
    path: '/ai-verktyg/foretag/yrke/kundservice/epost-svar',
  },
  {
    slug: 'rost-ai', title: 'Röst-AI och voicebottar för kundservice — Topplista 2026',
    excerpt: 'AI-röster och voicebottar som hanterar telefon-support, transkriberar samtal och sammanfattar automatiskt.',
    intro: 'Röst-AI handlar om både att lyssna och prata. Modernt voicebot-tooling hanterar naturliga svenska samtal, transkriberar för dokumentation och kan eskalera komplexa frågor till en agent med kontext i realtid.',
    parent_slug: 'kundservice',
    path: '/ai-verktyg/foretag/yrke/kundservice/rost-ai',
  },

  // Rekrytering
  {
    slug: 'cv-screening', title: 'AI för CV-screening — Topplista 2026',
    excerpt: 'AI som rangordnar och filtrerar hundratals CV mot rollbeskrivningen — sparar veckor av manuell screening.',
    intro: 'CV-screening är ofta den största flaskhalsen i rekrytering. AI-verktygen rangordnar kandidater mot exakt det roll-fit du beskriver, flaggar gap och sparar shortlist på minuter istället för dagar.',
    parent_slug: 'rekrytering',
    path: '/ai-verktyg/foretag/yrke/rekrytering/cv-screening',
  },
  {
    slug: 'jobbannonser', title: 'AI för Jobbannonser — Topplista 2026',
    excerpt: 'AI som skriver inkluderande och slagkraftiga jobbannonser — testar tone, gender bias och attraktivitet.',
    intro: 'En välskriven jobbannons kan halvera tiden det tar att fylla en roll. AI-verktyg analyserar tone, flaggar bias och föreslår formuleringar som drar fler kvalificerade ansökningar — särskilt från underrepresenterade grupper.',
    parent_slug: 'rekrytering',
    path: '/ai-verktyg/foretag/yrke/rekrytering/jobbannonser',
  },
  {
    slug: 'kandidatmatchning', title: 'AI för Kandidatmatchning — Topplista 2026',
    excerpt: 'AI som matchar kandidater mot lediga tjänster baserat på skill, erfarenhet och kultur-fit.',
    intro: 'Matchnings-AI tittar bortom CV och letar efter mönster i tidigare lyckade anställningar. Bästa verktygen byggs ovanpå din befintliga ATS och föreslår både interna och externa kandidater som passar nya roller.',
    parent_slug: 'rekrytering',
    path: '/ai-verktyg/foretag/yrke/rekrytering/kandidatmatchning',
  },

  // Juridik
  {
    slug: 'avtalsgranskning', title: 'AI för Avtalsgranskning — Topplista 2026',
    excerpt: 'AI som granskar avtal mot din playbook och flaggar avvikelser och risker — på svenska och engelska.',
    intro: 'Avtalsgranskning är AIs starkaste use case inom juridik. Verktygen jämför inkomna avtal mot din standard-playbook, flaggar avvikelser på paragraph-nivå och föreslår alternativa formuleringar som matchar dina riktlinjer.',
    parent_slug: 'juridik',
    path: '/ai-verktyg/foretag/yrke/juridik/avtalsgranskning',
  },
  {
    slug: 'due-diligence', title: 'AI för Due Diligence — Topplista 2026',
    excerpt: 'AI som accelererar dokumentanalys vid förvärv, investeringar och M&A — extraherar nyckelinformation från datarooms.',
    intro: 'Due diligence-team läser tusentals dokument under tidspress. AI-verktyg extraherar nyckelvillkor, flaggar risker och bygger sammanfattningar av kontrakt, anställningsavtal och leverantörsavtal automatiskt — innan en jurist ens öppnar pärmen.',
    parent_slug: 'juridik',
    path: '/ai-verktyg/foretag/yrke/juridik/due-diligence',
  },
  {
    slug: 'rattsutredningar', title: 'AI för Rättsutredningar — Topplista 2026',
    excerpt: 'AI som söker, sammanfattar och citerar relevant praxis och svensk rätt — för advokater och bolagsjurister.',
    intro: 'Rättsutredningar har förändrats av AI-verktyg som söker över hela svenska rättskällan, sammanfattar prejudikat och föreslår relevanta paragrafer. Bäst i klassen verifierar varje citat så hallucinationer inte slinker in i din PM.',
    parent_slug: 'juridik',
    path: '/ai-verktyg/foretag/yrke/juridik/rattsutredningar',
  },
];

function buildContentMdx(p: Page, isRole: boolean): string {
  return `
<h2>Vad du behöver veta</h2>
<p>${p.intro}</p>

<h2>Så hjälper AI</h2>
<p>I 2026 års test rankar AI-Magasinet de verktyg som faktiskt fungerar i svenska arbetsflöden — inte de som låter mest imponerande på demo-videon. ${isRole ? 'Välj ett område nedan för att komma direkt till topplistan.' : 'Topplistan ovan visar våra bästa rekommendationer baserade på faktiska tester.'}</p>

<h2>Vanliga frågor</h2>
<p>Frågor om implementation, integration med befintliga system och svenska GDPR-krav är de vanligaste vi får. Varje recension i topplistan svarar konkret på var produkten står på dessa frågor.</p>
`.trim();
}

async function main() {
  const all: Page[] = [...ROLES, ...SUBCATEGORIES];
  const rows = all.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content_mdx: buildContentMdx(p, ROLES.includes(p)),
    category: null,
    tags: [] as string[],
    featured_image: null,
    type: 'page',
    path: p.path,
    parent_slug: p.parent_slug,
    affiliate_url: null,
    published_at: new Date().toISOString(),
    seo_title: null,
    seo_description: null,
  }));

  console.log(`Upserting ${rows.length} pages (${ROLES.length} yrkesroller + ${SUBCATEGORIES.length} subcategories)…`);
  const { data, error } = await db
    .from('articles')
    .upsert(rows, { onConflict: 'path' })
    .select('slug,path');

  if (error) {
    console.error('upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`OK — wrote ${data?.length ?? 0} rows.`);
  (data ?? []).forEach((d) => console.log(`  ${d.path}`));
}

main();
