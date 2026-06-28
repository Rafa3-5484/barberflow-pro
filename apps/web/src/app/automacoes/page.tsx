'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Edit3,
  GripVertical,
  MessageSquare,
  Mail,
  Bell,
  Calendar,
  CalendarDays,
  MapPin,
  RefreshCw,
  FileText,
  Star,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { cn } from '@/lib/utils';

interface AutomationItem {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  active: boolean;
}

const automations: AutomationItem[] = [
  { id: '1', name: 'Lembrete de Agendamento', trigger: 'appointment_created', actions: ['send_whatsapp'], active: true },
  { id: '2', name: 'Agradecimento pós-serviço', trigger: 'appointment_completed', actions: ['send_whatsapp', 'request_review'], active: true },
  { id: '3', name: 'Orçamento não visualizado', trigger: 'budget_created', actions: ['send_whatsapp', 'create_reminder'], active: false },
];

const triggerLabels: Record<string, string> = {
  appointment_created: 'Agendamento Criado',
  appointment_confirmed: 'Agendamento Confirmado',
  appointment_completed: 'Agendamento Concluído',
  appointment_cancelled: 'Agendamento Cancelado',
  budget_created: 'Orçamento Criado',
  budget_accepted: 'Orçamento Aceito',
  payment_received: 'Pagamento Recebido',
  client_created: 'Cliente Cadastrado',
  review_received: 'Avaliação Recebida',
};

const actionLabels: Record<string, string> = {
  send_whatsapp: 'Enviar WhatsApp',
  send_email: 'Enviar E-mail',
  send_push: 'Enviar Push',
  create_reminder: 'Criar Lembrete',
  create_route: 'Criar Rota',
  update_status: 'Atualizar Status',
  create_budget: 'Criar Orçamento',
  request_review: 'Solicitar Avaliação',
};

const actionIcons: Record<string, typeof MessageSquare> = {
  send_whatsapp: MessageSquare,
  send_email: Mail,
  send_push: Bell,
  create_reminder: Calendar,
  create_route: MapPin,
  update_status: RefreshCw,
  create_budget: FileText,
  request_review: Star,
};

const triggerIcons: Record<string, typeof CalendarDays> = {
  appointment_created: CalendarDays,
  appointment_completed: Clock,
  budget_created: FileText,
  payment_received: Star,
  client_created: Star,
};

function TriggerIcon({ type }: { type: string }) {
  const Icon = triggerIcons[type as keyof typeof triggerIcons];
  return Icon ? <Icon className="h-3 w-3 text-muted-foreground" /> : null;
}

export default function AutomacoesPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<AutomationItem[]>(automations);

  const filtered = items.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Automações</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Automação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Criar Automação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nome</label>
                <Input placeholder="Nome da automação" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Quando isso acontecer (Gatilho)</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gatilho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment_created">Agendamento é criado</SelectItem>
                    <SelectItem value="appointment_confirmed">Agendamento é confirmado</SelectItem>
                    <SelectItem value="appointment_completed">Agendamento é concluído</SelectItem>
                    <SelectItem value="budget_created">Orçamento é criado</SelectItem>
                    <SelectItem value="budget_accepted">Orçamento é aceito</SelectItem>
                    <SelectItem value="payment_received">Pagamento é recebido</SelectItem>
                    <SelectItem value="client_created">Cliente é cadastrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Então faça isso (Ações)</label>
                <div className="space-y-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send_whatsapp">Enviar WhatsApp</SelectItem>
                      <SelectItem value="send_email">Enviar E-mail</SelectItem>
                      <SelectItem value="create_reminder">Criar Lembrete</SelectItem>
                      <SelectItem value="request_review">Solicitar Avaliação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-3 w-3" /> Adicionar Ação
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm font-medium">Ativar automação</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Criar Automação</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar automações..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Zap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Nenhuma automação encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crie automações para otimizar seu trabalho
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((automation, idx) => (
            <motion.div
              key={automation.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Card className={cn(
                'transition-all duration-200',
                !automation.active && 'opacity-60'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon-sm" className="cursor-grab">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Zap className={cn(
                          'h-4 w-4',
                          automation.active ? 'text-primary' : 'text-muted-foreground'
                        )} />
                        <span className="font-medium">{automation.name}</span>
                        <Badge variant={automation.active ? 'success' : 'secondary'} className="text-[10px]">
                          {automation.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-xs">
                          <TriggerIcon type={automation.trigger} />
                          <span>{triggerLabels[automation.trigger] || automation.trigger}</span>
                        </div>

                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />

                        <div className="flex items-center gap-1">
                          {automation.actions.map((action) => {
                            const Icon = actionIcons[action] || MessageSquare;
                            return (
                              <div key={action} className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs">
                                <Icon className="h-3 w-3 text-muted-foreground" />
                                <span>{actionLabels[action] || action}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => toggleActive(automation.id)}
                      >
                        {automation.active ? (
                          <ToggleRight className="h-4 w-4 text-primary" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
