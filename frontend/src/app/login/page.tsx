'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scissors, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const router = useRouter()
  const { login, register, isLoading } = useAuth()

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regError, setRegError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      await login({ email: loginEmail, password: loginPassword })
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setLoginError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    try {
      await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setRegError(error.message || 'Erro ao cadastrar. Tente novamente.')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <Scissors className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-bold tracking-tight text-white">
              BarberFlow Pro
            </span>
          </div>
        </div>

        <Card className="border-zinc-800 bg-zinc-950 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-white">Bem-vindo</CardTitle>
            <CardDescription className="text-center text-zinc-400">
              Faça login ou crie sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="mb-6 w-full bg-zinc-900">
                <TabsTrigger value="login" className="flex-1">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="flex-1">
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email" className="text-zinc-300">
                      Email
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="login-password" className="text-zinc-300">
                      Senha
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Sua senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                  {loginError && (
                    <p className="text-sm text-red-400">{loginError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-500 text-black hover:bg-amber-400"
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                  <p className="text-center text-xs text-zinc-500">
                    <a href="/agendar" className="text-amber-400 hover:underline">
                      Quero agendar sem cadastro
                    </a>
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name" className="text-zinc-300">
                      Nome
                    </Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="reg-name"
                        placeholder="Seu nome completo"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reg-email" className="text-zinc-300">
                      Email
                    </Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reg-phone" className="text-zinc-300">
                      Telefone
                    </Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="reg-phone"
                        placeholder="(11) 99999-8888"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reg-password" className="text-zinc-300">
                      Senha
                    </Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="Crie uma senha"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="border-zinc-800 bg-zinc-900 pl-9 text-zinc-300 placeholder:text-zinc-600"
                        required
                      />
                    </div>
                  </div>
                  {regError && (
                    <p className="text-sm text-red-400">{regError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-500 text-black hover:bg-amber-400"
                  >
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
