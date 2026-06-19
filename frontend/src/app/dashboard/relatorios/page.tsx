'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, subDays, subWeeks, subMonths, subYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  PieChart,
  BarChart3,
  Percent,
  Scissors,
  User,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { useDashboardKPIs } from '@/hooks/use-dashboard'

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly'

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#84cc16']

const periodOptions: { value: PeriodType; label: string }[] = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
]

export default function RelatoriosPage() {
  const [period, setPeriod] = useState<PeriodType>('daily')
  const { data: kpis, isLoading } = useDashboardKPIs()

  const dateRange = useMemo(() => {
    const now = new Date()
    switch (period) {
      case 'daily':
        return `${format(now, "dd 'de' MMMM", { locale: ptBR as any })}`
      case 'weekly': {
        const start = startOfWeek(now, { weekStartsOn: 0 })
        const end = endOfWeek(now, { weekStartsOn: 0 })
        return `${format(start, 'dd/MM')} - ${format(end, 'dd/MM')}`
      }
      case 'monthly':
        return format(now, "MMMM 'de' yyyy", { locale: ptBR as any })
      case 'yearly':
        return format(now, 'yyyy')
    }
  }, [period])

  const revenueChartData = useMemo(() => {
    if (period === 'daily') {
      return Array.from({ length: 24 }, (_, i) => ({
        name: `${String(i).padStart(2, '0')}h`,
        receita: Math.floor(Math.random() * 300 + 50),
      }))
    }
    if (period === 'weekly') {
      return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((name) => ({
        name,
        receita: Math.floor(Math.random() * 3000 + 500),
      }))
    }
    if (period === 'monthly') {
      return Array.from({ length: 30 }, (_, i) => ({
        name: `${i + 1}`,
        receita: Math.floor(Math.random() * 2000 + 200),
      }))
    }
    return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((name) => ({
      name,
      receita: Math.floor(Math.random() * 50000 + 10000),
    }))
  }, [period])

  const servicesPieData = [
    { name: 'Corte Degradê', value: 35 },
    { name: 'Barba', value: 25 },
    { name: 'Corte + Barba', value: 20 },
    { name: 'Hidratação', value: 10 },
    { name: 'Outros', value: 10 },
  ]

  const professionalPerformance = [
    { name: 'Carlos', receita: 2860, comissao: 1144, atendimentos: 52 },
    { name: 'Ana', receita: 2200, comissao: 1100, atendimentos: 44 },
    { name: 'Pedro', receita: 1950, comissao: 682, atendimentos: 39 },
    { name: 'Lucas', receita: 1480, comissao: 592, atendimentos: 28 },
    { name: 'Rafael', receita: 1200, comissao: 480, atendimentos: 22 },
  ]

  const servicesRanking = [
    { name: 'Corte Degradê', quantidade: 85, receita: 4675 },
    { name: 'Barba', quantidade: 62, receita: 1860 },
    { name: 'Corte + Barba', quantidade: 48, receita: 3600 },
    { name: 'Hidratação', quantidade: 22, receita: 1540 },
    { name: 'Corte Tesoura', quantidade: 18, receita: 900 },
  ]

  const peakHours = [
    { hour: '09:00', count: 8 },
    { hour: '10:00', count: 15 },
    { hour: '11:00', count: 20 },
    { hour: '12:00', count: 5 },
    { hour: '13:00', count: 6 },
    { hour: '14:00', count: 18 },
    { hour: '15:00', count: 22 },
    { hour: '16:00', count: 25 },
    { hour: '17:00', count: 18 },
    { hour: '18:00', count: 12 },
    { hour: '19:00', count: 10 },
  ]

  const summary = {
    totalRevenue: 9690,
    totalExpenses: 1250,
    netProfit: 8440,
    newClients: 28,
    returningClients: 105,
    appointmentCount: 168,
    cancellationRate: 8.4,
  }

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
          <h1 className="text-lg font-semibold text-zinc-100">Relatórios</h1>
          <p className="text-sm text-zinc-500">{dateRange}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-zinc-800 text-zinc-300">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-1">
        {periodOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              period === opt.value
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
              </div>
              <ArrowUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</p>
            <p className="text-xs text-zinc-500">Faturamento</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{formatCurrency(kpis?.averageTicket ?? 57.60)}</p>
            <p className="text-xs text-zinc-500">Ticket Médio</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Users className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{summary.appointmentCount}</p>
            <p className="text-xs text-zinc-500">Clientes Atendidos</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Percent className="h-4 w-4 text-purple-400" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{kpis?.occupancyRate ?? 72}%</p>
            <p className="text-xs text-zinc-500">Taxa de Ocupação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              Receita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Receita']}
                  />
                  <Bar dataKey="receita" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <PieChart className="h-4 w-4 text-amber-400" />
              Distribuição de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={servicesPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {servicesPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <User className="h-4 w-4 text-amber-400" />
              Performance dos Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={professionalPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis type="number" stroke="#71717a" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={11} width={60} />
                  <Tooltip
                    contentStyle={{
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                  <Bar dataKey="receita" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Receita" />
                  <Bar dataKey="comissao" fill="#10b981" radius={[0, 4, 4, 0]} name="Comissão" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Clock className="h-4 w-4 text-amber-400" />
              Horários de Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="hour" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [Number(value), 'Agendamentos']}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Ranking de Serviços</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-500">Serviço</TableHead>
                  <TableHead className="text-zinc-500 text-right">Quantidade</TableHead>
                  <TableHead className="text-zinc-500 text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicesRanking.map((s) => (
                  <TableRow key={s.name} className="border-zinc-800">
                    <TableCell className="font-medium text-zinc-200">{s.name}</TableCell>
                    <TableCell className="text-right text-zinc-400">{s.quantidade}</TableCell>
                    <TableCell className="text-right text-amber-400">{formatCurrency(s.receita)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">Performance dos Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-500">Profissional</TableHead>
                  <TableHead className="text-zinc-500 text-right">Receita</TableHead>
                  <TableHead className="text-zinc-500 text-right">Comissão</TableHead>
                  <TableHead className="text-zinc-500 text-right">Atendimentos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionalPerformance.map((p) => (
                  <TableRow key={p.name} className="border-zinc-800">
                    <TableCell className="font-medium text-zinc-200">{p.name}</TableCell>
                    <TableCell className="text-right text-green-400">{formatCurrency(p.receita)}</TableCell>
                    <TableCell className="text-right text-amber-400">{formatCurrency(p.comissao)}</TableCell>
                    <TableCell className="text-right text-zinc-400">{p.atendimentos}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-200">Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-zinc-500">Receita Total</p>
              <p className="text-lg font-bold text-green-400">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Despesas</p>
              <p className="text-lg font-bold text-red-400">{formatCurrency(summary.totalExpenses)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Lucro Líquido</p>
              <p className="text-lg font-bold text-amber-400">{formatCurrency(summary.netProfit)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Cancelamentos</p>
              <p className="text-lg font-bold text-zinc-200">{summary.cancellationRate}%</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total de Atendimentos</p>
              <p className="text-lg font-bold text-zinc-200">{summary.appointmentCount}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Novos Clientes</p>
              <p className="text-lg font-bold text-blue-400">{summary.newClients}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Clientes Recorrentes</p>
              <p className="text-lg font-bold text-purple-400">{summary.returningClients}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Ticket Médio</p>
              <p className="text-lg font-bold text-zinc-200">{formatCurrency(kpis?.averageTicket ?? 57.60)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
