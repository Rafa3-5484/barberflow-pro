import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data } = await supabase().from('Service').select('*').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!data) return error('Serviço não encontrado', 404)
  return json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  const barbershopId = user.barbershopId
  const body = await req.json()
  const { id } = await params
  const { data: existing } = await supabase().from('Service').select('id').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!existing) return error('Serviço não encontrado', 404)

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.description !== undefined) update.description = body.description
  if (body.price !== undefined) update.price = body.price
  if (body.duration !== undefined) update.duration = body.duration
  if (body.active !== undefined) update.active = body.active

  const { data } = await supabase().from('Service').update(update).eq('barbershopId', barbershopId).eq('id', id).select().single()
  return json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user || user.role !== 'ADMIN') return error('Não autorizado', 403)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data: existing } = await supabase().from('Service').select('id').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!existing) return error('Serviço não encontrado', 404)
  await supabase().from('Service').delete().eq('barbershopId', barbershopId).eq('id', id)
  return json({ message: 'Serviço removido' })
}
