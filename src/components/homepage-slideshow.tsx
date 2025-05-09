
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideData {
  id: number;
  imageUrl: string;
  imageHint: string; 
  altText: string;
  titleKey: keyof SlideTextContent;
  descriptionKey: keyof SlideTextContent;
  ctaTextKey?: keyof SlideTextContent;
  ctaLink?: string;
}

interface SlideTextContent {
  welcomeTitle: string;
  welcomeDescription: string;
  learnMore: string;
  websiteHelpTitle: string;
  websiteHelpDescription: string;
  ourServices: string;
  volunteerTitle: string;
  volunteerDescription: string;
  requestHelp: string;
}

// Static text content for slides - can be expanded or moved to a language context if needed
const slideTexts: Record<'de' | 'en', SlideTextContent> = {
  de: {
    welcomeTitle: 'Willkommen bei Nginxify Assist!',
    welcomeDescription: 'Ehrenamtliche IT-Unterstützung für Vereine und Einzelpersonen. Wir helfen Ihnen, die digitale Welt zu meistern.',
    learnMore: 'Mehr Erfahren',
    websiteHelpTitle: 'Hilfe bei Ihrer Webseite benötigt?',
    websiteHelpDescription: 'Von der grundlegenden Einrichtung bis zur Beratung zu Online-Tools – unsere Freiwilligen helfen gerne.',
    ourServices: 'Unsere Leistungen',
    volunteerTitle: 'Unterstützung durch Freiwillige, für die Gemeinschaft',
    volunteerDescription: 'Engagierte Technik-Enthusiasten bieten ihre Zeit und Fähigkeiten an.',
    requestHelp: 'Hilfe Anfragen',
  },
  en: {
    welcomeTitle: 'Welcome to Nginxify Assist!',
    welcomeDescription: 'Volunteer IT support for clubs and individuals. We help you navigate the digital world.',
    learnMore: 'Learn More',
    websiteHelpTitle: 'Need Help with Your Website?',
    websiteHelpDescription: 'From basic setup to advice on online tools, our volunteers are here to assist.',
    ourServices: 'Our Services',
    volunteerTitle: 'Support by Volunteers, For the Community',
    volunteerDescription: 'Passionate tech enthusiasts offering their time and skills.',
    requestHelp: 'Request Help',
  },
};


const slidesData: SlideData[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwdGVhbXxlbnwwfHx8fDE3MjM4MDQwODV8MA&ixlib=rb-4.0.3&q=80&w=1600',
    imageHint: 'community support team',
    altText: 'Diverse group of people collaborating with technology',
    titleKey: 'welcomeTitle',
    descriptionKey: 'welcomeDescription',
    ctaTextKey: 'learnMore',
    ctaLink: '/how-it-works',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHx3ZWJzaXRlJTIwY3JlYXRpb24lMjBsYXB0b3B8ZW58MHx8fHwxNzIzODA0MTM3fDA&ixlib=rb-4.0.3&q=80&w=1600',
    imageHint: 'website creation laptop',
    altText: 'Laptop screen showing website design process',
    titleKey: 'websiteHelpTitle',
    descriptionKey: 'websiteHelpDescription',
    ctaTextKey: 'ourServices',
    ctaLink: '/services',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1573496774439-972004891aed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MzEzMjR8MHwxfHNlYXJjaHwxfHx2b2x1bnRlZXIlMjBoZWxwaW5nJTIwY29tcHV0ZXJ8ZW58MHx8fHwxNzIzODA0MTcxfDA&ixlib=rb-4.0.3&q=80&w=1600',
    imageHint: 'volunteer helping computer',
    altText: 'Friendly volunteer assisting someone with a computer',
    titleKey: 'volunteerTitle',
    descriptionKey: 'volunteerDescription',
    ctaTextKey: 'requestHelp',
    ctaLink: '/contact',
  },
];

const AUTOPLAY_INTERVAL = 7000; // 7 seconds

const HomepageSlideshow: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [texts, setTexts] = useState(slideTexts.de); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Set language based on HTML lang attribute after mount
    const currentLang = document.documentElement.lang || 'de';
    setTexts(slideTexts[currentLang as 'de' | 'en'] || slideTexts.de);
  }, []);


  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slidesData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slidesData.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (!isMounted) return; // Don't start interval if not mounted
    const timer = setTimeout(goToNext, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext, isMounted]);

  if (!isMounted) {
    // Placeholder or null during SSR to avoid hydration issues if language causes mismatch
    return (
        <section className="relative w-full aspect-video min-h-[300px] sm:min-h-[350px] md:min-h-[400px] max-h-[650px] overflow-hidden rounded-xl shadow-2xl bg-muted flex items-center justify-center">
           <div className="text-center p-4 md:p-8">
             {/* Simplified skeleton for SSR/initial load */}
           </div>
        </section>
    );
  }

  const currentSlide = slidesData[currentIndex];

  return (
    <section className="relative w-full aspect-video min-h-[300px] sm:min-h-[350px] md:min-h-[400px] max-h-[650px] overflow-hidden rounded-xl shadow-2xl group">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={slide.imageUrl}
            alt={texts[slide.altText as keyof SlideTextContent] || slide.altText}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === 0} 
            data-ai-hint={slide.imageHint}
            sizes="100vw" // Simplified sizes, as aspect ratio is fixed
          />
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6 sm:p-8 md:p-12 lg:p-16 z-20 pb-16 md:pb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg">
          {texts[currentSlide.titleKey]}
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-200 mb-5 sm:mb-6 md:mb-8 max-w-md md:max-w-2xl lg:max-w-3xl mx-auto drop-shadow-md">
          {texts[currentSlide.descriptionKey]}
        </p>
        {currentSlide.ctaTextKey && currentSlide.ctaLink && texts[currentSlide.ctaTextKey] && (
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-3 px-6 sm:px-8 rounded-lg shadow-lg transition-transform hover:scale-105">
            <Link href={currentSlide.ctaLink}>{texts[currentSlide.ctaTextKey]}</Link>
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 left-2 sm:left-3 md:left-4 transform -translate-y-1/2 z-30 text-white hover:bg-white/20 h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1/2 right-2 sm:right-3 md:right-4 transform -translate-y-1/2 z-30 text-white hover:bg-white/20 h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full opacity-70 group-hover:opacity-100 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
      </Button>

      <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slidesData.map((_, slideIndex) => (
          <button
            key={slideIndex}
            className={cn(
              'h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 rounded-full transition-all duration-300 ease-in-out',
              currentIndex === slideIndex ? 'bg-primary scale-125 w-4 sm:w-5 md:w-6' : 'bg-white/60 hover:bg-white/90'
            )}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HomepageSlideshow;

