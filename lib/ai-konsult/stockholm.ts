// Bolagen i Stockholm-listan. Varje uppgift ska gå att kontrollera mot bolagets egen webbplats.
// Ordningen är redaktionell och påverkas aldrig av betalning.

export type StockholmCompany = {
  slug: string;
  name: string;
  letter: string;
  tone: string;
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

export const STOCKHOLM_COMPANIES: StockholmCompany[] = [
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
    region: 'Stockholm',
    text: 'Sigma Technology arbetar med digital och ingenjörsmässig utveckling, affärstjänster och produktinformation. AI-konsulting och -utveckling är en av tjänsterna.',
    services: ['AI-konsulting och -utveckling', 'Mjukvaruutveckling', 'Cloud', 'DevOps och infrastruktur', 'IoT', 'Data analytics och BI', 'Microsoft 365 Copilot', 'Digital Product Passports'],
    cases: 'Webbplatsen nämner inga namngivna kundcase. En nyhet beskriver ett ramavtal med Sveriges Radio för IT-konsulttjänster.',
    website: 'https://sigmatechnology.com',
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
];

export function findStockholmCompany(slug: string): StockholmCompany | undefined {
  return STOCKHOLM_COMPANIES.find((c) => c.slug === slug);
}
