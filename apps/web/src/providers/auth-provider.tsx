'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { getSession, signIn, signUp, signOut as authSignOut, signInWithGoogle, type SignInData, type SignUpData } from '@/lib/auth';
import type { User } from '@serviceflow/shared';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: SignInData) => Promise<void>;
  register: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useStore();
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const { user: sessionUser } = await getSession();
    setUser(sessionUser);
  }, [setUser]);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setIsLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = async (data: SignInData) => {
    const result = await signIn(data);
    setUser(result.user);
    router.push('/dashboard');
  };

  const register = async (data: SignUpData) => {
    const result = await signUp(data);
    setUser(result.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
    router.push('/login');
  };

  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, loginWithGoogle, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
