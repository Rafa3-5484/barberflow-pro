'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addMinutes, isBefore, startOfDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useCreateAppointment } from '@/hooks/use-appointments'

import {
  Scissors, User, CalendarDays, Clock, Check, ChevronLeft, ChevronRight,
  DollarSign, Star, Phone, Mail, Hourglass, Sparkles, AlertCircle, Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30',
] as const

function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const steps = [
  { id: 1, label: 'Serviço' },
  { id: 2, label: 'Profissional' },
  { id: 3, label: 'Data e Hora' },
  { id: 4, label: 'Seus Dados' },
  { id: 5, label: 'Confirmar' },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-start">
      {steps.map((s, i) => {
        const done = current > s.id
        const now = current === s.id
        return (
          <div key={s.id} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {i > 0 ? <div className={cn('h-[2px] flex-1 rounded-full transition', done ? 'bg-amber-500' : 'bg-zinc-800')} /> : <div className="flex-1" />}
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium z-10 transition', done ? 'bg-amber-500 text-black' : now ? 'bg-amber-500/15 text-amber-400 ring-2 ring-amber-500/40 ring-offset-2 ring-offset-zinc-900' : 'bg-zinc-800 text-zinc-500')}>
                {done ? <Check className="h-4 w-4" /> : s.id === 1 ? <Scissors className="h-4 w-4" /> : s.id === 2 ? <User className="h-4 w-4" /> : s.id === 3 ? <CalendarDays className="h-4 w-4" /> : s.id === 4 ? <Phone className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </div>
              {i < steps.length - 1 ? <div className={cn('h-[2px] flex-1 rounded-full transition', done ? 'bg-amber-500' : 'bg-zinc-800')} /> : <div className="flex-1" />}
            </div>
            <span className={cn('mt-2 text-center text-xs font-medium transition', now ? 'text-amber-400' : done ? 'text-zinc-300' : 'text-zinc-600')}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export function PublicBarbershop({ barbershopId }: { barbershopId: string }) {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(0)
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

  const { data: services } = useQuery({
    queryKey: ['services', barbershopId],
    queryFn: () => api.get<any[]>(`/services?barbershopId=${barbershopId}`),
  })

  const { data: professionals } = useQuery({
    queryKey: ['professionals', barbershopId],
    queryFn: () => api.get<any[]>(`/professionals?barbershopId=${barbershopId}`),
  })

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: existingAppointments } = useQuery({
    queryKey: ['appointments', formattedDate, barbershopId],
    queryFn: () => api.get<any[]>(`/appointments/date/${formattedDate}?barbershopId=${barbershopId}`),
    enabled: !!selectedDate,
  })

  const selectedServiceData = useMemo(() => services?.find((s: any) => s.id === selectedService), [services, selectedService])
  const selectedProfessionalData = useMemo(() => professionals?.find((p: any) => p.id === selectedProfessional), [professionals, selectedProfessional])

  const bookedSlots = useMemo(() => {
    if (!existingAppointments || !selectedProfessional) return new Set<string>()
    const s = new Set<string>()
    for (const a of existingAppointments) {
      if (a.professionalId !== selectedProfessional) continue
      if (a.status === 'CANCELLED' || a.status === 'NO_SHOW') continue
      const d = new Date(a.date); s.add(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
    }
    return s
  }, [existingAppointments, selectedProfessional])

  const today = startOfDay(new Date())
  const isToday = selectedDate && isSameDay(selectedDate, today)
  const availableSlots = useMemo(() => TIME_SLOTS.filter(t => !bookedSlots.has(t) && (!isToday || (() => { const [h, m] = t.split(':').map(Number); const sd = new Date(); sd.setHours(h, m, 0, 0); return !isBefore(sd, new Date()) })())), [bookedSlots, isToday])

  const handleNext = () => {
    if (step === 4) {
      const e: Record<string, string> = {}
      if (clientName.trim().length < 3) e.name = 'Informe seu nome'
      if (clientPhone.replace(/\D/g, '').length < 10) e.phone = 'Telefone inválido'
      setFormErrors(e)
      if (Object.keys(e).length > 0) return
      setFormErrors({})
    }
    setDir(1); setStep(s => Math.min(s + 1, 5))
  }

  const handleSubmit = async () => {
    setSubmitError(null)
    try {
      await createAppointment.mutateAsync({
        clientName: clientName.trim(), clientPhone: clientPhone.trim(), clientEmail: clientEmail.trim() || undefined,
        professionalId: selectedProfessional!, serviceId: selectedService!, barbershopId,
        date: selectedDate ? `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00` : '',
      })
      setSuccess(true)
    } catch (err: any) { setSubmitError(err?.message || 'Erro ao agendar') }
  }

  if (success) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
          <Check className="h-10 w-10 text-amber-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Agendamento Confirmado!</h3>
        <p className="mt-2 text-zinc-400">Seu horário foi reservado.</p>
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left text-sm">
          <p className="flex justify-between text-zinc-400"><span>Serviço:</span><span className="text-white">{selectedServiceData?.name}</span></p>
          <p className="flex justify-between text-zinc-400 mt-2"><span>Profissional:</span><span className="text-white">{selectedProfessionalData?.name}</span></p>
          <p className="flex justify-between text-zinc-400 mt-2"><span>Data:</span><span className="text-white">{selectedDate ? format(selectedDate, "dd/MM/yyyy") : ''} às {selectedTime}</span></p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()} className="bg-amber-500 text-black hover:bg-amber-400">Novo Agendamento</Button>
        </div>
      </div>
    )
  }

  const sv = slideVariants

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 lg:p-10">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir} variants={sv} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {services?.map((s: any) => (
                <Card key={s.id} className={cn('cursor-pointer border-zinc-800 bg-zinc-900/50 transition hover:border-amber-500/40', selectedService === s.id && 'border-amber-500 bg-amber-500/5')} onClick={() => setSelectedService(s.id)}>
                  <CardContent className="p-5">
                    <div className={cn('mb-3 flex h-11 w-11 items-center justify-center rounded-xl transition', selectedService === s.id ? 'bg-amber-500 text-black' : 'bg-amber-500/10 text-amber-400')}><Scissors className="h-5 w-5" /></div>
                    <h4 className="text-base font-semibold text-white">{s.name}</h4>
                    {s.description && <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">{s.description}</p>}
                    <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-amber-400"><DollarSign className="h-3.5 w-3.5" />{formatCurrency(s.price)}</span>
                      <span className="flex items-center gap-1.5 text-sm text-zinc-500"><Hourglass className="h-3.5 w-3.5" />{s.duration} min</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!services || services.length === 0) && <p className="col-span-2 py-8 text-center text-zinc-500">Nenhum serviço disponível</p>}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {professionals?.map((p: any) => (
                <Card key={p.id} className={cn('cursor-pointer border-zinc-800 bg-zinc-900/50 transition hover:border-amber-500/40', selectedProfessional === p.id && 'border-amber-500 bg-amber-500/5')} onClick={() => setSelectedProfessional(p.id)}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold transition', selectedProfessional === p.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-amber-400')}>
                        {p.name.split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">{p.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-amber-400"><Star className="h-3 w-3 fill-amber-400" />4.9</div>
                      </div>
                    </div>
                    {p.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {p.specialties.map((s: string) => <span key={s} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-400">{s}</span>)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {(!professionals || professionals.length === 0) && <p className="col-span-2 py-8 text-center text-zinc-500">Nenhum profissional disponível</p>}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 text-sm font-medium text-zinc-300">Selecione a Data</h4>
                <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ptBR as any}
                  disabled={(d) => isBefore(startOfDay(d), today)} className="w-full border border-zinc-800 rounded-xl bg-zinc-900/30" />
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-medium text-zinc-300">Horário</h4>
                  {selectedDate && <span className="text-xs text-zinc-500">{availableSlots.length} disponíveis</span>}
                </div>
                {!selectedDate ? (
                  <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-zinc-800"><p className="text-sm text-zinc-600">Escolha uma data primeiro</p></div>
                ) : availableSlots.length === 0 ? (
                  <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-zinc-800"><div className="text-center"><Clock className="mx-auto mb-2 h-5 w-5 text-zinc-600" /><p className="text-sm text-zinc-500">Nenhum horário disponível</p></div></div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {availableSlots.map((t) => (
                      <Button key={t} variant="outline" size="sm" onClick={() => setSelectedTime(t)}
                        className={cn('flex-col gap-0.5 border-zinc-800 py-2.5 text-zinc-300 hover:border-amber-500/30 hover:text-amber-400', selectedTime === t && 'border-amber-500 bg-amber-500/10 text-amber-400')}>
                        <span className="text-sm font-medium">{t}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mx-auto max-w-md space-y-5">
              <div><Label className="text-sm text-zinc-300">Nome <span className="text-amber-500">*</span></Label>
                <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Seu nome completo"
                  className={cn('mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600', formErrors.name && 'border-red-500/50')} />
                {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}</div>
              <div><Label className="text-sm text-zinc-300">Telefone <span className="text-amber-500">*</span></Label>
                <Input value={clientPhone} onChange={e => setClientPhone(formatPhone(e.target.value))} placeholder="(11) 99999-8888"
                  className={cn('mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600', formErrors.phone && 'border-red-500/50')} />
                {formErrors.phone && <p className="mt-1 text-xs text-red-400">{formErrors.phone}</p>}</div>
              <div><Label className="text-sm text-zinc-300">Email <span className="text-zinc-600">(opcional)</span></Label>
                <Input value={clientEmail} onChange={e => setClientEmail(e.target.value)} type="email" placeholder="seu@email.com"
                  className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600" /></div>
            </div>
          )}

          {step === 5 && (
            <div className="mx-auto max-w-md">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="mb-4 border-b border-zinc-800 pb-4">
                  <h4 className="text-sm font-semibold text-white">Resumo</h4>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { l: 'Serviço', v: selectedServiceData?.name },
                    { l: 'Profissional', v: selectedProfessionalData?.name },
                    { l: 'Valor', v: formatCurrency(selectedServiceData?.price || 0) },
                    { l: 'Data', v: selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR as any }) : '-' },
                    { l: 'Horário', v: selectedTime },
                    { l: 'Cliente', v: clientName },
                  ].map(i => <div key={i.l} className="flex justify-between"><span className="text-zinc-500">{i.l}</span><span className="font-medium text-white">{i.v}</span></div>)}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{submitError}</div>}

      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
        <Button variant="outline" onClick={() => { setDir(-1); setStep(s => Math.max(s - 1, 1)) }} disabled={step === 1}
          className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30">
          <ChevronLeft className="h-4 w-4" /> Voltar</Button>
        {step < 5 ? (
          <Button onClick={handleNext} disabled={step === 1 ? !selectedService : step === 2 ? !selectedProfessional : step === 3 ? !selectedDate || !selectedTime : step === 4 ? clientName.trim().length < 3 || clientPhone.replace(/\D/g, '').length < 10 : false}
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40">
            Próximo <ChevronRight className="h-4 w-4" /></Button>
        ) : (
          <Button onClick={handleSubmit} disabled={createAppointment.isPending}
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40">
            {createAppointment.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirmando...</> : <><Check className="h-4 w-4" /> Confirmar</>}</Button>
        )}
      </div>
    </div>
  )
}

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
}
