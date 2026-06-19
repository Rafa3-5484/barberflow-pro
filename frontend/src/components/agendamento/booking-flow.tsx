'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Scissors,
  User,
  Calendar,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { useServices } from '@/hooks/use-services'
import { useProfessionals } from '@/hooks/use-professionals'
import { useCreateAppointment } from '@/hooks/use-appointments'
import { cn } from '@/lib/utils'

const steps = [
  { id: 1, label: 'Serviço', icon: Scissors },
  { id: 2, label: 'Profissional', icon: User },
  { id: 3, label: 'Data e Hora', icon: Calendar },
  { id: 4, label: 'Dados', icon: Clock },
  { id: 5, label: 'Confirmação', icon: Check },
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30',
]

interface StepIndicatorProps {
  currentStep: number
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          return (
            <div key={step.id} className="flex flex-1 flex-col items-center">
              <div className="flex items-center w-full">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all z-10',
                    isCompleted
                      ? 'bg-amber-500 text-black'
                      : isCurrent
                      ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/50'
                      : 'bg-zinc-800 text-zinc-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-[2px] flex-1 transition-colors',
                      isCompleted ? 'bg-amber-500' : 'bg-zinc-800'
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
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
  const { data: services, isLoading } = useServices()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services?.map((service) => (
        <Card
          key={service.id}
          className={cn(
            'cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-amber-500/30',
            selectedService === service.id && 'border-amber-500 bg-amber-500/5'
          )}
          onClick={() => onSelect(service.id)}
        >
          <CardContent className="p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Scissors className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-white">{service.name}</h4>
            {service.description && (
              <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                {service.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-amber-400">
                <DollarSign className="h-3.5 w-3.5" />
                R$ {service.price}
              </span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                {service.duration} min
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
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
  const { data: professionals, isLoading } = useProfessionals()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {professionals?.map((prof) => (
        <Card
          key={prof.id}
          className={cn(
            'cursor-pointer border-zinc-800 bg-zinc-900 transition-all hover:border-amber-500/30',
            selectedProfessional === prof.id && 'border-amber-500 bg-amber-500/5'
          )}
          onClick={() => onSelect(prof.id)}
        >
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-amber-400">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{prof.name}</h4>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="h-3 w-3 fill-amber-400" />
                  4.9
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {prof.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StepDateTime({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: {
  selectedDate: Date | undefined
  selectedTime: string | null
  onSelectDate: (date: Date | undefined) => void
  onSelectTime: (time: string) => void
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="mb-3 text-sm font-medium text-zinc-300">Selecione a Data</h4>
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          locale={ptBR as any}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          className="border border-zinc-800 rounded-xl"
        />
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-zinc-300">
          Selecione o Horário
        </h4>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant="outline"
              size="sm"
              onClick={() => onSelectTime(time)}
              className={cn(
                'border-zinc-800 text-zinc-300 hover:text-amber-400',
                selectedTime === time && 'border-amber-500 bg-amber-500/10 text-amber-400'
              )}
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepClientInfo({
  name,
  phone,
  email,
  onChange,
}: {
  name: string
  phone: string
  email: string
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div>
        <Label htmlFor="name" className="text-zinc-300">Nome</Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className="mt-1.5 border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
        />
      </div>
      <div>
        <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
        <Input
          id="phone"
          placeholder="(11) 99999-8888"
          value={phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="mt-1.5 border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-zinc-300">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onChange('email', e.target.value)}
          className="mt-1.5 border-zinc-800 bg-zinc-900 text-zinc-300 placeholder:text-zinc-600"
        />
      </div>
    </div>
  )
}

function StepConfirmation({
  serviceName,
  professionalName,
  date,
  time,
  clientName,
  clientPhone,
  clientEmail,
}: {
  serviceName: string
  professionalName: string
  date: Date | undefined
  time: string | null
  clientName: string
  clientPhone: string
  clientEmail: string
}) {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          Resumo do Agendamento
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Serviço</span>
            <span className="font-medium text-white">{serviceName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Profissional</span>
            <span className="font-medium text-white">{professionalName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Data</span>
            <span className="font-medium text-white">
              {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR as any }) : '-'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Horário</span>
            <span className="font-medium text-white">{time}</span>
          </div>
          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Cliente</span>
              <span className="font-medium text-white">{clientName}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-zinc-400">Telefone</span>
              <span className="font-medium text-white">{clientPhone}</span>
            </div>
            {clientEmail && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-zinc-400">Email</span>
                <span className="font-medium text-white">{clientEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const variants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

export function BookingFlow() {
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [success, setSuccess] = useState(false)

  const createAppointment = useCreateAppointment()

  const { data: services } = useServices()
  const { data: professionals } = useProfessionals()

  const serviceName = services?.find((s) => s.id === selectedService)?.name || ''
  const professionalName =
    professionals?.find((p) => p.id === selectedProfessional)?.name || ''

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedService
      case 2:
        return !!selectedProfessional
      case 3:
        return !!selectedDate && !!selectedTime
      case 4:
        return clientName.length >= 3 && clientPhone.length >= 10
      case 5:
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    try {
      await createAppointment.mutateAsync({
        clientName,
        clientPhone,
        clientEmail: clientEmail || undefined,
        professionalId: selectedProfessional!,
        serviceId: selectedService!,
        date: selectedDate
          ? `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`
          : '',
      })
      setSuccess(true)
    } catch {
      // error handled by react query
    }
  }

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
          <Check className="h-10 w-10 text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Agendamento Confirmado!</h3>
        <p className="mt-2 text-zinc-400">
          Seu horário foi agendado com sucesso.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left text-sm">
          <p className="flex justify-between text-zinc-400">
            <span>Serviço:</span>
            <span className="text-white">{serviceName}</span>
          </p>
          <p className="flex justify-between text-zinc-400 mt-2">
            <span>Profissional:</span>
            <span className="text-white">{professionalName}</span>
          </p>
          <p className="flex justify-between text-zinc-400 mt-2">
            <span>Data:</span>
            <span className="text-white">
              {selectedDate
                ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR as any })
                : ''}{' '}
              às {selectedTime}
            </span>
          </p>
        </div>
        <a href="/">
          <Button variant="outline" className="mt-6 border-zinc-700 text-zinc-300">
            Voltar para Home
          </Button>
        </a>
      </div>
    )
  }

  return (
    <div>
      <StepIndicator currentStep={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
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
              onSelectDate={setSelectedDate}
              onSelectTime={setSelectedTime}
            />
          )}
          {step === 4 && (
            <StepClientInfo
              name={clientName}
              phone={clientPhone}
              email={clientEmail}
              onChange={(field, value) => {
                if (field === 'name') setClientName(value)
                else if (field === 'phone') setClientPhone(value)
                else if (field === 'email') setClientEmail(value)
              }}
            />
          )}
          {step === 5 && (
            <StepConfirmation
              serviceName={serviceName}
              professionalName={professionalName}
              date={selectedDate}
              time={selectedTime}
              clientName={clientName}
              clientPhone={clientPhone}
              clientEmail={clientEmail}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="gap-2 border-zinc-700 text-zinc-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        {step < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={createAppointment.isPending}
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400"
          >
            {createAppointment.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
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
