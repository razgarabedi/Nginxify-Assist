
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(admin)/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogOut, Save } from 'lucide-react';

/**
 * AdminDashboardPage component:
 * - The main content area for administrators after logging in.
 * - Protected route: redirects to login if not authenticated.
 * - Provides a simple textarea to edit some "website content".
 * - Includes a "Save" button (currently logs to console and shows a toast).
 * - Includes a "Logout" button.
 */
export default function AdminDashboardPage() {
  const { isAuthenticated, logout, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState('Welcome to our website! This content is editable.');
  const [isSaving, setIsSaving] = useState(false);

  // Effect to protect the route: redirect if not authenticated
  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.replace('/mngr/login');
    }
  }, [isAuthenticated, authIsLoading, router]);

  /**
   * Handles saving the content.
   * Simulates an API call and shows a toast message.
   */
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Content saved:', content); // Log to console for demonstration
    toast({
      title: 'Content Saved',
      description: 'Your changes have been saved successfully.',
    });
    setIsSaving(false);
  };

  // Show loading indicator if auth state is loading or user is not authenticated yet (before redirect)
  if (authIsLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Render the dashboard UI if authenticated
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>Edit website content below.</CardDescription>
            </div>
            {/* Logout button */}
            <Button variant="outline" onClick={logout} size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="websiteContent" className="block text-sm font-medium text-foreground mb-1">
              Website Welcome Message
            </label>
            {/* Textarea for editing content */}
            <Textarea
              id="websiteContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full"
              placeholder="Enter website content here..."
            />
          </div>
          {/* Save button with loading state */}
          <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Content'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
