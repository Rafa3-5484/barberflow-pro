'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Scissors, User, Check, ArrowRight, Sparkles, DollarSign, Clock, Star, Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'

type OnboardingStep = 'welcome' | 'professional' | 'service' | 'done'

export function OnboardingWizard() {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [loading, setLoading] = useState(false)

  const [profName, setProfName] = useState('')
  const [profPhone, setProfPhone] = useState('')
  const [profSpecialty, setProfSpecialty] = useState('')
  const [profCommission, setProfCommission] = useState('')

  const [servName, setServName] = useState('')
  const [servPrice, setServPrice] = useState('')
  const [servDuration, setServDuration] = useState('')

  const handleAddProfessional = async () => {
    setLoading(true)
    try {
      await api.post('/professionals', {
        name: profName,
        phone: profPhone,
        specialties: profSpecialty ? [profSpecialty] : [],
        commission: Number(profCommission) || 0,
      })
      queryClient.invalidateQueries({ queryKey: ['professionals'] })
      setStep('service')
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async () => {
    setLoading(true)
    try {
      await api.post('/services', {
        name: servName,
        price: Number(servPrice) || 0,
        duration: Number(servDuration) || 30,
      })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setStep('done')
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    setLoading(true)
    try {
      await api.post('/professionals', {
        name: 'Profissional',
        phone: '',
        specialties: [],
        commission: 0,
      })
      await api.post('/services', {
        name: 'Corte',
        price: 0,
        duration: 30,
      })
      queryClient.invalidateQueries({ queryKey: ['professionals', 'services'] })
      setStep('done')
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (step === 'welcome') {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/20">
          <Sparkles className="h-10 w-10 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Vamos configurar sua barbearia!</h2>
        <p className="mt-3 text-zinc-400 leading-relaxed">
          Em apenas 2 passos você adiciona seu primeiro profissional e serviço.
          Depois sua página pública já fica no ar para receber agendamentos!
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            className="gap-2 bg-amber-500 text-black hover:bg-amber-400"
            onClick={() => setStep('professional')}
          >
            Configurar Agora <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-400"
            onClick={handleSkip}
            disabled={loading}
          >
            {loading ? 'Configurando...' : 'Usar Padrão'}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'professional') {
    return (
      <div className="mx-auto max-w-lg py-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">1</div>
          <span className="text-sm font-medium text-zinc-300">Adicionar Profissional</span>
          <span className="text-xs text-zinc-600">— passo 1 de 2</span>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-zinc-400">Nome do Profissional</Label>
            <Input
              value={profName}
              onChange={(e) => setProfName(e.target.value)}
              placeholder="Ex: Carlos"
              className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400">Telefone</Label>
            <Input
              value={profPhone}
              onChange={(e) => setProfPhone(e.target.value)}
              placeholder="(11) 99999-8888"
              className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400">Especialidade</Label>
            <Input
              value={profSpecialty}
              onChange={(e) => setProfSpecialty(e.target.value)}
              placeholder="Ex: Corte Degradê"
              className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
          <div>
            <Label className="text-xs text-zinc-400">Comissão (%)</Label>
            <Input
              type="number"
              value={profCommission}
              onChange={(e) => setProfCommission(e.target.value)}
              placeholder="40"
              className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-400"
              onClick={() => setStep('service')}
            >
              Pular
            </Button>
            <Button
              className="flex-1 gap-2 bg-amber-500 text-black hover:bg-amber-400"
              onClick={handleAddProfessional}
              disabled={!profName || loading}
            >
              {loading ? 'Salvando...' : 'Adicionar e Continuar'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'service') {
    return (
      <div className="mx-auto max-w-lg py-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">✓</div>
          <span className="text-xs text-zinc-500">Profissional adicionado</span>
          <span className="text-zinc-600">·</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">2</div>
          <span className="text-sm font-medium text-zinc-300">Adicionar Serviço</span>
          <span className="text-xs text-zinc-600">— passo 2 de 2</span>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-zinc-400">Nome do Serviço</Label>
            <Input
              value={servName}
              onChange={(e) => setServName(e.target.value)}
              placeholder="Ex: Corte Degradê"
              className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-zinc-400">Preço (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={servPrice}
                onChange={(e) => setServPrice(e.target.value)}
                placeholder="55,00"
                className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
              />
            </div>
            <div>
              <Label className="text-xs text-zinc-400">Duração (min)</Label>
              <Input
                type="number"
                value={servDuration}
                onChange={(e) => setServDuration(e.target.value)}
                placeholder="40"
                className="mt-1 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-400"
              onClick={() => setStep('done')}
            >
              Pular
            </Button>
            <Button
              className="flex-1 gap-2 bg-amber-500 text-black hover:bg-amber-400"
              onClick={handleAddService}
              disabled={!servName || loading}
            >
              {loading ? 'Salvando...' : 'Adicionar e Finalizar'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
        <Check className="h-10 w-10 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">Tudo pronto!</h2>
      <p className="mt-3 text-zinc-400 leading-relaxed">
        Sua barbearia já tem profissional e serviço cadastrados.
        Agora você pode gerenciar agendamentos, clientes e muito mais.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3 text-sm text-zinc-500">
        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Profissional</span>
        <span className="flex items-center gap-1"><Scissors className="h-3.5 w-3.5" /> Serviço</span>
        <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Página pública</span>
      </div>
    </div>
  )
}
