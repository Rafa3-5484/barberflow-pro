import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

const ADMIN = ['ADMIN']

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data } = await supabase().from('User').select('id,name,email,phone,role,active,createdAt').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!data) return error('Usuário não encontrado', 404)
  return json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)
  if (!user?.role || !ADMIN.includes(user.role)) return error('Não autorizado', 403)
  const barbershopId = user.barbershopId
  try {
    const body = await req.json()
    const { name, email, phone, role, active } = body
    const { id } = await params
    if (email) {
      const { data: existing } = await supabase().from('User').select('id').eq('barbershopId', barbershopId).eq('email', email).neq('id', id).maybeSingle()
      if (existing) return error('Email já em uso', 409)
    }
    const update: Record<string, unknown> = {}
    if (name !== undefined) update.name = name
    if (email !== undefined) update.email = email
    if (phone !== undefined) update.phone = phone
    if (role !== undefined) update.role = role
    if (active !== undefined) update.active = active
    const { data } = await supabase().from('User').update(update).eq('barbershopId', barbershopId).eq('id', id).select('id,name,email,phone,role,active,createdAt').single()
    return json(data)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user?.role || !ADMIN.includes(user.role)) return error('Não autorizado', 403)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data } = await supabase().from('User').select('id').eq('barbershopId', barbershopId).eq('id', id).maybeSingle()
  if (!data) return error('Usuário não encontrado', 404)
  await supabase().from('User').delete().eq('barbershopId', barbershopId).eq('id', id)
  return json({ message: 'Usuário removido' })
}
