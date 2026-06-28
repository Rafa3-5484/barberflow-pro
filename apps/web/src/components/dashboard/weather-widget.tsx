'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function WeatherWidget() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function update() {
      setTime(format(new Date(), "HH:mm:ss"));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs">Sua Localização</span>
            </div>
            <motion.p
              key={time}
              initial={{ opacity: 0.5, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-3xl font-bold tracking-tight tabular-nums"
            >
              {time}
            </motion.p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <CloudSun className="h-10 w-10 text-amber-500" />
            <span className="text-xs font-medium">Previsão</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
