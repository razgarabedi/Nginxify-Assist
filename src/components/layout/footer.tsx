
'use client'; // Make it a client component

import Link from 'next/link';
import { useLanguage } from '@/context/language-context'; // Import useLanguage hook

export default function Footer() {
  const { language } = useLanguage(); // Use context
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary py-4 md:py-6 mt-10 md:mt-12 lg:mt-16 border-t"> {/* Adjusted margin and padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-xs sm:text-sm"> {/* Responsive padding and text size */}
        <p>
          &copy; {currentYear} Nginxify Assist. {language === 'en' ? 'All rights reserved.' : 'Alle Rechte vorbehalten.'}
        </p>
        {/* Optional Links */}
        {/* <div className="mt-2 space-x-4">
          <Link href="/imprint" className="hover:text-primary">{language === 'en' ? 'Imprint' : 'Impressum'}</Link>
          <Link href="/privacy" className="hover:text-primary">{language === 'en' ? 'Privacy Policy' : 'Datenschutz'}</Link>
        </div> */}
      </div>
    </footer>
  );
}
