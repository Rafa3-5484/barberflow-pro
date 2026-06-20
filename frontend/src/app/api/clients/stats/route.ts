import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { count: total } = await supabase().from('Client').select('*', { count: 'exact', head: true }).eq('barbershopId', barbershopId)
  const { count: active } = await supabase().from('Client').select('*', { count: 'exact', head: true }).eq('barbershopId', barbershopId).gt('totalVisits', 0)
  const { data: spent } = await supabase().from('Client').select('totalSpent').eq('barbershopId', barbershopId)
  const totalSpent = spent?.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0) || 0
  return json({ total: total || 0, active: active || 0, totalSpent })
}
