
'use client';

import React, { useEffect, useState, use } from 'react'; 
import { notFound } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { allServices as serviceDefinitions } from '@/lib/services-data';
import Image from "next/image";
import { ArrowLeft, Info } from 'lucide-react'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getContent } from '@/actions/content-actions';
import type { DisplayService, ServiceItemContentData } from '@/lib/content-types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface ServiceDetailPageProps {
  params: { slug: string }; 
}


export default function ServiceDetailPage({ params: paramsPromise }: ServiceDetailPageProps) {
   // Correctly unwrap the promise for params
   const routeParams = use(paramsPromise);
   const { slug } = routeParams; 


   const { language } = useLanguage();
   const [service, setService] = useState<DisplayService | null | undefined>(undefined); 

   useEffect(() => {
     async function loadServiceContent() {
       if (!slug) {
         setService(null); 
         return;
       }

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
         console.error("Failed to load service content for slug:", slug, error);
         setService(null);
       }
     }
     
     loadServiceContent();
     
   }, [slug]); 
  
  
  if (service === undefined) { 
    return (
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
         <Skeleton className="h-10 w-40 mb-6 md:mb-8" />
         <div className="flex items-center gap-4 mb-6 md:mb-8">
             <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full" />
             <Skeleton className="h-10 w-3/4 md:h-12" />
         </div>
         <Skeleton className="w-full aspect-video sm:aspect-[16/9] rounded-xl mb-6 md:mb-8 shadow-lg" />
         <div className="space-y-4">
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-5/6" />
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-4/5" />
         </div>
         <div className="pt-8 md:pt-10 border-t mt-10 md:mt-12">
            <Skeleton className="h-12 w-full sm:w-56" />
         </div>
      </div>
    );
  }

  
  if (!service) { 
    notFound();
  }

  
  const title = language === 'en' ? service.titleEn : service.titleDe;
  const detailedDescription = language === 'en' ? service.detailedDescriptionEn : service.detailedDescriptionDe;
  const noticeKey = `serviceNote_${language}` as keyof DisplayService;
  const notice = service[noticeKey] as string | undefined;


  const translations = {
    backButton: language === 'en' ? 'Back to Services' : 'Zurück zu den Leistungen',
    contactButton: language === 'en' ? 'Request This Service' : 'Diese Leistung anfragen',
    noticeTitle: language === 'en' ? 'Please Note' : 'Bitte beachten Sie',
  };
  
  const placeholderImage = `https://picsum.photos/seed/${service.slug}/1280/720`;

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 lg:px-0 py-8 md:py-12">
      <Button variant="outline" asChild className="mb-4 md:mb-6 print:hidden self-start text-sm sm:text-base">
        <Link href="/services" className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {translations.backButton}
        </Link>
      </Button>

      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight flex items-center gap-3 sm:gap-4">
          {React.cloneElement(service.icon, { className: 'h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary flex-shrink-0' })}
          {title}
        </h1>
      </header>
      
       <div className="relative w-full aspect-video sm:aspect-[16/9] overflow-hidden rounded-xl shadow-xl mb-6 md:mb-8">
         <Image
           src={service.imageUrl || placeholderImage}
           alt={title}
           fill
           sizes="(max-width: 640px) 100vw, (max-width: 1023px) 80vw, 896px" 
           style={{ objectFit: 'cover' }}
           data-ai-hint={service.imageHint || "technology service"}
           priority 
         />
       </div>

       {notice && (
         <Alert className="mb-6 md:mb-8 bg-secondary/50 dark:bg-secondary/20 border-l-4 border-primary rounded-md p-5">
           <Info className="h-6 w-6 text-primary flex-shrink-0 absolute left-4 top-1/2 -translate-y-1/2" />
           <div className="ml-10"> {/* Ensure content doesn't overlap with icon */}
            <AlertTitle className="font-semibold text-primary text-lg">{translations.noticeTitle}</AlertTitle>
            <AlertDescription className="text-foreground/80 text-base">
                {notice}
            </AlertDescription>
           </div>
         </Alert>
       )}

       <article
         className="prose prose-base sm:prose-lg lg:prose-xl xl:prose-2xl max-w-none dark:prose-invert 
                    prose-headings:font-bold prose-headings:text-foreground 
                    prose-p:text-foreground/90 prose-li:text-foreground/90 
                    prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline
                    prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                    space-y-5 leading-relaxed" // Adjusted leading for readability
         dangerouslySetInnerHTML={{ __html: detailedDescription }}
       />


       <footer className="pt-6 md:pt-10 border-t mt-8 md:mt-12 print:hidden">
         <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-base sm:text-lg py-3 px-8">
            <Link href="/contact">{translations.contactButton}</Link>
         </Button>
       </footer>
    </div>
  );
}

