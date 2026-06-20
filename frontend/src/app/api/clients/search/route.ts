import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(req: NextRequest) {
  if (!getUserFromRequest(req)) return error('Não autenticado', 401)
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  const { data } = await supabase().from('Client').select('*')
    .or(`name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`)
    .order('name', { ascending: true })
  return json(data || [])
}
