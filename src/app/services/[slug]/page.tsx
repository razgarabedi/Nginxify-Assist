'use client';

import React, { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { allServices as serviceDefinitions } from '@/lib/services-data';
import Image from "next/image";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getContent } from '@/actions/content-actions';
import type { DisplayService, ServiceItemContentData } from '@/lib/content-types';

interface ServiceDetailPageProps {
  // As per Next.js error: "params is now a Promise and should be unwrapped with React.use()"
  // This suggests the 'params' prop itself, when received in a Client Component that Next.js
  // instruments for future compatibility, should be treated as a Promise.
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params: routeParamsPromise }: ServiceDetailPageProps) {
   // Unwrap the params promise using React.use(). This will suspend the component
   // if the promise is not yet resolved, and return the resolved value once available.
   const routeParams = use(routeParamsPromise);
   const { slug } = routeParams;


   const { language } = useLanguage();
   const [service, setService] = useState<DisplayService | null | undefined>(undefined); // Initial state undefined for loading

   useEffect(() => {
     async function loadServiceContent() {
       // slug is guaranteed to be available here because `use(routeParamsPromise)`
       // would have suspended if the promise wasn't resolved.
       try {
         const allContent = await getContent();
         const serviceDef = serviceDefinitions.find(s => s.slug === slug);

         if (serviceDef) {
           const dynamicContent = allContent.servicesItems[slug] || {} as ServiceItemContentData;
           const mergedService: DisplayService = {
             ...serviceDef, // slug, icon, category from definition
             ...dynamicContent, // titleDe, titleEn, etc. from JSON
           };
           setService(mergedService);
         } else {
           setService(null); // Service definition not found
         }
       } catch (error) {
         console.error("Failed to load service content:", error);
         setService(null); // Error loading
       }
     }
     
     // `slug` is resolved by this point due to the `use(routeParamsPromise)` call.
     // No need to check for `slug`'s existence again before calling `loadServiceContent`.
     loadServiceContent();
     
   }, [slug]); // Depend on the resolved slug

  // `use(routeParamsPromise)` suspends rendering until `routeParams` (and thus `slug`) are resolved.
  // The component will only proceed past the `use` call once `slug` is available.
  // Therefore, `slug` will be defined here.
  
  // This state means the service content itself is being fetched.
  if (service === undefined) { 
    return (
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <Skeleton className="h-10 w-36 mb-4" />
         <div className="flex items-center gap-3">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-10 w-3/4" />
         </div>
         <Skeleton className="w-full aspect-[16/9] rounded-lg mb-6" /> {/* Use aspect ratio */}
         <div className="space-y-3">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-4/5" />
         </div>
         <div className="pt-6 border-t mt-8">
            <Skeleton className="h-11 w-full sm:w-48" />
         </div>
      </div>
    );
  }

  if (!service) { // Service definition or content not found after attempting to load
    notFound();
  }

  const title = language === 'en' ? service.titleEn : service.titleDe;
  const detailedDescription = language === 'en' ? service.detailedDescriptionEn : service.detailedDescriptionDe;

  const translations = {
    backButton: language === 'en' ? 'Back to Services' : 'Zurück zu den Leistungen',
    contactButton: language === 'en' ? 'Request This Service' : 'Diese Leistung anfragen',
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Button variant="outline" asChild className="mb-4">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations.backButton}
        </Link>
      </Button>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
         {React.cloneElement(service.icon, { className: 'h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0' })}
         {title}
      </h1>

       <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-md"> {/* Consistent aspect ratio */}
         <Image
           src={service.imageUrl || "https://picsum.photos/1280/720"} // Fallback image
           alt={title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw" // Adjusted sizes
           style={{ objectFit: 'cover' }}
           data-ai-hint={service.imageHint || "technology service"} // Fallback hint
           priority // Make LCP image priority
         />
       </div>

       <div
         className="prose prose-sm sm:prose md:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground space-y-4 prose-a:text-primary hover:prose-a:underline"
         dangerouslySetInnerHTML={{ __html: detailedDescription }}
       />


       <div className="pt-6 border-t mt-8">
         <Button size="lg" asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Link href="/contact">{translations.contactButton}</Link>
         </Button>
       </div>
    </div>
  );
}
