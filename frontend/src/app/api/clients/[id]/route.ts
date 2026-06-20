import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data } = await supabase().from('Client')
    .select('*, "Appointment"(*, "Professional"(*), "Service"(*)), "Rating"(*, "Professional"(*))')
    .eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!data) return error('Cliente não encontrado', 404)
  return json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const body = await req.json()
  const { id } = await params
  const { data: existing } = await supabase().from('Client').select('id').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!existing) return error('Cliente não encontrado', 404)

  if (body.phone) {
    const { data: dup } = await supabase().from('Client').select('id').eq('barbershopId', barbershopId).eq('phone', body.phone).neq('id', id).maybeSingle()
    if (dup) return error('Telefone já em uso', 409)
  }

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.phone !== undefined) update.phone = body.phone
  if (body.email !== undefined) update.email = body.email
  if (body.birthDate !== undefined) update.birthDate = body.birthDate
  if (body.notes !== undefined) update.notes = body.notes

  const { data } = await supabase().from('Client').update(update).eq('barbershopId', barbershopId).eq('id', id).select().single()
  return json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data: existing } = await supabase().from('Client').select('id').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!existing) return error('Cliente não encontrado', 404)
  await supabase().from('Client').delete().eq('barbershopId', barbershopId).eq('id', id)
  return json({ message: 'Cliente removido' })
}
