
'use client';

import React, { useEffect, useState } from 'react'; // Ensure React is imported
import { useParams, notFound } from 'next/navigation'; // Import useParams
import { useLanguage } from '@/context/language-context';
import { allServices, type Service } from '@/lib/services-data';
import Image from "next/image";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Remove params from props type, as we'll use the hook
// interface ServiceDetailPageProps {
//   params: { slug: string };
// }

export default function ServiceDetailPage(/* Remove params from props */) {
  const params = useParams<{ slug: string }>(); // Use the hook to get params
  const { slug } = params; // Destructure slug from the hook's return value
  const { language } = useLanguage();
  const [service, setService] = useState<Service | null | undefined>(undefined); // Initial state undefined for loading

  useEffect(() => {
    // Find the service based on the slug from useParams
    const foundService = allServices.find(s => s.slug === slug);
    setService(foundService ?? null); // Set to null if not found after check
  }, [slug]); // Depend on slug from params

  // Handle loading state
  if (service === undefined) {
    return (
      <div className="space-y-6 md:space-y-8">
         {/* Skeleton Loading State */}
         <div className="animate-pulse">
           <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
           <div className="h-10 bg-muted rounded w-3/4 mb-6"></div>
           <div className="relative h-64 sm:h-80 md:h-96 w-full bg-muted rounded-lg mb-6"></div>
           <div className="space-y-3">
             <div className="h-4 bg-muted rounded w-full"></div>
             <div className="h-4 bg-muted rounded w-5/6"></div>
             <div className="h-4 bg-muted rounded w-full"></div>
             <div className="h-4 bg-muted rounded w-4/5"></div>
           </div>
         </div>
      </div>
    );
  }

  // Handle not found state
  if (!service) {
    notFound(); // Trigger Next.js 404 page
  }

  const title = language === 'en' ? service.titleEn : service.titleDe;
  const detailedDescription = language === 'en' ? service.detailedDescriptionEn : service.detailedDescriptionDe;

  const translations = {
    backButton: language === 'en' ? 'Back to Services' : 'Zurück zu den Leistungen',
    contactButton: language === 'en' ? 'Request This Service' : 'Diese Leistung anfragen',
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back Button */}
      <Button variant="outline" asChild className="mb-4">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations.backButton}
        </Link>
      </Button>

      {/* Service Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
         {React.cloneElement(service.icon, { className: 'h-7 w-7 sm:h-8 sm:w-8 text-primary' })} {title}
      </h1>

      {/* Service Image */}
       <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden rounded-lg shadow-md">
         <Image
           src={service.imageUrl}
           alt={title}
           fill
           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw" // Simplify sizes for detail view
           style={{ objectFit: 'cover' }}
           data-ai-hint={service.imageHint}
           priority // Prioritize image loading on detail pages
           unoptimized // Keep if using external URLs like Unsplash/picsum
         />
       </div>

      {/* Detailed Description */}
      {/* Use dangerouslySetInnerHTML for the HTML content from the data file */}
       <div
         className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert space-y-4 text-foreground" // Ensure text color contrasts
         dangerouslySetInnerHTML={{ __html: detailedDescription }}
       />


       {/* Call to Action */}
       <div className="pt-6 border-t mt-8">
         <Button size="lg" asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Link href="/contact">{translations.contactButton}</Link>
         </Button>
       </div>
    </div>
  );
}

// Optional: If using dynamic routes often, consider generating static paths
// export async function generateStaticParams() {
//   // Make sure allServices is available here if uncommenting
//   return allServices.map((service) => ({
//     slug: service.slug,
//   }));
// }

// Optional: Add generateMetadata if needed for SEO
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const service = allServices.find(s => s.slug === params.slug);
//   if (!service) {
//     return { title: 'Service Not Found' };
//   }
//   // You might want to fetch language dynamically or decide on a default
//   const title = service.titleDe; // Or titleEn based on logic
//   return {
//     title: `${title} | Nginxify Assist`,
//     description: service.descriptionDe, // Or descriptionEn
//   };
// }
