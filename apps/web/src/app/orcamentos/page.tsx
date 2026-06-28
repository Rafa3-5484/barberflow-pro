'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Send,
  Copy,
  XCircle,
  FileText,
  Download,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BUDGET_STATUS } from '@serviceflow/shared';

const budgets = [
  { id: '1', number: 42, client: 'Carlos Silva', value: 850, status: 'sent', date: new Date('2024-06-15'), items: 3 },
  { id: '2', number: 41, client: 'Maria Oliveira', value: 1200, status: 'accepted', date: new Date('2024-06-10'), items: 5 },
  { id: '3', number: 40, client: 'João Santos', value: 540, status: 'viewed', date: new Date('2024-06-08'), items: 2 },
  { id: '4', number: 39, client: 'Ana Costa', value: 2300, status: 'draft', date: new Date('2024-06-05'), items: 6 },
  { id: '5', number: 38, client: 'Pedro Alves', value: 1500, status: 'rejected', date: new Date('2024-06-01'), items: 4 },
  { id: '6', number: 37, client: 'Lucia Souza', value: 3200, status: 'expired', date: new Date('2024-05-20'), items: 7 },
];

const statusVariants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  draft: 'secondary',
  sent: 'warning',
  viewed: 'info',
  accepted: 'success',
  rejected: 'destructive',
  cancelled: 'destructive',
  expired: 'default',
};

export default function OrcamentosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading] = useState(false);

  const filtered = budgets.filter((b) => {
    const matchesSearch = b.client.toLowerCase().includes(search.toLowerCase()) ||
      String(b.number).includes(search);
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Orçamentos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Orçamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Orçamento</DialogTitle>
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
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Itens do Orçamento</label>
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground">
                    <span>Descrição</span>
                    <span>Qtd</span>
                    <span>Valor Unit.</span>
                    <span>Total</span>
                    <span></span>
                  </div>
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2">
                    <Input placeholder="Descrição" className="h-8 text-sm" />
                    <Input type="number" defaultValue={1} className="h-8 text-sm" />
                    <Input type="number" defaultValue={0} className="h-8 text-sm" />
                    <Input type="number" defaultValue={0} className="h-8 text-sm font-medium" readOnly />
                    <Button variant="ghost" size="icon-sm">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Plus className="h-3 w-3" /> Adicionar Item
                  </Button>
                </div>
              </div>
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ 0,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <Input type="number" placeholder="0" className="w-24 h-7 text-sm" />
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">R$ 0,00</span>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Validade</label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Observações</label>
                <textarea className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline">Salvar Rascunho</Button>
                <Button>Criar Orçamento</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou nº..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="sent">Enviado</SelectItem>
            <SelectItem value="viewed">Visualizado</SelectItem>
            <SelectItem value="accepted">Aceito</SelectItem>
            <SelectItem value="rejected">Recusado</SelectItem>
            <SelectItem value="expired">Expirado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">Nenhum orçamento encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Tente ajustar sua busca' : 'Crie seu primeiro orçamento'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filtered.map((budget, idx) => (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{budget.number.toString().padStart(4, '0')}</span>
                      <Badge variant={statusVariants[budget.status]}>
                        {BUDGET_STATUS[budget.status]}
                      </Badge>
                    </div>
                    <p className="text-sm mt-0.5">{budget.client}</p>
                    <p className="text-xs text-muted-foreground">
                      {budget.items} itens - {formatDate(budget.date)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">{formatCurrency(budget.value)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Send className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" /> PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Copy className="h-4 w-4" /> Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <XCircle className="h-4 w-4" /> Cancelar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
