'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  Star,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Calendar,
  Plus,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, getInitials, formatCurrency, formatDateTime } from '@/lib/utils';

const clients = [
  { id: '1', name: 'Carlos Silva', phone: '(11) 99999-8888', email: 'carlos@email.com', totalSpent: 4850, visits: 12, frequency: 'Alta', lastContact: new Date('2024-06-15'), initials: 'CS' },
  { id: '2', name: 'Maria Oliveira', phone: '(11) 97777-6666', email: 'maria@email.com', totalSpent: 3200, visits: 8, frequency: 'Média', lastContact: new Date('2024-06-10'), initials: 'MO' },
  { id: '3', name: 'João Santos', phone: '(11) 95555-4444', email: 'joao@email.com', totalSpent: 1500, visits: 5, frequency: 'Baixa', lastContact: new Date('2024-05-28'), initials: 'JS' },
];

const activities = [
  { id: '1', clientName: 'Carlos Silva', type: 'service_completed', description: 'Instalação concluída - R$ 850', date: new Date('2024-06-15'), initials: 'CS' },
  { id: '2', clientName: 'Maria Oliveira', type: 'budget_accepted', description: 'Orçamento #0041 aceito', date: new Date('2024-06-10'), initials: 'MO' },
  { id: '3', clientName: 'João Santos', type: 'payment_received', description: 'Pagamento recebido - R$ 540', date: new Date('2024-06-08'), initials: 'JS' },
];

const activityIcons: Record<string, typeof MessageSquare> = {
  service_completed: CheckCircle2,
  budget_accepted: FileText,
  payment_received: DollarSign,
  appointment_scheduled: Calendar,
  appointment_cancelled: XCircle,
  message_sent: MessageSquare,
  call_made: Phone,
};

const activityColors: Record<string, string> = {
  service_completed: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  budget_accepted: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  payment_received: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
  appointment_scheduled: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  appointment_cancelled: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  message_sent: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30',
  call_made: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
};

export default function CRMPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CRM</h2>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Atividade
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredClients.map((client) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'rounded-lg border p-3 transition-all cursor-pointer hover:border-primary/50',
                  selectedClient === client.id && 'border-primary bg-primary/5'
                )}
                onClick={() => setSelectedClient(client.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {client.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  </div>
                  <Badge variant={
                    client.frequency === 'Alta' ? 'success' : client.frequency === 'Média' ? 'warning' : 'secondary'
                  } className="text-[10px]">
                    {client.frequency}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selectedClient ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {clients.find((c) => c.id === selectedClient)?.name}
                    </CardTitle>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Mensagem
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(clients.find((c) => c.id === selectedClient)?.totalSpent || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Gasto</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {clients.find((c) => c.id === selectedClient)?.visits}
                      </p>
                      <p className="text-xs text-muted-foreground">Visitas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {clients.find((c) => c.id === selectedClient)?.frequency}
                      </p>
                      <p className="text-xs text-muted-foreground">Frequência</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, idx) => {
                      const Icon = activityIcons[activity.type] || MessageSquare;
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className={cn('rounded-full p-2', activityColors[activity.type] || 'bg-muted text-muted-foreground')}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDateTime(activity.date)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nova Atividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de atividade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call_made">Ligação Realizada</SelectItem>
                        <SelectItem value="message_sent">Mensagem Enviada</SelectItem>
                        <SelectItem value="note_added">Anotação</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Descrição da atividade..." />
                    <Button className="w-full">Registrar Atividade</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <UserPlus className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">Selecione um cliente</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Escolha um cliente ao lado para ver o histórico de interações
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
