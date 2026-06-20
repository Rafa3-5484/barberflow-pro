import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { data } = await supabase().from('CashRegister')
    .select('*, "User"!operatorId(id,name,email)')
    .eq('barbershopId', barbershopId)
    .order('openedAt', { ascending: false })
  return json(data || [])
}
