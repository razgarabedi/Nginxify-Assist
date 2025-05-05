
'use client';

import Link from 'next/link';
import { useState } from 'react';
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
      {navigationItems.map((item) => {
        const linkElement = (
          <Link
            key={`${item.href}-${language}`} // Add language to key for potential re-renders on language change
            href={item.href}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === item.href ? 'text-primary font-semibold' : 'text-muted-foreground', // Highlight active link better
              isMobile ? 'block text-base py-2 px-4 rounded-md hover:bg-accent' : '' // Style mobile links differently, ensure it's block
            )}
          >
            {getLabel(item)}
          </Link>
        );

        // Only wrap with SheetClose if it's the mobile menu
        return isMobile ? (
          <SheetClose asChild key={item.href}>
            {linkElement}
          </SheetClose>
        ) : (
          linkElement // Render Link directly for desktop
        );
      })}
    </nav>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Adjusted height and padding for better responsiveness */}
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-4 flex items-center space-x-2"> {/* Simplified margin */}
          <LifeBuoy className="h-6 w-6 text-primary" />
          {/* Hide text on very small screens, show on sm and up */}
          <span className="font-bold hidden sm:inline-block">Nginxify Assist</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-4 lg:space-x-6">
          <NavLinks />
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex flex-1 justify-end items-center gap-2">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{language === 'en' ? 'Open menu' : 'Menü öffnen'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col pt-0">
               <SheetHeader className="border-b pb-3 pt-4 mb-4">
                  <SheetTitle>
                     <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                       <LifeBuoy className="h-6 w-6 text-primary" />
                       <span className="font-bold">Nginxify Assist</span>
                    </Link>
                 </SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto">
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
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
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
