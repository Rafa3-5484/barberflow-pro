'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useStore } from '@/lib/store';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { sidebarOpen } = useStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const collapsed = !sidebarOpen || isMobile;

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Header />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-4 lg:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
