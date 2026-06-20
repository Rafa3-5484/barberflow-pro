import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'
import { generateReport } from '../generate'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)

  const today = new Date()
  const todayStart = new Date(today); todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today); todayEnd.setHours(23, 59, 59, 999)

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

  const todayReport = await generateReport(todayStart, todayEnd)
  const monthReport = await generateReport(monthStart, monthEnd)

  const { count: totalClients } = await supabase().from('Client').select('*', { count: 'exact', head: true })
  const { count: profissionaisAtivos } = await supabase().from('Professional').select('*', { count: 'exact', head: true }).eq('active', true)
  const { count: totalServicos } = await supabase().from('Service').select('*', { count: 'exact', head: true })
  const { count: proximosAgendamentos } = await supabase().from('Appointment')
    .select('*', { count: 'exact', head: true })
    .gte('date', new Date().toISOString())
    .in('status', ['SCHEDULED', 'CONFIRMED'])

  return json({
    today: todayReport,
    month: monthReport,
    geral: { totalClients: totalClients || 0, profissionaisAtivos: profissionaisAtivos || 0, totalServicos: totalServicos || 0, proximosAgendamentos: proximosAgendamentos || 0 },
  })
}
