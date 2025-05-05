
'use client'; // Make it a client component

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User, Code, ShieldCheck, MonitorSmartphone, LifeBuoy } from 'lucide-react';
import Image from "next/image";
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook

export default function ServicesPage() {
  const { language } = useLanguage(); // Use context

  const clubServices = [
    {
      icon: <Code className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'Website Creation (Basic)' : 'Website-Erstellung (Basis)',
      description: language === 'en'
        ? 'Help setting up simple websites (e.g., with website builders or WordPress) to present your club.'
        : 'Hilfe bei der Einrichtung einfacher Webseiten (z.B. mit Baukastensystemen oder WordPress) zur Vorstellung Ihres Vereins.',
      imageUrl: "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
      imageHint: "website development code",
    },
    {
      icon: <MonitorSmartphone className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'Setting up Online Tools' : 'Einrichtung von Online-Tools',
      description: language === 'en'
        ? 'Support in selecting and basically setting up tools for communication, organization, or member management.'
        : 'Unterstützung bei der Auswahl und grundlegenden Einrichtung von Tools für Kommunikation, Organisation oder Mitgliederverwaltung.',
      imageUrl: "https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI",
      imageHint: "collaboration tools digital",
    },
    {
      icon: <ShieldCheck className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'IT Security Consultation' : 'IT-Sicherheitsberatung',
      description: language === 'en'
        ? 'Basic tips and advice on improving the IT security of your organization.'
        : 'Grundlegende Tipps und Hinweise zur Verbesserung der IT-Sicherheit Ihrer Organisation.',
      imageUrl: "https://fastly.picsum.photos/id/146/5000/3333.jpg?hmac=xdlFnzoavokA3U-bzo35Vk4jTBKx8C9fqH5IuCPXj2U",
      imageHint: "cyber security shield",
    },
    {
      icon: <LifeBuoy className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'General IT Questions' : 'Allgemeine IT-Fragen',
      description: language === 'en'
        ? 'Advice and help with general technical questions within our capacity.'
        : 'Beratung und Hilfe bei allgemeinen technischen Fragen im Rahmen unserer Kapazitäten.',
      imageUrl: "https://fastly.picsum.photos/id/341/5000/3337.jpg?hmac=au9Ex3OCaHWkfF3Ttoe4sXkQOsGPGeA1vrRwhmB2aug",
      imageHint: "support helpdesk headset",
    },
  ];

  const individualServices = [
     {
      icon: <MonitorSmartphone className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'Computer & Smartphone Help' : 'Computer- & Smartphone-Hilfe',
      description: language === 'en'
        ? 'Support with simple problems on your PC, laptop, or smartphone (e.g., setup, software questions).'
        : 'Unterstützung bei einfachen Problemen mit Ihrem PC, Laptop oder Smartphone (z.B. Einrichtung, Softwarefragen).',
      imageUrl: "https://fastly.picsum.photos/id/504/5000/3333.jpg?hmac=tciW_3YQNlNNRCEM360bpaoyliNKAZ4aioVTTNLmTZk",
      imageHint: "computer help support",
    },
    {
      icon: <ShieldCheck className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'Online Security Tips' : 'Online-Sicherheitstipps',
      description: language === 'en'
        ? 'Advice on safe browsing, password management, and protection against common online threats.'
        : 'Beratung zu sicherem Surfen, Passwortmanagement und Schutz vor gängigen Online-Bedrohungen.',
      imageUrl: "https://fastly.picsum.photos/id/336/1600/1060.jpg?hmac=V0ApxMul9odmMOXCPn6z_NHFnFT_-SmbQfpzughJahU",
      imageHint: "online safety internet security",
    },
     {
      icon: <Code className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'Website Understanding' : 'Webseiten-Verständnis',
      description: language === 'en'
        ? 'Explanation of basic functions of websites or online services.'
        : 'Erklärung grundlegender Funktionen von Webseiten oder Online-Diensten.',
      imageUrl: "https://fastly.picsum.photos/id/618/2509/1673.jpg?hmac=COcy9vwoZ9UeEJvOaFkdvr1zroYRFrc7SOUYp-wkyQs",
      imageHint: "learning website browser",
    },
     {
      icon: <LifeBuoy className="text-accent h-5 w-5 md:h-6 md:w-6" />,
      title: language === 'en' ? 'General Tech Questions' : 'Allgemeine Technikfragen',
      description: language === 'en'
        ? 'Assistance with simple technical questions in everyday life, as far as our volunteer possibilities allow.'
        : 'Hilfestellung bei einfachen technischen Fragen im Alltag, soweit es unsere ehrenamtlichen Möglichkeiten zulassen.',
       imageUrl: "https://fastly.picsum.photos/id/352/3264/2176.jpg?hmac=3yabp6hSm3kYnpkVROyHcC_yE0AH6eRGotMnyBnPnRc",
       imageHint: "question mark technology",
    },
  ];


  return (
    <div className="space-y-10 md:space-y-12 lg:space-y-16"> {/* Increased spacing */}
      <section className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{language === 'en' ? 'Our Services' : 'Unsere Leistungen'}</h1> {/* Responsive font size */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"> {/* Responsive font size & max-width */}
          {language === 'en'
            ? 'We offer volunteer IT support for non-profit organizations and individuals. Our focus is on basic help and advice.'
            : 'Wir bieten ehrenamtliche IT-Unterstützung für gemeinnützige Organisationen und Privatpersonen. Unser Fokus liegt auf grundlegender Hilfe und Beratung.'}
        </p>
      </section>

      <section id="vereine" className="space-y-6 md:space-y-8 scroll-mt-16 md:scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 px-4 md:px-0">
          <Users className="text-primary h-6 w-6 md:h-7 md:w-7" />
          {language === 'en' ? 'For Clubs & Organizations' : 'Für Vereine & Organisationen'}
        </h2>
        <p className="text-muted-foreground px-4 md:px-0 text-base sm:text-lg"> {/* Responsive text size */}
          {language === 'en'
            ? 'We support non-profit clubs and organizations in building their digital presence and overcoming basic IT challenges. Please note that we cannot take on complex, professional large-scale projects.'
            : 'Wir unterstützen gemeinnützige Vereine und Organisationen dabei, ihre digitale Präsenz aufzubauen und grundlegende IT-Herausforderungen zu meistern. Bitte beachten Sie, dass wir keine komplexen, professionellen Großprojekte übernehmen können.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10"> {/* Added lg gap */}
          {clubServices.map((service, index) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              imageHint={service.imageHint}
              priority={index < 2} // Add priority to the first two images for LCP
            />
          ))}
        </div>
      </section>

      <section id="privatpersonen" className="space-y-6 md:space-y-8 scroll-mt-16 md:scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2 px-4 md:px-0">
          <User className="text-primary h-6 w-6 md:h-7 md:w-7" />
          {language === 'en' ? 'For Individuals' : 'Für Privatpersonen'}
        </h2>
        <p className="text-muted-foreground px-4 md:px-0 text-base sm:text-lg"> {/* Responsive text size */}
          {language === 'en'
            ? 'We help you with everyday IT problems and questions about computers, smartphones, and the internet.'
            : 'Wir helfen Ihnen bei alltäglichen IT-Problemen und Fragen rund um Computer, Smartphone und Internet.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10"> {/* Added lg gap */}
          {individualServices.map((service, index) => (
             <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              imageHint={service.imageHint}
              priority={index < 2} // Add priority to the first two images for LCP
            />
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
  priority?: boolean; // Add priority prop
}

function ServiceCard({ icon, title, description, imageUrl, imageHint, priority = false }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
       <div className="relative h-48 sm:h-52 lg:h-60 w-full"> {/* Adjusted height for different screen sizes */}
         <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Adjusted sizes
          style={{ objectFit: 'cover' }}
          data-ai-hint={imageHint}
          priority={priority}
          unoptimized // Keep for picsum
        />
      </div>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2 pt-4 px-4 sm:px-6"> {/* Adjusted padding */}
        <div className="flex-shrink-0 pt-0.5">{icon}</div>
        <div className="flex-grow">
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle> {/* Adjusted title size */}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-0 px-4 sm:px-6 pb-4 sm:pb-6"> {/* Adjusted padding */}
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
