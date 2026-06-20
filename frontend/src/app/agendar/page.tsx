import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BookingFlow } from '@/components/agendamento/booking-flow'
import { Scissors, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Agende seu Horário | BarberFlow Pro',
  description:
    'Agende seu horário na BarberFlow Pro. Escolha o serviço, profissional e horário ideal para você.',
}

export default function AgendarPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950">
        <div className="relative overflow-hidden pt-28 pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                <Scissors className="h-7 w-7 text-amber-400" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Agende seu{' '}
                <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                  Horário
                </span>
              </h1>
              <p className="mt-3 text-lg text-zinc-400">
                Escolha o serviço, profissional e o melhor horário para você.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 lg:p-10">
              <BookingFlow />
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-zinc-600">
              <Sparkles className="h-3 w-3" />
              Agendamento rápido e sem complicação
              <Sparkles className="h-3 w-3" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
