import { getNotaryById } from '@/lib/supabase';
import { Metadata } from 'next';
import NotaryDetailClient from './NotaryDetailClient';

type PageParams = {
  'notary-id': string;
  state: string;
  city: string;
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<PageParams>
}): Promise<Metadata> {
  const resolvedParams = await params
  const notary = await getNotaryById(resolvedParams['notary-id'])
  
  if (!notary) {
    return {
      title: 'Notary Not Found',
    }
  }

  return {
    title: `${notary.name} - Notary Public in ${resolvedParams.city}, ${resolvedParams.state}`,
    description: `Book appointments with ${notary.name}, a certified notary public in ${resolvedParams.city}, ${resolvedParams.state}. View services, rates, and availability.`,
  }
}

export default async function NotaryDetailPage({ 
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const notary = await getNotaryById(resolvedParams['notary-id'])

  if (!notary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Notary Not Found</h1>
          <p className="mt-2 text-gray-600">The notary you&apos;re looking for could not be found.</p>
        </div>
      </div>
    )
  }

  return <NotaryDetailClient notary={notary} />
} 