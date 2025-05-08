
'use client'; 

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Handshake, MessageSquare, Clock, Users, Gift } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/language-context';
import { useEffect, useState } from 'react';
import type { HowItWorksContentData } from '@/lib/content-types';
import { getContent } from '@/actions/content-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function HowItWorksPage() {
  const { language } = useLanguage();
  const [content, setContent] = useState<HowItWorksContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const allContent = await getContent();
        setContent(allContent.howItWorks);
      } catch (error) {
        console.error("Failed to load how-it-works content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  if (isLoading || !content) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <section className="text-center px-4 mb-10 md:mb-12 lg:mb-16">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-10 md:mb-12 lg:mb-16">
          {[...Array(6)].map((_, i) => <InfoCardSkeleton key={i} />)}
        </section>
        <section className="text-center py-10 md:py-12 lg:py-16 bg-secondary rounded-lg shadow-md mt-10 md:mt-12 px-4">
          <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
          <Skeleton className="h-5 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-12 w-36 mx-auto" />
        </section>
      </div>
    );
  }

  const translations = {
    pageTitle: language === 'en' ? content.pageTitle_en : content.pageTitle_de,
    pageDescription: language === 'en' ? content.pageDescription_en : content.pageDescription_de,
    volunteerTitle: language === 'en' ? content.volunteerTitle_en : content.volunteerTitle_de,
    volunteerDescription: language === 'en' ? content.volunteerDescription_en : content.volunteerDescription_de,
    costTitle: language === 'en' ? content.costTitle_en : content.costTitle_de,
    costDescription: language === 'en' ? content.costDescription_en : content.costDescription_de,
    requestTitle: language === 'en' ? content.requestTitle_en : content.requestTitle_de,
    requestDescriptionPart1: language === 'en' ? content.requestDescriptionPart1_en : content.requestDescriptionPart1_de,
    requestDescriptionLink: language === 'en' ? content.requestDescriptionLink_en : content.requestDescriptionLink_de,
    requestDescriptionPart2: language === 'en' ? content.requestDescriptionPart2_en : content.requestDescriptionPart2_de,
    expectationTitle: language === 'en' ? content.expectationTitle_en : content.expectationTitle_de,
    expectationDescription: language === 'en' ? content.expectationDescription_en : content.expectationDescription_de,
    whoTitle: language === 'en' ? content.whoTitle_en : content.whoTitle_de,
    whoDescription: language === 'en' ? content.whoDescription_en : content.whoDescription_de,
    donationsTitle: language === 'en' ? content.donationsTitle_en : content.donationsTitle_de,
    donationsDescription: language === 'en' ? content.donationsDescription_en : content.donationsDescription_de,
    ctaTitle: language === 'en' ? content.ctaTitle_en : content.ctaTitle_de,
    ctaDescription: language === 'en' ? content.ctaDescription_en : content.ctaDescription_de,
    ctaButton: language === 'en' ? content.ctaButton_en : content.ctaButton_de,
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <section className="text-center px-4 mb-10 md:mb-12 lg:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{translations.pageTitle}</h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
          {translations.pageDescription}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 mb-10 md:mb-12 lg:mb-16">
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
          icon={<Users className="text-primary h-6 w-6" />}
          title={translations.whoTitle}
          description={translations.whoDescription}
        />
         <InfoCard
          icon={<Gift className="text-primary h-6 w-6" />}
          title={translations.donationsTitle}
          description={translations.donationsDescription}
        />
      </section>

       <section className="text-center py-10 md:py-12 lg:py-16 bg-secondary rounded-lg shadow-md mt-10 md:mt-12 px-4">
         <h2 className="text-xl md:text-2xl font-semibold mb-4">{translations.ctaTitle}</h2>
         <p className="text-muted-foreground mb-6 max-w-md md:max-w-xl lg:max-w-2xl mx-auto">
           {translations.ctaDescription}
         </p>
         <Button asChild size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
           <Link href="/contact">{translations.ctaButton}</Link>
         </Button>
       </section>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center text-center pb-3 pt-6 px-4 sm:px-6">
        <div className="mb-3 rounded-full bg-primary/10 p-3 inline-flex">{icon}</div>
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground flex-grow px-4 sm:px-6 pb-6">
        {description}
      </CardContent>
    </Card>
  );
}

function InfoCardSkeleton() {
  return (
    <Card className="shadow-lg flex flex-col">
      <CardHeader className="items-center text-center pb-3 pt-6 px-4 sm:px-6">
        <Skeleton className="h-12 w-12 rounded-full mb-3" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="text-center flex-grow px-4 sm:px-6 pb-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

