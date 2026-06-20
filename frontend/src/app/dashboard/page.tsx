'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Ticket,
  XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useServices } from '@/hooks/use-services'
import { useProfessionals } from '@/hooks/use-professionals'
import { useDashboardKPIs } from '@/hooks/use-dashboard'
import { useAppointments } from '@/hooks/use-appointments'
import { OnboardingWizard } from '@/components/dashboard/onboarding-wizard'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Não Compareceu',
}

const statusVariants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost'> = {
  SCHEDULED: 'outline',
  CONFIRMED: 'default',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
  NO_SHOW: 'destructive',
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316']

const today = format(new Date(), 'yyyy-MM-dd')

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: services } = useServices()
  const { data: professionals } = useProfessionals()
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs()
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments(today)

  const hasServices = services && services.length > 0
  const hasProfessionals = professionals && professionals.length > 0
  const needsOnboarding = !hasServices || !hasProfessionals

  const statCards = [
    {
      title: 'Agendamentos Hoje',
      value: kpis?.todayAppointments ?? 0,
      icon: Calendar,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Clientes Hoje',
      value: kpis?.todayClients ?? 0,
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Faturamento Hoje',
      value: formatCurrency(kpis?.dailyRevenue ?? 0),
      icon: DollarSign,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Taxa de Ocupação',
      value: `${kpis?.occupancyRate ?? 0}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(kpis?.averageTicket ?? 0),
      icon: Ticket,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Cancelamentos',
      value: (kpis?.cancellations ?? 0) + (kpis?.noShow ?? 0),
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
  ]

  const chartData = [
    { name: 'Seg', receita: 1200 },
    { name: 'Ter', receita: 1800 },
    { name: 'Qua', receita: 1400 },
    { name: 'Qui', receita: 2200 },
    { name: 'Sex', receita: 2800 },
    { name: 'Sáb', receita: 3200 },
    { name: 'Dom', receita: 0 },
  ]

  const pieData = (kpis?.servicesSold ?? []).slice(0, 5).map((s) => ({
    name: s.name,
    value: s.count,
  }))

  return (
    <div className="space-y-6">
      {needsOnboarding && (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 shadow-lg shadow-amber-500/5">
          <OnboardingWizard />
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">
          Bem-vindo, {user?.name || 'Usuário'}
        </h2>
        <p className="text-sm text-zinc-500">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR as any })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-zinc-800 bg-zinc-900">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${stat.bg}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.title}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">
              Receita Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
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
            <CardTitle className="text-sm font-medium text-zinc-200">
              Serviços Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
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
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-200">
            Agendamentos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-500">Cliente</TableHead>
                <TableHead className="text-zinc-500">Serviço</TableHead>
                <TableHead className="text-zinc-500">Profissional</TableHead>
                <TableHead className="text-zinc-500">Horário</TableHead>
                <TableHead className="text-zinc-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointmentsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <TableRow key={apt.id} className="border-zinc-800">
                    <TableCell className="font-medium text-zinc-200">
                      {apt.client?.name || '---'}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {apt.service?.name || '---'}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {apt.professional?.name || '---'}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {format(new Date(apt.date), 'HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariants[apt.status] || 'outline'}
                        className="text-xs"
                      >
                        {statusLabels[apt.status] || apt.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500">
                    Nenhum agendamento para hoje
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {kpis?.professionalCommissions && kpis.professionalCommissions.length > 0 && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-200">
              Performance dos Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-500">Profissional</TableHead>
                  <TableHead className="text-zinc-500">Receita</TableHead>
                  <TableHead className="text-zinc-500">Comissão</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpis.professionalCommissions.map((prof) => (
                  <TableRow key={prof.name} className="border-zinc-800">
                    <TableCell className="font-medium text-zinc-200">
                      {prof.name}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {formatCurrency(prof.revenue)}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {formatCurrency(prof.commission)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
