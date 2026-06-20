import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { data } = await supabase.from('"CashRegister"')
    .select('*, "User"!operatorId(id,name,email)')
    .order('openedAt', { ascending: false })
  return json(data || [])
}
