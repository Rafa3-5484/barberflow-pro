'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Route,
  Gauge,
  Fuel,
  Clock,
  ArrowLeftRight,
  RefreshCw,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn, formatPhone, getInitials } from '@/lib/utils';

const routeStops = [
  { id: '1', order: 1, client: 'Carlos Silva', address: 'Rua das Flores, 123', time: '08:00 - 09:00', status: 'completed', phone: '(11) 99999-8888', initials: 'CS' },
  { id: '2', order: 2, client: 'Maria Oliveira', address: 'Av. Paulista, 1000', time: '09:30 - 10:30', status: 'in_progress', phone: '(11) 97777-6666', initials: 'MO' },
  { id: '3', order: 3, client: 'João Santos', address: 'Rua Augusta, 500', time: '11:00 - 12:00', status: 'pending', phone: '(11) 95555-4444', initials: 'JS' },
  { id: '4', order: 4, client: 'Ana Costa', address: 'Rua Oscar Freire, 200', time: '13:30 - 14:30', status: 'pending', phone: '(11) 93333-2222', initials: 'AC' },
  { id: '5', order: 5, client: 'Pedro Alves', address: 'Rua Haddock Lobo, 800', time: '15:00 - 16:00', status: 'pending', phone: '(11) 91111-0000', initials: 'PA' },
];

export default function RotasPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Rotas</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[180px]"
          />
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Otimizar Rota
          </Button>
          <Button className="gap-2">
            <Navigation className="h-4 w-4" />
            Gerar Rota
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-[300px] rounded-lg border-2 border-dashed">
                <div className="text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Mapa (Google Maps)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure a chave da API no arquivo .env
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Paradas da Rota</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {routeStops.map((stop, idx) => (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                        stop.status === 'completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                        stop.status === 'in_progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                        stop.status === 'pending' && 'bg-muted text-muted-foreground',
                      )}>
                        {stop.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : stop.order}
                      </div>
                      {idx < routeStops.length - 1 && (
                        <div className="h-full w-0.5 bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stop.client}</span>
                        <Badge variant={stop.status === 'completed' ? 'success' : stop.status === 'in_progress' ? 'info' : 'secondary'} className="text-[10px] px-1.5 py-0">
                          {stop.status === 'completed' ? 'Concluído' : stop.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{stop.address}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{stop.time}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{stop.initials}</AvatarFallback>
                      </Avatar>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Route className="h-4 w-4 text-muted-foreground" />
                  Distância Total
                </div>
                <span className="font-semibold">42 km</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Duração Total
                </div>
                <span className="font-semibold">4h 30min</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  Custo Combustível
                </div>
                <span className="font-semibold">R$ 52,00</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Paradas
                </div>
                <span className="font-semibold">{routeStops.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  Otimizada
                </div>
                <Badge variant="success">Sim</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
