import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  const { data } = await supabase().from('Client').select('*')
    .eq('barbershopId', barbershopId)
    .or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`)
    .order('name', { ascending: true })
  return json(data || [])
}
