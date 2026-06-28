'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Company } from '@serviceflow/shared';

interface AppState {
  user: User | null;
  company: Company | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  isAuthenticated: () => boolean;
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      company: null,
      sidebarOpen: true,
      theme: 'system',
      isAuthenticated: () => get().user !== null,
      setUser: (user) => set({ user }),
      setCompany: (company) => set({ company }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'serviceflow-store',
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        theme: state.theme,
      }),
    },
  ),
);
