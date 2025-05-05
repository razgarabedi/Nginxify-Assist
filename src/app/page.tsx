
'use client'; // Make it a client component

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User } from 'lucide-react';
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook

export default function Home() {
  const { language } = useLanguage(); // Use context

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16"> {/* Increased spacing */}
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 lg:py-20 px-4 bg-secondary rounded-lg shadow-md"> {/* Adjusted padding */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary"> {/* Responsive font size */}
          {language === 'en'
            ? 'Nginxify Help: Volunteer IT Support for Clubs & Individuals'
            : 'nginxify Hilfe: Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen'}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"> {/* Responsive font size & max-width */}
          {language === 'en'
            ? 'We help digitally – free of charge or for a voluntary donation. Our mission is to support non-profit organizations and private individuals with IT challenges.'
            : 'Wir helfen digital – kostenlos oder gegen eine freiwillige Spende. Unsere Mission ist es, gemeinnützige Organisationen und Privatpersonen mit IT-Herausforderungen zu unterstützen.'}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/contact">{language === 'en' ? 'Request Help' : 'Hilfe Anfordern'}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/services">{language === 'en' ? 'Learn More About Our Services' : 'Mehr über unsere Leistungen'}</Link>
          </Button>
        </div>
      </section>

      {/* Service Previews */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"> {/* Added lg gap */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Users className="text-primary h-5 w-5 md:h-6 md:w-6" />
              {language === 'en' ? 'For Clubs & Organizations' : 'Für Vereine & Organisationen'}
            </CardTitle>
            <CardDescription>{language === 'en' ? 'Support for non-profit projects.' : 'Unterstützung für gemeinnützige Projekte.'}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 sm:p-6"> {/* Adjusted padding */}
            <p className="mb-4 text-muted-foreground flex-grow">
              {language === 'en'
                ? 'We offer basic help with website creation, setting up online tools, or general IT questions, so you can focus on your core work.'
                : 'Wir bieten grundlegende Hilfe bei der Erstellung von Webseiten, der Einrichtung von Online-Tools oder bei allgemeinen IT-Fragen, damit Sie sich auf Ihre Kernarbeit konzentrieren können.'}
            </p>
            <Button variant="link" asChild className="px-0 self-start mt-auto">
              <Link href="/services#vereine">{language === 'en' ? 'View Details' : 'Details ansehen'}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <User className="text-primary h-5 w-5 md:h-6 md:w-6" />
              {language === 'en' ? 'For Individuals' : 'Für Privatpersonen'}
            </CardTitle>
             <CardDescription>{language === 'en' ? 'Help with everyday IT problems.' : 'Hilfe bei alltäglichen IT-Problemen.'}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 sm:p-6"> {/* Adjusted padding */}
            <p className="mb-4 text-muted-foreground flex-grow">
              {language === 'en'
                ? 'Need help with your computer, smartphone, or have questions about online security? We support you with simple IT challenges.'
                : 'Brauchen Sie Hilfe mit Ihrem Computer, Smartphone oder haben Sie Fragen zur Online-Sicherheit? Wir unterstützen Sie bei einfachen IT-Herausforderungen.'}
            </p>
             <Button variant="link" asChild className="px-0 self-start mt-auto">
              <Link href="/services#privatpersonen">{language === 'en' ? 'View Details' : 'Details ansehen'}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       {/* How it Works & Call to Action */}
       <section className="text-center py-10 md:py-12 lg:py-16 px-4"> {/* Adjusted padding */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">{language === 'en' ? 'How does our help work?' : 'Wie funktioniert unsere Hilfe?'}</h2>
        <p className="text-muted-foreground mb-8 max-w-md md:max-w-xl lg:max-w-2xl mx-auto"> {/* Adjusted max-width */}
          {language === 'en'
            ? 'Our support is based on volunteer work. Learn more about the process and how you can request help.'
            : 'Unsere Unterstützung basiert auf ehrenamtlichem Engagement. Erfahren Sie mehr über den Prozess und wie Sie Hilfe anfordern können.'}
        </p>
        <Button variant="accent" size="lg" asChild>
           <Link href="/how-it-works">{language === 'en' ? 'How It Works' : 'So Funktioniert\'s'}</Link>
        </Button>
      </section>

    </div>
  );
}
