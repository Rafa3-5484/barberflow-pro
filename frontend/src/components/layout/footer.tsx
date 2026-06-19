import { Scissors, Phone, Mail, MapPin, Clock, Globe, Share2, Link } from 'lucide-react'

const businessHours = [
  { day: 'Seg - Sex', hours: '09:00 - 20:00' },
  { day: 'Sábado', hours: '09:00 - 18:00' },
  { day: 'Domingo', hours: 'Fechado' },
]

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
              Sistema completo de gestão para barbearias. Agende seus horários,
              acompanhe seus profissionais e gerencie seu negócio com eficiência.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Serviços</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="#" className="transition-colors hover:text-amber-400">Corte Masculino</a></li>
              <li><a href="#" className="transition-colors hover:text-amber-400">Barba</a></li>
              <li><a href="#" className="transition-colors hover:text-amber-400">Corte + Barba</a></li>
              <li><a href="#" className="transition-colors hover:text-amber-400">Hidratação Capilar</a></li>
              <li><a href="#" className="transition-colors hover:text-amber-400">Sobrancelha</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Horário</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {businessHours.map((item) => (
                <li key={item.day} className="flex items-center justify-between">
                  <span>{item.day}</span>
                  <span className={item.hours === 'Fechado' ? 'text-red-400' : 'text-zinc-300'}>
                    {item.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Contato</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400" />
                <span>(11) 99999-8888</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <span>contato@barberflowpro.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span>Rua Augusta, 1500 - Consolação, São Paulo - SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} BarberFlow Pro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400">
              <Share2 className="h-4 w-4" />
            </a>
            <a href="#" className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-amber-400">
              <Link className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
