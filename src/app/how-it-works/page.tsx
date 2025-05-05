import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Handshake, MessageSquare, Clock } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">So Funktioniert's</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Erfahren Sie mehr über unser ehrenamtliches Modell, wie Sie Hilfe anfordern können und was Sie erwarten können.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoCard
          icon={<Heart className="text-primary" />}
          title="Ehrenamtliches Engagement"
          description="Unsere Hilfe wird von Freiwilligen geleistet, die ihre IT-Kenntnisse und Zeit zur Verfügung stellen, um anderen zu helfen. Wir sind eine Gemeinschaft von Technikbegeisterten, die Gutes tun wollen."
        />
        <InfoCard
          icon={<Handshake className="text-primary" />}
          title="Kostenlos & Spendenbasiert"
          description="Unsere grundlegende Unterstützung ist kostenlos. Freiwillige Spenden sind willkommen und helfen uns, eventuelle Kosten zu decken und die Initiative am Laufen zu halten. Es besteht jedoch keine Verpflichtung zur Spende."
        />
         <InfoCard
          icon={<MessageSquare className="text-primary" />}
          title="Hilfe Anfordern"
          description={
            <>
              Der einfachste Weg, Unterstützung anzufragen, ist über unser{" "}
              <Link href="/contact" className="text-primary hover:underline">Kontaktformular</Link>
              {" "}oder per E-Mail. Beschreiben Sie Ihr Anliegen möglichst genau, damit wir Ihre Anfrage besser einschätzen können.
            </>
          }
        />
        <InfoCard
          icon={<Clock className="text-primary" />}
          title="Erwartungsmanagement"
          description="Da wir ehrenamtlich tätig sind, erfolgt die Hilfe nach Verfügbarkeit unserer Freiwilligen. Wir bemühen uns, zeitnah zu antworten, bitten aber um Verständnis, wenn es manchmal etwas dauern kann. Wir können nicht garantieren, jedes Problem lösen zu können, geben aber unser Bestes."
        />
         <InfoCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" /></svg>} // Placeholder face icon
          title="Wer wir sind"
          description="Wir sind eine Gruppe von IT-interessierten Einzelpersonen, die ihre Fähigkeiten nutzen möchten, um gemeinnützigen Organisationen und Privatpersonen bei technischen Herausforderungen unter die Arme zu greifen."
        />
         <InfoCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary"><path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v1.286a.75.75 0 0 0 .719.745 8.203 8.203 0 0 1 1.71.688 9.679 9.679 0 0 0 1.71-.688.75.75 0 0 0 .719-.745V4.262a.75.75 0 0 0-.5-.707ZM11.25 6.261v1.161A.75.75 0 0 0 12 8.168a.75.75 0 0 0 .75-.746V6.261a.75.75 0 0 0-.5-.707A9.707 9.707 0 0 0 12 5.504a9.707 9.707 0 0 0-.25.05Zm.75 4.365a.75.75 0 0 0-1.5 0v6.151a3.03 3.03 0 0 0 1.5 0v-6.151ZM13.5 3.555A9.735 9.735 0 0 1 18 3a9.707 9.707 0 0 1 3.25.533.75.75 0 0 1 .5.707v1.286a.75.75 0 0 1-.719.745 8.203 8.203 0 0 0-1.71.688 9.679 9.679 0 0 1-1.71-.688.75.75 0 0 1-.719-.745V4.262a.75.75 0 0 1 .5-.707Z" /></svg>} // Placeholder gift icon
          title="Spendenverwendung (Optional)"
          description="Falls Spenden eingehen, werden diese transparent zur Deckung von Betriebskosten (z.B. Hosting der Webseite) oder zur Unterstützung spezifischer gemeinnütziger IT-Projekte verwendet."
        />
      </section>

       <section className="text-center py-10 bg-secondary rounded-lg shadow-md mt-12">
         <h2 className="text-2xl font-semibold mb-4">Bereit, Hilfe anzufragen?</h2>
         <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
           Füllen Sie unser Kontaktformular aus oder schreiben Sie uns eine E-Mail. Wir freuen uns darauf, von Ihnen zu hören!
         </p>
         <Button asChild size="lg" variant="accent">
           <Link href="/contact">Jetzt Kontakt aufnehmen</Link>
         </Button>
       </section>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode; // Allow JSX for links
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center text-center">
        <div className="mb-3 rounded-full bg-primary/10 p-3 inline-flex">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  );
}
