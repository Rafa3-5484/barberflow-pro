'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Plus,
  Lock,
  Unlock,
  Check,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  Scissors,
  User,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  useCurrentCashRegister,
  useOpenCashRegister,
  useCloseCashRegister,
  useAddTransaction,
} from '@/hooks/use-cash-register'
import type { Transaction, PaymentMethod } from '@/types'

const paymentMethodLabels: Record<string, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão Crédito',
  DEBIT_CARD: 'Cartão Débito',
  CASH: 'Dinheiro',
}

const paymentMethodIcons: Record<string, React.ElementType> = {
  PIX: Smartphone,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: Landmark,
  CASH: Banknote,
}

const incomeCategories = [
  { value: 'corte', label: 'Corte' },
  { value: 'barba', label: 'Barba' },
  { value: 'produtos', label: 'Produtos' },
  { value: 'servicos', label: 'Serviços' },
]

const expenseCategories = [
  { value: 'compras', label: 'Compras' },
  { value: 'despesas', label: 'Despesas' },
  { value: 'sangria', label: 'Sangria' },
]

export default function CaixaPage() {
  const [showOpenDialog, setShowOpenDialog] = useState(false)
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [initialAmount, setInitialAmount] = useState('')
  const [newTransaction, setNewTransaction] = useState({
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    category: '',
    description: '',
    amount: '',
    paymentMethod: 'PIX' as string,
  })

  const { data: cashRegister, isLoading } = useCurrentCashRegister()
  const openMutation = useOpenCashRegister()
  const closeMutation = useCloseCashRegister()
  const addTransaction = useAddTransaction()

  const isOpen = cashRegister?.status === 'OPEN'

  const mockTransactions: Transaction[] = useMemo(() => {
    if (!cashRegister) return []
    return [
      {
        id: '1', type: 'INCOME', description: 'Corte Degradê - Carlos', amount: 55,
        paymentMethod: 'PIX', createdAt: new Date().toISOString(),
      },
      {
        id: '2', type: 'INCOME', description: 'Barba - Ana', amount: 30,
        paymentMethod: 'CASH', createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3', type: 'EXPENSE', description: 'Compra de shampoos', amount: 120,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4', type: 'INCOME', description: 'Corte + Barba - Carlos', amount: 75,
        paymentMethod: 'CREDIT_CARD', createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
    ]
  }, [cashRegister])

  const handleOpenRegister = async () => {
    try {
      await openMutation.mutateAsync({ initialAmount: Number(initialAmount) || 0 })
      setShowOpenDialog(false)
      setInitialAmount('')
    } catch {}
  }

  const handleCloseRegister = async () => {
    try {
      if (!cashRegister?.id) return
      await closeMutation.mutateAsync(cashRegister.id)
      setShowCloseDialog(false)
    } catch {}
  }

  const handleAddTransaction = async () => {
    try {
      if (!cashRegister?.id) return
      await addTransaction.mutateAsync({
        cashRegisterId: cashRegister.id,
        type: newTransaction.type as 'INCOME' | 'EXPENSE' | 'WITHDRAWAL',
        description: newTransaction.description,
        amount: Number(newTransaction.amount),
        paymentMethod: newTransaction.type === 'INCOME' ? (newTransaction.paymentMethod as PaymentMethod) : undefined,
      })
      setShowTransactionDialog(false)
      setNewTransaction({ type: 'INCOME', category: '', description: '', amount: '', paymentMethod: 'PIX' })
    } catch {}
  }

  const closeSummaryData = useMemo(() => ({
    initialAmount: cashRegister?.initialAmount || 0,
    totalIncome: cashRegister?.totalIncome || 0,
    totalExpense: cashRegister?.totalExpense || 0,
    finalBalance: cashRegister?.currentAmount || 0,
    services: { cortes: 23, barbas: 15, combos: 8 },
    professionals: [
      { name: 'Carlos', appointments: 12, revenue: 660, commission: 264 },
      { name: 'Ana', appointments: 8, revenue: 400, commission: 200 },
      { name: 'Pedro', appointments: 10, revenue: 500, commission: 175 },
    ],
    payments: [
      { method: 'PIX', total: 580, count: 15 },
      { method: 'CREDIT_CARD', total: 420, count: 8 },
      { method: 'DEBIT_CARD', total: 300, count: 6 },
      { method: 'CASH', total: 260, count: 10 },
    ],
    newClients: 5,
    recurringClients: 28,
  }), [cashRegister])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Caixa</h1>
          <p className="text-sm text-zinc-500">Controle financeiro do dia</p>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5"
              onClick={() => setShowCloseDialog(true)}
            >
              <Lock className="h-4 w-4" />
              Fechar Caixa
            </Button>
          ) : (
            <Button
              size="sm"
              className="gap-1.5 bg-green-500 text-black hover:bg-green-400"
              onClick={() => setShowOpenDialog(true)}
            >
              <Unlock className="h-4 w-4" />
              Abrir Caixa
            </Button>
          )}
          {isOpen && (
            <Button
              size="sm"
              className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
              onClick={() => setShowTransactionDialog(true)}
            >
              <Plus className="h-4 w-4" />
              Nova Movimentação
            </Button>
          )}
        </div>
      </div>

      <Card className={cn('border', isOpen ? 'border-green-500/30 bg-green-500/5' : 'border-zinc-800 bg-zinc-900')}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('rounded-lg p-2', isOpen ? 'bg-green-500/10' : 'bg-zinc-800')}>
                <Wallet className={cn('h-5 w-5', isOpen ? 'text-green-400' : 'text-zinc-500')} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-200">Caixa</p>
                  <Badge variant={isOpen ? 'default' : 'outline'} className={cn(isOpen ? 'bg-green-500/10 text-green-400' : 'text-zinc-500')}>
                    {isOpen ? 'ABERTO' : 'FECHADO'}
                  </Badge>
                </div>
                {cashRegister && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Operador: {cashRegister.operator?.name || '---'} | Abertura:{' '}
                    {format(new Date(cashRegister.openedAt), 'HH:mm')}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-zinc-100">
                {formatCurrency(cashRegister?.currentAmount ?? 0)}
              </p>
              <p className="text-xs text-zinc-500">Saldo Atual</p>
            </div>
          </div>
          {isOpen && cashRegister && (
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
              <div>
                <p className="text-xs text-zinc-500">Valor Inicial</p>
                <p className="text-sm font-medium text-zinc-300">{formatCurrency(cashRegister.initialAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Entradas</p>
                <p className="text-sm font-medium text-green-400">{formatCurrency(cashRegister.totalIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Saídas</p>
                <p className="text-sm font-medium text-red-400">{formatCurrency(cashRegister.totalExpense)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isOpen && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Movimentações do Dia</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-500">Tipo</TableHead>
                  <TableHead className="text-zinc-500">Descrição</TableHead>
                  <TableHead className="text-zinc-500">Valor</TableHead>
                  <TableHead className="text-zinc-500 hidden sm:table-cell">Método</TableHead>
                  <TableHead className="text-zinc-500 hidden md:table-cell">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.length > 0 ? (
                  mockTransactions.map((t) => {
                    const PaymentIcon = t.paymentMethod ? paymentMethodIcons[t.paymentMethod] : DollarSign
                    return (
                      <TableRow key={t.id} className="border-zinc-800">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {t.type === 'INCOME' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-400" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-400" />
                            )}
                            <Badge variant="outline" className={cn(
                              t.type === 'INCOME' ? 'text-green-400 border-green-500/20' : 'text-red-400 border-red-500/20'
                            )}>
                              {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">{t.description}</TableCell>
                        <TableCell className={cn('font-medium', t.type === 'INCOME' ? 'text-green-400' : 'text-red-400')}>
                          {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell className="text-zinc-400 hidden sm:table-cell">
                          {t.paymentMethod ? (
                            <div className="flex items-center gap-1.5">
                              <PaymentIcon className="h-3.5 w-3.5" />
                              <span>{paymentMethodLabels[t.paymentMethod]}</span>
                            </div>
                          ) : '---'}
                        </TableCell>
                        <TableCell className="text-zinc-500 hidden md:table-cell">
                          {format(new Date(t.createdAt), 'HH:mm')}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-zinc-500 py-8">
                      Nenhuma movimentação registrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent className="max-w-sm border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Abrir Caixa</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Informe o valor inicial para abrir o caixa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-zinc-400">Valor Inicial (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
              />
            </div>
            <div className="rounded-lg bg-zinc-800/30 p-3">
              <p className="text-xs text-zinc-500">Operador</p>
              <p className="text-sm text-zinc-300">Usuário Atual</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOpenDialog(false)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button
              onClick={handleOpenRegister}
              disabled={openMutation.isPending}
              className="bg-green-500 text-black hover:bg-green-400"
            >
              {openMutation.isPending ? 'Abrindo...' : 'Abrir Caixa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Nova Movimentação</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Registre uma entrada ou saída no caixa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={newTransaction.type === 'INCOME' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'flex-1',
                  newTransaction.type === 'INCOME' ? 'bg-green-500 text-black hover:bg-green-400' : 'border-zinc-700 text-zinc-300'
                )}
                onClick={() => setNewTransaction({ ...newTransaction, type: 'INCOME' })}
              >
                <ArrowUpRight className="mr-1 h-4 w-4" />
                Entrada
              </Button>
              <Button
                variant={newTransaction.type === 'EXPENSE' ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'flex-1',
                  newTransaction.type === 'EXPENSE' ? 'bg-red-500 text-black hover:bg-red-400' : 'border-zinc-700 text-zinc-300'
                )}
                onClick={() => setNewTransaction({ ...newTransaction, type: 'EXPENSE' })}
              >
                <ArrowDownRight className="mr-1 h-4 w-4" />
                Saída
              </Button>
            </div>
            {newTransaction.type === 'INCOME' && (
              <div>
                <Label className="text-xs text-zinc-400">Categoria</Label>
                <Select value={newTransaction.category} onValueChange={(v) => setNewTransaction({ ...newTransaction, category: v ?? '' })}>
                  <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {newTransaction.type === 'EXPENSE' && (
              <div>
                <Label className="text-xs text-zinc-400">Categoria</Label>
                <Select value={newTransaction.category} onValueChange={(v) => setNewTransaction({ ...newTransaction, category: v ?? '' })}>
                  <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="text-xs text-zinc-400">Descrição</Label>
              <Input
                placeholder="Descreva a movimentação"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300"
              />
            </div>
            {newTransaction.type === 'INCOME' && (
              <div>
                <Label className="text-xs text-zinc-400">Método de Pagamento</Label>
                <Select value={newTransaction.paymentMethod} onValueChange={(v) => setNewTransaction({ ...newTransaction, paymentMethod: v ?? 'PIX' })}>
                  <SelectTrigger className="mt-1 border-zinc-800 bg-zinc-950 text-zinc-300">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CREDIT_CARD">Cartão Crédito</SelectItem>
                    <SelectItem value="DEBIT_CARD">Cartão Débito</SelectItem>
                    <SelectItem value="CASH">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransactionDialog(false)} className="border-zinc-700 text-zinc-300">
              Cancelar
            </Button>
            <Button
              onClick={handleAddTransaction}
              disabled={addTransaction.isPending}
              className="bg-amber-500 text-black hover:bg-amber-400"
            >
              {addTransaction.isPending ? 'Salvando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="max-w-lg border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Fechamento do Caixa</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Resumo final do movimento do dia
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <p className="text-xs text-zinc-500">Valor Inicial</p>
                <p className="text-lg font-semibold text-zinc-200">{formatCurrency(closeSummaryData.initialAmount)}</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <p className="text-xs text-zinc-500">Entradas</p>
                <p className="text-lg font-semibold text-green-400">{formatCurrency(closeSummaryData.totalIncome)}</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-3">
                <p className="text-xs text-zinc-500">Saídas</p>
                <p className="text-lg font-semibold text-red-400">{formatCurrency(closeSummaryData.totalExpense)}</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <p className="text-xs text-zinc-500">Saldo Final</p>
                <p className="text-lg font-semibold text-amber-400">{formatCurrency(closeSummaryData.finalBalance)}</p>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h4 className="mb-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">Serviços Realizados</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-zinc-800/30 p-2 text-center">
                  <p className="text-sm font-bold text-zinc-200">{closeSummaryData.services.cortes}</p>
                  <p className="text-[10px] text-zinc-500">Cortes</p>
                </div>
                <div className="rounded-lg bg-zinc-800/30 p-2 text-center">
                  <p className="text-sm font-bold text-zinc-200">{closeSummaryData.services.barbas}</p>
                  <p className="text-[10px] text-zinc-500">Barbas</p>
                </div>
                <div className="rounded-lg bg-zinc-800/30 p-2 text-center">
                  <p className="text-sm font-bold text-zinc-200">{closeSummaryData.services.combos}</p>
                  <p className="text-[10px] text-zinc-500">Combos</p>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h4 className="mb-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">Profissionais</h4>
              <div className="space-y-1.5">
                {closeSummaryData.professionals.map((p) => (
                  <div key={p.name} className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-2">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-sm text-zinc-200">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-400">{p.appointments} serviços</span>
                      <span className="text-green-400">{formatCurrency(p.revenue)}</span>
                      <span className="text-amber-400">{formatCurrency(p.commission)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h4 className="mb-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">Clientes</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-zinc-800/30 p-2">
                  <p className="text-sm font-bold text-green-400">{closeSummaryData.newClients}</p>
                  <p className="text-[10px] text-zinc-500">Novos Clientes</p>
                </div>
                <div className="rounded-lg bg-zinc-800/30 p-2">
                  <p className="text-sm font-bold text-blue-400">{closeSummaryData.recurringClients}</p>
                  <p className="text-[10px] text-zinc-500">Clientes Recorrentes</p>
                </div>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h4 className="mb-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">Métodos de Pagamento</h4>
              <div className="space-y-1.5">
                {closeSummaryData.payments.map((p) => {
                  const Icon = paymentMethodIcons[p.method] || DollarSign
                  return (
                    <div key={p.method} className="flex items-center justify-between rounded-lg bg-zinc-800/30 p-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="text-sm text-zinc-200">{paymentMethodLabels[p.method]}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-zinc-500">{p.count} transações</span>
                        <span className="text-zinc-200">{formatCurrency(p.total)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)} className="border-zinc-700 text-zinc-300">
              Revisar
            </Button>
            <Button
              onClick={handleCloseRegister}
              disabled={closeMutation.isPending}
              className="bg-red-500 text-black hover:bg-red-400"
            >
              {closeMutation.isPending ? 'Fechando...' : 'Confirmar Fechamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
