import { requireSupabase as supabase } from '@/lib/supabase'
import { json, error } from '@/lib/auth'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: barbershop } = await supabase().from('Barbershop').select('id,name,slug,phone,email,address,logo').eq('slug', slug).eq('active', true).maybeSingle()
  if (!barbershop) return error('Barbearia não encontrada', 404)

  const { data: services } = await supabase().from('Service').select('*').eq('barbershopId', barbershop.id).eq('active', true).order('name')
  const { data: professionals } = await supabase().from('Professional').select('*').eq('barbershopId', barbershop.id).eq('active', true).order('name')

  return json({ ...barbershop, services, professionals })
}
