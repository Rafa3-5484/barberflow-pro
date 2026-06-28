'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Client, PaginatedResponse } from '@serviceflow/shared';

interface ClientFilters {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
}

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Client>>('/clients', { params: filters });
      return response.data;
    },
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const response = await api.get<{ data: Client }>(`/clients/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Client>) => {
      const response = await api.post<{ data: Client }>('/clients', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Client> }) => {
      const response = await api.put<{ data: Client }>(`/clients/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', variables.id] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useClientTimeline(id: string) {
  return useQuery({
    queryKey: ['client-timeline', id],
    queryFn: async () => {
      const response = await api.get(`/clients/${id}/timeline`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
