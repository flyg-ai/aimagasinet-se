import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITIES, findCity, companyInCity } from '@/lib/ai-konsult/companies';
import AiKonsultProfilePage from '@/components/AiKonsultProfilePage';

type Props = { params: { city: string; company: string } };

export function generateStaticParams() {
  return CITIES.flatMap((city) => city.companies.map((c) => ({ city: city.slug, company: c.slug })));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = findCity(params.city);
  const company = city && companyInCity(city, params.company);
  if (!city || !company) return {};
  return {
    title: `${company.name}: AI-konsult i ${city.name}`,
    description: `${company.name} i ${city.name}. ${company.text} Uppgifterna är hämtade från bolagets egen webbplats.`,
    alternates: { canonical: `https://aimagasinet.se/ai-konsult/${city.slug}/${company.slug}/` },
  };
}

export default function Profil({ params }: Props) {
  const city = findCity(params.city);
  const company = city && companyInCity(city, params.company);
  if (!city || !company) notFound();
  return <AiKonsultProfilePage city={city} company={company} />;
}
