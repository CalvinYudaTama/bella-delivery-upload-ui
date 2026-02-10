'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { shopifyAuthService } from '@/services/shopifyAuthService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { shop: string; token: string } | null;
}

interface AuthContextType {
  authState: AuthState;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });

  //  Check authentication status on initialization
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = shopifyAuthService.getCurrentSession();
      
      if (session) {
        const isValid = await shopifyAuthService.validateSession(session.token, session.shop);
        
        if (isValid) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: session
          });
        } else {
          shopifyAuthService.clearSession();
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    }
  };

  const login = async () => {
    // Customer Account login is handled directly in LoginPage component
    // This method is kept for compatibility but doesn't need to do anything
    // since the actual login logic is in LoginPage.tsx
    console.log('Login method called, but Customer Account login is handled in LoginPage component');
  };

  const logout = () => {
    shopifyAuthService.clearSession();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    });
  };

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
