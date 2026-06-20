import { NextRequest, NextResponse } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data } = await supabase()
    .from('Barbershop')
    .select('*')
    .eq('id', user.barbershopId)
    .single()

  if (!data) return NextResponse.json({ error: 'Barbearia não encontrada' }, { status: 404 })

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, slug, phone, email, address, logo } = body

  const updates: Record<string, any> = {}
  if (name !== undefined) updates.name = name
  if (slug !== undefined) updates.slug = slug
  if (phone !== undefined) updates.phone = phone
  if (email !== undefined) updates.email = email
  if (address !== undefined) updates.address = address
  if (logo !== undefined) updates.logo = logo

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 })
  }

  const { data, error } = await supabase()
    .from('Barbershop')
    .update(updates)
    .eq('id', user.barbershopId)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Este slug já está em uso' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
