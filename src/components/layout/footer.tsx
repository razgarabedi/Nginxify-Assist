
'use client'; 

import Link from 'next/link';
import { useLanguage } from '@/context/language-context'; 
import VisitorCounter from '@/components/visitor-counter'; 

export default function Footer() {
  const { language } = useLanguage(); 
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/70 dark:bg-secondary/40 py-6 md:py-8 mt-12 md:mt-16 lg:mt-20 border-t"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm sm:text-base space-y-3"> 
        <p>
          &copy; {currentYear} Nginxify Assist. {language === 'en' ? 'All rights reserved.' : 'Alle Rechte vorbehalten.'}
        </p>
        <VisitorCounter /> 
        {/* Optional Links - Keep them commented unless specifically requested to be active */}
        {/* <div className="pt-2 space-x-4 sm:space-x-6">
          <Link href="/imprint" className="hover:text-primary transition-colors">{language === 'en' ? 'Imprint' : 'Impressum'}</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">{language === 'en' ? 'Privacy Policy' : 'Datenschutz'}</Link>
        </div> */}
      </div>
    </footer>
  );
}
