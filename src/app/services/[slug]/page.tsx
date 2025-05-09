
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
// Removed Metadata and ResolvingMetadata imports as generateMetadata is removed.

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nginxify.com'; // No longer needed here

// Removed generateMetadata function as it's not allowed in client components.
// Metadata for this page will be handled by the nearest parent Server Component (e.g., layout.tsx).


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
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <Skeleton className="h-10 w-36 mb-6" />
         <div className="flex items-center gap-3 mb-6">
             <Skeleton className="h-8 w-8 rounded-full" />
             <Skeleton className="h-10 w-3/4" />
         </div>
         <Skeleton className="w-full aspect-[16/9] rounded-lg mb-6 shadow-md" />
         <div className="space-y-4">
             <Skeleton className="h-5 w-full" />
             <Skeleton className="h-5 w-full" />
             <Skeleton className="h-5 w-5/6" />
             <Skeleton className="h-5 w-full" />
             <Skeleton className="h-5 w-4/5" />
         </div>
         <div className="pt-8 border-t mt-10">
            <Skeleton className="h-11 w-full sm:w-52" />
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
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 lg:px-0 py-8">
      <Button variant="outline" asChild className="mb-4 print:hidden self-start">
        <Link href="/services" className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {translations.backButton}
        </Link>
      </Button>

      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight flex items-center gap-3">
          {React.cloneElement(service.icon, { className: 'h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 text-primary flex-shrink-0' })}
          {title}
        </h1>
      </header>
      

       <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg shadow-lg mb-6 md:mb-8">
         <Image
           src={service.imageUrl || placeholderImage}
           alt={title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 896px" 
           style={{ objectFit: 'cover' }}
           data-ai-hint={service.imageHint || "technology service"}
           priority 
         />
       </div>

       {notice && (
         <Alert className="mb-6 md:mb-8 bg-secondary/50 dark:bg-secondary/20 border-primary/50">
           <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
           <AlertTitle className="font-semibold text-primary">{translations.noticeTitle}</AlertTitle>
           <AlertDescription className="text-foreground/80">
             {notice}
           </AlertDescription>
         </Alert>
       )}

       <article
         className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none dark:prose-invert 
                    prose-headings:font-semibold prose-headings:text-foreground 
                    prose-p:text-foreground/90 prose-li:text-foreground/90 
                    prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline
                    prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
                    space-y-4"
         dangerouslySetInnerHTML={{ __html: detailedDescription }}
       />


       <footer className="pt-6 md:pt-8 border-t mt-8 md:mt-10 print:hidden">
         <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <Link href="/contact">{translations.contactButton}</Link>
         </Button>
       </footer>
    </div>
  );
}
