'use client';

import { motion } from 'framer-motion';
import { Clock, Check, X, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, getInitials } from '@/lib/utils';
import { APPOINTMENT_STATUS, SERVICE_TYPES } from '@serviceflow/shared';

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'info' | 'destructive'> = {
  scheduled: 'info',
  confirmed: 'success',
  in_progress: 'warning',
  completed: 'default',
  cancelled: 'destructive',
  rescheduled: 'default',
};

const appointments = [
  {
    id: '1',
    time: '08:00',
    client: 'Carlos Silva',
    service: 'Instalação',
    status: 'confirmed',
    initials: 'CS',
  },
  {
    id: '2',
    time: '09:30',
    client: 'Maria Oliveira',
    service: 'Manutenção',
    status: 'in_progress',
    initials: 'MO',
  },
  {
    id: '3',
    time: '11:00',
    client: 'João Santos',
    service: 'Reparo',
    status: 'scheduled',
    initials: 'JS',
  },
  {
    id: '4',
    time: '13:30',
    client: 'Ana Costa',
    service: 'Limpeza',
    status: 'scheduled',
    initials: 'AC',
  },
  {
    id: '5',
    time: '15:00',
    client: 'Pedro Alves',
    service: 'Inspeção',
    status: 'scheduled',
    initials: 'PA',
  },
];

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Próximos Atendimentos</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] px-6 pb-4">
          <div className="space-y-2">
            {appointments.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {apt.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground">{apt.time}</span>
                    <Badge
                      variant={statusVariants[apt.status] || 'default'}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {APPOINTMENT_STATUS[apt.status] || apt.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium truncate mt-0.5">{apt.client}</p>
                  <p className="text-xs text-muted-foreground truncate">{apt.service}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon-sm" className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30">
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30">
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
