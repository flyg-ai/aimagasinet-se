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
  {
    slug: 'prevas',
    name: 'Prevas',
    letter: 'P',
    tone: 'bg-indigo-100 text-indigo-700',
    city: 'Västerås',
    region: 'Västmanlands län',
    text: 'Prevas beskriver sig som ett nordiskt produkt- och produktionsutvecklingshus som kombinerar teknisk spetskompetens med data- och AI-kompetens. Huvudkontoret ligger i Västerås.',
    services: ['Data och AI', 'AI-baserad maskinseende och kvalitetskontroll', 'Produkt- och produktionsutveckling', 'Industriell IT', 'Simulering', 'Digitalisering av produktion'],
    cases: 'Webbplatsen namnger bland annat Alleima (AI-baserad kvalitetskontroll av stålrör via maskinseende) och Kährs (AI-baserad vision-lösning för sortering och kvalitetsavsyn av trägolv) som kundcase.',
    phone: '021-360 19 00',
    address: 'Glödgargränd 14, 721 03 Västerås',
    website: 'https://www.prevas.se',
  },
  {
    slug: 'mabema',
    name: 'Mabema',
    letter: 'M',
    tone: 'bg-lime-100 text-lime-700',
    city: 'Linköping',
    region: 'Östergötlands län',
    text: 'Mabema beskriver sig som Sveriges största leverantör av maskinseende med AI för industrin.',
    services: ['Vision-baserad kvalitetskontroll', 'Robotguidning med maskinseende', 'Skräddarsydda vision-baserade inspektionslösningar', 'Vision-baserad stockmätning'],
    cases: 'Webbplatsen namnger bland annat Karl Hedin AB, Heléns Rör och Peterson Cartridge med kundcitat, samt videofall för Beslag & Metall, Ljunghäll och Geberit.',
    phone: '+46 (0)13-15 37 00',
    address: 'Jägarvallsvägen 4C, 584 22 Linköping',
    website: 'https://mabema.com',
  },
  {
    slug: 'cgi',
    name: 'CGI',
    letter: 'C',
    tone: 'bg-cyan-100 text-cyan-700',
    city: 'Örebro',
    region: 'Örebro län',
    text: 'CGI beskriver sitt AI- och avancerad analys-erbjudande som "kognitiva lösningar", levererat som oberoende helhetsleverantör från strategi till drift.',
    services: ['AI-strategi och roadmap', 'Prediktivt underhåll', 'Skräddarsydda ML- och djupinlärningsmodeller', 'Drift och förvaltning av AI-lösningar', 'Data Sprints för "dark data"'],
    cases: 'Webbplatsen namnger Uddeholm som kundcase, en ML-baserad lösning för att förbättra produktionsprocesser.',
    phone: '+46 (0)19 506 25 00',
    address: 'Rudbecksgatan 7, 702 11 Örebro',
    website: 'https://www.cgi.com/se/sv/tjanster/data-analytics/ai-avancerad-analys',
  },
  {
    slug: 'knowit',
    name: 'Knowit',
    letter: 'K',
    tone: 'bg-yellow-100 text-yellow-700',
    city: 'Örebro',
    region: 'Örebro län',
    text: 'Knowit beskriver sina konsulter som att ha expertis inom dataanalys och ansvarsfull AI-användning. Det lokala bolaget Knowit Örebro AB har annonserat efter AI-roller (AI Lead, AI Architect) i Örebro.',
    services: ['AI och dataanalys', 'Systemutveckling', 'Moln och integration', 'Arkitektur'],
    cases: 'Webbplatsens exempel är inte Örebro-specifika: bland annat en AI-agent för Kappahl Groups arbetsflöden och ett AI-lab med Borås Energi och Miljö.',
    email: 'orebro@knowit.se',
    phone: '070-244 08 60',
    address: 'Klostergatan 23, 703 39 Örebro',
    website: 'https://www.knowit.se',
  },
  {
    slug: 'hiq',
    name: 'HiQ',
    letter: 'H',
    tone: 'bg-pink-100 text-pink-700',
    city: 'Västerås',
    region: 'Västmanlands län',
    text: 'HiQ är ett techkonsultbolag med fokus på skräddarsydd mjukvaruutveckling. Bolaget har satsat på "business-centric AI" och rekryterat en AI-expert som chef för AI-affärsområdet.',
    services: ['Mjukvaruutveckling', 'AI (business-centric AI)', 'AI Products & Platforms', 'Digitala tjänster'],
    cases: 'Webbplatsen namnger inga AI-kundcase för Västerås-kontoret. Ett äldre case (Volvo Construction Equipment, "SelfieDrive") rör inte AI.',
    email: 'info.malardalen@hiq.se',
    phone: '010-207 44 44',
    address: 'Port-Anders gata 9 (B26), 722 12 Västerås',
    website: 'https://hiq.se',
  },
  {
    slug: 'sogeti',
    name: 'Sogeti',
    letter: 'S',
    tone: 'bg-stone-100 text-stone-700',
    city: 'Helsingborg',
    region: 'Skåne län',
    text: 'Sogeti (del av Capgemini) uppger att bolaget har arbetat med generativ AI sedan 2018, med ett eget "Trusted AI Framework" för säkert och etiskt bruk av AI.',
    services: ['AI-strategi', 'AI Factory (skalning av AI)', 'Generativ AI', 'AI-agenter', 'Advanced Analytics', 'Automation (RPA + AI)'],
    cases: 'Webbplatsen namnger SKF (prediktivt underhåll) och VING (automatiserad och personaliserad översättning) som AI-kundcase.',
    website: 'https://www.sogeti.se/ai-generative-ai/',
  },
  {
    slug: 'lan-assistans',
    name: 'LAN Assistans',
    letter: 'L',
    tone: 'bg-blue-100 text-blue-700',
    city: 'Norrköping',
    region: 'Östergötlands län',
    text: 'LAN Assistans Sverige AB erbjuder säker drift, molntjänsten Clearsky 365 och AI-tjänster: konsulting, utbildning och workshops samt förändringsledning för AI-implementation.',
    services: ['AI-konsulttjänster', 'AI-utbildning och workshops', 'Förändringsledning (AI)', 'Cybersäkerhet', 'Säker drift (servrar, co-location)', 'Clearsky 365 (svensk molntjänst)'],
    cases: 'Webbplatsen listar inga namngivna kundcase. Certifieringar: ISO 14001:2015, ISO 27001:2022 (pågående).',
    email: 'info@lanassistans.se',
    phone: '010-171 94 00',
    address: 'Malmgatan 5, 602 23 Norrköping',
    website: 'https://lanassistans.se',
  },
  {
    slug: 'nordlo',
    name: 'Nordlo',
    letter: 'N',
    tone: 'bg-red-100 text-red-700',
    city: 'Jönköping',
    region: 'Jönköpings län',
    text: 'Nordlo är en IT-partner som levererar driftlösningar, managerade tjänster och IT-outsourcing. Jönköpingskontoret listar "Digital strategi och AI" bland sina tjänster, utan att beskriva AI-erbjudandet närmare.',
    services: ['Cloud och infrastruktur', 'Säkerhet', 'Digital strategi och AI', 'Modern arbetsplats', 'IT-drift'],
    cases: 'Jönköpingssidan nämner inga namngivna kundcase.',
    email: 'jonkoping@nordlo.com',
    phone: '036-440 07 00',
    website: 'https://nordlo.com/kontor/jonkoping',
  },
  {
    slug: 'consid',
    name: 'Consid',
    letter: 'C',
    tone: 'bg-fuchsia-100 text-fuchsia-700',
    city: 'Helsingborg',
    region: 'Skåne län',
    text: 'Consid beskriver sig som en helhetspartner inom it, affärsutveckling och kommunikation. Bolaget uppger att man har en egen AI-manager och interna utbildningar som certifierar konsulter inom AI-lösningar, och är partner i Anthropics Claude Partner Network.',
    services: ['Data, AI och analys', 'Systemutveckling', 'Digital transformation', 'Employee experience (EX)', 'Customer experience (CX)', 'Strategi och ledarskapsrådgivning'],
    cases: 'Bolaget beskriver bland annat ett AI-projekt för kunskapsstöd inom cancervård och en AI-golfapp (deWiz). Kundloggor visas för bland annat Chalmers, SJ, ICA och Scania, utan projektbeskrivning.',
    address: 'Kungsgatan 2, 252 21 Helsingborg',
    website: 'https://www.consid.com/sv/',
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
  {
    slug: 'linkoping',
    name: 'Linköping',
    region: 'Östergötlands län',
    companies: [
      { slug: 'prevas', location: 'Linköping', address: 'Stora Torget 4, 582 19 Linköping' },
      { slug: 'mabema', location: 'Linköping' },
      { slug: 'sigma-technology', location: 'Linköping' },
    ],
  },
  {
    slug: 'orebro',
    name: 'Örebro',
    region: 'Örebro län',
    companies: [
      { slug: 'sigma-technology', location: 'Örebro, bland flera orter' },
      { slug: 'cgi', location: 'Örebro' },
      { slug: 'knowit', location: 'Örebro' },
    ],
  },
  {
    slug: 'vasteras',
    name: 'Västerås',
    region: 'Västmanlands län',
    companies: [
      { slug: 'prevas', location: 'Västerås' },
      { slug: 'sigma-technology', location: 'Västerås', address: 'B26 – Coworking, Port-Anders gata 9, 722 12 Västerås' },
      { slug: 'hiq', location: 'Västerås' },
    ],
  },
  {
    slug: 'helsingborg',
    name: 'Helsingborg',
    region: 'Skåne län',
    companies: [
      { slug: 'sigma-technology', location: 'Helsingborg' },
      { slug: 'consid', location: 'Helsingborg' },
      { slug: 'sogeti', location: 'Helsingborg' },
    ],
  },
  {
    slug: 'norrkoping',
    name: 'Norrköping',
    region: 'Östergötlands län',
    companies: [
      { slug: 'consid', location: 'Norrköping', address: 'Gamla Rådstugugatan 33, 602 24 Norrköping' },
      { slug: 'sigma-technology', location: 'Norrköping' },
      { slug: 'lan-assistans', location: 'Norrköping' },
    ],
  },
  {
    slug: 'jonkoping',
    name: 'Jönköping',
    region: 'Jönköpings län',
    companies: [
      { slug: 'sigma-technology', location: 'Jönköping' },
      { slug: 'consid', location: 'Jönköping', address: 'Lillsjöraden 22, 553 20 Jönköping' },
      { slug: 'nordlo', location: 'Jönköping' },
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
