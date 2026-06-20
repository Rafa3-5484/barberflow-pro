import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return error('Parâmetro date obrigatório')

  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const { data: professionals } = await supabase.from('"Professional"').select('*').eq('active', true)
  if (!professionals) return json([])

  const result = []
  for (const prof of professionals) {
    const { data: appointments } = await supabase.from('"Appointment"')
      .select('*, "Service"(*)')
      .eq('professionalId', prof.id)
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .in('status', ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'])

    result.push({ ...prof, appointments: appointments || [] })
  }

  return json(result)
}
