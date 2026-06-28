'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  CalendarDays,
  List,
  Columns3,
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, getInitials, APPOINTMENT_STATUS } from '@/lib/utils';

type ViewMode = 'day' | 'week' | 'month' | 'list' | 'kanban';

const appointments = [
  { id: '1', time: '08:00', client: 'Carlos Silva', service: 'Instalação', status: 'confirmed', type: 'Instalação', priority: 'high', initials: 'CS' },
  { id: '2', time: '09:30', client: 'Maria Oliveira', service: 'Manutenção', status: 'in_progress', type: 'Manutenção', priority: 'urgent', initials: 'MO' },
  { id: '3', time: '11:00', client: 'João Santos', service: 'Reparo', status: 'scheduled', type: 'Reparo', priority: 'medium', initials: 'JS' },
  { id: '4', time: '13:30', client: 'Ana Costa', service: 'Limpeza', status: 'completed', type: 'Limpeza', priority: 'low', initials: 'AC' },
  { id: '5', time: '15:00', client: 'Pedro Alves', service: 'Inspeção', status: 'cancelled', type: 'Inspeção', priority: 'medium', initials: 'PA' },
];

export default function AgendaPage() {
  const [view, setView] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState('');

  function navigate(direction: 'prev' | 'next') {
    const delta = direction === 'next' ? 1 : -1;
    if (view === 'day') setCurrentDate((d) => (delta > 0 ? addDays(d, 1) : subDays(d, 1)));
    else if (view === 'week') setCurrentDate((d) => (delta > 0 ? addDays(d, 7) : subDays(d, 7)));
    else setCurrentDate((d) => (delta > 0 ? addMonths(d, 1) : subMonths(d, 1)));
  }

  function getDateRange() {
    if (view === 'day') return format(currentDate, "dd 'de' MMMM", { locale: ptBR });
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(start, 'dd/MM')} - ${format(end, 'dd/MM')}`;
    }
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return `${format(monthStart, "MMMM 'de' yyyy", { locale: ptBR })}`;
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  const statusVariant: Record<string, 'info' | 'success' | 'warning' | 'default' | 'destructive'> = {
    scheduled: 'info',
    confirmed: 'success',
    in_progress: 'warning',
    completed: 'default',
    cancelled: 'destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday} className="font-medium">
            Hoje
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold capitalize ml-2">{getDateRange()}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="day" className="gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dia</span>
              </TabsTrigger>
              <TabsTrigger value="week" className="gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Semana</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mês</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1">
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-1">
                <Columns3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar agendamentos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Cliente</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Carlos Silva</SelectItem>
                      <SelectItem value="2">Maria Oliveira</SelectItem>
                      <SelectItem value="3">João Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Título</label>
                  <Input placeholder="Título do serviço" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Data</label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instalacao">Instalação</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="reparo">Reparo</SelectItem>
                        <SelectItem value="limpeza">Limpeza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Início</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Término</label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Criar Agendamento</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {(view === 'list' || view === 'day' || view === 'week' || view === 'month') && (
            <div className="space-y-2">
              {appointments.map((apt, idx) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.3 }}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {apt.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{apt.client}</span>
                      <Badge variant={statusVariant[apt.status]} className="text-[10px] px-1.5 py-0">
                        {APPOINTMENT_STATUS[apt.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {apt.time} - {apt.service}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm">Confirmar</Button>
                    <Button variant="ghost" size="sm">Detalhes</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {view === 'kanban' && (
            <div className="grid gap-4 md:grid-cols-4">
              {['scheduled', 'confirmed', 'in_progress', 'completed'].map((status) => (
                <div key={status} className="rounded-lg border bg-muted/30 p-3">
                  <h3 className="mb-3 text-sm font-medium capitalize">
                    {APPOINTMENT_STATUS[status]}
                  </h3>
                  <div className="space-y-2">
                    {appointments
                      .filter((a) => a.status === status)
                      .map((apt) => (
                        <div
                          key={apt.id}
                          className="rounded-lg border bg-card p-3 shadow-sm"
                        >
                          <p className="text-sm font-medium">{apt.client}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {apt.time} - {apt.service}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
