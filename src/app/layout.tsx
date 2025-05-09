
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { LanguageProvider } from '@/context/language-context';
import HtmlLangUpdater from '@/components/layout/html-lang-updater';
import { cn } from '@/lib/utils';

const SITE_NAME = 'Nginxify Assist';
const SITE_DESCRIPTION_DE = 'Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen in Deutschland. Kostenlos oder spendenbasiert.';
const SITE_DESCRIPTION_EN = 'Volunteer IT support for clubs & individuals in Germany. Free or donation-based.';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nginxify.com'; 

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_DE, 
  alternates: {
    canonical: '/',
    languages: {
      'de-DE': '/',
      'en-US': '/?lang=en', 
    },
  },
  openGraph: {
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION_DE, 
    url: BASE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${BASE_URL}/og-image.png`, 
        width: 1200,
        height: 630,
        alt: `Logo of ${SITE_NAME}`,
      },
    ],
    locale: 'de_DE', 
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION_DE,
    images: [`${BASE_URL}/twitter-image.png`], 
  },
  robots: { 
    index: true,
    follow: true,
    nocache: false, 
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, 
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  keywords: ['IT-Hilfe', 'Ehrenamt', 'Vereine', 'Technik-Support', 'Nginxify', 'IT Support', 'Volunteer', 'Non-profit', 'nginx web server', 'nginx reverse proxy', 'nginx configuration', 'kostenlose IT Hilfe', 'gemeinnützige IT Unterstützung'],
  authors: [{ name: 'Nginxify Team' , url: BASE_URL }], 
  creator: 'Nginxify Team',
  publisher: 'Nginxify Assist',
  manifest: `${BASE_URL}/site.webmanifest`, 
};

export const viewport: Viewport = {
  themeColor: [ 
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' }, 
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },  
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Often set to 1 for accessibility, but 2-5 can allow some user zoom.
  // userScalable: true, // Default is true, explicitly set if needed.
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* Google Fonts preconnect examples. Activate if using Google Fonts directly.
            GeistSans/Mono are self-hosted via next/font, so these are not strictly needed for them.
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        */}
      </head>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          'antialiased flex flex-col min-h-screen font-sans bg-background text-foreground'
        )}
      >
        <LanguageProvider>
          <HtmlLangUpdater />
          <Header />
          {/* Adjusted padding for better responsiveness */}
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
            {children}
          </main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}

