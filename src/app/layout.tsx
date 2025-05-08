
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { LanguageProvider } from '@/context/language-context';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Nginxify Assist',
  description: 'Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          'antialiased flex flex-col min-h-screen font-sans'
        )}
      >
        <LanguageProvider>
          <Header />
          {/* Adjusted padding for better responsiveness across devices */}
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

