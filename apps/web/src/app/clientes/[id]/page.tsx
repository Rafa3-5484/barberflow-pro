'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  MessageSquare,
  FileText,
  Clock,
  DollarSign,
  Star,
  Users,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  formatCurrency,
  formatPhone,
  formatDate,
  getInitials,
  formatDateTime,
} from '@/lib/utils';

const client = {
  id: '1',
  name: 'Carlos Silva',
  phone: '(11) 99999-8888',
  email: 'carlos@email.com',
  document: '123.456.789-00',
  tags: ['VIP', 'Recorrente'],
  totalSpent: 4850,
  totalVisits: 12,
  lastVisit: new Date('2024-06-15'),
  averageTicket: 404.17,
  address: 'Rua das Flores, 123 - Jardim Paulista, São Paulo - SP',
  notes: 'Cliente prefere atendimento pela manhã. Tem alergia a produtos com perfume forte.',
  createdAt: new Date('2023-01-15'),
};

const timeline = [
  { id: '1', type: 'service_completed', description: 'Instalação concluída', date: new Date('2024-06-15'), value: 850 },
  { id: '2', type: 'budget_accepted', description: 'Orçamento #0042 aceito', date: new Date('2024-06-10'), value: 1200 },
  { id: '3', type: 'payment_received', description: 'Pagamento recebido - R$ 850', date: new Date('2024-06-08'), value: 850 },
  { id: '4', type: 'appointment_scheduled', description: 'Agendamento para manutenção', date: new Date('2024-06-01'), value: null },
];

export default function ClientDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Button variant="ghost" asChild className="gap-2 -ml-2">
        <Link href="/clientes">
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{client.name}</h1>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Agendar
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Orçamento
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Mensagem
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formatPhone(client.phone)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Cliente desde {formatDate(client.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
              <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="info">Informações</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-3">
              {timeline.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateTime(item.date)}
                    </p>
                  </div>
                  {item.value && (
                    <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
                  )}
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>Nenhum agendamento encontrado</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budgets">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>Nenhum orçamento encontrado</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <DollarSign className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>Nenhum registro financeiro encontrado</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Documento</label>
                      <p className="font-medium">{client.document}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">E-mail</label>
                      <p className="font-medium">{client.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Telefone</label>
                      <p className="font-medium">{formatPhone(client.phone)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Endereço</label>
                      <p className="font-medium">{client.address}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <label className="text-sm text-muted-foreground">Observações</label>
                    <p className="text-sm mt-1">{client.notes}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Total Gasto
                </div>
                <span className="font-semibold">{formatCurrency(client.totalSpent)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  Ticket Médio
                </div>
                <span className="font-semibold">{formatCurrency(client.averageTicket)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Total Visitas
                </div>
                <span className="font-semibold">{client.totalVisits}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Última Visita
                </div>
                <span className="font-semibold">{formatDate(client.lastVisit)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
