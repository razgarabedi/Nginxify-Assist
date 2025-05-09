
'use client'; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User } from 'lucide-react';
import Image from "next/image";
import Link from "next/link"; 
import { useLanguage } from '@/context/language-context'; 
import { allServices as serviceDefinitions } from '@/lib/services-data';
import React, { useEffect, useState } from 'react';
import { getContent } from '@/actions/content-actions';
import type { ServicesPageData, DisplayService, ServiceItemContentData } from '@/lib/content-types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ServicesPage() {
  const { language } = useLanguage(); 
  const [pageContent, setPageContent] = useState<ServicesPageData | null>(null);
  const [services, setServices] = useState<DisplayService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const allContent = await getContent();
        setPageContent(allContent.servicesPage);

        const mergedServices: DisplayService[] = serviceDefinitions.map(def => {
          const dynamicContent = allContent.servicesItems[def.slug] || {} as ServiceItemContentData;
          return {
            ...def, 
            ...dynamicContent, 
          };
        });
        setServices(mergedServices);

      } catch (error) {
        console.error("Failed to load services content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  if (isLoading || !pageContent || services.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <section className="text-center px-4 mb-10 md:mb-12 lg:mb-16">
          <Skeleton className="h-12 w-1/2 mx-auto mb-5" />
          <Skeleton className="h-7 w-3/4 mx-auto" />
        </section>
        <section className="space-y-12 md:space-y-16 lg:space-y-20">
          <div>
            <div className="px-4 md:px-0 mb-6 md:mb-8">
              <Skeleton className="h-9 w-1/3 mb-3" />
              <Skeleton className="h-5 w-full max-w-2xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {[1, 2].map(i => <ServiceCardSkeleton key={`club-skel-${i}`} />)}
            </div>
          </div>
          <div>
            <div className="px-4 md:px-0 mb-6 md:mb-8">
              <Skeleton className="h-9 w-1/3 mb-3" />
              <Skeleton className="h-5 w-full max-w-2xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {[1, 2].map(i => <ServiceCardSkeleton key={`ind-skel-${i}`} />)}
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  const clubServices = services.filter(s => s.category === 'club');
  const individualServices = services.filter(s => s.category === 'individual');

  const translations = {
    pageTitle: language === 'en' ? pageContent.pageTitle_en : pageContent.pageTitle_de,
    pageDescription: language === 'en' ? pageContent.pageDescription_en : pageContent.pageDescription_de,
    clubSectionTitle: language === 'en' ? pageContent.clubSectionTitle_en : pageContent.clubSectionTitle_de,
    clubSectionDescription: language === 'en' ? pageContent.clubSectionDescription_en : pageContent.clubSectionDescription_de,
    individualSectionTitle: language === 'en' ? pageContent.individualSectionTitle_en : pageContent.individualSectionTitle_de,
    individualSectionDescription: language === 'en' ? pageContent.individualSectionDescription_en : pageContent.individualSectionDescription_de,
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <section className="text-center px-4 mb-10 md:mb-12 lg:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5">{translations.pageTitle}</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          {translations.pageDescription}
        </p>
      </section>

      <section id="vereine" className="space-y-8 md:space-y-10 scroll-mt-20 md:scroll-mt-24 mb-12 md:mb-16 lg:mb-20">
        <div className="px-2 md:px-0"> 
            <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 mb-3"> 
            <Users className="text-primary h-7 w-7 md:h-8 md:w-8 flex-shrink-0" /> 
            {translations.clubSectionTitle}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl"> 
            {translations.clubSectionDescription}
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {clubServices.map((service, index) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group block" aria-label={language === 'en' ? service.titleEn : service.titleDe}>
                <ServiceCard
                  icon={React.cloneElement(service.icon, { className: "text-primary h-6 w-6 md:h-7 md:w-7" })} 
                  title={language === 'en' ? service.titleEn : service.titleDe}
                  description={language === 'en' ? service.descriptionEn : service.descriptionDe}
                  imageUrl={service.imageUrl}
                  imageHint={service.imageHint}
                  isPriority={index < 2} 
                />
            </Link>
          ))}
        </div>
      </section>

      <section id="privatpersonen" className="space-y-8 md:space-y-10 scroll-mt-20 md:scroll-mt-24">
         <div className="px-2 md:px-0"> 
            <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 mb-3"> 
            <User className="text-primary h-7 w-7 md:h-8 md:w-8 flex-shrink-0" /> 
            {translations.individualSectionTitle}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl"> 
            {translations.individualSectionDescription}
            </p>
         </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {individualServices.map((service, index) => (
             <Link key={service.slug} href={`/services/${service.slug}`} className="group block" aria-label={language === 'en' ? service.titleEn : service.titleDe}>
                <ServiceCard
                   icon={React.cloneElement(service.icon, { className: "text-primary h-6 w-6 md:h-7 md:w-7" })} 
                   title={language === 'en' ? service.titleEn : service.titleDe}
                   description={language === 'en' ? service.descriptionEn : service.descriptionDe}
                   imageUrl={service.imageUrl}
                   imageHint={service.imageHint}
                   isPriority={index < 2 && clubServices.length === 0} 
                />
             </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  isPriority?: boolean;
}

function ServiceCard({ icon, title, description, imageUrl, imageHint, isPriority = false }: ServiceCardProps) {
  const placeholderImage = "https://picsum.photos/seed/" + title.replace(/\s/g, '') + "/600/338"; // Adjusted for 16:9

  return (
    <Card className="overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card dark:bg-secondary/30 rounded-xl"> 
       <div className="relative w-full aspect-[16/9]"> 
         <Image
          src={imageUrl || placeholderImage}
          alt={title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 500px" 
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imageHint || "service topic"}
          priority={isPriority}
          loading={isPriority ? 'eager' : 'lazy'}
        />
      </div>
      <CardHeader className="flex flex-row items-start gap-3.5 space-y-0 p-5 sm:p-6 pb-2.5"> 
        <div className="flex-shrink-0 pt-1">{icon}</div>
        <div className="flex-grow">
          <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 sm:p-6 pt-0"> 
        <CardDescription className="text-base text-muted-foreground line-clamp-3">{description}</CardDescription> 
      </CardContent>
    </Card>
  );
}

function ServiceCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg flex flex-col h-full bg-card dark:bg-secondary/30 rounded-xl">
      <Skeleton className="w-full aspect-[16/9]" />
      <CardHeader className="flex flex-row items-start gap-3.5 space-y-0 p-5 sm:p-6 pb-2.5">
        <Skeleton className="h-7 w-7 rounded-full flex-shrink-0 mt-1" />
        <div className="flex-grow">
          <Skeleton className="h-7 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-5 sm:p-6 pt-0 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
      </CardContent>
    </Card>
  );
}

