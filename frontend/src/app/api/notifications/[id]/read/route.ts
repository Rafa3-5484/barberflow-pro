import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { id } = await params

  const { data } = await supabase().from('Notification').update({ readAt: new Date().toISOString() }).eq('barbershopId', barbershopId).eq('id', id).eq('userId', user.sub).select().single()
  if (!data) return error('Notificação não encontrada', 404)
  return json(data)
}
