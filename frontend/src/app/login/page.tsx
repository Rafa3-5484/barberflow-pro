'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scissors, Mail, Lock, User, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

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

  const [isSignUp, setIsSignUp] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      await login({ email: loginEmail, password: loginPassword })
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setLoginError(error.message || 'Erro ao fazer login.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')
    try {
      await register({ name: regName, email: regEmail, phone: regPhone, password: regPassword })
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setRegError(error.message || 'Erro ao cadastrar.')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 p-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <Scissors className="h-7 w-7 text-amber-400" />
          <span className="text-xl font-bold tracking-tight text-white">BarberFlow Pro</span>
        </div>

        <div className="card-switch">
          <div className="switch-header">
            <button type="button" className={`switch-label ${!isSignUp ? 'active' : ''}`} onClick={() => setIsSignUp(false)}>Entrar</button>
            <button type="button" className={`switch-label ${isSignUp ? 'active' : ''}`} onClick={() => setIsSignUp(true)}>Cadastrar</button>
          </div>

          <div className={`flip-card__inner ${isSignUp ? 'flipped' : ''}`}>
            <div className="flip-card__front">
              <div className="title">Entrar</div>
              <form className="flip-card__form" onSubmit={handleLogin}>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input className="input-field" type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input className="input-field" type="password" placeholder="Senha" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                </div>
                {loginError && <p className="text-xs text-red-400">{loginError}</p>}
                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
                <a href="/agendar" className="link">Agendar sem cadastro</a>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Cadastrar</div>
              <form className="flip-card__form" onSubmit={handleRegister}>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input className="input-field" placeholder="Nome completo" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </div>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input className="input-field" type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                </div>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input className="input-field" placeholder="Telefone" value={regPhone} onChange={(e) => setRegPhone(formatPhone(e.target.value))} />
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input className="input-field" type="password" placeholder="Senha" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                </div>
                {regError && <p className="text-xs text-red-400">{regError}</p>}
                <button className="btn" type="submit" disabled={isLoading}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </form>
            </div>
          </div>
          </div>

          <p className="text-xs text-zinc-600">
            Já tem barbearia?{' '}
            <a href="/cadastrar" className="text-amber-400 hover:text-amber-300 transition-colors">Criar conta para barbearia</a>
          </p>
      </div>

      <style>{`
        .card-switch {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          perspective: 1000px;
        }
        .switch-header {
          display: flex;
          align-items: center;
          gap: 4px;
          user-select: none;
          background: #18181b;
          border: 2px solid #27272a;
          border-radius: 10px;
          padding: 4px;
          box-shadow: 4px 4px 0 #09090b;
        }
        .switch-label {
          all: unset;
          font-size: 13px;
          font-weight: 700;
          color: #52525b;
          cursor: pointer;
          transition: all 0.3s;
          padding: 8px 22px;
          border-radius: 7px;
          text-align: center;
          flex: 1;
        }
        .switch-label.active {
          color: #09090b;
          background: #f59e0b;
          box-shadow: 0 2px 0 #a16207;
        }
        .flip-card__inner {
          width: 320px;
          height: 380px;
          position: relative;
          transition: transform 0.6s ease;
          transform-style: preserve-3d;
        }
        .flip-card__inner.flipped {
          transform: rotateY(180deg);
        }
        .flip-card__front,
        .flip-card__back {
          padding: 28px;
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background: #09090b;
          border-radius: 12px;
          border: 2px solid #27272a;
          box-shadow: 8px 8px 0 #18181b;
        }
        .flip-card__back {
          transform: rotateY(180deg);
        }
        .flip-card__form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .title {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          color: #f4f4f5;
          margin-bottom: 4px;
        }
        .input-wrapper {
          position: relative;
          width: 100%;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #52525b;
          pointer-events: none;
        }
        .input-field {
          width: 100%;
          height: 42px;
          border-radius: 8px;
          border: 2px solid #27272a;
          background: #09090b;
          box-shadow: 3px 3px 0 #18181b;
          font-size: 14px;
          color: #f4f4f5;
          padding: 0 12px 0 38px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .input-field::placeholder {
          color: #52525b;
        }
        .input-field:focus {
          border-color: #f59e0b;
        }
        .btn {
          width: 140px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid #f59e0b;
          background: #f59e0b;
          box-shadow: 4px 4px 0 #78350f;
          font-size: 15px;
          font-weight: 700;
          color: #09090b;
          cursor: pointer;
          transition: all 0.1s;
        }
        .btn:active {
          box-shadow: 0 0 0 #78350f;
          transform: translate(3px, 3px);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .link {
          font-size: 12px;
          color: #52525b;
          text-decoration: none;
          transition: color 0.2s;
        }
        .link:hover {
          color: #f59e0b;
        }
      `}</style>
    </div>
  )
}
