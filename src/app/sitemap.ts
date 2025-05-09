// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getContent } from '@/actions/content-actions';
import { allServices } from '@/lib/services-data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nginxify.com'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getContent is called to ensure content.json is potentially created if it doesn't exist,
  // though its direct output (allContentData) isn't used for generating service slugs here,
  // as service slugs are statically defined in services-data.tsx.
  await getContent();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/services`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/how-it-works`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    // Add other static pages if any
  ];

  const servicePageEntries: MetadataRoute.Sitemap = allServices.map(service => ({
    url: `${BASE_URL}/services/${service.slug}`,
    changeFrequency: 'monthly', // Content for these pages might change if edited in admin
    priority: 0.7,
    // lastModified: new Date(), // Consider adding if you track modification dates for service content
  }));

  return [
    ...staticPages,
    ...servicePageEntries,
  ];
}

