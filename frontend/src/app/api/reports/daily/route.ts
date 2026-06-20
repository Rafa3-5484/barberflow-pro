import { NextRequest } from 'next/server'
import { getUserFromRequest, json, error } from '@/lib/auth'
import { generateReport } from '../generate'

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return error('Não autenticado', 401)
  const barbershopId = user.barbershopId
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const date = new Date(dateStr)

  const start = new Date(date); start.setHours(0, 0, 0, 0)
  const end = new Date(date); end.setHours(23, 59, 59, 999)

  const report = await generateReport(start, end, barbershopId)
  return json(report)
}
