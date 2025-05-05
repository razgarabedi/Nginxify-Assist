
'use client'; // Make it a client component

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User } from 'lucide-react';
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook
import { allServices } from '@/lib/services-data'; // Import service data
import React from 'react'; // Import React

export default function ServicesPage() {
  const { language } = useLanguage(); // Use context

  const clubServices = allServices.filter(s => s.category === 'club');
  const individualServices = allServices.filter(s => s.category === 'individual');

  const translations = {
    pageTitle: language === 'en' ? 'Our Services' : 'Unsere Leistungen',
    pageDescription: language === 'en'
      ? 'We offer volunteer IT support for non-profit organizations and individuals. Our focus is on basic help and advice.'
      : 'Wir bieten ehrenamtliche IT-Unterstützung für gemeinnützige Organisationen und Privatpersonen. Unser Fokus liegt auf grundlegender Hilfe und Beratung.',
    clubSectionTitle: language === 'en' ? 'For Clubs & Organizations' : 'Für Vereine & Organisationen',
    clubSectionDescription: language === 'en'
      ? 'We support non-profit clubs and organizations in building their digital presence and overcoming basic IT challenges. Please note that we cannot take on complex, professional large-scale projects.'
      : 'Wir unterstützen gemeinnützige Vereine und Organisationen dabei, ihre digitale Präsenz aufzubauen und grundlegende IT-Herausforderungen zu meistern. Bitte beachten Sie, dass wir keine komplexen, professionellen Großprojekte übernehmen können.',
    individualSectionTitle: language === 'en' ? 'For Individuals' : 'Für Privatpersonen',
    individualSectionDescription: language === 'en'
      ? 'We help you with everyday IT problems and questions about computers, smartphones, and the internet.'
      : 'Wir helfen Ihnen bei alltäglichen IT-Problemen und Fragen rund um Computer, Smartphone und Internet.',
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
        <div className="px-4 md:px-0"> {/* Add padding for section header consistency */}
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3"> {/* Increased gap */}
            <Users className="text-primary h-6 w-6 md:h-7 md:w-7 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            {translations.clubSectionTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg"> {/* Added margin top */}
            {translations.clubSectionDescription}
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"> {/* Consistent gap */}
          {clubServices.map((service) => (
            // Wrap ServiceCard with Link
            <Link key={service.slug} href={`/services/${service.slug}`} className="group block" aria-label={language === 'en' ? service.titleEn : service.titleDe}>
                <ServiceCard
                  icon={React.cloneElement(service.icon, { className: "text-primary h-5 w-5 md:h-6 md:w-6" })} // Pass className to icon
                  title={language === 'en' ? service.titleEn : service.titleDe}
                  description={language === 'en' ? service.descriptionEn : service.descriptionDe}
                  imageUrl={service.imageUrl}
                  imageHint={service.imageHint}
                />
            </Link>
          ))}
        </div>
      </section>

      {/* Section for Individuals */}
      <section id="privatpersonen" className="space-y-6 md:space-y-8 scroll-mt-16 md:scroll-mt-20">
         <div className="px-4 md:px-0"> {/* Add padding for section header consistency */}
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3"> {/* Increased gap */}
            <User className="text-primary h-6 w-6 md:h-7 md:w-7 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            {translations.individualSectionTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-base sm:text-lg"> {/* Added margin top */}
            {translations.individualSectionDescription}
            </p>
         </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"> {/* Consistent gap */}
          {individualServices.map((service) => (
            // Wrap ServiceCard with Link
             <Link key={service.slug} href={`/services/${service.slug}`} className="group block" aria-label={language === 'en' ? service.titleEn : service.titleDe}>
                <ServiceCard
                   icon={React.cloneElement(service.icon, { className: "text-primary h-5 w-5 md:h-6 md:w-6" })} // Pass className to icon
                   title={language === 'en' ? service.titleEn : service.titleDe}
                   description={language === 'en' ? service.descriptionEn : service.descriptionDe}
                   imageUrl={service.imageUrl}
                   imageHint={service.imageHint}
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
}

// ServiceCard remains largely the same, but will inherit hover/focus states from the parent Link
function ServiceCard({ icon, title, description, imageUrl, imageHint }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex flex-col h-full bg-card"> {/* Added h-full and bg-card */}
       {/* Use aspect-ratio for responsive image container */}
       <div className="relative w-full aspect-video"> {/* aspect-video provides 16:9 ratio */}
         <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Sizes remain similar
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={imageHint}
          // Removed unoptimized prop
        />
      </div>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 sm:p-6 pb-2"> {/* Consistent padding */}
        <div className="flex-shrink-0 pt-0.5">{icon}</div>
        <div className="flex-grow">
          <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 sm:p-6 pt-0"> {/* Consistent padding */}
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription> {/* Ensure text color */}
      </CardContent>
    </Card>
  );
}
