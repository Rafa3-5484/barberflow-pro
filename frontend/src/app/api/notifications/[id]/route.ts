import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const { id } = await params

  const { data } = await supabase.from('"Notification"').select('*').eq('id', id).eq('userId', user.sub).maybeSingle()
  if (!data) return error('Notificação não encontrada', 404)
  return json(data)
}
