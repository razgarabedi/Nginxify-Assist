
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Globe, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

const navigationItems = [
  { href: '/', label: 'Startseite', labelEn: 'Home' },
  { href: '/services', label: 'Leistungen', labelEn: 'Services' },
  { href: '/how-it-works', label: 'So Funktioniert\'s', labelEn: 'How It Works' },
  { href: '/contact', label: 'Kontakt', labelEn: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage(); 
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const getLabel = (item: (typeof navigationItems)[0]) => {
    return language === 'en' ? item.labelEn : item.label;
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav
      className={cn(
        'flex gap-x-3 lg:gap-x-5', // Adjusted desktop gap
        isMobile ? 'flex-col space-y-2 pt-4 px-2' : 'items-center' 
      )}
    >
      {navigationItems.map((item) => {
        const linkContent = (
            <Link
                href={item.href}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={cn(
                'font-medium transition-colors hover:text-primary text-sm lg:text-base', // Base text size for desktop
                pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground/80',
                isMobile ? 'block text-lg py-3 px-4 rounded-lg hover:bg-accent focus:bg-accent focus:text-accent-foreground' : 'py-2 px-1' 
                )}
            >
                {getLabel(item)}
            </Link>
        );
        
        return isMobile ? (
          <SheetClose asChild key={`${item.href}-${language}-mobile`}>
            {linkContent}
          </SheetClose>
        ) : (
          <div key={`${item.href}-${language}-desktop`}>{linkContent}</div>
        );
      })}
    </nav>
  );


  if (!isMounted) {
    // To prevent hydration mismatch, render a simpler or placeholder header on first server render
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
             <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <LifeBuoy className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    <span className="font-bold text-lg sm:text-xl">Nginxify Assist</span>
                </div>
                <div className="h-8 w-8 bg-muted rounded-md md:hidden"></div> {/* Placeholder for mobile menu button */}
             </div>
        </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
          <LifeBuoy className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <span className="font-bold text-lg sm:text-xl">Nginxify Assist</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <NavLinks />
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 sm:h-11 sm:w-11">
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">{language === 'en' ? 'Open menu' : 'Menü öffnen'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col p-0">
               <SheetHeader className="border-b py-4 px-6 mb-2">
                  <SheetTitle>
                     <Link href="/" className="flex items-center space-x-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                       <LifeBuoy className="h-7 w-7 text-primary" />
                       <span className="font-semibold text-xl">Nginxify Assist</span>
                    </Link>
                 </SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto py-4">
                <NavLinks isMobile={true} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


const LanguageSwitcher = ({ language, setLanguage }: { language: 'de' | 'en'; setLanguage: (lang: 'de' | 'en') => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10">
          <Globe className="h-5 w-5 sm:h-[1.125rem] sm:w-[1.125rem]" /> {/* Slightly larger on sm screens */}
          <span className="sr-only">{language === 'en' ? 'Change language' : 'Sprache wechseln'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => setLanguage('de')}
          disabled={language === 'de'}
          className={cn(language === 'de' && 'font-semibold bg-accent', 'text-sm cursor-pointer')} 
        >
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          disabled={language === 'en'}
          className={cn(language === 'en' && 'font-semibold bg-accent', 'text-sm cursor-pointer')} 
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

