
import { AuthProvider } from '@/app/(admin)/contexts/auth-context';
import type { ReactNode } from 'react';

/**
 * AdminLayout component:
 * - Serves as the layout for all pages under the /mngr route.
 * - Wraps children with the AuthProvider to make authentication state available.
 * - Applies a simple background style for visual distinction of the admin area.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {/* Main container for the admin section */}
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 dark:bg-background">
        {/* 
          The AuthProvider handles the authentication logic (login, logout, state).
          Children components (login page, dashboard page) can then use the useAuth hook.
        */}
        {children}
      </div>
    </AuthProvider>
  );
}
