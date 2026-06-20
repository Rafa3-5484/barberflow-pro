import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)

  const { count } = await supabase.from('"Notification"')
    .select('*', { count: 'exact', head: true })
    .eq('userId', user.sub)
    .is('readAt', null)

  return json({ count: count || 0 })
}
