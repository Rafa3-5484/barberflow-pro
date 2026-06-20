import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  if (!getUserFromRequest(req)) return error('Não autenticado', 401)
  const { date: dateStr } = await params
  const startOfDay = new Date(dateStr)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(dateStr)
  endOfDay.setHours(23, 59, 59, 999)

  const { data } = await supabase.from('"Appointment"')
    .select('*, "Client"(*), "Professional"(*), "Service"(*)')
    .gte('date', startOfDay.toISOString())
    .lte('date', endOfDay.toISOString())
    .order('date', { ascending: true })
  return json(data || [])
}
