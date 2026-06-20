import { Scissors, Phone, Mail, Globe } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="h-5 w-5 text-amber-400" />
              <span className="text-lg font-bold tracking-tight text-white">
                BarberFlow Pro
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Plataforma completa de gestão para barbearias. Agendamento online, controle financeiro, gestão de equipe e muito mais.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Plataforma</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/#features" className="transition-colors hover:text-amber-400">Recursos</Link></li>
              <li><Link href="/#pricing" className="transition-colors hover:text-amber-400">Preços</Link></li>
              <li><Link href="/cadastrar" className="transition-colors hover:text-amber-400">Criar Conta</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-amber-400">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Para Clientes</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><span className="text-zinc-500">Encontre sua barbearia:</span></li>
              <li><span className="text-zinc-600">BarberFlow Pro/{`{sua-barbearia}`}</span></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contato</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>contato@barberflowpro.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} BarberFlow Pro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
