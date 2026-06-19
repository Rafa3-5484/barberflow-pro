import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Client } from '@/types'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get<Client[]>('/clients'),
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => api.get<Client>(`/clients/${id}`),
    enabled: !!id,
  })
}

export function useClientSearch(query: string) {
  return useQuery({
    queryKey: ['clients', 'search', query],
    queryFn: () =>
      api.get<Client[]>(`/clients/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
  })
}
