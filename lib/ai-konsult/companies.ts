// Bolagen i AI-konsult-sektionen och vilka städer de ligger i. Varje uppgift ska gå att kontrollera
// mot bolagets egen webbplats. Ordningen i en stad är redaktionell och påverkas aldrig av betalning.

export type Company = {
  slug: string;
  name: string;
  letter: string;
  tone: string;
  /** Standardort, används om staden inte anger en egen. */
  city: string;
  region: string;
  /** Kort beskrivning, med bolagets egna ord där det går. */
  text: string;
  /** Tjänsteområden så som de står på webbplatsen. */
  services: string[];
  /** Kundcase och referenser så som webbplatsen beskriver dem. */
  cases: string;
  email?: string;
  phone?: string;
  address?: string;
  website: string;
};

export const COMPANIES: Company[] = [
  {
    slug: 'deploja',
    name: 'Deploja',
    letter: 'D',
    tone: 'bg-emerald-100 text-emerald-700',
    city: 'Solna',
    region: 'Stockholm',
    text: 'Deploja beskriver sig som ett IT-konsultbolag som levererar affärsdrivande IT-lösningar. AI är ett av flera tjänsteområden.',
    services: ['AI', 'Automation', 'Molnplattformar', 'Arkitektur', 'IT-säkerhet', 'Backendutveckling', 'Test', 'Projektledning'],
    cases: 'Webbplatsen har inga namngivna kundcase eller referenser.',
    email: 'info@deploja.se',
    address: 'Råsundavägen 12, 169 67 Solna',
    website: 'https://deploja.se',
  },
  {
    slug: 'netlight',
    name: 'Netlight',
    letter: 'N',
    tone: 'bg-violet-100 text-violet-700',
    city: 'Stockholm',
    region: 'Stockholm',
    text: 'Netlight beskriver sina tjänster som "services at the edge of technology" och uppger cirka 2 200 konsulter.',
    services: ['Mjukvaruutveckling', 'Moln', 'Infrastruktur', 'Data & AI', 'Produkt', 'Design & UX', 'Cybersäkerhet', 'M&A', 'Organisationsutveckling', 'Transformation'],
    cases: 'Webbplatsen beskriver bland annat ett projekt med sevdesk om en LLM-baserad migrering av ett frontend-system, och ett fall om digitala tvillingar för en tillverkare. Kunderna namnges inte i alla fall.',
    website: 'https://www.netlight.com',
  },
  {
    slug: 'remotion',
    name: 'Remotion',
    letter: 'R',
    tone: 'bg-rose-100 text-rose-700',
    city: 'Stockholm',
    region: 'Stockholm',
    text: 'Remotion beskriver sig med digital tillväxt som fokus. Bland tjänsterna finns AI-agenter och automation, särskilt för marknad och sälj.',
    services: ['AI-agenter och automation', 'AI-assisterad annonsproduktion', 'AI-träning för marknad och sälj', 'Datadriven marknadsföring', 'Datavisualisering och rapportering', 'Systemimplementation', 'Kundbasanalys', 'Marknadsföringsstrategi'],
    cases: 'Webbplatsen har en sektion med kundprojekt för bland annat Adlibris, Byggmax och Kjell & Company, och listar fler kunder utan länkade projekt.',
    email: 'info@remotion.se',
    address: 'Kungsbron 21 (Entré G), 111 22 Stockholm',
    website: 'https://remotion.se',
  },
  {
    slug: 'sigma-technology',
    name: 'Sigma Technology',
    letter: 'S',
    tone: 'bg-sky-100 text-sky-700',
    city: 'Stockholm, bland flera orter',
    region: 'Sverige',
    text: 'Sigma Technology arbetar med digital och ingenjörsmässig utveckling, affärstjänster och produktinformation. AI-konsulting och -utveckling är en av tjänsterna.',
    services: ['AI-konsulting och -utveckling', 'Mjukvaruutveckling', 'Cloud', 'DevOps och infrastruktur', 'IoT', 'Data analytics och BI', 'Microsoft 365 Copilot', 'Digital Product Passports'],
    cases: 'Webbplatsen nämner inga namngivna kundcase. En nyhet beskriver ett ramavtal med Sveriges Radio för IT-konsulttjänster.',
    website: 'https://sigmatechnology.com/contact',
  },
  {
    slug: 'techgruppen',
    name: 'Techgruppen',
    letter: 'T',
    tone: 'bg-amber-100 text-amber-700',
    city: 'Nacka',
    region: 'Stockholm',
    text: 'Techgruppen erbjuder AI-chatbotar, processautomatisering, prediktiv analys, AI-baserad CRM och AI för SEO. Grundläggande AI-lösningar startar från 15 000 kr per månad.',
    services: ['AI-chatbotar', 'Processautomatisering', 'Prediktiv analys', 'AI-baserad CRM', 'AI för SEO', 'Conversation intelligence'],
    cases: 'Webbplatsen nämner inga kundcase eller referenser.',
    email: 'info@techgruppen.io',
    phone: '010-551 19 19',
    address: 'Augustendalstorget 3, 131 52 Nacka Strand',
    website: 'https://techgruppen.io/ai-konsulter',
  },
  {
    slug: 'neodev',
    name: 'Neodev',
    letter: 'N',
    tone: 'bg-teal-100 text-teal-700',
    city: 'Malmö',
    region: 'Skåne',
    text: 'Neodev beskriver sig som konsulter i Malmö sedan 2013. Sidan nämner machine learning som en styrka, men beskriver inte AI-tjänsterna närmare.',
    services: ['Machine learning', 'Ingenjörskonsulting'],
    cases: 'Webbplatsen visar kundlogotyper, bland annat Haldex, Boni, Axis och Hovding, och ett kundcitat från Haldex. Citatet handlar om ett verktyg för bromsprestanda och nämner inte AI.',
    email: 'info@neodev.se',
    phone: '+46 (0)73 385 69 06',
    address: 'Södergatan 3, 211 34 Malmö',
    website: 'https://www.neodev.se',
  },
  {
    slug: 'oxide-ai',
    name: 'Oxide AI',
    letter: 'O',
    tone: 'bg-orange-100 text-orange-700',
    city: 'Malmö',
    region: 'Skåne',
    text: 'Oxide AI erbjuder AI-lösningar för finans, handel och hälsa, bland annat prediktiv analys, riskbedömning och AI-agenter.',
    services: ['Prediktiv analys', 'Riskbedömning och compliance', 'Finansiell data via API', 'Anpassade AI-agenter', 'AI-plattform'],
    cases: 'Inga namngivna kunder. Webbplatsen nämner partnerskap med Arrow Electronics och IBM, och en fallstudie som inte finns att läsa på sidan.',
    email: 'contactus@oxide.ai',
    address: 'Västergatan 18B, 211 21 Malmö',
    website: 'https://www.oxide.ai',
  },
];

export type CityEntry = {
  slug: string;
  /** Platsen som visas för bolaget i just den här staden. */
  location: string;
  /** Adress för just den här staden, om annan än standard. */
  address?: string;
};

export type City = {
  slug: string;
  name: string;
  /** Länens namn, för "Region" på profilsidan. */
  region: string;
  /** Vilka bolag som listas i staden, i redaktionell ordning. */
  companies: CityEntry[];
};

export const CITIES: City[] = [
  {
    slug: 'stockholm',
    name: 'Stockholm',
    region: 'Stockholms län',
    companies: [
      { slug: 'deploja', location: 'Solna' },
      { slug: 'netlight', location: 'Stockholm' },
      { slug: 'remotion', location: 'Stockholm' },
      { slug: 'sigma-technology', location: 'Stockholm, bland flera orter' },
      { slug: 'techgruppen', location: 'Nacka' },
    ],
  },
  {
    slug: 'goteborg',
    name: 'Göteborg',
    region: 'Västra Götalands län',
    companies: [
      { slug: 'sigma-technology', location: 'Göteborg' },
      { slug: 'netlight', location: 'Göteborg' },
      { slug: 'techgruppen', location: 'Göteborg', address: 'Karl Gustavsgatan 17, 411 25 Göteborg' },
    ],
  },
  {
    slug: 'malmo',
    name: 'Malmö',
    region: 'Skåne',
    companies: [
      { slug: 'sigma-technology', location: 'Malmö' },
      { slug: 'neodev', location: 'Malmö' },
      { slug: 'oxide-ai', location: 'Malmö' },
    ],
  },
];

export function findCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/** Ett bolag sett från en viss stad: platsen och adressen är de som gäller där. */
export function companyInCity(city: City, companySlug: string): (Company & { location: string }) | undefined {
  const entry = city.companies.find((c) => c.slug === companySlug);
  const base = COMPANIES.find((c) => c.slug === companySlug);
  if (!entry || !base) return undefined;
  return { ...base, location: entry.location, address: entry.address ?? base.address };
}

export function companiesInCity(city: City): (Company & { location: string })[] {
  return city.companies
    .map((e) => companyInCity(city, e.slug))
    .filter((c): c is Company & { location: string } => !!c);
}
