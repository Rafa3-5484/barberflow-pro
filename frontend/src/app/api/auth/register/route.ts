import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, generateTokens, json, error } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json()
    if (!name || !email || !password) return error('Nome, email e senha obrigatórios')

    const { data: existing } = await supabase.from('"User"').select('id').eq('email', email).maybeSingle()
    if (existing) return error('Email já cadastrado', 409)

    const hashed = await hashPassword(password)
    const { data: user, error: dbError } = await supabase.from('"User"').insert({
      name, email, password: hashed, phone: phone || null, role: role || 'BARBER',
    }).select('id,name,email,phone,role').single()

    if (dbError) return error(dbError.message, 500)
    if (!user) return error('Erro ao criar usuário', 500)

    const tokens = generateTokens({ sub: user.id, email: user.email, role: user.role })
    return json({ ...tokens, user }, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
