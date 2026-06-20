import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'
import { generateReport } from '../generate'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  const barbershopId = user.barbershopId

  const today = new Date()
  const todayStart = new Date(today); todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today); todayEnd.setHours(23, 59, 59, 999)

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

  const todayReport = await generateReport(todayStart, todayEnd, barbershopId)
  const monthReport = await generateReport(monthStart, monthEnd, barbershopId)

  const { count: totalClients } = await supabase().from('Client').select('*', { count: 'exact', head: true }).eq('barbershopId', barbershopId)
  const { count: profissionaisAtivos } = await supabase().from('Professional').select('*', { count: 'exact', head: true }).eq('barbershopId', barbershopId).eq('active', true)
  const { count: totalServicos } = await supabase().from('Service').select('*', { count: 'exact', head: true }).eq('barbershopId', barbershopId)
  const { count: proximosAgendamentos } = await supabase().from('Appointment')
    .select('*', { count: 'exact', head: true })
    .eq('barbershopId', barbershopId)
    .gte('date', new Date().toISOString())
    .in('status', ['SCHEDULED', 'CONFIRMED'])

  return json({
    today: todayReport,
    month: monthReport,
    geral: { totalClients: totalClients || 0, profissionaisAtivos: profissionaisAtivos || 0, totalServicos: totalServicos || 0, proximosAgendamentos: proximosAgendamentos || 0 },
  })
}
