
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle, SheetClose
import { Menu, Globe, LifeBuoy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook

const navigationItems = [
  { href: '/', label: 'Startseite', labelEn: 'Home' },
  { href: '/services', label: 'Leistungen', labelEn: 'Services' },
  { href: '/how-it-works', label: 'So Funktioniert\'s', labelEn: 'How It Works' },
  // { href: '/about', label: 'Über Uns', labelEn: 'About Us' }, // Optional
  { href: '/contact', label: 'Kontakt', labelEn: 'Contact' },
  // { href: '/donate', label: 'Spenden', labelEn: 'Donate' }, // Optional
  // { href: '/get-involved', label: 'Mitmachen', labelEn: 'Get Involved' }, // Optional
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage(); // Use context

  const getLabel = (item: (typeof navigationItems)[0]) => {
    return language === 'en' ? item.labelEn : item.label;
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav
      className={cn(
        'flex gap-4',
        isMobile ? 'flex-col space-y-4 pt-4' : 'items-center' // Increased space-y for mobile
      )}
    >
      {navigationItems.map((item) => (
         <SheetClose asChild key={item.href} disabled={!isMobile}>
           <Link
              href={item.href}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground', // Highlight active link better
                isMobile ? 'text-base py-2 px-4 rounded-md hover:bg-accent' : '' // Style mobile links
              )}
            >
              {getLabel(item)}
            </Link>
         </SheetClose>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6"> {/* Increased height slightly and added horizontal padding */}
        <Link href="/" className="mr-4 md:mr-6 flex items-center space-x-2"> {/* Adjusted margin */}
          <LifeBuoy className="h-6 w-6 text-primary" />
          {/* Title is not translated here, assuming brand name */}
          <span className="font-bold hidden sm:inline-block">Nginxify Assist</span> {/* Hide text on very small screens */}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4 lg:space-x-6"> {/* Adjusted spacing */}
          <NavLinks />
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex flex-1 justify-end items-center gap-2"> {/* Use gap */}
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full"> {/* Make it round */}
                <Menu className="h-5 w-5" /> {/* Slightly smaller icon */}
                <span className="sr-only">{language === 'en' ? 'Open menu' : 'Menü öffnen'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]"> {/* Set width */}
               <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle>
                     <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                       <LifeBuoy className="h-6 w-6 text-primary" />
                       <span className="font-bold">Nginxify Assist</span>
                    </Link>
                 </SheetTitle>
              </SheetHeader>
              <NavLinks isMobile={true} />
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
        <Button variant="ghost" size="icon" className="rounded-full"> {/* Make it round */}
          <Globe className="h-5 w-5" /> {/* Slightly smaller icon */}
          <span className="sr-only">{language === 'en' ? 'Change language' : 'Sprache wechseln'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage('de')}
          disabled={language === 'de'}
          className={cn(language === 'de' && 'font-semibold bg-accent')} // Highlight selected
        >
          Deutsch
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          disabled={language === 'en'}
          className={cn(language === 'en' && 'font-semibold bg-accent')} // Highlight selected
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
