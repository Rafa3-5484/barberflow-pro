import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  const user = getUserFromRequest(_req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { data } = await supabase().from('Appointment')
    .select('*, "Client"(*), "Professional"(*), "Service"(*)')
    .eq('barbershopId', barbershopId)
    .order('date', { ascending: false })
  return json(data || [])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let barbershopId = body.barbershopId
    const user = getUserFromRequest(req)
    if (user) {
      barbershopId = user.barbershopId
    } else if (!barbershopId) {
      return error('barbershopId é obrigatório para agendamento público', 400)
    }

    let clientId = body.clientId

    if (!clientId) {
      if (!body.clientName || !body.clientPhone) return error('Nome e telefone do cliente obrigatórios')
      const { data: existingClient } = await supabase().from('Client').select('id').eq('phone', body.clientPhone).maybeSingle()
      if (existingClient) {
        clientId = existingClient.id
      } else {
        const { data: newClient, error: createErr } = await supabase().from('Client').insert({
          name: body.clientName, phone: body.clientPhone, email: body.clientEmail || null, barbershopId,
        }).select('id').single()
        if (createErr) return error(createErr.message, 500)
        clientId = newClient!.id
      }
    }

    const { data, error: dbErr } = await supabase().from('Appointment').insert({
      clientId, professionalId: body.professionalId, serviceId: body.serviceId,
      date: body.date, notes: body.notes || null, status: body.status || 'SCHEDULED', barbershopId,
    }).select('*, "Client"(*), "Professional"(*), "Service"(*)').single()

    if (dbErr) return error(dbErr.message, 500)
    return json(data, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
