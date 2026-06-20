import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { data: allItems } = await supabase.from('"StockItem"').select('*')
  const lowStock = (allItems || []).filter(item => item.quantity <= item.minQuantity)

  const thirtyDays = new Date()
  thirtyDays.setDate(thirtyDays.getDate() + 30)
  const { data: expiring } = await supabase.from('"StockItem"')
    .select('*')
    .not('expiryDate', 'is', null)
    .gte('expiryDate', new Date().toISOString())
    .lte('expiryDate', thirtyDays.toISOString())

  return json({ lowStock, expiring: expiring || [] })
}
