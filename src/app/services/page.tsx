'use client'; // Make it a client component

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User, Code, ShieldCheck, MonitorSmartphone, LifeBuoy } from 'lucide-react';
import Image from "next/image";
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook

export default function ServicesPage() {
  const { language } = useLanguage(); // Use context

  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{language === 'en' ? 'Our Services' : 'Unsere Leistungen'}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {language === 'en'
            ? 'We offer volunteer IT support for non-profit organizations and individuals. Our focus is on basic help and advice.'
            : 'Wir bieten ehrenamtliche IT-Unterstützung für gemeinnützige Organisationen und Privatpersonen. Unser Fokus liegt auf grundlegender Hilfe und Beratung.'}
        </p>
      </section>

      <section id="vereine" className="space-y-8 scroll-mt-20">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <Users className="text-primary" />
          {language === 'en' ? 'For Clubs & Organizations' : 'Für Vereine & Organisationen'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'en'
            ? 'We support non-profit clubs and organizations in building their digital presence and overcoming basic IT challenges. Please note that we cannot take on complex, professional large-scale projects.'
            : 'Wir unterstützen gemeinnützige Vereine und Organisationen dabei, ihre digitale Präsenz aufzubauen und grundlegende IT-Herausforderungen zu meistern. Bitte beachten Sie, dass wir keine komplexen, professionellen Großprojekte übernehmen können.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceCard
            icon={<Code className="text-accent" />}
            title={language === 'en' ? 'Website Creation (Basic)' : 'Website-Erstellung (Basis)'}
            description={language === 'en'
              ? 'Help setting up simple websites (e.g., with website builders or WordPress) to present your club.'
              : 'Hilfe bei der Einrichtung einfacher Webseiten (z.B. mit Baukastensystemen oder WordPress) zur Vorstellung Ihres Vereins.'}
            imageUrl="https://picsum.photos/400/250"
            imageHint="website development code"
          />
          <ServiceCard
            icon={<MonitorSmartphone className="text-accent" />}
            title={language === 'en' ? 'Setting up Online Tools' : 'Einrichtung von Online-Tools'}
            description={language === 'en'
              ? 'Support in selecting and basically setting up tools for communication, organization, or member management.'
              : 'Unterstützung bei der Auswahl und grundlegenden Einrichtung von Tools für Kommunikation, Organisation oder Mitgliederverwaltung.'}
             imageUrl="https://picsum.photos/400/250"
             imageHint="collaboration tools digital"
          />
           <ServiceCard
            icon={<ShieldCheck className="text-accent" />}
            title={language === 'en' ? 'IT Security Consultation' : 'IT-Sicherheitsberatung'}
            description={language === 'en'
              ? 'Basic tips and advice on improving the IT security of your organization.'
              : 'Grundlegende Tipps und Hinweise zur Verbesserung der IT-Sicherheit Ihrer Organisation.'}
            imageUrl="https://picsum.photos/400/250"
            imageHint="cyber security shield"
          />
          <ServiceCard
            icon={<LifeBuoy className="text-accent" />}
            title={language === 'en' ? 'General IT Questions' : 'Allgemeine IT-Fragen'}
            description={language === 'en'
              ? 'Advice and help with general technical questions within our capacity.'
              : 'Beratung und Hilfe bei allgemeinen technischen Fragen im Rahmen unserer Kapazitäten.'}
            imageUrl="https://picsum.photos/400/250"
            imageHint="support helpdesk headset"
          />
        </div>
      </section>

      <section id="privatpersonen" className="space-y-8 scroll-mt-20">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <User className="text-primary" />
          {language === 'en' ? 'For Individuals' : 'Für Privatpersonen'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'en'
            ? 'We help you with everyday IT problems and questions about computers, smartphones, and the internet.'
            : 'Wir helfen Ihnen bei alltäglichen IT-Problemen und Fragen rund um Computer, Smartphone und Internet.'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <ServiceCard
            icon={<MonitorSmartphone className="text-accent" />}
            title={language === 'en' ? 'Computer & Smartphone Help' : 'Computer- & Smartphone-Hilfe'}
            description={language === 'en'
              ? 'Support with simple problems on your PC, laptop, or smartphone (e.g., setup, software questions).'
              : 'Unterstützung bei einfachen Problemen mit Ihrem PC, Laptop oder Smartphone (z.B. Einrichtung, Softwarefragen).'}
             imageUrl="https://picsum.photos/400/250"
             imageHint="computer help support"
          />
          <ServiceCard
            icon={<ShieldCheck className="text-accent" />}
            title={language === 'en' ? 'Online Security Tips' : 'Online-Sicherheitstipps'}
            description={language === 'en'
              ? 'Advice on safe browsing, password management, and protection against common online threats.'
              : 'Beratung zu sicherem Surfen, Passwortmanagement und Schutz vor gängigen Online-Bedrohungen.'}
            imageUrl="https://picsum.photos/400/250"
            imageHint="online safety internet security"
          />
           <ServiceCard
            icon={<Code className="text-accent" />}
            title={language === 'en' ? 'Website Understanding' : 'Webseiten-Verständnis'}
            description={language === 'en'
              ? 'Explanation of basic functions of websites or online services.'
              : 'Erklärung grundlegender Funktionen von Webseiten oder Online-Diensten.'}
            imageUrl="https://picsum.photos/400/250"
            imageHint="learning website browser"
          />
           <ServiceCard
            icon={<LifeBuoy className="text-accent" />}
            title={language === 'en' ? 'General Tech Questions' : 'Allgemeine Technikfragen'}
            description={language === 'en'
              ? 'Assistance with simple technical questions in everyday life, as far as our volunteer possibilities allow.'
              : 'Hilfestellung bei einfachen technischen Fragen im Alltag, soweit es unsere ehrenamtlichen Möglichkeiten zulassen.'}
             imageUrl="https://picsum.photos/400/250"
             imageHint="question mark technology"
          />
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

function ServiceCard({ icon, title, description, imageUrl, imageHint }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
       <div className="relative h-40 w-full">
         <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={imageHint}
          unoptimized // Added to prevent potential issues with external URLs if not configured
        />
      </div>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-grow">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
