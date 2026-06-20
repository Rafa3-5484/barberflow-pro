'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMinutes, isBefore, startOfDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Scissors,
  User,
  CalendarDays,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Star,
  Phone,
  Mail,
  Hourglass,
  MapPin,
  Sparkles,
  AlertCircle,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { useServices } from '@/hooks/use-services'
import { useProfessionals } from '@/hooks/use-professionals'
import { useCreateAppointment, useAppointments } from '@/hooks/use-appointments'
import { cn } from '@/lib/utils'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30',
] as const

const SLOT_DURATION = 30

const steps = [
  { id: 1, label: 'Serviço', icon: Scissors },
  { id: 2, label: 'Profissional', icon: User },
  { id: 3, label: 'Data e Hora', icon: CalendarDays },
  { id: 4, label: 'Seus Dados', icon: Phone },
  { id: 5, label: 'Confirmar', icon: Check },
]

const INITIALS_COLORS = [
  'bg-amber-500/20 text-amber-400',
  'bg-blue-500/20 text-blue-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-violet-500/20 text-violet-400',
  'bg-rose-500/20 text-rose-400',
  'bg-cyan-500/20 text-cyan-400',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getInitialsColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length]
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 py-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-xl bg-zinc-800/50"
        />
      ))}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
        <Icon className="h-7 w-7 text-zinc-500" />
      </div>
      <p className="text-lg font-medium text-zinc-300">{title}</p>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
    </div>
  )
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          return (
            <div key={step.id} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 ? (
                  <div className={cn('h-[2px] flex-1 rounded-full transition-colors', isCompleted ? 'bg-amber-500' : 'bg-zinc-800')} />
                ) : (
                  <div className="flex-1" />
                )}
                <motion.div
                  layout
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all z-10',
                    isCompleted
                      ? 'bg-amber-500 text-black'
                      : isCurrent
                      ? 'bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/40 ring-offset-2 ring-offset-zinc-900'
                      : 'bg-zinc-800 text-zinc-500'
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </motion.div>
                {index < steps.length - 1 ? (
                  <div className={cn('h-[2px] flex-1 rounded-full transition-colors', isCompleted ? 'bg-amber-500' : 'bg-zinc-800')} />
                ) : (
                  <div className="flex-1" />
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-center text-xs font-medium transition-colors',
                  isCurrent
                    ? 'text-amber-400'
                    : isCompleted
                    ? 'text-zinc-300'
                    : 'text-zinc-600'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepService({
  selectedService,
  onSelect,
}: {
  selectedService: string | null
  onSelect: (id: string) => void
}) {
  const { data: services, isLoading, isError } = useServices()

  if (isLoading) return <LoadingSkeleton />
  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Erro ao carregar serviços"
        description="Tente novamente mais tarde."
      />
    )
  }
  if (!services?.length) {
    return (
      <EmptyState
        icon={Scissors}
        title="Nenhum serviço disponível"
        description="Volte mais tarde para conferir."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => {
        const isSelected = selectedService === service.id
        return (
          <motion.div
            key={service.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'group cursor-pointer border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900 hover:shadow-lg hover:shadow-amber-500/5',
                isSelected &&
                  'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10'
              )}
              onClick={() => onSelect(service.id)}
            >
              <CardContent className="p-5">
                <div
                  className={cn(
                    'mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300',
                    isSelected
                      ? 'bg-amber-500 text-black'
                      : 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/15'
                  )}
                >
                  <Scissors className="h-5 w-5" />
                </div>
                <h4 className="text-base font-semibold text-white">
                  {service.name}
                </h4>
                {service.description && (
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                    {service.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-amber-400">
                    <DollarSign className="h-3.5 w-3.5" />
                    {formatCurrency(service.price)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Hourglass className="h-3.5 w-3.5" />
                    {service.duration} min
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function StepProfessional({
  selectedProfessional,
  onSelect,
}: {
  selectedProfessional: string | null
  onSelect: (id: string) => void
}) {
  const { data: professionals, isLoading, isError } = useProfessionals()

  if (isLoading) return <LoadingSkeleton />
  if (isError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Erro ao carregar profissionais"
        description="Tente novamente mais tarde."
      />
    )
  }
  if (!professionals?.length) {
    return (
      <EmptyState
        icon={User}
        title="Nenhum profissional disponível"
        description="Volte mais tarde para conferir."
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {professionals.map((prof) => {
        const isSelected = selectedProfessional === prof.id
        const initials = getInitials(prof.name)
        return (
          <motion.div
            key={prof.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'group cursor-pointer border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900 hover:shadow-lg hover:shadow-amber-500/5',
                isSelected &&
                  'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10'
              )}
              onClick={() => onSelect(prof.id)}
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-3">
                  {prof.photo ? (
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <img
                        src={prof.photo}
                        alt={prof.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                        isSelected
                          ? 'bg-amber-500 text-black'
                          : getInitialsColor(prof.name)
                      )}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-base font-semibold text-white">
                      {prof.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      4.9
                    </div>
                  </div>
                </div>
                {prof.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {prof.specialties.map((s) => (
                      <span
                        key={s}
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
                          isSelected
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700/70'
                        )}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function StepDateTime({
  selectedDate,
  selectedTime,
  selectedProfessional,
  selectedService,
  serviceDuration,
  onSelectDate,
  onSelectTime,
}: {
  selectedDate: Date | undefined
  selectedTime: string | null
  selectedProfessional: string | null
  selectedService: string | null
  serviceDuration: number
  onSelectDate: (date: Date | undefined) => void
  onSelectTime: (time: string) => void
}) {
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: existingAppointments } = useAppointments(formattedDate)

  const bookedSlots = useMemo(() => {
    if (!existingAppointments || !selectedProfessional) return new Set<string>()
    const slots = new Set<string>()
    for (const apt of existingAppointments) {
      if (apt.professionalId !== selectedProfessional) continue
      if (apt.status === 'CANCELLED' || apt.status === 'NO_SHOW') continue
      const aptDate = new Date(apt.date)
      const time = `${String(aptDate.getHours()).padStart(2, '0')}:${String(aptDate.getMinutes()).padStart(2, '0')}`
      slots.add(time)
    }
    return slots
  }, [existingAppointments, selectedProfessional])

  const today = startOfDay(new Date())
  const isToday = selectedDate && isSameDay(selectedDate, today)

  const availableSlots = useMemo(() => {
    return TIME_SLOTS.filter((time) => {
      if (bookedSlots.has(time)) return false
      if (isToday) {
        const [h, m] = time.split(':').map(Number)
        const slotDate = new Date()
        slotDate.setHours(h, m, 0, 0)
        if (isBefore(slotDate, new Date())) return false
      }
      return true
    })
  }, [bookedSlots, isToday])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="mb-3 text-sm font-medium text-zinc-300">
          Selecione a Data
        </h4>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          locale={ptBR as any}
          disabled={(date) => isBefore(startOfDay(date), today)}
          className="w-full border border-zinc-800 rounded-xl bg-zinc-900/30"
        />
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium text-zinc-300">
            Selecione o Horário
          </h4>
          {selectedDate && (
            <span className="text-xs text-zinc-500">
              {availableSlots.length} disponíveis
            </span>
          )}
        </div>
        {!selectedDate ? (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-zinc-800">
            <p className="text-sm text-zinc-600">Escolha uma data primeiro</p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-zinc-800">
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-5 w-5 text-zinc-600" />
              <p className="text-sm text-zinc-500">
                Nenhum horário disponível
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Tente outra data ou profissional
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableSlots.map((time) => {
              const isSelected = selectedTime === time
              let endTime = ''
              if (isSelected && serviceDuration) {
                const [h, m] = time.split(':').map(Number)
                const end = addMinutes(new Date(2000, 0, 1, h, m), serviceDuration)
                endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
              }
              return (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTime(time)}
                  className={cn(
                    'relative h-auto flex-col gap-0.5 border-zinc-800 py-2.5 text-zinc-300 transition-all hover:border-amber-500/30 hover:text-amber-400',
                    isSelected &&
                      'border-amber-500 bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/10'
                  )}
                >
                  <span className="text-sm font-medium">{time}</span>
                  {endTime && (
                    <span className="text-[10px] text-zinc-500">
                      até {endTime}
                    </span>
                  )}
                </Button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StepClientInfo({
  name,
  phone,
  email,
  errors,
  onChange,
}: {
  name: string
  phone: string
  email: string
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <Label htmlFor="name" className="text-sm text-zinc-300">
          Nome <span className="text-amber-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className={cn(
            'mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-zinc-900',
            errors.name && 'border-red-500/50 focus:border-red-500/50'
          )}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400">{errors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phone" className="text-sm text-zinc-300">
          Telefone <span className="text-amber-500">*</span>
        </Label>
        <Input
          id="phone"
          placeholder="(11) 99999-8888"
          value={phone}
          onChange={(e) => onChange('phone', formatPhone(e.target.value))}
          className={cn(
            'mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-zinc-900',
            errors.phone && 'border-red-500/50 focus:border-red-500/50'
          )}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email" className="text-sm text-zinc-300">
          Email <span className="text-zinc-600">(opcional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onChange('email', e.target.value)}
          className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 transition-all focus:border-amber-500/50 focus:bg-zinc-900"
        />
      </div>
    </div>
  )
}

function StepConfirmation({
  serviceName,
  servicePrice,
  serviceDuration,
  professionalName,
  date,
  time,
  clientName,
  clientPhone,
  clientEmail,
}: {
  serviceName: string
  servicePrice: number
  serviceDuration: number
  professionalName: string
  date: Date | undefined
  time: string | null
  clientName: string
  clientPhone: string
  clientEmail: string
}) {
  let endTime = ''
  if (date && time && serviceDuration) {
    const [h, m] = time.split(':').map(Number)
    const end = addMinutes(new Date(2000, 0, 1, h, m), serviceDuration)
    endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`
  }

  const items = [
    { label: 'Serviço', value: serviceName, icon: Scissors },
    { label: 'Profissional', value: professionalName, icon: User },
    {
      label: 'Data',
      value: date
        ? format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR as any })
        : '-',
      icon: CalendarDays,
    },
    {
      label: 'Horário',
      value: endTime ? `${time} — ${endTime}` : time || '-',
      icon: Clock,
    },
    {
      label: 'Valor',
      value: formatCurrency(servicePrice),
      icon: DollarSign,
    },
    { label: 'Cliente', value: clientName, icon: User },
    { label: 'Telefone', value: clientPhone, icon: Phone },
  ]

  if (clientEmail) items.push({ label: 'Email', value: clientEmail, icon: Mail })

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-5 flex items-center gap-2 border-b border-zinc-800 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Resumo do Agendamento
            </h4>
            <p className="text-xs text-zinc-500">
              Revise as informações antes de confirmar
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {items.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                <Icon className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <span className="min-w-[72px] text-zinc-500">{label}</span>
              <span className="font-medium text-white truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-zinc-600">
        Ao confirmar, você concorda com nossos termos de agendamento.
      </p>
    </div>
  )
}

function SuccessScreen({
  serviceName,
  professionalName,
  date,
  time,
}: {
  serviceName: string
  professionalName: string
  date: Date | undefined
  time: string | null
}) {
  const confettiParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i / 20) * 100}%`,
    delay: `${i * 0.06}s`,
    color:
      i % 3 === 0
        ? 'bg-amber-500'
        : i % 3 === 1
        ? 'bg-amber-300'
        : 'bg-white',
  }))

  return (
    <div className="relative overflow-hidden py-8 text-center">
      {confettiParticles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute top-0 h-2 w-2 rounded-full ${p.color}`}
          style={{ left: p.left }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: [0, 200, 400],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            delay: parseFloat(p.delay),
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20"
      >
        <Check className="h-10 w-10 text-amber-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-white">
          Agendamento Confirmado!
        </h3>
        <p className="mt-2 text-zinc-400">
          Seu horário foi reservado com sucesso.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mx-auto mt-6 max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 text-left text-sm"
      >
        <div className="space-y-2.5">
          {[
            { label: 'Serviço', value: serviceName },
            { label: 'Profissional', value: professionalName },
            {
              label: 'Data',
              value: date
                ? format(date, "dd/MM/yyyy", { locale: ptBR as any })
                : '',
            },
            { label: 'Horário', value: time || '' },
          ].map(
            (item) =>
              item.value && (
                <div key={item.label} className="flex justify-between gap-2">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className="font-medium text-white">{item.value}</span>
                </div>
              )
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <a href="/">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Voltar para Home
          </Button>
        </a>
        <a href="/agendar">
          <Button className="bg-amber-500 text-black hover:bg-amber-400">
            Novo Agendamento
          </Button>
        </a>
      </motion.div>
    </div>
  )
}

const slideVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -60 : 60 }),
}

export function BookingFlow() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const createAppointment = useCreateAppointment()
  const { data: services } = useServices()
  const { data: professionals } = useProfessionals()

  const selectedServiceData = useMemo(
    () => services?.find((s) => s.id === selectedService),
    [services, selectedService]
  )
  const selectedProfessionalData = useMemo(
    () => professionals?.find((p) => p.id === selectedProfessional),
    [professionals, selectedProfessional]
  )

  const handleNext = useCallback(() => {
    if (step === 4) {
      const errors: Record<string, string> = {}
      if (clientName.trim().length < 3)
        errors.name = 'Informe seu nome completo.'
      const digits = clientPhone.replace(/\D/g, '')
      if (digits.length < 10 || digits.length > 11)
        errors.phone = 'Informe um telefone válido.'
      setFormErrors(errors)
      if (Object.keys(errors).length > 0) return
      setFormErrors({})
    }
    setDirection(1)
    setStep((s) => Math.min(s + 1, 5))
  }, [step, clientName, clientPhone])

  const handleBack = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const canProceed = useCallback(() => {
    switch (step) {
      case 1:
        return !!selectedService
      case 2:
        return !!selectedProfessional
      case 3:
        return !!selectedDate && !!selectedTime
      case 4:
        return clientName.trim().length >= 3 && clientPhone.replace(/\D/g, '').length >= 10
      case 5:
        return true
      default:
        return false
    }
  }, [step, selectedService, selectedProfessional, selectedDate, selectedTime, clientName, clientPhone])

  const handleSubmit = useCallback(async () => {
    setSubmitError(null)
    try {
      await createAppointment.mutateAsync({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || undefined,
        professionalId: selectedProfessional!,
        serviceId: selectedService!,
        barbershopId: '00000000-0000-0000-0000-000000000001',
        date: selectedDate
          ? `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`
          : '',
      })
      setSuccess(true)
    } catch (err: any) {
      setSubmitError(err?.message || 'Erro ao confirmar agendamento. Tente novamente.')
    }
  }, [createAppointment, clientName, clientPhone, clientEmail, selectedProfessional, selectedService, selectedDate, selectedTime])

  if (success) {
    return (
      <SuccessScreen
        serviceName={selectedServiceData?.name || ''}
        professionalName={selectedProfessionalData?.name || ''}
        date={selectedDate}
        time={selectedTime}
      />
    )
  }

  return (
    <div>
      <StepIndicator currentStep={step} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {step === 1 && (
            <StepService
              selectedService={selectedService}
              onSelect={setSelectedService}
            />
          )}
          {step === 2 && (
            <StepProfessional
              selectedProfessional={selectedProfessional}
              onSelect={setSelectedProfessional}
            />
          )}
          {step === 3 && (
            <StepDateTime
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedProfessional={selectedProfessional}
              selectedService={selectedService}
              serviceDuration={selectedServiceData?.duration || 30}
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
            />
          )}
          {step === 4 && (
            <StepClientInfo
              name={clientName}
              phone={clientPhone}
              email={clientEmail}
              errors={formErrors}
              onChange={(field, value) => {
                setFormErrors((prev) => ({ ...prev, [field]: '' }))
                if (field === 'name') setClientName(value)
                else if (field === 'phone') setClientPhone(value)
                else if (field === 'email') setClientEmail(value)
              }}
            />
          )}
          {step === 5 && (
            <StepConfirmation
              serviceName={selectedServiceData?.name || ''}
              servicePrice={selectedServiceData?.price || 0}
              serviceDuration={selectedServiceData?.duration || 30}
              professionalName={selectedProfessionalData?.name || ''}
              date={selectedDate}
              time={selectedTime}
              clientName={clientName}
              clientPhone={clientPhone}
              clientEmail={clientEmail}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
        >
          {submitError}
        </motion.div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>

        {step < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={createAppointment.isPending}
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40"
          >
            {createAppointment.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirmar Agendamento
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
