import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)
  try {
    const { initialAmount } = await req.json()
    if (initialAmount === undefined) return error('Valor inicial obrigatório')

    const { data: open } = await supabase().from('CashRegister').select('id').eq('status', 'OPEN').maybeSingle()
    if (open) return error('Já existe um caixa aberto', 400)

    const { data, error: dbErr } = await supabase().from('CashRegister').insert({
      operatorId: user.sub, initialAmount, currentAmount: initialAmount,
      openedAt: new Date().toISOString(), status: 'OPEN',
    }).select().single()

    if (dbErr) return error(dbErr.message, 500)
    return json(data, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
