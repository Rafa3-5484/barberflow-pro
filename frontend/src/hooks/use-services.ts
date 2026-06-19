import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Service } from '@/types'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => api.get<Service[]>('/services'),
  })
}
