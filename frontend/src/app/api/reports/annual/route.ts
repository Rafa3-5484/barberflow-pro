import { NextRequest } from 'next/server'
import { getUserFromRequest, json, error } from '@/lib/auth'
import { generateReport } from '../generate'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()))

  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31, 23, 59, 59, 999)

  const report = await generateReport(start, end, barbershopId)
  return json(report)
}
