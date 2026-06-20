import { requireSupabase as supabase } from '@/lib/supabase'

export async function generateReport(startDate: Date, endDate: Date, barbershopId: string) {
  const { data: appointments } = await supabase().from('Appointment')
    .select('*, "Client"(*), "Professional"(*), "Service"(*)')
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .eq('barbershopId', barbershopId)
    .order('date', { ascending: true })

  const all: any[] = appointments || []
  const completed = all.filter((a: any) => a.status === 'COMPLETED')
  const cancelled = all.filter((a: any) => a.status === 'CANCELLED')
  const noShow = all.filter((a: any) => a.status === 'NO_SHOW')
  const totalRevenue = completed.reduce((sum: number, a: any) => sum + (a.service_price || 0), 0)
  const ticketMedio = completed.length ? totalRevenue / completed.length : 0

  const servicosMaisVendidos = Object.entries(
    completed.reduce<Record<string, { name: string; count: number; total: number }>>((acc: any, a: any) => {
      if (!a.service_name) return acc
      if (!acc[a.service_name]) acc[a.service_name] = { name: a.service_name, count: 0, total: 0 }
      acc[a.service_name].count++
      acc[a.service_name].total += a.service_price || 0
      return acc
    }, {})
  ).map(([, v]: [string, any]) => v).sort((a: any, b: any) => b.count - a.count).slice(0, 10)

  const horariosMaisProcurados = Object.entries(
    all.reduce<Record<string, number>>((acc: any, a: any) => {
      const hour = new Date(a.date).getHours().toString().padStart(2, '0') + ':00'
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})
  ).map(([hora, total]: [string, number]) => ({ hora, total })).sort((a: any, b: any) => b.total - a.total).slice(0, 10)

  const comissaoPorProfissional = await Promise.all(
    [...new Set(completed.map((a: any) => a.professionalId))].map(async (profId: string) => {
      const profAppointments = completed.filter((c: any) => c.professionalId === profId)
      const revenue = profAppointments.reduce((s: number, c: any) => s + (c.service_price || 0), 0)
      const { data: prof } = await supabase().from('Professional').select('name,commission').eq('id', profId).single()
      return {
        professionalId: profId, professionalName: prof?.name || '',
        totalAppointments: profAppointments.length, revenue,
        commission: prof?.commission || 0,
        commissionValue: revenue * ((prof?.commission || 0) / 100),
      }
    })
  )

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1
  const { count: numProfessionals } = await supabase().from('Professional').select('*', { count: 'exact', head: true }).eq('active', true)

  return {
    totalAppointments: all.length,
    completedCount: completed.length,
    cancelledCount: cancelled.length,
    noShowCount: noShow.length,
    totalRevenue,
    ticketMedio: Math.round(ticketMedio * 100) / 100,
    servicosMaisVendidos,
    horariosMaisProcurados,
    comissaoPorProfissional,
    taxaOcupacao: numProfessionals
      ? Math.round((completed.length / (totalDays * 8 * numProfessionals)) * 10000) / 100
      : 0,
  }
}
