
'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context'; 
import React, { useEffect, useState } from 'react'; 
import type { HomeContentData } from '@/lib/content-types';
import { getContent } from '@/actions/content-actions';
import { Skeleton } from '@/components/ui/skeleton';
import HomepageSlideshow from '@/components/homepage-slideshow';


export default function Home() {
  const { language } = useLanguage(); 
  const [content, setContent] = useState<HomeContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const allContent = await getContent();
        setContent(allContent.home);
      } catch (error) {
        console.error("Failed to load home content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  if (isLoading || !content) {
    return (
      <div className="space-y-12 md:space-y-16 lg:space-y-20">
        {/* Slideshow Skeleton */}
        <section className="relative w-full h-[calc(80vh-80px)] sm:h-[calc(90vh-80px)] md:h-[calc(100vh-80px)] max-h-[800px] overflow-hidden rounded-xl shadow-2xl bg-muted flex items-center justify-center">
           <div className="text-center p-4 md:p-8">
             <Skeleton className="h-12 w-3/4 md:w-2/3 mx-auto mb-6" />
             <Skeleton className="h-7 w-full max-w-xl mx-auto mb-10" />
             <Skeleton className="h-12 w-40 mx-auto" />
           </div>
        </section>
        
        {/* Service Previews Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {[1, 2].map((i) => (
            <Card key={`service-skel-${i}`} className="shadow-xl flex flex-col bg-card dark:bg-secondary/40 rounded-xl">
              <CardHeader className="p-5 sm:p-6">
                <Skeleton className="h-8 w-3/5 mb-2" />
                <Skeleton className="h-5 w-4/5" />
              </CardHeader>
              <CardContent className="flex-grow p-5 sm:p-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-11 w-32 mt-5" />
              </CardContent>
            </Card>
          ))}
        </section>
        {/* How it Works Skeleton */}
        <section className="text-center py-16 md:py-20 lg:py-24 px-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
          <Skeleton className="h-10 w-1/2 md:w-2/5 mx-auto mb-5" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-10" />
          <Skeleton className="h-12 w-44 mx-auto" />
        </section>
      </div>
    );
  }

  const translations = {
      // pageTitle: language === 'en' ? content.pageTitle_en : content.pageTitle_de, // Potentially replaced by slideshow
      // pageDescription: language === 'en' ? content.pageDescription_en : content.pageDescription_de, // Potentially replaced by slideshow
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
    <div className="space-y-12 md:space-y-16 lg:space-y-20">
      <HomepageSlideshow />
      
      {/* Optional: Retain a smaller, focused introductory section if needed, or remove if slideshow covers it */}
      {/* <section className="text-center py-12 md:py-16 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
          {translations.pageTitle}
        </h1>
        <p className="text-md sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          {translations.pageDescription}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="w-full sm:w-auto text-base sm:text-lg py-3 px-8">
            <Link href="/contact">{translations.requestHelpButton}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto text-base sm:text-lg py-3 px-8">
            <Link href="/services">{translations.learnMoreButton} <ArrowRight className="ml-2 h-5 w-5"/></Link>
          </Button>
        </div>
      </section> */}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 pt-8 md:pt-0">
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card dark:bg-secondary/40 rounded-xl overflow-hidden">
          <CardHeader className="p-5 sm:p-7">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
              <Users className="text-primary h-7 w-7 md:h-8 md:w-8" />
              {translations.clubsTitle}
            </CardTitle>
            <CardDescription className="text-base">{translations.clubsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-5 sm:p-7">
            <p className="mb-5 text-muted-foreground flex-grow text-base">
             {translations.clubsText}
            </p>
            <Button variant="link" asChild className="px-0 self-start mt-auto text-primary hover:text-primary/80 font-semibold text-base group">
              <Link href="/services#vereine">{translations.viewDetailsButton} <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform"/></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card dark:bg-secondary/40 rounded-xl overflow-hidden">
          <CardHeader className="p-5 sm:p-7">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
              <User className="text-primary h-7 w-7 md:h-8 md:w-8" />
              {translations.individualsTitle}
            </CardTitle>
             <CardDescription className="text-base">{translations.individualsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-5 sm:p-7">
            <p className="mb-5 text-muted-foreground flex-grow text-base">
             {translations.individualsText}
            </p>
             <Button variant="link" asChild className="px-0 self-start mt-auto text-primary hover:text-primary/80 font-semibold text-base group">
              <Link href="/services#privatpersonen">{translations.viewDetailsButton} <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform"/></Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       <section className="text-center py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-muted/50 dark:bg-muted/20 rounded-xl">
        <h2 className="text-3xl md:text-4xl font-semibold mb-5">{translations.howItWorksTitle}</h2>
        <p className="text-muted-foreground mb-10 max-w-md md:max-w-xl lg:max-w-2xl mx-auto text-lg">
         {translations.howItWorksDescription}
        </p>
        <Button variant="accent" size="lg" asChild className="text-base sm:text-lg py-3 px-8">
           <Link href="/how-it-works">{translations.howItWorksButton}</Link>
        </Button>
      </section>
    </div>
  );
}
