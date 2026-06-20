import { Scissors, Calendar, BarChart3, Users, Package, DollarSign, Smartphone, ShieldCheck } from 'lucide-react'

const features = [
  { icon: Calendar, title: 'Agendamento Online', description: 'Clientes agendam direto pelo site da sua barbearia. Reduza faltas com lembretes automáticos.' },
  { icon: Users, title: 'Gestão de Clientes', description: 'Histórico completo de cada cliente: cortes, gastos, preferências e última visita.' },
  { icon: Scissors, title: 'Catálogo de Serviços', description: 'Cadastre todos os serviços com preço, duração e descrição. Organize por categoria.' },
  { icon: Package, title: 'Controle de Estoque', description: 'Monitore produtos, defina quantidades mínimas e receba alertas de reposição.' },
  { icon: DollarSign, title: 'Gestão Financeira', description: 'Acompanhe receitas, despesas, comissões e fechamento de caixa diário.' },
  { icon: BarChart3, title: 'Relatórios', description: 'Dashboard completo com gráficos de faturamento, horários mais movimentados e serviços mais vendidos.' },
  { icon: Users, title: 'Múltiplos Profissionais', description: 'Gerencie equipes com comissões individuais, especialidades e agenda por profissional.' },
  { icon: Smartphone, title: 'App Responsivo', description: 'Sistema 100% web responsivo. Funciona no celular, tablet e computador.' },
]

export function PlatformFeatures() {
  return (
    <section id="features" className="relative overflow-hidden border-t border-zinc-800 bg-zinc-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tudo que sua barbearia precisa
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Um sistema completo para gerenciar agendamentos, clientes, financeiro e equipe.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-amber-500/30 hover:bg-zinc-900">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition group-hover:bg-amber-500 group-hover:text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
