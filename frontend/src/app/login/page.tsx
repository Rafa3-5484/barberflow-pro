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
      setLoginError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
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
      setRegError(error.message || 'Erro ao cadastrar. Tente novamente.')
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 p-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-amber-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <Scissors className="h-7 w-7 text-amber-400" />
          <span className="text-xl font-bold tracking-tight text-white">BarberFlow Pro</span>
        </div>

        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" checked={isSignUp} onChange={() => setIsSignUp(!isSignUp)} />
            <span className="slider"></span>
            <span className="card-side"></span>
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Entrar</div>
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      className="flip-card__input"
                      type="email"
                      placeholder="Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      className="flip-card__input"
                      type="password"
                      placeholder="Senha"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  {loginError && <p className="text-xs text-red-400 -mt-2">{loginError}</p>}
                  <button className="flip-card__btn" type="submit" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </button>
                  <a href="/agendar" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
                    Agendar sem cadastro
                  </a>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Cadastrar</div>
                <form className="flip-card__form" onSubmit={handleRegister}>
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      className="flip-card__input"
                      placeholder="Nome completo"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input
                      className="flip-card__input"
                      type="email"
                      placeholder="Email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-wrapper">
                    <Phone className="input-icon" />
                    <input
                      className="flip-card__input"
                      placeholder="Telefone"
                      value={regPhone}
                      onChange={(e) => setRegPhone(formatPhone(e.target.value))}
                    />
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      className="flip-card__input"
                      type="password"
                      placeholder="Senha"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                  {regError && <p className="text-xs text-red-400 -mt-2">{regError}</p>}
                  <button className="flip-card__btn" type="submit" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>

        <p className="text-xs text-zinc-600">
          Já tem barbearia?{' '}
          <a href="/cadastrar" className="text-amber-400 hover:text-amber-300 transition-colors">
            Criar conta para barbearia
          </a>
        </p>
      </div>

      <style>{`
        .card-switch {
          perspective: 1000px;
        }

        .switch {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 20px;
        }

        .card-side::before {
          position: absolute;
          content: 'Entrar';
          left: -80px;
          top: -2px;
          width: 100px;
          text-decoration: underline;
          color: #f59e0b;
          font-weight: 600;
          font-size: 14px;
        }

        .card-side::after {
          position: absolute;
          content: 'Cadastrar';
          left: 70px;
          top: -2px;
          width: 100px;
          text-decoration: none;
          color: #a1a1aa;
          font-weight: 600;
          font-size: 14px;
        }

        .toggle:checked ~ .card-side::before {
          text-decoration: none;
          color: #a1a1aa;
        }

        .toggle:checked ~ .card-side::after {
          text-decoration: underline;
          color: #f59e0b;
        }

        .toggle {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          box-sizing: border-box;
          border-radius: 5px;
          border: 2px solid #27272a;
          box-shadow: 3px 3px 0px #27272a;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #18181b;
          transition: 0.3s;
        }

        .slider:before {
          box-sizing: border-box;
          position: absolute;
          content: '';
          height: 18px;
          width: 18px;
          border: 2px solid #27272a;
          border-radius: 3px;
          left: -1px;
          bottom: 1px;
          background-color: #f59e0b;
          box-shadow: 0 2px 0 #27272a;
          transition: 0.3s;
        }

        .toggle:checked + .slider {
          background-color: #18181b;
        }

        .toggle:checked + .slider:before {
          transform: translateX(28px);
        }

        .flip-card__inner {
          width: 320px;
          height: 400px;
          position: relative;
          background-color: transparent;
          perspective: 1000px;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .toggle:checked ~ .flip-card__inner {
          transform: rotateY(180deg);
        }

        .flip-card__front, .flip-card__back {
          padding: 24px;
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background: #09090b;
          gap: 16px;
          border-radius: 12px;
          border: 2px solid #27272a;
          box-shadow: 6px 6px 0px #18181b;
        }

        .flip-card__back {
          transform: rotateY(180deg);
        }

        .flip-card__form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .title {
          font-size: 22px;
          font-weight: 900;
          text-align: center;
          color: #f4f4f5;
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

        .flip-card__input {
          width: 100%;
          height: 42px;
          border-radius: 8px;
          border: 2px solid #27272a;
          background-color: #09090b;
          box-shadow: 3px 3px 0px #18181b;
          font-size: 14px;
          font-weight: 500;
          color: #f4f4f5;
          padding: 5px 10px 5px 38px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .flip-card__input::placeholder {
          color: #52525b;
          opacity: 0.8;
        }

        .flip-card__input:focus {
          border-color: #f59e0b;
        }

        .flip-card__btn {
          width: 140px;
          height: 42px;
          border-radius: 8px;
          border: 2px solid #f59e0b;
          background-color: #f59e0b;
          box-shadow: 4px 4px 0px #78350f;
          font-size: 15px;
          font-weight: 700;
          color: #09090b;
          cursor: pointer;
          transition: all 0.1s;
        }

        .flip-card__btn:active {
          box-shadow: 0px 0px 0px #78350f;
          transform: translate(3px, 3px);
        }

        .flip-card__btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
