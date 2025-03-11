import { MetadataRoute } from 'next'
import { getAllNotaries, NotaryBase } from '@/lib/supabase'

type ChangeFrequency = 'daily' | 'weekly' | 'monthly' | 'always' | 'hourly' | 'yearly' | 'never'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notaries = await getAllNotaries()

  // Base URLs
  const routes = [
    {
      url: 'https://notaryfindernow.com',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: 'https://notaryfindernow.com/search',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: 'https://notaryfindernow.com/services',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: 'https://notaryfindernow.com/about',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: 'https://notaryfindernow.com/contact',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
  ]

  // Add notary profile URLs
  const notaryUrls = notaries.map((notary: NotaryBase) => ({
    url: `https://notaryfindernow.com/${notary.state.toLowerCase()}/${notary.city.toLowerCase()}/${notary.id}`,
    lastModified: notary.updated_at || new Date().toISOString(),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.8,
  }))

  // Add state URLs
  const states = Array.from(new Set(notaries.map(n => n.state.toLowerCase())))
  
  const stateUrls = states.map(state => ({
    url: `https://notaryfindernow.com/${state}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.9,
  }))

  // Add city URLs
  const cities = Array.from(new Set(notaries.map(n => `${n.state.toLowerCase()}/${n.city.toLowerCase()}`)))
  
  const cityUrls = cities.map(cityPath => ({
    url: `https://notaryfindernow.com/${cityPath}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as ChangeFrequency,
    priority: 0.8,
  }))

  return [...routes, ...stateUrls, ...cityUrls, ...notaryUrls]
} 