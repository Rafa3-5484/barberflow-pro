import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { data: allItems } = await supabase().from('StockItem').select('*').eq('barbershopId', barbershopId)
  const lowStock = (allItems || []).filter((item: any) => item.quantity <= item.minQuantity)

  const thirtyDays = new Date()
  thirtyDays.setDate(thirtyDays.getDate() + 30)
  const { data: expiring } = await supabase().from('StockItem')
    .select('*')
    .eq('barbershopId', barbershopId)
    .not('expiryDate', 'is', null)
    .gte('expiryDate', new Date().toISOString())
    .lte('expiryDate', thirtyDays.toISOString())

  return json({ lowStock, expiring: expiring || [] })
}
