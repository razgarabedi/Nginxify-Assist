
'use client';

import React, { useEffect, useState, use } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { allServices, type Service } from '@/lib/services-data';
import Image from "next/image";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Interface for props
interface ServiceDetailPageProps {
  params: { slug: string };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  // Use the `use` hook to get params in Client Components if needed, or access directly from props
   // const params = useParams<{ slug: string }>(); // Can use hook or props
   // Using props is simpler here as they are passed by Next.js
   const { slug } = params;


  const { language } = useLanguage();
  const [service, setService] = useState<Service | null | undefined>(undefined); // Initial state undefined for loading

  useEffect(() => {
    // Find the service based on the slug from props
    const foundService = allServices.find(s => s.slug === slug);
    setService(foundService ?? null); // Set to null if not found after check
  }, [slug]); // Depend on slug from props

  // Handle loading state
  if (service === undefined) {
    return (
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Added padding */}
         {/* Back Button Skeleton */}
         <Skeleton className="h-10 w-36 mb-4" />
         {/* Title Skeleton */}
         <div className="flex items-center gap-3">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-10 w-3/4" />
         </div>
         {/* Image Skeleton */}
         <Skeleton className="w-full aspect-video rounded-lg mb-6" />
         {/* Description Skeleton */}
         <div className="space-y-3">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-4/5" />
         </div>
          {/* CTA Button Skeleton */}
         <div className="pt-6 border-t mt-8">
            <Skeleton className="h-11 w-full sm:w-48" />
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
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Added padding */}
      {/* Back Button */}
      <Button variant="outline" asChild className="mb-4">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations.backButton}
        </Link>
      </Button>

      {/* Service Title */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
         {React.cloneElement(service.icon, { className: 'h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0' })} {/* Added flex-shrink-0 */}
         {title}
      </h1>

      {/* Service Image - Use aspect-ratio */}
       <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-md">
         <Image
           src={service.imageUrl}
           alt={title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjusted sizes for responsiveness
           style={{ objectFit: 'cover' }}
           data-ai-hint={service.imageHint}
           priority // Prioritize image loading on detail pages
           // Removed unoptimized prop
         />
       </div>

      {/* Detailed Description */}
       <div
         className="prose prose-sm sm:prose md:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground space-y-4 prose-a:text-primary hover:prose-a:underline" // Ensure links are styled correctly
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

// Removed generateStaticParams as it cannot be exported from a 'use client' component.
// Static generation for these routes can be handled via configuration if needed,
// but dynamic rendering is the default and often suitable for client components.

// Removed generateMetadata as it cannot be exported from a 'use client' component.
// Metadata should be handled in a parent layout or potentially via client-side updates if needed.

