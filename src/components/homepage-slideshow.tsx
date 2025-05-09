
'use client';

import type { FC } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SlideContentData } from '@/lib/content-types'; // Import the shared type
import { useLanguage } from '@/context/language-context';

const AUTOPLAY_INTERVAL = 7000; // 7 seconds

interface HomepageSlideshowProps {
  slides: SlideContentData[];
}

const HomepageSlideshow: FC<HomepageSlideshowProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, [slides.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (!isMounted || slides.length === 0) return; 
    const timer = setTimeout(goToNext, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext, isMounted, slides.length]);

  if (!isMounted || slides.length === 0) {
    return (
        <section className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] max-h-[650px] overflow-hidden rounded-xl shadow-2xl bg-muted flex items-center justify-center">
           <div className="text-center p-4 md:p-8">
            <div className="animate-pulse">
                <div className="h-10 w-3/4 sm:h-12 md:w-2/3 mx-auto mb-4 sm:mb-6 bg-muted-foreground/20 rounded-md"></div>
                <div className="h-6 w-full sm:h-7 max-w-lg sm:max-w-xl mx-auto mb-8 sm:mb-10 bg-muted-foreground/20 rounded-md"></div>
                <div className="h-11 w-36 sm:h-12 sm:w-40 mx-auto bg-muted-foreground/20 rounded-md"></div>
            </div>
           </div>
        </section>
    );
  }

  const currentSlide = slides[currentIndex];
  const title = language === 'de' ? currentSlide.title_de : currentSlide.title_en;
  const description = language === 'de' ? currentSlide.description_de : currentSlide.description_en;
  const altText = language === 'de' ? currentSlide.altText_de : currentSlide.altText_en;
  const ctaText = language === 'de' ? currentSlide.ctaText_de : currentSlide.ctaText_en;


  return (
    <section className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] xl:min-h-[500px] max-h-[650px] overflow-hidden rounded-xl shadow-2xl group">
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={slide.imageUrl}
            alt={language === 'de' ? slide.altText_de : slide.altText_en}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === 0} 
            data-ai-hint={slide.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 50vw" 
          />
        </div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent sm:bg-gradient-to-t sm:from-black/60 sm:via-black/30 sm:to-transparent md:bg-gradient-to-r md:from-black/50 md:to-transparent"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-4 pb-12 sm:p-6 sm:pb-16 md:items-start md:justify-center md:text-left md:p-8 lg:p-12 xl:p-16 z-20">
        <div className="md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-transparent p-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-5 sm:mb-6 md:mb-8 [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]">
            {description}
          </p>
          {ctaText && currentSlide.ctaLink && (
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-3 px-6 sm:px-8 rounded-lg shadow-lg transition-transform hover:scale-105">
              <Link href={currentSlide.ctaLink}>{ctaText}</Link>
            </Button>
          )}
        </div>
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
        {slides.map((_, slideIndex) => (
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

