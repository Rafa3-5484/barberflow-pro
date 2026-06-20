import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { id } = await params
  const { data } = await supabase().from('Appointment')
    .select('*, "Client"(*), "Professional"(*), "Service"(*)')
    .eq('id', id).maybeSingle()
  if (!data) return error('Agendamento não encontrado', 404)
  return json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUserFromRequest(req)) return error('Não autenticado', 401)
  const body = await req.json()
  const { id } = await params
  const { data: existing } = await supabase().from('Appointment').select('id').eq('id', id).maybeSingle()
  if (!existing) return error('Agendamento não encontrado', 404)

  const update: Record<string, unknown> = {}
  if (body.date !== undefined) update.date = body.date
  if (body.clientId !== undefined) update.clientId = body.clientId
  if (body.professionalId !== undefined) update.professionalId = body.professionalId
  if (body.serviceId !== undefined) update.serviceId = body.serviceId
  if (body.notes !== undefined) update.notes = body.notes
  if (body.status !== undefined) update.status = body.status

  const { data } = await supabase().from('Appointment').update(update).eq('id', id)
    .select('*, "Client"(*), "Professional"(*), "Service"(*)').single()
  return json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { id } = await params
  const { data: existing } = await supabase().from('Appointment').select('id').eq('id', id).maybeSingle()
  if (!existing) return error('Agendamento não encontrado', 404)
  await supabase().from('Appointment').delete().eq('id', id)
  return json({ message: 'Agendamento removido' })
}
