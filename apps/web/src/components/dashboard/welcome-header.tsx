'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function WelcomeHeader() {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('Rafael');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');

    setCurrentDate(format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }));

    const stored = localStorage.getItem('serviceflow-store');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user?.name) {
          setUserName(parsed.state.user.name.split(' ')[0]);
        }
      } catch {}
    }
  }, []);

  const dateCapitalized = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-6"
    >
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {greeting}, {userName}
        <span className="ml-1 inline-block animate-wave" role="img" aria-label="aceno">
          👋
        </span>
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{dateCapitalized}</p>
    </motion.div>
  );
}
