import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

const VALID_TRANSITIONS: Record<string, string[]> = {
  SCHEDULED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!getUserFromRequest(req)) return error('Não autenticado', 401)
  try {
    const { status } = await req.json()
    if (!status) return error('Status obrigatório')
    const { id } = await params

    const { data: appointment } = await supabase().from('Appointment')
      .select('*, "Service"(*)').eq('id', id).maybeSingle()
    if (!appointment) return error('Agendamento não encontrado', 404)

    const allowed = VALID_TRANSITIONS[appointment.status]
    if (!allowed?.includes(status)) {
      return error(`Transição inválida de ${appointment.status} para ${status}`, 400)
    }

    const { data: updated } = await supabase().from('Appointment').update({ status }).eq('id', id)
      .select('*, "Client"(*), "Professional"(*), "Service"(*)').single()

    if (status === 'COMPLETED') {
      await supabase().from('Client').update({
        totalVisits: (appointment.client_totalVisits || 0) + 1,
        totalSpent: (appointment.client_totalSpent || 0) + (appointment.service_price || 0),
        lastVisit: new Date().toISOString(),
      }).eq('id', appointment.clientId)
    }

    return json(updated)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
