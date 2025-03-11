import { Metadata } from 'next'
import { getNotaryById, NotaryBase } from '@/lib/supabase'

interface NotaryDetailPageProps {
  params: {
    'notary-id': string
  }
}

export async function generateMetadata(
  { params }: NotaryDetailPageProps
): Promise<Metadata> {
  const notary = await getNotaryById(params['notary-id'])
  
  if (!notary) {
    return {
      title: 'Notary Not Found',
      description: 'The requested notary profile could not be found.'
    }
  }
  
  const availability = notary.availability?.length > 0
    ? notary.availability.join(', ')
    : 'by appointment'

  const services = notary.services?.length > 0
    ? notary.services.join(', ')
    : 'Notary Services'

  const description = `Book ${notary.name}, a professional notary ${notary.business_type === 'mobile' ? 'serving' : 'located in'} ${notary.city}, ${notary.state}. ${services}. Available ${availability}.`

  return {
    title: `${notary.name} - Mobile Notary in ${notary.city}, ${notary.state}`,
    description,
    openGraph: {
      title: `${notary.name} - Mobile Notary in ${notary.city}, ${notary.state}`,
      description,
      images: [
        {
          url: notary.profile_image_url || '/images/default-notary.jpg',
          width: 800,
          height: 600,
          alt: notary.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${notary.name} - Mobile Notary in ${notary.city}, ${notary.state}`,
      description,
      images: [notary.profile_image_url || '/images/default-notary.jpg'],
    },
    alternates: {
      canonical: `https://notaryfindernow.com/${notary.state}/${notary.city}/${params['notary-id']}`,
    },
  }
} 