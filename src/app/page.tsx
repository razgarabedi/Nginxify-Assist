'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User } from 'lucide-react';
import { useLanguage } from '@/context/language-context'; 
import { useEffect, useState } from 'react';
import type { HomeContentData } from '@/lib/content-types';
import { getContent } from '@/actions/content-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { language } = useLanguage(); 
  const [content, setContent] = useState<HomeContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const allContent = await getContent();
        setContent(allContent.home);
      } catch (error) {
        console.error("Failed to load home content:", error);
        // Optionally, set to some default/fallback content or show an error message
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  if (isLoading || !content) {
    return (
      <div className="space-y-8 md:space-y-12 lg:space-y-16">
        <section className="text-center py-12 md:py-16 lg:py-20 px-4 bg-secondary rounded-lg shadow-md">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-48" />
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          <Card className="shadow-lg flex flex-col">
            <CardHeader>
              <Skeleton className="h-8 w-3/5 mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent className="flex-grow p-4 sm:p-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-8 w-24 mt-auto" />
            </CardContent>
          </Card>
          <Card className="shadow-lg flex flex-col">
            <CardHeader>
              <Skeleton className="h-8 w-3/5 mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent className="flex-grow p-4 sm:p-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-8 w-24 mt-auto" />
            </CardContent>
          </Card>
        </section>
        <section className="text-center py-10 md:py-12 lg:py-16 px-4">
          <Skeleton className="h-9 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto mb-8" />
          <Skeleton className="h-12 w-40 mx-auto" />
        </section>
      </div>
    );
  }

  const translations = {
      pageTitle: language === 'en' ? content.pageTitle_en : content.pageTitle_de,
      pageDescription: language === 'en' ? content.pageDescription_en : content.pageDescription_de,
      requestHelpButton: language === 'en' ? content.requestHelpButton_en : content.requestHelpButton_de,
      learnMoreButton: language === 'en' ? content.learnMoreButton_en : content.learnMoreButton_de,
      clubsTitle: language === 'en' ? content.clubsTitle_en : content.clubsTitle_de,
      clubsDescription: language === 'en' ? content.clubsDescription_en : content.clubsDescription_de,
      clubsText: language === 'en' ? content.clubsText_en : content.clubsText_de,
      individualsTitle: language === 'en' ? content.individualsTitle_en : content.individualsTitle_de,
      individualsDescription: language === 'en' ? content.individualsDescription_en : content.individualsDescription_de,
      individualsText: language === 'en' ? content.individualsText_en : content.individualsText_de,
      viewDetailsButton: language === 'en' ? content.viewDetailsButton_en : content.viewDetailsButton_de,
      howItWorksTitle: language === 'en' ? content.howItWorksTitle_en : content.howItWorksTitle_de,
      howItWorksDescription: language === 'en' ? content.howItWorksDescription_en : content.howItWorksDescription_de,
      howItWorksButton: language === 'en' ? content.howItWorksButton_en : content.howItWorksButton_de,
    };


  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16"> {/* Increased spacing */}
      {/* Hero Section */}
      <section className="text-center py-12 md:py-16 lg:py-20 px-4 bg-secondary rounded-lg shadow-md"> {/* Adjusted padding */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary"> {/* Responsive font size */}
          {translations.pageTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto"> {/* Responsive font size & max-width */}
          {translations.pageDescription}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/contact">{translations.requestHelpButton}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link href="/services">{translations.learnMoreButton}</Link>
          </Button>
        </div>
      </section>

      {/* Service Previews */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"> {/* Added lg gap */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Users className="text-primary h-5 w-5 md:h-6 md:w-6" />
              {translations.clubsTitle}
            </CardTitle>
            <CardDescription>{translations.clubsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 sm:p-6"> {/* Adjusted padding */}
            <p className="mb-4 text-muted-foreground flex-grow">
             {translations.clubsText}
            </p>
            <Button variant="link" asChild className="px-0 self-start mt-auto">
              <Link href="/services#vereine">{translations.viewDetailsButton}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <User className="text-primary h-5 w-5 md:h-6 md:w-6" />
              {translations.individualsTitle}
            </CardTitle>
             <CardDescription>{translations.individualsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 sm:p-6"> {/* Adjusted padding */}
            <p className="mb-4 text-muted-foreground flex-grow">
             {translations.individualsText}
            </p>
             <Button variant="link" asChild className="px-0 self-start mt-auto">
              <Link href="/services#privatpersonen">{translations.viewDetailsButton}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       {/* How it Works & Call to Action */}
       <section className="text-center py-10 md:py-12 lg:py-16 px-4"> {/* Adjusted padding */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">{translations.howItWorksTitle}</h2>
        <p className="text-muted-foreground mb-8 max-w-md md:max-w-xl lg:max-w-2xl mx-auto"> {/* Adjusted max-width */}
         {translations.howItWorksDescription}
        </p>
        <Button variant="accent" size="lg" asChild>
           <Link href="/how-it-works">{translations.howItWorksButton}</Link>
        </Button>
      </section>
    </div>
  );
}
