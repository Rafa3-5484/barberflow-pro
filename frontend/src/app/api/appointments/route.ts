import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest, json, error } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  if (!getUserFromRequest(_req)) return error('Não autenticado', 401)
  const { data } = await supabase.from('"Appointment"')
    .select('*, "Client"(*), "Professional"(*), "Service"(*)')
    .order('date', { ascending: false })
  return json(data || [])
}

export async function POST(req: NextRequest) {
  if (!getUserFromRequest(req)) return error('Não autenticado', 401)
  try {
    const body = await req.json()
    let clientId = body.clientId

    if (!clientId) {
      if (!body.clientName || !body.clientPhone) return error('Nome e telefone do cliente obrigatórios')
      const { data: existingClient } = await supabase.from('"Client"').select('id').eq('phone', body.clientPhone).maybeSingle()
      if (existingClient) {
        clientId = existingClient.id
      } else {
        const { data: newClient, error: createErr } = await supabase.from('"Client"').insert({
          name: body.clientName, phone: body.clientPhone, email: body.clientEmail || null,
        }).select('id').single()
        if (createErr) return error(createErr.message, 500)
        clientId = newClient!.id
      }
    }

    const { data, error: dbErr } = await supabase.from('"Appointment"').insert({
      clientId, professionalId: body.professionalId, serviceId: body.serviceId,
      date: body.date, notes: body.notes || null, status: body.status || 'SCHEDULED',
    }).select('*, "Client"(*), "Professional"(*), "Service"(*)').single()

    if (dbErr) return error(dbErr.message, 500)
    return json(data, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
