// Register över svenska AI-bolag vi skriver om, med en kontrollerad slug per
// bolag. Grunden för ett framtida /foretag/[slug]-index (artiklar taggas med
// dessa slugs i articles.companies, se migration 0022). Lägg till ett bolag
// här FÖRST, tagga sedan artikeln — annars syns det inte i ett framtida index
// även om en artikel råkar nämna det.
//
// "Etablerad" markerar bolag som är stora/börsnoterade/uppköpta och inte
// längre (eller aldrig var) startups i gängse mening — syns i texten, inte
// bara i en FAQ, se STATUS.md om Lovable-diskussionen.

export type CompanyStatus = 'startup' | 'etablerad' | 'uppkopt';

export type RegisteredCompany = {
  slug: string;
  name: string;
  website: string;
  oneLiner: string;
  status: CompanyStatus;
  /** "Tråkig" grundfakta — fylls i vartefter, inte obligatoriskt. */
  founded?: number;
  founders?: string[];
  headquarters?: string;
  /** Fritext, attribuerad/reserverad där siffran inte är officiellt bekräftad
   *  av bolaget — se Lovable/Legora för exempel på hur det formuleras. */
  size?: string;
  /** Rikare produktbeskrivning (2–4 meningar) för sidans ingress — vad
   *  bolaget faktiskt gör/säljer, inte historik. oneLiner används i listor
   *  och metadata, description är den som visas stort på själva sidan. */
  description?: string;
  /** Längre historik/bakgrund, ett eller flera stycken. Lämna tomt för bolag
   *  som bara har en-radaren tills vidare (steg 1 av utbyggnaden). */
  about?: string;
  /** Sökväg till vår egen recension/guide av PRODUKTEN, om en sådan finns —
   *  länkas från företagssidan så Google ser skillnaden: den här sidan ska
   *  ranka på bolaget, recensionen på verktyget. */
  reviewPath?: string;
};

export const COMPANIES: RegisteredCompany[] = [
  {
    slug: 'lovable',
    name: 'Lovable',
    website: 'https://lovable.dev',
    oneLiner: 'AI som bygger appar och webbplatser från textbeskrivningar ("vibe coding").',
    status: 'startup',
    founded: 2023,
    founders: ['Anton Osika'],
    headquarters: 'Stockholm',
    size: 'Enligt grundaren Anton Osika passerade teamet 200 anställda i april 2026.',
    description:
      'Lovable är ett AI-verktyg för "vibe coding" — du beskriver en app, webbplats eller ett internt verktyg i vanlig text, och AI:n skriver och driftsätter koden åt dig, utan att du behöver kunna programmera. Produkten riktar sig både till utvecklare som vill bygga snabbare och till icke-tekniska användare som annars hade behövt anlita en utvecklare för varje litet projekt. Resultatet är en körbar webbapplikation, inte bara kodförslag att klistra in någon annanstans.',
    about:
      'Lovable grundades i Stockholm 2023 av Anton Osika, med rötter i hans tidigare öppna källkods-projekt GPT Engineer. Produkten låter användare beskriva en app eller webbplats i fritext och få AI att bygga den — ett fenomen som i branschen kallas "vibe coding". Bolaget växte ovanligt snabbt: 2024–2025 räknades Lovable till en av Europas snabbast växande AI-startups, och i augusti 2026 tog man in en runda på 400 miljoner dollar som värderade bolaget till 13,3 miljarder dollar, med en uppgiven årlig intäktstakt (ARR) på omkring 500 miljoner dollar enligt branschmedia. Osika har själv uppgett att teamet passerat 200 anställda, med rekrytering i bland annat Stockholm, London, Boston, New York och San Francisco.',
  },
  {
    slug: 'legora',
    name: 'Legora',
    website: 'https://legora.com',
    oneLiner: 'AI-plattform för juridiskt arbete: research, granskning och avtalsskrivande.',
    status: 'startup',
    founded: 2022,
    founders: ['Max Junestrand', 'Sigge Labor', 'August Erseus'],
    headquarters: 'Stockholm',
    size: 'Uppskattningar av antal anställda varierar kraftigt mellan källor under 2026 (ungefär 500–800); bolaget har inte offentliggjort en exakt siffra.',
    description:
      'Legora är en AI-plattform byggd specifikt för advokatbyråer och interna juristteam. Verktyget läser, sammanfattar och flaggar risker i avtal och juridiska dokument, hjälper till med research i rättskällor och kan utkasta avtalstext — arbete som annars tar juniora jurister och paralegals många timmar. Till skillnad från generella AI-chattbottar är Legora byggt för att hantera juridikens krav på källspårbarhet och exakthet.',
    about:
      'Legora grundades i Stockholm 2022 under namnet Leya av Max Junestrand, Sigge Labor och August Erseus, och bytte namn till Legora 2025. Plattformen automatiserar tungt administrativt arbete på advokatbyråer och interna juristteam: dokumentgranskning, avtalsanalys och research. Tillväxten har varit snabb — en serie D på 550 miljoner dollar i mars 2026 värderade bolaget till 5,55 miljarder dollar, ledd av Accel med bland andra Salesforce Ventures och Y Combinator som investerare, och rundan utökades i april med ytterligare 42 miljoner euro. I september 2026 diskuterades enligt branschmedia en ny runda som skulle värdera bolaget till omkring 8,5 miljarder dollar.',
  },
  { slug: 'sana-labs', name: 'Sana Labs', website: 'https://sanalabs.com', oneLiner: 'AI för företagslärande och kunskapshantering.', status: 'startup' },
  { slug: 'peltarion', name: 'Peltarion', website: 'https://peltarion.com', oneLiner: 'Tidig svensk deep learning-plattform, köpt av King (Microsoft/Activision) 2022.', status: 'uppkopt' },
  { slug: 'univrses', name: 'Univrses', website: 'https://univrses.com', oneLiner: 'Datorseende och 3D-positionering för fordonsindustrin och smarta städer.', status: 'startup' },
  { slug: 'kognic', name: 'Kognic', website: 'https://kognic.com', oneLiner: 'Dataannotering och kvalitetssäkring för träning av autonoma system.', status: 'startup' },
  { slug: 'mapillary', name: 'Mapillary', website: 'https://mapillary.com', oneLiner: 'Crowdsourcad gatubildsdata med datorseende, köpt av Facebook/Meta 2020.', status: 'uppkopt' },
  { slug: 'einride', name: 'Einride', website: 'https://einride.tech', oneLiner: 'Autonoma, eldrivna lastbilar — börsnoterades på Nasdaq via SPAC juni 2026.', status: 'startup' },
  { slug: 'neko-health', name: 'Neko Health', website: 'https://nekohealth.com', oneLiner: 'AI-analyserade helkroppsskanningar, grundat av Daniel Ek.', status: 'startup' },
  { slug: 'coala-life', name: 'Coala Life', website: 'https://coalalife.com', oneLiner: 'Hjärtmonitor där ML-modeller analyserar EKG-data.', status: 'startup' },
  { slug: 'mendi', name: 'Mendi', website: 'https://mendi.io', oneLiner: 'Neurofeedback-hårdvara och AI-personaliserad kognitiv träning.', status: 'startup' },
  { slug: 'tandem-health', name: 'Tandem Health', website: 'https://tandemhealth.ai', oneLiner: 'AI-driven journalföring och dokumentation för vårdpersonal.', status: 'startup' },
  { slug: 'hejmo', name: 'Hejmo', website: 'https://hejmo.se', oneLiner: 'AI-stöd för adaptiv inlärning hos barn, riktat mot skandinaviska skolor.', status: 'startup' },
  { slug: 'storykit', name: 'Storykit', website: 'https://storykit.io', oneLiner: 'AI-baserad videoproduktion för marknadsföring och kommunikation.', status: 'startup' },
  { slug: 'recorded-future', name: 'Recorded Future', website: 'https://recordedfuture.com', oneLiner: 'Hotunderrättelse och maskininlärning, svenska rötter, köpt av Mastercard 2024.', status: 'uppkopt' },
  { slug: '13-37', name: '13|37', website: 'https://1337.se', oneLiner: 'AI-baserad hotdetektering inom cybersäkerhet.', status: 'startup' },
  { slug: 'hopsworks', name: 'Hopsworks', website: 'https://hopsworks.ai', oneLiner: 'MLOps-plattform med Python-baserad feature store, tidigare Logical Clocks.', status: 'startup' },
  { slug: 'unify', name: 'Unify', website: 'https://unify.ai', oneLiner: 'LLM-orkestrering och modellrouting för enterprise.', status: 'startup' },
  { slug: 'factiverse', name: 'Factiverse', website: 'https://factiverse.ai', oneLiner: 'Faktakontroll och källverifiering med NLP.', status: 'startup' },
  { slug: 'opper', name: 'Opper', website: 'https://opper.ai', oneLiner: 'Task Completion API som ska göra AI-modellers utdata mer pålitliga.', status: 'startup' },
  { slug: 'depict-ai', name: 'Depict.ai', website: 'https://depict.ai', oneLiner: 'AI-driven produktrekommendation för e-handel.', status: 'startup' },
];

export function companyBySlug(slug: string): RegisteredCompany | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}
