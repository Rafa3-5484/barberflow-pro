'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6"
        >
          <Sparkles className="mx-auto h-16 w-16 text-primary" />
        </motion.div>
        <h1 className="mb-2 text-7xl font-bold tracking-tight">404</h1>
        <h2 className="mb-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mb-8 text-muted-foreground max-w-sm mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild>
          <Link href="/dashboard" className="gap-2">
            <Home className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
