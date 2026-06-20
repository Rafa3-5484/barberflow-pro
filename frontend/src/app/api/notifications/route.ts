import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: Request) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)

  const { data } = await supabase.from('"Notification"')
    .select('*')
    .eq('userId', user.sub)
    .order('createdAt', { ascending: false })

  return json(data || [])
}
