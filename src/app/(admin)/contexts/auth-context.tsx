
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Define the shape of the authentication context
interface AuthContextProps {
  isAuthenticated: boolean;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Create the authentication context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hardcoded credentials for simplicity (DO NOT USE IN PRODUCTION)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

/**
 * AuthProvider component to wrap parts of the application that need authentication.
 * It manages the authentication state and provides login/logout functionality.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check
  const router = useRouter();
  const { toast } = useToast();

  // Simulate checking auth status from localStorage on initial load
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('isAdminAuthenticated');
    if (storedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  /**
   * login function:
   * - Takes username and password as input.
   * - Checks against hardcoded credentials.
   * - Updates authentication state.
   * - Stores auth status in localStorage.
   * - Navigates to the admin dashboard on successful login.
   * - Shows a toast message for success or failure.
   */
  const login = useCallback(async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin area.',
      });
      router.push('/mngr/dashboard');
      return true;
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
      return false;
    }
  }, [router, toast]);

  /**
   * logout function:
   * - Clears authentication state.
   * - Removes auth status from localStorage.
   * - Navigates to the login page.
   * - Shows a toast message.
   */
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdminAuthenticated');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/mngr/login');
  }, [router, toast]);

  // Provide the authentication context to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth hook:
 * - Custom hook to easily access the authentication context.
 * - Throws an error if used outside of an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
