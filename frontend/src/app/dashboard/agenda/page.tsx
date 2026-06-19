'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
  isSameDay,
  isToday,
  parse,
  setHours,
  setMinutes,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Scissors,
  Phone,
  Mail,
  CalendarDays,
  X,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/use-appointments'
import { useProfessionals } from '@/hooks/use-professionals'
import { BookingFlow } from '@/components/agendamento/booking-flow'
import type { Appointment, AppointmentStatus } from '@/types'

type ViewMode = 'day' | 'week' | 'month'

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Não Compareceu',
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CONFIRMED: 'bg-green-500/10 text-green-400 border-green-500/20',
  IN_PROGRESS: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  NO_SHOW: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

const statusDotColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-400',
  CONFIRMED: 'bg-green-400',
  IN_PROGRESS: 'bg-amber-400',
  COMPLETED: 'bg-emerald-400',
  CANCELLED: 'bg-red-400',
  NO_SHOW: 'bg-zinc-400',
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6)

function getStatusFromTime(date: Date): string {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  if (diff < 0 && diff > -3600000) return 'IN_PROGRESS'
  if (diff < -3600000) return 'COMPLETED'
  return 'SCHEDULED'
}

export default function AgendaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [professionalFilter, setProfessionalFilter] = useState<string | null>('all')
  const [showNewBooking, setShowNewBooking] = useState(false)

  const updateStatus = useUpdateAppointmentStatus()
  const { data: professionals } = useProfessionals()

  const dateParam = format(currentDate, 'yyyy-MM-dd')
  const { data: appointments, isLoading } = useAppointments(dateParam)

  const filteredAppointments = useMemo(() => {
    if (!appointments) return []
    if (professionalFilter === 'all') return appointments
    return appointments.filter((a) => a.professionalId === professionalFilter)
  }, [appointments, professionalFilter])

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1))
    } else {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
    }
  }

  const goToToday = () => setCurrentDate(new Date())

  const headerTitle = useMemo(() => {
    if (viewMode === 'day') {
      return format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR as any })
    }
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 })
      const end = endOfWeek(currentDate, { weekStartsOn: 0 })
      return `${format(start, 'dd/MM')} - ${format(end, 'dd/MM')}`
    }
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR as any })
  }, [currentDate, viewMode])

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    const end = endOfWeek(currentDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return (appointments || []).filter((a) => {
      const aptDate = format(new Date(a.date), 'yyyy-MM-dd')
      if (professionalFilter !== 'all' && a.professionalId !== professionalFilter) return false
      return aptDate === dateStr
    })
  }

  const getAppointmentPosition = (date: string) => {
    const d = new Date(date)
    const hours = d.getHours()
    const minutes = d.getMinutes()
    return (hours - 6) * 60 + minutes
  }

  const getAppointmentHeight = (duration: number) => {
    return Math.max(duration, 30)
  }

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    await updateStatus.mutateAsync({ id, status })
  }

  const statusActions: { label: string; status: AppointmentStatus; variant: 'default' | 'outline' | 'destructive' | 'secondary' }[] = [
    { label: 'Confirmar', status: 'CONFIRMED', variant: 'default' },
    { label: 'Iniciar', status: 'IN_PROGRESS', variant: 'secondary' },
    { label: 'Finalizar', status: 'COMPLETED', variant: 'default' },
    { label: 'Cancelar', status: 'CANCELLED', variant: 'destructive' },
    { label: 'Não Compareceu', status: 'NO_SHOW', variant: 'outline' },
  ]

  const getAvailableActions = (currentStatus: AppointmentStatus) => {
    const flow: Record<AppointmentStatus, AppointmentStatus[]> = {
      SCHEDULED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
    }
    const available = flow[currentStatus] || []
    return statusActions.filter((a) => available.includes(a.status))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">Agenda</h1>
          <p className="text-sm text-zinc-500">{headerTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
            <SelectTrigger className="h-8 w-40 border-zinc-800 text-zinc-300">
              <Filter className="mr-1 h-3.5 w-3.5" />
              <SelectValue placeholder="Profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {professionals?.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={goToToday} className="border-zinc-800 text-zinc-300">
            Hoje
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-xs" onClick={() => navigate('prev')} className="text-zinc-400">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={() => navigate('next')} className="text-zinc-400">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400"
            onClick={() => setShowNewBooking(true)}
          >
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-1">
        {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              viewMode === mode
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className={cn('h-2 w-2 rounded-full', statusDotColors[key])} />
            {label}
          </div>
        ))}
      </div>

      {viewMode === 'day' && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-0">
            <div className="relative">
              {HOURS.map((hour) => {
                const hourAppointments = filteredAppointments.filter((a) => {
                  const d = new Date(a.date)
                  return d.getHours() === hour
                })
                return (
                  <div key={hour} className="flex border-b border-zinc-800 last:border-b-0">
                    <div className="flex w-16 shrink-0 items-start justify-center pt-2 text-xs text-zinc-500">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                    <div className="relative min-h-[60px] flex-1 p-1">
                      {hourAppointments.map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={cn(
                            'mb-1 w-full rounded-lg border p-2 text-left transition-all hover:brightness-110',
                            statusColors[apt.status]
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium">
                              {format(new Date(apt.date), 'HH:mm')}
                            </span>
                            <Badge variant="outline" className={cn('text-[10px]', statusColors[apt.status].split(' ')[0])}>
                              {statusLabels[apt.status]}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-sm font-semibold">{apt.client?.name}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-400">
                            <span>{apt.service?.name}</span>
                            <span>•</span>
                            <span>{apt.professional?.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              {filteredAppointments.length === 0 && !isLoading && (
                <div className="flex py-16 items-center justify-center text-sm text-zinc-500">
                  Nenhum agendamento para este dia
                </div>
              )}
              {isLoading && (
                <div className="flex py-16 items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'week' && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-zinc-800">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    'border-r border-zinc-800 p-2 text-center last:border-r-0',
                    isToday(day) && 'bg-amber-500/5'
                  )}
                >
                  <p className="text-xs text-zinc-500">
                    {format(day, 'EEE', { locale: ptBR as any })}
                  </p>
                  <p className={cn('text-sm font-semibold', isToday(day) ? 'text-amber-400' : 'text-zinc-200')}>
                    {format(day, 'dd')}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {weekDays.map((day, i) => {
                const dayAppointments = getAppointmentsForDay(day)
                return (
                  <div
                    key={i}
                    className={cn(
                      'min-h-[300px] border-r border-zinc-800 p-1 last:border-r-0',
                      isToday(day) && 'bg-amber-500/5'
                    )}
                  >
                    {HOURS.map((hour) => {
                      const slotApps = dayAppointments.filter((a) => {
                        const d = new Date(a.date)
                        return d.getHours() === hour
                      })
                      return (
                        <div key={hour} className="min-h-[18px] border-b border-zinc-800/30">
                          {slotApps.map((apt) => (
                            <button
                              key={apt.id}
                              onClick={() => setSelectedAppointment(apt)}
                              className={cn(
                                'mb-0.5 w-full rounded px-1 py-0.5 text-left text-[10px] leading-tight transition-all hover:brightness-110',
                                statusColors[apt.status]
                              )}
                            >
                              <span className="font-medium">{apt.client?.name}</span>
                              <span className="block text-[9px] opacity-75">{apt.service?.name}</span>
                            </button>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'month' && (
        <>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardContent className="p-2">
              <div className="grid grid-cols-7 gap-px">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
                  <div key={d} className="p-2 text-center text-xs text-zinc-500">
                    {d}
                  </div>
                ))}
                {(() => {
                  const start = startOfMonth(currentDate)
                  const startDay = getDay(start)
                  const padding = Array.from({ length: startDay }, (_, i) => (
                    <div key={`pad-${i}`} className="p-2" />
                  ))
                  return [...padding, ...monthDays.map((day) => {
                    const dayApps = getAppointmentsForDay(day)
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => {
                          setCurrentDate(day)
                          setViewMode('day')
                        }}
                        className={cn(
                          'rounded-lg p-2 text-left transition-all hover:bg-zinc-800',
                          isToday(day) && 'bg-amber-500/10 ring-1 ring-amber-500/30',
                          !isSameMonth(day, currentDate) && 'opacity-30'
                        )}
                      >
                        <p className={cn('text-sm font-medium', isToday(day) ? 'text-amber-400' : 'text-zinc-300')}>
                          {format(day, 'dd')}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {dayApps.slice(0, 3).map((apt) => (
                            <span
                              key={apt.id}
                              className={cn('h-1.5 w-1.5 rounded-full', statusDotColors[apt.status])}
                            />
                          ))}
                          {dayApps.length > 3 && (
                            <span className="text-[9px] text-zinc-500">+{dayApps.length - 3}</span>
                          )}
                        </div>
                      </button>
                    )
                  })]
                })()}
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-sm text-zinc-200">
                Agendamentos de {format(currentDate, "dd 'de' MMMM", { locale: ptBR as any })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const dayApps = getAppointmentsForDay(currentDate)
                if (dayApps.length === 0) {
                  return <p className="py-8 text-center text-sm text-zinc-500">Nenhum agendamento neste dia</p>
                }
                return (
                  <div className="space-y-2">
                    {dayApps.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all hover:brightness-110',
                          statusColors[apt.status]
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{apt.client?.name}</p>
                            <p className="text-xs text-zinc-400">{apt.service?.name} - {apt.professional?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-zinc-300">{format(new Date(apt.date), 'HH:mm')}</span>
                          <Badge variant="outline" className={cn('text-[10px]', statusColors[apt.status].split(' ')[0])}>
                            {statusLabels[apt.status]}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </>
      )}

      {viewMode !== 'month' && filteredAppointments.length === 0 && !isLoading && viewMode !== 'day' && (
        <Card className="border-zinc-800 bg-zinc-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="mb-3 h-10 w-10 text-zinc-600" />
            <p className="text-sm text-zinc-500">Nenhum agendamento encontrado</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4 border-zinc-700 text-zinc-300"
              onClick={() => setShowNewBooking(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Novo Agendamento
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-zinc-100">Detalhes do Agendamento</DialogTitle>
                <DialogDescription className="text-zinc-500">
                  {format(new Date(selectedAppointment.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR as any })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{selectedAppointment.client?.name}</p>
                    <p className="flex items-center gap-1 text-xs text-zinc-500">
                      <Phone className="h-3 w-3" />
                      {selectedAppointment.client?.phone}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-500">Serviço</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-200">
                      <Scissors className="h-3.5 w-3.5 text-amber-400" />
                      {selectedAppointment.service?.name}
                    </p>
                    {selectedAppointment.service?.price && (
                      <p className="mt-1 text-xs text-amber-400">{formatCurrency(selectedAppointment.service.price)}</p>
                    )}
                  </div>
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-500">Profissional</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-200">
                      <User className="h-3.5 w-3.5 text-amber-400" />
                      {selectedAppointment.professional?.name}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">{selectedAppointment.service?.duration} min</p>
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">Status</p>
                    <Badge variant="outline" className={cn(statusColors[selectedAppointment.status])}>
                      {statusLabels[selectedAppointment.status]}
                    </Badge>
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div className="rounded-lg bg-zinc-800/50 p-3">
                    <p className="text-xs text-zinc-500">Observações</p>
                    <p className="mt-1 text-sm text-zinc-300">{selectedAppointment.notes}</p>
                  </div>
                )}
                <Separator className="bg-zinc-800" />
                <div className="flex flex-wrap gap-2">
                  {getAvailableActions(selectedAppointment.status).map((action) => (
                    <Button
                      key={action.status}
                      variant={action.variant}
                      size="sm"
                      onClick={() => handleStatusChange(selectedAppointment.id, action.status)}
                      disabled={updateStatus.isPending}
                      className={cn(
                        action.variant === 'default' && !['CONFIRMED', 'COMPLETED'].includes(action.status) ? 'bg-amber-500 text-black hover:bg-amber-400' : '',
                        action.variant === 'destructive' ? 'border-red-500/30 text-red-400 hover:bg-red-500/20' : '',
                        action.variant === 'secondary' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20' : '',
                      )}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
        <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Agendamento</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Preencha os dados para criar um novo agendamento
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto">
            <BookingFlow />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
