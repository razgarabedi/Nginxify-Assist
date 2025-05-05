
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Import directly from geist/font/sans
import { GeistMono } from 'geist/font/mono'; // Import directly from geist/font/mono
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { LanguageProvider } from '@/context/language-context'; // Import the provider
import { cn } from '@/lib/utils'; // Import cn utility

// Remove GeistSans and GeistMono instantiation - not needed when importing from geist/font

export const metadata: Metadata = {
  title: 'Nginxify Assist',
  description: 'Ehrenamtliche IT-Unterstützung für Vereine & Einzelpersonen', // Keep primary description German or make dynamic later if needed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Remove suppressHydrationWarning if language isn't causing hydration issues
    // It's better to fix the root cause if possible. Language context should handle this.
    <html lang="de" suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.variable, // Use variable directly from import
          GeistMono.variable, // Use variable directly from import
          'antialiased flex flex-col min-h-screen font-sans' // Ensure font-sans uses the variable (check tailwind.config.ts)
        )}
      >
        <LanguageProvider> {/* Wrap with LanguageProvider */}
          <Header />
          {/* Adjusted padding for better responsiveness */}
          <main className="flex-grow container mx-auto px-4 py-6 md:py-8 lg:py-10">
            {children}
          </main>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
