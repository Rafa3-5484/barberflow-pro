import { requireSupabase as supabase } from '@/lib/supabase'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PublicBarbershop } from '@/components/agendamento/public-barbershop'
import { notFound } from 'next/navigation'
import { Scissors, MapPin, Phone, Mail } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: bs } = await supabase().from('Barbershop').select('name').eq('slug', slug).maybeSingle()
  if (!bs) return { title: 'Barbearia não encontrada' }
  return { title: `${bs.name} | BarberFlow Pro`, description: `Agende seu horário na ${bs.name}` }
}

export default async function BarbershopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: barbershop } = await supabase().from('Barbershop').select('*').eq('slug', slug).eq('active', true).maybeSingle()
  if (!barbershop) notFound()

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950">
        <div className="relative overflow-hidden pt-28 pb-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
                {barbershop.logo ? (
                  <img src={barbershop.logo} alt={barbershop.name} className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <Scissors className="h-8 w-8 text-amber-400" />
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {barbershop.name}
              </h1>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-400">
                {barbershop.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    {barbershop.address}
                  </span>
                )}
                {barbershop.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-amber-500" />
                    {barbershop.phone}
                  </span>
                )}
                {barbershop.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-amber-500" />
                    {barbershop.email}
                  </span>
                )}
              </div>
            </div>

            <PublicBarbershop barbershopId={barbershop.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
