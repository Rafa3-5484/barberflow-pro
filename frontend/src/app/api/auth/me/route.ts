import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req)
  if (!payload) return error('Não autenticado', 401)

  const { data: user } = await supabase().from('User').select('id,name,email,phone,role,active,avatar,barbershopId,createdAt').eq('id', payload.sub).maybeSingle()
  if (!user) return error('Usuário não encontrado', 404)

  const { data: barbershop } = await supabase().from('Barbershop').select('id,name,slug,logo').eq('id', user.barbershopId).single()

  return json({ ...user, barbershop })
}
