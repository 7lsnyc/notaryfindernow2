import { getAllNotaries } from '@/lib/supabase';
import { NotaryPageClient } from './NotaryPageClient';

export async function generateStaticParams() {
  const notaries = await getAllNotaries();
  return notaries.map((notary) => ({
    id: notary.id,
  }));
}

export default async function NotaryPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  return <NotaryPageClient params={resolvedParams} />;
} 