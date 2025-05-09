
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { LanguageProvider, useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

const SITE_NAME = 'Nginxify Assist';
const SITE_DESCRIPTION_DE = 'Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen in Deutschland. Kostenlos oder spendenbasiert.';
const SITE_DESCRIPTION_EN = 'Volunteer IT support for clubs & individuals in Germany. Free or donation-based.';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nginxify.com'; // Replace with your actual domain

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION_DE, // Default description
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  keywords: ['IT-Hilfe', 'Ehrenamt', 'Vereine', 'Technik-Support', 'Nginxify', 'IT Support', 'Volunteer', 'Non-profit'],
  authors: [{ name: 'Nginxify Team' , url: BASE_URL }], // Replace with actual author/org info
  creator: 'Nginxify Team',
  publisher: 'Nginxify Assist',
  alternates: {
    canonical: '/', // Default canonical
    languages: {
      'de-DE': '/',
      'en-US': '/?lang=en', // Assuming ?lang=en for English version for metadata purposes
    },
  },
  openGraph: {
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION_DE, // Default OG description
    url: BASE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${BASE_URL}/og-image.png`, // Replace with your actual default OG image URL
        width: 1200,
        height: 630,
        alt: `Logo of ${SITE_NAME}`,
      },
    ],
    locale: 'de_DE', // Default locale
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION_DE,
    // siteId: '@yourTwitterHandle', // Optional: Your Twitter ID
    // creator: '@creatorTwitterHandle', // Optional: Creator's Twitter ID
    images: [`${BASE_URL}/twitter-image.png`], // Replace with your actual default Twitter image URL
  },
  robots: { // Default robot settings, can be overridden per page
    index: true,
    follow: true,
    nocache: false, // Allow caching
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, // Allow Google to index images
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // icons: { // Add if you have specific icons beyond favicon.ico
  //   icon: '/icon.png',
  //   shortcut: '/shortcut-icon.png',
  //   apple: '/apple-icon.png',
  // },
  manifest: `${BASE_URL}/site.webmanifest`, // Optional: If you have a web app manifest
};

export const viewport: Viewport = {
  themeColor: [ // Example theme colors
    { media: '(prefers-color-scheme: light)', color: '#ffffff' }, // Light theme
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },  // Dark theme (example --background HSL for dark)
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Optional: control user scaling
  // userScalable: false, // Optional: control user scaling
}

// Client component to set lang attribute dynamically
function HtmlLangUpdater() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null; // This component doesn't render anything visible
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Defaulting to 'de' here as metadata is generated server-side before context is available.
    // HtmlLangUpdater will update it on the client.
    <html lang="de" suppressHydrationWarning className="h-full">
      <head>
        {/* Preconnect to CDNs or critical origins */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://picsum.photos" />
        {/* Add other preconnects if necessary, e.g., for Google Fonts if used directly */}
      </head>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          'antialiased flex flex-col min-h-screen font-sans bg-background text-foreground'
        )}
      >
        <LanguageProvider>
          <HtmlLangUpdater /> {/* Updates lang on client */}
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            {children}
          </main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
