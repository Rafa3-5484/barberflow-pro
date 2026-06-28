'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from 'next-themes';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      richColors
      closeButton
      expand
      toastOptions={{
        duration: 4000,
        className: 'font-sans',
      }}
    />
  );
}

export { toast } from 'sonner';
