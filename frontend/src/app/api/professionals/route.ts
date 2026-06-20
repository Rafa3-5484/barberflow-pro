import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const { data } = await supabase().from('Professional').select('*, "User"(id,name,email)').order('name', { ascending: true })
  return json(data || [])
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  try {
    const body = await req.json()
    const { data, error: dbErr } = await supabase().from('Professional').insert({
      name: body.name, photo: body.photo || null, specialties: body.specialties || [],
      phone: body.phone, email: body.email || null, commission: body.commission ?? 0,
      userId: body.userId || null,
    }).select().single()
    if (dbErr) return error(dbErr.message, 500)
    return json(data, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
