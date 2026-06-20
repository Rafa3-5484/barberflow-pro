import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { data } = await supabase.from('"Client"').select('*').order('createdAt', { ascending: false })
  return json(data || [])
}

export async function POST(req: NextRequest) {
  if (!getUserFromRequest(req)) return error('Não autenticado', 401)
  try {
    const body = await req.json()
    if (!body.name || !body.phone) return error('Nome e telefone obrigatórios')

    const { data: existing } = await supabase.from('"Client"').select('id').eq('phone', body.phone).maybeSingle()
    if (existing) return error('Telefone já cadastrado', 409)

    const { data, error: dbErr } = await supabase.from('"Client"').insert({
      name: body.name, phone: body.phone, email: body.email || null,
      birthDate: body.birthDate || null, notes: body.notes || null,
    }).select().single()

    if (dbErr) return error(dbErr.message, 500)
    return json(data, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
