import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { id } = await params
  const { data } = await supabase.from('"StockItem"').select('*').eq('id', id).maybeSingle()
  if (!data) return error('Item não encontrado', 404)
  return json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  const body = await req.json()
  const { id } = await params
  const { data: existing } = await supabase.from('"StockItem"').select('id').eq('id', id).maybeSingle()
  if (!existing) return error('Item não encontrado', 404)

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.description !== undefined) update.description = body.description
  if (body.quantity !== undefined) update.quantity = body.quantity
  if (body.minQuantity !== undefined) update.minQuantity = body.minQuantity
  if (body.price !== undefined) update.price = body.price
  if (body.unit !== undefined) update.unit = body.unit
  if (body.expiryDate !== undefined) update.expiryDate = body.expiryDate
  if (body.category !== undefined) update.category = body.category

  const { data } = await supabase.from('"StockItem"').update(update).eq('id', id).select().single()
  return json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user || user.role !== 'ADMIN') return error('Não autorizado', 403)
  const { id } = await params
  await supabase.from('"StockItem"').delete().eq('id', id)
  return json({ message: 'Item removido' })
}
