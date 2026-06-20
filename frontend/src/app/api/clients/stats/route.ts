import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { count: total } = await supabase.from('"Client"').select('*', { count: 'exact', head: true })
  const { count: active } = await supabase.from('"Client"').select('*', { count: 'exact', head: true }).gt('totalVisits', 0)
  const { data: spent } = await supabase.from('"Client"').select('totalSpent')
  const totalSpent = spent?.reduce((sum, c) => sum + (c.totalSpent || 0), 0) || 0
  return json({ total: total || 0, active: active || 0, totalSpent })
}
