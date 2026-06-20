import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { data } = await supabase().from('Service').select('*').order('name', { ascending: true })
  return json(data || [])
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user || !['ADMIN', 'MANAGER'].includes(user.role)) return error('Não autorizado', 403)
  try {
    const body = await req.json()
    if (!body.name) return error('Nome obrigatório')
    const { data, error: dbErr } = await supabase().from('Service').insert({
      name: body.name, description: body.description || null,
      price: body.price, duration: body.duration,
    }).select().single()
    if (dbErr) return error(dbErr.message, 500)
    return json(data, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
