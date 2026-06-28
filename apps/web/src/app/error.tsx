'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
        </motion.div>
        <h1 className="mb-2 text-3xl font-bold">Algo deu errado</h1>
        <p className="mb-8 text-muted-foreground max-w-sm mx-auto">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </motion.div>
    </div>
  );
}
