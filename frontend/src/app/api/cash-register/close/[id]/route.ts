import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data: register } = await supabase().from('CashRegister').select('*').eq('barbershopId', barbershopId).eq('id', id).single()
  if (!register) return error('Caixa não encontrado', 404)
  if (register.status === 'CLOSED') return error('Caixa já está fechado', 400)

  const { data } = await supabase().from('CashRegister').update({
    status: 'CLOSED', closedAt: new Date().toISOString(),
  }).eq('barbershopId', barbershopId).eq('id', id).select().single()

  return json(data)
}
