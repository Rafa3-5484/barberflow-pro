import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: '/mês',
    description: 'Perfeito para começar.',
    features: [
      'Agendamento online',
      'Até 2 profissionais',
      'Gestão de clientes',
      'Catálogo de serviços',
      'Página pública da barbearia',
    ],
    cta: 'Criar Conta Grátis',
    href: '/cadastrar',
    featured: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 49',
    period: '/mês',
    description: 'Para barbearias em crescimento.',
    features: [
      'Tudo do plano Grátis',
      'Profissionais ilimitados',
      'Relatórios e dashboard',
      'Gestão financeira',
      'Controle de estoque',
      'Múltiplas unidades',
    ],
    cta: 'Começar Trial',
    href: '/cadastrar',
    featured: true,
  },
  {
    name: 'Premium',
    price: 'R$ 99',
    period: '/mês',
    description: 'Solução completa.',
    features: [
      'Tudo do Profissional',
      'Suporte prioritário',
      'Integração WhatsApp',
      'Notificações push',
      'Exportação de dados',
      'Personalização avançada',
    ],
    cta: 'Falar com Vendas',
    href: '/cadastrar',
    featured: false,
  },
]

export function PlatformPricing() {
  return (
    <section id="pricing" className="border-t border-zinc-800 bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Preços simples
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Comece grátis e evolua conforme sua barbearia cresce.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.featured
                  ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                  : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-black">
                  Mais Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}>
                <Button
                  className={`mt-8 w-full ${
                    plan.featured
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                  }`}
                  variant={plan.featured ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
