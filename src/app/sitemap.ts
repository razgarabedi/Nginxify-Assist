// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getContent } from '@/actions/content-actions';
import { allServices } from '@/lib/services-data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nginxify.com'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allContentData = await getContent();

  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/services`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/how-it-works`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    // Add other static pages if any
  ];

  const servicePageEntries = allServices.map(service => ({
    url: `${BASE_URL}/services/${service.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    // lastModified: new Date(), // Optionally add if you track modifications
  }));

  // Assuming your content.json structure allows determining last modification,
  // or you can use a default date. For simplicity, not adding lastModified for now.

  // Create alternate language entries if your site supports distinct URLs per language
  // For this example, we assume the same URL serves content based on client-side language preference,
  // so hreflang tags in metadata are more appropriate than separate sitemap entries per language.
  // If you had /en/contact, /de/contact, you would add them here.

  // Example of how you might add localized URLs if they existed:
  // const localizedStaticPages = staticPages.flatMap(page => [
  //   { ...page, url: page.url.replace(BASE_URL, `${BASE_URL}/de`) }, // if /de prefix exists
  //   { ...page, url: page.url.replace(BASE_URL, `${BASE_URL}/en`) }, // if /en prefix exists
  // ]);


  return [
    ...staticPages,
    ...servicePageEntries,
  ];
}
