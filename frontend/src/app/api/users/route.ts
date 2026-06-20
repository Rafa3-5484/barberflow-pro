import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { hashPassword, getUserFromRequest, json, error } from '@/lib/auth'

const ADMIN = ['ADMIN']
const ADM_MGR = ['ADMIN', 'MANAGER']

function checkRole(payload: { role: string } | null, roles: string[]) {
  if (!payload) return false
  return roles.includes(payload.role)
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!checkRole(user, ADM_MGR)) return error('Não autorizado', 403)
  const { data } = await supabase().from('User').select('id,name,email,phone,role,active,createdAt').order('createdAt', { ascending: false })
  return json(data || [])
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!checkRole(user, ADMIN)) return error('Não autorizado', 403)
  try {
    const { name, email, password, phone, role } = await req.json()
    if (!name || !email || !password) return error('Nome, email e senha obrigatórios')

    const { data: existing } = await supabase().from('User').select('id').eq('email', email).maybeSingle()
    if (existing) return error('Email já cadastrado', 409)

    const hashed = await hashPassword(password)
    const { data: created, error: dbErr } = await supabase().from('User').insert({
      name, email, password: hashed, phone: phone || null, role: role || 'BARBER',
    }).select('id,name,email,phone,role,active,createdAt').single()

    if (dbErr) return error(dbErr.message, 500)
    return json(created, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
