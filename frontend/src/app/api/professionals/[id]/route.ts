import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { id } = await params
  const { data } = await supabase().from('Professional').select('*, "Appointment"(*, "Client"(*), "Service"(*))').eq('id', id).maybeSingle()
  if (!data) return error('Profissional não encontrado', 404)
  return json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  const body = await req.json()
  const { id } = await params
  const { data: existing } = await supabase().from('Professional').select('id').eq('id', id).maybeSingle()
  if (!existing) return error('Profissional não encontrado', 404)

  const update: Record<string, unknown> = {}
  if (body.name !== undefined) update.name = body.name
  if (body.photo !== undefined) update.photo = body.photo
  if (body.specialties !== undefined) update.specialties = body.specialties
  if (body.phone !== undefined) update.phone = body.phone
  if (body.email !== undefined) update.email = body.email
  if (body.commission !== undefined) update.commission = body.commission
  if (body.active !== undefined) update.active = body.active
  if (body.userId !== undefined) update.userId = body.userId

  const { data } = await supabase().from('Professional').update(update).eq('id', id).select().single()
  return json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user || user.role !== 'ADMIN') return error('Não autorizado', 403)
  const { id } = await params
  const { data: existing } = await supabase().from('Professional').select('id').eq('id', id).maybeSingle()
  if (!existing) return error('Profissional não encontrado', 404)
  await supabase().from('Professional').delete().eq('id', id)
  return json({ message: 'Profissional removido' })
}
