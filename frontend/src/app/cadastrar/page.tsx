'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scissors, Store, User, Mail, Lock, Phone, MapPin, ChevronRight, ArrowLeft, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function CadastrarPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [barbershopName, setBarbershopName] = useState('')
  const [barbershopSlug, setBarbershopSlug] = useState('')
  const [barbershopPhone, setBarbershopPhone] = useState('')
  const [barbershopEmail, setBarbershopEmail] = useState('')
  const [barbershopAddress, setBarbershopAddress] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const autoSlug = (val: string) => {
    setBarbershopName(val)
    if (!barbershopSlug || barbershopSlug === barbershopName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
      setBarbershopSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }

  const canGoStep2 = barbershopName.length >= 3 && barbershopSlug.length >= 3

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post<any>('/auth/register-barbershop', {
        barbershopName,
        barbershopSlug,
        barbershopPhone: barbershopPhone || undefined,
        barbershopEmail: barbershopEmail || undefined,
        barbershopAddress: barbershopAddress || undefined,
        name,
        email,
        password,
        phone: phone || undefined,
      })
      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('refreshToken', res.refreshToken)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err: any) {
      setError(err?.message || 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <Check className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Barbearia criada!</h2>
          <p className="mt-2 text-zinc-400">Redirecionando para o painel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
            <Scissors className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
          <p className="mt-2 text-zinc-400">
            Cadastre sua barbearia e comece a gerenciar
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-sm sm:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Store className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-sm font-medium text-white">Dados da Barbearia</p>
              </div>

              <div>
                <Label htmlFor="bsName" className="text-sm text-zinc-300">Nome da Barbearia <span className="text-amber-500">*</span></Label>
                <Input id="bsName" placeholder="Ex: Barbearia do Rafa" value={barbershopName} onChange={(e) => autoSlug(e.target.value)} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>
              <div>
                <Label htmlFor="bsSlug" className="text-sm text-zinc-300">Link personalizado <span className="text-amber-500">*</span></Label>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="shrink-0 text-xs text-zinc-500">barberflow.com/</span>
                  <Input id="bsSlug" placeholder="minha-barbearia" value={barbershopSlug} onChange={(e) => setBarbershopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} className="border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
                </div>
              </div>
              <div>
                <Label htmlFor="bsPhone" className="text-sm text-zinc-300">Telefone</Label>
                <Input id="bsPhone" placeholder="(11) 99999-8888" value={barbershopPhone} onChange={(e) => setBarbershopPhone(formatPhone(e.target.value))} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>
              <div>
                <Label htmlFor="bsEmail" className="text-sm text-zinc-300">Email</Label>
                <Input id="bsEmail" type="email" placeholder="contato@barbearia.com" value={barbershopEmail} onChange={(e) => setBarbershopEmail(e.target.value)} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>
              <div>
                <Label htmlFor="bsAddress" className="text-sm text-zinc-300">Endereço</Label>
                <Input id="bsAddress" placeholder="Rua, número, bairro" value={barbershopAddress} onChange={(e) => setBarbershopAddress(e.target.value)} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button onClick={() => setStep(2)} disabled={!canGoStep2} className="w-full gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40">
                Continuar <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <button onClick={() => { setStep(1); setError('') }} className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-300">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <User className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-sm font-medium text-white">Dados do Administrador</p>
              </div>

              <div>
                <Label htmlFor="name" className="text-sm text-zinc-300">Nome <span className="text-amber-500">*</span></Label>
                <Input id="name" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-zinc-300">Email <span className="text-amber-500">*</span></Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-zinc-300">Telefone</Label>
                <Input id="phone" placeholder="(11) 99999-8888" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm text-zinc-300">Senha <span className="text-amber-500">*</span></Label>
                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 border-zinc-800 bg-zinc-900/50 text-zinc-300 placeholder:text-zinc-600 focus:border-amber-500/50" />
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-400">
                <p className="font-medium text-zinc-300">Resumo</p>
                <p className="mt-2">Barbearia: <span className="text-white">{barbershopName}</span></p>
                <p>Link: <span className="text-white">barberflow.com/{barbershopSlug}</span></p>
                <p>Admin: <span className="text-white">{name || email}</span></p>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button onClick={handleSubmit} disabled={loading || !name || !email || password.length < 6} className="w-full gap-2 bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Store className="h-4 w-4" />}
                {loading ? 'Criando...' : 'Criar Barbearia'}
              </Button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-zinc-600">
            Já tem conta?{' '}
            <a href="/login" className="text-amber-400 hover:text-amber-300">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
