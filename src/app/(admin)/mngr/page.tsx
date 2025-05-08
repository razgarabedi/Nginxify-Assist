
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/contexts/auth-context';
import { Loader2 } from 'lucide-react';

/**
 * MngrRootPage component:
 * - This is the default page when a user navigates to /mngr.
 * - It checks the authentication status using the useAuth hook.
 * - If the user is authenticated, it redirects to the admin dashboard (/mngr/dashboard).
 * - If the user is not authenticated, it redirects to the login page (/mngr/login).
 * - Shows a loading indicator while determining the redirect.
 */
export default function MngrRootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth status to be determined
    if (isLoading) {
      return;
    }

    // Redirect based on authentication status
    if (isAuthenticated) {
      router.replace('/mngr/dashboard');
    } else {
      router.replace('/mngr/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Display a loading message or spinner while redirection is in progress
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">Loading Admin Area...</p>
      {/* This content is shown briefly while the useEffect hook determines the correct redirect path. */}
    </div>
  );
}
