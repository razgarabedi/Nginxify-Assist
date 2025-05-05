import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User, Code, LifeBuoy } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-secondary rounded-lg shadow-md">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-primary">
          nginxify Hilfe: Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Wir helfen digital – kostenlos oder gegen eine freiwillige Spende. Unsere Mission ist es, gemeinnützige Organisationen und Privatpersonen mit IT-Herausforderungen zu unterstützen.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/contact">Hilfe Anfordern</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/services">Mehr über unsere Leistungen</Link>
          </Button>
        </div>
      </section>

      {/* Service Previews */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" />
              Für Vereine & Organisationen
            </CardTitle>
            <CardDescription>Unterstützung für gemeinnützige Projekte.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Wir bieten grundlegende Hilfe bei der Erstellung von Webseiten, der Einrichtung von Online-Tools oder bei allgemeinen IT-Fragen, damit Sie sich auf Ihre Kernarbeit konzentrieren können.
            </p>
            <Button variant="link" asChild className="px-0">
              <Link href="/services#vereine">Details ansehen</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-primary" />
              Für Privatpersonen
            </CardTitle>
             <CardDescription>Hilfe bei alltäglichen IT-Problemen.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Brauchen Sie Hilfe mit Ihrem Computer, Smartphone oder haben Sie Fragen zur Online-Sicherheit? Wir unterstützen Sie bei einfachen IT-Herausforderungen.
            </p>
             <Button variant="link" asChild className="px-0">
              <Link href="/services#privatpersonen">Details ansehen</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       {/* How it Works & Call to Action */}
       <section className="text-center py-12">
        <h2 className="text-3xl font-semibold mb-4">Wie funktioniert unsere Hilfe?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Unsere Unterstützung basiert auf ehrenamtlichem Engagement. Erfahren Sie mehr über den Prozess und wie Sie Hilfe anfordern können.
        </p>
        <Button variant="accent" size="lg" asChild>
           <Link href="/how-it-works">So Funktioniert's</Link>
        </Button>
      </section>

    </div>
  );
}
