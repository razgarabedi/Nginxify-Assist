
'use client'; 

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User } from 'lucide-react';
import Image from "next/image";
import Link from "next/link"; 
import { useLanguage } from '@/context/language-context'; 
import { allServices as serviceDefinitions } from '@/lib/services-data'; // Static definitions for structure, icons
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
      try {
        const allContent = await getContent();
        setPageContent(allContent.servicesPage);

        // Merge static definitions (slug, icon, category) with dynamic text content
        const mergedServices: DisplayService[] = serviceDefinitions.map(def => {
          const dynamicContent = allContent.servicesItems[def.slug] || {} as ServiceItemContentData;
          return {
            ...def, // slug, icon, category from definition
            ...dynamicContent, // titleDe, titleEn, etc. from JSON
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

  if (isLoading || !pageContent) {
    return (
      <div className="space-y-10 md:space-y-12 lg:space-y-16">
        <section className="text-center px-4">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </section>
        <section className="space-y-6 md:space-y-8">
          <div className="px-4 md:px-0">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {[1, 2].map(i => <ServiceCardSkeleton key={`club-skel-${i}`} />)}
          </div>
        </section>
        <section className="space-y-6 md:space-y-8">
          <div className="px-4 md:px-0">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {[1, 2].map(i => <ServiceCardSkeleton key={`ind-skel-${i}`} />)}
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
    <div className="space-y-10 md:space-y-12 lg:space-y-16"> {/* Consistent spacing */}
      <section className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{translations.pageTitle}</h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          {translations.pageDescription}
        </p>
      </section>

      {/* Section for Clubs */}
      <section id="vereine" className="space-y-6 md:space-y-8 scroll-mt-16 md:scroll-mt-20">
        <div className="px-4 md:px-0"> 
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3"> 
            <Users className="text-primary h-6 w-6 md:h-7 md:w-7 flex-shrink-0" /> 
            {translations.clubSectionTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg"> 
            {translations.clubSectionDescription}
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"> {/* Consistent gap */}
          {clubServices.map((service, index) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="group block" aria-label={language === 'en' ? service.titleEn : service.titleDe}>
                <ServiceCard
                  icon={React.cloneElement(service.icon, { className: "text-primary h-5 w-5 md:h-6 md:w-6" })} 
                  title={language === 'en' ? service.titleEn : service.titleDe}
                  description={language === 'en' ? service.descriptionEn : service.descriptionDe}
                  imageUrl={service.imageUrl}
                  imageHint={service.imageHint}
                  isPriority={index < 1} // Prioritize the first image in this list
                />
            </Link>
          ))}
        </div>
      </section>

      {/* Section for Individuals */}
      <section id="privatpersonen" className="space-y-6 md:space-y-8 scroll-mt-16 md:scroll-mt-20">
         <div className="px-4 md:px-0"> 
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3"> 
            <User className="text-primary h-6 w-6 md:h-7 md:w-7 flex-shrink-0" /> 
            {translations.individualSectionTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg"> 
            {translations.individualSectionDescription}
            </p>
         </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"> {/* Consistent gap */}
          {individualServices.map((service, index) => (
             <Link key={service.slug} href={`/services/${service.slug}`} className="group block" aria-label={language === 'en' ? service.titleEn : service.titleDe}>
                <ServiceCard
                   icon={React.cloneElement(service.icon, { className: "text-primary h-5 w-5 md:h-6 md:w-6" })} 
                   title={language === 'en' ? service.titleEn : service.titleDe}
                   description={language === 'en' ? service.descriptionEn : service.descriptionDe}
                   imageUrl={service.imageUrl}
                   imageHint={service.imageHint}
                   isPriority={index < 1} // Prioritize the first image in this list
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
  imageUrl: string;
  imageHint: string;
  isPriority?: boolean;
}

function ServiceCard({ icon, title, description, imageUrl, imageHint, isPriority = false }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card"> 
       <div className="relative w-full aspect-video"> 
         <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 639px) 100vw, 50vw" 
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imageHint}
          priority={isPriority}
        />
      </div>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 sm:p-6 pb-2"> 
        <div className="flex-shrink-0 pt-0.5">{icon}</div>
        <div className="flex-grow">
          <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 sm:p-6 pt-0"> 
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription> 
      </CardContent>
    </Card>
  );
}

function ServiceCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg flex flex-col h-full bg-card">
      <Skeleton className="w-full aspect-video" />
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 sm:p-6 pb-2">
        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 pt-0.5" />
        <div className="flex-grow">
          <Skeleton className="h-6 w-3/4" />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 sm:p-6 pt-0">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

