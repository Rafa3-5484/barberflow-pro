import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function POST(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)

  await supabase.from('"Notification"').update({ readAt: new Date().toISOString() }).eq('userId', user.sub).is('readAt', null)
  return json({ message: 'Todas as notificações marcadas como lidas' })
}
