import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { comparePassword, generateTokens, json, error } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return error('Email e senha obrigatórios')

    const { data: user } = await supabase().from('User').select('*').eq('email', email).maybeSingle()
    if (!user) return error('Credenciais inválidas', 401)

    const valid = await comparePassword(password, user.password)
    if (!valid) return error('Credenciais inválidas', 401)

    if (!user.active) return error('Usuário desativado', 401)

    const tokens = generateTokens({ sub: user.id, email: user.email, role: user.role, barbershopId: user.barbershopId })
    return json({ ...tokens, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, barbershopId: user.barbershopId } })
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
