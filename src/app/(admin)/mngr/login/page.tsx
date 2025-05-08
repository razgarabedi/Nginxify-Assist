
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';

/**
 * AdminLoginPage component:
 * - Provides a login form for the admin area.
 * - Uses hardcoded credentials (admin/password) for simplicity (NOT FOR PRODUCTION).
 * - On successful login, redirects to the admin dashboard.
 * - If already authenticated, redirects to the dashboard.
 */
export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Redirect to dashboard if already authenticated and auth state is loaded
  useEffect(() => {
    if (!authIsLoading && isAuthenticated) {
      router.replace('/mngr/dashboard');
    }
  }, [isAuthenticated, authIsLoading, router]);

  /**
   * Handles the form submission for login.
   * Prevents default form submission, calls the login function from AuthContext.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await login(username, password);
    // login function in AuthContext handles redirection and toast messages
    setIsSubmitting(false);
  };

  // Show loading spinner if auth state is still loading and user might be authenticated
  if (authIsLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If authenticated after loading, this page shouldn't be visible (due to useEffect redirect)
  // but as a fallback, don't render the form.
  if (isAuthenticated) {
     return null;
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin area.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            {/* Submit button with loading state */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-center block">
           <p className="text-muted-foreground">For demo: use admin / password</p>
        </CardFooter>
      </Card>
    </div>
  );
}
