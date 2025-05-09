
'use client'; 

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User } from 'lucide-react';
import { useLanguage } from '@/context/language-context'; 
import React, { useEffect, useState } from 'react'; // Import React
import type { HomeContentData } from '@/lib/content-types';
import { getContent } from '@/actions/content-actions';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: {}; 
  searchParams: { [key: string]: string | string[] | undefined };
};

const SITE_NAME = 'Nginxify Assist'; // Should match layout.tsx or come from a shared config
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nginxify.com';

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const allContent = await getContent();
  const homeContent = allContent.home;
  
  // Language determination for metadata - defaults to 'de'
  // If language switching modified URL (e.g. ?lang=en), searchParams.lang could be used
  const lang = searchParams?.lang === 'en' ? 'en' : 'de';

  const title = lang === 'en' ? homeContent.pageTitle_en : homeContent.pageTitle_de;
  const description = lang === 'en' ? homeContent.pageDescription_en : homeContent.pageDescription_de;
  const parentOpenGraph = (await parent).openGraph || {};
  const parentTwitter = (await parent).twitter || {};

  return {
    title: title, // Page-specific title, template from layout will append site name
    description: description,
    alternates: {
      canonical: '/',
      languages: {
        'de-DE': `${BASE_URL}/`,
        'en-US': `${BASE_URL}/?lang=en`, // Example for English version if using query param
      },
    },
    openGraph: {
      ...parentOpenGraph,
      title: title,
      description: description,
      url: lang === 'en' ? `${BASE_URL}/?lang=en` : `${BASE_URL}/`,
      images: [
        {
          url: `${BASE_URL}/og-home.png`, // Specific OG image for home page
          width: 1200,
          height: 630,
          alt: title,
        },
        ...(parentOpenGraph.images || []),
      ],
      locale: lang === 'de' ? 'de_DE' : 'en_US',
    },
    twitter: {
      ...parentTwitter,
      title: title,
      description: description,
      images: [`${BASE_URL}/twitter-home.png`, ...(parentTwitter.images || [])], // Specific Twitter image
    },
  };
}


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
      <div className="space-y-8 md:space-y-12 lg:space-y-16">
        {/* Hero Section Skeleton */}
        <section className="text-center py-12 md:py-16 lg:py-20 px-4 bg-card rounded-lg shadow-md">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-48" />
          </div>
        </section>
        {/* Service Previews Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {[1, 2].map((i) => (
            <Card key={`service-skel-${i}`} className="shadow-lg flex flex-col">
              <CardHeader className="p-4 sm:p-6">
                <Skeleton className="h-8 w-3/5 mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent className="flex-grow p-4 sm:p-6 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-28 mt-4" />
              </CardContent>
            </Card>
          ))}
        </section>
        {/* How it Works Skeleton */}
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
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      <section className="text-center py-12 md:py-16 lg:py-20 px-4 bg-card dark:bg-secondary/30 rounded-lg shadow-md">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
          {translations.pageTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card dark:bg-secondary/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Users className="text-primary h-5 w-5 md:h-6 md:w-6" />
              {translations.clubsTitle}
            </CardTitle>
            <CardDescription>{translations.clubsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 sm:p-6">
            <p className="mb-4 text-muted-foreground flex-grow">
             {translations.clubsText}
            </p>
            <Button variant="link" asChild className="px-0 self-start mt-auto text-primary hover:text-primary/80">
              <Link href="/services#vereine">{translations.viewDetailsButton}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card dark:bg-secondary/30">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <User className="text-primary h-5 w-5 md:h-6 md:w-6" />
              {translations.individualsTitle}
            </CardTitle>
             <CardDescription>{translations.individualsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col p-4 sm:p-6">
            <p className="mb-4 text-muted-foreground flex-grow">
             {translations.individualsText}
            </p>
             <Button variant="link" asChild className="px-0 self-start mt-auto text-primary hover:text-primary/80">
              <Link href="/services#privatpersonen">{translations.viewDetailsButton}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       <section className="text-center py-10 md:py-12 lg:py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">{translations.howItWorksTitle}</h2>
        <p className="text-muted-foreground mb-8 max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
         {translations.howItWorksDescription}
        </p>
        <Button variant="accent" size="lg" asChild>
           <Link href="/how-it-works">{translations.howItWorksButton}</Link>
        </Button>
      </section>
    </div>
  );
}
