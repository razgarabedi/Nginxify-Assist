import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, User, Code, ShieldCheck, MonitorSmartphone } from 'lucide-react';
import Image from "next/image";

export default function ServicesPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Unsere Leistungen</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Wir bieten ehrenamtliche IT-Unterstützung für gemeinnützige Organisationen und Privatpersonen. Unser Fokus liegt auf grundlegender Hilfe und Beratung.
        </p>
      </section>

      <section id="vereine" className="space-y-8 scroll-mt-20">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <Users className="text-primary" />
          Für Vereine & Organisationen
        </h2>
        <p className="text-muted-foreground">
          Wir unterstützen gemeinnützige Vereine und Organisationen dabei, ihre digitale Präsenz aufzubauen und grundlegende IT-Herausforderungen zu meistern. Bitte beachten Sie, dass wir keine komplexen, professionellen Großprojekte übernehmen können.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ServiceCard
            icon={<Code className="text-accent" />}
            title="Website-Erstellung (Basis)"
            description="Hilfe bei der Einrichtung einfacher Webseiten (z.B. mit Baukastensystemen oder WordPress) zur Vorstellung Ihres Vereins."
            imageUrl="https://picsum.photos/400/250"
            imageHint="website development code"
          />
          <ServiceCard
            icon={<MonitorSmartphone className="text-accent" />}
            title="Einrichtung von Online-Tools"
            description="Unterstützung bei der Auswahl und grundlegenden Einrichtung von Tools für Kommunikation, Organisation oder Mitgliederverwaltung."
             imageUrl="https://picsum.photos/400/250"
             imageHint="collaboration tools digital"
          />
           <ServiceCard
            icon={<ShieldCheck className="text-accent" />}
            title="IT-Sicherheitsberatung"
            description="Grundlegende Tipps und Hinweise zur Verbesserung der IT-Sicherheit Ihrer Organisation."
            imageUrl="https://picsum.photos/400/250"
            imageHint="cyber security shield"
          />
          <ServiceCard
            icon={<LifeBuoy className="text-accent" />}
            title="Allgemeine IT-Fragen"
            description="Beratung und Hilfe bei allgemeinen technischen Fragen im Rahmen unserer Kapazitäten."
            imageUrl="https://picsum.photos/400/250"
            imageHint="support helpdesk headset"
          />
        </div>
      </section>

      <section id="privatpersonen" className="space-y-8 scroll-mt-20">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <User className="text-primary" />
          Für Privatpersonen
        </h2>
        <p className="text-muted-foreground">
          Wir helfen Ihnen bei alltäglichen IT-Problemen und Fragen rund um Computer, Smartphone und Internet.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <ServiceCard
            icon={<MonitorSmartphone className="text-accent" />}
            title="Computer- & Smartphone-Hilfe"
            description="Unterstützung bei einfachen Problemen mit Ihrem PC, Laptop oder Smartphone (z.B. Einrichtung, Softwarefragen)."
             imageUrl="https://picsum.photos/400/250"
             imageHint="computer help support"
          />
          <ServiceCard
            icon={<ShieldCheck className="text-accent" />}
            title="Online-Sicherheitstipps"
            description="Beratung zu sicherem Surfen, Passwortmanagement und Schutz vor gängigen Online-Bedrohungen."
            imageUrl="https://picsum.photos/400/250"
            imageHint="online safety internet security"
          />
           <ServiceCard
            icon={<Code className="text-accent" />}
            title="Webseiten-Verständnis"
            description="Erklärung grundlegender Funktionen von Webseiten oder Online-Diensten."
            imageUrl="https://picsum.photos/400/250"
            imageHint="learning website browser"
          />
           <ServiceCard
            icon={<LifeBuoy className="text-accent" />}
            title="Allgemeine Technikfragen"
            description="Hilfestellung bei einfachen technischen Fragen im Alltag, soweit es unsere ehrenamtlichen Möglichkeiten zulassen."
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
