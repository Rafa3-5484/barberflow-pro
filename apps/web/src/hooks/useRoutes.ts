'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Route } from '@serviceflow/shared';

export function useRoutes(params?: { date?: string; userId?: string }) {
  return useQuery({
    queryKey: ['routes', params],
    queryFn: async () => {
      const response = await api.get<{ data: Route[] }>('/routes', { params });
      return response.data.data;
    },
  });
}

export function useRoute(id: string) {
  return useQuery({
    queryKey: ['route', id],
    queryFn: async () => {
      const response = await api.get<{ data: Route }>(`/routes/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { date: string; userId?: string }) => {
      const response = await api.post<{ data: Route }>('/routes', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useOptimizeRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{ data: Route }>(`/routes/${id}/optimize`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
