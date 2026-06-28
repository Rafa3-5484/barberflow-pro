'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChartBar } from '@/components/ui/chart';
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
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FINANCIAL_STATUS, PAYMENT_METHODS } from '@serviceflow/shared';

const monthlyComparison = [
  { month: 'Jan', receita: 4200, despesa: 2800 },
  { month: 'Fev', receita: 3800, despesa: 2600 },
  { month: 'Mar', receita: 5100, despesa: 3100 },
  { month: 'Abr', receita: 4800, despesa: 2900 },
  { month: 'Mai', receita: 5600, despesa: 3300 },
  { month: 'Jun', receita: 4900, despesa: 3000 },
];

const transactions = [
  { id: '1', description: 'Instalação - Carlos Silva', type: 'revenue', value: 850, status: 'paid', date: new Date('2024-06-15'), method: 'pix' },
  { id: '2', description: 'Manutenção - Maria Oliveira', type: 'revenue', value: 400, status: 'paid', date: new Date('2024-06-14'), method: 'credit_card' },
  { id: '3', description: 'Material de limpeza', type: 'expense', value: 150, status: 'paid', date: new Date('2024-06-13'), method: 'pix' },
  { id: '4', description: 'Combustível', type: 'expense', value: 200, status: 'pending', date: new Date('2024-06-12'), method: 'debit_card' },
  { id: '5', description: 'Reparo - João Santos', type: 'revenue', value: 1200, status: 'pending', date: new Date('2024-06-10'), method: 'boleto' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'destructive',
  cancelled: 'default',
};

export default function FinanceiroPage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTx = transactions.filter((t) => {
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const totalRevenue = transactions.filter((t) => t.type === 'revenue' && t.status === 'paid').reduce((s, t) => s + t.value, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense' && t.status === 'paid').reduce((s, t) => s + t.value, 0);
  const pendingRevenue = transactions.filter((t) => t.status === 'pending').reduce((s, t) => s + t.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Financeiro</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input placeholder="Descrição da transação" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Valor</label>
                  <Input type="number" placeholder="0,00" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Forma Pagamento</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="credit_card">Cartão Crédito</SelectItem>
                      <SelectItem value="debit_card">Cartão Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Data Vencimento</label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Receita</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="rounded-xl bg-green-100 p-3 dark:bg-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Despesas</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="rounded-xl bg-red-100 p-3 dark:bg-red-900/30">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Lucro</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue - totalExpense)}</p>
                </div>
                <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-900/30">
                  <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pendente</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(pendingRevenue)}</p>
                </div>
                <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Receita vs Despesas - Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartBar
            data={monthlyComparison}
            categories={['receita', 'despesa']}
            index="month"
            colors={['hsl(142.1, 76.2%, 36.3%)', 'hsl(0, 84.2%, 60.2%)']}
            valueFormatter={(v) => formatCurrency(v)}
            showLegend
            showGrid
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transações Recentes</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="revenue">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredTx.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 p-4"
              >
                <div className={`rounded-full p-2 ${
                  tx.type === 'revenue' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'
                }`}>
                  {tx.type === 'revenue' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(tx.date)} - {PAYMENT_METHODS[tx.method]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${tx.type === 'revenue' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'revenue' ? '+' : '-'}{formatCurrency(tx.value)}
                  </p>
                  <Badge variant={statusVariant[tx.status]} className="text-[10px] px-1.5 py-0">
                    {FINANCIAL_STATUS[tx.status]}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
