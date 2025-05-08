
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
  params: { slug: string }; 
}


export default function ServiceDetailPage({ params: paramsPromise }: ServiceDetailPageProps) {
   const routeParams = use(paramsPromise);
   const { slug } = routeParams; 


   const { language } = useLanguage();
   const [service, setService] = useState<DisplayService | null | undefined>(undefined); 

   useEffect(() => {
     async function loadServiceContent() {
       if (!slug) return; 

       try {
         const allContent = await getContent();
         const serviceDef = serviceDefinitions.find(s => s.slug === slug);

         if (serviceDef) {
           const dynamicContent = allContent.servicesItems[slug] || {} as ServiceItemContentData;
           const mergedService: DisplayService = {
             ...serviceDef, 
             ...dynamicContent, 
           };
           setService(mergedService);
         } else {
           setService(null); 
         }
       } catch (error) {
         console.error("Failed to load service content:", error);
         setService(null);
       }
     }
     
     loadServiceContent();
     
   }, [slug]); 
  
  
  if (service === undefined) { 
    return (
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
         <Skeleton className="h-10 w-36 mb-4" />
         <div className="flex items-center gap-3">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-10 w-3/4" />
         </div>
         <Skeleton className="w-full aspect-[16/9] rounded-lg mb-6" />
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

  
  if (!service) { 
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
      <Button variant="outline" asChild className="mb-4 print:hidden">
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations.backButton}
        </Link>
      </Button>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
         {React.cloneElement(service.icon, { className: 'h-7 w-7 sm:h-8 sm:w-8 text-primary flex-shrink-0' })}
         {title}
      </h1>

       <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-md">
         <Image
           src={service.imageUrl || "https://picsum.photos/1280/720"}
           alt={title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px" 
           style={{ objectFit: 'cover' }}
           data-ai-hint={service.imageHint || "technology service"}
           priority 
         />
       </div>

       <div
         className="prose prose-sm sm:prose md:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground space-y-4 prose-a:text-primary hover:prose-a:underline"
         dangerouslySetInnerHTML={{ __html: detailedDescription }}
       />


       <div className="pt-6 border-t mt-8 print:hidden">
         <Button size="lg" asChild className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Link href="/contact">{translations.contactButton}</Link>
         </Button>
       </div>
    </div>
  );
}

// Removed generateMetadata and generateStaticParams as they are not compatible with "use client"
// Metadata should be handled in a parent layout or potentially via client-side updates if needed.
