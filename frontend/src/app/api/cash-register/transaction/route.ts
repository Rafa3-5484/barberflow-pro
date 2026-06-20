import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  try {
    const { cashRegisterId, type, description, amount, paymentMethod } = await req.json()
    if (!cashRegisterId || !type || !description || !amount) return error('Dados obrigatórios')

    const { data: register } = await supabase().from('CashRegister').select('*').eq('barbershopId', barbershopId).eq('id', cashRegisterId).single()
    if (!register) return error('Caixa não encontrado', 404)
    if (register.status === 'CLOSED') return error('Caixa está fechado', 400)

    const { data: transaction, error: txErr } = await supabase().from('Transaction').insert({
      cashRegisterId, type, description, amount, barbershopId, paymentMethod: paymentMethod || null,
    }).select().single()

    if (txErr) return error(txErr.message, 500)

    const isIncome = type === 'INCOME'
    const update: Record<string, unknown> = {
      currentAmount: register.currentAmount + (isIncome ? amount : -amount),
    }
    if (isIncome) {
      update.totalIncome = (register.totalIncome || 0) + amount
    } else {
      update.totalExpense = (register.totalExpense || 0) + amount
    }

    await supabase().from('CashRegister').update(update).eq('barbershopId', barbershopId).eq('id', cashRegisterId)

    return json(transaction, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
