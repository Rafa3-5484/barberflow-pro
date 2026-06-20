import { NextRequest } from 'next/server'
import { requireSupabase as supabase } from '@/lib/supabase'
import { hashPassword, generateTokens, json, error } from '@/lib/auth'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { barbershopName, barbershopSlug, barbershopPhone, barbershopEmail, barbershopAddress, name, email, password, phone } = await req.json()

    if (!barbershopName || !barbershopSlug || !name || !email || !password)
      return error('Nome da barbearia, slug, nome, email e senha são obrigatórios')

    if (!/^[a-z0-9-]+$/.test(barbershopSlug))
      return error('Slug deve conter apenas letras minúsculas, números e hífens')

    const { data: existingSlug } = await supabase().from('Barbershop').select('id').eq('slug', barbershopSlug).maybeSingle()
    if (existingSlug) return error('Slug já está em uso', 409)

    const { data: existingEmail } = await supabase().from('User').select('id').eq('email', email).maybeSingle()
    if (existingEmail) return error('Email já cadastrado', 409)

    const barbershopId = randomUUID()
    const userId = randomUUID()
    const hashed = await hashPassword(password)

    const { error: bsError } = await supabase().from('Barbershop').insert({
      id: barbershopId, name: barbershopName, slug: barbershopSlug,
      phone: barbershopPhone || null, email: barbershopEmail || null,
      address: barbershopAddress || null, active: true,
    })

    if (bsError) return error(bsError.message, 500)

    const now = new Date().toISOString()
    const { data: user, error: uError } = await supabase().from('User').insert({
      id: userId, name, email, password: hashed, phone: phone || null,
      role: 'ADMIN', barbershopId, active: true, updatedAt: now, createdAt: now,
    }).select('id,name,email,phone,role,barbershopId').single()

    if (uError) {
      await supabase().from('Barbershop').delete().eq('id', barbershopId)
      return error(uError.message, 500)
    }

    const tokens = generateTokens({ sub: user.id, email: user.email, role: user.role, barbershopId: user.barbershopId })
    return json({ ...tokens, user, barbershop: { id: barbershopId, name: barbershopName, slug: barbershopSlug } }, 201)
  } catch (e) {
    return error(e instanceof Error ? e.message : 'Erro interno', 500)
  }
}
