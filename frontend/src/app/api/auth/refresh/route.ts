import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { verifyRefreshToken, generateTokens, json, error } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json()
    if (!refreshToken) return error('Refresh token obrigatório')

    const payload = verifyRefreshToken(refreshToken)
    if (!payload) return error('Token inválido', 401)

    const { data: user } = await supabase().from('User').select('id,name,email,phone,role').eq('id', payload.sub).maybeSingle()
    if (!user) return error('Usuário não encontrado', 401)

    const tokens = generateTokens({ sub: user.id, email: user.email, role: user.role })
    return json({ ...tokens, user })
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
