import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Professional } from '@/types'

export function useProfessionals() {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: () => api.get<Professional[]>('/professionals'),
  })
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ['professional', id],
    queryFn: () => api.get<Professional>(`/professionals/${id}`),
    enabled: !!id,
  })
}

export function useAvailableProfessionals(date: string) {
  return useQuery({
    queryKey: ['professionals', 'available', date],
    queryFn: () =>
      api.get<Professional[]>(`/professionals/available?date=${date}`),
    enabled: !!date,
  })
}
