'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User, ArrowRight, Heart, Handshake, Settings } from 'lucide-react';
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
         <section className="relative w-full aspect-[16/7] sm:aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6] xl:aspect-[16/5] min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:min-h-[550px] max-h-[700px] overflow-hidden rounded-xl shadow-2xl bg-muted flex items-center justify-center">
           <div className="text-center p-4 md:p-8">
            <div className="animate-pulse">
                <div className="h-10 w-3/4 sm:h-12 md:w-2/3 mx-auto mb-4 sm:mb-6 bg-muted-foreground/20 rounded-md"></div>
                <div className="h-6 w-full sm:h-7 max-w-lg sm:max-w-xl mx-auto mb-8 sm:mb-10 bg-muted-foreground/20 rounded-md"></div>
                <div className="h-11 w-36 sm:h-12 sm:w-40 mx-auto bg-muted-foreground/20 rounded-md"></div>
            </div>
           </div>
        </section>
        
        {/* Service Previews Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {[1, 2].map((i) => (
            <Card key={`service-skel-${i}`} className="shadow-xl flex flex-col bg-card dark:bg-secondary/40 rounded-xl">
              <CardHeader className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" />
                  <Skeleton className="h-7 w-3/5 sm:h-8" />
                </div>
                <Skeleton className="h-5 w-4/5" />
              </CardHeader>
              <CardContent className="flex-grow p-5 sm:p-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-32 sm:h-11 mt-4 sm:mt-5" />
              </CardContent>
            </Card>
          ))}
        </section>
        {/* How it Works Skeleton */}
        <section className="text-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 bg-muted/50 dark:bg-muted/20 rounded-xl">
          <Skeleton className="h-9 w-1/2 sm:h-10 md:w-2/5 mx-auto mb-4 sm:mb-5" />
          <Skeleton className="h-5 w-full sm:h-6 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10" />
          <Skeleton className="h-11 w-40 sm:h-12 sm:w-44 mx-auto" />
        </section>
      </div>
    );
  }

  const translations = {
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
      <HomepageSlideshow slides={content.slideshowItems || []} />
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 pt-8 md:pt-0">
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card dark:bg-secondary/40 rounded-xl overflow-hidden">
          <CardHeader className="p-5 sm:p-7">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
              <Users className="text-primary h-7 w-7 md:h-8 md:w-8 flex-shrink-0" />
              {translations.clubsTitle}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">{translations.clubsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-5 sm:p-7">
            <p className="mb-5 text-muted-foreground flex-grow text-base leading-relaxed">
             {translations.clubsText}
            </p>
            <Button variant="link" asChild className="px-1 py-1 self-start mt-auto text-primary hover:text-primary/80 font-semibold text-base group">
              <Link href="/services#vereine">{translations.viewDetailsButton} <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform"/></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card dark:bg-secondary/40 rounded-xl overflow-hidden">
          <CardHeader className="p-5 sm:p-7">
            <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
              <User className="text-primary h-7 w-7 md:h-8 md:w-8 flex-shrink-0" />
              {translations.individualsTitle}
            </CardTitle>
             <CardDescription className="text-base text-muted-foreground">{translations.individualsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-5 sm:p-7">
            <p className="mb-5 text-muted-foreground flex-grow text-base leading-relaxed">
             {translations.individualsText}
            </p>
             <Button variant="link" asChild className="px-1 py-1 self-start mt-auto text-primary hover:text-primary/80 font-semibold text-base group">
              <Link href="/services#privatpersonen">{translations.viewDetailsButton} <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform"/></Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       <section className="text-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-muted/50 dark:bg-muted/20 rounded-xl shadow-lg">
        <div className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto">
          <div className="mb-6 flex justify-center items-center gap-4">
              <Heart className="text-accent h-8 w-8 sm:h-10 sm:w-10" />
              <Handshake className="text-accent h-8 w-8 sm:h-10 sm:w-10" />
              <Settings className="text-accent h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-5">{translations.howItWorksTitle}</h2>
          <p className="text-muted-foreground mb-8 sm:mb-10 text-base sm:text-lg md:text-xl leading-relaxed">
          {translations.howItWorksDescription}
          </p>
          <Button variant="accent" size="lg" asChild className="text-base sm:text-lg py-3 px-6 sm:px-8 rounded-lg shadow-md transition-transform hover:scale-105">
            <Link href="/how-it-works">{translations.howItWorksButton}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}