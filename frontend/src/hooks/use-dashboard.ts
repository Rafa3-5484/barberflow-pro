import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardKPIs } from '@/types'
import { format } from 'date-fns'

export function useDashboardKPIs() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: () => api.get<DashboardKPIs>('/reports/dashboard'),
    refetchInterval: 60000,
  })
}

export function useDailyReport(date?: string) {
  const queryDate = date || format(new Date(), 'yyyy-MM-dd')
  return useQuery({
    queryKey: ['dashboard', 'daily-report', queryDate],
    queryFn: () =>
      api.get<{
        appointments: {
          total: number
          completed: number
          cancelled: number
          noShow: number
        }
        revenue: { total: number; byProfessional: { name: string; value: number }[] }
        services: { name: string; count: number; revenue: number }[]
      }>(`/reports/daily?date=${queryDate}`),
  })
}
