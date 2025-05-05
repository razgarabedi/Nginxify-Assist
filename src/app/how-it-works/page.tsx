
'use client'; // Make it a client component

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Handshake, MessageSquare, Clock, Users, Gift } from 'lucide-react'; // Added Gift, Users
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook

export default function HowItWorksPage() {
  const { language } = useLanguage(); // Use context

  const translations = {
    pageTitle: language === 'en' ? 'How It Works' : 'So Funktioniert\'s',
    pageDescription: language === 'en'
      ? 'Learn more about our volunteer model, how to request help, and what to expect.'
      : 'Erfahren Sie mehr über unser ehrenamtliches Modell, wie Sie Hilfe anfordern können und was Sie erwarten können.',
    volunteerTitle: language === 'en' ? 'Volunteer Commitment' : 'Ehrenamtliches Engagement',
    volunteerDescription: language === 'en'
      ? 'Our help is provided by volunteers who offer their IT skills and time to help others. We are a community of tech enthusiasts wanting to do good.'
      : 'Unsere Hilfe wird von Freiwilligen geleistet, die ihre IT-Kenntnisse und Zeit zur Verfügung stellen, um anderen zu helfen. Wir sind eine Gemeinschaft von Technikbegeisterten, die Gutes tun wollen.',
    costTitle: language === 'en' ? 'Free & Donation-Based' : 'Kostenlos & Spendenbasiert',
    costDescription: language === 'en'
      ? 'Our basic support is free. Voluntary donations are welcome and help us cover any costs and keep the initiative running. However, there is no obligation to donate.'
      : 'Unsere grundlegende Unterstützung ist kostenlos. Freiwillige Spenden sind willkommen und helfen uns, eventuelle Kosten zu decken und die Initiative am Laufen zu halten. Es besteht jedoch keine Verpflichtung zur Spende.',
    requestTitle: language === 'en' ? 'Requesting Help' : 'Hilfe Anfordern',
    requestDescriptionPart1: language === 'en'
      ? 'The easiest way to request support is via our '
      : 'Der einfachste Weg, Unterstützung anzufragen, ist über unser ',
    requestDescriptionLink: language === 'en' ? 'Contact Form' : 'Kontaktformular',
    requestDescriptionPart2: language === 'en'
      ? ' or by email. Please describe your issue as accurately as possible so we can better assess your request.'
      : ' oder per E-Mail. Beschreiben Sie Ihr Anliegen möglichst genau, damit wir Ihre Anfrage besser einschätzen können.',
    expectationTitle: language === 'en' ? 'Expectation Management' : 'Erwartungsmanagement',
    expectationDescription: language === 'en'
      ? 'As we operate on a volunteer basis, help is provided based on the availability of our volunteers. We strive to respond promptly but ask for your understanding if it sometimes takes a little longer. We cannot guarantee to solve every problem, but we do our best.'
      : 'Da wir ehrenamtlich tätig sind, erfolgt die Hilfe nach Verfügbarkeit unserer Freiwilligen. Wir bemühen uns, zeitnah zu antworten, bitten aber um Verständnis, wenn es manchmal etwas dauern kann. Wir können nicht garantieren, jedes Problem lösen zu können, geben aber unser Bestes.',
    whoTitle: language === 'en' ? 'Who We Are' : 'Wer wir sind',
    whoDescription: language === 'en'
      ? 'We are a group of IT-interested individuals who want to use our skills to help non-profit organizations and individuals with technical challenges.'
      : 'Wir sind eine Gruppe von IT-interessierten Einzelpersonen, die ihre Fähigkeiten nutzen möchten, um gemeinnützigen Organisationen und Privatpersonen bei technischen Herausforderungen unter die Arme zu greifen.',
    donationsTitle: language === 'en' ? 'Use of Donations (Optional)' : 'Spendenverwendung (Optional)',
    donationsDescription: language === 'en'
      ? 'If donations are received, they will be used transparently to cover operating costs (e.g., website hosting) or to support specific non-profit IT projects.'
      : 'Falls Spenden eingehen, werden diese transparent zur Deckung von Betriebskosten (z.B. Hosting der Webseite) oder zur Unterstützung spezifischer gemeinnütziger IT-Projekte verwendet.',
    ctaTitle: language === 'en' ? 'Ready to Request Help?' : 'Bereit, Hilfe anzufragen?',
    ctaDescription: language === 'en'
      ? 'Fill out our contact form or send us an email. We look forward to hearing from you!'
      : 'Füllen Sie unser Kontaktformular aus oder schreiben Sie uns eine E-Mail. Wir freuen uns darauf, von Ihnen zu hören!',
    ctaButton: language === 'en' ? 'Contact Us Now' : 'Jetzt Kontakt aufnehmen',
  };

  return (
    <div className="space-y-10 md:space-y-12 lg:space-y-16"> {/* Increased spacing */}
      <section className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{translations.pageTitle}</h1> {/* Responsive font size */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"> {/* Responsive font size & max-width */}
          {translations.pageDescription}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"> {/* Adjusted grid and gap */}
        <InfoCard
          icon={<Heart className="text-primary h-6 w-6" />}
          title={translations.volunteerTitle}
          description={translations.volunteerDescription}
        />
        <InfoCard
          icon={<Handshake className="text-primary h-6 w-6" />}
          title={translations.costTitle}
          description={translations.costDescription}
        />
         <InfoCard
          icon={<MessageSquare className="text-primary h-6 w-6" />}
          title={translations.requestTitle}
          description={
            <>
                {translations.requestDescriptionPart1}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  {translations.requestDescriptionLink}
                </Link>
                {translations.requestDescriptionPart2}
              </>
          }
        />
        <InfoCard
          icon={<Clock className="text-primary h-6 w-6" />}
          title={translations.expectationTitle}
          description={translations.expectationDescription}
        />
         <InfoCard
          icon={<Users className="text-primary h-6 w-6" />} // Replaced SVG with Lucide icon
          title={translations.whoTitle}
          description={translations.whoDescription}
        />
         <InfoCard
          icon={<Gift className="text-primary h-6 w-6" />} // Replaced SVG with Lucide icon
          title={translations.donationsTitle}
          description={translations.donationsDescription}
        />
      </section>

       <section className="text-center py-10 md:py-12 lg:py-16 bg-secondary rounded-lg shadow-md mt-10 md:mt-12 px-4"> {/* Adjusted padding */}
         <h2 className="text-xl md:text-2xl font-semibold mb-4">{translations.ctaTitle}</h2>
         <p className="text-muted-foreground mb-6 max-w-md md:max-w-xl lg:max-w-2xl mx-auto"> {/* Adjusted max-width */}
           {translations.ctaDescription}
         </p>
         <Button asChild size="lg" variant="default" className="bg-primary hover:bg-primary/90 w-full sm:w-auto"> {/* Make button full width on small screens */}
           <Link href="/contact">{translations.ctaButton}</Link>
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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center text-center pb-3 pt-6 px-4 sm:px-6"> {/* Adjusted padding */}
        <div className="mb-3 rounded-full bg-primary/10 p-3 inline-flex">{icon}</div>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle> {/* Adjusted title size */}
      </CardHeader>
      <CardContent className="text-center text-muted-foreground flex-grow px-4 sm:px-6 pb-6"> {/* Adjusted padding */}
        {description}
      </CardContent>
    </Card>
  );
}
