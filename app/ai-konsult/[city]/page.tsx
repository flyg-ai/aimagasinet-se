import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITIES, findCity } from '@/lib/ai-konsult/companies';
import AiKonsultCityPage from '@/components/AiKonsultCityPage';

type Props = { params: { city: string } };

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const city = findCity(params.city);
  if (!city) return {};
  return {
    title: `AI-konsult ${city.name}: bolag och hur du väljer rätt`,
    description: `AI-konsulter i ${city.name}, med källa på varje uppgift och frågor att ställa innan du anlitar en AI-konsult.`,
    alternates: { canonical: `https://aimagasinet.se/ai-konsult/${city.slug}/` },
  };
}

export default function Stad({ params }: Props) {
  const city = findCity(params.city);
  if (!city) notFound();
  return <AiKonsultCityPage city={city} />;
}
