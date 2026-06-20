import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { id } = await params
  const { data } = await supabase().from('Appointment')
    .select('*, "Client"(*), "Professional"(*), "Service"(*)')
    .eq('barbershopId', barbershopId)
    .eq('professionalId', id)
    .order('date', { ascending: false })
  return json(data || [])
}
