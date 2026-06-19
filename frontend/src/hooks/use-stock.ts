import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { StockItem } from '@/types'

interface StockAlerts {
  lowStock: StockItem[]
  expiring: StockItem[]
}

export function useStockItems() {
  return useQuery({
    queryKey: ['stock'],
    queryFn: () => api.get<StockItem[]>('/stock'),
  })
}

export function useStockAlerts() {
  return useQuery({
    queryKey: ['stock', 'alerts'],
    queryFn: () => api.get<StockAlerts>('/stock/alerts'),
    refetchInterval: 60000,
  })
}
